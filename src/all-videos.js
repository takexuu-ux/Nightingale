// Nightingale All Videos Library — Instant Subject + Teacher Catalog, Throttled On-Demand Topic Loading & Batch 103 Live Sync
import { MEDICINE_MASTER_NOTES } from './data/medicineNotes.js';
import { MASTER_NOTES_BY_SUBJECT } from './data/allSubjectsNotes.js';
import { ALL_VIDEO_SUBJECTS, PRESEEDED_VIDEOS_BY_SUBJECT, ALL_VIDEOS_TOTALS } from './data/allVideosCatalog.js';
import { BATCH_103_SUBJECTS } from './data/batch103HinglishData.js';
import { getBatchBaselineState, syncBatchLive, getBatchIdFromName, fetchWithAutoAuth, fetchFreshVdoCipherOtp, fetchOfflineVdoCipherOtp, hydrateAndroidAuthSession } from './utils/batch104Sync.js';
import { IS_HINGLISH_APK, getPdfPreviewSrc } from './config/appMode.js';
import {
  getLectureProgress,
  saveLectureProgress,
  isLectureSaved,
  toggleSavedLecture,
  getSavedLecturesList
} from './services/lectureWatchService.js';

hydrateAndroidAuthSession();

const API_BASE = '/api';
const SUBJECT_VIDEO_CACHE_PREFIX = 'nnl_vid_subj_cache_v1_';

// Fast lookup maps for matching Handwritten Notes PDFs by subtopic ID or normalized title
const NOTE_BY_SUBTOPIC = new Map();
const NOTE_BY_TITLE = new Map();
const ALL_VERIFIED_NOTES = [
  ...MEDICINE_MASTER_NOTES,
  ...Object.values(MASTER_NOTES_BY_SUBJECT).flat()
];
ALL_VERIFIED_NOTES.forEach(n => {
  if (n.subtopicId) NOTE_BY_SUBTOPIC.set(Number(n.subtopicId), n);
  if (n.lectureTitle) NOTE_BY_TITLE.set(n.lectureTitle.trim().toLowerCase(), n);
  if (n.title) NOTE_BY_TITLE.set(n.title.trim().toLowerCase(), n);
});

function findMatchingNotePdf(subtopicId, lectureTitle) {
  if (subtopicId && NOTE_BY_SUBTOPIC.has(Number(subtopicId))) {
    return NOTE_BY_SUBTOPIC.get(Number(subtopicId));
  }
  if (lectureTitle) {
    const k = lectureTitle.trim().toLowerCase();
    if (NOTE_BY_TITLE.has(k)) return NOTE_BY_TITLE.get(k);
  }
  return null;
}

const ALLOWED_SAPPHIRE_BATCHES = IS_HINGLISH_APK
  ? ['Red Sapphire (Hinglish)', 'Blue Sapphire (Hinglish)', 'Red Sapphire (English)', 'Fast Track']
  : ['Red Sapphire (Hinglish)', 'Blue Sapphire (Hinglish)'];

let activeBatch = localStorage.getItem('nnl_active_batch');
if (!activeBatch || !ALLOWED_SAPPHIRE_BATCHES.includes(activeBatch)) {
  activeBatch = 'Red Sapphire (Hinglish)';
  localStorage.setItem('nnl_active_batch', activeBatch);
}

