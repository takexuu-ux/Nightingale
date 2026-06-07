// NNL ONE Web Client App Logic

// Helper to generate a UUID for device ID tracking
function getOrCreateDeviceId() {
  let deviceId = localStorage.getItem('nnl_device_id');
  if (!deviceId) {
    // Generate a simple v4 UUID
    deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    localStorage.setItem('nnl_device_id', deviceId);
  }
  return deviceId;
}

// UI Elements
const authAlertContainer = document.getElementById('auth-alert-container');
const dashboardAlertContainer = document.getElementById('dashboard-alert-container');
const authScreen = document.getElementById('auth-screen');
const phoneStep = document.getElementById('phone-step');
const otpStep = document.getElementById('otp-step');
const phoneForm = document.getElementById('phone-form');
const otpForm = document.getElementById('otp-form');
const phoneInput = document.getElementById('phone-input');
const otpInput = document.getElementById('otp-input');
const classroomDashboard = document.getElementById('classroom-dashboard');
const appHeader = document.getElementById('app-header');
const userPhone = document.getElementById('user-phone');
const userAvatar = document.getElementById('user-avatar');
const logoutBtn = document.getElementById('logout-btn');
const classListContainer = document.getElementById('class-list-container');
const dashboardLoader = document.getElementById('dashboard-loader');
const tabLive = document.getElementById('tab-live');
const tabUpcoming = document.getElementById('tab-upcoming');
const tabRecordings = document.getElementById('tab-recordings');
const tabAllVideos = document.getElementById('btn-all-videos');
const refetchBtn = document.getElementById('refetch-btn');

// Embedded Live Classroom Elements
const classroomViewer = document.getElementById('classroom-viewer');
const closeClassroomBtn = document.getElementById('close-classroom-btn');
const classroomTitle = document.getElementById('classroom-title');
const classroomInstructor = document.getElementById('classroom-instructor');
const toggleChatBtn = document.getElementById('toggle-chat-btn');
const toggleParticipantsBtn = document.getElementById('toggle-participants-btn');
const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
const closeSidebarBtn = document.getElementById('close-sidebar-btn');
const manualCaptureBtn = document.getElementById('manual-capture-btn');
const timelineList = document.getElementById('timeline-list');
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTime = document.getElementById('lightbox-time');
const closeLightbox = document.getElementById('close-lightbox');
const downloadSlideBtn = document.getElementById('download-slide-btn');
const liveNowSection = document.getElementById('live-now-section');
const liveNowContainer = document.getElementById('live-now-container');
const classroomIframe = document.getElementById('classroom-iframe');

// New Rewind & Timeline Navigation UI Elements
const rewindOverlay = document.getElementById('rewind-overlay');
const rewindImg = document.getElementById('rewind-img');
const rewindTimestamp = document.getElementById('rewind-timestamp');
const rewindRelativeTime = document.getElementById('rewind-relative-time');
const liveIndicatorBtn = document.getElementById('live-indicator-btn');
const timelineSlider = document.getElementById('timeline-slider');
const timelineSliderTime = document.getElementById('timeline-slider-time');
const rewindPrevBtn = document.getElementById('rewind-prev-btn');
const rewindNextBtn = document.getElementById('rewind-next-btn');
const headerRewindPrevBtn = document.getElementById('header-rewind-prev-btn');
const headerRewindNextBtn = document.getElementById('header-rewind-next-btn');
const bottomFullscreenBtn = document.getElementById('bottom-fullscreen-btn');
const clearTimelineBtn = document.getElementById('clear-timeline-btn');

// State Variables
let flowToken = ''; // Returned by send OTP, needed for validate OTP
let activeTab = 'live'; // 'live', 'upcoming', or 'recordings'
let classesData = [];
let zoomClient = null;
let captureIntervalId = null;
let currentTimelineSlides = [];
let currentMeetingId = ''; // Traces current meeting room ID
let currentSelectedSlideTimestamp = null; // Traces selected slide in rewind mode
let inRewindMode = false; // Flag to trace if user is looking at historic slide
let relativeTimeInterval = null; // Interval to update slide age, e.g. "5m ago"
let currentVolume = parseInt(localStorage.getItem('nnl_classroom_volume') || '80', 10);
let barsHideTimerId = null; // Timer ID for auto-hiding classroom bars on inactivity

// IndexedDB setup for slide persistence
const dbPromise = new Promise((resolve) => {
  const request = indexedDB.open('nnl_classroom_db', 1);
  request.onupgradeneeded = (e) => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains('slides')) {
      const store = db.createObjectStore('slides', { keyPath: 'id' });
      store.createIndex('meetingId', 'meetingId', { unique: false });
    }
  };
  request.onsuccess = (e) => resolve(e.target.result);
  request.onerror = (e) => {
    console.error('IndexedDB failed to initialize:', e.target.error);
    resolve(null);
  };
});

async function saveSlideToDb(meetingId, timestamp, timeStr, imgSrc) {
  try {
    const db = await dbPromise;
    if (!db) return;
    const tx = db.transaction('slides', 'readwrite');
    const store = tx.objectStore('slides');
    const id = `${meetingId}_${timestamp}`;
    await new Promise((resolve, reject) => {
      const req = store.put({ id, meetingId, timestamp, timeStr, imgSrc });
      req.onsuccess = resolve;
      req.onerror = reject;
    });
    await pruneOldSlides(meetingId);
  } catch (e) {
    console.error('Error saving slide to DB:', e);
  }
}

async function loadSlidesFromDb(meetingId) {
  try {
    const db = await dbPromise;
    if (!db) return [];
    const tx = db.transaction('slides', 'readonly');
    const store = tx.objectStore('slides');
    const index = store.index('meetingId');
    const request = index.getAll(IDBKeyRange.only(meetingId));
    const records = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    // Sort descending (newest first) to match currentTimelineSlides memory layout
    records.sort((a, b) => b.timestamp - a.timestamp);
    return records.map(r => ({
      time: r.timeStr,
      timestamp: r.timestamp,
      imgSrc: r.imgSrc
    }));
  } catch (e) {
    console.error('Error loading slides from DB:', e);
    return [];
  }
}

async function pruneOldSlides(meetingId) {
  try {
    const db = await dbPromise;
    if (!db) return;
    const tx = db.transaction('slides', 'readonly');
    const store = tx.objectStore('slides');
    const index = store.index('meetingId');
    const request = index.getAll(IDBKeyRange.only(meetingId));
    const records = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    // Keep last 30 slides (exactly 5 minutes of class slides at 10s capture frequency)
    if (records.length > 30) {
      records.sort((a, b) => a.timestamp - b.timestamp);
      const toDelete = records.slice(0, records.length - 30);
      const deleteTx = db.transaction('slides', 'readwrite');
      const deleteStore = deleteTx.objectStore('slides');
      for (const rec of toDelete) {
        deleteStore.delete(rec.id);
      }
    }
  } catch (e) {
    console.error('Error pruning old slides:', e);
  }
}


// Helper to extract a clear, human-readable error string from backend response objects or nested data structures
function extractErrorMessage(data, defaultMsg = 'An error occurred. Please try again.') {
  if (!data) return defaultMsg;
  
  function parseVal(val) {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (Array.isArray(val)) {
      return val.map(v => parseVal(v)).filter(Boolean).join(', ');
    }
    if (typeof val === 'object') {
      if (val.message) return parseVal(val.message);
      if (val.detail) return parseVal(val.detail);
      if (val.error) return parseVal(val.error);
      
      return Object.entries(val)
        .map(([key, v]) => {
          const inner = parseVal(v);
          return inner ? `${key}: ${inner}` : '';
        })
        .filter(Boolean)
        .join(', ');
    }
    return String(val);
  }

  // Check if there are field-specific errors first (common in NNL ONE validation responses)
  const fields = data.fields || data.error?.fields || data.errors?.fields;
  if (fields && Array.isArray(fields)) {
    const fieldMsgs = fields.map(f => {
      const fieldName = f.field || f.name || '';
      const m = parseVal(f.message || f.msg || f.error);
      return fieldName && m ? `${fieldName}: ${m}` : m;
    }).filter(Boolean);
    if (fieldMsgs.length > 0) {
      return fieldMsgs.join(', ');
    }
  }

  const candidates = [data.message, data.detail, data.error, data.errors];
  for (const cand of candidates) {
    if (cand) {
      const parsed = parseVal(cand);
      if (parsed) return parsed;
    }
  }

  if (typeof data === 'string') return data;

  const parsedObj = parseVal(data);
  if (parsedObj) return parsedObj;

  return defaultMsg;
}

