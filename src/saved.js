import {
  getSavedLecturesList,
  toggleSavedLecture,
  isLectureSaved,
  getLectureProgress
} from './services/lectureWatchService.js';
import { MASTER_NOTES_BY_SUBJECT } from './data/allSubjectsNotes.js';
import { PRESEEDED_VIDEOS_BY_SUBJECT } from './data/allVideosCatalog.js';
import { hydrateAndroidAuthSession, fetchFreshVdoCipherOtp, fetchOfflineVdoCipherOtp } from './utils/batch104Sync.js';
import { getPdfPreviewSrc } from './config/appMode.js';

hydrateAndroidAuthSession();

let activeSavedTab = 'lectures'; // 'lectures' | 'notes' | 'tests'
let searchQuery = '';

const lecturesContainer = document.getElementById('saved-lectures-container');
const notesContainer = document.getElementById('saved-notes-container');
const testsContainer = document.getElementById('saved-tests-container');
const searchInput = document.getElementById('saved-search-input');

const countLecturesEl = document.getElementById('count-lectures');
const countNotesEl = document.getElementById('count-notes');
const countTestsEl = document.getElementById('count-tests');

// Recording Viewer Elements
const recordingViewer = document.getElementById('recording-viewer');
const recordingVideo = document.getElementById('recording-video');
const recordingNoUrl = document.getElementById('recording-no-url');
const recordingTitle = document.getElementById('recording-viewer-title');
const recordingInstructor = document.getElementById('recording-viewer-instructor');
const closeRecordingBtn = document.getElementById('close-recording-viewer');
const recordingRetryBtn = document.getElementById('recording-retry-btn');
let activePlayingRec = null;

// PDF Modal Elements
const pdfModal = document.getElementById('pdf-modal');
const pdfModalTitle = document.getElementById('pdf-modal-title');
const pdfModalIframe = document.getElementById('pdf-modal-iframe');
const pdfModalCloseBtn = document.getElementById('pdf-modal-close-btn');
const pdfModalDownloadBtn = document.getElementById('pdf-modal-download-btn');

function openPdfPreview(title, url, downloadName = '') {
  if (!pdfModal) return;
  if (pdfModalTitle) pdfModalTitle.textContent = title;
  if (pdfModalDownloadBtn) {
    pdfModalDownloadBtn.href = url;
    if (downloadName) pdfModalDownloadBtn.setAttribute('download', downloadName);
  }
  if (pdfModalIframe) {
    pdfModalIframe.src = getPdfPreviewSrc(url);
  }
  pdfModal.classList.remove('hide');
}

function closePdfPreview() {
  if (pdfModal) pdfModal.classList.add('hide');
  if (pdfModalIframe) pdfModalIframe.src = '';
}

pdfModalCloseBtn?.addEventListener('click', closePdfPreview);
pdfModal?.addEventListener('click', (e) => {
  if (e.target === pdfModal) closePdfPreview();
});

// Video Playback
function openLectureViewer(rec) {
  if (!rec) return;
  const recId = rec.recId || rec.id;
  const tk = localStorage.getItem('nnl_access_token') || '';

  // If in native Android app, directly play through native VdoPlayerActivity
  if (window.AndroidVideoBridge && typeof window.AndroidVideoBridge.playVideoWithAuth === 'function') {
    window.AndroidVideoBridge.playVideoWithAuth(
      rec.otp || '',
      rec.playbackInfo || '',
      rec.title || 'Recorded Lecture',
      rec.instructor || 'NNL Faculty',
      String(recId),
      tk,
      true,
      rec.notePdfUrl || '',
      rec.notePdfTitle || (rec.title ? `${rec.title} Notes` : 'Class Notes PDF')
    );
    return;
  }

  if (!recordingViewer) return;
  activePlayingRec = rec;
  if (recordingTitle) recordingTitle.textContent = rec.title || 'Recorded Lecture';
  if (recordingInstructor) recordingInstructor.textContent = `${rec.instructor || 'NNL Faculty'} • ${rec.subject || 'Red Sapphire'}`;

  recordingViewer.classList.remove('hide');
  document.body.classList.add('modal-open');

  const oldFrame = recordingViewer.querySelector('.vdocipher-embed-frame');
  if (oldFrame) oldFrame.remove();

  if (recordingVideo) {
    recordingVideo.pause();
    recordingVideo.src = '';
    recordingVideo.classList.add('hide');
  }
  if (recordingNoUrl) recordingNoUrl.classList.remove('hide');

  loadLectureStream(rec);
}

