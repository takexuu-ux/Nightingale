// Nightingale Companion Mascot: Tamagotchi Nurse
// 100% Pure Code-Generated Pixel-Vector Companion with Responsive Facial & Body Expressions
// Interacts contextually with tests, questions, and scheduled live class reminders.
// STRICT RULE: Tamagotchi is NEVER shown on the Login / Authentication screen.

const STORAGE_PET_KEY = 'nnl_companion_pet_id';
const STORAGE_ENABLED_KEY = 'nnl_companion_pet_enabled';

export function getPetSvg(petId, expression = 'default') {
  return getNurseSvg(expression);
}

export function getNurseSvg(expr) {
  let faceContent = '';
  switch (expr) {
    case 'happy':
      faceContent = `
        <!-- Cheerful Curved Smiling Eyes -->
        <path d="M15 22 Q18 18 21 22" stroke="#0F172A" stroke-width="2.3" fill="none" stroke-linecap="round" />
        <path d="M27 22 Q30 18 33 22" stroke="#0F172A" stroke-width="2.3" fill="none" stroke-linecap="round" />
        <!-- Happy Rosy Blush -->
        <rect x="13" y="24" width="4" height="2.5" fill="#F43F5E" rx="1" />
        <rect x="31" y="24" width="4" height="2.5" fill="#F43F5E" rx="1" />
        <!-- Wide Joyful Open Smile -->
        <path d="M21 25 Q24 30 27 25 Z" fill="#E11D48" />
        <!-- Celebration Sparkles -->
        <circle cx="10" cy="14" r="1.5" fill="#FBBF24" />
        <circle cx="38" cy="14" r="1.5" fill="#FBBF24" />
      `;
      break;

    case 'thinking':
    case 'shocked':
      faceContent = `
        <!-- Curious Tilted Eyebrows -->
        <line x1="15" y1="18" x2="20" y2="20" stroke="#451A03" stroke-width="1.8" stroke-linecap="round" />
        <line x1="28" y1="20" x2="33" y2="18" stroke="#451A03" stroke-width="1.8" stroke-linecap="round" />
        <!-- Thoughtful Looking Up Eyes -->
        <circle cx="18" cy="22" r="2.8" fill="#0F172A" />
        <circle cx="17" cy="21" r="1.1" fill="#FFFFFF" />
        <circle cx="30" cy="22" r="2.8" fill="#0F172A" />
        <circle cx="29" cy="21" r="1.1" fill="#FFFFFF" />
        <!-- Cute Thinking Mouth & Hand on Chin -->
        <ellipse cx="24" cy="26" rx="1.5" ry="1.8" fill="#E11D48" />
        <circle cx="12" cy="19" r="1.5" fill="#38BDF8" />
      `;
      break;

    case 'focus':
      faceContent = `
        <!-- Determined Study Brow -->
        <line x1="14" y1="18" x2="20" y2="20" stroke="#451A03" stroke-width="2.2" stroke-linecap="round" />
        <line x1="34" y1="18" x2="28" y2="20" stroke="#451A03" stroke-width="2.2" stroke-linecap="round" />
        <!-- Focused Eyes with Glasses Outline -->
        <rect x="15" y="20" width="7" height="6" fill="none" stroke="#60A5FA" stroke-width="1.2" rx="1" />
        <rect x="26" y="20" width="7" height="6" fill="none" stroke="#60A5FA" stroke-width="1.2" rx="1" />
        <line x1="22" y1="23" x2="26" y2="23" stroke="#60A5FA" stroke-width="1.2" />
        <circle cx="18.5" cy="23" r="1.6" fill="#0F172A" />
        <circle cx="29.5" cy="23" r="1.6" fill="#0F172A" />
        <line x1="22" y1="27" x2="26" y2="27" stroke="#E11D48" stroke-width="1.6" stroke-linecap="round" />
      `;
      break;

    case 'alert':
      faceContent = `
        <!-- Alert Wide Eyes -->
        <circle cx="18" cy="22" r="3.2" fill="#0F172A" />
        <circle cx="17.2" cy="21" r="1.2" fill="#FFFFFF" />
        <circle cx="19.2" cy="23" r="0.8" fill="#38BDF8" />
        <circle cx="30" cy="22" r="3.2" fill="#0F172A" />
        <circle cx="29.2" cy="21" r="1.2" fill="#FFFFFF" />
        <circle cx="31.2" cy="23" r="0.8" fill="#38BDF8" />
        <rect x="13" y="24" width="3" height="2" fill="#FB7185" />
        <rect x="32" y="24" width="3" height="2" fill="#FB7185" />
        <!-- Open Reminder Mouth -->
        <ellipse cx="24" cy="26" rx="2" ry="2.2" fill="#E11D48" />
        <!-- Notification Bell Icon beside Cap -->
        <path d="M8 8 L10 8 L11 11 L7 11 Z" fill="#FBBF24" />
        <circle cx="9" cy="12" r="1" fill="#F59E0B" />
      `;
      break;

    case 'wink':
      faceContent = `
        <path d="M15 23 Q18 20 21 23" stroke="#0F172A" stroke-width="2.2" fill="none" stroke-linecap="round" />
        <rect x="28" y="21" width="4" height="5" fill="#0F172A" />
        <rect x="28" y="21" width="2" height="2" fill="#FFFFFF" />
        <rect x="30" y="24" width="2" height="2" fill="#38BDF8" />
        <rect x="13" y="25" width="3" height="2" fill="#FB7185" />
        <rect x="31" y="25" width="3" height="2" fill="#FB7185" />
        <path d="M22 26 Q24 28 26 26" stroke="#E11D48" stroke-width="1.8" fill="none" stroke-linecap="round" />
      `;
      break;

    case 'heart-eyes':
      faceContent = `
        <path d="M16 22 A 1.5 1.5 0 0 1 18 21 A 1.5 1.5 0 0 1 20 22 Q 18 25.5 18 25.5 Q 16 22 16 22 Z" fill="#EF4444" />
        <path d="M28 22 A 1.5 1.5 0 0 1 30 21 A 1.5 1.5 0 0 1 32 22 Q 30 25.5 30 25.5 Q 28 22 28 22 Z" fill="#EF4444" />
        <rect x="13" y="25" width="4" height="2.5" fill="#FB7185" />
        <rect x="31" y="25" width="4" height="2.5" fill="#FB7185" />
        <path d="M22 26 Q24 29.5 26 26 Z" fill="#E11D48" />
      `;
      break;

    default: // Friendly Default Smile
      faceContent = `
        <!-- Curious Eyes with Catchlight -->
        <rect x="16" y="21" width="4" height="5" fill="#0F172A" rx="1" />
        <rect x="16" y="21" width="2" height="2" fill="#FFFFFF" />
        <rect x="18" y="24" width="2" height="2" fill="#38BDF8" />
        <rect x="28" y="21" width="4" height="5" fill="#0F172A" rx="1" />
        <rect x="28" y="21" width="2" height="2" fill="#FFFFFF" />
        <rect x="30" y="24" width="2" height="2" fill="#38BDF8" />
        <!-- Soft Blush -->
        <rect x="13" y="25" width="3.5" height="2" fill="#FB7185" rx="1" />
        <rect x="31.5" y="25" width="3.5" height="2" fill="#FB7185" rx="1" />
        <!-- Sweet Smile -->
        <path d="M22 26 Q24 28.5 26 26" stroke="#E11D48" stroke-width="1.8" fill="none" stroke-linecap="round" />
      `;
      break;
  }

  return `
    <svg viewBox="0 0 48 48" width="100%" height="100%" shape-rendering="crispEdges" style="overflow:visible;" xmlns="http://www.w3.org/2000/svg">
      <!-- Ground Shadow -->
      <ellipse cx="24" cy="46" rx="14" ry="2.5" fill="rgba(0,0,0,0.22)" shape-rendering="auto" />
      <!-- Nurse Cap -->
      <path d="M14 6 h20 v6 h-20 z" fill="#FFFFFF" />
      <path d="M13 10 h22 v3 h-22 z" fill="#F1F5F9" />
      <!-- Red Cross Badge on Cap -->
      <rect x="22" y="7" width="4" height="4" fill="#EF4444" />
      <rect x="23" y="6" width="2" height="6" fill="#EF4444" />
      <!-- Hair -->
      <path d="M12 12 h24 v14 h-24 z" fill="#451A03" />
      <path d="M10 16 h4 v10 h-4 z" fill="#451A03" />
      <path d="M34 16 h4 v10 h-4 z" fill="#451A03" />
      <path d="M14 12 h20 v4 h-20 z" fill="#78350F" />
      <rect x="14" y="16" width="4" height="3" fill="#78350F" />
      <rect x="22" y="16" width="4" height="2" fill="#78350F" />
      <rect x="30" y="16" width="4" height="3" fill="#78350F" />
      <!-- Face -->
      <rect x="14" y="18" width="20" height="12" fill="#FED7AA" />
      <rect x="12" y="20" width="2" height="8" fill="#FED7AA" />
      <rect x="34" y="20" width="2" height="8" fill="#FED7AA" />
      ${faceContent}
      <!-- Scrubs & Stethoscope -->
      <rect x="15" y="30" width="18" height="12" fill="#EDE9FE" />
      <rect x="18" y="30" width="12" height="12" fill="#8E74E5" />
      <polygon points="21,30 27,30 24,34" fill="#FED7AA" shape-rendering="auto" />
      <path d="M19 32 v5 h2 v-5 z" fill="#38BDF8" />
      <path d="M27 32 v5 h2 v-5 z" fill="#38BDF8" />
      <circle cx="28" cy="38" r="2" fill="#94A3B8" shape-rendering="auto" />
      <rect x="19" y="38" width="3" height="3" fill="#FFFFFF" />
      <rect x="20" y="39" width="1" height="1" fill="#EF4444" />
      <!-- Hands -->
      <circle cx="14" cy="36" r="2.2" fill="#FED7AA" shape-rendering="auto" />
      <circle cx="34" cy="36" r="2.2" fill="#FED7AA" shape-rendering="auto" />
      <!-- Pants & Shoes -->
      <rect x="18" y="42" width="5" height="3" fill="#6D28D9" />
      <rect x="25" y="42" width="5" height="3" fill="#6D28D9" />
      <rect x="17" y="44" width="6" height="2" fill="#FFFFFF" />
      <rect x="25" y="44" width="6" height="2" fill="#FFFFFF" />
    </svg>
  `;
}

