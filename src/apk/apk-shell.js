// Red Sapphire Hinglish APK — Scratch Minimal UI Shell & Liquid Motion Engine
import './apk-ui.css';

function detectSystemDark() {
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

export function applySystemTheme(isDark) {
  const mode = isDark ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', mode);
  try {
    if (window.AndroidThemeBridge && typeof window.AndroidThemeBridge.setDarkMode === 'function') {
      window.AndroidThemeBridge.setDarkMode(isDark);
    }
  } catch {}
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
  live: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>',
  videos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 4 20 12 6 20 6 4"/></svg>',
  notes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>',
  tests: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  refresh: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>',
  settings: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  back: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>',
  close: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
};

const EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu;

function stripEmojisAndShorten(root) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  let node;
  while ((node = walker.nextNode())) {
    if (EMOJI_RE.test(node.nodeValue)) {
      node.nodeValue = node.nodeValue.replace(EMOJI_RE, '').replace(/\s{2,}/g, ' ');
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
  const TARGET_SELECTOR = '.class-card, .subject-card, .sd-lecture-card, .test-card, .doc-card, .nav-tab, .nav-btn, .apk-icon-btn, .section-mode-tab, .filter-chip, .btn, .sd-lecture-btn, .sd-note-btn, .sd-dl-btn, .sd-del-btn, .btn-note-view, .apk-pill-opt';

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

function buildSettingsSheet() {
  if (document.getElementById('apk-settings-sheet')) return;

  const backdrop = document.createElement('div');
  backdrop.id = 'apk-settings-sheet';
  backdrop.className = 'apk-sheet-backdrop hide';
  const phone = localStorage.getItem('nnl_phone') || 'Nightingale';

  backdrop.innerHTML = `
    <div class="apk-sheet-card" role="dialog" aria-label="Settings">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
        <div>
          <div style="font-size:16px;font-weight:800;color:var(--text-primary);">Settings</div>
          <div style="font-size:12px;color:var(--text-secondary);">${phone}</div>
        </div>
        <button id="apk-settings-close-btn" class="apk-icon-btn" aria-label="Close">${NAV_ICONS.close}</button>
      </div>

      <div id="apk-sheet-ota-slot"></div>

      <button id="apk-sheet-logout-btn" class="btn btn-ghost" style="width:100%;color:var(--danger-ink);border-color:var(--danger-border);background:var(--danger-bg);">
        Sign Out
      </button>
    </div>
  `;

  document.body.appendChild(backdrop);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) backdrop.classList.add('hide');
  });
  backdrop.querySelector('#apk-settings-close-btn')?.addEventListener('click', () => {
    backdrop.classList.add('hide');
  });
  backdrop.querySelector('#apk-sheet-logout-btn')?.addEventListener('click', () => {
    const legacyLogout = document.getElementById('logout-btn');
    if (legacyLogout) {
      legacyLogout.click();
    } else {
      localStorage.removeItem('nnl_access_token');
      localStorage.removeItem('nnl_refresh_token');
      try { window.AndroidAuthBridge?.clearSession?.(); } catch {}
      window.location.href = '/';
    }
  });

  // Adopt #apk-ota-settings-box from old hidden widget whenever injected by otaUpdater.js
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
  const obs = new MutationObserver(adoptOtaBox);
  obs.observe(document.body, { childList: true, subtree: true });
}

