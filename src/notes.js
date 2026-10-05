// Nightingale Study Notes & PDFs Logic
// Architected for high-performance rendering, zero-latency caching, minimal design, and seamless in-app reading.

const API_BASE = '/api';

const ALLOWED_SAPPHIRE_BATCHES = [
  'Red Sapphire (Hinglish)',
  'Red Sapphire (English)'
];

// Timeout wrapper to prevent hanging network requests
function fetchWithTimeout(url, options = {}, ms = 10000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...options, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

let activeBatch = localStorage.getItem('nnl_active_batch');
if (!activeBatch || !ALLOWED_SAPPHIRE_BATCHES.includes(activeBatch)) {
  if (activeBatch && activeBatch.toUpperCase().includes('ENGLISH')) {
    activeBatch = 'Red Sapphire (English)';
  } else {
    activeBatch = 'Red Sapphire (Hinglish)';
  }
  localStorage.setItem('nnl_active_batch', activeBatch);
}

// In-memory cache & state
let allSubjects = [];
let subjectNotesMap = new Map(); // subjectId -> array of notes
let currentOpenSubject = null;
let currentFilterType = 'all'; // 'all', 'daywise', 'highyield', 'slides'
let searchQuery = '';

// DOM Elements
const subjectsGrid = document.getElementById('subjects-grid');
const notesCatalogView = document.getElementById('notes-catalog-view');
const notesSubjectView = document.getElementById('notes-subject-view');
const notesDocList = document.getElementById('notes-doc-list');
const btnBackSubjects = document.getElementById('btn-back-subjects');
const notesSearchInput = document.getElementById('notes-search-input');
const notesSearchClear = document.getElementById('notes-search-clear');
const filterChips = document.querySelectorAll('.filter-chip');
const statSubjectsCount = document.getElementById('stat-subjects-count');
const statNotesCount = document.getElementById('stat-notes-count');
const statBatchName = document.getElementById('stat-batch-name');
const subjectDetailTitle = document.getElementById('subject-detail-title');
const subjectDetailCount = document.getElementById('subject-detail-count');
const subjectDetailBatch = document.getElementById('subject-detail-batch');
const subjectTopBatchLabel = document.getElementById('subject-top-batch-label');
const notesRefetchBtn = document.getElementById('notes-refetch-btn');

// In-App PDF Reader Modal Elements
const pdfModal = document.getElementById('pdf-modal');
const pdfModalTitle = document.getElementById('pdf-modal-title');
const pdfModalIframe = document.getElementById('pdf-modal-iframe');
const pdfModalCloseBtn = document.getElementById('pdf-modal-close-btn');
const pdfModalDownloadBtn = document.getElementById('pdf-modal-download-btn');

function getPlanIdForBatch(batchName) {
  const name = (batchName || activeBatch || '').toUpperCase();
  if (name.includes('ENGLISH') || name.includes('(ENG)')) return 78; // Red Sapphire (English)
  return 77; // Red Sapphire (Hinglish)
}

function getBatchIdForBatch(batchName) {
  const name = (batchName || activeBatch || '').toUpperCase();
  if (name.includes('ENGLISH') || name.includes('(ENG)')) return 102; // Red Sapphire (English)
  return 103; // Red Sapphire (Hinglish)
}

// Medical Subject SVG Icon Library
const SUBJECT_SVG = {
  anatomy: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714"/>',
  physiology: '<path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>',
  pharmacology: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/>',
  microbiology: '<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"/>',
  pathology: '<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>',
  surgery: '<path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"/>',
  pediatric: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>',
  community: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>',
  psychiatry: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>',
  obg: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"/>',
  nursing: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"/>'
};

const DEFAULT_SVG = '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>';

function getSubjectIconSVG(name) {
  const lower = (name || '').toLowerCase();
  for (const [key, path] of Object.entries(SUBJECT_SVG)) {
    if (lower.includes(key)) return path;
  }
  return DEFAULT_SVG;
}

function getCleanBatchName(batch) {
  if (!batch) return 'Red Sapphire (Hinglish)';
  const bUpper = batch.toUpperCase();
  if (bUpper.includes('ENGLISH') || bUpper.includes('(ENG)')) {
    return 'Red Sapphire (English)';
  }
  return 'Red Sapphire (Hinglish)';
}

// Top Batch Dropdown Management
function initBatchDropdown() {
  const batchBtn = document.getElementById('header-batch-btn');
  const dropdown = document.getElementById('header-batch-dropdown');
  const label = document.getElementById('current-batch-label');

  if (label) label.textContent = getCleanBatchName(activeBatch);
  if (statBatchName) statBatchName.textContent = getCleanBatchName(activeBatch);

  if (dropdown) {
    dropdown.innerHTML = ALLOWED_SAPPHIRE_BATCHES.map(b => {
      const isActive = b === activeBatch;
      const cleanName = getCleanBatchName(b);
      return `<button class="dropdown-item ${isActive ? 'active' : ''}" data-batch="${b}">${cleanName}</button>`;
    }).join('');

    dropdown.querySelectorAll('.dropdown-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const selected = btn.getAttribute('data-batch');
        if (selected && selected !== activeBatch) {
          activeBatch = selected;
          localStorage.setItem('nnl_active_batch', activeBatch);
          if (label) label.textContent = getCleanBatchName(activeBatch);
          if (statBatchName) statBatchName.textContent = getCleanBatchName(activeBatch);
          dropdown.querySelectorAll('.dropdown-item').forEach(d => d.classList.remove('active'));
          btn.classList.add('active');
          dropdown.classList.add('hide');

          // Switch back to catalog view and load fresh batch notes
          closeSubjectView();
          loadNotesRepository(true);
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

// User Profile & Navigation Setup
function initUserHeader() {
  const phone = localStorage.getItem('nnl_phone') || 'Student';
  const phoneEl = document.getElementById('user-phone');
  const avatarEl = document.getElementById('user-avatar');
  const logoutBtn = document.getElementById('logout-btn');

  if (phoneEl) phoneEl.textContent = phone;
  if (avatarEl) avatarEl.textContent = phone.slice(0, 1).toUpperCase();

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('nnl_access_token');
      localStorage.removeItem('nnl_refresh_token');
      window.location.href = '/';
    });
  }

  // Top Tabs Click Actions
  const tabLive = document.getElementById('tab-live');
  if (tabLive) {
    tabLive.addEventListener('click', () => {
      window.location.href = '/';
    });
  }

  const tabTests = document.getElementById('tab-tests');
  if (tabTests) {
    tabTests.addEventListener('click', () => {
      window.location.href = '/?tab=tests';
    });
  }

  if (notesRefetchBtn) {
    notesRefetchBtn.addEventListener('click', () => {
      notesRefetchBtn.classList.add('spinning');
      // Clear cache for current batch
      const batchId = getBatchIdForBatch(activeBatch);
      sessionStorage.removeItem(`nnl_notes_cache_${batchId}`);
      subjectNotesMap.clear();
      loadNotesRepository(true).finally(() => {
        setTimeout(() => notesRefetchBtn.classList.remove('spinning'), 600);
      });
    });
  }
}

// Categorize note from title
function determineNoteCategory(title) {
  const upper = (title || '').toUpperCase();
  if (upper.includes('DAY') || upper.includes('LEC') || upper.includes('CLASS')) {
    return 'DAY-WISE';
  }
  if (upper.includes('SUMMARY') || upper.includes('FLOWCHART') || upper.includes('HIGH YIELD') || upper.includes('REVISION') || upper.includes('HANDOUT') || upper.includes('PEARL')) {
    return 'HIGH-YIELD';
  }
  if (upper.includes('SLIDE') || upper.includes('PPT') || upper.includes('PRESENTATION') || upper.includes('MINDMAP')) {
    return 'SLIDES';
  }
  return 'HIGH-YIELD';
}

// Fetch subjects and notes with smart caching
async function loadNotesRepository(forceReload = false) {
  const token = localStorage.getItem('nnl_access_token');
  if (!token) {
    renderLoginRequired();
    return;
  }

  const planId = getPlanIdForBatch(activeBatch);
  const batchId = getBatchIdForBatch(activeBatch);
  const cacheKey = `nnl_notes_cache_${batchId}`;

  // Check sessionStorage cache first for instant display
  if (!forceReload) {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        allSubjects = parsed.subjects || [];
        if (parsed.notesMap) {
          subjectNotesMap = new Map(Object.entries(parsed.notesMap));
        }
        if (allSubjects.length > 0) {
          renderSubjectCards();
          updateTotalStats();
          return;
        }
      }
    } catch (e) {
      console.warn('[Notes Cache] Parse error:', e);
    }
  }

  // Render loading state
  if (subjectsGrid) {
    subjectsGrid.innerHTML = `
      <div class="cp-loading" style="grid-column: 1 / -1; padding: 5rem 2rem; text-align: center;">
        <div class="spinner"></div>
        <p style="color: var(--text-secondary); margin-top: 1rem; font-family: var(--font-display); font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase;">Indexing Study Library for ${activeBatch}...</p>
      </div>
    `;
  }

  const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };

  try {
    // 1. Fetch real subjects
    let subjects = [];
    let subRes = await fetchWithTimeout(`${API_BASE}/cms/fe/videos/subject/?plan_id=${planId}&page_size=50`, { headers });
    if (subRes.status === 401 || subRes.status === 403) {
      localStorage.removeItem('nnl_access_token');
      localStorage.removeItem('nnl_refresh_token');
      window.location.href = '/';
      return;
    }
    if (!subRes.ok) {
      subRes = await fetchWithTimeout(`${API_BASE}/cms/fe/videos/subject/?page_size=50`, { headers });
      if (subRes.status === 401 || subRes.status === 403) {
        localStorage.removeItem('nnl_access_token');
        localStorage.removeItem('nnl_refresh_token');
        window.location.href = '/';
        return;
      }
    }
    if (subRes.ok) {
      const sData = await subRes.json();
      subjects = sData.data || sData.results || [];
    }

    // Fallback: batch subjects
    if (subjects.length === 0 && batchId) {
      const bRes = await fetchWithTimeout(`${API_BASE}/cms/batches/${batchId}/`, { headers });
      if (bRes.ok) {
        const bData = await bRes.json();
        const batchObj = bData.data || bData;
        if (batchObj && batchObj.subjects) {
          subjects = batchObj.subjects;
        }
      }
    }

    allSubjects = subjects;
    renderSubjectCards();
    updateTotalStats();

    // 2. Fetch notes for all subjects in parallel chunks to keep UI silky smooth
    await fetchNotesForSubjects(subjects, batchId, headers);

    // Save into cache
    try {
      const mapObj = {};
      subjectNotesMap.forEach((val, key) => { mapObj[key] = val; });
      sessionStorage.setItem(cacheKey, JSON.stringify({ subjects: allSubjects, notesMap: mapObj }));
    } catch (e) {}

    // Re-render cards with updated counts
    renderSubjectCards();
    updateTotalStats();

  } catch (err) {
    console.error('[Notes Repo Error]:', err);
    if (subjectsGrid) {
      subjectsGrid.innerHTML = `
        <div class="notes-empty-state" style="grid-column: 1 / -1;">
          <h3 class="notes-empty-title">Failed to Load Notes</h3>
          <p class="notes-empty-desc">${err.message || 'Please check your connection and try refreshing.'}</p>
        </div>
      `;
    }
  }
}

