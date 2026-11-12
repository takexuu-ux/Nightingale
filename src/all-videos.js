// Nightingale All Videos Library — Instant Subject + Teacher Catalog, Throttled On-Demand Topic Loading & Batch 103 Live Sync
import { MEDICINE_MASTER_NOTES } from './data/medicineNotes.js';
import { MASTER_NOTES_BY_SUBJECT } from './data/allSubjectsNotes.js';
import { ALL_VIDEO_SUBJECTS, PRESEEDED_VIDEOS_BY_SUBJECT, ALL_VIDEOS_TOTALS } from './data/allVideosCatalog.js';
import { getBatchBaselineState, syncBatchLive, getBatchIdFromName, fetchWithAutoAuth, fetchFreshVdoCipherOtp, fetchOfflineVdoCipherOtp, hydrateAndroidAuthSession } from './utils/batch104Sync.js';
import { IS_HINGLISH_APK, getPdfPreviewSrc } from './config/appMode.js';

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

// State
let videoSectionMode = 'all'; // 'all' (All Videos Subjects & Teachers) | 'rb103' (Batch Hinglish/English Past Classes)
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
      offlinePollTimer = setInterval(() => refreshOfflineDownloads({ reRender: true }), 1100);
    } else if (!hasActive && offlinePollTimer) {
      clearInterval(offlinePollTimer);
      offlinePollTimer = null;
    }

    if (reRender) {
      if (currentOpenSubject) renderSubjectLecturesList();
      else if (videoSectionMode === 'offline') renderCurrentCatalog();
    }
  } catch {}
}

async function startOfflineLectureDownload(rec, btnEl) {
  if (!rec || !rec.id) return;
  const key = String(rec.id);
  if (offlinePendingReq.has(key)) return;
  offlinePendingReq.add(key);

  if (btnEl) {
    btnEl.disabled = true;
    btnEl.innerHTML = '<span>Preparing...</span>';
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
    await refreshOfflineDownloads({ reRender: true });
  } catch (err) {
    if (btnEl) {
      btnEl.disabled = false;
      btnEl.title = err.message;
      btnEl.innerHTML = '<span>Retry Save</span>';
    }
    alert(`Download error: ${err.message}`);
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
    await refreshOfflineDownloads({ reRender: true });
  } catch {}
}

// Pre-seed Medicine (73) immediately + populate matched notes PDFs
if (PRESEEDED_VIDEOS_BY_SUBJECT['73']) {
  const enriched = PRESEEDED_VIDEOS_BY_SUBJECT['73'].map(v => {
    const note = findMatchingNotePdf(v.subtopicId, v.title);
    return { ...v, notePdfUrl: note?.url || '', notePdfTitle: note?.title || '' };
  });
  loadedVideosBySubjectId.set('73', enriched);
}

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
  pharmacology: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3"/>',
  anatomy: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714"/>',
  medicine: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/>',
  pediatric: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"/>',
  midwifery: '<path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>',
  community: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125h5.25v-4.875h4.5V21H19.5V9.75"/>',
  default: '<polygon stroke-linecap="round" stroke-linejoin="round" points="5 3 19 12 5 21 5 3"/>'
};

