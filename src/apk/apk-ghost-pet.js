// Adorable Chibi Nurse Ghost Pet for Nightingale Hinglish APK
// Slim pastel-lavender ghost wearing a crisp high-contrast white nurse coat & stethoscope.
// Anchors calmly to curated UI spots and reacts vividly on taps, clicks & fast scrolls.

const STORAGE_KEY = 'nnl_apk_ghost_pet_enabled';

const EMOTIONS = {
  idle:    { blush: true,  mouth: 'tiny',  eyes: 'normal' },
  happy:   { blush: true,  mouth: 'smile', eyes: 'happy' },
  love:    { blush: true,  mouth: 'smile', eyes: 'heart' },
  excited: { blush: true,  mouth: 'open',  eyes: 'star' },
  curious: { blush: false, mouth: 'oh',    eyes: 'wide' },
  spook:   { blush: false, mouth: 'boo',   eyes: 'wide' },
  sleepy:  { blush: false, mouth: 'flat',  eyes: 'sleepy' },
  shy:     { blush: true,  mouth: 'wavy',  eyes: 'shy' },
  proud:   { blush: true,  mouth: 'smirk', eyes: 'shades' },
  care:    { blush: true,  mouth: 'smile', eyes: 'wink' }
};

function renderNurseGhostSvg(emotionName = 'idle', { blink = false, sitting = false, frame = 0 } = {}) {
  const emo = EMOTIONS[emotionName] || EMOTIONS.idle;
  const eyeStyle = blink ? 'happy' : emo.eyes;
  const uid = 'ng';

  let eyesMarkup = '';
  if (eyeStyle === 'normal' || eyeStyle === 'wink') {
    const rightEye = eyeStyle === 'wink'
      ? `<path d="M35.5 24.4c1.6-2.2 4.8-2.2 6.4 0" stroke="#2D1B5E" stroke-width="2.4" stroke-linecap="round" fill="none"/>`
      : `<ellipse cx="38.8" cy="24.0" rx="2.9" ry="3.3" fill="#2D1B5E"/>
         <circle cx="37.8" cy="22.8" r="1.2" fill="#FFFFFF"/>
         <circle cx="39.7" cy="25.0" r="0.6" fill="#EDE9FE"/>`;
    eyesMarkup = `
      <ellipse cx="25.2" cy="24.0" rx="2.9" ry="3.3" fill="#2D1B5E"/>
      <circle cx="24.2" cy="22.8" r="1.2" fill="#FFFFFF"/>
      <circle cx="26.1" cy="25.0" r="0.6" fill="#EDE9FE"/>
      ${rightEye}
    `;
  } else if (eyeStyle === 'wide') {
    eyesMarkup = `
      <circle cx="25.2" cy="24.0" r="3.8" fill="#2D1B5E"/>
      <circle cx="38.8" cy="24.0" r="3.8" fill="#2D1B5E"/>
      <circle cx="24.0" cy="22.4" r="1.45" fill="#FFFFFF"/>
      <circle cx="37.6" cy="22.4" r="1.45" fill="#FFFFFF"/>
      <circle cx="26.4" cy="25.4" r="0.7" fill="#C4B5FD"/>
      <circle cx="40.0" cy="25.4" r="0.7" fill="#C4B5FD"/>
    `;
  } else if (eyeStyle === 'happy') {
    eyesMarkup = `
      <path d="M22.0 24.8c1.6-2.5 4.8-2.5 6.4 0" stroke="#2D1B5E" stroke-width="2.4" stroke-linecap="round" fill="none"/>
      <path d="M35.6 24.8c1.6-2.5 4.8-2.5 6.4 0" stroke="#2D1B5E" stroke-width="2.4" stroke-linecap="round" fill="none"/>
    `;
  } else if (eyeStyle === 'sleepy') {
    eyesMarkup = `
      <path d="M22.0 24.4c1.6 1.9 4.8 1.9 6.4 0" stroke="#4B308F" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <path d="M35.6 24.4c1.6 1.9 4.8 1.9 6.4 0" stroke="#4B308F" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    `;
  } else if (eyeStyle === 'shy') {
    eyesMarkup = `
      <path d="M22.2 21.8l4.4 2.2-4.4 2.2" stroke="#2D1B5E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M41.8 21.8l-4.4 2.2 4.4 2.2" stroke="#2D1B5E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    `;
  } else if (eyeStyle === 'heart') {
    eyesMarkup = `
      <path d="M25.2 27.4s-4.0-2.4-4.0-4.7c0-1.2 1.0-2.1 2.0-2.1.8 0 1.6.4 2.0 1.1.4-.7 1.2-1.1 2.0-1.1 1.0 0 2.0.9 2.0 2.1 0 2.3-4.0 4.7-4.0 4.7Z" fill="#F43F5E"/>
      <path d="M38.8 27.4s-4.0-2.4-4.0-4.7c0-1.2 1.0-2.1 2.0-2.1.8 0 1.6.4 2.0 1.1.4-.7 1.2-1.1 2.0-1.1 1.0 0 2.0.9 2.0 2.1 0 2.3-4.0 4.7-4.0 4.7Z" fill="#F43F5E"/>
    `;
  } else if (eyeStyle === 'star') {
    eyesMarkup = `
      <path d="M25.2 19.6l1.1 2.8 3.0.3-2.3 1.9.7 2.9-2.5-1.6-2.5 1.6.7-2.9-2.3-1.9 3.0-.3Z" fill="#F59E0B" stroke="#7C2D12" stroke-width="0.65"/>
      <path d="M38.8 19.6l1.1 2.8 3.0.3-2.3 1.9.7 2.9-2.5-1.6-2.5 1.6.7-2.9-2.3-1.9 3.0-.3Z" fill="#F59E0B" stroke="#7C2D12" stroke-width="0.65"/>
    `;
  } else if (eyeStyle === 'shades') {
    eyesMarkup = `
      <rect x="19.6" y="21.0" width="10.2" height="5.8" rx="2.2" fill="#3B2378" stroke="#1E1042" stroke-width="1.15"/>
      <rect x="34.2" y="21.0" width="10.2" height="5.8" rx="2.2" fill="#3B2378" stroke="#1E1042" stroke-width="1.15"/>
      <line x1="29.8" y1="23.4" x2="34.2" y2="23.4" stroke="#1E1042" stroke-width="1.5"/>
      <path d="M21.8 22.5l2.6 2.8M36.4 22.5l2.6 2.8" stroke="#DDD6FE" stroke-width="1.2" stroke-linecap="round"/>
    `;
  }

  let mouthMarkup = '';
  if (emo.mouth === 'smile' || emo.mouth === 'smirk') {
    mouthMarkup = `<path d="M29.4 27.6c1.4 1.6 3.8 1.6 5.2 0" stroke="#2D1B5E" stroke-width="1.9" stroke-linecap="round" fill="none"/>`;
  } else if (emo.mouth === 'oh' || emo.mouth === 'boo') {
    mouthMarkup = `<ellipse cx="32" cy="28.6" rx="2.2" ry="2.7" fill="#4B308F"/><ellipse cx="32" cy="29.3" rx="1.1" ry="1.0" fill="#FB7185"/>`;
  } else if (emo.mouth === 'open') {
    mouthMarkup = `<path d="M28.6 27.2h6.8c-.25 2.5-1.7 3.7-3.4 3.7s-3.15-1.2-3.4-3.7Z" fill="#2D1B5E"/><path d="M30.2 29.4c1.0-.7 2.6-.7 3.6 0-.35.8-1.05 1.2-1.8 1.2s-1.45-.4-1.8-1.2Z" fill="#FB7185"/>`;
  } else if (emo.mouth === 'wavy') {
    mouthMarkup = `<path d="M28.8 28.4c0.9-1.0 1.7-1.0 2.6 0s1.7 1.0 2.6 0" stroke="#2D1B5E" stroke-width="1.8" stroke-linecap="round" fill="none"/>`;
  } else if (emo.mouth === 'flat') {
    mouthMarkup = `<line x1="29.8" y1="28.4" x2="34.2" y2="28.4" stroke="#4B308F" stroke-width="1.75" stroke-linecap="round"/>`;
  } else {
    mouthMarkup = `<path d="M30.2 26.8c0.9 1.1 2.7 1.1 3.6 0" stroke="#2D1B5E" stroke-width="1.9" stroke-linecap="round" fill="none"/>`;
  }

  const blushMarkup = emo.blush
    ? `<ellipse cx="20.8" cy="27.2" rx="3.0" ry="1.6" fill="#FDA4AF" opacity="0.9"/>
       <ellipse cx="43.2" cy="27.2" rx="3.0" ry="1.6" fill="#FDA4AF" opacity="0.9"/>`
    : '';

  const raisedArms = emotionName === 'excited' || emotionName === 'spook' || emotionName === 'love';
  const pawsMarkup = raisedArms
    ? `<ellipse cx="12.5" cy="27.0" rx="4.4" ry="3.2" transform="rotate(35 12.5 27.0)" fill="#FFFFFF" stroke="#52359C" stroke-width="1.8"/>
       <ellipse cx="51.5" cy="27.0" rx="4.4" ry="3.2" transform="rotate(-35 51.5 27.0)" fill="#FFFFFF" stroke="#52359C" stroke-width="1.8"/>`
    : `<ellipse cx="14.5" cy="36.5" rx="4.2" ry="3.2" transform="rotate(-18 14.5 36.5)" fill="#FFFFFF" stroke="#52359C" stroke-width="1.8"/>
       <ellipse cx="49.5" cy="36.5" rx="4.2" ry="3.2" transform="rotate(18 49.5 36.5)" fill="#FFFFFF" stroke="#52359C" stroke-width="1.8"/>`;

  const tailShift = sitting ? 0 : (frame % 2 === 0 ? -0.9 : 0.9);

  return `
    <svg viewBox="0 0 64 60" width="56" height="52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="${uid}Body" x1="16" y1="8" x2="48" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#F1ECFF"/>
          <stop offset="60%" stop-color="#D7CBFE"/>
          <stop offset="100%" stop-color="#BBA7FA"/>
        </linearGradient>
        <linearGradient id="${uid}Coat" x1="16" y1="30" x2="48" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="100%" stop-color="#F1F5F9"/>
        </linearGradient>
      </defs>

      <!-- Stubby Little Paws Tucked Softly Behind Body -->
      ${pawsMarkup}

      <!-- Squishy Gumdrop Chibi Ghost Silhouette with Cute Top Curl -->
      <path d="M16 32 C16 17.5 22 10.5 30.2 10.2 C31.4 6.5 35.8 5.8 36.6 8.5 C36.9 9.5 35.8 10.3 34.8 10.6 C42.8 11.6 48 18.6 48 32 C48 40 49.2 46.5 47.6 50.2 C46.4 53 43.2 53 41.2 50.5 C39.6 48.5 37.4 48.6 35.8 51.0 C34.1 53.5 30.9 53.5 29.2 51.0 C27.6 48.6 25.4 48.5 23.8 50.5 C21.8 53 18.6 53 17.4 50.2 C15.8 46.5 16 40 16 32 Z"
            transform="translate(${tailShift * 0.25}, 0)"
            fill="url(#${uid}Body)" stroke="#52359C" stroke-width="1.9" stroke-linejoin="round"/>

      <!-- Forehead Shine -->
      <path d="M21 18.5c1.8-3 4.6-4.4 7.4-4.6" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" opacity="0.72"/>

      <!-- Kawaii Face Features -->
      ${blushMarkup}
      ${eyesMarkup}
      ${mouthMarkup}

      <!-- Cozy Open White Nurse Jacket & Stethoscope -->
      <g>
        <path d="M26.8 31.8h10.4L32 39.2Z" fill="#7C5CE0"/>
        <path d="M16.2 33.4C20.2 31.8 24.4 31.6 26.8 31.8L32 39.2L37.2 31.8C39.6 31.6 43.8 31.8 47.8 33.4C48.3 38.6 48.3 43.5 47.8 46.8C47.5 48.0 46.4 48.6 45.2 48.6H34.2C33.4 48.6 33.0 48.0 33.0 47.2V42.0H31.0V47.2C31.0 48.0 30.6 48.6 29.8 48.6H18.8C17.6 48.6 16.5 48.0 16.2 46.8C15.7 43.5 15.7 38.6 16.2 33.4Z"
              fill="url(#${uid}Coat)" stroke="#52359C" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M26.8 31.8L32 39.2L28.0 37.8L25.4 33.8Z" fill="#E9EEF6" stroke="#52359C" stroke-width="1.1" stroke-linejoin="round"/>
        <path d="M37.2 31.8L32 39.2L36.0 37.8L38.6 33.8Z" fill="#E9EEF6" stroke="#52359C" stroke-width="1.1" stroke-linejoin="round"/>
        <rect x="37.5" y="38.2" width="6.2" height="5.2" rx="1.3" fill="#F8FAFC" stroke="#64748B" stroke-width="0.9"/>
        <path d="M40.6 39.5v2.6M39.3 40.8h2.6" stroke="#EF4444" stroke-width="1.45" stroke-linecap="round"/>
        <path d="M25.6 32.0C24.8 36.2 27.6 39.5 32.0 39.5C36.4 39.5 39.2 36.2 38.4 32.0" stroke="#3B2378" stroke-width="1.65" stroke-linecap="round"/>
        <circle cx="26.2" cy="40.6" r="1.95" fill="#E2E8F0" stroke="#3B2378" stroke-width="1.2"/>
      </g>
    </svg>
  `;
}

