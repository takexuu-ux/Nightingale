import './apk/apk-shell.js';
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
let localOfflineMap = new Map();
let offlinePollTimer = null;
const offlinePendingReq = new Set();

let serverLectures = [];
let serverNotes = [];
let serverTests = [];

async function syncServerBookmarks() {
  const token = localStorage.getItem('nnl_access_token') || sessionStorage.getItem('nnl_access_token') || '';
  if (!token) return;

  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  try {
    const [vidRes, noteRes, hwRes, qbRes, testRes] = await Promise.allSettled([
      fetch('/api/cms/videos/bookmark/', { headers }),
      fetch('/api/cms/notes/bookmark/', { headers }),
      fetch('/api/cms/handwritten_notes/bookmark/', { headers }),
      fetch('/api/cms/question_bank/bookmark/', { headers }),
      fetch('/api/cms/test/bookmark/', { headers })
    ]);

    if (vidRes.status === 'fulfilled' && vidRes.value.ok) {
      const vJson = await vidRes.value.json().catch(() => ({}));
      const items = vJson?.data || vJson?.results || (Array.isArray(vJson) ? vJson : []);
      if (Array.isArray(items)) {
        serverLectures = items.map(it => {
          const v = it.video || it;
          return {
            id: String(v.id || it.id),
            recId: String(v.id || it.id),
            title: v.title || v.name || 'Saved Lecture',
            instructor: v.instructor || v.faculty || 'NNL Faculty',
            subject: v.subject?.name || v.subject || 'Clinical Nursing',
            duration: v.duration || v.video_duration || 'Recorded',
            thumb: v.thumbnail || v.thumb || '/nightingale.png',
            notePdfUrl: v.note_pdf || v.pdf_url || '',
            notePdfTitle: v.title ? `${v.title} Notes` : 'Class Notes'
          };
        });
      }
    }

    const mergedNotes = [];
    if (noteRes.status === 'fulfilled' && noteRes.value.ok) {
      const nJson = await noteRes.value.json().catch(() => ({}));
      const items = nJson?.data || nJson?.results || (Array.isArray(nJson) ? nJson : []);
      if (Array.isArray(items)) {
        items.forEach(it => {
          const n = it.notes || it.note || it;
          mergedNotes.push({
            id: String(n.id || it.id),
            title: n.title || n.name || 'Study Notes',
            subject: n.subject?.name || n.subject || 'Nursing Notes',
            url: n.pdf_url || n.file || n.url || '',
            pageCount: n.page_count || n.pages || ''
          });
        });
      }
    }

    if (hwRes.status === 'fulfilled' && hwRes.value.ok) {
      const hJson = await hwRes.value.json().catch(() => ({}));
      const items = hJson?.data || hJson?.results || (Array.isArray(hJson) ? hJson : []);
      if (Array.isArray(items)) {
        items.forEach(it => {
          const h = it.handwrittenNotes || it.handwritten_note || it;
          mergedNotes.push({
            id: String(h.id || it.id),
            title: h.title || h.name || 'Handwritten Notes',
            subject: h.subject?.name || h.subject || 'Specialty Note',
            url: h.pdf_url || h.file || h.url || '',
            pageCount: h.page_count || ''
          });
        });
      }
    }
    serverNotes = mergedNotes;

    const mergedTests = [];
    if (qbRes.status === 'fulfilled' && qbRes.value.ok) {
      const qJson = await qbRes.value.json().catch(() => ({}));
      const items = qJson?.data || qJson?.results || (Array.isArray(qJson) ? qJson : []);
      if (Array.isArray(items)) {
        items.forEach(it => {
          const q = it.question_bank || it.question || it;
          mergedTests.push({
            id: String(q.id || it.id),
            title: q.title || q.name || 'Question Bank',
            category: q.category || q.subject || 'QBank',
            questions: q.question_count || q.questions_count || 100,
            duration: q.duration || 'Practice'
          });
        });
      }
    }

    if (testRes.status === 'fulfilled' && testRes.value.ok) {
      const tJson = await testRes.value.json().catch(() => ({}));
      const items = tJson?.data || tJson?.results || (Array.isArray(tJson) ? tJson : []);
      if (Array.isArray(items)) {
        items.forEach(it => {
          const t = it.test || it;
          mergedTests.push({
            id: String(t.id || it.id),
            title: t.title || t.name || 'Mock Test',
            category: t.category || t.type || 'Test Series',
            questions: t.total_questions || t.question_count || 100,
            duration: t.duration || '120 mins'
          });
        });
      }
    }
    serverTests = mergedTests;

    renderSavedLectures();
    renderSavedNotes();
    renderSavedTests();
  } catch (err) {
    console.warn('[MySpace] Bookmark sync error:', err);
  }
}

