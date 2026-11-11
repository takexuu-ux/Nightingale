// Shared Red Sapphire (English) — Batch 104 Auto-Sync & Authenticated API Utility
// Merges verified static baseline with live updates from /cms/batches/104/ & /batch_cms/topic/
// Automatically picks up new classes, notes PDFs, and next-day tests whenever published.

import { BATCH_104_ID, BATCH_104_SUBJECTS, BATCH_104_BASELINE_SYNC } from '../data/batch104EnglishData.js';

const API_BASE = '/api';
const CACHE_STORAGE_KEY = 'nnl_batch104_live_cache_v1';
const SYNC_COOLDOWN_MS = 3 * 60 * 1000; // 3 minutes between passive background syncs

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
    console.warn('[Batch104Sync] Token refresh failed:', e);
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
      console.warn('[Batch104Sync] Pagination error:', path, e);
      break;
    }
  }
  return results;
}

function cleanSubjectTitle(raw) {
  return String(raw || '').replace(/\s*\(RB\)\s*/gi, ' ').replace(/\s+/g, ' ').trim();
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

function normalizeTopicNotes(topic, baseSubTitle) {
  const notes = [];
  const topicTitle = topic.title || baseSubTitle;
  const dateStr = (topic.date || topic.created || '').slice(0, 10);

  const pushItems = (arr, categoryLabel, prefix) => {
    if (!Array.isArray(arr)) return;
    arr.forEach((n, idx) => {
      const url = extractNoteUrl(n);
      if (!url) return;
      const title = (n.title || `${topicTitle} Notes ${idx + 1}`).trim();
      notes.push({
        id: `${prefix}-${n.id || `${topic.id}-${idx}`}`,
        title,
        topic: topicTitle,
        date: dateStr,
        category: categoryLabel,
        url,
        downloadName: `${title.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '')}.pdf`
      });
    });
  };

  pushItems(topic.handwritten_notes, 'HANDWRITTEN', 'rb-hn');
  pushItems(topic.notes, 'CLASS NOTES', 'rb-n');
  return notes;
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

    const noteMap = new Map();
    [...existing.notes, ...live.notes].forEach(n => {
      const k = (n.url || n.id || n.title).toLowerCase();
      if (k && !noteMap.has(k)) noteMap.set(k, n);
    });

    const testMap = new Map();
    [...existing.tests, ...live.tests].forEach(t => {
      const k = String(t.id);
      if (k && !testMap.has(k)) testMap.set(k, t);
    });

    byId.set(key, {
      ...existing,
      title: live.title || existing.title,
      faculty: guessFaculty(live.title || existing.title, live.faculty || existing.faculty),
      topicCount: Math.max(existing.topicCount || 0, live.topicCount || 0),
      videoCount: Math.max(existing.videoCount || 0, live.videoCount || 0),
      notes: Array.from(noteMap.values()),
      tests: Array.from(testMap.values())
    });
  });

  return Array.from(byId.values());
}

export function computeBatch104Totals(subjects) {
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
  return {
    subjects: (subjects || []).length,
    completedSubjects,
    notes,
    tests
  };
}

export function getBatch104BaselineState() {
  try {
    const cachedRaw = localStorage.getItem(CACHE_STORAGE_KEY);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      if (Array.isArray(cached.subjects) && cached.subjects.length > 0) {
        const merged = mergeSubjectLists(BATCH_104_SUBJECTS, cached.subjects);
        return {
          subjects: merged,
          lastSyncedAt: cached.lastSyncedAt || BATCH_104_BASELINE_SYNC,
          totals: computeBatch104Totals(merged),
          fromLiveCache: true
        };
      }
    }
  } catch (e) {
    console.warn('[Batch104Sync] Cache read failed:', e);
  }

  const subjects = mergeSubjectLists(BATCH_104_SUBJECTS, []);
  return {
    subjects,
    lastSyncedAt: BATCH_104_BASELINE_SYNC,
    totals: computeBatch104Totals(subjects),
    fromLiveCache: false
  };
}

let inFlightSync = null;

export async function syncBatch104Live({ force = false, onUpdate } = {}) {
  const baselineState = getBatch104BaselineState();
  const token = localStorage.getItem('nnl_access_token');
  if (!token) {
    return { status: 'no-auth', ...baselineState, newNotes: 0, newTests: 0 };
  }

  try {
    const cachedRaw = localStorage.getItem(CACHE_STORAGE_KEY);
    if (!force && cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      if (cached.lastSyncedAt && (Date.now() - new Date(cached.lastSyncedAt).getTime()) < SYNC_COOLDOWN_MS) {
        return { status: 'fresh', ...baselineState, newNotes: 0, newTests: 0 };
      }
    }
  } catch {}

  if (inFlightSync && !force) return inFlightSync;

  inFlightSync = (async () => {
    try {
      const batchRes = await fetchWithAutoAuth(`/cms/batches/${BATCH_104_ID}/`);
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
          const notes = [];
          const tests = [];
          let videoCount = 0;

          topics.forEach(top => {
            if (Array.isArray(top.video)) videoCount += top.video.length;
            notes.push(...normalizeTopicNotes(top, cleanSubjectTitle(subj.title)));
            tests.push(...normalizeTopicTests(top, cleanSubjectTitle(subj.title)));
          });

          const cleanTitle = cleanSubjectTitle(subj.title);
          return {
            id: String(subj.id),
            title: cleanTitle,
            rawTitle: subj.title,
            faculty: guessFaculty(cleanTitle, ''),
            topicCount: topics.length,
            videoCount,
            notes,
            tests
          };
        }));

        results.forEach(r => {
          if (r.status === 'fulfilled' && r.value) liveSubjects.push(r.value);
        });
      }

      const mergedSubjects = mergeSubjectLists(BATCH_104_SUBJECTS, liveSubjects);
      const prevTotals = baselineState.totals;
      const nextTotals = computeBatch104Totals(mergedSubjects);
      const nowIso = new Date().toISOString();

      try {
        localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify({
          subjects: mergedSubjects,
          lastSyncedAt: nowIso
        }));
      } catch (e) {
        console.warn('[Batch104Sync] Failed writing local cache:', e);
      }

      const payload = {
        status: 'synced',
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
      console.warn('[Batch104Sync] Sync error:', err);
      return { status: 'error', ...baselineState, newNotes: 0, newTests: 0 };
    } finally {
      inFlightSync = null;
    }
  })();

  return inFlightSync;
}
