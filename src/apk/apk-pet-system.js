// Nightingale Companion Mascot: Spiderman (Action Superhero Study Companion)
// 100% Code-Generated Clean 2D Vector Spiderman with Web-Shooting, Swinging Stunts & Superhero Landing
// STRICT RULE: Mascot is NEVER shown on the Login / Authentication screen.

const STORAGE_PET_KEY = 'nnl_companion_pet_id';
const STORAGE_ENABLED_KEY = 'nnl_companion_pet_enabled';
const STORAGE_PET_NAME_KEY = 'nnl_companion_pet_name';

export function getPetName() {
  try {
    return localStorage.getItem(STORAGE_PET_NAME_KEY) || 'Spidey';
  } catch {
    return 'Spidey';
  }
}

export function setPetName(name) {
  try {
    if (name && typeof name === 'string') {
      localStorage.setItem(STORAGE_PET_NAME_KEY, name.trim());
    }
  } catch {}
}

export function getPetSvg(petId, expression = 'default') {
  return getSpidermanSvg(expression);
}

export function getNurseSvg(expression = 'default') {
  return getSpidermanSvg(expression);
}

export function getCompanionSvg(expression = 'default') {
  return getSpidermanSvg(expression);
}

export function getShinchanSvg(expression = 'default') {
  return getSpidermanSvg(expression);
}

export function getLumiSvg(expression = 'default') {
  return getSpidermanSvg(expression);
}

