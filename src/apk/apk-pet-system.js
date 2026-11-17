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
        <!-- Joyful Laughing Curved Eyes -->
        <path d="M26 29 Q30 24 34 29" stroke="#0F172A" stroke-width="2.6" fill="none" stroke-linecap="round" />
        <path d="M38 29 Q42 24 46 29" stroke="#0F172A" stroke-width="2.6" fill="none" stroke-linecap="round" />
        <!-- Rosy Cheek Blush -->
        <ellipse cx="25" cy="33" rx="3.5" ry="2" fill="#FB7185" opacity="0.85" />
        <ellipse cx="47" cy="33" rx="3.5" ry="2" fill="#FB7185" opacity="0.85" />
        <!-- Cheerful Open Mouth -->
        <path d="M33 34 Q36 41 39 34 Z" fill="#E11D48" />
        <!-- Celebration Sparkles -->
        <path d="M15 15 L17 19 L21 21 L17 23 L15 27 L13 23 L9 21 L13 19 Z" fill="#FBBF24" opacity="0.95" />
        <path d="M57 15 L59 18 L62 19 L59 20 L57 23 L55 20 L52 19 L55 18 Z" fill="#FBBF24" opacity="0.95" />
      `;
      break;

    case 'thinking':
    case 'shocked':
      faceContent = `
        <!-- Curious Tilted Eyebrows -->
        <line x1="26" y1="25" x2="33" y2="24" stroke="#3E2723" stroke-width="2.2" stroke-linecap="round" />
        <line x1="39" y1="24" x2="46" y2="26" stroke="#3E2723" stroke-width="2.2" stroke-linecap="round" />
        <!-- Thoughtful Looking Up Eyes -->
        <ellipse cx="31" cy="30" rx="3.5" ry="4" fill="#0F172A" />
        <circle cx="32" cy="28" r="1.4" fill="#FFFFFF" />
        <ellipse cx="43" cy="30" rx="3.5" ry="4" fill="#0F172A" />
        <circle cx="44" cy="28" r="1.4" fill="#FFFFFF" />
        <ellipse cx="25" cy="34" rx="2.5" ry="1.5" fill="#FB7185" opacity="0.6" />
        <ellipse cx="47" cy="34" rx="2.5" ry="1.5" fill="#FB7185" opacity="0.6" />
        <!-- Puzzled Cute Mouth -->
        <ellipse cx="36" cy="36.5" rx="1.8" ry="2.2" fill="#E11D48" />
        <!-- Hand on Chin -->
        <circle cx="32" cy="40" r="2.8" fill="#FED7AA" />
        <!-- Floating Idea Sparkle -->
        <circle cx="56" cy="18" r="3" fill="#38BDF8" opacity="0.8" />
        <circle cx="61" cy="13" r="4.5" fill="#38BDF8" opacity="0.9" />
      `;
      break;

    case 'focus':
      faceContent = `
        <!-- Determined Eyebrows -->
        <line x1="25" y1="25" x2="33" y2="27" stroke="#3E2723" stroke-width="2.4" stroke-linecap="round" />
        <line x1="47" y1="25" x2="39" y2="27" stroke="#3E2723" stroke-width="2.4" stroke-linecap="round" />
        <!-- Study Glasses with Blue Glint -->
        <circle cx="30" cy="31" r="5.2" fill="rgba(224,242,254,0.3)" stroke="#38BDF8" stroke-width="1.4" />
        <circle cx="42" cy="31" r="5.2" fill="rgba(224,242,254,0.3)" stroke="#38BDF8" stroke-width="1.4" />
        <line x1="35.2" y1="31" x2="36.8" y2="31" stroke="#38BDF8" stroke-width="1.4" />
        <!-- Focused Eyes -->
        <circle cx="30" cy="31" r="2.4" fill="#0F172A" />
        <circle cx="29" cy="30" r="1" fill="#FFFFFF" />
        <circle cx="42" cy="31" r="2.4" fill="#0F172A" />
        <circle cx="41" cy="30" r="1" fill="#FFFFFF" />
        <path d="M33 37 Q36 39 39 37" stroke="#E11D48" stroke-width="1.8" fill="none" stroke-linecap="round" />
      `;
      break;

    case 'alert':
      faceContent = `
        <!-- Alert Wide Eyes -->
        <circle cx="30" cy="30" r="4.2" fill="#0F172A" />
        <circle cx="28.8" cy="28.8" r="1.6" fill="#FFFFFF" />
        <circle cx="42" cy="30" r="4.2" fill="#0F172A" />
        <circle cx="40.8" cy="28.8" r="1.6" fill="#FFFFFF" />
        <ellipse cx="24" cy="34" rx="3" ry="1.8" fill="#FB7185" opacity="0.8" />
        <ellipse cx="48" cy="34" rx="3" ry="1.8" fill="#FB7185" opacity="0.8" />
        <!-- Surprised O Mouth -->
        <ellipse cx="36" cy="37.5" rx="2.5" ry="3.2" fill="#E11D48" />
        <!-- Notification Alert Bell above Cap -->
        <path d="M12 8 C12 4, 18 4, 18 8 L19 11 L11 11 Z" fill="#FBBF24" stroke="#D97706" stroke-width="0.8" />
        <circle cx="15" cy="12" r="1.2" fill="#D97706" />
        <path d="M9 8 Q7 10 9 12" stroke="#FBBF24" stroke-width="1.2" fill="none" />
      `;
      break;

    case 'wink':
      faceContent = `
        <!-- Left Wink -->
        <path d="M26 31 Q29.5 27 33 31" stroke="#0F172A" stroke-width="2.6" fill="none" stroke-linecap="round" />
        <circle cx="25" cy="27" r="1.2" fill="#FBBF24" />
        <!-- Right Open Eye -->
        <ellipse cx="42" cy="30" rx="3.5" ry="4.4" fill="#0F172A" />
        <circle cx="40.8" cy="28.5" r="1.6" fill="#FFFFFF" />
        <ellipse cx="25" cy="34" rx="3" ry="1.8" fill="#FB7185" opacity="0.8" />
        <ellipse cx="47" cy="34" rx="3" ry="1.8" fill="#FB7185" opacity="0.8" />
        <path d="M33 36 Q36 39.5 39 36" stroke="#E11D48" stroke-width="2" fill="none" stroke-linecap="round" />
      `;
      break;

    default: // Friendly Default Smile
      faceContent = `
        <!-- Large Glossy Anime Eyes with Catchlight -->
        <ellipse cx="30" cy="30" rx="3.6" ry="4.6" fill="#0F172A" />
        <circle cx="28.8" cy="28.4" r="1.6" fill="#FFFFFF" />
        <circle cx="31.2" cy="32.2" r="1" fill="#7C3AED" />
        <ellipse cx="42" cy="30" rx="3.6" ry="4.6" fill="#0F172A" />
        <circle cx="40.8" cy="28.4" r="1.6" fill="#FFFFFF" />
        <circle cx="43.2" cy="32.2" r="1" fill="#7C3AED" />
        <!-- Soft Blush -->
        <ellipse cx="24.5" cy="34" rx="3.2" ry="1.8" fill="#FB7185" opacity="0.75" />
        <ellipse cx="47.5" cy="34" rx="3.2" ry="1.8" fill="#FB7185" opacity="0.75" />
        <!-- Sweet Smile -->
        <path d="M33 36 Q36 39 39 36" stroke="#E11D48" stroke-width="2" fill="none" stroke-linecap="round" />
      `;
      break;
  }

  return `
    <svg viewBox="0 0 72 72" width="100%" height="100%" style="overflow:visible;" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="pet-drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.25)" />
        </filter>
        <linearGradient id="scrub-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#8B5CF6" />
          <stop offset="100%" stop-color="#6D28D9" />
        </linearGradient>
        <linearGradient id="hair-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#5D4037" />
          <stop offset="100%" stop-color="#3E2723" />
        </linearGradient>
      </defs>

      <!-- Soft Ground Shadow -->
      <ellipse cx="36" cy="69" rx="18" ry="3" fill="rgba(0,0,0,0.20)" />

      <!-- Back Hair -->
      <path d="M22 22 C22 13, 50 13, 50 22 C54 28, 55 42, 49 46 C47 47, 44 40, 44 36 C44 34, 28 34, 28 36 C28 40, 25 47, 23 46 C17 42, 18 28, 22 22 Z" fill="url(#hair-grad)" />

      <!-- Medical Scrubs Uniform -->
      <path d="M24 43 L48 43 L52 61 L20 61 Z" fill="url(#scrub-grad)" />
      <!-- V-Neck Skin Inset -->
      <polygon points="32,43 40,43 36,49" fill="#FED7AA" />
      <!-- White Undershirt Trim -->
      <path d="M31 43 L36 49 L41 43" stroke="#EDE9FE" stroke-width="1.4" fill="none" />

      <!-- Stethoscope: Binaural Tubing around neck & Silver Bell on chest -->
      <path d="M28 45 C27 53, 31 58, 38 56" stroke="#0ea5e9" stroke-width="2.4" stroke-linecap="round" fill="none" />
      <circle cx="38" cy="56" r="3.2" fill="#CBD5E1" stroke="#94A3B8" stroke-width="1" />
      <circle cx="38" cy="56" r="1.2" fill="#0EA5E9" />

      <!-- Scrub Pocket with Red Cross ID Badge -->
      <rect x="23" y="50" width="7" height="6" rx="1" fill="#FFFFFF" opacity="0.9" />
      <rect x="26" y="51.5" width="1.2" height="3" fill="#EF4444" />
      <rect x="25.1" y="52.4" width="3" height="1.2" fill="#EF4444" />

      <!-- Cute Peach Hands -->
      <circle cx="19" cy="51" r="3.2" fill="#FED7AA" />
      <circle cx="53" cy="51" r="3.2" fill="#FED7AA" />

      <!-- Scrub Pants -->
      <rect x="25" y="61" width="9" height="6" fill="#4C1D95" rx="1" />
      <rect x="38" y="61" width="9" height="6" fill="#4C1D95" rx="1" />

      <!-- White Clinical Shoes -->
      <path d="M23 66 Q28 64 34 66 L34 68.5 L23 68.5 Z" fill="#FFFFFF" />
      <path d="M38 66 Q44 64 49 66 L49 68.5 L38 68.5 Z" fill="#FFFFFF" />

      <!-- Chibi Head Base -->
      <path d="M22 25 C22 17, 50 17, 50 25 C50 36, 45 44, 36 44 C27 44, 22 36, 22 25 Z" fill="#FED7AA" />
      <!-- Cute Ears -->
      <circle cx="22" cy="29" r="3" fill="#FED7AA" />
      <circle cx="50" cy="29" r="3" fill="#FED7AA" />

      <!-- Front Bangs Hair -->
      <path d="M22 23 Q36 29 50 23 Q47 32 43 32 Q36 27 29 32 Q24 32 22 23 Z" fill="url(#hair-grad)" />
      <!-- Soft Hair Highlights -->
      <path d="M25 20 Q36 25 47 20" stroke="#8D6E63" stroke-width="1.8" fill="none" opacity="0.6" />

      <!-- Nurse Cap -->
      <path d="M24 10 Q36 6 48 10 L50 17 Q36 13 22 17 Z" fill="#FFFFFF" filter="url(#pet-drop-shadow)" />
      <path d="M23 16 Q36 12 49 16" stroke="#E2E8F0" stroke-width="1.5" fill="none" />
      <!-- Red Cross Badge on Cap -->
      <rect x="34.5" y="10" width="3" height="3" fill="#EF4444" rx="0.5" />
      <rect x="35.3" y="9" width="1.4" height="5" fill="#EF4444" rx="0.4" />
      <rect x="33.5" y="10.8" width="5" height="1.4" fill="#EF4444" rx="0.4" />

      <!-- Facial Expression Layer -->
      ${faceContent}
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