async function loadLectureStream(rec) {
  const errDesc = document.getElementById('recording-error-desc');
  try {
    if (errDesc) errDesc.textContent = 'Loading lecture...';
    const recId = rec.recId || rec.id;
    let otpData = null;
    try {
      otpData = await fetchFreshVdoCipherOtp(recId, { isBatch103: true });
    } catch {
      otpData = await fetchFreshVdoCipherOtp(recId, { isBatch103: false });
    }

    if (otpData && otpData.otp && otpData.playbackInfo) {
      if (recordingNoUrl) recordingNoUrl.classList.add('hide');
      const body = recordingViewer.querySelector('.recording-viewer-body');
      const iframe = document.createElement('iframe');
      iframe.className = 'vdocipher-embed-frame';
      iframe.style.cssText = 'width:100%;height:100%;min-height:360px;border:none;background:#000;';
      iframe.allow = 'encrypted-media; autoplay; fullscreen';
      iframe.src = `https://player.vdocipher.com/v2/?otp=${encodeURIComponent(otpData.otp)}&playbackInfo=${encodeURIComponent(otpData.playbackInfo)}`;
      body.appendChild(iframe);
      return;
    }

    // Direct MP4 / HLS fallback
    const videoUrl = rec.url || rec.videoUrl;
    if (videoUrl && recordingVideo) {
      if (recordingNoUrl) recordingNoUrl.classList.add('hide');
      recordingVideo.src = videoUrl;
      recordingVideo.classList.remove('hide');
      recordingVideo.play().catch(() => {});
      return;
    }

    if (errDesc) errDesc.textContent = 'Unable to establish video stream. Please check connection and retry.';
  } catch (e) {
    if (errDesc) errDesc.textContent = 'Playback error: ' + (e.message || 'Stream unavailable');
  }
}

closeRecordingBtn?.addEventListener('click', () => {
  if (recordingViewer) recordingViewer.classList.add('hide');
  document.body.classList.remove('modal-open');
  const frame = recordingViewer?.querySelector('.vdocipher-embed-frame');
  if (frame) frame.remove();
  if (recordingVideo) {
    recordingVideo.pause();
    recordingVideo.src = '';
  }
});

recordingRetryBtn?.addEventListener('click', () => {
  if (activePlayingRec) loadLectureStream(activePlayingRec);
});

