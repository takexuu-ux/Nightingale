// 3rd Year B.Sc Nursing — PYQ Predictor & Question Papers Logic
// Architected for NTRUHS / MPMSU Previous Year Questions & High Yield Answers

import './apk/apk-shell.js';
import './pyqs.css';
import { PYQ_SUBJECTS_DATA } from './data/pyqMasterData.js';
import { PYQ_EXTENDED_TOPICS } from './data/pyqExtendedData.js';

// Merge extended 2x & 1x topics into each subject seamlessly
Object.keys(PYQ_EXTENDED_TOPICS).forEach((subKey) => {
  if (PYQ_SUBJECTS_DATA[subKey] && Array.isArray(PYQ_SUBJECTS_DATA[subKey].topics)) {
    const existingIds = new Set(PYQ_SUBJECTS_DATA[subKey].topics.map((t) => t.id));
    PYQ_EXTENDED_TOPICS[subKey].forEach((extTopic) => {
      if (!existingIds.has(extTopic.id)) {
        PYQ_SUBJECTS_DATA[subKey].topics.push(extTopic);
      }
    });
  }
});

let currentSubjectId = 'msn';
let currentMode = 'priority'; // 'priority' | 'papers'

// DOM Elements
const subjectSelectorEl = document.getElementById('pyq-subject-selector');
const modePriorityBtn = document.getElementById('pyq-mode-priority');
const modePapersBtn = document.getElementById('pyq-mode-papers');
const prioritySectionEl = document.getElementById('pyq-priority-section');
const papersSectionEl = document.getElementById('pyq-papers-section');
const topicsListEl = document.getElementById('pyq-topics-list');
const papersGridEl = document.getElementById('pyq-papers-grid');

// PDF Modal Elements
const pdfModal = document.getElementById('pyq-pdf-modal');
const pdfModalTitle = document.getElementById('pyq-pdf-modal-title');
const pdfModalDownload = document.getElementById('pyq-pdf-modal-download');
const pdfModalClose = document.getElementById('pyq-pdf-modal-close');
const pdfCanvas = document.getElementById('pyq-pdf-canvas');
const pdfLoadingEl = document.getElementById('pyq-pdf-loading');
const pdfPrevBtn = document.getElementById('pdf-prev-page');
const pdfNextBtn = document.getElementById('pdf-next-page');
const pdfPageNumEl = document.getElementById('pdf-page-num');
const pdfZoomInBtn = document.getElementById('pdf-zoom-in');
const pdfZoomOutBtn = document.getElementById('pdf-zoom-out');

// PDF.js State
let currentPdfDoc = null;
let currentPdfPage = 1;
let totalPdfPages = 1;
let currentZoomScale = 1.0;
let isRenderingPdfPage = false;
let pendingPdfPage = null;

function init() {
  // Parse URL query parameter if present
  const params = new URLSearchParams(window.location.search);
  const requestedSub = params.get('subject');
  if (requestedSub && PYQ_SUBJECTS_DATA[requestedSub]) {
    currentSubjectId = requestedSub;
  }
  const requestedMode = params.get('mode');
  if (requestedMode === 'papers') {
    currentMode = 'papers';
  }

  // Setup PDF.js worker
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/vendor/pdfjs/pdf.worker.min.js';
  }

  renderSubjectChips();
  setupModeSwitchers();
  setupPdfModalControls();
  updateView();
}

function renderSubjectChips() {
  if (!subjectSelectorEl) return;
  subjectSelectorEl.innerHTML = '';

  Object.values(PYQ_SUBJECTS_DATA).forEach((sub) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = `pyq-sub-chip ${sub.id === currentSubjectId ? 'active' : ''}`;
    chip.setAttribute('data-sub-id', sub.id);
    // Clean label only: no topic count
    chip.innerHTML = `<span>${sub.shortName}</span>`;
    chip.addEventListener('click', () => {
      if (currentSubjectId === sub.id) return;
      currentSubjectId = sub.id;
      // Update chips UI
      subjectSelectorEl.querySelectorAll('.pyq-sub-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      updateView();
    });
    subjectSelectorEl.appendChild(chip);
  });
}