export function getSpidermanSvg(expr = 'default') {
  let eyesAndFX = '';

  switch (expr) {
    case 'spider-sense':
    case 'alert':
      eyesAndFX = `
        <!-- Radiating Golden Spider-Sense Tingle Waves -->
        <path d="M 22 10 Q 31 1 40 5 Q 49 1 58 10" stroke="#FBBF24" stroke-width="2.6" stroke-linecap="round" fill="none" />
        <path d="M 16 5 Q 29 -4 40 0 Q 51 -4 64 5" stroke="#F59E0B" stroke-width="2.1" stroke-linecap="round" fill="none" opacity="0.9" />
        <path d="M 26 15 Q 33 8 40 11 Q 47 8 54 15" stroke="#EF4444" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.75" />
        <!-- Alert Wide Glowing Lenses -->
        <path d="M 20 31 Q 31 23 38 34 Q 33 49 23 46 Z" fill="#FEF08A" stroke="#0F172A" stroke-width="2.8" stroke-linejoin="round" />
        <path d="M 60 31 Q 49 23 42 34 Q 47 49 57 46 Z" fill="#FEF08A" stroke="#0F172A" stroke-width="2.8" stroke-linejoin="round" />
      `;
      break;

    case 'web-shoot':
      eyesAndFX = `
        <!-- Focused Aiming Lenses -->
        <path d="M 24 35 Q 32 32 37 36 Q 34 44 26 42 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.6" stroke-linejoin="round" />
        <path d="M 57 32 Q 48 27 42 35 Q 46 47 55 44 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.6" stroke-linejoin="round" />
        <!-- Web Shooter Hand Pose (🤟) -->
        <g class="spidey-shooter-hand">
          <ellipse cx="66" cy="56" rx="5" ry="4" fill="#DC2626" stroke="#0F172A" stroke-width="1.8" />
          <path d="M 67 52 L 72 47" stroke="#DC2626" stroke-width="2.4" stroke-linecap="round" />
          <path d="M 69 54 L 74 50" stroke="#DC2626" stroke-width="2.4" stroke-linecap="round" />
          <!-- Web Blast Flare -->
          <circle cx="75" cy="48" r="4.5" fill="#E2E8F0" opacity="0.95" />
          <line x1="72" y1="48" x2="84" y2="38" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" />
          <line x1="74" y1="46" x2="82" y2="32" stroke="#E2E8F0" stroke-width="1.8" stroke-linecap="round" />
        </g>
      `;
      break;

    case 'stunt':
    case 'swing':
      eyesAndFX = `
        <!-- High-Velocity Wind Streaks -->
        <line x1="8" y1="28" x2="16" y2="30" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" opacity="0.65" />
        <line x1="6" y1="42" x2="14" y2="44" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.8" />
        <line x1="9" y1="56" x2="17" y2="58" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" opacity="0.6" />
        <!-- Acrobatic Action Squint Lenses -->
        <path d="M 22 34 Q 31 30 38 35 Q 34 46 25 43 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.8" stroke-linejoin="round" />
        <path d="M 58 34 Q 49 30 42 35 Q 46 46 55 43 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.8" stroke-linejoin="round" />
      `;
      break;

    case 'crouch':
      eyesAndFX = `
        <!-- Superhero 3-Point Landing Eyes -->
        <path d="M 23 35 Q 32 30 37 36 Q 33 45 25 43 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.8" stroke-linejoin="round" />
        <path d="M 57 35 Q 48 30 43 36 Q 47 45 55 43 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.8" stroke-linejoin="round" />
        <!-- Landing Impact Shock Ring -->
        <ellipse cx="40" cy="74" rx="26" ry="4.5" fill="none" stroke="#60A5FA" stroke-width="1.8" stroke-dasharray="4 2" opacity="0.8" />
      `;
      break;

    case 'happy':
    case 'wink':
      eyesAndFX = `
        <!-- Playful Hero Wink -->
        <path d="M 22 34 Q 31 28 37 35 Q 33 46 24 43 Z" fill="url(#spideyLens)" stroke="#0F172A" stroke-width="2.8" stroke-linejoin="round" />
        <!-- Left Squint Wink -->
        <path d="M 58 36 L 50 38 L 58 40" stroke="#0F172A" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      `;
      break;

    default:
      eyesAndFX = `
        <!-- Iconic Spiderman Triangular White Lenses with Bold Black Borders -->
        <path d="M 22 34 Q 31 28 37 35 Q 33 46 24 43 Z" fill="url(#spideyLens)" stroke="#0F172A" stroke-width="2.8" stroke-linejoin="round" />
        <path d="M 58 34 Q 49 28 43 35 Q 47 46 56 43 Z" fill="url(#spideyLens)" stroke="#0F172A" stroke-width="2.8" stroke-linejoin="round" />
      `;
      break;
  }

  return `
    <svg viewBox="0 0 80 84" width="100%" height="100%" style="overflow:visible;" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="spideyRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#EF4444" />
          <stop offset="50%" stop-color="#DC2626" />
          <stop offset="100%" stop-color="#991B1B" />
        </linearGradient>
        <linearGradient id="spideyBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3B82F6" />
          <stop offset="100%" stop-color="#1E40AF" />
        </linearGradient>
        <linearGradient id="spideyLens" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="100%" stop-color="#E2E8F0" />
        </linearGradient>
      </defs>

      <!-- Soft Ground Shadow -->
      <ellipse cx="40" cy="76" rx="20" ry="4" fill="rgba(0,0,0,0.25)" class="spidey-shadow" />

      <!-- Spiderman Body / Shoulders -->
      <g class="spidey-torso">
        <path d="M 20 60 Q 40 55 60 60 L 66 76 Q 40 80 14 76 Z" fill="url(#spideyRed)" stroke="#0F172A" stroke-width="2" />
        <!-- Blue Suit Flanks -->
        <path d="M 14 70 L 22 63 L 20 77 Z" fill="url(#spideyBlue)" />
        <path d="M 66 70 L 58 63 L 60 77 Z" fill="url(#spideyBlue)" />
        <!-- Black Chest Spider Emblem -->
        <path d="M 40 61 L 38.5 65 L 40 67 L 41.5 65 Z" fill="#0F172A" />
        <path d="M 38.5 63 Q 34 60 32 63 M 41.5 63 Q 46 60 48 63 M 38.5 65 Q 33 66 31 69 M 41.5 65 Q 47 66 49 69" stroke="#0F172A" stroke-width="1.3" stroke-linecap="round" fill="none" />
      </g>

      <!-- Spiderman Mask (Head) -->
      <g class="spidey-head">
        <ellipse cx="40" cy="38" rx="25" ry="27" fill="url(#spideyRed)" stroke="#0F172A" stroke-width="2.4" />
        
        <!-- Black Webbing Grid Across Mask -->
        <!-- Vertical Spine -->
        <line x1="40" y1="11" x2="40" y2="65" stroke="#7F1D1D" stroke-width="1.4" opacity="0.85" />
        <!-- Horizontal Mid-line -->
        <line x1="15" y1="38" x2="65" y2="38" stroke="#7F1D1D" stroke-width="1.4" opacity="0.85" />
        <!-- Diagonal Web Rays -->
        <line x1="22" y1="20" x2="58" y2="56" stroke="#7F1D1D" stroke-width="1.3" opacity="0.85" />
        <line x1="58" y1="20" x2="22" y2="56" stroke="#7F1D1D" stroke-width="1.3" opacity="0.85" />
        <!-- Concentric Curved Web Loops -->
        <path d="M 28 26 Q 40 21 52 26" stroke="#7F1D1D" stroke-width="1.3" fill="none" opacity="0.85" />
        <path d="M 21 38 Q 40 31 59 38" stroke="#7F1D1D" stroke-width="1.3" fill="none" opacity="0.85" />
        <path d="M 27 49 Q 40 43 53 49" stroke="#7F1D1D" stroke-width="1.3" fill="none" opacity="0.85" />
        <path d="M 32 58 Q 40 53 48 58" stroke="#7F1D1D" stroke-width="1.3" fill="none" opacity="0.85" />
      </g>

      <!-- Eyes & Action FX -->
      <g class="spidey-eyes-fx">
        ${eyesAndFX}
      </g>
    </svg>
  `;
}