// Show Alert feedback
function showAlert(message, type = 'error') {
  let displayMessage = message;
  if (message && typeof message === 'object') {
    if (message instanceof Error) {
      displayMessage = message.message;
    } else {
      displayMessage = JSON.stringify(message);
    }
  }

  if (displayMessage === '[object Object]') {
    displayMessage = 'An unexpected error occurred. Please try again.';
  }

  const targetAlertContainer = classroomDashboard.classList.contains('hide') 
    ? authAlertContainer 
    : dashboardAlertContainer;
    
  if (targetAlertContainer) {
    targetAlertContainer.innerHTML = `
      <div class="alert alert-${type}">
        <span>${displayMessage}</span>
      </div>
    `;
    targetAlertContainer.classList.remove('hide');
    // Scroll alert into view
    targetAlertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function clearAlert() {
  if (authAlertContainer) {
    authAlertContainer.innerHTML = '';
    authAlertContainer.classList.add('hide');
  }
  if (dashboardAlertContainer) {
    dashboardAlertContainer.innerHTML = '';
    dashboardAlertContainer.classList.add('hide');
  }
}

// Check if user is already logged in
function checkLoginState() {
  const token = localStorage.getItem('nnl_access_token');
  const savedPhone = localStorage.getItem('nnl_phone');
  const cyberHero = document.getElementById('cyber-hero');

  // Pre-fill phone field if they have logged in before
  if (savedPhone && phoneInput && savedPhone !== 'Guest User' && !isNaN(savedPhone.replace(/\s+/g, ''))) {
    phoneInput.value = savedPhone;
  } else if (phoneInput) {
    phoneInput.value = '';
  }

  if (token) {
    // Transition UI to logged-in state
    authScreen.classList.add('hide');
    appHeader.classList.remove('hide');
    classroomDashboard.classList.remove('hide');
    if (cyberHero) cyberHero.classList.add('hide');

    // Update profile info
    const displayName = token === 'GUEST_DEMO_TOKEN' ? 'Guest Student' : (savedPhone || 'Student');
    userPhone.textContent = displayName;
    userAvatar.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    `;

    loadDashboard();
  } else {
    // Show login screen
    authScreen.classList.remove('hide');
    appHeader.classList.add('hide');
    classroomDashboard.classList.add('hide');
    if (cyberHero) cyberHero.classList.remove('hide');
  }
}

// Format date nicely
function formatClassTime(dateStr, timeStr) {
  try {
    // Expecting date like "2026-06-07" and time like "10:30:00"
    const dateObj = new Date(`${dateStr}T${timeStr}`);
    if (isNaN(dateObj.getTime())) return `${dateStr} ${timeStr}`;
    
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return `${dateStr} ${timeStr}`;
  }
}

// Helper to extract the Zoom appKey (SDK Key) from the JWT signature token
function extractSdkKey(jwtToken) {
  try {
    const parts = jwtToken.split('.');
    if (parts.length > 1) {
      const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(payloadBase64));
      return payload.appKey || payload.sdkKey || '';
    }
  } catch (e) {
    console.error('Error decoding JWT token:', e);
  }
  return '';
}

// Start timeline capture loop (every 10 seconds)
function startTimelineCaptureLoop() {
  stopTimelineCaptureLoop();
  captureIntervalId = setInterval(() => {
    captureClassroomSlide();
  }, 10000);
}

// Stop timeline capture loop
function stopTimelineCaptureLoop() {
  if (captureIntervalId) {
    clearInterval(captureIntervalId);
    captureIntervalId = null;
  }
}

// Helper to draw a beautiful dark study-themed gradient slide when Same-Origin Policy blocks iframe canvas reads
function drawFallbackSlide(title, instructor, timeStr) {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d');

  // Draw a premium dark gradient background
  const grad = ctx.createLinearGradient(0, 0, 1280, 720);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(0.5, '#1e1b4b');
  grad.addColorStop(1, '#020617');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1280, 720);

  // Draw modern circular grids
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(640, 360, 300, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(640, 360, 450, 0, Math.PI * 2);
  ctx.stroke();

  // NNL ONE Logo Icon
  ctx.fillStyle = '#06b6d4';
  ctx.beginPath();
  ctx.arc(100, 100, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
  ctx.fillText('NNL ONE CLASSROOM', 130, 108);

  // Content type indicator
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '20px system-ui, -apple-system, sans-serif';
  ctx.fillText('AUTOMATIC TIMELINE SNAPSHOT', 100, 240);

  // Class Title wrapping
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px system-ui, -apple-system, sans-serif';
  const words = title.split(' ');
  let line = '';
  let y = 310;
  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let metrics = ctx.measureText(testLine);
    if (metrics.width > 1080 && n > 0) {
      ctx.fillText(line, 100, y);
      line = words[n] + ' ';
      y += 55;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 100, y);

  // Instructor
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '28px system-ui, -apple-system, sans-serif';
  ctx.fillText(`Faculty: ${instructor}`, 100, y + 70);

  // Live time indicator
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(110, y + 150, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
  ctx.fillText(`Captured at ${timeStr}`, 130, y + 158);

  // Instruction footer
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.font = '18px system-ui, -apple-system, sans-serif';
  ctx.fillText('Use the bottom seek bar or click this slide to review this part of the lecture.', 100, 640);

  return canvas.toDataURL('image/jpeg', 0.85);
}

// Capture current classroom slide/feed and save to timeline
async function captureClassroomSlide() {
  const iframe = document.getElementById('classroom-iframe');
  if (!iframe) return;

  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    if (!iframeDoc) return;

    // Strategy: find the best canvas/video that has real pixel data
    // Priority: largest canvas with non-blank pixels > largest video
    let bestCanvas = null;
    let bestArea = 0;

    // Check all canvases — find the largest one that is visible and isn't blank
    const canvases = Array.from(iframeDoc.querySelectorAll('canvas'));
    for (const c of canvases) {
      if (c.width < 100 || c.height < 100) continue; // skip tiny UI canvases
      
      // Skip hidden canvases
      if (c.offsetWidth === 0 || c.offsetHeight === 0) continue;
      const rect = c.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;

      const style = iframeDoc.defaultView ? iframeDoc.defaultView.getComputedStyle(c) : null;
      if (style) {
        if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) {
          continue;
        }
      }

      const area = c.width * c.height;
      if (area <= bestArea) continue;

      // Sample pixels to see if canvas has actual content (not blank)
      try {
        const probe = document.createElement('canvas');
        probe.width = 4; probe.height = 4;
        const pctx = probe.getContext('2d');
        pctx.drawImage(c, 0, 0, 4, 4);
        const data = pctx.getImageData(0, 0, 4, 4).data;
        // Check if any pixel has non-zero colour (not pure black/transparent)
        const hasContent = Array.from(data).some((v, i) => i % 4 !== 3 && v > 10);
        if (hasContent) {
          bestCanvas = c;
          bestArea = area;
        }
      } catch (_) {
        // Cross-origin pixel read blocked — still use as fallback if visible
        bestCanvas = c;
        bestArea = area;
      }
    }

    // If no good canvas found, try the largest playing video element
    if (!bestCanvas) {
      const videos = Array.from(iframeDoc.querySelectorAll('video'));
      let bestVideo = null;
      let bestVideoArea = 0;
      for (const v of videos) {
        if (v.videoWidth > 0 && v.videoHeight > 0 && !v.paused) {
          // Skip hidden video elements
          if (v.offsetWidth === 0 || v.offsetHeight === 0) continue;
          const rect = v.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;

          const style = iframeDoc.defaultView ? iframeDoc.defaultView.getComputedStyle(v) : null;
          if (style) {
            if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) {
              continue;
            }
          }

          const area = v.videoWidth * v.videoHeight;
          if (area > bestVideoArea) { bestVideo = v; bestVideoArea = area; }
        }
      }
      if (bestVideo) {
        const offlineCanvas = document.createElement('canvas');
        offlineCanvas.width = bestVideo.videoWidth;
        offlineCanvas.height = bestVideo.videoHeight;
        const ctx = offlineCanvas.getContext('2d');
        ctx.drawImage(bestVideo, 0, 0);
        const dataUrl = offlineCanvas.toDataURL('image/jpeg', 0.85);
        await saveSlideFromDataUrl(dataUrl);
        return;
      }
      console.log('No active class slide or video feed found to capture.');
      return;
    }

    // Draw best canvas to a fresh canvas to get a clean snapshot
    const offlineCanvas = document.createElement('canvas');
    offlineCanvas.width = bestCanvas.width;
    offlineCanvas.height = bestCanvas.height;
    const ctx = offlineCanvas.getContext('2d');
    ctx.drawImage(bestCanvas, 0, 0, bestCanvas.width, bestCanvas.height);
    const dataUrl = offlineCanvas.toDataURL('image/jpeg', 0.85);
    await saveSlideFromDataUrl(dataUrl);

  } catch (err) {
    console.error('captureClassroomSlide error:', err);
  }
}

async function saveSlideFromDataUrl(dataUrl) {
  const now = new Date();
  const timestamp = now.getTime();
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const slideObj = {
    time: timeStr,
    timestamp: timestamp,
    imgSrc: dataUrl
  };

  currentTimelineSlides.unshift(slideObj);

  if (currentTimelineSlides.length > 30) {
    currentTimelineSlides = currentTimelineSlides.slice(0, 30);
  }

  if (currentMeetingId) {
    await saveSlideToDb(currentMeetingId, timestamp, timeStr, dataUrl);
  }

  renderTimeline();
  updateTimelineSlider();
}


// Render slides inside timeline sidebar
function renderTimeline() {
  if (!timelineList) return;

  if (currentTimelineSlides.length === 0) {
    timelineList.innerHTML = `
      <div class="timeline-empty-state">
        <p>No slides captured yet.</p>
        <p style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.25rem;">Slides will appear here as the class progresses.</p>
      </div>
    `;
    return;
  }

  timelineList.innerHTML = currentTimelineSlides.map((slide) => `
    <div class="timeline-item" data-timestamp="${slide.timestamp}">
      <img src="${slide.imgSrc}" alt="Slide Captured at ${slide.time}" />
      <div class="timeline-item-time">${slide.time}</div>
    </div>
  `).join('');
}

// Update the timeline seek slider based on the current list of slides and state
function updateTimelineSlider() {
  if (!timelineSlider) return;

  const len = currentTimelineSlides.length;
  
  if (len === 0) {
    // Disable everything if no slides
    timelineSlider.disabled = true;
    timelineSlider.min = 0;
    timelineSlider.max = 100;
    timelineSlider.value = 100; // 100% completed progress bar at start
    timelineSliderTime.textContent = 'LIVE';
    timelineSlider.classList.remove('in-rewind');
    timelineSlider.style.background = `linear-gradient(to right, #00f3d0 0%, #00f3d0 100%)`;
    
    rewindPrevBtn.disabled = true;
    rewindNextBtn.disabled = true;
    if (headerRewindPrevBtn) headerRewindPrevBtn.disabled = true;
    if (headerRewindNextBtn) headerRewindNextBtn.disabled = true;
    rewindOverlay.classList.add('hide');
    return;
  }

  // Enable elements
  timelineSlider.disabled = false;
  timelineSlider.min = 0;
  timelineSlider.max = len; // len value represents LIVE feed

  let val = len;
  if (inRewindMode && currentSelectedSlideTimestamp !== null) {
    // Try to find the slide in memory
    const slideIndex = currentTimelineSlides.findIndex(s => s.timestamp === currentSelectedSlideTimestamp);
    
    if (slideIndex !== -1) {
      val = len - 1 - slideIndex;
      timelineSlider.value = val;
      
      const slide = currentTimelineSlides[slideIndex];
      rewindImg.src = slide.imgSrc;
      rewindTimestamp.textContent = slide.time;
      
      // Update relative time
      const diffMins = Math.round((Date.now() - slide.timestamp) / 60000);
      let diffStr = '';
      if (diffMins < 1) {
        const diffSecs = Math.round((Date.now() - slide.timestamp) / 1000);
        diffStr = (diffSecs < 0 ? 0 : diffSecs) + 's ago';
      } else {
        diffStr = diffMins + 'm ago';
      }
      rewindRelativeTime.textContent = diffStr;
      timelineSliderTime.textContent = slide.time;
      
      timelineSlider.classList.add('in-rewind');
      rewindOverlay.classList.remove('hide');

      // Set navigation button disabled states
      rewindPrevBtn.disabled = (val === 0);
      rewindNextBtn.disabled = false; // Next is enabled (goes to next slide or LIVE)
      if (headerRewindPrevBtn) headerRewindPrevBtn.disabled = (val === 0);
      if (headerRewindNextBtn) headerRewindNextBtn.disabled = false;
    } else {
      // If selected slide is not found (e.g. pruned), exit rewind mode
      inRewindMode = false;
      currentSelectedSlideTimestamp = null;
      updateTimelineSlider();
      return;
    }
  } else {
    // Live mode
    timelineSlider.value = len;
    timelineSliderTime.textContent = 'LIVE';
    timelineSlider.classList.remove('in-rewind');
    rewindOverlay.classList.add('hide');

    rewindPrevBtn.disabled = false;
    rewindNextBtn.disabled = true; // Cannot go further than LIVE
    if (headerRewindPrevBtn) headerRewindPrevBtn.disabled = false;
    if (headerRewindNextBtn) headerRewindNextBtn.disabled = true;
  }

  // Update dynamic background track color filling
  const pct = (val / len) * 100;
  const color = inRewindMode ? '#ff4d4d' : '#00f3d0';
  timelineSlider.style.background = `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, rgba(255, 255, 255, 0.08) ${pct}%, rgba(255, 255, 255, 0.08) 100%)`;
}

// Seek to a specific slider index value
function seekToSliderValue(val) {
  const len = currentTimelineSlides.length;
  if (len === 0) return;

  if (val >= len) {
    // Return to Live
    inRewindMode = false;
    currentSelectedSlideTimestamp = null;
  } else {
    // Seek to historical slide
    inRewindMode = true;
    const slideIndex = len - 1 - val;
    const slide = currentTimelineSlides[slideIndex];
    if (slide) {
      currentSelectedSlideTimestamp = slide.timestamp;
    }
  }
  updateTimelineSlider();
}

// Jump back 5 minutes (or the oldest captured slide in our 5-minute buffer)
function rewindFiveMinutes() {
  if (currentTimelineSlides.length === 0) {
    alert('No slides captured yet. Please wait for the class to progress.');
    return;
  }

  // The oldest captured slide is at the end of the array (since we unshift)
  const oldestSlide = currentTimelineSlides[currentTimelineSlides.length - 1];
  if (oldestSlide) {
    inRewindMode = true;
    currentSelectedSlideTimestamp = oldestSlide.timestamp;
    updateTimelineSlider();
    console.log(`Rewound to the oldest slide in the 5-minute buffer: ${oldestSlide.time}`);
  }
}

// Start relative age timer when in rewind mode
function startRelativeTimeTicker() {
  if (relativeTimeInterval) clearInterval(relativeTimeInterval);
  relativeTimeInterval = setInterval(() => {
    if (inRewindMode && currentSelectedSlideTimestamp !== null) {
      const slide = currentTimelineSlides.find(s => s.timestamp === currentSelectedSlideTimestamp);
      if (slide) {
        const diffMins = Math.round((Date.now() - slide.timestamp) / 60000);
        let diffStr = '';
        if (diffMins < 1) {
          const diffSecs = Math.round((Date.now() - slide.timestamp) / 1000);
          diffStr = (diffSecs < 0 ? 0 : diffSecs) + 's ago';
        } else {
          diffStr = diffMins + 'm ago';
        }
        rewindRelativeTime.textContent = diffStr;
      }
    }
  }, 5000);
}

// Programmatic panel toggles (Simulates clicks on internal Zoom toolbar buttons)
function toggleZoomPanel(type) {
  const iframe = document.getElementById('classroom-iframe');
  if (!iframe) return;

  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    if (!iframeDoc) return;

    let btn = null;
    if (type === 'chat') {
      btn = iframeDoc.querySelector('button[aria-label*="chat" i]') || 
            iframeDoc.querySelector('button[aria-label*="Chat" i]') || 
            iframeDoc.querySelector('.footer-button__chat') ||
            iframeDoc.querySelector('.footer-button-base__chat-icon')?.closest('button') ||
            iframeDoc.querySelector('.footer-btn-group__chat') ||
            Array.from(iframeDoc.querySelectorAll('button')).find(el => {
              const text = el.textContent.toLowerCase();
              return text.includes('chat') || el.querySelector('[aria-label*="chat" i]') || el.querySelector('.chat-icon');
            });
    } else if (type === 'participants') {
      btn = iframeDoc.querySelector('button[aria-label*="participant" i]') || 
            iframeDoc.querySelector('button[aria-label*="Participants" i]') || 
            iframeDoc.querySelector('.footer-button__participants') ||
            iframeDoc.querySelector('.footer-button-base__participant-icon')?.closest('button') ||
            iframeDoc.querySelector('.footer-btn-group__participants') ||
            Array.from(iframeDoc.querySelectorAll('button')).find(el => {
              const text = el.textContent.toLowerCase();
              return text.includes('participant') || text.includes('people') || el.querySelector('[aria-label*="participant" i]');
            });
    }

    if (btn) {
      btn.click();
      console.log(`Programmatically triggered Zoom ${type} panel.`);
      // Check active panel states immediately
      setTimeout(updateHeaderPanelButtons, 150);
    } else {
      console.warn(`Could not find the internal Zoom ${type} button in the iframe.`);
    }
  } catch (e) {
    console.error('Error toggling panel inside iframe:', e);
  }
}

// Initialize and join embedded Zoom meeting
async function joinEmbeddedClassroom(classId, title, instructorName) {
  const token = localStorage.getItem('nnl_access_token');
  try {
    let meetingId = '';
    let passcode = '';

    if (token === 'GUEST_DEMO_TOKEN' || String(classId).startsWith('mock-')) {
      meetingId = '98765432101';
      passcode = '123456';
    } else {
      const response = await fetch(`/api/cms/v2/live_classes/${classId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Could not fetch meeting credentials. Class may not have started yet.');
      }

      const resJson = await response.json();
      const classDetail = resJson.data || resJson;

      meetingId = classDetail.zoom_meet_id || classDetail.zoomMeetId || classDetail.meeting_id || '';
      passcode = classDetail.passcode || classDetail.password || classDetail.zoom_passcode || classDetail.pwd || '';
    }

    if (!meetingId) {
      throw new Error('No active Zoom credentials found for this class.');
    }

    currentMeetingId = meetingId; // Save current meeting ID

    // Set UI metadata
    classroomTitle.textContent = title;
    classroomInstructor.textContent = instructorName;

    // Transition UI
    appHeader.classList.add('hide');
    classroomDashboard.classList.add('hide');
    classroomViewer.classList.remove('hide');
    document.body.classList.add('in-classroom');

    // Load Zoom Web Client in proxy iframe
    const zoomWebLink = `/zoom/wc/join/${meetingId}?pwd=${passcode}`;
    classroomIframe.src = zoomWebLink;

    console.log('Loading Zoom Web Client in proxy iframe:', zoomWebLink);

    // Auto-bypass pre-join name screen: poll iframe DOM until the form appears,
    // then fill in the name and click Join automatically.
    autoJoinZoomPrejoin(classroomIframe, 'Rajit');

    // Load old snapshots from IndexedDB storage
    currentTimelineSlides = await loadSlidesFromDb(meetingId);
    inRewindMode = false;
    currentSelectedSlideTimestamp = null;
    
    renderTimeline();
    updateTimelineSlider();
    startRelativeTimeTicker();

    // Restore sidebar collapsed state from previous session
    const sidebarWasCollapsed = localStorage.getItem('nnl_sidebar_collapsed') === '1';
    toggleSidebar(sidebarWasCollapsed);

  } catch (error) {
    console.error('Error entering embedded class:', error);
    alert(error.message || 'Failed to enter class. Verify connection.');
    
    // Rollback UI
    appHeader.classList.remove('hide');
    classroomDashboard.classList.remove('hide');
    classroomViewer.classList.add('hide');
  }
}

// Disconnect from Zoom and exit viewer
async function exitClassroom() {
  if (confirm('Are you sure you want to exit the live classroom?')) {
    stopTimelineCaptureLoop();
    stopClassroomMonitorLoop();
    
    // Clear the inactivity timer and restore bars for next session
    clearTimeout(barsHideTimerId);
    barsHideTimerId = null;
    showClassroomBars();
    
    if (relativeTimeInterval) {
      clearInterval(relativeTimeInterval);
      relativeTimeInterval = null;
    }
    
    // Reset iframe to blank
    classroomIframe.src = 'about:blank';
    
    // Return UI to normal
    classroomViewer.classList.add('hide');
    appHeader.classList.remove('hide');
    classroomDashboard.classList.remove('hide');
    document.body.classList.remove('in-classroom');
    loadDashboard();
  }
}

// Check iframe DOM to see if Zoom's panels are open and update custom header buttons
function updateHeaderPanelButtons() {
  const iframe = document.getElementById('classroom-iframe');
  if (!iframe) return;

  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    if (!iframeDoc) return;

    // Check if chat is open in Zoom
    const chatOpen = !!(
      iframeDoc.querySelector('.chat-container') ||
      iframeDoc.querySelector('.chat-panel') ||
      iframeDoc.querySelector('.chat-sidebar') ||
      iframeDoc.querySelector('#chat-panel') ||
      Array.from(iframeDoc.querySelectorAll('div, section')).find(el => {
        const label = el.getAttribute('aria-label') || '';
        return label.toLowerCase().includes('chat') && el.offsetHeight > 0;
      })
    );

    // Check if participants is open in Zoom
    const participantsOpen = !!(
      iframeDoc.querySelector('.participants-container') ||
      iframeDoc.querySelector('.participants-list') ||
      iframeDoc.querySelector('#participants-panel') ||
      Array.from(iframeDoc.querySelectorAll('div, section')).find(el => {
        const label = el.getAttribute('aria-label') || '';
        return label.toLowerCase().includes('participant') && el.offsetHeight > 0;
      })
    );

    if (toggleChatBtn) {
      toggleChatBtn.classList.toggle('btn-active', !!chatOpen);
    }
    if (toggleParticipantsBtn) {
      toggleParticipantsBtn.classList.toggle('btn-active', !!participantsOpen);
    }
  } catch (e) {
    // Ignore cross-origin error on iframe redirection
  }
}

// Classroom UI Monitor Loop: handles name autofill, auto-clicks audio prompts, and checks panel states
let classroomMonitorIntervalId = null;

// Define CSS rules globally so both load event and monitor loop can use them
const zoomCssOverrides = `
  /* ── Hide top gallery strip of participant videos ── */
  .gallery-video-container,
  .video-carousel,
  .gallery-view,
  .active-speaker-video-carousel-container,
  .speaker-active-video-carousel-container,
  #speak-list,
  .video-grid__carousel { display: none !important; }

  /* ── Hide Zoom's own fullscreen button ── */
  button[aria-label="Enter Full Screen"],
  button[aria-label="Exit Full Screen"],
  .fullscreen-btn, .fullscreen-button,
  .wc-fullscreen { display: none !important; }

  /* ── Completely hide Zoom's bottom toolbar (audio still works via JS) ── */
  footer, .footer, .meeting-footer, .footer-container,
  .meeting-controlbar, .footer-bar, .foot-bar-container,
  #footer-theme, #wc-footer, .wc-footer,
  [class*="footer" i], [class*="controlbar" i],
  [class*="foot-bar" i], [class*="footer-bar" i],
  [id*="footer" i] {
    display: none !important;
    height: 0 !important;
    min-height: 0 !important;
    overflow: hidden !important;
    pointer-events: none !important;
  }

  /* ── Hide Zoom header / branding ── */
  header, #wc-header, .wc-header,
  .header__logo-container, .zoom-logo, .header-logo,
  .meeting-info-icon__container, .meeting-info-container,
  .header-logo-container { display: none !important; }

  /* ── Completely hide any Zoom sidebar / chat / participant panel that opens ── */
  /* These are hidden off-screen for scraping — NOT visible to the user */
  #wc-container-right, .meeting-sidebar,
  .wc-right-sidebar, .right-sidebar,
  .chat-container, .chat-panel, .chat-sidebar,
  .participants-container, .participants-list,
  .wc-chat, .wc-participants,
  [class*="right-sidebar" i], [class*="side-panel" i],
  [id*="right-container" i] {
    position: fixed !important;
    top: -9999px !important;
    left: -9999px !important;
    width: 400px !important;
    height: 600px !important;
    overflow: auto !important;
    opacity: 0 !important;
    pointer-events: none !important;
    visibility: hidden !important;
  }

  /* ── Suppress all Zoom chat/participant popout windows ── */
  .wc-chat-out, .wc-participants-out,
  [class*="popout" i], [class*="pop-out" i],
  [class*="detach" i] { display: none !important; }

  /* ── Hide notifications / dialogs / tooltips ── */
  .notification-meeting-item, .mic-camera-notice,
  .audio-tip, .join-audio-tip, .join-audio-container,
  .zm-modal, .zm-dialog, .zm-popover, .zm-toast,
  .zm-notification,
  [class*="permission-tip" i], [class*="audio-notice" i],
  [class*="mic-notice" i], [class*="camera-notice" i],
  [class*="join-audio" i] {
    display: none !important;
    opacity: 0 !important;
    pointer-events: none !important;
    visibility: hidden !important;
  }

  /* ── Fill root ── */
  #zmmtg-root { width: 100% !important; height: 100% !important; }
`;

function applyVolumeToIframe() {
  const iframe = document.getElementById('classroom-iframe');
  if (!iframe) return;
  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    if (!iframeDoc || iframe.src === 'about:blank' || iframe.src === '') return;

    const volumeVal = currentVolume / 100;
    const mediaElements = iframeDoc.querySelectorAll('video, audio');
    mediaElements.forEach(media => {
      // Set volume if different to avoid redundant DOM updates
      if (media.volume !== volumeVal) {
        media.volume = volumeVal;
      }
      // Set muted state if different
      const shouldMute = currentVolume === 0;
      if (media.muted !== shouldMute) {
        media.muted = shouldMute;
      }
    });
  } catch (e) {
    // Ignore cross-origin error
  }
}

function updateVolumeUI() {
  const sliders = [document.getElementById('bottom-volume-slider')];
  const muteBtns = [document.getElementById('bottom-volume-mute-btn')];
  
  sliders.forEach(slider => {
    if (!slider) return;
    slider.value = currentVolume;
    const pct = currentVolume;
    slider.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${pct}%, rgba(255, 255, 255, 0.1) ${pct}%, rgba(255, 255, 255, 0.1) 100%)`;
  });

  const svgLoud = `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"></path></svg>`;
  const svgMuted = `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6L4.72 12H1.5v4.5h3.22L9 20.25V3.75L6.75 6z"></path></svg>`;

  muteBtns.forEach(btn => {
    if (!btn) return;
    if (currentVolume === 0) {
      btn.innerHTML = svgMuted;
      btn.title = "Unmute";
    } else {
      btn.innerHTML = svgLoud;
      btn.title = "Mute";
    }
  });
}

function ensureZoomPanelsOpen(iframeDoc) {
  // We do NOT click Zoom's toolbar buttons — that would make their panel
  // fly open and be visible on top of our UI.
  // Instead we directly set the panel elements to be rendered off-screen
  // so the DOM is populated for scraping without any visible overlay.
  try {
    const panelSelectors = [
      '.chat-container', '.chat-panel', '.chat-sidebar', '#chat-panel', '.wc-chat',
      '.participants-container', '.participants-list', '#participants-panel', '.wc-participants',
      '#wc-container-right', '.meeting-sidebar', '.wc-right-sidebar', '.right-sidebar'
    ];
    panelSelectors.forEach(sel => {
      const els = iframeDoc.querySelectorAll(sel);
      els.forEach(el => {
        el.style.setProperty('position', 'fixed', 'important');
        el.style.setProperty('top', '-9999px', 'important');
        el.style.setProperty('left', '-9999px', 'important');
        el.style.setProperty('opacity', '0', 'important');
        el.style.setProperty('pointer-events', 'none', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.style.setProperty('width', '400px', 'important');
        el.style.setProperty('height', '600px', 'important');
        el.style.setProperty('overflow', 'auto', 'important');
      });
    });
  } catch (e) {
    // Ignore
  }
}

function scrapeZoomChat(iframeDoc) {
  const messages = [];
  try {
    const items = iframeDoc.querySelectorAll('.chat-message-item, .chat-item, li[class*="chat-item"], div[class*="chat-item"], .wc-chat-item, [class*="message-item"]');
    
    items.forEach(item => {
      if (item.querySelector('.chat-message-item, .chat-item')) return;
      
      const senderEl = item.querySelector('.chat-item__sender, .chat-message-item__sender-name, [class*="sender" i], [class*="name" i]');
      const textEl = item.querySelector('.chat-item__message, .chat-item__text, .chat-message-item__message-text, [class*="text" i], [class*="message" i]');
      const timeEl = item.querySelector('.chat-item__time, .chat-message-item__time, [class*="time" i]');
      
      let sender = senderEl ? senderEl.textContent.trim() : '';
      let text = textEl ? textEl.textContent.trim() : '';
      let time = timeEl ? timeEl.textContent.trim() : '';
      
      if (!text && !sender) {
        const rawText = item.textContent.trim();
        if (rawText) text = rawText;
      }
      
      if (sender) {
        sender = sender.replace(/:\s*$/, '').replace(/\s*to\s+everyone\s*/i, '');
      }
      
      if (text || sender) {
        messages.push({
          sender: sender || 'Participant',
          text: text || '',
          time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    });
  } catch (e) {
    // Ignore
  }
  return messages;
}

function scrapeZoomParticipants(iframeDoc) {
  const participants = [];
  try {
    const items = iframeDoc.querySelectorAll('.participants-item, .participant-item, li[class*="participant"], div[class*="participant"]');
    
    items.forEach(item => {
      if (item.querySelector('.participants-item, .participant-item')) return;
      
      const nameEl = item.querySelector('.participant-item__name, .participant-name, [class*="name" i], span');
      let name = nameEl ? nameEl.textContent.trim() : '';
      
      if (name) {
        let isHost = name.toLowerCase().includes('(host)') || name.toLowerCase().includes('(me)');
        let isCoHost = name.toLowerCase().includes('(co-host)');
        
        name = name.replace(/\s*\(host\)\s*/i, '')
                   .replace(/\s*\(co-host\)\s*/i, '')
                   .replace(/\s*\(me\)\s*/i, '')
                   .replace(/\s*\(host, me\)\s*/i, '');
        
        participants.push({
          name: name,
          isHost: isHost,
          isCoHost: isCoHost
        });
      }
    });
    
    if (participants.length === 0) {
      const nameSpans = iframeDoc.querySelectorAll('.participant-name, [class*="participant-name" i]');
      nameSpans.forEach(span => {
        let name = span.textContent.trim();
        if (name) {
          let isHost = name.toLowerCase().includes('(host)') || name.toLowerCase().includes('(me)');
          let isCoHost = name.toLowerCase().includes('(co-host)');
          name = name.replace(/\s*\(host\)\s*/i, '').replace(/\s*\(co-host\)\s*/i, '').replace(/\s*\(me\)\s*/i, '');
          participants.push({
            name: name,
            isHost: isHost,
            isCoHost: isCoHost
          });
        }
      });
    }
  } catch (e) {
    // Ignore
  }

  // Deduplicate
  const unique = [];
  const seen = new Set();
  participants.forEach(p => {
    if (!seen.has(p.name)) {
      seen.add(p.name);
      unique.push(p);
    }
  });
  return unique;
}

function renderCustomChat(messages) {
  const chatList = document.getElementById('custom-chat-list');
  if (!chatList) return;
  
  if (messages.length === 0) {
    chatList.innerHTML = `
      <div class="sidebar-empty-state" style="padding: 2rem 1rem; text-align: center; background: rgba(255,255,255,0.01); border: 1px dashed rgba(255,255,255,0.05); border-radius: 12px; font-size: 0.75rem; color: var(--text-muted);">
        No messages yet. Chat is synced live from Zoom.
      </div>
    `;
    return;
  }
  
  let html = '';
  messages.forEach(msg => {
    html += `
      <div class="custom-chat-msg">
        <div class="custom-chat-msg-header">
          <span class="custom-chat-msg-sender">${msg.sender}</span>
          <span class="custom-chat-msg-time">${msg.time}</span>
        </div>
        <div class="custom-chat-msg-text">${msg.text}</div>
      </div>
    `;
  });
  
  // Only update DOM if HTML is different to prevent layout flashing and scrolling issues
  if (chatList.innerHTML !== html) {
    chatList.innerHTML = html;
    chatList.scrollTop = chatList.scrollHeight;
  }
}

function renderCustomParticipants(participants) {
  const partList = document.getElementById('custom-participants-list');
  const countBadge = document.getElementById('custom-participant-count');
  if (!partList) return;
  
  if (countBadge) {
    countBadge.textContent = participants.length;
  }
  
  if (participants.length === 0) {
    partList.innerHTML = `
      <div class="sidebar-empty-state" style="padding: 2rem 1rem; text-align: center; background: rgba(255,255,255,0.01); border: 1px dashed rgba(255,255,255,0.05); border-radius: 12px; font-size: 0.75rem; color: var(--text-muted);">
        Scanning participant list...
      </div>
    `;
    return;
  }
  
  let html = '';
  participants.forEach(p => {
    const initials = p.name.substring(0, 2).toUpperCase();
    let badges = '';
    if (p.isHost) {
      badges += `<span class="custom-participant-badge custom-participant-badge-host">Host</span>`;
    } else if (p.isCoHost) {
      badges += `<span class="custom-participant-badge custom-participant-badge-cohost">Co-host</span>`;
    }
    
    html += `
      <div class="custom-participant-item">
        <div class="custom-participant-avatar">${initials}</div>
        <span class="custom-participant-name">${p.name}</span>
        <div class="custom-participant-badges">${badges}</div>
      </div>
    `;
  });
  
  if (partList.innerHTML !== html) {
    partList.innerHTML = html;
  }
}

function switchSidebarTab(tabName) {
  const tabs = ['timeline', 'chat', 'participants'];
  tabs.forEach(t => {
    const tabBtn = document.getElementById(`sidebar-tab-${t}`);
    const section = document.getElementById(`sidebar-section-${t}`);
    
    if (tabBtn && section) {
      if (t === tabName) {
        tabBtn.classList.add('active');
        section.classList.remove('hide');
      } else {
        tabBtn.classList.remove('active');
        section.classList.add('hide');
      }
    }
  });
}

function ensureZoomStyleOverrides(iframeDoc) {
  try {
    let style = iframeDoc.getElementById('nnl-zoom-style-overrides');
    if (!style) {
      style = iframeDoc.createElement('style');
      style.id = 'nnl-zoom-style-overrides';
      iframeDoc.head.appendChild(style);
    }
    
    // Ensure our custom style tag is always at the very bottom of <head> to take precedence
    if (iframeDoc.head.lastElementChild !== style) {
      iframeDoc.head.appendChild(style);
    }
    
    if (style.innerHTML !== zoomCssOverrides) {
      style.innerHTML = zoomCssOverrides;
      console.log('Classroom Monitor: Ensured style overrides are active in iframe.');
    }
  } catch (err) {
    console.error('Error applying style overrides inside iframe:', err);
  }
}

function cleanZoomIframeDOM(iframeDoc) {
  try {
    // 1. Hide by text content keywords
    const alertTexts = [
      "apps that are accessing your meeting content",
      "apps that are accessing your",
      "click the mic and camera button to retry",
      "enable microphone and camera access",
      "don't hear anything? click anywhere",
      "don't hear anything",
      "failed to detect a microphone",
      "failed to detect a camera",
      "please grant permission",
      "access to microphone and camera",
      "allow zoom to use your microphone and camera"
    ];

    const allElems = iframeDoc.querySelectorAll('div, span, p, section, h1, h2, h3, h4, button, a');
    for (const el of allElems) {
      if (el.children.length <= 1) {
        const text = el.textContent.toLowerCase();
        const matches = alertTexts.some(kw => text.includes(kw));
        if (matches) {
          // Find the topmost modal/dialog/alert container
          const container = el.closest('div[role="alert"]') ||
                            el.closest('div[role="dialog"]') ||
                            el.closest('div[role="alertdialog"]') ||
                            el.closest('.zm-modal') ||
                            el.closest('.zm-dialog') ||
                            el.closest('.zm-popover') ||
                            el.closest('.zm-tooltip') ||
                            el.closest('.popover') ||
                            el.closest('.tooltip') ||
                            el.closest('.notification') ||
                            el.closest('.mic-camera-notice') ||
                            el.closest('.audio-tip') ||
                            el.closest('.join-audio-tip') ||
                            el.closest('.join-audio-container') ||
                            el;
          
          if (container && container.style.display !== 'none') {
            container.style.setProperty('display', 'none', 'important');
            container.style.setProperty('opacity', '0', 'important');
            container.style.setProperty('pointer-events', 'none', 'important');
            container.style.setProperty('visibility', 'hidden', 'important');
            container.style.setProperty('height', '0', 'important');
            container.style.setProperty('width', '0', 'important');
            container.style.setProperty('overflow', 'hidden', 'important');
            console.log('Classroom Monitor: Programmatically hid warning/popup element:', el.textContent.trim().substring(0, 50));
          }
        }
      }
    }

    // 2. Directly click visible dismiss / "Got It" buttons inside notifications
    const dismissLabels = ['got it', 'ok', 'dismiss', 'close', 'cancel', 'skip', 'allow', 'learn more'];
    const allBtns = iframeDoc.querySelectorAll('button, a[role="button"], [class*="btn" i]');
    for (const btn of allBtns) {
      const txt = btn.textContent.trim().toLowerCase();
      if (dismissLabels.some(l => txt === l) && btn.offsetParent !== null) {
        const inTip = btn.closest('[class*="tip" i], [class*="notice" i], [class*="notification" i], [class*="permission" i], .zm-toast, .zm-modal, .zm-dialog, [role="alert"]');
        if (inTip) {
          btn.click();
          console.log('Classroom Monitor: Dismissed popup via button:', txt);
        }
      }
    }

    // 3. Hide alert/notification elements — but NEVER hide elements that contain
    //    audio join controls (those are handled by autoClickAudioJoin first).
    const audioKeywords = ['join audio by computer', 'join with computer audio', 'computer audio', 'phone call'];
    const popupSelectors = [
      'div[role="alert"]',
      'div[role="alertdialog"]',
      '.zm-toast',
      '.zm-notification',
      '.zm-popover',
      '.zm-tooltip',
      '.notification-meeting-item',
      '.mic-camera-notice',
      '.audio-tip',
      '.join-audio-tip',
      '[class*="notification" i]',
      '[class*="notice" i]',
      '[class*="tip" i]',
      '[class*="alert" i]',
      '[class*="popover" i]',
      '[class*="tooltip" i]',
    ];

    popupSelectors.forEach(sel => {
      const elems = iframeDoc.querySelectorAll(sel);
      elems.forEach(el => {
        if (el.id === 'zmmtg-root' || el.tagName === 'BODY' || el.tagName === 'HTML') return;
        // Skip elements that contain audio join controls — autoClickAudioJoin handles them
        const elText = el.textContent.toLowerCase();
        const hasAudioJoin = audioKeywords.some(kw => elText.includes(kw));
        if (hasAudioJoin) return;
        if (el.style.display !== 'none') {
          el.style.setProperty('display', 'none', 'important');
          el.style.setProperty('opacity', '0', 'important');
          el.style.setProperty('pointer-events', 'none', 'important');
          el.style.setProperty('visibility', 'hidden', 'important');
        }
      });
    });

  } catch (err) {
    // Ignore iframe error
  }
}



function startClassroomMonitorLoop() {
  stopClassroomMonitorLoop();
  
  classroomMonitorIntervalId = setInterval(() => {
    const iframe = document.getElementById('classroom-iframe');
    if (!iframe) return;

    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      if (!iframeDoc || iframe.src === 'about:blank' || iframe.src === '') return;

      // ── STEP 1: Audio join MUST run first before any cleanup hides the dialog ──
      autoClickAudioJoin(iframeDoc);

      // ── STEP 2: Auto-fill name if pre-join screen is showing ──
      const nameInput = iframeDoc.querySelector('input[name="inputname"]') || 
                        iframeDoc.querySelector('#inputname') || 
                        iframeDoc.querySelector('input[type="text"]');
      const joinBtn = iframeDoc.querySelector('button[type="submit"]') || 
                      iframeDoc.querySelector('.join-btn') ||
                      Array.from(iframeDoc.querySelectorAll('button')).find(btn => btn.textContent.toLowerCase().includes('join'));
      
      if (nameInput && nameInput.value !== (localStorage.getItem('nnl_phone') || 'Student')) {
        nameInput.value = localStorage.getItem('nnl_phone') || 'Student';
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
        nameInput.dispatchEvent(new Event('change', { bubbles: true }));
        if (joinBtn) joinBtn.click();
      }

      // ── STEP 3: Inject style overrides (keeps panels off-screen) ──
      ensureZoomStyleOverrides(iframeDoc);

      // ── STEP 4: Clean popups/alerts — but NOT the audio join dialog ──
      cleanZoomIframeDOM(iframeDoc);
      
      // ── STEP 5: Keep panel elements off-screen for scraping ──
      ensureZoomPanelsOpen(iframeDoc);

      // ── STEP 6: Apply volume ──
      applyVolumeToIframe();

      // ── STEP 7: Mouse detection for bar auto-hide ──
      if (iframeDoc && !iframeDoc._hasHoverDetection) {
        iframeDoc.addEventListener('mousemove', showBarsTemporarily);
        iframeDoc.addEventListener('mouseenter', showBarsTemporarily);
        iframeDoc._hasHoverDetection = true;
      }

      // ── STEP 8: Update header panel button states ──
      updateHeaderPanelButtons();

      // ── STEP 9: Scrape chat + participants ──
      const msgs = scrapeZoomChat(iframeDoc);
      renderCustomChat(msgs);
      const parts = scrapeZoomParticipants(iframeDoc);
      renderCustomParticipants(parts);

    } catch (e) {
      // Ignore cross-origin error during redirect phases
    }
  }, 1000);
}

// ── Dedicated audio-join auto-clicker ──────────────────────────────────────
// Runs BEFORE any cleanup so the dialog is guaranteed to be in the DOM.
function autoClickAudioJoin(iframeDoc) {
  try {
    // Target: "Join Audio by Computer" button (most specific first)
    const audioJoinSelectors = [
      'button.join-audio-by-voip__join-btn',
      'button[class*="join-audio"][class*="voip"]',
      'button[class*="audio-option-btn"]',
    ];
    for (const sel of audioJoinSelectors) {
      const btn = iframeDoc.querySelector(sel);
      if (btn && btn.offsetParent !== null) {
        btn.click();
        console.log('[AudioJoin] Clicked via selector:', sel);
        return;
      }
    }

    // Broad text-based search — finds any visible button whose text matches
    const allBtns = Array.from(iframeDoc.querySelectorAll('button, [role="button"]'));
    for (const btn of allBtns) {
      if (btn.offsetParent === null) continue; // skip hidden buttons
      const txt = btn.textContent.trim().toLowerCase();
      if (
        txt === 'join audio by computer' ||
        txt === 'join with computer audio' ||
        txt === 'join audio' ||
        txt === 'computer audio'
      ) {
        btn.click();
        console.log('[AudioJoin] Clicked via text match:', btn.textContent.trim());
        return;
      }
    }

    // "Got It" / "OK" / "Dismiss" inside notification toasts (camera warning etc.)
    for (const btn of allBtns) {
      if (btn.offsetParent === null) continue;
      const txt = btn.textContent.trim().toLowerCase();
      const inNotification = btn.closest(
        '.zm-toast, .zm-notification, [class*="notification" i], [class*="notice" i], [class*="tip" i], [class*="alert" i], [role="alert"]'
      );
      if (inNotification && (txt === 'got it' || txt === 'ok' || txt === 'dismiss' || txt === 'close' || txt === 'x')) {
        btn.click();
        console.log('[AudioJoin] Dismissed notification via:', txt);
      }
    }
  } catch (e) { /* ignore */ }
}



function stopClassroomMonitorLoop() {
  if (classroomMonitorIntervalId) {
    clearInterval(classroomMonitorIntervalId);
    classroomMonitorIntervalId = null;
  }
}

// One-shot helper to immediately scrape + render chat and participants
// Used when switching tabs so data shows right away without waiting for the interval
function syncClassroomData() {
  const iframe = document.getElementById('classroom-iframe');
  if (!iframe) return;
  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    if (!iframeDoc || iframe.src === 'about:blank') return;
    renderCustomChat(scrapeZoomChat(iframeDoc));
    renderCustomParticipants(scrapeZoomParticipants(iframeDoc));
  } catch (e) {
    // Cross-origin — ignore
  }
}

// Listen to classroom iframe onload to inject custom styles and start the monitor loop
classroomIframe.addEventListener('load', () => {
  try {
    const iframeDoc = classroomIframe.contentDocument || classroomIframe.contentWindow.document;
    if (!iframeDoc || classroomIframe.src === 'about:blank' || classroomIframe.src === '') return;
    
    // Inject and enforce style overrides
    ensureZoomStyleOverrides(iframeDoc);
    
    // Start classroom monitor loop
    startClassroomMonitorLoop();

  } catch (e) {
    console.error('Failed to access iframe document on load:', e);
  }
});

// Fetch and render classes
async function loadDashboard(isSilent = false) {
  if (!isSilent) {
    clearAlert();
  }

  const token = localStorage.getItem('nnl_access_token');
  if (!token) return;

  if (token === 'GUEST_DEMO_TOKEN') {
    if (!isSilent && refetchBtn) {
      refetchBtn.classList.add('spinning');
      refetchBtn.disabled = true;
      if (dashboardLoader) {
        dashboardLoader.classList.remove('hide');
      }
    }

    setTimeout(() => {
      classesData = [];
      renderBatchSelector();
      renderClasses(classesData);
      if (!isSilent) {
        if (dashboardLoader) dashboardLoader.classList.add('hide');
        if (refetchBtn) {
          refetchBtn.classList.remove('spinning');
          refetchBtn.disabled = false;
        }
      }
    }, 600);
    return;
  }

  // 1. Try to load from local storage cache instantly (Stale-While-Revalidate)
  const cacheKey = `nnl_cache_live_classes_${activeTab}`;
  const cachedDataStr = localStorage.getItem(cacheKey);
  let hasCache = false;
  if (!isSilent && cachedDataStr) {
    try {
      const cachedData = JSON.parse(cachedDataStr);
      if (Array.isArray(cachedData) && cachedData.length > 0) {
        classesData = cachedData;
        renderBatchSelector();
        renderClasses(classesData);
        hasCache = true;
        // Hide loader since we have content already
        dashboardLoader.classList.add('hide');
      }
    } catch (e) {
      console.warn('Failed to parse cached classes:', e);
    }
  }

  // If no cache, clear container and show loader
  if (!isSilent && !hasCache) {
    classListContainer.innerHTML = '';
    dashboardLoader.classList.remove('hide');
  }

  if (!isSilent && refetchBtn) {
    refetchBtn.classList.add('spinning');
    refetchBtn.disabled = true;
  }

  try {
    let url = '/api/cms/v2/live_classes/';
    if (activeTab === 'recordings') {
      url = '/api/cms/v2/live_classes_recordings/';
    }
    // Note: do NOT filter by ?status=live server-side; client-side time-based logic handles
    // classifying which classes are live, upcoming, or past.

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      // Try to silently refresh the token before giving up
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        loadDashboard(isSilent); // Retry with the new token
        return;
      }
      // Refresh also failed — user must re-authenticate
      handleLogout();
      if (!isSilent) {
        showAlert('Your session has expired. Please log in again.');
      }
      return;
    }

    let rawData;
    if (!response.ok) {
      // Try fallback endpoint
      const fallbackUrl = activeTab === 'recordings' 
        ? '/api/cms/v2/live_classes_recordings/' 
        : '/api/cms/v2/live_classes/';
      
      const fbResponse = await fetch(fallbackUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!fbResponse.ok) {
        throw new Error('Failed to load classes from server.');
      }

      rawData = await fbResponse.json();
    } else {
      rawData = await response.json();
    }

    let freshClasses = [];
    if (rawData) {
      if (Array.isArray(rawData)) {
        freshClasses = rawData;
      } else if (rawData.data && Array.isArray(rawData.data)) {
        freshClasses = rawData.data;
      } else if (rawData.classes && Array.isArray(rawData.classes)) {
        freshClasses = rawData.classes;
      } else if (rawData.results && Array.isArray(rawData.results)) {
        freshClasses = rawData.results;
      }
    }

    classesData = freshClasses;
    
    // Save to cache
    localStorage.setItem(cacheKey, JSON.stringify(freshClasses));

    renderBatchSelector();
    renderClasses(classesData);

  } catch (error) {
    console.error('Error fetching classes:', error);
    if (!isSilent) {
      if (!hasCache) {
        showAlert('Unable to fetch classes. Please check your network connection.');
      } else {
        console.log('Sync failed, kept cached classes.');
      }
    }
  } finally {
    if (!isSilent) {
      dashboardLoader.classList.add('hide');
      if (refetchBtn) {
        refetchBtn.classList.remove('spinning');
        refetchBtn.disabled = false;
      }
    }
  }
}

function getSimplifiedBatchTitle(title) {
  if (!title) return '';
  const tUpper = title.toUpperCase();
  if (tUpper.includes('SAPPHIRE') || tUpper.includes('BLUE')) {
    return 'Blue Sapphire Batch';
  }
  if (tUpper.includes('PEARL')) {
    return 'Pearl Batch';
  }
  return title.trim();
}

function doesClassMatchBatch(c, activeBatch) {
  const rawBatchTitle = c.batch?.title || (c.liveClass?.batch?.title);
  if (!rawBatchTitle) {
    const t = ((c.title || c.topic || '').toString()).toUpperCase();
    const ab = activeBatch.toUpperCase();
    if (ab.includes('SAPPHIRE') || ab.includes('BLUE')) {
      return t.includes('SAPPHIRE') || t.includes('BLUE') || t.includes('PHARMACOLOGY') || t.includes('CARDIAC');
    } else if (ab.includes('PEARL')) {
      return t.includes('PEARL') || t.includes('COMMUNITY') || t.includes('HEALTH');
    } else if (ab.includes('NORCET')) {
      return t.includes('NORCET') || t.includes('AIIMS');
    } else if (ab.includes('NCLEX')) {
      return t.includes('NCLEX');
    } else if (ab.includes('PSC') || ab.includes('CHO')) {
      return t.includes('PSC') || t.includes('CHO');
    } else if (ab.includes('MSC')) {
      return t.includes('MSC');
    }
    return true;
  }

  const classBatchTitle = getSimplifiedBatchTitle(rawBatchTitle);
  const targetBatch = getSimplifiedBatchTitle(activeBatch);
  return classBatchTitle === targetBatch;
}

// Render the class cards
function renderClasses(classes) {
  classListContainer.innerHTML = '';
  liveNowContainer.innerHTML = '';
  liveNowSection.classList.add('hide');

  if (activeTab === 'recordings') {
    renderRecordings(classes);
    return;
  } else {
    classListContainer.style.display = ''; // Restore grid layout
  }

  // Parse if nested inside scheduled class list structures
  const cleanClasses = [];
  if (classes && classes.length > 0) {
    classes.forEach(item => {
      if (item.classes && Array.isArray(item.classes)) {
        cleanClasses.push(...item.classes);
      } else if (item.liveClass) { // RecordedClass wrapper
        cleanClasses.push(item.liveClass);
      } else {
        cleanClasses.push(item);
      }
    });
  }

  // ── Live tab: filter by activeBatch (so we only show classes for the student's selected batch)
  let poolForLive = cleanClasses.filter(c => doesClassMatchBatch(c, activeBatch));

  // Only fall back to mock if the filtered pool is empty
  if (poolForLive.length === 0) {
    poolForLive = getMockClassesForBatch(activeBatch, 'live');
  }

  // ── Upcoming tab: keep batch filter as before
  let batchFiltered = cleanClasses.filter(c => doesClassMatchBatch(c, activeBatch));
  // Mock fallback only for non-live tabs
  if (activeTab !== 'live' && batchFiltered.length === 0) {
    batchFiltered = getMockClassesForBatch(activeBatch, activeTab);
  }

  // Tab badge: check ALL API classes (not just the batch-filtered ones) for live status
  const hasLiveClass = poolForLive.some(c => {
    const startVal = c.start || c.startTime || '';
    const endVal = c.end || c.endTime || '';
    if (startVal && endVal) {
      try {
        const now = new Date();
        const start = new Date(startVal);
        const end = new Date(endVal);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          return now >= start && now <= end;
        }
      } catch (e) {}
    }
    return false;
  });

  if (tabLive) {
    if (hasLiveClass) {
      tabLive.innerHTML = 'Live Now <span class="tab-live-pulse-dot"></span>';
    } else {
      tabLive.innerHTML = 'Live Now';
    }
  }

  const upcomingOrPastClasses = [];

  if (activeTab === 'live') {
    // Show: currently live OR starting within the next 30 minutes (from ALL API classes)
    const now = new Date();
    const soonMs = 30 * 60 * 1000;

    poolForLive.forEach(c => {
      const startVal = c.start || c.startTime || '';
      const endVal   = c.end   || c.endTime   || '';
      if (!startVal) return;
      try {
        const start = new Date(startVal);
        const end   = endVal
          ? new Date(endVal)
          : new Date(start.getTime() + 2 * 60 * 60 * 1000);
        if (isNaN(start.getTime())) return;
        const isToday = start.toDateString() === now.toDateString();
        const isLiveNow      = now >= start && now <= end;
        const isStartingSoon = start > now && (start - now) <= soonMs;
        const hasEndedToday  = isToday && now > end;
        if (isLiveNow || isStartingSoon || hasEndedToday) {
          c._isLiveNow      = isLiveNow;
          c._isStartingSoon = isStartingSoon;
          c._hasEndedToday  = hasEndedToday;
          upcomingOrPastClasses.push(c);
        }
      } catch (e) {}
    });

    if (upcomingOrPastClasses.length === 0) {
      classListContainer.innerHTML = `
        <div class="full-loader" style="grid-column: 1 / -1; background: rgba(10, 11, 16, 0.15); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 3rem; text-align: center; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
          <p style="color: var(--text-secondary); font-size: 0.85rem; font-family: var(--font-display); letter-spacing: 0.05em; text-transform: uppercase; margin: 0;">No classes live right now. Check the Upcoming tab for scheduled sessions.</p>
        </div>
      `;
    } else {
      upcomingOrPastClasses.forEach(c => {
        classListContainer.appendChild(createClassCard(c, c._isLiveNow, c._isStartingSoon));
      });
    }
    return;
  }

  // ── Upcoming tab ──────────────────────────────────────────────────────────
  const now = new Date();
  const upcoming = batchFiltered.filter(c => {
    try {
      const start = new Date(c.start || c.startTime || '');
      const end   = new Date(c.end   || c.endTime   || '');
      const isLive   = !isNaN(start) && !isNaN(end) && now >= start && now <= end;
      const isFuture = !isNaN(start) && start > now;
      return !isLive && isFuture;
    } catch (e) { return false; }
  });

  if (upcoming.length === 0) {
    classListContainer.innerHTML = `
      <div class="full-loader" style="grid-column: 1 / -1; background: rgba(10, 11, 16, 0.15); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 3rem; text-align: center; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
        <p style="color: var(--text-secondary); font-size: 0.85rem; font-family: var(--font-display); letter-spacing: 0.05em; text-transform: uppercase; margin: 0;">No upcoming classes scheduled for ${activeBatch}.</p>
      </div>
    `;
  } else {
    upcoming.forEach(c => classListContainer.appendChild(createClassCard(c, false)));
  }
}

// Helper function to create a class card element
function createClassCard(c, isCurrentlyLive) {
  const title = c.title || c.topic || 'Live Session';
  const instructor = c.faculty ? (c.faculty.name || c.faculty.fullName || 'Faculty') : 'Faculty';
  
  const startVal = c.start || c.startTime || '';
  let dateStr = c.date || '';
  let timeStr = '';
  if (startVal) {
    if (startVal.includes('T')) {
      const parts = startVal.split('T');
      if (!dateStr) dateStr = parts[0];
      timeStr = parts[1];
    } else if (startVal.includes(' ')) {
      const parts = startVal.split(' ');
      if (!dateStr) dateStr = parts[0];
      timeStr = parts[1];
    } else {
      timeStr = startVal;
    }
  }
  
  const formattedTime = formatClassTime(dateStr, timeStr);

  let buttonsHtml = '';
  if (activeTab === 'recordings') {
    const recordingId = c.recordingId || c.recordings?.[0]?.id || '';
    if (recordingId) {
      buttonsHtml = `
        <div style="margin-top: 1rem; width: 100%;">
          <button class="btn btn-primary" onclick="alert('Recording is available on the NNL ONE app. Recording ID: ${recordingId}')" style="width: 100%;">
            <span>Watch Recording</span>
          </button>
        </div>
      `;
    } else {
      buttonsHtml = `
        <div style="margin-top: 1rem; width: 100%;">
          <button class="btn btn-secondary" disabled style="width: 100%;">
            <span>Recording Unavailable</span>
          </button>
        </div>
      `;
    }
  } else {
    // Join button for upcoming or live class
    let buttonText = isCurrentlyLive ? 'Join Live Classroom' : 'Join Class';
    let buttonClass = isCurrentlyLive ? 'btn-zoom' : 'btn-secondary';
    let isDisabled = '';

    if (c._hasEndedToday) {
      buttonText = 'Class Ended';
      buttonClass = 'btn-secondary';
      isDisabled = 'disabled';
    }

    buttonsHtml = `
      <div style="margin-top: 1rem; width: 100%; display: flex; flex-direction: column; gap: 0.5rem;" class="zoom-action-container">
        <button class="btn ${buttonClass} join-embedded-btn" ${isDisabled} data-class-id="${c.id}" data-class-title="${title.replace(/"/g, '&quot;')}" data-class-instructor="${instructor.replace(/"/g, '&quot;')}" style="width: 100%;">
          <span>${buttonText}</span>
        </button>
      </div>
    `;
  }

  let batchLabel = getSimplifiedBatchTitle(c.batch?.title || (c.liveClass?.batch?.title)) || activeBatch;
  const blUpper = batchLabel.toUpperCase();
  if (blUpper === 'NCLEX' || blUpper.includes('NCLEX')) batchLabel = 'NCLEX MASTERS';
  else if (blUpper === 'PSC' || blUpper.includes('STATE PSC')) batchLabel = 'STATE PSC / CHO';
  else if (blUpper === 'MSC' || blUpper.includes('M.SC')) batchLabel = 'M.SC ENTRANCE';

  const card = document.createElement('div');
  card.className = `glass-panel class-card ${isCurrentlyLive ? 'live-card-border' : ''}`;
  let badgeHtml = '';
  if (isCurrentlyLive) {
    badgeHtml = '<div class="live-indicator" style="position: static; margin-bottom: 0;"><div class="live-dot-glow" style="margin-right: 4px; width: 8px; height: 8px;"></div>Live Now</div>';
  } else if (c._hasEndedToday) {
    badgeHtml = '<div class="live-indicator" style="position: static; margin-bottom: 0; background: rgba(255, 255, 255, 0.05); color: var(--text-muted); border-color: rgba(255, 255, 255, 0.1);"><div class="live-dot-glow" style="margin-right: 4px; width: 8px; height: 8px; background: var(--text-muted); box-shadow: none; animation: none;"></div>Ended</div>';
  }

  card.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; width: 100%;">
      <span class="badge-batch">${batchLabel}</span>
      ${badgeHtml}
    </div>
    <span class="class-date-badge">${formattedTime}</span>
    <h3 class="class-title">${title}</h3>
    <div class="class-instructor">
      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      <span>${instructor}</span>
    </div>
    <div class="class-details">
      <span class="class-time">${c.zoom_meet_id ? 'Meeting ID: ' + c.zoom_meet_id : 'Video Lecture'}</span>
    </div>
    ${buttonsHtml}
  `;

  return card;
}

// Delegated handler for Join Embedded Classroom buttons
async function handleJoinClassroomClick(e) {
  const btn = e.target.closest('.join-embedded-btn');
  if (!btn) return;

  const classId = btn.getAttribute('data-class-id');
  const title = btn.getAttribute('data-class-title') || 'Live Class';
  const instructor = btn.getAttribute('data-class-instructor') || 'Faculty';

  if (!classId) return;

  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner" style="width: 14px; height: 14px;"></div> Entering...';

  try {
    await joinEmbeddedClassroom(classId, title, instructor);
  } catch (error) {
    console.error(error);
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
}

// ─── Auto-hide classroom bars on inactivity ───────────────────────────────
function showClassroomBars() {
  const header = document.querySelector('.classroom-header');
  const bar = document.getElementById('classroom-timeline-bar');
  if (header) header.classList.remove('bars-hidden');
  if (bar) bar.classList.remove('bars-hidden');
}

function hideClassroomBars() {
  const header = document.querySelector('.classroom-header');
  const bar = document.getElementById('classroom-timeline-bar');
  if (header) header.classList.add('bars-hidden');
  if (bar) bar.classList.add('bars-hidden');
}

// Show bars temporarily when mouse moves, but only if the sidebar is collapsed.
function showBarsTemporarily() {
  const sidebar = document.getElementById('timeline-sidebar');
  if (!sidebar) return;

  if (!sidebar.classList.contains('collapsed')) {
    clearTimeout(barsHideTimerId);
    showClassroomBars();
    return;
  }

  showClassroomBars();
  clearTimeout(barsHideTimerId);
  barsHideTimerId = setTimeout(() => {
    if (sidebar.classList.contains('collapsed')) {
      hideClassroomBars();
    }
  }, 2000);
}

// Bind delegated listeners for class lists
classListContainer.addEventListener('click', handleJoinClassroomClick);
liveNowContainer.addEventListener('click', handleJoinClassroomClick);

// Classroom control buttons listeners
closeClassroomBtn.addEventListener('click', exitClassroom);

// Hover / movement listener on viewport to show bars temporarily when collapsed
const playerViewport = document.getElementById('player-viewport');
if (playerViewport) {
  playerViewport.addEventListener('mousemove', showBarsTemporarily);
  playerViewport.addEventListener('mouseenter', showBarsTemporarily);
}
if (toggleChatBtn) {
  toggleChatBtn.addEventListener('click', () => {
    switchSidebarTab('chat');
  });
}
if (toggleParticipantsBtn) {
  toggleParticipantsBtn.addEventListener('click', () => {
    switchSidebarTab('participants');
  });
}
manualCaptureBtn.addEventListener('click', captureClassroomSlide);

// Volume Controls Event Listeners (Bottom Bar only now)
const volumeSliders = [document.getElementById('bottom-volume-slider')];
volumeSliders.forEach(slider => {
  if (slider) {
    slider.addEventListener('input', (e) => {
      currentVolume = parseInt(e.target.value, 10);
      localStorage.setItem('nnl_classroom_volume', currentVolume);
      updateVolumeUI();
      applyVolumeToIframe();
    });
  }
});

const volumeMuteBtns = [document.getElementById('bottom-volume-mute-btn')];
volumeMuteBtns.forEach(btn => {
  if (btn) {
    btn.addEventListener('click', () => {
      if (currentVolume > 0) {
        localStorage.setItem('nnl_classroom_prev_volume', currentVolume);
        currentVolume = 0;
      } else {
        const prev = parseInt(localStorage.getItem('nnl_classroom_prev_volume') || '80', 10);
        currentVolume = prev > 0 ? prev : 80;
      }
      localStorage.setItem('nnl_classroom_volume', currentVolume);
      updateVolumeUI();
      applyVolumeToIframe();
    });
  }
});

// Sidebar tab click listeners — also trigger an immediate data sync so chat/participants populate instantly
document.getElementById('sidebar-tab-timeline')?.addEventListener('click', () => switchSidebarTab('timeline'));
document.getElementById('sidebar-tab-chat')?.addEventListener('click', () => {
  switchSidebarTab('chat');
  // Force an immediate monitor cycle so chat renders without waiting for the interval
  syncClassroomData();
});
document.getElementById('sidebar-tab-participants')?.addEventListener('click', () => {
  switchSidebarTab('participants');
  syncClassroomData();
});

// Initialize volume UI
updateVolumeUI();

if (headerRewindPrevBtn) {
  headerRewindPrevBtn.addEventListener('click', () => {
    const val = parseInt(timelineSlider.value, 10);
    if (val > 0) seekToSliderValue(val - 1);
  });
}

if (headerRewindNextBtn) {
  headerRewindNextBtn.addEventListener('click', () => {
    const val = parseInt(timelineSlider.value, 10);
    if (val < currentTimelineSlides.length) seekToSliderValue(val + 1);
  });
}

// Old headerFullscreenBtn block removed — fullscreen now lives in #bottom-fullscreen-btn (see below)

// Sidebar collapse / expand
function toggleSidebar(forceCollapsed) {
  const sidebar = document.getElementById('timeline-sidebar');
  if (!sidebar) return;
  const shouldCollapse = forceCollapsed !== undefined
    ? forceCollapsed
    : !sidebar.classList.contains('collapsed');
  sidebar.classList.toggle('collapsed', shouldCollapse);
  localStorage.setItem('nnl_sidebar_collapsed', shouldCollapse ? '1' : '0');
  // Flip the pull-tab arrow: points right when collapsed (open), left when expanded (close)
  if (toggleSidebarBtn) {
    const icon = document.getElementById('sidebar-pull-icon');
    if (icon) {
      icon.querySelector('path').setAttribute('d',
        shouldCollapse
          ? 'M9 5l7 7-7 7'    // >
          : 'M15 19l-7-7 7-7' // <
      );
    }
    toggleSidebarBtn.classList.toggle('collapsed', shouldCollapse);
  }
  // Collapse bars when sidebar closes (full immersive view); restore when it opens
  clearTimeout(barsHideTimerId);
  if (shouldCollapse) {
    hideClassroomBars();
  } else {
    showClassroomBars();
  }
}

if (toggleSidebarBtn) {
  toggleSidebarBtn.addEventListener('click', () => toggleSidebar());
}
// No separate close-sidebar-btn anymore — pull-tab handles both open and close

// Fullscreen (now in bottom bar)
if (bottomFullscreenBtn) {
  bottomFullscreenBtn.addEventListener('click', () => {
    const viewport = document.getElementById('player-viewport');
    if (!viewport) return;
    if (!document.fullscreenElement) {
      viewport.requestFullscreen().catch(err =>
        console.error('Fullscreen error:', err.message)
      );
    } else {
      document.exitFullscreen();
    }
  });
}

if (clearTimelineBtn) {
  clearTimelineBtn.addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear all captured slides for this class?')) {
      currentTimelineSlides = [];
      
      // Clear from IndexedDB
      if (currentMeetingId) {
        try {
          const db = await dbPromise;
          if (db) {
            const tx = db.transaction('slides', 'readwrite');
            const store = tx.objectStore('slides');
            const index = store.index('meetingId');
            const request = index.getAll(IDBKeyRange.only(currentMeetingId));
            const records = await new Promise((resolve, reject) => {
              request.onsuccess = () => resolve(request.result);
              request.onerror = () => reject(request.error);
            });
            
            const deleteTx = db.transaction('slides', 'readwrite');
            const deleteStore = deleteTx.objectStore('slides');
            for (const rec of records) {
              deleteStore.delete(rec.id);
            }
            console.log(`Cleared all IndexedDB records for meeting: ${currentMeetingId}`);
          }
        } catch (e) {
          console.error('Failed to clear slides from IndexedDB:', e);
        }
      }

      // Exit rewind mode
      inRewindMode = false;
      currentSelectedSlideTimestamp = null;
      
      // Render and update
      renderTimeline();
      updateTimelineSlider();
    }
  });
}

// Seek Slider and Navigation Controls listeners
if (timelineSlider) {
  timelineSlider.addEventListener('input', (e) => {
    seekToSliderValue(parseInt(e.target.value, 10));
  });
}

if (liveIndicatorBtn) {
  liveIndicatorBtn.addEventListener('click', () => {
    seekToSliderValue(currentTimelineSlides.length);
  });
}

if (rewindPrevBtn) {
  rewindPrevBtn.addEventListener('click', () => {
    const val = parseInt(timelineSlider.value, 10);
    if (val > 0) seekToSliderValue(val - 1);
  });
}

if (rewindNextBtn) {
  rewindNextBtn.addEventListener('click', () => {
    const val = parseInt(timelineSlider.value, 10);
    if (val < currentTimelineSlides.length) seekToSliderValue(val + 1);
  });
}

// Clicking the overlay image expands it in the Lightbox modal
if (rewindImg) {
  rewindImg.addEventListener('click', () => {
    if (inRewindMode && currentSelectedSlideTimestamp !== null) {
      const slide = currentTimelineSlides.find(s => s.timestamp === currentSelectedSlideTimestamp);
      if (slide) {
        lightboxImg.src = slide.imgSrc;
        lightboxTime.textContent = `Captured at ${slide.time}`;
        lightboxModal.classList.remove('hide');
      }
    }
  });
}

// Timeline sidebar item click listener: seeks player directly to that slide snapshot
timelineList.addEventListener('click', (e) => {
  const item = e.target.closest('.timeline-item');
  if (!item) return;

  const timestamp = parseInt(item.getAttribute('data-timestamp'), 10);
  const slide = currentTimelineSlides.find(s => s.timestamp === timestamp);
  if (!slide) return;

  inRewindMode = true;
  currentSelectedSlideTimestamp = slide.timestamp;
  updateTimelineSlider();
});

// Lightbox modal close listeners
closeLightbox.addEventListener('click', () => {
  lightboxModal.classList.add('hide');
});

lightboxModal.addEventListener('click', (e) => {
  if (e.target === lightboxModal) {
    lightboxModal.classList.add('hide');
  }
});

// Download slide snapshot
downloadSlideBtn.addEventListener('click', () => {
  const src = lightboxImg.src;
  if (!src) return;

  const a = document.createElement('a');
  a.href = src;
  a.download = `NNL_Slide_Snapshot_${lightboxTime.textContent.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

// Handle Login request (Send OTP)
phoneForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAlert();
  const phone = phoneInput.value.trim();

  if (phone.length !== 10 || isNaN(phone)) {
    showAlert('Please enter a valid 10-digit mobile number.');
    return;
  }

  const sendBtn = document.getElementById('send-otp-btn');
  const originalBtnText = sendBtn.innerHTML;
  sendBtn.disabled = true;
  sendBtn.innerHTML = '<div class="spinner"></div> Sending...';

  try {
    const response = await fetch('/api/auth/v2/login/otp/send/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        isdCode: 91,
        mobile: phone,
        send_on: 1
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(extractErrorMessage(data, 'Failed to send OTP. Please try again.'));
    }

    // Save token and transition UI
    flowToken = data.token || data.data?.token || '';
    if (!flowToken) {
      // In some backends, they don't return a token but directly validate via phone
      flowToken = 'DIRECT_VALIDATION';
    }

    localStorage.setItem('nnl_temp_phone', phone);
    showAlert('OTP sent successfully!', 'success');
    phoneStep.classList.add('hide');
    otpStep.classList.remove('hide');
    otpInput.focus();

  } catch (error) {
    console.error('Send OTP Error:', error);
    showAlert(error.message || 'Failed to request OTP. Ensure your number is registered.');
  } finally {
    sendBtn.disabled = false;
    sendBtn.innerHTML = originalBtnText;
  }
});

// Handle Verification request (Validate OTP)
otpForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAlert();
  const otp = otpInput.value.trim();
  const phone = localStorage.getItem('nnl_temp_phone');
  const deviceId = getOrCreateDeviceId();

  if (otp.length !== 6 || isNaN(otp)) {
    showAlert('Please enter a valid 6-digit OTP.');
    return;
  }

  const verifyBtn = document.getElementById('verify-otp-btn');
  const originalBtnText = verifyBtn.innerHTML;
  verifyBtn.disabled = true;
  verifyBtn.innerHTML = '<div class="spinner"></div> Verifying...';

  try {
    const response = await fetch('/api/auth/login/otp/validate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        code: otp,
        device_id: deviceId,
        device_name: "PC Browser",
        force_login: true,
        token: flowToken
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(extractErrorMessage(data, 'OTP verification failed. Check the code.'));
    }

    // Capture token
    const tokenData = data.data || data;
    const token = tokenData.access || tokenData.access_token || tokenData.token;
    const refreshToken = tokenData.refresh || tokenData.refresh_token || '';

    if (!token) {
      throw new Error('Authentication succeeded but no access token was returned.');
    }

    // Store session
    localStorage.setItem('nnl_access_token', token);
    if (refreshToken) localStorage.setItem('nnl_refresh_token', refreshToken);
    localStorage.setItem('nnl_phone', phone);

    showAlert('Logged in successfully!', 'success');
    
    // Clear inputs and transition
    otpInput.value = '';
    phoneInput.value = '';
    otpStep.classList.add('hide');
    phoneStep.classList.remove('hide');

    checkLoginState();

  } catch (error) {
    console.error('Verify OTP Error:', error);
    showAlert(error.message || 'OTP verification failed. Please try again.');
  } finally {
    verifyBtn.disabled = false;
    verifyBtn.innerHTML = originalBtnText;
  }
});