function setupModeSwitchers() {
  if (modePriorityBtn && modePapersBtn) {
    modePriorityBtn.addEventListener('click', () => {
      if (currentMode === 'priority') return;
      currentMode = 'priority';
      modePriorityBtn.classList.add('active');
      modePapersBtn.classList.remove('active');
      updateView();
    });

    modePapersBtn.addEventListener('click', () => {
      if (currentMode === 'papers') return;
      currentMode = 'papers';
      modePapersBtn.classList.add('active');
      modePriorityBtn.classList.remove('active');
      updateView();
    });
  }
}

export function triggerFileDownload(url, title, filename) {
  const cleanTitle = title || 'Question Paper PDF';
  const cleanName = filename || 'question_paper.pdf';

  if (window.AndroidBridge && typeof window.AndroidBridge.downloadPdf === 'function') {
    try {
      window.AndroidBridge.downloadPdf(url, cleanTitle, cleanName);
      return;
    } catch (e) {
      console.warn('AndroidBridge download error:', e);
    }
  }
  if (window.AndroidVideoBridge && typeof window.AndroidVideoBridge.downloadPdf === 'function') {
    try {
      window.AndroidVideoBridge.downloadPdf(url, cleanTitle, cleanName);
      return;
    } catch (e) {
      console.warn('AndroidVideoBridge download error:', e);
    }
  }

  const a = document.createElement('a');
  a.href = url;
  a.download = cleanName;
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

window.triggerFileDownload = triggerFileDownload;

function setupPdfModalControls() {
  if (!pdfModal) return;

  const closeModal = () => {
    pdfModal.classList.remove('open');
    currentPdfDoc = null;
    currentPdfPage = 1;
    currentZoomScale = 1.0;
    if (pdfCanvas) {
      const ctx = pdfCanvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);
    }
  };

  if (pdfModalClose) {
    pdfModalClose.addEventListener('click', closeModal);
  }

  if (pdfModalDownload) {
    pdfModalDownload.addEventListener('click', (e) => {
      e.preventDefault();
      const url = pdfModalDownload.getAttribute('data-url') || pdfModalDownload.href;
      const title = pdfModalTitle ? pdfModalTitle.textContent : 'Question Paper';
      const filename = pdfModalDownload.getAttribute('download') || 'question_paper.pdf';
      triggerFileDownload(url, title, filename);
    });
  }

  if (pdfPrevBtn) {
    pdfPrevBtn.addEventListener('click', () => {
      if (currentPdfPage > 1) {
        currentPdfPage--;
        queueRenderPage(currentPdfPage);
      }
    });
  }

  if (pdfNextBtn) {
    pdfNextBtn.addEventListener('click', () => {
      if (currentPdfPage < totalPdfPages) {
        currentPdfPage++;
        queueRenderPage(currentPdfPage);
      }
    });
  }

  if (pdfZoomInBtn) {
    pdfZoomInBtn.addEventListener('click', () => {
      if (currentZoomScale < 2.5) {
        currentZoomScale += 0.25;
        queueRenderPage(currentPdfPage);
      }
    });
  }

  if (pdfZoomOutBtn) {
    pdfZoomOutBtn.addEventListener('click', () => {
      if (currentZoomScale > 0.6) {
        currentZoomScale -= 0.25;
        queueRenderPage(currentPdfPage);
      }
    });
  }

  pdfModal.addEventListener('click', (e) => {
    if (e.target === pdfModal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pdfModal.classList.contains('open')) {
      closeModal();
    }
  });
}

function queueRenderPage(num) {
  if (isRenderingPdfPage) {
    pendingPdfPage = num;
  } else {
    renderPdfPage(num);
  }
}

