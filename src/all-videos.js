// Nightingale All Videos Library — Instant Subject + Teacher Catalog, Throttled On-Demand Topic Loading & Batch 103 Live Sync
import { MEDICINE_MASTER_NOTES } from './data/medicineNotes.js';
import { MASTER_NOTES_BY_SUBJECT } from './data/allSubjectsNotes.js';
import { ALL_VIDEO_SUBJECTS, PRESEEDED_VIDEOS_BY_SUBJECT, ALL_VIDEOS_TOTALS } from './data/allVideosCatalog.js';
import { getBatchBaselineState, syncBatchLive, fetchWithAutoAuth } from './utils/batch104Sync.js';
import { IS_HINGLISH_APK, getPdfPreviewSrc } from './config/appMode.js';

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
  ? ['Red Sapphire (Hinglish)']
  : ['Red Sapphire (Hinglish)', 'Blue Sapphire (Hinglish)'];

let activeBatch = IS_HINGLISH_APK
  ? 'Red Sapphire (Hinglish)'
  : localStorage.getItem('nnl_active_batch');
if (!activeBatch || !ALLOWED_SAPPHIRE_BATCHES.includes(activeBatch)) {
  activeBatch = 'Red Sapphire (Hinglish)';
  localStorage.setItem('nnl_active_batch', activeBatch);
}

