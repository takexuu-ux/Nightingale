// Nightingale Companion Mascot: Shin-chan (Shinnosuke Nohara)
// 100% Code-Generated Vector Companion with Iconic Expressions & Interactive Website Body Animations
// STRICT RULE: Shin-chan is NEVER shown on the Login / Authentication screen.

const STORAGE_PET_KEY = 'nnl_companion_pet_id';
const STORAGE_ENABLED_KEY = 'nnl_companion_pet_enabled';

export function getPetSvg(petId, expression = 'default') {
  return getShinchanSvg(expression);
}

export function getNurseSvg(expression = 'default') {
  return getShinchanSvg(expression);
}

export function getShinchanSvg(expr = 'default') {
  let faceContent = '';

  switch (expr) {
    case 'happy':
      faceContent = `
        <!-- High Arched Eyebrows -->
        <path d="M 21 21 Q 28 14 34 20" stroke="#0F172A" stroke-width="4.8" stroke-linecap="round" fill="none" />
        <path d="M 42 20 Q 48 14 55 21" stroke="#0F172A" stroke-width="4.8" stroke-linecap="round" fill="none" />
        <!-- Happy Curved Arcs for Eyes -->
        <path d="M 23 31 Q 28 23 33 31" stroke="#0F172A" stroke-width="3.6" stroke-linecap="round" fill="none" />
        <path d="M 43 31 Q 48 23 53 31" stroke="#0F172A" stroke-width="3.6" stroke-linecap="round" fill="none" />
        <!-- Big Open Laughing Mouth with Tongue -->
        <path d="M 33 37 Q 39 48 46 37 Z" fill="#E11D48" stroke="#1E293B" stroke-width="1.2" />
        <ellipse cx="39" cy="42" rx="4.5" ry="2.5" fill="#FDA4AF" />
        <!-- Celebration Sparkles -->
        <path d="M 12 16 L 14 19 L 17 21 L 14 23 L 12 26 L 10 23 L 7 21 L 10 19 Z" fill="#FACC15" />
        <path d="M 64 16 L 66 19 L 69 21 L 66 23 L 64 26 L 62 23 L 59 21 L 62 19 Z" fill="#FACC15" />
      `;
      break;

    case 'shocked':
      faceContent = `
        <!-- Worried Wavy Eyebrows -->
        <path d="M 22 22 Q 27 26 33 21" stroke="#0F172A" stroke-width="4.6" stroke-linecap="round" fill="none" />
        <path d="M 43 21 Q 49 26 54 22" stroke="#0F172A" stroke-width="4.6" stroke-linecap="round" fill="none" />
        <!-- Wide White Shocked Eyes with Tiny Pupils -->
        <circle cx="28" cy="31" r="5.5" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
        <circle cx="28" cy="31" r="1.8" fill="#0F172A" />
        <circle cx="48" cy="31" r="5.5" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
        <circle cx="48" cy="31" r="1.8" fill="#0F172A" />
        <!-- Big O Shaped Shocked Mouth -->
        <ellipse cx="39" cy="41" rx="3.5" ry="4.8" fill="#E11D48" stroke="#1E293B" stroke-width="1.2" />
        <!-- Giant Blue Anime Sweat Drop -->
        <path d="M 14 24 C 14 21, 18 18, 18 18 C 18 18, 22 21, 22 24 C 22 26.5, 20 28.5, 18 28.5 C 16 28.5, 14 26.5, 14 24 Z" fill="#38BDF8" stroke="#0284C7" stroke-width="0.8" />
        <circle cx="16.5" cy="24" r="0.8" fill="#FFFFFF" />
      `;
      break;

    case 'wink':
      faceContent = `
        <!-- Confident High Eyebrows -->
        <path d="M 20 22 Q 26 15 33 20" stroke="#0F172A" stroke-width="4.8" stroke-linecap="round" fill="none" />
        <path d="M 42 20 Q 48 15 54 22" stroke="#0F172A" stroke-width="4.8" stroke-linecap="round" fill="none" />
        <!-- Left Wink (< Line) -->
        <path d="M 24 30 L 29 33 L 24 36" stroke="#0F172A" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        <!-- Right Open Eye with Star -->
        <ellipse cx="48" cy="31" rx="4.8" ry="6" fill="#0F172A" />
        <circle cx="46.5" cy="29" r="2.2" fill="#FFFFFF" />
        <!-- Playful 3 Smirk -->
        <path d="M 34 39 Q 37 37 40 39 Q 43 37 46 39" stroke="#E11D48" stroke-width="2.6" fill="none" stroke-linecap="round" />
      `;
      break;

    case 'focus':
      faceContent = `
        <!-- White NORCET Medical Headband with Red Cross -->
        <path d="M 18 19 L 58 19 L 57 24 L 19 24 Z" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="0.8" />
        <rect x="36" y="20" width="4" height="3" fill="#EF4444" />
        <rect x="37" y="19.5" width="2" height="4" fill="#EF4444" />
        <!-- Determined Fierce Eyebrows -->
        <line x1="21" y1="26" x2="33" y2="22" stroke="#0F172A" stroke-width="5" stroke-linecap="round" />
        <line x1="53" y1="26" x2="41" y2="22" stroke="#0F172A" stroke-width="5" stroke-linecap="round" />
        <!-- Concentrating Eyes -->
        <ellipse cx="28" cy="31" rx="4.2" ry="5.2" fill="#0F172A" />
        <circle cx="27" cy="29.5" r="1.6" fill="#FFFFFF" />
        <ellipse cx="46" cy="31" rx="4.2" ry="5.2" fill="#0F172A" />
        <circle cx="45" cy="29.5" r="1.6" fill="#FFFFFF" />
        <!-- Confident Smirk -->
        <path d="M 34 38 Q 39 42 45 38" stroke="#E11D48" stroke-width="2.6" fill="none" stroke-linecap="round" />
      `;
      break;

    case 'sleepy':
      faceContent = `
        <!-- Relaxed Eyebrows -->
        <path d="M 21 24 Q 27 20 33 24" stroke="#0F172A" stroke-width="4.2" stroke-linecap="round" fill="none" />
        <path d="M 42 24 Q 48 20 54 24" stroke="#0F172A" stroke-width="4.2" stroke-linecap="round" fill="none" />
        <!-- Closed Straight Sleepy Eyes -->
        <line x1="23" y1="32" x2="33" y2="32" stroke="#0F172A" stroke-width="3.2" stroke-linecap="round" />
        <line x1="43" y1="32" x2="53" y2="32" stroke="#0F172A" stroke-width="3.2" stroke-linecap="round" />
        <!-- Small Calm Smile -->
        <path d="M 36 39 Q 39 42 42 39" stroke="#E11D48" stroke-width="2.2" fill="none" stroke-linecap="round" />
        <!-- Expanding Blue Snot Bubble -->
        <circle cx="43" cy="38" r="5" fill="rgba(56,189,248,0.55)" stroke="#38BDF8" stroke-width="1.2" />
        <circle cx="41.5" cy="36.5" r="1.5" fill="#FFFFFF" />
      `;
      break;

    case 'buri':
    default:
      faceContent = `
        <!-- Iconic Thick Curved Shin-chan Eyebrows -->
        <path d="M 19 23 Q 26 16 33 21" stroke="#0F172A" stroke-width="5" stroke-linecap="round" fill="none" />
        <path d="M 41 21 Q 48 16 55 23" stroke="#0F172A" stroke-width="5" stroke-linecap="round" fill="none" />
        <!-- Large Mischievous Eyes with Catchlights -->
        <ellipse cx="27" cy="31" rx="4.8" ry="6.2" fill="#0F172A" />
        <circle cx="25.5" cy="28.8" r="2.2" fill="#FFFFFF" />
        <ellipse cx="48" cy="31" rx="4.8" ry="6.2" fill="#0F172A" />
        <circle cx="46.5" cy="28.8" r="2.2" fill="#FFFFFF" />
        <!-- Signature Cheeky Grin -->
        <path d="M 33 39 Q 39 44 45 39" stroke="#E11D48" stroke-width="2.8" fill="none" stroke-linecap="round" />
      `;
      break;
  }

  return `
    <svg viewBox="0 0 80 80" width="100%" height="100%" style="overflow:visible;" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="sc-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" flood-color="rgba(0,0,0,0.3)" />
        </filter>
      </defs>

      <!-- Soft Ground Shadow -->
      <ellipse cx="40" cy="76" rx="22" ry="3.8" fill="rgba(0,0,0,0.22)" />

      <!-- Yellow Shoes with Black Outlines -->
      <ellipse cx="29" cy="73" rx="7.5" ry="4" fill="#FACC15" stroke="#1E293B" stroke-width="1.3" />
      <ellipse cx="51" cy="73" rx="7.5" ry="4" fill="#FACC15" stroke="#1E293B" stroke-width="1.3" />

      <!-- Chubby Little Legs -->
      <rect x="26" y="62" width="6" height="9" rx="3" fill="#FFE0B2" stroke="#1E293B" stroke-width="1.3" />
      <rect x="48" y="62" width="6" height="9" rx="3" fill="#FFE0B2" stroke="#1E293B" stroke-width="1.3" />

      <!-- Iconic Bright Yellow Shorts -->
      <path d="M 23 53 L 57 53 L 59 64 L 44 64 L 40 59 L 36 64 L 21 64 Z" fill="#FACC15" stroke="#1E293B" stroke-width="1.5" stroke-linejoin="round" />

      <!-- Iconic Red Short-Sleeved T-Shirt -->
      <path d="M 22 39 L 58 39 L 60 55 L 20 55 Z" fill="#EF4444" stroke="#1E293B" stroke-width="1.5" stroke-linejoin="round" />
      <!-- Left & Right Sleeves -->
      <path d="M 22 39 L 13 47 L 18 51 L 24 45 Z" fill="#EF4444" stroke="#1E293B" stroke-width="1.5" stroke-linejoin="round" />
      <path d="M 58 39 L 67 47 L 62 51 L 56 45 Z" fill="#EF4444" stroke="#1E293B" stroke-width="1.5" stroke-linejoin="round" />

      <!-- Chubby Little Hands -->
      <circle cx="15" cy="49" r="4.2" fill="#FFE0B2" stroke="#1E293B" stroke-width="1.3" />
      <circle cx="65" cy="49" r="4.2" fill="#FFE0B2" stroke="#1E293B" stroke-width="1.3" />

      <!-- Medical Stethoscope on Shoulders (NORCET Academy Mascot Touch) -->
      <path d="M 25 41 Q 20 48 30 55 Q 38 59 46 55 Q 56 48 51 41" fill="none" stroke="#38BDF8" stroke-width="2.2" stroke-linecap="round" />
      <!-- Silver Stethoscope Chest Piece -->
      <circle cx="38" cy="57" r="3.4" fill="#E2E8F0" stroke="#475569" stroke-width="1.2" />
      <circle cx="38" cy="57" r="1.6" fill="#38BDF8" />

      <!-- Potato-Shaped Head (The Classic Shin-chan Head with chubby left cheek curve) -->
      <path d="M 23 20 C 13 22, 10 33, 14 41 C 17 46, 26 48, 40 48 C 55 48, 65 42, 65 31 C 65 21, 54 16, 40 16 C 30 16, 26 18, 23 20 Z" fill="#FFE0B2" stroke="#1E293B" stroke-width="1.7" />

      <!-- Buzz-cut Black Hair on Top/Back -->
      <path d="M 23 20 C 27 15, 38 15, 52 17 C 62 19, 65 26, 65 31 C 64 26, 56 20, 44 19 C 32 18, 26 21, 23 20 Z" fill="#0F172A" />

      <!-- Cute Ear on Right Side -->
      <ellipse cx="64" cy="33" rx="3.5" ry="4.5" fill="#FFE0B2" stroke="#1E293B" stroke-width="1.4" />
      <path d="M 63 31 Q 66 33 63 35" fill="none" stroke="#1E293B" stroke-width="1.1" />

      <!-- Signature Rosy Cheek Blush -->
      <ellipse cx="21" cy="39" rx="4.8" ry="2.8" fill="#FB7185" opacity="0.82" />
      <ellipse cx="54" cy="36" rx="4.8" ry="2.8" fill="#FB7185" opacity="0.82" />

      <!-- Facial Features -->
      ${faceContent}
    </svg>
  `;
}