const lecturesContainer = document.getElementById('saved-lectures-container');
const notesContainer = document.getElementById('saved-notes-container');
const testsContainer = document.getElementById('saved-tests-container');
const searchInput = document.getElementById('saved-search-input');

const countLecturesEl = document.getElementById('count-lectures');
const countNotesEl = document.getElementById('count-notes');
const countTestsEl = document.getElementById('count-tests');
const countAllSavedEl = document.getElementById('count-all-saved');
const countOfflineSavedEl = document.getElementById('count-offline-saved');

function hasNativeOfflineBridge() {
  return typeof window !== 'undefined' && (
    Boolean(window.AndroidVideoBridge) ||
    window.location.protocol === 'http:' ||
    window.location.protocol === 'https:'
  );
}

async function refreshLocalOffline({ reRender = false } = {}) {
  if (!hasNativeOfflineBridge()) return;
  try {
    const res = await fetch(`/__offline/list?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return;
    const json = await res.json();
    if (!json || !Array.isArray(json.items)) return;

    localOfflineMap.clear();
    let hasActive = false;
    let completedCount = 0;

    json.items.forEach(it => {
      localOfflineMap.set(String(it.recId), it);
      if (it.completed && !it.expired) completedCount++;
      if (it.status === 'pending' || it.status === 'downloading') hasActive = true;
    });

    if (countOfflineSavedEl) countOfflineSavedEl.textContent = completedCount;

    if (hasActive && !offlinePollTimer) {
      offlinePollTimer = setInterval(() => refreshLocalOffline({ reRender: false }), 900);
    } else if (!hasActive && offlinePollTimer) {
      clearInterval(offlinePollTimer);
      offlinePollTimer = null;
    }

    // Live update percentage badges directly in DOM
    if (hasActive) {
      json.items.forEach(it => {
        const badge = document.querySelector(`.sd-device-offline-tag[data-rec-id="${it.recId}"]`);
        if (badge) {
          if (it.status === 'downloading') {
            const pct = Math.round(it.percent || 0);
            badge.className = 'sd-device-offline-tag is-downloading';
            badge.innerHTML = `<svg class="sd-spin" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg> <span>Downloading ${pct}%</span>`;
          } else if (it.completed && !it.expired) {
            badge.className = 'sd-device-offline-tag is-downloaded';
            badge.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> <span>Downloaded on this Device</span>`;
          }
        }
      });
    }

    if (reRender && activeSavedTab === 'lectures') {
      renderSavedLectures();
    }
  } catch (_) {}
}

