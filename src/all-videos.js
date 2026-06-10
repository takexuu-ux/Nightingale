// Nightingale Recorded Lectures Library Logic

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? '/api' : 'https://prod-api.nnlone.com';

const MOCK_RECORDINGS = [
  {
    id: 'rec-pharma-1',
    title: 'Pharmacology Day 1: Anti-Hypertensive Drugs & Cardiac Assessment',
    instructor: 'Dr. Suresh Sharma',
    batch: 'Blue Sapphire Batch',
    subject: 'Pharmacology',
    date: '2026-06-05',
    duration: '2h 15m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  },
  {
    id: 'rec-pharma-2',
    title: 'Pharmacology Day 2: Diuretics & Renin-Angiotensin System',
    instructor: 'Dr. Suresh Sharma',
    batch: 'Blue Sapphire Batch',
    subject: 'Pharmacology',
    date: '2026-06-06',
    duration: '1h 50m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
  },
  {
    id: 'rec-cardio-1',
    title: 'Cardiology Day 1: ECG Interpretation Fundamentals',
    instructor: 'Dr. Suresh Sharma',
    batch: 'Blue Sapphire Batch',
    subject: 'Cardiology',
    date: '2026-06-04',
    duration: '2h 30m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
  },
  {
    id: 'rec-anatomy-1',
    title: 'Anatomy Day 1: Cardiovascular System Structure & Chambers',
    instructor: 'Dr. Suresh Sharma',
    batch: 'Blue Sapphire Batch',
    subject: 'Anatomy & Physiology',
    date: '2026-06-01',
    duration: '2h 10m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
  },
  {
    id: 'rec-anatomy-2',
    title: 'Anatomy Day 2: Nervous System & Cranial Nerve Pathways',
    instructor: 'Dr. Suresh Sharma',
    batch: 'Blue Sapphire Batch',
    subject: 'Anatomy & Physiology',
    date: '2026-06-02',
    duration: '1h 55m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
  }
];

let currentRecordings = [];
const classListContainer = document.getElementById('class-list-container');

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

function getApiBatchId(batchName) {
  if (!batchName) return 8;
  const name = batchName.toUpperCase();
  if (name.includes('SAPPHIRE') || name.includes('BLUE')) return 8;
  if (name.includes('PEARL') && name.includes('ENGLISH')) return 7;
  if (name.includes('PEARL')) return 8;
  if (name.includes('FASTRACK')) return 3;
  if (name.includes('BRAHMASTRA')) return 9;
  if (name.includes('ECONOMY')) return 1;
  return 8;
}

function initBackgroundParallax() {
  // Handled by smooth hardware-accelerated CSS keyframe animation
}

async function loadRecordings() {
  if (classListContainer) {
    classListContainer.innerHTML = `
      <div class="full-loader" style="grid-column: 1 / -1; background: rgba(10, 11, 16, 0.15); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 3rem; text-align: center;">
        <div class="spinner"></div>
        <p style="color: var(--text-secondary); margin-top: 0.5rem; font-family: var(--font-display); font-size: 0.75rem; letter-spacing: 0.05em; text-transform: uppercase;">Loading Recorded Lectures...</p>
      </div>
    `;
  }

  const token = localStorage.getItem('nnl_access_token');
  const activeBatch = localStorage.getItem('nnl_active_batch') || 'Blue Sapphire Batch';
  const batchId = getApiBatchId(activeBatch);
  const isGuest = !token || token === 'GUEST_DEMO_TOKEN';

  let allRecordings = [];

  if (isGuest) {
    // Show mock recordings filtered for guest
    allRecordings = MOCK_RECORDINGS.filter(r => getSimplifiedBatchTitle(r.batch) === getSimplifiedBatchTitle(activeBatch));
  } else {
    try {
      // 1. Fetch batches to get subjects
      const response = await fetch(`${API_BASE}/cms/batches/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const apiBatches = data.data || data.results || data || [];
        const targetBatchName = getSimplifiedBatchTitle(activeBatch);
        const matchedBatch = apiBatches.find(b => b.id === batchId || getSimplifiedBatchTitle(b.title) === targetBatchName);

        if (matchedBatch && matchedBatch.subjects && matchedBatch.subjects.length > 0) {
          // 2. Fetch videos for all subjects in parallel
          const videoPromises = matchedBatch.subjects.map(async (subj) => {
            try {
              const vRes = await fetch(`${API_BASE}/batch_cms/videos/?batch_id=${batchId}&subject_id=${subj.id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json'
                }
              });
              if (vRes.ok) {
                const vData = await vRes.json();
                const vList = vData.data || vData.results || [];
                return vList.map(v => {
                  const durHrs = v.duration ? Math.floor(v.duration / 3600) : 2;
                  const durMins = v.duration ? Math.floor((v.duration % 3600) / 60) : 0;
                  const durStr = `${durHrs}h ${durMins}m`;
                  return {
                    id: v.id,
                    title: v.title,
                    instructor: v.faculty?.name || 'Faculty',
                    batch: activeBatch,
                    subject: subj.title,
                    date: v.schedule_start_time ? v.schedule_start_time.split('T')[0] : '',
                    duration: durStr,
                    video_cipher_id: v.video_cipher_id,
                    videoUrl: ''
                  };
                });
              }
            } catch (err) {
              console.warn(`Failed to fetch videos for subject ${subj.title}:`, err);
            }
            return [];
          });

          const results = await Promise.all(videoPromises);
          allRecordings = results.flat();
        }
      }
    } catch (e) {
      console.warn('Unable to fetch live recordings from API:', e);
    }
  }

  // Fallback to mock if nothing loaded
  if (allRecordings.length === 0) {
    allRecordings = MOCK_RECORDINGS.filter(r => getSimplifiedBatchTitle(r.batch) === getSimplifiedBatchTitle(activeBatch));
  }

  currentRecordings = allRecordings;
  renderRecordingsList(allRecordings);
}

