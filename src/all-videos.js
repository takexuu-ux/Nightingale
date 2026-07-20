// Nightingale Recorded Lectures Library Logic

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? '/api' : 'https://prod-api.nnlone.com';

// Fetch with 10-second timeout — prevents infinite spinner
function fetchWithTimeout(url, options = {}, ms = 10000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...options, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

const MOCK_RECORDINGS = [
  {
    id: 'rec-pharma-1',
    title: 'Pharmacology Day 1: Anti-Hypertensive Drugs & Cardiac Assessment',
    instructor: 'Dr. Suresh Sharma',
    batch: 'Blue Sapphire Batch',
    subject: 'Pharmacology',
    date: '2026-06-05',
    duration: '2h 15m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  },
  {
    id: 'rec-pharma-2',
    title: 'Pharmacology Day 2: Diuretics & Renin-Angiotensin System',
    instructor: 'Dr. Suresh Sharma',
    batch: 'Blue Sapphire Batch',
    subject: 'Pharmacology',
    date: '2026-06-06',
    duration: '1h 50m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
  },
  {
    id: 'rec-cardio-1',
    title: 'Cardiology Day 1: ECG Interpretation Fundamentals',
    instructor: 'Dr. Suresh Sharma',
    batch: 'Blue Sapphire Batch',
    subject: 'Cardiology',
    date: '2026-06-04',
    duration: '2h 30m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
  },
  {
    id: 'rec-anatomy-1',
    title: 'Anatomy Day 1: Cardiovascular System Structure & Chambers',
    instructor: 'Dr. Suresh Sharma',
    batch: 'Blue Sapphire Batch',
    subject: 'Anatomy & Physiology',
    date: '2026-06-01',
    duration: '2h 10m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
  },
  {
    id: 'rec-anatomy-2',
    title: 'Anatomy Day 2: Nervous System & Cranial Nerve Pathways',
    instructor: 'Dr. Suresh Sharma',
    batch: 'Blue Sapphire Batch',
    subject: 'Anatomy & Physiology',
    date: '2026-06-02',
    duration: '1h 55m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
  },
  // C+ Batch Mock Recorded Lectures
  {
    id: 'rec-cplus-medsurg-1',
    title: 'Medical-Surgical Day 1: Fluid & Electrolyte Balance & IV Therapy',
    instructor: 'Prof. Priyanka Bansal',
    batch: 'C+ Batch',
    subject: 'Medical-Surgical Nursing',
    date: '2026-07-01',
    duration: '2h 45m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'rec-cplus-medsurg-2',
    title: 'Medical-Surgical Day 2: Acid-Base Balance & ABG Interpretation',
    instructor: 'Prof. Priyanka Bansal',
    batch: 'C+ Batch',
    subject: 'Medical-Surgical Nursing',
    date: '2026-07-02',
    duration: '2h 20m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  },
  {
    id: 'rec-cplus-obg-1',
    title: 'OBG Day 1: Antenatal Assessment & Fetal Circulation',
    instructor: 'Dr. Suresh Sharma',
    batch: 'C+ Batch',
    subject: 'Obstetrics & Gynecology',
    date: '2026-07-03',
    duration: '2h 10m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  },
  {
    id: 'rec-cplus-obg-2',
    title: 'OBG Day 2: Stages of Labor & Obstetric Emergencies',
    instructor: 'Dr. Suresh Sharma',
    batch: 'C+ Batch',
    subject: 'Obstetrics & Gynecology',
    date: '2026-07-04',
    duration: '2h 35m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
  },
  {
    id: 'rec-cplus-peds-1',
    title: 'Pediatric Day 1: Growth & Development Milestones',
    instructor: 'Prof. Priyanka Bansal',
    batch: 'C+ Batch',
    subject: 'Pediatric Nursing',
    date: '2026-07-05',
    duration: '1h 45m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
  },
  {
    id: 'rec-cplus-pharma-1',
    title: 'Pharmacology Day 1: Antimicrobials & Drug Calculations',
    instructor: 'Dr. Suresh Sharma',
    batch: 'C+ Batch',
    subject: 'Pharmacology',
    date: '2026-07-06',
    duration: '2h 15m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
  }
];

let currentRecordings = [];
const classListContainer = document.getElementById('class-list-container');

function findVideoUrl(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') {
    if (obj.startsWith('http') && (obj.includes('.mp4') || obj.includes('.m3u8') || obj.includes('download') || obj.includes('stream') || obj.includes('video'))) {
      return obj;
    }
    return '';
  }
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const result = findVideoUrl(obj[key]);
        if (result) return result;
      }
    }
  }
  return '';
}

