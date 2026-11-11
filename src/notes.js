// Nightingale Study Notes & PDFs Logic
// Architected for clean subject isolation, complete Medicine library (141+ verified PDFs),
// paginated API fetching, and Red Sapphire Brochure & Timetable access.

import { MEDICINE_SUBJECT, MEDICINE_MASTER_NOTES } from './data/medicineNotes.js';
import { ALL_MASTER_SUBJECTS, MASTER_NOTES_BY_SUBJECT } from './data/allSubjectsNotes.js';
import { RED_SAPPHIRE_DATA } from './data/redSapphireSchedule.js';
import { getBatchBaselineState, syncBatchLive, getBatchIdFromName } from './utils/batch104Sync.js';

const API_BASE = '/api';

const ALLOWED_SAPPHIRE_BATCHES = [
  'Red Sapphire (Hinglish)',
  'Red Sapphire (English)'
];

const SCHEDULE_SUBJECT = {
  id: 'red-sapphire-schedule',
  title: 'Red Sapphire Brochure & Timetable',
  shortTitle: 'Timetable & Brochure',
  category: 'Plan MLB Pro • Complete Schedule',
  faculty: 'Batch 103 & 104',
  isScheduleSubject: true,
  description: 'Official Plan MLB Pro Red Sapphire features breakdown, class timetable, and NNL TOC brochures.'
};

// Timeout wrapper to prevent hanging network requests
function fetchWithTimeout(url, options = {}, ms = 12000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...options, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

// Fetch all pages for any paginated NNL endpoint
async function fetchAllPaginated(path, headers, maxPages = 20) {
  const results = [];
  let url = path;
  let page = 1;

  while (url && page <= maxPages) {
    try {
      const targetUrl = url.startsWith('http')
        ? url.replace('https://prod-api.nnlone.com', API_BASE)
        : (url.startsWith(API_BASE) ? url : `${API_BASE}${url}`);

      const res = await fetchWithTimeout(targetUrl, { headers });
      if (!res.ok) break;
      const json = await res.json();
      const items = json.data || json.results || [];
      if (Array.isArray(items)) results.push(...items);

      let nextUrl = json.next_page_link || json.next || null;
      if (!nextUrl && json.max_pages && page < json.max_pages) {
        const sep = path.includes('?') ? '&' : '?';
        nextUrl = `${path}${sep}page=${page + 1}`;
      }
      url = nextUrl;
      page++;
    } catch (e) {
      console.warn('[Pagination Error]', path, e);
      break;
    }
  }
  return results;
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

// In-memory state
let allSubjects = [];
let subjectNotesMap = new Map(); // subjectId -> array of notes
let currentOpenSubject = null;
let currentFilterType = 'all'; // 'all', 'handwritten', 'oncology', 'liveclass', 'revision', 'schedule'
let currentTopicFilter = 'ALL'; // system/topic sub-filter inside subject detail view
let currentScheduleLang = 'hinglish';
let searchQuery = '';

const initialParams = new URLSearchParams(window.location.search);
let currentSectionMode = initialParams.get('section') === 'rb104' ? 'rb104' : 'master';
let activeRbBatchId = Number(initialParams.get('batch')) === 104
  ? 104
  : (Number(initialParams.get('batch')) === 103 ? 103 : getBatchIdFromName(activeBatch));
let batch104State = getBatchBaselineState(activeRbBatchId);

// Complete Verified Subjects (Available immediately in Open Access AND Signed-In Mode — 1,319 PDFs)
const OPEN_ACCESS_SUBJECTS = [
  MEDICINE_SUBJECT,
  ...ALL_MASTER_SUBJECTS,
  SCHEDULE_SUBJECT
];

// Helper: Seed all verified master catalogs into subjectNotesMap (zero network delay, 100% isolated)
function seedVerifiedMasterCatalog() {
  subjectNotesMap.set(String(MEDICINE_SUBJECT.id), [...MEDICINE_MASTER_NOTES]);
  subjectNotesMap.set(String(SCHEDULE_SUBJECT.id), [...RED_SAPPHIRE_DATA.brochures]);
  Object.entries(MASTER_NOTES_BY_SUBJECT).forEach(([sid, notes]) => {
    subjectNotesMap.set(String(sid), [...notes]);
  });
}

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

// In-App Minimal PDF Reader Modal Elements
const pdfModal = document.getElementById('pdf-modal');
const pdfModalTitle = document.getElementById('pdf-modal-title');
const pdfModalIframe = document.getElementById('pdf-modal-iframe');
const pdfModalCloseBtn = document.getElementById('pdf-modal-close-btn');
const pdfModalDownloadBtn = document.getElementById('pdf-modal-download-btn');

function getPlanIdForBatch(batchName) {
  const name = (batchName || activeBatch || '').toUpperCase();
  if (name.includes('ENGLISH') || name.includes('(ENG)')) return 79; // Red Sapphire (English)
  return 77; // Red Sapphire (Hinglish)
}

function getBatchIdForBatch(batchName) {
  const name = (batchName || activeBatch || '').toUpperCase();
  if (name.includes('ENGLISH') || name.includes('(ENG)')) return 104; // Red Sapphire (English)
  return 103; // Red Sapphire (Hinglish)
}

// Medical Subject SVG Icon Library
const SUBJECT_SVG = {
  medicine: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/>',
  timetable: '<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>',
  anatomy: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714"/>',
  pharmacology: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/>',
  microbiology: '<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"/>',
  pathology: '<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>',
  surgery: '<path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"/>',
  pediatric: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>',
  community: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>',
  mental: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>',
  midwifery: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"/>',
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

          closeSubjectView();
          setRbBatchId(getBatchIdFromName(activeBatch), true);
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
  const token = localStorage.getItem('nnl_access_token');
  const storedPhone = localStorage.getItem('nnl_phone');
  const phone = storedPhone || (token ? 'Student' : 'Student (Open Access)');
  const phoneEl = document.getElementById('user-phone');
  const avatarEl = document.getElementById('user-avatar');
  const logoutBtn = document.getElementById('logout-btn');

  if (phoneEl) phoneEl.textContent = phone;
  if (avatarEl) avatarEl.textContent = (storedPhone || 'G').slice(0, 1).toUpperCase();

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('nnl_access_token');
      localStorage.removeItem('nnl_refresh_token');
      window.location.href = '/';
    });
  }

  const tabLive = document.getElementById('tab-live');
  if (tabLive) {
    tabLive.addEventListener('click', () => {
      window.location.href = '/';
    });
  }

  const tabTests = document.getElementById('tab-tests');
  if (tabTests) {
    tabTests.addEventListener('click', () => {
      window.location.href = '/tests.html';
    });
  }

  if (notesRefetchBtn) {
    notesRefetchBtn.addEventListener('click', () => {
      notesRefetchBtn.classList.add('spinning');
      const batchId = getBatchIdForBatch(activeBatch);
      sessionStorage.removeItem(`nnl_notes_cache_v5_${batchId}`);
      subjectNotesMap.clear();
      Promise.all([
        loadNotesRepository(true),
        triggerBatch104Sync(true)
      ]).finally(() => {
        setTimeout(() => notesRefetchBtn.classList.remove('spinning'), 600);
      });
    });
  }
}

