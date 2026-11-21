// Nightingale Study Companion Mascot: Koda (The AI Cyber Fox Study Companion)
// Sleek, gender-neutral, modern study companion inspired by high-performance developer pets.
// Features genuine animated facial expressions:
// - default: Sharp, intelligent dark eyes with dual cyan/white specular highlights and confident smile ( ◕ ‿ ◕ )
// - blink: Clean horizontal blinking eyelids ( ─ ‿ ─ )
// - focus: Cool glowing cyan study glasses with determined focus brow!
// - happy / cheer: Cheerful crescent eyes ( ^ ‿ ^ ) with open smile and gold star particles!
// Zero pink blush, zero nurse caps, zero pink hearts.

const STORAGE_PET_KEY = 'nnl_companion_pet_id';
const STORAGE_ENABLED_KEY = 'nnl_companion_pet_enabled';

export function isPetEnabled() {
  try {
    const val = localStorage.getItem(STORAGE_ENABLED_KEY);
    if (val === 'false') return false;
    return true;
  } catch {
    return true;
  }
}

export function setPetEnabled(enabled) {
  try {
    localStorage.setItem(STORAGE_ENABLED_KEY, enabled ? 'true' : 'false');
  } catch {}
  const root = document.getElementById('apk-companion-pet');
  if (root) {
    root.style.setProperty('display', enabled ? 'inline-flex' : 'none', 'important');
  }
}

export function getPetName() {
  return 'Koda';
}

export function getCompanionSvg(expression = 'default') {
  return getKodaAvatarMarkup(expression);
}

export const PET_CATALOG = [
  {
    id: 'koda',
    name: 'Koda',
    tagline: 'AI Medical Study Companion',
    getSvg: (expr) => getKodaAvatarMarkup(expr)
  }
];

export function getAvailablePets() {
  return PET_CATALOG;
}

export function getActivePetId() {
  return 'koda';
}

export function setActivePetId() {
  try {
    localStorage.setItem(STORAGE_PET_KEY, 'koda');
  } catch {}
}

export function getLumiSvg(expression = 'default') {
  return getKodaAvatarMarkup(expression);
}

// Empowering, high-yield NORCET / medical study quotes
const ENCOURAGEMENTS = [
  "Focus mode locked: AIIMS New Delhi! 🎯",
  "High-yield concepts only! ⚡",
  "One concept at a time, Doctor! 🩺",
  "Master your NCLEX & NORCET prep! 🚀",
  "Consistent daily reps build champions! ⭐",
  "Clinical rationales decoded! 🧠",
  "Stay sharp, future AIIMS Nursing Officer! 🏆"
];

let speechTimeout = null;
export function showMochiSpeech(text) {
  showKodaSpeech(text);
}

export function showKodaSpeech(text) {
  const root = document.getElementById('apk-companion-pet');
  if (!root) return;
  let bubble = root.querySelector('.mochi-speech-bubble, .koda-speech-bubble');
  if (!bubble) {
    bubble = document.createElement('div');
    bubble.className = 'koda-speech-bubble';
    root.appendChild(bubble);
  }
  bubble.textContent = text || ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
  bubble.classList.add('visible');
  clearTimeout(speechTimeout);
  speechTimeout = setTimeout(() => {
    bubble.classList.remove('visible');
  }, 2400);
}

export function getMochiAvatarMarkup(expr = 'default') {
  return getKodaAvatarMarkup(expr);
}

