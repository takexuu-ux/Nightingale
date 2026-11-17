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
              const nativePct = Math.min(100, Math.max(0, item.percent || 0));
              const existingPct = existing ? Math.min(100, Math.max(0, existing.percent || 0)) : 0;
              const shouldUpdate = !existing || nativePct > existingPct || (item.lastWatched || 0) >= (existing.lastWatched || 0);
              if (shouldUpdate) {
                map[id] = {
                  recId: id,
                  title: item.title || existing?.title || 'Lecture',
                  instructor: item.instructor || existing?.instructor || 'NNL Faculty',
                  currentTime: item.currentTime || existing?.currentTime || 0,
                  duration: item.duration || existing?.duration || 0,
                  percent: Math.max(nativePct, existingPct),
                  lastWatched: Math.max(item.lastWatched || 0, existing?.lastWatched || 0) || Date.now()
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

  const record = {
    recId: id,
    title: title || prev.title || 'Lecture',
    instructor: instructor || prev.instructor || 'NNL Faculty',
    subject: subject || prev.subject || '',
    thumb: thumb || prev.thumb || '',
    currentTime: Math.round(currentTime || prev.currentTime || 0),
    duration: Math.round(duration || prev.duration || 0),
    percent: Math.min(100, Math.max(calcPercent, prev.percent || 1)),
    lastWatched: Date.now()
  };

  map[id] = record;

  try {
    localStorage.setItem(WATCH_KEY, JSON.stringify(map));
    localStorage.setItem('nnl_last_watched_rec_id', id);
  } catch (_) {}

  // Sync immediately to native Android bridge
  if (typeof window !== 'undefined' && window.AndroidVideoBridge && typeof window.AndroidVideoBridge.recordLectureWatch === 'function') {
    try {
      window.AndroidVideoBridge.recordLectureWatch(
        id,
        record.title,
        record.instructor,
        record.currentTime,
        record.duration,
        record.percent
      );
    } catch (_) {}
  }

  // Trigger UI refresh event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nnl:watch-progress-updated', { detail: map[id] }));
  }
}

export function getRecentlyWatchedLectures(limit = 8) {
  const map = getWatchHistory();
  let nativeLastId = '';
  if (typeof window !== 'undefined' && window.AndroidVideoBridge && typeof window.AndroidVideoBridge.getLastWatchedRecId === 'function') {
    try {
      nativeLastId = window.AndroidVideoBridge.getLastWatchedRecId() || '';
    } catch (_) {}
  }
  if (nativeLastId) {
    try {
      localStorage.setItem('nnl_last_watched_rec_id', nativeLastId);
    } catch (_) {}
  }
  let lastId = nativeLastId;
  if (!lastId) {
    try {
      lastId = localStorage.getItem('nnl_last_watched_rec_id') || '';
    } catch (_) {}
  }

  const list = Object.values(map);
  list.sort((a, b) => {
    if (lastId) {
      if (String(a.recId) === String(lastId)) return -1;
      if (String(b.recId) === String(lastId)) return 1;
    }
    const timeA = a.lastWatched || 0;
    const timeB = b.lastWatched || 0;
    return timeB - timeA;
  });
  return list.slice(0, limit);
}

// ── Saved Lectures (Bookmarks) ──

export function getSavedLectureIds() {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return arr.filter(x => x && x !== 'undefined' && x !== 'null');
      }
    }
  } catch (_) {}
  return [];
}

export function isLectureSaved(recId) {
  if (!recId || recId === 'undefined' || recId === 'null') return false;
  const ids = getSavedLectureIds();
  return ids.includes(String(recId));
}

export function toggleSavedLecture(recId, meta = null) {
  if (!recId || recId === 'undefined' || recId === 'null') return false;
  const id = String(recId);
  let ids = getSavedLectureIds();
  const alreadySaved = ids.includes(id);

  if (alreadySaved) {
    ids = ids.filter(x => x !== id && x !== 'undefined' && x !== 'null');
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
    delete metaMap['undefined'];
    delete metaMap['null'];

    if (!alreadySaved && meta) {
      metaMap[id] = {
        id,
        recId: id,
        title: meta.title || 'Saved Lecture',
        instructor: meta.instructor || 'NNL Faculty',
        subject: meta.subject || '',
        thumb: meta.thumb || '',
        duration: meta.duration || '',
        notePdfUrl: meta.notePdfUrl || '',
        notePdfTitle: meta.notePdfTitle || '',
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
    delete metaMap['undefined'];
    delete metaMap['null'];
  } catch (_) {}

  return ids.map(id => {
    const m = metaMap[id] || {};
    return {
      id: String(id),
      recId: String(id),
      title: m.title || `Lecture #${id}`,
      instructor: m.instructor || 'NNL Faculty',
      subject: m.subject || '',
      thumb: m.thumb || '',
      duration: m.duration || '',
      notePdfUrl: m.notePdfUrl || '',
      notePdfTitle: m.notePdfTitle || '',
      date: m.date || ''
    };
  });
}

// Global hook for Android resume
if (typeof window !== 'undefined') {
  window.__nnlRefreshWatchProgress = () => {
    getWatchHistory();
    window.dispatchEvent(new CustomEvent('nnl:watch-progress-updated'));
  };
}