function getSimplifiedBatchTitle(title) {
  if (!title) return '';
  const tUpper = title.toUpperCase();
  // C+ subscription = Blue Sapphire batch
  if (tUpper.includes('C+') || tUpper.includes('C PLUS')) return 'Blue Sapphire Batch';
  if (tUpper.includes('SAPPHIRE') || tUpper.includes('BLUE')) return 'Blue Sapphire Batch';
  if (tUpper.includes('PEARL') && tUpper.includes('ENGLISH')) return 'Pearl Batch English';
  if (tUpper.includes('PEARL')) return 'Pearl Batch';
  if (tUpper.includes('FASTRACK')) return 'Fastrack Batch';
  if (tUpper.includes('BRAHMASTRA')) return 'Brahmastra Batch';
  if (tUpper.includes('ECONOMY')) return 'Economy Batch';
  return title.trim();
}

function getApiBatchId(batchName) {
  if (!batchName) return 8;
  const name = batchName.toUpperCase();
  // C+ subscription maps to Blue Sapphire = batch ID 8
  if (name.includes('C+') || name.includes('C PLUS')) return 8;
  if (name.includes('SAPPHIRE') || name.includes('BLUE')) return 8;
  if (name.includes('PEARL') && name.includes('ENGLISH')) return 7;
  if (name.includes('PEARL')) return 8;
  if (name.includes('FASTRACK')) return 3;
  if (name.includes('BRAHMASTRA')) return 9;
  if (name.includes('ECONOMY')) return 1;
  return 8;
}

function initBackgroundParallax() {
  // Handled by smooth hardware-accelerated CSS keyframe animation
}