// Back button handler
document.getElementById('back-to-phone-btn').addEventListener('click', () => {
  clearAlert();
  otpStep.classList.add('hide');
  phoneStep.classList.remove('hide');
  phoneInput.focus();
});

// Guest login handler
const guestLoginBtn = document.getElementById('guest-login-btn');
if (guestLoginBtn) {
  guestLoginBtn.addEventListener('click', () => {
    clearAlert();
    localStorage.setItem('nnl_access_token', 'GUEST_DEMO_TOKEN');
    localStorage.setItem('nnl_phone', 'Guest User');
    showAlert('Logged in as Guest!', 'success');
    
    // Reset/clear login screen inputs
    if (phoneInput) phoneInput.value = '';
    if (otpInput) otpInput.value = '';
    otpStep.classList.add('hide');
    phoneStep.classList.remove('hide');

    checkLoginState();
  });
}

// Silent token refresh — call /api/auth/token/refresh/ with the stored refresh token.
// Returns true if a new access token was successfully obtained and stored.
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('nnl_refresh_token');
  if (!refreshToken) return false;

  try {
    const response = await fetch('/api/auth/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken })
    });

    if (!response.ok) return false;

    const data = await response.json();
    const newToken = data.access || data.access_token || data.token;
    if (!newToken) return false;

    localStorage.setItem('nnl_access_token', newToken);
    if (data.refresh) localStorage.setItem('nnl_refresh_token', data.refresh);
    console.log('Access token refreshed silently.');
    return true;
  } catch (e) {
    console.warn('Silent token refresh failed:', e);
    return false;
  }
}