// Fetch notes for a single subject
async function fetchSingleSubjectNotes(subjectId, batchId, headers) {
  let notes = [];

  // 1. Handwritten Notes
  try {
    const htRes = await fetchWithTimeout(`${API_BASE}/cms/fe/handwritten_notes/topic/?subject=${subjectId}&page_size=50`, { headers });
    if (htRes.ok) {
      const htData = await htRes.json();
      const htopics = htData.data || htData.results || [];
      for (const top of htopics) {
        try {
          const hstRes = await fetchWithTimeout(`${API_BASE}/cms/fe/handwritten_notes/subtopic/?topic=${top.id}&page_size=50`, { headers });
          if (hstRes.ok) {
            const hstData = await hstRes.json();
            const hsubtopics = hstData.data || hstData.results || [];
            hsubtopics.forEach(st => {
              const n = st.handwritten_notes || st.notes || st.handwritten_note;
              if (n && typeof n === 'object') {
                const url = n.url || n.file || n.pdf_url || '';
                if (url) {
                  notes.push({
                    id: n.id || Math.random(),
                    title: n.title || st.title || 'Day-wise Lecture Notes',
                    url: url,
                    category: determineNoteCategory(n.title || st.title)
                  });
                }
              }
            });
          }
        } catch (e) {}
      }
    }
  } catch (e) {}

  // 2. Digital Notes & Handouts
  try {
    const ntRes = await fetchWithTimeout(`${API_BASE}/cms/fe/notes/topic/?subject=${subjectId}&page_size=50`, { headers });
    if (ntRes.ok) {
      const ntData = await ntRes.json();
      const ntopics = ntData.data || ntData.results || [];
      for (const top of ntopics) {
        try {
          const nstRes = await fetchWithTimeout(`${API_BASE}/cms/fe/notes/subtopic/?topic=${top.id}&page_size=50`, { headers });
          if (nstRes.ok) {
            const nstData = await nstRes.json();
            const nsubtopics = nstData.data || nstData.results || [];
            nsubtopics.forEach(st => {
              const n = st.notes || st.note;
              if (n && typeof n === 'object') {
                const url = n.url || n.file || n.pdf_url || '';
                if (url) {
                  notes.push({
                    id: n.id || Math.random(),
                    title: n.title || st.title || 'High-Yield Clinical Handout',
                    url: url,
                    category: determineNoteCategory(n.title || st.title)
                  });
                }
              }
            });
          }
        } catch (e) {}
      }
    }
  } catch (e) {}

  // 3. Fallback Batch Handwritten Notes
  if (notes.length === 0 && batchId) {
    try {
      const nRes = await fetchWithTimeout(`${API_BASE}/batch_cms/batch_handwritten_notes/?batch_id=${batchId}&subject_id=${subjectId}`, { headers });
      if (nRes.ok) {
        const d = await nRes.json();
        const allN = d.data || d.results || [];
        allN.forEach(n => {
          const url = n.url || n.file || n.pdf_url || '';
          if (url) {
            notes.push({
              id: n.id || Math.random(),
              title: n.title || 'Official Batch Class Handout',
              url: url,
              category: determineNoteCategory(n.title)
            });
          }
        });
      }
    } catch (e) {}
  }

  // Deduplicate by URL or title
  const seen = new Set();
  const deduped = [];
  notes.forEach(n => {
    const key = (n.url || n.title || '').trim().toLowerCase();
    if (key && !seen.has(key)) {
      seen.add(key);
      deduped.push(n);
    }
  });

  return deduped;
}

