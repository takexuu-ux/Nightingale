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
        <path d="M 19 19 Q 27 12 34 18" stroke="#0F172A" stroke-width="5.2" stroke-linecap="round" fill="none" />
        <path d="M 43 18 Q 50 12 57 19" stroke="#0F172A" stroke-width="5.2" stroke-linecap="round" fill="none" />
        <!-- Happy Curved Smiling Eye Arcs (Classic Anime Happy Eyes) -->
        <path d="M 23 29 Q 28 22 33 29" stroke="#0F172A" stroke-width="3.8" stroke-linecap="round" fill="none" />
        <path d="M 44 29 Q 49 22 54 29" stroke="#0F172A" stroke-width="3.8" stroke-linecap="round" fill="none" />
        <!-- Big Laughing Open Mouth with Pink Tongue -->
        <path d="M 33 36 Q 39 47 46 36 Z" fill="#E11D48" stroke="#1E293B" stroke-width="1.4" />
        <ellipse cx="39.5" cy="41" rx="4.5" ry="2.2" fill="#FDA4AF" />
      `;
      break;

    case 'shocked':
      faceContent = `
        <!-- Wavy Worried Eyebrows -->
        <path d="M 21 21 Q 26 25 32 20" stroke="#0F172A" stroke-width="4.8" stroke-linecap="round" fill="none" />
        <path d="M 44 20 Q 50 25 55 21" stroke="#0F172A" stroke-width="4.8" stroke-linecap="round" fill="none" />
        <!-- Shocked Wide White Eyes with Tiny Black Pupils -->
        <ellipse cx="28" cy="29" rx="5.5" ry="6" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
        <circle cx="28" cy="29" r="1.8" fill="#0F172A" />
        <ellipse cx="49" cy="29" rx="5.5" ry="6" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
        <circle cx="49" cy="29" r="1.8" fill="#0F172A" />
        <!-- O-Shaped Shocked Mouth -->
        <ellipse cx="39" cy="40" rx="3.5" ry="5" fill="#E11D48" stroke="#1E293B" stroke-width="1.3" />
        <!-- Anime Blue Sweat Drop on Temple -->
        <path d="M 14 22 C 14 19, 18 16, 18 16 C 18 16, 22 19, 22 22 C 22 24.5, 20 26.5, 18 26.5 C 16 26.5, 14 24.5, 14 22 Z" fill="#38BDF8" stroke="#0284C7" stroke-width="0.8" />
        <circle cx="16.5" cy="22" r="0.8" fill="#FFFFFF" />
      `;
      break;

    case 'wink':
      faceContent = `
        <!-- High Arched Eyebrows -->
        <path d="M 19 20 Q 26 13 33 19" stroke="#0F172A" stroke-width="5.2" stroke-linecap="round" fill="none" />
        <path d="M 43 19 Q 50 13 57 20" stroke="#0F172A" stroke-width="5.2" stroke-linecap="round" fill="none" />
        <!-- Left Wink (> Line) -->
        <path d="M 23 28 L 29 31 L 23 34" stroke="#0F172A" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        <!-- Right Open Eye -->
        <ellipse cx="49" cy="29" rx="4.8" ry="5.8" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.8" />
        <circle cx="48" cy="29" r="2.8" fill="#0F172A" />
        <circle cx="47" cy="27.8" r="0.9" fill="#FFFFFF" />
        <!-- Playful Cat Smirk 3 -->
        <path d="M 33 38 Q 36 36 39 38 Q 42 36 45 38" stroke="#991B1B" stroke-width="2.6" fill="none" stroke-linecap="round" />
      `;
      break;

    case 'focus':
      faceContent = `
        <!-- White Headband -->
        <path d="M 17 17 L 59 17 L 58 22 L 18 22 Z" fill="#FFFFFF" stroke="#94A3B8" stroke-width="0.9" />
        <rect x="36" y="18" width="4" height="3" fill="#EF4444" />
        <rect x="37" y="17.5" width="2" height="4" fill="#EF4444" />
        <!-- Determined Slanted Eyebrows -->
        <line x1="20" y1="24" x2="33" y2="20" stroke="#0F172A" stroke-width="5.4" stroke-linecap="round" />
        <line x1="56" y1="24" x2="43" y2="20" stroke="#0F172A" stroke-width="5.4" stroke-linecap="round" />
        <!-- Focused Eyes -->
        <ellipse cx="28" cy="29" rx="4.5" ry="5.2" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.8" />
        <circle cx="28" cy="29" r="2.6" fill="#0F172A" />
        <ellipse cx="48" cy="29" rx="4.5" ry="5.2" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.8" />
        <circle cx="48" cy="29" r="2.6" fill="#0F172A" />
        <!-- Determined Grin -->
        <path d="M 34 38 Q 39 42 45 38" stroke="#991B1B" stroke-width="2.6" fill="none" stroke-linecap="round" />
      `;
      break;

    case 'buri':
    default:
      faceContent = `
        <!-- SIGNATURE ULTRA-THICK ARCHED SHIN-CHAN EYEBROWS -->
        <path d="M 19 20 Q 26 13 33 19" stroke="#0F172A" stroke-width="5.4" stroke-linecap="round" fill="none" />
        <path d="M 43 19 Q 50 13 57 20" stroke="#0F172A" stroke-width="5.4" stroke-linecap="round" fill="none" />
        <!-- Classic Shin-chan Eyes: White eye with round black pupil, no eyelashes/blush -->
        <ellipse cx="27" cy="29" rx="4.8" ry="5.8" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.8" />
        <circle cx="26.5" cy="29" r="2.8" fill="#0F172A" />
        <circle cx="25.5" cy="27.8" r="0.9" fill="#FFFFFF" />
        <ellipse cx="48" cy="29" rx="4.8" ry="5.8" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.8" />
        <circle cx="47.5" cy="29" r="2.8" fill="#0F172A" />
        <circle cx="46.5" cy="27.8" r="0.9" fill="#FFFFFF" />
        <!-- Iconic Mischievous Sideways Smirk -->
        <path d="M 33 38 Q 39 43 46 38" stroke="#991B1B" stroke-width="2.6" fill="none" stroke-linecap="round" />
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

      <!-- Yellow Shoes with Outlines -->
      <ellipse cx="29" cy="73" rx="7.5" ry="4" fill="#FACC15" stroke="#1E293B" stroke-width="1.4" />
      <ellipse cx="51" cy="73" rx="7.5" ry="4" fill="#FACC15" stroke="#1E293B" stroke-width="1.4" />

      <!-- Chubby Legs -->
      <rect x="26" y="61" width="6.5" height="10" rx="3" fill="#FED7AA" stroke="#1E293B" stroke-width="1.4" />
      <rect x="47.5" y="61" width="6.5" height="10" rx="3" fill="#FED7AA" stroke="#1E293B" stroke-width="1.4" />

      <!-- Iconic Bright Yellow Shorts -->
      <path d="M 22 51 L 58 51 L 60 63 L 44 63 L 40 58 L 36 63 L 20 63 Z" fill="#FACC15" stroke="#1E293B" stroke-width="1.6" stroke-linejoin="round" />

      <!-- Iconic Red Short-Sleeved T-Shirt -->
      <path d="M 21 38 L 59 38 L 61 53 L 19 53 Z" fill="#EF4444" stroke="#1E293B" stroke-width="1.6" stroke-linejoin="round" />
      <!-- Left & Right Sleeves -->
      <path d="M 21 38 L 12 46 L 17 50 L 23 44 Z" fill="#EF4444" stroke="#1E293B" stroke-width="1.6" stroke-linejoin="round" />
      <path d="M 59 38 L 68 46 L 63 50 L 57 44 Z" fill="#EF4444" stroke="#1E293B" stroke-width="1.6" stroke-linejoin="round" />

      <!-- Chubby Hands -->
      <circle cx="14" cy="48" r="4.2" fill="#FED7AA" stroke="#1E293B" stroke-width="1.4" />
      <circle cx="66" cy="48" r="4.2" fill="#FED7AA" stroke="#1E293B" stroke-width="1.4" />

      <!-- Potato Head Contour with Iconic Chubby Cheeks (Anime Shinnosuke Silhouette) -->
      <path d="M 23 18 C 13 20, 10 31, 14 39 C 17 44, 26 46, 40 46 C 55 46, 65 41, 65 30 C 65 20, 54 15, 40 15 C 30 15, 26 17, 23 18 Z" fill="#FED7AA" stroke="#1E293B" stroke-width="1.8" />

      <!-- Buzz-cut Cropped Black Hair on Top/Back -->
      <path d="M 23 18 C 27 13, 38 13, 52 15 C 62 17, 65 24, 65 29 C 64 24, 56 18, 44 17 C 32 16, 26 19, 23 18 Z" fill="#0A0A0A" />

      <!-- Classic Right Ear -->
      <ellipse cx="64" cy="31" rx="3.5" ry="4.5" fill="#FED7AA" stroke="#1E293B" stroke-width="1.4" />
      <path d="M 63 29 Q 66 31 63 33" fill="none" stroke="#1E293B" stroke-width="1.1" />

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
