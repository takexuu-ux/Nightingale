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
  if (applyBtn) {
    applyBtn.disabled = true;
    applyBtn.textContent = isNative ? 'Downloading APK...' : 'Updating...';
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
        if (applyBtn) applyBtn.textContent = 'Reloading...';
        setTimeout(() => window.location.reload(), 300);
      } else if (applyBtn) {
        applyBtn.textContent = 'Installer Opened';
        applyBtn.disabled = false;
      }
    } else {
      throw new Error(json.error || 'Update failed');
    }
  } catch (err) {
    if (statusLabel) statusLabel.textContent = `Update failed: ${err.message}`;
    if (applyBtn) {
      applyBtn.disabled = false;
      applyBtn.textContent = 'Retry Update';
    }
  }
}

function attachToSettingsPanel(checkFn) {
  const panel = document.querySelector('.tweaks-panel');
  if (!panel || document.getElementById('apk-ota-settings-box')) return;

  const box = document.createElement('div');
  box.id = 'apk-ota-settings-box';
  box.className = 'tweaks-section';
  box.style.borderTop = '1px solid rgba(255,255,255,0.08)';
  box.style.paddingTop = '0.7rem';
  box.style.marginTop = '0.5rem';
  box.innerHTML = `
    <div class="tweaks-label">APK Live Update</div>
    <div id="apk-ota-ver-label" style="font-size:0.74rem;color:#cbd5e1;margin-bottom:0.45rem;">Checking version...</div>
    <button id="apk-ota-manual-btn" class="btn-note-view" style="width:100%;justify-content:center;padding:0.48rem 0.8rem;font-size:0.76rem;border-radius:10px;cursor:pointer;">
      Check for Update
    </button>
  `;
  panel.appendChild(box);

  box.querySelector('#apk-ota-manual-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    checkFn(true);
  });
}

export function initApkOtaUpdater() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  const checkForUpdates = async (manual = false) => {
    const manualBtn = document.getElementById('apk-ota-manual-btn');
    const verLabel = document.getElementById('apk-ota-ver-label');
    if (manual && manualBtn) {
      manualBtn.disabled = true;
      manualBtn.textContent = 'Checking...';
    }

    try {
      const res = await fetch(`/__ota/check?t=${Date.now()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (verLabel) {
        verLabel.textContent = `Web v${data.currentWebVersion || 1} • APK v${data.currentNativeVersionCode || 2}`;
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

        if (manualBtn) {
          manualBtn.disabled = false;
          manualBtn.textContent = hasNative ? `Install APK v${data.remoteNativeVersionCode}` : `Install Update v${data.remoteWebVersion}`;
          manualBtn.onclick = (e) => {
            e.stopPropagation();
            applyUpdate(hasNative, manualBtn, verLabel);
          };
        }
      } else if (manualBtn) {
        manualBtn.disabled = false;
        manualBtn.textContent = manual ? 'Up to Date' : 'Check for Update';
        if (manual) {
          setTimeout(() => {
            if (manualBtn.textContent === 'Up to Date') manualBtn.textContent = 'Check for Update';
          }, 2500);
        }
      }
    } catch {
      if (verLabel) verLabel.textContent = 'Offline / Local Mode';
      if (manualBtn) {
        manualBtn.disabled = false;
        manualBtn.textContent = 'Check for Update';
      }
    }
  };

  const boot = () => {
    attachToSettingsPanel(checkForUpdates);
    setTimeout(() => checkForUpdates(false), 1200);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}
