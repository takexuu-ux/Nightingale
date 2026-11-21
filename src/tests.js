// Nightingale Categorized Practice Tests, Question Bank & Batch 104 CBT Controller
import './apk/apk-shell.js';
import { getSubjectIllustration } from './data/subjectIllustrations.js';
import { PRACTICE_TEST_SERIES, QBANK_SUBJECTS, TESTS_CATALOG_TOTALS } from './data/allTestsCatalog.js';
import { getBatchBaselineState, syncBatchLive, getBatchIdFromName, fetchWithAutoAuth, hydrateAndroidAuthSession } from './utils/batch104Sync.js';
import { IS_HINGLISH_APK, getPdfPreviewSrc } from './config/appMode.js';
import { getClinicalFallbackQuestions } from './data/clinicalQuestionsBank.js';

hydrateAndroidAuthSession();

const ALLOWED_SAPPHIRE_BATCHES = IS_HINGLISH_APK
  ? ['Red Sapphire (Hinglish)', 'Blue Sapphire (Hinglish)', 'Red Sapphire (English)', 'Fast Track']
  : ['Red Sapphire (Hinglish)', 'Red Sapphire (English)'];

let activeBatch = localStorage.getItem('nnl_active_batch');
if (!activeBatch || !ALLOWED_SAPPHIRE_BATCHES.includes(activeBatch)) {
  if (activeBatch && activeBatch.toUpperCase().includes('ENGLISH')) {
    activeBatch = 'Red Sapphire (English)';
  } else if (activeBatch && activeBatch.toUpperCase().includes('BLUE')) {
    activeBatch = 'Blue Sapphire (Hinglish)';
  } else if (activeBatch && activeBatch.toUpperCase().includes('FAST')) {
    activeBatch = 'Fast Track';
  } else {
    activeBatch = 'Red Sapphire (Hinglish)';
  }
  localStorage.setItem('nnl_active_batch', activeBatch);
}

const urlParams = new URLSearchParams(window.location.search);
let currentSection = urlParams.get('section') || 'rb104';

let currentOpenItem = null; // { kind: 'series' | 'qbank' | 'rb104', data }
let currentSubFilter = 'ALL';
let searchQuery = '';
let activeRbBatchId = Number(urlParams.get('batch')) === 104
  ? 104
  : (Number(urlParams.get('batch')) === 103 ? 103 : getBatchIdFromName(activeBatch));
let batch104State = getBatchBaselineState(activeRbBatchId);

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

// Medical Subject & Category SVG Icons (Clinically accurate iconography)
const CATEGORY_SVG = {
  medicine: '<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 3.75v3a5.25 5.25 0 0 0 10.5 0v-3M9.75 12v3.75a3.75 3.75 0 0 0 7.5 0v-1.5m0 0a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5zM3.5 3.75h2M14 3.75h2"/>',
  nursing: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 4c-3.5 0-6 2.5-6 6v3h12v-3c0-3.5-2.5-6-6-6zM8 17h8M9 20h6M12 2v2"/>',
  foundation: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 4c-3.5 0-6 2.5-6 6v3h12v-3c0-3.5-2.5-6-6-6zM8 17h8M9 20h6M12 2v2"/>',
  fon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 4c-3.5 0-6 2.5-6 6v3h12v-3c0-3.5-2.5-6-6-6zM8 17h8M9 20h6M12 2v2"/>',
  anatomy: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>',
  physiology: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>',
  pharma: '<path stroke-linecap="round" stroke-linejoin="round" d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7ZM8.5 8.5l7 7"/>',
  pharmacology: '<path stroke-linecap="round" stroke-linejoin="round" d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7ZM8.5 8.5l7 7"/>',
  pediatric: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 2a4 4 0 0 1 4 4c0 1.6-.9 3-2.3 3.6A5 5 0 0 1 18 14v4a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-4a5 5 0 0 1 4.3-4.4A4 4 0 0 1 12 2zM9 14v2M15 14v2"/>',
  child: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 2a4 4 0 0 1 4 4c0 1.6-.9 3-2.3 3.6A5 5 0 0 1 18 14v4a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-4a5 5 0 0 1 4.3-4.4A4 4 0 0 1 12 2zM9 14v2M15 14v2"/>',
  obg: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zM12 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>',
  midwifery: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zM12 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>',
  surgery: '<path stroke-linecap="round" stroke-linejoin="round" d="M14.5 4.5l5 5L7 22H2v-5L14.5 4.5zM13 6l5 5M6 18l2 2"/>',
  surgical: '<path stroke-linecap="round" stroke-linejoin="round" d="M14.5 4.5l5 5L7 22H2v-5L14.5 4.5zM13 6l5 5M6 18l2 2"/>',
  msn: '<path stroke-linecap="round" stroke-linejoin="round" d="M14.5 4.5l5 5L7 22H2v-5L14.5 4.5zM13 6l5 5M6 18l2 2"/>',
  community: '<path stroke-linecap="round" stroke-linejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  chn: '<path stroke-linecap="round" stroke-linejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  microbiology: '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18h8M3 22h18M14 22a7 7 0 1 0-7-7M9 14l2-2M17 6l3 3-8 8-3-3 8-8zM19 4l1 1-1.5 1.5-1-1L19 4z"/>',
  pathology: '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18h8M3 22h18M14 22a7 7 0 1 0-7-7M9 14l2-2M17 6l3 3-8 8-3-3 8-8zM19 4l1 1-1.5 1.5-1-1L19 4z"/>',
  biochem: '<path stroke-linecap="round" stroke-linejoin="round" d="M10 2v5.5a4.5 4.5 0 0 0-1.5 3.4V19a3 3 0 0 0 3 3h1a3 3 0 0 0 3-3v-8.1a4.5 4.5 0 0 0-1.5-3.4V2h-4zM8 14h8"/>',
  nutrition: '<path stroke-linecap="round" stroke-linejoin="round" d="M10 2v5.5a4.5 4.5 0 0 0-1.5 3.4V19a3 3 0 0 0 3 3h1a3 3 0 0 0 3-3v-8.1a4.5 4.5 0 0 0-1.5-3.4V2h-4zM8 14h8"/>',
  mental: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.5 2A4.5 4.5 0 0 0 5 6.5c0 1.34.58 2.54 1.5 3.37A4.5 4.5 0 0 0 4 14c0 1.77 1.02 3.3 2.5 4.04V20a2 2 0 0 0 2 2h2V2h-1zM14.5 2A4.5 4.5 0 0 1 19 6.5c0 1.34-.58 2.54-1.5 3.37A4.5 4.5 0 0 1 20 14c0 1.77-1.02 3.3-2.5 4.04V20a2 2 0 0 1-2 2h-2V2h1z"/>',
  psychiatr: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.5 2A4.5 4.5 0 0 0 5 6.5c0 1.34.58 2.54 1.5 3.37A4.5 4.5 0 0 0 4 14c0 1.77 1.02 3.3 2.5 4.04V20a2 2 0 0 0 2 2h2V2h-1zM14.5 2A4.5 4.5 0 0 1 19 6.5c0 1.34-.58 2.54-1.5 3.37A4.5 4.5 0 0 1 20 14c0 1.77-1.02 3.3-2.5 4.04V20a2 2 0 0 1-2 2h-2V2h1z"/>',
  pyq: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>',
  grand: '<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172"/>',
  image: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25z"/>',
  mini: '<polygon stroke-linecap="round" stroke-linejoin="round" points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  system: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>',
  special: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>',
  default: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM12 8v8M8 12h8"/>'
};

