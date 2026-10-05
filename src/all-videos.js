// Nightingale Recorded Lectures Library Logic
// Architected for production-grade reliability, strict hierarchy matching, dedicated Subject Pages, and VdoCipher playback

const API_BASE = '/api';

// Allowed Sapphire Batches (Strictly Hinglish Only)
const ALLOWED_SAPPHIRE_BATCHES = [
  'Red Sapphire Batch (Hinglish)',
  'Blue Sapphire Batch (Hinglish)'
];

// Fetch with timeout helper — prevents stalled network requests
function fetchWithTimeout(url, options = {}, ms = 12000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...options, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

let activeBatch = localStorage.getItem('nnl_active_batch');
if (!activeBatch || !ALLOWED_SAPPHIRE_BATCHES.includes(activeBatch)) {
  activeBatch = 'Red Sapphire Batch (Hinglish)';
  localStorage.setItem('nnl_active_batch', activeBatch);
}

let currentRecordings = [];
let cachedSubjectResults = [];
let currentlyOpenSubject = null;

const classListContainer = document.getElementById('class-list-container');
const subjectsCatalogView = document.getElementById('subjects-catalog-view');
const subjectDetailView = document.getElementById('subject-detail-view');
const subjectLecturesContainer = document.getElementById('subject-lectures-container');

function getPlanIdForBatch(batchName) {
  const name = (batchName || activeBatch || '').toUpperCase();
  if (name.includes('RED')) {
    return 77; // Plan MLB Pro Red Sapphire Batch(Hinglish)
  }
  return 40; // Plan MLB Pro Blue Sapphire Batch (Hinglish)
}

function getBatchIdForBatch(batchName) {
  const name = (batchName || activeBatch || '').toUpperCase();
  if (name.includes('RED')) {
    return 103; // Red Sapphire Batch (Hing)
  }
  return 8; // Pearl Batch (Hinglish) & Blue Sapphire (NORCET 11.0)
}

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

function getLectureNumber(title) {
  const match = title.match(/(?:Day|Lecture|Class|Part)\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : 999;
}

// SVG icon paths keyed by subject keyword
const SUBJECT_SVG = {
  pharmacology: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/>',
  anatomy: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714"/>',
  physiology: '<path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>',
  biochemistry: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082"/>',
  microbiology: '<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"/>',
  pathology: '<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>',
  surgery: '<path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"/>',
  obstetrics: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"/>',
  obg: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"/>',
  pediatric: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>',
  community: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>',
  psychiatry: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>',
  medicine: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/>',
  critical: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>',
  nursing: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"/>',
};

const DEFAULT_SVG = '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>';

function getSubjectSVG(name) {
  const lower = (name || '').toLowerCase();
  for (const [key, path] of Object.entries(SUBJECT_SVG)) {
    if (lower.includes(key)) return path;
  }
  return DEFAULT_SVG;
}

function initBatchDropdown() {
  const batchBtn = document.getElementById('header-batch-btn');
  const dropdown = document.getElementById('header-batch-dropdown');
  const label = document.getElementById('current-batch-label');
  const pageTitle = document.getElementById('page-batch-title');

  if (label) label.textContent = activeBatch;
  if (pageTitle) pageTitle.textContent = `${activeBatch} Lectures`;

  if (dropdown) {
    dropdown.innerHTML = ALLOWED_SAPPHIRE_BATCHES.map(b => {
      const isActive = b === activeBatch;
      return `<button class="dropdown-item ${isActive ? 'active' : ''}" data-batch="${b}">${b}</button>`;
    }).join('');

    dropdown.querySelectorAll('.dropdown-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const selected = btn.getAttribute('data-batch');
        if (selected && selected !== activeBatch) {
          activeBatch = selected;
          localStorage.setItem('nnl_active_batch', activeBatch);
          if (label) label.textContent = activeBatch;
          if (pageTitle) pageTitle.textContent = `${activeBatch} Lectures`;
          dropdown.querySelectorAll('.dropdown-item').forEach(d => d.classList.remove('active'));
          btn.classList.add('active');
          dropdown.classList.add('hide');

          // Return to catalog view and re-load
          closeSubjectPage();
          loadRecordings();
        } else {
          dropdown.classList.add('hide');
        }
      });
    });
  }

  if (batchBtn && dropdown) {
    batchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hide');
    });

    document.addEventListener('click', () => {
      dropdown.classList.add('hide');
    });
  }
}