export function getKodaAvatarMarkup(expr = 'default') {
  let eyesMarkup = '';
  let mouthMarkup = '';
  let accessoryMarkup = '';

  if (expr === 'happy' || expr === 'excited' || expr === 'cheer') {
    // Cheerful upward-curved eyes ( ^ ‿ ^ )
    eyesMarkup = `
      <path d="M 22 34 Q 28 26 34 34" stroke="#0F172A" stroke-width="3.2" stroke-linecap="round" fill="none"/>
      <path d="M 40 34 Q 46 26 52 34" stroke="#0F172A" stroke-width="3.2" stroke-linecap="round" fill="none"/>
    `;
    mouthMarkup = `
      <path d="M 33 42 Q 37 47 41 42" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round" fill="#EA580C"/>
    `;
  } else if (expr === 'blink') {
    // Clean horizontal eyelids ( ─ ‿ ─ )
    eyesMarkup = `
      <line x1="22" y1="34" x2="34" y2="34" stroke="#0F172A" stroke-width="2.8" stroke-linecap="round"/>
      <line x1="40" y1="34" x2="52" y2="34" stroke="#0F172A" stroke-width="2.8" stroke-linecap="round"/>
    `;
    mouthMarkup = `
      <path d="M 33 41 Q 37 43 41 41" stroke="#0F172A" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    `;
  } else if (expr === 'focus' || expr === 'study') {
    // Sleek cyber glasses with electric cyan glow & determined brow
    eyesMarkup = `
      <!-- Focused Eyes -->
      <ellipse cx="28" cy="33" rx="4.5" ry="4.5" fill="#0F172A"/>
      <circle cx="29.5" cy="31.5" r="1.6" fill="#38BDF8"/>
      <ellipse cx="46" cy="33" rx="4.5" ry="4.5" fill="#0F172A"/>
      <circle cx="47.5" cy="31.5" r="1.6" fill="#38BDF8"/>
    `;
    accessoryMarkup = `
      <!-- Cyber Study Glasses -->
      <rect x="20" y="27" width="16" height="12" rx="3.5" fill="rgba(6, 182, 212, 0.15)" stroke="#06B6D4" stroke-width="1.8"/>
      <rect x="38" y="27" width="16" height="12" rx="3.5" fill="rgba(6, 182, 212, 0.15)" stroke="#06B6D4" stroke-width="1.8"/>
      <line x1="36" y1="32" x2="38" y2="32" stroke="#06B6D4" stroke-width="1.8"/>
      <line x1="17" y1="31" x2="20" y2="31" stroke="#06B6D4" stroke-width="1.6"/>
      <line x1="54" y1="31" x2="57" y2="31" stroke="#06B6D4" stroke-width="1.6"/>
      <!-- Glass Glare Highlights -->
      <line x1="22" y1="29" x2="26" y2="29" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" opacity="0.8"/>
      <line x1="40" y1="29" x2="44" y2="29" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" opacity="0.8"/>
    `;
    mouthMarkup = `
      <line x1="34" y1="42" x2="40" y2="42" stroke="#0F172A" stroke-width="2.2" stroke-linecap="round"/>
    `;
  } else {
    // Default: Intelligent alert eyes with cyan/white reflections ( ◕ ‿ ◕ )
    eyesMarkup = `
      <!-- Left Eye -->
      <ellipse cx="28" cy="33" rx="4.8" ry="5.2" fill="#0F172A"/>
      <circle cx="29.8" cy="31.2" r="1.8" fill="#FFFFFF"/>
      <circle cx="26.5" cy="34.5" r="1.1" fill="#38BDF8"/>
      <!-- Right Eye -->
      <ellipse cx="46" cy="33" rx="4.8" ry="5.2" fill="#0F172A"/>
      <circle cx="47.8" cy="31.2" r="1.8" fill="#FFFFFF"/>
      <circle cx="44.5" cy="34.5" r="1.1" fill="#38BDF8"/>
    `;
    mouthMarkup = `
      <!-- Confident Smile -->
      <path d="M 33 41 Q 37 44 41 41" stroke="#0F172A" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    `;
  }

  return `
    <div class="koda-companion-avatar" data-expr="${expr}">
      <svg class="koda-svg" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Fur Gradient: Rich Vibrant Amber-Orange -->
          <linearGradient id="kodaFurGrad" x1="16" y1="12" x2="58" y2="64" gradientUnits="userSpaceOnUse">
            <stop stop-color="#FB923C"/>
            <stop offset="0.45" stop-color="#EA580C"/>
            <stop offset="1" stop-color="#C2410C"/>
          </linearGradient>
          <!-- Charcoal Ears & Accents -->
          <linearGradient id="kodaCharcoalGrad" x1="20" y1="8" x2="54" y2="30" gradientUnits="userSpaceOnUse">
            <stop stop-color="#334155"/>
            <stop offset="1" stop-color="#0F172A"/>
          </linearGradient>
          <!-- Cream Muzzle Gradient -->
          <linearGradient id="kodaCreamGrad" x1="26" y1="34" x2="48" y2="52" gradientUnits="userSpaceOnUse">
            <stop stop-color="#FFFFFF"/>
            <stop offset="1" stop-color="#FEF3C7"/>
          </linearGradient>
          <!-- High-End Ambient Drop Shadow -->
          <filter id="kodaShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="4.5" flood-color="rgba(15, 23, 42, 0.45)"/>
          </filter>
        </defs>

        <!-- Base Soft Ground Shadow -->
        <ellipse cx="37" cy="67" rx="22" ry="4" fill="rgba(15, 23, 42, 0.25)"/>

        <!-- Ears: Pointed, Sleek with Slate Tips & Cream Inner Tuft -->
        <g id="koda-ears">
          <!-- Left Ear Outer -->
          <path d="M 17 32 C 10 18 16 8 27 15 Z" fill="url(#kodaFurGrad)" stroke="#0F172A" stroke-width="1.8" stroke-linejoin="round"/>
          <!-- Left Ear Slate Tip -->
          <path d="M 12 21 C 11 16 14 10 20 12 Z" fill="url(#kodaCharcoalGrad)"/>
          <!-- Left Ear Inner Cream -->
          <path d="M 18 28 C 14 20 18 15 24 18 Z" fill="#FEF3C7" opacity="0.9"/>

          <!-- Right Ear Outer -->
          <path d="M 57 32 C 64 18 58 8 47 15 Z" fill="url(#kodaFurGrad)" stroke="#0F172A" stroke-width="1.8" stroke-linejoin="round"/>
          <!-- Right Ear Slate Tip -->
          <path d="M 62 21 C 63 16 60 10 54 12 Z" fill="url(#kodaCharcoalGrad)"/>
          <!-- Right Ear Inner Cream -->
          <path d="M 56 28 C 60 20 56 15 50 18 Z" fill="#FEF3C7" opacity="0.9"/>
        </g>

        <!-- Main Head Silhouette (Sleek Geometric Oval with Cheek Fluffs) -->
        <path d="M 15 38 C 12 44 16 52 23 55 C 29 58 45 58 51 55 C 58 52 62 44 59 38 C 58 26 50 18 37 18 C 24 18 16 26 15 38 Z"
              fill="url(#kodaFurGrad)"
              stroke="#0F172A"
              stroke-width="2.2"
              stroke-linejoin="round"
              filter="url(#kodaShadow)"/>

        <!-- Forehead Cyber Diamond Crest (Gold Accent) -->
        <polygon points="37,21 40,25 37,29 34,25" fill="#F59E0B" stroke="#0F172A" stroke-width="1"/>

        <!-- Cheek Flairs & Cream Muzzle (Gender-neutral, sharp & clean) -->
        <path d="M 24 45 C 22 51 28 56 37 56 C 46 56 52 51 50 45 C 47 38 43 35 37 35 C 31 35 27 38 24 45 Z"
              fill="url(#kodaCreamGrad)"
              stroke="#0F172A"
              stroke-width="1.8"/>

        <!-- Sleek Charcoal Nose -->
        <polygon points="35,38 39,38 37,40" fill="#0F172A"/>

        <!-- Eyes -->
        <g id="koda-eyes">
          ${eyesMarkup}
        </g>

        <!-- Mouth -->
        <g id="koda-mouth">
          ${mouthMarkup}
        </g>

        <!-- Accessory (Cyber Glasses if in Focus mode) -->
        ${accessoryMarkup}

        <!-- Clean Paws Resting at Bottom -->
        <g id="koda-paws">
          <ellipse cx="27" cy="58" rx="4.5" ry="3.2" fill="#FEF3C7" stroke="#0F172A" stroke-width="1.6"/>
          <ellipse cx="47" cy="58" rx="4.5" ry="3.2" fill="#FEF3C7" stroke="#0F172A" stroke-width="1.6"/>
        </g>
      </svg>
    </div>
  `;
}

