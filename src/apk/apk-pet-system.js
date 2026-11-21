// Nightingale AI Companion Mascot: Nova (ChatGPT-Style Intelligent Study Companion)
// Minimalist, ultra-cute floating cyber-creature with expressive LED visor,
// gentle hovering physics (NO spinning), interactive emotional reactions,
// and smart context-aware spatial dodging so it never blocks content or controls.

const STORAGE_PET_KEY = 'nnl_companion_pet_id';
const STORAGE_ENABLED_KEY = 'nnl_companion_pet_enabled';
const STORAGE_PET_NAME_KEY = 'nnl_companion_pet_name';

export function setPetEnabled(enabled) {
  try {
    localStorage.setItem(STORAGE_ENABLED_KEY, enabled ? 'true' : 'false');
  } catch {}
  const root = document.getElementById('apk-companion-pet');
  if (root) {
    root.style.display = enabled ? 'inline-flex' : 'none';
  }
}

export function getPetName() {
  return 'Nova';
}

export function getCompanionSvg(expression = 'default') {
  return getNovaAvatarMarkup(expression);
}

export const PET_CATALOG = [
  {
    id: 'nova',
    name: 'Nova',
    tagline: 'ChatGPT-Style AI Study Companion',
    getSvg: (expr) => getNovaAvatarMarkup(expr)
  }
];

export function getAvailablePets() {
  return PET_CATALOG;
}

export function getActivePetId() {
  return 'nova';
}

export function setActivePetId() {
  try {
    localStorage.setItem(STORAGE_PET_KEY, 'nova');
  } catch {}
}

export function getLumiSvg(expression = 'default') {
  return getNovaAvatarMarkup(expression);
}

export function getNovaAvatarMarkup(expr = 'default') {
  let leftEyePath = '';
  let rightEyePath = '';
  let mouthPath = '';
  let blush = '';

  if (expr === 'happy' || expr === 'excited') {
    // Joyful curved arc eyes ( ^ ‿ ^ )
    leftEyePath = `<path d="M 21 27 Q 26 21 31 27" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" fill="none" />`;
    rightEyePath = `<path d="M 39 27 Q 44 21 49 27" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" fill="none" />`;
    mouthPath = `<path d="M 32 33 Q 35 36 38 33" stroke="#A78BFA" stroke-width="2.2" stroke-linecap="round" fill="none" />`;
    blush = `
      <circle cx="18" cy="30" r="3" fill="#F43F5E" opacity="0.45" />
      <circle cx="52" cy="30" r="3" fill="#F43F5E" opacity="0.45" />
    `;
  } else if (expr === 'blink') {
    // Closed relaxed eyes ( — ‿ — )
    leftEyePath = `<line x1="21" y1="26" x2="31" y2="26" stroke="#38BDF8" stroke-width="2.8" stroke-linecap="round" />`;
    rightEyePath = `<line x1="39" y1="26" x2="49" y2="26" stroke="#38BDF8" stroke-width="2.8" stroke-linecap="round" />`;
    mouthPath = `<path d="M 33 32 Q 35 34 37 32" stroke="#A78BFA" stroke-width="2" stroke-linecap="round" fill="none" />`;
  } else if (expr === 'curious' || expr === 'alert') {
    // Wide curious eyes ( ⊙ ‿ ⊙ )
    leftEyePath = `
      <circle cx="26" cy="25" r="4.5" fill="#38BDF8" />
      <circle cx="28" cy="23.5" r="1.6" fill="#FFFFFF" />
    `;
    rightEyePath = `
      <circle cx="44" cy="25" r="4.5" fill="#38BDF8" />
      <circle cx="46" cy="23.5" r="1.6" fill="#FFFFFF" />
    `;
    mouthPath = `<circle cx="35" cy="33" r="1.8" fill="#A78BFA" />`;
  } else {
    // Default friendly cyber eyes ( • ◡ • )
    leftEyePath = `
      <ellipse cx="26" cy="26" rx="3.6" ry="4.8" fill="#38BDF8" />
      <circle cx="27.5" cy="24" r="1.5" fill="#FFFFFF" />
    `;
    rightEyePath = `
      <ellipse cx="44" cy="26" rx="3.6" ry="4.8" fill="#38BDF8" />
      <circle cx="45.5" cy="24" r="1.5" fill="#FFFFFF" />
    `;
    mouthPath = `<path d="M 32 32 Q 35 35 38 32" stroke="#A78BFA" stroke-width="2.2" stroke-linecap="round" fill="none" />`;
  }

  return `
    <div class="nova-companion-avatar">
      <svg viewBox="0 0 70 70" width="56" height="56" fill="none" xmlns="http://www.w3.org/2000/svg" class="nova-svg">
        <defs>
          <radialGradient id="novaAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#38BDF8" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="novaChassis" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF"/>
            <stop offset="40%" stop-color="#E0E7FF"/>
            <stop offset="100%" stop-color="#C7D2FE"/>
          </linearGradient>
          <linearGradient id="novaVisor" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0F172A"/>
            <stop offset="100%" stop-color="#020617"/>
          </linearGradient>
          <linearGradient id="novaAntenna" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#8B5CF6"/>
            <stop offset="100%" stop-color="#38BDF8"/>
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="glow"/>
            <feComposite in="SourceGraphic" in2="glow" operator="over"/>
          </filter>
        </defs>

        <!-- Ambient Soft Energy Aura -->
        <circle cx="35" cy="35" r="32" fill="url(#novaAura)"/>

        <!-- Antenna -->
        <path d="M 35 15 L 35 7" stroke="url(#novaAntenna)" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="35" cy="6" r="3" fill="#38BDF8" filter="url(#neonGlow)"/>

        <!-- Head / Body Capsule -->
        <rect x="10" y="14" width="50" height="42" rx="21" fill="url(#novaChassis)" stroke="#818CF8" stroke-width="1.6"/>

        <!-- Cyber Visor Glass Screen -->
        <rect x="15" y="19" width="40" height="28" rx="14" fill="url(#novaVisor)" stroke="rgba(56, 189, 248, 0.45)" stroke-width="1.2"/>

        <!-- Visor Gloss Reflection -->
        <path d="M 20 22 Q 35 19 50 22" stroke="rgba(255, 255, 255, 0.35)" stroke-width="1.2" stroke-linecap="round"/>

        <!-- Dynamic Expressive Eyes & Mouth -->
        <g filter="url(#neonGlow)">
          ${leftEyePath}
          ${rightEyePath}
          ${mouthPath}
          ${blush}
        </g>

        <!-- Cute Floating Thrusters / Bottom Pods -->
        <ellipse cx="25" cy="56" rx="4" ry="2" fill="#38BDF8" opacity="0.75" filter="url(#neonGlow)"/>
        <ellipse cx="45" cy="56" rx="4" ry="2" fill="#38BDF8" opacity="0.75" filter="url(#neonGlow)"/>
      </svg>
    </div>
  `;
}

