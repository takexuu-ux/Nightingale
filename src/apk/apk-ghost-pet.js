// Adorable Chibi Nurse Ghost Pet for Nightingale Hinglish APK
// Soft pastel-lavender ghost wearing a crisp high-contrast white nurse coat, stethoscope & cap.
// Roams softly, sits atop cards, reacts vividly on hovers, clicks, taps, drags & card interactions.

const STORAGE_KEY = 'nnl_apk_ghost_pet_enabled';

const EMOTIONS = {
  idle:    { blush: true,  mouth: 'tiny',  eyes: 'normal', bubble: '' },
  happy:   { blush: true,  mouth: 'smile', eyes: 'happy',  bubble: 'Hi!' },
  love:    { blush: true,  mouth: 'smile', eyes: 'heart',  bubble: '♥' },
  excited: { blush: true,  mouth: 'open',  eyes: 'star',   bubble: 'Yay! ★' },
  curious: { blush: false, mouth: 'oh',    eyes: 'wide',   bubble: 'Hmm?' },
  spook:   { blush: false, mouth: 'boo',   eyes: 'wide',   bubble: 'Boo!' },
  sleepy:  { blush: false, mouth: 'flat',  eyes: 'sleepy', bubble: 'zZz' },
  shy:     { blush: true,  mouth: 'wavy',  eyes: 'shy',    bubble: '> <' },
  proud:   { blush: true,  mouth: 'smirk', eyes: 'shades', bubble: 'Pro ★' },
  care:    { blush: true,  mouth: 'smile', eyes: 'wink',   bubble: '+ Care' }
};