async function loadRecordings() {
  if (classListContainer) {
    classListContainer.innerHTML = `
      <div class="full-loader" style="grid-column: 1 / -1; background: rgba(10, 11, 16, 0.15); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 3rem; text-align: center;">
        <div class="spinner"></div>
        <p style="color: var(--text-secondary); margin-top: 0.5rem; font-family: var(--font-display); font-size: 0.75rem; letter-spacing: 0.05em; text-transform: uppercase;">Loading Recorded Lectures...</p>
      </div>
    `;
  }

  // ── On-screen debug overlay (visible on mobile — no DevTools needed) ──
  const token = localStorage.getItem('nnl_access_token');
  const activeBatch = localStorage.getItem('nnl_active_batch') || 'Blue Sapphire Batch';
  const batchId = getApiBatchId(activeBatch);
  const isGuest = !token || token === 'GUEST_DEMO_TOKEN';

  const capturedLogs = [];
  const origLog = console.log;
  const origWarn = console.warn;
  console.log = (...args) => { capturedLogs.push('✓ ' + args.join(' ')); origLog(...args); };
  console.warn = (...args) => { capturedLogs.push('⚠ ' + args.join(' ')); origWarn(...args); };

  let allRecordings = [];

  if (isGuest) {
    allRecordings = MOCK_RECORDINGS.filter(r => getSimplifiedBatchTitle(r.batch) === getSimplifiedBatchTitle(activeBatch));
    capturedLogs.push('ℹ Guest mode — showing mock data');
  } else {
    try {
      const BATCH_ENDPOINTS = [
        `${API_BASE}/batch_cms/batches/`,
        `${API_BASE}/cms/batches/`,
        `${API_BASE}/batch_cms/enrolled_batches/`,
        `${API_BASE}/cms/enrolled_batches/`,
      ];

      let matchedBatch = null;
      const targetBatchName = getSimplifiedBatchTitle(activeBatch);

      for (const endpoint of BATCH_ENDPOINTS) {
        try {
          const res = await fetchWithTimeout(endpoint, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
          });
          if (!res.ok) { capturedLogs.push(`✗ ${endpoint} → HTTP ${res.status}`); continue; }
          const data = await res.json();
          const list = data.data || data.results || (Array.isArray(data) ? data : []);
          capturedLogs.push(`📋 ${endpoint} → ${list.length} batches: ${list.map(b => `[${b.id}] ${b.title}`).join(', ')}`);
          // Use loose equality (==) to handle string vs number IDs from API
          const found = list.find(b => b.id == batchId || getSimplifiedBatchTitle(b.title) === targetBatchName);
          if (found) { matchedBatch = found; capturedLogs.push(`✅ Matched batch: [${found.id}] ${found.title}`); break; }
          else { capturedLogs.push(`⚠ No match for "${targetBatchName}" (looking for id=${batchId})`); }
        } catch(e) { capturedLogs.push(`✗ ${endpoint} → Error: ${e.message}`); }
      }

      if (matchedBatch) {
        let subjects = matchedBatch.subjects || [];
        if (subjects.length === 0) {
          const SUBJECT_ENDPOINTS = [
            `${API_BASE}/batch_cms/subjects/?batch_id=${matchedBatch.id}`,
            `${API_BASE}/cms/subjects/?batch_id=${matchedBatch.id}`,
            `${API_BASE}/batch_cms/batches/${matchedBatch.id}/`,
            `${API_BASE}/cms/batches/${matchedBatch.id}/`,
          ];
          for (const sEndpoint of SUBJECT_ENDPOINTS) {
            try {
              const sRes = await fetchWithTimeout(sEndpoint, { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });
              if (!sRes.ok) { capturedLogs.push(`✗ ${sEndpoint} → HTTP ${sRes.status}`); continue; }
              const sData = await sRes.json();
              const subjList = sData.subjects || sData.data || sData.results || (Array.isArray(sData) ? sData : []);
              capturedLogs.push(`📚 ${sEndpoint} → ${subjList.length} subjects: ${subjList.map(s => `[${s.id}] ${s.title}`).join(', ')}`);
              if (subjList.length > 0) { subjects = subjList; break; }
            } catch(e) { capturedLogs.push(`✗ ${sEndpoint} → ${e.message}`); }
          }
        } else {
          capturedLogs.push(`📚 Subjects embedded in batch: ${subjects.map(s => `[${s.id}] ${s.title}`).join(', ')}`);
        }

        capturedLogs.push(`🔢 Total subjects: ${subjects.length}`);

        if (subjects.length > 0) {
          const VIDEO_ENDPOINTS = [
            (bid, sid) => `${API_BASE}/batch_cms/videos/?batch=${bid}&subject=${sid}`,
            (bid, sid) => `${API_BASE}/cms/videos/?batch=${bid}&subject=${sid}`,
          ];

          const videoPromises = subjects.map(async (subj) => {
            for (const urlFn of VIDEO_ENDPOINTS) {
              try {
                const vRes = await fetchWithTimeout(urlFn(matchedBatch.id, subj.id), { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });
                if (!vRes.ok) continue;
                const vData = await vRes.json();
                const vList = vData.data || vData.results || (Array.isArray(vData) ? vData : []);
                if (vList.length > 0) {
                  // Client-side safety filter: ensure video matches subject ID if the API returned extra
                  const filteredList = vList.filter(v => {
                    if (!v.subject) return true; // fallback
                    const vSubjId = v.subject.id || v.subject;
                    return String(vSubjId) === String(subj.id);
                  });
                  capturedLogs.push(`🎬 Subject "${subj.title}": ${filteredList.length} videos`);
                  return filteredList.map(v => {
                    const durHrs = v.duration ? Math.floor(v.duration / 3600) : 2;
                    const durMins = v.duration ? Math.floor((v.duration % 3600) / 60) : 0;
                    return {
                      id: v.id, title: v.title,
                      instructor: v.faculty?.name || v.instructor || 'Faculty',
                      batch: activeBatch, subject: subj.title,
                      date: v.schedule_start_time ? v.schedule_start_time.split('T')[0] : '',
                      duration: `${durHrs}h ${durMins}m`,
                      video_cipher_id: v.video_cipher_id || '',
                      videoUrl: v.video_url || v.videoUrl || v.url || v.download_url || findVideoUrl(v) || ''
                    };
                  });
                }
              } catch(err) { capturedLogs.push(`✗ Video fetch for "${subj.title}": ${err.message}`); }
            }
            capturedLogs.push(`⚠ No videos found for subject "${subj.title}"`);
            return [];
          });

          const results = await Promise.all(videoPromises);
          allRecordings = results.flat();
          capturedLogs.push(`✅ TOTAL LECTURES LOADED: ${allRecordings.length}`);
        }
      } else {
        capturedLogs.push(`❌ No matching batch found. Active batch: "${activeBatch}", batchId: ${batchId}, target: "${targetBatchName}"`);
      }
    } catch (e) {
      capturedLogs.push(`💥 Fatal error: ${e.message}`);
    }
  }

  // Restore console
  console.log = origLog;
  console.warn = origWarn;

  // Show floating debug button (always visible)
  const existingBtn = document.getElementById('api-debug-btn');
  if (existingBtn) existingBtn.remove();
  const debugBtn = document.createElement('button');
  debugBtn.id = 'api-debug-btn';
  debugBtn.textContent = `🔍 API Debug (${allRecordings.length} lectures)`;
  debugBtn.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;background:rgba(0,0,0,0.8);color:#00f3d0;border:1px solid rgba(0,243,208,0.4);border-radius:10px;padding:0.5rem 1rem;font-size:0.75rem;font-family:monospace;cursor:pointer;backdrop-filter:blur(8px);';
  debugBtn.onclick = async () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.95);overflow-y:auto;padding:1.5rem;font-family:monospace;font-size:0.72rem;color:#eee;';
    overlay.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <strong style="color:#00f3d0;font-size:0.9rem;">C+ API Debug Log & Endpoint Scanner</strong>
        <button onclick="this.closest('div[style]').remove()" style="background:rgba(255,255,255,0.1);border:none;color:#fff;padding:0.4rem 0.8rem;border-radius:8px;cursor:pointer;font-size:0.8rem;">✕ Close</button>
      </div>
      <div style="margin-bottom:1rem;padding:0.85rem;background:rgba(0,243,208,0.05);border:1px solid rgba(0,243,208,0.2);border-radius:8px;">
        <strong style="color:#00f3d0;display:block;margin-bottom:0.5rem;">🔍 Running Endpoint Scan...</strong>
        <div id="scanner-results" style="line-height:1.6;color:#85ffd6;">Testing video endpoints...</div>
      </div>
      <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:1rem;line-height:1.8;">
        ${capturedLogs.map(l => `<div style="border-bottom:1px solid rgba(255,255,255,0.04);padding:0.15rem 0;">${l.replace(/</g,'&lt;')}</div>`).join('')}
      </div>`;
    document.body.appendChild(overlay);

    // Run tests
    const resultsContainer = document.getElementById('scanner-results');
    const tests = [
      `/cms/videos/?batch_id=8&subject_id=458`,
      `/cms/videos/?batch_id=8&subject_id=458&page_size=200`,
      `/cms/videos/?batch_id=8&subject_id=458&limit=200`,
      `/cms/videos/?batch_id=8&subject_id=458&page=2`,
      `/cms/videos/?batch_id=8&subject_id=458&page=1&page_size=200`,
      `/batch_cms/videos/?batch_id=8&subject_id=458&page_size=200`
    ];

    let output = '';
    for (const path of tests) {
      try {
        const start = Date.now();
        const res = await fetchWithTimeout(`${API_BASE}${path}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        const duration = Date.now() - start;
        if (res.ok) {
          const json = await res.json();
          const items = json.data || json.results || (Array.isArray(json) ? json : []);
          const total = json.total_count || json.count || items.length;
          output += `<div>✅ <strong>${path}</strong> → <span style="color:#fff;">${items.length} items on page (total count: ${total})</span> (${duration}ms)</div>`;
        } else {
          output += `<div style="color:#ff8080;">✗ <strong>${path}</strong> → HTTP ${res.status} (${duration}ms)</div>`;
        }
      } catch (e) {
        output += `<div style="color:#ff8080;">✗ <strong>${path}</strong> → Error: ${e.message}</div>`;
      }
      resultsContainer.innerHTML = output;
    }
  };
  document.body.appendChild(debugBtn);


  // Fallback to mock if nothing loaded
  if (allRecordings.length === 0) {
    allRecordings = MOCK_RECORDINGS.filter(r => getSimplifiedBatchTitle(r.batch) === getSimplifiedBatchTitle(activeBatch));
    capturedLogs.push(`ℹ Fell back to ${allRecordings.length} mock lectures`);
  }

  currentRecordings = allRecordings;
  renderRecordingsList(allRecordings);
}