// Logout handler
function handleLogout() {
  localStorage.removeItem('nnl_access_token');
  localStorage.removeItem('nnl_refresh_token');
  localStorage.removeItem('nnl_cache_live_classes_live');
  localStorage.removeItem('nnl_cache_live_classes_upcoming');
  localStorage.removeItem('nnl_cache_live_classes_recordings');
  // Keep nnl_phone to make re-login easier, unless it was a Guest session!
  if (localStorage.getItem('nnl_phone') === 'Guest User') {
    localStorage.removeItem('nnl_phone');
  }
  checkLoginState();
}

logoutBtn.addEventListener('click', handleLogout);

// Tab Navigation handlers
tabLive.addEventListener('click', () => {
  if (activeTab === 'live') return;
  activeTab = 'live';
  tabLive.classList.add('active');
  tabUpcoming.classList.remove('active');
  tabRecordings.classList.remove('active');
  loadDashboard();
});

tabUpcoming.addEventListener('click', () => {
  if (activeTab === 'upcoming') return;
  activeTab = 'upcoming';
  tabUpcoming.classList.add('active');
  tabLive.classList.remove('active');
  tabRecordings.classList.remove('active');
  loadDashboard();
});

tabRecordings.addEventListener('click', () => {
  if (activeTab === 'recordings') return;
  activeTab = 'recordings';
  tabRecordings.classList.add('active');
  tabLive.classList.remove('active');
  tabUpcoming.classList.remove('active');
  loadDashboard();
});

