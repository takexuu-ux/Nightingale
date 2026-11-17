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
        <!-- High Arched Classic Thick Eyebrows -->
        <path d="M 18 19 Q 26 11 34 18" stroke="#0A0A0A" stroke-width="5.4" stroke-linecap="round" fill="none" />
        <path d="M 43 18 Q 51 11 58 19" stroke="#0A0A0A" stroke-width="5.4" stroke-linecap="round" fill="none" />
        <!-- Happy Curved Smiling Eye Arcs -->
        <path d="M 22 29 Q 28 21 34 29" stroke="#0A0A0A" stroke-width="3.8" stroke-linecap="round" fill="none" />
        <path d="M 44 29 Q 50 21 56 29" stroke="#0A0A0A" stroke-width="3.8" stroke-linecap="round" fill="none" />
        <!-- Big Laughing Open Mouth with Pink Tongue -->
        <path d="M 33 36 Q 39.5 48 46 36 Z" fill="#E11D48" stroke="#0F172A" stroke-width="1.6" />
        <ellipse cx="39.5" cy="42" rx="4.5" ry="2.5" fill="#FDA4AF" />
        <!-- Soft Anime Rosy Cheek Blush -->
        <ellipse cx="19" cy="35" rx="3.5" ry="2" fill="#F43F5E" opacity="0.45" />
        <ellipse cx="56" cy="35" rx="3.5" ry="2" fill="#F43F5E" opacity="0.45" />
      `;
      break;

    case 'shocked':
      faceContent = `
        <!-- Wavy Worried Eyebrows -->
        <path d="M 20 21 Q 26 26 33 20" stroke="#0A0A0A" stroke-width="5.0" stroke-linecap="round" fill="none" />
        <path d="M 44 20 Q 51 26 56 21" stroke="#0A0A0A" stroke-width="5.0" stroke-linecap="round" fill="none" />
        <!-- Shocked Wide White Eyes with Small Black Pupils -->
        <ellipse cx="28" cy="29" rx="5.5" ry="6.2" fill="#FFFFFF" stroke="#0A0A0A" stroke-width="2" />
        <circle cx="28" cy="29" r="2.2" fill="#0A0A0A" />
        <ellipse cx="49" cy="29" rx="5.5" ry="6.2" fill="#FFFFFF" stroke="#0A0A0A" stroke-width="2" />
        <circle cx="49" cy="29" r="2.2" fill="#0A0A0A" />
        <!-- O-Shaped Shocked Mouth -->
        <ellipse cx="39" cy="40.5" rx="4" ry="5.5" fill="#E11D48" stroke="#0F172A" stroke-width="1.5" />
        <!-- Anime Blue Sweat Drop on Temple -->
        <path d="M 13 22 C 13 18, 17 15, 17 15 C 17 15, 21 18, 21 22 C 21 24.5, 19 26.5, 17 26.5 C 15 26.5, 13 24.5, 13 22 Z" fill="#38BDF8" stroke="#0284C7" stroke-width="0.8" />
        <circle cx="15.5" cy="22" r="0.8" fill="#FFFFFF" />
      `;
      break;

    case 'wink':
      faceContent = `
        <!-- High Arched Eyebrows -->
        <path d="M 18 19 Q 26 12 33 19" stroke="#0A0A0A" stroke-width="5.4" stroke-linecap="round" fill="none" />
        <path d="M 43 19 Q 50 12 58 19" stroke="#0A0A0A" stroke-width="5.4" stroke-linecap="round" fill="none" />
        <!-- Left Wink (> Line) -->
        <path d="M 23 27 L 30 30.5 L 23 34" stroke="#0A0A0A" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        <!-- Right Open Eye -->
        <ellipse cx="49" cy="29" rx="5.2" ry="6.2" fill="#FFFFFF" stroke="#0A0A0A" stroke-width="1.8" />
        <circle cx="48.5" cy="29" r="3.2" fill="#0A0A0A" />
        <circle cx="47.2" cy="27.5" r="1.1" fill="#FFFFFF" />
        <!-- Playful Cat Smirk 3 -->
        <path d="M 33 38 Q 36 35.5 39 38 Q 42 35.5 45 38" stroke="#991B1B" stroke-width="2.6" fill="none" stroke-linecap="round" />
        <ellipse cx="56" cy="35" rx="3.5" ry="2" fill="#F43F5E" opacity="0.45" />
      `;
      break;

    case 'focus':
      faceContent = `
        <!-- White Student Headband with Red Rising Sun Emblem -->
        <path d="M 16 16 L 60 16 L 59 22 L 17 22 Z" fill="#FFFFFF" stroke="#64748B" stroke-width="1" />
        <circle cx="38.5" cy="19" r="2.4" fill="#EF4444" />
        <!-- Determined Slanted Eyebrows -->
        <line x1="19" y1="24" x2="33" y2="19.5" stroke="#0A0A0A" stroke-width="5.5" stroke-linecap="round" />
        <line x1="57" y1="24" x2="43" y2="19.5" stroke="#0A0A0A" stroke-width="5.5" stroke-linecap="round" />
        <!-- Focused Eyes -->
        <ellipse cx="27.5" cy="29" rx="4.8" ry="5.6" fill="#FFFFFF" stroke="#0A0A0A" stroke-width="1.8" />
        <circle cx="27.5" cy="29" r="2.8" fill="#0A0A0A" />
        <circle cx="26.3" cy="27.8" r="0.9" fill="#FFFFFF" />
        <ellipse cx="48.5" cy="29" rx="4.8" ry="5.6" fill="#FFFFFF" stroke="#0A0A0A" stroke-width="1.8" />
        <circle cx="48.5" cy="29" r="2.8" fill="#0A0A0A" />
        <circle cx="47.3" cy="27.8" r="0.9" fill="#FFFFFF" />
        <!-- Determined Grin -->
        <path d="M 34 38 Q 39 42 45 38" stroke="#991B1B" stroke-width="2.6" fill="none" stroke-linecap="round" />
      `;
      break;

    case 'buri':
    default:
      faceContent = `
        <!-- SIGNATURE ULTRA-THICK ARCHED CRAYON SHIN-CHAN EYEBROWS -->
        <path d="M 18 19 Q 26 11 34 18" stroke="#0A0A0A" stroke-width="5.5" stroke-linecap="round" fill="none" />
        <path d="M 43 18 Q 51 11 58 19" stroke="#0A0A0A" stroke-width="5.5" stroke-linecap="round" fill="none" />
        <!-- Classic Shin-chan Eyes: Oval whites with big black pupils and top-left gleam -->
        <ellipse cx="27" cy="28.5" rx="5.2" ry="6.2" fill="#FFFFFF" stroke="#0A0A0A" stroke-width="1.8" />
        <circle cx="26.5" cy="28.5" r="3.2" fill="#0A0A0A" />
        <circle cx="25.2" cy="27" r="1.1" fill="#FFFFFF" />
        <ellipse cx="48.5" cy="28.5" rx="5.2" ry="6.2" fill="#FFFFFF" stroke="#0A0A0A" stroke-width="1.8" />
        <circle cx="48" cy="28.5" r="3.2" fill="#0A0A0A" />
        <circle cx="46.7" cy="27" r="1.1" fill="#FFFFFF" />
        <!-- Iconic Mischievous Sideways Smirk -->
        <path d="M 33 37 Q 39 42 46 37" stroke="#991B1B" stroke-width="2.6" fill="none" stroke-linecap="round" />
        <!-- Soft Anime Rosy Cheek Blush -->
        <ellipse cx="19" cy="35" rx="3.5" ry="2" fill="#F43F5E" opacity="0.45" />
        <ellipse cx="56" cy="35" rx="3.5" ry="2" fill="#F43F5E" opacity="0.45" />
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

      <!-- Yellow Shoes with Clean Outlines -->
      <ellipse cx="28.5" cy="73.5" rx="7.5" ry="4" fill="#FACC15" stroke="#0F172A" stroke-width="1.5" />
      <ellipse cx="51.5" cy="73.5" rx="7.5" ry="4" fill="#FACC15" stroke="#0F172A" stroke-width="1.5" />

      <!-- Chubby Short Legs -->
      <rect x="25.5" y="61" width="6.5" height="10" rx="3" fill="#FED7AA" stroke="#0F172A" stroke-width="1.4" />
      <rect x="47.5" y="61" width="6.5" height="10" rx="3" fill="#FED7AA" stroke="#0F172A" stroke-width="1.4" />

      <!-- Iconic Bright Yellow Shorts -->
      <path d="M 21 51 L 59 51 L 61 63 L 45 63 L 40 58 L 35 63 L 19 63 Z" fill="#FACC15" stroke="#0F172A" stroke-width="1.7" stroke-linejoin="round" />

      <!-- Iconic Cherry-Red T-Shirt -->
      <path d="M 21 38 L 59 38 L 61 53 L 19 53 Z" fill="#E11D48" stroke="#0F172A" stroke-width="1.7" stroke-linejoin="round" />
      <!-- Round Yellow T-Shirt Collar -->
      <path d="M 33 38 Q 40 43 47 38" fill="none" stroke="#FACC15" stroke-width="2.4" stroke-linecap="round" />
      <!-- Left & Right Sleeves -->
      <path d="M 21 38 L 12 45 L 16 50 L 23 44 Z" fill="#E11D48" stroke="#0F172A" stroke-width="1.6" stroke-linejoin="round" />
      <path d="M 59 38 L 68 45 L 64 50 L 57 44 Z" fill="#E11D48" stroke="#0F172A" stroke-width="1.6" stroke-linejoin="round" />

      <!-- Chubby Little Hands -->
      <circle cx="13.5" cy="48" r="4.2" fill="#FED7AA" stroke="#0F172A" stroke-width="1.4" />
      <circle cx="66.5" cy="48" r="4.2" fill="#FED7AA" stroke="#0F172A" stroke-width="1.4" />

      <!-- Iconic Potato Head Contour with Classic Round Cheeks -->
      <path d="M 23 18 C 13 20, 10 31, 14 39 C 17 44, 26 46, 40 46 C 55 46, 65 41, 65 30 C 65 20, 54 15, 40 15 C 30 15, 26 17, 23 18 Z" fill="#FED7AA" stroke="#0F172A" stroke-width="1.8" />

      <!-- Buzz-cut Cropped Jet-Black Hair on Top & Back -->
      <path d="M 23 18 C 27 13, 38 13, 52 15 C 62 17, 65 24, 65 29 C 64 24, 56 18, 44 17 C 32 16, 26 19, 23 18 Z" fill="#0A0A0A" />

      <!-- Classic Right Ear with Inner Ridge -->
      <ellipse cx="64.5" cy="31" rx="3.5" ry="4.5" fill="#FED7AA" stroke="#0F172A" stroke-width="1.4" />
      <path d="M 63.5 29 Q 66.5 31 63.5 33" fill="none" stroke="#0F172A" stroke-width="1.1" stroke-linecap="round" />

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