// Parallel worker for fetching notes across subjects
async function fetchNotesForSubjects(subjects, batchId, headers) {
  const chunkSize = 4;
  for (let i = 0; i < subjects.length; i += chunkSize) {
    const chunk = subjects.slice(i, i + chunkSize);
    await Promise.allSettled(chunk.map(async sub => {
      const notes = await fetchSingleSubjectNotes(sub.id, batchId, headers);
      subjectNotesMap.set(String(sub.id), notes);
      updateSubjectCardBadge(sub.id, notes.length);
    }));
  }
}

// Update specific card badge in real time as data arrives
function updateSubjectCardBadge(subjectId, count) {
  const badgeEl = document.getElementById(`card-count-${subjectId}`);
  if (badgeEl) {
    badgeEl.textContent = `${count} PDFs Ready`;
  }
}

// Update total statistics badges in hero header
function updateTotalStats() {
  if (statSubjectsCount) {
    statSubjectsCount.textContent = allSubjects.length;
  }
  if (statNotesCount) {
    let total = 0;
    subjectNotesMap.forEach(arr => { total += arr.length; });
    statNotesCount.textContent = total;
  }
}

// Render Subject Cards Grid
function renderSubjectCards() {
  if (!subjectsGrid) return;

  const query = searchQuery.trim().toLowerCase();
  const filtered = allSubjects.filter(sub => {
    if (!query) return true;
    const titleMatch = (sub.title || '').toLowerCase().includes(query);
    // Also match against cached notes within this subject
    const notes = subjectNotesMap.get(String(sub.id)) || [];
    const notesMatch = notes.some(n => n.title.toLowerCase().includes(query));
    return titleMatch || notesMatch;
  });

  if (filtered.length === 0) {
    subjectsGrid.innerHTML = `
      <div class="notes-empty-state" style="grid-column: 1 / -1;">
        <h3 class="notes-empty-title">No Subjects Found</h3>
        <p class="notes-empty-desc">No study materials matched "${searchQuery}". Try searching another keyword.</p>
      </div>
    `;
    return;
  }

  subjectsGrid.innerHTML = filtered.map(sub => {
    const svgIcon = getSubjectIconSVG(sub.title);
    const notes = subjectNotesMap.get(String(sub.id)) || [];
    const countStr = subjectNotesMap.has(String(sub.id)) ? `${notes.length} PDFs Ready` : 'Checking PDFs...';

    return `
      <div class="subject-card" data-sub-id="${sub.id}">
        <div class="subject-card-top">
          <div class="subject-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              ${svgIcon}
            </svg>
          </div>
          <div class="subject-card-meta">
            <h3 class="subject-card-title">${sub.title}</h3>
            <div class="subject-card-badge">
              <span>Class Notes &amp; Handouts</span>
            </div>
          </div>
        </div>
        <div class="subject-card-bottom">
          <span class="subject-card-count" id="card-count-${sub.id}">${countStr}</span>
          <span class="subject-card-arrow">
            <span>Browse</span>
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
          </span>
        </div>
      </div>
    `;
  }).join('');

  // Bind click on subject cards to open detail view
  subjectsGrid.querySelectorAll('.subject-card').forEach(card => {
    card.addEventListener('click', () => {
      const subId = card.getAttribute('data-sub-id');
      const subject = allSubjects.find(s => String(s.id) === String(subId));
      if (subject) {
        openSubjectView(subject);
      }
    });
  });
}