// Categorize note strictly by title / properties
function determineNoteCategory(title) {
  const upper = (title || '').toUpperCase();
  if (upper.includes('REVISION') || upper.includes('FASTRACK')) {
    return 'REVISION';
  }
  if (upper.includes('CLASS NOTE') || upper.includes('DAY ')) {
    return 'LIVE CLASS';
  }
  return 'HANDWRITTEN';
}

// Normalize subjects into our clean verified catalog (zero duplicate cards, zero Anatomy/Medicine mixing)
const COVERED_SUBJECT_IDS = new Set([
  '73', '152', '574', '676', '631', '246', // Medicine
  '64', '569', '681',                      // Anatomy
  '66', '580', '673',                      // Nursing Foundation
  '74', '153', '575', '679', '688', '632', // Surgery
  '71', '572', '674',                      // Pharmacology
  '78', '712', '579', '678',               // OBG & Gynecology
  '75', '570', '682',                      // CHN
  '76', '578', '677',                      // Pediatrics
  '65', '576',                             // Biochemistry
  '72', '573',                             // Pathology
  '77', '67', '577', '675',                // MHN & Psychology
  '68', '224',                             // Microbiology
  '82', '80', '81', '581', '687', '227',   // Management, Education & Research
  '708', '162', '163', '571', '148', '149',// Fastrack & Aptitude
  'red-sapphire-schedule'
]);

function normalizeSubjectsList(rawSubjects) {
  const list = Array.isArray(rawSubjects) ? [...rawSubjects] : [];
  const result = [
    { ...MEDICINE_SUBJECT },
    ...ALL_MASTER_SUBJECTS.map(s => ({ ...s })),
    { ...SCHEDULE_SUBJECT }
  ];

  const seenTitles = new Set(result.map(s => (s.shortTitle || s.title).toLowerCase()));

  for (const s of list) {
    if (!s || !s.title) continue;
    if (COVERED_SUBJECT_IDS.has(String(s.id))) continue;

    const tLower = s.title.toLowerCase();
    if (
      tLower.includes('medicine') ||
      tLower.includes('oncology') ||
      tLower.includes('anatomy') ||
      tLower.includes('surgery') ||
      tLower.includes('pharma') ||
      tLower.includes('foundation') ||
      tLower.includes('midwifery') ||
      tLower.includes('obg') ||
      tLower.includes('community') ||
      tLower.includes('pediatric') ||
      tLower.includes('biochem') ||
      tLower.includes('pathology') ||
      tLower.includes('mental health') ||
      tLower.includes('psycholog') ||
      tLower.includes('(f10)') ||
      tLower.includes('(f11.0)') ||
      tLower.includes('otr')
    ) {
      continue;
    }

    if (s.handwritten_notes_count === 0 && s.notes_count === 0) continue;

    const cleanTitle = s.title.replace(/\s*\((H|E)\)\s*$/i, '').trim();
    const normKey = cleanTitle.toLowerCase();
    if (seenTitles.has(normKey)) continue;
    seenTitles.add(normKey);

    result.push({
      ...s,
      title: cleanTitle,
      apiSubjectId: s.id,
      category: s.handwritten_notes_count ? `${s.handwritten_notes_count} Notes` : 'Class Notes'
    });
  }

  return result;
}

// Fetch subjects & notes with instant verified catalog + live API sync when refreshed
async function loadNotesRepository(forceReload = false) {
  const token = localStorage.getItem('nnl_access_token');
  const planId = getPlanIdForBatch(activeBatch);
  const batchId = getBatchIdForBatch(activeBatch);
  const cacheKey = `nnl_notes_cache_v6_${batchId}`;

  // Seed all 14 verified subjects (1,319 PDFs) + Red Sapphire Brochure & Timetable immediately
  seedVerifiedMasterCatalog();
  allSubjects = normalizeSubjectsList([...OPEN_ACCESS_SUBJECTS]);

  if (!forceReload || !token) {
    renderSubjectCards();
    updateTotalStats();
    return;
  }

  const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };

  try {
    let subjects = await fetchAllPaginated(`/cms/fe/handwritten_notes/subject/?plan_id=${planId}&page_size=100`, headers);
    if (subjects.length === 0) {
      subjects = await fetchAllPaginated(`/cms/fe/handwritten_notes/subject/?page_size=100`, headers);
    }

    allSubjects = normalizeSubjectsList(subjects);
    renderSubjectCards();
    updateTotalStats();

    // Sync any newly added notes for unseeded custom subjects or updated master subjects
    await fetchNotesForSubjects(allSubjects, headers);

    try {
      const mapObj = {};
      subjectNotesMap.forEach((val, key) => { mapObj[key] = val; });
      sessionStorage.setItem(cacheKey, JSON.stringify({ subjects: allSubjects, notesMap: mapObj }));
    } catch (e) {}

    renderSubjectCards();
    updateTotalStats();
  } catch (err) {
    console.warn('[Notes Repo Refresh]:', err);
    renderSubjectCards();
    updateTotalStats();
  }
}

