// NNL ONE Web Client App Logic

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? '/api' : 'https://prod-api.nnlone.com';

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
const tabSubjects = document.getElementById('tab-subjects');
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
let zoomSdkLoaded = false;
let zoomSdkLoading = false;
let captureIntervalId = null;
let currentTimelineSlides = [];
let currentMeetingId = ''; // Traces current meeting room ID
let currentSelectedSlideTimestamp = null; // Traces selected slide in rewind mode
let inRewindMode = false; // Flag to trace if user is looking at historic slide
let relativeTimeInterval = null; // Interval to update slide age, e.g. "5m ago"
let currentVolume = parseInt(localStorage.getItem('nnl_classroom_volume') || '80', 10);
let barsHideTimerId = null; // Timer ID for auto-hiding classroom bars on inactivity

// Custom cyberpunk alert and confirm modal dialog functions
function showCustomAlert(message, title = 'SYSTEM MESSAGE') {
  return new Promise((resolve) => {
    const overlay = document.getElementById('cyber-dialog-overlay');
    const msgEl = document.getElementById('cyber-dialog-message');
    const titleEl = overlay ? overlay.querySelector('.cyber-dialog-title') : null;
    const footer = document.getElementById('cyber-dialog-footer');
    const box = overlay ? overlay.querySelector('.cyber-dialog-box') : null;
    
    if (!overlay || !msgEl || !footer) {
      alert(message);
      resolve();
      return;
    }
    
    if (box) {
      box.classList.remove('danger-accent');
    }
    
    if (titleEl) titleEl.textContent = `// ${title.toUpperCase()}`;
    msgEl.textContent = message;
    
    footer.innerHTML = `
      <button class="btn btn-dialog-ok" id="dialog-btn-ok">OK</button>
    `;
    
    overlay.classList.remove('hide');
    
    const okBtn = document.getElementById('dialog-btn-ok');
    if (okBtn) okBtn.focus();
    
    const handleClose = () => {
      overlay.classList.add('hide');
      resolve();
    };
    
    okBtn.addEventListener('click', handleClose);
  });
}

function showCustomConfirm(message, title = 'CONFIRM ACTION', isDangerous = false) {
  return new Promise((resolve) => {
    const overlay = document.getElementById('cyber-dialog-overlay');
    const msgEl = document.getElementById('cyber-dialog-message');
    const titleEl = overlay ? overlay.querySelector('.cyber-dialog-title') : null;
    const footer = document.getElementById('cyber-dialog-footer');
    const box = overlay ? overlay.querySelector('.cyber-dialog-box') : null;
    
    if (!overlay || !msgEl || !footer) {
      const res = confirm(message);
      resolve(res);
      return;
    }
    
    if (box) {
      if (isDangerous) {
        box.classList.add('danger-accent');
      } else {
        box.classList.remove('danger-accent');
      }
    }
    
    if (titleEl) titleEl.textContent = `// ${title.toUpperCase()}`;
    msgEl.textContent = message;
    
    const confirmClass = isDangerous ? 'btn-dialog-danger' : 'btn-dialog-confirm';
    footer.innerHTML = `
      <button class="btn btn-dialog-cancel" id="dialog-btn-cancel">Cancel</button>
      <button class="btn ${confirmClass}" id="dialog-btn-confirm">Confirm</button>
    `;
    
    overlay.classList.remove('hide');
    
    const cancelBtn = document.getElementById('dialog-btn-cancel');
    const confirmBtn = document.getElementById('dialog-btn-confirm');
    if (cancelBtn) cancelBtn.focus();
    
    const cleanup = (value) => {
      overlay.classList.add('hide');
      resolve(value);
    };
    
    cancelBtn.addEventListener('click', () => cleanup(false));
    confirmBtn.addEventListener('click', () => cleanup(true));
  });
}

// Bind to window object for access from inline onclick handlers
window.showCustomAlert = showCustomAlert;
window.showCustomConfirm = showCustomConfirm;

// localStorage helpers for slide persistence (quota safe, limited to 30 items)
function saveSlidesToLocalStorage(meetingId, slides) {
  try {
    let toSave = slides;
    if (toSave.length > 30) {
      toSave = toSave.slice(0, 30);
    }
    localStorage.setItem(`nnl_slides_${meetingId}`, JSON.stringify(toSave));
  } catch (e) {
    console.error('Error saving slides to localStorage:', e);
  }
}

function loadSlidesFromLocalStorage(meetingId) {
  try {
    const data = localStorage.getItem(`nnl_slides_${meetingId}`);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error loading slides from localStorage:', e);
    return [];
  }
}

function clearSlidesFromLocalStorage(meetingId) {
  try {
    localStorage.removeItem(`nnl_slides_${meetingId}`);
  } catch (e) {
    console.error('Error clearing slides from localStorage:', e);
  }
}

async function saveSlideToDb(meetingId, timestamp, timeStr, imgSrc) {
  try {
    const slides = loadSlidesFromLocalStorage(meetingId);
    // Add to start (newest first)
    slides.unshift({ time: timeStr, timestamp, imgSrc });
    saveSlidesToLocalStorage(meetingId, slides);
  } catch (e) {
    console.error('Error saving slide:', e);
  }
}

async function loadSlidesFromDb(meetingId) {
  try {
    return loadSlidesFromLocalStorage(meetingId);
  } catch (e) {
    console.error('Error loading slides:', e);
    return [];
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
    let displayName = token === 'GUEST_DEMO_TOKEN' ? 'Guest Student' : (savedPhone || 'Student');
    if (savedPhone === '7827209926') {
      displayName = 'Rajit';
    }
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

// Parse API date strings robustly. Naive datetimes from the API are parsed as Indian Standard Time (IST) UTC+5:30.
function parseApiDate(dateStr) {
  if (!dateStr) return new Date(NaN);
  if (dateStr.endsWith('Z') || /([+-]\d{2}:\d{2})$/.test(dateStr)) {
    return new Date(dateStr);
  }
  let formatted = dateStr;
  if (!formatted.includes('T') && formatted.includes(' ')) {
    formatted = formatted.replace(' ', 'T');
  }
  if (!formatted.includes(':')) {
    return new Date(formatted);
  }
  return new Date(formatted + '+05:30');
}

// Format date nicely
function formatClassTime(dateStr, timeStr) {
  try {
    // Expecting date like "2026-06-07" and time like "10:30:00"
    const dateObj = parseApiDate(`${dateStr}T${timeStr}`);
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

  // Draw a premium dark gradient background with crimson / deep burgundy accents
  const grad = ctx.createLinearGradient(0, 0, 1280, 720);
  grad.addColorStop(0, '#19050b');
  grad.addColorStop(0.5, '#2e0a16');
  grad.addColorStop(1, '#0b0204');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1280, 720);

  // Draw modern circular grids in red accent
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.12)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(640, 360, 300, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(640, 360, 450, 0, Math.PI * 2);
  ctx.stroke();

  // NNL ONE Logo Icon in neon red
  ctx.fillStyle = '#ef4444';
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

  // Live time indicator in red
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

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const title = document.getElementById('classroom-title')?.textContent || 'Live Class';
  const instructor = document.getElementById('classroom-instructor')?.textContent || 'Instructor';

  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    if (!iframeDoc) {
      throw new Error('Iframe document not accessible');
    }

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
      throw new Error('No active class slide or video feed found to capture.');
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
    console.warn('captureClassroomSlide: using premium fallback slide generator due to browser cross-origin policy:', err.message || err);
    // Draw and save beautiful fallback slide card
    const fallbackDataUrl = drawFallbackSlide(title, instructor, timeStr);
    await saveSlideFromDataUrl(fallbackDataUrl);
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
    timelineSlider.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) 100%)`;
    
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
  const color = inRewindMode ? '#ff4d4d' : 'var(--primary)';
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
async function rewindFiveMinutes() {
  if (currentTimelineSlides.length === 0) {
    await showCustomAlert('No slides captured yet. Please wait for the class to progress.', 'Timeline Empty');
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

// Dynamically load Zoom Web SDK scripts on demand
async function loadZoomSdk() {
  if (zoomSdkLoaded) return true;
  if (zoomSdkLoading) {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (zoomSdkLoaded) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 100);
    });
  }

  zoomSdkLoading = true;
  console.log('Loading Zoom Web SDK dynamically...');
  
  const scripts = [
    'https://source.zoom.us/3.11.2/lib/vendor/react.min.js',
    'https://source.zoom.us/3.11.2/lib/vendor/react-dom.min.js',
    'https://source.zoom.us/3.11.2/lib/vendor/redux.min.js',
    'https://source.zoom.us/3.11.2/lib/vendor/redux-thunk.min.js',
    'https://source.zoom.us/3.11.2/lib/vendor/lodash.min.js',
    'https://source.zoom.us/zoom-meeting-embedded-3.11.2.min.js'
  ];

  try {
    for (const src of scripts) {
      await new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load: ${src}`));
        document.body.appendChild(script);
      });
    }
    zoomSdkLoaded = true;
    zoomSdkLoading = false;
    console.log('Zoom Web SDK loaded successfully!');
    return true;
  } catch (err) {
    zoomSdkLoading = false;
    console.error('Error loading Zoom Web SDK:', err);
    return false;
  }
}

// Display the glassmorphic fallback credentials copy card
function showFallbackJoinCard(meetingId, passcode, title, instructorName) {
  const zoomJoinCard = document.getElementById('zoom-join-card');
  if (zoomJoinCard) {
    const cardTitle = document.getElementById('zoom-card-class-title');
    const cardInstructor = document.getElementById('zoom-card-class-instructor');
    const cardMeetingId = document.getElementById('zoom-card-meeting-id');
    const cardPasscode = document.getElementById('zoom-card-passcode');
    const cardWebBtn = document.getElementById('zoom-card-web-btn');
    const cardAppBtn = document.getElementById('zoom-card-app-btn');

    if (cardTitle) cardTitle.textContent = title;
    if (cardInstructor) cardInstructor.textContent = instructorName;
    
    const formattedMeetingId = String(meetingId).replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
    if (cardMeetingId) cardMeetingId.textContent = formattedMeetingId;
    if (cardPasscode) cardPasscode.textContent = passcode || 'None';

    if (cardWebBtn) {
      cardWebBtn.href = `https://zoom.us/j/${meetingId}?pwd=${passcode}`;
    }
    if (cardAppBtn) {
      cardAppBtn.href = `zoommtg://zoom.us/join?confno=${meetingId}&pwd=${passcode}`;
    }

    zoomJoinCard.classList.remove('hide');
  }

  const zoomFallbackBtn = document.getElementById('zoom-fallback-btn');
  if (zoomFallbackBtn) {
    zoomFallbackBtn.href = `https://zoom.us/j/${meetingId}?pwd=${passcode}`;
  }
}