export const PET_CATALOG = [
  {
    id: 'spidey-hero',
    name: 'Spiderman (Study Hero)',
    emoji: '🕷️',
    svg: getSpidermanSvg('default')
  }
];

export function getAvailablePets() {
  return PET_CATALOG;
}

export function getActivePetId() {
  return 'spidey-hero';
}

export function setActivePetId() {
  // Single Spiderman Mascot
}

export function isPetEnabled() {
  try {
    const val = localStorage.getItem(STORAGE_ENABLED_KEY);
    if (val === 'false') return false;
    return true; // Default ON
  } catch {}
  return true;
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
    root.style.display = 'none';
  } else {
    root.style.display = 'flex';
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
    root.classList.remove('is-nod', 'is-cheer', 'is-hop', 'is-squish', 'is-wink', 'is-spin', 'is-swinging');
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

export function showTamagotchiBubble(text, duration = 2000) {
  const root = document.getElementById('apk-companion-pet');
  if (!root || !isPetEnabled() || isLoginScreenActive()) return;

  let bubble = document.getElementById('apk-pet-tamagotchi-bubble');
  if (!bubble) {
    bubble = document.createElement('div');
    bubble.id = 'apk-pet-tamagotchi-bubble';
    bubble.className = 'apk-pet-tamagotchi-bubble';
    root.appendChild(bubble);
  }

  bubble.textContent = text;
  bubble.classList.remove('hide');
  bubble.classList.add('is-visible');

  clearTimeout(window.__tamagotchiBubbleTimer);
  window.__tamagotchiBubbleTimer = setTimeout(() => {
    if (bubble) {
      bubble.classList.remove('is-visible');
      bubble.classList.add('hide');
    }
  }, duration);
}

// Global action trigger for Spiderman stunt on user response or page milestones
export function triggerSpideyStunt() {
  if (typeof window !== 'undefined' && typeof window.__nnlSpideyStunt === 'function') {
    window.__nnlSpideyStunt();
  }
}

export function initPetSystem() {
  if (typeof document === 'undefined') return;

  // Cleanup any old instance
  const existing = document.getElementById('apk-companion-pet');
  if (existing) existing.remove();

  if (isLoginScreenActive()) {
    syncPetVisibility();
    return;
  }

  const root = document.createElement('div');
  root.id = 'apk-companion-pet';
  root.className = 'apk-companion-pet';
  root.setAttribute('role', 'button');
  root.setAttribute('tabindex', '0');
  root.setAttribute('aria-label', `Spiderman Study Companion`);
  root.style.display = (isPetEnabled() && !isLoginScreenActive()) ? 'flex' : 'none';

  root.innerHTML = `
    <div class="apk-pet-bursts" aria-hidden="true"></div>
    <div class="apk-pet-avatar">
      ${getSpidermanSvg('default')}
    </div>
  `;

  document.body.appendChild(root);

  const setPosition = (x, y) => {
    root.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const getBottomRightDefault = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // Keep safely inside screen bounds so tablet edge panels never slice Spiderman in half!
    const x = Math.max(24, Math.min(vw - 88, Math.round(vw * 0.88)));
    const y = Math.round(vh * 0.58);
    return { x, y };
  };

  let pos = getBottomRightDefault();
  setPosition(pos.x, pos.y);

  const burstsEl = root.querySelector('.apk-pet-bursts');

  let isDragging = false;
  let startX = 0, startY = 0;
  let originX = 0, originY = 0;
  let moved = false;
  let isStuntActive = false;

  // Web-Shooting & Pendulum Swing Action Stunt Engine
  function performWebSwingStunt() {
    if (isDragging || isStuntActive || !isPetEnabled() || isLoginScreenActive()) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Pick target landing spot with safe boundaries so Spiderman NEVER gets cut off
    const minX = 24;
    const maxX = Math.max(minX, vw - 96);
    const atRight = pos.x > vw * 0.5;

    // Swing to opposite side of screen
    let targetX;
    if (atRight) {
      targetX = Math.round(minX + Math.random() * (vw * 0.35));
    } else {
      targetX = Math.round(Math.max(minX, maxX - Math.random() * (vw * 0.35)));
    }
    targetX = Math.max(minX, Math.min(maxX, targetX));

    const minY = Math.round(vh * 0.25);
    const maxY = Math.round(vh * 0.70);
    const targetY = Math.max(minY, Math.min(maxY, pos.y + (Math.random() - 0.5) * 120));

    isStuntActive = true;

    // Phase 1: Spider-Sense tingling warning (0.3s)
    setPetExpression('spider-sense');
    if (burstsEl) {
      const symbols = ['⚡', '🕸️', '🕷️', '💥'];
      for (let i = 0; i < 4; i++) {
        const p = document.createElement('span');
        p.className = 'apk-pet-burst-item';
        p.textContent = symbols[i % symbols.length];
        p.style.setProperty('--bx', `${(Math.random() - 0.5) * 50}px`);
        p.style.setProperty('--by', `${-20 - Math.random() * 30}px`);
        burstsEl.appendChild(p);
        setTimeout(() => p.remove(), 700);
      }
    }

    setTimeout(() => {
      // Phase 2: Web Shooter Aim & Fire to top ceiling anchor (0.2s)
      setPetExpression('web-shoot');
      const movingLeft = targetX < pos.x;
      if (movingLeft) root.classList.add('facing-left');
      else root.classList.remove('facing-left');

      const anchorX = Math.round((pos.x + targetX) / 2);
      const anchorY = 0;

      // Draw SVG web line across screen
      let webLine = document.getElementById('spidey-web-line');
      if (!webLine) {
        webLine = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        webLine.id = 'spidey-web-line';
        webLine.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:999998;';
        document.body.appendChild(webLine);
      }
      webLine.innerHTML = `
        <line x1="${pos.x + 28}" y1="${pos.y + 16}" x2="${anchorX}" y2="${anchorY}" stroke="#FFFFFF" stroke-width="2.6" stroke-dasharray="6 3" opacity="0.95" />
        <circle cx="${anchorX}" cy="${anchorY}" r="5" fill="#E2E8F0" />
      `;

      // Phase 3: Pendulum Swing to Target (0.85s)
      setTimeout(() => {
        setPetExpression('stunt');
        root.classList.add('is-swinging');
        root.style.transition = 'transform 0.85s cubic-bezier(0.25, 1, 0.5, 1)';
        pos.x = targetX;
        pos.y = targetY;
        setPosition(targetX, targetY);

        if (webLine) {
          webLine.innerHTML = `
            <line x1="${targetX + 28}" y1="${targetY + 16}" x2="${anchorX}" y2="${anchorY}" stroke="#FFFFFF" stroke-width="2.6" stroke-dasharray="6 3" opacity="0.95" />
          `;
        }

        // Phase 4: Superhero Landing (0.85s after swing)
        setTimeout(() => {
          if (webLine) webLine.remove();
          root.classList.remove('is-swinging');
          root.style.transition = '';
          setPetExpression('crouch');

          const heroQuotes = [
            'Thwip! Ready to swing through today\'s classes, Doc!',
            'Spider-Sense tingling! Let\'s conquer this test!',
            'With great power comes great preparation!',
            'Target locked! What are we studying next?',
            'Friendly neighborhood study buddy at your service!'
          ];
          const quote = heroQuotes[Math.floor(Math.random() * heroQuotes.length)];
          showTamagotchiBubble(quote, 2400);

          setTimeout(() => {
            isStuntActive = false;
            setPetExpression('default');
          }, 1800);
        }, 850);
      }, 250);
    }, 350);
  }

  window.__nnlSpideyStunt = performWebSwingStunt;

  // Gentle, calm 60-second idle check (Never rapid 8s unsolicited jumps!)
  setInterval(() => {
    if (Math.random() < 0.35 && !isStuntActive) {
      performWebSwingStunt();
    }
  }, 60000);

  // Pointer drag handling
  const onPointerDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isStuntActive) return;
    isDragging = true;
    moved = false;
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
    e.preventDefault();
    const cx = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const cy = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const dx = cx - startX;
    const dy = cy - startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      moved = true;
      root.classList.add('is-running');
      if (dx < -2) root.classList.add('facing-left');
      else if (dx > 2) root.classList.remove('facing-left');
    }
    const newX = Math.max(16, Math.min(window.innerWidth - 88, originX + dx));
    const newY = Math.max(16, Math.min(window.innerHeight - 88, originY + dy));
    pos.x = newX;
    pos.y = newY;
    setPosition(newX, newY);
  };

  const onPointerUp = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isDragging) return;
    isDragging = false;
    root.classList.remove('is-dragging', 'is-running');
    try { root.releasePointerCapture(e.pointerId); } catch (_) {}
    if (!moved) {
      // Tap triggers the web-shooting swing action stunt!
      performWebSwingStunt();
    } else {
      root.classList.add('is-squish');
      setTimeout(() => root.classList.remove('is-squish'), 450);
      showTamagotchiBubble('Webbed down! 🕸️', 1200);
    }
  };

  root.addEventListener('pointerdown', onPointerDown);
  root.addEventListener('pointermove', onPointerMove);
  root.addEventListener('pointerup', onPointerUp);
  root.addEventListener('pointercancel', onPointerUp);
  root.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isStuntActive && !moved) performWebSwingStunt();
  });

  // Global Website Interaction Listener
  document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('#apk-companion-pet')) return;
    if (isLoginScreenActive() || !isPetEnabled()) return;

    if (e.target.closest('.nav-tab, .header-nav-tabs, #tab-live, #tab-videos, #tab-notes, #tab-tests, #tab-saved')) {
      setPetExpression('spider-sense');
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (isDragging || isStuntActive) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    pos.x = Math.max(24, Math.min(vw - 88, pos.x));
    pos.y = Math.max(24, Math.min(vh - 88, pos.y));
    setPosition(pos.x, pos.y);
  }, { passive: true });
}