// Fetch notes strictly for a single subject — merges verified master data with any newly published API items
async function fetchSingleSubjectNotes(subjectId, headers) {
  if (String(subjectId) === String(SCHEDULE_SUBJECT.id)) {
    return [...RED_SAPPHIRE_DATA.brochures];
  }

  const currentSub = allSubjects.find(s => String(s.id) === String(subjectId));
  const isMedicine = String(subjectId) === String(MEDICINE_SUBJECT.id);
  const querySubjectId = currentSub?.apiSubjectId || subjectId;

  const baseNotes = isMedicine
    ? [...MEDICINE_MASTER_NOTES]
    : [...(MASTER_NOTES_BY_SUBJECT[String(subjectId)] || [])];

  const notes = [...baseNotes];

  if (!querySubjectId || isNaN(Number(querySubjectId))) {
    return notes;
  }

  try {
    const htopics = await fetchAllPaginated(`/cms/fe/handwritten_notes/topic/?subject=${querySubjectId}&page_size=100`, headers);
    for (const top of htopics) {
      const hsubtopics = await fetchAllPaginated(`/cms/fe/handwritten_notes/subtopic/?topic=${top.id}&page_size=100`, headers);
      hsubtopics.forEach(st => {
        const n = st.handwritten_notes || st.notes || st.handwritten_note;
        if (n && typeof n === 'object') {
          const url = n.url || n.file || n.pdf_url || '';
          if (url) {
            const title = (n.title || st.title || 'Class Notes').trim();
            notes.push({
              id: n.id || Math.random(),
              title,
              lectureTitle: st.title || title,
              topic: top.title || currentSub?.title || 'Notes',
              faculty: currentSub?.faculty || '',
              url: url.trim(),
              category: determineNoteCategory(title)
            });
          }
        }
      });
    }
  } catch (e) {
    console.warn(`[Notes] HW fetch failed for subject ${querySubjectId}:`, e);
  }

  // Deduplicate strictly by URL
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

// Parallel worker for fetching live updates on explicit refresh
async function fetchNotesForSubjects(subjects, headers) {
  const chunkSize = 4;
  for (let i = 0; i < subjects.length; i += chunkSize) {
    const chunk = subjects.slice(i, i + chunkSize);
    await Promise.allSettled(chunk.map(async sub => {
      if (String(sub.id) === String(SCHEDULE_SUBJECT.id)) return;
      const notes = await fetchSingleSubjectNotes(sub.id, headers);
      subjectNotesMap.set(String(sub.id), notes);
      updateSubjectCardBadge(sub.id, notes.length);
    }));
  }
}

function updateSubjectCardBadge(subjectId, count) {
  const badgeEl = document.getElementById(`card-count-${subjectId}`);
  if (badgeEl) {
    badgeEl.textContent = String(subjectId) === String(SCHEDULE_SUBJECT.id)
      ? `${RED_SAPPHIRE_DATA.hinglishSchedule.length + RED_SAPPHIRE_DATA.englishSchedule.length} Scheduled Classes`
      : `${count} PDFs Ready`;
  }
}

function updateTotalStats() {
  const secCountMaster = document.getElementById('sec-count-master');
  const secCountRb104 = document.getElementById('sec-count-rb104');
  let masterTotal = 0;
  subjectNotesMap.forEach((arr, key) => {
    if (key !== String(SCHEDULE_SUBJECT.id)) masterTotal += arr.length;
  });

  const rbTotals = batch104State?.totals || { subjects: 0, notes: 0, tests: 0 };
  if (secCountMaster) secCountMaster.textContent = masterTotal.toLocaleString();
  if (secCountRb104) secCountRb104.textContent = `${rbTotals.notes} Notes • ${rbTotals.tests} Tests`;

  if (currentSectionMode === 'rb104') {
    if (statSubjectsCount) statSubjectsCount.textContent = rbTotals.subjects;
    if (statNotesCount) statNotesCount.textContent = `${rbTotals.notes} PDFs + ${rbTotals.tests} Tests`;
  } else {
    if (statSubjectsCount) statSubjectsCount.textContent = allSubjects.length;
    if (statNotesCount) statNotesCount.textContent = masterTotal;
  }
}

function updateRb104StatusUi(syncResult) {
  const statusEl = document.getElementById('rb104-sync-status');
  const summaryEl = document.getElementById('rb104-summary-text');
  if (summaryEl && syncResult?.totals) {
    const t = syncResult.totals;
    summaryEl.textContent = `${t.completedSubjects} of ${t.subjects} subjects active • ${t.notes} Class Notes PDFs & ${t.tests} Topic Tests`;
  }
  if (!statusEl) return;

  const ts = syncResult?.lastSyncedAt
    ? new Date(syncResult.lastSyncedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : 'Cached';

  if (syncResult?.status === 'no-auth') {
    statusEl.textContent = `Verified Baseline (${ts}) • Sign in for auto-updates`;
  } else if (syncResult?.status === 'synced') {
    const delta = (syncResult.newNotes || 0) + (syncResult.newTests || 0);
    statusEl.textContent = delta > 0
      ? `Synced ${ts} (+${syncResult.newNotes} notes, +${syncResult.newTests} tests)`
      : `Live Synced • ${ts}`;
  } else {
    statusEl.textContent = `Auto-Sync • ${ts}`;
  }
}

function updateRbToggleUi() {
  const badge = document.getElementById('rb-active-batch-badge');
  const b103 = document.getElementById('rb-lang-103');
  const b104 = document.getElementById('rb-lang-104');
  const isEng = activeRbBatchId === 104;
  if (badge) badge.textContent = isEng ? 'Batch 104 • English' : 'Batch 103 • Hinglish';
  if (b103) {
    b103.style.background = !isEng ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.36), rgba(236, 72, 153, 0.28))' : 'transparent';
    b103.style.borderColor = !isEng ? 'rgba(167, 139, 250, 0.45)' : 'transparent';
  }
  if (b104) {
    b104.style.background = isEng ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.36), rgba(236, 72, 153, 0.28))' : 'transparent';
    b104.style.borderColor = isEng ? 'rgba(167, 139, 250, 0.45)' : 'transparent';
  }
}

function setRbBatchId(nextId, keepCurrentMode = false) {
  activeRbBatchId = Number(nextId) === 104 ? 104 : 103;
  batch104State = getBatchBaselineState(activeRbBatchId);
  updateRbToggleUi();
  updateTotalStats();
  updateRb104StatusUi(batch104State);
  if (!keepCurrentMode && currentSectionMode !== 'rb104') {
    switchSectionMode('rb104');
  } else if (currentSectionMode === 'rb104') {
    if (currentOpenSubject?.isBatch104) closeSubjectView();
    renderSubjectCards();
  }
  triggerBatch104Sync(false);
}

async function triggerBatch104Sync(force = false) {
  const statusEl = document.getElementById('rb104-sync-status');
  const syncBtn = document.getElementById('rb104-sync-btn');
  const targetBatch = activeRbBatchId;
  if (force && statusEl) statusEl.textContent = `Checking Batch ${targetBatch} updates...`;
  if (force && syncBtn) syncBtn.disabled = true;

  const res = await syncBatchLive(targetBatch, {
    force,
    onUpdate: (updated) => {
      if (updated.batchId !== activeRbBatchId) return;
      batch104State = updated;
      updateTotalStats();
      updateRb104StatusUi(updated);
      if (currentSectionMode === 'rb104') {
        if (currentOpenSubject && currentOpenSubject.isBatch104) {
          const freshSubj = updated.subjects.find(s => String(s.id) === String(currentOpenSubject.id));
          if (freshSubj) openBatch104SubjectView(freshSubj);
        } else if (!currentOpenSubject) {
          renderSubjectCards();
        }
      }
    }
  });

  // Also passively keep the companion Red Sapphire batch synced in background
  const otherBatch = targetBatch === 103 ? 104 : 103;
  syncBatchLive(otherBatch, { force });

  if (force && syncBtn) syncBtn.disabled = false;
  if (targetBatch === activeRbBatchId) {
    batch104State = res;
    updateTotalStats();
    updateRb104StatusUi(res);
  }
  return res;
}