// Initialize and join embedded Zoom meeting
async function joinEmbeddedClassroom(classId, title, instructorName) {
  const token = localStorage.getItem('nnl_access_token');
  try {
    let meetingId = '';
    let passcode = '';
    let meetingToken = '';

    if (token === 'GUEST_DEMO_TOKEN' || String(classId).startsWith('mock-')) {
      meetingId = '98765432101';
      passcode = '123456';
    } else {
      const response = await fetch(`${API_BASE}/cms/v2/live_classes/${classId}/`, {
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
      meetingToken = classDetail.token || '';
    }

    // Populate the fallback button URL in the header immediately so it's always ready
    const zoomFallbackBtn = document.getElementById('zoom-fallback-btn');
    if (zoomFallbackBtn && meetingId) {
      zoomFallbackBtn.href = `https://zoom.us/j/${meetingId}?pwd=${passcode}`;
    }

    // Populate and show the floating helper buttons inside the player viewport, including the passcode
    const floatingHelper = document.getElementById('classroom-floating-helper');
    if (floatingHelper && meetingId) {
      floatingHelper.innerHTML = `
        <a id="floating-zoom-app-btn" class="btn" href="zoommtg://zoom.us/join?confno=${meetingId}&pwd=${passcode}" target="_blank" rel="noopener noreferrer" style="padding: 0.6rem 1.2rem; border-radius: 12px; background: #00f0ff; color: #000; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; text-decoration: none; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 4px 20px rgba(0, 240, 255, 0.35); display: flex; align-items: center; gap: 0.4rem; backdrop-filter: blur(10px); transition: all 0.2s ease-in-out; cursor: pointer; white-space: nowrap;">
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" style="flex-shrink: 0;"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
          <span>Join via Zoom App</span>
        </a>
        <a id="floating-zoom-web-btn" class="btn" href="https://zoom.us/j/${meetingId}?pwd=${passcode}" target="_blank" rel="noopener noreferrer" style="padding: 0.6rem 1.2rem; border-radius: 12px; background: rgba(30, 41, 59, 0.95); color: #e2e8f0; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; text-decoration: none; border: 1px solid rgba(255, 255, 255, 0.12); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4); display: flex; align-items: center; gap: 0.4rem; backdrop-filter: blur(10px); transition: all 0.2s ease-in-out; cursor: pointer; white-space: nowrap;">
          <span>Join via Browser Tab</span>
        </a>
        <div style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(255, 255, 255, 0.08); padding: 0.6rem 1.2rem; border-radius: 12px; font-size: 0.72rem; color: #fff; font-family: var(--font-display); letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.5rem; backdrop-filter: blur(10px); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);">
          <span>🔑 Passcode: <strong style="text-decoration: underline; cursor: pointer; color: #00f0ff;" onclick="navigator.clipboard.writeText('${passcode}'); showCustomAlert('Passcode copied to clipboard: ${passcode}', 'Copied');" title="Click to copy">${passcode || 'None'}</strong></span>
        </div>
      `;
      floatingHelper.classList.remove('hide');
    }

    // Update the header troubleshooting tip dynamically to show the passcode
    const headerTip = document.querySelector('.header-troubleshoot-tip');
    if (headerTip) {
      headerTip.innerHTML = `
        <span>💡</span>
        <span>Stream expired? Click "Launch in Zoom App" (Passcode: <strong style="color: #fff; font-size: 0.8rem; text-decoration: underline; cursor: pointer;" onclick="navigator.clipboard.writeText('${passcode}'); showCustomAlert('Passcode copied to clipboard: ${passcode}', 'Copied');" title="Click to copy">${passcode || 'None'}</strong>)</span>
      `;
    }

    if (meetingToken && !String(classId).startsWith('mock-')) {
      try {
        const parts = meetingToken.split('.');
        if (parts.length === 3) {
          const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(atob(payloadBase64));
          if (payload) {
            const expTime = payload.exp ? payload.exp * 1000 : 0;
            const iatTime = payload.iat ? payload.iat * 1000 : 0;
            const joinWindowExpiry = iatTime ? iatTime + 30 * 60 * 1000 : 0;
            
            // Log warnings for debugging but do not block connection, allowing the Zoom SDK to attempt joining.
            const isJwtExpired = expTime && Date.now() > (expTime - 60000);
            const isJoinWindowExpired = joinWindowExpiry && Date.now() > (joinWindowExpiry - 60000);
            if (isJwtExpired) {
              console.warn('JWT signature token is expired. Attempting connection anyway...');
            }
            if (isJoinWindowExpired) {
              console.warn('Join window has passed. Attempting connection anyway...');
            }
          }
        }
      } catch (e) {
        if (e.message.includes('ended and the Zoom session has closed')) {
          throw e;
        }
        console.warn('Failed to decode signature token:', e);
      }
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

    // Reset Zoom Meeting SDK container (no longer used, clean it up)
    const meetingSDKElement = document.getElementById('meetingSDKElement');
    if (meetingSDKElement) {
      meetingSDKElement.innerHTML = '';
      meetingSDKElement.classList.add('hide');
    }
    const zoomJoinCard = document.getElementById('zoom-join-card');
    if (zoomJoinCard) {
      zoomJoinCard.classList.add('hide');
    }

    // Helper function to safely base64 encode username for Zoom URL
    function safeBtoa(str) {
      try {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
          return String.fromCharCode(parseInt(p1, 16));
        }));
      } catch (e) {
        return btoa('Student');
      }
    }

    // Load Zoom Web Client in the proxy iframe
    const userName = localStorage.getItem('nnl_user_name') || 'Student';
    const base64Name = safeBtoa(userName);
    const zoomWebLink = `/zoom/wc/join/${meetingId}/?pwd=${passcode}&prefer=1&un=${base64Name}`;
    
    console.log('Loading Zoom Web Client in proxy iframe:', zoomWebLink);
    classroomIframe.src = zoomWebLink;
    classroomIframe.classList.remove('hide');

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
    await showCustomAlert(error.message || 'Failed to enter class. Verify connection.', 'Connection Error');
    
    // Rollback UI
    appHeader.classList.remove('hide');
    classroomDashboard.classList.remove('hide');
    classroomViewer.classList.add('hide');
  }
}

