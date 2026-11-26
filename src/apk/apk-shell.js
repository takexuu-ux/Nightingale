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
  getCompanionSvg,
  getPetName
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
  university: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M2 10h20M12 3 2 10h20zM6 10v11M10 10v11M14 10v11M18 10v11"/></svg>',
  pyqs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M2 10h20M12 3 2 10h20zM6 10v11M10 10v11M14 10v11M18 10v11"/></svg>',
  nursing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M2 10h20M12 3 2 10h20zM6 10v11M10 10v11M14 10v11M18 10v11"/></svg>',
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
  }
}

export function closeSidePanel() {
  const panel = document.getElementById('apk-side-panel');
  if (panel) {
    panel.classList.add('hide');
    document.body.classList.remove('apk-side-open');
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
              ${getCompanionSvg('default')}
            </div>
            <div>
              <div style="font-weight:700;font-size:13.5px;color:var(--text-primary);" id="apk-side-companion-name">${getPetName()}</div>
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

          <!-- University Question Papers (PYQ) -->
          <button type="button" id="apk-side-pyq-btn" class="apk-resource-btn">
            <div style="display:flex;align-items:center;gap:12px;">
              <div class="apk-res-icon apk-res-icon-indigo" style="background:rgba(142,116,229,0.2);color:#A78BFA;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 21h18M2 10h20M12 3 2 10h20zM6 10v11M10 10v11M14 10v11M18 10v11"/>
                </svg>
              </div>
              <span class="apk-res-label">University Question Papers</span>
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
        <div style="display:flex;flex-direction:column;width:100%;gap:6px;">
          <button type="button" id="apk-side-check-update-btn" class="apk-theme-btn" style="width:100%;justify-content:center;height:34px;font-size:12px;font-weight:700;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);color:var(--text-primary);border-radius:9px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;padding:0 12px;transition:all 0.2s ease;">
            <svg id="apk-side-check-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            <span id="apk-side-check-txt">Check for Update</span>
          </button>
          <button type="button" id="apk-side-download-apk-btn" class="apk-theme-btn" style="width:100%;justify-content:center;height:32px;font-size:11.5px;font-weight:700;background:rgba(124,58,237,0.18);border:1px solid rgba(167,139,250,0.3);color:#DDD6FE;border-radius:9px;cursor:pointer;display:none;align-items:center;gap:6px;padding:0 10px;transition:all 0.2s ease;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Download APK (Manual Install)</span>
          </button>
        </div>
        <div id="apk-update-status-msg" style="font-size:11px;color:var(--text-secondary);font-weight:600;display:none;margin-top:4px;text-align:center;"></div>
      </div>

      <!-- Bottom Pinned Footer: Sign Out -->
      <div class="apk-side-footer">
        <button id="apk-sheet-logout-btn" type="button" class="apk-signout-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span id="apk-sheet-logout-txt">${localStorage.getItem('nnl_access_token') ? 'Sign Out' : 'Log in with Mobile Number'}</span>
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

  // Question Papers (PYQ) inside Side Panel opens PYQs Page directly
  panel.querySelector('#apk-side-pyq-btn')?.addEventListener('click', () => {
    closeSidePanel();
    window.location.href = '/pyqs.html';
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
  const sideDownloadBtn = panel.querySelector('#apk-side-download-apk-btn');
  const sideStatusMsg = panel.querySelector('#apk-update-status-msg');
  const sideVerTag = panel.querySelector('#apk-side-ver-tag');

  let updatePendingType = null; // null | 'web' | 'apk'
  let pendingVersionStr = '';

  async function downloadAndSaveApk(targetBtnEl, modalWrap) {
    const progressWrap = modalWrap ? modalWrap.querySelector('#apk-modal-progress-wrap') : null;
    const progressTxt = modalWrap ? modalWrap.querySelector('#apk-modal-progress-txt') : null;
    const progressBar = modalWrap ? modalWrap.querySelector('#apk-modal-progress-bar') : null;
    const modalActions = modalWrap ? modalWrap.querySelector('.apk-update-actions') : null;

    if (progressWrap && progressBar && progressTxt) {
      if (modalActions) modalActions.style.display = 'none';
      progressWrap.style.display = 'flex';
      progressTxt.textContent = 'Downloading 0%';
      progressBar.style.width = '0%';
    } else if (targetBtnEl) {
      targetBtnEl.disabled = true;
      targetBtnEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;gap:6px;width:100%;"><span class="spinner" style="width:12px;height:12px;border-width:2px;"></span><span>Downloading 0%</span></div>';
    }

    if (sideStatusMsg) {
      sideStatusMsg.textContent = 'Downloading update...';
      sideStatusMsg.style.display = 'block';
    }

    try {
      const preCheck = await fetch(`/__ota/apk-progress?t=${Date.now()}`).then(r => r.json()).catch(() => null);
      if (!preCheck || !preCheck.ready) {
        await fetch('/__ota/start-apk-download', { method: 'POST' });
        while (true) {
          await new Promise(r => setTimeout(r, 400));
          const p = await fetch(`/__ota/apk-progress?t=${Date.now()}`).then(r => r.json()).catch(() => null);
          if (!p) break;
          if (p.state === 'ready') break;
          if (p.state === 'error') throw new Error(p.error || 'Download failed');
          const pct = Math.max(0, Math.min(100, p.percent || 0));
          if (progressWrap && progressBar && progressTxt) {
            progressTxt.textContent = `Downloading ${pct}%`;
            progressBar.style.width = `${pct}%`;
          } else if (targetBtnEl) {
            targetBtnEl.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;gap:6px;width:100%;"><span class="spinner" style="width:12px;height:12px;border-width:2px;"></span><span>Downloading ${pct}%</span></div>`;
          }
        }
      }

      await fetch('/__ota/open-downloads', { method: 'POST' }).catch(() => {});
      if (sideStatusMsg) {
        sideStatusMsg.textContent = 'Download complete';
        sideStatusMsg.style.color = '#10B981';
        sideStatusMsg.style.display = 'block';
      }

      if (progressWrap && modalActions) {
        progressWrap.style.display = 'none';
        modalActions.style.display = 'flex';
        const modalDlBtn = modalWrap.querySelector('#apk-update-modal-download');
        if (modalDlBtn) {
          modalDlBtn.disabled = false;
          modalDlBtn.textContent = 'Install Update';
          modalDlBtn.onclick = async () => {
            await fetch('/__ota/launch-installer', { method: 'POST' }).catch(() => {});
          };
        }
      }

      if (targetBtnEl) {
        targetBtnEl.disabled = false;
        targetBtnEl.textContent = 'Install Update';
        targetBtnEl.onclick = async () => {
          await fetch('/__ota/launch-installer', { method: 'POST' }).catch(() => {});
        };
      }
    } catch (e) {
      console.warn('Bridge APK download fallback:', e);
      window.location.href = 'https://raw.githubusercontent.com/takexuu-ux/Nightingale/refs/heads/ota-hinglish/Nightingale.apk';
      if (sideStatusMsg) {
        sideStatusMsg.textContent = 'Downloading in browser...';
        sideStatusMsg.style.display = 'block';
      }
      if (targetBtnEl) {
        targetBtnEl.disabled = false;
        targetBtnEl.textContent = 'Download APK';
      }
    }
  }

  function showUpdatePromptModal(type, versionStr) {
    if (document.getElementById('apk-update-prompt-modal')) return;
    const isApk = (type === 'apk');
    const modal = document.createElement('div');
    modal.id = 'apk-update-prompt-modal';
    modal.className = 'apk-update-prompt-overlay';
    modal.innerHTML = `
      <div class="apk-update-prompt-card">
        <div class="apk-update-icon-glow">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </div>
        <h3 class="apk-update-title">Update Ready (${versionStr})</h3>
        <p class="apk-update-desc">A fresh update is available with performance optimizations and stability fixes.</p>
        
        <!-- Centered Download Progress Bar Widget -->
        <div id="apk-modal-progress-wrap" style="display:none;width:100%;flex-direction:column;align-items:center;justify-content:center;gap:10px;margin:12px 0;">
          <span id="apk-modal-progress-txt" style="font-size:12px;font-weight:700;color:#f1f5f9;text-align:center;">Downloading 0%</span>
          <div style="width:100%;height:6px;background:rgba(255,255,255,0.12);border-radius:99px;overflow:hidden;">
            <div id="apk-modal-progress-bar" style="width:0%;height:100%;background:linear-gradient(90deg, #7c3aed 0%, #10B981 100%);border-radius:99px;transition:width 0.2s ease;"></div>
          </div>
        </div>

        <div class="apk-update-actions">
          <button id="apk-update-modal-btn" class="apk-update-btn-primary" type="button">Update Now</button>
          <button id="apk-update-modal-download" class="apk-update-btn-secondary" type="button">Download APK File</button>
          <button id="apk-update-modal-dismiss" class="apk-update-btn-dismiss" type="button">Later</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const updateBtn = modal.querySelector('#apk-update-modal-btn');
    const downloadBtn = modal.querySelector('#apk-update-modal-download');
    const dismissBtn = modal.querySelector('#apk-update-modal-dismiss');

    dismissBtn?.addEventListener('click', () => modal.remove());

    updateBtn?.addEventListener('click', async () => {
      updateBtn.disabled = true;
      if (dismissBtn) dismissBtn.style.display = 'none';

      const progressWrap = modal.querySelector('#apk-modal-progress-wrap');
      const progressTxt = modal.querySelector('#apk-modal-progress-txt');
      const progressBar = modal.querySelector('#apk-modal-progress-bar');
      const modalActions = modal.querySelector('.apk-update-actions');

      if (type === 'apk' || updatePendingType === 'apk') {
        if (progressWrap) progressWrap.style.display = 'flex';
        if (modalActions) modalActions.style.display = 'none';
        await downloadAndSaveApk(updateBtn, modal);
      } else {
        if (progressWrap) progressWrap.style.display = 'flex';
        if (modalActions) modalActions.style.display = 'none';

        let currentPct = 12;
        if (progressTxt) progressTxt.textContent = `Downloading update... ${currentPct}%`;
        if (progressBar) progressBar.style.width = `${currentPct}%`;

        const progressInterval = setInterval(() => {
          if (currentPct < 92) {
            currentPct += Math.floor(Math.random() * 8) + 5;
            if (currentPct > 92) currentPct = 92;
            if (progressTxt) progressTxt.textContent = `Downloading update... ${currentPct}%`;
            if (progressBar) progressBar.style.width = `${currentPct}%`;
          }
        }, 120);

        try {
          const applyRes = await fetch('/__ota/apply', { method: 'POST' });
          const applyJson = await applyRes.json();
          clearInterval(progressInterval);
          if (applyJson.ok) {
            if (progressTxt) progressTxt.textContent = '100% Complete (Restarting...)';
            if (progressBar) progressBar.style.width = '100%';
            setTimeout(() => window.location.reload(), 450);
          } else {
            throw new Error(applyJson.error || 'Apply failed');
          }
        } catch (err) {
          clearInterval(progressInterval);
          console.warn('Web update apply failed, downloading APK instead:', err);
          if (progressTxt) progressTxt.textContent = 'Downloading APK...';
          await downloadAndSaveApk(updateBtn, modal);
        }
      }
    });

    downloadBtn?.addEventListener('click', async () => {
      downloadBtn.disabled = true;
      if (dismissBtn) dismissBtn.style.display = 'none';
      await downloadAndSaveApk(downloadBtn, modal);
    });
  }

  const sideCheckIcon = panel.querySelector('#apk-side-check-icon');

  async function performOtaCheck(isAuto = false) {
    if (sideCheckBtn && !isAuto) {
      sideCheckBtn.disabled = true;
      // Show ONLY a minimal circular loader with NO text
      sideCheckBtn.innerHTML = '<span class="spinner" style="width:14px;height:14px;border-width:2px;display:inline-block;border-color:rgba(167,139,250,0.3);border-top-color:#a78bfa;"></span>';
    }

    try {
      const checkStart = Date.now();
      const res = await fetch(`/__ota/check?t=${Date.now()}`);
      if (!isAuto) {
        const elapsed = Date.now() - checkStart;
        if (elapsed < 650) {
          await new Promise(r => setTimeout(r, 650 - elapsed));
        }
      }

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
          if (sideCheckBtn) {
            sideCheckBtn.disabled = false;
            sideCheckBtn.innerHTML = `<span id="apk-side-check-txt">Install Update (${pendingVersionStr})</span>`;
            sideCheckBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            sideCheckBtn.style.borderColor = '#10b981';
            sideCheckBtn.style.color = '#ffffff';
          }
          if (sideDownloadBtn) sideDownloadBtn.style.display = 'none';
          showUpdatePromptModal('web', pendingVersionStr);
        } else if (hasNative) {
          updatePendingType = 'apk';
          pendingVersionStr = `v1.0.${data.remoteNativeVersionCode}`;
          if (sideVerTag) {
            sideVerTag.textContent = `${pendingVersionStr} Ready`;
            sideVerTag.style.background = 'rgba(124, 58, 237, 0.16)';
            sideVerTag.style.color = '#a78bfa';
            sideVerTag.style.borderColor = 'rgba(124, 58, 237, 0.3)';
          }
          if (sideCheckBtn) {
            sideCheckBtn.disabled = false;
            sideCheckBtn.innerHTML = `<span id="apk-side-check-txt">Install Update (${pendingVersionStr})</span>`;
            sideCheckBtn.style.background = 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)';
            sideCheckBtn.style.borderColor = '#7c3aed';
            sideCheckBtn.style.color = '#ffffff';
          }
          if (sideDownloadBtn) {
            sideDownloadBtn.style.display = 'inline-flex';
          }
          showUpdatePromptModal('apk', pendingVersionStr);
        } else {
          updatePendingType = null;
          if (sideVerTag) {
            sideVerTag.textContent = `v1.0.${data.currentNativeVersionCode || 39}`;
            sideVerTag.style.background = 'rgba(124,58,237,0.18)';
            sideVerTag.style.color = 'var(--accent)';
            sideVerTag.style.borderColor = 'rgba(167,139,250,0.3)';
          }
          if (sideDownloadBtn) sideDownloadBtn.style.display = 'none';
          if (sideCheckBtn) {
            sideCheckBtn.disabled = false;
            // Up to date: clean minimal text without tick
            sideCheckBtn.innerHTML = '<span style="font-size:12px;font-weight:700;color:#10B981;">Up to Date</span>';
            sideCheckBtn.style.background = 'rgba(255,255,255,0.08)';
            sideCheckBtn.style.borderColor = 'rgba(255,255,255,0.14)';
            sideCheckBtn.style.color = 'var(--text-primary)';
            setTimeout(() => {
              if (!updatePendingType && sideCheckBtn) {
                sideCheckBtn.innerHTML = `
                  <svg id="apk-side-check-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                  <span id="apk-side-check-txt">Check for Update</span>
                `;
              }
            }, 3000);
          }
        }
      } else {
        throw new Error('Check failed');
      }
    } catch (_) {
      if (sideCheckBtn) {
        sideCheckBtn.disabled = false;
        sideCheckBtn.innerHTML = `
          <svg id="apk-side-check-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
          <span id="apk-side-check-txt">Check for Update</span>
        `;
      }
    }
  }

  if (sideDownloadBtn) {
    sideDownloadBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      downloadAndSaveApk(sideDownloadBtn);
    });
  }

  if (sideCheckBtn) {
    sideCheckBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (updatePendingType === 'web') {
        showUpdatePromptModal('web', pendingVersionStr);
        sideCheckBtn.disabled = true;
        let sidePct = 8;
        if (sideCheckTxt) sideCheckTxt.innerHTML = `<span class="spinner" style="width:12px;height:12px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:6px;"></span><span>Updating ${sidePct}%</span>`;
        const sideInterval = setInterval(() => {
          if (sidePct < 90) {
            sidePct += Math.floor(Math.random() * 8) + 6;
            if (sidePct > 90) sidePct = 90;
            if (sideCheckTxt) sideCheckTxt.innerHTML = `<span class="spinner" style="width:12px;height:12px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:6px;"></span><span>Updating ${sidePct}%</span>`;
          }
        }, 140);
        try {
          const applyRes = await fetch('/__ota/apply', { method: 'POST' });
          const applyJson = await applyRes.json();
          clearInterval(sideInterval);
          if (applyJson.ok) {
            if (sideCheckTxt) sideCheckTxt.textContent = 'Reloading 100%...';
            setTimeout(() => window.location.reload(), 400);
          } else {
            throw new Error(applyJson.error || 'Apply failed');
          }
        } catch (err) {
          clearInterval(sideInterval);
          sideCheckBtn.disabled = false;
          if (sideCheckTxt) sideCheckTxt.textContent = 'Retry Update';
        }
      } else if (updatePendingType === 'apk') {
        sideCheckBtn.disabled = true;
        if (sideCheckTxt) sideCheckTxt.innerHTML = '<span class="spinner" style="width:12px;height:12px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:6px;"></span><span>Downloading APK...</span>';
        try {
          const preCheck = await fetch(`/__ota/apk-progress?t=${Date.now()}`);
          if (preCheck.ok) {
            const st = await preCheck.json();
            if (st.ready) {
              sideCheckBtn.disabled = false;
              if (sideCheckTxt) sideCheckTxt.textContent = 'Install Update';
              if (sideStatusMsg) {
                sideStatusMsg.textContent = 'Download complete';
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
              if (sideCheckTxt) sideCheckTxt.textContent = 'Install Update';
              if (sideStatusMsg) {
                sideStatusMsg.textContent = 'Download complete';
                sideStatusMsg.style.display = 'block';
              }
              await fetch('/__ota/launch-installer', { method: 'POST' });
              break;
            }
            if (status.state === 'error') {
              throw new Error(status.error || 'Download error');
            }
            if (status.state === 'downloading') {
              if (sideCheckTxt) sideCheckTxt.innerHTML = `<span class="spinner" style="width:12px;height:12px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:6px;"></span><span>Downloading ${status.percent || 0}%</span>`;
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

  // Sign out / Switch Account
  panel.querySelector('#apk-sheet-logout-btn')?.addEventListener('click', () => {
    try { sessionStorage.setItem('nnl_explicit_logout', 'true'); } catch (_) {}
    try { localStorage.removeItem('nnl_access_token'); } catch (_) {}
    try { localStorage.removeItem('nnl_refresh_token'); } catch (_) {}
    try { localStorage.removeItem('nnl_guest_mode'); } catch (_) {}
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

function showApkToast(msg) {
  let toast = document.getElementById('apk-global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'apk-global-toast';
    toast.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:#1E1636;border:1px solid rgba(142,116,229,0.45);color:#ffffff;padding:10px 18px;border-radius:12px;font-size:13px;font-weight:700;z-index:999999;box-shadow:0 8px 24px rgba(0,0,0,0.5);pointer-events:none;transition:opacity 0.25s ease;text-align:center;max-width:90vw;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
  }, 2400);
}

function openPyqYearSelectorModal() {
  window.location.href = '/pyqs.html';
}

window.openPyqYearSelectorModal = openPyqYearSelectorModal;

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
  // Wire fluid iOS-style tab switching: instant indicator spring + smooth content dissolve
  const navTargets = [
    { id: 'tab-live', url: '/', icon: NAV_ICONS.home, label: 'Home' },
    { id: 'tab-videos', url: '/all-videos.html', icon: NAV_ICONS.videos, label: 'Videos' },
    { id: 'tab-notes', url: '/notes.html', icon: NAV_ICONS.notes, label: 'Notes' },
    { id: 'tab-tests', url: '/tests.html', icon: NAV_ICONS.tests, label: 'Tests' },
    { id: 'tab-saved', url: '/saved.html', icon: NAV_ICONS.saved, label: 'Saved' },
    { id: 'tab-pyqs', url: '/pyqs.html', icon: NAV_ICONS.university, label: 'University' }
  ];

  navTargets.forEach(({ id, url, icon, label }) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = `${icon}<span>${label}</span>`;
    el.removeAttribute('onclick');
    el.removeAttribute('title');

    if (!el.__nnlFluidNavBound) {
      el.__nnlFluidNavBound = true;
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const curNorm = (window.location.pathname.replace(/^\//, '').replace(/\/$/, '') || 'index.html').toLowerCase();
        const targetNorm = (url.replace(/^\//, '').replace(/\/$/, '') || 'index.html').toLowerCase();

        if (curNorm === targetNorm || (curNorm === 'index.html' && targetNorm === 'index.html')) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        // 1. Move liquid indicator and active state immediately on touch/click
        const navTabs = el.closest('.nav-tabs') || document.querySelector('.header-nav-tabs .nav-tabs, .app-header .nav-tabs');
        if (navTabs) {
          navTabs.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active', 'floating-active'));
          el.classList.add('active');
          const pill = document.getElementById('apk-nav-liquid-indicator');
          if (pill && el.offsetWidth > 0) {
            pill.style.width = `${el.offsetWidth}px`;
            pill.style.height = `${el.offsetHeight}px`;
            pill.style.transform = `translate3d(${el.offsetLeft}px, ${el.offsetTop}px, 0)`;
            pill.style.opacity = '1';
          }
        }

        // 2. Smoothly dissolve out the current page content
        const main = document.querySelector('main, #catalog-view, #tests-catalog-view, #notes-catalog-view, .main-container');
        if (main) {
          main.classList.add('page-glide-out');
        }

        // 3. Fluid navigation after 75ms
        setTimeout(() => {
          window.location.href = url;
        }, 75);
      });
    }
  });

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
    hamBtn.className = 'apk-hamburger-btn';
    hamBtn.type = 'button';
    hamBtn.setAttribute('aria-label', 'Open Menu & Settings');
    hamBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
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
    const token = localStorage.getItem('token') || localStorage.getItem('nnl_access_token') || localStorage.getItem('nnl_auth_token') || (localStorage.getItem('nnl_guest_mode') === 'true');
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

    // Transparent Botanical Anatomical Heart & Lungs Artwork with delicate, tiny blooming flowers
    if (wrapper && !document.getElementById('apk-auth-botanical')) {
      const bot = document.createElement('div');
      bot.id = 'apk-auth-botanical';
      bot.className = 'apk-auth-botanical';
      bot.innerHTML = `
        <img src="${botanicalImgUrl}" alt="Botanical anatomical heart and lungs illustration" class="apk-botanical-img" draggable="false" />
        <div class="apk-botanical-sparks" aria-hidden="true"></div>
      `;

      const sparksEl = bot.querySelector('.apk-botanical-sparks');
      let lastSpawnTime = 0;

      // Delicate micro-blooms (tiny Sakura, Lavender floret, Chamomile, Rose petal)
      const flowerSVGs = [
        `<svg viewBox="0 0 24 24" width="10" height="10" fill="none"><g transform="translate(12,12)"><circle cx="0" cy="-3.5" r="2.5" fill="#F472B6"/><circle cx="3.5" cy="-1.2" r="2.5" fill="#FBCFE8"/><circle cx="2" cy="3" r="2.5" fill="#EC4899"/><circle cx="-2" cy="3" r="2.5" fill="#F472B6"/><circle cx="-3.5" cy="-1.2" r="2.5" fill="#FBCFE8"/><circle cx="0" cy="0" r="1.5" fill="#FDE047"/></g></svg>`,
        `<svg viewBox="0 0 24 24" width="10" height="10" fill="none"><g transform="translate(12,12)"><circle cx="0" cy="-3" r="2.2" fill="#C084FC"/><circle cx="3" cy="1" r="2.2" fill="#DDD6FE"/><circle cx="-3" cy="1" r="2.2" fill="#A855F7"/><circle cx="0" cy="2.5" r="1.8" fill="#E9D5FF"/><circle cx="0" cy="0" r="1.2" fill="#FEF08A"/></g></svg>`,
        `<svg viewBox="0 0 24 24" width="10" height="10" fill="none"><g transform="translate(12,12)"><ellipse cx="0" cy="-4" rx="1.4" ry="2.6" fill="#FFFFFF"/><ellipse cx="3.5" cy="-2" rx="1.4" ry="2.6" transform="rotate(60 3.5 -2)" fill="#FDF4FF"/><ellipse cx="3.5" cy="2" rx="1.4" ry="2.6" transform="rotate(120 3.5 2)" fill="#FFFFFF"/><ellipse cx="0" cy="4" rx="1.4" ry="2.6" fill="#FDF4FF"/><ellipse cx="-3.5" cy="2" rx="1.4" ry="2.6" transform="rotate(60 -3.5 2)" fill="#FFFFFF"/><ellipse cx="-3.5" cy="-2" rx="1.4" ry="2.6" transform="rotate(120 -3.5 -2)" fill="#FDF4FF"/><circle cx="0" cy="0" r="1.8" fill="#FACC15"/></g></svg>`,
        `<svg viewBox="0 0 24 24" width="9" height="9" fill="none"><path d="M4 20C4 20 7 11 20 4C20 4 17 17 4 20Z" fill="#34D399" opacity="0.9"/></svg>`,
        `<svg viewBox="0 0 24 24" width="10" height="10" fill="none"><path d="M12 2C8 6 5 10 5 14a7 7 0 0 0 14 0c0-4-3-8-7-12z" fill="#FB7185" opacity="0.92"/></svg>`,
        `<svg viewBox="0 0 24 24" width="9" height="9" fill="none"><circle cx="12" cy="12" r="2.6" fill="#FDE047"/><path d="M12 3v18M3 12h18" stroke="#FEF08A" stroke-width="1.4" stroke-linecap="round"/></svg>`
      ];

      const spawnFlowerAtCursor = (clientX, clientY, isMicro = false) => {
        if (!sparksEl) return;
        const rect = bot.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        // Keep active area strictly bounded inside the image
        if (x < 6 || y < 6 || x > rect.width - 6 || y > rect.height - 6) return;

        const flower = document.createElement('span');
        flower.className = 'apk-cursor-flower';
        flower.innerHTML = flowerSVGs[Math.floor(Math.random() * flowerSVGs.length)];
        flower.style.left = `${x}px`;
        flower.style.top = `${y}px`;

        const angle = Math.random() * Math.PI * 2;
        const dist = 5 + Math.random() * 12;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - (4 + Math.random() * 7);
        const rot = (Math.random() - 0.5) * 60;
        const baseScale = isMicro ? (0.34 + Math.random() * 0.12) : (0.44 + Math.random() * 0.12);

        flower.style.setProperty('--target-x', `${dx}px`);
        flower.style.setProperty('--target-y', `${dy}px`);
        flower.style.setProperty('--target-rot', `${rot}deg`);
        flower.style.setProperty('--target-scale', `${baseScale}`);

        sparksEl.appendChild(flower);
        setTimeout(() => flower.remove(), 750);
      };

      const onPointerMove = (e) => {
        const now = Date.now();
        if (now - lastSpawnTime < 90) return;
        lastSpawnTime = now;
        spawnFlowerAtCursor(e.clientX, e.clientY, true);
      };

      bot.addEventListener('pointermove', onPointerMove);
      bot.addEventListener('pointerdown', (e) => {
        spawnFlowerAtCursor(e.clientX, e.clientY, false);
      });

      // Mobile Touch Dragging: seamlessly sprout tiny blossoms as user drags finger across the lungs
      const handleTouchDrag = (e) => {
        if (!e.touches || !e.touches[0]) return;
        try { e.preventDefault(); } catch (_) {}
        const now = Date.now();
        if (now - lastSpawnTime < 55) return;
        lastSpawnTime = now;
        const touch = e.touches[0];
        spawnFlowerAtCursor(touch.clientX, touch.clientY, true);
      };

      bot.addEventListener('touchstart', (e) => {
        if (!e.touches || !e.touches[0]) return;
        try { e.preventDefault(); } catch (_) {}
        const touch = e.touches[0];
        spawnFlowerAtCursor(touch.clientX, touch.clientY, false);
      }, { passive: false });

      bot.addEventListener('touchmove', handleTouchDrag, { passive: false });

      wrapper.appendChild(bot);
    }
  }
}

function enforceAuthGuard() {
  let token = localStorage.getItem('token') || localStorage.getItem('nnl_access_token') || localStorage.getItem('nnl_auth_token');
  const isGuest = localStorage.getItem('nnl_guest_mode') === 'true' || token === 'GUEST_OPEN_ACCESS';
  if (token === 'GUEST_DEMO_TOKEN') {
    localStorage.removeItem('token');
    localStorage.removeItem('nnl_access_token');
    token = null;
  }
  const path = window.location.pathname || '/';
  const isSubpage = /\/(all-videos|notes|tests|saved|pyqs)\.html$/i.test(path);
  const explicitOut = sessionStorage.getItem('nnl_explicit_logout') === 'true';

  if (isSubpage && (!token && !isGuest || explicitOut)) {
    document.documentElement.style.visibility = 'hidden';
    try { window.AndroidAuthBridge?.clearSession?.(); } catch {}
    window.location.replace('/');
    return false;
  }

  if (token || isGuest) {
    document.body.classList.remove('apk-is-auth', 'on-login-screen');
    document.body.classList.add('is-logged-in');
    document.documentElement.classList.add('is-logged-in');
  } else if (!isSubpage) {
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
    pill.style.opacity = '0';
    navTabs.insertBefore(pill, navTabs.firstChild);
  }

  const placePillOnTab = (tabEl, immediate = false) => {
    if (!tabEl || tabEl.offsetWidth === 0) return;
    if (immediate) pill.style.transition = 'none';
    pill.style.width = `${tabEl.offsetWidth}px`;
    pill.style.height = `${tabEl.offsetHeight}px`;
    pill.style.transform = `translate3d(${tabEl.offsetLeft}px, ${tabEl.offsetTop}px, 0)`;
    pill.style.opacity = '1';
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

      // Keep option button visible across all pages and views (only hide on unauthenticated login screen or when side drawer is open)
      const ham = document.getElementById('apk-hamburger-btn');
      if (ham) {
        if (document.body.classList.contains('apk-side-open') || document.body.classList.contains('apk-is-auth')) {
          ham.style.setProperty('display', 'none', 'important');
          ham.style.setProperty('visibility', 'hidden', 'important');
        } else {
          ham.style.removeProperty('display');
          ham.style.removeProperty('visibility');
          ham.style.removeProperty('opacity');
          ham.style.removeProperty('pointer-events');
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