function getCategoryIconSvg(title) {
  const t = (title || '').toLowerCase();
  for (const [key, svg] of Object.entries(CATEGORY_SVG)) {
    if (key !== 'default' && t.includes(key)) return svg;
  }
  return CATEGORY_SVG.default;
}

function getCleanBatchName(batch) {
  if (!batch) return 'Red Sapphire (Hinglish)';
  const u = String(batch).toUpperCase();
  if (u.includes('BLUE')) return 'Blue Sapphire (Hinglish)';
  if (u.includes('FAST')) return 'Fast Track';
  if (u.includes('ENGLISH') || u.includes('(ENG)')) return 'Red Sapphire (English)';
  return 'Red Sapphire (Hinglish)';
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

          setRbBatchId(getBatchIdFromName(activeBatch), true);
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

  const tabVideos = document.getElementById('tab-videos');
  if (tabVideos) tabVideos.addEventListener('click', () => { window.location.href = '/all-videos.html'; });

  const tabNotes = document.getElementById('tab-notes');
  if (tabNotes) tabNotes.addEventListener('click', () => { window.location.href = '/notes.html'; });

  if (IS_HINGLISH_APK) {
    const rb104Btn = document.getElementById('rb-tests-lang-104');
    if (rb104Btn && rb104Btn.parentElement) rb104Btn.parentElement.style.display = 'none';
  }

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
      sessionStorage.setItem('nnl_explicit_logout', 'true');
      localStorage.removeItem('nnl_access_token');
      localStorage.removeItem('nnl_refresh_token');
      try { window.AndroidAuthBridge?.clearSession?.(); } catch {}
      window.location.replace('/');
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

function updateRbToggleUi() {
  const badge = document.getElementById('rb-tests-active-badge');
  const b103 = document.getElementById('rb-tests-lang-103');
  const b104 = document.getElementById('rb-tests-lang-104');
  const isEng = activeRbBatchId === 104;
  if (badge) badge.textContent = isEng ? 'Batch 104 • English' : 'Batch 103 • Hinglish';
  if (b103) {
    b103.style.background = !isEng ? 'linear-gradient(135deg, #5B3EA8 0%, #7C5CE0 100%)' : 'transparent';
    b103.style.color = !isEng ? '#FFFFFF' : 'var(--text-secondary)';
    b103.style.borderColor = !isEng ? 'transparent' : 'var(--border-hairline)';
  }
  if (b104) {
    b104.style.background = isEng ? 'linear-gradient(135deg, #5B3EA8 0%, #7C5CE0 100%)' : 'transparent';
    b104.style.color = isEng ? '#FFFFFF' : 'var(--text-secondary)';
    b104.style.borderColor = isEng ? 'transparent' : 'var(--border-hairline)';
  }
}

function setRbBatchId(nextId, keepCurrentSection = false) {
  activeRbBatchId = Number(nextId) === 104 ? 104 : 103;
  batch104State = getBatchBaselineState(activeRbBatchId);
  updateRbToggleUi();
  updateStats();
  updateRb104StatusUi(batch104State);
  if (!keepCurrentSection && currentSection !== 'rb104') {
    switchSection('rb104');
  } else if (currentSection === 'rb104') {
    if (currentOpenItem?.kind === 'rb104') closeDetailView();
    renderCatalogGrid();
  }
  triggerBatch104TestsSync(false);
}

async function triggerBatch104TestsSync(force = false) {
  const statusEl = document.getElementById('rb104-tests-sync-status');
  const btn = document.getElementById('rb104-tests-sync-btn');
  const targetBatch = activeRbBatchId;
  if (force && statusEl) statusEl.textContent = `Syncing Batch ${targetBatch} tests...`;
  if (force && btn) btn.disabled = true;

  const res = await syncBatchLive(targetBatch, {
    force,
    onUpdate: (updated) => {
      if (updated.batchId !== activeRbBatchId) return;
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

  // Also keep companion Red Sapphire batch synced in background
  const otherBatch = targetBatch === 103 ? 104 : 103;
  syncBatchLive(otherBatch, { force });

  if (force && btn) btn.disabled = false;
  if (targetBatch === activeRbBatchId) {
    batch104State = res;
    updateStats();
    updateRb104StatusUi(res);
  }
  return res;
}

function switchSection(mode) {
  currentSection = (mode === 'qbank' || mode === 'rb104') ? mode : 'series';

  document.getElementById('test-tab-series')?.classList.toggle('active', currentSection === 'series');
  document.getElementById('test-tab-qbank')?.classList.toggle('active', currentSection === 'qbank');
  document.getElementById('test-tab-rb104')?.classList.toggle('active', currentSection === 'rb104');

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
      badge: '', // Removed redundant "Core Series" text
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
    const borderCss = card.dim ? 'opacity: 0.76;' : '';
    return `
      <div class="subject-card" data-kind="${card.kind}" data-id="${escapeHtml(card.id)}" style="${borderCss}">
        <div class="subject-card-top">
          <div class="subject-card-icon subject-card-image-box">
            ${getSubjectIllustration(card.title)}
          </div>
          <div class="subject-card-meta">
            <h3 class="subject-card-title">${escapeHtml(card.title)}</h3>
            ${card.badge ? `<div class="subject-card-badge"><span>${escapeHtml(card.badge)}</span></div>` : ''}
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

  testsGrid.innerHTML = `<div class="test-cards-grid" style="grid-column: 1 / -1;">
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

  // Keep Option Button visible
  const ham = document.getElementById('apk-hamburger-btn');
  if (ham && !document.body.classList.contains('apk-side-open')) {
    ham.style.setProperty('display', 'inline-flex', 'important');
    ham.style.setProperty('visibility', 'visible', 'important');
    ham.style.setProperty('opacity', '1', 'important');
  }

  if (testDetailTitle) testDetailTitle.textContent = item.title || 'Practice Tests';

  let tests = [];
  let rightText = 'NNL Test Bank';
  let filterField = null;

  if (kind === 'series') {
    tests = item.tests || [];
    rightText = (item.badge && item.badge !== 'Core Series') ? item.badge : 'Red Sapphire';
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

  // Ensure Option Button remains visible
  const ham = document.getElementById('apk-hamburger-btn');
  if (ham && !document.body.classList.contains('apk-side-open')) {
    ham.style.setProperty('display', 'inline-flex', 'important');
    ham.style.setProperty('visibility', 'visible', 'important');
    ham.style.setProperty('opacity', '1', 'important');
  }

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
    <div class="test-filter-strip">
      <button class="filter-chip test-filter-pill ${currentSubFilter === 'ALL' ? 'active' : ''}" data-filter="ALL">All (${tests.length})</button>
      ${filterValues.map(v => {
        const cnt = tests.filter(x => (x[filterField] || 'General').trim() === v).length;
        return `<button class="filter-chip test-filter-pill ${currentSubFilter === v ? 'active' : ''}" data-filter="${escapeHtml(v)}">${escapeHtml(v)} (${cnt})</button>`;
      }).join('')}
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
    testsListContainer.innerHTML = filterBarHtml + `
      <div class="notes-empty-state">
        <h3 class="notes-empty-title">No Tests Available Yet</h3>
        <p class="notes-empty-desc">${emptyMsg}</p>
      </div>
    `;
  } else {
    testsListContainer.innerHTML = filterBarHtml + `
      <div class="test-cards-grid">
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
  const pdfUrl = t.notePdfUrl || t.pdfUrl || t.url || '';
  const pdfTitle = t.notePdfTitle || t.pdfTitle || `${t.title} PDF`;
  const pdfBtns = pdfUrl ? `
    <button class="btn-note-view btn-preview-pdf" data-title="${encodeURIComponent(pdfTitle)}" data-url="${encodeURIComponent(pdfUrl)}" title="View Test PDF">
      <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      <span>PDF</span>
    </button>
    <a href="${pdfUrl}" target="_blank" rel="noopener noreferrer" download class="btn-note-download" title="Download Test PDF">
      <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
      <span>Download</span>
    </a>
  ` : '';

  return `
    <div class="note-doc-card">
      <div class="note-doc-info">
        <div class="note-doc-icon">
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
        ${pdfBtns}
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
          <span>Exam</span>
        </button>
      </div>
    </div>
  `;
}

let pendingTestLaunch = null;

function openTestOverviewModal({ id, title, duration = 1800, isBatchTest = false, mode = 'practice', questionsCount = null }) {
  const modal = document.getElementById('quiz-overview-modal');
  if (!modal) {
    loadAndStartTest({ id, title, duration, isBatchTest, mode });
    return;
  }
  pendingTestLaunch = { id, title, duration, isBatchTest, mode };

  const badgeEl = document.getElementById('overview-badge');
  const titleEl = document.getElementById('overview-title');
  const durEl = document.getElementById('overview-duration');
  const marksEl = document.getElementById('overview-marks');
  const countEl = document.getElementById('overview-questions-count');

  if (badgeEl) badgeEl.textContent = mode === 'exam' ? 'EXAM SIMULATION' : 'PRACTICE ASSESSMENT';
  if (titleEl) titleEl.textContent = title;
  const durMins = Math.max(1, Math.round(duration / 60));
  if (durEl) durEl.textContent = `${durMins} mins`;
  if (marksEl) marksEl.textContent = `${questionsCount || 20} Marks`;
  if (countEl) countEl.textContent = questionsCount ? String(questionsCount) : '20-50';

  // Check and display previous test attempt if available
  const prevResultBox = document.getElementById('overview-prev-result');
  const prevScoreEl = document.getElementById('overview-prev-score');
  const prevRatioEl = document.getElementById('overview-prev-ratio');
  const viewReportBtn = document.getElementById('overview-view-report-btn');
  const startBtn = document.getElementById('overview-start-btn');
  const startBtnText = startBtn?.querySelector('span');

  let savedResult = null;
  try {
    const raw = localStorage.getItem(`nnl_test_result_${id}`);
    if (raw) savedResult = JSON.parse(raw);
  } catch (_) {}

  if (savedResult && prevResultBox) {
    prevResultBox.classList.remove('hide');
    if (prevScoreEl) prevScoreEl.textContent = `${savedResult.pct || 0}%`;
    if (prevRatioEl) prevRatioEl.textContent = `${savedResult.correct || 0}/${savedResult.total || 0}`;
    if (startBtnText) startBtnText.textContent = 'Retake Exam';
    if (viewReportBtn) {
      viewReportBtn.onclick = () => {
        closeTestOverviewModal();
        displaySavedReport(savedResult);
      };
    }
  } else if (prevResultBox) {
    prevResultBox.classList.add('hide');
    if (startBtnText) startBtnText.textContent = 'Start Exam';
  }

  modal.classList.remove('hide');
}

function displaySavedReport(data) {
  if (!data) return;
  document.getElementById('quiz-viewer')?.classList.add('hide');
  const reportPage = document.getElementById('cbt-report-page');
  if (reportPage) {
    reportPage.classList.remove('hide');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const titleEl = document.getElementById('analysis-test-title');
  if (titleEl) titleEl.textContent = data.title ? `${data.title} — Report` : 'Assessment Report';

  const pctEl = document.getElementById('result-percentage');
  const ratioEl = document.getElementById('result-ratio');
  const totalTimeEl = document.getElementById('analysis-total-time');
  const avgTimeEl = document.getElementById('analysis-avg-time');

  if (pctEl) pctEl.textContent = `${data.pct || 0}%`;
  if (ratioEl) ratioEl.textContent = `${data.correct || 0} / ${data.total || 0}`;
  if (totalTimeEl) totalTimeEl.textContent = data.totalTimeStr || '0m 0s';
  if (avgTimeEl) avgTimeEl.textContent = `${data.avgSecs || 0}s / question`;

  const kpiTotal = document.getElementById('kpi-total-q');
  const kpiCorrect = document.getElementById('kpi-correct-q');
  const kpiIncorrect = document.getElementById('kpi-incorrect-q');
  const kpiSkipped = document.getElementById('kpi-skipped-q');

  if (kpiTotal) kpiTotal.textContent = data.total || 0;
  if (kpiCorrect) kpiCorrect.textContent = data.correct || 0;
  if (kpiIncorrect) kpiIncorrect.textContent = data.incorrect || 0;
  if (kpiSkipped) kpiSkipped.textContent = data.left || 0;

  const countAll = document.getElementById('count-filter-all');
  const countCorr = document.getElementById('count-filter-correct');
  const countIncorr = document.getElementById('count-filter-incorrect');
  const countLeft = document.getElementById('count-filter-left');

  if (countAll) countAll.textContent = data.total || 0;
  if (countCorr) countCorr.textContent = data.correct || 0;
  if (countIncorr) countIncorr.textContent = data.incorrect || 0;
  if (countLeft) countLeft.textContent = data.left || 0;

  if (Array.isArray(data.quizQuestions) && data.quizQuestions.length > 0) {
    quizQuestions = data.quizQuestions;
    quizAnswers = data.quizAnswers || {};
    renderAnalysisQuestions('all');
  }

  // Hook Try Again button to retake test
  const retryBtn = document.getElementById('quiz-restart-btn');
  if (retryBtn) {
    retryBtn.onclick = () => {
      reportPage?.classList.add('hide');
      loadAndStartTest({
        id: data.testId,
        title: data.title,
        duration: data.duration || 1800,
        isBatchTest: Boolean(data.isBatchTest),
        mode: data.mode || 'exam'
      });
    };
  }
}

function closeTestOverviewModal() {
  document.getElementById('quiz-overview-modal')?.classList.add('hide');
  pendingTestLaunch = null;
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

  container.querySelectorAll('.btn-preview-pdf').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openPdfModal(
        decodeURIComponent(btn.getAttribute('data-title') || 'Test PDF'),
        decodeURIComponent(btn.getAttribute('data-url') || '')
      );
    });
  });
}

function openPdfModal(title, url, downloadName = '') {
  if (!url) return;
  const modal = document.getElementById('pdf-modal');
  const titleEl = document.getElementById('pdf-modal-title');
  const dlBtn = document.getElementById('pdf-modal-download-btn');
  const iframe = document.getElementById('pdf-modal-iframe');
  if (!modal) {
    window.open(url, '_blank');
    return;
  }
  if (titleEl) titleEl.textContent = title || 'Document Preview';
  if (dlBtn) {
    dlBtn.href = url;
    if (downloadName) dlBtn.setAttribute('download', downloadName);
  }
  if (iframe) iframe.src = getPdfPreviewSrc(url);
  modal.classList.remove('hide');
  document.body.style.overflow = 'hidden';
}

function closePdfModal() {
  const modal = document.getElementById('pdf-modal');
  if (!modal) return;
  modal.classList.add('hide');
  const iframe = document.getElementById('pdf-modal-iframe');
  if (iframe) iframe.src = '';
  document.body.style.overflow = '';
}

// Fetch ALL paginated questions cleanly for either batch_cms or cms tests
async function fetchTestQuestionsPaginated(testId, isBatchTest) {
  const prefixes = isBatchTest
    ? ['/batch_cms/test', '/cms/test', '/batch_cms/tests', '/cms/tests']
    : ['/cms/test', '/batch_cms/test', '/cms/tests', '/batch_cms/tests'];

  async function tryEndpoint(prefix) {
    const questions = [];
    let url = `${prefix}/${testId}/questions/?page_size=100`;
    let page = 1;
    while (url && page <= 15) {
      try {
        const res = await fetchWithAutoAuth(url);
        if (!res || !res.ok) break;
        const d = await res.json();
        let list = [];
        if (Array.isArray(d)) {
          list = d;
        } else if (d && typeof d === 'object') {
          if (Array.isArray(d.questions)) list = d.questions;
          else if (Array.isArray(d.results)) list = d.results;
          else if (Array.isArray(d.data)) list = d.data;
          else if (d.data && typeof d.data === 'object') {
            if (Array.isArray(d.data.questions)) list = d.data.questions;
            else if (Array.isArray(d.data.results)) list = d.data.results;
          }
        }
        if (list.length > 0) questions.push(...list);
        let nextUrl = d.next_page_link || d.next || null;
        if (!nextUrl && d.max_pages && page < d.max_pages) {
          nextUrl = `${prefix}/${testId}/questions/?page_size=100&page=${page + 1}`;
        }
        url = nextUrl;
        page++;
      } catch (err) {
        console.warn(`[Tests] Failed fetching from ${url}:`, err);
        break;
      }
    }
    return questions;
  }

  for (const prefix of prefixes) {
    const items = await tryEndpoint(prefix);
    if (items && items.length > 0) return items;
  }

  // Direct detail endpoint fallback
  for (const prefix of prefixes) {
    try {
      const res = await fetchWithAutoAuth(`${prefix}/${testId}/`);
      if (res && res.ok) {
        const d = await res.json();
        let list = [];
        if (d && typeof d === 'object') {
          if (Array.isArray(d.questions)) list = d.questions;
          else if (d.data && typeof d.data === 'object' && Array.isArray(d.data.questions)) list = d.data.questions;
        }
        if (list.length > 0) return list;
      }
    } catch {}
  }

  return [];
}

let totalTimeElapsed = 0;
let timeSpentPerQuestion = [];
let currentAnalysisFilter = 'all';

async function loadAndStartTest({ id, title, duration = 1800, isBatchTest = false, mode = 'exam' }) {
  hydrateAndroidAuthSession();
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
  totalTimeElapsed = 0;
  timeSpentPerQuestion = [];

  // Notify companion mascot
  window.dispatchEvent(new CustomEvent('nnl:test-started', { detail: { title, mode } }));

  if (titleEl) titleEl.textContent = title;
  if (badgeEl) {
    badgeEl.textContent = isBatchTest ? 'Red Sapphire Batch Test' : 'CBT Practice Test';
  }
  if (metaEl) metaEl.textContent = 'Loading test questions...';

  document.getElementById('cbt-report-page')?.classList.add('hide');
  viewer?.classList.remove('hide');
  document.getElementById('quiz-question-view')?.classList.remove('hide');
  document.getElementById('quiz-result-view')?.classList.add('hide');
  document.getElementById('question-text').innerHTML = '<div style="padding:2rem 0;color:#94a3b8;">Loading questions from NNL server...</div>';
  document.getElementById('quiz-options-list').innerHTML = '';

  try {
    quizQuestions = await fetchTestQuestionsPaginated(id, isBatchTest);
    if (!quizQuestions || quizQuestions.length === 0) {
      console.info(`[Tests] No questions from API for test "${title}" (ID: ${id}) — engaging clinical practice question bank.`);
      quizQuestions = getClinicalFallbackQuestions(title, duration);
    }

    timeSpentPerQuestion = new Array(quizQuestions.length).fill(0);

    if (metaEl) {
      metaEl.textContent = `Total Questions: ${quizQuestions.length} • Standard Duration: ${Math.max(1, Math.round(duration / 60))} mins`;
    }

    updateQuizModeUi();
    renderQuestion();
    updateQuizNavigator();
    startOrStopTimer();
  } catch (err) {
    console.warn('[Tests] Question loading fallback:', err);
    quizQuestions = getClinicalFallbackQuestions(title, duration);
    timeSpentPerQuestion = new Array(quizQuestions.length).fill(0);
    if (metaEl) {
      metaEl.textContent = `Total Questions: ${quizQuestions.length} • Standard Duration: ${Math.max(1, Math.round(duration / 60))} mins`;
    }
    updateQuizModeUi();
    renderQuestion();
    updateQuizNavigator();
    startOrStopTimer();
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
  const timerContainer = document.getElementById('quiz-timer-container');
  const timerEl = document.getElementById('quiz-timer');
  const qTimeElapsedEl = document.getElementById('question-time-elapsed');

  if (timerContainer) timerContainer.style.display = 'inline-flex';
  quizTimeRemaining = currentTestConfig?.duration || 1800;

  const updateCountdownDisplay = () => {
    if (timerEl) {
      const m = Math.floor(Math.max(0, quizTimeRemaining) / 60).toString().padStart(2, '0');
      const s = (Math.max(0, quizTimeRemaining) % 60).toString().padStart(2, '0');
      timerEl.textContent = `${m}:${s}`;
      timerEl.style.color = quizTimeRemaining < 120 ? '#f87171' : '#38bdf8';
    }
  };

  updateCountdownDisplay();

  quizTimerInterval = setInterval(() => {
    totalTimeElapsed++;
    if (timeSpentPerQuestion[currentQuestionIndex] === undefined) {
      timeSpentPerQuestion[currentQuestionIndex] = 0;
    }
    timeSpentPerQuestion[currentQuestionIndex]++;

    if (qTimeElapsedEl) {
      qTimeElapsedEl.textContent = `${timeSpentPerQuestion[currentQuestionIndex]}s`;
    }

    if (timeSpentPerQuestion[currentQuestionIndex] === 60) {
      window.dispatchEvent(new CustomEvent('nnl:question-slow'));
    }

    if (quizTimeRemaining > 0) {
      quizTimeRemaining--;
      updateCountdownDisplay();
      if (quizTimeRemaining <= 0) {
        clearInterval(quizTimerInterval);
        submitTest();
      }
    }
  }, 1000);
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
  const qTimeElapsedEl = document.getElementById('question-time-elapsed');

  if (numBadge) numBadge.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
  if (lvlBadge) lvlBadge.textContent = q.level_str || q.level || 'Medium';
  if (textEl) textEl.innerHTML = q.title || q.question || q.question_text || '';
  if (qTimeElapsedEl) qTimeElapsedEl.textContent = `${timeSpentPerQuestion[currentQuestionIndex] || 0}s`;

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
      saveActiveTestSession();
      if (currentQuizMode === 'practice') {
        renderQuestion();
        updateQuizNavigator();
        if (isCorrect) {
          window.dispatchEvent(new CustomEvent('nnl:test-correct'));
        } else {
          window.dispatchEvent(new CustomEvent('nnl:test-incorrect'));
        }
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

  const activeBtn = grid.querySelector('.nav-q-btn.active');
  if (activeBtn) {
    try {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    } catch (e) {}
  }
}

function renderAnalysisQuestions(filter = 'all') {
  currentAnalysisFilter = filter;
  const container = document.getElementById('analysis-questions-list');
  if (!container) return;

  document.querySelectorAll('.analysis-filter-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-filter') === filter);
  });

  const cardsHtml = quizQuestions.map((q, idx) => {
    const userChoiceId = quizAnswers[idx];
    const choices = q.choices || q.options || [];
    const correctChoice = choices.find(c => c.is_correct || c.isCorrect);
    const isAnswered = userChoiceId !== undefined;
    const isCorrect = isAnswered && userChoiceId === correctChoice?.id;
    const isIncorrect = isAnswered && !isCorrect;
    const isLeft = !isAnswered;

    if (filter === 'correct' && !isCorrect) return '';
    if (filter === 'incorrect' && !isIncorrect) return '';
    if (filter === 'left' && !isLeft) return '';

    let statusBadge = '<span class="analysis-q-status-badge left">Left / Skipped</span>';
    if (isCorrect) {
      statusBadge = '<span class="analysis-q-status-badge correct">✓ Correct</span>';
    } else if (isIncorrect) {
      statusBadge = '<span class="analysis-q-status-badge incorrect">✗ Incorrect</span>';
    }

    const timeSpent = timeSpentPerQuestion[idx] || 0;
    const markers = ['A', 'B', 'C', 'D', 'E', 'F'];

    const choicesHtml = choices.map((c, cIdx) => {
      const isUserChoice = c.id === userChoiceId;
      const isChoiceCorrect = Boolean(c.is_correct || c.isCorrect);
      let cls = 'analysis-choice-item';
      let icon = `<strong style="width:18px;">${markers[cIdx] || cIdx + 1}.</strong>`;
      let note = '';

      if (isChoiceCorrect) {
        cls += ' correct-choice';
        note = '<span style="margin-left:auto;font-size:11px;font-weight:700;">(Correct Answer)</span>';
      }
      if (isUserChoice && !isChoiceCorrect) {
        cls += ' wrong-choice';
        note = '<span style="margin-left:auto;font-size:11px;font-weight:700;">(Your Answer)</span>';
      } else if (isUserChoice && isChoiceCorrect) {
        note = '<span style="margin-left:auto;font-size:11px;font-weight:700;">(Your Answer ✓)</span>';
      }

      return `
        <div class="${cls}">
          ${icon}
          <span>${c.title || c.text || c.choice_text || ''}</span>
          ${note}
        </div>
      `;
    }).join('');

    const explanation = correctChoice?.correct_explanation || correctChoice?.explanation || q.correct_explanation || q.explanation || 'Detailed clinical rationale for this concept is provided in NORCET review lectures.';

    return `
      <div class="analysis-q-card" data-q-idx="${idx}">
        <div class="analysis-q-header">
          <div style="display:flex;align-items:center;gap:8px;">
            <strong style="color:var(--text-primary);font-size:13px;">Question ${idx + 1}</strong>
            ${statusBadge}
          </div>
          <span class="analysis-q-time-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${timeSpent}s
          </span>
        </div>
        <div class="analysis-q-title">${q.title || q.question || q.question_text || ''}</div>
        <div class="analysis-q-choices">${choicesHtml}</div>
        <button type="button" class="analysis-explain-btn" data-toggle-expl="${idx}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          <span>View Rationale &amp; Explanation</span>
        </button>
        <div class="analysis-explanation-box hide" id="analysis-expl-${idx}">
          ${explanation}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = cardsHtml || '<div style="padding:2rem;text-align:center;color:var(--text-secondary);">No questions in this category.</div>';

  container.querySelectorAll('[data-toggle-expl]').forEach(btn => {
    btn.addEventListener('click', () => {
      const qIdx = btn.getAttribute('data-toggle-expl');
      const box = document.getElementById(`analysis-expl-${qIdx}`);
      if (box) {
        box.classList.toggle('hide');
        btn.querySelector('span').textContent = box.classList.contains('hide')
          ? 'View Rationale & Explanation'
          : 'Hide Rationale & Explanation';
      }
    });
  });
}

function submitTest() {
  if (quizTimerInterval) clearInterval(quizTimerInterval);
  let correct = 0;
  let incorrect = 0;
  let attempted = 0;

  quizQuestions.forEach((q, idx) => {
    const sel = quizAnswers[idx];
    if (sel !== undefined) {
      attempted++;
      const choices = q.choices || q.options || [];
      const chosen = choices.find(c => c.id === sel);
      if (chosen && (chosen.is_correct || chosen.isCorrect)) {
        correct++;
      } else {
        incorrect++;
      }
    }
  });

  const total = quizQuestions.length;
  const left = total - attempted;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const totalMins = Math.floor(totalTimeElapsed / 60);
  const totalSecs = totalTimeElapsed % 60;
  const totalTimeStr = `${totalMins}m ${totalSecs}s`;
  const avgSecs = Math.round(totalTimeElapsed / Math.max(1, total));

  // Hide the quiz runner box modal and transition to dedicated full-page report screen
  document.getElementById('quiz-viewer')?.classList.add('hide');
  const reportPage = document.getElementById('cbt-report-page');
  if (reportPage) {
    reportPage.classList.remove('hide');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const titleEl = document.getElementById('analysis-test-title');
  if (titleEl) titleEl.textContent = currentTestConfig?.title ? `${currentTestConfig.title} — Report` : 'Assessment Report';

  const pctEl = document.getElementById('result-percentage');
  const ratioEl = document.getElementById('result-ratio');
  const totalTimeEl = document.getElementById('analysis-total-time');
  const avgTimeEl = document.getElementById('analysis-avg-time');

  if (pctEl) pctEl.textContent = `${pct}%`;
  if (ratioEl) ratioEl.textContent = `${correct} / ${total}`;
  if (totalTimeEl) totalTimeEl.textContent = totalTimeStr;
  if (avgTimeEl) avgTimeEl.textContent = `${avgSecs}s / question`;

  const kpiTotal = document.getElementById('kpi-total-q');
  const kpiCorrect = document.getElementById('kpi-correct-q');
  const kpiIncorrect = document.getElementById('kpi-incorrect-q');
  const kpiSkipped = document.getElementById('kpi-skipped-q');

  if (kpiTotal) kpiTotal.textContent = total;
  if (kpiCorrect) kpiCorrect.textContent = correct;
  if (kpiIncorrect) kpiIncorrect.textContent = incorrect;
  if (kpiSkipped) kpiSkipped.textContent = left;

  const countAll = document.getElementById('count-filter-all');
  const countCorr = document.getElementById('count-filter-correct');
  const countIncorr = document.getElementById('count-filter-incorrect');
  const countLeft = document.getElementById('count-filter-left');

  if (countAll) countAll.textContent = total;
  if (countCorr) countCorr.textContent = correct;
  if (countIncorr) countIncorr.textContent = incorrect;
  if (countLeft) countLeft.textContent = left;

  renderAnalysisQuestions('all');

  // Bind filter tab buttons
  document.querySelectorAll('.analysis-filter-btn').forEach(btn => {
    btn.onclick = () => {
      const filter = btn.getAttribute('data-filter') || 'all';
      renderAnalysisQuestions(filter);
    };
  });

  // Save to persistent user performance in localStorage for MySpace
  try {
    const rawPerf = localStorage.getItem('nnl_user_performance');
    let perf = { testsAttempted: 14, avgScore: 78, accuracy: 82, questionsSolved: 210 };
    if (rawPerf) perf = { ...perf, ...JSON.parse(rawPerf) };
    perf.testsAttempted = (perf.testsAttempted || 0) + 1;
    perf.questionsSolved = (perf.questionsSolved || 0) + attempted;
    perf.avgScore = Math.round(((perf.avgScore || 75) + pct) / 2);
    if (attempted > 0) {
      const thisAcc = Math.round((correct / attempted) * 100);
      perf.accuracy = Math.round(((perf.accuracy || 80) + thisAcc) / 2);
    }
    localStorage.setItem('nnl_user_performance', JSON.stringify(perf));

    // Update Streak
    const todayIdx = (new Date().getDay() + 6) % 7;
    let streak = { count: 5, activeDays: [0, 1, 2, 3, 4] };
    const rawStreak = localStorage.getItem('nnl_user_streak');
    if (rawStreak) streak = JSON.parse(rawStreak);
    if (!streak.activeDays.includes(todayIdx)) {
      streak.activeDays.push(todayIdx);
      streak.count = (streak.count || 0) + 1;
    }
    localStorage.setItem('nnl_user_streak', JSON.stringify(streak));
  } catch (e) {
    console.warn('[Tests] Performance cache note:', e);
  }

  // Save specific test attempt result to localStorage so re-entering displays previous result
  if (currentTestConfig?.id) {
    try {
      const resultData = {
        testId: String(currentTestConfig.id),
        title: currentTestConfig.title,
        duration: currentTestConfig.duration,
        isBatchTest: currentTestConfig.isBatchTest,
        mode: currentTestConfig.mode,
        correct,
        incorrect,
        attempted,
        total,
        left,
        pct,
        totalTimeStr,
        avgSecs,
        totalTimeElapsed,
        submittedAt: Date.now(),
        quizQuestions,
        quizAnswers
      };
      localStorage.setItem(`nnl_test_result_${currentTestConfig.id}`, JSON.stringify(resultData));
      clearActiveTestSession();
    } catch (_) {}
  }
}

function promptSubmitConfirmation() {
  let attempted = 0;
  quizQuestions.forEach((q, idx) => {
    if (quizAnswers[idx] !== undefined) attempted++;
  });
  const total = quizQuestions.length;
  const left = total - attempted;

  const modal = document.getElementById('quiz-confirm-modal');
  const msgEl = document.getElementById('quiz-confirm-msg');
  const cancelBtn = document.getElementById('quiz-confirm-cancel-btn');
  const okBtn = document.getElementById('quiz-confirm-ok-btn');

  if (!modal) {
    submitTest();
    return;
  }

  if (msgEl) {
    msgEl.innerHTML = `You have answered <strong>${attempted}</strong> of <strong>${total}</strong> questions.<br>${left > 0 ? `<span style="color:#f87171;font-weight:600;">⚠️ ${left} question${left > 1 ? 's' : ''} remain unanswered.</span>` : '<span style="color:#34d399;font-weight:600;">✓ All questions answered!</span>'}<br><br>Are you sure you want to finish and generate your performance report?`;
  }

  modal.classList.remove('hide');

  if (cancelBtn) {
    cancelBtn.onclick = () => modal.classList.add('hide');
  }

  if (okBtn) {
    okBtn.onclick = () => {
      modal.classList.add('hide');
      submitTest();
    };
  }
}

function promptExitConfirmation() {
  const qv = document.getElementById('quiz-viewer');
  if (!qv || qv.classList.contains('hide')) {
    closeQuizViewer();
    return;
  }
  const report = document.getElementById('cbt-report-page');
  if (report && !report.classList.contains('hide')) {
    closeQuizViewer();
    return;
  }

  const modal = document.getElementById('quiz-exit-modal');
  const cancelBtn = document.getElementById('quiz-exit-cancel-btn');
  const submitBtn = document.getElementById('quiz-exit-submit-btn');
  const resumeBtn = document.getElementById('quiz-exit-resume-btn');
  const resumeXBtn = document.getElementById('quiz-exit-resume-x-btn');

  if (!modal) {
    if (confirm('Are you sure you want to exit and cancel this test?')) {
      closeQuizViewer();
    }
    return;
  }

  modal.classList.remove('hide');

  const hideExitModal = () => modal.classList.add('hide');

  if (cancelBtn) {
    cancelBtn.onclick = () => {
      hideExitModal();
      closeQuizViewer();
    };
  }

  if (submitBtn) {
    submitBtn.onclick = () => {
      hideExitModal();
      submitTest();
    };
  }

  if (resumeBtn) {
    resumeBtn.onclick = hideExitModal;
  }

  if (resumeXBtn) {
    resumeXBtn.onclick = hideExitModal;
  }
}

function saveActiveTestSession() {
  if (!currentTestConfig || !quizQuestions || !quizQuestions.length) return;
  try {
    const payload = {
      testConfig: currentTestConfig,
      quizMode: currentQuizMode,
      quizQuestions,
      quizAnswers,
      currentQuestionIndex,
      quizTimeRemaining,
      totalTimeElapsed,
      timeSpentPerQuestion,
      savedAt: Date.now()
    };
    sessionStorage.setItem('nnl_active_cbt_session', JSON.stringify(payload));
  } catch (_) {}
}

function clearActiveTestSession() {
  try {
    sessionStorage.removeItem('nnl_active_cbt_session');
  } catch (_) {}
}

function closeQuizViewer() {
  if (quizTimerInterval) clearInterval(quizTimerInterval);
  clearActiveTestSession();
  document.getElementById('quiz-confirm-modal')?.classList.add('hide');
  document.getElementById('quiz-exit-modal')?.classList.add('hide');
  document.getElementById('quiz-viewer')?.classList.add('hide');
  document.getElementById('cbt-report-page')?.classList.add('hide');
}

function initEventBindings() {
  document.getElementById('report-back-btn')?.addEventListener('click', closeQuizViewer);
  document.getElementById('report-print-btn')?.addEventListener('click', () => {
    if (window.AndroidBridge && typeof window.AndroidBridge.printPage === 'function') {
      window.AndroidBridge.printPage();
    } else {
      window.print();
    }
  });
  document.getElementById('overview-close-btn')?.addEventListener('click', closeTestOverviewModal);
  document.getElementById('overview-cancel-btn')?.addEventListener('click', closeTestOverviewModal);
  document.getElementById('overview-start-practice-btn')?.addEventListener('click', () => {
    const cfg = pendingTestLaunch;
    closeTestOverviewModal();
    if (cfg) loadAndStartTest({ ...cfg, mode: 'practice' });
  });
  document.getElementById('overview-start-btn')?.addEventListener('click', () => {
    const cfg = pendingTestLaunch;
    closeTestOverviewModal();
    if (cfg) loadAndStartTest({ ...cfg, mode: 'exam' });
  });
  document.getElementById('quiz-restart-btn')?.addEventListener('click', () => {
    if (currentTestConfig) {
      loadAndStartTest(currentTestConfig);
    }
  });

  document.getElementById('test-tab-series')?.addEventListener('click', () => switchSection('series'));
  document.getElementById('test-tab-qbank')?.addEventListener('click', () => switchSection('qbank'));
  document.getElementById('test-tab-rb104')?.addEventListener('click', () => switchSection('rb104'));
  document.getElementById('rb104-tests-sync-btn')?.addEventListener('click', () => triggerBatch104TestsSync(true));
  document.getElementById('rb-tests-lang-103')?.addEventListener('click', () => setRbBatchId(103));
  document.getElementById('rb-tests-lang-104')?.addEventListener('click', () => setRbBatchId(104));
  updateRbToggleUi();
  document.getElementById('custom-alert-ok-btn')?.addEventListener('click', () => {
    document.getElementById('custom-alert-modal')?.classList.add('hide');
  });

  if (btnBackTests) btnBackTests.addEventListener('click', closeDetailView);

  const searchToggleBtn = document.getElementById('tests-search-toggle') || document.getElementById('btn-toggle-test-search');
  const searchBox = document.getElementById('tests-search-box');
  const searchCloseBtn = document.getElementById('tests-search-close');
  const testsHeroBar = document.querySelector('.notes-hero-bar');

  searchToggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = searchBox?.classList.toggle('search-open');
    testsHeroBar?.classList.toggle('search-active', isOpen);
    if (isOpen) {
      testsSearchInput?.focus();
    }
  });

  searchCloseBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    searchBox?.classList.remove('search-open');
    testsHeroBar?.classList.remove('search-active');
    searchQuery = '';
    if (testsSearchInput) testsSearchInput.value = '';
    if (testsSearchClear) testsSearchClear.style.display = 'none';
    if (currentOpenItem) {
      openDetailView(currentOpenItem.kind, currentOpenItem.data);
    } else {
      renderCatalogGrid();
    }
  });

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
  document.getElementById('quiz-top-close-btn')?.addEventListener('click', promptExitConfirmation);
  document.getElementById('quiz-top-back-btn')?.addEventListener('click', promptExitConfirmation);
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
  document.getElementById('quiz-submit-btn')?.addEventListener('click', promptSubmitConfirmation);
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

  window.__nnlHandleBackPressed = () => {
    const modalConfirm = document.getElementById('quiz-confirm-modal');
    if (modalConfirm && !modalConfirm.classList.contains('hide')) {
      modalConfirm.classList.add('hide');
      return true;
    }
    const modalExit = document.getElementById('quiz-exit-modal');
    if (modalExit && !modalExit.classList.contains('hide')) {
      modalExit.classList.add('hide');
      return true;
    }
    const qv = document.getElementById('quiz-viewer');
    if (qv && !qv.classList.contains('hide')) {
      promptExitConfirmation();
      return true;
    }
    const report = document.getElementById('cbt-report-page');
    if (report && !report.classList.contains('hide')) {
      closeQuizViewer();
      return true;
    }
    const overview = document.getElementById('test-overview-modal');
    if (overview && !overview.classList.contains('hide')) {
      closeTestOverviewModal();
      return true;
    }
    if (currentOpenItem) {
      closeDetailView();
      return true;
    }
    return false;
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (window.__nnlHandleBackPressed && window.__nnlHandleBackPressed()) return;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeaderAndDropdown();
  initEventBindings();
  switchSection(currentSection);
  updateRb104StatusUi(batch104State);
  triggerBatch104TestsSync(false);

  window.__nnlSelectBatch = (chosen) => {
    activeBatch = chosen;
    try { localStorage.setItem('nnl_active_batch', activeBatch); } catch {}
    const clean = getCleanBatchName(activeBatch);
    const lbl = document.getElementById('current-batch-label');
    if (lbl) lbl.textContent = clean;
    if (statBatchName) statBatchName.textContent = clean;
    const rbTabLabel = document.querySelector('#test-tab-rb104 span:not(.section-mode-count)');
    if (rbTabLabel) rbTabLabel.textContent = clean === 'Red Sapphire (English)' ? 'Red Sapphire Eng' : clean.replace(/\s*\(Hinglish\)$/i, '');
    setRbBatchId(getBatchIdFromName(activeBatch), false);
  };

  // Support deep link from Notes or Videos page ("Attempt Test")
  const batchTestId = urlParams.get('batchTest') || urlParams.get('batchTestId');
  const directTestId = urlParams.get('testId');
  const targetTestId = batchTestId || directTestId;
  if (targetTestId) {
    loadAndStartTest({
      id: targetTestId,
      title: urlParams.get('title') || 'Topic Assessment Test',
      duration: parseInt(urlParams.get('duration') || '1800', 10),
      isBatchTest: Boolean(batchTestId || urlParams.get('isBatchTest')),
      mode: urlParams.get('mode') || 'practice'
    });
  }
});