function renderBubbleHtml() {
  return '';
}

export function isGhostPetEnabled() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'false';
  } catch {
    return true;
  }
}

export function setGhostPetEnabled(enabled) {
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
  } catch {}
  const el = document.getElementById('apk-ghost-pet');
  if (el) el.style.display = enabled ? 'flex' : 'none';
}

export function initGhostPet() {
  if (typeof window === 'undefined' || window.__nnlGhostPetMounted) return;
  window.__nnlGhostPetMounted = true;

  const root = document.createElement('div');
  root.id = 'apk-ghost-pet';
  root.setAttribute('role', 'button');
  root.setAttribute('tabindex', '0');
  root.setAttribute('aria-label', 'Playful nurse ghost buddy');
  root.style.display = isGhostPetEnabled() ? 'flex' : 'none';

  root.innerHTML = `
    <div class="apk-ghost-prop" aria-hidden="true"></div>
    <div class="apk-ghost-bursts" aria-hidden="true"></div>
    <div class="apk-ghost-sprite">${renderNurseGhostSvg('idle')}</div>
    <div class="apk-ghost-shadow" aria-hidden="true"></div>
  `;
  document.body.appendChild(root);

  const spriteEl = root.querySelector('.apk-ghost-sprite');
  const propEl = root.querySelector('.apk-ghost-prop');
  const burstsEl = root.querySelector('.apk-ghost-bursts');
  const shadowEl = root.querySelector('.apk-ghost-shadow');

  const getViewportClamp = (val, min, max) => Math.max(min, Math.min(max, val));

  const getCuratedSpots = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const spots = [];

    const isElemVisible = (el) => {
      if (!el || !el.isConnected) return false;
      const st = window.getComputedStyle(el);
      if (st.display === 'none' || st.visibility === 'hidden' || parseFloat(st.opacity) === 0) return false;
      const r = el.getBoundingClientRect();
      return r.width > 8 && r.height > 8 && r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
    };

    // 1. Beside Live Classes / Page Title
    const titleEl = Array.from(document.querySelectorAll('#apk-live-topbar .apk-editorial-title, .notes-hero-title, .tests-hero-title, .page-hero-title')).find(isElemVisible);
    if (titleEl) {
      spots.push({
        id: 'beside-live-title',
        sitting: false,
        facing: -1,
        compute: () => {
          if (!isElemVisible(titleEl)) return null;
          const r = titleEl.getBoundingClientRect();
          let textRight = r.right;
          try {
            const firstText = Array.from(titleEl.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
            if (firstText) {
              const range = document.createRange();
              range.selectNodeContents(firstText);
              const tr = range.getBoundingClientRect();
              if (tr.width > 8) textRight = tr.right;
            }
          } catch (_) {}
          const batchEl = document.querySelector('.apk-batch-pill-btn');
          let maxRight = vw - 70;
          if (batchEl && isElemVisible(batchEl)) {
            const br = batchEl.getBoundingClientRect();
            if (Math.abs(br.top - r.top) < 48) {
              maxRight = Math.min(maxRight, br.left - 66);
            }
          }
          const px = getViewportClamp(textRight + 6, Math.max(12, r.left), Math.max(16, maxRight));
          const py = getViewportClamp(r.top + r.height / 2 - 38, 6, vh - 86);
          return { x: px, y: py, facing: -1, sitting: false };
        }
      });
    }

    // 2. Below Our Logo (sidebar logo on tablet/landscape OR auth logo badge on login)
    const logoEl = Array.from(document.querySelectorAll('.header-logo, #auth-screen:not(.hide) .apk-brand-inline-row .apk-logo-badge')).find(isElemVisible);
    if (logoEl) {
      spots.push({
        id: 'below-logo',
        sitting: false,
        facing: 1,
        compute: () => {
          if (!isElemVisible(logoEl)) return null;
          const r = logoEl.getBoundingClientRect();
          const px = getViewportClamp(r.left + r.width / 2 - 29, 6, vw - 66);
          const py = getViewportClamp(r.bottom + 6, 8, vh - 72);
          return { x: px, y: py, facing: 1, sitting: false };
        }
      });
    }

    // 3. Beside Batch Selection
    const batchEl = Array.from(document.querySelectorAll('.apk-batch-pill-btn, #header-batch-btn')).find(isElemVisible);
    if (batchEl) {
      spots.push({
        id: 'beside-batch',
        sitting: false,
        facing: 1,
        compute: () => {
          if (!isElemVisible(batchEl)) return null;
          const r = batchEl.getBoundingClientRect();
          const preferLeft = r.left >= 70;
          const px = preferLeft
            ? getViewportClamp(r.left - 62, 8, vw - 66)
            : getViewportClamp(r.right + 8, 8, vw - 66);
          const py = getViewportClamp(r.top + r.height / 2 - 30, 6, vh - 72);
          return { x: px, y: py, facing: preferLeft ? 1 : -1, sitting: false };
        }
      });
    }

    // 4. On Top of Live Button (#tab-live)
    const liveBtn = document.getElementById('tab-live');
    if (isElemVisible(liveBtn)) {
      spots.push({
        id: 'top-live-btn',
        sitting: true,
        facing: 1,
        compute: () => {
          if (!isElemVisible(liveBtn)) return null;
          const r = liveBtn.getBoundingClientRect();
          const px = getViewportClamp(r.left + r.width / 2 - 29, 6, vw - 66);
          const py = getViewportClamp(r.top - 44, 6, vh - 72);
          return { x: px, y: py, facing: 1, sitting: true };
        }
      });
    }

    return spots;
  };

  let x = Math.max(16, Math.round(window.innerWidth * 0.16));
  let y = 76;
  let targetX = x;
  let targetY = y;
  let activeSpot = null;
  let spotSitting = false;
  let facing = 1;
  let preferredFacing = 1;
  let emotion = 'happy';
  let emotionUntil = performance.now() + 2600;
  let cycleIdx = 0;
  let pokeCount = 0;
  let lastPokeAt = 0;
  let lastSpookAt = 0;
  let blinkActive = false;
  let walkFrame = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragOriginX = 0;
  let dragOriginY = 0;
  let didDragMove = false;
  let lastRenderKey = '';

  const spawnParticleBurst = (symbol = '♥', color = '#EC4899') => {
    if (!burstsEl) return;
    for (let i = 0; i < 4; i++) {
      const p = document.createElement('span');
      p.className = 'apk-ghost-burst-item';
      p.textContent = i % 2 === 0 ? symbol : '✦';
      p.style.color = color;
      p.style.setProperty('--gx', `${(Math.random() - 0.5) * 64}px`);
      p.style.setProperty('--gy', `${-22 - Math.random() * 34}px`);
      burstsEl.appendChild(p);
      setTimeout(() => p.remove(), 800);
    }
  };

  const setEmotion = (next, durationMs = 2600, burst = false) => {
    emotion = next;
    emotionUntil = durationMs > 0 ? performance.now() + durationMs : 0;
    lastRenderKey = '';
    if (burst) {
      if (next === 'love' || next === 'shy') spawnParticleBurst('♥', '#E11D48');
      else if (next === 'excited' || next === 'proud') spawnParticleBurst('★', '#F59E0B');
      else if (next === 'care') spawnParticleBurst('+', '#EF4444');
      else spawnParticleBurst('✦', '#7C5CE0');
    }
  };

  const applySpot = (spot, immediate = false) => {
    if (!spot) return false;
    const pos = spot.compute();
    if (!pos) return false;
    activeSpot = spot;
    targetX = pos.x;
    targetY = pos.y;
    preferredFacing = pos.facing;
    spotSitting = Boolean(pos.sitting);
    if (immediate) {
      x = pos.x;
      y = pos.y;
      facing = pos.facing;
    }
    return true;
  };

  const pickNextTarget = (preferredSpotId = null, immediate = false) => {
    const spots = getCuratedSpots();
    if (spots.length === 0) {
      activeSpot = null;
      return;
    }

    if (preferredSpotId) {
      const matched = spots.find(s => s.id === preferredSpotId);
      if (matched && applySpot(matched, immediate)) return;
    }

    const others = activeSpot && spots.length > 1
      ? spots.filter(s => s.id !== activeSpot.id)
      : spots;
    const chosen = others[Math.floor(Math.random() * others.length)];
    applySpot(chosen, immediate);
  };

  const reactToTap = () => {
    const now = performance.now();
    if (now - lastPokeAt < 1800) pokeCount++;
    else pokeCount = 1;
    lastPokeAt = now;

    if (pokeCount >= 4) {
      pokeCount = 0;
      setEmotion('shy', 2800, true);
    } else {
      const tapCycle = ['love', 'excited', 'care', 'happy', 'spook', 'proud', 'curious'];
      const chosen = tapCycle[cycleIdx % tapCycle.length];
      cycleIdx++;
      setEmotion(chosen, 2800, true);
      if (Math.random() < 0.38) pickNextTarget();
    }

    root.classList.remove('is-hop');
    void root.offsetWidth;
    root.classList.add('is-hop');
  };

  root.addEventListener('pointerenter', () => {
    if (!isDragging) {
      setEmotion('happy', 2200, true);
    }
  });

  // Fast-scroll scare reaction ('spook' -> EEK!)
  const scrollTrackMap = new WeakMap();
  const handleFastScroll = (e) => {
    if (!isGhostPetEnabled() || isDragging) return;
    const scroller = (e.target === document || e.target === window)
      ? (document.scrollingElement || document.documentElement)
      : e.target;
    if (!scroller || typeof scroller.scrollTop !== 'number') return;

    const now = performance.now();
    const curTop = (scroller === document.scrollingElement || scroller === document.documentElement)
      ? (window.scrollY || scroller.scrollTop || 0)
      : scroller.scrollTop;
    const prev = scrollTrackMap.get(scroller);
    scrollTrackMap.set(scroller, { top: curTop, at: now });
    if (!prev) return;

    const dt = Math.max(8, now - prev.at);
    const delta = Math.abs(curTop - prev.top);
    const velocity = delta / dt;

    if ((delta > 42 && velocity > 0.85) || velocity > 1.35) {
      if (now - lastSpookAt > 1100) {
        lastSpookAt = now;
        setEmotion('spook', 2400, true);
        root.classList.remove('is-hop');
        void root.offsetWidth;
        root.classList.add('is-hop');
      }
    }
  };
  window.addEventListener('scroll', handleFastScroll, { capture: true, passive: true });

  document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('#apk-ghost-pet') || !isGhostPetEnabled()) return;
    if (e.target.closest('#tab-live')) {
      setEmotion('excited', 1800, true);
    } else if (e.target.closest('.apk-batch-pill-btn, #header-batch-btn')) {
      setEmotion('curious', 1800, true);
    }
  }, { passive: true });

  root.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    isDragging = true;
    didDragMove = false;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragOriginX = x;
    dragOriginY = y;
    root.setPointerCapture?.(e.pointerId);
    setEmotion('curious', 0);
  });

  root.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) didDragMove = true;
    x = Math.max(8, Math.min(window.innerWidth - 68, dragOriginX + dx));
    y = Math.max(12, Math.min(window.innerHeight - 86, dragOriginY + dy));
    targetX = x;
    targetY = y;
    if (Math.abs(dx) > 2) facing = dx >= 0 ? 1 : -1;
    if (emotion !== 'shy') setEmotion('shy', 0);
  });

  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    if (!didDragMove) {
      reactToTap();
    } else {
      const spots = getCuratedSpots();
      let bestSpot = null;
      let bestDist = Infinity;
      for (const s of spots) {
        const pos = s.compute();
        if (!pos) continue;
        const d = Math.hypot(pos.x - x, pos.y - y);
        if (d < bestDist) {
          bestDist = d;
          bestSpot = s;
        }
      }
      if (bestSpot) {
        applySpot(bestSpot);
        setEmotion('happy', 2400, true);
      } else {
        setEmotion('proud', 2400, true);
      }
    }
  };
  root.addEventListener('pointerup', endDrag);
  root.addEventListener('pointercancel', endDrag);

  setInterval(() => {
    if (!isGhostPetEnabled() || isDragging) return;
    if (Math.random() < 0.78) {
      blinkActive = true;
      setTimeout(() => { blinkActive = false; }, 160);
    }
  }, 3200);

  setInterval(() => {
    if (!isGhostPetEnabled() || isDragging) return;
    if (Math.random() < 0.36) {
      pickNextTarget();
      setEmotion(Math.random() < 0.5 ? 'curious' : 'care', 2600);
    } else {
      const ambient = ['sleepy', 'happy', 'love', 'care'];
      setEmotion(ambient[Math.floor(Math.random() * ambient.length)], 3800);
    }
  }, 16000);

  setTimeout(() => pickNextTarget('top-live-btn', true), 450);

  const tick = (now) => {
    if (isGhostPetEnabled()) {
      const quizOpen = document.querySelector('#quiz-viewer:not(.hide), #pdf-modal:not(.hide), #recording-viewer:not(.hide)');
      if (quizOpen) {
        root.style.opacity = '0.24';
        root.style.pointerEvents = 'none';
      } else {
        root.style.opacity = '1';
        root.style.pointerEvents = 'auto';
      }

      if (!isDragging) {
        const synced = activeSpot && activeSpot.compute();
        if (synced) {
          targetX = synced.x;
          targetY = synced.y;
          preferredFacing = synced.facing;
          spotSitting = Boolean(synced.sitting);
        } else {
          pickNextTarget();
        }

        const dx = targetX - x;
        const dy = targetY - y;
        const dist = Math.hypot(dx, dy);

        if (dist > 1.5) {
          x += dx * 0.024;
          y += dy * 0.024;
          if (Math.abs(dx) > 0.8) facing = dx >= 0 ? 1 : -1;
        } else {
          facing = preferredFacing;
        }
      }

      if (emotionUntil > 0 && now > emotionUntil) {
        emotion = 'idle';
        emotionUntil = 0;
      }

      const isMoving = isDragging || Math.hypot(targetX - x, targetY - y) > 4;
      const isSitting = !isMoving && spotSitting;
      const bob = isDragging ? 0 : (isSitting ? Math.sin(now * 0.0028) * 1.1 : Math.sin(now * 0.0036) * 2.2);

      walkFrame = Math.floor(now / 260) % 2;
      root.style.transform = `translate3d(${x.toFixed(1)}px, ${(y + bob).toFixed(1)}px, 0)`;
      spriteEl.style.transform = `scaleX(${facing})`;
      shadowEl.style.transform = `scale(${isSitting ? 1 : 0.78})`;
      shadowEl.style.opacity = isSitting ? '0.26' : '0.15';

      const renderKey = `${emotion}|${blinkActive ? 1 : 0}|${isSitting ? 1 : 0}|${isMoving ? walkFrame : 0}`;
      if (renderKey !== lastRenderKey) {
        lastRenderKey = renderKey;
        spriteEl.innerHTML = renderNurseGhostSvg(emotion, { blink: blinkActive, sitting: isSitting, frame: walkFrame });
        propEl.innerHTML = renderBubbleHtml(emotion);
      }
    }
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}
