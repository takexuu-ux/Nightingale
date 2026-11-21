// Nightingale Study Companion Mascot: Mochi (Kawaii Medical Study Companion)
// Adorable, lively pet with rich facial expressions (sparkling anime eyes, blinking, winking, smiling, blushing),
// gentle organic hovering physics, interactive tap reactions with encouraging quotes, and smart spatial dodging.

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
  return 'Mochi';
}

export function getCompanionSvg(expression = 'default') {
  return getMochiAvatarMarkup(expression);
}

export const PET_CATALOG = [
  {
    id: 'mochi',
    name: 'Mochi',
    tagline: 'Kawaii Medical Study Companion',
    getSvg: (expr) => getMochiAvatarMarkup(expr)
  }
];

export function getAvailablePets() {
  return PET_CATALOG;
}

export function getActivePetId() {
  return 'mochi';
}

export function setActivePetId() {
  try {
    localStorage.setItem(STORAGE_PET_KEY, 'mochi');
  } catch {}
}

export function getLumiSvg(expression = 'default') {
  return getMochiAvatarMarkup(expression);
}

// Encouraging study quotes whispered on tap
const ENCOURAGEMENTS = [
  "You've got this, Doctor! 🩺",
  "NORCET AIIMS Rank 1! 🌟",
  "Keep studying, future officer! ✨",
  "Focus mode: ON! 📖",
  "Every lecture counts! 🎯",
  "Proud of your hard work! 💖",
  "Stay consistent, champion! 🚀"
];