async function renderPdfPage(num) {
  if (!currentPdfDoc || !pdfCanvas) return;
  isRenderingPdfPage = true;

  try {
    const page = await currentPdfDoc.getPage(num);
    const container = document.getElementById('pyq-pdf-body');
    const containerWidth = container ? container.clientWidth - 32 : window.innerWidth - 48;
    const baseWidth = Math.min(Math.max(containerWidth, 320), 860);

    const unscaledViewport = page.getViewport({ scale: 1 });
    const computedScale = (baseWidth / unscaledViewport.width) * currentZoomScale;
    const viewport = page.getViewport({ scale: computedScale });

    const ctx = pdfCanvas.getContext('2d');
    pdfCanvas.height = viewport.height;
    pdfCanvas.width = viewport.width;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };

    await page.render(renderContext).promise;
  } catch (err) {
    console.error('Error rendering PDF page:', err);
  } finally {
    isRenderingPdfPage = false;
    if (pdfPageNumEl) {
      pdfPageNumEl.textContent = `${num} / ${totalPdfPages}`;
    }
    if (pdfLoadingEl) {
      pdfLoadingEl.style.display = 'none';
    }
    if (pendingPdfPage !== null) {
      const p = pendingPdfPage;
      pendingPdfPage = null;
      renderPdfPage(p);
    }
  }
}

export async function openPdfViewer(title, pdfUrl) {
  if (!pdfModal || !pdfCanvas) {
    window.open(pdfUrl, '_blank');
    return;
  }

  if (pdfModalTitle) pdfModalTitle.textContent = title;
  if (pdfModalDownload) {
    const filename = title.replace(/[^a-zA-Z0-9_-]/g, '_') + '.pdf';
    pdfModalDownload.href = pdfUrl;
    pdfModalDownload.setAttribute('data-url', pdfUrl);
    pdfModalDownload.setAttribute('download', filename);
  }

  pdfModal.classList.add('open');
  if (pdfLoadingEl) pdfLoadingEl.style.display = 'flex';
  if (pdfPageNumEl) pdfPageNumEl.textContent = '...';

  // Check if PDF.js is ready
  if (!window.pdfjsLib) {
    console.warn('PDF.js not loaded, opening URL directly');
    if (pdfLoadingEl) pdfLoadingEl.style.display = 'none';
    window.open(pdfUrl, '_blank');
    return;
  }

  try {
    const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
    currentPdfDoc = await loadingTask.promise;
    totalPdfPages = currentPdfDoc.numPages || 1;
    currentPdfPage = 1;
    currentZoomScale = 1.0;
    renderPdfPage(currentPdfPage);
  } catch (err) {
    console.error('Failed to load PDF document via PDF.js:', err);
    if (pdfLoadingEl) {
      pdfLoadingEl.innerHTML = `<span style="color:#F87171;">Failed to load PDF preview. <a href="${pdfUrl}" target="_blank" style="color:var(--pyq-accent);text-decoration:underline;">Click to download</a></span>`;
    }
  }
}

window.openPdfViewer = openPdfViewer;

function updateView() {
  const subData = PYQ_SUBJECTS_DATA[currentSubjectId];
  if (!subData) return;

  // Toggle Section Visibility
  if (currentMode === 'priority') {
    prioritySectionEl.style.display = 'block';
    papersSectionEl.style.display = 'none';
    const sorted = [...(subData.topics || [])].sort((a, b) => (b.repeatCount || 1) - (a.repeatCount || 1));
    renderPriorityTopics(sorted);
  } else {
    prioritySectionEl.style.display = 'none';
    papersSectionEl.style.display = 'block';
    renderQuestionPapers(subData.papers);
  }
}