if (tabAllVideos) {
  tabAllVideos.addEventListener('click', () => {
    window.location.href = '/all-videos.html';
  });
}

// Refetch button handler
if (refetchBtn) {
  refetchBtn.addEventListener('click', loadDashboard);
}

// ─── Nightingale Redesign Scripts ───────────────────────────────────────

let activeBatch = localStorage.getItem('nnl_active_batch') || 'Blue Sapphire Batch';

function updateFavicon() {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Draw background circle
    ctx.fillStyle = '#050608';
    ctx.beginPath();
    ctx.arc(16, 16, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Get active accent color (pink/cyan/amber/emerald) from body class
    let accent = '#ff0055';
    if (document.body.classList.contains('tweak-cyan-mode')) accent = '#00f0ff';
    else if (document.body.classList.contains('tweak-amber-mode')) accent = '#ffaa00';
    else if (document.body.classList.contains('tweak-emerald-mode')) accent = '#00ff66';
    
    const pts = [
      {x: 3, y: 16},
      {x: 11, y: 16},
      {x: 13, y: 7},
      {x: 16, y: 25},
      {x: 18, y: 11},
      {x: 20, y: 16},
      {x: 29, y: 16}
    ];

    // Draw solid glowing heartbeat line
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    // Glow effect
    ctx.shadowColor = accent;
    ctx.shadowBlur = 4;
    
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.stroke();
    
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = canvas.toDataURL('image/png');
  } catch (e) {
    console.warn('Favicon generation failed:', e);
  }
}