export function isLoginScreenActive() {
  if (typeof document === 'undefined') return false;
  const token = localStorage.getItem('token') || localStorage.getItem('nnl_access_token') || localStorage.getItem('nnl_auth_token');
  if (token) return false;
  if (document.body.classList.contains('on-login-screen')) return true;
  const authScreen = document.getElementById('auth-screen');
  if (authScreen && !authScreen.classList.contains('hide')) {
    return true;
  }
  return false;
}

export function syncPetVisibility() {
  const root = document.getElementById('apk-companion-pet');
  if (!root) return;

  const authOverlay = document.getElementById('auth-screen');
  const token = localStorage.getItem('token') || localStorage.getItem('nnl_access_token') || localStorage.getItem('nnl_auth_token');
  const onLogin = !token && (document.body.classList.contains('on-login-screen') || (authOverlay && !authOverlay.classList.contains('hide')));

  if (!isPetEnabled() || onLogin) {
    root.style.setProperty('display', 'none', 'important');
    root.classList.add('hide');
  } else {
    root.classList.remove('hide', 'hide-on-auth');
    root.style.removeProperty('display');
    root.style.setProperty('display', 'inline-flex', 'important');
    root.style.setProperty('visibility', 'visible', 'important');
    root.style.setProperty('opacity', '1', 'important');
  }
}