function switchSectionMode(mode) {
  currentSectionMode = mode === 'rb104' ? 'rb104' : 'master';
  const tabMaster = document.getElementById('sec-tab-master');
  const tabRb104 = document.getElementById('sec-tab-rb104');
  const rbBar = document.getElementById('rb104-status-bar');

  if (tabMaster) tabMaster.classList.toggle('active', currentSectionMode === 'master');
  if (tabRb104) tabRb104.classList.toggle('active', currentSectionMode === 'rb104');
  if (rbBar) rbBar.classList.toggle('hide', currentSectionMode !== 'rb104');

  if (currentOpenSubject) closeSubjectView();
  updateTotalStats();
  renderSubjectCards();
}

function renderBatch104Cards() {
  if (!subjectsGrid) return;
  const subjects = batch104State?.subjects || [];
  const query = searchQuery.trim().toLowerCase();

  const filtered = subjects.filter(sub => {
    if (!query) return true;
    const matchTitle = (sub.title || '').toLowerCase().includes(query) || (sub.faculty || '').toLowerCase().includes(query);
    const matchNotes = (sub.notes || []).some(n => (n.title || '').toLowerCase().includes(query) || (n.topic || '').toLowerCase().includes(query));
    const matchTests = (sub.tests || []).some(t => (t.title || '').toLowerCase().includes(query) || (t.topic || '').toLowerCase().includes(query));
    return matchTitle || matchNotes || matchTests;
  });

  if (filtered.length === 0) {
    subjectsGrid.innerHTML = `
      <div class="notes-empty-state" style="grid-column: 1 / -1;">
        <h3 class="notes-empty-title">No Red Sapphire Subjects Matched</h3>
        <p class="notes-empty-desc">Try another keyword or clear search.</p>
      </div>
    `;
    return;
  }

  // Sort completed subjects (with notes/tests/videos) first, preserving natural order within each group
  const sorted = [...filtered].sort((a, b) => {
    const scoreA = (a.notes?.length || 0) + (a.tests?.length || 0) * 2 + (a.videoCount > 0 ? 1 : 0);
    const scoreB = (b.notes?.length || 0) + (b.tests?.length || 0) * 2 + (b.videoCount > 0 ? 1 : 0);
    if ((scoreA > 0) !== (scoreB > 0)) return scoreB > 0 ? 1 : -1;
    return 0;
  });

  subjectsGrid.innerHTML = sorted.map(sub => {
    const svgIcon = getSubjectIconSVG(sub.title);
    const notesCount = sub.notes?.length || 0;
    const testsCount = sub.tests?.length || 0;
    const hasContent = notesCount > 0 || testsCount > 0 || (sub.videoCount || 0) > 0;
    const countStr = hasContent
      ? `${notesCount} Notes • ${testsCount} Tests`
      : `${sub.topicCount || 0} Planned Topics • Upcoming`;

    return `
      <div class="subject-card ${hasContent ? 'curated-highlight' : ''}" data-rb-sub-id="${sub.id}" style="${hasContent ? 'border-color: rgba(244, 63, 94, 0.35);' : 'opacity: 0.78;'}">
        <div class="subject-card-top">
          <div class="subject-card-icon" style="${hasContent ? 'color: #fda4af; border-color: rgba(251, 113, 133, 0.35); background: rgba(244, 63, 94, 0.14);' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              ${svgIcon}
            </svg>
          </div>
          <div class="subject-card-meta">
            <h3 class="subject-card-title">${sub.title}</h3>
            <div class="subject-card-badge" style="${hasContent ? 'background: rgba(244, 63, 94, 0.14); border-color: rgba(251, 113, 133, 0.28); color: #fecdd3;' : ''}">
              <span>${sub.faculty || 'NNL Faculty'} • ${hasContent ? 'Classes Completed' : 'Upcoming'}</span>
            </div>
          </div>
        </div>
        <div class="subject-card-bottom">
          <span class="subject-card-count">${countStr}</span>
          <span class="subject-card-arrow">
            <span>Open</span>
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
          </span>
        </div>
      </div>
    `;
  }).join('');

  subjectsGrid.querySelectorAll('[data-rb-sub-id]').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-rb-sub-id');
      const subj = (batch104State?.subjects || []).find(s => String(s.id) === String(id));
      if (subj) openBatch104SubjectView(subj);
    });
  });
}

