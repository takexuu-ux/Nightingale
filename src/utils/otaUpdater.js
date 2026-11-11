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

  let labelText = 'Preparing...';
  let btnText = 'Downloading...';

  if (status?.state === 'checking') {
    labelText = 'Checking...';
    btnText = 'Checking...';
  } else if (status?.state === 'downloading') {
    const mbText = total > 0
      ? `${formatMb(dl)} / ${formatMb(total)} MB`
      : (dl > 0 ? `${formatMb(dl)} MB` : 'update');
    labelText = `Downloading ${mbText}`;
    btnText = `${pct}%`;
  } else if (status?.state === 'verifying') {
    labelText = 'Verifying...';
    btnText = 'Verifying...';
  } else if (status?.state === 'ready') {
    labelText = 'Ready to install';
    btnText = 'Install';
  } else if (status?.state === 'error') {
    labelText = 'Update failed';
    btnText = 'Retry';
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

  banner.innerHTML = `
    <div class="apk-ota-banner-row">
      <div class="apk-ota-title-wrap">
        <span class="apk-ota-dot" aria-hidden="true"></span>
        <span id="apk-ota-msg">Update available</span>
      </div>
      <div class="apk-ota-actions">
        <button id="apk-ota-apply-btn" type="button">Update</button>
        <button id="apk-ota-dismiss-btn" type="button" aria-label="Dismiss">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>
    <div id="apk-ota-progress-wrap" style="display:none;">
      <div id="apk-ota-progress-bar"></div>
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
    box.innerHTML = `
      <div class="apk-ota-settings-head">
        <span class="apk-ota-settings-label">App Update</span>
        <span id="apk-ota-ver-label">v—</span>
      </div>
      <div id="apk-ota-settings-progress-wrap" style="display:none;">
        <div id="apk-ota-settings-progress-bar"></div>
      </div>
      <button id="apk-ota-manual-btn" type="button">Check update</button>
    `;
    panel.appendChild(box);
    box.querySelector('#apk-ota-manual-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      checkFn(true);
    });
  }

  // 2. Compact header trigger when not replaced by settings sheet
  const headerRight = document.querySelector('.header-right-actions');
  if (headerRight && !document.getElementById('apk-header-update-btn')) {
    const hBtn = document.createElement('button');
    hBtn.id = 'apk-header-update-btn';
    hBtn.className = 'nav-btn';
    hBtn.type = 'button';
    hBtn.innerHTML = `
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
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
        verLabel.textContent = `Build ${data.currentNativeVersionCode || 17} (${data.currentWebVersion || 16})`;
      }

      const hasNative = Boolean(data.hasNativeUpdate);
      const hasWeb = Boolean(data.hasWebUpdate);

      if (hasNative || hasWeb) {
        const banner = createBanner();
        const msgEl = banner.querySelector('#apk-ota-msg');
        const applyBtn = banner.querySelector('#apk-ota-apply-btn');
        if (msgEl) {
          msgEl.textContent = hasNative ? 'New update' : 'Update ready';
        }
        if (applyBtn) {
          applyBtn.textContent = hasNative ? 'Install' : 'Update';
          applyBtn.onclick = () => applyUpdate(hasNative, applyBtn, verLabel);
        }
        banner.style.display = 'flex';

        if (headerBtn) {
          headerBtn.disabled = false;
          headerBtn.querySelector('span').textContent = hasNative ? 'Install' : 'Update';
          headerBtn.onclick = (e) => {
            e.stopPropagation();
            applyUpdate(hasNative, headerBtn, verLabel);
          };
        }

        if (manualBtn) {
          manualBtn.disabled = false;
          manualBtn.textContent = hasNative ? 'Install update' : 'Update now';
          manualBtn.onclick = (e) => {
            e.stopPropagation();
            applyUpdate(hasNative, manualBtn, verLabel);
          };
        }
      } else {
        if (headerBtn) {
          headerBtn.disabled = false;
          headerBtn.querySelector('span').textContent = manual ? 'Latest' : 'Update';
          if (manual) {
            setTimeout(() => {
              const sp = headerBtn.querySelector('span');
              if (sp && sp.textContent === 'Latest') sp.textContent = 'Update';
            }, 2200);
          }
        }
        if (manualBtn) {
          manualBtn.disabled = false;
          manualBtn.textContent = manual ? 'Up to date' : 'Check update';
          if (manual) {
            setTimeout(() => {
              if (manualBtn.textContent === 'Up to date') manualBtn.textContent = 'Check update';
            }, 2200);
          }
        }
      }
    } catch {
      if (verLabel) verLabel.textContent = 'Offline';
      if (headerBtn) {
        headerBtn.disabled = false;
        headerBtn.querySelector('span').textContent = 'Update';
      }
      if (manualBtn) {
        manualBtn.disabled = false;
        manualBtn.textContent = 'Check update';
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