function getLectureNumber(title) {
  const match = title.match(/(?:Day|Lecture|Class)\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : 999;
}

// SVG icon paths keyed by subject keyword
const SUBJECT_SVG = {
  pharmacology: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/>',
  anatomy: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714"/>',
  physiology: '<path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>',
  biochemistry: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082"/>',
  microbiology: '<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"/>',
  pathology: '<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>',
  surgery: '<path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"/>',
  obstetrics: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"/>',
  obg: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"/>',
  pediatric: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>',
  community: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>',
  psychiatry: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>',
  medicine: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/>',
  critical: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>',
  nursing: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"/>',
};

const DEFAULT_SVG = '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>';

function getSubjectSVG(name) {
  const lower = name.toLowerCase();
  for (const [key, path] of Object.entries(SUBJECT_SVG)) {
    if (lower.includes(key)) return path;
  }
  return DEFAULT_SVG;
}

function renderRecordingsList(recordings) {
  if (!classListContainer) return;
  classListContainer.innerHTML = '';

  if (recordings.length === 0) {
    classListContainer.innerHTML = `
      <div style="grid-column:1/-1;background:rgba(10,11,16,0.15);border:1px solid rgba(255,255,255,0.05);border-radius:20px;padding:4rem;text-align:center;">
        <p style="color:var(--text-secondary);font-size:0.85rem;text-transform:uppercase;letter-spacing:0.08em;margin:0;font-family:var(--font-display);">No recorded lectures available for your subscription.</p>
      </div>
    `;
    return;
  }

  // Group by subject
  const bySubject = {};
  recordings.forEach(r => {
    const s = r.subject || 'General Nursing';
    if (!bySubject[s]) bySubject[s] = [];
    bySubject[s].push(r);
  });

  const subjectNames = Object.keys(bySubject).sort();

  // Update stats
  const statSubjectsEl = document.getElementById('stat-subjects');
  const statLecturesEl = document.getElementById('stat-lectures');
  const statsEl = document.getElementById('cp-stats');
  if (statSubjectsEl) statSubjectsEl.textContent = subjectNames.length;
  if (statLecturesEl) statLecturesEl.textContent = recordings.length;
  if (statsEl) statsEl.style.display = 'flex';

  subjectNames.forEach(subjectName => {
    const subjectClasses = bySubject[subjectName];
    subjectClasses.sort((a, b) => getLectureNumber(a.title) - getLectureNumber(b.title));

    let lecturesHtml = '';
    subjectClasses.forEach((rec, idx) => {
      const rowNum = (idx + 1).toString().padStart(2, '0');
      const hasUrl = !!rec.videoUrl || !!rec.video_cipher_id;
      lecturesHtml += `
        <div class="lec-row" data-rec-id="${rec.id}">
          <span class="lec-num">${rowNum}</span>
          <div class="lec-info">
            <div class="lec-title" title="${rec.title}">${rec.title}</div>
            <div class="lec-meta">
              <span>${rec.instructor}</span>
              <span>·</span>
              <span>${rec.duration}</span>
            </div>
          </div>
          <button class="lec-play ${hasUrl ? '' : 'unavailable'}" data-rec-id="${rec.id}" title="Play">
            <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
      `;
    });

    const card = document.createElement('div');
    card.className = 'subject-card';
    card.innerHTML = `
      <div class="sc-header">
        <div class="sc-icon">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
            ${getSubjectSVG(subjectName)}
          </svg>
        </div>
        <div class="sc-meta">
          <div class="sc-name">${subjectName}</div>
          <div class="sc-count">${subjectClasses.length} lecture${subjectClasses.length !== 1 ? 's' : ''}</div>
        </div>
        <svg class="sc-chevron" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
        </svg>
      </div>
      <div class="lec-list">
        <div class="lec-list-inner">${lecturesHtml}</div>
      </div>
    `;

    classListContainer.appendChild(card);
  });

  // Bind card header toggles — accordion: only one open at a time
  classListContainer.querySelectorAll('.sc-header').forEach(header => {
    header.addEventListener('click', () => {
      const clickedCard = header.closest('.subject-card');
      const isOpen = clickedCard.classList.contains('open');
      // Close all cards first
      classListContainer.querySelectorAll('.subject-card').forEach(c => c.classList.remove('open'));
      // Toggle clicked one
      if (!isOpen) clickedCard.classList.add('open');
    });
  });
}

function initRecordingsViewer() {
  const closeViewerBtn = document.getElementById('close-recording-viewer');
  if (closeViewerBtn) {
    closeViewerBtn.addEventListener('click', () => {
      const viewer = document.getElementById('recording-viewer');
      const videoEl = document.getElementById('recording-video');
      if (viewer) viewer.classList.add('hide');
      if (videoEl) { videoEl.pause(); videoEl.src = ''; videoEl.classList.remove('hide'); }
      const oldIframe = document.getElementById('recording-cipher-iframe');
      if (oldIframe) oldIframe.remove();
      const loader = document.getElementById('recording-cipher-loader');
      if (loader) loader.remove();
    });
  }

  if (classListContainer) {
    classListContainer.addEventListener('click', (e) => {
      const playBtn = e.target.closest('.lec-play');
      if (playBtn) {
        e.stopPropagation();
        const recId = playBtn.getAttribute('data-rec-id');
        const rec = currentRecordings.find(r => String(r.id) === String(recId));
        if (rec) openRecordingPlayer(rec);
        return;
      }
      const row = e.target.closest('.lec-row');
      if (row && !e.target.closest('.lec-play')) {
        const recId = row.getAttribute('data-rec-id');
        const rec = currentRecordings.find(r => String(r.id) === String(recId));
        if (rec) openRecordingPlayer(rec);
      }
    });
  }
}

function openRecordingPlayer(recording) {
  const viewer = document.getElementById('recording-viewer');
  const titleEl = document.getElementById('recording-viewer-title');
  const instructorEl = document.getElementById('recording-viewer-instructor');
  const videoEl = document.getElementById('recording-video');
  const noUrlEl = document.getElementById('recording-no-url');
  
  if (!viewer) return;
  
  if (titleEl) titleEl.textContent = recording.title;
  if (instructorEl) instructorEl.textContent = `Instructor: ${recording.instructor || 'Faculty'}`;
  
  viewer.classList.remove('hide');

  // Clean up any existing VdoCipher iframe/loader
  const oldIframe = document.getElementById('recording-cipher-iframe');
  if (oldIframe) oldIframe.remove();
  const oldLoader = document.getElementById('recording-cipher-loader');
  if (oldLoader) oldLoader.remove();
  if (videoEl) videoEl.classList.remove('hide');
  if (noUrlEl) noUrlEl.classList.add('hide');
  
  if (recording.video_cipher_id) {
    if (videoEl) {
      videoEl.pause();
      videoEl.src = '';
      videoEl.classList.add('hide');
    }

    // Append loading spinner
    const bodyEl = document.querySelector('.recording-viewer-body');
    const loader = document.createElement('div');
    loader.id = 'recording-cipher-loader';
    loader.className = 'full-loader';
    loader.innerHTML = '<div class="spinner"></div><p style="margin-top: 0.5rem; font-family: var(--font-display); font-size: 0.75rem; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-secondary);">Securing stream via VdoCipher...</p>';
    bodyEl.appendChild(loader);

    const token = localStorage.getItem('nnl_access_token');
    fetch(`${API_BASE}/batch_cms/videos/${recording.id}/generate_videocipher_otp/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      if (loader) loader.remove();
      if (data && data.otp && data.playbackInfo) {
        const iframe = document.createElement('iframe');
        iframe.id = 'recording-cipher-iframe';
        iframe.src = `https://player.vdocipher.com/v2/?otp=${data.otp}&playbackInfo=${data.playbackInfo}`;
        iframe.style.border = 'none';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.borderRadius = '12px';
        iframe.setAttribute('allow', 'encrypted-media');
        iframe.setAttribute('allowfullscreen', 'true');
        bodyEl.appendChild(iframe);
      } else {
        if (noUrlEl) noUrlEl.classList.remove('hide');
      }
    })
    .catch(err => {
      console.error(err);
      if (loader) loader.remove();
      if (noUrlEl) noUrlEl.classList.remove('hide');
    });

  } else if (recording.videoUrl) {
    if (videoEl) {
      videoEl.src = recording.videoUrl;
      videoEl.classList.remove('hide');
      videoEl.load();
      videoEl.play().catch(err => {
        console.log('Video autoplay failed:', err);
      });
    }
    if (noUrlEl) noUrlEl.classList.add('hide');
  } else {
    if (videoEl) {
      videoEl.src = '';
      videoEl.classList.add('hide');
    }
    if (noUrlEl) noUrlEl.classList.remove('hide');
  }
}

// Bind back button
const btnBackDashboard = document.getElementById('btn-back-dashboard');
if (btnBackDashboard) {
  btnBackDashboard.addEventListener('click', () => {
    window.location.href = '/';
  });
}

// Initialize page elements
initBackgroundParallax();
initRecordingsViewer();
loadRecordings();