// State
let videoSectionMode = 'all'; // 'all' (All Videos Subjects & Teachers) | 'rb103' (Batch 103 Hinglish Past Classes)
let activeCategoryFilter = 'ALL';
let searchQuery = '';
let lectureFilterQuery = '';
let activeTopicFilter = 'ALL';
let currentOpenSubject = null; // { id, title, faculty, category, videoCount, isBatch103, videos }
let batch103State = getBatchBaselineState(103);
const loadedVideosBySubjectId = new Map();

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
    localStorage.removeItem('nnl_access_token');
    localStorage.removeItem('nnl_refresh_token');
    window.location.href = '/';
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
  if (videoSectionMode === 'rb103') {
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

async function fetchPaginatedWithAutoAuth(path) {
  const results = [];
  let url = path;
  let page = 1;
  while (url && page <= 20) {
    const res = await fetchWithAutoAuth(url);
    if (!res || !res.ok) break;
    const json = await res.json();
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

async function fetchSubjectVideosOnDemand(sub, force = false) {
  if (sub.isBatch103) return sub.videos || [];

  const sid = String(sub.id);
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
  if (!token) return [];

  const topics = await fetchPaginatedWithAutoAuth(`/cms/fe/videos/topic/?subject=${sid}&page_size=100`);
  const collected = [];

  // Throttled chunks of 4 topics so Android/Tablet connection never saturates
  const chunkSize = 4;
  for (let i = 0; i < topics.length; i += chunkSize) {
    const chunk = topics.slice(i, i + chunkSize);
    await Promise.allSettled(chunk.map(async top => {
      const subtopics = await fetchPaginatedWithAutoAuth(`/cms/fe/videos/subtopic/?topic=${top.id}&page_size=100`);
      subtopics.forEach(st => {
        const vid = st.videos || st.video;
        if (!vid || typeof vid !== 'object') return;
        const hrs = vid.duration ? Math.floor(vid.duration / 3600) : 0;
        const mins = vid.duration ? Math.floor((vid.duration % 3600) / 60) : 0;
        const durStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
        const title = (vid.title || st.title || 'Lecture Video').trim();
        const note = findMatchingNotePdf(st.id || vid.subtopic, title);
        collected.push({
          id: vid.id,
          subtopicId: st.id || vid.subtopic || null,
          title,
          topic: (top.title || sub.title).trim(),
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
    }));
  }

  collected.sort((a, b) => getLectureNumber(a.title) - getLectureNumber(b.title));

  if (collected.length > 0) {
    loadedVideosBySubjectId.set(sid, collected);
    try {
      localStorage.setItem(SUBJECT_VIDEO_CACHE_PREFIX + sid, JSON.stringify(collected));
    } catch {}
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
    const fetched = await fetchSubjectVideosOnDemand(subject);
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
    subjectLecturesContainer.innerHTML = `
      <div class="notes-empty-state">
        <h3 class="notes-empty-title">No Lectures Found</h3>
        <p class="notes-empty-desc">Try selecting a different topic or clearing the search filter.</p>
      </div>
    `;
    return;
  }

  subjectLecturesContainer.innerHTML = filtered.map((rec, idx) => {
    const rowNum = String(idx + 1).padStart(2, '0');
    const thumb = rec.thumbnails?.[0]?.url || rec.thumb || '';
    return `
      <div class="sd-lecture-card" data-rec-idx="${idx}">
        <span class="sd-lecture-num">${rowNum}</span>
        ${thumb
          ? `<img src="${thumb}" class="sd-lecture-thumb" alt="" loading="lazy">`
          : `<div class="sd-lecture-thumb" style="display:flex;align-items:center;justify-content:center;color:#a78bfa;"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>`}
        <div class="sd-lecture-details">
          <div class="sd-lecture-title" title="${escapeHtml(rec.title)}">${escapeHtml(rec.title)}</div>
          <div class="sd-lecture-meta">
            <span style="color:#ddd6fe;font-weight:600;">${escapeHtml(rec.instructor || 'NNL Faculty')}</span>
            ${rec.topic ? `<span>•</span><span>${escapeHtml(rec.topic)}</span>` : ''}
            ${rec.duration ? `<span>•</span><span>${escapeHtml(rec.duration)}</span>` : ''}
            ${rec.date ? `<span>•</span><span>${escapeHtml(rec.date)}</span>` : ''}
          </div>
        </div>
        <div class="sd-lecture-actions">
          ${rec.notePdfUrl ? `
            <button class="sd-note-btn btn-open-lec-pdf" data-title="${encodeURIComponent(rec.notePdfTitle || rec.title)}" data-url="${encodeURIComponent(rec.notePdfUrl)}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span>Notes PDF</span>
            </button>
          ` : ''}
          <button class="sd-lecture-btn">
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            <span>Play</span>
          </button>
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

  const tryGetOtp = async (path) => {
    const res = await fetchWithAutoAuth(path);
    if (!res || !res.ok) {
      const txt = res ? await res.text().catch(() => '') : '';
      const err = new Error(`HTTP ${res?.status || 401}: ${txt.slice(0, 120)}`);
      err.status = res?.status || 401;
      throw err;
    }
    return res.json();
  };

  const recId = recording.id;
  const endpoints = currentOpenSubject?.isBatch103
    ? [
        `/batch_cms/videos/${recId}/generate_videocipher_otp/`,
        `/batch_cms/videos/${recId}/generate_videocipher_offline/`,
        `/cms/videos/${recId}/generate_videocipher_otp/`
      ]
    : [
        `/cms/videos/${recId}/generate_videocipher_otp/`,
        `/cms/videos/${recId}/generate_videocipher_offline/`,
        `/batch_cms/videos/${recId}/generate_videocipher_otp/`,
        `/cms/v2/live_classes_recordings/${recId}/generate_videocipher_otp/`,
        `/cms/question_bank/${recId}/generate_videocipher_otp/`
      ];

  const launchPlayback = async () => {
    for (const ep of endpoints) {
      try {
        const data = await tryGetOtp(ep);
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
      } catch {}
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
    closeSubjectPage();
    renderCurrentCatalog();
  });

  document.getElementById('vid-tab-rb103')?.addEventListener('click', () => {
    videoSectionMode = 'rb103';
    document.getElementById('vid-tab-rb103')?.classList.add('active');
    document.getElementById('vid-tab-all')?.classList.remove('active');
    closeSubjectPage();
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

  renderCurrentCatalog();
  syncBatchLive(103, {
    onUpdate: (u) => {
      batch103State = u;
      updateTopStats();
      if (videoSectionMode === 'rb103' && !currentOpenSubject) renderCurrentCatalog();
    }
  });
});