// Render Saved Lectures
function renderSavedLectures() {
  if (!lecturesContainer) return;
  const list = getSavedLecturesList();
  if (countLecturesEl) countLecturesEl.textContent = list.length;

  const q = searchQuery.trim().toLowerCase();
  const filtered = list.filter(item => {
    if (!q) return true;
    return `${item.title} ${item.instructor} ${item.subject}`.toLowerCase().includes(q);
  });

  if (filtered.length === 0) {
    lecturesContainer.innerHTML = `
      <div class="notes-empty-state" style="padding: 2.5rem 1rem; text-align: center; width: 100%;">
        <div style="width: 52px; height: 52px; margin: 0 auto 0.85rem; border-radius: 16px; background: rgba(142,116,229,0.18); border: 1px solid rgba(167,139,250,0.3); display: flex; align-items: center; justify-content: center; color: var(--accent);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="6 4 20 12 6 20 6 4"/></svg>
        </div>
        <p class="apk-empty-title" style="font-weight: 700; font-size: 15px; margin: 0 0 4px; color: var(--text-primary);">No saved lectures</p>
        <p style="font-size: 12px; color: var(--text-secondary); margin: 0;">Bookmark classes from Videos or Home to watch them offline anytime.</p>
      </div>
    `;
    return;
  }

  lecturesContainer.innerHTML = filtered.map((lec, idx) => {
    const thumb = lec.thumb || '/nightingale.png';
    const duration = lec.duration ? `${Math.round(lec.duration / 60)} mins` : 'Recorded';
    const recIdClean = String(lec.id || lec.recId || '');
    return `
      <div class="sd-lecture-card apk-card-arrange" data-rec-id="${recIdClean}" style="--card-i: ${idx};">
        <span class="sd-lecture-num">${idx + 1}</span>
        <div class="sd-lecture-thumb-wrap">
          <img src="${thumb}" alt="${lec.title}" class="sd-lecture-thumb" loading="lazy" onerror="this.src='/nightingale.png'" />
          <div class="sd-thumb-play-overlay">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
        <div class="sd-lecture-body">
          <div class="sd-lecture-topic-row">
            <span class="sd-lecture-topic-pill">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <span>${lec.subject || 'Saved Lecture'}</span>
            </span>
          </div>
          <div class="sd-lecture-top-line">
            <span class="sd-lecture-title" title="${lec.title}">${lec.title}</span>
          </div>
          <div class="sd-lecture-sub-line">
            <span class="sd-lecture-progress-label">${duration}</span>
            <div class="sd-lecture-actions">
              <button type="button" class="sd-mini-pill btn-play-saved-rec" data-rec-id="${recIdClean}" style="background:var(--accent);color:#fff;border:none;">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                <span>Play</span>
              </button>
              <button type="button" class="sd-mini-pill btn-unsave-rec" data-rec-id="${recIdClean}" title="Remove from saved">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  lecturesContainer.querySelectorAll('.btn-play-saved-rec, .sd-lecture-card[data-rec-id]').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.btn-unsave-rec')) return;
      const id = el.getAttribute('data-rec-id');
      const rec = list.find(r => String(r.id || r.recId) === String(id));
      if (rec) openLectureViewer(rec);
    });
  });

  lecturesContainer.querySelectorAll('.btn-unsave-rec').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-rec-id');
      if (id && id !== 'undefined' && id !== 'null') {
        toggleSavedLecture(id);
        renderSavedLectures();
      }
    });
  });
}

// Real Local Storage for Saved Notes & Question Banks (Zero hardcoded fake items)
const SAVED_NOTES_KEY = 'nnl_saved_notes_v1';
const SAVED_TESTS_KEY = 'nnl_saved_tests_v1';

function getSavedNotesList() {
  try {
    const raw = localStorage.getItem(SAVED_NOTES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toggleSavedNote(note) {
  try {
    let list = getSavedNotesList();
    const id = String(note.id || note.url || note.title);
    const idx = list.findIndex(n => String(n.id || n.url || n.title) === id);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.unshift(note);
    }
    localStorage.setItem(SAVED_NOTES_KEY, JSON.stringify(list));
    return idx < 0;
  } catch {
    return false;
  }
}

function getSavedTestsList() {
  try {
    const raw = localStorage.getItem(SAVED_TESTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toggleSavedTest(test) {
  try {
    let list = getSavedTestsList();
    const id = String(test.id || test.title);
    const idx = list.findIndex(t => String(t.id || t.title) === id);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.unshift(test);
    }
    localStorage.setItem(SAVED_TESTS_KEY, JSON.stringify(list));
    return idx < 0;
  } catch {
    return false;
  }
}

// Render Saved Notes & PDFs (Shows ONLY notes saved by the user, NO 'PDF Note' prefix, NO download button)
function renderSavedNotes() {
  if (!notesContainer) return;
  const savedNotesList = getSavedNotesList();
  if (countNotesEl) countNotesEl.textContent = savedNotesList.length;

  const q = searchQuery.trim().toLowerCase();
  const filtered = savedNotesList.filter(n => {
    if (!q) return true;
    return `${n.title} ${n.subject || ''} ${n.topic || ''}`.toLowerCase().includes(q);
  });

  if (filtered.length === 0) {
    notesContainer.innerHTML = `
      <div class="notes-empty-state" style="padding: 2.5rem 1rem; text-align: center; width: 100%; grid-column: 1 / -1;">
        <div style="width: 52px; height: 52px; margin: 0 auto 0.85rem; border-radius: 16px; background: rgba(56,189,248,0.18); border: 1px solid rgba(56,189,248,0.3); display: flex; align-items: center; justify-content: center; color: #38BDF8;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <p class="apk-empty-title" style="font-weight: 700; font-size: 15px; margin: 0 0 4px; color: var(--text-primary);">No saved notes</p>
        <p style="font-size: 12px; color: var(--text-secondary); margin: 0;">Save notes from the Notes tab to view them here.</p>
      </div>
    `;
    return;
  }

  notesContainer.innerHTML = filtered.map((n, idx) => {
    const cleanTitle = (n.title || 'Clinical Subject Note').trim();
    const downloadName = `${cleanTitle.replace(/[^a-zA-Z0-9_.-]/g, '_')}.pdf`;
    return `
      <div class="note-doc-card apk-card-arrange" style="--card-i: ${idx};">
        <div class="note-doc-info">
          ${n.subject ? `<div style="font-size:11.5px;font-weight:700;color:var(--accent);margin-bottom:4px;">${n.subject}</div>` : ''}
          <h4 class="note-doc-title" style="font-size:13.5px;font-weight:700;margin:0 0 6px;color:var(--text-primary);">${cleanTitle}</h4>
        </div>
        <div class="note-doc-actions" style="display:flex;align-items:center;gap:6px;margin-top:8px;">
          <button type="button" class="btn-note-view btn-preview-saved-pdf" data-title="${encodeURIComponent(cleanTitle)}" data-url="${encodeURIComponent(n.url || '')}" data-filename="${encodeURIComponent(downloadName)}" style="padding:6px 14px;font-size:11.5px;border-radius:8px;font-weight:700;cursor:pointer;">
            <span>View PDF</span>
          </button>
          <button type="button" class="sd-del-btn btn-unsave-note" data-note-id="${n.id || n.url || n.title}" title="Remove from saved" style="padding:6px 9px;border-radius:8px;cursor:pointer;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      </div>
    `;
  }).join('');

  notesContainer.querySelectorAll('.btn-preview-saved-pdf').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = decodeURIComponent(btn.getAttribute('data-title') || 'PDF Note');
      const url = decodeURIComponent(btn.getAttribute('data-url') || '');
      const fn = decodeURIComponent(btn.getAttribute('data-filename') || '');
      openPdfPreview(title, url, fn);
    });
  });

  notesContainer.querySelectorAll('.btn-unsave-note').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-note-id');
      toggleSavedNote({ id });
      renderSavedNotes();
    });
  });
}

// Render Saved Question Banks (Shows ONLY question banks saved by the user)
function renderSavedTests() {
  if (!testsContainer) return;
  const savedBanks = getSavedTestsList();
  if (countTestsEl) countTestsEl.textContent = savedBanks.length;

  const q = searchQuery.trim().toLowerCase();
  const filtered = savedBanks.filter(t => {
    if (!q) return true;
    return `${t.title} ${t.category || ''}`.toLowerCase().includes(q);
  });

  if (filtered.length === 0) {
    testsContainer.innerHTML = `
      <div class="notes-empty-state" style="padding: 2.5rem 1rem; text-align: center; width: 100%; grid-column: 1 / -1;">
        <div style="width: 52px; height: 52px; margin: 0 auto 0.85rem; border-radius: 16px; background: rgba(142,116,229,0.18); border: 1px solid rgba(142,116,229,0.3); display: flex; align-items: center; justify-content: center; color: var(--accent);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </div>
        <p class="apk-empty-title" style="font-weight: 700; font-size: 15px; margin: 0 0 4px; color: var(--text-primary);">No saved question banks</p>
        <p style="font-size: 12px; color: var(--text-secondary); margin: 0;">Bookmark question banks from the Tests tab to practice them here.</p>
      </div>
    `;
    return;
  }

  testsContainer.innerHTML = filtered.map((test, idx) => `
    <div class="test-card apk-card-arrange" style="--card-i: ${idx}; padding: 14px; border-radius: 14px; background: rgba(30, 24, 52, 0.65); border: 1px solid rgba(142, 116, 229, 0.22); display: flex; flex-direction: column; justify-content: space-between; gap: 10px;">
      <div>
        ${test.category ? `<span style="font-size: 10.5px; font-weight: 700; color: var(--accent); background: rgba(142, 116, 229, 0.16); padding: 2px 8px; border-radius: 6px;">${test.category}</span>` : ''}
        <h4 style="font-size: 14px; font-weight: 700; color: var(--text-primary); margin: 8px 0 4px;">${test.title}</h4>
        <div style="font-size: 11.5px; color: var(--text-secondary); display: flex; gap: 8px;">
          <span>${test.questions || 100} Questions</span>
          ${test.duration ? `<span>•</span><span>${test.duration}</span>` : ''}
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <button type="button" class="btn btn-start-saved-test" data-test-id="${test.id}" style="flex:1; height: 36px; border-radius: 9px; font-size: 12.5px; font-weight: 700; background: linear-gradient(135deg, #8E74E5 0%, #7C5CE0 100%); color: #fff; border: none; cursor: pointer;">
          Start Question Bank
        </button>
        <button type="button" class="sd-del-btn btn-unsave-test" data-test-id="${test.id}" title="Remove from saved" style="padding:0 10px; border-radius:9px; cursor:pointer;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>
  `).join('');

  testsContainer.querySelectorAll('.btn-start-saved-test').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = '/tests.html';
    });
  });

  testsContainer.querySelectorAll('.btn-unsave-test').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-test-id');
      toggleSavedTest({ id });
      renderSavedTests();
    });
  });
}

// Top Tab Switcher
function switchSavedTab(target) {
  activeSavedTab = target;
  document.querySelectorAll('.saved-mode-tab').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-target') === target);
  });

  const secLec = document.getElementById('saved-section-lectures');
  const secNotes = document.getElementById('saved-section-notes');
  const secTests = document.getElementById('saved-section-tests');

  if (secLec) secLec.classList.toggle('hide', target !== 'lectures');
  if (secNotes) secNotes.classList.toggle('hide', target !== 'notes');
  if (secTests) secTests.classList.toggle('hide', target !== 'tests');

  if (target === 'lectures') renderSavedLectures();
  else if (target === 'notes') renderSavedNotes();
  else if (target === 'tests') renderSavedTests();
}

const searchToggleBtn = document.getElementById('btn-toggle-saved-search');
const searchBox = document.getElementById('saved-search-box');
searchToggleBtn?.addEventListener('click', () => {
  if (searchBox) {
    searchBox.classList.toggle('active');
  }
  searchInput?.focus();
});

document.querySelectorAll('.saved-mode-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    if (target) switchSavedTab(target);
  });
});

searchInput?.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  if (activeSavedTab === 'lectures') renderSavedLectures();
  else if (activeSavedTab === 'notes') renderSavedNotes();
  else if (activeSavedTab === 'tests') renderSavedTests();
});

// Initialize
renderSavedLectures();
renderSavedNotes();
renderSavedTests();