async function startOfflineLectureDownload(rec, btnEl) {
  if (!rec || !rec.id) return;
  const key = String(rec.id);
  if (offlinePendingReq.has(key)) return;
  offlinePendingReq.add(key);

  if (btnEl) {
    btnEl.disabled = true;
    btnEl.innerHTML = `<span>Queuing...</span>`;
    btnEl.classList.add('is-downloading');
  }

  try {
    const cred = await fetchOfflineVdoCipherOtp(rec.id, { isBatch103: true }).catch(() =>
      fetchOfflineVdoCipherOtp(rec.id, { isBatch103: false })
    );
    if (!cred || !cred.otp || !cred.playbackInfo) {
      throw new Error('Could not fetch offline credentials');
    }

    const startRes = await fetch('/__offline/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recId: String(rec.id),
        mediaId: cred.mediaId || '',
        otp: cred.otp,
        playbackInfo: cred.playbackInfo,
        title: rec.title || 'Recorded Lecture',
        instructor: rec.instructor || 'NNL Faculty',
        subject: rec.subject || ''
      })
    });
    const startJson = await startRes.json();
    if (!startJson.ok) throw new Error(startJson.error || 'Could not queue download');
    await refreshLocalOffline({ reRender: true });
  } catch (err) {
    if (btnEl) {
      btnEl.disabled = false;
      btnEl.title = err.message;
      btnEl.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg><span>Retry Download</span>`;
      btnEl.classList.remove('is-downloading');
    }
    console.warn(`[Offline] Download error: ${err.message}`);
  } finally {
    offlinePendingReq.delete(key);
  }
}

async function deleteOfflineMedia(recId) {
  try {
    await fetch('/__offline/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recId: String(recId) })
    });
    localOfflineMap.delete(String(recId));
    await refreshLocalOffline({ reRender: false });
  } catch (_) {}
}

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

function triggerFileDownload(url, title, filename) {
  if (!url) return;
  const cleanTitle = (title || 'Study Notes').trim();
  const cleanName = (filename || 'study_notes.pdf').trim();

  if (window.AndroidBridge && typeof window.AndroidBridge.downloadPdf === 'function') {
    try {
      window.AndroidBridge.downloadPdf(url, cleanTitle, cleanName);
      return;
    } catch (_) {}
  }
  if (window.AndroidVideoBridge && typeof window.AndroidVideoBridge.downloadPdf === 'function') {
    try {
      window.AndroidVideoBridge.downloadPdf(url, cleanTitle, cleanName);
      return;
    } catch (_) {}
  }

  fetch(url)
    .then(r => r.blob())
    .then(blob => {
      const bUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = bUrl;
      a.download = cleanName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { a.remove(); URL.revokeObjectURL(bUrl); }, 1500);
    })
    .catch(() => window.open(url, '_blank'));
}

function openPdfPreview(title, url, downloadName = '') {
  if (!pdfModal) return;
  if (pdfModalTitle) pdfModalTitle.textContent = title;
  if (pdfModalDownloadBtn) {
    pdfModalDownloadBtn.href = url;
    if (downloadName) pdfModalDownloadBtn.setAttribute('download', downloadName);
    pdfModalDownloadBtn.onclick = (e) => {
      e.preventDefault();
      triggerFileDownload(url, title, downloadName);
    };
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
async function openLectureViewer(rec) {
  if (!rec) return;
  const recId = rec.recId || rec.id;
  const tk = localStorage.getItem('nnl_access_token') || '';

  // If in native Android app, directly play through native VdoPlayerActivity
  if (window.AndroidVideoBridge && typeof window.AndroidVideoBridge.playVideoWithAuth === 'function') {
    let currentOtp = rec.otp || '';
    let currentPb = rec.playbackInfo || '';

    if ((!currentOtp || !currentPb) && recId) {
      try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2200));
        const fetchPromise = fetchFreshVdoCipherOtp(recId, { isBatch103: true }).catch(() =>
          fetchFreshVdoCipherOtp(recId, { isBatch103: false })
        );
        const fresh = await Promise.race([fetchPromise, timeoutPromise]);
        if (fresh && fresh.otp && fresh.playbackInfo) {
          currentOtp = fresh.otp;
          currentPb = fresh.playbackInfo;
          rec.otp = currentOtp;
          rec.playbackInfo = currentPb;
        }
      } catch (_) {}
    }

    window.AndroidVideoBridge.playVideoWithAuth(
      currentOtp,
      currentPb,
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

function formatDurationLabel(dur) {
  if (!dur) return 'Recorded';
  if (typeof dur === 'string') {
    const clean = dur.trim();
    if (clean.toLowerCase().includes('min') || clean.toLowerCase().includes('hr') || clean.toLowerCase().includes('sec')) {
      return clean;
    }
    const num = parseFloat(clean);
    if (!isNaN(num) && num > 0) {
      return num > 300 ? `${Math.round(num / 60)} mins` : `${Math.round(num)} mins`;
    }
    return clean || 'Recorded';
  }
  if (typeof dur === 'number' && !isNaN(dur) && dur > 0) {
    return dur > 300 ? `${Math.round(dur / 60)} mins` : `${Math.round(dur)} mins`;
  }
  return 'Recorded';
}

function getAllSavedLectures() {
  const local = getSavedLecturesList();
  const map = new Map();
  serverLectures.forEach(l => map.set(String(l.id || l.recId), l));
  local.forEach(l => map.set(String(l.id || l.recId), l));
  return Array.from(map.values());
}

// Render Saved Lectures
function renderSavedLectures() {
  if (!lecturesContainer) return;
  const list = getAllSavedLectures();
  if (countLecturesEl) countLecturesEl.textContent = list.length;
  if (countAllSavedEl) countAllSavedEl.textContent = list.length;

  let completedOfflineCount = 0;
  list.forEach(item => {
    const recId = String(item.id || item.recId || '');
    const off = localOfflineMap.get(recId);
    if (off && off.completed && !off.expired) completedOfflineCount++;
  });
  if (countOfflineSavedEl) countOfflineSavedEl.textContent = completedOfflineCount;

  const q = searchQuery.trim().toLowerCase();
  const filtered = list.filter(item => {
    if (!q) return true;
    return `${item.title} ${item.instructor} ${item.subject}`.toLowerCase().includes(q);
  });

  if (filtered.length === 0) {
    const token = localStorage.getItem('nnl_access_token');
    const authHint = !token
      ? `<p style="font-size: 11px; margin-top: 8px;"><a href="/" style="color: var(--accent); text-decoration: underline;">Log In with Mobile</a> to sync your saved classes from the official app.</p>`
      : '';
    lecturesContainer.innerHTML = `
      <div class="notes-empty-state" style="padding: 2.5rem 1rem; text-align: center; width: 100%;">
        <div style="width: 52px; height: 52px; margin: 0 auto 0.85rem; border-radius: 16px; background: rgba(142,116,229,0.18); border: 1px solid rgba(167,139,250,0.3); display: flex; align-items: center; justify-content: center; color: var(--accent);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="6 4 20 12 6 20 6 4"/></svg>
        </div>
        <p class="apk-empty-title" style="font-weight: 700; font-size: 15px; margin: 0 0 4px; color: var(--text-primary);">No saved lectures</p>
        <p style="font-size: 12px; color: var(--text-secondary); margin: 0;">Bookmark classes from Videos or Home to access them here.</p>
        ${authHint}
      </div>
    `;
    return;
  }

  lecturesContainer.innerHTML = filtered.map((lec, idx) => {
    const thumb = lec.thumb || '/nightingale.png';
    const duration = formatDurationLabel(lec.duration);
    const recIdClean = String(lec.id || lec.recId || '');
    const off = localOfflineMap.get(recIdClean);
    const isOfflineHere = Boolean(off && off.completed && !off.expired);
    const isDownloadingHere = Boolean(off && (off.status === 'downloading' || off.status === 'pending'));

    let offlineBadgeHtml = '';
    if (isOfflineHere) {
      const mb = off.totalSizeBytes > 0 ? ` • ${(off.totalSizeBytes / (1024 * 1024)).toFixed(1)} MB` : '';
      offlineBadgeHtml = `
        <span class="sd-device-offline-tag is-downloaded" data-rec-id="${recIdClean}">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Downloaded on this Device${mb}</span>
        </span>
      `;
    } else if (isDownloadingHere) {
      const pct = Math.round(off.percent || 0);
      offlineBadgeHtml = `
        <span class="sd-device-offline-tag is-downloading" data-rec-id="${recIdClean}">
          <svg class="sd-spin" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
          <span>Downloading ${pct}%</span>
        </span>
      `;
    } else if (hasNativeOfflineBridge()) {
      offlineBadgeHtml = `
        <span class="sd-device-offline-tag is-cloud" data-rec-id="${recIdClean}">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
          <span>Cloud Bookmark</span>
        </span>
      `;
    }

    const downloadBtnHtml = (!isOfflineHere && !isDownloadingHere && hasNativeOfflineBridge()) ? `
      <button type="button" class="sd-mini-pill btn-download-this-device" data-rec-id="${recIdClean}" title="Download to this device">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        <span>Download</span>
      </button>
    ` : '';

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
            ${offlineBadgeHtml}
          </div>
          <div class="sd-lecture-top-line">
            <span class="sd-lecture-title" title="${lec.title}">${lec.title}</span>
          </div>
          <div class="sd-lecture-sub-line">
            <span class="sd-lecture-progress-label">${duration}</span>
            <div class="sd-lecture-actions">
              ${downloadBtnHtml}
              <button type="button" class="sd-mini-pill btn-unsave-rec" data-rec-id="${recIdClean}" title="Remove from saved" style="padding: 6px 12px; font-size: 12px; font-weight: 600; min-height: 28px; background: rgba(239, 68, 68, 0.12); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.32); border-radius: 8px; display: inline-flex; align-items: center; gap: 5px; cursor: pointer;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  lecturesContainer.querySelectorAll('.sd-lecture-card[data-rec-id]').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.btn-unsave-rec') || e.target.closest('.btn-download-this-device')) return;
      const id = el.getAttribute('data-rec-id');
      const rec = list.find(r => String(r.id || r.recId) === String(id));
      if (rec) openLectureViewer(rec);
    });
  });

  lecturesContainer.querySelectorAll('.btn-download-this-device').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-rec-id');
      const rec = list.find(r => String(r.id || r.recId) === String(id));
      if (rec) startOfflineLectureDownload(rec, btn);
    });
  });

  lecturesContainer.querySelectorAll('.btn-unsave-rec').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-rec-id');
      if (id && id !== 'undefined' && id !== 'null') {
        toggleSavedLecture(id);
        deleteOfflineMedia(id);
        serverLectures = serverLectures.filter(l => String(l.id || l.recId) !== String(id));
        const token = localStorage.getItem('nnl_access_token');
        if (token) {
          fetch(`/api/cms/videos/bookmark/${id}/`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          }).catch(() => {});
        }
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

function getAllSavedNotes() {
  const local = getSavedNotesList();
  const map = new Map();
  serverNotes.forEach(n => map.set(String(n.id || n.url || n.title), n));
  local.forEach(n => map.set(String(n.id || n.url || n.title), n));
  return Array.from(map.values());
}

function getAllSavedTests() {
  const local = getSavedTestsList();
  const map = new Map();
  serverTests.forEach(t => map.set(String(t.id || t.title), t));
  local.forEach(t => map.set(String(t.id || t.title), t));
  return Array.from(map.values());
}

// Render Saved Notes & PDFs (Shows notes saved by user + synchronized from NNL account)
function renderSavedNotes() {
  if (!notesContainer) return;
  const savedNotesList = getAllSavedNotes();
  if (countNotesEl) countNotesEl.textContent = savedNotesList.length;

  const q = searchQuery.trim().toLowerCase();
  const filtered = savedNotesList.filter(n => {
    if (!q) return true;
    return `${n.title} ${n.subject || ''} ${n.topic || ''}`.toLowerCase().includes(q);
  });

  if (filtered.length === 0) {
    const token = localStorage.getItem('nnl_access_token');
    const authHint = !token
      ? `<p style="font-size: 11px; margin-top: 8px;"><a href="/" style="color: var(--accent); text-decoration: underline;">Log In with Mobile</a> to sync your saved notes from your account.</p>`
      : '';
    notesContainer.innerHTML = `
      <div class="notes-empty-state" style="padding: 2.5rem 1rem; text-align: center; width: 100%; grid-column: 1 / -1;">
        <div style="width: 52px; height: 52px; margin: 0 auto 0.85rem; border-radius: 16px; background: rgba(56,189,248,0.18); border: 1px solid rgba(56,189,248,0.3); display: flex; align-items: center; justify-content: center; color: #38BDF8;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <p class="apk-empty-title" style="font-weight: 700; font-size: 15px; margin: 0 0 4px; color: var(--text-primary);">No saved notes</p>
        <p style="font-size: 12px; color: var(--text-secondary); margin: 0;">Save notes from the Notes tab to view them here.</p>
        ${authHint}
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
      serverNotes = serverNotes.filter(n => String(n.id || n.url || n.title) !== String(id));
      const token = localStorage.getItem('nnl_access_token');
      if (token && id) {
        fetch(`/api/cms/notes/bookmark/${id}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => {});
      }
      renderSavedNotes();
    });
  });
}

// Render Saved Question Banks (Shows question banks saved by user + synchronized from NNL account)
function renderSavedTests() {
  if (!testsContainer) return;
  const savedBanks = getAllSavedTests();
  if (countTestsEl) countTestsEl.textContent = savedBanks.length;

  const q = searchQuery.trim().toLowerCase();
  const filtered = savedBanks.filter(t => {
    if (!q) return true;
    return `${t.title} ${t.category || ''}`.toLowerCase().includes(q);
  });

  if (filtered.length === 0) {
    const token = localStorage.getItem('nnl_access_token');
    const authHint = !token
      ? `<p style="font-size: 11px; margin-top: 8px;"><a href="/" style="color: var(--accent); text-decoration: underline;">Log In with Mobile</a> to sync your saved tests and QBanks from your account.</p>`
      : '';
    testsContainer.innerHTML = `
      <div class="notes-empty-state" style="padding: 2.5rem 1rem; text-align: center; width: 100%; grid-column: 1 / -1;">
        <div style="width: 52px; height: 52px; margin: 0 auto 0.85rem; border-radius: 16px; background: rgba(142,116,229,0.18); border: 1px solid rgba(142,116,229,0.3); display: flex; align-items: center; justify-content: center; color: var(--accent);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </div>
        <p class="apk-empty-title" style="font-weight: 700; font-size: 15px; margin: 0 0 4px; color: var(--text-primary);">No saved question banks</p>
        <p style="font-size: 12px; color: var(--text-secondary); margin: 0;">Bookmark question banks from the Tests tab to practice them here.</p>
        ${authHint}
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
      serverTests = serverTests.filter(t => String(t.id || t.title) !== String(id));
      const token = localStorage.getItem('nnl_access_token');
      if (token && id) {
        fetch(`/api/cms/test/bookmark/${id}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => {});
      }
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

function renderMySpaceAnalytics() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIdx = (new Date().getDay() + 6) % 7; // 0 for Mon, 6 for Sun
  
  let streakData = { count: 5, activeDays: [0, 1, 2, 3, 4] };
  try {
    const raw = localStorage.getItem('nnl_user_streak');
    if (raw) streakData = JSON.parse(raw);
  } catch {}

  const streakNumEl = document.getElementById('myspace-streak-number');
  if (streakNumEl) streakNumEl.textContent = streakData.count || 5;

  const trackEl = document.getElementById('myspace-days-track');
  if (trackEl) {
    trackEl.innerHTML = days.map((d, idx) => {
      const isCompleted = (streakData.activeDays || [0, 1, 2, 3, 4]).includes(idx);
      const isToday = idx === todayIdx;
      return `
        <div class="myspace-day-item">
          <div class="myspace-day-bubble ${isCompleted ? 'completed' : ''} ${isToday ? 'today' : ''}">
            ${isCompleted ? '✓' : ''}
          </div>
          <span class="myspace-day-label">${d}</span>
        </div>
      `;
    }).join('');
  }

  // Load performance statistics
  let perf = {
    testsAttempted: 14,
    avgScore: 78,
    accuracy: 82,
    questionsSolved: 210
  };
  try {
    const rawPerf = localStorage.getItem('nnl_user_performance');
    if (rawPerf) perf = { ...perf, ...JSON.parse(rawPerf) };
  } catch {}

  const elTests = document.getElementById('stat-tests-attempted');
  const elScore = document.getElementById('stat-avg-score');
  const elAcc = document.getElementById('stat-accuracy');
  const elQues = document.getElementById('stat-questions-solved');

  if (elTests) elTests.textContent = perf.testsAttempted;
  if (elScore) elScore.textContent = `${perf.avgScore}%`;
  if (elAcc) elAcc.textContent = `${perf.accuracy}%`;
  if (elQues) elQues.textContent = perf.questionsSolved;
}

// Initialize
renderMySpaceAnalytics();
renderSavedLectures();
renderSavedNotes();
renderSavedTests();
refreshLocalOffline({ reRender: true });
syncServerBookmarks();
