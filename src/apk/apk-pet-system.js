// Nightingale Companion Mascot: Spiderman (Action Superhero Study Companion)
// Custom Articulated Vector Spiderman with Expressive Mask, Moving Limbs, Organic Silk Web, and Action Stunts
// STRICT RULES:
// 1. Mascot is NEVER shown on the Login / Authentication screen.
// 2. User explicitly requested: NO texts or speech bubbles around the pet!
// 3. Web line MUST connect to Spiderman's HAND, never to his head.
// 4. Web line is an organic curved tensile silk filament with 8-spoke ceiling splatter, NOT a straight dashed line.

const STORAGE_PET_KEY = 'nnl_companion_pet_id';
const STORAGE_ENABLED_KEY = 'nnl_companion_pet_enabled';
const STORAGE_PET_NAME_KEY = 'nnl_companion_pet_name';

export function getPetName() {
  return 'Spiderman';
}

export function getCompanionSvg(expression = 'default') {
  return getSpidermanSvg(expression);
}

export const PET_CATALOG = [
  {
    id: 'spiderman',
    name: 'Spiderman',
    tagline: 'Superhero Study Companion',
    getSvg: (expr) => getSpidermanSvg(expr)
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
  return getSpidermanSvg(expression);
}

export function getSpidermanSvg(expr = 'default') {
  let extraFx = '';

  if (expr === 'spider-sense' || expr === 'alert') {
    extraFx = `
      <g class="spidey-sense-waves">
        <path d="M 32 14 Q 48 4 64 14" stroke="#FBBF24" stroke-width="2.6" stroke-linecap="round" fill="none" />
        <path d="M 26 8 Q 48 -4 70 8" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.95" />
        <path d="M 36 20 Q 48 12 60 20" stroke="#EF4444" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.85" />
      </g>
    `;
  } else if (expr === 'web-shoot' || expr === 'shooting') {
    extraFx = `
      <g class="spidey-web-flare">
        <circle cx="16" cy="54" r="5" fill="#FFFFFF" opacity="0.95" />
        <line x1="16" y1="54" x2="4" y2="44" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
        <line x1="16" y1="54" x2="8" y2="64" stroke="#E2E8F0" stroke-width="2" stroke-linecap="round" />
      </g>
    `;
  }

  // Articulated Spiderman Superhero Layers:
  // Head, Expressive Mask Eyes (blinking via CSS), Torso with Black Spider Insignia,
  // Movable Legs (running cycle/swing kicks), Movable Arms (overhead web grip & thwip wrist)
  return `
    <svg width="68" height="74" viewBox="0 0 96 104" fill="none" xmlns="http://www.w3.org/2000/svg" class="spidey-hero-svg">
      <defs>
        <radialGradient id="spideySuitRed" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#FF3B5C"/>
          <stop offset="60%" stop-color="#E11D48"/>
          <stop offset="100%" stop-color="#9F1239"/>
        </radialGradient>
        <radialGradient id="spideySuitBlue" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#38BDF8"/>
          <stop offset="60%" stop-color="#0284C7"/>
          <stop offset="100%" stop-color="#0F172A"/>
        </radialGradient>
        <filter id="spideyGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="rgba(0,0,0,0.55)"/>
        </filter>
      </defs>

      ${extraFx}

      <g class="spidey-body-root" filter="url(#spideyGlow)">
        <!-- 1. LEFT LEG (Back layer during run / kick cycle) -->
        <g class="spidey-leg-left">
          <!-- Blue Thigh -->
          <path d="M 38 64 L 32 78 L 42 80 L 44 65 Z" fill="url(#spideySuitBlue)"/>
          <!-- Red Boot with web lines -->
          <path d="M 31 77 L 26 92 L 36 94 L 42 79 Z" fill="url(#spideySuitRed)" stroke="#0F172A" stroke-width="0.8"/>
          <path d="M 26 92 L 20 95 L 34 96 L 36 93 Z" fill="#E11D48"/>
        </g>

        <!-- 2. RIGHT LEG (Front layer during run / kick cycle) -->
        <g class="spidey-leg-right">
          <!-- Blue Thigh -->
          <path d="M 52 64 L 56 78 L 46 80 L 44 65 Z" fill="url(#spideySuitBlue)"/>
          <!-- Red Boot with web lines -->
          <path d="M 55 77 L 58 92 L 48 94 L 46 79 Z" fill="url(#spideySuitRed)" stroke="#0F172A" stroke-width="0.8"/>
          <path d="M 58 92 L 64 95 L 50 96 L 48 93 Z" fill="#E11D48"/>
        </g>

        <!-- 3. TORSO (Red chest center, blue flanks, black spider insignia) -->
        <g class="spidey-torso">
          <!-- Blue Flanks -->
          <path d="M 34 46 L 30 64 L 48 68 L 48 46 Z" fill="url(#spideySuitBlue)"/>
          <path d="M 62 46 L 66 64 L 48 68 L 48 46 Z" fill="url(#spideySuitBlue)"/>
          <!-- Red Center Vest -->
          <path d="M 36 44 Q 48 42 60 44 L 56 66 Q 48 68 40 66 Z" fill="url(#spideySuitRed)" stroke="#0F172A" stroke-width="0.8"/>
          <!-- Black Webbing on Chest -->
          <path d="M 48 43 L 48 67 M 40 48 Q 48 52 56 48 M 41 56 Q 48 60 55 56 M 42 62 Q 48 64 54 62" stroke="#0F172A" stroke-width="0.8" fill="none" opacity="0.8"/>
          <!-- Iconic Black Spider Emblem -->
          <ellipse cx="48" cy="54" rx="2" ry="3.5" fill="#0F172A"/>
          <circle cx="48" cy="51" r="1.4" fill="#0F172A"/>
          <!-- 8 Spider Legs -->
          <path d="M 47 52 Q 42 48 40 50 M 47 54 Q 41 54 40 57 M 49 52 Q 54 48 56 50 M 49 54 Q 55 54 56 57" stroke="#0F172A" stroke-width="0.9" fill="none"/>
          <path d="M 47 55 Q 42 58 41 62 M 47 56 Q 43 62 43 65 M 49 55 Q 54 58 55 62 M 49 56 Q 53 62 53 65" stroke="#0F172A" stroke-width="0.9" fill="none"/>
        </g>

        <!-- 4. LEFT ARM (Forward Web-Shooter Wrist in "thwip" pose) -->
        <g class="spidey-arm-left">
          <path d="M 36 46 L 24 50 L 26 56 L 36 52 Z" fill="url(#spideySuitRed)"/>
          <path d="M 24 50 L 16 54 L 18 60 L 26 56 Z" fill="url(#spideySuitRed)" stroke="#0F172A" stroke-width="0.8"/>
          <!-- Silver Web-Shooter Nozzle Flare -->
          <circle cx="16" cy="54" r="2.2" fill="#E2E8F0" stroke="#0F172A" stroke-width="0.8"/>
        </g>

        <!-- 5. RIGHT ARM (Raised Overhead Holding the Web Line) -->
        <g class="spidey-arm-right">
          <path d="M 60 46 L 70 34 L 76 38 L 62 52 Z" fill="url(#spideySuitRed)"/>
          <path d="M 70 34 L 78 20 L 84 23 L 76 38 Z" fill="url(#spideySuitRed)" stroke="#0F172A" stroke-width="0.8"/>
          <!-- Clenched Fist Gripping Hand -->
          <circle cx="80" cy="18" r="4.2" fill="url(#spideySuitRed)" stroke="#0F172A" stroke-width="0.8"/>
        </g>

        <!-- 6. HEAD & MASK -->
        <g class="spidey-head">
          <ellipse cx="48" cy="30" rx="19" ry="21" fill="url(#spideySuitRed)" stroke="#0F172A" stroke-width="1.2"/>
          <path d="M 48 9 L 48 51 M 29 30 L 67 30 M 34 16 L 62 44 M 34 44 L 62 16" stroke="#0F172A" stroke-width="0.8" opacity="0.6"/>
          <ellipse cx="48" cy="30" rx="8" ry="9" stroke="#0F172A" stroke-width="0.7" fill="none" opacity="0.6"/>
          <ellipse cx="48" cy="30" rx="14" ry="15" stroke="#0F172A" stroke-width="0.7" fill="none" opacity="0.6"/>

          <!-- 7. EXPRESSIVE MASK EYES (Blinking via CSS spideyMaskBlink) -->
          <g class="spidey-eye left">
            <path d="M 33 26 C 35 22, 42 22, 45 28 C 45 35, 38 38, 33 34 C 31 32, 31 28, 33 26 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.4"/>
            <path d="M 35 25 C 38 23, 42 24, 44 28" stroke="#38BDF8" stroke-width="1.2" stroke-linecap="round" fill="none"/>
          </g>
          <g class="spidey-eye right">
            <path d="M 63 26 C 61 22, 54 22, 51 28 C 51 35, 58 38, 63 34 C 65 32, 65 28, 63 26 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.4"/>
            <path d="M 61 25 C 58 23, 54 24, 52 28" stroke="#38BDF8" stroke-width="1.2" stroke-linecap="round" fill="none"/>
          </g>
        </g>
      </g>
    </svg>
  `;
}

export function isPetEnabled() {
  try {
    const val = localStorage.getItem(STORAGE_ENABLED_KEY);
    if (val === null) return true;
    return val !== 'false';
  } catch {
    return true;
  }
}

export function isLoginScreenActive() {
  if (typeof document === 'undefined') return false;
  if (document.body.classList.contains('on-login-screen')) return true;
  const authScreen = document.getElementById('auth-screen');
  if (authScreen && !authScreen.classList.contains('hide')) {
    return true;
  }
  const isIndex = window.location.pathname.endsWith('/index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
  if (isIndex) {
    const token = localStorage.getItem('token') || localStorage.getItem('nnl_access_token') || localStorage.getItem('nnl_auth_token');
    if (!token) return true;
  }
  return false;
}

export function syncPetVisibility() {
  const root = document.getElementById('apk-companion-pet');
  if (!root) return;

  const authOverlay = document.getElementById('auth-screen');
  const onLogin = document.body.classList.contains('on-login-screen') || (authOverlay && !authOverlay.classList.contains('hide'));

  if (!isPetEnabled() || onLogin) {
    root.style.setProperty('display', 'none', 'important');
    root.classList.add('hide', 'hide-on-auth');
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
    avatar.innerHTML = getSpidermanSvg(expr);
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
      if (avatar) avatar.innerHTML = getSpidermanSvg('default');
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

  let root = document.getElementById('apk-companion-pet');
  if (!root) {
    root = document.createElement('div');
    root.id = 'apk-companion-pet';
    root.className = 'apk-companion-pet';
    root.innerHTML = `
      <div class="apk-pet-avatar">${getSpidermanSvg('default')}</div>
    `;
    document.body.appendChild(root);
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

      // Hand attachment coordinates (Raised right hand in standard pose, or left shooter)
      const handX = isFacingLeft ? pos.x + 14 : pos.x + 54;
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
          const liveHandX = isFacingLeft ? rect.left + 14 : rect.left + 54;
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
