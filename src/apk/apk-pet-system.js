// Nightingale Companion Mascot: Authentic Spiderman (Action Superhero Study Companion)
// Uses high-definition authentic Spider-Man art with organic silk webs, acrobatics, and physics
// STRICT RULES:
// 1. Mascot is NEVER shown on the Login / Authentication screen.
// 2. User explicitly requested: NO texts or speech bubbles around the pet!
// 3. Web line MUST connect to Spiderman's HAND, never to his head.
// 4. Web line is an organic curved tensile silk filament with 8-spoke ceiling splatter.

import { SPIDERMAN_IMAGE_DATA } from './spidermanAsset.js';

const STORAGE_PET_KEY = 'nnl_companion_pet_id';
const STORAGE_ENABLED_KEY = 'nnl_companion_pet_enabled';
const STORAGE_PET_NAME_KEY = 'nnl_companion_pet_name';

export function getPetName() {
  return 'Spiderman';
}

export function getCompanionSvg(expression = 'default') {
  return getSpidermanAvatarMarkup(expression);
}

export const PET_CATALOG = [
  {
    id: 'spiderman',
    name: 'Spiderman',
    tagline: 'Superhero Study Companion',
    getSvg: (expr) => getSpidermanAvatarMarkup(expr)
  }
];

export function getAvailablePets() {
  return PET_CATALOG;
}

export function getActivePetId() {
  return 'spiderman';
}

export function setActivePetId() {
  // Spiderman mascot
}

export function getLumiSvg(expression = 'default') {
  return getSpidermanAvatarMarkup(expression);
}

export function getSpidermanSvg(expr = 'default') {
  return getSpidermanAvatarMarkup(expr);
}

