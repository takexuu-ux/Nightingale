// Adorable Chibi Nurse Ghost Pet for Nightingale Hinglish APK
// Slim pastel-lavender ghost wearing a crisp high-contrast white nurse coat & stethoscope.
// Anchors calmly to curated UI spots and reacts vividly on taps, clicks & fast scrolls.

const STORAGE_KEY = 'nnl_apk_ghost_pet_enabled';

const EMOTIONS = {
  idle:    { blush: true,  mouth: 'tiny',  eyes: 'normal', bubble: '' },
  happy:   { blush: true,  mouth: 'smile', eyes: 'happy',  bubble: 'Hi!' },
  love:    { blush: true,  mouth: 'smile', eyes: 'heart',  bubble: '♥' },
  excited: { blush: true,  mouth: 'open',  eyes: 'star',   bubble: 'Yay! ★' },
  curious: { blush: false, mouth: 'oh',    eyes: 'wide',   bubble: 'Hmm?' },
  spook:   { blush: false, mouth: 'boo',   eyes: 'wide',   bubble: 'EEK!' },
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
      ? `<path d="M32.6 23.6c1.5-2.1 4.4-2.1 6 0" stroke="#2D1B5E" stroke-width="2.3" stroke-linecap="round" fill="none"/>`
      : `<ellipse cx="35.6" cy="23.2" rx="2.6" ry="3.2" fill="#2D1B5E"/>
         <circle cx="34.7" cy="22.0" r="1.05" fill="#FFFFFF"/>
         <circle cx="36.4" cy="24.2" r="0.55" fill="#EDE9FE"/>`;
    eyesMarkup = `
      <ellipse cx="24.4" cy="23.2" rx="2.6" ry="3.2" fill="#2D1B5E"/>
      <circle cx="23.5" cy="22.0" r="1.05" fill="#FFFFFF"/>
      <circle cx="25.2" cy="24.2" r="0.55" fill="#EDE9FE"/>
      ${rightEye}
    `;
  } else if (eyeStyle === 'wide') {
    eyesMarkup = `
      <circle cx="24.4" cy="23.2" r="3.4" fill="#2D1B5E"/>
      <circle cx="35.6" cy="23.2" r="3.4" fill="#2D1B5E"/>
      <circle cx="23.3" cy="21.7" r="1.35" fill="#FFFFFF"/>
      <circle cx="34.5" cy="21.7" r="1.35" fill="#FFFFFF"/>
      <circle cx="25.5" cy="24.4" r="0.7" fill="#C4B5FD"/>
      <circle cx="36.7" cy="24.4" r="0.7" fill="#C4B5FD"/>
    `;
  } else if (eyeStyle === 'happy') {
    eyesMarkup = `
      <path d="M21.2 24.0c1.6-2.5 4.8-2.5 6.4 0" stroke="#2D1B5E" stroke-width="2.3" stroke-linecap="round" fill="none"/>
      <path d="M32.4 24.0c1.6-2.5 4.8-2.5 6.4 0" stroke="#2D1B5E" stroke-width="2.3" stroke-linecap="round" fill="none"/>
    `;
  } else if (eyeStyle === 'sleepy') {
    eyesMarkup = `
      <path d="M21.2 23.6c1.6 1.9 4.8 1.9 6.4 0" stroke="#4B308F" stroke-width="2.1" stroke-linecap="round" fill="none"/>
      <path d="M32.4 23.6c1.6 1.9 4.8 1.9 6.4 0" stroke="#4B308F" stroke-width="2.1" stroke-linecap="round" fill="none"/>
    `;
  } else if (eyeStyle === 'shy') {
    eyesMarkup = `
      <path d="M21.4 21.0l4.2 2.2-4.2 2.2" stroke="#2D1B5E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M38.6 21.0l-4.2 2.2 4.2 2.2" stroke="#2D1B5E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    `;
  } else if (eyeStyle === 'heart') {
    eyesMarkup = `
      <path d="M24.4 26.6s-3.8-2.3-3.8-4.5c0-1.2.9-2.0 1.9-2.0.8 0 1.5.4 1.9 1.1.4-.7 1.1-1.1 1.9-1.1 1.0 0 1.9.8 1.9 2.0 0 2.2-3.8 4.5-3.8 4.5Z" fill="#F43F5E"/>
      <path d="M35.6 26.6s-3.8-2.3-3.8-4.5c0-1.2.9-2.0 1.9-2.0.8 0 1.5.4 1.9 1.1.4-.7 1.1-1.1 1.9-1.1 1.0 0 1.9.8 1.9 2.0 0 2.2-3.8 4.5-3.8 4.5Z" fill="#F43F5E"/>
    `;
  } else if (eyeStyle === 'star') {
    eyesMarkup = `
      <path d="M24.4 18.8l1.1 2.7 2.9.3-2.2 1.9.7 2.8-2.5-1.5-2.5 1.5.7-2.8-2.2-1.9 2.9-.3Z" fill="#F59E0B" stroke="#7C2D12" stroke-width="0.65"/>
      <path d="M35.6 18.8l1.1 2.7 2.9.3-2.2 1.9.7 2.8-2.5-1.5-2.5 1.5.7-2.8-2.2-1.9 2.9-.3Z" fill="#F59E0B" stroke="#7C2D12" stroke-width="0.65"/>
    `;
  } else if (eyeStyle === 'shades') {
    eyesMarkup = `
      <rect x="19.0" y="20.4" width="9.6" height="5.6" rx="2.1" fill="#3B2378" stroke="#1E1042" stroke-width="1.1"/>
      <rect x="31.4" y="20.4" width="9.6" height="5.6" rx="2.1" fill="#3B2378" stroke="#1E1042" stroke-width="1.1"/>
      <line x1="28.6" y1="22.6" x2="31.4" y2="22.6" stroke="#1E1042" stroke-width="1.5"/>
      <path d="M21.0 21.8l2.5 2.7M33.4 21.8l2.5 2.7" stroke="#DDD6FE" stroke-width="1.2" stroke-linecap="round"/>
    `;
  }

  let mouthMarkup = '';
  if (emo.mouth === 'smile' || emo.mouth === 'smirk') {
    mouthMarkup = `<path d="M27.4 28.4c1.5 1.7 3.7 1.7 5.2 0" stroke="#2D1B5E" stroke-width="1.85" stroke-linecap="round" fill="none"/>`;
  } else if (emo.mouth === 'oh' || emo.mouth === 'boo') {
    mouthMarkup = `<ellipse cx="30" cy="29.0" rx="2.0" ry="2.5" fill="#4B308F"/><ellipse cx="30" cy="29.7" rx="1.0" ry="0.95" fill="#FB7185"/>`;
  } else if (emo.mouth === 'open') {
    mouthMarkup = `<path d="M26.6 28.0h6.8c-.25 2.6-1.7 3.8-3.4 3.8s-3.15-1.2-3.4-3.8Z" fill="#2D1B5E"/><path d="M28.2 30.2c1.0-.7 2.6-.7 3.6 0-.35.8-1.05 1.2-1.8 1.2s-1.45-.4-1.8-1.2Z" fill="#FB7185"/>`;
  } else if (emo.mouth === 'wavy') {
    mouthMarkup = `<path d="M26.8 29.0c0.9-1.1 1.7-1.1 2.6 0s1.7 1.1 2.6 0" stroke="#2D1B5E" stroke-width="1.75" stroke-linecap="round" fill="none"/>`;
  } else if (emo.mouth === 'flat') {
    mouthMarkup = `<line x1="27.8" y1="29.0" x2="32.2" y2="29.0" stroke="#4B308F" stroke-width="1.7" stroke-linecap="round"/>`;
  } else {
    mouthMarkup = `<path d="M28.6 28.6c0.9 0.9 1.9 0.9 2.8 0" stroke="#2D1B5E" stroke-width="1.7" stroke-linecap="round" fill="none"/>`;
  }

  const blushMarkup = emo.blush
    ? `<ellipse cx="20.6" cy="27.2" rx="2.6" ry="1.4" fill="#FDA4AF" opacity="0.88"/>
       <ellipse cx="39.4" cy="27.2" rx="2.6" ry="1.4" fill="#FDA4AF" opacity="0.88"/>`
    : '';

  const raisedArms = emotionName === 'excited' || emotionName === 'spook' || emotionName === 'love';
  const leftArm = raisedArms
    ? `<path d="M20.5 36.5c-4.0-1.5-6.5-5.5-5.2-8.2 1.1-2.0 3.6-.8 5.2 2.5Z" fill="#FFFFFF" stroke="#52359C" stroke-width="1.6" stroke-linejoin="round"/>
       <circle cx="15.4" cy="28.0" r="2.2" fill="#D8D0FF" stroke="#52359C" stroke-width="1.35"/>`
    : `<path d="M20.5 36.2c-3.5 1.8-5.0 5.6-3.8 8.0 0.9 1.8 3.2 1.2 4.3-1.4Z" fill="#FFFFFF" stroke="#52359C" stroke-width="1.6" stroke-linejoin="round"/>
       <circle cx="17.2" cy="44.2" r="2.1" fill="#D8D0FF" stroke="#52359C" stroke-width="1.35"/>`;

  const rightArm = raisedArms
    ? `<path d="M39.5 36.5c4.0-1.5 6.5-5.5 5.2-8.2-1.1-2.0-3.6-.8-5.2 2.5Z" fill="#FFFFFF" stroke="#52359C" stroke-width="1.6" stroke-linejoin="round"/>
       <circle cx="44.6" cy="28.0" r="2.2" fill="#D8D0FF" stroke="#52359C" stroke-width="1.35"/>`
    : `<path d="M39.5 36.2c3.5 1.8 5.0 5.6 3.8 8.0-0.9 1.8-3.2 1.2-4.3-1.4Z" fill="#FFFFFF" stroke="#52359C" stroke-width="1.6" stroke-linejoin="round"/>
       <circle cx="42.8" cy="44.2" r="2.1" fill="#D8D0FF" stroke="#52359C" stroke-width="1.35"/>`;

  const tailShift = sitting ? 0 : (frame % 2 === 0 ? -1.0 : 1.0);

  return `
    <svg viewBox="0 0 60 72" width="54" height="64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="${uid}Body" x1="18" y1="8" x2="42" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#EEE9FF"/>
          <stop offset="55%" stop-color="#D1C3FD"/>
          <stop offset="100%" stop-color="#B09AF6"/>
        </linearGradient>
        <linearGradient id="${uid}Coat" x1="19" y1="33" x2="41" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="100%" stop-color="#F1F5F9"/>
        </linearGradient>
      </defs>

      <!-- Coat Sleeves behind torso so they never cut the neck line -->
      ${leftArm}
      ${rightArm}

      <!-- Slim Tapered Ghost Body & Flowing Scalloped Tail (No Cap) -->
      <path d="M18.5 23.0C18.5 14.0 23.5 8.5 30.0 8.5C36.5 8.5 41.5 14.0 41.5 23.0C41.5 27.6 40.0 30.8 39.4 33.2C40.4 38.2 40.8 47.0 40.8 56.5C40.8 59.8 38.0 61.2 36.1 59.4C34.4 57.8 32.7 58.0 31.5 60.0C30.5 61.6 29.5 61.6 28.5 60.0C27.3 58.0 25.6 57.8 23.9 59.4C22.0 61.2 19.2 59.8 19.2 56.5C19.2 47.0 19.6 38.2 20.6 33.2C20.0 30.8 18.5 27.6 18.5 23.0Z"
            transform="translate(${tailShift * 0.25}, 0)"
            fill="url(#${uid}Body)" stroke="#52359C" stroke-width="1.85" stroke-linejoin="round"/>

      <!-- Soft Forehead Highlight -->
      <path d="M22.2 15.8c1.7-3.0 4.6-4.5 7.4-4.6" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" opacity="0.65"/>

      <!-- Face Features -->
      ${blushMarkup}
      ${eyesMarkup}
      ${mouthMarkup}

      <!-- Slim Seamless White Nurse Lab Coat (Clean neck taper, zero overlap cut) -->
      <g>
        <!-- Inner Scrub Top V-Neck -->
        <path d="M25.0 33.0h10.0L30.0 41.8L25.0 33.0Z" fill="#6D48C7"/>
        <!-- White Coat Torso -->
        <path d="M20.4 33.6C22.0 33.2 23.6 33.0 25.0 33.0L30.0 41.8L35.0 33.0C36.4 33.0 38.0 33.2 39.6 33.6C40.5 38.0 40.9 45.2 40.9 52.8C40.9 54.0 39.9 54.8 38.7 54.8H31.3V46.5H28.7V54.8H21.3C20.1 54.8 19.1 54.0 19.1 52.8C19.1 45.2 19.5 38.0 20.4 33.6Z"
              fill="url(#${uid}Coat)" stroke="#52359C" stroke-width="1.75" stroke-linejoin="round"/>
        <!-- Crisp Collar Lapels -->
        <path d="M25.0 33.0L30.0 41.8L26.2 40.2L23.8 35.6L25.0 33.0ZM35.0 33.0L30.0 41.8L33.8 40.2L36.2 35.6L35.0 33.0Z"
              fill="#E9EEF6" stroke="#52359C" stroke-width="1.05" stroke-linejoin="round"/>
        <!-- Coat Center Seam & Buttons -->
        <line x1="30.0" y1="41.8" x2="30.0" y2="54.2" stroke="#94A3B8" stroke-width="1.15"/>
        <circle cx="30.0" cy="45.0" r="1.05" fill="#5B3EA8"/>
        <circle cx="30.0" cy="48.8" r="1.05" fill="#5B3EA8"/>

        <!-- Chest Pocket + Nurse Red Cross Badge -->
        <rect x="33.4" y="42.4" width="5.4" height="4.8" rx="1.2" fill="#F8FAFC" stroke="#64748B" stroke-width="0.9"/>
        <path d="M36.1 43.6v2.4M34.9 44.8h2.4" stroke="#EF4444" stroke-width="1.35" stroke-linecap="round"/>

        <!-- Symmetric Stethoscope Draped Cleanly Around Collar -->
        <path d="M24.2 33.3C23.5 38.2 26.2 41.8 30.0 41.8C33.8 41.8 36.5 38.2 35.8 33.3"
              stroke="#3B2378" stroke-width="1.6" stroke-linecap="round" fill="none"/>
        <circle cx="24.8" cy="42.8" r="1.85" fill="#E2E8F0" stroke="#3B2378" stroke-width="1.15"/>
      </g>
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
