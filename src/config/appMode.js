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

if (IS_HINGLISH_APK) {
  initApkOtaUpdater();
}

