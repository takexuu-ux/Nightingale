// Nightingale Categorized Practice Tests, Question Bank & Batch 104 CBT Controller
import { PRACTICE_TEST_SERIES, QBANK_SUBJECTS, TESTS_CATALOG_TOTALS } from './data/allTestsCatalog.js';
import { getBatch104BaselineState, syncBatch104Live, fetchWithAutoAuth } from './utils/batch104Sync.js';

const ALLOWED_SAPPHIRE_BATCHES = [
  'Red Sapphire (Hinglish)',
  'Red Sapphire (English)'
];

let activeBatch = localStorage.getItem('nnl_active_batch');
if (!activeBatch || !ALLOWED_SAPPHIRE_BATCHES.includes(activeBatch)) {
  activeBatch = (activeBatch && activeBatch.toUpperCase().includes('ENGLISH'))
    ? 'Red Sapphire (English)'
    : 'Red Sapphire (Hinglish)';
  localStorage.setItem('nnl_active_batch', activeBatch);
}

const urlParams = new URLSearchParams(window.location.search);
let currentSection = urlParams.get('section') === 'rb104'
  ? 'rb104'
  : (urlParams.get('section') === 'qbank' ? 'qbank' : 'series');

let currentOpenItem = null; // { kind: 'series' | 'qbank' | 'rb104', data }
let currentSubFilter = 'ALL';
let searchQuery = '';
let batch104State = getBatch104BaselineState();

// CBT Quiz Runner State
let quizQuestions = [];
let quizAnswers = {};
let currentQuestionIndex = 0;
let currentQuizMode = 'practice'; // 'practice' | 'exam' | 'review'
let quizTimeRemaining = 0;
let quizTimerInterval = null;
let currentTestConfig = null; // { id, title, duration, isBatchTest }

// DOM Refs
const testsGrid = document.getElementById('tests-grid');
const testsCatalogView = document.getElementById('tests-catalog-view');
const testsDetailView = document.getElementById('tests-detail-view');
const testsListContainer = document.getElementById('tests-list-container');
const btnBackTests = document.getElementById('btn-back-tests');
const testsSearchInput = document.getElementById('tests-search-input');
const testsSearchClear = document.getElementById('tests-search-clear');
const statCategoriesCount = document.getElementById('stat-categories-count');
const statTestsCount = document.getElementById('stat-tests-count');
const statBatchName = document.getElementById('stat-batch-name');
const testDetailTitle = document.getElementById('test-detail-title');
const testDetailCount = document.getElementById('test-detail-count');
const testDetailRightLabel = document.getElementById('test-detail-right-label');

// Custom Icons (Zero Default Emojis)
const CATEGORY_SVG = {
  pyq: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>',
  grand: '<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172"/>',
  image: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25z"/>',
  mini: '<polygon stroke-linecap="round" stroke-linejoin="round" points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  system: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>',
  special: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>',
  default: '<polyline stroke-linecap="round" stroke-linejoin="round" points="9 11 12 14 22 4"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>'
};

function getCategoryIconSvg(title) {
  const t = (title || '').toLowerCase();
  if (t.includes('previous') || t.includes('pyq')) return CATEGORY_SVG.pyq;
  if (t.includes('grand')) return CATEGORY_SVG.grand;
  if (t.includes('image')) return CATEGORY_SVG.image;
  if (t.includes('mini')) return CATEGORY_SVG.mini;
  if (t.includes('system')) return CATEGORY_SVG.system;
  if (t.includes('special') || t.includes('cet')) return CATEGORY_SVG.special;
  return CATEGORY_SVG.default;
}

function getCleanBatchName(batch) {
  if (!batch) return 'Red Sapphire (Hinglish)';
  return (batch.toUpperCase().includes('ENGLISH') || batch.toUpperCase().includes('(ENG)'))
    ? 'Red Sapphire (English)'
    : 'Red Sapphire (Hinglish)';
}