// Open Dedicated Subject Detail View
async function openSubjectView(subject) {
  currentOpenSubject = subject;
  notesCatalogView.classList.add('hide');
  notesSubjectView.classList.remove('hide');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (subjectDetailTitle) subjectDetailTitle.textContent = subject.title;
  if (subjectDetailBatch) subjectDetailBatch.textContent = activeBatch;
  if (subjectTopBatchLabel) subjectTopBatchLabel.textContent = `// ${activeBatch}`;

  // If notes aren't loaded yet for this subject, fetch on demand
  let notes = subjectNotesMap.get(String(subject.id));
  if (!notes) {
    if (notesDocList) {
      notesDocList.innerHTML = `
        <div class="cp-loading" style="padding: 4rem 2rem; text-align: center;">
          <div class="spinner"></div>
          <p style="color: var(--text-secondary); margin-top: 1rem; font-family: var(--font-display); font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase;">Fetching Notes for ${subject.title}...</p>
        </div>
      `;
    }
    const token = localStorage.getItem('nnl_access_token');
    const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };
    const batchId = getBatchIdForBatch(activeBatch);
    notes = await fetchSingleSubjectNotes(subject.id, batchId, headers);
    subjectNotesMap.set(String(subject.id), notes);
    updateTotalStats();
  }

  if (subjectDetailCount) {
    subjectDetailCount.textContent = `${notes.length} PDFs`;
  }

  renderSubjectNotesList();
}

