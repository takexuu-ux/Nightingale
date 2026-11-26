// 3rd Year B.Sc Nursing — PYQ Predictor & Question Papers Logic
// Architected for NTRUHS / MPMSU Previous Year Questions & High Yield Answers

import './apk/apk-shell.js';
import './pyqs.css';
import { PYQ_SUBJECTS_DATA } from './data/pyqMasterData.js';
import { getPdfPreviewSrc } from './config/appMode.js';

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

// Hero Stats Elements
const statTotalPapersEl = document.getElementById('pyq-stat-total-papers');
const statRepeatTopicsEl = document.getElementById('pyq-stat-repeat-topics');
const statGuaranteedEl = document.getElementById('pyq-stat-guaranteed');
const currentSubjectTitleEl = document.getElementById('pyq-current-subject-title');
const currentSubjectDescEl = document.getElementById('pyq-current-subject-desc');

// PDF Modal Elements
const pdfModal = document.getElementById('pyq-pdf-modal');
const pdfModalIframe = document.getElementById('pyq-pdf-iframe');
const pdfModalTitle = document.getElementById('pyq-pdf-modal-title');
const pdfModalDownload = document.getElementById('pyq-pdf-modal-download');
const pdfModalClose = document.getElementById('pyq-pdf-modal-close');

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

  renderSubjectChips();
  setupModeSwitchers();
  setupPdfModal();
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
    chip.innerHTML = `
      <span>${sub.shortName}</span>
      <span style="font-size:10px;opacity:0.8;font-weight:600;">(${sub.topics.length} Topics)</span>
    `;
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