function initTweaksPanel() {
  const colorDots = document.querySelectorAll('.cyber-tweaks-widget .color-dot');
  colorDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      colorDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      const color = dot.getAttribute('data-color');
      
      // Remove old classes
      document.body.classList.remove('tweak-cyan-mode', 'tweak-amber-mode', 'tweak-emerald-mode');
      localStorage.setItem('nnl_tweak_color', color);
      
      if (color === 'cyan') document.body.classList.add('tweak-cyan-mode');
      else if (color === 'amber') document.body.classList.add('tweak-amber-mode');
      else if (color === 'emerald') document.body.classList.add('tweak-emerald-mode');
      
      updateFavicon();
    });
  });
  
  // Restore saved color tweak
  const savedColor = localStorage.getItem('nnl_tweak_color') || 'pink';
  const activeDot = document.querySelector(`.cyber-tweaks-widget .color-dot[data-color="${savedColor}"]`);
  if (activeDot) {
    activeDot.click();
  }
  
  // Toggle ambient glow
  const toggleGlowBtn = document.getElementById('toggle-ambient-glow');
  if (toggleGlowBtn) {
    const savedGlow = localStorage.getItem('nnl_tweak_glow') !== 'false';
    if (!savedGlow) {
      toggleGlowBtn.classList.remove('active');
      toggleGlowBtn.textContent = 'OFF';
      document.body.classList.add('tweak-no-glow');
    }
    
    toggleGlowBtn.addEventListener('click', () => {
      const active = toggleGlowBtn.classList.toggle('active');
      toggleGlowBtn.textContent = active ? 'ON' : 'OFF';
      localStorage.setItem('nnl_tweak_glow', active ? 'true' : 'false');
      if (active) {
        document.body.classList.remove('tweak-no-glow');
      } else {
        document.body.classList.add('tweak-no-glow');
      }
    });
  }
  
  // Toggle scanlines
  const toggleScanlinesBtn = document.getElementById('toggle-scanlines');
  if (toggleScanlinesBtn) {
    const savedScanlines = localStorage.getItem('nnl_tweak_scanlines') !== 'false';
    if (!savedScanlines) {
      toggleScanlinesBtn.classList.remove('active');
      toggleScanlinesBtn.textContent = 'OFF';
      document.body.classList.add('tweak-no-scanlines');
    }
    
    toggleScanlinesBtn.addEventListener('click', () => {
      const active = toggleScanlinesBtn.classList.toggle('active');
      toggleScanlinesBtn.textContent = active ? 'ON' : 'OFF';
      localStorage.setItem('nnl_tweak_scanlines', active ? 'true' : 'false');
      if (active) {
        document.body.classList.remove('tweak-no-scanlines');
      } else {
        document.body.classList.add('tweak-no-scanlines');
      }
    });
  }
  
  // Toggle tweaks panel open/close
  const toggleBtn = document.getElementById('tweak-panel-toggle-btn');
  const tweaksWidget = document.querySelector('.cyber-tweaks-widget');
  if (toggleBtn && tweaksWidget) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      tweaksWidget.classList.toggle('open');
    });
    
    // Close tweaks widget if clicking outside
    document.addEventListener('click', (e) => {
      if (!tweaksWidget.contains(e.target) && e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
        tweaksWidget.classList.remove('open');
      }
    });
  }
}

