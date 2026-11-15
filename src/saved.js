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
  if (!recordingViewer) return;
  activePlayingRec = rec;
  if (recordingTitle) recordingTitle.textContent = rec.title || 'Recorded Lecture';
  if (recordingInstructor) recordingInstructor.textContent = `${rec.instructor || 'NNL Faculty'} • ${rec.subject || 'Medical Nursing'}`;

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
    if (errDesc) errDesc.textContent = 'Securing encrypted stream...';
    let otpData = null;

    if (rec.vdoCipherId || rec.otp) {
      otpData = await fetchFreshVdoCipherOtp(rec.vdoCipherId || rec.recId);
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
    return `
      <div class="sd-lecture-card apk-card-arrange" data-rec-id="${lec.recId}" style="--card-i: ${idx};">
        <span class="sd-lecture-num">${idx + 1}</span>
        <img src="${thumb}" alt="${lec.title}" class="sd-lecture-thumb" loading="lazy" onerror="this.src='/nightingale.png'" />
        <div class="sd-lecture-details">
          <div class="sd-lecture-title" title="${lec.title}">${lec.title}</div>
          <div class="sd-lecture-meta">
            <span>${lec.instructor || 'NNL Faculty'}</span>
            <span>•</span>
            <span style="color: var(--accent); font-weight: 700;">${lec.subject || 'Red Sapphire'}</span>
            <span>•</span>
            <span>${duration}</span>
          </div>
        </div>
        <div class="sd-lecture-actions">
          <button type="button" class="sd-lecture-btn btn-play-saved-rec" data-rec-id="${lec.recId}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span>Play</span>
          </button>
          <button type="button" class="sd-del-btn btn-unsave-rec" data-rec-id="${lec.recId}" title="Remove from saved">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      </div>
    `;
  }).join('');

  lecturesContainer.querySelectorAll('.btn-play-saved-rec').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-rec-id');
      const rec = list.find(r => String(r.recId) === String(id));
      if (rec) openLectureViewer(rec);
    });
  });

  lecturesContainer.querySelectorAll('.btn-unsave-rec').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-rec-id');
      toggleSavedLecture(id);
      renderSavedLectures();
    });
  });
}