function openBatch104SubjectView(subj) {
  currentOpenSubject = { ...subj, isBatch104: true };
  notesCatalogView.classList.add('hide');
  notesSubjectView.classList.remove('hide');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (subjectDetailTitle) subjectDetailTitle.textContent = subj.title;
  const teacherEl = document.getElementById('subject-detail-teacher-name');
  if (teacherEl) teacherEl.textContent = subj.faculty || 'NNL Faculty';

  const notes = subj.notes || [];
  const tests = subj.tests || [];
  if (subjectDetailCount) {
    subjectDetailCount.textContent = `${notes.length} Notes • ${tests.length} Tests`;
  }

  const query = searchQuery.trim().toLowerCase();
  const fNotes = notes.filter(n => !query || `${n.title} ${n.topic}`.toLowerCase().includes(query));
  const fTests = tests.filter(t => !query || `${t.title} ${t.topic}`.toLowerCase().includes(query));

  if (!notesDocList) return;

  if (fNotes.length === 0 && fTests.length === 0) {
    notesDocList.innerHTML = `
      <div class="notes-empty-state">
        <h3 class="notes-empty-title">${notes.length === 0 && tests.length === 0 ? 'Classes Upcoming in Red Sapphire (English)' : 'No Matches Found'}</h3>
        <p class="notes-empty-desc">${notes.length === 0 && tests.length === 0
          ? 'This subject has not started or uploaded notes/tests yet. Auto-Sync will add new notes and next-day tests automatically once published.'
          : 'No class notes or tests matched your search filter.'}</p>
      </div>
    `;
    return;
  }

  const notesSectionHtml = fNotes.length > 0 ? `
    <div style="margin-bottom: 1.5rem;">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
        <h3 style="margin:0; font-family:var(--font-display); font-size:0.85rem; letter-spacing:0.06em; text-transform:uppercase; color:#ddd6fe;">Class Notes &amp; PDFs (${fNotes.length})</h3>
      </div>
      <div style="display:flex; flex-direction:column; gap:0.65rem;">
        ${fNotes.map(n => {
          const safeName = (n.downloadName || `${n.title}.pdf`).replace(/[^a-zA-Z0-9_.-]/g, '_');
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
                    <span class="category-tag tag-handwritten">${n.category || 'CLASS NOTES'}</span>
                    ${n.topic ? `<span style="font-size:0.72rem; color:var(--text-muted);">${n.topic}</span>` : ''}
                    ${n.date ? `<span style="font-size:0.7rem; color:#94a3b8;">${n.date}</span>` : ''}
                  </div>
                </div>
              </div>
              <div class="note-doc-actions">
                <button class="btn-note-view btn-preview-pdf" data-title="${encodeURIComponent(n.title)}" data-url="${encodeURIComponent(n.url)}" data-filename="${encodeURIComponent(safeName)}">
                  <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><circle cx="12" cy="12" r="3"/></svg>
                  <span>View PDF</span>
                </button>
                <a href="${n.url}" target="_blank" rel="noopener noreferrer" download="${safeName}" class="btn-note-download">
                  <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
                  <span>Download</span>
                </a>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  ` : '';

  const testsSectionHtml = fTests.length > 0 ? `
    <div>
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
        <h3 style="margin:0; font-family:var(--font-display); font-size:0.85rem; letter-spacing:0.06em; text-transform:uppercase; color:#fecdd3;">Topic Assessment Tests (${fTests.length})</h3>
      </div>
      <div style="display:flex; flex-direction:column; gap:0.65rem;">
        ${fTests.map(t => {
          const mins = Math.max(1, Math.round((t.duration || 1800) / 60));
          const testUrl = `/tests.html?batchTest=${encodeURIComponent(t.id)}&title=${encodeURIComponent(t.title)}&duration=${encodeURIComponent(t.duration || 1800)}&subject=${encodeURIComponent(subj.title)}`;
          return `
            <div class="note-doc-card" style="border-color: rgba(251, 113, 133, 0.22);">
              <div class="note-doc-info">
                <div class="note-doc-icon" style="color: #fda4af; background: rgba(244, 63, 94, 0.14); border-color: rgba(251, 113, 133, 0.3);">
                  <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                </div>
                <div class="note-doc-details">
                  <div class="note-doc-title" title="${t.title}">${t.title}</div>
                  <div class="note-doc-badges">
                    <span class="category-tag tag-highyield">${t.totalQuestions || 30} Qs • ${mins} min</span>
                    ${t.topic ? `<span style="font-size:0.72rem; color:var(--text-muted);">${t.topic}</span>` : ''}
                    ${t.date ? `<span style="font-size:0.7rem; color:#94a3b8;">${t.date}</span>` : ''}
                  </div>
                </div>
              </div>
              <div class="note-doc-actions">
                <a href="${testUrl}" class="btn-note-view" style="text-decoration:none;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  <span>Attempt Test</span>
                </a>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  ` : '';

  notesDocList.innerHTML = notesSectionHtml + testsSectionHtml;

  notesDocList.querySelectorAll('.btn-preview-pdf').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openPdfModal(
        decodeURIComponent(btn.getAttribute('data-title')),
        decodeURIComponent(btn.getAttribute('data-url')),
        decodeURIComponent(btn.getAttribute('data-filename') || '')
      );
    });
  });
}

// Render Subject Cards Grid
function renderSubjectCards() {
  if (!subjectsGrid) return;

  if (currentSectionMode === 'rb104') {
    renderBatch104Cards();
    return;
  }

  const query = searchQuery.trim().toLowerCase();
  const filtered = allSubjects.filter(sub => {
    const notes = subjectNotesMap.get(String(sub.id)) || [];

    if (currentFilterType === 'schedule') {
      return Boolean(sub.isScheduleSubject);
    }
    if (currentFilterType === 'oncology') {
      return Boolean(sub.isMedicineMaster);
    }
    if (currentFilterType === 'liveclass') {
      return notes.some(n => n.category === 'LIVE CLASS');
    }
    if (currentFilterType === 'revision') {
      return notes.some(n => n.category === 'REVISION');
    }

    if (!query) return true;
    const titleMatch = (sub.title || '').toLowerCase().includes(query) || (sub.faculty || '').toLowerCase().includes(query);
    const notesMatch = notes.some(n =>
      (n.title || '').toLowerCase().includes(query) ||
      (n.topic || '').toLowerCase().includes(query)
    );
    return titleMatch || notesMatch;
  });

  if (filtered.length === 0) {
    subjectsGrid.innerHTML = `
      <div class="notes-empty-state" style="grid-column: 1 / -1;">
        <h3 class="notes-empty-title">No Subjects Found</h3>
        <p class="notes-empty-desc">No study materials matched "${searchQuery || currentFilterType}".</p>
      </div>
    `;
    return;
  }

  subjectsGrid.innerHTML = filtered.map(sub => {
    const svgIcon = getSubjectIconSVG(sub.title);
    const notes = subjectNotesMap.get(String(sub.id)) || [];
    const isMedicine = Boolean(sub.isMedicineMaster);
    const isSchedule = Boolean(sub.isScheduleSubject);

    let countStr = 'Checking PDFs...';
    if (isSchedule) {
      countStr = `${RED_SAPPHIRE_DATA.hinglishSchedule.length + RED_SAPPHIRE_DATA.englishSchedule.length} Classes • ${RED_SAPPHIRE_DATA.brochures.length} Brochures`;
    } else if (subjectNotesMap.has(String(sub.id))) {
      countStr = `${notes.length} PDFs Ready`;
    } else if (sub.handwritten_notes_count) {
      countStr = `${sub.handwritten_notes_count} PDFs`;
    }

    const highlightStyle = isMedicine
      ? 'border-color: rgba(255, 45, 85, 0.45); background: linear-gradient(135deg, rgba(255, 45, 85, 0.09) 0%, rgba(18, 21, 34, 0.78) 100%);'
      : (isSchedule
        ? 'border-color: rgba(0, 243, 208, 0.35); background: linear-gradient(135deg, rgba(0, 243, 208, 0.08) 0%, rgba(18, 21, 34, 0.78) 100%);'
        : '');

    const iconStyle = isMedicine
      ? 'background: rgba(255, 45, 85, 0.18); border-color: rgba(255, 45, 85, 0.4); color: #ff2d55;'
      : (isSchedule
        ? 'background: rgba(0, 243, 208, 0.15); border-color: rgba(0, 243, 208, 0.35); color: #00f3d0;'
        : '');

    const badgeStyle = isMedicine
      ? 'background: rgba(255, 45, 85, 0.15); border-color: rgba(255, 45, 85, 0.3); color: #ff2d55;'
      : (isSchedule
        ? 'background: rgba(0, 243, 208, 0.14); border-color: rgba(0, 243, 208, 0.3); color: #00f3d0;'
        : '');

    return `
      <div class="subject-card ${isMedicine ? 'curated-highlight' : ''}" data-sub-id="${sub.id}" style="${highlightStyle}">
        <div class="subject-card-top">
          <div class="subject-card-icon" style="${iconStyle}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              ${svgIcon}
            </svg>
          </div>
          <div class="subject-card-meta">
            <h3 class="subject-card-title">${sub.title}</h3>
            <div class="subject-card-badge" style="${badgeStyle}">
              <span>${isMedicine ? 'Dr. Deepak Marwah' : (isSchedule ? 'Red Sapphire Plan & Schedule' : (sub.category || 'Class Notes & Handouts'))}</span>
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

  subjectsGrid.querySelectorAll('.subject-card').forEach(card => {
    card.addEventListener('click', () => {
      const subId = card.getAttribute('data-sub-id');
      const subject = allSubjects.find(s => String(s.id) === String(subId));
      if (subject) openSubjectView(subject);
    });
  });
}

