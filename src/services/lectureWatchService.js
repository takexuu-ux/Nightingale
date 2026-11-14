// Lecture Watch Progress & Saved Lectures Service
// Persists progress in localStorage ('nnl_watched_lectures')
// Syncs with Android native player history via AndroidVideoBridge
// Manages bookmarks / saved lectures ('nnl_saved_lectures')

const WATCH_KEY = 'nnl_watched_lectures';
const SAVED_KEY = 'nnl_saved_lectures';

export function getWatchHistory() {
  let map = {};
  try {
    const raw = localStorage.getItem(WATCH_KEY);
    if (raw) map = JSON.parse(raw);
  } catch (_) {}

  // Sync from native Android player if available
  if (typeof window !== 'undefined' && window.AndroidVideoBridge && typeof window.AndroidVideoBridge.getWatchHistoryJson === 'function') {
    try {
      const nativeRaw = window.AndroidVideoBridge.getWatchHistoryJson();
      if (nativeRaw) {
        const nativeArr = JSON.parse(nativeRaw);
        if (Array.isArray(nativeArr)) {
          let updated = false;
          nativeArr.forEach(item => {
            if (item && item.recId) {
              const id = String(item.recId);
              const existing = map[id];
              if (!existing || (item.lastWatched || 0) > (existing.lastWatched || 0)) {
                map[id] = {
                  recId: id,
                  title: item.title || existing?.title || 'Lecture',
                  instructor: item.instructor || existing?.instructor || 'NNL Faculty',
                  currentTime: item.currentTime || 0,
                  duration: item.duration || 0,
                  percent: Math.min(100, Math.max(0, item.percent || 0)),
                  lastWatched: item.lastWatched || Date.now()
                };
                updated = true;
              }
            }
          });
          if (updated) {
            try { localStorage.setItem(WATCH_KEY, JSON.stringify(map)); } catch (_) {}
          }
        }
      }
    } catch (_) {}
  }
  return map;
}

export function getLectureProgress(recId) {
  if (!recId) return null;
  const history = getWatchHistory();
  return history[String(recId)] || null;
}

export function saveLectureProgress(recId, { currentTime = 0, duration = 0, percent = 0, title = '', instructor = '', subject = '', thumb = '' } = {}) {
  if (!recId) return;
  const map = getWatchHistory();
  const id = String(recId);
  const calcPercent = percent > 0 ? percent : (duration > 0 ? Math.round((currentTime / duration) * 100) : 0);
  const prev = map[id] || {};

  map[id] = {
    recId: id,
    title: title || prev.title || 'Lecture',
    instructor: instructor || prev.instructor || 'NNL Faculty',
    subject: subject || prev.subject || '',
    thumb: thumb || prev.thumb || '',
    currentTime: Math.round(currentTime),
    duration: Math.round(duration),
    percent: Math.min(100, Math.max(1, calcPercent)),
    lastWatched: Date.now()
  };

  try {
    localStorage.setItem(WATCH_KEY, JSON.stringify(map));
  } catch (_) {}

  // Trigger UI refresh event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nnl:watch-progress-updated', { detail: map[id] }));
  }
}

export function getRecentlyWatchedLectures(limit = 8) {
  const map = getWatchHistory();
  const list = Object.values(map);
  list.sort((a, b) => (b.lastWatched || 0) - (a.lastWatched || 0));
  return list.slice(0, limit);
}

// ── Saved Lectures (Bookmarks) ──

export function getSavedLectureIds() {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return [];
}

export function isLectureSaved(recId) {
  if (!recId) return false;
  const ids = getSavedLectureIds();
  return ids.includes(String(recId));
}

export function toggleSavedLecture(recId, meta = null) {
  if (!recId) return false;
  const id = String(recId);
  let ids = getSavedLectureIds();
  const alreadySaved = ids.includes(id);

  if (alreadySaved) {
    ids = ids.filter(x => x !== id);
  } else {
    ids.unshift(id);
  }

  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
  } catch (_) {}

  // Also maintain metadata map for saved items so they can render on Home screen
  try {
    let metaMap = {};
    const rawMeta = localStorage.getItem('nnl_saved_lectures_meta');
    if (rawMeta) metaMap = JSON.parse(rawMeta);
    if (!alreadySaved && meta) {
      metaMap[id] = {
        id,
        title: meta.title || 'Saved Lecture',
        instructor: meta.instructor || 'NNL Faculty',
        subject: meta.subject || '',
        thumb: meta.thumb || '',
        duration: meta.duration || '',
        notePdfUrl: meta.notePdfUrl || '',
        date: meta.date || ''
      };
    } else if (alreadySaved) {
      delete metaMap[id];
    }
    localStorage.setItem('nnl_saved_lectures_meta', JSON.stringify(metaMap));
  } catch (_) {}

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nnl:saved-lectures-updated', { detail: { id, isSaved: !alreadySaved } }));
  }
  return !alreadySaved;
}

export function getSavedLecturesList() {
  const ids = getSavedLectureIds();
  let metaMap = {};
  try {
    const raw = localStorage.getItem('nnl_saved_lectures_meta');
    if (raw) metaMap = JSON.parse(raw);
  } catch (_) {}

  return ids.map(id => metaMap[id] || { id, title: `Lecture #${id}` });
}

// Global hook for Android resume
if (typeof window !== 'undefined') {
  window.__nnlRefreshWatchProgress = () => {
    getWatchHistory();
    window.dispatchEvent(new CustomEvent('nnl:watch-progress-updated'));
  };
}