function showNotice(msg, title = 'Notice') {
  const modal = document.getElementById('custom-alert-modal');
  const tEl = document.getElementById('custom-alert-title');
  const mEl = document.getElementById('custom-alert-msg');
  if (!modal) {
    alert(`${title}: ${msg}`);
    return;
  }
  if (tEl) tEl.textContent = title;
  if (mEl) mEl.textContent = msg;
  modal.classList.remove('hide');
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function initHeaderAndDropdown() {
  const batchBtn = document.getElementById('header-batch-btn');
  const dropdown = document.getElementById('header-batch-dropdown');
  const label = document.getElementById('current-batch-label');

  if (label) label.textContent = getCleanBatchName(activeBatch);
  if (statBatchName) statBatchName.textContent = getCleanBatchName(activeBatch);

  if (dropdown) {
    dropdown.innerHTML = ALLOWED_SAPPHIRE_BATCHES.map(b => {
      const isActive = b === activeBatch;
      return `<button class="dropdown-item ${isActive ? 'active' : ''}" data-batch="${b}">${getCleanBatchName(b)}</button>`;
    }).join('');

    dropdown.querySelectorAll('.dropdown-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const selected = btn.getAttribute('data-batch');
        if (selected) {
          activeBatch = selected;
          localStorage.setItem('nnl_active_batch', activeBatch);
          if (label) label.textContent = getCleanBatchName(activeBatch);
          if (statBatchName) statBatchName.textContent = getCleanBatchName(activeBatch);
          dropdown.querySelectorAll('.dropdown-item').forEach(d => d.classList.toggle('active', d.getAttribute('data-batch') === activeBatch));
          dropdown.classList.add('hide');

          if (getCleanBatchName(activeBatch).includes('English')) {
            switchSection('rb104');
          }
        }
      });
    });
  }

  if (batchBtn && dropdown) {
    batchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hide');
    });
    document.addEventListener('click', () => dropdown.classList.add('hide'));
  }

  const tabLive = document.getElementById('tab-live');
  if (tabLive) tabLive.addEventListener('click', () => { window.location.href = '/'; });

  const tabNotes = document.getElementById('tab-notes');
  if (tabNotes) tabNotes.addEventListener('click', () => { window.location.href = '/notes.html'; });

  const refetchBtn = document.getElementById('tests-refetch-btn');
  if (refetchBtn) {
    refetchBtn.addEventListener('click', () => {
      refetchBtn.classList.add('spinning');
      triggerBatch104TestsSync(true).finally(() => {
        setTimeout(() => refetchBtn.classList.remove('spinning'), 600);
      });
    });
  }

  // Student Widget & Logout
  const phone = localStorage.getItem('nnl_phone') || (localStorage.getItem('nnl_access_token') ? 'Student' : 'Open Access');
  const phoneEl = document.getElementById('user-phone');
  const avatarEl = document.getElementById('user-avatar');
  if (phoneEl) phoneEl.textContent = phone;
  if (avatarEl) avatarEl.textContent = phone.slice(0, 1).toUpperCase();

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('nnl_access_token');
      localStorage.removeItem('nnl_refresh_token');
      window.location.href = '/';
    });
  }

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

function updateStats() {
  const rbTotals = batch104State?.totals || { subjects: 0, tests: 0 };
  const sBadge = document.getElementById('test-count-series');
  const qBadge = document.getElementById('test-count-qbank');
  const rBadge = document.getElementById('test-count-rb104');

  if (sBadge) sBadge.textContent = TESTS_CATALOG_TOTALS.plan77Tests;
  if (qBadge) qBadge.textContent = TESTS_CATALOG_TOTALS.qbankTests;
  if (rBadge) rBadge.textContent = `${rbTotals.tests} Tests`;

  if (currentSection === 'series') {
    if (statCategoriesCount) statCategoriesCount.textContent = PRACTICE_TEST_SERIES.length;
    if (statTestsCount) statTestsCount.textContent = TESTS_CATALOG_TOTALS.plan77Tests;
  } else if (currentSection === 'qbank') {
    if (statCategoriesCount) statCategoriesCount.textContent = QBANK_SUBJECTS.length;
    if (statTestsCount) statTestsCount.textContent = TESTS_CATALOG_TOTALS.qbankTests;
  } else {
    if (statCategoriesCount) statCategoriesCount.textContent = rbTotals.subjects;
    if (statTestsCount) statTestsCount.textContent = rbTotals.tests;
  }
}

