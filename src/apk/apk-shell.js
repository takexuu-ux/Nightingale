// Red Sapphire Hinglish APK — Scratch Minimal UI Shell & Liquid Motion Engine
import './apk-ui.css';
import botanicalImgUrl from './botanical-heart-lungs.png';
import {
  initPetSystem,
  isPetEnabled,
  setPetEnabled,
  getActivePetId,
  setActivePetId,
  getAvailablePets,
  getShinchanSvg
} from './apk-pet-system.js';

function detectSystemDark() {
  try {
    const saved = localStorage.getItem('nnl_app_theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
  } catch (_) {}
  try {
    if (typeof window.__NNL_SYSTEM_DARK__ === 'boolean') {
      return window.__NNL_SYSTEM_DARK__;
    }
    if (window.AndroidThemeBridge && typeof window.AndroidThemeBridge.isSystemDark === 'function') {
      return Boolean(window.AndroidThemeBridge.isSystemDark());
    }
  } catch {}
  try {
    return Boolean(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  } catch {
    return false;
  }
}

export function applySystemTheme(isDark, userInitiated = false) {
  let mode;
  try {
    const saved = localStorage.getItem('nnl_app_theme');
    if (!userInitiated && (saved === 'dark' || saved === 'light')) {
      mode = saved;
    } else {
      mode = isDark ? 'dark' : 'light';
      localStorage.setItem('nnl_app_theme', mode);
    }
  } catch (_) {
    mode = isDark ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', mode);
  try {
    if (window.AndroidThemeBridge && typeof window.AndroidThemeBridge.setDarkMode === 'function') {
      window.AndroidThemeBridge.setDarkMode(mode === 'dark');
    }
  } catch {}
  syncThemeButtons(mode === 'dark');
}

function syncThemeButtons(isDark) {
  if (typeof isDark !== 'boolean') {
    isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  }
  const lightBtn = document.getElementById('apk-theme-light-btn');
  const darkBtn = document.getElementById('apk-theme-dark-btn');
  if (lightBtn && darkBtn) {
    lightBtn.classList.toggle('active', !isDark);
    darkBtn.classList.toggle('active', isDark);
  }
}

window.__nnlApplySystemTheme = applySystemTheme;
applySystemTheme(detectSystemDark());

try {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  if (mq && typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', (e) => applySystemTheme(Boolean(e.matches)));
  }
} catch {}

const NIGHTINGALE_MARK_SVG = '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 45V20c7 0 11 5.5 14 11.5C35 37.5 39 43 46 43V18" stroke="#FFFFFF" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="46" cy="11.5" r="3.2" fill="#E9DFFF"/></svg>';

const NAV_ICONS = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  live: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>',
  videos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 4 20 12 6 20 6 4"/></svg>',
  notes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>',
  tests: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  saved: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
  refresh: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>',
  settings: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  back: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>',
  close: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
};

function stripEmojisAndShorten(root) {
  if (!root) return;
  const emojiTestRe = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u;
  const emojiReplaceRe = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  let node;
  while ((node = walker.nextNode())) {
    // Preserve emojis in user greeting and student name headers
    if (node.parentElement?.closest('#apk-hero-greeting, .apk-home-title, #user-phone, .apk-side-name')) {
      continue;
    }
    if (emojiTestRe.test(node.nodeValue)) {
      node.nodeValue = node.nodeValue.replace(emojiReplaceRe, '').replace(/\s{2,}/g, ' ');
    }
  }

  // Shorten verbose button/tab labels
  const vidAll = document.getElementById('vid-tab-all');
  if (vidAll) {
    const sp = vidAll.querySelector('span:not(.section-mode-count)');
    if (sp && sp.textContent.includes('Subjects')) sp.textContent = 'All Subjects';
  }
  const vidRb = document.getElementById('vid-tab-rb103');
  if (vidRb) {
    const sp = vidRb.querySelector('span:not(.section-mode-count)');
    if (sp && sp.textContent.includes('Red Sapphire')) sp.textContent = 'Batch 103';
  }
  const vidOff = document.getElementById('vid-tab-offline');
  if (vidOff) {
    const sp = vidOff.querySelector('span:not(.section-mode-count)');
    if (sp && sp.textContent.includes('Downloaded')) sp.textContent = 'Offline';
  }

  root.querySelectorAll('.sd-note-btn span').forEach((s) => {
    if (s.textContent.includes('Notes')) s.textContent = 'PDF';
  });
  root.querySelectorAll('.sd-dl-btn span').forEach((s) => {
    if (s.textContent.trim() === 'Download') s.textContent = 'Save';
    if (s.textContent.trim() === 'Retry Save') s.textContent = 'Retry';
  });
}

function attachWaterDropMotion() {
  const TARGET_SELECTOR = '.class-card, .subject-card, .sd-lecture-card, .test-card, .doc-card, .nav-tab, .nav-btn, .apk-icon-btn, .section-mode-tab, .filter-chip, .btn, .sd-lecture-btn, .sd-note-btn, .sd-dl-btn, .sd-del-btn, .btn-note-view, .apk-pill-opt, .apk-pet-card, .continue-watching-card';

  document.addEventListener('pointerdown', (e) => {
    const host = e.target?.closest?.(TARGET_SELECTOR);
    if (!host || host.disabled) return;
    host.classList.add('apk-water-host', 'apk-pressing');

    const rect = host.getBoundingClientRect();
    const drop = document.createElement('span');
    drop.className = 'apk-water-drop';
    const size = Math.max(rect.width, rect.height, 44);
    drop.style.width = `${size}px`;
    drop.style.height = `${size}px`;
    drop.style.left = `${e.clientX ? (e.clientX - rect.left) : rect.width / 2}px`;
    drop.style.top = `${e.clientY ? (e.clientY - rect.top) : rect.height / 2}px`;
    host.appendChild(drop);
    setTimeout(() => drop.remove(), 650);
  }, { passive: true });

  const releaseAll = () => {
    document.querySelectorAll('.apk-pressing').forEach((el) => el.classList.remove('apk-pressing'));
  };
  document.addEventListener('pointerup', releaseAll, { passive: true });
  document.addEventListener('pointercancel', releaseAll, { passive: true });
}

export function openSidePanel() {
  const panel = document.getElementById('apk-side-panel');
  if (panel) {
    panel.classList.remove('hide');
    document.body.classList.add('apk-side-open');
    syncPetSelectionUI();
    const ham = document.getElementById('apk-hamburger-btn');
    if (ham) {
      ham.style.setProperty('display', 'none', 'important');
      ham.style.setProperty('visibility', 'hidden', 'important');
      ham.style.setProperty('opacity', '0', 'important');
      ham.style.setProperty('pointer-events', 'none', 'important');
    }
  }
}

export function closeSidePanel() {
  const panel = document.getElementById('apk-side-panel');
  if (panel) {
    panel.classList.add('hide');
    document.body.classList.remove('apk-side-open');
    const ham = document.getElementById('apk-hamburger-btn');
    if (ham && !document.body.classList.contains('apk-is-auth')) {
      ham.style.removeProperty('display');
      ham.style.removeProperty('visibility');
      ham.style.removeProperty('opacity');
      ham.style.removeProperty('pointer-events');
    }
  }
}

function syncPetSelectionUI() {
  const panel = document.getElementById('apk-side-panel');
  if (!panel) return;
  const activePetId = getActivePetId();
  const petEnabled = isPetEnabled();

  const toggleBtn = panel.querySelector('#apk-pet-toggle-btn');
  if (toggleBtn) {
    toggleBtn.classList.toggle('active', petEnabled);
    toggleBtn.classList.toggle('is-on', petEnabled);
  }

  const statusPill = panel.querySelector('.apk-companion-status-pill');
  if (statusPill) {
    statusPill.textContent = petEnabled ? 'Active 🩺' : 'Disabled';
    statusPill.classList.toggle('disabled', !petEnabled);
  }

  panel.querySelectorAll('.apk-pet-card, .apk-pet-avatar-item').forEach(card => {
    const id = card.getAttribute('data-pet-id');
    card.classList.toggle('active', id === activePetId && petEnabled);
  });
}

function buildSidePanel() {
  if (document.getElementById('apk-side-panel')) return;

  const panel = document.createElement('div');
  panel.id = 'apk-side-panel';
  panel.className = 'hide';

  const availablePets = getAvailablePets();

  panel.innerHTML = `
    <div class="apk-side-backdrop" aria-hidden="true"></div>
    <div class="apk-side-drawer" role="dialog" aria-label="Settings & Menu">
      <!-- Header -->
      <div class="apk-side-header">
        <div style="display:flex;align-items:center;gap:12px;">
          <div class="apk-logo-badge" style="width:36px;height:36px;border-radius:11px;">${NIGHTINGALE_MARK_SVG}</div>
          <div>
            <div class="apk-side-title">Settings &amp; Menu</div>
          </div>
        </div>
        <button type="button" id="apk-side-close-btn" class="apk-icon-btn" aria-label="Close">${NAV_ICONS.close}</button>
      </div>

      <!-- Appearance Card -->
      <div class="apk-side-card">
        <div class="apk-side-section-title">Appearance</div>
        <div class="apk-theme-switcher-bar">
          <button type="button" id="apk-theme-light-btn" class="apk-theme-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            <span>Light</span>
          </button>
          <button type="button" id="apk-theme-dark-btn" class="apk-theme-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <span>Dark</span>
          </button>
        </div>
      </div>

      <!-- Batch Track Card -->
      <div class="apk-side-card">
        <div class="apk-side-section-title">Batch Track</div>
        <div class="apk-side-batch-row">
          <div style="display:flex;align-items:center;gap:8px;min-width:0;">
            <span style="font-weight:700;font-size:13.5px;color:var(--text-primary);flex-shrink:0;">Current:</span>
            <span style="font-size:12.5px;color:var(--text-secondary);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" id="apk-side-batch-label">Red Sapphire (Hinglish)</span>
          </div>
          <button type="button" id="apk-side-batch-btn" class="apk-icon-btn" aria-label="Switch Batch" style="width:32px;height:32px;border-radius:9px;flex-shrink:0;background:rgba(142,116,229,0.18);border:1px solid rgba(142,116,229,0.3);color:var(--accent);">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17h16M16 13l4 4-4 4M20 7H4M8 3L4 7l4 4"/></svg>
          </button>
        </div>
      </div>

      <!-- Study Companion Card (Compact) -->
      <div class="apk-side-card apk-companion-setting-card" style="padding:10px 14px;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:34px;height:34px;border-radius:50%;overflow:hidden;background:rgba(124,58,237,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              ${getShinchanSvg('default')}
            </div>
            <div>
              <div style="font-weight:700;font-size:13.5px;color:var(--text-primary);">Shin-chan</div>
              <div style="font-size:11px;color:var(--text-secondary);">Interactive Companion</div>
            </div>
          </div>
          <button type="button" id="apk-pet-toggle-btn" class="apk-switch-btn" aria-label="Toggle Companion Pet">
            <span class="apk-switch-thumb"></span>
          </button>
        </div>
      </div>

      <!-- Academic Resources Card -->
      <div class="apk-side-card">
        <div class="apk-side-section-title">Saved &amp; Resources</div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <!-- Single Unified Saved Button -->
          <button type="button" id="apk-side-saved-hub-btn" class="apk-resource-btn">
            <div style="display:flex;align-items:center;gap:12px;">
              <div class="apk-res-icon apk-res-icon-purple">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              </div>
              <span class="apk-res-label">Saved Content</span>
            </div>
            <svg class="apk-res-arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          <!-- Red Sapphire Brochure & Timetable -->
          <button type="button" id="apk-side-brochure-btn" class="apk-resource-btn">
            <div style="display:flex;align-items:center;gap:12px;">
              <div class="apk-res-icon apk-res-icon-indigo">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <span class="apk-res-label">Brochure &amp; Timetable</span>
            </div>
            <svg class="apk-res-arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      <!-- App Version & Updates Card (Compact) -->
      <div class="apk-side-card apk-ota-update-card" style="padding:10px 14px; margin-bottom:8px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
          <div class="apk-side-section-title" style="margin:0;font-size:12.5px;">App Updates</div>
          <span id="apk-side-ver-tag" class="apk-ota-badge" style="font-size:10.5px;font-weight:700;padding:2px 7px;border-radius:6px;background:rgba(124,58,237,0.18);color:var(--accent);border:1px solid rgba(167,139,250,0.3);">v1.0.33</span>
        </div>
        <div style="display:flex;width:100%;align-items:center;">
          <button type="button" id="apk-side-check-update-btn" class="apk-theme-btn" style="width:100%;justify-content:center;height:34px;font-size:12px;font-weight:700;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);color:var(--text-primary);border-radius:9px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;padding:0 12px;transition:all 0.2s ease;">
            <svg id="apk-side-check-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            <span id="apk-side-check-txt">Check for Update</span>
          </button>
        </div>
        <div id="apk-update-status-msg" style="font-size:11px;color:var(--text-secondary);font-weight:600;display:none;margin-top:4px;text-align:center;"></div>
      </div>

      <!-- Bottom Pinned Footer: Sign Out -->
      <div class="apk-side-footer">
        <button id="apk-sheet-logout-btn" type="button" class="apk-signout-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(panel);

  // Close bindings
  panel.querySelector('.apk-side-backdrop')?.addEventListener('click', closeSidePanel);
  panel.querySelector('#apk-side-close-btn')?.addEventListener('click', closeSidePanel);

  // Pet Toggle ON/OFF
  panel.querySelector('#apk-pet-toggle-btn')?.addEventListener('click', () => {
    const next = !isPetEnabled();
    setPetEnabled(next);
    syncPetSelectionUI();
  });

  // Pet Choice Selection
  panel.querySelectorAll('.apk-pet-card, .apk-pet-avatar-item').forEach(card => {
    card.addEventListener('click', () => {
      const petId = card.getAttribute('data-pet-id');
      if (petId) {
        if (!isPetEnabled()) setPetEnabled(true);
        setActivePetId(petId);
        syncPetSelectionUI();
      }
    });
  });

  // Single Unified Saved & Offline Hub inside Side Panel
  panel.querySelector('#apk-side-saved-hub-btn')?.addEventListener('click', () => {
    closeSidePanel();
    window.location.href = '/saved.html';
  });

  // Switch Batch inside Side Panel
  panel.querySelector('#apk-side-batch-btn')?.addEventListener('click', () => {
    closeSidePanel();
    openBatchSwitcherModal();
  });

  // Brochure inside Side Panel
  panel.querySelector('#apk-side-brochure-btn')?.addEventListener('click', () => {
    closeSidePanel();
    if (typeof window.__nnlOpenBrochure === 'function') {
      window.__nnlOpenBrochure();
    } else {
      window.location.href = '/notes.html?openBrochure=1';
    }
  });

  // Theme Toggles
  panel.querySelector('#apk-theme-light-btn')?.addEventListener('click', () => applySystemTheme(false, true));
  panel.querySelector('#apk-theme-dark-btn')?.addEventListener('click', () => applySystemTheme(true, true));

  // App Update Check & Unified Single Button Install System
  const sideCheckBtn = panel.querySelector('#apk-side-check-update-btn');
  const sideCheckTxt = panel.querySelector('#apk-side-check-txt');
  const sideStatusMsg = panel.querySelector('#apk-update-status-msg');
  const sideVerTag = panel.querySelector('#apk-side-ver-tag');

  let updatePendingType = null; // null | 'web' | 'apk'
  let pendingVersionStr = '';

  function showUpdatePromptModal(type, versionStr) {
    if (document.getElementById('apk-update-prompt-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'apk-update-prompt-modal';
    modal.className = 'apk-update-prompt-overlay';
    modal.innerHTML = `
      <div class="apk-update-prompt-card">
        <div class="apk-update-icon-glow">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </div>
        <h3 class="apk-update-title">Update Ready (${versionStr})</h3>
        <p class="apk-update-desc">A new version of Nightingale is available with performance improvements and bug fixes.</p>
        <div class="apk-update-actions">
          <button id="apk-update-modal-btn" class="apk-update-btn-primary" type="button">Update Now</button>
          <button id="apk-update-modal-dismiss" class="apk-update-btn-dismiss" type="button">Later</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const updateBtn = modal.querySelector('#apk-update-modal-btn');
    const dismissBtn = modal.querySelector('#apk-update-modal-dismiss');

    dismissBtn?.addEventListener('click', () => modal.remove());
    updateBtn?.addEventListener('click', async () => {
      updateBtn.disabled = true;
      if (sideCheckBtn) {
        sideCheckBtn.click();
      }
      modal.remove();
    });
  }

  async function performOtaCheck(isAuto = false) {
    if (sideCheckBtn && !isAuto) {
      sideCheckBtn.disabled = true;
      if (sideCheckTxt) sideCheckTxt.textContent = 'Checking...';
    }

    try {
      const res = await fetch(`/__ota/check?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        const hasWeb = Boolean(data.hasWebUpdate);
        const hasNative = Boolean(data.hasNativeUpdate);

        if (hasWeb) {
          updatePendingType = 'web';
          pendingVersionStr = `v${data.remoteWebVersion || 92}`;
          if (sideVerTag) {
            sideVerTag.textContent = `${pendingVersionStr} Ready`;
            sideVerTag.style.background = 'rgba(16, 185, 129, 0.16)';
            sideVerTag.style.color = '#10b981';
            sideVerTag.style.borderColor = 'rgba(16, 185, 129, 0.3)';
          }
          if (sideCheckBtn && sideCheckTxt) {
            sideCheckBtn.disabled = false;
            sideCheckTxt.textContent = `Install Update (${pendingVersionStr})`;
            sideCheckBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            sideCheckBtn.style.borderColor = '#10b981';
            sideCheckBtn.style.color = '#ffffff';
          }
          if (isAuto) {
            showUpdatePromptModal('web', pendingVersionStr);
          }
        } else if (hasNative) {
          updatePendingType = 'apk';
          pendingVersionStr = `v1.0.${data.remoteNativeVersionCode}`;
          if (sideVerTag) {
            sideVerTag.textContent = `${pendingVersionStr} Ready`;
            sideVerTag.style.background = 'rgba(124, 58, 237, 0.16)';
            sideVerTag.style.color = '#a78bfa';
            sideVerTag.style.borderColor = 'rgba(124, 58, 237, 0.3)';
          }
          if (sideCheckBtn && sideCheckTxt) {
            sideCheckBtn.disabled = false;
            sideCheckTxt.textContent = `Install Update (${pendingVersionStr})`;
            sideCheckBtn.style.background = 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)';
            sideCheckBtn.style.borderColor = '#7c3aed';
            sideCheckBtn.style.color = '#ffffff';
          }
          if (isAuto) {
            showUpdatePromptModal('apk', pendingVersionStr);
          }
        } else {
          updatePendingType = null;
          if (sideVerTag) {
            sideVerTag.textContent = `v1.0.${data.currentNativeVersionCode || 33}`;
            sideVerTag.style.background = 'rgba(124,58,237,0.18)';
            sideVerTag.style.color = 'var(--accent)';
            sideVerTag.style.borderColor = 'rgba(167,139,250,0.3)';
          }
          if (sideCheckBtn && sideCheckTxt) {
            sideCheckBtn.disabled = false;
            sideCheckTxt.textContent = 'Up to date';
            sideCheckBtn.style.background = 'rgba(255,255,255,0.08)';
            sideCheckBtn.style.borderColor = 'rgba(255,255,255,0.14)';
            sideCheckBtn.style.color = 'var(--text-primary)';
            setTimeout(() => {
              if (!updatePendingType && sideCheckTxt.textContent === 'Up to date') {
                sideCheckTxt.textContent = 'Check for Update';
              }
            }, 2500);
          }
        }
      } else {
        throw new Error('Check failed');
      }
    } catch (_) {
      if (sideCheckBtn && sideCheckTxt) {
        sideCheckBtn.disabled = false;
        sideCheckTxt.textContent = 'Check for Update';
      }
    }
  }

  if (sideCheckBtn) {
    sideCheckBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (updatePendingType === 'web') {
        sideCheckBtn.disabled = true;
        if (sideCheckTxt) sideCheckTxt.textContent = 'Updating...';
        try {
          const applyRes = await fetch('/__ota/apply', { method: 'POST' });
          const applyJson = await applyRes.json();
          if (applyJson.ok) {
            if (sideCheckTxt) sideCheckTxt.textContent = 'Reloading...';
            setTimeout(() => window.location.reload(), 300);
          } else {
            throw new Error(applyJson.error || 'Apply failed');
          }
        } catch (err) {
          sideCheckBtn.disabled = false;
          if (sideCheckTxt) sideCheckTxt.textContent = 'Retry Update';
        }
      } else if (updatePendingType === 'apk') {
        sideCheckBtn.disabled = true;
        if (sideCheckTxt) sideCheckTxt.textContent = 'Downloading APK...';
        try {
          const preCheck = await fetch(`/__ota/apk-progress?t=${Date.now()}`);
          if (preCheck.ok) {
            const st = await preCheck.json();
            if (st.ready) {
              sideCheckBtn.disabled = false;
              if (sideCheckTxt) sideCheckTxt.textContent = 'Install / Saved to Downloads';
              if (sideStatusMsg) {
                sideStatusMsg.textContent = 'APK saved to Downloads as Nightingale.apk — tap to install or open from File Manager.';
                sideStatusMsg.style.display = 'block';
              }
              await fetch('/__ota/launch-installer', { method: 'POST' });
              return;
            }
          }
          await fetch('/__ota/start-apk-download', { method: 'POST' });
          while (true) {
            await new Promise(r => setTimeout(r, 350));
            const pRes = await fetch(`/__ota/apk-progress?t=${Date.now()}`);
            if (!pRes.ok) break;
            const status = await pRes.json();
            if (status.state === 'ready') {
              sideCheckBtn.disabled = false;
              if (sideCheckTxt) sideCheckTxt.textContent = 'Install / Saved to Downloads';
              if (sideStatusMsg) {
                sideStatusMsg.textContent = 'APK saved to Downloads as Nightingale.apk — tap to install or open from File Manager.';
                sideStatusMsg.style.display = 'block';
              }
              await fetch('/__ota/launch-installer', { method: 'POST' });
              break;
            }
            if (status.state === 'error') {
              throw new Error(status.error || 'Download error');
            }
            if (status.state === 'downloading') {
              if (sideCheckTxt) sideCheckTxt.textContent = `Downloading ${status.percent || 0}%`;
            }
          }
        } catch (err) {
          sideCheckBtn.disabled = false;
          if (sideCheckTxt) sideCheckTxt.textContent = 'Retry Download';
        }
      } else {
        performOtaCheck(false);
      }
    });
  }

  // Auto-check on sidebar render
  setTimeout(() => performOtaCheck(true), 1200);

  // Sign out
  panel.querySelector('#apk-sheet-logout-btn')?.addEventListener('click', () => {
    try { sessionStorage.setItem('nnl_explicit_logout', 'true'); } catch (_) {}
    try { localStorage.removeItem('nnl_access_token'); } catch (_) {}
    try { localStorage.removeItem('nnl_refresh_token'); } catch (_) {}
    try { localStorage.removeItem('nnl_phone'); } catch (_) {}
    try { localStorage.removeItem('nnl_user_phone'); } catch (_) {}
    try { localStorage.removeItem('nnl_user_id'); } catch (_) {}
    try { window.AndroidAuthBridge?.clearSession?.(); } catch (_) {}
    window.location.replace('/');
  });

  syncThemeButtons();

  // Edge Swipe Gestures (Swipe right from left edge to open; swipe left to close)
  let touchStartX = 0;
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dy) > 70) return;

    // Swipe left inside open side panel closes it
    if (dx < -60 && !panel.classList.contains('hide')) {
      closeSidePanel();
    }
  }, { passive: true });

  // Sync OTA Box into drawer
  const adoptOtaBox = () => {
    const otaBox = document.getElementById('apk-ota-settings-box');
    const slot = document.getElementById('apk-sheet-ota-slot');
    if (otaBox && slot && otaBox.parentElement !== slot) {
      otaBox.style.cssText = 'padding:12px 14px;border-radius:16px;background:var(--bg-subtle);border:1px solid var(--border-hairline);';
      slot.appendChild(otaBox);
    }
    const headerUpdBtn = document.getElementById('apk-header-update-btn');
    if (headerUpdBtn) {
      const txt = headerUpdBtn.textContent || '';
      const dot = document.getElementById('apk-settings-dot');
      if (dot && (txt.includes('Get') || txt.includes('Update v') || txt.includes('APK'))) {
        dot.classList.remove('hide');
      }
      headerUpdBtn.style.display = 'none';
    }
  };
  adoptOtaBox();
  window.__nnlAdoptOtaBox = adoptOtaBox;

  syncPetSelectionUI();
}

const APK_BATCH_CHOICES = [
  { value: 'Red Sapphire (Hinglish)', label: 'Red Sapphire', sub: 'Hinglish' },
  { value: 'Blue Sapphire (Hinglish)', label: 'Blue Sapphire', sub: 'Hinglish' },
  { value: 'Red Sapphire (English)', label: 'Red Sapphire', sub: 'English' },
  { value: 'Fast Track', label: 'Fast Track', sub: 'Crash Course' }
];

export function getActiveBatchValue() {
  try {
    const saved = localStorage.getItem('nnl_active_batch');
    if (saved && APK_BATCH_CHOICES.some(b => b.value === saved)) return saved;
  } catch (_) {}
  return 'Red Sapphire (Hinglish)';
}

export function getBatchShortText(val) {
  const found = APK_BATCH_CHOICES.find(b => b.value === val) || APK_BATCH_CHOICES[0];
  return val === 'Red Sapphire (English)' ? 'Red Sapphire Eng' : found.label;
}

const chevronDownSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

function syncBatchPills() {
  const active = getActiveBatchValue();
  const shortLabel = getBatchShortText(active);
  document.querySelectorAll('.apk-batch-pill-btn').forEach(btn => {
    btn.dataset.batch = active;
    btn.innerHTML = `<span>${shortLabel}</span>${chevronDownSvg}`;
  });
  const sideLbl = document.getElementById('apk-side-batch-label');
  if (sideLbl) sideLbl.textContent = active;
}

function openBatchSwitcherModal() {
  const existing = document.getElementById('apk-batch-sheet');
  if (existing) existing.remove();
  const active = getActiveBatchValue();

  const overlay = document.createElement('div');
  overlay.id = 'apk-batch-sheet';
  overlay.className = 'apk-sheet-backdrop';
  overlay.innerHTML = `
    <div class="apk-sheet-card" role="dialog" aria-modal="true" aria-label="Switch Batch">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
        <div>
          <div style="font-size:16px;font-weight:800;color:var(--text-primary);">Switch Batch</div>
          <div style="font-size:12px;color:var(--text-secondary);">Select your active classroom track</div>
        </div>
        <button type="button" class="apk-icon-btn apk-sheet-close" aria-label="Close">
          ${NAV_ICONS.close}
        </button>
      </div>
      <div class="apk-batch-options-list" style="display:flex;flex-direction:column;gap:8px;padding:2px 0;">
        ${APK_BATCH_CHOICES.map(b => {
          const isSel = b.value === active;
          return `
            <button type="button" class="apk-batch-option ${isSel ? 'active' : ''}" data-batch-value="${b.value}">
              <div style="display:flex;flex-direction:column;align-items:flex-start;gap:2px;">
                <span style="font-weight:800;font-size:13.5px;">${b.label}</span>
                <span style="font-size:11.5px;opacity:0.72;font-weight:600;">${b.sub}</span>
              </div>
              <span class="apk-batch-check" style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:99px;">
                ${isSel ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
              </span>
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.closest('.apk-sheet-close')) {
      overlay.remove();
      return;
    }
    const opt = e.target.closest('.apk-batch-option');
    if (!opt) return;
    const chosen = opt.dataset.batchValue;
    if (!chosen) return;
    try { localStorage.setItem('nnl_active_batch', chosen); } catch (_) {}
    syncBatchPills();
    overlay.remove();
    if (typeof window.__nnlSelectBatch === 'function') {
      try { window.__nnlSelectBatch(chosen); } catch (_) {}
    } else {
      const sel = document.getElementById('batch-select');
      if (sel) {
        sel.value = chosen;
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  });

  document.body.appendChild(overlay);
}

function openSavedHubModal() {
  const existing = document.getElementById('apk-saved-sheet');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'apk-saved-sheet';
  overlay.className = 'apk-sheet-backdrop';
  overlay.innerHTML = `
    <div class="apk-sheet-card" role="dialog" aria-modal="true" aria-label="Saved & Offline Hub">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
        <div>
          <div style="font-size:16px;font-weight:800;color:var(--text-primary);">Saved &amp; Offline Content</div>
          <div style="font-size:12px;color:var(--text-secondary);">Access all bookmarked and offline resources</div>
        </div>
        <button type="button" class="apk-icon-btn apk-sheet-close" aria-label="Close">
          ${NAV_ICONS.close}
        </button>
      </div>

      <div class="apk-saved-hub-grid" style="display:flex;flex-direction:column;gap:10px;padding:6px 0;">
        <!-- Option 1: Saved Lectures -->
        <button type="button" class="apk-batch-option" data-saved-target="lectures" style="width:100%;">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:38px;height:38px;border-radius:12px;background:rgba(244,63,94,0.18);color:#F43F5E;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              ${NAV_ICONS.videos}
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-start;gap:2px;">
              <span style="font-weight:800;font-size:14px;">Saved Lectures</span>
              <span style="font-size:11.5px;color:var(--text-secondary);font-weight:600;">Offline and bookmarked video classes</span>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        <!-- Option 2: Saved Notes & PDFs -->
        <button type="button" class="apk-batch-option" data-saved-target="notes" style="width:100%;">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:38px;height:38px;border-radius:12px;background:rgba(56,189,248,0.18);color:#38BDF8;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              ${NAV_ICONS.notes}
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-start;gap:2px;">
              <span style="font-weight:800;font-size:14px;">Saved Notes &amp; PDFs</span>
              <span style="font-size:11.5px;color:var(--text-secondary);font-weight:600;">Saved documents, hand-written notes &amp; PDFs</span>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        <!-- Option 3: Saved Tests & Question Banks -->
        <button type="button" class="apk-batch-option" data-saved-target="tests" style="width:100%;">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:38px;height:38px;border-radius:12px;background:rgba(142,116,229,0.18);color:var(--accent);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              ${NAV_ICONS.tests}
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-start;gap:2px;">
              <span style="font-weight:800;font-size:14px;">Tests &amp; Question Banks</span>
              <span style="font-size:11.5px;color:var(--text-secondary);font-weight:600;">Practice test series and question sets</span>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  `;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.closest('.apk-sheet-close')) {
      overlay.remove();
      return;
    }
    const opt = e.target.closest('[data-saved-target]');
    if (!opt) return;
    const target = opt.getAttribute('data-saved-target');
    overlay.remove();

    if (target === 'lectures') {
      if (window.location.pathname.includes('all-videos')) {
        if (typeof window.__nnlSetVideoMode === 'function') {
          window.__nnlSetVideoMode('saved');
        } else {
          window.location.href = '/all-videos.html?mode=saved';
        }
      } else {
        window.location.href = '/all-videos.html?mode=saved';
      }
    } else if (target === 'notes') {
      if (window.location.pathname.includes('notes')) {
        if (typeof window.__nnlSetNotesFilter === 'function') {
          window.__nnlSetNotesFilter('saved');
        } else {
          window.location.href = '/notes.html?filter=saved';
        }
      } else {
        window.location.href = '/notes.html?filter=saved';
      }
    } else if (target === 'tests') {
      if (!window.location.pathname.includes('tests')) {
        window.location.href = '/tests.html';
      }
    }
  });

  document.body.appendChild(overlay);
}

function normalizeHeaderAndChrome() {
  // Replace nav tab icons + crisp 1-word labels (Tab 1 is HOME)
  const tabs = [
    { id: 'tab-live', icon: NAV_ICONS.home, label: 'Home' },
    { id: 'tab-videos', icon: NAV_ICONS.videos, label: 'Videos' },
    { id: 'tab-notes', icon: NAV_ICONS.notes, label: 'Notes' },
    { id: 'tab-tests', icon: NAV_ICONS.tests, label: 'Tests' },
    { id: 'tab-saved', icon: NAV_ICONS.saved, label: 'Saved' }
  ];
  tabs.forEach(({ id, icon, label }) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = `${icon}<span>${label}</span>`;
  });

  // Attach saved tab click listener -> Navigates directly to dedicated Saved page
  const savedTab = document.getElementById('tab-saved');
  if (savedTab && !savedTab.__nnlBound) {
    savedTab.__nnlBound = true;
    savedTab.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = '/saved.html';
    });
  }

  // Remove unused Upcoming tab in rail/dock
  const upTab = document.getElementById('tab-upcoming');
  if (upTab) upTab.remove();

  // Icon-only refresh buttons
  ['refetch-btn', 'videos-refetch-btn', 'notes-refetch-btn', 'tests-refetch-btn'].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.innerHTML = NAV_ICONS.refresh;
      btn.setAttribute('aria-label', 'Refresh');
    }
  });

  // Icon-only back buttons
  ['btn-back-to-subjects', 'btn-back-subjects', 'btn-back-tests'].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.innerHTML = NAV_ICONS.back;
      btn.setAttribute('aria-label', 'Back');
    }
  });

  // Icon-only close modal buttons
  ['pdf-modal-close-btn', 'close-recording-viewer', 'quiz-top-close-btn'].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.className = 'apk-icon-btn';
      btn.innerHTML = NAV_ICONS.close;
      btn.setAttribute('aria-label', 'Close');
    }
  });

  // Clean 3-line Hamburger Menu Button:
  // On Tablet (>= 768px): placed neatly at the top of the Left Sidebar Rail (#app-header)
  // On Phone (< 768px): placed at Top-Left of screen
  let hamBtn = document.getElementById('apk-hamburger-btn');
  if (!hamBtn) {
    hamBtn = document.createElement('button');
    hamBtn.id = 'apk-hamburger-btn';
    hamBtn.className = 'apk-icon-btn apk-hamburger-btn';
    hamBtn.type = 'button';
    hamBtn.setAttribute('aria-label', 'Open Menu & Settings');
    hamBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
  }
  if (hamBtn && !hamBtn.__bound) {
    hamBtn.__bound = true;
    hamBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openSidePanel();
    });
  }

  // Delegated global click listener to guarantee Options Button ALWAYS opens drawer
  if (!window.__nnlHamBound) {
    window.__nnlHamBound = true;
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.closest('#apk-hamburger-btn, .apk-hamburger-btn')) {
        e.preventDefault();
        e.stopPropagation();
        openSidePanel();
      }
    }, true);
  }

  const appHeader = document.getElementById('app-header');
  function syncHamburgerPlacement() {
    if (!hamBtn) return;
    const isSidebarMode = (window.innerWidth >= 880 && window.matchMedia && window.matchMedia('(orientation: landscape)').matches) || window.innerWidth >= 1024;
    if (isSidebarMode) {
      if (appHeader && hamBtn.parentElement !== appHeader) {
        appHeader.insertBefore(hamBtn, appHeader.firstChild);
      }
    } else {
      // In Phone & Portrait Mode: Header is the floating bottom island dock with transform: translateX(-50%).
      // Having hamBtn inside appHeader traps fixed positioning and overlaps the Home tab (#tab-live)!
      // Moving hamBtn to document.body ensures it floats cleanly at top-left of screen, completely off the island.
      if (hamBtn.parentElement !== document.body) {
        document.body.appendChild(hamBtn);
      }
    }
  }
  syncHamburgerPlacement();
  window.addEventListener('resize', syncHamburgerPlacement);
  window.addEventListener('orientationchange', syncHamburgerPlacement);

  if (!window.__nnlBatchClickBound) {
    window.__nnlBatchClickBound = true;
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.apk-batch-pill-btn');
      if (btn) {
        e.preventDefault();
        openBatchSwitcherModal();
        return;
      }
    });
  }

  syncBatchPills();

  // Minimal Preloader Logo Badge
  const preloaderLogo = document.querySelector('.preloader-logo');
  if (preloaderLogo && !preloaderLogo.querySelector('.apk-logo-badge')) {
    const badge = document.createElement('div');
    badge.className = 'apk-logo-badge';
    badge.innerHTML = NIGHTINGALE_MARK_SVG;
    preloaderLogo.insertBefore(badge, preloaderLogo.firstChild);
    const txt = preloaderLogo.querySelector('.logo-text');
    if (txt) txt.textContent = 'Nightingale';
    const statusEl = document.querySelector('.preloader-status-container');
    if (statusEl) statusEl.remove();
  }

  // Header Logo (Preserve clean tablet layout without unwanted rail badge)
  const headerLogo = document.querySelector('.header-logo');
  if (headerLogo) {
    headerLogo.style.setProperty('display', 'none', 'important');
  }

  // Auth Screen Layout Integration & Strict Hamburger/Side Panel Hiding
  const syncAuthMode = () => {
    const authEl = document.getElementById('auth-screen');
    const token = localStorage.getItem('nnl_access_token');
    const isAuth = !token && Boolean(authEl && !authEl.classList.contains('hide'));
    if (document.body.classList.contains('apk-is-auth') !== isAuth) {
      document.body.classList.toggle('apk-is-auth', isAuth);
    }

    const btn = document.getElementById('apk-hamburger-btn');
    if (btn) {
      if (isAuth) {
        btn.style.setProperty('display', 'none', 'important');
      } else {
        btn.style.removeProperty('display');
      }
    }

    const drawer = document.getElementById('apk-side-drawer');
    if (drawer && isAuth) {
      drawer.style.setProperty('display', 'none', 'important');
      closeSidePanel();
    } else if (drawer) {
      drawer.style.removeProperty('display');
    }
  };
  syncAuthMode();

  const authEl = document.getElementById('auth-screen');
  if (authEl) {
    new MutationObserver(syncAuthMode).observe(authEl, { attributes: true, attributeFilter: ['class'] });

    const wrapper = authEl.closest('.auth-hero-wrapper');
    if (wrapper && !document.getElementById('apk-auth-showcase')) {
      const showcase = document.createElement('div');
      showcase.id = 'apk-auth-showcase';
      showcase.className = 'apk-auth-showcase';
      showcase.innerHTML = `
        <div class="apk-brand-inline-row">
          <h1 class="apk-showcase-title apk-brand-gradient-text">NIGHTINGALE</h1>
        </div>
        <div class="apk-showcase-pills">
          <span class="apk-showcase-pill">Live</span>
          <span class="apk-showcase-pill">Lectures</span>
          <span class="apk-showcase-pill">Notes</span>
        </div>
      `;
      wrapper.insertBefore(showcase, authEl);
    }
    const staleShowcaseBadge = document.querySelector('.apk-auth-showcase .apk-logo-badge');
    if (staleShowcaseBadge) staleShowcaseBadge.remove();

    const subtitleEl = authEl.querySelector('.brand-subtitle');
    if (subtitleEl) {
      subtitleEl.textContent = 'Enter your registered mobile number';
    }

    const phoneInput = document.getElementById('phone-input');
    if (phoneInput) {
      phoneInput.placeholder = '10-digit number';
    }
    const sendOtpSpan = document.querySelector('#send-otp-btn span');
    if (sendOtpSpan) {
      sendOtpSpan.textContent = 'Get OTP';
    }

    // Transparent Botanical Anatomical Heart & Lungs Artwork (Clean, no overpowering particle bloom)
    if (wrapper && !document.getElementById('apk-auth-botanical')) {
      const bot = document.createElement('div');
      bot.id = 'apk-auth-botanical';
      bot.className = 'apk-auth-botanical';
      bot.innerHTML = `
        <img src="${botanicalImgUrl}" alt="Botanical anatomical heart and lungs illustration" class="apk-botanical-img" draggable="false" />
      `;
      wrapper.appendChild(bot);
    }
  }
}

function enforceAuthGuard() {
  let token = localStorage.getItem('nnl_access_token');
  if (token === 'GUEST_DEMO_TOKEN') {
    localStorage.removeItem('nnl_access_token');
    token = null;
  }
  const path = window.location.pathname || '/';
  const isSubpage = /\/(all-videos|notes|tests|saved)\.html$/i.test(path);
  const explicitOut = sessionStorage.getItem('nnl_explicit_logout') === 'true';

  if (isSubpage && (!token || explicitOut)) {
    document.documentElement.style.visibility = 'hidden';
    try { window.AndroidAuthBridge?.clearSession?.(); } catch {}
    window.location.replace('/');
    return false;
  }

  if (!isSubpage && !token) {
    document.body.classList.add('apk-is-auth');
    document.getElementById('app-header')?.classList.add('hide');
    document.getElementById('classroom-dashboard')?.classList.add('hide');
    document.getElementById('auth-screen')?.classList.remove('hide');
  }
  return true;
}

window.addEventListener('pageshow', () => {
  enforceAuthGuard();
});

// Apple-Smooth Fluid Indicator & Card Motions
function attachNavLiquidDropAndCards() {
  const navTabs = document.querySelector('.header-nav-tabs .nav-tabs');
  if (!navTabs) return;

  // On Tablet & Desktop (>= 768px), nav rail uses dedicated solid purple active states
  if (window.innerWidth >= 768) {
    const existingPill = document.getElementById('apk-nav-liquid-indicator');
    if (existingPill) existingPill.remove();

    navTabs.querySelectorAll('.nav-tab').forEach((btn) => {
      if (btn.__tabletBound) return;
      btn.__tabletBound = true;
      btn.addEventListener('click', () => {
        navTabs.querySelectorAll('.nav-tab').forEach(t => {
          t.classList.remove('active');
          t.classList.remove('floating-active');
        });
        btn.classList.add('active');
      });
    });
    return;
  }

  let pill = document.getElementById('apk-nav-liquid-indicator');
  if (!pill) {
    pill = document.createElement('span');
    pill.id = 'apk-nav-liquid-indicator';
    pill.setAttribute('aria-hidden', 'true');
    navTabs.insertBefore(pill, navTabs.firstChild);
  }

  const placePillOnTab = (tabEl, immediate = false) => {
    if (!tabEl || tabEl.offsetWidth === 0) return;
    if (immediate) pill.style.transition = 'none';
    pill.style.width = `${tabEl.offsetWidth}px`;
    pill.style.height = `${tabEl.offsetHeight}px`;
    pill.style.transform = `translate3d(${tabEl.offsetLeft}px, ${tabEl.offsetTop}px, 0)`;
    if (immediate) {
      void pill.offsetWidth;
      pill.style.transition = '';
    }
  };

  const activeTab = navTabs.querySelector('.nav-tab.active');
  const prevTabId = sessionStorage.getItem('nnl_prev_nav_id');
  const prevTab = prevTabId ? document.getElementById(prevTabId) : null;
  if (prevTab && activeTab && prevTab !== activeTab) {
    placePillOnTab(prevTab, true);
    requestAnimationFrame(() => {
      placePillOnTab(activeTab, false);
    });
    sessionStorage.removeItem('nnl_prev_nav_id');
  } else if (activeTab) {
    placePillOnTab(activeTab, true);
  }

  navTabs.querySelectorAll('.nav-tab').forEach((btn) => {
    // Water droplet float on hover/pointer enter before click
    btn.addEventListener('pointerenter', () => {
      navTabs.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('floating-active'));
      btn.classList.add('floating-active');
      placePillOnTab(btn, false);
    });
    btn.addEventListener('pointerdown', () => {
      navTabs.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('floating-active'));
      btn.classList.add('floating-active');
      placePillOnTab(btn, false);
    });
    btn.addEventListener('click', () => {
      const prev = navTabs.querySelector('.nav-tab.active');
      if (prev && prev.id) sessionStorage.setItem('nnl_prev_nav_id', prev.id);
      navTabs.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('floating-active'));
      btn.classList.add('floating-active');
      requestAnimationFrame(() => {
        const nextActive = navTabs.querySelector('.nav-tab.active') || btn;
        placePillOnTab(nextActive, false);
      });
    });
  });

  navTabs.addEventListener('pointerleave', () => {
    navTabs.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('floating-active'));
    const cur = navTabs.querySelector('.nav-tab.active');
    if (cur) {
      cur.classList.add('floating-active');
      placePillOnTab(cur, false);
    }
  });

  window.addEventListener('resize', () => {
    const cur = navTabs.querySelector('.nav-tab.active');
    if (cur) placePillOnTab(cur, true);
  });
}

function animateVisibleCards(root) {
  if (!root) return;
  const cardSelector = '.class-card, .subject-card, .note-doc-card, .sd-lecture-card, .brochure-card, .test-card, .doc-card, .continue-watching-card';
  const cards = root.querySelectorAll(cardSelector);
  cards.forEach((card, idx) => {
    if (!card.classList.contains('apk-card-arrange')) {
      card.style.setProperty('--card-i', Math.min(idx, 16));
      card.classList.add('apk-card-arrange');
    }
  });
}

function attachPullToRefresh() {
  if (document.getElementById('apk-ptr-disc')) return;

  const disc = document.createElement('div');
  disc.id = 'apk-ptr-disc';
  disc.className = 'apk-ptr-disc';
  disc.innerHTML = `
    <svg class="apk-ptr-spinner" viewBox="0 0 24 24" fill="none">
      <circle class="apk-ptr-bg" cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" opacity="0.18"/>
      <circle class="apk-ptr-arc" cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="56" stroke-dashoffset="40"/>
    </svg>
  `;
  document.body.appendChild(disc);

  let startY = 0;
  let pulling = false;
  let refreshing = false;
  let pullDist = 0;

  const getScrollTop = () => (
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );

  const isModalActive = () => Boolean(
    document.querySelector('.quiz-viewer-overlay:not(.hide), .pdf-modal-overlay:not(.hide), .recording-viewer-overlay:not(.hide), #apk-side-panel:not(.hide), #apk-batch-sheet')
  );

  window.addEventListener('touchstart', (e) => {
    if (refreshing || e.touches.length !== 1 || isModalActive() || e.target.closest('#apk-companion-pet')) return;
    if (getScrollTop() <= 4) {
      startY = e.touches[0].clientY;
      pulling = true;
      pullDist = 0;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!pulling || refreshing) return;
    const dy = e.touches[0].clientY - startY;
    if (dy <= 6 || getScrollTop() > 4) {
      if (pullDist > 0) {
        pullDist = 0;
        disc.classList.remove('visible', 'ready');
        disc.style.transform = '';
      }
      return;
    }
    pullDist = Math.min(85, (dy - 6) * 0.45);
    if (pullDist > 10) {
      disc.classList.add('visible');
      const ready = pullDist >= 48;
      disc.classList.toggle('ready', ready);
      const arc = disc.querySelector('.apk-ptr-arc');
      if (arc) {
        const offset = Math.max(8, 56 - (pullDist / 48) * 44);
        arc.style.strokeDashoffset = offset;
      }
      disc.style.transform = `translate3d(-50%, ${Math.round(pullDist)}px, 0) rotate(${Math.round(pullDist * 4)}deg)`;
    }
  }, { passive: true });

  const endPull = () => {
    if (!pulling) return;
    pulling = false;
    if (pullDist >= 48 && !refreshing) {
      refreshing = true;
      disc.classList.add('visible', 'ready', 'spinning');
      disc.style.transform = `translate3d(-50%, 34px, 0)`;

      const refBtn = document.getElementById('refetch-btn') ||
        document.getElementById('videos-refetch-btn') ||
        document.getElementById('notes-refetch-btn') ||
        document.getElementById('tests-refetch-btn');
      if (refBtn) {
        refBtn.click();
      } else {
        window.location.reload();
      }
      setTimeout(() => {
        refreshing = false;
        pullDist = 0;
        disc.classList.remove('visible', 'ready', 'spinning');
        disc.style.transform = '';
      }, 700);
    } else {
      pullDist = 0;
      disc.classList.remove('visible', 'ready');
      disc.style.transform = '';
    }
  };
  window.addEventListener('touchend', endPull, { passive: true });
  window.addEventListener('touchcancel', endPull, { passive: true });
}

function initApkShell() {
  document.body.classList.add('apk-shell-active');
  try {
    if (
      (typeof window !== 'undefined' && (window.AndroidAuthBridge || window.AndroidThemeBridge || window.__NNL_ANDROID_APK__)) ||
      (typeof navigator !== 'undefined' && /NightingaleAndroid/i.test(navigator.userAgent))
    ) {
      document.body.classList.add('is-native-android-apk');
    }
  } catch {}
  if (!document.getElementById('apk-ambient-bg')) {
    const amb = document.createElement('div');
    amb.id = 'apk-ambient-bg';
    document.body.prepend(amb);
  }
  if (!enforceAuthGuard()) return;

  normalizeHeaderAndChrome();
  attachNavLiquidDropAndCards();
  buildSidePanel();
  attachWaterDropMotion();
  attachPullToRefresh();
  initPetSystem();
  stripEmojisAndShorten(document.body);
  animateVisibleCards(document.body);

  // Lightweight navigation & card state updates triggered only on user interaction (zero CPU cost, zero loops)
  const syncUiState = () => {
    requestAnimationFrame(() => {
      const curActive = document.querySelector('.header-nav-tabs .nav-tab.active');
      const pill = document.getElementById('apk-nav-liquid-indicator');
      if (curActive && pill && pill.style.width === '') {
        pill.style.width = `${curActive.offsetWidth}px`;
        pill.style.height = `${curActive.offsetHeight}px`;
        pill.style.transform = `translate3d(${curActive.offsetLeft}px, ${curActive.offsetTop}px, 0)`;
      }

      // Automated safety: If any back button or detail view is active, strictly hide Option button
      const hasBackButton = Boolean(
        document.querySelector('#btn-back-subjects:not(.hide), #btn-back-to-subjects:not(.hide), #btn-back-tests:not(.hide), .btn-notes-back:not(.hide)') ||
        document.querySelector('#notes-subject-view:not(.hide), #subject-detail-view:not(.hide), #tests-detail-view:not(.hide), #quiz-viewer:not(.hide), #recording-viewer:not(.hide)') ||
        document.body.classList.contains('apk-in-detail')
      );
      const isTablet = window.innerWidth >= 768;
      const ham = document.getElementById('apk-hamburger-btn');
      if (ham) {
        if ((!isTablet && hasBackButton) || document.body.classList.contains('apk-side-open') || document.body.classList.contains('apk-is-auth')) {
          ham.style.setProperty('display', 'none', 'important');
          ham.style.setProperty('visibility', 'hidden', 'important');
        } else {
          ham.style.removeProperty('display');
          ham.style.removeProperty('visibility');
        }
      }
    });
  };

  document.addEventListener('click', syncUiState, { passive: true });
  window.addEventListener('popstate', syncUiState, { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApkShell);
} else {
  initApkShell();
}