// Topic / Subtopic harmonic shade index helper (User request: same color for topic, different shade for other subtopics)
function getTopicShadeIndex(topicName) {
  if (!topicName) return 0;
  let hash = 0;
  for (let i = 0; i < topicName.length; i++) {
    hash = (hash << 5) - hash + topicName.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 6;
}

// State
let videoSectionMode = (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('mode') === 'saved') ? 'saved' : 'all';
let activeCategoryFilter = 'ALL';
let searchQuery = '';
let lectureFilterQuery = '';
let activeTopicFilter = 'ALL';
let currentOpenSubject = null; // { id, title, faculty, category, videoCount, isBatch103, videos }
let batch103State = getBatchBaselineState(getBatchIdFromName(activeBatch));
const loadedVideosBySubjectId = new Map();
const hasNativeOfflineBridge = () =>
  typeof window !== 'undefined' &&
  window.AndroidVideoBridge &&
  typeof window.AndroidVideoBridge.playOfflineVideo === 'function';

const offlineMapByRecId = new Map();
const offlinePendingReq = new Set();
let offlinePollTimer = null;

async function refreshOfflineDownloads({ reRender = false } = {}) {
  if (!hasNativeOfflineBridge()) return;
  try {
    const res = await fetch(`/__offline/list?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return;
    const json = await res.json();
    if (!json.ok || !Array.isArray(json.items)) return;

    offlineMapByRecId.clear();
    let hasActive = false;
    let savedCount = 0;
    json.items.forEach(item => {
      offlineMapByRecId.set(String(item.recId), item);
      if (item.completed) savedCount++;
      if (item.status === 'pending' || item.status === 'downloading') hasActive = true;
    });

    const offTab = document.getElementById('vid-tab-offline');
    const offCount = document.getElementById('vid-count-offline');
    if (offTab) offTab.classList.remove('hide');
    if (offCount) offCount.textContent = json.items.length;

    if (hasActive && !offlinePollTimer) {
      offlinePollTimer = setInterval(() => refreshOfflineDownloads({ reRender: false }), 1200);
    } else if (!hasActive && offlinePollTimer) {
      clearInterval(offlinePollTimer);
      offlinePollTimer = null;
    }

    // Update active download badges directly in DOM without reloading/re-rendering the whole page
    if (hasActive) {
      json.items.forEach(it => {
        const btn = document.querySelector(`.btn-save-lecture[data-rec-id="${it.recId}"]`);
        if (btn) {
          const span = btn.querySelector('span');
          if (it.status === 'downloading') {
            const pct = Math.round(it.percent || 0);
            if (span) span.textContent = `${pct}%`;
            btn.classList.add('is-downloading');
          } else if (it.completed) {
            if (span) span.textContent = 'Saved';
            btn.classList.remove('is-downloading');
            btn.classList.add('is-saved');
          }
        }
      });
    }

    if (reRender) {
      if (videoSectionMode === 'offline') renderCurrentCatalog();
    }
  } catch {}
}

async function startOfflineLectureDownload(rec, btnEl) {
  if (!rec || !rec.id) return;
  const key = String(rec.id);
  if (offlinePendingReq.has(key)) return;
  offlinePendingReq.add(key);

  if (btnEl) {
    btnEl.disabled = false;
    const span = btnEl.querySelector('span');
    if (span) span.textContent = '0%';
    btnEl.classList.add('is-downloading');
  }

  try {
    const isBatch = Boolean(currentOpenSubject?.isBatch103);
    const cred = await fetchOfflineVdoCipherOtp(rec.id, { isBatch103: isBatch });
    const startRes = await fetch('/__offline/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recId: key,
        mediaId: rec.video_cipher_id || '',
        otp: cred.otp,
        playbackInfo: cred.playbackInfo,
        title: rec.title || 'Recorded Lecture',
        instructor: rec.instructor || 'NNL Faculty',
        subject: currentOpenSubject?.title || rec.topic || ''
      })
    });
    const startJson = await startRes.json();
    if (!startJson.ok) throw new Error(startJson.error || 'Could not queue download');
    await refreshOfflineDownloads({ reRender: false });
  } catch (err) {
    if (btnEl) {
      btnEl.disabled = false;
      btnEl.title = err.message;
      btnEl.innerHTML = '<span>Save</span>';
      btnEl.classList.remove('is-downloading');
    }
    console.warn(`[Offline] Save queue note: ${err.message}`);
  } finally {
    offlinePendingReq.delete(key);
  }
}

async function deleteOfflineLecture(recId) {
  try {
    await fetch('/__offline/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recId: String(recId) })
    });
    offlineMapByRecId.delete(String(recId));
    await refreshOfflineDownloads({ reRender: false });
  } catch {}
}

function normalizeSubjTitle(t) {
  if (!t) return '';
  return String(t).toLowerCase().replace(/\s*\([^)]*\)\s*$/, '').replace(/[^a-z0-9]/g, ' ').trim();
}

const loadedVideosBySubjectTitle = new Map();

// Pre-seed all BATCH_103_SUBJECTS immediately (Anatomy, Pediatrics, Microbiology, etc.)
BATCH_103_SUBJECTS.forEach(sub => {
  if (Array.isArray(sub.videos) && sub.videos.length > 0) {
    const enriched = sub.videos.map(v => {
      const note = findMatchingNotePdf(v.subtopicId, v.title);
      return {
        ...v,
        notePdfUrl: v.notePdfUrl || note?.url || '',
        notePdfTitle: v.notePdfTitle || note?.title || ''
      };
    });
    loadedVideosBySubjectId.set(String(sub.id), enriched);
    const norm = normalizeSubjTitle(sub.title);
    if (norm) loadedVideosBySubjectTitle.set(norm, enriched);
    if (sub.rawTitle) {
      const normRaw = normalizeSubjTitle(sub.rawTitle);
      if (normRaw) loadedVideosBySubjectTitle.set(normRaw, enriched);
    }
  }
});

// Pre-seed Medicine (73) & catalog pre-seeded subjects
Object.entries(PRESEEDED_VIDEOS_BY_SUBJECT).forEach(([sid, vids]) => {
  if (Array.isArray(vids) && vids.length > 0) {
    const enriched = vids.map(v => {
      const note = findMatchingNotePdf(v.subtopicId, v.title);
      return { ...v, notePdfUrl: v.notePdfUrl || note?.url || '', notePdfTitle: v.notePdfTitle || note?.title || '' };
    });
    loadedVideosBySubjectId.set(String(sid), enriched);
  }
});

// DOM Elements
const classListContainer = document.getElementById('class-list-container');
const subjectsCatalogView = document.getElementById('subjects-catalog-view');
const subjectDetailView = document.getElementById('subject-detail-view');
const subjectLecturesContainer = document.getElementById('subject-lectures-container');
const videosSearchInput = document.getElementById('videos-search-input');
const videosSearchClear = document.getElementById('videos-search-clear');
const lectureSearchInput = document.getElementById('subject-lecture-search');
const catFiltersBar = document.getElementById('vid-category-filters');
const topicFiltersBar = document.getElementById('subject-topic-filters');

const pdfModal = document.getElementById('pdf-modal');
const pdfModalTitle = document.getElementById('pdf-modal-title');
const pdfModalIframe = document.getElementById('pdf-modal-iframe');
const pdfModalDownloadBtn = document.getElementById('pdf-modal-download-btn');

const SUBJECT_SVG = {
  nursing: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 19V7M21 19v-4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4M3 14h18M6 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>',
  foundation: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 19V7M21 19v-4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4M3 14h18M6 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>',
  fon: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 19V7M21 19v-4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4M3 14h18M6 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>',
  child: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3a6 6 0 0 0-6 6c0 4 3 7 6 7s6-3 6-7a6 6 0 0 0-6-6zM9 9h.01M15 9h.01M10 12c.5.5 1.5.5 2 0M2 9a2 2 0 0 0 2 2M22 9a2 2 0 0 1-2 2M6 19a6 6 0 0 1 12 0"/>',
  pediatric: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3a6 6 0 0 0-6 6c0 4 3 7 6 7s6-3 6-7a6 6 0 0 0-6-6zM9 9h.01M15 9h.01M10 12c.5.5 1.5.5 2 0M2 9a2 2 0 0 0 2 2M22 9a2 2 0 0 1-2 2M6 19a6 6 0 0 1 12 0"/>',
  paediatric: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3a6 6 0 0 0-6 6c0 4 3 7 6 7s6-3 6-7a6 6 0 0 0-6-6zM9 9h.01M15 9h.01M10 12c.5.5 1.5.5 2 0M2 9a2 2 0 0 0 2 2M22 9a2 2 0 0 1-2 2M6 19a6 6 0 0 1 12 0"/>',
  midwifery: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zM12 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>',
  obg: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zM12 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>',
  obstetric: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zM12 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>',
  gynaec: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zM12 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>',
  community: '<path stroke-linecap="round" stroke-linejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  chn: '<path stroke-linecap="round" stroke-linejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  surgery: '<path stroke-linecap="round" stroke-linejoin="round" d="M14.5 4.5l5 5L7 22H2v-5L14.5 4.5zM13 6l5 5M6 18l2 2"/>',
  surgical: '<path stroke-linecap="round" stroke-linejoin="round" d="M14.5 4.5l5 5L7 22H2v-5L14.5 4.5zM13 6l5 5M6 18l2 2"/>',
  msn: '<path stroke-linecap="round" stroke-linejoin="round" d="M14.5 4.5l5 5L7 22H2v-5L14.5 4.5zM13 6l5 5M6 18l2 2"/>',
  medicine: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/>',
  pharmacology: '<path stroke-linecap="round" stroke-linejoin="round" d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path stroke-linecap="round" stroke-linejoin="round" d="m8.5 8.5 7 7"/>',
  pharma: '<path stroke-linecap="round" stroke-linejoin="round" d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path stroke-linecap="round" stroke-linejoin="round" d="m8.5 8.5 7 7"/>',
  anatomy: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 2v20M5 7l7 5 7-5M5 12l7 5 7-5M5 17l7 5 7-5"/>',
  physiology: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 2v20M5 7l7 5 7-5M5 12l7 5 7-5M5 17l7 5 7-5"/>',
  mental: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.5 2A4.5 4.5 0 0 0 5 6.5c0 1.34.58 2.54 1.5 3.37A4.5 4.5 0 0 0 4 14c0 1.77 1.02 3.3 2.5 4.04V20a2 2 0 0 0 2 2h2V2h-1zM14.5 2A4.5 4.5 0 0 1 19 6.5c0 1.34-.58 2.54-1.5 3.37A4.5 4.5 0 0 1 20 14c0 1.77-1.02 3.3-2.5 4.04V20a2 2 0 0 1-2 2h-2V2h1z"/>',
  psychiatr: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.5 2A4.5 4.5 0 0 0 5 6.5c0 1.34.58 2.54 1.5 3.37A4.5 4.5 0 0 0 4 14c0 1.77 1.02 3.3 2.5 4.04V20a2 2 0 0 0 2 2h2V2h-1zM14.5 2A4.5 4.5 0 0 1 19 6.5c0 1.34-.58 2.54-1.5 3.37A4.5 4.5 0 0 1 20 14c0 1.77-1.02 3.3-2.5 4.04V20a2 2 0 0 1-2 2h-2V2h1z"/>',
  microbiology: '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18h8M3 22h18M14 22a7 7 0 1 0-7-7M9 14l2-2M17 6l3 3-8 8-3-3 8-8zM19 4l1 1-1.5 1.5-1-1L19 4z"/>',
  pathology: '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18h8M3 22h18M14 22a7 7 0 1 0-7-7M9 14l2-2M17 6l3 3-8 8-3-3 8-8zM19 4l1 1-1.5 1.5-1-1L19 4z"/>',
  nutrition: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 2a5 5 0 0 0-5 5c0 4 5 10 5 10s5-6 5-10a5 5 0 0 0-5-5zM12 2v4"/>',
  biochem: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 2a5 5 0 0 0-5 5c0 4 5 10 5 10s5-6 5-10a5 5 0 0 0-5-5zM12 2v4"/>',
  research: '<path stroke-linecap="round" stroke-linejoin="round" d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM9 12h6M9 16h4"/>',
  management: '<path stroke-linecap="round" stroke-linejoin="round" d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM9 12h6M9 16h4"/>',
  timetable: '<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/>',
  default: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM12 8v8M8 12h8"/>'
};

function getSubjectSVG(title) {
  const l = String(title || '').toLowerCase();
  for (const [k, p] of Object.entries(SUBJECT_SVG)) {
    if (k !== 'default' && l.includes(k)) return p;
  }
  return SUBJECT_SVG.default;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getLectureNumber(title) {
  const m = String(title || '').match(/(?:Day|Lecture|Class|Part)\s*(\d+)/i);
  return m ? parseInt(m[1], 10) : 9999;
}

function findVideoUrl(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') {
    return (obj.startsWith('http') && (obj.includes('.mp4') || obj.includes('.m3u8') || obj.includes('stream'))) ? obj : '';
  }
  if (typeof obj === 'object') {
    for (const k of Object.keys(obj)) {
      const r = findVideoUrl(obj[k]);
      if (r) return r;
    }
  }
  return '';
}

function initHeaderAndSettings() {
  const label = document.getElementById('current-batch-label');
  const statBatch = document.getElementById('stat-batch-name');
  const batchBtn = document.getElementById('header-batch-btn');
  const dropdown = document.getElementById('header-batch-dropdown');

  if (label) label.textContent = activeBatch;
  if (statBatch) statBatch.textContent = activeBatch;

  if (dropdown) {
    dropdown.innerHTML = ALLOWED_SAPPHIRE_BATCHES.map(b =>
      `<button class="dropdown-item ${b === activeBatch ? 'active' : ''}" data-batch="${b}">${b}</button>`
    ).join('');
    dropdown.querySelectorAll('.dropdown-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        activeBatch = btn.getAttribute('data-batch') || 'Red Sapphire (Hinglish)';
        localStorage.setItem('nnl_active_batch', activeBatch);
        if (label) label.textContent = activeBatch;
        if (statBatch) statBatch.textContent = activeBatch;
        dropdown.classList.add('hide');
      });
    });
  }

  if (batchBtn && dropdown) {
    batchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (ALLOWED_SAPPHIRE_BATCHES.length > 1) dropdown.classList.toggle('hide');
    });
    document.addEventListener('click', () => dropdown.classList.add('hide'));
  }

  document.getElementById('tab-live')?.addEventListener('click', () => { window.location.href = '/'; });
  document.getElementById('tab-notes')?.addEventListener('click', () => { window.location.href = '/notes.html'; });
  document.getElementById('tab-tests')?.addEventListener('click', () => { window.location.href = '/tests.html'; });

  const refetchBtn = document.getElementById('videos-refetch-btn');
  if (refetchBtn) {
    refetchBtn.addEventListener('click', () => {
      refetchBtn.classList.add('spinning');
      const task = videoSectionMode === 'rb103'
        ? syncBatchLive(103, { force: true }).then(u => {
            batch103State = u;
            renderCurrentCatalog();
          })
        : (currentOpenSubject ? fetchSubjectVideosOnDemand(currentOpenSubject, true).then(vids => {
            currentOpenSubject.videos = vids;
            renderSubjectLecturesList();
          }) : Promise.resolve(renderCurrentCatalog()));
      Promise.resolve(task).finally(() => setTimeout(() => refetchBtn.classList.remove('spinning'), 600));
    });
  }

  // Student Profile & Settings Widget
  const phone = localStorage.getItem('nnl_phone') || (localStorage.getItem('nnl_access_token') ? 'Student' : 'Open Access');
  const phoneEl = document.getElementById('user-phone');
  const avatarEl = document.getElementById('user-avatar');
  if (phoneEl) phoneEl.textContent = phone;
  if (avatarEl) avatarEl.textContent = phone.slice(0, 1).toUpperCase();

  document.getElementById('logout-btn')?.addEventListener('click', () => {
    sessionStorage.setItem('nnl_explicit_logout', 'true');
    localStorage.removeItem('nnl_access_token');
    localStorage.removeItem('nnl_refresh_token');
    try { window.AndroidAuthBridge?.clearSession?.(); } catch {}
    window.location.replace('/');
  });

  const toggleBtn = document.getElementById('tweak-panel-toggle-btn');
  const tweaksWidget = document.querySelector('.cyber-tweaks-widget');
  if (toggleBtn && tweaksWidget) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      tweaksWidget.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!tweaksWidget.contains(e.target)) tweaksWidget.classList.remove('open');
    });
  }
}

function updateTopStats() {
  const rbVideos = (batch103State?.subjects || []).reduce((a, s) => a + (s.videos?.length || 0), 0);
  const rbActiveCount = (batch103State?.subjects || []).filter(s => (s.videos?.length || 0) > 0).length;

  const vidCountAll = document.getElementById('vid-count-all');
  const vidCountRb = document.getElementById('vid-count-rb103');
  const vidCountSaved = document.getElementById('vid-count-saved');
  if (vidCountAll) vidCountAll.textContent = ALL_VIDEOS_TOTALS.videos.toLocaleString();
  if (vidCountRb) vidCountRb.textContent = rbVideos;
  const savedLectures = getSavedLecturesList();
  if (vidCountSaved) vidCountSaved.textContent = savedLectures.length;

  const statSub = document.getElementById('stat-subjects');
  const statLec = document.getElementById('stat-lectures');
  if (videoSectionMode === 'offline') {
    const items = Array.from(offlineMapByRecId.values());
    if (statSub) statSub.textContent = items.length;
    if (statLec) statLec.textContent = items.filter(x => x.completed).length;
  } else if (videoSectionMode === 'saved') {
    if (statSub) statSub.textContent = savedLectures.length;
    if (statLec) statLec.textContent = savedLectures.length;
  } else if (videoSectionMode === 'rb103') {
    if (statSub) statSub.textContent = rbActiveCount;
    if (statLec) statLec.textContent = rbVideos;
  } else {
    if (statSub) statSub.textContent = ALL_VIDEOS_TOTALS.subjects;
    if (statLec) statLec.textContent = ALL_VIDEOS_TOTALS.videos.toLocaleString();
  }
}

function renderCategoryChips() {
  if (!catFiltersBar) return;
  // User explicitly requested to remove the category filter strip and show all subjects by default
  catFiltersBar.style.display = 'none';
}

function renderCurrentCatalog() {
  if (!classListContainer) return;
  updateTopStats();
  renderCategoryChips();

  const q = searchQuery.trim().toLowerCase();
  let list = [];

  if (videoSectionMode === 'offline') {
    const items = Array.from(offlineMapByRecId.values())
      .filter(it => !q || `${it.title} ${it.instructor} ${it.subject}`.toLowerCase().includes(q));
    if (items.length === 0) {
      classListContainer.innerHTML = `
        <div class="notes-empty-state" style="grid-column: 1 / -1;">
          <h3 class="notes-empty-title">No Downloaded Lectures Yet</h3>
          <p class="notes-empty-desc">Open any subject and tap Save on a lecture to watch offline without internet.</p>
        </div>
      `;
      return;
    }

    classListContainer.style.display = 'flex';
    classListContainer.style.flexDirection = 'column';
    classListContainer.style.gap = '0.75rem';
    classListContainer.innerHTML = items.map((it, idx) => {
      const mbTotal = it.totalSizeBytes > 0 ? `${(it.totalSizeBytes / (1024 * 1024)).toFixed(1)} MB` : '';
      const mbDone = it.bytesDownloaded > 0 ? `${(it.bytesDownloaded / (1024 * 1024)).toFixed(1)} MB` : '';
      const statusLabel = it.completed
        ? (it.expired ? 'Offline Expired' : `Saved Offline${mbTotal ? ` • ${mbTotal}` : ''}`)
        : (it.status === 'failed'
            ? `Failed${it.error ? `: ${it.error}` : ''}`
            : `Downloading ${it.percent || 0}%${mbTotal ? ` (${mbDone}/${mbTotal})` : ''}`);
      return `
        <div class="sd-lecture-card" data-off-idx="${idx}">
          <span class="sd-lecture-num">${String(idx + 1).padStart(2, '0')}</span>
          <div class="sd-lecture-details">
            <div class="sd-lecture-title">${escapeHtml(it.title)}</div>
            <div class="sd-lecture-meta">
              <span style="color:var(--accent);font-weight:700;">${escapeHtml(it.instructor || 'NNL Faculty')}</span>
              ${it.subject ? `<span>•</span><span>${escapeHtml(it.subject)}</span>` : ''}
              <span>•</span>
              <span style="color:${it.completed ? 'var(--success-ink)' : 'var(--accent)'};font-weight:700;">${escapeHtml(statusLabel)}</span>
            </div>
          </div>
          <div class="sd-lecture-actions">
            ${it.completed && !it.expired ? `
              <button class="sd-lecture-btn btn-play-offline" data-media-id="${escapeHtml(it.mediaId)}" data-title="${encodeURIComponent(it.title)}" data-inst="${encodeURIComponent(it.instructor || 'NNL Faculty')}">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <span>Play Offline</span>
              </button>
            ` : ''}
            <button class="sd-del-btn btn-del-offline" data-rec-id="${escapeHtml(it.recId)}" title="Remove Offline Copy">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    classListContainer.querySelectorAll('.btn-play-offline').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.AndroidVideoBridge.playOfflineVideo(
          btn.getAttribute('data-media-id'),
          decodeURIComponent(btn.getAttribute('data-title')),
          decodeURIComponent(btn.getAttribute('data-inst'))
        );
      });
    });
    classListContainer.querySelectorAll('.btn-del-offline').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteOfflineLecture(btn.getAttribute('data-rec-id'));
      });
    });
    return;
  }

  if (videoSectionMode === 'saved') {
    const items = getSavedLecturesList()
      .filter(it => !q || `${it.title} ${it.instructor} ${it.subject}`.toLowerCase().includes(q));
    if (items.length === 0) {
      classListContainer.innerHTML = `
        <div class="notes-empty-state" style="grid-column: 1 / -1;">
          <h3 class="notes-empty-title">No Saved Lectures Yet</h3>
          <p class="notes-empty-desc">Tap the Bookmark/Save button on any lecture to keep it here for quick access.</p>
        </div>
      `;
      return;
    }

    classListContainer.style.display = 'flex';
    classListContainer.style.flexDirection = 'column';
    classListContainer.style.gap = '0.75rem';
    classListContainer.innerHTML = items.map((it, idx) => {
      const progress = getLectureProgress(it.id);
      const watchPct = progress ? Math.min(100, Math.max(0, Math.round(progress.percent || 0))) : 0;
      const isCompleted = watchPct >= 90;
      const durClean = (it.duration || '').replace(/^⏱️\s*/, '').trim() || 'Recorded';
      const dateFormatted = formatLectureDate(it.date);
      const rowNum = String(idx + 1).padStart(2, '0');
      return `
        <div class="sd-lecture-card" data-saved-idx="${idx}">
          <span class="sd-lecture-num">${rowNum}</span>
          <div class="sd-lecture-thumb-wrap">
            ${it.thumb ? `<img src="${escapeHtml(it.thumb)}" class="sd-lecture-thumb" alt="" loading="lazy">` : `<div class="sd-lecture-thumb" style="display:flex;align-items:center;justify-content:center;color:#a78bfa;"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>`}
            <div class="sd-thumb-play-overlay">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
          <div class="sd-lecture-body">
            <div class="sd-lecture-topic-row">
              <span class="sd-lecture-topic-pill">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                <span>${escapeHtml(it.subject || 'Saved Lecture')}</span>
              </span>
              ${dateFormatted ? `<span class="sd-lecture-date">${escapeHtml(dateFormatted)}</span>` : ''}
            </div>
            <div class="sd-lecture-top-line">
              <span class="sd-lecture-title" title="${escapeHtml(it.title)}">${escapeHtml(it.title)}</span>
            </div>
            <div class="sd-lecture-sub-line">
              <div class="sd-lecture-progress-side">
                <div class="sd-lecture-progress-track">
                  <div class="sd-lecture-progress-fill ${isCompleted ? 'is-completed' : ''}" style="width: ${watchPct}%;"></div>
                </div>
                <span class="sd-lecture-progress-label">
                  ${watchPct > 0 ? `<span class="sd-pct-num">${watchPct}%</span> <span class="meta-dot">•</span> ` : ''}${escapeHtml(durClean)}
                </span>
              </div>
              <div class="sd-lecture-actions">
                <button class="sd-mini-pill is-saved btn-unsave-saved" data-rec-id="${escapeHtml(String(it.id))}" title="Remove from Saved">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2.2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  <span>Saved</span>
                </button>
                <button class="sd-mini-pill btn-play-saved" data-saved-idx="${idx}" style="background:var(--accent);color:#fff;border:none;">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  <span>Play</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    classListContainer.querySelectorAll('.btn-unsave-saved').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSavedLecture(btn.getAttribute('data-rec-id'));
        updateTopStats();
        renderCurrentCatalog();
      });
    });

    classListContainer.querySelectorAll('.btn-play-saved, .sd-lecture-card[data-saved-idx]').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.btn-unsave-saved')) return;
        const idx = parseInt(el.getAttribute('data-saved-idx'), 10);
        if (!isNaN(idx) && items[idx]) {
          openRecordingPlayer(items[idx]);
        }
      });
    });
    return;
  }

  classListContainer.style.display = '';
  classListContainer.style.flexDirection = '';
  classListContainer.style.gap = '';

  if (videoSectionMode === 'rb103') {
    list = (batch103State?.subjects || [])
      .filter(s => (s.videos?.length || 0) > 0)
      .map(s => ({
        id: String(s.id),
        title: s.title,
        faculty: s.faculty || 'NNL Faculty',
        category: 'Batch 103 Hinglish',
        videoCount: s.videos.length,
        isBatch103: true,
        videos: s.videos.map(v => ({ ...v, instructor: v.instructor || s.faculty || 'NNL Faculty' }))
      }));
  } else {
    list = ALL_VIDEO_SUBJECTS
      .filter(s => activeCategoryFilter === 'ALL' || s.category === activeCategoryFilter)
      .map(s => ({ ...s, isBatch103: false }));
  }

  if (q) {
    list = list.filter(s =>
      `${s.title} ${s.faculty} ${s.category}`.toLowerCase().includes(q)
    );
  }

  if (list.length === 0) {
    classListContainer.innerHTML = `
      <div class="notes-empty-state" style="grid-column: 1 / -1;">
        <h3 class="notes-empty-title">No Video Subjects Found</h3>
        <p class="notes-empty-desc">Try clearing the filter or searching another subject or teacher name.</p>
      </div>
    `;
    return;
  }

  classListContainer.innerHTML = list.map(sub => {
    const svg = getSubjectSVG(sub.title);
    const isHighlight = sub.id === '73' || sub.category === 'Core Subjects' || sub.isBatch103;
    return `
      <div class="subject-card ${isHighlight ? 'curated-highlight' : ''}" data-sub-id="${escapeHtml(sub.id)}" data-rb="${sub.isBatch103 ? '1' : '0'}">
        <div class="subject-card-top">
          <div class="subject-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">${svg}</svg>
          </div>
          <div class="subject-card-meta">
            <h3 class="subject-card-title">${escapeHtml(sub.title)}</h3>
            <div class="subject-card-badge">
              <span>${escapeHtml(sub.faculty)}</span>
            </div>
          </div>
        </div>
        <div class="subject-card-bottom">
          <span class="subject-card-count">${sub.videoCount} Video${sub.videoCount === 1 ? '' : 's'}</span>
          <span class="subject-card-arrow">
            <span>Watch</span>
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
          </span>
        </div>
      </div>
    `;
  }).join('');

  classListContainer.querySelectorAll('.subject-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-sub-id');
      const found = list.find(x => String(x.id) === String(id));
      if (found) openSubjectPage(found);
    });
  });
}

async function fetchPaginatedWithAutoAuth(path, meta = null) {
  const results = [];
  let url = path;
  let page = 1;
  while (url && page <= 20) {
    let res = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        res = await fetchWithAutoAuth(url);
        if (res && (res.ok || res.status === 401 || res.status === 403 || res.status === 404)) break;
      } catch {}
      if (attempt < 2) await new Promise(r => setTimeout(r, 450));
    }
    if (!res) {
      if (meta) meta.networkError = true;
      break;
    }
    if (!res.ok) {
      if (meta) {
        meta.lastStatus = res.status;
        if (res.status === 401 || res.status === 403) meta.authError = true;
        else if (res.status >= 500) meta.networkError = true;
      }
      break;
    }
    const json = await res.json().catch(() => null);
    if (!json) break;
    const d = json.data || json.results || [];
    if (Array.isArray(d)) results.push(...d);
    let nextUrl = json.next_page_link || json.next || null;
    if (!nextUrl && json.max_pages && page < json.max_pages) {
      const sep = path.includes('?') ? '&' : '?';
      nextUrl = `${path}${sep}page=${page + 1}`;
    }
    url = nextUrl;
    page++;
  }
  return results;
}

function extractVideosFromSubtopic(st, topicTitle, sub) {
  const candidates = Array.isArray(st.videos)
    ? st.videos
    : (st.videos && typeof st.videos === 'object'
        ? [st.videos]
        : (st.video && typeof st.video === 'object'
            ? [st.video]
            : ((st.video_cipher_id || st.video_url || st.vdo_cipher_id) ? [st] : [])));

  const items = [];
  candidates.forEach(vid => {
    if (!vid || typeof vid !== 'object') return;
    const vidId = vid.id || st.video_id || st.id;
    if (!vidId) return;
    const hrs = vid.duration ? Math.floor(vid.duration / 3600) : 0;
    const mins = vid.duration ? Math.floor((vid.duration % 3600) / 60) : 0;
    const durStr = hrs > 0 ? `${hrs}h ${mins}m` : (mins > 0 ? `${mins}m` : '');
    const title = (vid.title || st.title || 'Lecture Video').trim();
    const note = findMatchingNotePdf(st.id || vid.subtopic, title);
    items.push({
      id: vidId,
      subtopicId: st.id || vid.subtopic || null,
      title,
      topic: (topicTitle || sub.title).trim(),
      instructor: vid.faculty?.name || sub.faculty || 'NNL Faculty',
      duration: durStr,
      date: vid.schedule_start_time ? vid.schedule_start_time.split('T')[0] : (vid.publish_date ? vid.publish_date.split('T')[0] : (vid.created_at ? vid.created_at.split('T')[0] : (vid.date ? String(vid.date).split('T')[0] : ''))),
      video_cipher_id: vid.video_cipher_id || vid.vdo_cipher_id || vid.vdoCipherId || vid.cipher_id || '',
      videoUrl: vid.video_url || vid.videoUrl || vid.url || vid.download_url || findVideoUrl(vid) || '',
      thumbnails: vid.thumbnails || [],
      notePdfUrl: note?.url || '',
      notePdfTitle: note?.title || ''
    });
  });
  return items;
}

async function fetchSubjectVideosOnDemand(sub, force = false) {
  if (sub.isBatch103) return sub.videos || [];

  hydrateAndroidAuthSession();
  const sid = String(sub.id);
  sub.__lastLoadError = null;

  if (!force && loadedVideosBySubjectId.has(sid)) {
    return loadedVideosBySubjectId.get(sid);
  }

  if (!force) {
    try {
      const cached = localStorage.getItem(SUBJECT_VIDEO_CACHE_PREFIX + sid);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedVideosBySubjectId.set(sid, parsed);
          return parsed;
        }
      }
    } catch {}
  }

  const token = localStorage.getItem('nnl_access_token');
  if (!token) {
    sub.__lastLoadError = 'auth';
    return [];
  }

  const meta = { authError: false, networkError: false, lastStatus: 0 };
  let topics = await fetchPaginatedWithAutoAuth(`/cms/fe/videos/topic/?subject=${sid}&page_size=100`, meta);
  if (topics.length === 0 && !meta.authError) {
    topics = await fetchPaginatedWithAutoAuth(`/cms/fe/videos/topic/?subject=${sid}&plan_id=77&page_size=100`, meta);
  }
  if (topics.length === 0 && !meta.authError) {
    topics = await fetchPaginatedWithAutoAuth(`/cms/fe/videos/topic/?subject_id=${sid}&page_size=100`, meta);
  }

  if (topics.length === 0) {
    if (meta.authError) sub.__lastLoadError = 'auth';
    else if (meta.networkError) sub.__lastLoadError = `http_${meta.lastStatus || 'net'}`;
    return [];
  }

  const collected = [];
  const seenIds = new Set();

  // Throttled chunks of 3 topics so Android/Tablet connection never saturates
  const chunkSize = 3;
  for (let i = 0; i < topics.length; i += chunkSize) {
    const chunk = topics.slice(i, i + chunkSize);
    await Promise.allSettled(chunk.map(async top => {
      let subtopics = await fetchPaginatedWithAutoAuth(`/cms/fe/videos/subtopic/?topic=${top.id}&page_size=100`, meta);
      if (subtopics.length === 0 && !meta.authError) {
        subtopics = await fetchPaginatedWithAutoAuth(`/cms/fe/videos/subtopic/?topic_id=${top.id}&page_size=100`, meta);
      }
      subtopics.forEach(st => {
        const items = extractVideosFromSubtopic(st, top.title, sub);
        items.forEach(item => {
          const k = String(item.id) + '_' + String(item.subtopicId || '');
          if (!seenIds.has(k)) {
            seenIds.add(k);
            collected.push(item);
          }
        });
      });
    }));
  }

  collected.sort((a, b) => getLectureNumber(a.title) - getLectureNumber(b.title));

  if (collected.length > 0) {
    loadedVideosBySubjectId.set(sid, collected);
    try {
      localStorage.setItem(SUBJECT_VIDEO_CACHE_PREFIX + sid, JSON.stringify(collected));
    } catch {}
  } else if (meta.authError) {
    sub.__lastLoadError = 'auth';
  } else if (meta.networkError) {
    sub.__lastLoadError = `http_${meta.lastStatus || 'net'}`;
  }

  return collected;
}

async function openSubjectPage(subject) {
  currentOpenSubject = { ...subject, videos: subject.videos || [] };
  activeTopicFilter = 'ALL';
  lectureFilterQuery = '';
  if (lectureSearchInput) lectureSearchInput.value = '';

  subjectsCatalogView?.classList.add('hide');
  subjectDetailView?.classList.remove('hide');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Strictly hide Option Button inside detail views
  document.body.classList.add('apk-in-detail');
  const ham = document.getElementById('apk-hamburger-btn');
  if (ham) ham.style.setProperty('display', 'none', 'important');

  const cleanTitle = (subject.title || 'Videos').replace(/\s*\([^)]*\)\s*$/, '').trim() || subject.title;
  const titleEl = document.getElementById('subject-detail-title');
  const teacherEl = document.getElementById('subject-detail-teacher');
  const countEl = document.getElementById('subject-detail-count');

  if (titleEl) titleEl.textContent = cleanTitle;
  if (teacherEl) teacherEl.textContent = subject.faculty || 'NNL Faculty';
  if (countEl) countEl.textContent = `${subject.videoCount || 0} Videos`;

  // 0ms instant load from in-memory preseeded maps or cache
  let preloaded = loadedVideosBySubjectId.get(String(subject.id));
  if (!preloaded || preloaded.length === 0) {
    preloaded = loadedVideosBySubjectTitle.get(normalizeSubjTitle(subject.title));
  }
  if (!preloaded || preloaded.length === 0) {
    try {
      const cached = localStorage.getItem(SUBJECT_VIDEO_CACHE_PREFIX + subject.id);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) preloaded = parsed;
      }
    } catch {}
  }

  if (preloaded && preloaded.length > 0) {
    currentOpenSubject.videos = preloaded;
    if (countEl) countEl.textContent = `${preloaded.length} Videos`;
    renderSubjectLecturesList();
    return;
  }

  // If not preloaded, fetch on demand
  if (!localStorage.getItem('nnl_access_token')) {
    subjectLecturesContainer.innerHTML = `
      <div class="notes-empty-state">
        <h3 class="notes-empty-title">Sign In Required</h3>
        <p class="notes-empty-desc">Log in on the Live Classes home page with your registered mobile number to load and stream this subject's lectures.</p>
        <a href="/" class="btn-note-view" style="display:inline-flex;margin-top:0.85rem;text-decoration:none;">Go to Login</a>
      </div>
    `;
    if (topicFiltersBar) topicFiltersBar.style.display = 'none';
    return;
  }

  subjectLecturesContainer.innerHTML = `
    <div class="cp-loading" style="padding: 3.5rem 1.5rem; text-align: center;">
      <div class="spinner"></div>
      <p style="color:var(--text-secondary);margin-top:0.75rem;font-family:var(--font-display);font-size:0.75rem;letter-spacing:0.06em;text-transform:uppercase;">Loading ${escapeHtml(cleanTitle)} lectures...</p>
    </div>
  `;
  const fetched = await fetchSubjectVideosOnDemand(currentOpenSubject);
  currentOpenSubject.videos = fetched;
  if (countEl) countEl.textContent = `${currentOpenSubject.videos.length} Videos`;
  renderSubjectLecturesList();
}

function closeSubjectPage() {
  currentOpenSubject = null;
  activeTopicFilter = 'ALL';
  subjectDetailView?.classList.add('hide');
  subjectsCatalogView?.classList.remove('hide');

  // Restore Option Button outside detail views
  document.body.classList.remove('apk-in-detail');
  const ham = document.getElementById('apk-hamburger-btn');
  if (ham && !document.body.classList.contains('apk-side-open')) {
    ham.style.removeProperty('display');
  }
}

function formatLectureDate(d) {
  if (!d) return '';
  try {
    const s = String(d).split('T')[0];
    const p = s.split('-');
    if (p.length === 3) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const m = parseInt(p[1], 10) - 1;
      const day = parseInt(p[2], 10);
      if (m >= 0 && m < 12 && !isNaN(day)) return `${day} ${months[m]} ${p[0]}`;
    }
    return s;
  } catch {
    return String(d).split('T')[0];
  }
}

function renderSubjectLecturesList() {
  if (!subjectLecturesContainer || !currentOpenSubject) return;
  const videos = currentOpenSubject.videos || [];

  // Build topic pills
  const topics = [];
  const seenTopics = new Set();
  videos.forEach(v => {
    const t = (v.topic || 'Lectures').trim();
    if (!seenTopics.has(t)) {
      seenTopics.add(t);
      topics.push(t);
    }
  });

  if (topicFiltersBar) {
    if (topics.length > 1) {
      topicFiltersBar.style.display = 'flex';
      topicFiltersBar.innerHTML = `
        <button class="filter-chip vid-topic-chip ${activeTopicFilter === 'ALL' ? 'active' : ''}" data-topic="ALL" style="font-size:0.72rem;padding:0.32rem 0.72rem;">All Topics (${videos.length})</button>
        ${topics.map(t => {
          const cnt = videos.filter(x => (x.topic || 'Lectures').trim() === t).length;
          return `<button class="filter-chip vid-topic-chip ${activeTopicFilter === t ? 'active' : ''}" data-topic="${escapeHtml(t)}" style="font-size:0.72rem;padding:0.32rem 0.72rem;">${escapeHtml(t)} (${cnt})</button>`;
        }).join('')}
      `;
      topicFiltersBar.querySelectorAll('.vid-topic-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          activeTopicFilter = btn.getAttribute('data-topic') || 'ALL';
          renderSubjectLecturesList();
        });
      });
    } else {
      topicFiltersBar.style.display = 'none';
    }
  }

  const q = lectureFilterQuery.trim().toLowerCase();
  const filtered = videos.filter(v => {
    if (activeTopicFilter !== 'ALL' && (v.topic || 'Lectures').trim() !== activeTopicFilter) return false;
    if (q) {
      const hay = `${v.title} ${v.topic} ${v.instructor}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    const errType = currentOpenSubject.__lastLoadError;
    if (videos.length === 0 && errType === 'auth') {
      subjectLecturesContainer.innerHTML = `
        <div class="notes-empty-state">
          <h3 class="notes-empty-title">Session Expired</h3>
          <p class="notes-empty-desc">Your NNL login session expired or was signed in on another device. Sign in again to load ${escapeHtml(currentOpenSubject.title)} lectures.</p>
          <a href="/" class="btn-note-view" style="display:inline-flex;margin-top:0.85rem;text-decoration:none;">Sign In Again</a>
        </div>
      `;
      return;
    }
    if (videos.length === 0 && errType) {
      subjectLecturesContainer.innerHTML = `
        <div class="notes-empty-state">
          <h3 class="notes-empty-title">Could Not Load Lectures</h3>
          <p class="notes-empty-desc">Connection timed out or server returned an error (${escapeHtml(errType)}). Check your internet and tap Retry.</p>
          <button id="retry-subject-load-btn" class="btn-note-view" style="display:inline-flex;margin-top:0.85rem;cursor:pointer;">Retry Loading</button>
        </div>
      `;
      document.getElementById('retry-subject-load-btn')?.addEventListener('click', async () => {
        subjectLecturesContainer.innerHTML = `<div class="cp-loading" style="padding:3rem;text-align:center;"><div class="spinner"></div><p style="color:var(--text-secondary);margin-top:0.75rem;">Retrying...</p></div>`;
        currentOpenSubject.videos = await fetchSubjectVideosOnDemand(currentOpenSubject, true);
        renderSubjectLecturesList();
      });
      return;
    }
    subjectLecturesContainer.innerHTML = `
      <div class="notes-empty-state">
        <h3 class="notes-empty-title">No Lectures Found</h3>
        <p class="notes-empty-desc">Try selecting a different topic, clearing the search filter, or refreshing this subject.</p>
        <button id="retry-subject-load-btn" class="btn-note-view" style="display:inline-flex;margin-top:0.85rem;cursor:pointer;">Refresh Lectures</button>
      </div>
    `;
    document.getElementById('retry-subject-load-btn')?.addEventListener('click', async () => {
      subjectLecturesContainer.innerHTML = `<div class="cp-loading" style="padding:3rem;text-align:center;"><div class="spinner"></div><p style="color:var(--text-secondary);margin-top:0.75rem;">Refreshing...</p></div>`;
      currentOpenSubject.videos = await fetchSubjectVideosOnDemand(currentOpenSubject, true);
      renderSubjectLecturesList();
    });
    return;
  }

  subjectLecturesContainer.innerHTML = filtered.map((rec, idx) => {
    const rowNum = String(idx + 1).padStart(2, '0');
    const thumb = rec.thumbnails?.[0]?.url || rec.thumb || '';
    const offState = offlineMapByRecId.get(String(rec.id));
    const shadeIdx = getTopicShadeIndex(rec.topic);
    const dateFormatted = formatLectureDate(rec.date);
    const isSaved = isLectureSaved(rec.id) || Boolean(offState && offState.completed && !offState.expired);
    const isDownloading = offState && (offState.status === 'downloading' || offState.status === 'pending');

    // Accurate Watch Progress from lectureWatchService & native player
    const watchData = getLectureProgress(rec.id);
    const watchPct = watchData ? Math.min(100, Math.max(0, Math.round(watchData.percent || 0))) : 0;
    const isCompleted = watchPct >= 90;
    const durClean = (rec.duration || '').replace(/^⏱️\s*/, '').trim() || 'Recorded';

    const saveBtnHtml = `
      <button class="sd-mini-pill btn-save-lecture ${isSaved ? 'is-saved' : ''} ${isDownloading ? 'is-downloading' : ''}" data-rec-idx="${idx}" data-rec-id="${rec.id}" title="${isSaved ? 'Remove from Saved' : 'Save Lecture for Offline'}">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        <span>${isDownloading ? `${Math.round(offState.percent || 0)}%` : (isSaved ? 'Saved' : 'Save')}</span>
      </button>
    `;

    const pdfBtnHtml = rec.notePdfUrl ? `
      <button class="sd-mini-pill btn-open-lec-pdf" data-title="${encodeURIComponent(rec.notePdfTitle || rec.title)}" data-url="${encodeURIComponent(rec.notePdfUrl)}" title="View Class Notes PDF">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <span>PDF</span>
      </button>
    ` : '';

    return `
      <div class="sd-lecture-card topic-shade-${shadeIdx}" data-rec-idx="${idx}">
        <!-- 1. Serial Number -->
        <span class="sd-lecture-num">${rowNum}</span>

        <!-- 2. Video Thumbnail -->
        <div class="sd-lecture-thumb-wrap">
          ${thumb
            ? `<img src="${thumb}" class="sd-lecture-thumb" alt="" loading="lazy">`
            : `<div class="sd-lecture-thumb" style="display:flex;align-items:center;justify-content:center;color:#a78bfa;"><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>`}
          <div class="sd-thumb-play-overlay">
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>

        <!-- 3 & 4. Body: Row 1 Topic & Date, Row 2 Lecture Title, Row 3 Progress Bar, Duration, PDF & Save buttons -->
        <div class="sd-lecture-body">
          <div class="sd-lecture-topic-row">
            <span class="sd-lecture-topic-pill" title="${escapeHtml(rec.topic || currentOpenSubject?.title || 'Topic')}">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <span>${escapeHtml(rec.topic || currentOpenSubject?.title || 'General Topic')}</span>
            </span>
            ${dateFormatted ? `<span class="sd-lecture-date">${escapeHtml(dateFormatted)}</span>` : ''}
          </div>
          <div class="sd-lecture-top-line">
            <span class="sd-lecture-title" title="${escapeHtml(rec.title || 'Lecture Video')}">${escapeHtml(rec.title || 'Lecture Video')}</span>
          </div>
          <div class="sd-lecture-sub-line">
            <div class="sd-lecture-progress-side">
              <div class="sd-lecture-progress-track" title="${watchPct > 0 ? `${watchPct}% watched` : 'Not opened yet'}">
                <div class="sd-lecture-progress-fill ${isCompleted ? 'is-completed' : ''}" style="width: ${watchPct}%;"></div>
              </div>
              <span class="sd-lecture-progress-label">
                ${watchPct > 0 ? `<span class="sd-pct-num">${watchPct}%</span> <span class="meta-dot">•</span> ` : ''}${escapeHtml(durClean)}
              </span>
            </div>
            <div class="sd-lecture-actions">
              ${pdfBtnHtml}
              ${saveBtnHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  subjectLecturesContainer.querySelectorAll('.btn-open-lec-pdf').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openPdfModal(
        decodeURIComponent(btn.getAttribute('data-title')),
        decodeURIComponent(btn.getAttribute('data-url'))
      );
    });
  });

  subjectLecturesContainer.querySelectorAll('.btn-save-lecture').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-rec-idx'), 10);
      const rec = !isNaN(idx) ? filtered[idx] : null;
      if (!rec) return;
      const nowSaved = toggleSavedLecture(rec.id, {
        title: rec.title,
        instructor: rec.instructor,
        subject: currentOpenSubject?.title || currentOpenSubject?.name || '',
        thumb: rec.thumb || '',
        duration: rec.duration || '',
        notePdfUrl: rec.notePdfUrl || '',
        date: rec.date || ''
      });
      btn.classList.toggle('is-saved', nowSaved);
      const label = btn.querySelector('span');
      const svg = btn.querySelector('svg');
      if (svg) svg.setAttribute('fill', nowSaved ? 'currentColor' : 'none');

      // Seamless offline integration: saving also starts offline caching
      if (nowSaved && hasNativeOfflineBridge()) {
        if (label) label.textContent = '0%';
        btn.classList.add('is-downloading');
        const st = offlineMapByRecId.get(String(rec.id));
        if (!st || (!st.completed && st.status !== 'downloading')) {
          startOfflineLectureDownload(rec, btn);
        }
      } else if (!nowSaved && hasNativeOfflineBridge()) {
        if (label) label.textContent = 'Save';
        btn.classList.remove('is-downloading');
        deleteOfflineLecture(rec.id);
      } else {
        if (label) label.textContent = nowSaved ? 'Saved' : 'Save';
      }

      updateTopStats();
    });
  });

  subjectLecturesContainer.querySelectorAll('.sd-lecture-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-rec-idx'), 10);
      if (!isNaN(idx) && filtered[idx]) openRecordingPlayer(filtered[idx]);
    });
  });
}

function openPdfModal(title, url) {
  if (!url) return;

  // In-App Full-Screen Minimal PDF Modal
  if (!pdfModal) {
    window.open(url, '_blank');
    return;
  }
  if (pdfModalTitle) pdfModalTitle.textContent = title || 'Lecture Notes PDF';
  if (pdfModalDownloadBtn) pdfModalDownloadBtn.href = url;
  if (pdfModalIframe) pdfModalIframe.src = getPdfPreviewSrc(url);
  pdfModal.classList.remove('hide');
  document.body.style.overflow = 'hidden';
}

function closePdfModal() {
  if (!pdfModal) return;
  pdfModal.classList.add('hide');
  if (pdfModalIframe) pdfModalIframe.src = '';
  document.body.style.overflow = '';
}

// ── VdoCipher Video Player Engine ──
function initRecordingsViewer() {
  document.getElementById('close-recording-viewer')?.addEventListener('click', () => {
    const viewer = document.getElementById('recording-viewer');
    const videoEl = document.getElementById('recording-video');
    viewer?.classList.add('hide');
    if (videoEl) {
      videoEl.pause();
      videoEl.src = '';
      videoEl.classList.add('hide');
    }
    document.getElementById('recording-cipher-iframe')?.remove();
    document.getElementById('recording-cipher-loader')?.remove();
    document.getElementById('recording-portrait-notes')?.classList.add('hide');
  });
}

async function openRecordingPlayer(recording) {
  const recId = recording?.id || recording?.recId;
  const offState = offlineMapByRecId.get(String(recId));
  if (offState && offState.completed && !offState.expired && hasNativeOfflineBridge()) {
    window.AndroidVideoBridge.playOfflineVideo(
      offState.mediaId,
      recording.title || 'Offline Lecture',
      recording.instructor || 'NNL Faculty'
    );
    return;
  }

  const isBatch = Boolean(currentOpenSubject?.isBatch103);

  // If in native Android app, directly launch native player with zero flicker / web popup
  if (window.AndroidVideoBridge && typeof window.AndroidVideoBridge.playVideoWithAuth === 'function') {
    hydrateAndroidAuthSession();
    const tk = localStorage.getItem('nnl_access_token') || '';
    const pdfUrl = recording.notePdfUrl || '';
    const pdfTitle = recording.notePdfTitle || (recording.title ? `${recording.title} Notes` : 'Class Notes PDF');

    saveLectureProgress(recId, {
      title: recording.title,
      instructor: recording.instructor,
      subject: currentOpenSubject?.title || recording.subject || '',
      thumb: recording.thumb || recording.thumbnails?.[0]?.url || '',
      percent: Math.max(1, getLectureProgress(recId)?.percent || 1)
    });

    let currentOtp = recording.otp || '';
    let currentPb = recording.playbackInfo || '';

    if ((!currentOtp || !currentPb) && recId) {
      try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2200));
        const fetchPromise = fetchFreshVdoCipherOtp(recId, { isBatch103: isBatch }).catch(() =>
          fetchFreshVdoCipherOtp(recId, { isBatch103: !isBatch })
        );
        const fresh = await Promise.race([fetchPromise, timeoutPromise]);
        if (fresh && fresh.otp && fresh.playbackInfo) {
          currentOtp = fresh.otp;
          currentPb = fresh.playbackInfo;
          recording.otp = currentOtp;
          recording.playbackInfo = currentPb;
        }
      } catch (e) {
        console.warn('[Videos] Pre-fetch OTP race passed to native:', e);
      }
    }

    // Directly launch native player immediately (VdoPlayerActivity will stream natively with valid credentials)
    window.AndroidVideoBridge.playVideoWithAuth(
      currentOtp,
      currentPb,
      recording.title || 'Recorded Lecture',
      recording.instructor || 'NNL Faculty',
      String(recId || ''),
      tk,
      isBatch,
      pdfUrl,
      pdfTitle
    );
    return;
  }

  const viewer = document.getElementById('recording-viewer');
  const titleEl = document.getElementById('recording-viewer-title');
  const instructorEl = document.getElementById('recording-viewer-instructor');
  const videoEl = document.getElementById('recording-video');
  const noUrlEl = document.getElementById('recording-no-url');
  const retryBtn = document.getElementById('recording-retry-btn');

  if (!viewer) return;
  if (titleEl) titleEl.textContent = recording.title || 'Recorded Lecture';
  if (instructorEl) instructorEl.textContent = `Instructor: ${recording.instructor || 'Faculty'}`;

  // Configure Portrait Notes PDF Bar if available
  const portraitNotesEl = document.getElementById('recording-portrait-notes');
  const rpnTitle = document.getElementById('rpn-title');
  const rpnViewBtn = document.getElementById('rpn-view-btn');
  const rpnDlBtn = document.getElementById('rpn-download-btn');

  if (recording.notePdfUrl) {
    const pdfTitle = recording.notePdfTitle || (recording.title ? `${recording.title} Notes` : 'Class Notes PDF');
    if (rpnTitle) rpnTitle.textContent = pdfTitle;
    if (rpnDlBtn) {
      rpnDlBtn.href = recording.notePdfUrl;
      rpnDlBtn.setAttribute('download', `${pdfTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`);
    }
    if (rpnViewBtn) {
      rpnViewBtn.onclick = (e) => {
        e.preventDefault();
        openPdfModal(pdfTitle, recording.notePdfUrl);
      };
    }
    portraitNotesEl?.classList.remove('hide');
  } else {
    portraitNotesEl?.classList.add('hide');
  }

  viewer.classList.remove('hide');
  document.getElementById('recording-cipher-iframe')?.remove();
  document.getElementById('recording-cipher-loader')?.remove();
  if (videoEl) {
    videoEl.pause();
    videoEl.src = '';
    videoEl.classList.add('hide');
  }
  noUrlEl?.classList.add('hide');

  const bodyEl = document.querySelector('.recording-viewer-body');
  const loader = document.createElement('div');
  loader.id = 'recording-cipher-loader';
  loader.className = 'full-loader';
  loader.innerHTML = '<div class="spinner"></div><p style="margin-top:0.75rem;font-family:var(--font-sans, -apple-system, sans-serif);font-size:0.85rem;color:var(--text-secondary);font-weight:500;">Loading lecture...</p>';
  bodyEl.appendChild(loader);

  // Record initial watch progress entry
  saveLectureProgress(recId, {
    title: recording.title,
    instructor: recording.instructor,
    subject: currentOpenSubject?.title || recording.subject || '',
    thumb: recording.thumb || recording.thumbnails?.[0]?.url || '',
    percent: Math.max(1, getLectureProgress(recId)?.percent || 1)
  });

  const launchPlayback = async () => {
    try {
      let data = null;
      try {
        data = await fetchFreshVdoCipherOtp(recId, { isBatch103: isBatch });
      } catch (e1) {
        data = await fetchFreshVdoCipherOtp(recId, { isBatch103: !isBatch });
      }
      if (data && data.otp && data.playbackInfo) {
        loader.remove();
        const iframe = document.createElement('iframe');
        iframe.id = 'recording-cipher-iframe';
        iframe.src = `https://player.vdocipher.com/v2/?otp=${encodeURIComponent(data.otp)}&playbackInfo=${encodeURIComponent(data.playbackInfo)}`;
        iframe.style.cssText = 'border:none;width:100%;height:100%;border-radius:12px;';
        iframe.setAttribute('allow', 'encrypted-media *; autoplay *; fullscreen *; picture-in-picture *');
        iframe.setAttribute('allowfullscreen', 'true');
        bodyEl.appendChild(iframe);
        return;
      }
    } catch (err) {
      if (err && (err.status === 401 || err.status === 403) && noUrlEl) {
        loader.remove();
        const errDesc = document.getElementById('recording-error-desc');
        if (errDesc) errDesc.textContent = err.message || 'Session expired — please log in again on the home page.';
        noUrlEl.classList.remove('hide');
        return;
      }
    }

    loader.remove();
    if (recording.videoUrl && videoEl) {
      videoEl.src = recording.videoUrl;
      videoEl.classList.remove('hide');
      videoEl.load();
      videoEl.play().catch(() => {});
    } else if (noUrlEl) {
      const errDesc = document.getElementById('recording-error-desc');
      if (errDesc) {
        errDesc.textContent = localStorage.getItem('nnl_access_token')
          ? 'Could not retrieve VdoCipher stream token from NNL server. Please verify your session login.'
          : 'Please log in on the Live Classes home page first to stream lectures.';
      }
      noUrlEl.classList.remove('hide');
    }
  };

  if (retryBtn) {
    retryBtn.onclick = () => {
      noUrlEl?.classList.add('hide');
      bodyEl.appendChild(loader);
      launchPlayback();
    };
  }

  launchPlayback();
}

document.addEventListener('DOMContentLoaded', () => {
  initHeaderAndSettings();
  initRecordingsViewer();

  document.getElementById('btn-back-to-subjects')?.addEventListener('click', closeSubjectPage);
  document.getElementById('pdf-modal-close-btn')?.addEventListener('click', closePdfModal);
  pdfModal?.addEventListener('click', (e) => {
    if (e.target === pdfModal) closePdfModal();
  });

  document.getElementById('vid-tab-all')?.addEventListener('click', () => {
    videoSectionMode = 'all';
    document.getElementById('vid-tab-all')?.classList.add('active');
    document.getElementById('vid-tab-rb103')?.classList.remove('active');
    document.getElementById('vid-tab-saved')?.classList.remove('active');
    document.getElementById('vid-tab-offline')?.classList.remove('active');
    closeSubjectPage();
    renderCurrentCatalog();
  });

  document.getElementById('vid-tab-rb103')?.addEventListener('click', () => {
    videoSectionMode = 'rb103';
    document.getElementById('vid-tab-rb103')?.classList.add('active');
    document.getElementById('vid-tab-all')?.classList.remove('active');
    document.getElementById('vid-tab-saved')?.classList.remove('active');
    document.getElementById('vid-tab-offline')?.classList.remove('active');
    closeSubjectPage();
    renderCurrentCatalog();
  });

  window.__nnlSetVideoMode = (mode) => {
    videoSectionMode = mode;
    closeSubjectPage();
    renderCurrentCatalog();
  };

  document.getElementById('vid-tab-saved')?.addEventListener('click', () => {
    videoSectionMode = 'saved';
    document.getElementById('vid-tab-saved')?.classList.add('active');
    document.getElementById('vid-tab-all')?.classList.remove('active');
    document.getElementById('vid-tab-rb103')?.classList.remove('active');
    document.getElementById('vid-tab-offline')?.classList.remove('active');
    closeSubjectPage();
    renderCurrentCatalog();
  });

  document.getElementById('vid-tab-offline')?.addEventListener('click', async () => {
    videoSectionMode = 'offline';
    document.getElementById('vid-tab-offline')?.classList.add('active');
    document.getElementById('vid-tab-all')?.classList.remove('active');
    document.getElementById('vid-tab-rb103')?.classList.remove('active');
    document.getElementById('vid-tab-saved')?.classList.remove('active');
    closeSubjectPage();
    await refreshOfflineDownloads();
    renderCurrentCatalog();
  });

  window.addEventListener('nnl:watch-progress-updated', () => {
    if (currentOpenSubject) {
      renderSubjectLecturesList();
    } else if (videoSectionMode === 'saved') {
      renderCurrentCatalog();
    }
    updateTopStats();
  });

  const searchToggleBtn = document.getElementById('btn-toggle-video-search');
  const searchBox = document.getElementById('videos-search-box');
  searchToggleBtn?.addEventListener('click', () => {
    if (searchBox) {
      searchBox.classList.toggle('active');
    }
    videosSearchInput?.focus();
  });

  videosSearchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    if (videosSearchClear) videosSearchClear.style.display = searchQuery ? 'block' : 'none';
    renderCurrentCatalog();
  });

  videosSearchClear?.addEventListener('click', () => {
    searchQuery = '';
    if (videosSearchInput) videosSearchInput.value = '';
    videosSearchClear.style.display = 'none';
    renderCurrentCatalog();
  });

  lectureSearchInput?.addEventListener('input', (e) => {
    lectureFilterQuery = e.target.value;
    renderSubjectLecturesList();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (pdfModal && !pdfModal.classList.contains('hide')) closePdfModal();
      else if (currentOpenSubject) closeSubjectPage();
    }
  });

  const syncBatchId = getBatchIdFromName(activeBatch);
  batch103State = getBatchBaselineState(syncBatchId);
  if (window.location.hash === '#saved') {
    videoSectionMode = 'saved';
    document.getElementById('vid-tab-saved')?.classList.add('active');
    document.getElementById('vid-tab-all')?.classList.remove('active');
    document.getElementById('vid-tab-rb103')?.classList.remove('active');
    document.getElementById('vid-tab-offline')?.classList.remove('active');
  }
  renderCurrentCatalog();
  refreshOfflineDownloads();
  syncBatchLive(syncBatchId, {
    onUpdate: (u) => {
      batch103State = u;
      updateTopStats();
      if (videoSectionMode === 'rb103' && !currentOpenSubject) renderCurrentCatalog();
    }
  });

  // Auto-resume check if redirected from Home "Continue Watching"
  const autoPlayRecId = sessionStorage.getItem('nnl_auto_play_rec_id')
    || new URLSearchParams(window.location.search).get('autoPlay')
    || new URLSearchParams(window.location.search).get('play');
  if (autoPlayRecId) {
    sessionStorage.removeItem('nnl_auto_play_rec_id');
    const autoPlayItemRaw = sessionStorage.getItem('nnl_auto_play_item');
    let autoPlayItem = null;
    try {
      if (autoPlayItemRaw) autoPlayItem = JSON.parse(autoPlayItemRaw);
    } catch {}
    sessionStorage.removeItem('nnl_auto_play_item');

    const tryLaunch = (attempt = 0) => {
      let found = null;
      if (batch103State?.subjects) {
        for (const s of batch103State.subjects) {
          found = s.videos?.find(v => String(v.id) === String(autoPlayRecId));
          if (found) {
            currentOpenSubject = s;
            break;
          }
        }
      }
      if (!found && Array.isArray(ALL_VIDEO_SUBJECTS)) {
        for (const s of ALL_VIDEO_SUBJECTS) {
          const list = PRESEEDED_VIDEOS_BY_SUBJECT[s.id] || [];
          found = list.find(v => String(v.id) === String(autoPlayRecId));
          if (found) {
            currentOpenSubject = s;
            break;
          }
        }
      }
      if (!found) {
        const savedList = getSavedLecturesList();
        found = savedList.find(v => String(v.id) === String(autoPlayRecId));
      }
      if (!found && autoPlayItem) {
        found = autoPlayItem;
      }
      if (!found && attempt < 3) {
        setTimeout(() => tryLaunch(attempt + 1), 300);
        return;
      }
      if (found) {
        openRecordingPlayer(found);
      }
    };
    setTimeout(() => tryLaunch(0), 200);
  }

  window.__nnlSelectBatch = (chosen) => {
    activeBatch = chosen;
    try { localStorage.setItem('nnl_active_batch', activeBatch); } catch {}
    const lbl = document.getElementById('current-batch-label');
    if (lbl) lbl.textContent = activeBatch;
    const rbTabLabel = document.querySelector('#vid-tab-rb103 span:not(.section-mode-count)');
    if (rbTabLabel) {
      rbTabLabel.textContent = activeBatch === 'Red Sapphire (English)'
        ? 'Red Sapphire Eng'
        : activeBatch.replace(/\s*\(Hinglish\)$/i, '');
    }
    const bid = getBatchIdFromName(activeBatch);
    batch103State = getBatchBaselineState(bid);
    videoSectionMode = 'rb103';
    document.getElementById('vid-tab-rb103')?.classList.add('active');
    document.getElementById('vid-tab-all')?.classList.remove('active');
    document.getElementById('vid-tab-saved')?.classList.remove('active');
    document.getElementById('vid-tab-offline')?.classList.remove('active');
    if (currentOpenSubject) closeSubjectPage();
    renderCurrentCatalog();
    syncBatchLive(bid, {
      force: true,
      onUpdate: (u) => {
        batch103State = u;
        updateTopStats();
        if (videoSectionMode === 'rb103' && !currentOpenSubject) renderCurrentCatalog();
      }
    });
  };
});