// Disconnect from Zoom and exit viewer
async function exitClassroom() {
  if (await showCustomConfirm('Are you sure you want to exit the live classroom?', 'Exit Classroom', true)) {
    stopTimelineCaptureLoop();
    stopClassroomMonitorLoop();

    // Leave and destroy Zoom SDK Component Client if active
    if (zoomClient) {
      try {
        zoomClient.leaveMeeting();
      } catch (e) {
        console.error('Error leaving Zoom meeting:', e);
      }
    }
    if (window.ZoomMtgEmbedded) {
      try {
        window.ZoomMtgEmbedded.destroyClient();
      } catch (e) {
        console.error('Error destroying Zoom client:', e);
      }
    }
    zoomClient = null;

    const meetingSDKElement = document.getElementById('meetingSDKElement');
    if (meetingSDKElement) {
      meetingSDKElement.innerHTML = '';
      meetingSDKElement.classList.add('hide');
    }

    const floatingHelper = document.getElementById('classroom-floating-helper');
    if (floatingHelper) {
      floatingHelper.classList.add('hide');
    }
    
    // Clear the inactivity timer and restore bars for next session
    clearTimeout(barsHideTimerId);
    barsHideTimerId = null;
    showClassroomBars();
    
    if (relativeTimeInterval) {
      clearInterval(relativeTimeInterval);
      relativeTimeInterval = null;
    }
    
    // Reset iframe to blank and restore state
    classroomIframe.src = 'about:blank';
    classroomIframe.classList.remove('hide');
    
    // Hide Zoom Join Card
    const zoomJoinCard = document.getElementById('zoom-join-card');
    if (zoomJoinCard) {
      zoomJoinCard.classList.add('hide');
    }
    
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

      // ── STEP 5: Apply volume ──
      applyVolumeToIframe();

      // ── STEP 6: Mouse detection for bar auto-hide ──
      if (iframeDoc && !iframeDoc._hasHoverDetection) {
        iframeDoc.addEventListener('mousemove', showBarsTemporarily);
        iframeDoc.addEventListener('mouseenter', showBarsTemporarily);
        iframeDoc._hasHoverDetection = true;
      }

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
  // Empty - panels removed
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
  const animStart = Date.now();
  if (!isSilent) {
    clearAlert();
  }

  const token = localStorage.getItem('nnl_access_token');
  if (!token) return;

  if (activeTab === 'subjects') {
    renderSubjectLibrary(isSilent);
    return;
  }

  if (activeTab === 'recordings') {
    renderVideoLibrary(isSilent);
    return;
  }

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
      classesFetched = true;
      checkPreloaderCompletion();
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
        classesFetched = true;
        checkPreloaderCompletion();
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
    let url = `${API_BASE}/cms/v2/live_classes/`;
    if (activeTab === 'recordings') {
      url = `${API_BASE}/cms/v2/live_classes_recordings/`;
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

    if (response.status === 401 || response.status === 403) {
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
        ? `${API_BASE}/cms/v2/live_classes_recordings/` 
        : `${API_BASE}/cms/v2/live_classes/`;
      
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
    classesFetched = true;
    checkPreloaderCompletion();

    if (!isSilent) {
      const elapsed = Date.now() - animStart;
      const remainingDelay = Math.max(0, 800 - elapsed);
      
      setTimeout(() => {
        if (dashboardLoader) dashboardLoader.classList.add('hide');
        if (refetchBtn) {
          refetchBtn.classList.remove('spinning');
          refetchBtn.disabled = false;
        }
      }, remainingDelay);
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
  if (activeTab === 'subjects') return; // Do not render classes if we are in Subject Library

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

  const isGuest = localStorage.getItem('nnl_access_token') === 'GUEST_DEMO_TOKEN';

  // ── Live tab: filter by activeBatch (so we only show classes for the student's selected batch)
  let poolForLive = cleanClasses.filter(c => doesClassMatchBatch(c, activeBatch));

  // Only fall back to mock if the filtered pool is empty and we are guest
  if (poolForLive.length === 0 && isGuest) {
    poolForLive = getMockClassesForBatch(activeBatch, 'live');
  }

  // ── Upcoming tab: keep batch filter as before
  let batchFiltered = cleanClasses.filter(c => doesClassMatchBatch(c, activeBatch));
  // Mock fallback only for non-live tabs in Guest mode
  if (activeTab !== 'live' && batchFiltered.length === 0 && isGuest) {
    batchFiltered = getMockClassesForBatch(activeBatch, activeTab);
  }

  // Tab badge: check ALL API classes (not just the batch-filtered ones) for live status
  const hasLiveClass = poolForLive.some(c => {
    const startVal = c.start || c.startTime || '';
    const endVal = c.end || c.endTime || '';
    if (startVal && endVal) {
      try {
        const now = new Date();
        const start = parseApiDate(startVal);
        const end = parseApiDate(endVal);
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
    // Show: currently live, scheduled for today, or starting within the next 4 hours
    const now = new Date();
    const soonMs = 30 * 60 * 1000;
    const futureLimitMs = 4 * 60 * 60 * 1000;

    poolForLive.forEach(c => {
      const startVal = c.start || c.startTime || '';
      const endVal   = c.end   || c.endTime   || '';
      if (!startVal) return;
      try {
        const start = parseApiDate(startVal);
        const end   = endVal
          ? parseApiDate(endVal)
          : new Date(start.getTime() + 2 * 60 * 60 * 1000);
        if (isNaN(start.getTime())) return;
        const isToday = start.toDateString() === now.toDateString();
        const isLiveNow      = now >= start && now <= end;
        const isStartingSoon = start > now && (start - now) <= soonMs;
        const isFutureSoon   = start > now && (start - now) <= futureLimitMs;
        const hasEndedToday  = isToday && now > end;
        if (isToday || isLiveNow || isStartingSoon || isFutureSoon) {
          c._isLiveNow      = isLiveNow;
          c._isStartingSoon = isStartingSoon || (start > now && isToday);
          c._hasEndedToday  = hasEndedToday && !isLiveNow;
          upcomingOrPastClasses.push(c);
        }
      } catch (e) {}
    });

    // Sort chronologically by start time ascending
    upcomingOrPastClasses.sort((a, b) => {
      const aTime = parseApiDate(a.start || a.startTime || '').getTime();
      const bTime = parseApiDate(b.start || b.startTime || '').getTime();
      if (isNaN(aTime)) return 1;
      if (isNaN(bTime)) return -1;
      return aTime - bTime;
    });

    if (upcomingOrPastClasses.length === 0) {
      classListContainer.innerHTML = `
        <div class="full-loader" style="grid-column: 1 / -1; background: rgba(10, 11, 16, 0.15); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 3rem; text-align: center; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
          <p style="color: var(--text-secondary); font-size: 0.85rem; font-family: var(--font-display); letter-spacing: 0.05em; text-transform: uppercase; margin: 0;">No classes live or scheduled for today.</p>
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
      const start = parseApiDate(c.start || c.startTime || '');
      const end   = parseApiDate(c.end   || c.endTime   || '');
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
          <button class="btn btn-primary" onclick="showCustomAlert('Recording is available on the NNL ONE app. Recording ID: ${recordingId}', 'Watch Recording')" style="width: 100%;">
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
    console.error('Error entering class:', error);
    await showCustomAlert(error.message || 'Failed to enter class. Verify connection.', 'Connection Error');
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
  // Disabled auto-hiding to prevent exposing native Zoom controls underneath
}

// Keep bars visible permanently to avoid exposing native Zoom controls at the bottom
function showBarsTemporarily() {
  clearTimeout(barsHideTimerId);
  showClassroomBars();
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

// Copy buttons inside Zoom Join Card
document.querySelectorAll('#zoom-join-card .btn-copy-info').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const btnEl = e.currentTarget;
    const targetId = btnEl.getAttribute('data-target');
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;
    
    // Extract raw text and strip spaces
    const text = targetEl.textContent.replace(/\s+/g, '');
    navigator.clipboard.writeText(text).then(() => {
      // Toggle button SVG and color for copy success feedback
      const originalSvg = btnEl.innerHTML;
      btnEl.innerHTML = '<svg width="14" height="14" fill="none" stroke="#00f3d0" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>';
      btnEl.style.color = '#00f3d0';
      
      setTimeout(() => {
        btnEl.innerHTML = originalSvg;
        btnEl.style.color = '';
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text:', err);
    });
  });
});

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

// Sidebar tabs removed, no click listeners needed
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
    if (await showCustomConfirm('Are you sure you want to clear all captured slides for this class?', 'Clear Timeline', true)) {
      currentTimelineSlides = [];
      
      // Clear from localStorage
      if (currentMeetingId) {
        clearSlidesFromLocalStorage(currentMeetingId);
        console.log(`Cleared all localStorage records for meeting: ${currentMeetingId}`);
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
    const response = await fetch(`${API_BASE}/auth/v2/login/otp/send/`, {
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
    const response = await fetch(`${API_BASE}/auth/login/otp/validate/`, {
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
    const response = await fetch(`${API_BASE}/auth/token/refresh/`, {
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
  if (tabRecordings) tabRecordings.classList.remove('active');
  if (tabSubjects) tabSubjects.classList.remove('active');
  loadDashboard();
});

tabUpcoming.addEventListener('click', () => {
  if (activeTab === 'upcoming') return;
  activeTab = 'upcoming';
  tabUpcoming.classList.add('active');
  tabLive.classList.remove('active');
  if (tabRecordings) tabRecordings.classList.remove('active');
  if (tabSubjects) tabSubjects.classList.remove('active');
  loadDashboard();
});

if (tabRecordings) {
  tabRecordings.addEventListener('click', () => {
    if (activeTab === 'recordings') return;
    activeTab = 'recordings';
    tabRecordings.classList.add('active');
    tabLive.classList.remove('active');
    tabUpcoming.classList.remove('active');
    if (tabSubjects) tabSubjects.classList.remove('active');
    loadDashboard();
  });
}

if (tabSubjects) {
  tabSubjects.addEventListener('click', () => {
    if (activeTab === 'subjects') return;
    activeTab = 'subjects';
    tabSubjects.classList.add('active');
    tabLive.classList.remove('active');
    tabUpcoming.classList.remove('active');
    if (tabRecordings) tabRecordings.classList.remove('active');
    loadDashboard();
  });
}

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
      
      // Rerender depending on active tab
      if (activeTab === 'subjects') {
        renderSubjectLibrary();
      } else {
        renderClasses(classesData);
      }
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
  
  // Anchored fixed times for the current day to simulate a real daily schedule
  const t9am = new Date(now); t9am.setHours(9, 0, 0, 0);
  const t12pm = new Date(now); t12pm.setHours(12, 0, 0, 0);
  
  const t1pm = new Date(now); t1pm.setHours(13, 0, 0, 0);
  const t4pm = new Date(now); t4pm.setHours(16, 0, 0, 0);
  
  const t4_30pm = new Date(now); t4_30pm.setHours(16, 30, 0, 0);
  const t7_30pm = new Date(now); t7_30pm.setHours(19, 30, 0, 0);
  
  if (tab === 'live') {
    if (isSapphire) {
      return [
        {
          id: 'mock-sapphire-live-1',
          title: 'Pharmacology Day 1 (Part 1): Anti-Hypertensive Drugs & Cardiac Assessment',
          faculty: { name: 'Dr. Suresh Sharma' },
          start: t9am.toISOString(),
          end: t12pm.toISOString(),
          zoom_meet_id: '82930283021',
          passcode: '908123',
          batch: { title: 'Blue Sapphire Batch' }
        },
        {
          id: 'mock-sapphire-live-2',
          title: 'Pharmacology Day 1 (Part 2): Anti-Hypertensive Drugs & Cardiac Assessment',
          faculty: { name: 'Dr. Suresh Sharma' },
          start: t1pm.toISOString(),
          end: t4pm.toISOString(),
          zoom_meet_id: '82930283022',
          passcode: '908124',
          batch: { title: 'Blue Sapphire Batch' }
        },
        {
          id: 'mock-sapphire-live-3',
          title: 'Pharmacology Day 1 (Part 3): Anti-Hypertensive Drugs & Cardiac Assessment',
          faculty: { name: 'Dr. Suresh Sharma' },
          start: t4_30pm.toISOString(),
          end: t7_30pm.toISOString(),
          zoom_meet_id: '82930283023',
          passcode: '908125',
          batch: { title: 'Blue Sapphire Batch' }
        }
      ];
    } else {
      return [
        {
          id: 'mock-pearl-live-1',
          title: 'Community Health Nursing Day 6 (Part 1): Maternal & Child Health Indicators',
          faculty: { name: 'Mukhminder Singh' },
          start: t9am.toISOString(),
          end: t12pm.toISOString(),
          zoom_meet_id: '81293028302',
          passcode: '123456',
          batch: { title: 'Pearl Batch' }
        },
        {
          id: 'mock-pearl-live-2',
          title: 'Community Health Nursing Day 6 (Part 2): Maternal & Child Health Indicators',
          faculty: { name: 'Mukhminder Singh' },
          start: t1pm.toISOString(),
          end: t4pm.toISOString(),
          zoom_meet_id: '81293028303',
          passcode: '123456',
          batch: { title: 'Pearl Batch' }
        },
        {
          id: 'mock-pearl-live-3',
          title: 'Community Health Nursing Day 6 (Part 3): Maternal & Child Health Indicators',
          faculty: { name: 'Mukhminder Singh' },
          start: t4_30pm.toISOString(),
          end: t7_30pm.toISOString(),
          zoom_meet_id: '81293028304',
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
function autoJoinZoomPrejoin(iframe, displayName, passcode) {
  let attempts = 0;
  const maxAttempts = 120; // 48 seconds

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

    // 1. Check for Name Input and Join Button
    const nameInput =
      iframeDoc.querySelector('input#inputname') ||
      iframeDoc.querySelector('input[placeholder*="name" i]') ||
      iframeDoc.querySelector('input[id*="name" i]') ||
      iframeDoc.querySelector('input[autocomplete="name"]') ||
      iframeDoc.querySelector('.preview-meeting-info input[type="text"]') ||
      iframeDoc.querySelector('input[type="text"]');

    const joinBtn =
      iframeDoc.querySelector('button#joinBtn') ||
      iframeDoc.querySelector('button[class*="join" i]') ||
      iframeDoc.querySelector('button[id*="join" i]') ||
      Array.from(iframeDoc.querySelectorAll('button')).find(b =>
        /^(join|join meeting)$/i.test(b.textContent.trim())
      );

    // 2. Check for Passcode Input and Submit/Join Button
    const passcodeInput =
      iframeDoc.querySelector('input#inputpasscode') ||
      iframeDoc.querySelector('input[id*="passcode" i]') ||
      iframeDoc.querySelector('input[placeholder*="passcode" i]') ||
      iframeDoc.querySelector('input[placeholder*="code" i]') ||
      iframeDoc.querySelector('input[type="password"]');

    const submitBtn =
      iframeDoc.querySelector('button#joinBtn') ||
      iframeDoc.querySelector('button[type="submit"]') ||
      iframeDoc.querySelector('button.btn-primary') ||
      Array.from(iframeDoc.querySelectorAll('button')).find(b =>
        /^(join|ok|submit|confirm|verify)$/i.test(b.textContent.trim())
      );

    let filledSomething = false;

    // Handle Name Input
    if (nameInput && nameInput.value !== displayName) {
      const nativeInputSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 'value'
      )?.set;

      if (nativeInputSetter) {
        nativeInputSetter.call(nameInput, displayName);
      } else {
        nameInput.value = displayName;
      }
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      nameInput.dispatchEvent(new Event('change', { bubbles: true }));
      filledSomething = true;
      console.log('[AutoJoin] Filled Name:', displayName);
    }

    // Handle Passcode Input (if passcode is provided)
    if (passcodeInput && passcode && passcodeInput.value !== passcode) {
      const nativeInputSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 'value'
      )?.set;

      if (nativeInputSetter) {
        nativeInputSetter.call(passcodeInput, passcode);
      } else {
        passcodeInput.value = passcode;
      }
      passcodeInput.dispatchEvent(new Event('input', { bubbles: true }));
      passcodeInput.dispatchEvent(new Event('change', { bubbles: true }));
      filledSomething = true;
      console.log('[AutoJoin] Filled Passcode:', passcode);
    }

    // If we filled something, wait a small delay for React/Vue state to update, then click
    if (filledSomething) {
      setTimeout(() => {
        if (passcodeInput && submitBtn && !submitBtn.disabled) {
          submitBtn.click();
          console.log('[AutoJoin] Clicked Submit/Join for passcode screen');
        } else if (nameInput && joinBtn && !joinBtn.disabled) {
          joinBtn.click();
          console.log('[AutoJoin] Clicked Join for name screen');
        }
        // Always continue polling to handle subsequent screens (e.g. name screen followed by passcode screen)
        setTimeout(tryFill, 500);
      }, 300);
    } else {
      // If we see the buttons and they are enabled, click them anyway just in case the value was already filled
      if (passcodeInput && submitBtn && !submitBtn.disabled && passcodeInput.value === passcode) {
        submitBtn.click();
        console.log('[AutoJoin] Clicked submitBtn (passcode already matched)');
        setTimeout(tryFill, 500);
      } else if (nameInput && joinBtn && !joinBtn.disabled && nameInput.value === displayName) {
        joinBtn.click();
        console.log('[AutoJoin] Clicked joinBtn (name already matched)');
        setTimeout(tryFill, 500);
      } else {
        // Nothing to fill or click yet — poll again
        setTimeout(tryFill, 400);
      }
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

// --- Full-screen Preloader State Management ---
let bgLoaded = false;
let classesFetched = false;

function checkPreloaderCompletion() {
  const token = localStorage.getItem('nnl_access_token');
  const needsClassesFetch = !!token;
  
  if (bgLoaded && (!needsClassesFetch || classesFetched)) {
    const preloader = document.getElementById('app-preloader');
    if (preloader) {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.remove();
      }, 600);
    }
  }
}

// Pre-load background image to ensure instant visual presence
const bgImg = new Image();
bgImg.src = '/nightingale.jpg';
if (bgImg.complete) {
  bgLoaded = true;
} else {
  bgImg.onload = () => {
    bgLoaded = true;
    checkPreloaderCompletion();
  };
  bgImg.onerror = () => {
    bgLoaded = true;
    checkPreloaderCompletion();
  };
}

// Initialize on page load
getOrCreateDeviceId();
checkLoginState();
updateFavicon();
initTweaksPanel();
initBatchSelection();
initBackgroundParallax();
initRecordingsViewer();
checkPreloaderCompletion();


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

// renderRecordings is now replaced by renderVideoLibrary (fetches from /batch_cms/videos/)
// kept as stub in case of direct call from old code
function renderRecordings(classes) {
  renderVideoLibrary(false);
}

async function renderVideoLibrary(isSilent = false) {
  if (!classListContainer) return;
  classListContainer.innerHTML = '';
  classListContainer.style.display = 'block';

  if (!isSilent && dashboardLoader) {
    dashboardLoader.classList.remove('hide');
  }
  if (!isSilent && refetchBtn) {
    refetchBtn.classList.add('spinning');
    refetchBtn.disabled = true;
  }

  const token = localStorage.getItem('nnl_access_token');
  const isGuest = !token || token === 'GUEST_DEMO_TOKEN';
  const simplifiedBatch = getSimplifiedBatchTitle(activeBatch);
  const batchId = getApiBatchId(activeBatch); // fallback hardcoded ID
  let realBatchId = batchId; // will be overwritten with real API batch ID


  // Show loading state
  classListContainer.innerHTML = `
    <div class="full-loader" style="grid-column: 1 / -1; background: rgba(10, 11, 16, 0.15); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 3rem; text-align: center;">
      <div class="spinner"></div>
      <p style="color: var(--text-secondary); margin-top: 0.5rem; font-family: var(--font-display); font-size: 0.75rem; letter-spacing: 0.05em; text-transform: uppercase;">Loading Recorded Lectures...</p>
    </div>
  `;

  try {
    let subjects = [];
    let allRecordingsBySubject = {};

    if (isGuest) {
      // Use mock data for guests
      subjects = MOCK_SUBJECTS_DATA[simplifiedBatch] || MOCK_SUBJECTS_DATA['Blue Sapphire Batch'];
      const mockMaterials = MOCK_SUBJECT_MATERIALS;
      subjects.forEach(sub => {
        const mock = mockMaterials[sub.id] || mockMaterials[466];
        if (mock && mock.videos && mock.videos.length > 0) {
          allRecordingsBySubject[sub.title] = mock.videos.map(v => ({
            id: v.id,
            title: v.title,
            instructor: v.faculty?.name || 'Faculty',
            batch: activeBatch,
            subject: sub.title,
            date: '',
            duration: v.duration ? `${Math.floor(v.duration / 3600)}h ${Math.floor((v.duration % 3600) / 60)}m` : '2h 0m',
            videoUrl: v.videoUrl || '',
            video_cipher_id: v.video_cipher_id || null
          }));
        }
      });
    } else {
      // Fetch the batch's subject list
      let batchRes = await fetch(`${API_BASE}/cms/batches/`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });

      if (batchRes.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          const newToken = localStorage.getItem('nnl_access_token');
          batchRes = await fetch(`${API_BASE}/cms/batches/`, {
            headers: { 'Authorization': `Bearer ${newToken}`, 'Accept': 'application/json' }
          });
        } else {
          handleLogout();
          return;
        }
      }

      if (batchRes.ok) {
        const result = await batchRes.json();
        const apiBatches = result.data || result.results || [];
        const batchData = apiBatches.find(b => b.id === batchId || getSimplifiedBatchTitle(b.title) === simplifiedBatch);
        if (batchData && batchData.subjects) {
          subjects = batchData.subjects;
          // Use the REAL batch ID from API - hardcoded batchId causes all subjects to return same videos
          realBatchId = batchData.id;
        }
      }

      if (subjects.length === 0) {
        subjects = MOCK_SUBJECTS_DATA[simplifiedBatch] || MOCK_SUBJECTS_DATA['Blue Sapphire Batch'];
      }

      // Fetch videos for all subjects in parallel
      const currentToken = localStorage.getItem('nnl_access_token');
      const videoFetches = subjects.map(async sub => {
        try {
          const vRes = await fetch(`${API_BASE}/batch_cms/videos/?batch_id=${realBatchId}&subject_id=${sub.id}`, {
            headers: { 'Authorization': `Bearer ${currentToken}`, 'Accept': 'application/json' }
          });
          if (vRes.ok) {
            const vData = await vRes.json();
            const videos = vData.data || vData.results || [];
            if (videos.length > 0) {
              allRecordingsBySubject[sub.title] = videos.map(v => ({
                id: v.id,
                title: v.title,
                instructor: v.faculty?.name || v.faculty?.fullName || 'Faculty',
                batch: activeBatch,
                subject: sub.title,
                date: v.schedule_start_time ? v.schedule_start_time.split('T')[0] : '',
                duration: v.duration ? `${Math.floor(v.duration / 3600)}h ${Math.floor((v.duration % 3600) / 60)}m` : '',
                videoUrl: '',
                video_cipher_id: v.video_cipher_id || null,
                thumbnails: v.thumbnails || null
              }));
            }
          }
        } catch (err) {
          console.warn(`Failed to fetch videos for subject ${sub.title}:`, err);
        }
      });

      await Promise.all(videoFetches);
    }

    // Build flat list for currentRecordings (so openRecordingPlayer works)
    currentRecordings = [];
    Object.values(allRecordingsBySubject).forEach(vids => currentRecordings.push(...vids));

    if (dashboardLoader) dashboardLoader.classList.add('hide');

    const subjectNames = Object.keys(allRecordingsBySubject).sort();

    classListContainer.innerHTML = '';
    classListContainer.style.display = 'block';

    if (subjectNames.length === 0) {
      classListContainer.innerHTML = `
        <div class="full-loader" style="grid-column: 1 / -1; background: rgba(10, 11, 16, 0.15); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 3rem; text-align: center; backdrop-filter: blur(10px);">
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
      <span class="cyber-hero-badge" style="display: inline-block; margin-bottom: 0.5rem;">// VIDEO LECTURES</span>
      <h2 style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 900; background: var(--grad-text); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 0.06em; margin: 0 0 0.35rem;">RECORDED <span style="-webkit-text-fill-color: #00f3d0;">LECTURES</span></h2>
      <p style="color: var(--text-secondary); font-size: 0.8rem; margin: 0;">${activeBatch} &mdash; ${currentRecordings.length} lectures grouped by subject</p>
    `;
    browserDiv.appendChild(libraryHeader);

    subjectNames.forEach(subjectName => {
      const subjectVids = allRecordingsBySubject[subjectName];
      let rowsHtml = '';
      subjectVids.forEach((rec, idx) => {
        const rowNum = (idx + 1).toString().padStart(2, '0');
        const isPlayable = !!(rec.video_cipher_id || rec.videoUrl);
        const thumb = rec.thumbnails ? (rec.thumbnails[0]?.url || '') : '';
        rowsHtml += `
          <div class="recording-row" data-rec-id="${rec.id}">
            ${thumb ? `<img src="${thumb}" alt="" style="width:52px;height:34px;object-fit:cover;border-radius:4px;margin-right:0.5rem;flex-shrink:0;">` : `<div class="recording-row-num">${rowNum}</div>`}
            <div class="recording-row-info">
              <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <div class="recording-row-title" title="${rec.title}" style="margin-bottom: 0;">${rec.title}</div>
                ${rec.video_cipher_id ? '<span style="font-size:0.6rem;background:rgba(0,243,208,0.15);color:#00f3d0;padding:0.15rem 0.4rem;border-radius:4px;letter-spacing:0.05em;">VdoCipher</span>' : ''}
              </div>
              <div class="recording-row-meta" style="margin-top: 0.25rem;">
                <span class="recording-row-instructor">${rec.instructor}</span>
                ${rec.date ? `<span>•</span><span>${rec.date}</span>` : ''}
                ${rec.duration ? `<span>•</span><span>${rec.duration}</span>` : ''}
              </div>
            </div>
            <button class="recording-row-action${isPlayable ? '' : ' unavailable'}" data-rec-id="${rec.id}">
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" style="margin-right: 0.25rem;">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span>${isPlayable ? 'Play' : 'App Only'}</span>
            </button>
          </div>
        `;
      });

      const subjectAccordion = document.createElement('div');
      subjectAccordion.className = 'subject-accordion open';
      subjectAccordion.innerHTML = `
        <div class="subject-accordion-header">
          <div class="subject-accordion-title">
            <div class="subject-icon">📚</div>
            <span class="subject-name">${subjectName}</span>
            <span class="subject-count">(${subjectVids.length} lecture${subjectVids.length !== 1 ? 's' : ''})</span>
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

  } catch (err) {
    console.error('Error rendering video library:', err);
    if (dashboardLoader) dashboardLoader.classList.add('hide');
    classListContainer.innerHTML = `
      <div class="full-loader" style="grid-column: 1 / -1; background: rgba(10, 11, 16, 0.15); border: 1px solid rgba(255, 68, 68, 0.15); border-radius: 20px; padding: 3rem; text-align: center;">
        <p style="color: #f87171; font-size: 0.85rem; font-family: var(--font-display); letter-spacing: 0.05em; text-transform: uppercase; margin: 0 0 0.5rem;">Failed to load recorded lectures</p>
        <p style="color: var(--text-secondary); font-size: 0.75rem; margin: 0;">${err.message}</p>
      </div>
    `;
  } finally {
    classesFetched = true;
    checkPreloaderCompletion();
    if (!isSilent && refetchBtn) {
      refetchBtn.classList.remove('spinning');
      refetchBtn.disabled = false;
    }
  }
}

function initBackgroundParallax() {
  // Disabled JS-based drift to allow smooth hardware-accelerated CSS keyframe animation to handle it
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
        videoEl.classList.remove('hide');
      }
      const oldIframe = document.getElementById('recording-cipher-iframe');
      if (oldIframe) oldIframe.remove();
      const loader = document.getElementById('recording-cipher-loader');
      if (loader) loader.remove();
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
    const rec = currentRecordings.find(r => String(r.id) === String(recId));
    if (rec) {
      openRecordingPlayer(rec);
    }
    return;
  }
  
  const recRow = e.target.closest('.recording-row');
  if (recRow && !e.target.closest('.recording-row-action')) {
    const recId = recRow.getAttribute('data-rec-id');
    const rec = currentRecordings.find(r => String(r.id) === String(recId));
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
  const facultyName = recording.faculty ? (recording.faculty.name || recording.faculty) : (recording.instructor || 'Faculty');
  if (instructorEl) instructorEl.textContent = `Instructor: ${facultyName}`;
  
  viewer.classList.remove('hide');
  
  // Clean up any existing VdoCipher iframe/loader
  const oldIframe = document.getElementById('recording-cipher-iframe');
  if (oldIframe) oldIframe.remove();
  const oldLoader = document.getElementById('recording-cipher-loader');
  if (oldLoader) oldLoader.remove();
  if (videoEl) videoEl.classList.remove('hide');
  if (noUrlEl) noUrlEl.classList.add('hide');

  if (recording.video_cipher_id) {
    if (videoEl) {
      videoEl.pause();
      videoEl.src = '';
      videoEl.classList.add('hide');
    }
    
    // Append loading spinner
    const bodyEl = document.querySelector('.recording-viewer-body');
    const loader = document.createElement('div');
    loader.id = 'recording-cipher-loader';
    loader.className = 'full-loader';
    loader.innerHTML = '<div class="spinner"></div><p style="margin-top: 0.5rem; font-family: var(--font-display); font-size: 0.75rem; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-secondary);">Securing stream via VdoCipher...</p>';
    bodyEl.appendChild(loader);
    
    const token = localStorage.getItem('nnl_access_token');
    fetch(`${API_BASE}/batch_cms/videos/${recording.id}/generate_videocipher_otp/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      if (loader) loader.remove();
      if (data && data.otp && data.playbackInfo) {
        const iframe = document.createElement('iframe');
        iframe.id = 'recording-cipher-iframe';
        iframe.src = `https://player.vdocipher.com/v2/?otp=${data.otp}&playbackInfo=${data.playbackInfo}`;
        iframe.style.border = 'none';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.borderRadius = '12px';
        iframe.setAttribute('allow', 'encrypted-media');
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.setAttribute('referrerpolicy', 'no-referrer');
        bodyEl.appendChild(iframe);
      } else {
        if (noUrlEl) noUrlEl.classList.remove('hide');
      }
    })
    .catch(err => {
      console.error(err);
      if (loader) loader.remove();
      if (noUrlEl) noUrlEl.classList.remove('hide');
    });
    
  } else if (recording.videoUrl) {
    if (videoEl) {
      videoEl.src = recording.videoUrl;
      videoEl.classList.remove('hide');
      videoEl.load();
      videoEl.play().catch(err => {
        console.log('Video autoplay failed:', err);
      });
    }
  } else {
    if (videoEl) {
      videoEl.src = '';
      videoEl.classList.add('hide');
    }
    if (noUrlEl) noUrlEl.classList.remove('hide');
  }
}

// Auto-refresh live classes every 5 seconds
setInterval(() => {
  const token = localStorage.getItem('nnl_access_token');
  if (token) {
    loadDashboard(true);
  }
}, 5000);

/* ─────────────────────────────────────────────────────────────────────
   SUBJECT LIBRARY & QUIZ PLAYER REDESIGN
───────────────────────────────────────────────────────────────────── */

// Mappings of UI Batch names to backend Batch IDs
function getApiBatchId(batchName) {
  if (!batchName) return 8;
  const name = batchName.toUpperCase();
  if (name.includes('SAPPHIRE') || name.includes('BLUE')) return 8;
  if (name.includes('PEARL') && name.includes('ENGLISH')) return 7;
  if (name.includes('PEARL')) return 8; // Default Hinglish batch is 8
  if (name.includes('FASTRACK')) return 3;
  if (name.includes('BRAHMASTRA')) return 9;
  if (name.includes('ECONOMY')) return 1;
  return 8; 
}

const MOCK_SUBJECTS_DATA = {
  'Blue Sapphire Batch': [
    { id: 466, title: 'Pharmacology' },
    { id: 458, title: 'Anatomy & Physiology' },
    { id: 459, title: 'Biochemistry & Nutrition' },
    { id: 465, title: 'Mental Health Nursing' },
    { id: 472, title: 'Community Health Nursing' }
  ],
  'Pearl Batch': [
    { id: 491, title: 'Community Health Nursing' },
    { id: 494, title: 'Pediatrics' },
    { id: 495, title: 'Pharmacology' },
    { id: 497, title: 'Mental Health Nursing' }
  ]
};

const MOCK_SUBJECT_MATERIALS = {
  466: {
    videos: [
      { id: 'mock-vid-1', title: 'Pharmacology Day 1: Anti-Hypertensive Drugs & Cardiac Assessment', duration: 8100, faculty: { name: 'Dr. Suresh Sharma' }, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
      { id: 'mock-vid-2', title: 'Pharmacology Day 2: Diuretics & Renin-Angiotensin System', duration: 6600, faculty: { name: 'Dr. Suresh Sharma' }, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' }
    ],
    notes: [
      { id: 'mock-note-1', title: 'Anti-Hypertensive Class Notes Complete PDF', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      { id: 'mock-note-2', title: 'Renin-Angiotensin System Flowcharts Notes', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ],
    tests: [
      { id: 9901, title: 'Pharmacology TAT 1 MCQ Practice (NORCET)', total_question: 2, duration: 600, level_str: 'Medium' }
    ]
  },
  458: {
    videos: [
      { id: 'mock-vid-3', title: 'Anatomy Day 1: Cardiovascular System Structure & Chambers', duration: 7800, faculty: { name: 'Dr. Suresh Sharma' }, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' },
      { id: 'mock-vid-4', title: 'Anatomy Day 2: Nervous System & Cranial Nerve Pathways', duration: 6900, faculty: { name: 'Dr. Suresh Sharma' }, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' }
    ],
    notes: [
      { id: 'mock-note-3', title: 'Cardiovascular System Anatomy Handouts', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      { id: 'mock-note-4', title: 'Nervous System Synapses and Pathways Notes', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ],
    tests: [
      { id: 9903, title: 'Cardiovascular Anatomy Practice Test', total_question: 2, duration: 600, level_str: 'Medium' }
    ]
  }
};

const MOCK_QUIZ_QUESTIONS = {
  9901: [
    {
      id: 1,
      type_str: 'MCQ',
      level_str: 'Medium',
      title: 'Which of the following is considered a first-line agent for primary hypertension in a patient with diabetes mellitus?',
      choices: [
        { id: 101, title: 'Beta-blockers', is_correct: false },
        { id: 102, title: 'ACE Inhibitors (Lisinopril)', is_correct: true, correct_explanation: 'ACE inhibitors like Lisinopril are renoprotective and preferred first-line agents in hypertensive patients with diabetes.' },
        { id: 103, title: 'Calcium Channel Blockers (Diltiazem)', is_correct: false },
        { id: 104, title: 'Loop Diuretics (Furosemide)', is_correct: false }
      ]
    },
    {
      id: 2,
      type_str: 'MCQ',
      level_str: 'Easy',
      title: 'What is the primary mechanism of action of nitroglycerin in relieving angina pectoris?',
      choices: [
        { id: 201, title: 'Vascular smooth muscle relaxation leading to venodilation and decreased preload', is_correct: true, correct_explanation: 'Nitroglycerin primarily causes venodilation, which decreases venous return (preload) and reduces myocardial oxygen demand.' },
        { id: 202, title: 'Direct negative inotropic effect on myocardium', is_correct: false },
        { id: 203, title: 'Inhibition of angiotensin converting enzyme', is_correct: false },
        { id: 204, title: 'Blocking beta-adrenergic receptors', is_correct: false }
      ]
    }
  ],
  9903: [
    {
      id: 1,
      type_str: 'MCQ',
      level_str: 'Easy',
      title: 'Which chamber of the heart has the thickest muscular wall?',
      choices: [
        { id: 301, title: 'Right Atrium', is_correct: false },
        { id: 302, title: 'Left Atrium', is_correct: false },
        { id: 303, title: 'Right Ventricle', is_correct: false },
        { id: 304, title: 'Left Ventricle', is_correct: true, correct_explanation: 'The left ventricle has the thickest myocardium because it must generate enough pressure to pump blood to the entire systemic circulation.' }
      ]
    },
    {
      id: 2,
      type_str: 'MCQ',
      level_str: 'Medium',
      title: 'What is the correct pathway of heart conduction?',
      choices: [
        { id: 401, title: 'SA Node -> AV Node -> Bundle of His -> Purkinje Fibers', is_correct: true, correct_explanation: 'The conduction impulse originates in SA node, propagates through AV node and Bundle of His, then spreads via Purkinje fibers.' },
        { id: 402, title: 'AV Node -> SA Node -> Purkinje Fibers -> Bundle of His', is_correct: false },
        { id: 403, title: 'SA Node -> Bundle of His -> AV Node -> Purkinje Fibers', is_correct: false },
        { id: 404, title: 'Purkinje Fibers -> SA Node -> AV Node -> Bundle of His', is_correct: false }
      ]
    }
  ]
};

async function renderSubjectLibrary(isSilent = false) {
  if (!classListContainer) return;
  classListContainer.innerHTML = '';
  classListContainer.style.display = 'block';

  if (!isSilent && dashboardLoader) {
    dashboardLoader.classList.remove('hide');
  }

  const token = localStorage.getItem('nnl_access_token');
  const isGuest = token === 'GUEST_DEMO_TOKEN';
  const simplifiedBatch = getSimplifiedBatchTitle(activeBatch);
  const batchId = getApiBatchId(activeBatch); // fallback hardcoded ID
  let realBatchId = batchId; // will be overwritten with real API batch ID

  try {
    let subjects = [];
    if (isGuest) {
      subjects = MOCK_SUBJECTS_DATA[simplifiedBatch] || MOCK_SUBJECTS_DATA['Blue Sapphire Batch'];
    } else {
      // Fetch batches to extract subjects list
      let response = await fetch(`${API_BASE}/cms/batches/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.status === 401 || response.status === 403) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          const newToken = localStorage.getItem('nnl_access_token');
          response = await fetch(`${API_BASE}/cms/batches/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${newToken}`,
              'Accept': 'application/json'
            }
          });
        } else {
          handleLogout();
          return;
        }
      }

      if (response.ok) {
        const result = await response.json();
        if (activeTab !== 'subjects') return; // Guard against tab change during await
        const apiBatches = result.data || result.results || [];
        const currentBatchData = apiBatches.find(b => b.id === batchId || getSimplifiedBatchTitle(b.title) === simplifiedBatch);
        if (currentBatchData && currentBatchData.subjects) {
          subjects = currentBatchData.subjects;
          // Use the REAL batch ID from the API, not the hardcoded one
          realBatchId = currentBatchData.id;
        }
      } else {
        throw new Error(`Failed to fetch batches (HTTP ${response.status})`);
      }
      
      if (subjects.length === 0) {
        // Fallback if empty
        subjects = MOCK_SUBJECTS_DATA[simplifiedBatch] || MOCK_SUBJECTS_DATA['Blue Sapphire Batch'];
      }
    }

    if (dashboardLoader) dashboardLoader.classList.add('hide');

    if (subjects.length === 0) {
      classListContainer.innerHTML = `
        <div class="full-loader" style="grid-column: 1 / -1; background: rgba(10, 11, 16, 0.15); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 3rem; text-align: center; backdrop-filter: blur(10px);">
          <p style="color: var(--text-secondary); font-size: 0.85rem; font-family: var(--font-display); letter-spacing: 0.05em; text-transform: uppercase; margin: 0;">No subjects available for ${activeBatch}.</p>
        </div>
      `;
      return;
    }

    const browserDiv = document.createElement('div');
    browserDiv.className = 'recordings-browser';

    const libraryHeader = document.createElement('div');
    libraryHeader.style.marginBottom = '1.5rem';
    libraryHeader.innerHTML = `
      <span class="cyber-hero-badge" style="display: inline-block; margin-bottom: 0.5rem;">// SUBJECT LIBRARY</span>
      <h2 style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 900; background: var(--grad-text); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 0.06em; margin: 0 0 0.35rem;">SUBJECT <span style="-webkit-text-fill-color: #00f3d0;">PORTAL</span></h2>
      <p style="color: var(--text-secondary); font-size: 0.8rem; margin: 0;">${activeBatch} &mdash; Access video lectures, notes PDFs, and CBT tests</p>
    `;
    browserDiv.appendChild(libraryHeader);

    subjects.forEach(sub => {
      const subjectAccordion = document.createElement('div');
      subjectAccordion.className = 'subject-accordion';
      subjectAccordion.setAttribute('data-sub-id', sub.id);
      subjectAccordion.setAttribute('data-loaded', 'false');

      subjectAccordion.innerHTML = `
        <div class="subject-accordion-header">
          <div class="subject-accordion-title">
            <div class="subject-icon">📚</div>
            <span class="subject-name">${sub.title}</span>
            <span class="subject-count" id="sub-meta-count-${sub.id}"></span>
          </div>
          <svg class="subject-chevron" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
          </svg>
        </div>
        <div class="subject-accordion-body" id="sub-body-${sub.id}">
          <div class="subject-materials-row">
            <!-- Videos column -->
            <div class="material-column" id="sub-vids-${sub.id}">
              <div class="material-column-title">
                📹 Recorded Classes
              </div>
              <div class="full-loader" style="padding: 1rem;"><div class="spinner"></div></div>
            </div>
            
            <!-- Notes column -->
            <div class="material-column" id="sub-notes-${sub.id}">
              <div class="material-column-title">
                📄 Class Notes
              </div>
              <div class="full-loader" style="padding: 1rem;"><div class="spinner"></div></div>
            </div>
            
            <!-- Tests column -->
            <div class="material-column" id="sub-tests-${sub.id}">
              <div class="material-column-title">
                📝 Practice Tests
              </div>
              <div class="full-loader" style="padding: 1rem;"><div class="spinner"></div></div>
            </div>
          </div>
        </div>
      `;

      // Collapse click event
      const header = subjectAccordion.querySelector('.subject-accordion-header');
      header.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = subjectAccordion.classList.toggle('open');
        if (isOpen && subjectAccordion.getAttribute('data-loaded') === 'false') {
          // Use real API batch ID (not hardcoded) so subject filter works correctly
          fetchSubjectMaterials(realBatchId, sub.id, subjectAccordion);
        }
      });

      browserDiv.appendChild(subjectAccordion);
    });

    classListContainer.appendChild(browserDiv);

  } catch (error) {
    console.error('Error rendering subject library:', error);
    if (dashboardLoader) dashboardLoader.classList.add('hide');
    classListContainer.innerHTML = `
      <div class="full-loader" style="grid-column: 1 / -1; background: rgba(10, 11, 16, 0.15); border: 1px solid rgba(255, 68, 68, 0.15); border-radius: 20px; padding: 3rem; text-align: center; backdrop-filter: blur(10px);">
        <p style="color: #f87171; font-size: 0.85rem; font-family: var(--font-display); letter-spacing: 0.05em; text-transform: uppercase; margin: 0 0 0.5rem;">Failed to render Subject Library</p>
        <p style="color: var(--text-secondary); font-size: 0.75rem; margin: 0;">Error: ${error.message}</p>
      </div>
    `;
  } finally {
    classesFetched = true;
    checkPreloaderCompletion();
  }
}

// Client-side subject matching — the API ignores subject_id so we filter by keywords in titles
function doesItemBelongToSubject(title, subjectName) {
  const t = (title || '').toUpperCase();
  const s = (subjectName || '').toUpperCase();

  // Build keyword map from subject name
  const kw = (keywords) => keywords.some(k => t.includes(k.toUpperCase()));

  if (s.includes('ANATOMY') || s.includes('PHYSIOLOGY') || s.includes('A&P'))
    return kw(['ANATOMY','PHYSIOL','A&P','A & P','CARDIOVASCULAR','CARDIAC','RESPIRATORY','MUSCULO','NERVOUS','SKELETAL','CIRCULATION','CARDIAC']);

  if (s.includes('BIOCHEM') || s.includes('NUTRITION') || s.includes('B&N'))
    return kw(['BIOCHEM','NUTRITION','NUTRIENT','B&N','METABOL','ENZYME','VITAMIN','MINERAL','DIETARY','PROTEIN','CARBOHYDRATE']);

  if (s.includes('PHARMACOLOGY') || s.includes('PHARMA'))
    return kw(['PHARMACOL','PHARMA','DRUG','MEDICATION','DOSE','ANTIBIOTIC','ANTIHYPERTENS']);

  if (s.includes('PEDIATRIC') || s.includes('PAEDIATRIC') || s.includes('CHILD'))
    return kw(['PEDIATRIC','PAEDIATRIC','NEONATAL','CHILD','INFANT','NEWBORN','IMMUNIZATION']);

  if (s.includes('SURGERY') || s.includes('SURGICAL') || s.includes('OPERATIVE'))
    return kw(['SURG','C&R','OPERATIVE','OPERATION','PRE-OP','POST-OP','WOUND','ANAESTH']);

  if (s.includes('AHN') || s.includes('ADULT HEALTH') || s.includes('MEDICINE'))
    return kw(['AHN','ADULT HEALTH','ADULT NURSING','MEDICINE','MEDICAL','INTERNAL']);

  if (s.includes('OBGY') || s.includes('OBSTET') || s.includes('GYNEC') || s.includes('MIDWIFE') || s.includes('MIDWIFERY'))
    return kw(['OBGY','OBG','OBSTET','GYNEC','MIDWIFE','MATERNAL','ANTENATAL','POSTNATAL','LABOUR','LABOR','DELIVERY','PRENATAL']);

  if (s.includes('COMMUNITY') || s.includes('CHN'))
    return kw(['COMMUNITY','CHN','PUBLIC HEALTH','EPIDEMIOL','IMMUNIZ','VACCINE','PRIMARY HEALTH']);

  if (s.includes('NURSING FOUNDATION') || s.includes('FUNDAMENTAL'))
    return kw(['NURSING FOUND','FUNDAMENTAL','BASIC NURSING','BEDSIDE','VITAL SIGN','HYGIENE','MICROBIOL']);

  if (s.includes('NURSING RESEARCH') || s.includes('RESEARCH'))
    return kw(['RESEARCH','STATISTIC','EPIDEMIOL','BIOSTATISTIC','STUDY DESIGN','EVIDENCE']);

  if (s.includes('MENTAL') || s.includes('PSYCHI') || s.includes('PSYCHO'))
    return kw(['MENTAL','PSYCHI','PSYCHO','PSYCHIATRIC','DEPRESSION','ANXIETY','SCHIZO']);

  if (s.includes('NORCET') || s.includes('AIIMS'))
    return kw(['NORCET','AIIMS','TAT','TEST']);

  // Fallback: match if subject name words appear in title
  const subjectWords = s.split(/[\s&,()]+/).filter(w => w.length > 3);
  return subjectWords.some(w => t.includes(w));
}


async function fetchSubjectMaterials(batchId, subjectId, accordionEl) {
  const subVids = accordionEl.querySelector(`#sub-vids-${subjectId}`);
  const subNotes = accordionEl.querySelector(`#sub-notes-${subjectId}`);
  const subTests = accordionEl.querySelector(`#sub-tests-${subjectId}`);
  const metaCount = accordionEl.querySelector(`#sub-meta-count-${subjectId}`);

  const token = localStorage.getItem('nnl_access_token');
  const isGuest = token === 'GUEST_DEMO_TOKEN';

  try {
    let videos = [];
    let notes = [];
    let tests = [];

    if (isGuest) {
      const mock = MOCK_SUBJECT_MATERIALS[subjectId] || MOCK_SUBJECT_MATERIALS[466];
      videos = mock.videos;
      notes = mock.notes;
      tests = mock.tests;
    } else {
      // Load real API materials in parallel
      let vResponse = await fetch(`${API_BASE}/batch_cms/videos/?batch_id=${batchId}&subject_id=${subjectId}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      let nResponse = await fetch(`${API_BASE}/batch_cms/batch_handwritten_notes/?batch_id=${batchId}&subject_id=${subjectId}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      let tResponse = await fetch(`${API_BASE}/batch_cms/test/?batch_id=${batchId}&subject_id=${subjectId}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });

      if (vResponse.status === 401 || nResponse.status === 401 || tResponse.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          const newToken = localStorage.getItem('nnl_access_token');
          vResponse = await fetch(`${API_BASE}/batch_cms/videos/?batch_id=${batchId}&subject_id=${subjectId}`, {
            headers: { 'Authorization': `Bearer ${newToken}`, 'Accept': 'application/json' }
          });
          nResponse = await fetch(`${API_BASE}/batch_cms/batch_handwritten_notes/?batch_id=${batchId}&subject_id=${subjectId}`, {
            headers: { 'Authorization': `Bearer ${newToken}`, 'Accept': 'application/json' }
          });
          tResponse = await fetch(`${API_BASE}/batch_cms/test/?batch_id=${batchId}&subject_id=${subjectId}`, {
            headers: { 'Authorization': `Bearer ${newToken}`, 'Accept': 'application/json' }
          });
        } else {
          handleLogout();
          return;
        }
      }

      if (vResponse.ok) {
        const d = await vResponse.json();
        const allVideos = d.data || d.results || [];
        // The API ignores subject_id — filter client-side by keyword matching
        const subjectTitle = accordionEl.querySelector('.subject-name')?.textContent || '';
        videos = allVideos.filter(v => doesItemBelongToSubject(v.title, subjectTitle));
        // If nothing matches (e.g. subject not in our keyword map), show all to avoid empty section
        if (videos.length === 0) videos = allVideos;
      } else {
        throw new Error(`Videos fetch failed with status ${vResponse.status}`);
      }

      if (nResponse.ok) {
        const d = await nResponse.json();
        const allNotes = d.data || d.results || [];
        const subjectTitle = accordionEl.querySelector('.subject-name')?.textContent || '';
        notes = allNotes.filter(n => doesItemBelongToSubject(n.title, subjectTitle));
        if (notes.length === 0) notes = allNotes;
      } else {
        throw new Error(`Notes fetch failed with status ${nResponse.status}`);
      }

      if (tResponse.ok) {
        const d = await tResponse.json();
        const allTests = d.data || d.results || [];
        const subjectTitle = accordionEl.querySelector('.subject-name')?.textContent || '';
        tests = allTests.filter(t => doesItemBelongToSubject(t.title, subjectTitle));
        if (tests.length === 0) tests = allTests;
      } else {
        throw new Error(`Tests fetch failed with status ${tResponse.status}`);
      }
    }

    accordionEl.setAttribute('data-loaded', 'true');
    if (metaCount) {
      metaCount.textContent = `(${videos.length} videos, ${notes.length} notes, ${tests.length} tests)`;
    }

    // 1. Populate videos
    let vidsHtml = '<div class="material-column-title">📹 Recorded Classes</div>';
    if (videos.length === 0) {
      vidsHtml += '<p style="color: var(--text-muted); font-size: 0.7rem; padding: 0.5rem 0; margin: 0; text-align: center;">No recorded lectures available.</p>';
    } else {
      videos.forEach(v => {
        const durHrs = v.duration ? Math.floor(v.duration / 3600) : 2;
        const durMins = v.duration ? Math.floor((v.duration % 3600) / 60) : 0;
        const durStr = `${durHrs}h ${durMins}m`;

        vidsHtml += `
          <div class="material-item">
            <div class="material-item-info">
              <span class="material-item-title" title="${v.title}">${v.title}</span>
              <span class="material-item-meta">${v.faculty?.name || 'Faculty'} • ${durStr}</span>
            </div>
            <button class="material-item-btn play-class-btn" data-id="${v.id}">Play</button>
          </div>
        `;
      });
    }
    subVids.innerHTML = vidsHtml;

    // Bind play click listeners
    subVids.querySelectorAll('.play-class-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const vidId = btn.getAttribute('data-id');
        let selectedVid = videos.find(v => String(v.id) === String(vidId));
        if (!selectedVid) {
          // Check mock fallback
          selectedVid = videos[0];
        }
        if (selectedVid) {
          openRecordingPlayer(selectedVid);
        }
      });
    });

    // 2. Populate notes
    let notesHtml = '<div class="material-column-title">📄 Class Notes</div>';
    if (notes.length === 0) {
      notesHtml += '<p style="color: var(--text-muted); font-size: 0.7rem; padding: 0.5rem 0; margin: 0; text-align: center;">No PDF notes available.</p>';
    } else {
      notes.forEach(n => {
        notesHtml += `
          <div class="material-item">
            <div class="material-item-info">
              <span class="material-item-title" title="${n.title}">${n.title}</span>
              <span class="material-item-meta">PDF Material</span>
            </div>
            <a href="${n.url}" target="_blank" class="material-item-btn" style="text-decoration: none;">View</a>
          </div>
        `;
      });
    }
    subNotes.innerHTML = notesHtml;

    // 3. Populate tests
    let testsHtml = '<div class="material-column-title">📝 Practice Tests</div>';
    if (tests.length === 0) {
      testsHtml += '<p style="color: var(--text-muted); font-size: 0.7rem; padding: 0.5rem 0; margin: 0; text-align: center;">No quizzes available.</p>';
    } else {
      tests.forEach(t => {
        testsHtml += `
          <div class="material-item">
            <div class="material-item-info">
              <span class="material-item-title" title="${t.title}">${t.title}</span>
              <span class="material-item-meta">${t.total_question || 30} Qs • ${Math.floor(t.duration / 60)} mins</span>
            </div>
            <button class="material-item-btn btn-test start-test-btn" data-id="${t.id}" data-title="${t.title}" data-duration="${t.duration || 1800}">Start</button>
          </div>
        `;
      });
    }
    subTests.innerHTML = testsHtml;

    // Bind start test click listeners
    subTests.querySelectorAll('.start-test-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const testId = btn.getAttribute('data-id');
        const testTitle = btn.getAttribute('data-title');
        const duration = parseInt(btn.getAttribute('data-duration'), 10);
        loadQuiz(testId, testTitle, duration);
      });
    });

  } catch (error) {
    console.error('Error loading subject materials:', error);
    subVids.innerHTML = `<div class="material-column-title">📹 Recorded Classes</div><p style="color:#f87171; font-size:0.7rem; text-align:center; padding:0.5rem 0;">Sync failed: ${error.message}</p>`;
    subNotes.innerHTML = `<div class="material-column-title">📄 Class Notes</div><p style="color:#f87171; font-size:0.7rem; text-align:center; padding:0.5rem 0;">Sync failed: ${error.message}</p>`;
    subTests.innerHTML = `<div class="material-column-title">📝 Practice Tests</div><p style="color:#f87171; font-size:0.7rem; text-align:center; padding:0.5rem 0;">Sync failed: ${error.message}</p>`;
  }
}

// CBT QUIZ VIEWER ENGINE
let quizTimerInterval = null;
let quizQuestions = [];
let quizAnswers = {}; // map index -> selected choice id
let currentQuestionIndex = 0;
let quizTimeRemaining = 0;
let currentTestId = null;

async function loadQuiz(testId, testTitle, duration) {
  const viewer = document.getElementById('quiz-viewer');
  const titleEl = document.getElementById('quiz-title');
  const metaEl = document.getElementById('quiz-meta');
  const loader = document.getElementById('dashboard-loader');
  
  if (!viewer) return;
  
  currentTestId = testId;
  quizAnswers = {};
  currentQuestionIndex = 0;
  
  if (titleEl) titleEl.textContent = testTitle;
  
  const token = localStorage.getItem('nnl_access_token');
  const isGuest = token === 'GUEST_DEMO_TOKEN' || String(testId).startsWith('99');
  
  if (loader) loader.classList.remove('hide');
  
  try {
    if (isGuest) {
      quizQuestions = MOCK_QUIZ_QUESTIONS[testId] || MOCK_QUIZ_QUESTIONS[9901];
    } else {
      // Fetch live quiz questions
      let response = await fetch(`${API_BASE}/batch_cms/test/${testId}/questions/`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      
      if (response.status === 401 || response.status === 403) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          const newToken = localStorage.getItem('nnl_access_token');
          response = await fetch(`${API_BASE}/batch_cms/test/${testId}/questions/`, {
            headers: { 'Authorization': `Bearer ${newToken}`, 'Accept': 'application/json' }
          });
        } else {
          handleLogout();
          return;
        }
      }

      if (response.ok) {
        const d = await response.json();
        quizQuestions = d.data || d.results || [];
      } else {
        quizQuestions = MOCK_QUIZ_QUESTIONS[9901];
      }
    }
    
    if (loader) loader.classList.add('hide');
    
    if (!quizQuestions || quizQuestions.length === 0) {
      showCustomAlert('No questions available in this test.', 'ERROR');
      return;
    }
    
    if (metaEl) metaEl.textContent = `Total Questions: ${quizQuestions.length} • Duration: ${Math.floor(duration / 60)} mins`;
    
    viewer.classList.remove('hide');
    document.getElementById('quiz-question-view').classList.remove('hide');
    document.getElementById('quiz-result-view').classList.add('hide');
    document.getElementById('quiz-prev-btn').classList.remove('hide');
    document.getElementById('quiz-next-btn').classList.remove('hide');
    document.getElementById('quiz-show-ans-btn').classList.remove('hide');
    document.getElementById('quiz-submit-btn').classList.remove('hide');
    
    renderQuestion();
    updateQuizNavigator();
    
    // Start countdown timer
    if (quizTimerInterval) clearInterval(quizTimerInterval);
    quizTimeRemaining = duration;
    updateTimerDisplay();
    
    quizTimerInterval = setInterval(() => {
      quizTimeRemaining--;
      updateTimerDisplay();
      if (quizTimeRemaining <= 0) {
        clearInterval(quizTimerInterval);
        submitQuiz();
      }
    }, 1000);
    
  } catch (err) {
    console.error('Quiz initialization failed:', err);
    if (loader) loader.classList.add('hide');
    showCustomAlert('Unable to load quiz details. Try again.', 'ERROR');
  }
}

function updateTimerDisplay() {
  const el = document.getElementById('quiz-timer');
  if (!el) return;
  const m = Math.floor(quizTimeRemaining / 60).toString().padStart(2, '0');
  const s = (quizTimeRemaining % 60).toString().padStart(2, '0');
  el.textContent = `${m}:${s}`;
  if (quizTimeRemaining < 60) {
    el.style.color = '#f87171';
    el.style.borderColor = 'rgba(239,68,68,0.4)';
  } else {
    el.style.color = '#00f3d0';
    el.style.borderColor = 'rgba(0,243,208,0.35)';
  }
}

function renderQuestion() {
  const q = quizQuestions[currentQuestionIndex];
  if (!q) return;
  
  document.getElementById('question-number-badge').textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
  document.getElementById('question-level-badge').textContent = q.level_str || 'Medium';
  document.getElementById('question-text').innerHTML = q.title;
  
  const optionsList = document.getElementById('quiz-options-list');
  optionsList.innerHTML = '';
  
  const explanationEl = document.getElementById('question-explanation');
  explanationEl.classList.add('hide');

  const selectedChoiceId = quizAnswers[currentQuestionIndex];
  const markers = ['A', 'B', 'C', 'D', 'E', 'F'];
  
  q.choices.forEach((c, idx) => {
    const isSelected = selectedChoiceId === c.id;
    const optionBtn = document.createElement('button');
    optionBtn.className = `quiz-option-btn ${isSelected ? 'selected' : ''}`;
    optionBtn.innerHTML = `
      <span class="option-marker">${markers[idx] || (idx+1)}</span>
      <span class="option-title-text">${c.title}</span>
    `;
    
    optionBtn.addEventListener('click', () => {
      // Do not allow selecting if results or answer shown
      if (!explanationEl.classList.contains('hide')) return;
      
      quizAnswers[currentQuestionIndex] = c.id;
      
      // Update styling instantly
      optionsList.querySelectorAll('.quiz-option-btn').forEach(btn => btn.classList.remove('selected'));
      optionBtn.classList.add('selected');
      
      updateQuizNavigator();
    });
    
    optionsList.appendChild(optionBtn);
  });
}

function showAnswer() {
  const q = quizQuestions[currentQuestionIndex];
  if (!q) return;
  
  const optionsList = document.getElementById('quiz-options-list');
  const explanationEl = document.getElementById('question-explanation');
  const explanationTextEl = document.getElementById('explanation-text');
  
  let explanationHtml = '';
  
  q.choices.forEach((c, idx) => {
    const btn = optionsList.children[idx];
    if (!btn) return;
    
    if (c.is_correct) {
      btn.classList.add('correct');
      if (c.correct_explanation) {
        explanationHtml = c.correct_explanation;
      }
    } else if (quizAnswers[currentQuestionIndex] === c.id) {
      btn.classList.add('incorrect');
    }
  });

  if (!explanationHtml) {
    // Check incorrect options correct explanations
    const correctOpt = q.choices.find(c => c.is_correct);
    if (correctOpt && correctOpt.correct_explanation) {
      explanationHtml = correctOpt.correct_explanation;
    }
  }

  if (explanationHtml) {
    explanationTextEl.innerHTML = explanationHtml;
    explanationEl.classList.remove('hide');
  }
}

function updateQuizNavigator() {
  const grid = document.getElementById('quiz-navigator-grid');
  if (!grid) return;
  grid.innerHTML = '';
  
  quizQuestions.forEach((_, idx) => {
    const btn = document.createElement('button');
    const isAnswered = quizAnswers[idx] !== undefined;
    btn.className = `quiz-nav-item ${idx === currentQuestionIndex ? 'active' : ''} ${isAnswered ? 'answered' : ''}`;
    btn.textContent = idx + 1;
    
    btn.addEventListener('click', () => {
      // Do not allow jumping around if in result view
      if (document.getElementById('quiz-question-view').classList.contains('hide')) return;
      
      currentQuestionIndex = idx;
      renderQuestion();
      updateQuizNavigator();
    });
    grid.appendChild(btn);
  });
}

function submitQuiz() {
  if (quizTimerInterval) clearInterval(quizTimerInterval);
  
  // Calculate score
  let correctCount = 0;
  quizQuestions.forEach((q, idx) => {
    const ans = quizAnswers[idx];
    const correctChoice = q.choices.find(c => c.is_correct);
    if (correctChoice && ans === correctChoice.id) {
      correctCount++;
    }
  });
  
  const pct = Math.round((correctCount / quizQuestions.length) * 100);
  
  document.getElementById('result-percentage').textContent = `${pct}%`;
  document.getElementById('result-ratio').textContent = `${correctCount} / ${quizQuestions.length} Correct`;
  
  let feedback = 'Practice more to master these topics!';
  if (pct >= 85) feedback = 'Sensational! You are fully prepared for the NORCET board.';
  else if (pct >= 70) feedback = 'Excellent job! Review your weak topics to target a higher rank.';
  else if (pct >= 50) feedback = 'Good effort! Go through the class notes and videos to clarify concepts.';
  
  document.getElementById('result-feedback').textContent = feedback;
  
  document.getElementById('quiz-question-view').classList.add('hide');
  document.getElementById('quiz-result-view').classList.remove('hide');
  
  document.getElementById('quiz-prev-btn').classList.add('hide');
  document.getElementById('quiz-next-btn').classList.add('hide');
  document.getElementById('quiz-show-ans-btn').classList.add('hide');
  document.getElementById('quiz-submit-btn').classList.add('hide');
}

function closeQuiz() {
  if (quizTimerInterval) clearInterval(quizTimerInterval);
  document.getElementById('quiz-viewer').classList.add('hide');
}

// Bind Quiz Control actions
document.getElementById('quiz-prev-btn').addEventListener('click', () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion();
    updateQuizNavigator();
  }
});

document.getElementById('quiz-next-btn').addEventListener('click', () => {
  if (currentQuestionIndex < quizQuestions.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
    updateQuizNavigator();
  }
});

document.getElementById('quiz-show-ans-btn').addEventListener('click', showAnswer);
document.getElementById('quiz-submit-btn').addEventListener('click', () => {
  const unansweredCount = quizQuestions.length - Object.keys(quizAnswers).length;
  if (unansweredCount > 0) {
    showCustomConfirm(`You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`, 'CONFIRM SUBMISSION')
    .then(approved => {
      if (approved) submitQuiz();
    });
  } else {
    submitQuiz();
  }
});

document.getElementById('quiz-close-btn').addEventListener('click', closeQuiz);
document.getElementById('quiz-restart-btn').addEventListener('click', () => {
  const duration = quizQuestions.length * 60; // 1 min per question
  loadQuiz(currentTestId, document.getElementById('quiz-title').textContent, duration);
});



