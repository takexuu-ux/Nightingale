// In-App Live OTA Updater for Red Sapphire Hinglish Android APK
// Talks to LocalBridgeServer (/__ota/status, /__ota/check, /__ota/apply, /__ota/install-apk)
// Zero-reinstall web bundle hot-swapping + native APK fallback when Android code changes.

let initialized = false;
let apkDownloadRunning = false;

function formatMb(bytes) {
  if (!bytes || bytes <= 0) return '0.0';
  return (bytes / (1024 * 1024)).toFixed(1);
}

function formatSpeed(kbps) {
  if (!kbps || kbps <= 0) return '';
  if (kbps >= 1024) return `${(kbps / 1024).toFixed(1)} MB/s`;
  return `${kbps} KB/s`;
}

function setButtonLabel(btn, text) {
  if (!btn) return;
  const sp = btn.querySelector('span');
  if (sp) sp.textContent = text;
  else btn.textContent = text;
}

function updateProgressUI(status, activeBtn, statusLabel) {
  const banner = createBanner();
  const msgEl = banner.querySelector('#apk-ota-msg');
  const applyBtn = banner.querySelector('#apk-ota-apply-btn');
  const progressWrap = banner.querySelector('#apk-ota-progress-wrap');
  const progressBar = banner.querySelector('#apk-ota-progress-bar');
  const headerBtn = document.getElementById('apk-header-update-btn');
  const manualBtn = document.getElementById('apk-ota-manual-btn');
  const settingsWrap = document.getElementById('apk-ota-settings-progress-wrap');
  const settingsBar = document.getElementById('apk-ota-settings-progress-bar');

  const pct = Math.max(0, Math.min(100, Number(status?.percent || 0)));
  const dl = Number(status?.downloadedBytes || 0);
  const total = Number(status?.totalBytes || 0);
  const speedStr = formatSpeed(status?.speedKbps);

  let labelText = 'Preparing download...';
  let btnText = 'Downloading...';

  if (status?.state === 'checking') {
    labelText = 'Checking APK package...';
    btnText = 'Checking...';
  } else if (status?.state === 'downloading') {
    const mbText = total > 0 ? `${formatMb(dl)} / ${formatMb(total)} MB` : `${formatMb(dl)} MB`;
    labelText = `Downloading ${pct}% • ${mbText}${speedStr ? ` (${speedStr})` : ''}`;
    btnText = total > 0 ? `${pct}% (${formatMb(dl)}/${formatMb(total)} MB)` : `${formatMb(dl)} MB...`;
  } else if (status?.state === 'verifying') {
    labelText = 'Verifying APK signature...';
    btnText = 'Verifying...';
  } else if (status?.state === 'ready') {
    labelText = 'APK verified • Opening Android installer...';
    btnText = 'Open Installer';
  } else if (status?.state === 'error') {
    labelText = `Update failed: ${status.error || 'Download error'}`;
    btnText = 'Retry Update';
  }

  banner.style.display = 'flex';
  if (msgEl) msgEl.textContent = labelText;
  if (statusLabel) statusLabel.textContent = labelText;

  const showBar = status?.state === 'downloading' || status?.state === 'verifying' || status?.state === 'ready';
  if (progressWrap && progressBar) {
    progressWrap.style.display = showBar ? 'block' : 'none';
    progressBar.style.width = `${status?.state === 'verifying' || status?.state === 'ready' ? 100 : pct}%`;
  }
  if (settingsWrap && settingsBar) {
    settingsWrap.style.display = showBar ? 'block' : 'none';
    settingsBar.style.width = `${status?.state === 'verifying' || status?.state === 'ready' ? 100 : pct}%`;
  }

  const isBusy = status?.state === 'checking' || status?.state === 'downloading' || status?.state === 'verifying';
  [applyBtn, manualBtn, activeBtn].filter(Boolean).forEach((b) => {
    b.disabled = isBusy;
    setButtonLabel(b, btnText);
  });
  if (headerBtn) {
    headerBtn.disabled = isBusy;
    setButtonLabel(headerBtn, status?.state === 'downloading' ? `${pct}%` : (status?.state === 'ready' ? 'Install' : btnText));
  }
}

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
    'flex-direction:column',
    'gap:8px',
    'padding:11px 14px',
    'border-radius:14px',
    'background:linear-gradient(135deg, rgba(24,30,56,0.97), rgba(45,25,64,0.97))',
    'border:1px solid rgba(167,139,250,0.45)',
    'box-shadow:0 14px 36px rgba(0,0,0,0.65)',
    'color:#f8fafc',
    'font-family:Outfit,sans-serif',
    'font-size:13px',
    'min-width:260px',
    'max-width:92vw'
  ].join(';');

  banner.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
      <span id="apk-ota-msg" style="font-weight:600;line-height:1.25;">Update ready</span>
      <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
        <button id="apk-ota-apply-btn" style="padding:6px 12px;border-radius:10px;border:1px solid rgba(196,181,253,0.5);background:linear-gradient(135deg,#6366f1,#ec4899);color:#fff;font-weight:700;font-size:12px;cursor:pointer;white-space:nowrap;">
          Update Now
        </button>
        <button id="apk-ota-dismiss-btn" aria-label="Dismiss" style="padding:4px 7px;border-radius:8px;border:1px solid rgba(255,255,255,0.14);background:transparent;color:#94a3b8;font-size:12px;cursor:pointer;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>
    <div id="apk-ota-progress-wrap" style="display:none;width:100%;height:6px;border-radius:999px;background:rgba(255,255,255,0.12);overflow:hidden;">
      <div id="apk-ota-progress-bar" style="width:0%;height:100%;border-radius:999px;background:linear-gradient(90deg,#6366f1,#ec4899);transition:width 180ms ease;"></div>
    </div>
  `;

  document.body.appendChild(banner);
  banner.querySelector('#apk-ota-dismiss-btn')?.addEventListener('click', () => {
    banner.style.display = 'none';
  });
  return banner;
}

async function applyUpdate(isNative, applyBtn, statusLabel) {
  if (!isNative) {
    if (applyBtn) {
      applyBtn.disabled = true;
      setButtonLabel(applyBtn, 'Updating...');
    }
    if (statusLabel) statusLabel.textContent = 'Applying live update...';
    try {
      const res = await fetch('/__ota/apply', { method: 'POST' });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || 'Update failed');
      setButtonLabel(applyBtn, 'Reloading...');
      setTimeout(() => window.location.reload(), 300);
    } catch (err) {
      if (statusLabel) statusLabel.textContent = `Update failed: ${err.message}`;
      if (applyBtn) {
        applyBtn.disabled = false;
        setButtonLabel(applyBtn, 'Retry Update');
      }
    }
    return;
  }

  if (apkDownloadRunning) return;
  apkDownloadRunning = true;

  try {
    // Fast path: if verified APK is already ready on disk, open installer immediately
    const preCheck = await fetch(`/__ota/apk-progress?t=${Date.now()}`);
    if (preCheck.ok) {
      const st = await preCheck.json();
      if (st.ready) {
        updateProgressUI(st, applyBtn, statusLabel);
        await fetch('/__ota/launch-installer', { method: 'POST' });
        apkDownloadRunning = false;
        return;
      }
    }

    const startRes = await fetch('/__ota/start-apk-download', { method: 'POST' });
    if (startRes.status === 404) {
      // Legacy APK fallback (v1.0.7 / v1.0.8)
      updateProgressUI({ state: 'downloading', percent: 0, downloadedBytes: 0, totalBytes: 0 }, applyBtn, statusLabel);
      const legacyRes = await fetch('/__ota/install-apk', { method: 'POST' });
      const legacyJson = await legacyRes.json();
      if (!legacyJson.ok) throw new Error(legacyJson.error || 'Update failed');
      updateProgressUI({ state: 'ready', percent: 100 }, applyBtn, statusLabel);
      apkDownloadRunning = false;
      return;
    }

    const startJson = await startRes.json();
    updateProgressUI(startJson, applyBtn, statusLabel);

    while (true) {
      await new Promise((r) => setTimeout(r, 250));
      const pRes = await fetch(`/__ota/apk-progress?t=${Date.now()}`);
      if (!pRes.ok) throw new Error(`Progress HTTP ${pRes.status}`);
      const status = await pRes.json();
      updateProgressUI(status, applyBtn, statusLabel);

      if (status.state === 'ready') {
        break;
      }
      if (status.state === 'error') {
        throw new Error(status.error || 'APK download failed');
      }
    }
  } catch (err) {
    updateProgressUI({ state: 'error', error: err.message }, applyBtn, statusLabel);
  } finally {
    apkDownloadRunning = false;
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
      <div id="apk-ota-settings-progress-wrap" style="display:none;width:100%;height:5px;border-radius:999px;background:rgba(255,255,255,0.12);overflow:hidden;margin-bottom:0.5rem;">
        <div id="apk-ota-settings-progress-bar" style="width:0%;height:100%;border-radius:999px;background:linear-gradient(90deg,#6366f1,#ec4899);transition:width 180ms ease;"></div>
      </div>
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