export function getSpidermanAvatarMarkup(expr = 'default') {
  let extraFx = '';

  if (expr === 'spider-sense' || expr === 'alert') {
    extraFx = `
      <div class="spidey-sense-waves">
        <svg viewBox="0 0 80 40" fill="none" class="spidey-sense-waves-svg">
          <path d="M 12 30 Q 40 4 68 30" stroke="#FBBF24" stroke-width="3" stroke-linecap="round" fill="none" />
          <path d="M 20 34 Q 40 14 60 34" stroke="#EF4444" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.9" />
          <path d="M 28 38 Q 40 24 52 38" stroke="#38BDF8" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.8" />
        </svg>
      </div>
    `;
  } else if (expr === 'web-shoot' || expr === 'shooting') {
    extraFx = `
      <div class="spidey-web-flare">
        <div class="spidey-flare-dot"></div>
      </div>
    `;
  }

  return `
    <div class="spidey-avatar-wrap">
      ${extraFx}
      <img src="${SPIDERMAN_IMAGE_DATA}" alt="Spiderman Mascot" class="spidey-avatar-img" draggable="false" />
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

let expressionTimeout = null;
let bounceAnimTimeout = null;

export function setPetEnabled(enabled) {
  try {
    localStorage.setItem(STORAGE_ENABLED_KEY, enabled ? 'true' : 'false');
  } catch {}
  syncPetVisibility();
}

export function setPetExpression(expr, bodyAnim = null) {
  const root = document.getElementById('apk-companion-pet');
  if (!root || !isPetEnabled()) return;

  const avatar = root.querySelector('.apk-pet-avatar');
  if (avatar) {
    avatar.innerHTML = getSpidermanAvatarMarkup(expr);
  }

  if (bodyAnim) {
    root.classList.remove('is-nod', 'is-cheer', 'is-hop', 'is-squish', 'is-wink', 'is-spin', 'is-swinging', 'is-backflip', 'is-crouching');
    void root.offsetWidth;
    root.classList.add(bodyAnim);
    clearTimeout(bounceAnimTimeout);
    bounceAnimTimeout = setTimeout(() => {
      root.classList.remove(bodyAnim);
    }, 1200);
  }

  clearTimeout(expressionTimeout);
  if (expr !== 'default') {
    expressionTimeout = setTimeout(() => {
      if (avatar) avatar.innerHTML = getSpidermanAvatarMarkup('default');
    }, 2400);
  }
}

// User explicitly requested: "also i dont want any texts around pet"
export function showTamagotchiBubble(text, duration = 2400) {
  const bubble = document.getElementById('apk-pet-tamagotchi-bubble');
  if (bubble) bubble.remove();
  return;
}

export function triggerSpideyStunt() {
  if (typeof window !== 'undefined' && typeof window.__nnlSpideyStunt === 'function') {
    window.__nnlSpideyStunt();
  }
}

export function initPetSystem() {
  if (typeof document === 'undefined') return;

  const token = localStorage.getItem('token') || localStorage.getItem('nnl_access_token') || localStorage.getItem('nnl_auth_token');
  if (token) {
    document.body.classList.remove('apk-is-auth', 'on-login-screen');
    document.body.classList.add('is-logged-in');
    document.documentElement.classList.add('is-logged-in');
  }

  let root = document.getElementById('apk-companion-pet');
  if (!root) {
    root = document.createElement('div');
    root.id = 'apk-companion-pet';
    root.className = 'apk-companion-pet';
    root.innerHTML = `
      <div class="apk-pet-avatar">${getSpidermanAvatarMarkup('default')}</div>
    `;
    document.body.appendChild(root);
  } else {
    const avatar = root.querySelector('.apk-pet-avatar');
    if (avatar) {
      avatar.innerHTML = getSpidermanAvatarMarkup('default');
    }
  }

  const existingBubble = document.getElementById('apk-pet-tamagotchi-bubble');
  if (existingBubble) existingBubble.remove();

  syncPetVisibility();

  const savedPos = (() => {
    try {
      const raw = localStorage.getItem('nnl_companion_pet_pos');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const isDesktop = window.innerWidth >= 900;
  const initialX = isDesktop ? window.innerWidth - 110 : window.innerWidth - 75;
  const initialY = isDesktop ? window.innerHeight - 200 : window.innerHeight - 180;

  const maxX = Math.max(20, window.innerWidth - 80);
  const maxY = Math.max(40, window.innerHeight - 120);
  const initialSafeX = (savedPos?.x && typeof savedPos.x === 'number') ? Math.max(16, Math.min(maxX, savedPos.x)) : initialX;
  const initialSafeY = (savedPos?.y && typeof savedPos.y === 'number') ? Math.max(40, Math.min(maxY, savedPos.y)) : initialY;

  const pos = {
    x: initialSafeX,
    y: initialSafeY
  };

  const setPosition = (x, y) => {
    root.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  setPosition(pos.x, pos.y);

  let isDragging = false;
  let isStuntActive = false;
  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;
  let lastTapTime = 0;

  // Stunt A: 360° Acrobatic Backflip on Tap
  function performAcrobaticBackflip() {
    if (isStuntActive || isDragging) return;
    isStuntActive = true;

    setPetExpression('spider-sense');
    root.classList.remove('is-backflip', 'is-crouching', 'is-hop');
    void root.offsetWidth;
    root.classList.add('is-backflip');

    setTimeout(() => {
      root.classList.remove('is-backflip');
      root.classList.add('is-crouching');
      setPetExpression('crouch');

      setTimeout(() => {
        root.classList.remove('is-crouching');
        setPetExpression('default');
        isStuntActive = false;
      }, 550);
    }, 780);
  }

  // Helper to generate organic curved spider-web SVG with ceiling splatter starburst
  function createOrganicWebMarkup(handX, handY, anchorX, anchorY) {
    const midX = (handX + anchorX) / 2;
    // Organic catenary sag
    const midY = (handY + anchorY) / 2 + 18;

    return `
      <!-- Glowing Tensile Silk Aura -->
      <path d="M ${handX} ${handY} Q ${midX} ${midY} ${anchorX} ${anchorY}" stroke="rgba(167, 139, 250, 0.45)" stroke-width="5.5" stroke-linecap="round" fill="none" />
      <!-- Core Silk Cord -->
      <path d="M ${handX} ${handY} Q ${midX} ${midY} ${anchorX} ${anchorY}" stroke="#FFFFFF" stroke-width="2.8" stroke-linecap="round" fill="none" />
      <!-- Secondary Wrapped Spiral Filaments -->
      <path d="M ${handX} ${handY} Q ${midX} ${midY} ${anchorX} ${anchorY}" stroke="#38BDF8" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="6 3" fill="none" />
      
      <!-- 8-Spoke Organic Ceiling Splatter Starburst -->
      <g stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" opacity="0.95">
        <line x1="${anchorX}" y1="${anchorY}" x2="${anchorX - 16}" y2="${anchorY - 6}" />
        <line x1="${anchorX}" y1="${anchorY}" x2="${anchorX + 16}" y2="${anchorY - 6}" />
        <line x1="${anchorX}" y1="${anchorY}" x2="${anchorX - 12}" y2="${anchorY + 8}" />
        <line x1="${anchorX}" y1="${anchorY}" x2="${anchorX + 12}" y2="${anchorY + 8}" />
        <line x1="${anchorX}" y1="${anchorY}" x2="${anchorX}" y2="${anchorY - 14}" />
        <line x1="${anchorX}" y1="${anchorY}" x2="${anchorX - 8}" y2="${anchorY + 12}" />
        <line x1="${anchorX}" y1="${anchorY}" x2="${anchorX + 8}" y2="${anchorY + 12}" />
        <line x1="${anchorX}" y1="${anchorY}" x2="${anchorX}" y2="${anchorY + 14}" />
      </g>
      <!-- Splatter concentric webbing rings -->
      <circle cx="${anchorX}" cy="${anchorY}" r="7" fill="none" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="3 2" />
      <circle cx="${anchorX}" cy="${anchorY}" r="3.5" fill="#FFFFFF" />

      <!-- Hand Attachment Web-Wrap Ring -->
      <circle cx="${handX}" cy="${handY}" r="4" fill="#FFFFFF" stroke="#38BDF8" stroke-width="1.8" />
    `;
  }

  // Stunt B: Dynamic Organic Web-Swing Arc Across Screen
  function performWebSwingStunt() {
    if (isStuntActive || isDragging) return;
    isStuntActive = true;

    const pad = 90;
    const targetX = Math.floor(pad + Math.random() * (window.innerWidth - pad * 2));
    const targetY = Math.floor(pad + Math.random() * (window.innerHeight - pad * 2.5));

    const anchorX = (pos.x + targetX) / 2;
    const anchorY = Math.max(10, Math.min(pos.y, targetY) - 160);

    const isFacingLeft = targetX < pos.x;
    if (isFacingLeft) root.classList.add('facing-left');
    else root.classList.remove('facing-left');

    setPetExpression('spider-sense');
    root.classList.add('is-hop');

    setTimeout(() => {
      setPetExpression('web-shoot');

      let webLine = document.getElementById('spidey-web-line');
      if (!webLine) {
        webLine = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        webLine.id = 'spidey-web-line';
        webLine.setAttribute('class', 'spidey-web-svg');
        webLine.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:999998;overflow:visible;';
        document.body.appendChild(webLine);
      }

      // Hand attachment coordinates (Spider-Man hand / web shooter position)
      const handX = isFacingLeft ? pos.x + 14 : pos.x + 48;
      const handY = pos.y + 14;

      webLine.innerHTML = createOrganicWebMarkup(handX, handY, anchorX, anchorY);

      setTimeout(() => {
        root.classList.add('is-swinging');
        root.style.transition = 'transform 0.88s cubic-bezier(0.25, 1, 0.5, 1)';
        setPosition(targetX, targetY);

        let swingRaf = null;
        const swingStart = performance.now();
        const swingDuration = 880;

        const updateLiveWeb = (now) => {
          if (!webLine || !isStuntActive) return;
          const rect = root.getBoundingClientRect();
          const liveHandX = isFacingLeft ? rect.left + 14 : rect.left + 48;
          const liveHandY = rect.top + 14;
          webLine.innerHTML = createOrganicWebMarkup(liveHandX, liveHandY, anchorX, anchorY);
          if (now - swingStart < swingDuration) {
            swingRaf = requestAnimationFrame(updateLiveWeb);
          }
        };
        swingRaf = requestAnimationFrame(updateLiveWeb);

        setTimeout(() => {
          if (swingRaf) cancelAnimationFrame(swingRaf);
          pos.x = targetX;
          pos.y = targetY;
          root.style.transition = '';
          root.classList.remove('is-swinging');
          setPetExpression('crouch');
          root.classList.add('is-crouching');

          if (webLine) {
            webLine.style.transition = 'opacity 0.28s ease';
            webLine.style.opacity = '0';
            setTimeout(() => {
              if (webLine) webLine.remove();
            }, 300);
          }

          setTimeout(() => {
            root.classList.remove('is-crouching');
            setPetExpression('default');
            isStuntActive = false;
            try {
              localStorage.setItem('nnl_companion_pet_pos', JSON.stringify(pos));
            } catch {}
          }, 950);
        }, 880);
      }, 260);
    }, 320);
  }

  window.__nnlSpideyStunt = performWebSwingStunt;
  window.__nnlSpideyBackflip = performAcrobaticBackflip;

  // Occasional automatic superhero web-swing stunt
  setInterval(() => {
    if (Math.random() < 0.22 && !isStuntActive && !isDragging) {
      performWebSwingStunt();
    }
  }, 80000);

  const onPointerDown = (e) => {
    e.stopPropagation();
    if (isStuntActive) return;
    isDragging = true;
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    originX = pos.x;
    originY = pos.y;
    root.classList.add('is-dragging');
    try { root.setPointerCapture(e.pointerId); } catch (_) {}
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    e.stopPropagation();
    const cx = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const cy = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const dx = cx - startX;
    const dy = cy - startY;
    const dist = Math.hypot(dx, dy);

    if (dist > 12) {
      root.classList.add('is-running');
      if (dx < -2) root.classList.add('facing-left');
      else if (dx > 2) root.classList.remove('facing-left');

      const newX = Math.max(16, Math.min(window.innerWidth - 88, originX + dx));
      const newY = Math.max(16, Math.min(window.innerHeight - 88, originY + dy));
      pos.x = newX;
      pos.y = newY;
      setPosition(newX, newY);
    }
  };

  const onPointerUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    root.classList.remove('is-dragging', 'is-running');
    try { root.releasePointerCapture(e.pointerId); } catch (_) {}

    const cx = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || startX;
    const cy = e.clientY || (e.changedTouches && e.changedTouches[0].clientY) || startY;
    const dist = Math.hypot(cx - startX, cy - startY);

    if (dist < 12) {
      const now = Date.now();
      if (now - lastTapTime < 320) {
        // Double Tap -> Web Swing Arc Stunt
        performWebSwingStunt();
      } else {
        // Single Tap -> 360° Acrobatic Backflip
        performAcrobaticBackflip();
      }
      lastTapTime = now;
    } else {
      root.classList.add('is-squish');
      setTimeout(() => root.classList.remove('is-squish'), 350);
      try { localStorage.setItem('nnl_companion_pet_pos', JSON.stringify(pos)); } catch {}
    }
  };

  root.addEventListener('pointerdown', onPointerDown);
  root.addEventListener('pointermove', onPointerMove);
  root.addEventListener('pointerup', onPointerUp);
  root.addEventListener('pointercancel', onPointerUp);

  root.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
  });

  window.__nnlSyncPetVisibility = syncPetVisibility;
}