function renderPriorityTopics(topics) {
  if (!topicsListEl) return;
  topicsListEl.innerHTML = '';

  if (!topics || topics.length === 0) {
    topicsListEl.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:30px;color:var(--pyq-text-muted);font-size:13.5px;">No questions match this filter for the selected subject.</div>';
    return;
  }

  topics.forEach((topic) => {
    const card = document.createElement('div');
    card.className = 'pyq-topic-card';
    card.id = `card-${topic.id}`;

    // Year tags
    const yearsHtml = (topic.years || []).map(y => `<span class="pyq-year-pill">${y}</span>`).join('');

    // Recurring concepts sub-list
    const conceptsHtml = (topic.subItems || []).map(item => `
      <li class="pyq-concept-item">
        <span>${item.concept}</span>
        <span class="pyq-concept-years">${item.years}</span>
      </li>
    `).join('');

    // Exam questions
    const questionsHtml = (topic.questions || []).map(q => `
      <div class="pyq-q-row">
        <div class="pyq-q-badge">${q.paperBadge} • ${q.weight}</div>
        <div class="pyq-q-text">${q.questionText}</div>
      </div>
    `).join('');

    const rep = topic.repeatCount >= 4 ? 4 : (topic.repeatCount || 1);
    const badgeLabel = rep === 1 ? '1x Asked in Exam' : `${rep}x Repeated in NTRUHS`;
    const yearsStr = (topic.years || []).join(' • ');

    card.innerHTML = `
      <div class="pyq-topic-header">
        <div class="pyq-topic-meta-row">
          <span class="pyq-freq-badge b-${rep}-repeat">
            ${badgeLabel}
          </span>
          ${yearsStr ? `<span class="pyq-year-summary">${yearsStr}</span>` : ''}
        </div>

        <h3 class="pyq-topic-title">${topic.title}</h3>

        ${conceptsHtml ? `<ul class="pyq-concepts-list">${conceptsHtml}</ul>` : ''}

        ${questionsHtml ? `
          <div class="pyq-questions-section">
            ${questionsHtml}
          </div>
        ` : ''}

        <div class="pyq-answer-action-bar">
          <button type="button" class="btn-toggle-answer">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            <span class="btn-toggle-txt">Show Answer</span>
          </button>
        </div>
      </div>

      <div class="pyq-model-answer-wrapper">
        <div class="concept-body">
          ${topic.answerHtml}
        </div>
      </div>
    `;

    // Toggle button handler
    const toggleBtn = card.querySelector('.btn-toggle-answer');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.toggle('expanded');
        const txt = card.querySelector('.btn-toggle-txt');
        if (txt) {
          txt.textContent = card.classList.contains('expanded') ? 'Hide Answer' : 'Show Answer';
        }
      });
    }

    topicsListEl.appendChild(card);
  });
}

function renderQuestionPapers(papers) {
  if (!papersGridEl) return;
  papersGridEl.innerHTML = '';

  papers.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'pyq-paper-card';
    // User requested: No emojis, no 75 marks / 3 hours bloat, clean Year & Session with View and Download
    card.innerHTML = `
      <div>
        <h4 class="pyq-paper-title">${p.year} — ${p.badge || 'Annual Exam'}</h4>
      </div>
      <div class="pyq-paper-actions">
        <button type="button" class="pyq-btn-view btn-read-paper">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <span>View</span>
        </button>
        <button type="button" class="pyq-btn-download btn-download-paper">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>Download</span>
        </button>
      </div>
    `;

    const readBtn = card.querySelector('.btn-read-paper');
    if (readBtn) {
      readBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openPdfViewer(`${p.year} ${p.badge || 'Paper'}`, p.file);
      });
    }

    const dlBtn = card.querySelector('.btn-download-paper');
    if (dlBtn) {
      dlBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const filename = `${p.year}_${p.badge || 'question_paper'}.pdf`.replace(/[^a-zA-Z0-9_.-]/g, '_');
        triggerFileDownload(p.file, `${p.year} Question Paper`, filename);
      });
    }

    papersGridEl.appendChild(card);
  });
}

// Auto init when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