// Close Subject Detail View (Back to Catalog)
function closeSubjectView() {
  currentOpenSubject = null;
  notesSubjectView.classList.add('hide');
  notesCatalogView.classList.remove('hide');
  renderSubjectCards();
}

// Render Notes inside Subject View
function renderSubjectNotesList() {
  if (!notesDocList || !currentOpenSubject) return;

  const notes = subjectNotesMap.get(String(currentOpenSubject.id)) || [];
  const query = searchQuery.trim().toLowerCase();

  // Filter by category chip and search query
  const filtered = notes.filter(n => {
    // Filter chip check
    if (currentFilterType === 'daywise' && n.category !== 'DAY-WISE') return false;
    if (currentFilterType === 'highyield' && n.category !== 'HIGH-YIELD') return false;
    if (currentFilterType === 'slides' && n.category !== 'SLIDES') return false;

    // Search query check
    if (query && !n.title.toLowerCase().includes(query)) return false;

    return true;
  });

  if (filtered.length === 0) {
    notesDocList.innerHTML = `
      <div class="notes-empty-state">
        <h3 class="notes-empty-title">No Notes Found</h3>
        <p class="notes-empty-desc">${notes.length === 0 ? 'No PDF notes are currently available for this subject.' : 'No notes matched the selected filter or search keyword.'}</p>
      </div>
    `;
    return;
  }

  notesDocList.innerHTML = filtered.map(n => {
    let tagClass = 'tag-highyield';
    if (n.category === 'DAY-WISE') tagClass = 'tag-daywise';
    else if (n.category === 'SLIDES') tagClass = 'tag-slides';

    return `
      <div class="note-doc-card">
        <div class="note-doc-info">
          <div class="note-doc-icon">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
            </svg>
          </div>
          <div class="note-doc-details">
            <div class="note-doc-title" title="${n.title}">${n.title}</div>
            <div class="note-doc-badges">
              <span class="category-tag ${tagClass}">${n.category}</span>
              <span style="font-size: 0.7rem; color: var(--text-muted);">PDF Document</span>
            </div>
          </div>
        </div>

        <div class="note-doc-actions">
          <button class="btn-note-view btn-preview-pdf" data-title="${encodeURIComponent(n.title)}" data-url="${encodeURIComponent(n.url)}">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><circle cx="12" cy="12" r="3"/></svg>
            <span>View PDF</span>
          </button>
          <a href="${n.url}" target="_blank" rel="noopener noreferrer" class="btn-note-download" title="Open or Download in New Tab">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
            <span>Download</span>
          </a>
        </div>
      </div>
    `;
  }).join('');

  // Bind click on "View PDF" to open built-in modal
  notesDocList.querySelectorAll('.btn-preview-pdf').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = decodeURIComponent(btn.getAttribute('data-title'));
      const url = decodeURIComponent(btn.getAttribute('data-url'));
      openPdfModal(title, url);
    });
  });
}