let reactionTimer = null;
export function triggerPetReaction(expr = 'focus', durationMs = 2400) {
  const root = document.getElementById('apk-companion-pet');
  if (!root) return;
  const avatar = root.querySelector('.apk-pet-avatar');
  if (!avatar) return;

  avatar.innerHTML = getKodaAvatarMarkup(expr);
  root.classList.add('koda-pop-react');

  // Spawn a floating gold star / study spark
  spawnFloatingStar(root);

  clearTimeout(reactionTimer);
  reactionTimer = setTimeout(() => {
    avatar.innerHTML = getKodaAvatarMarkup('default');
    root.classList.remove('koda-pop-react');
  }, durationMs);
}

function spawnFloatingStar(parent) {
  const star = document.createElement('div');
  star.className = 'koda-floating-star';
  star.innerHTML = ['⭐', '✨', '⚡', '🩺', '🎯'][Math.floor(Math.random() * 5)];
  parent.appendChild(star);
  setTimeout(() => star.remove(), 1200);
}

let currentCorner = 'bottom-right';
export function dodgePetTo(corner = 'top-right') {
  const root = document.getElementById('apk-companion-pet');
  if (!root) return;
  currentCorner = corner;

  if (corner === 'top-right') {
    root.style.top = 'max(14px, env(safe-area-inset-top, 14px))';
    root.style.bottom = 'auto';
    root.style.right = '16px';
    root.style.left = 'auto';
  } else {
    root.style.top = 'auto';
    root.style.bottom = '88px';
    root.style.right = '16px';
    root.style.left = 'auto';
  }
}

export function initPetSystem() {
  initCompanionPet();
}