function updateRb104StatusUi(syncResult) {
  const statusEl = document.getElementById('rb104-tests-sync-status');
  const summaryEl = document.getElementById('rb104-tests-summary');
  if (summaryEl && syncResult?.totals) {
    const t = syncResult.totals;
    summaryEl.textContent = `${t.completedSubjects} of ${t.subjects} subjects active • ${t.tests} Topic Tests & ${t.notes} Class Notes`;
  }
  if (!statusEl) return;

  const ts = syncResult?.lastSyncedAt
    ? new Date(syncResult.lastSyncedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : 'Cached';

  if (syncResult?.status === 'no-auth') {
    statusEl.textContent = `Verified Baseline (${ts}) • Sign in on Home to auto-sync`;
  } else if (syncResult?.status === 'synced') {
    const d = (syncResult.newTests || 0);
    statusEl.textContent = d > 0 ? `Synced ${ts} (+${d} new tests)` : `Live Synced • ${ts}`;
  } else {
    statusEl.textContent = `Auto-Sync • ${ts}`;
  }
}

async function triggerBatch104TestsSync(force = false) {
  const statusEl = document.getElementById('rb104-tests-sync-status');
  const btn = document.getElementById('rb104-tests-sync-btn');
  if (force && statusEl) statusEl.textContent = 'Syncing Batch 104 tests...';
  if (force && btn) btn.disabled = true;

  const res = await syncBatch104Live({
    force,
    onUpdate: (updated) => {
      batch104State = updated;
      updateStats();
      updateRb104StatusUi(updated);
      if (currentSection === 'rb104') {
        if (currentOpenItem?.kind === 'rb104') {
          const fresh = updated.subjects.find(s => String(s.id) === String(currentOpenItem.data.id));
          if (fresh) openDetailView('rb104', fresh);
        } else if (!currentOpenItem) {
          renderCatalogGrid();
        }
      }
    }
  });

  if (force && btn) btn.disabled = false;
  batch104State = res;
  updateStats();
  updateRb104StatusUi(res);
  return res;
}

function switchSection(mode) {
  currentSection = (mode === 'qbank' || mode === 'rb104') ? mode : 'series';

  document.getElementById('test-tab-series')?.classList.toggle('active', currentSection === 'series');
  document.getElementById('test-tab-qbank')?.classList.toggle('active', currentSection === 'qbank');
  document.getElementById('test-tab-rb104')?.classList.toggle('active', currentSection === 'rb104');
  document.getElementById('rb104-tests-status-bar')?.classList.toggle('hide', currentSection !== 'rb104');

  if (currentOpenItem) closeDetailView();
  updateStats();
  renderCatalogGrid();
}

function renderCatalogGrid() {
  if (!testsGrid) return;
  const query = searchQuery.trim().toLowerCase();

  // If user is actively searching from top catalog view, allow direct matching test search too!
  if (query.length >= 2) {
    renderGlobalSearchResults(query);
    return;
  }

  let items = [];
  if (currentSection === 'series') {
    items = PRACTICE_TEST_SERIES.map(s => ({
      kind: 'series',
      id: s.id,
      title: s.title,
      badge: s.badge,
      subtitle: s.subtitle,
      countLabel: `${s.count} Tests`,
      highlight: s.id === 'series-subject-wise' || s.id === 'series-pyq',
      raw: s
    }));
  } else if (currentSection === 'qbank') {
    items = QBANK_SUBJECTS.map(q => ({
      kind: 'qbank',
      id: q.id,
      title: q.title,
      badge: `${q.topicCount} Topics`,
      subtitle: 'Chapter-wise Question Bank MCQs with Explanations',
      countLabel: `${q.testCount} Tests`,
      highlight: q.testCount >= 40,
      raw: q
    }));
  } else {
    const sorted = [...(batch104State?.subjects || [])].sort((a, b) => {
      const aActive = (a.tests?.length || 0) + (a.notes?.length || 0) > 0;
      const bActive = (b.tests?.length || 0) + (b.notes?.length || 0) > 0;
      return (aActive === bActive) ? 0 : (bActive ? 1 : -1);
    });
    items = sorted.map(sub => {
      const tc = sub.tests?.length || 0;
      const nc = sub.notes?.length || 0;
      const active = tc > 0 || nc > 0 || (sub.videoCount || 0) > 0;
      return {
        kind: 'rb104',
        id: sub.id,
        title: sub.title,
        badge: `${sub.faculty || 'NNL Faculty'} • ${active ? 'Ongoing/Done' : 'Upcoming'}`,
        countLabel: active ? `${tc} Tests • ${nc} Notes` : `${sub.topicCount || 0} Planned Topics`,
        highlight: tc > 0,
        dim: !active,
        raw: sub
      };
    });
  }

  testsGrid.innerHTML = items.map(card => {
    const svg = getCategoryIconSvg(card.title);
    const borderCss = card.kind === 'rb104' && card.highlight
      ? 'border-color: rgba(244, 63, 94, 0.38);'
      : (card.dim ? 'opacity: 0.76;' : '');
    return `
      <div class="subject-card ${card.highlight ? 'curated-highlight' : ''}" data-kind="${card.kind}" data-id="${escapeHtml(card.id)}" style="${borderCss}">
        <div class="subject-card-top">
          <div class="subject-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">${svg}</svg>
          </div>
          <div class="subject-card-meta">
            <h3 class="subject-card-title">${escapeHtml(card.title)}</h3>
            <div class="subject-card-badge"><span>${escapeHtml(card.badge)}</span></div>
          </div>
        </div>
        <div class="subject-card-bottom">
          <span class="subject-card-count">${escapeHtml(card.countLabel)}</span>
          <span class="subject-card-arrow">
            <span>Explore</span>
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
          </span>
        </div>
      </div>
    `;
  }).join('');

  testsGrid.querySelectorAll('.subject-card').forEach(el => {
    el.addEventListener('click', () => {
      const kind = el.getAttribute('data-kind');
      const id = el.getAttribute('data-id');
      const found = items.find(i => i.kind === kind && String(i.id) === String(id));
      if (found) openDetailView(kind, found.raw);
    });
  });
}

function renderGlobalSearchResults(query) {
  const matches = [];
  if (currentSection === 'series') {
    PRACTICE_TEST_SERIES.forEach(s => {
      s.tests.forEach(t => {
        if (`${t.title} ${t.subjectGroup} ${s.title}`.toLowerCase().includes(query)) {
          matches.push({ ...t, groupLabel: s.title });
        }
      });
    });
  } else if (currentSection === 'qbank') {
    QBANK_SUBJECTS.forEach(s => {
      s.tests.forEach(t => {
        if (`${t.title} ${t.topic} ${s.title}`.toLowerCase().includes(query)) {
          matches.push({ ...t, groupLabel: `${s.title} • ${t.topic}` });
        }
      });
    });
  } else {
    (batch104State?.subjects || []).forEach(s => {
      (s.tests || []).forEach(t => {
        if (`${t.title} ${t.topic} ${s.title}`.toLowerCase().includes(query)) {
          matches.push({ ...t, groupLabel: `${s.title} • ${t.topic || 'Live Batch'}` });
        }
      });
    });
  }

  if (matches.length === 0) {
    testsGrid.innerHTML = `
      <div class="notes-empty-state" style="grid-column: 1 / -1;">
        <h3 class="notes-empty-title">No Tests Matched "${escapeHtml(searchQuery)}"</h3>
        <p class="notes-empty-desc">Try searching a different keyword, subject, or PYQ exam name.</p>
      </div>
    `;
    return;
  }

  testsGrid.innerHTML = `<div style="grid-column: 1 / -1; display:flex; flex-direction:column; gap:0.65rem;">
    ${matches.slice(0, 80).map(t => renderTestRowHtml(t, t.groupLabel)).join('')}
  </div>`;
  bindTestAttemptButtons(testsGrid);
}

function openDetailView(kind, item) {
  currentOpenItem = { kind, data: item };
  currentSubFilter = 'ALL';
  testsCatalogView.classList.add('hide');
  testsDetailView.classList.remove('hide');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (testDetailTitle) testDetailTitle.textContent = item.title || 'Practice Tests';

  let tests = [];
  let rightText = 'NNL Test Bank';
  let filterField = null;

  if (kind === 'series') {
    tests = item.tests || [];
    rightText = item.badge || 'Plan 77 Series';
    if (item.id === 'series-subject-wise') filterField = 'subjectGroup';
  } else if (kind === 'qbank') {
    tests = item.tests || [];
    rightText = `${item.topicCount || 0} Topics`;
    filterField = 'topic';
  } else {
    tests = item.tests || [];
    rightText = item.faculty || 'Batch 104 Faculty';
  }

  if (testDetailCount) testDetailCount.textContent = `${tests.length} Tests`;
  if (testDetailRightLabel) testDetailRightLabel.textContent = rightText;

  renderDetailTestsList(tests, filterField, item);
}

function closeDetailView() {
  currentOpenItem = null;
  currentSubFilter = 'ALL';
  testsDetailView.classList.add('hide');
  testsCatalogView.classList.remove('hide');
  renderCatalogGrid();
}

function renderDetailTestsList(tests, filterField, parentItem) {
  if (!testsListContainer) return;
  const query = searchQuery.trim().toLowerCase();

  const filterValues = [];
  if (filterField) {
    const seen = new Set();
    tests.forEach(t => {
      const v = (t[filterField] || 'General').trim();
      if (!seen.has(v)) {
        seen.add(v);
        filterValues.push(v);
      }
    });
  }

  const filterBarHtml = filterValues.length > 1 ? `
    <div style="display: flex; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 1.15rem; padding: 0.8rem 1rem; background: rgba(12, 15, 28, 0.65); border: 1px solid rgba(167, 139, 250, 0.16); border-radius: 14px;">
      <button class="filter-chip test-filter-pill ${currentSubFilter === 'ALL' ? 'active' : ''}" data-filter="ALL" style="font-size:0.72rem; padding:0.35rem 0.78rem;">All (${tests.length})</button>
      ${filterValues.map(v => {
        const cnt = tests.filter(x => (x[filterField] || 'General').trim() === v).length;
        return `<button class="filter-chip test-filter-pill ${currentSubFilter === v ? 'active' : ''}" data-filter="${escapeHtml(v)}" style="font-size:0.72rem; padding:0.35rem 0.78rem;">${escapeHtml(v)} (${cnt})</button>`;
      }).join('')}
    </div>
  ` : '';

  // Also show direct Class Notes shortcut banner for Batch 104 subjects that have notes
  const rbNotesHint = (currentOpenItem?.kind === 'rb104' && (parentItem.notes?.length || 0) > 0) ? `
    <div class="rb-section-header-bar" style="margin-bottom: 1rem;">
      <span style="font-size:0.82rem; color:#e2e8f0; font-weight:600;">${parentItem.notes.length} Class Notes PDFs available for ${escapeHtml(parentItem.title)}</span>
      <a href="/notes.html?section=rb104" class="rb-sync-btn" style="text-decoration:none;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <span>View Class Notes</span>
      </a>
    </div>
  ` : '';

  const filtered = tests.filter(t => {
    if (filterField && currentSubFilter !== 'ALL' && (t[filterField] || 'General').trim() !== currentSubFilter) return false;
    if (query) {
      const hay = `${t.title} ${t.topic || ''} ${t.subjectGroup || ''} ${t.level || ''}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    const emptyMsg = tests.length === 0 && currentOpenItem?.kind === 'rb104'
      ? 'No class tests uploaded yet for this subject in Red Sapphire (English). Auto-Sync checks automatically whenever new classes & next-day tests drop.'
      : 'No tests matched this filter or search query.';
    testsListContainer.innerHTML = rbNotesHint + filterBarHtml + `
      <div class="notes-empty-state">
        <h3 class="notes-empty-title">No Tests Available Yet</h3>
        <p class="notes-empty-desc">${emptyMsg}</p>
      </div>
    `;
  } else {
    testsListContainer.innerHTML = rbNotesHint + filterBarHtml + `
      <div style="display:flex; flex-direction:column; gap:0.65rem;">
        ${filtered.map(t => renderTestRowHtml(t, t.topic || t.subjectGroup || '')).join('')}
      </div>
    `;
  }

  testsListContainer.querySelectorAll('.test-filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      currentSubFilter = btn.getAttribute('data-filter') || 'ALL';
      renderDetailTestsList(tests, filterField, parentItem);
    });
  });

  bindTestAttemptButtons(testsListContainer);
}

function renderTestRowHtml(t, metaSubLabel) {
  const mins = Math.max(1, Math.round((t.duration || 1800) / 60));
  const isBatch = Boolean(t.isBatchTest || t.source === 'batch_cms');
  const qCount = t.totalQuestions || 0;
  return `
    <div class="note-doc-card">
      <div class="note-doc-info">
        <div class="note-doc-icon" style="${isBatch ? 'color:#fda4af; background:rgba(244,63,94,0.14); border-color:rgba(251,113,133,0.3);' : ''}">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
            <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
        </div>
        <div class="note-doc-details">
          <div class="note-doc-title" title="${escapeHtml(t.title)}">${escapeHtml(t.title)}</div>
          <div class="note-doc-badges">
            <span class="category-tag tag-highyield">${qCount > 0 ? `${qCount} Qs • ` : ''}${mins} mins</span>
            <span class="category-tag tag-handwritten">${escapeHtml(t.level || 'Medium')}</span>
            ${metaSubLabel ? `<span style="font-size:0.72rem; color:var(--text-muted);">${escapeHtml(metaSubLabel)}</span>` : ''}
            ${t.date ? `<span style="font-size:0.7rem; color:#94a3b8;">${escapeHtml(t.date)}</span>` : ''}
          </div>
        </div>
      </div>

      <div class="note-doc-actions">
        <button class="btn-note-view btn-launch-test"
          data-test-id="${escapeHtml(t.id)}"
          data-title="${encodeURIComponent(t.title)}"
          data-duration="${t.duration || 1800}"
          data-batch="${isBatch ? '1' : '0'}"
          data-mode="practice">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          <span>Practice</span>
        </button>
        <button class="btn-note-download btn-launch-test"
          data-test-id="${escapeHtml(t.id)}"
          data-title="${encodeURIComponent(t.title)}"
          data-duration="${t.duration || 1800}"
          data-batch="${isBatch ? '1' : '0'}"
          data-mode="exam">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/></svg>
          <span>Exam Mode</span>
        </button>
      </div>
    </div>
  `;
}

function bindTestAttemptButtons(container) {
  if (!container) return;
  container.querySelectorAll('.btn-launch-test').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const testId = btn.getAttribute('data-test-id');
      const title = decodeURIComponent(btn.getAttribute('data-title') || 'Practice Test');
      const duration = parseInt(btn.getAttribute('data-duration') || '1800', 10);
      const isBatchTest = btn.getAttribute('data-batch') === '1';
      const mode = btn.getAttribute('data-mode') || 'practice';
      loadAndStartTest({ id: testId, title, duration, isBatchTest, mode });
    });
  });
}

// Fetch ALL paginated questions cleanly for either batch_cms or cms tests
async function fetchTestQuestionsPaginated(testId, isBatchTest) {
  const primaryPrefix = isBatchTest ? '/batch_cms/test' : '/cms/test';
  const fallbackPrefix = isBatchTest ? '/cms/test' : '/batch_cms/test';

  async function tryEndpoint(prefix) {
    const questions = [];
    let url = `${prefix}/${testId}/questions/?page_size=100`;
    let page = 1;
    while (url && page <= 15) {
      const res = await fetchWithAutoAuth(url);
      if (!res || !res.ok) break;
      const d = await res.json();
      const arr = d.data || d.results || (Array.isArray(d) ? d : []);
      if (Array.isArray(arr) && arr.length > 0) questions.push(...arr);
      let nextUrl = d.next_page_link || d.next || null;
      if (!nextUrl && d.max_pages && page < d.max_pages) {
        nextUrl = `${prefix}/${testId}/questions/?page_size=100&page=${page + 1}`;
      }
      url = nextUrl;
      page++;
    }
    return questions;
  }

  let items = await tryEndpoint(primaryPrefix);
  if (items.length === 0) {
    items = await tryEndpoint(fallbackPrefix);
  }
  return items;
}

async function loadAndStartTest({ id, title, duration = 1800, isBatchTest = false, mode = 'practice' }) {
  const token = localStorage.getItem('nnl_access_token');
  if (!token) {
    showNotice('Please log in with your registered NNL mobile number on the Live Classes home page first to attempt practice tests.', 'SIGN IN REQUIRED');
    return;
  }

  const viewer = document.getElementById('quiz-viewer');
  const titleEl = document.getElementById('quiz-title');
  const metaEl = document.getElementById('quiz-meta');
  const badgeEl = document.getElementById('quiz-badge-type');

  currentTestConfig = { id, title, duration, isBatchTest };
  currentQuizMode = mode;
  quizAnswers = {};
  currentQuestionIndex = 0;

  if (titleEl) titleEl.textContent = title;
  if (badgeEl) {
    badgeEl.textContent = isBatchTest ? '// RED SAPPHIRE BATCH TEST' : '// CBT PRACTICE TEST';
  }
  if (metaEl) metaEl.textContent = 'Loading test questions...';

  viewer?.classList.remove('hide');
  document.getElementById('quiz-question-view')?.classList.remove('hide');
  document.getElementById('quiz-result-view')?.classList.add('hide');
  document.getElementById('question-text').innerHTML = '<div style="padding:2rem 0;color:#94a3b8;">Loading questions from NNL server...</div>';
  document.getElementById('quiz-options-list').innerHTML = '';

  try {
    quizQuestions = await fetchTestQuestionsPaginated(id, isBatchTest);
    if (!quizQuestions || quizQuestions.length === 0) {
      viewer?.classList.add('hide');
      showNotice('No questions returned for this test right now. Your account plan may not include this module or questions have not been uploaded yet.', 'NO QUESTIONS');
      return;
    }

    if (metaEl) {
      metaEl.textContent = `Total Questions: ${quizQuestions.length} • Standard Duration: ${Math.max(1, Math.round(duration / 60))} mins`;
    }

    updateQuizModeUi();
    renderQuestion();
    updateQuizNavigator();
    startOrStopTimer();
  } catch (err) {
    console.error('[Tests] Failed loading quiz:', err);
    viewer?.classList.add('hide');
    showNotice('Unable to fetch test questions. Please check your connection or re-login.', 'LOAD ERROR');
  }
}

function updateQuizModeUi() {
  const modeToggleBtn = document.getElementById('quiz-mode-toggle-btn');
  const modeLabelEl = document.getElementById('quiz-mode-label');
  const modeIconEl = document.getElementById('quiz-mode-icon');
  if (!modeToggleBtn) return;

  modeToggleBtn.classList.remove('exam-mode', 'review-mode');
  if (currentQuizMode === 'exam') {
    modeToggleBtn.classList.add('exam-mode');
    if (modeLabelEl) modeLabelEl.textContent = 'Exam Mode';
    if (modeIconEl) modeIconEl.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/></svg>';
  } else if (currentQuizMode === 'review') {
    modeToggleBtn.classList.add('review-mode');
    if (modeLabelEl) modeLabelEl.textContent = 'Review Mode';
    if (modeIconEl) modeIconEl.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>';
  } else {
    if (modeLabelEl) modeLabelEl.textContent = 'Practice Mode';
    if (modeIconEl) modeIconEl.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';
  }
}

function startOrStopTimer() {
  if (quizTimerInterval) clearInterval(quizTimerInterval);
  const timerEl = document.getElementById('quiz-timer');
  if (currentQuizMode === 'exam') {
    quizTimeRemaining = currentTestConfig?.duration || 1800;
    const tick = () => {
      if (timerEl) {
        const m = Math.floor(quizTimeRemaining / 60).toString().padStart(2, '0');
        const s = (quizTimeRemaining % 60).toString().padStart(2, '0');
        timerEl.textContent = `${m}:${s}`;
        timerEl.style.color = quizTimeRemaining < 60 ? '#f87171' : '#00f3d0';
      }
    };
    tick();
    quizTimerInterval = setInterval(() => {
      quizTimeRemaining--;
      tick();
      if (quizTimeRemaining <= 0) {
        clearInterval(quizTimerInterval);
        submitTest();
      }
    }, 1000);
  } else if (timerEl) {
    timerEl.textContent = currentQuizMode === 'review' ? 'REVIEW' : 'PRACTICE';
    timerEl.style.color = '#00f3d0';
  }
}

function renderQuestion() {
  const q = quizQuestions[currentQuestionIndex];
  if (!q) return;

  const numBadge = document.getElementById('question-number-badge');
  const lvlBadge = document.getElementById('question-level-badge');
  const textEl = document.getElementById('question-text');
  const explanationEl = document.getElementById('question-explanation');
  const explanationTextEl = document.getElementById('explanation-text');
  const explainBtn = document.getElementById('quiz-explain-btn');
  const optionsList = document.getElementById('quiz-options-list');

  if (numBadge) numBadge.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
  if (lvlBadge) lvlBadge.textContent = q.level_str || q.level || 'Medium';
  if (textEl) textEl.innerHTML = q.title || q.question || q.question_text || '';

  optionsList.innerHTML = '';
  explanationEl?.classList.add('hide');
  explainBtn?.classList.remove('active');

  const selectedId = quizAnswers[currentQuestionIndex];
  const hasAnswered = selectedId !== undefined;
  const showFeedback = (currentQuizMode === 'practice' && hasAnswered) || currentQuizMode === 'review';

  const markers = ['A', 'B', 'C', 'D', 'E', 'F'];
  const choices = q.choices || q.options || [];
  const correctChoice = choices.find(c => c.is_correct || c.isCorrect);

  choices.forEach((c, idx) => {
    const isSelected = selectedId === c.id;
    const isCorrect = Boolean(c.is_correct || c.isCorrect);
    const btn = document.createElement('button');

    let cls = 'quiz-option-btn';
    let tagHtml = '';
    let pctHtml = '';

    if (showFeedback) {
      if (isSelected && isCorrect) {
        cls += ' correct selected';
        tagHtml = '<span class="quiz-option-status-tag correct">Correct</span>';
      } else if (isSelected && !isCorrect) {
        cls += ' incorrect selected';
        tagHtml = '<span class="quiz-option-status-tag incorrect">Your Answer</span>';
      } else if (isCorrect) {
        cls += ' correct';
        tagHtml = '<span class="quiz-option-status-tag correct">Correct Answer</span>';
      }
      if (c.selection_percentage !== undefined && c.selection_percentage !== null) {
        pctHtml = `<span class="option-percent-pill">${(parseFloat(c.selection_percentage) || 0).toFixed(1)}% chose</span>`;
      }
    } else if (isSelected) {
      cls += ' selected';
    }

    btn.className = cls;
    btn.innerHTML = `
      <span class="option-marker">${markers[idx] || idx + 1}</span>
      <span class="option-title-text" style="flex:1;">${c.title || c.text || c.choice_text || ''}</span>
      ${tagHtml}
      ${pctHtml}
    `;

    btn.addEventListener('click', () => {
      if (currentQuizMode === 'review') return;
      quizAnswers[currentQuestionIndex] = c.id;
      if (currentQuizMode === 'practice') {
        renderQuestion();
        updateQuizNavigator();
      } else {
        optionsList.querySelectorAll('.quiz-option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        updateQuizNavigator();
      }
    });

    optionsList.appendChild(btn);
  });

  if (showFeedback) {
    const chosen = choices.find(c => c.id === selectedId);
    const expl = chosen?.correct_explanation || chosen?.incorrect_explanation || correctChoice?.correct_explanation || correctChoice?.explanation || q.correct_explanation || q.explanation || '';
    if (expl && explanationEl && explanationTextEl) {
      explanationTextEl.innerHTML = expl;
      explanationEl.classList.remove('hide');
      explainBtn?.classList.add('active');
    }
  }
}

function toggleExplanation() {
  if (currentQuizMode === 'exam') {
    currentQuizMode = 'practice';
    updateQuizModeUi();
    startOrStopTimer();
    renderQuestion();
    return;
  }
  const explanationEl = document.getElementById('question-explanation');
  const explanationTextEl = document.getElementById('explanation-text');
  const explainBtn = document.getElementById('quiz-explain-btn');
  if (!explanationEl) return;

  if (explanationEl.classList.contains('hide')) {
    const q = quizQuestions[currentQuestionIndex];
    const choices = q?.choices || q?.options || [];
    const correctChoice = choices.find(c => c.is_correct || c.isCorrect);
    const expl = correctChoice?.correct_explanation || correctChoice?.explanation || q?.correct_explanation || q?.explanation || '<p>No clinical explanation attached for this item.</p>';
    if (explanationTextEl) explanationTextEl.innerHTML = expl;
    explanationEl.classList.remove('hide');
    explainBtn?.classList.add('active');
  } else {
    explanationEl.classList.add('hide');
    explainBtn?.classList.remove('active');
  }
}

function updateQuizNavigator() {
  const grid = document.getElementById('quiz-navigator-grid');
  if (!grid) return;
  grid.innerHTML = quizQuestions.map((_, i) => {
    const isAnswered = quizAnswers[i] !== undefined;
    const isActive = i === currentQuestionIndex;
    return `<button class="nav-q-btn ${isAnswered ? 'answered' : ''} ${isActive ? 'active' : ''}" data-q-idx="${i}">${i + 1}</button>`;
  }).join('');

  grid.querySelectorAll('.nav-q-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentQuestionIndex = parseInt(btn.getAttribute('data-q-idx'), 10);
      renderQuestion();
      updateQuizNavigator();
    });
  });
}

function submitTest() {
  if (quizTimerInterval) clearInterval(quizTimerInterval);
  let correct = 0;
  let attempted = 0;

  quizQuestions.forEach((q, idx) => {
    const sel = quizAnswers[idx];
    if (sel !== undefined) {
      attempted++;
      const choices = q.choices || q.options || [];
      const chosen = choices.find(c => c.id === sel);
      if (chosen && (chosen.is_correct || chosen.isCorrect)) correct++;
    }
  });

  const total = quizQuestions.length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  document.getElementById('quiz-question-view')?.classList.add('hide');
  document.getElementById('quiz-result-view')?.classList.remove('hide');

  const pctEl = document.getElementById('result-percentage');
  const ratioEl = document.getElementById('result-ratio');
  const fbEl = document.getElementById('result-feedback');
  if (pctEl) pctEl.textContent = `${pct}%`;
  if (ratioEl) ratioEl.textContent = `${correct} / ${total} Correct (${attempted} Attempted)`;
  if (fbEl) {
    fbEl.textContent = pct >= 75
      ? 'Strong clinical command. Review rationales below to lock in high-yield facts.'
      : 'Good practice run. Use Review Mode to study explanations for every question.';
  }
}

function closeQuizViewer() {
  if (quizTimerInterval) clearInterval(quizTimerInterval);
  document.getElementById('quiz-viewer')?.classList.add('hide');
}

function initEventBindings() {
  document.getElementById('test-tab-series')?.addEventListener('click', () => switchSection('series'));
  document.getElementById('test-tab-qbank')?.addEventListener('click', () => switchSection('qbank'));
  document.getElementById('test-tab-rb104')?.addEventListener('click', () => switchSection('rb104'));
  document.getElementById('rb104-tests-sync-btn')?.addEventListener('click', () => triggerBatch104TestsSync(true));
  document.getElementById('custom-alert-ok-btn')?.addEventListener('click', () => {
    document.getElementById('custom-alert-modal')?.classList.add('hide');
  });

  if (btnBackTests) btnBackTests.addEventListener('click', closeDetailView);

  if (testsSearchInput) {
    testsSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (testsSearchClear) testsSearchClear.style.display = searchQuery ? 'block' : 'none';
      if (currentOpenItem) {
        openDetailView(currentOpenItem.kind, currentOpenItem.data);
      } else {
        renderCatalogGrid();
      }
    });
  }

  if (testsSearchClear) {
    testsSearchClear.addEventListener('click', () => {
      searchQuery = '';
      if (testsSearchInput) testsSearchInput.value = '';
      testsSearchClear.style.display = 'none';
      if (currentOpenItem) {
        openDetailView(currentOpenItem.kind, currentOpenItem.data);
      } else {
        renderCatalogGrid();
      }
    });
  }

  // Quiz Viewer Controls
  document.getElementById('quiz-top-close-btn')?.addEventListener('click', closeQuizViewer);
  document.getElementById('quiz-close-btn')?.addEventListener('click', closeQuizViewer);
  document.getElementById('quiz-prev-btn')?.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderQuestion();
      updateQuizNavigator();
    }
  });
  document.getElementById('quiz-next-btn')?.addEventListener('click', () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      currentQuestionIndex++;
      renderQuestion();
      updateQuizNavigator();
    }
  });
  document.getElementById('quiz-explain-btn')?.addEventListener('click', toggleExplanation);
  document.getElementById('quiz-show-ans-btn')?.addEventListener('click', toggleExplanation);
  document.getElementById('quiz-submit-btn')?.addEventListener('click', submitTest);
  document.getElementById('quiz-mode-toggle-btn')?.addEventListener('click', () => {
    currentQuizMode = currentQuizMode === 'exam' ? 'practice' : 'exam';
    updateQuizModeUi();
    startOrStopTimer();
    renderQuestion();
  });
  document.getElementById('quiz-review-btn')?.addEventListener('click', () => {
    currentQuizMode = 'review';
    currentQuestionIndex = 0;
    document.getElementById('quiz-result-view')?.classList.add('hide');
    document.getElementById('quiz-question-view')?.classList.remove('hide');
    updateQuizModeUi();
    startOrStopTimer();
    renderQuestion();
    updateQuizNavigator();
  });
  document.getElementById('quiz-restart-btn')?.addEventListener('click', () => {
    if (currentTestConfig) {
      loadAndStartTest({ ...currentTestConfig, mode: 'practice' });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const qv = document.getElementById('quiz-viewer');
      if (qv && !qv.classList.contains('hide')) {
        closeQuizViewer();
      } else if (currentOpenItem) {
        closeDetailView();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeaderAndDropdown();
  initEventBindings();
  switchSection(currentSection);
  updateRb104StatusUi(batch104State);
  triggerBatch104TestsSync(false);

  // Support deep link from Notes page ("Attempt Test")
  const batchTestId = urlParams.get('batchTest');
  const directTestId = urlParams.get('testId');
  if (batchTestId) {
    loadAndStartTest({
      id: batchTestId,
      title: urlParams.get('title') || 'Topic Assessment Test',
      duration: parseInt(urlParams.get('duration') || '1800', 10),
      isBatchTest: true,
      mode: 'practice'
    });
  } else if (directTestId) {
    loadAndStartTest({
      id: directTestId,
      title: urlParams.get('title') || 'Practice Test',
      duration: parseInt(urlParams.get('duration') || '1800', 10),
      isBatchTest: false,
      mode: 'practice'
    });
  }
});