function renderBatchSelector() {
  const dropdown = document.getElementById('header-batch-dropdown');
  const label = document.getElementById('current-batch-label');
  if (!dropdown) return;
  
  // Extract clean classes from current classesData
  const cleanClasses = [];
  if (classesData && classesData.length > 0) {
    classesData.forEach(item => {
      if (item.classes && Array.isArray(item.classes)) {
        cleanClasses.push(...item.classes);
      } else if (item.liveClass) {
        cleanClasses.push(item.liveClass);
      } else {
        cleanClasses.push(item);
      }
    });
  }
  
  // Find all unique batch titles, starting with our main defaults so they are always available
  const batchTitles = new Set([
    'Blue Sapphire Batch',
    'Pearl Batch',
    'Fastrack 10.0 (Live Class)',
    'Live Classes for Brahmastra (NORCET 10.0 Mains)',
    'Economy Batch (NORCET 10.0)'
  ]);
  cleanClasses.forEach(c => {
    const title = c.batch?.title || (c.liveClass?.batch?.title);
    if (title) {
      batchTitles.add(getSimplifiedBatchTitle(title));
    }
  });
  
  const batches = Array.from(batchTitles);
  
  // Ensure activeBatch is set, defaulting to Blue Sapphire Batch if empty or invalid
  if (!activeBatch || !batches.includes(activeBatch)) {
    activeBatch = 'Blue Sapphire Batch';
    localStorage.setItem('nnl_active_batch', activeBatch);
  }
  
  // Update the label in the header button
  if (label) {
    label.textContent = activeBatch;
  }
  
  // Build dropdown items
  dropdown.innerHTML = batches.map(batch => {
    const isActive = batch === activeBatch;
    return `
      <button class="dropdown-item ${isActive ? 'active' : ''}" data-batch="${batch}">
        ${batch}
      </button>
    `;
  }).join('');
  
  // Bind click listeners to dropdown items
  const items = dropdown.querySelectorAll('.dropdown-item');
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      activeBatch = item.getAttribute('data-batch');
      localStorage.setItem('nnl_active_batch', activeBatch);
      
      // Update label
      if (label) label.textContent = activeBatch;
      
      // Update active classes inside dropdown
      dropdown.querySelectorAll('.dropdown-item').forEach(btn => btn.classList.remove('active'));
      item.classList.add('active');
      
      // Close dropdown
      dropdown.classList.add('hide');
      
      // Rerender classes
      renderClasses(classesData);
    });
  });
}

function initBatchSelection() {
  const savedBatch = localStorage.getItem('nnl_active_batch') || 'Blue Sapphire Batch';
  activeBatch = savedBatch;
  
  // Render batch selector dropdown instantly on load with default or cached batches
  renderBatchSelector();
  
  const batchBtn = document.getElementById('header-batch-btn');
  const dropdown = document.getElementById('header-batch-dropdown');
  if (batchBtn && dropdown) {
    batchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hide');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      dropdown.classList.add('hide');
    });
  }
}

function getMockClassesForBatch(batch, tab) {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const isSapphire = batch.toUpperCase().includes('SAPPHIRE') || batch.toUpperCase().includes('BLUE');
  
  if (tab === 'live') {
    if (isSapphire) {
      return [
        {
          id: 'mock-sapphire-live-1',
          title: 'Pharmacology Day 1 (Part 1): Anti-Hypertensive Drugs & Cardiac Assessment',
          faculty: { name: 'Dr. Suresh Sharma' },
          start: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
          end: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
          zoom_meet_id: '82930283021',
          passcode: '908123',
          batch: { title: 'Blue Sapphire Batch' }
        },
        {
          id: 'mock-sapphire-live-2',
          title: 'Pharmacology Day 1 (Part 2): Anti-Hypertensive Drugs & Cardiac Assessment',
          faculty: { name: 'Dr. Suresh Sharma' },
          start: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
          end: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
          zoom_meet_id: '82930283022',
          passcode: '908124',
          batch: { title: 'Blue Sapphire Batch' }
        }
      ];
    } else {
      return [
        {
          id: 'mock-pearl-live-1',
          title: 'Community Health Nursing Day 6 (Part 1): Maternal & Child Health Indicators',
          faculty: { name: 'Mukhminder Singh' },
          start: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
          end: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
          zoom_meet_id: '81293028302',
          passcode: '123456',
          batch: { title: 'Pearl Batch' }
        },
        {
          id: 'mock-pearl-live-2',
          title: 'Community Health Nursing Day 6 (Part 2): Maternal & Child Health Indicators',
          faculty: { name: 'Mukhminder Singh' },
          start: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
          end: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
          zoom_meet_id: '81293028303',
          passcode: '123456',
          batch: { title: 'Pearl Batch' }
        }
      ];
    }
  } else if (tab === 'upcoming') {
    if (isSapphire) {
      return [
        {
          id: 'mock-sapphire-up-1',
          title: 'Cardiovascular Nursing: ECG Interpretation & Heart Block Management',
          faculty: { name: 'Dr. Suresh Sharma' },
          start: tomorrow.toISOString(),
          end: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000).toISOString(),
          zoom_meet_id: '82930283022',
          passcode: '908124',
          batch: { title: 'Blue Sapphire Batch' }
        }
      ];
    } else {
      return [
        {
          id: 'mock-pearl-up-1',
          title: 'Pediatric Care: Immunization Schedule & Neonatal Reflexes',
          faculty: { name: 'Mukhminder Singh' },
          start: tomorrow.toISOString(),
          end: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000).toISOString(),
          zoom_meet_id: '83920192039',
          passcode: '778900',
          batch: { title: 'Pearl Batch' }
        }
      ];
    }
  } else {
    if (isSapphire) {
      return [
        {
          id: 'mock-sapphire-rec-1',
          title: 'Endocrine Pharmacology: Insulin Therapy & Oral Hypoglycemic Agents',
          faculty: { name: 'Dr. Suresh Sharma' },
          start: yesterday.toISOString(),
          zoom_meet_id: '82930283023',
          passcode: '908125',
          batch: { title: 'Blue Sapphire Batch' }
        }
      ];
    } else {
      return [
        {
          id: 'mock-pearl-rec-1',
          title: 'Epidemiology: Prevention levels & Communicable Disease Control',
          faculty: { name: 'Mukhminder Singh' },
          start: yesterday.toISOString(),
          zoom_meet_id: '83920192040',
          passcode: '778901',
          batch: { title: 'Pearl Batch' }
        }
      ];
    }
  }
}