export function initCompanionPet() {
  if (typeof document === 'undefined') return;

  let root = document.getElementById('apk-companion-pet');
  if (!root) {
    root = document.createElement('div');
    root.id = 'apk-companion-pet';
    root.className = 'apk-companion-pet';
    root.setAttribute('role', 'button');
    root.setAttribute('aria-label', 'Koda AI Study Companion');
    root.innerHTML = `
      <div class="apk-pet-avatar">${getKodaAvatarMarkup('default')}</div>
    `;
    document.body.appendChild(root);
  } else {
    const avatar = root.querySelector('.apk-pet-avatar');
    if (avatar) {
      avatar.innerHTML = getKodaAvatarMarkup('default');
    }
  }

  syncPetVisibility();

  // Natural Blinking Cycle (Every 3.8s, natural 180ms blink)
  setInterval(() => {
    if (document.hidden) return;
    const avatar = root.querySelector('.apk-pet-avatar');
    if (!avatar) return;
    const curExpr = avatar.querySelector('.koda-companion-avatar')?.getAttribute('data-expr');
    if (!curExpr || curExpr === 'default') {
      avatar.innerHTML = getKodaAvatarMarkup('blink');
      setTimeout(() => {
        const check = avatar.querySelector('.koda-companion-avatar')?.getAttribute('data-expr');
        if (check === 'blink') {
          avatar.innerHTML = getKodaAvatarMarkup('default');
        }
      }, 180);
    }
  }, 3800);

  // Tap Interactions: Triggers study focus or cheering expression, sparkles & whispers study quote
  root.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const expressions = ['focus', 'happy', 'excited'];
    const chosen = expressions[Math.floor(Math.random() * expressions.length)];
    triggerPetReaction(chosen, 2200);
    showKodaSpeech();
  });

  // Smart Context-Aware Dodging: moves to top when user scrolls down
  let dodgeTimeout = null;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    if (scrollY > 250) {
      if (currentCorner !== 'top-right') {
        clearTimeout(dodgeTimeout);
        dodgeTimeout = setTimeout(() => dodgePetTo('top-right'), 180);
      }
    } else {
      if (currentCorner !== 'bottom-right') {
        clearTimeout(dodgeTimeout);
        dodgeTimeout = setTimeout(() => dodgePetTo('bottom-right'), 180);
      }
    }
  }, { passive: true });

  // When video viewer is open, dim Koda and tuck safely to bottom
  const observer = new MutationObserver(() => {
    const recViewer = document.getElementById('recording-viewer');
    const isVideoOpen = recViewer && !recViewer.classList.contains('hide');
    if (isVideoOpen) {
      root.style.opacity = '0.35';
      dodgePetTo('bottom-right');
    } else {
      root.style.removeProperty('opacity');
    }
  });
  observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });

  // Smooth Touch Dragging with Smart Edge Snapping
  let isDragging = false;
  let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;
  let hasMoved = false;

  const onPointerDown = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    isDragging = true;
    hasMoved = false;
    startX = clientX;
    startY = clientY;
    const rect = root.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;
    root.style.transition = 'none';
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = clientX - startX;
    const dy = clientY - startY;
    if (Math.hypot(dx, dy) > 8) {
      hasMoved = true;
    }
    const newLeft = Math.max(8, Math.min(window.innerWidth - 64, initialLeft + dx));
    const newTop = Math.max(60, Math.min(window.innerHeight - 80, initialTop + dy));
    root.style.left = `${newLeft}px`;
    root.style.top = `${newTop}px`;
    root.style.bottom = 'auto';
    root.style.right = 'auto';
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    isDragging = false;
    root.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    if (hasMoved) {
      const rect = root.getBoundingClientRect();
      const midX = window.innerWidth / 2;
      if (rect.left < midX) {
        root.style.left = '16px';
        root.style.right = 'auto';
      } else {
        root.style.left = 'auto';
        root.style.right = '16px';
      }
    }
  };

  root.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp, { passive: true });
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCompanionPet);
  } else {
    initCompanionPet();
  }
}