export function isPetEnabled() {
  try {
    const val = localStorage.getItem(STORAGE_ENABLED_KEY);
    if (val === 'false') return false;
    return true;
  } catch {
    return true;
  }
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
    root.style.setProperty('display', 'flex', 'important');
    root.style.setProperty('visibility', 'visible', 'important');
    root.style.setProperty('opacity', '1', 'important');
  }
}

export function triggerPetReaction(expr = 'happy', durationMs = 2000) {
  const root = document.getElementById('apk-companion-pet');
  if (!root) return;
  const avatar = root.querySelector('.apk-pet-avatar');
  if (!avatar) return;

  avatar.innerHTML = getNovaAvatarMarkup(expr);
  root.classList.add('nova-reacting');

  setTimeout(() => {
    if (avatar) avatar.innerHTML = getNovaAvatarMarkup('default');
    if (root) root.classList.remove('nova-reacting');
  }, durationMs);
}

// ── Smart Spatial Dodging ──
// When user taps or scrolls near bottom, Nova glides smoothly to top corner.
// When user interacts near top or watches a video, Nova glides down to bottom corner.
let currentCorner = 'bottom-right'; // 'top-right' or 'bottom-right'
let dodgeTimeout = null;

export function dodgePetTo(corner) {
  const root = document.getElementById('apk-companion-pet');
  if (!root) return;
  currentCorner = corner;

  if (corner === 'top-right') {
    root.style.top = '78px';
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
    root.setAttribute('aria-label', 'Nova AI Study Companion');
    root.innerHTML = `
      <div class="apk-pet-avatar">${getNovaAvatarMarkup('default')}</div>
      <div class="nova-sparkles"></div>
    `;
    document.body.appendChild(root);
  } else {
    const avatar = root.querySelector('.apk-pet-avatar');
    if (avatar) {
      avatar.innerHTML = getNovaAvatarMarkup('default');
    }
  }

  syncPetVisibility();

  // Natural Blinking Loop every 4 to 7 seconds
  setInterval(() => {
    if (!root || root.classList.contains('nova-reacting') || root.classList.contains('hide')) return;
    const avatar = root.querySelector('.apk-pet-avatar');
    if (!avatar) return;
    avatar.innerHTML = getNovaAvatarMarkup('blink');
    setTimeout(() => {
      if (avatar && !root.classList.contains('nova-reacting')) {
        avatar.innerHTML = getNovaAvatarMarkup('default');
      }
    }, 280);
  }, 4800);

  // Click / Tap Reaction: Joyful bounce + stardust sparkle + dodge opposite
  root.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerPetReaction('happy', 2200);
    // Switch corner on tap
    if (currentCorner === 'bottom-right') {
      dodgePetTo('top-right');
    } else {
      dodgePetTo('bottom-right');
    }
  });

  // Intelligent Context-Aware Dodging on Touch / Scroll:
  let lastTouchY = 0;
  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      lastTouchY = e.touches[0].clientY;
      const screenH = window.innerHeight;
      // If user touches bottom 40% of screen where bottom buttons or actions are
      if (lastTouchY > screenH * 0.58) {
        if (currentCorner !== 'top-right') {
          clearTimeout(dodgeTimeout);
          dodgeTimeout = setTimeout(() => dodgePetTo('top-right'), 120);
        }
      } else if (lastTouchY < 140) {
        // If user touches near top header/search
        if (currentCorner !== 'bottom-right') {
          clearTimeout(dodgeTimeout);
          dodgeTimeout = setTimeout(() => dodgePetTo('bottom-right'), 120);
        }
      }
    }
  }, { passive: true });

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

  // When video viewer is open, dim Nova and move to bottom
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

  // Touch Dragging with Smart Edge Snap
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
      // Snap to nearest horizontal edge
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
