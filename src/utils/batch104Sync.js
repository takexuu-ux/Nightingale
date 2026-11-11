// Shared Red Sapphire Auto-Sync & Authenticated API Utility
// Supports BOTH Red Sapphire (Hinglish) — Batch 103 AND Red Sapphire (English) — Batch 104.
// Merges verified static baseline with live updates from /cms/batches/{id}/ & /batch_cms/topic/
// so new classes, notes PDFs, and next-day tests populate automatically for Notes & Tests.

import { BATCH_103_ID, BATCH_103_SUBJECTS, BATCH_103_BASELINE_SYNC } from '../data/batch103HinglishData.js';
import { BATCH_104_ID, BATCH_104_SUBJECTS, BATCH_104_BASELINE_SYNC } from '../data/batch104EnglishData.js';

const API_BASE = '/api';
const SYNC_COOLDOWN_MS = 3 * 60 * 1000;

const BATCH_CONFIGS = {
  103: {
    id: BATCH_103_ID,
    title: 'Red Sapphire (Hinglish)',
    subjects: BATCH_103_SUBJECTS,
    baselineSync: BATCH_103_BASELINE_SYNC,
    cacheKey: 'nnl_batch_103_live_cache_v1'
  },
  104: {
    id: BATCH_104_ID,
    title: 'Red Sapphire (English)',
    subjects: BATCH_104_SUBJECTS,
    baselineSync: BATCH_104_BASELINE_SYNC,
    cacheKey: 'nnl_batch104_live_cache_v1'
  }
};

export function getBatchIdFromName(batchName) {
  return String(batchName || '').toUpperCase().includes('ENGLISH') ? 104 : 103;
}