// Open Dedicated Subject Detail View
async function openSubjectView(subject) {
  currentOpenSubject = subject;
  currentTopicFilter = 'ALL';
  notesCatalogView.classList.add('hide');
  notesSubjectView.classList.remove('hide');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Clean center Subject Name (without parenthetical teacher) & populate Teacher Name on the right
  const rawSubTitle = subject.title || 'Subject Notes';
  const centerSubjectName = rawSubTitle.replace(/\s*\([^)]*\)\s*$/, '').trim() || rawSubTitle;
  const teacherMatch = rawSubTitle.match(/\(([^)]+)\)\s*$/);
  const teacherName = subject.faculty || (teacherMatch ? teacherMatch[1] : 'NNL Faculty');

  if (subjectDetailTitle) subjectDetailTitle.textContent = centerSubjectName;
  const teacherEl = document.getElementById('subject-detail-teacher-name');
  if (teacherEl) teacherEl.textContent = teacherName;
  if (subjectDetailBatch) subjectDetailBatch.textContent = getCleanBatchName(activeBatch);
  if (subjectTopBatchLabel) subjectTopBatchLabel.textContent = `// ${getCleanBatchName(activeBatch)}`;

  if (subject.isScheduleSubject) {
    if (subjectDetailCount) {
      subjectDetailCount.textContent = `${RED_SAPPHIRE_DATA.hinglishSchedule.length + RED_SAPPHIRE_DATA.englishSchedule.length} Classes`;
    }
    renderRedSapphireBrochureView();
    return;
  }

  let notes = subjectNotesMap.get(String(subject.id));
  if (!notes || (String(subject.id) !== String(MEDICINE_SUBJECT.id) && notes.length === 0)) {
    const token = localStorage.getItem('nnl_access_token');
    if (String(subject.id) === String(MEDICINE_SUBJECT.id)) {
      notes = [...MEDICINE_MASTER_NOTES];
      subjectNotesMap.set(String(subject.id), notes);
    } else if (token) {
      if (notesDocList) {
        notesDocList.innerHTML = `
          <div class="cp-loading" style="padding: 4rem 2rem; text-align: center;">
            <div class="spinner"></div>
            <p style="color: var(--text-secondary); margin-top: 1rem; font-family: var(--font-display); font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase;">Fetching Notes for ${subject.title}...</p>
          </div>
        `;
      }
      const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };
      notes = await fetchSingleSubjectNotes(subject.id, headers);
      subjectNotesMap.set(String(subject.id), notes);
      updateTotalStats();
    } else {
      notes = [];
    }
  }

  if (subjectDetailCount) {
    subjectDetailCount.textContent = `${notes.length} PDFs`;
  }

  renderSubjectNotesList();
}

function closeSubjectView() {
  currentOpenSubject = null;
  currentTopicFilter = 'ALL';
  notesSubjectView.classList.add('hide');
  notesCatalogView.classList.remove('hide');
  renderSubjectCards();
}