// Render Saved Notes & PDFs
function renderSavedNotes() {
  if (!notesContainer) return;
  let allNotes = [];
  try {
    Object.keys(MASTER_NOTES_BY_SUBJECT || {}).forEach(subKey => {
      const notes = MASTER_NOTES_BY_SUBJECT[subKey];
      if (Array.isArray(notes)) {
        notes.forEach(n => {
          allNotes.push({ ...n, subject: subKey });
        });
      }
    });
  } catch {}

  // Take first 12 curated high-yield clinical notes & brochures as baseline saved resources
  const savedNotesList = allNotes.slice(0, 14);
  if (countNotesEl) countNotesEl.textContent = savedNotesList.length;

  const q = searchQuery.trim().toLowerCase();
  const filtered = savedNotesList.filter(n => {
    if (!q) return true;
    return `${n.title} ${n.subject} ${n.topic || ''}`.toLowerCase().includes(q);
  });

  if (filtered.length === 0) {
    notesContainer.innerHTML = `
      <div class="notes-empty-state" style="padding: 2.5rem 1rem; text-align: center; width: 100%; grid-column: 1 / -1;">
        <div style="width: 52px; height: 52px; margin: 0 auto 0.85rem; border-radius: 16px; background: rgba(56,189,248,0.18); border: 1px solid rgba(56,189,248,0.3); display: flex; align-items: center; justify-content: center; color: #38BDF8;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <p class="apk-empty-title" style="font-weight: 700; font-size: 15px; margin: 0 0 4px; color: var(--text-primary);">No saved notes</p>
        <p style="font-size: 12px; color: var(--text-secondary); margin: 0;">Save lecture notes and high-yield clinical PDFs from the Notes tab.</p>
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
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
            <span class="note-doc-badge" style="background:rgba(56,189,248,0.18);color:#38BDF8;font-size:10px;font-weight:700;padding:2px 8px;border-radius:6px;">PDF NOTE</span>
            <span style="font-size:11px;color:var(--text-secondary);">${n.subject}</span>
          </div>
          <h4 class="note-doc-title" style="font-size:13.5px;font-weight:700;margin:0 0 6px;color:var(--text-primary);">${cleanTitle}</h4>
        </div>
        <div class="note-doc-actions" style="display:flex;align-items:center;gap:6px;margin-top:8px;">
          <button type="button" class="btn-note-view btn-preview-saved-pdf" data-title="${encodeURIComponent(cleanTitle)}" data-url="${encodeURIComponent(n.url || '')}" data-filename="${encodeURIComponent(downloadName)}" style="padding:6px 12px;font-size:11.5px;border-radius:8px;font-weight:700;cursor:pointer;">
            <span>View PDF</span>
          </button>
          <a href="${n.url || '#'}" target="_blank" rel="noopener noreferrer" download="${downloadName}" class="btn-note-download" style="padding:6px 12px;font-size:11.5px;border-radius:8px;font-weight:700;display:inline-flex;align-items:center;gap:4px;">
            <span>Download</span>
          </a>
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
}

// Render Saved Question Banks
function renderSavedTests() {
  if (!testsContainer) return;
  const sampleBanks = [
    { id: 'norcet-qb-01', title: 'NORCET 07 Prelims & Mains Full Question Bank', questions: 200, duration: '180 mins', category: 'Live Mock Series' },
    { id: 'pharmacology-qb', title: 'Clinical Pharmacology High-Yield Question Bank', questions: 120, duration: '90 mins', category: 'Subject Series' },
    { id: 'msn-high-yield-qb', title: 'Medical Surgical Nursing Priority Clinical Q-Set', questions: 150, duration: '120 mins', category: 'High-Yield Bank' },
    { id: 'pediatric-obg-qb', title: 'OBG & Pediatric Nursing Golden 100 MCQs', questions: 100, duration: '80 mins', category: 'Practice Set' }
  ];

  if (countTestsEl) countTestsEl.textContent = sampleBanks.length;

  const q = searchQuery.trim().toLowerCase();
  const filtered = sampleBanks.filter(t => {
    if (!q) return true;
    return `${t.title} ${t.category}`.toLowerCase().includes(q);
  });

  if (filtered.length === 0) {
    testsContainer.innerHTML = `
      <div class="notes-empty-state" style="padding: 2.5rem 1rem; text-align: center; width: 100%; grid-column: 1 / -1;">
        <p class="apk-empty-title" style="font-weight: 700; font-size: 15px; margin: 0 0 4px; color: var(--text-primary);">No saved question banks</p>
        <p style="font-size: 12px; color: var(--text-secondary); margin: 0;">Bookmark practice tests and question sets from the Tests tab.</p>
      </div>
    `;
    return;
  }

  testsContainer.innerHTML = filtered.map((test, idx) => `
    <div class="test-card apk-card-arrange" style="--card-i: ${idx}; padding: 14px; border-radius: 14px; background: rgba(30, 24, 52, 0.65); border: 1px solid rgba(142, 116, 229, 0.22); display: flex; flex-direction: column; justify-content: space-between; gap: 10px;">
      <div>
        <span style="font-size: 10.5px; font-weight: 700; color: var(--accent); background: rgba(142, 116, 229, 0.16); padding: 2px 8px; border-radius: 6px;">${test.category}</span>
        <h4 style="font-size: 14px; font-weight: 700; color: var(--text-primary); margin: 8px 0 4px;">${test.title}</h4>
        <div style="font-size: 11.5px; color: var(--text-secondary); display: flex; gap: 8px;">
          <span>${test.questions} Questions</span>
          <span>•</span>
          <span>${test.duration}</span>
        </div>
      </div>
      <button type="button" class="btn" onclick="window.location.href='/tests.html'" style="width: 100%; height: 36px; border-radius: 9px; font-size: 12.5px; font-weight: 700; background: linear-gradient(135deg, #8E74E5 0%, #7C5CE0 100%); color: #fff; border: none; cursor: pointer;">
        Start Question Bank
      </button>
    </div>
  `).join('');
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