// ─── Auto-bypass Zoom Pre-join Name Screen ──────────────────────────────────
// Polls the iframe DOM every 400ms (up to 30s) looking for the name input
// and Join button, then auto-fills the name and clicks Join.
function autoJoinZoomPrejoin(iframe, displayName) {
  let attempts = 0;
  const maxAttempts = 75; // 30 seconds

  function tryFill() {
    attempts++;
    if (attempts > maxAttempts) return; // give up

    let iframeDoc = null;
    try {
      iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    } catch (e) {
      // cross-origin not yet resolved — keep polling
      setTimeout(tryFill, 400);
      return;
    }

    if (!iframeDoc || iframeDoc.readyState === 'loading') {
      setTimeout(tryFill, 400);
      return;
    }

    // Target the name input — Zoom Web Client uses several possible selectors
    const nameInput =
      iframeDoc.querySelector('input#inputname') ||
      iframeDoc.querySelector('input[placeholder*="name" i]') ||
      iframeDoc.querySelector('input[id*="name" i]') ||
      iframeDoc.querySelector('input[autocomplete="name"]') ||
      iframeDoc.querySelector('.preview-meeting-info input[type="text"]') ||
      iframeDoc.querySelector('input[type="text"]');

    // Target the Join button
    const joinBtn =
      iframeDoc.querySelector('button#joinBtn') ||
      iframeDoc.querySelector('button[class*="join" i]') ||
      iframeDoc.querySelector('button[id*="join" i]') ||
      Array.from(iframeDoc.querySelectorAll('button')).find(b =>
        /^join$/i.test(b.textContent.trim())
      );

    if (nameInput && joinBtn) {
      // Fill the name field using native input value setter so React/Vue state updates
      const nativeInputSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 'value'
      )?.set;

      if (nativeInputSetter) {
        nativeInputSetter.call(nameInput, displayName);
      } else {
        nameInput.value = displayName;
      }

      // Fire input + change events so the framework registers the value
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      nameInput.dispatchEvent(new Event('change', { bubbles: true }));

      // Also check/uncheck "Remember my name" if present
      const rememberCheckbox = iframeDoc.querySelector('input[type="checkbox"]');
      if (rememberCheckbox && !rememberCheckbox.checked) {
        // leave unchecked — don't save name in Zoom's own storage
      }

      // Small delay so the framework can update button enabled-state
      setTimeout(() => {
        if (!joinBtn.disabled) {
          joinBtn.click();
          console.log('[AutoJoin] Clicked Join button, name:', displayName);
        } else {
          // Button still disabled — wait and retry
          setTimeout(tryFill, 400);
        }
      }, 300);
    } else {
      // Form not visible yet — keep polling
      setTimeout(tryFill, 400);
    }
  }

  // Start polling once iframe fires its first load event
  iframe.addEventListener('load', () => {
    attempts = 0; // reset on each navigation inside the iframe
    setTimeout(tryFill, 600);
  }, { passive: true });

  // Also start immediately in case the load event already fired
  setTimeout(tryFill, 800);
}

// Initialize on page load
getOrCreateDeviceId();
checkLoginState();
updateFavicon();
initTweaksPanel();
initBatchSelection();
initBackgroundParallax();
initRecordingsViewer();


// ─── Grouped Recorded Lectures & Interactive Parallax redone ─────────────────

const MOCK_RECORDINGS = [
  {
    id: 'rec-sapphire-1',
    title: 'Pharmacology Day 1: Anti-Hypertensive Drugs & Cardiac Assessment',
    instructor: 'Dr. Suresh Sharma',
    batch: 'Blue Sapphire Batch',
    subject: 'Pharmacology',
    date: '2026-06-05',
    duration: '2h 15m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  },
  {
    id: 'rec-sapphire-2',
    title: 'Pharmacology Day 2: Diuretics & Renin-Angiotensin System',
    instructor: 'Dr. Suresh Sharma',
    batch: 'Blue Sapphire Batch',
    subject: 'Pharmacology',
    date: '2026-06-06',
    duration: '1h 50m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
  },
  {
    id: 'rec-sapphire-3',
    title: 'Cardiology Day 1: ECG Interpretation Fundamentals',
    instructor: 'Dr. Suresh Sharma',
    batch: 'Blue Sapphire Batch',
    subject: 'Cardiology',
    date: '2026-06-04',
    duration: '2h 30m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
  },
  {
    id: 'rec-pearl-1',
    title: 'Community Health Nursing: Maternal & Child Health Indicators',
    instructor: 'Mukhminder Singh',
    batch: 'Pearl Batch',
    subject: 'Community Health Nursing',
    date: '2026-06-05',
    duration: '1h 45m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
  },
  {
    id: 'rec-pearl-2',
    title: 'Community Health Nursing: Immunization Schedules & Cold Chain',
    instructor: 'Mukhminder Singh',
    batch: 'Pearl Batch',
    subject: 'Community Health Nursing',
    date: '2026-06-06',
    duration: '2h 05m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
  },
  {
    id: 'rec-pearl-3',
    title: 'Pediatric Care: Neonatal Reflexes & Growth Assessment',
    instructor: 'Mukhminder Singh',
    batch: 'Pearl Batch',
    subject: 'Pediatrics',
    date: '2026-06-03',
    duration: '1h 30m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4'
  }
];

let currentRecordings = [];

function getSubjectFromTitle(title) {
  const t = title.toUpperCase();
  if (t.includes('PHARMACOLOGY') || t.includes('DRUG')) return 'Pharmacology';
  if (t.includes('COMMUNITY') || t.includes('HEALTH') || t.includes('EPIDEMIOLOGY')) return 'Community Health Nursing';
  if (t.includes('PEDIATRIC') || t.includes('NEONATAL') || t.includes('REFLEX')) return 'Pediatrics';
  if (t.includes('CARDIAC') || t.includes('CARDIOVASCULAR') || t.includes('ECG') || t.includes('HEART')) return 'Cardiology';
  if (t.includes('ENDOCRINE') || t.includes('INSULIN') || t.includes('DIABETES')) return 'Endocrine System';
  if (t.includes('NURSING') && t.includes('FOUNDATION')) return 'Nursing Foundations';
  return 'General Nursing';
}

function renderRecordings(classes) {
  classListContainer.innerHTML = '';
  classListContainer.style.display = 'block'; // Block display for structured accordion
  
  // Combine custom mock list and api-fetched classes (avoiding duplicates)
  const allRecordings = [...MOCK_RECORDINGS];
  
  if (classes && classes.length > 0) {
    classes.forEach(c => {
      const title = c.title || c.topic || 'Recorded Lecture';
      const batchTitle = c.batch?.title || (c.liveClass?.batch?.title) || activeBatch;
      const instructor = c.faculty ? (c.faculty.name || c.faculty.fullName || 'Faculty') : 'Faculty';
      const recordingId = c.recordingId || c.recordings?.[0]?.id || '';
      
      if (recordingId && !allRecordings.some(r => r.id === c.id || r.title === title)) {
        allRecordings.push({
          id: c.id,
          title: title,
          instructor: instructor,
          batch: batchTitle,
          subject: getSubjectFromTitle(title),
          date: c.start ? c.start.split('T')[0] : '',
          duration: '2h 00m',
          videoUrl: '' // Zoom link fallback (unavailable directly online)
        });
      }
    });
  }
  
  currentRecordings = allRecordings;

  // Filter recordings for the selected batch
  const filteredRecordings = allRecordings.filter(r => {
    const recordBatch = getSimplifiedBatchTitle(r.batch);
    const targetBatch = getSimplifiedBatchTitle(activeBatch);
    return recordBatch === targetBatch;
  });

  // Group by Subject
  const bySubject = {};
  filteredRecordings.forEach(r => {
    const s = r.subject || 'General Nursing';
    if (!bySubject[s]) bySubject[s] = [];
    bySubject[s].push(r);
  });
  
  const subjectNames = Object.keys(bySubject).sort();
  if (subjectNames.length === 0) {
    classListContainer.innerHTML = `
      <div class="full-loader" style="grid-column: 1 / -1; background: rgba(10, 11, 16, 0.15); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 3rem; text-align: center; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
        <p style="color: var(--text-secondary); font-size: 0.85rem; font-family: var(--font-display); letter-spacing: 0.05em; text-transform: uppercase; margin: 0;">No recorded lectures available for ${activeBatch}.</p>
      </div>
    `;
    return;
  }
  
  const browserDiv = document.createElement('div');
  browserDiv.className = 'recordings-browser';
  
  // Lecture Library heading
  const libraryHeader = document.createElement('div');
  libraryHeader.style.marginBottom = '1.5rem';
  libraryHeader.innerHTML = `
    <span class="cyber-hero-badge" style="display: inline-block; margin-bottom: 0.5rem;">// PAST RECORDINGS</span>
    <h2 style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 900; background: var(--grad-text); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 0.06em; margin: 0 0 0.35rem;">LECTURE <span style="-webkit-text-fill-color: #00f3d0;">LIBRARY</span></h2>
    <p style="color: var(--text-secondary); font-size: 0.8rem; margin: 0;">${activeBatch} &mdash; Past recorded sessions grouped by subject</p>
  `;
  browserDiv.appendChild(libraryHeader);

  subjectNames.forEach(subjectName => {
    const subjectClasses = bySubject[subjectName];
    
    let rowsHtml = '';
    subjectClasses.forEach((rec, idx) => {
      const rowNum = (idx + 1).toString().padStart(2, '0');
      const hasUrl = !!rec.videoUrl;
      
      rowsHtml += `
        <div class="recording-row" data-rec-id="${rec.id}">
          <div class="recording-row-num">${rowNum}</div>
          <div class="recording-row-info">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <div class="recording-row-title" title="${rec.title}" style="margin-bottom: 0;">${rec.title}</div>
            </div>
            <div class="recording-row-meta" style="margin-top: 0.25rem;">
              <span class="recording-row-instructor">${rec.instructor}</span>
              <span>•</span>
              <span>${rec.date}</span>
              <span>•</span>
              <span>${rec.duration}</span>
            </div>
          </div>
          <button class="recording-row-action ${hasUrl ? '' : 'unavailable'}" data-rec-id="${rec.id}">
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" style="margin-right: 0.25rem;">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span>${hasUrl ? 'Play' : 'Mobile App'}</span>
          </button>
        </div>
      `;
    });
    
    const subjectAccordion = document.createElement('div');
    subjectAccordion.className = `subject-accordion open`;
    
    subjectAccordion.innerHTML = `
      <div class="subject-accordion-header">
        <div class="subject-accordion-title">
          <div class="subject-icon">📚</div>
          <span class="subject-name">${subjectName}</span>
          <span class="subject-count">(${subjectClasses.length} lectures)</span>
        </div>
        <svg class="subject-chevron" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
        </svg>
      </div>
      <div class="subject-accordion-body">
        ${rowsHtml}
      </div>
    `;
    
    browserDiv.appendChild(subjectAccordion);
  });
  
  classListContainer.appendChild(browserDiv);
}

function initBackgroundParallax() {
  const wrapper = document.querySelector('.bg-drift-wrapper');
  if (!wrapper) return;
  
  let currentX = 0;
  let currentY = 0;
  
  function updateParallax(timestamp) {
    const t = timestamp / 1000; // seconds
    
    // Slow continuous auto-drift — more visible, purely time-based.
    // X: gentle side-to-side on a 16-second sine cycle (±15px)
    // Y: slower up-down on a 22-second cosine cycle    (±10px)
    const targetX = Math.sin(t / 16) * 15;
    const targetY = Math.cos(t / 22) * 10;
    
    // Lerp at 0.025 for smooth, jitter-free following of the sine target.
    currentX += (targetX - currentX) * 0.025;
    currentY += (targetY - currentY) * 0.025;
    
    wrapper.style.transform = `scale(1.03) translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(updateParallax);
  }
  
  requestAnimationFrame(updateParallax);
}

function initRecordingsViewer() {
  const closeViewerBtn = document.getElementById('close-recording-viewer');
  if (closeViewerBtn) {
    closeViewerBtn.addEventListener('click', () => {
      const viewer = document.getElementById('recording-viewer');
      const videoEl = document.getElementById('recording-video');
      if (viewer) viewer.classList.add('hide');
      if (videoEl) {
        videoEl.pause();
        videoEl.src = '';
      }
    });
  }
  
  classListContainer.addEventListener('click', handleRecordingsClick);
}

function handleRecordingsClick(e) {
  const batchHeader = e.target.closest('.batch-accordion-header');
  if (batchHeader) {
    const accordion = batchHeader.closest('.batch-accordion');
    if (accordion) {
      accordion.classList.toggle('closed');
    }
    return;
  }
  
  const subjectHeader = e.target.closest('.subject-accordion-header');
  if (subjectHeader) {
    const accordion = subjectHeader.closest('.subject-accordion');
    if (accordion) {
      accordion.classList.toggle('open');
    }
    return;
  }
  
  const playBtn = e.target.closest('.recording-row-action');
  if (playBtn) {
    e.stopPropagation();
    const recId = playBtn.getAttribute('data-rec-id');
    const rec = currentRecordings.find(r => r.id === recId);
    if (rec) {
      openRecordingPlayer(rec);
    }
    return;
  }
  
  const recRow = e.target.closest('.recording-row');
  if (recRow && !e.target.closest('.recording-row-action')) {
    const recId = recRow.getAttribute('data-rec-id');
    const rec = currentRecordings.find(r => r.id === recId);
    if (rec) {
      openRecordingPlayer(rec);
    }
    return;
  }
}

function openRecordingPlayer(recording) {
  const viewer = document.getElementById('recording-viewer');
  const titleEl = document.getElementById('recording-viewer-title');
  const instructorEl = document.getElementById('recording-viewer-instructor');
  const videoEl = document.getElementById('recording-video');
  const noUrlEl = document.getElementById('recording-no-url');
  
  if (!viewer) return;
  
  if (titleEl) titleEl.textContent = recording.title;
  if (instructorEl) instructorEl.textContent = `Instructor: ${recording.instructor || 'Faculty'}`;
  
  viewer.classList.remove('hide');
  
  if (recording.videoUrl) {
    if (videoEl) {
      videoEl.src = recording.videoUrl;
      videoEl.classList.remove('hide');
      videoEl.load();
      videoEl.play().catch(err => {
        console.log('Video autoplay failed:', err);
      });
    }
    if (noUrlEl) noUrlEl.classList.add('hide');
  } else {
    if (videoEl) {
      videoEl.src = '';
      videoEl.classList.add('hide');
    }
    if (noUrlEl) noUrlEl.classList.remove('hide');
  }
}

// Auto-refresh the dashboard silently in the background every 10 seconds
setInterval(() => {
  const token = localStorage.getItem('nnl_access_token');
  if (token) {
    loadDashboard(true);
  }
}, 10000);