// Render Red Sapphire Brochure, Plans & Full Timetable View
function renderRedSapphireBrochureView() {
  if (!notesDocList) return;

  const isEng = getCleanBatchName(activeBatch).toLowerCase().includes('english');
  const activeScheduleList = currentScheduleLang === 'english'
    ? RED_SAPPHIRE_DATA.englishSchedule
    : RED_SAPPHIRE_DATA.hinglishSchedule;

  const query = searchQuery.trim().toLowerCase();
  const filteredSchedule = activeScheduleList.filter(c => {
    if (!query) return true;
    return (c.title || '').toLowerCase().includes(query) ||
      (c.faculty || '').toLowerCase().includes(query) ||
      (c.start || '').toLowerCase().includes(query);
  });

  // Format date helper
  const formatSlot = (startStr, endStr) => {
    try {
      const d = new Date(startStr);
      const e = new Date(endStr);
      const datePart = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
      const sTime = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
      const eTime = !isNaN(e.getTime()) ? e.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';
      return { datePart, timeRange: eTime ? `${sTime} – ${eTime}` : sTime, isFuture: d > new Date() };
    } catch {
      return { datePart: startStr, timeRange: '', isFuture: false };
    }
  };

  // Sort upcoming first, then most recent completed
  const sortedSchedule = [...filteredSchedule].sort((a, b) => new Date(b.start) - new Date(a.start));

  const featuresHtml = RED_SAPPHIRE_DATA.features.map(f => `
    <div style="background: rgba(14, 17, 28, 0.72); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 1.2rem 1.4rem;">
      <h4 style="color: #00f3d0; font-family: var(--font-display); font-size: 0.85rem; margin: 0 0 0.75rem 0; letter-spacing: 0.04em; text-transform: uppercase;">${f.title}</h4>
      <ul style="margin: 0; padding-left: 1.15rem; color: var(--text-secondary); font-size: 0.82rem; line-height: 1.55;">
        ${f.bullets.map(b => `<li style="margin-bottom: 0.3rem;">${b}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  const brochuresHtml = RED_SAPPHIRE_DATA.brochures.map(b => `
    <div class="note-doc-card">
      <div class="note-doc-info">
        <div class="note-doc-icon" style="color: #00f3d0;">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
        </div>
        <div class="note-doc-details">
          <div class="note-doc-title">${b.title}</div>
          <div class="note-doc-badges">
            <span class="category-tag" style="background: rgba(0, 243, 208, 0.14); color: #00f3d0;">BROCHURE PDF</span>
            <span style="font-size: 0.72rem; color: var(--text-muted);">${b.note}</span>
          </div>
        </div>
      </div>
      <div class="note-doc-actions">
        <button class="btn-note-view btn-preview-pdf" data-title="${encodeURIComponent(b.title)}" data-url="${encodeURIComponent(b.url)}" data-filename="${encodeURIComponent(b.title.replace(/[^a-zA-Z0-9_-]/g, '_') + '.pdf')}">
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><circle cx="12" cy="12" r="3"/></svg>
          <span>View PDF</span>
        </button>
        <a href="${b.url}" target="_blank" rel="noopener noreferrer" download class="btn-note-download">
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
          <span>Download</span>
        </a>
      </div>
    </div>
  `).join('');

  const timetableRowsHtml = sortedSchedule.map(c => {
    const slot = formatSlot(c.start, c.end);
    return `
      <div class="note-doc-card" style="${slot.isFuture ? 'border-color: rgba(0, 243, 208, 0.45); background: rgba(0, 243, 208, 0.06);' : ''}">
        <div class="note-doc-info">
          <div class="note-doc-details">
            <div class="note-doc-title">${c.title}</div>
            <div class="note-doc-badges">
              ${slot.isFuture
                ? '<span class="category-tag" style="background: rgba(0, 243, 208, 0.2); color: #00f3d0;">UPCOMING</span>'
                : '<span class="category-tag" style="background: rgba(255, 255, 255, 0.08); color: #cbd5e1;">COMPLETED</span>'}
              <span style="font-size: 0.76rem; color: #f8fafc; font-weight: 600;">${slot.datePart}</span>
              <span style="font-size: 0.74rem; color: var(--text-muted);">${slot.timeRange}</span>
              <span style="font-size: 0.74rem; color: #ff6b81;">${c.faculty}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  notesDocList.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <div style="background: rgba(14, 17, 28, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 1.25rem 1.5rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;">
        <div>
          <h3 style="margin: 0; font-family: var(--font-display); font-size: 1rem; color: #ffffff;">Plan MLB Pro Red Sapphire — Official Features &amp; Syllabus Plan</h3>
          <p style="margin: 0.3rem 0 0 0; font-size: 0.8rem; color: var(--text-secondary);">Direct data extracted from Plan 77 (Hinglish) &amp; Plan 79 (English) + Live Batches 103 &amp; 104.</p>
        </div>
        <button id="btn-print-timetable" class="btn-note-view" style="background: rgba(0, 243, 208, 0.14); border-color: rgba(0, 243, 208, 0.35); color: #00f3d0;">
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
          <span>Print / Save Schedule PDF</span>
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
        ${featuresHtml}
      </div>

      <div>
        <h3 style="font-family: var(--font-display); font-size: 0.9rem; color: #fff; margin: 0.5rem 0 0.75rem 0; letter-spacing: 0.05em; text-transform: uppercase;">Official NNL Batch Brochures &amp; TOC PDFs</h3>
        ${brochuresHtml}
      </div>

      <div>
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem; margin: 0.5rem 0 0.85rem 0;">
          <h3 style="font-family: var(--font-display); font-size: 0.9rem; color: #fff; margin: 0; letter-spacing: 0.05em; text-transform: uppercase;">Red Sapphire Live Class Timetable (${filteredSchedule.length} Classes)</h3>
          <div style="display: flex; gap: 0.5rem;">
            <button class="filter-chip rs-lang-btn ${currentScheduleLang === 'hinglish' ? 'active' : ''}" data-lang="hinglish">Hinglish (Batch 103 · ${RED_SAPPHIRE_DATA.hinglishSchedule.length})</button>
            <button class="filter-chip rs-lang-btn ${currentScheduleLang === 'english' ? 'active' : ''}" data-lang="english">English (Batch 104 · ${RED_SAPPHIRE_DATA.englishSchedule.length})</button>
          </div>
        </div>
        ${timetableRowsHtml}
      </div>
    </div>
  `;

  notesDocList.querySelectorAll('.rs-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentScheduleLang = btn.getAttribute('data-lang') || 'hinglish';
      renderRedSapphireBrochureView();
    });
  });

  const printBtn = document.getElementById('btn-print-timetable');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  notesDocList.querySelectorAll('.btn-preview-pdf').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openPdfModal(
        decodeURIComponent(btn.getAttribute('data-title')),
        decodeURIComponent(btn.getAttribute('data-url')),
        decodeURIComponent(btn.getAttribute('data-filename') || '')
      );
    });
  });
}