// In-App Minimal PDF Reader Modal
function openPdfModal(title, url) {
  if (!pdfModal) return;
  if (pdfModalTitle) pdfModalTitle.textContent = title;
  if (pdfModalDownloadBtn) pdfModalDownloadBtn.href = url;

  if (pdfModalIframe) {
    // If external cross-origin headers restrict direct iframe embedding, Google docs viewer is a clean fallback
    pdfModalIframe.src = url;
  }

  pdfModal.classList.remove('hide');
  document.body.style.overflow = 'hidden';
}

function closePdfModal() {
  if (!pdfModal) return;
  pdfModal.classList.add('hide');
  if (pdfModalIframe) pdfModalIframe.src = '';
  document.body.style.overflow = '';
}

// Auth Required Display
function renderLoginRequired() {
  if (subjectsGrid) {
    subjectsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 4rem 2rem; text-align: center; background: rgba(10, 11, 16, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px;">
        <h3 style="font-family: var(--font-display); font-size: 1.2rem; color: #fff; margin-bottom: 0.75rem;">Login Required</h3>
        <p style="color: var(--text-secondary); font-size: 0.85rem; max-width: 440px; margin: 0 auto 1.5rem; line-height: 1.5;">Please log in with your registered NNL ONE mobile number to access notes and academic PDFs.</p>
        <a href="/" style="display: inline-block; padding: 0.75rem 1.75rem; background: var(--accent-red); color: #fff; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; text-decoration: none; border-radius: 12px; letter-spacing: 0.05em;">Go to Login</a>
      </div>
    `;
  }
}

// Event Listeners Initialization
function initEventListeners() {
  // Back to All Subjects Button
  if (btnBackSubjects) {
    btnBackSubjects.addEventListener('click', closeSubjectView);
  }

  // Search Input Handler (Real-time with instant responsiveness)
  if (notesSearchInput) {
    notesSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (notesSearchClear) {
        notesSearchClear.style.display = searchQuery ? 'block' : 'none';
      }
      if (currentOpenSubject) {
        renderSubjectNotesList();
      } else {
        renderSubjectCards();
      }
    });
  }

  // Clear Search Button
  if (notesSearchClear) {
    notesSearchClear.addEventListener('click', () => {
      searchQuery = '';
      if (notesSearchInput) notesSearchInput.value = '';
      notesSearchClear.style.display = 'none';
      if (currentOpenSubject) {
        renderSubjectNotesList();
      } else {
        renderSubjectCards();
      }
    });
  }

  // Filter Chips (All, Day-wise, High-yield, Slides)
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilterType = chip.getAttribute('data-filter') || 'all';
      if (currentOpenSubject) {
        renderSubjectNotesList();
      }
    });
  });

  // Modal Close Listeners
  if (pdfModalCloseBtn) {
    pdfModalCloseBtn.addEventListener('click', closePdfModal);
  }

  if (pdfModal) {
    pdfModal.addEventListener('click', (e) => {
      if (e.target === pdfModal) {
        closePdfModal();
      }
    });
  }

  // Keyboard Shortcuts (ESC to close modal or go back to subjects)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (pdfModal && !pdfModal.classList.contains('hide')) {
        closePdfModal();
      } else if (currentOpenSubject) {
        closeSubjectView();
      }
    }
  });
}

function initSettingsWidget() {
  const toggleBtn = document.getElementById('tweak-panel-toggle-btn');
  const tweaksWidget = document.querySelector('.cyber-tweaks-widget');
  if (toggleBtn && tweaksWidget) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      tweaksWidget.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!tweaksWidget.contains(e.target) && e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
        tweaksWidget.classList.remove('open');
      }
    });
  }

  // Accent theme colors
  const colorDots = document.querySelectorAll('.cyber-tweaks-widget .color-dot');
  colorDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const color = dot.getAttribute('data-color');
      document.body.classList.remove('tweak-pink-mode', 'tweak-cyan-mode', 'tweak-amber-mode', 'tweak-emerald-mode');
      if (color && color !== 'pink') {
        document.body.classList.add(`tweak-${color}-mode`);
      }
      colorDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      localStorage.setItem('nnl_tweak_color', color);
    });
  });

  // Restore saved color
  const savedColor = localStorage.getItem('nnl_tweak_color') || 'pink';
  if (savedColor && savedColor !== 'pink') {
    document.body.classList.add(`tweak-${savedColor}-mode`);
    const activeDot = document.querySelector(`.cyber-tweaks-widget .color-dot[data-color="${savedColor}"]`);
    if (activeDot) {
      colorDots.forEach(d => d.classList.remove('active'));
      activeDot.classList.add('active');
    }
  }
}

// Bootstrapper
document.addEventListener('DOMContentLoaded', () => {
  initBatchDropdown();
  initUserHeader();
  initSettingsWidget();
  initEventListeners();
  loadNotesRepository();
});