export const PET_CATALOG = [
  {
    id: 'shinchan-buddy',
    name: 'Shin-chan (Nohara)',
    emoji: '🍑',
    svg: getShinchanSvg('default')
  }
];

export function getAvailablePets() {
  return PET_CATALOG;
}

export function getActivePetId() {
  return 'shinchan-buddy';
}

export function setActivePetId() {
  // Single Shin-chan Mascot
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
    avatar.innerHTML = getShinchanSvg(expr);
  }

  if (bodyAnim) {
    container.classList.remove('is-hop', 'is-wiggle', 'is-cheer', 'is-spin', 'is-squish', 'is-nod', 'is-buri', 'is-shock', 'is-wink');
    void container.offsetWidth;
    container.classList.add(bodyAnim);
  }

  clearTimeout(expressionResetTimeout);
  if (expr !== 'default') {
    expressionResetTimeout = setTimeout(() => {
      const curAvatar = container.querySelector('.apk-pet-avatar');
      if (curAvatar) {
        curAvatar.innerHTML = getShinchanSvg('default');
      }
      container.classList.remove('is-hop', 'is-wiggle', 'is-cheer', 'is-spin', 'is-squish', 'is-nod', 'is-buri', 'is-shock', 'is-wink');
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
  root.setAttribute('aria-label', `Shin-chan Study Companion`);
  root.style.display = (isPetEnabled() && !isLoginScreenActive()) ? 'flex' : 'none';

  root.innerHTML = `
    <div class="apk-pet-bursts" aria-hidden="true"></div>
    <div class="apk-pet-avatar">
      ${getShinchanSvg('default')}
    </div>
  `;

  document.body.appendChild(root);

  const setPosition = (x, y) => {
    root.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const getBottomRightDefault = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const x = Math.max(16, vw - 80);
    const y = Math.max(16, vh - 105);
    return { x, y };
  };

  let pos = getBottomRightDefault();
  setPosition(pos.x, pos.y);

  const burstsEl = root.querySelector('.apk-pet-bursts');

  const SHINCHAN_TAP_ACTIONS = [
    { expr: 'happy', anim: 'is-buri', emote: 'Buri Buri~ 🍑' },
    { expr: 'wink', anim: 'is-wink', emote: 'Hehe! ✌️' },
    { expr: 'happy', anim: 'is-cheer', emote: 'Yatta! 🔥' },
    { expr: 'focus', anim: 'is-nod', emote: 'Yosh! 💪' }
  ];
  let tapIndex = 0;

  const handleTap = () => {
    const action = SHINCHAN_TAP_ACTIONS[tapIndex % SHINCHAN_TAP_ACTIONS.length];
    tapIndex++;

    setPetExpression(action.expr, action.anim);
    showTamagotchiBubble(action.emote, 1200);

    if (burstsEl) {
      const symbols = ['🍑', '✨', '🔥', '★'];
      for (let i = 0; i < 4; i++) {
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

  const onPointerDown = (e) => {
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
    const cx = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const cy = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const dx = cx - startX;
    const dy = cy - startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) moved = true;
    const newX = Math.max(10, Math.min(window.innerWidth - 68, originX + dx));
    const newY = Math.max(10, Math.min(window.innerHeight - 80, originY + dy));
    pos.x = newX;
    pos.y = newY;
    setPosition(newX, newY);
  };

  const onPointerUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    root.classList.remove('is-dragging');
    try { root.releasePointerCapture(e.pointerId); } catch (_) {}
    if (!moved) {
      handleTap();
    }
  };

  root.addEventListener('pointerdown', onPointerDown);
  root.addEventListener('pointermove', onPointerMove);
  root.addEventListener('pointerup', onPointerUp);
  root.addEventListener('pointercancel', onPointerUp);

  // ── Global Website Interaction Listener ──
  // Reacts dynamically to whatever user clicks on the website
  document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('#apk-companion-pet')) return;
    if (isLoginScreenActive() || !isPetEnabled()) return;

    // 1. Navigation Island Clicks
    if (e.target.closest('.nav-tab, .header-nav-tabs, #tab-live, #tab-videos, #tab-notes, #tab-tests, #tab-saved')) {
      setPetExpression('happy', 'is-wink');
      showTamagotchiBubble('Oho! 👀', 1000);
      return;
    }

    // 2. Class Cards or "Join Live Classroom" Click
    if (e.target.closest('.class-card, .join-embedded-btn, .btn-zoom')) {
      setPetExpression('happy', 'is-cheer');
      showTamagotchiBubble('Yatta! 🔥', 1200);
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
      showTamagotchiBubble('Yosh! 💪', 1200);
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
      setPetExpression('wink', 'is-buri');
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
  showTamagotchiBubble('Focus! 🎯', 1200);
});

window.addEventListener('nnl:test-correct', () => {
  setPetExpression('happy', 'is-buri');
  showTamagotchiBubble('Buri Buri~ 🍑', 1400);
});

window.addEventListener('nnl:test-incorrect', () => {
  setPetExpression('shocked', 'is-shock');
  showTamagotchiBubble('Oops! 💦', 1200);
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
