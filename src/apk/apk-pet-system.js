// Nightingale Companion Mascot: Lumi (Cyber Tamagotchi Study Companion)
// 100% Code-Generated Vector Companion with Delightful Expressions & Micro-Interactions
// STRICT RULE: Mascot is NEVER shown on the Login / Authentication screen.

const STORAGE_PET_KEY = 'nnl_companion_pet_id';
const STORAGE_ENABLED_KEY = 'nnl_companion_pet_enabled';

export function getPetSvg(petId, expression = 'default') {
  return getLumiSvg(expression);
}

export function getNurseSvg(expression = 'default') {
  return getLumiSvg(expression);
}

export function getShinchanSvg(expression = 'default') {
  return getLumiSvg(expression);
}

export function getLumiSvg(expr = 'default') {
  let faceContent = '';

  switch (expr) {
    case 'happy':
      faceContent = `
        <!-- Joy Smiling Curved Eyes (⌒ ⌒) -->
        <path d="M 23 35 Q 29 27 35 35" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" fill="none" />
        <path d="M 45 35 Q 51 27 57 35" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" fill="none" />
        <!-- Big Happy Open Smile with Pink Tongue -->
        <path d="M 35 42 Q 40 50 45 42 Z" fill="#F43F5E" stroke="#881337" stroke-width="1.2" />
        <ellipse cx="40" cy="46" rx="3" ry="1.6" fill="#FDA4AF" />
        <!-- Rosy Cheeks -->
        <ellipse cx="18" cy="39" rx="4" ry="2.2" fill="#FB7185" opacity="0.85" />
        <ellipse cx="62" cy="39" rx="4" ry="2.2" fill="#FB7185" opacity="0.85" />
        <!-- Floating Micro Joy Sparkles -->
        <circle cx="28" cy="24" r="1.5" fill="#FDE047" />
        <circle cx="52" cy="24" r="1.5" fill="#FDE047" />
      `;
      break;

    case 'focus':
      faceContent = `
        <!-- Smart Study Glasses (Cyber Purple/Gold wireframe) -->
        <rect x="18" y="27" width="18" height="15" rx="5" fill="rgba(147, 197, 253, 0.25)" stroke="#A78BFA" stroke-width="2" />
        <rect x="44" y="27" width="18" height="15" rx="5" fill="rgba(147, 197, 253, 0.25)" stroke="#A78BFA" stroke-width="2" />
        <line x1="36" y1="34" x2="44" y2="34" stroke="#A78BFA" stroke-width="2" stroke-linecap="round" />
        <!-- Determined Sparkling Eyes inside lenses -->
        <circle cx="27" cy="34" r="3.2" fill="#FFFFFF" />
        <circle cx="28" cy="33" r="1.4" fill="#38BDF8" />
        <circle cx="53" cy="34" r="3.2" fill="#FFFFFF" />
        <circle cx="54" cy="33" r="1.4" fill="#38BDF8" />
        <!-- Focus Smart Smirk -->
        <path d="M 36 45 Q 40 48 44 45" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" fill="none" />
        <!-- Subtle Rosy Cheek Glow -->
        <ellipse cx="17" cy="41" rx="3.5" ry="1.8" fill="#FB7185" opacity="0.6" />
        <ellipse cx="63" cy="41" rx="3.5" ry="1.8" fill="#FB7185" opacity="0.6" />
      `;
      break;

    case 'wink':
      faceContent = `
        <!-- Playful Left Wink (> shape) -->
        <path d="M 23 32 L 31 35 L 23 38" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        <!-- Right Sparkling Eye with Star Glimmer -->
        <ellipse cx="51" cy="35" rx="5.5" ry="6" fill="#FFFFFF" />
        <ellipse cx="51" cy="35.5" rx="3.6" ry="4" fill="#1E1B4B" />
        <circle cx="49" cy="33.5" r="1.6" fill="#FFFFFF" />
        <polygon points="53,32 54,34 56,34 54.5,35.5 55,37.5 53,36.2 51,37.5 51.5,35.5 50,34 52,34" fill="#FACC15" />
        <!-- Playful Kitty Mouth -->
        <path d="M 35 44 Q 38 42 40 44 Q 42 42 45 44" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" fill="none" />
        <!-- Blushing Cheeks -->
        <ellipse cx="18" cy="40" rx="4" ry="2.2" fill="#FB7185" opacity="0.8" />
        <ellipse cx="62" cy="40" rx="4" ry="2.2" fill="#FB7185" opacity="0.8" />
      `;
      break;

    case 'love':
      faceContent = `
        <!-- Big Heart Eyes (♥ ♥) -->
        <path d="M 27 28 C 24 25, 20 28, 20 32 C 20 37, 27 41, 27 41 C 27 41, 34 37, 34 32 C 34 28, 30 25, 27 28 Z" fill="#F43F5E" />
        <path d="M 53 28 C 50 25, 46 28, 46 32 C 46 37, 53 41, 53 41 C 53 41, 60 37, 60 32 C 60 28, 56 25, 53 28 Z" fill="#F43F5E" />
        <!-- Cute Little 'o' Mouth -->
        <ellipse cx="40" cy="45" rx="2.5" ry="3.2" fill="#FFFFFF" />
        <!-- Radiant Blushing Cheeks -->
        <ellipse cx="16" cy="39" rx="4.5" ry="2.5" fill="#FB7185" opacity="0.9" />
        <ellipse cx="64" cy="39" rx="4.5" ry="2.5" fill="#FB7185" opacity="0.9" />
      `;
      break;

    case 'sleepy':
      faceContent = `
        <!-- Peaceful Sleeping Eyes (– –) -->
        <line x1="22" y1="35" x2="33" y2="35" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" />
        <line x1="47" y1="35" x2="58" y2="35" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" />
        <!-- Tiny Snooze Mouth with Snot/Sleep Bubble -->
        <ellipse cx="40" cy="43" rx="2.2" ry="1.6" fill="#FFFFFF" />
        <circle cx="45" cy="38" r="4.5" fill="rgba(147, 197, 253, 0.45)" stroke="#93C5FD" stroke-width="1.2" />
        <circle cx="43.5" cy="36.5" r="1.2" fill="#FFFFFF" />
        <!-- Floating zzz -->
        <text x="58" y="24" fill="#C4B5FD" font-size="8" font-family="sans-serif" font-weight="800">z</text>
        <text x="64" y="18" fill="#A78BFA" font-size="10" font-family="sans-serif" font-weight="800">Z</text>
      `;
      break;

    case 'shocked':
      faceContent = `
        <!-- Wide Cute Shocked Eyes -->
        <ellipse cx="27" cy="34" rx="6" ry="6.5" fill="#FFFFFF" />
        <circle cx="27" cy="34" r="2.4" fill="#1E1B4B" />
        <ellipse cx="53" cy="34" rx="6" ry="6.5" fill="#FFFFFF" />
        <circle cx="53" cy="34" r="2.4" fill="#1E1B4B" />
        <!-- O-shaped Mouth -->
        <ellipse cx="40" cy="45" rx="3.5" ry="4.5" fill="#F43F5E" />
        <ellipse cx="40" cy="46" rx="2" ry="2" fill="#FDA4AF" />
        <!-- Anime Blue Sweatdrop -->
        <path d="M 14 26 C 14 22, 17 20, 17 20 C 17 20, 20 22, 20 26 C 20 28, 18.5 29.5, 17 29.5 C 15.5 29.5, 14 28, 14 26 Z" fill="#38BDF8" stroke="#0284C7" stroke-width="0.8" />
      `;
      break;

    default:
      faceContent = `
        <!-- Big Kawaii Sparkling Eyes -->
        <ellipse cx="27" cy="34" rx="6" ry="6.8" fill="#FFFFFF" />
        <ellipse cx="27" cy="34.5" rx="4.2" ry="4.8" fill="#1E1B4B" />
        <circle cx="25" cy="32" r="2" fill="#FFFFFF" />
        <circle cx="29" cy="36" r="1" fill="#38BDF8" />
        <ellipse cx="53" cy="34" rx="6" ry="6.8" fill="#FFFFFF" />
        <ellipse cx="53" cy="34.5" rx="4.2" ry="4.8" fill="#1E1B4B" />
        <circle cx="51" cy="32" r="2" fill="#FFFFFF" />
        <circle cx="55" cy="36" r="1" fill="#38BDF8" />
        <!-- Cute Curved Smile -->
        <path d="M 36 43 Q 40 47 44 43" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" fill="none" />
        <!-- Soft Anime Rosy Cheeks -->
        <ellipse cx="17" cy="39" rx="4" ry="2.2" fill="#FB7185" opacity="0.8" />
        <ellipse cx="63" cy="39" rx="4" ry="2.2" fill="#FB7185" opacity="0.8" />
      `;
      break;
  }

  return `
    <svg viewBox="0 0 80 88" width="100%" height="100%" style="overflow:visible;" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="lumi-body-grad" cx="40%" cy="32%" r="68%">
          <stop offset="0%" stop-color="#A78BFA" />
          <stop offset="45%" stop-color="#7C3AED" />
          <stop offset="100%" stop-color="#4C1D95" />
        </radialGradient>
        <linearGradient id="lumi-visor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#1E1B4B" />
          <stop offset="100%" stop-color="#0F172A" />
        </linearGradient>
        <linearGradient id="lumi-ear-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#C4B5FD" />
          <stop offset="100%" stop-color="#8B5CF6" />
        </linearGradient>
        <filter id="lumi-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3.5" flood-color="rgba(124, 58, 237, 0.45)" />
        </filter>
        <filter id="star-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- Soft Ambient Ground Shadow -->
      <ellipse cx="40" cy="82" rx="20" ry="4" fill="rgba(0,0,0,0.22)" class="lumi-ground-shadow" />

      <!-- Cute Cyber Cat / Bunny Ears -->
      <g class="lumi-ears">
        <!-- Left Ear -->
        <path d="M 20 22 C 16 10, 22 4, 27 12 C 28 14, 28 18, 26 24 Z" fill="url(#lumi-ear-grad)" stroke="#4C1D95" stroke-width="1.4" />
        <path d="M 22 17 C 20 11, 23 8, 25 13 C 25.5 14, 25.5 16, 24.5 19 Z" fill="#F472B6" opacity="0.85" />
        <!-- Right Ear -->
        <path d="M 60 22 C 64 10, 58 4, 53 12 C 52 14, 52 18, 54 24 Z" fill="url(#lumi-ear-grad)" stroke="#4C1D95" stroke-width="1.4" />
        <path d="M 58 17 C 60 11, 57 8, 55 13 C 54.5 14, 54.5 16, 55.5 19 Z" fill="#F472B6" opacity="0.85" />
      </g>

      <!-- Star Antenna in center top -->
      <g class="lumi-antenna" filter="url(#star-glow)">
        <line x1="40" y1="16" x2="40" y2="7" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" />
        <polygon points="40,2 41.5,5.5 45,5.8 42.4,8.2 43.2,11.8 40,10 36.8,11.8 37.6,8.2 35,5.8 38.5,5.5" fill="#FDE047" stroke="#F59E0B" stroke-width="0.8" />
      </g>

      <!-- Main Capsule Egg Body -->
      <g class="lumi-main-body" filter="url(#lumi-glow)">
        <rect x="12" y="16" width="56" height="58" rx="28" fill="url(#lumi-body-grad)" stroke="rgba(255,255,255,0.45)" stroke-width="1.8" />
        <!-- Top Light Sheen -->
        <ellipse cx="40" cy="22" rx="18" ry="4.5" fill="#FFFFFF" opacity="0.25" />
      </g>

      <!-- Face Screen / Visor -->
      <g class="lumi-screen">
        <rect x="17" y="24" width="46" height="30" rx="15" fill="url(#lumi-visor-grad)" stroke="rgba(167, 139, 250, 0.4)" stroke-width="1.4" />
        <!-- Visor Glass Glint -->
        <path d="M 20 28 Q 40 25 58 29" stroke="rgba(255,255,255,0.22)" stroke-width="1.2" fill="none" stroke-linecap="round" />
        <!-- Interactive Facial Features -->
        ${faceContent}
      </g>

      <!-- Cute Belly Core Hologram (Study Pulse Core) -->
      <g class="lumi-belly">
        <circle cx="40" cy="62" r="5" fill="#1E1B4B" stroke="#A78BFA" stroke-width="1.2" />
        <circle cx="40" cy="62" r="2.8" fill="#38BDF8" filter="url(#star-glow)" />
        <circle cx="40" cy="62" r="1.2" fill="#FFFFFF" />
      </g>

      <!-- Cute Tiny Paws -->
      <g class="lumi-paws">
        <!-- Left Paw -->
        <ellipse cx="14" cy="54" rx="4.5" ry="3.5" fill="#C4B5FD" stroke="#4C1D95" stroke-width="1.2" />
        <!-- Right Paw -->
        <ellipse cx="66" cy="54" rx="4.5" ry="3.5" fill="#C4B5FD" stroke="#4C1D95" stroke-width="1.2" />
        <!-- Left Foot -->
        <ellipse cx="28" cy="74" rx="6.5" ry="3.8" fill="#8B5CF6" stroke="#4C1D95" stroke-width="1.2" />
        <!-- Right Foot -->
        <ellipse cx="52" cy="74" rx="6.5" ry="3.8" fill="#8B5CF6" stroke="#4C1D95" stroke-width="1.2" />
      </g>
    </svg>
  `;
}

