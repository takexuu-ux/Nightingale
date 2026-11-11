// In-App Live OTA Updater for Red Sapphire Hinglish Android APK
// Talks to LocalBridgeServer (/__ota/status, /__ota/check, /__ota/apply, /__ota/install-apk)
// Zero-reinstall web bundle hot-swapping + native APK fallback when Android code changes.

let initialized = false;

function createBanner() {
  let banner = document.getElementById('apk-ota-banner');
  if (banner) return banner;

  banner = document.createElement('div');
  banner.id = 'apk-ota-banner';
  banner.style.cssText = [
    'position:fixed',
    'left:50%',
    'bottom:18px',
    'transform:translateX(-50%)',
    'z-index:11000',
    'display:none',
    'align-items:center',
    'gap:10px',
    'padding:10px 14px',
    'border-radius:14px',
    'background:linear-gradient(135deg, rgba(24,30,56,0.96), rgba(45,25,64,0.96))',
    'border:1px solid rgba(167,139,250,0.45)',
    'box-shadow:0 14px 36px rgba(0,0,0,0.65)',
    'color:#f8fafc',
    'font-family:Outfit,sans-serif',
    'font-size:13px',
    'max-width:92vw'
  ].join(';');

  banner.innerHTML = `
    <span id="apk-ota-msg" style="font-weight:600;white-space:nowrap;">Update ready</span>
    <button id="apk-ota-apply-btn" style="padding:6px 12px;border-radius:10px;border:1px solid rgba(196,181,253,0.5);background:linear-gradient(135deg,#6366f1,#ec4899);color:#fff;font-weight:700;font-size:12px;cursor:pointer;white-space:nowrap;">
      Update Now
    </button>
    <button id="apk-ota-dismiss-btn" aria-label="Dismiss" style="padding:4px 7px;border-radius:8px;border:1px solid rgba(255,255,255,0.14);background:transparent;color:#94a3b8;font-size:12px;cursor:pointer;">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
  `;

  document.body.appendChild(banner);
  banner.querySelector('#apk-ota-dismiss-btn')?.addEventListener('click', () => {
    banner.style.display = 'none';
  });
  return banner;
}

async function applyUpdate(isNative, applyBtn, statusLabel) {
  const setBtnText = (txt) => {
    if (!applyBtn) return;
    const sp = applyBtn.querySelector('span');
    if (sp) sp.textContent = txt;
    else applyBtn.textContent = txt;
  };
  if (applyBtn) {
    applyBtn.disabled = true;
    setBtnText(isNative ? 'Downloading APK...' : 'Updating...');
  }
  if (statusLabel) {
    statusLabel.textContent = isNative ? 'Downloading installer...' : 'Applying live update...';
  }

  try {
    const endpoint = isNative ? '/__ota/install-apk' : '/__ota/apply';
    const res = await fetch(endpoint, { method: 'POST' });
    const json = await res.json();
    if (json.ok) {
      if (!isNative) {
        setBtnText('Reloading...');
        setTimeout(() => window.location.reload(), 300);
      } else if (applyBtn) {
        setBtnText('Installer Opened');
        applyBtn.disabled = false;
      }
    } else {
      throw new Error(json.error || 'Update failed');
    }
  } catch (err) {
    if (statusLabel) statusLabel.textContent = `Update failed: ${err.message}`;
    if (applyBtn) {
      applyBtn.disabled = false;
      setBtnText('Retry Update');
    }
  }
}