// Render Notes inside Subject View (Cleanly Grouped by Topic / System)
function renderSubjectNotesList() {
  if (!notesDocList || !currentOpenSubject) return;

  if (currentOpenSubject.isBatch104) {
    openBatch104SubjectView(currentOpenSubject);
    return;
  }

  if (currentOpenSubject.isScheduleSubject) {
    renderRedSapphireBrochureView();
    return;
  }

  const notes = subjectNotesMap.get(String(currentOpenSubject.id)) || [];
  const query = searchQuery.trim().toLowerCase();

  // Extract unique topics for quick sub-navigation
  const topicsList = [];
  const seenTopics = new Set();
  notes.forEach(n => {
    const t = (n.topic || 'General').trim();
    if (!seenTopics.has(t)) {
      seenTopics.add(t);
      topicsList.push(t);
    }
  });

  const filtered = notes.filter(n => {
    if (currentFilterType === 'handwritten' && n.category !== 'HANDWRITTEN') return false;
    if (currentFilterType === 'liveclass' && n.category !== 'LIVE CLASS') return false;
    if (currentFilterType === 'revision' && n.category !== 'REVISION') return false;
    if (currentFilterType === 'oncology') {
      const match = (n.topic || '').toLowerCase().includes('onco') ||
        (n.title || '').toLowerCase().includes('onco') ||
        (n.title || '').toLowerCase().includes('cancer');
      if (!match) return false;
    }

    if (currentTopicFilter !== 'ALL' && (n.topic || 'General').trim() !== currentTopicFilter) {
      return false;
    }

    if (query) {
      const hay = `${n.title || ''} ${n.lectureTitle || ''} ${n.topic || ''}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }

    return true;
  });

  // Topic pill bar (shown when subject has multiple systems/topics like Medicine's 15 groups)
  const topicBarHtml = topicsList.length > 1 ? `
    <div style="display: flex; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 1.25rem; padding: 0.85rem 1rem; background: rgba(12, 15, 25, 0.6); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 14px;">
      <button class="filter-chip topic-pill-btn ${currentTopicFilter === 'ALL' ? 'active' : ''}" data-topic="ALL" style="font-size: 0.72rem; padding: 0.35rem 0.75rem;">All Topics (${notes.length})</button>
      ${topicsList.map(t => {
        const cnt = notes.filter(x => (x.topic || 'General').trim() === t).length;
        return `<button class="filter-chip topic-pill-btn ${currentTopicFilter === t ? 'active' : ''}" data-topic="${t.replace(/"/g, '&quot;')}" style="font-size: 0.72rem; padding: 0.35rem 0.75rem;">${t} (${cnt})</button>`;
      }).join('')}
    </div>
  ` : '';

  if (filtered.length === 0) {
    notesDocList.innerHTML = topicBarHtml + `
      <div class="notes-empty-state">
        <h3 class="notes-empty-title">No Notes Found</h3>
        <p class="notes-empty-desc">${notes.length === 0 ? 'Please sign in with your NNL account to load this subject\'s PDFs.' : 'No notes matched the selected topic or search keyword.'}</p>
      </div>
    `;
    bindTopicPills();
    return;
  }

  const cardsHtml = filtered.map(n => {
    let tagClass = 'tag-handwritten';
    if (n.category === 'REVISION') tagClass = 'tag-highyield';
    else if (n.category === 'LIVE CLASS') tagClass = 'tag-daywise';

    const cleanTitle = (n.title || n.lectureTitle || 'Class Note').trim();
    const safeDownloadName = (n.downloadName || `${cleanTitle}.pdf`).replace(/[^a-zA-Z0-9_.-]/g, '_');
    const topicLabel = (n.topic || '').trim();

    return `
      <div class="note-doc-card">
        <div class="note-doc-info">
          <div class="note-doc-icon">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
            </svg>
          </div>
          <div class="note-doc-details">
            <div class="note-doc-title" title="${cleanTitle}">${cleanTitle}</div>
            <div class="note-doc-badges">
              <span class="category-tag ${tagClass}">${n.category || 'HANDWRITTEN'}</span>
              ${topicLabel ? `<span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500;">${topicLabel}</span>` : ''}
            </div>
          </div>
        </div>

        <div class="note-doc-actions">
          <button class="btn-note-view btn-preview-pdf" data-title="${encodeURIComponent(cleanTitle)}" data-url="${encodeURIComponent(n.url)}" data-filename="${encodeURIComponent(safeDownloadName)}">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><circle cx="12" cy="12" r="3"/></svg>
            <span>View PDF</span>
          </button>
          <a href="${n.url}" target="_blank" rel="noopener noreferrer" download="${safeDownloadName}" class="btn-note-download" title="Open or Download Official PDF">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
            <span>Download</span>
          </a>
        </div>
      </div>
    `;
  }).join('');

  notesDocList.innerHTML = topicBarHtml + cardsHtml;
  bindTopicPills();

  notesDocList.querySelectorAll('.btn-preview-pdf').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = decodeURIComponent(btn.getAttribute('data-title'));
      const url = decodeURIComponent(btn.getAttribute('data-url'));
      const filename = decodeURIComponent(btn.getAttribute('data-filename') || '');
      openPdfModal(title, url, filename);
    });
  });
}

function bindTopicPills() {
  if (!notesDocList) return;
  notesDocList.querySelectorAll('.topic-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentTopicFilter = btn.getAttribute('data-topic') || 'ALL';
      renderSubjectNotesList();
    });
  });
}

// In-App Minimal PDF Reader Modal
function openPdfModal(title, url, downloadName = '') {
  if (!pdfModal) return;
  if (pdfModalTitle) pdfModalTitle.textContent = title;
  if (pdfModalDownloadBtn) {
    pdfModalDownloadBtn.href = url;
    pdfModalDownloadBtn.setAttribute('target', '_blank');
    pdfModalDownloadBtn.setAttribute('rel', 'noopener noreferrer');
    if (downloadName) {
      pdfModalDownloadBtn.setAttribute('download', downloadName);
    }
    const span = pdfModalDownloadBtn.querySelector('span');
    if (span) span.textContent = 'Open Full PDF';
  }

  if (pdfModalIframe) {
    // Append fit-width & clean toolbar hint so PDFs fill the full reader cleanly
    const viewerUrl = url.toLowerCase().includes('.pdf') && !url.includes('#')
      ? `${url}#view=FitH&toolbar=1&navpanes=0`
      : url;
    pdfModalIframe.src = viewerUrl;
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

// Event Listeners Initialization
function initEventListeners() {
  if (btnBackSubjects) {
    btnBackSubjects.addEventListener('click', closeSubjectView);
  }

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

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilterType = chip.getAttribute('data-filter') || 'all';

      if (currentFilterType === 'schedule') {
        openSubjectView(SCHEDULE_SUBJECT);
        return;
      }

      if (currentFilterType === 'oncology' && !currentOpenSubject) {
        openSubjectView(MEDICINE_SUBJECT);
        return;
      }

      if (currentOpenSubject) {
        renderSubjectNotesList();
      } else {
        renderSubjectCards();
      }
    });
  });

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

document.addEventListener('DOMContentLoaded', () => {
  initBatchDropdown();
  initUserHeader();
  initSettingsWidget();
  initEventListeners();

  const secTabMaster = document.getElementById('sec-tab-master');
  const secTabRb104 = document.getElementById('sec-tab-rb104');
  const rb104SyncBtn = document.getElementById('rb104-sync-btn');

  if (secTabMaster) secTabMaster.addEventListener('click', () => switchSectionMode('master'));
  if (secTabRb104) secTabRb104.addEventListener('click', () => switchSectionMode('rb104'));
  if (rb104SyncBtn) rb104SyncBtn.addEventListener('click', () => triggerBatch104Sync(true));
  document.getElementById('rb-lang-103')?.addEventListener('click', () => setRbBatchId(103));
  document.getElementById('rb-lang-104')?.addEventListener('click', () => setRbBatchId(104));

  updateRbToggleUi();

  if (currentSectionMode === 'rb104') {
    if (secTabMaster) secTabMaster.classList.remove('active');
    if (secTabRb104) secTabRb104.classList.add('active');
    const rbBar = document.getElementById('rb104-status-bar');
    if (rbBar) rbBar.classList.remove('hide');
  }

  loadNotesRepository();
  updateRb104StatusUi(batch104State);
  triggerBatch104Sync(false);
});