function renderNurseGhostSvg(emotionName = 'idle', { blink = false, sitting = false, frame = 0 } = {}) {
  const emo = EMOTIONS[emotionName] || EMOTIONS.idle;
  const eyeStyle = blink ? 'happy' : emo.eyes;
  const uid = 'ng';

  let eyesMarkup = '';
  if (eyeStyle === 'normal' || eyeStyle === 'wink') {
    const rightEye = eyeStyle === 'wink'
      ? `<path d="M36 25c1.8-2.4 5.2-2.4 7 0" stroke="#2D1B5E" stroke-width="2.6" stroke-linecap="round" fill="none"/>`
      : `<ellipse cx="39.5" cy="24.5" rx="3.1" ry="3.7" fill="#2D1B5E"/>
         <circle cx="38.4" cy="23.1" r="1.25" fill="#FFFFFF"/>
         <circle cx="40.6" cy="25.6" r="0.65" fill="#EDE9FE"/>`;
    eyesMarkup = `
      <ellipse cx="24.5" cy="24.5" rx="3.1" ry="3.7" fill="#2D1B5E"/>
      <circle cx="23.4" cy="23.1" r="1.25" fill="#FFFFFF"/>
      <circle cx="25.6" cy="25.6" r="0.65" fill="#EDE9FE"/>
      ${rightEye}
    `;
  } else if (eyeStyle === 'wide') {
    eyesMarkup = `
      <circle cx="24.5" cy="24.5" r="4.1" fill="#2D1B5E"/>
      <circle cx="39.5" cy="24.5" r="4.1" fill="#2D1B5E"/>
      <circle cx="23.2" cy="22.8" r="1.6" fill="#FFFFFF"/>
      <circle cx="38.2" cy="22.8" r="1.6" fill="#FFFFFF"/>
      <circle cx="25.8" cy="26.0" r="0.8" fill="#C4B5FD"/>
      <circle cx="40.8" cy="26.0" r="0.8" fill="#C4B5FD"/>
    `;
  } else if (eyeStyle === 'happy') {
    eyesMarkup = `
      <path d="M20.5 25.5c2-3 6-3 8 0" stroke="#2D1B5E" stroke-width="2.6" stroke-linecap="round" fill="none"/>
      <path d="M35.5 25.5c2-3 6-3 8 0" stroke="#2D1B5E" stroke-width="2.6" stroke-linecap="round" fill="none"/>
    `;
  } else if (eyeStyle === 'sleepy') {
    eyesMarkup = `
      <path d="M20.5 25c2 2.2 6 2.2 8 0" stroke="#4B308F" stroke-width="2.3" stroke-linecap="round" fill="none"/>
      <path d="M35.5 25c2 2.2 6 2.2 8 0" stroke="#4B308F" stroke-width="2.3" stroke-linecap="round" fill="none"/>
    `;
  } else if (eyeStyle === 'shy') {
    eyesMarkup = `
      <path d="M21 22l5 2.6-5 2.6" stroke="#2D1B5E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M43 22l-5 2.6 5 2.6" stroke="#2D1B5E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    `;
  } else if (eyeStyle === 'heart') {
    eyesMarkup = `
      <path d="M24.5 28.5s-4.5-2.8-4.5-5.3c0-1.4 1.1-2.4 2.3-2.4.9 0 1.7.5 2.2 1.3.5-.8 1.3-1.3 2.2-1.3 1.2 0 2.3 1 2.3 2.4 0 2.5-4.5 5.3-4.5 5.3Z" fill="#F43F5E"/>
      <path d="M39.5 28.5s-4.5-2.8-4.5-5.3c0-1.4 1.1-2.4 2.3-2.4.9 0 1.7.5 2.2 1.3.5-.8 1.3-1.3 2.2-1.3 1.2 0 2.3 1 2.3 2.4 0 2.5-4.5 5.3-4.5 5.3Z" fill="#F43F5E"/>
    `;
  } else if (eyeStyle === 'star') {
    eyesMarkup = `
      <path d="M24.5 19.5l1.3 3.2 3.4.3-2.6 2.2.8 3.3-2.9-1.8-2.9 1.8.8-3.3-2.6-2.2 3.4-.3Z" fill="#F59E0B" stroke="#7C2D12" stroke-width="0.7"/>
      <path d="M39.5 19.5l1.3 3.2 3.4.3-2.6 2.2.8 3.3-2.9-1.8-2.9 1.8.8-3.3-2.6-2.2 3.4-.3Z" fill="#F59E0B" stroke="#7C2D12" stroke-width="0.7"/>
    `;
  } else if (eyeStyle === 'shades') {
    eyesMarkup = `
      <rect x="18" y="21.5" width="11.5" height="6.5" rx="2.4" fill="#3B2378" stroke="#1E1042" stroke-width="1.2"/>
      <rect x="34.5" y="21.5" width="11.5" height="6.5" rx="2.4" fill="#3B2378" stroke="#1E1042" stroke-width="1.2"/>
      <line x1="29.5" y1="24" x2="34.5" y2="24" stroke="#1E1042" stroke-width="1.6"/>
      <path d="M20.5 23.2l3 3.2M37 23.2l3 3.2" stroke="#DDD6FE" stroke-width="1.3" stroke-linecap="round"/>
    `;
  }

  let mouthMarkup = '';
  if (emo.mouth === 'smile' || emo.mouth === 'smirk') {
    mouthMarkup = `<path d="M29 30.2c1.8 2 4.2 2 6 0" stroke="#2D1B5E" stroke-width="2" stroke-linecap="round" fill="none"/>`;
  } else if (emo.mouth === 'oh' || emo.mouth === 'boo') {
    mouthMarkup = `<ellipse cx="32" cy="31.2" rx="2.4" ry="3" fill="#4B308F"/><ellipse cx="32" cy="32" rx="1.2" ry="1.1" fill="#FB7185"/>`;
  } else if (emo.mouth === 'open') {
    mouthMarkup = `<path d="M28 29.8h8c-.3 3-2 4.4-4 4.4s-3.7-1.4-4-4.4Z" fill="#2D1B5E"/><path d="M30 32.3c1.2-.8 2.8-.8 4 0-.4.9-1.2 1.4-2 1.4s-1.6-.5-2-1.4Z" fill="#FB7185"/>`;
  } else if (emo.mouth === 'wavy') {
    mouthMarkup = `<path d="M28.5 31c1-1.2 2-1.2 3 0s2 1.2 3 0" stroke="#2D1B5E" stroke-width="1.9" stroke-linecap="round" fill="none"/>`;
  } else if (emo.mouth === 'flat') {
    mouthMarkup = `<line x1="29.5" y1="31" x2="34.5" y2="31" stroke="#4B308F" stroke-width="1.8" stroke-linecap="round"/>`;
  } else {
    mouthMarkup = `<path d="M30.4 30.4c1 1.1 2.2 1.1 3.2 0" stroke="#2D1B5E" stroke-width="1.8" stroke-linecap="round" fill="none"/>`;
  }

  const blushMarkup = emo.blush
    ? `<ellipse cx="19.5" cy="29.2" rx="3.4" ry="1.8" fill="#FDA4AF" opacity="0.88"/>
       <ellipse cx="44.5" cy="29.2" rx="3.4" ry="1.8" fill="#FDA4AF" opacity="0.88"/>`
    : '';

  const raisedArms = emotionName === 'excited' || emotionName === 'spook' || emotionName === 'love';
  const leftArm = raisedArms
    ? `<path d="M16 37c-5-2-8-7-6-10 2-2.5 5 0 7 4" fill="#FFFFFF" stroke="#4B308F" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
       <circle cx="10.2" cy="27.2" r="2.6" fill="#D6CEFF" stroke="#4B308F" stroke-width="1.4"/>`
    : `<path d="M16 37c-4.5 2-6.5 6.5-5 9.5 1.3 2.5 4.5 1.8 6-1" fill="#FFFFFF" stroke="#4B308F" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
       <circle cx="12.2" cy="46.2" r="2.4" fill="#D6CEFF" stroke="#4B308F" stroke-width="1.4"/>`;

  const rightArm = raisedArms
    ? `<path d="M48 37c5-2 8-7 6-10-2-2.5-5 0-7 4" fill="#FFFFFF" stroke="#4B308F" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
       <circle cx="53.8" cy="27.2" r="2.6" fill="#D6CEFF" stroke="#4B308F" stroke-width="1.4"/>`
    : `<path d="M48 37c4.5 2 6.5 6.5 5 9.5-1.3 2.5-4.5 1.8-6-1" fill="#FFFFFF" stroke="#4B308F" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
       <circle cx="51.8" cy="46.2" r="2.4" fill="#D6CEFF" stroke="#4B308F" stroke-width="1.4"/>`;

  const tailShift = sitting ? 0 : (frame % 2 === 0 ? -1.4 : 1.4);

  return `
    <svg viewBox="0 0 64 74" width="60" height="70" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="${uid}Body" x1="16" y1="10" x2="48" y2="66" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#E5DFFF"/>
          <stop offset="52%" stop-color="#C8B9FA"/>
          <stop offset="100%" stop-color="#A792F4"/>
        </linearGradient>
        <linearGradient id="${uid}Coat" x1="16" y1="34" x2="48" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="100%" stop-color="#F1F5F9"/>
        </linearGradient>
      </defs>

      <!-- Ghost Body & Flowing Tail (Soft Lavender-Periwinkle so the pure White Coat clearly pops!) -->
      <path d="M16 32c0-10.8 7.2-19 16-19s16 8.2 16 19v24.5c0 2.5-2.6 4.2-4.6 2.8-1.9-1.3-3.9-1.2-5.4.4-1.8 1.9-4.2 1.9-6 0-1.5-1.6-3.5-1.7-5.4-.4-2 1.4-4.6-.3-4.6-2.8V32Z"
            transform="translate(${tailShift * 0.25}, 0)"
            fill="url(#${uid}Body)" stroke="#4B308F" stroke-width="2" stroke-linejoin="round"/>

      <!-- Crisp White Nurse Cap -->
      <g transform="translate(0, -1)">
        <path d="M21 15.5l2.8-8.2c.4-1.1 1.5-1.8 2.7-1.8h11c1.2 0 2.3.7 2.7 1.8L43 15.5c-3.5 1.4-18.5 1.4-22 0Z"
              fill="#FFFFFF" stroke="#4B308F" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M21.5 14.2c5.5 1.1 15.5 1.1 21 0" stroke="#CBD5E1" stroke-width="1.3"/>
        <path d="M32 8.2v4.6M29.7 10.5h4.6" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/>
      </g>

      <!-- Face Features -->
      ${blushMarkup}
      ${eyesMarkup}
      ${mouthMarkup}

      <!-- Crisp High-Contrast Pure White Nurse Coat (wraps torso over purple scrubs) -->
      <g>
        <!-- Inner Violet Scrub Top V-Neck -->
        <path d="M25.5 34.5h13L32 45.5l-6.5-11Z" fill="#6D48C7"/>
        <!-- White Coat Torso -->
        <path d="M16 36.2c2.8-1.5 6.4-2 9.5-1.7L32 45.5l6.5-11c3.1-.3 6.7.2 9.5 1.7v18.2c0 1.4-1.1 2.4-2.5 2.4H33.5v-10h-3v10H18.5c-1.4 0-2.5-1-2.5-2.4V36.2Z"
              fill="url(#${uid}Coat)" stroke="#4B308F" stroke-width="1.9" stroke-linejoin="round"/>
        <!-- Folded White Coat Lapels -->
        <path d="M25.5 34.5l6.5 11-5.2-1.8-2.8-5.4 1.5-3.8ZM38.5 34.5L32 45.5l5.2-1.8 2.8-5.4-1.5-3.8Z"
              fill="#E8ECF4" stroke="#4B308F" stroke-width="1.2" stroke-linejoin="round"/>
        <!-- Coat Center Seam & Buttons -->
        <line x1="32" y1="45.5" x2="32" y2="56.8" stroke="#94A3B8" stroke-width="1.3"/>
        <circle cx="32" cy="49.2" r="1.25" fill="#5B3EA8"/>
        <circle cx="32" cy="53.4" r="1.25" fill="#5B3EA8"/>

        <!-- Chest Pocket + Nurse Red Cross Badge -->
        <rect x="37" y="45" width="7" height="6.2" rx="1.4" fill="#F1F5F9" stroke="#64748B" stroke-width="1"/>
        <path d="M40.5 46.6v3M39 48.1h3" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round"/>

        <!-- Silver & Plum Stethoscope draped around coat collar -->
        <path d="M23.2 34.8c-1.2 4.8.4 9.5 3.6 10.6M40.8 34.8c1.2 4.8-.4 9.5-3.6 10.6"
              stroke="#3B2378" stroke-width="1.9" stroke-linecap="round" fill="none"/>
        <circle cx="26.8" cy="45.8" r="2.2" fill="#E2E8F0" stroke="#3B2378" stroke-width="1.3"/>
      </g>

      <!-- Animated White Coat Sleeves + Lavender Ghost Hands -->
      ${leftArm}
      ${rightArm}
    </svg>
  `;
}

function renderBubbleHtml(emotionName) {
  const text = EMOTIONS[emotionName]?.bubble;
  if (!text) return '';
  let cls = 'apk-ghost-bubble';
  if (emotionName === 'love' || emotionName === 'shy') cls += ' is-love';
  else if (emotionName === 'sleepy') cls += ' is-zzz';
  else if (emotionName === 'excited' || emotionName === 'proud') cls += ' is-star';
  return `<span class="${cls}">${text}</span>`;
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
          const px = getViewportClamp(r.left + r.width / 2 - 31, 6, vw - 70);
          const py = getViewportClamp(r.bottom + 6, 8, vh - 86);
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
          const preferLeft = r.left >= 74;
          const px = preferLeft
            ? getViewportClamp(r.left - 66, 8, vw - 70)
            : getViewportClamp(r.right + 8, 8, vw - 70);
          const py = getViewportClamp(r.top + r.height / 2 - 40, 6, vh - 86);
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
          const px = getViewportClamp(r.left + r.width / 2 - 31, 6, vw - 70);
          const py = getViewportClamp(r.top - 54, 6, vh - 82);
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