function normalizeHeaderAndChrome() {
  // Replace nav tab icons + crisp 1-word labels
  const tabs = [
    { id: 'tab-live', icon: NAV_ICONS.live, label: 'Live' },
    { id: 'tab-videos', icon: NAV_ICONS.videos, label: 'Videos' },
    { id: 'tab-notes', icon: NAV_ICONS.notes, label: 'Notes' },
    { id: 'tab-tests', icon: NAV_ICONS.tests, label: 'Tests' }
  ];
  tabs.forEach(({ id, icon, label }) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = `${icon}<span>${label}</span>`;
  });

  // Remove unused Upcoming tab in rail/dock so 4 clean tabs fit evenly on phone & tablet
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

  // Add compact Settings gear icon inside header-right-actions
  const rightActions = document.querySelector('.header-right-actions');
  if (rightActions && !document.getElementById('apk-settings-open-btn')) {
    const sBtn = document.createElement('button');
    sBtn.id = 'apk-settings-open-btn';
    sBtn.className = 'apk-icon-btn';
    sBtn.setAttribute('aria-label', 'Settings');
    sBtn.innerHTML = `${NAV_ICONS.settings}<span id="apk-settings-dot" class="apk-update-dot hide"></span>`;
    sBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('apk-settings-sheet')?.classList.remove('hide');
    });
    rightActions.appendChild(sBtn);
  }

  // Editorial single-line minimal page titles
  const heroTitle = document.querySelector('.notes-hero-title');
  if (heroTitle) {
    const p = window.location.pathname;
    if (p.includes('all-videos')) heroTitle.innerHTML = '<span class="apk-editorial-serif">All</span> Videos';
    else if (p.includes('notes')) heroTitle.innerHTML = '<span class="apk-editorial-serif">Study</span> Notes';
    else if (p.includes('tests')) heroTitle.innerHTML = '<span class="apk-editorial-serif">Practice</span> Tests';
  }

  // Minimal Live page title above classes if not already present
  const dash = document.getElementById('classroom-dashboard');
  if (dash && !document.getElementById('apk-live-topbar')) {
    const bar = document.createElement('div');
    bar.id = 'apk-live-topbar';
    bar.className = 'apk-page-topbar';
    bar.innerHTML = `
      <h1 class="apk-editorial-title"><span class="apk-editorial-serif">Live</span> Classes</h1>
      <span class="category-tag">Red Sapphire</span>
    `;
    dash.insertBefore(bar, dash.firstChild);
  }

  // Minimal Preloader Logo Badge + Brand Wordmark
  const preloaderLogo = document.querySelector('.preloader-logo');
  if (preloaderLogo && !preloaderLogo.querySelector('.apk-logo-badge')) {
    const badge = document.createElement('div');
    badge.className = 'apk-logo-badge';
    badge.innerHTML = NIGHTINGALE_MARK_SVG;
    preloaderLogo.insertBefore(badge, preloaderLogo.firstChild);
    const txt = preloaderLogo.querySelector('.logo-text');
    if (txt) txt.textContent = 'Nightingale';
  }

  // Minimal Header Rail Logo Badge (.header-logo exists across all 4 HTML pages)
  const headerLogo = document.querySelector('.header-logo');
  if (headerLogo) {
    headerLogo.innerHTML = NIGHTINGALE_MARK_SVG;
    headerLogo.setAttribute('aria-label', 'Nightingale');
  }

  // Sync auth body flag + tablet showcase + Light/Dark switch on Auth screen
  const syncAuthMode = () => {
    const authEl = document.getElementById('auth-screen');
    const isAuth = Boolean(authEl && !authEl.classList.contains('hide'));
    document.body.classList.toggle('apk-is-auth', isAuth);
  };
  syncAuthMode();

  const authEl = document.getElementById('auth-screen');
  if (authEl) {
    new MutationObserver(syncAuthMode).observe(authEl, { attributes: true, attributeFilter: ['class'] });

    // Bare Hero Header [Logo] Nightingale outside container on top
    const wrapper = authEl.closest('.auth-hero-wrapper');
    if (wrapper && !document.getElementById('apk-auth-showcase')) {
      const showcase = document.createElement('div');
      showcase.id = 'apk-auth-showcase';
      showcase.className = 'apk-auth-showcase';
      showcase.innerHTML = `
        <div class="apk-brand-inline-row">
          <div class="apk-logo-badge">${NIGHTINGALE_MARK_SVG}</div>
          <h1 class="apk-showcase-title apk-brand-gradient-text">Nightingale</h1>
        </div>
      `;
      wrapper.insertBefore(showcase, authEl);
    }

    const phoneInput = document.getElementById('phone-input');
    if (phoneInput) {
      phoneInput.placeholder = '10-digit number';
    }
    const sendOtpSpan = document.querySelector('#send-otp-btn span');
    if (sendOtpSpan) {
      sendOtpSpan.textContent = 'Get OTP';
    }
  }
}

function initApkShell() {
  normalizeHeaderAndChrome();
  buildSettingsSheet();
  attachWaterDropMotion();
  stripEmojisAndShorten(document.body);

  // Observe dynamic renders cleanly (for emoji stripping + short button text)
  const target = document.getElementById('app') || document.body;
  let scheduled = false;
  const mutObs = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      stripEmojisAndShorten(target);
    });
  });
  mutObs.observe(target, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApkShell);
} else {
  initApkShell();
}
