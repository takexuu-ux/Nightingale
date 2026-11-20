// Nightingale Companion Mascot: Lumi (Flat 2D Pastel Kawaii Anime Study Companion)
// 100% Code-Generated Clean 2D Vector Companion with Delightful Expressions & Micro-Interactions
// STRICT RULE: Mascot is NEVER shown on the Login / Authentication screen.

const STORAGE_PET_KEY = 'nnl_companion_pet_id';
const STORAGE_ENABLED_KEY = 'nnl_companion_pet_enabled';
const STORAGE_PET_NAME_KEY = 'nnl_companion_pet_name';

export function getPetName() {
  try {
    return localStorage.getItem(STORAGE_PET_NAME_KEY) || 'Lumi';
  } catch {
    return 'Lumi';
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
  return getLumiSvg(expression);
}

export function getNurseSvg(expression = 'default') {
  return getLumiSvg(expression);
}

export function getCompanionSvg(expression = 'default') {
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
        <path d="M 27 38 Q 31 33 35 38" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round" fill="none" />
        <path d="M 45 38 Q 49 33 53 38" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round" fill="none" />
        <!-- Big Happy Open Smile with Pink Tongue -->
        <path d="M 36 42 Q 40 48 44 42 Z" fill="#FB7185" stroke="#334155" stroke-width="1.5" />
        <ellipse cx="40" cy="45" rx="2" ry="1.2" fill="#FECDD3" />
        <!-- Rosy Cheeks -->
        <ellipse cx="22" cy="42" rx="4" ry="2.2" fill="#FB7185" opacity="0.85" />
        <ellipse cx="58" cy="42" rx="4" ry="2.2" fill="#FB7185" opacity="0.85" />
      `;
      break;

    case 'focus':
      faceContent = `
        <!-- Smart Study Glasses (Clean indigo outline) -->
        <rect x="23" y="32" width="14" height="12" rx="4" fill="none" stroke="#6366F1" stroke-width="1.8" />
        <rect x="43" y="32" width="14" height="12" rx="4" fill="none" stroke="#6366F1" stroke-width="1.8" />
        <line x1="37" y1="38" x2="43" y2="38" stroke="#6366F1" stroke-width="1.8" stroke-linecap="round" />
        <!-- Determined Sparkling Eyes inside lenses -->
        <circle cx="30" cy="38" r="2.8" fill="#1E293B" />
        <circle cx="29.2" cy="37.2" r="0.9" fill="#FFFFFF" />
        <circle cx="50" cy="38" r="2.8" fill="#1E293B" />
        <circle cx="49.2" cy="37.2" r="0.9" fill="#FFFFFF" />
        <!-- Focus Smart Smirk -->
        <path d="M 37 44 Q 40 46 43 44" stroke="#334155" stroke-width="1.8" stroke-linecap="round" fill="none" />
        <!-- Soft Blush -->
        <ellipse cx="21" cy="43" rx="3" ry="1.6" fill="#FDA4AF" opacity="0.75" />
        <ellipse cx="59" cy="43" rx="3" ry="1.6" fill="#FDA4AF" opacity="0.75" />
      `;
      break;

    case 'wink':
      faceContent = `
        <!-- Playful Left Wink (> shape) -->
        <path d="M 27 36 L 33 38.5 L 27 41" stroke="#1E293B" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        <!-- Right Sparkling Eye -->
        <circle cx="49" cy="38" r="3.4" fill="#1E293B" />
        <circle cx="48" cy="36.5" r="1.2" fill="#FFFFFF" />
        <!-- Cheeky Smile -->
        <path d="M 37 42 Q 40 44 43 41" stroke="#334155" stroke-width="1.8" stroke-linecap="round" fill="none" />
        <!-- Blushing Cheeks -->
        <ellipse cx="22" cy="43" rx="3.5" ry="2" fill="#FB7185" opacity="0.85" />
        <ellipse cx="58" cy="43" rx="3.5" ry="2" fill="#FB7185" opacity="0.85" />
      `;
      break;

    case 'love':
      faceContent = `
        <!-- Big Heart Eyes (♥ ♥) -->
        <path d="M 31 35 C 29 33 26 35 26 38 C 26 41 31 44 31 44 C 31 44 36 41 36 38 C 36 35 33 33 31 35 Z" fill="#F43F5E" />
        <path d="M 49 35 C 47 33 44 35 44 38 C 44 41 49 44 49 44 C 49 44 54 41 54 38 C 54 35 51 33 49 35 Z" fill="#F43F5E" />
        <!-- Cute Little 'o' Mouth -->
        <ellipse cx="40" cy="44" rx="2" ry="2.6" fill="#334155" />
        <!-- Radiant Blushing Cheeks -->
        <ellipse cx="22" cy="43" rx="4" ry="2.2" fill="#FB7185" opacity="0.9" />
        <ellipse cx="58" cy="43" rx="4" ry="2.2" fill="#FB7185" opacity="0.9" />
      `;
      break;

    case 'sleepy':
      faceContent = `
        <!-- Peaceful Sleeping Eyes (– –) -->
        <path d="M 26 39 Q 31 42 35 39" stroke="#1E293B" stroke-width="2.2" stroke-linecap="round" fill="none" />
        <path d="M 45 39 Q 49 42 54 39" stroke="#1E293B" stroke-width="2.2" stroke-linecap="round" fill="none" />
        <!-- Cute Snooze Bubble -->
        <circle cx="47" cy="34" r="3.5" fill="#E0E7FF" stroke="#A5B4FC" stroke-width="1.1" opacity="0.9" />
        <circle cx="46" cy="33" r="1" fill="#FFFFFF" />
        <!-- Floating z Z -->
        <text x="56" y="28" fill="#818CF8" font-size="7" font-weight="800" font-family="sans-serif">z</text>
        <text x="61" y="22" fill="#6366F1" font-size="9" font-weight="800" font-family="sans-serif">Z</text>
        <!-- Soft Blush -->
        <ellipse cx="22" cy="43" rx="3.2" ry="1.8" fill="#FDA4AF" opacity="0.7" />
        <ellipse cx="58" cy="43" rx="3.2" ry="1.8" fill="#FDA4AF" opacity="0.7" />
      `;
      break;

    case 'shocked':
      faceContent = `
        <!-- Wide Cute Shocked Eyes -->
        <circle cx="31" cy="37" r="4.2" fill="#1E293B" />
        <circle cx="30" cy="35.5" r="1.5" fill="#FFFFFF" />
        <circle cx="49" cy="37" r="4.2" fill="#1E293B" />
        <circle cx="48" cy="35.5" r="1.5" fill="#FFFFFF" />
        <!-- O-shaped Mouth -->
        <ellipse cx="40" cy="45" rx="3" ry="4" fill="#FB7185" stroke="#334155" stroke-width="1.3" />
        <!-- Anime Blue Sweatdrop -->
        <path d="M 21 28 C 21 25 23 23 23 23 C 23 23 25 25 25 28 C 25 29.5 24 30.5 23 30.5 C 22 30.5 21 29.5 21 28 Z" fill="#38BDF8" stroke="#0284C7" stroke-width="0.8" />
      `;
      break;

    default:
      faceContent = `
        <!-- Big Kawaii Sparkling Round Eyes -->
        <circle cx="31" cy="38" r="3.4" fill="#1E293B" />
        <circle cx="30" cy="36.5" r="1.2" fill="#FFFFFF" />
        <circle cx="49" cy="38" r="3.4" fill="#1E293B" />
        <circle cx="48" cy="36.5" r="1.2" fill="#FFFFFF" />
        <!-- Cute Curved Smile -->
        <path d="M 37 42 Q 40 44 43 42" stroke="#334155" stroke-width="1.9" stroke-linecap="round" fill="none" />
        <!-- Soft Anime Rosy Cheeks -->
        <ellipse cx="22" cy="43" rx="3.5" ry="2" fill="#FDA4AF" opacity="0.85" />
        <ellipse cx="58" cy="43" rx="3.5" ry="2" fill="#FDA4AF" opacity="0.85" />
      `;
      break;
  }

  return `
    <svg viewBox="0 0 80 84" width="100%" height="100%" style="overflow:visible;" xmlns="http://www.w3.org/2000/svg">
      <!-- Soft Ambient Ground Shadow -->
      <ellipse cx="40" cy="74" rx="18" ry="3.5" fill="rgba(0,0,0,0.12)" class="lumi-ground-shadow" />

      <!-- Cute Rounded Pastel Bunny Ears -->
      <g class="lumi-ears">
        <!-- Left Ear -->
        <path d="M 24 24 C 19 6 32 4 34 22" fill="#FFFDF9" stroke="#334155" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M 25 19 C 22 10 29 9 31 18" fill="#FBCFE8" />
        <!-- Right Ear -->
        <path d="M 56 24 C 61 6 48 4 46 22" fill="#FFFDF9" stroke="#334155" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M 55 19 C 58 10 51 9 49 18" fill="#FBCFE8" />
      </g>

      <!-- Soft Rounded Feet -->
      <g class="lumi-feet">
        <ellipse cx="30" cy="69" rx="5.5" ry="3.2" fill="#F8FAFC" stroke="#334155" stroke-width="1.8" />
        <ellipse cx="50" cy="69" rx="5.5" ry="3.2" fill="#F8FAFC" stroke="#334155" stroke-width="1.8" />
      </g>

      <!-- Main Chubby Mochi Body (Clean 2D Flat Pastel) -->
      <g class="lumi-main-body">
        <path d="M 16 38 C 16 22 26 18 40 18 C 54 18 64 22 64 38 C 64 56 56 68 40 68 C 24 68 16 56 16 38 Z" fill="#FFFDF9" stroke="#334155" stroke-width="2.2" stroke-linejoin="round" />
      </g>

      <!-- Interactive 2D Facial Features (Direct on face, zero glass/visor) -->
      <g class="lumi-face">
        ${faceContent}
      </g>

      <!-- Cute Tiny Front Paws -->
      <g class="lumi-paws">
        <!-- Left Paw -->
        <ellipse cx="29" cy="54" rx="3.6" ry="2.6" fill="#FFFDF9" stroke="#334155" stroke-width="1.8" />
        <!-- Right Paw -->
        <ellipse cx="51" cy="54" rx="3.6" ry="2.6" fill="#FFFDF9" stroke="#334155" stroke-width="1.8" />
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