function setupPdfModal() {
  if (!pdfModal) return;

  const closeModal = () => {
    pdfModal.classList.remove('open');
    if (pdfModalIframe) pdfModalIframe.src = 'about:blank';
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

  pdfModal.addEventListener('click', (e) => {
    if (e.target === pdfModal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pdfModal.classList.contains('open')) {
      closeModal();
    }
  });
}

export function openPdfViewer(title, pdfUrl) {
  if (!pdfModal || !pdfModalIframe) {
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
  // Use Nightingale PDF preview source resolver
  const viewerSrc = getPdfPreviewSrc(pdfUrl);
  pdfModalIframe.src = viewerSrc;
  pdfModal.classList.add('open');
}

function updateView() {
  const subData = PYQ_SUBJECTS_DATA[currentSubjectId];
  if (!subData) return;

  // Update Hero Titles and Stats
  if (currentSubjectTitleEl) currentSubjectTitleEl.textContent = subData.name;
  if (currentSubjectDescEl) currentSubjectDescEl.textContent = subData.desc;

  const totalTopics = subData.topics.length;
  const guaranteedTopics = subData.topics.filter(t => t.repeatCount >= 4).length;

  if (statTotalPapersEl) statTotalPapersEl.textContent = '4 Papers';
  if (statRepeatTopicsEl) statRepeatTopicsEl.textContent = `${totalTopics} Topics`;
  if (statGuaranteedEl) statGuaranteedEl.textContent = `${guaranteedTopics} Guaranteed`;

  // Toggle Section Visibility
  if (currentMode === 'priority') {
    prioritySectionEl.style.display = 'block';
    papersSectionEl.style.display = 'none';
    renderPriorityTopics(subData.topics);
  } else {
    prioritySectionEl.style.display = 'none';
    papersSectionEl.style.display = 'block';
    renderQuestionPapers(subData.papers);
  }
}

function renderPriorityTopics(topics) {
  if (!topicsListEl) return;
  topicsListEl.innerHTML = '';

  topics.forEach((topic, idx) => {
    const card = document.createElement('div');
    card.className = 'pyq-topic-card';
    card.id = `card-${topic.id}`;

    // Year badges HTML
    const yearsHtml = (topic.years || []).map(y => `<span class="pyq-year-pill">${y}</span>`).join('');

    // Concepts sub-list HTML
    const conceptsHtml = (topic.subItems || []).map(item => `
      <li class="pyq-concept-item">
        <span>${item.concept}</span>
        <span class="pyq-concept-years">${item.years}</span>
      </li>
    `).join('');

    // Exam questions HTML
    const questionsHtml = (topic.questions || []).map(q => `
      <div class="pyq-q-item">
        <div class="pyq-q-header">
          <span class="pyq-q-paper-badge">${q.paperBadge}</span>
          <span class="pyq-q-weight">${q.weight}</span>
        </div>
        <div class="pyq-q-text">${q.questionText}</div>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="pyq-topic-header">
        <div class="pyq-topic-topbar">
          <div class="pyq-topic-badges">
            <span class="pyq-badge-chip ${topic.tierClass}">
              ${topic.repeatCount >= 4 ? '🔥' : '⭐'} ${topic.repeatCount}x Repeated (${topic.probability}% Probability)
            </span>
            <span class="pyq-badge-chip" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:var(--pyq-text-muted);">
              ${topic.priorityTier}
            </span>
          </div>
          <div class="pyq-years-list">
            ${yearsHtml}
          </div>
        </div>

        <div class="pyq-topic-title-row">
          <h3 class="pyq-topic-title">${topic.title}</h3>
          <div class="pyq-topic-chevron" aria-label="Toggle answer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>

        ${conceptsHtml ? `<ul class="pyq-concepts-list">${conceptsHtml}</ul>` : ''}

        ${questionsHtml ? `
          <div class="pyq-exam-questions-box">
            <div class="pyq-questions-label">Exact Exam Questions (${topic.questions.length})</div>
            ${questionsHtml}
          </div>
        ` : ''}

        <div style="margin-top:12px;display:flex;align-items:center;justify-content:space-between;">
          <button type="button" class="pyq-btn-secondary" style="height:32px;padding:0 12px;font-size:12px;font-weight:700;border-radius:8px;display:inline-flex;align-items:center;gap:6px;cursor:pointer;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <span class="pyq-toggle-text">View Model Answer &amp; Clinical Guide</span>
          </button>
          <span style="font-size:11px;color:var(--pyq-text-muted);font-weight:600;">High-Yield Written Answers</span>
        </div>
      </div>

      <div class="pyq-model-answer-wrapper">
        <div class="pyq-answer-category-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>Exhaustive Clinical Answer &amp; Exam Notes</span>
        </div>
        <div class="pyq-answer-body">
          ${topic.answerHtml}
        </div>
      </div>
    `;

    // Add click handler to toggle accordion
    const header = card.querySelector('.pyq-topic-header');
    header.addEventListener('click', (e) => {
      card.classList.toggle('expanded');
      const toggleTxt = card.querySelector('.pyq-toggle-text');
      if (toggleTxt) {
        toggleTxt.textContent = card.classList.contains('expanded') ? 'Collapse Answer' : 'View Model Answer & Clinical Guide';
      }
    });

    topicsListEl.appendChild(card);
  });
}

function renderQuestionPapers(papers) {
  if (!papersGridEl) return;
  papersGridEl.innerHTML = '';

  papers.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'pyq-paper-card';
    card.innerHTML = `
      <div>
        <div class="pyq-paper-top">
          <span class="pyq-paper-year-badge">${p.year}</span>
          <span class="pyq-paper-badge-pill">${p.badge}</span>
        </div>
        <h4 class="pyq-paper-title">${p.title}</h4>
        <div class="pyq-paper-meta">
          <span>📅 ${p.date}</span>
          <span>•</span>
          <span>💯 ${p.totalMarks} Marks</span>
          <span>•</span>
          <span>⏳ ${p.duration}</span>
        </div>
      </div>
      <div class="pyq-paper-actions">
        <button type="button" class="pyq-paper-btn pyq-btn-primary btn-read-paper">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <span>Read in App</span>
        </button>
        <button type="button" class="pyq-paper-btn pyq-btn-secondary btn-download-paper">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>Download</span>
        </button>
      </div>
    `;

    const readBtn = card.querySelector('.btn-read-paper');
    if (readBtn) {
      readBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openPdfViewer(p.title, p.file);
      });
    }

    const dlBtn = card.querySelector('.btn-download-paper');
    if (dlBtn) {
      dlBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const filename = p.title.replace(/[^a-zA-Z0-9_-]/g, '_') + '.pdf';
        triggerFileDownload(p.file, p.title, filename);
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