// Single Dedicated Tamagotchi Nurse
export const PET_CATALOG = [
  {
    id: 'bandage-nurse-realistic',
    name: 'Nurse Tamagotchi',
    emoji: '🩺',
    svg: getNurseSvg('default')
  }
];

export function getAvailablePets() {
  return PET_CATALOG;
}

export function getActivePetId() {
  return 'bandage-nurse-realistic';
}

export function setActivePetId() {
  // Single Tamagotchi
}

export function isPetEnabled() {
  try {
    const val = localStorage.getItem(STORAGE_ENABLED_KEY);
    if (val === 'false') return false;
    return true; // Default ON as requested
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
    avatar.innerHTML = getNurseSvg(expr);
  }

  if (bodyAnim) {
    container.classList.remove('is-hop', 'is-wiggle', 'is-cheer', 'is-spin', 'is-squish', 'is-nod');
    void container.offsetWidth;
    container.classList.add(bodyAnim);
  }

  clearTimeout(expressionResetTimeout);
  if (expr !== 'default') {
    expressionResetTimeout = setTimeout(() => {
      const curAvatar = container.querySelector('.apk-pet-avatar');
      if (curAvatar) {
        curAvatar.innerHTML = getNurseSvg('default');
      }
      container.classList.remove('is-hop', 'is-wiggle', 'is-cheer', 'is-spin', 'is-squish', 'is-nod');
    }, 3200);
  }
}