function getSubjectSVG(title) {
  const l = String(title || '').toLowerCase();
  for (const [k, p] of Object.entries(SUBJECT_SVG)) {
    if (l.includes(k)) return p;
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
  if (vidCountAll) vidCountAll.textContent = ALL_VIDEOS_TOTALS.videos.toLocaleString();
  if (vidCountRb) vidCountRb.textContent = rbVideos;

  const statSub = document.getElementById('stat-subjects');
  const statLec = document.getElementById('stat-lectures');
  if (videoSectionMode === 'offline') {
    const items = Array.from(offlineMapByRecId.values());
    if (statSub) statSub.textContent = items.length;
    if (statLec) statLec.textContent = items.filter(x => x.completed).length;
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
  if (videoSectionMode !== 'all') {
    catFiltersBar.style.display = 'none';
    return;
  }
  catFiltersBar.style.display = 'flex';
  const cats = ['ALL', 'Core Subjects', 'Fastrack', 'T&D Series', 'Procedures & Non-Nursing', 'OTR Revision'];
  catFiltersBar.innerHTML = cats.map(c => {
    const cnt = c === 'ALL'
      ? ALL_VIDEO_SUBJECTS.length
      : ALL_VIDEO_SUBJECTS.filter(s => s.category === c).length;
    return `<button class="filter-chip vid-cat-chip ${activeCategoryFilter === c ? 'active' : ''}" data-cat="${escapeHtml(c)}">${c === 'ALL' ? 'All Subjects' : escapeHtml(c)} (${cnt})</button>`;
  }).join('');

  catFiltersBar.querySelectorAll('.vid-cat-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategoryFilter = btn.getAttribute('data-cat') || 'ALL';
      renderCategoryChips();
      renderCurrentCatalog();
    });
  });
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
      date: vid.schedule_start_time ? vid.schedule_start_time.split('T')[0] : '',
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

  const cleanTitle = (subject.title || 'Videos').replace(/\s*\([^)]*\)\s*$/, '').trim() || subject.title;
  const titleEl = document.getElementById('subject-detail-title');
  const teacherEl = document.getElementById('subject-detail-teacher');
  const countEl = document.getElementById('subject-detail-count');

  if (titleEl) titleEl.textContent = cleanTitle;
  if (teacherEl) teacherEl.textContent = subject.faculty || 'NNL Faculty';
  if (countEl) countEl.textContent = `${subject.videoCount || 0} Videos`;

  if (!subject.isBatch103 && !loadedVideosBySubjectId.has(String(subject.id))) {
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
  } else if (!subject.isBatch103) {
    currentOpenSubject.videos = loadedVideosBySubjectId.get(String(subject.id)) || [];
  }

  if (countEl) countEl.textContent = `${currentOpenSubject.videos.length} Videos`;
  renderSubjectLecturesList();
}