async function loadRecordings() {
  if (classListContainer) {
    classListContainer.innerHTML = `
      <div class="full-loader" style="grid-column: 1 / -1; background: rgba(10, 11, 16, 0.15); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 3rem; text-align: center;">
        <div class="spinner"></div>
        <p style="color: var(--text-secondary); margin-top: 0.5rem; font-family: var(--font-display); font-size: 0.75rem; letter-spacing: 0.05em; text-transform: uppercase;">Loading ${activeBatch} Lectures...</p>
      </div>
    `;
  }

  const token = localStorage.getItem('nnl_access_token');
  if (!token) {
    if (classListContainer) {
      classListContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 4rem 2rem; text-align: center; background: rgba(10, 11, 16, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px;">
          <h3 style="font-family: var(--font-display); font-size: 1.2rem; color: #fff; margin-bottom: 0.75rem;">Login Required</h3>
          <p style="color: var(--text-secondary); font-size: 0.85rem; max-width: 440px; margin: 0 auto 1.5rem; line-height: 1.5;">Please log in with your registered NNL ONE mobile number to access your recorded lectures.</p>
          <a href="/" style="display: inline-block; padding: 0.75rem 1.75rem; background: #00f3d0; color: #000; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; text-decoration: none; border-radius: 12px; letter-spacing: 0.05em;">Go to Login</a>
        </div>
      `;
    }
    return;
  }

  const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };

  try {
    // 1. Resolve active plan ID strictly from active batch
    const planId = getPlanIdForBatch(activeBatch);
    const batchId = getBatchIdForBatch(activeBatch);

    console.log(`[Content Engine] Fetching lectures for ${activeBatch} (Plan: ${planId}, Batch: ${batchId})...`);

    // 2. Fetch real subjects for the plan
    let subjects = [];
    let subRes = await fetchWithTimeout(`${API_BASE}/cms/fe/videos/subject/?plan_id=${planId}&page_size=50`, { headers });
    if (!subRes.ok) {
      subRes = await fetchWithTimeout(`${API_BASE}/cms/fe/videos/subject/?page_size=50`, { headers });
    }
    if (subRes.ok) {
      const sData = await subRes.json();
      subjects = sData.data || sData.results || [];
    }

    // Fallback to batch subjects if plan subjects empty
    if (subjects.length === 0 && batchId) {
      const bRes = await fetchWithTimeout(`${API_BASE}/cms/batches/${batchId}/`, { headers });
      if (bRes.ok) {
        const bData = await bRes.json();
        const bSubjects = bData.subjects || bData.data?.subjects || [];
        if (bSubjects.length > 0) {
          subjects = bSubjects;
        }
      }
    }

    if (subjects.length === 0) {
      classListContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 4rem 2rem; text-align: center; background: rgba(10, 11, 16, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px;">
          <p style="color: var(--text-secondary); font-size: 0.85rem; font-family: var(--font-display); text-transform: uppercase;">No subjects found for ${activeBatch}.</p>
        </div>
      `;
      return;
    }

    // 3. Concurrently fetch topics and subtopic videos for each subject
    const subjectContentPromises = subjects.map(async (subj) => {
      const subjectVideos = [];
      try {
        const topRes = await fetchWithTimeout(`${API_BASE}/cms/fe/videos/topic/?subject=${subj.id}&page_size=50`, { headers });
        if (topRes.ok) {
          const topData = await topRes.json();
          const topics = topData.data || topData.results || [];

          const subtopicPromises = topics.map(async (top) => {
            try {
              const stRes = await fetchWithTimeout(`${API_BASE}/cms/fe/videos/subtopic/?topic=${top.id}&page_size=50`, { headers });
              if (stRes.ok) {
                const stData = await stRes.json();
                const subtopics = stData.data || stData.results || [];
                subtopics.forEach(st => {
                  const vid = st.videos || st.video;
                  if (vid && typeof vid === 'object') {
                    const durHrs = vid.duration ? Math.floor(vid.duration / 3600) : 0;
                    const durMins = vid.duration ? Math.floor((vid.duration % 3600) / 60) : 0;
                    const durStr = durHrs > 0 ? `${durHrs}h ${durMins}m` : `${durMins}m`;

                    subjectVideos.push({
                      id: vid.id,
                      title: vid.title || st.title || 'Lecture Video',
                      instructor: vid.faculty?.name || 'Faculty',
                      subject: subj.title,
                      topic: top.title,
                      duration: durStr,
                      video_cipher_id: vid.video_cipher_id || vid.vdo_cipher_id || vid.vdoCipherId || vid.cipher_id || '',
                      videoUrl: vid.video_url || vid.videoUrl || vid.url || vid.download_url || findVideoUrl(vid) || '',
                      thumbnails: vid.thumbnails || null,
                      date: vid.schedule_start_time ? vid.schedule_start_time.split('T')[0] : ''
                    });
                  }
                });
              }
            } catch (err) {
              console.warn(`[Content Engine] Error fetching subtopics for topic ${top.id}:`, err);
            }
          });

          await Promise.all(subtopicPromises);
        }
      } catch (err) {
        console.warn(`[Content Engine] Error fetching topics for subject ${subj.id}:`, err);
      }

      // Sort videos naturally by Day / Lecture number
      subjectVideos.sort((a, b) => getLectureNumber(a.title) - getLectureNumber(b.title));

      return {
        subject: subj,
        videos: subjectVideos
      };
    });

    const subjectResults = await Promise.all(subjectContentPromises);

    cachedSubjectResults = subjectResults;

    const populatedRecordings = [];
    subjectResults.forEach(sr => {
      populatedRecordings.push(...sr.videos);
    });

    currentRecordings = populatedRecordings;

    // Render clean subject catalog (Cards that open dedicated subject pages on click!)
    renderSubjectCatalog(subjectResults);

    // If there is an active hash (e.g. #subject=Anatomy), open that page directly
    handleHashNavigation();

  } catch (err) {
    console.error('[Content Engine] Fatal error loading lectures:', err);
    if (classListContainer) {
      classListContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 4rem 2rem; text-align: center; background: rgba(10, 11, 16, 0.4); border: 1px solid rgba(255, 68, 68, 0.2); border-radius: 20px;">
          <h3 style="font-family: var(--font-display); font-size: 1.1rem; color: #f87171; margin-bottom: 0.5rem;">Failed to Load Lectures</h3>
          <p style="color: var(--text-secondary); font-size: 0.85rem; max-width: 440px; margin: 0 auto 1.5rem; line-height: 1.5;">${err.message}</p>
          <button onclick="window.location.reload()" style="padding: 0.75rem 1.75rem; background: #00f3d0; color: #000; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; border: none; border-radius: 12px; cursor: pointer;">Retry</button>
        </div>
      `;
    }
  }
}

// ── VIEW 1: Render Subject Catalog Grid ──
// Strictly renders clean, clickable tiles. Clicking opens the dedicated page without expanding in place!
function renderSubjectCatalog(subjectResults) {
  if (!classListContainer) return;
  classListContainer.innerHTML = '';

  const totalLectures = currentRecordings.length;
  const activeSubjects = subjectResults.filter(sr => sr.videos.length > 0);

  // Update header stats
  const statSubjectsEl = document.getElementById('stat-subjects');
  const statLecturesEl = document.getElementById('stat-lectures');
  const statsEl = document.getElementById('cp-stats');
  if (statSubjectsEl) statSubjectsEl.textContent = activeSubjects.length;
  if (statLecturesEl) statLecturesEl.textContent = totalLectures;
  if (statsEl) statsEl.style.display = 'flex';

  if (activeSubjects.length === 0) {
    classListContainer.innerHTML = `
      <div style="grid-column: 1 / -1; background: rgba(10, 11, 16, 0.15); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 4rem; text-align: center;">
        <p style="color: var(--text-secondary); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.08em; margin: 0; font-family: var(--font-display);">No recorded lectures available for ${activeBatch}.</p>
      </div>
    `;
    return;
  }

  activeSubjects.forEach(sr => {
    const subj = sr.subject;
    const subjName = subj.title || 'Subject';
    const count = sr.videos.length;

    const tile = document.createElement('div');
    tile.className = 'subject-tile';
    tile.setAttribute('data-subj-id', subj.id);
    tile.innerHTML = `
      <div class="st-top">
        <div class="st-icon">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
            ${getSubjectSVG(subjName)}
          </svg>
        </div>
        <div class="st-meta">
          <div class="st-title" title="${subjName}">${subjName}</div>
          <div class="st-count">${count} Recorded Lecture${count !== 1 ? 's' : ''}</div>
        </div>
      </div>
      <div class="st-footer">
        <span style="color: var(--text-secondary); font-size: 0.7rem;">High-Yield Series</span>
        <div class="st-footer-action">
          <span>Open Subject</span>
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
        </div>
      </div>
    `;

    // Clicking tile immediately opens the dedicated Subject Detail Page (NO accordion expansion!)
    tile.addEventListener('click', () => {
      openSubjectPage(sr);
    });

    classListContainer.appendChild(tile);
  });
}

// ── VIEW 2: Dedicated Subject Detail Page View ──
function openSubjectPage(subjectData) {
  if (!subjectData) return;
  currentlyOpenSubject = subjectData;

  const subj = subjectData.subject;
  const videos = subjectData.videos;

  if (subjectsCatalogView) subjectsCatalogView.classList.add('hide');
  if (subjectDetailView) subjectDetailView.classList.remove('hide');

  const titleEl = document.getElementById('subject-detail-title');
  const countEl = document.getElementById('subject-detail-count');
  const batchEl = document.getElementById('subject-detail-batch');
  const topBatchEl = document.getElementById('sd-top-batch-label');

  if (titleEl) titleEl.textContent = subj.title;
  if (countEl) countEl.textContent = `${videos.length} Lectures`;
  if (batchEl) batchEl.textContent = activeBatch;
  if (topBatchEl) topBatchEl.textContent = activeBatch;

  // Set URL hash for browser history / back button navigation
  window.location.hash = `#subject=${encodeURIComponent(subj.title)}`;

  // Render lectures in this subject
  renderSubjectLecturesList(videos);

  // Setup search input inside subject
  const searchInput = document.getElementById('subject-lecture-search');
  if (searchInput) {
    searchInput.value = '';
    searchInput.oninput = () => {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) {
        renderSubjectLecturesList(videos);
      } else {
        const filtered = videos.filter(v => 
          (v.title || '').toLowerCase().includes(q) || 
          (v.topic || '').toLowerCase().includes(q) ||
          (v.instructor || '').toLowerCase().includes(q)
        );
        renderSubjectLecturesList(filtered);
      }
    };
  }

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderSubjectLecturesList(lectures) {
  if (!subjectLecturesContainer) return;
  subjectLecturesContainer.innerHTML = '';

  if (lectures.length === 0) {
    subjectLecturesContainer.innerHTML = `
      <div style="background: rgba(10, 13, 24, 0.5); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 3rem; text-align: center;">
        <p style="color: var(--text-secondary); font-size: 0.85rem; margin: 0; text-transform: uppercase; letter-spacing: 0.05em; font-family: var(--font-display);">No lectures matching your search in this subject.</p>
      </div>
    `;
    return;
  }

  lectures.forEach((rec, idx) => {
    const rowNum = (idx + 1).toString().padStart(2, '0');
    const thumb = rec.thumbnails && rec.thumbnails.length > 0 ? (rec.thumbnails[0]?.url || '') : '';

    const card = document.createElement('div');
    card.className = 'sd-lecture-card';
    card.setAttribute('data-rec-id', rec.id);

    card.innerHTML = `
      <span class="sd-lecture-num">${rowNum}</span>
      ${thumb ? `<img src="${thumb}" class="sd-lecture-thumb" alt="" loading="lazy">` : `
        <div class="sd-lecture-thumb" style="display:flex;align-items:center;justify-content:center;color:#00f3d0;">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
      `}
      <div class="sd-lecture-details">
        <div class="sd-lecture-title" title="${rec.title}">${rec.title}</div>
        <div class="sd-lecture-meta">
          <span style="color: #00f3d0; font-weight: 600;">${rec.instructor}</span>
          ${rec.topic ? `<span>•</span><span>${rec.topic}</span>` : ''}
          ${rec.duration ? `<span>•</span><span>${rec.duration}</span>` : ''}
          ${rec.date ? `<span>•</span><span>${rec.date}</span>` : ''}
        </div>
      </div>
      <button class="sd-lecture-btn" data-rec-id="${rec.id}">
        <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        <span>Play Lecture</span>
      </button>
    `;

    card.addEventListener('click', (e) => {
      openRecordingPlayer(rec);
    });

    subjectLecturesContainer.appendChild(card);
  });
}

function closeSubjectPage() {
  currentlyOpenSubject = null;
  if (subjectDetailView) subjectDetailView.classList.add('hide');
  if (subjectsCatalogView) subjectsCatalogView.classList.remove('hide');
  if (window.location.hash.startsWith('#subject=')) {
    history.pushState('', document.title, window.location.pathname + window.location.search);
  }
}

function handleHashNavigation() {
  const hash = window.location.hash;
  if (hash.startsWith('#subject=')) {
    const rawTitle = decodeURIComponent(hash.replace('#subject=', ''));
    const matched = cachedSubjectResults.find(sr => sr.subject.title.toLowerCase() === rawTitle.toLowerCase());
    if (matched) {
      openSubjectPage(matched);
      return;
    }
  }
  closeSubjectPage();
}

window.addEventListener('hashchange', handleHashNavigation);

// Back to subjects button click listener
const btnBackToSubjects = document.getElementById('btn-back-to-subjects');
if (btnBackToSubjects) {
  btnBackToSubjects.addEventListener('click', () => {
    closeSubjectPage();
  });
}

// ── VdoCipher Video Player Engine ──
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
        videoEl.classList.add('hide'); 
      }
      const oldIframe = document.getElementById('recording-cipher-iframe');
      if (oldIframe) oldIframe.remove();
      const loader = document.getElementById('recording-cipher-loader');
      if (loader) loader.remove();
    });
  }
}