export function showTamagotchiBubble(text, duration = 3800) {
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
            setPetExpression('alert', 'is-hop');
            showTamagotchiBubble(`⏰ Reminder: "${cls.title || 'Live Class'}" starts in ${diffMins} mins! Get your notes ready 🩺`, 8000);
          }
          break;
        }
      }
    }
  } catch (e) {}
}

function renderPetElement() {
  if (document.getElementById('apk-companion-pet')) return;
  if (isLoginScreenActive()) return;

  const root = document.createElement('div');
  root.id = 'apk-companion-pet';
  root.className = 'apk-companion-pet';
  root.setAttribute('role', 'button');
  root.setAttribute('tabindex', '0');
  root.setAttribute('aria-label', `Tamagotchi Nurse Companion`);
  root.style.display = (isPetEnabled() && !isLoginScreenActive()) ? 'flex' : 'none';

  root.innerHTML = `
    <div class="apk-pet-bursts" aria-hidden="true"></div>
    <div class="apk-pet-avatar">
      ${getNurseSvg('default')}
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
    const y = Math.max(16, vh - 100);
    return { x, y };
  };

  let pos = getBottomRightDefault();
  setPosition(pos.x, pos.y);

  const burstsEl = root.querySelector('.apk-pet-bursts');

  const NURSE_STUDY_TIPS = [
    'Remember ABC priority: Airway > Breathing > Circulation!',
    'Stay hydrated and keep up your daily streak! 💧',
    'Normal arterial pH: 7.35 to 7.45. ROME rule!',
    'GCS score ≤ 8: priority airway intervention needed!',
    'Take a 5-minute break every hour to lock in memories.'
  ];
  let tipIdx = 0;

  const handleTap = () => {
    setPetExpression('happy', 'is-hop');
    showTamagotchiBubble(NURSE_STUDY_TIPS[tipIdx % NURSE_STUDY_TIPS.length]);
    tipIdx++;

    if (burstsEl) {
      const symbols = ['🩺', '✨', '💖', '★'];
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

  // Periodic natural idle micro-blink
  setInterval(() => {
    if (isDragging || isLoginScreenActive() || !isPetEnabled()) return;
    if (Math.random() < 0.4) {
      const curAvatar = root.querySelector('.apk-pet-avatar');
      if (curAvatar) {
        curAvatar.innerHTML = getNurseSvg('wink');
        setTimeout(() => {
          if (curAvatar) curAvatar.innerHTML = getNurseSvg('default');
        }, 240);
      }
    }
  }, 22000);

  window.addEventListener('resize', () => {
    pos.x = Math.max(10, Math.min(window.innerWidth - 68, pos.x));
    pos.y = Math.max(10, Math.min(window.innerHeight - 80, pos.y));
    setPosition(pos.x, pos.y);
  });
}

// Reactive Test & Question Event Listeners
window.addEventListener('nnl:test-started', (e) => {
  setPetExpression('focus', 'is-nod');
  const title = e?.detail?.title || 'Practice Test';
  showTamagotchiBubble(`Starting "${title}". Focus mode on! 🩺`);
});

window.addEventListener('nnl:test-correct', () => {
  setPetExpression('happy', 'is-cheer');
  showTamagotchiBubble('Brilliant! Correct answer! ⭐');
});

window.addEventListener('nnl:test-incorrect', () => {
  setPetExpression('thinking', 'is-squish');
  showTamagotchiBubble('Take a breath! Check the rationale below. 💡');
});

window.addEventListener('nnl:question-slow', () => {
  setPetExpression('thinking', 'is-wiggle');
  showTamagotchiBubble('Take your time, read each choice carefully! ⏳');
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