function fetchWithTimeout(url, options = {}, ms = 12000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...options, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

export async function refreshAccessToken() {
  const refresh = localStorage.getItem('nnl_refresh_token');
  if (!refresh) return false;
  try {
    const res = await fetchWithTimeout(`${API_BASE}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ refresh })
    }, 10000);
    if (!res.ok) return false;
    const data = await res.json();
    const newAccess = data.access || data.data?.access;
    if (newAccess) {
      localStorage.setItem('nnl_access_token', newAccess);
      return true;
    }
  } catch (e) {
    console.warn('[SapphireSync] Token refresh failed:', e);
  }
  return false;
}

export async function fetchWithAutoAuth(pathOrUrl, options = {}) {
  let token = localStorage.getItem('nnl_access_token');
  if (!token) return null;

  const targetUrl = pathOrUrl.startsWith('http')
    ? pathOrUrl.replace('https://prod-api.nnlone.com', API_BASE)
    : (pathOrUrl.startsWith(API_BASE) ? pathOrUrl : `${API_BASE}${pathOrUrl}`);

  const buildHeaders = (tk) => ({
    'Authorization': `Bearer ${tk}`,
    'Accept': 'application/json',
    ...(options.headers || {})
  });

  let res = await fetchWithTimeout(targetUrl, { ...options, headers: buildHeaders(token) });
  if (res.status === 401 || res.status === 403) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      token = localStorage.getItem('nnl_access_token');
      res = await fetchWithTimeout(targetUrl, { ...options, headers: buildHeaders(token) });
    }
  }
  return res;
}

async function fetchAllBatchPaginated(path, maxPages = 15) {
  const results = [];
  let url = path;
  let page = 1;

  while (url && page <= maxPages) {
    try {
      const res = await fetchWithAutoAuth(url);
      if (!res || !res.ok) break;
      const json = await res.json();
      const items = json.data || json.results || [];
      if (Array.isArray(items)) results.push(...items);

      let nextUrl = json.next_page_link || json.next || null;
      if (!nextUrl && json.max_pages && page < json.max_pages) {
        const sep = path.includes('?') ? '&' : '?';
        nextUrl = `${path}${sep}page=${page + 1}`;
      }
      url = nextUrl;
      page++;
    } catch (e) {
      console.warn('[SapphireSync] Pagination error:', path, e);
      break;
    }
  }
  return results;
}

function cleanSubjectTitle(raw) {
  return String(raw || '').replace(/\s*\((R|RB)\)\s*/gi, ' ').replace(/\s+/g, ' ').trim();
}

function guessFaculty(subjectTitle, existingFaculty) {
  if (existingFaculty && existingFaculty !== 'NNL Faculty') return existingFaculty;
  const t = subjectTitle.toLowerCase();
  if (t.includes('anatomy')) return 'Dr. Shrikant Verma';
  if (t.includes('pharmacology')) return 'Dr. Ranjan';
  if (t.includes('microbiology') || t.includes('pathology')) return 'Dr. Aman Setiya';
  if (t.includes('medicine')) return 'Dr. Deepak Marwah';
  if (t.includes('orientation')) return 'Ms. Priyadarshini';
  return existingFaculty || 'NNL Faculty';
}

function extractNoteUrl(obj) {
  return (obj?.handwritten_notes || obj?.notes || obj?.file || obj?.url || obj?.pdf_url || '').trim();
}

function normalizeTopicNotes(topic, baseSubTitle, batchId) {
  const notes = [];
  const topicTitle = topic.title || baseSubTitle;
  const dateStr = (topic.date || topic.created || '').slice(0, 10);
  const tag = batchId === 103 ? 'r' : 'rb';

  const pushItems = (arr, categoryLabel, prefix) => {
    if (!Array.isArray(arr)) return;
    arr.forEach((n, idx) => {
      const url = extractNoteUrl(n);
      if (!url) return;
      const title = (n.title || `${topicTitle} Notes ${idx + 1}`).trim();
      notes.push({
        id: `${tag}-${prefix}-${n.id || `${topic.id}-${idx}`}`,
        title,
        topic: topicTitle,
        date: dateStr,
        category: categoryLabel,
        url,
        downloadName: `${title.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '')}.pdf`
      });
    });
  };

  pushItems(topic.handwritten_notes, 'HANDWRITTEN', 'hn');
  pushItems(topic.notes, 'CLASS NOTES', 'n');
  return notes;
}

function normalizeTopicVideos(topic, baseSubTitle, topicNotes) {
  if (!Array.isArray(topic.video)) return [];
  const topicTitle = topic.title || baseSubTitle;
  const dateStr = (topic.date || topic.created || '').slice(0, 10);
  const firstNote = Array.isArray(topicNotes) && topicNotes.length > 0 ? topicNotes[0] : null;

  return topic.video
    .filter(v => v && v.id)
    .map(v => ({
      id: v.id,
      title: (v.title || topicTitle).trim(),
      topic: topicTitle,
      instructor: v.faculty?.name || 'NNL Faculty',
      video_cipher_id: v.video_cipher_id || '',
      videoUrl: v.video_url || v.url || '',
      duration: v.duration ? `${Math.round(v.duration / 60)} mins` : '',
      date: dateStr || (v.schedule_start_time || v.created || '').slice(0, 10),
      thumb: v.thumbnails?.[1]?.url || v.thumbnails?.[0]?.url || '',
      notePdfUrl: firstNote?.url || '',
      notePdfTitle: firstNote?.title || ''
    }));
}

function normalizeTopicTests(topic, baseSubTitle) {
  if (!Array.isArray(topic.test)) return [];
  const topicTitle = topic.title || baseSubTitle;
  const dateStr = (topic.date || topic.created || '').slice(0, 10);

  return topic.test
    .filter(t => t && t.id)
    .map(t => ({
      id: t.id,
      title: (t.test_display_name || t.title || `${topicTitle} Test`).trim(),
      topic: topicTitle,
      totalQuestions: t.total_question || t.total_questions || 30,
      totalMarks: t.total_marks || t.total_question || 30,
      duration: t.duration || 1800,
      category: t.category?.title || 'CBT Test',
      level: t.level_str || 'Medium',
      date: dateStr || (t.schedule_start_time || t.created || '').slice(0, 10),
      isBatchTest: true,
      source: 'batch_cms'
    }));
}

function mergeSubjectLists(baselineSubjects, liveSubjects) {
  const byId = new Map();
  baselineSubjects.forEach(s => {
    byId.set(String(s.id), {
      ...s,
      faculty: guessFaculty(s.title, s.faculty),
      videos: [...(s.videos || [])],
      notes: [...(s.notes || [])],
      tests: [...(s.tests || []).map(t => ({ ...t, isBatchTest: true, source: 'batch_cms' }))]
    });
  });

  liveSubjects.forEach(live => {
    const key = String(live.id);
    const existing = byId.get(key);
    if (!existing) {
      byId.set(key, live);
      return;
    }

    const vidMap = new Map();
    [...existing.videos, ...(live.videos || [])].forEach(v => {
      const k = String(v.id);
      if (k && !vidMap.has(k)) vidMap.set(k, v);
    });

    const noteMap = new Map();
    [...existing.notes, ...(live.notes || [])].forEach(n => {
      const k = (n.url || n.id || n.title).toLowerCase();
      if (k && !noteMap.has(k)) noteMap.set(k, n);
    });

    const testMap = new Map();
    [...existing.tests, ...(live.tests || [])].forEach(t => {
      const k = String(t.id);
      if (k && !testMap.has(k)) testMap.set(k, t);
    });

    const mergedVideos = Array.from(vidMap.values());
    byId.set(key, {
      ...existing,
      title: live.title || existing.title,
      faculty: guessFaculty(live.title || existing.title, live.faculty || existing.faculty),
      topicCount: Math.max(existing.topicCount || 0, live.topicCount || 0),
      videoCount: Math.max(existing.videoCount || 0, live.videoCount || 0, mergedVideos.length),
      videos: mergedVideos,
      notes: Array.from(noteMap.values()),
      tests: Array.from(testMap.values())
    });
  });

  return Array.from(byId.values());
}

export function computeBatchTotals(subjects) {
  let notes = 0;
  let tests = 0;
  let completedSubjects = 0;
  (subjects || []).forEach(s => {
    const nc = s.notes?.length || 0;
    const tc = s.tests?.length || 0;
    notes += nc;
    tests += tc;
    if (nc > 0 || tc > 0 || (s.videoCount || 0) > 0) completedSubjects++;
  });
  return { subjects: (subjects || []).length, completedSubjects, notes, tests };
}

export function getBatchBaselineState(batchId = 104) {
  const id = Number(batchId) === 103 ? 103 : 104;
  const cfg = BATCH_CONFIGS[id];

  try {
    const cachedRaw = localStorage.getItem(cfg.cacheKey);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      if (Array.isArray(cached.subjects) && cached.subjects.length > 0) {
        const merged = mergeSubjectLists(cfg.subjects, cached.subjects);
        return {
          batchId: id,
          batchTitle: cfg.title,
          subjects: merged,
          lastSyncedAt: cached.lastSyncedAt || cfg.baselineSync,
          totals: computeBatchTotals(merged),
          fromLiveCache: true
        };
      }
    }
  } catch (e) {
    console.warn(`[SapphireSync ${id}] Cache read failed:`, e);
  }

  const subjects = mergeSubjectLists(cfg.subjects, []);
  return {
    batchId: id,
    batchTitle: cfg.title,
    subjects,
    lastSyncedAt: cfg.baselineSync,
    totals: computeBatchTotals(subjects),
    fromLiveCache: false
  };
}

const inFlightByBatch = new Map();

export async function syncBatchLive(batchId = 104, { force = false, onUpdate } = {}) {
  const id = Number(batchId) === 103 ? 103 : 104;
  const cfg = BATCH_CONFIGS[id];
  const baselineState = getBatchBaselineState(id);
  const token = localStorage.getItem('nnl_access_token');
  if (!token) {
    return { status: 'no-auth', ...baselineState, newNotes: 0, newTests: 0 };
  }

  try {
    const cachedRaw = localStorage.getItem(cfg.cacheKey);
    if (!force && cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      if (cached.lastSyncedAt && (Date.now() - new Date(cached.lastSyncedAt).getTime()) < SYNC_COOLDOWN_MS) {
        return { status: 'fresh', ...baselineState, newNotes: 0, newTests: 0 };
      }
    }
  } catch {}

  if (inFlightByBatch.has(id) && !force) return inFlightByBatch.get(id);

  const p = (async () => {
    try {
      const batchRes = await fetchWithAutoAuth(`/cms/batches/${id}/`);
      if (!batchRes || !batchRes.ok) {
        return { status: 'error', ...baselineState, newNotes: 0, newTests: 0 };
      }
      const batchJson = await batchRes.json();
      const rawSubjects = batchJson.data?.subjects || batchJson.subjects || [];
      if (!Array.isArray(rawSubjects) || rawSubjects.length === 0) {
        return { status: 'empty', ...baselineState, newNotes: 0, newTests: 0 };
      }

      const liveSubjects = [];
      const chunkSize = 4;
      for (let i = 0; i < rawSubjects.length; i += chunkSize) {
        const chunk = rawSubjects.slice(i, i + chunkSize);
        const results = await Promise.allSettled(chunk.map(async subj => {
          const topics = await fetchAllBatchPaginated(`/batch_cms/topic/?subject=${subj.id}&page_size=100`);
          const videos = [];
          const notes = [];
          const tests = [];
          const cleanTitle = cleanSubjectTitle(subj.title);

          topics.forEach(top => {
            const topNotes = normalizeTopicNotes(top, cleanTitle, id);
            notes.push(...topNotes);
            videos.push(...normalizeTopicVideos(top, cleanTitle, topNotes));
            tests.push(...normalizeTopicTests(top, cleanTitle));
          });

          const firstFaculty = videos.find(v => v.instructor && v.instructor !== 'NNL Faculty')?.instructor || '';
          return {
            id: String(subj.id),
            title: cleanTitle,
            rawTitle: subj.title,
            faculty: guessFaculty(cleanTitle, firstFaculty),
            topicCount: topics.length,
            videoCount: videos.length,
            videos,
            notes,
            tests
          };
        }));

        results.forEach(r => {
          if (r.status === 'fulfilled' && r.value) liveSubjects.push(r.value);
        });
      }

      const mergedSubjects = mergeSubjectLists(cfg.subjects, liveSubjects);
      const prevTotals = baselineState.totals;
      const nextTotals = computeBatchTotals(mergedSubjects);
      const nowIso = new Date().toISOString();

      try {
        localStorage.setItem(cfg.cacheKey, JSON.stringify({
          subjects: mergedSubjects,
          lastSyncedAt: nowIso
        }));
      } catch (e) {
        console.warn(`[SapphireSync ${id}] Cache write failed:`, e);
      }

      const payload = {
        status: 'synced',
        batchId: id,
        batchTitle: cfg.title,
        subjects: mergedSubjects,
        lastSyncedAt: nowIso,
        totals: nextTotals,
        newNotes: Math.max(0, nextTotals.notes - prevTotals.notes),
        newTests: Math.max(0, nextTotals.tests - prevTotals.tests),
        fromLiveCache: true
      };

      if (typeof onUpdate === 'function') onUpdate(payload);
      return payload;
    } catch (err) {
      console.warn(`[SapphireSync ${id}] Sync error:`, err);
      return { status: 'error', ...baselineState, newNotes: 0, newTests: 0 };
    } finally {
      inFlightByBatch.delete(id);
    }
  })();

  inFlightByBatch.set(id, p);
  return p;
}

// Backwards-compatible aliases
export const getBatch104BaselineState = () => getBatchBaselineState(104);
export const syncBatch104Live = (opts) => syncBatchLive(104, opts);
export const computeBatch104Totals = computeBatchTotals;