export const PET_CATALOG = [
  {
    id: 'lumi-buddy',
    name: 'Lumi (Study Companion)',
    emoji: '✨',
    svg: getLumiSvg('default')
  }
];

export function getAvailablePets() {
  return PET_CATALOG;
}

export function getActivePetId() {
  return 'lumi-buddy';
}

export function setActivePetId() {
  // Single Lumi Mascot
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

let isSyncingPet = false;

export function syncPetVisibility() {
  if (isSyncingPet) return;
  isSyncingPet = true;
  try {
    const el = document.getElementById('apk-companion-pet');
    const onLogin = isLoginScreenActive();
    const enabled = isPetEnabled();

    if (onLogin) {
      if (el) {
        el.style.display = 'none';
        el.classList.add('hide', 'hide-on-auth');
      }
      if (!document.body.classList.contains('on-login-screen')) {
        document.body.classList.add('on-login-screen');
      }
      return;
    }

    if (document.body.classList.contains('on-login-screen')) {
      document.body.classList.remove('on-login-screen');
    }
    const shouldDisable = !enabled;
    if (document.body.classList.contains('apk-pet-disabled') !== shouldDisable) {
      document.body.classList.toggle('apk-pet-disabled', shouldDisable);
    }

    if (enabled) {
      if (!el) {
        renderPetElement();
      } else {
        el.style.display = 'flex';
        el.classList.remove('hide', 'hide-on-auth');
      }
    } else {
      if (el) {
        el.style.display = 'none';
        el.classList.add('hide');
      }
    }
  } finally {
    isSyncingPet = false;
  }
}
window.__nnlSyncPetVisibility = syncPetVisibility;

export function setPetEnabled(enabled) {
  try {
    localStorage.setItem(STORAGE_ENABLED_KEY, enabled ? 'true' : 'false');
  } catch {}
  syncPetVisibility();
}

let expressionResetTimeout = null;

export function setPetExpression(expr, bodyAnim = null) {
  const container = document.getElementById('apk-companion-pet');
  if (!container) return;
  const avatar = container.querySelector('.apk-pet-avatar');
  if (avatar) {
    avatar.innerHTML = getLumiSvg(expr);
  }

  if (bodyAnim) {
    container.classList.remove('is-hop', 'is-wiggle', 'is-cheer', 'is-spin', 'is-squish', 'is-nod', 'is-shock', 'is-wink', 'is-walking', 'is-running');
    void container.offsetWidth;
    container.classList.add(bodyAnim);
  }

  clearTimeout(expressionResetTimeout);
  if (expr !== 'default') {
    expressionResetTimeout = setTimeout(() => {
      const curAvatar = container.querySelector('.apk-pet-avatar');
      if (curAvatar) {
        curAvatar.innerHTML = getLumiSvg('default');
      }
      container.classList.remove('is-hop', 'is-wiggle', 'is-cheer', 'is-spin', 'is-squish', 'is-nod', 'is-shock', 'is-wink', 'is-walking', 'is-running');
    }, 2800);
  }
}

// Ultra-short emote pill: max 1-2 words or emoji, never long text
export function showTamagotchiBubble(text, duration = 1400) {
  const container = document.getElementById('apk-companion-pet');
  if (!container || !isPetEnabled() || isLoginScreenActive()) return;

  let bubble = container.querySelector('.apk-pet-speech-bubble');
  if (!bubble) {
    bubble = document.createElement('div');
    bubble.className = 'apk-pet-speech-bubble';
    container.appendChild(bubble);
  }

  bubble.innerHTML = text;
  bubble.classList.remove('hide');
  bubble.classList.add('visible');

  clearTimeout(bubble.__hideTimer);
  bubble.__hideTimer = setTimeout(() => {
    bubble.classList.remove('visible');
    bubble.classList.add('hide');
  }, duration);
}

function checkUpcomingClassReminder() {
  try {
    const keys = ['nnl_cache_live_classes_upcoming', 'nnl_cache_live_classes', 'nnl_today_classes'];
    let classes = [];
    for (const k of keys) {
      const raw = localStorage.getItem(k);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const list = parsed?.data || parsed?.results || (Array.isArray(parsed) ? parsed : []);
          if (Array.isArray(list) && list.length > 0) {
            classes.push(...list);
          }
        } catch (_) {}
      }
    }
    const now = Date.now();

    for (const cls of classes) {
      const startTime = cls.start_time ? new Date(cls.start_time).getTime() : (cls.starts_at ? new Date(cls.starts_at).getTime() : (cls.time ? new Date(cls.time).getTime() : null));
      if (startTime && !isNaN(startTime)) {
        const diffMs = startTime - now;
        const diffMins = Math.round(diffMs / 60000);
        if (diffMins > 0 && diffMins <= 10) {
          const remindedKey = `nnl_reminded_class_${cls.id || cls.title}_${new Date().toDateString()}`;
          if (!sessionStorage.getItem(remindedKey)) {
            sessionStorage.setItem(remindedKey, 'true');
            setPetExpression('focus', 'is-cheer');
            showTamagotchiBubble(`Class in ${diffMins}m! ⏰`, 4000);
          }
          break;
        }
      }
    }
  } catch (e) {}
}

