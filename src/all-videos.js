// Nightingale Recorded Lectures Library Logic

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
    id: 'rec-comm-1',
    title: 'Community Health Nursing: Maternal & Child Health Indicators',
    instructor: 'Mukhminder Singh',
    batch: 'Pearl Batch',
    subject: 'Community Health Nursing',
    date: '2026-06-05',
    duration: '1h 45m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
  },
  {
    id: 'rec-comm-2',
    title: 'Community Health Nursing: Immunization Schedules & Cold Chain',
    instructor: 'Mukhminder Singh',
    batch: 'Pearl Batch',
    subject: 'Community Health Nursing',
    date: '2026-06-06',
    duration: '2h 05m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
  },
  {
    id: 'rec-ped-1',
    title: 'Pediatric Care: Growth & Development Milestones',
    instructor: 'Mukhminder Singh',
    batch: 'Pearl Batch',
    subject: 'Pediatrics',
    date: '2026-06-03',
    duration: '1h 30m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4'
  },
  {
    id: 'rec-ped-2',
    title: 'Pediatric Care: Neonatal Reflexes & Growth Assessment',
    instructor: 'Mukhminder Singh',
    batch: 'Pearl Batch',
    subject: 'Pediatrics',
    date: '2026-06-02',
    duration: '1h 40m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
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
  {
    id: 'rec-mental-1',
    title: 'Mental Health Nursing: Schizophrenia Spectrum Disorders & Nursing Care',
    instructor: 'Dr. Suresh Sharma',
    batch: 'Pearl Batch',
    subject: 'Mental Health Nursing',
    date: '2026-05-28',
    duration: '2h 05m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  },
  {
    id: 'rec-mental-2',
    title: 'Mental Health Nursing: Therapeutic Communication in Psychiatry',
    instructor: 'Dr. Suresh Sharma',
    batch: 'Pearl Batch',
    subject: 'Mental Health Nursing',
    date: '2026-05-29',
    duration: '1h 35m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  }
];

let currentRecordings = [];
const classListContainer = document.getElementById('class-list-container');

function getSubjectFromTitle(title) {
  const t = title.toUpperCase();
  if (t.includes('PHARMACOLOGY') || t.includes('DRUG')) return 'Pharmacology';
  if (t.includes('COMMUNITY') || t.includes('HEALTH') || t.includes('EPIDEMIOLOGY')) return 'Community Health Nursing';
  if (t.includes('PEDIATRIC') || t.includes('NEONATAL') || t.includes('REFLEX')) return 'Pediatrics';
  if (t.includes('CARDIAC') || t.includes('CARDIOVASCULAR') || t.includes('ECG') || t.includes('HEART') || t.includes('CARDIOLOGY')) return 'Cardiology';
  if (t.includes('ANATOMY') || t.includes('PHYSIOLOGY')) return 'Anatomy & Physiology';
  if (t.includes('MENTAL') || t.includes('PSYCHIATRY')) return 'Mental Health Nursing';
  if (t.includes('ENDOCRINE') || t.includes('INSULIN') || t.includes('DIABETES')) return 'Endocrine System';
  if (t.includes('NURSING') && t.includes('FOUNDATION')) return 'Nursing Foundations';
  return 'General Nursing';
}

function initBackgroundParallax() {
  const wrapper = document.querySelector('.bg-drift-wrapper');
  if (!wrapper) return;
  
  let currentX = 0;
  let currentY = 0;
  
  function updateParallax(timestamp) {
    const t = timestamp / 1000;
    
    // Slow continuous auto-drift — more visible, purely time-based.
    // X: gentle side-to-side on a 16-second sine cycle (±15px)
    // Y: slower up-down on a 22-second cosine cycle    (±10px)
    const targetX = Math.sin(t / 16) * 15;
    const targetY = Math.cos(t / 22) * 10;
    
    currentX += (targetX - currentX) * 0.025;
    currentY += (targetY - currentY) * 0.025;
    
    wrapper.style.transform = `scale(1.03) translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(updateParallax);
  }
  
  requestAnimationFrame(updateParallax);
}

async function loadRecordings() {
  const token = localStorage.getItem('nnl_access_token');
  const allRecordings = [...MOCK_RECORDINGS];
  
  if (token) {
    try {
      const response = await fetch('/api/cms/v2/live_classes_recordings/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const freshClasses = data.data || data.results || data || [];
        if (Array.isArray(freshClasses)) {
          freshClasses.forEach(c => {
            const title = c.title || c.topic || 'Recorded Lecture';
            const batchTitle = c.batch?.title || (c.liveClass?.batch?.title) || 'General Batch';
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
                videoUrl: '' // Fallback Zoom notice
              });
            }
          });
        }
      }
    } catch (e) {
      console.warn('Unable to fetch live recordings from API:', e);
    }
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
      const hasUrl = !!rec.videoUrl;
      
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
            <span>${hasUrl ? 'Play' : 'Mobile App'}</span>
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
      }
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
        const rec = currentRecordings.find(r => r.id === recId);
        if (rec) openRecordingPlayer(rec);
        return;
      }
      
      const recRow = e.target.closest('.recording-row');
      if (recRow && !e.target.closest('.recording-row-action')) {
        const recId = recRow.getAttribute('data-rec-id');
        const rec = currentRecordings.find(r => r.id === recId);
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