function attachUpdateTriggers(checkFn) {
  // 1. Attach inside Settings panel on both index.html (.tweaks-body) & subpages (.tweaks-panel)
  const panel = document.querySelector('.tweaks-panel, .tweaks-body');
  if (panel && !document.getElementById('apk-ota-settings-box')) {
    const box = document.createElement('div');
    box.id = 'apk-ota-settings-box';
    box.className = 'tweaks-section';
    box.style.borderTop = '1px solid rgba(255,255,255,0.08)';
    box.style.paddingTop = '0.7rem';
    box.style.marginTop = '0.35rem';
    box.innerHTML = `
      <div class="tweaks-label" style="font-size:0.68rem;color:#c4b5fd;font-weight:700;margin-bottom:0.35rem;text-transform:uppercase;letter-spacing:0.06em;">App Live Update</div>
      <div id="apk-ota-ver-label" style="font-size:0.74rem;color:#cbd5e1;margin-bottom:0.45rem;">Checking version...</div>
      <button id="apk-ota-manual-btn" class="btn-note-view" style="width:100%;justify-content:center;padding:0.48rem 0.8rem;font-size:0.76rem;border-radius:10px;cursor:pointer;display:flex;align-items:center;">
        Check for Update
      </button>
    `;
    panel.appendChild(box);
    box.querySelector('#apk-ota-manual-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      checkFn(true);
    });
  }

  // 2. Also add a direct compact "Check Update" pill in top-right header so it is always 1-tap visible on Mobile & Tablet
  const headerRight = document.querySelector('.header-right-actions');
  if (headerRight && !document.getElementById('apk-header-update-btn')) {
    const hBtn = document.createElement('button');
    hBtn.id = 'apk-header-update-btn';
    hBtn.className = 'nav-btn';
    hBtn.style.cssText = 'display:inline-flex;align-items:center;gap:5px;border-color:rgba(167,139,250,0.38);color:#e9d5ff;font-size:0.7rem;padding:0.36rem 0.65rem;cursor:pointer;';
    hBtn.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      <span>Update</span>
    `;
    hBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      checkFn(true);
    });
    headerRight.insertBefore(hBtn, headerRight.firstChild);
  }
}

export function initApkOtaUpdater() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  const checkForUpdates = async (manual = false) => {
    const manualBtn = document.getElementById('apk-ota-manual-btn');
    const headerBtn = document.getElementById('apk-header-update-btn');
    const verLabel = document.getElementById('apk-ota-ver-label');
    if (manual && manualBtn) {
      manualBtn.disabled = true;
      manualBtn.textContent = 'Checking...';
    }
    if (manual && headerBtn) {
      headerBtn.disabled = true;
      headerBtn.querySelector('span').textContent = 'Checking...';
    }

    try {
      const res = await fetch(`/__ota/check?t=${Date.now()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (verLabel) {
        verLabel.textContent = `Web v${data.currentWebVersion || 1} • APK v${data.currentNativeVersionCode || 4}`;
      }

      const hasNative = Boolean(data.hasNativeUpdate);
      const hasWeb = Boolean(data.hasWebUpdate);

      if (hasNative || hasWeb) {
        const banner = createBanner();
        const msgEl = banner.querySelector('#apk-ota-msg');
        const applyBtn = banner.querySelector('#apk-ota-apply-btn');
        if (msgEl) {
          msgEl.textContent = hasNative
            ? `New APK v${data.remoteNativeVersionCode} Ready`
            : `Update v${data.remoteWebVersion} Available`;
        }
        if (applyBtn) {
          applyBtn.textContent = hasNative ? 'Install APK' : 'Update Now';
          applyBtn.onclick = () => applyUpdate(hasNative, applyBtn, verLabel);
        }
        banner.style.display = 'flex';

        if (headerBtn) {
          headerBtn.disabled = false;
          headerBtn.style.borderColor = '#ec4899';
          headerBtn.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(236,72,153,0.3))';
          headerBtn.querySelector('span').textContent = hasNative ? `Get APK v${data.remoteNativeVersionCode}` : `Update v${data.remoteWebVersion}`;
          headerBtn.onclick = (e) => {
            e.stopPropagation();
            applyUpdate(hasNative, headerBtn, verLabel);
          };
        }

        if (manualBtn) {
          manualBtn.disabled = false;
          manualBtn.textContent = hasNative ? `Install APK v${data.remoteNativeVersionCode}` : `Install Update v${data.remoteWebVersion}`;
          manualBtn.onclick = (e) => {
            e.stopPropagation();
            applyUpdate(hasNative, manualBtn, verLabel);
          };
        }
      } else {
        if (headerBtn) {
          headerBtn.disabled = false;
          headerBtn.querySelector('span').textContent = manual ? 'Up to Date' : 'Update';
          if (manual) {
            setTimeout(() => {
              const sp = headerBtn.querySelector('span');
              if (sp && sp.textContent === 'Up to Date') sp.textContent = 'Update';
            }, 2500);
          }
        }
        if (manualBtn) {
          manualBtn.disabled = false;
          manualBtn.textContent = manual ? 'Up to Date' : 'Check for Update';
          if (manual) {
            setTimeout(() => {
              if (manualBtn.textContent === 'Up to Date') manualBtn.textContent = 'Check for Update';
            }, 2500);
          }
        }
      }
    } catch {
      if (verLabel) verLabel.textContent = 'Offline / Local Mode';
      if (headerBtn) {
        headerBtn.disabled = false;
        headerBtn.querySelector('span').textContent = 'Update';
      }
      if (manualBtn) {
        manualBtn.disabled = false;
        manualBtn.textContent = 'Check for Update';
      }
    }
  };

  const boot = () => {
    attachUpdateTriggers(checkForUpdates);
    setTimeout(() => checkForUpdates(false), 1200);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}