let lastSiteInteractionTime = 0;

function renderPetElement() {
  if (document.getElementById('apk-companion-pet')) return;
  if (isLoginScreenActive()) return;

  const root = document.createElement('div');
  root.id = 'apk-companion-pet';
  root.className = 'apk-companion-pet';
  root.setAttribute('role', 'button');
  root.setAttribute('tabindex', '0');
  root.setAttribute('aria-label', `Lumi Study Companion`);
  root.style.display = (isPetEnabled() && !isLoginScreenActive()) ? 'flex' : 'none';

  root.innerHTML = `
    <div class="apk-pet-bursts" aria-hidden="true"></div>
    <div class="apk-pet-avatar">
      ${getLumiSvg('default')}
    </div>
  `;

  document.body.appendChild(root);

  const setPosition = (x, y) => {
    root.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const getBottomRightDefault = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const x = Math.max(16, vw - 76);
    const y = Math.round(vh * 0.58);
    return { x, y };
  };

  let pos = getBottomRightDefault();
  setPosition(pos.x, pos.y);

  const burstsEl = root.querySelector('.apk-pet-bursts');

  const LUMI_TAP_ACTIONS = [
    { expr: 'happy', anim: 'is-cheer' },
    { expr: 'wink', anim: 'is-wink' },
    { expr: 'love', anim: 'is-hop' },
    { expr: 'focus', anim: 'is-nod' },
    { expr: 'happy', anim: 'is-spin' }
  ];
  let tapIndex = 0;

  const handleTap = () => {
    const action = LUMI_TAP_ACTIONS[tapIndex % LUMI_TAP_ACTIONS.length];
    tapIndex++;

    setPetExpression(action.expr, action.anim);

    if (burstsEl) {
      const symbols = ['✨', '💖', '⭐', '🌸', '★'];
      for (let i = 0; i < 5; i++) {
        const p = document.createElement('span');
        p.className = 'apk-pet-burst-item';
        p.textContent = symbols[i % symbols.length];
        p.style.setProperty('--bx', `${(Math.random() - 0.5) * 60}px`);
        p.style.setProperty('--by', `${-25 - Math.random() * 40}px`);
        burstsEl.appendChild(p);
        setTimeout(() => p.remove(), 750);
      }
    }
  };

  let isDragging = false;
  let startX = 0, startY = 0;
  let originX = 0, originY = 0;
  let moved = false;
  let isWalking = false;
  let walkTimeout = null;
  let returnTimeout = null;

  // Gentle autonomous hover / patrol along screen edge
  function doAutonomousWalk() {
    if (isDragging || isWalking || !isPetEnabled() || isLoginScreenActive()) return;

    const vw = window.innerWidth;
    const walkLeft = pos.x > 90;
    const distance = 40 + Math.random() * 35;
    const targetX = walkLeft ? Math.max(16, pos.x - distance) : Math.min(vw - 75, pos.x + distance);
    const originWalkX = pos.x;

    isWalking = true;
    root.classList.add('is-walking');
    if (walkLeft) {
      root.classList.add('facing-left');
    } else {
      root.classList.remove('facing-left');
    }

    root.style.transition = 'transform 1.8s ease-in-out';
    pos.x = targetX;
    setPosition(targetX, pos.y);

    walkTimeout = setTimeout(() => {
      root.classList.remove('is-walking');
      root.style.transition = '';

      const funEmotes = [
        { expr: 'happy', anim: 'is-cheer' },
        { expr: 'wink', anim: 'is-wink' },
        { expr: 'love', anim: 'is-hop' }
      ];
      const pick = funEmotes[Math.floor(Math.random() * funEmotes.length)];
      setPetExpression(pick.expr, pick.anim);

      returnTimeout = setTimeout(() => {
        if (isDragging || !isPetEnabled()) {
          isWalking = false;
          return;
        }
        root.classList.add('is-walking');
        if (walkLeft) {
          root.classList.remove('facing-left');
        } else {
          root.classList.add('facing-left');
        }
        root.style.transition = 'transform 1.8s ease-in-out';
        pos.x = originWalkX;
        setPosition(originWalkX, pos.y);

        setTimeout(() => {
          root.classList.remove('is-walking', 'facing-left');
          root.style.transition = '';
          isWalking = false;
          setPetExpression('default');
        }, 1850);
      }, 2200);
    }, 1850);
  }

  setInterval(doAutonomousWalk, 16000);

  // Page Scroll & Click Dynamic Reactions
  let scrollReactionTimeout = null;
  let lastScrollPos = window.scrollY;

  const handlePageScroll = () => {
    if (isDragging || !isPetEnabled() || isLoginScreenActive()) return;
    const curScroll = window.scrollY;
    const delta = curScroll - lastScrollPos;
    lastScrollPos = curScroll;

    if (Math.abs(delta) > 2) {
      root.classList.add('is-walking');
      if (delta > 0) {
        root.classList.add('facing-left');
      } else {
        root.classList.remove('facing-left');
      }
      const avatar = root.querySelector('.apk-pet-avatar');
      if (avatar && !root.classList.contains('is-cheer')) {
        avatar.innerHTML = getLumiSvg('happy');
      }
    }

    clearTimeout(scrollReactionTimeout);
    scrollReactionTimeout = setTimeout(() => {
      root.classList.remove('is-walking');
      const avatar = root.querySelector('.apk-pet-avatar');
      if (avatar && !root.classList.contains('is-cheer')) {
        avatar.innerHTML = getLumiSvg('default');
      }
    }, 280);
  };
  window.addEventListener('scroll', handlePageScroll, { passive: true });

  const handlePageClick = (e) => {
    if (isDragging || !isPetEnabled() || isLoginScreenActive()) return;
    if (root.contains(e.target)) return;
    const targetInteractive = e.target.closest('button, a, .nav-tab, .sd-lecture-card, .class-card, .test-card, .notes-card, [role="button"], .apk-hamburger-btn');
    if (targetInteractive) {
      const clickReactions = [
        { expr: 'happy', anim: 'is-cheer' },
        { expr: 'wink', anim: 'is-wink' },
        { expr: 'focus', anim: 'is-nod' }
      ];
      const pick = clickReactions[Math.floor(Math.random() * clickReactions.length)];
      setPetExpression(pick.expr, pick.anim);
    }
  };
  document.addEventListener('click', handlePageClick, { passive: true });

  const onPointerDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isWalking) {
      clearTimeout(walkTimeout);
      clearTimeout(returnTimeout);
      root.classList.remove('is-walking');
      root.style.transition = '';
      isWalking = false;
    }
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
      if (dx < -2) {
        root.classList.add('facing-left');
      } else if (dx > 2) {
        root.classList.remove('facing-left');
      }
    }
    const newX = Math.max(10, Math.min(window.innerWidth - 68, originX + dx));
    const newY = Math.max(10, Math.min(window.innerHeight - 80, originY + dy));
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
      handleTap();
    } else {
      root.classList.add('is-squish');
      setTimeout(() => root.classList.remove('is-squish'), 450);
      if (Math.abs(pos.x - originX) > 40 || Math.abs(pos.y - originY) > 40) {
        showTamagotchiBubble('Wheee! ✨', 900);
      }
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
  root.addEventListener('touchstart', (e) => {
    e.stopPropagation();
  }, { passive: false });
  root.addEventListener('touchend', (e) => {
    e.stopPropagation();
  }, { passive: false });

  // Global Website Interaction Listener
  document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('#apk-companion-pet')) return;
    if (isLoginScreenActive() || !isPetEnabled()) return;

    // 1. Navigation Island Clicks
    if (e.target.closest('.nav-tab, .header-nav-tabs, #tab-live, #tab-videos, #tab-notes, #tab-tests, #tab-saved')) {
      setPetExpression('happy', 'is-wink');
      showTamagotchiBubble('Ready! ✨', 1000);
      return;
    }

    // 2. Class Cards or "Join Live Classroom" Click
    if (e.target.closest('.class-card, .join-embedded-btn, .btn-zoom')) {
      setPetExpression('happy', 'is-cheer');
      showTamagotchiBubble('Study time! 🚀', 1200);
      return;
    }

    // 3. Date Carousel Click
    if (e.target.closest('.apk-date-pill')) {
      setPetExpression('wink', 'is-nod');
      showTamagotchiBubble('✨', 900);
      return;
    }

    // 4. Test start or submit click
    if (e.target.closest('.start-quiz-hub-btn, #quiz-submit-btn, .btn-report-cta')) {
      setPetExpression('focus', 'is-cheer');
      showTamagotchiBubble('Good luck! 🎯', 1200);
      return;
    }

    // 5. Test Option Selected / Explanations
    if (e.target.closest('.quiz-option-btn, .analysis-explain-btn')) {
      setPetExpression('focus', 'is-nod');
      return;
    }

    // 6. Occasional subtle nod on general screen clicks
    const now = Date.now();
    if (now - lastSiteInteractionTime > 4000) {
      lastSiteInteractionTime = now;
      setPetExpression('default', 'is-nod');
    }
  }, { passive: true });

  // Natural idle wiggle / wink
  setInterval(() => {
    if (isDragging || isLoginScreenActive() || !isPetEnabled()) return;
    if (Math.random() < 0.45) {
      setPetExpression('wink', 'is-wiggle');
    }
  }, 24000);

  window.addEventListener('resize', () => {
    pos.x = Math.max(10, Math.min(window.innerWidth - 68, pos.x));
    pos.y = Math.max(10, Math.min(window.innerHeight - 80, pos.y));
    setPosition(pos.x, pos.y);
  });
}