function renderRecordingsList(recordings) {
  if (!classListContainer) return;
  classListContainer.innerHTML = '';
  
  // Group by Subject
  const bySubject = {};
  recordings.forEach(r => {
    const s = r.subject || 'General Nursing';
    if (!bySubject[s]) bySubject[s] = [];
    bySubject[s].push(r);
  });
  
  const subjectNames = Object.keys(bySubject).sort();
  if (subjectNames.length === 0) {
    classListContainer.innerHTML = `
      <div class="full-loader" style="grid-column: 1 / -1; background: rgba(10, 11, 16, 0.15); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 3rem; text-align: center;">
        <p style="color: var(--text-secondary); font-size: 0.85rem; font-family: var(--font-display); letter-spacing: 0.05em; text-transform: uppercase; margin: 0;">No recorded lectures available.</p>
      </div>
    `;
    return;
  }
  
  subjectNames.forEach(subjectName => {
    const subjectClasses = bySubject[subjectName];
    
    let rowsHtml = '';
    subjectClasses.forEach((rec, idx) => {
      const rowNum = (idx + 1).toString().padStart(2, '0');
      const hasUrl = !!rec.videoUrl || !!rec.video_cipher_id;
      
      rowsHtml += `
        <div class="recording-row" data-rec-id="${rec.id}">
          <div class="recording-row-num">${rowNum}</div>
          <div class="recording-row-info">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <div class="recording-row-title" title="${rec.title}" style="margin-bottom: 0;">${rec.title}</div>
              <span class="badge" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: var(--text-secondary); font-size: 0.65rem; padding: 0.1rem 0.35rem; border-radius: 6px; font-family: var(--font-display); font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em;">${rec.batch}</span>
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
            <span>Play</span>
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
    
    classListContainer.appendChild(subjectAccordion);
  });
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
  
  if (classListContainer) {
    classListContainer.addEventListener('click', (e) => {
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
        if (rec) openRecordingPlayer(rec);
        return;
      }
      
      const recRow = e.target.closest('.recording-row');
      if (recRow && !e.target.closest('.recording-row-action')) {
        const recId = recRow.getAttribute('data-rec-id');
        const rec = currentRecordings.find(r => String(r.id) === String(recId));
        if (rec) openRecordingPlayer(rec);
        return;
      }
    });
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
    if (noUrlEl) noUrlEl.classList.add('hide');
  } else {
    if (videoEl) {
      videoEl.src = '';
      videoEl.classList.add('hide');
    }
    if (noUrlEl) noUrlEl.classList.remove('hide');
  }
}

// Bind back button
const btnBackDashboard = document.getElementById('btn-back-dashboard');
if (btnBackDashboard) {
  btnBackDashboard.addEventListener('click', () => {
    window.location.href = '/';
  });
}

// Initialize page elements
initBackgroundParallax();
initRecordingsViewer();
loadRecordings();