function openRecordingPlayer(recording) {
  const viewer = document.getElementById('recording-viewer');
  const titleEl = document.getElementById('recording-viewer-title');
  const instructorEl = document.getElementById('recording-viewer-instructor');
  const videoEl = document.getElementById('recording-video');
  const noUrlEl = document.getElementById('recording-no-url');
  const retryBtn = document.getElementById('recording-retry-btn');
  const errDesc = document.getElementById('recording-error-desc');
  
  if (!viewer) return;
  
  if (titleEl) titleEl.textContent = recording.title || 'Recorded Lecture';
  if (instructorEl) instructorEl.textContent = `Instructor: ${recording.instructor || 'Faculty'}`;
  
  viewer.classList.remove('hide');

  // Clean up any existing player
  const oldIframe = document.getElementById('recording-cipher-iframe');
  if (oldIframe) oldIframe.remove();
  const oldLoader = document.getElementById('recording-cipher-loader');
  if (oldLoader) oldLoader.remove();
  if (videoEl) {
    videoEl.pause();
    videoEl.src = '';
    videoEl.classList.add('hide');
  }
  if (noUrlEl) noUrlEl.classList.add('hide');
  
  // Show spinner
  const bodyEl = document.querySelector('.recording-viewer-body');
  const loader = document.createElement('div');
  loader.id = 'recording-cipher-loader';
  loader.className = 'full-loader';
  loader.innerHTML = '<div class="spinner"></div><p style="margin-top: 0.75rem; font-family: var(--font-display); font-size: 0.8rem; letter-spacing: 0.06em; text-transform: uppercase; color: #00f3d0;">Securing DRM Stream via VdoCipher...</p>';
  bodyEl.appendChild(loader);

  const token = localStorage.getItem('nnl_access_token');
  const authHeaders = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };

  const tryGetOtp = (url) => {
    return fetch(url, { method: 'GET', headers: authHeaders }).then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });
  };

  const recId = recording.id;

  const launchPlayback = () => {
    tryGetOtp(`${API_BASE}/batch_cms/videos/${recId}/generate_videocipher_otp/`)
      .catch(() => tryGetOtp(`${API_BASE}/cms/videos/${recId}/generate_videocipher_otp/`))
      .catch(() => tryGetOtp(`${API_BASE}/batch_cms/videos/${recId}/generate_videocipher_offline/`))
      .catch(() => tryGetOtp(`${API_BASE}/cms/videos/${recId}/generate_videocipher_offline/`))
      .catch(() => tryGetOtp(`${API_BASE}/cms/v2/live_classes_recordings/${recId}/generate_videocipher_otp/`))
      .catch(() => tryGetOtp(`${API_BASE}/cms/question_bank/${recId}/generate_videocipher_otp/`))
      .then(data => {
        if (loader) loader.remove();
        if (data && data.otp && data.playbackInfo) {
          const iframe = document.createElement('iframe');
          iframe.id = 'recording-cipher-iframe';
          iframe.src = `https://player.vdocipher.com/v2/?otp=${encodeURIComponent(data.otp)}&playbackInfo=${encodeURIComponent(data.playbackInfo)}`;
          iframe.style.border = 'none';
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.borderRadius = '12px';
          iframe.setAttribute('allow', 'encrypted-media *; autoplay *; fullscreen *; picture-in-picture *');
          iframe.setAttribute('allowfullscreen', 'true');
          iframe.setAttribute('webkitallowfullscreen', 'true');
          iframe.setAttribute('mozallowfullscreen', 'true');
          iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
          bodyEl.appendChild(iframe);
        } else {
          fallbackToDirectVideo(recording);
        }
      })
      .catch(err => {
        console.warn('[Player Engine] VdoCipher OTP cascade failed, checking direct URL:', err);
        if (loader) loader.remove();
        fallbackToDirectVideo(recording);
      });
  };

  if (retryBtn) {
    retryBtn.onclick = () => {
      if (noUrlEl) noUrlEl.classList.add('hide');
      bodyEl.appendChild(loader);
      launchPlayback();
    };
  }

  launchPlayback();
}

function fallbackToDirectVideo(recording) {
  const videoEl = document.getElementById('recording-video');
  const noUrlEl = document.getElementById('recording-no-url');
  const errDesc = document.getElementById('recording-error-desc');

  if (recording.videoUrl && videoEl) {
    videoEl.src = recording.videoUrl;
    videoEl.classList.remove('hide');
    videoEl.load();
    videoEl.play().catch(err => console.log('Autoplay deferred:', err));
    if (noUrlEl) noUrlEl.classList.add('hide');
  } else {
    if (videoEl) {
      videoEl.src = '';
      videoEl.classList.add('hide');
    }
    if (noUrlEl) {
      if (errDesc) errDesc.textContent = 'Session preparation complete. Click Retry to reload video stream.';
      noUrlEl.classList.remove('hide');
    }
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
initBatchDropdown();
initRecordingsViewer();
loadRecordings();

// Ping Render proxy server asynchronously on load
(function wakeUpRenderProxy() {
  fetch('https://nightingale-9n2c.onrender.com/', { mode: 'no-cors', cache: 'no-store' })
    .catch(() => {});
})();