// Reactive Test & Question Event Listeners
window.addEventListener('nnl:test-started', () => {
  setPetExpression('focus', 'is-nod');
  showTamagotchiBubble('Focus mode! 🎯', 1200);
});

window.addEventListener('nnl:test-correct', () => {
  setPetExpression('happy', 'is-cheer');
  showTamagotchiBubble('Awesome! ⭐', 1400);
});

window.addEventListener('nnl:test-incorrect', () => {
  setPetExpression('shocked', 'is-shock');
  showTamagotchiBubble('Try again! 💡', 1200);
});

window.addEventListener('nnl:question-slow', () => {
  setPetExpression('shocked', 'is-shock');
  showTamagotchiBubble('Tick tock! ⏳', 1200);
});

// Class reminder polling
setInterval(checkUpcomingClassReminder, 30000);
setTimeout(checkUpcomingClassReminder, 3500);

export function initPetSystem() {
  if (typeof window === 'undefined' || window.__nnlPetMounted) return;
  window.__nnlPetMounted = true;

  const authScreen = document.getElementById('auth-screen');
  if (authScreen) {
    const observer = new MutationObserver(() => {
      syncPetVisibility();
    });
    observer.observe(authScreen, { attributes: true, attributeFilter: ['class'] });
  }

  syncPetVisibility();
}
