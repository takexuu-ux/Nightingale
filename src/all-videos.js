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
  },
  // C+ Batch Mock Recorded Lectures
  {
    id: 'rec-cplus-medsurg-1',
    title: 'Medical-Surgical Day 1: Fluid & Electrolyte Balance & IV Therapy',
    instructor: 'Prof. Priyanka Bansal',
    batch: 'C+ Batch',
    subject: 'Medical-Surgical Nursing',
    date: '2026-07-01',
    duration: '2h 45m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'rec-cplus-medsurg-2',
    title: 'Medical-Surgical Day 2: Acid-Base Balance & ABG Interpretation',
    instructor: 'Prof. Priyanka Bansal',
    batch: 'C+ Batch',
    subject: 'Medical-Surgical Nursing',
    date: '2026-07-02',
    duration: '2h 20m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  },
  {
    id: 'rec-cplus-obg-1',
    title: 'OBG Day 1: Antenatal Assessment & Fetal Circulation',
    instructor: 'Dr. Suresh Sharma',
    batch: 'C+ Batch',
    subject: 'Obstetrics & Gynecology',
    date: '2026-07-03',
    duration: '2h 10m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  },
  {
    id: 'rec-cplus-obg-2',
    title: 'OBG Day 2: Stages of Labor & Obstetric Emergencies',
    instructor: 'Dr. Suresh Sharma',
    batch: 'C+ Batch',
    subject: 'Obstetrics & Gynecology',
    date: '2026-07-04',
    duration: '2h 35m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
  },
  {
    id: 'rec-cplus-peds-1',
    title: 'Pediatric Day 1: Growth & Development Milestones',
    instructor: 'Prof. Priyanka Bansal',
    batch: 'C+ Batch',
    subject: 'Pediatric Nursing',
    date: '2026-07-05',
    duration: '1h 45m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
  },
  {
    id: 'rec-cplus-pharma-1',
    title: 'Pharmacology Day 1: Antimicrobials & Drug Calculations',
    instructor: 'Dr. Suresh Sharma',
    batch: 'C+ Batch',
    subject: 'Pharmacology',
    date: '2026-07-06',
    duration: '2h 15m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
  }
];

let currentRecordings = [];
const classListContainer = document.getElementById('class-list-container');

function findVideoUrl(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') {
    if (obj.startsWith('http') && (obj.includes('.mp4') || obj.includes('.m3u8') || obj.includes('download') || obj.includes('stream') || obj.includes('video'))) {
      return obj;
    }
    return '';
  }
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const result = findVideoUrl(obj[key]);
        if (result) return result;
      }
    }
  }
  return '';
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
  if (tUpper.includes('C+') || tUpper.includes('C PLUS')) {
    return 'C+ Batch';
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
  if (name.includes('C+') || name.includes('C PLUS')) return 11;
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
              const vRes = await fetch(`${API_BASE}/batch_cms/videos/?batch_id=${matchedBatch.id}&subject_id=${subj.id}`, {
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
                  console.log("Mapping video object:", v.title, "keys:", Object.keys(v));
                  const extractedUrl = v.video_url || v.videoUrl || v.url || v.download_url || v.download_link || findVideoUrl(v) || '';
                  return {
                    id: v.id,
                    title: v.title,
                    instructor: v.faculty?.name || 'Faculty',
                    batch: activeBatch,
                    subject: subj.title,
                    date: v.schedule_start_time ? v.schedule_start_time.split('T')[0] : '',
                    duration: durStr,
                    video_cipher_id: v.video_cipher_id,
                    videoUrl: extractedUrl
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

function getLectureNumber(title) {
  const match = title.match(/(?:Day|Lecture|Class)\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : 999;
}

function renderRecordingsList(recordings) {
  if (!classListContainer) return;
  classListContainer.innerHTML = '';

  if (recordings.length === 0) {
    classListContainer.innerHTML = `
      <div style="background: rgba(10, 11, 16, 0.15); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 2rem; text-align: center;">
        <p style="color: var(--text-secondary); font-size: 0.8rem; text-transform: uppercase; margin: 0;">No recorded lectures available.</p>
      </div>
    `;
    const badge = document.getElementById('lectures-count-badge');
    if (badge) badge.textContent = '0 Lectures';
    return;
  }

  // Group by Subject
  const bySubject = {};
  recordings.forEach(r => {
    const s = r.subject || 'General Nursing';
    if (!bySubject[s]) bySubject[s] = [];
    bySubject[s].push(r);
  });

  const subjectNames = Object.keys(bySubject).sort();
  subjectNames.forEach(subjectName => {
    const subjectClasses = bySubject[subjectName];

    // Sort sequentially by lecture/day number inside each subject
    subjectClasses.sort((a, b) => {
      const numA = getLectureNumber(a.title);
      const numB = getLectureNumber(b.title);
      return numA - numB;
    });

    let rowsHtml = '';
    subjectClasses.forEach((rec, idx) => {
      const rowNum = (idx + 1).toString().padStart(2, '0');
      const hasUrl = !!rec.videoUrl || !!rec.video_cipher_id;

      rowsHtml += `
        <div class="recording-row" data-rec-id="${rec.id}">
          <div class="recording-row-num">${rowNum}</div>
          <div class="recording-row-info">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <div class="recording-row-title" title="${rec.title}" style="margin-bottom: 0; font-size: 0.82rem; line-height: 1.3;">${rec.title}</div>
            </div>
            <div class="recording-row-meta" style="margin-top: 0.25rem; font-size: 0.7rem;">
              <span class="recording-row-instructor">${rec.instructor}</span>
              <span>•</span>
              <span>${rec.duration}</span>
            </div>
          </div>
          <div class="recording-row-actions-group" style="display: flex; gap: 0.4rem; align-items: center; flex-shrink: 0;">
            <button class="recording-row-action ${hasUrl ? '' : 'unavailable'}" data-rec-id="${rec.id}">
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" style="margin-right: 0.2rem;">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span>Play</span>
            </button>
            ${rec.videoUrl ? `
            <a href="${rec.videoUrl}" download="${rec.title}.mp4" class="recording-row-action download-btn" target="_blank" style="background: linear-gradient(135deg, #10B981, #059669); border-color: #10B981; color: #fff; text-decoration: none; display: flex; align-items: center; justify-content: center; height: 32px; padding: 0 0.75rem; border-radius: 8px; font-weight: 700; font-size: 0.72rem; letter-spacing: 0.05em; text-transform: uppercase; gap: 0.35rem; cursor: pointer; transition: all 0.2s ease;">
              <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span>Download</span>
            </a>
            ` : ''}
          </div>
        </div>
      `;
    });

    const subjectAccordion = document.createElement('div');
    subjectAccordion.className = 'subject-accordion open';
    subjectAccordion.innerHTML = `
      <div class="subject-accordion-header" style="padding: 0.6rem 0.8rem;">
        <div class="subject-accordion-title">
          <div class="subject-icon">📚</div>
          <span class="subject-name" style="font-size: 0.8rem; font-weight: 700;">${subjectName}</span>
          <span class="subject-count" style="font-size: 0.7rem; color: var(--text-secondary);">(${subjectClasses.length})</span>
        </div>
        <svg class="subject-chevron" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
        </svg>
      </div>
      <div class="subject-accordion-body">
        ${rowsHtml}
      </div>
    `;

    classListContainer.appendChild(subjectAccordion);
  });

  // Update badge count
  const badge = document.getElementById('lectures-count-badge');
  if (badge) {
    badge.textContent = `${recordings.length} Lectures`;
  }
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

  // Handle compact card expand/collapse toggle
  const widgetContainer = document.getElementById('library-widget-container');
  const widgetHeader = document.getElementById('library-widget-header');
  if (widgetHeader && widgetContainer) {
    widgetHeader.addEventListener('click', () => {
      widgetContainer.classList.toggle('expanded');
    });
  }

  // Handle play row and subject header click triggers
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
      if (playBtn && !playBtn.classList.contains('download-btn')) {
        e.stopPropagation();
        const recId = playBtn.getAttribute('data-rec-id');
        const rec = currentRecordings.find(r => String(r.id) === String(recId));
        if (rec) openRecordingPlayer(rec);
        return;
      }

      const recRow = e.target.closest('.recording-row');
      if (recRow && !e.target.closest('.recording-row-actions-group')) {
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