let speechTimeout = null;
export function showMochiSpeech(text) {
  const root = document.getElementById('apk-companion-pet');
  if (!root) return;
  let bubble = root.querySelector('.mochi-speech-bubble');
  if (!bubble) {
    bubble = document.createElement('div');
    bubble.className = 'mochi-speech-bubble';
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
  let eyesMarkup = '';
  let mouthMarkup = '';
  let blushMarkup = `
    <ellipse cx="18" cy="39" rx="4.5" ry="2.6" fill="#FF8BA7" opacity="0.6" filter="url(#mochiBlushGlow)"/>
    <ellipse cx="52" cy="39" rx="4.5" ry="2.6" fill="#FF8BA7" opacity="0.6" filter="url(#mochiBlushGlow)"/>
  `;
  let accessoryMarkup = `
    <!-- Tiny Medical Nurse Cap with Lavender Cross -->
    <g transform="translate(25, 4)">
      <path d="M 3 12 L 8 4 L 14 4 L 19 12 Z" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="0.8"/>
      <path d="M 11 6.5 L 11 10.5 M 9 8.5 L 13 8.5" stroke="#8E74E5" stroke-width="1.4" stroke-linecap="round"/>
    </g>
  `;

  if (expr === 'happy' || expr === 'excited') {
    // Joyful crescent smiling anime eyes ( ^ ‿ ^ )
    eyesMarkup = `
      <path d="M 20 32 Q 26 24 32 32" stroke="#2D1F3F" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M 38 32 Q 44 24 50 32" stroke="#2D1F3F" stroke-width="3" stroke-linecap="round" fill="none"/>
    `;
    mouthMarkup = `
      <!-- Open cheerful happy mouth with tiny pink tongue -->
      <path d="M 32 37 Q 35 43 38 37 Z" fill="#FF6B8B"/>
      <path d="M 33 39 Q 35 41 37 39" fill="#FFA5BA"/>
    `;
    blushMarkup = `
      <ellipse cx="17" cy="38" rx="5" ry="3" fill="#FF5E85" opacity="0.8" filter="url(#mochiBlushGlow)"/>
      <ellipse cx="53" cy="38" rx="5" ry="3" fill="#FF5E85" opacity="0.8" filter="url(#mochiBlushGlow)"/>
    `;
  } else if (expr === 'blink') {
    // Gentle natural blinking ( — ‿ — )
    eyesMarkup = `
      <line x1="20" y1="33" x2="31" y2="33" stroke="#2D1F3F" stroke-width="2.6" stroke-linecap="round"/>
      <line x1="39" y1="33" x2="50" y2="33" stroke="#2D1F3F" stroke-width="2.6" stroke-linecap="round"/>
    `;
    mouthMarkup = `
      <path d="M 32 37 Q 33.5 39 35 37.5 Q 36.5 39 38 37" stroke="#2D1F3F" stroke-width="2" stroke-linecap="round" fill="none"/>
    `;
  } else if (expr === 'wink') {
    // Playful wink with star sparkle ( ★ ‿ < )
    eyesMarkup = `
      <!-- Left eye winking line -->
      <path d="M 21 34 Q 26 38 31 34" stroke="#2D1F3F" stroke-width="3" stroke-linecap="round" fill="none"/>
      <!-- Right eye big starry anime pupil -->
      <ellipse cx="44" cy="32" rx="5" ry="5.5" fill="#2D1F3F"/>
      <circle cx="46" cy="30" r="2.2" fill="#FFFFFF"/>
      <circle cx="42.5" cy="34" r="1.1" fill="#FFFFFF"/>
      <polygon points="44,28 45,30 47,30 45.5,31.5 46,33.5 44,32 42,33.5 42.5,31.5 41,30 43,30" fill="#FFD700" transform="scale(0.5) translate(46, 32)"/>
    `;
    mouthMarkup = `
      <!-- Cute tongue out -->
      <path d="M 32 37 Q 33.5 39 35 37.5 Q 36.5 39 38 37" stroke="#2D1F3F" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M 36 38 Q 38 43 40 38 Z" fill="#FF6B8B"/>
    `;
  } else {
    // Default: Big glossy, sparkling anime eyes with double reflections ( ◕ ‿ ◕ )
    eyesMarkup = `
      <!-- Left Eye -->
      <ellipse cx="25" cy="32" rx="5" ry="5.8" fill="#2D1F3F"/>
      <circle cx="27" cy="30" r="2.2" fill="#FFFFFF"/>
      <circle cx="23.5" cy="34" r="1.1" fill="#FFFFFF"/>
      <!-- Right Eye -->
      <ellipse cx="45" cy="32" rx="5" ry="5.8" fill="#2D1F3F"/>
      <circle cx="47" cy="30" r="2.2" fill="#FFFFFF"/>
      <circle cx="43.5" cy="34" r="1.1" fill="#FFFFFF"/>
    `;
    mouthMarkup = `
      <!-- Cute ω kitten smile -->
      <path d="M 31 37 Q 33 39.5 35 37.5 Q 37 39.5 39 37" stroke="#2D1F3F" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    `;
  }

  return `
    <div class="mochi-companion-avatar" data-expr="${expr}">
      <svg class="mochi-svg" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Soft Body Shading -->
          <linearGradient id="mochiBodyGrad" x1="15" y1="12" x2="55" y2="60" gradientUnits="userSpaceOnUse">
            <stop stop-color="#FFFFFF"/>
            <stop offset="0.65" stop-color="#FFF5F2"/>
            <stop offset="1" stop-color="#FDECE6"/>
          </linearGradient>
          <!-- Soft Peach Shadow -->
          <filter id="mochiDropShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="rgba(142, 116, 229, 0.35)"/>
          </filter>
          <filter id="mochiBlushGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5"/>
          </filter>
        </defs>

        <!-- Drop Shadow Aura -->
        <ellipse cx="35" cy="62" rx="20" ry="4" fill="rgba(60, 30, 90, 0.18)" filter="url(#mochiBlushGlow)"/>

        <!-- Ears (Soft rounded with cute pink inner ear) -->
        <g id="mochi-ears">
          <!-- Left Ear -->
          <path d="M 16 26 C 11 15 15 11 25 18 Z" fill="#FFF5F2" stroke="#2D1F3F" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M 17 24 C 14 17 17 14 23 19 Z" fill="#FF8BA7" opacity="0.85"/>
          <!-- Right Ear -->
          <path d="M 54 26 C 59 15 55 11 45 18 Z" fill="#FFF5F2" stroke="#2D1F3F" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M 53 24 C 56 17 53 14 47 19 Z" fill="#FF8BA7" opacity="0.85"/>
        </g>

        <!-- Chubby Soft Rounded Body / Face -->
        <rect x="13" y="16" width="44" height="42" rx="21" fill="url(#mochiBodyGrad)" stroke="#2D1F3F" stroke-width="2" filter="url(#mochiDropShadow)"/>

        <!-- Cheeks Blush -->
        ${blushMarkup}

        <!-- Nose -->
        <polygon points="33.5,34.5 36.5,34.5 35,36" fill="#FF7597"/>

        <!-- Eyes -->
        <g id="mochi-eyes">
          ${eyesMarkup}
        </g>

        <!-- Mouth -->
        <g id="mochi-mouth">
          ${mouthMarkup}
        </g>

        <!-- Tiny Paws resting in front -->
        <g id="mochi-paws">
          <ellipse cx="25" cy="54" rx="4.5" ry="3.2" fill="#FFFFFF" stroke="#2D1F3F" stroke-width="1.5"/>
          <ellipse cx="45" cy="54" rx="4.5" ry="3.2" fill="#FFFFFF" stroke="#2D1F3F" stroke-width="1.5"/>
        </g>

        <!-- Accessory (Nurse Cap) -->
        ${accessoryMarkup}
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
export function triggerPetReaction(expr = 'happy', durationMs = 2200) {
  const root = document.getElementById('apk-companion-pet');
  if (!root) return;
  const avatar = root.querySelector('.apk-pet-avatar');
  if (!avatar) return;

  avatar.innerHTML = getMochiAvatarMarkup(expr);
  root.classList.add('mochi-pop-react');

  // Spawn a floating heart
  spawnFloatingHeart(root);

  clearTimeout(reactionTimer);
  reactionTimer = setTimeout(() => {
    avatar.innerHTML = getMochiAvatarMarkup('default');
    root.classList.remove('mochi-pop-react');
  }, durationMs);
}

function spawnFloatingHeart(parent) {
  const heart = document.createElement('div');
  heart.className = 'mochi-floating-heart';
  heart.innerHTML = ['💖', '✨', '🩺', '🌸', '⭐'][Math.floor(Math.random() * 5)];
  parent.appendChild(heart);
  setTimeout(() => heart.remove(), 1200);
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
    root.setAttribute('aria-label', 'Mochi Kawaii Study Companion');
    root.innerHTML = `
      <div class="apk-pet-avatar">${getMochiAvatarMarkup('default')}</div>
      <div class="mochi-sparkles"></div>
    `;
    document.body.appendChild(root);
  } else {
    const avatar = root.querySelector('.apk-pet-avatar');
    if (avatar) {
      avatar.innerHTML = getMochiAvatarMarkup('default');
    }
  }

  syncPetVisibility();

  // Natural Blinking Cycle (Every 3.8s, natural 180ms blink)
  setInterval(() => {
    if (document.hidden) return;
    const avatar = root.querySelector('.apk-pet-avatar');
    if (!avatar) return;
    const curExpr = avatar.querySelector('.mochi-companion-avatar')?.getAttribute('data-expr');
    if (!curExpr || curExpr === 'default') {
      avatar.innerHTML = getMochiAvatarMarkup('blink');
      setTimeout(() => {
        const check = avatar.querySelector('.mochi-companion-avatar')?.getAttribute('data-expr');
        if (check === 'blink') {
          avatar.innerHTML = getMochiAvatarMarkup('default');
        }
      }, 180);
    }
  }, 3800);

  // Tap Interactions: Giggles, blushes, winks, pops floating heart & whispers study quote
  root.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const expressions = ['happy', 'wink', 'excited'];
    const chosen = expressions[Math.floor(Math.random() * expressions.length)];
    triggerPetReaction(chosen, 2000);
    showMochiSpeech();
  });

  // Smart Context-Aware Dodging
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

  // When video viewer is open, dim Mochi and tuck safely to bottom
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
