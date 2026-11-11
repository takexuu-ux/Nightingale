import { initApkOtaUpdater } from '../utils/otaUpdater.js';

// Runtime & Build-Flavor Configuration
// Normal website keeps both Hinglish & English selectable;
// Hinglish APK build (--mode hinglish-apk) locks strictly to Red Sapphire (Hinglish).

export const IS_HINGLISH_APK = import.meta.env.VITE_HINGLISH_APK === 'true';

export const IS_ANDROID_WEBVIEW =
  IS_HINGLISH_APK ||
  (typeof window !== 'undefined' && Boolean(window.__NNL_ANDROID_APK__)) ||
  (typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent));

export function getPdfPreviewSrc(rawPdfUrl) {
  if (!rawPdfUrl) return '';
  if (IS_ANDROID_WEBVIEW) {
    return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(rawPdfUrl)}`;
  }
  return `${rawPdfUrl}#view=FitH&toolbar=1&navpanes=0`;
}

export function restoreApkSessionSync() {
  try {
    if (typeof window === 'undefined' || !window.AndroidAuthBridge) return;
    const raw = window.AndroidAuthBridge.getSessionJson();
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved.access && !localStorage.getItem('nnl_access_token')) {
      localStorage.setItem('nnl_access_token', saved.access);
    }
    if (saved.refresh && !localStorage.getItem('nnl_refresh_token')) {
      localStorage.setItem('nnl_refresh_token', saved.refresh);
    }
    if (saved.phone && !localStorage.getItem('nnl_phone')) {
      localStorage.setItem('nnl_phone', saved.phone);
    }
    if (saved.deviceId && !localStorage.getItem('nnl_device_id')) {
      localStorage.setItem('nnl_device_id', saved.deviceId);
    }
  } catch {}
}

export function persistApkSession() {
  try {
    if (typeof window !== 'undefined' && window.AndroidAuthBridge) {
      window.AndroidAuthBridge.saveSession(
        localStorage.getItem('nnl_access_token') || '',
        localStorage.getItem('nnl_refresh_token') || '',
        localStorage.getItem('nnl_phone') || '',
        localStorage.getItem('nnl_device_id') || ''
      );
    }
  } catch {}
}

export function clearApkSession() {
  try {
    if (typeof window !== 'undefined' && window.AndroidAuthBridge) {
      window.AndroidAuthBridge.clearSession();
    }
  } catch {}
}

// Synchronously restore session BEFORE any page script checks nnl_access_token
restoreApkSessionSync();
// If already signed in on localStorage (e.g. upgrading from v1.0.1->v1.0.4), back it up immediately
if (typeof window !== 'undefined' && localStorage.getItem('nnl_access_token')) {
  persistApkSession();
}

if (IS_HINGLISH_APK) {
  initApkOtaUpdater();
}