function closeSubjectPage() {
  currentOpenSubject = null;
  activeTopicFilter = 'ALL';
  subjectDetailView?.classList.add('hide');
  subjectsCatalogView?.classList.remove('hide');
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
    let dlBtnHtml = '';
    if (hasNativeOfflineBridge()) {
      if (offState && offState.completed && !offState.expired) {
        dlBtnHtml = `
          <button class="sd-dl-btn saved btn-dl-lecture" data-rec-idx="${idx}" title="Play Offline Copy">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Saved</span>
          </button>
          <button class="sd-del-btn btn-del-lecture" data-rec-id="${escapeHtml(String(rec.id))}" title="Delete Offline Copy">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        `;
      } else if (offState && (offState.status === 'downloading' || offState.status === 'pending')) {
        dlBtnHtml = `
          <button class="sd-dl-btn downloading btn-dl-lecture" data-rec-idx="${idx}" disabled>
            <span>${offState.percent || 0}%</span>
          </button>
          <button class="sd-del-btn btn-del-lecture" data-rec-id="${escapeHtml(String(rec.id))}" title="Cancel Download">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        `;
      } else {
        dlBtnHtml = `
          <button class="sd-dl-btn btn-dl-lecture" data-rec-idx="${idx}" title="Save Lecture for Offline Viewing">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>${offState && offState.status === 'failed' ? 'Retry Save' : 'Download'}</span>
          </button>
        `;
      }
    }
    return `
      <div class="sd-lecture-card" data-rec-idx="${idx}">
        <span class="sd-lecture-num">${rowNum}</span>
        ${thumb
          ? `<img src="${thumb}" class="sd-lecture-thumb" alt="" loading="lazy">`
          : `<div class="sd-lecture-thumb" style="display:flex;align-items:center;justify-content:center;color:#a78bfa;"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>`}
        <div class="sd-lecture-details">
          <div class="sd-lecture-title" title="${escapeHtml(rec.title)}">${escapeHtml(rec.title)}</div>
          <div class="sd-lecture-meta">
            <span style="color:var(--accent);font-weight:700;">${escapeHtml(rec.instructor || 'NNL Faculty')}</span>
            ${rec.topic ? `<span>•</span><span>${escapeHtml(rec.topic)}</span>` : ''}
            ${rec.duration ? `<span>•</span><span>${escapeHtml(rec.duration)}</span>` : ''}
            ${rec.date ? `<span>•</span><span>${escapeHtml(rec.date)}</span>` : ''}
            ${offState && (offState.status === 'downloading' || offState.status === 'pending') && offState.totalSizeBytes > 0 ? `<span>•</span><span>${(offState.bytesDownloaded / (1024 * 1024)).toFixed(1)}/${(offState.totalSizeBytes / (1024 * 1024)).toFixed(1)} MB</span>` : ''}
          </div>
        </div>
        <div class="sd-lecture-actions">
          ${rec.notePdfUrl ? `
            <button class="sd-note-btn btn-open-lec-pdf" data-title="${encodeURIComponent(rec.notePdfTitle || rec.title)}" data-url="${encodeURIComponent(rec.notePdfUrl)}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span>Notes PDF</span>
            </button>
          ` : ''}
          ${dlBtnHtml}
          <button class="sd-lecture-btn">
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            <span>Play</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  subjectLecturesContainer.querySelectorAll('.btn-dl-lecture').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-rec-idx'), 10);
      const rec = !isNaN(idx) ? filtered[idx] : null;
      if (!rec) return;
      const st = offlineMapByRecId.get(String(rec.id));
      if (st && st.completed && !st.expired && hasNativeOfflineBridge()) {
        window.AndroidVideoBridge.playOfflineVideo(st.mediaId, rec.title || 'Offline Lecture', rec.instructor || 'NNL Faculty');
        return;
      }
      startOfflineLectureDownload(rec, btn);
    });
  });

  subjectLecturesContainer.querySelectorAll('.btn-del-lecture').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteOfflineLecture(btn.getAttribute('data-rec-id'));
    });
  });

  subjectLecturesContainer.querySelectorAll('.btn-open-lec-pdf').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openPdfModal(
        decodeURIComponent(btn.getAttribute('data-title')),
        decodeURIComponent(btn.getAttribute('data-url'))
      );
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
  if (!pdfModal) return;
  if (pdfModalTitle) pdfModalTitle.textContent = title;
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
  });
}

function openRecordingPlayer(recording) {
  const offState = offlineMapByRecId.get(String(recording?.id));
  if (offState && offState.completed && !offState.expired && hasNativeOfflineBridge()) {
    window.AndroidVideoBridge.playOfflineVideo(
      offState.mediaId,
      recording.title || 'Offline Lecture',
      recording.instructor || 'NNL Faculty'
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
  loader.innerHTML = '<div class="spinner"></div><p style="margin-top:0.75rem;font-family:var(--font-display);font-size:0.8rem;letter-spacing:0.06em;text-transform:uppercase;color:#c4b5fd;">Securing Stream via VdoCipher...</p>';
  bodyEl.appendChild(loader);

  const recId = recording.id;
  const isBatch = Boolean(currentOpenSubject?.isBatch103);

  const launchPlayback = async () => {
    try {
      const data = await fetchFreshVdoCipherOtp(recId, { isBatch103: isBatch });
      if (data && data.otp && data.playbackInfo) {
        loader.remove();
        const tk = localStorage.getItem('nnl_access_token') || '';
        if (window.AndroidVideoBridge && typeof window.AndroidVideoBridge.playVideoWithAuth === 'function') {
          viewer.classList.add('hide');
          window.AndroidVideoBridge.playVideoWithAuth(
            data.otp,
            data.playbackInfo,
            recording.title || 'Recorded Lecture',
            recording.instructor || 'NNL Faculty',
            String(recId || ''),
            tk,
            isBatch
          );
          return;
        }
        if (window.AndroidVideoBridge && typeof window.AndroidVideoBridge.playVideo === 'function') {
          viewer.classList.add('hide');
          window.AndroidVideoBridge.playVideo(
            data.otp,
            data.playbackInfo,
            recording.title || 'Recorded Lecture',
            recording.instructor || 'NNL Faculty'
          );
          return;
        }
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
    document.getElementById('vid-tab-offline')?.classList.remove('active');
    closeSubjectPage();
    renderCurrentCatalog();
  });

  document.getElementById('vid-tab-rb103')?.addEventListener('click', () => {
    videoSectionMode = 'rb103';
    document.getElementById('vid-tab-rb103')?.classList.add('active');
    document.getElementById('vid-tab-all')?.classList.remove('active');
    document.getElementById('vid-tab-offline')?.classList.remove('active');
    closeSubjectPage();
    renderCurrentCatalog();
  });

  document.getElementById('vid-tab-offline')?.addEventListener('click', async () => {
    videoSectionMode = 'offline';
    document.getElementById('vid-tab-offline')?.classList.add('active');
    document.getElementById('vid-tab-all')?.classList.remove('active');
    document.getElementById('vid-tab-rb103')?.classList.remove('active');
    closeSubjectPage();
    await refreshOfflineDownloads();
    renderCurrentCatalog();
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
  renderCurrentCatalog();
  refreshOfflineDownloads();
  syncBatchLive(syncBatchId, {
    onUpdate: (u) => {
      batch103State = u;
      updateTopStats();
      if (videoSectionMode === 'rb103' && !currentOpenSubject) renderCurrentCatalog();
    }
  });

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
