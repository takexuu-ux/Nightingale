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
        <path d="M 15 17 Q 25 6 35 16" stroke="#09090B" stroke-width="7.5" stroke-linecap="round" fill="none" />
        <path d="M 41 16 Q 51 6 61 17" stroke="#09090B" stroke-width="7.5" stroke-linecap="round" fill="none" />
        <!-- Happy Curved Smiling Eye Arcs (⌒ ⌒) -->
        <path d="M 20 28 Q 26 19 32 28" stroke="#09090B" stroke-width="4.2" stroke-linecap="round" fill="none" />
        <path d="M 43 28 Q 49 19 55 28" stroke="#09090B" stroke-width="4.2" stroke-linecap="round" fill="none" />
        <!-- Big Laughing Open "D" Mouth with Tongue -->
        <path d="M 32 36 Q 38.5 49 45 36 Z" fill="#E11D48" stroke="#0F172A" stroke-width="1.8" />
        <ellipse cx="38.5" cy="43" rx="4.5" ry="2.8" fill="#FDA4AF" />
        <!-- Soft Anime Rosy Cheek Blush -->
        <ellipse cx="15" cy="34" rx="4.5" ry="2.5" fill="#FB7185" opacity="0.75" />
        <ellipse cx="57" cy="34" rx="3.5" ry="2" fill="#FB7185" opacity="0.6" />
      `;
      break;

    case 'shocked':
      faceContent = `
        <!-- Wavy Worried Eyebrows -->
        <path d="M 16 19 Q 25 25 34 18" stroke="#09090B" stroke-width="6.8" stroke-linecap="round" fill="none" />
        <path d="M 42 18 Q 51 25 60 19" stroke="#09090B" stroke-width="6.8" stroke-linecap="round" fill="none" />
        <!-- Shocked Wide White Eyes with Tiny Dot Pupils -->
        <ellipse cx="25.5" cy="27.5" rx="6.5" ry="7.2" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.8" />
        <circle cx="25.5" cy="27.5" r="2.2" fill="#09090B" />
        <ellipse cx="48.5" cy="27.5" rx="6.5" ry="7.2" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.8" />
        <circle cx="48.5" cy="27.5" r="2.2" fill="#09090B" />
        <!-- O-Shaped Shocked Mouth -->
        <ellipse cx="38.5" cy="40" rx="4.2" ry="5.8" fill="#E11D48" stroke="#0F172A" stroke-width="1.6" />
        <!-- Anime Blue Sweat Drop on Temple -->
        <path d="M 11 22 C 11 17, 15 14, 15 14 C 15 14, 19 17, 19 22 C 19 24.5, 17 26.5, 15 26.5 C 13 26.5, 11 24.5, 11 22 Z" fill="#38BDF8" stroke="#0284C7" stroke-width="1" />
        <circle cx="13.5" cy="22" r="1" fill="#FFFFFF" />
      `;
      break;

    case 'wink':
      faceContent = `
        <!-- Playful Arched Eyebrows -->
        <path d="M 15 17 Q 25 6 35 16" stroke="#09090B" stroke-width="7.5" stroke-linecap="round" fill="none" />
        <path d="M 41 16 Q 51 6 61 17" stroke="#09090B" stroke-width="7.5" stroke-linecap="round" fill="none" />
        <!-- Left Wink (> Line) -->
        <path d="M 20 25 L 28 28.5 L 20 32" stroke="#09090B" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        <!-- Right Open Eye with Star Sparkle -->
        <ellipse cx="48.5" cy="26.5" rx="6.5" ry="6.2" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.8" />
        <ellipse cx="48" cy="27" rx="4" ry="4.5" fill="#09090B" />
        <circle cx="46.5" cy="25" r="1.5" fill="#FFFFFF" />
        <polygon points="50,23 51,25 53,25 51.5,26.5 52,28.5 50,27.2 48,28.5 48.5,26.5 47,25 49,25" fill="#FACC15" />
        <!-- Playful Cat Smirk 3 -->
        <path d="M 32 37 Q 35.5 34 38.5 37 Q 41.5 34 45 37" stroke="#991B1B" stroke-width="2.6" fill="none" stroke-linecap="round" />
        <!-- Blushing Cheek -->
        <ellipse cx="15" cy="34" rx="4.5" ry="2.5" fill="#FB7185" opacity="0.75" />
        <ellipse cx="57" cy="34" rx="3.5" ry="2" fill="#FB7185" opacity="0.6" />
      `;
      break;

    case 'focus':
      faceContent = `
        <!-- Action Kamen / Student Victory Headband with Red Sun -->
        <path d="M 14 14 L 62 14 L 61 20 L 15 20 Z" fill="#FFFFFF" stroke="#475569" stroke-width="1" />
        <circle cx="38" cy="17" r="2.6" fill="#EF4444" />
        <!-- Determined Slanted Eyebrows -->
        <line x1="16" y1="22" x2="33" y2="17" stroke="#09090B" stroke-width="7.5" stroke-linecap="round" />
        <line x1="60" y1="22" x2="43" y2="17" stroke="#09090B" stroke-width="7.5" stroke-linecap="round" />
        <!-- Focused Eyes -->
        <ellipse cx="25.5" cy="27" rx="5.8" ry="6.5" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.8" />
        <circle cx="26" cy="27" r="3.2" fill="#09090B" />
        <circle cx="24.8" cy="25.8" r="1.1" fill="#FFFFFF" />
        <ellipse cx="48.5" cy="27" rx="5.8" ry="6.5" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.8" />
        <circle cx="48" cy="27" r="3.2" fill="#09090B" />
        <circle cx="46.8" cy="25.8" r="1.1" fill="#FFFFFF" />
        <!-- Determined Grin -->
        <path d="M 32 37 Q 38.5 42 45 37" stroke="#0F172A" stroke-width="2.6" fill="#FFFFFF" />
        <ellipse cx="15" cy="34" rx="4" ry="2.2" fill="#FB7185" opacity="0.65" />
      `;
      break;

    case 'eating':
      faceContent = `
        <!-- High Arched Eyebrows -->
        <path d="M 15 17 Q 25 6 35 16" stroke="#09090B" stroke-width="7.5" stroke-linecap="round" fill="none" />
        <path d="M 41 16 Q 51 6 61 17" stroke="#09090B" stroke-width="7.5" stroke-linecap="round" fill="none" />
        <!-- Happy Eating Eyes -->
        <path d="M 20 27 Q 25 20 31 27" stroke="#09090B" stroke-width="4.0" stroke-linecap="round" fill="none" />
        <path d="M 43 27 Q 48 20 54 27" stroke="#09090B" stroke-width="4.0" stroke-linecap="round" fill="none" />
        <!-- Chewing Mouth with Puffed Cheeks -->
        <ellipse cx="38" cy="38" rx="3.8" ry="3.2" fill="#991B1B" />
        <!-- Green Chocobi Star Biscuit -->
        <polygon points="48,39 50,42 53,42 51,44 52,47 49,45 46,47 47,44 45,42 48,42" fill="#10B981" stroke="#065F46" stroke-width="0.8" />
        <!-- Blushing Cheeks -->
        <ellipse cx="15" cy="34" rx="4.5" ry="2.5" fill="#FB7185" opacity="0.75" />
        <ellipse cx="57" cy="34" rx="3.5" ry="2" fill="#FB7185" opacity="0.6" />
      `;
      break;

    case 'buri':
      faceContent = `
        <!-- Signature Arched Eyebrows -->
        <path d="M 15 17 Q 25 6 35 16" stroke="#09090B" stroke-width="7.5" stroke-linecap="round" fill="none" />
        <path d="M 41 16 Q 51 6 61 17" stroke="#09090B" stroke-width="7.5" stroke-linecap="round" fill="none" />
        <!-- Blissful Closed Eyes -->
        <path d="M 20 27 Q 25 19 31 27" stroke="#09090B" stroke-width="4.2" stroke-linecap="round" fill="none" />
        <path d="M 43 27 Q 48 19 54 27" stroke="#09090B" stroke-width="4.2" stroke-linecap="round" fill="none" />
        <!-- Singing / Dancing Open Smile -->
        <path d="M 32 37 Q 38.5 45 45 37" stroke="#E11D48" stroke-width="2.6" fill="#FDA4AF" stroke-linecap="round" />
        <!-- Rosy Blushing Cheeks -->
        <ellipse cx="15" cy="34" rx="4.5" ry="2.5" fill="#FB7185" opacity="0.8" />
        <ellipse cx="57" cy="34" rx="3.5" ry="2" fill="#FB7185" opacity="0.7" />
      `;
      break;

    default:
      faceContent = `
        <!-- SIGNATURE ULTRA-THICK ARCHED CRAYON SHIN-CHAN EYEBROWS -->
        <path d="M 15 17 Q 25 6 35 16" stroke="#09090B" stroke-width="7.5" stroke-linecap="round" fill="none" />
        <path d="M 41 16 Q 51 6 61 17" stroke="#09090B" stroke-width="7.5" stroke-linecap="round" fill="none" />
        <!-- Classic Shin-chan Eyes: Large white capsules with big black pupils and shine -->
        <ellipse cx="25.5" cy="26.5" rx="6.5" ry="6.2" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.8" />
        <ellipse cx="25" cy="27" rx="4" ry="4.5" fill="#09090B" />
        <circle cx="23.5" cy="25" r="1.5" fill="#FFFFFF" />
        <ellipse cx="48.5" cy="26.5" rx="6.5" ry="6.2" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.8" />
        <ellipse cx="48" cy="27" rx="4" ry="4.5" fill="#09090B" />
        <circle cx="46.5" cy="25" r="1.5" fill="#FFFFFF" />
        <!-- Iconic Mischievous Sideways Smirk with Pink Tongue -->
        <path d="M 32 37 Q 38.5 45 45 37" stroke="#991B1B" stroke-width="2.6" fill="#FDA4AF" stroke-linecap="round" />
        <!-- Soft Anime Rosy Cheek Blush on the Potato Cheek -->
        <ellipse cx="15" cy="34" rx="4.5" ry="2.5" fill="#FB7185" opacity="0.75" />
        <ellipse cx="57" cy="34" rx="3.5" ry="2" fill="#FB7185" opacity="0.6" />
      `;
      break;
  }

  return `
    <svg viewBox="0 0 80 88" width="100%" height="100%" style="overflow:visible;" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="sc-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" flood-color="rgba(0,0,0,0.3)" />
        </filter>
      </defs>

      <!-- Soft Ground Shadow -->
      <ellipse cx="40" cy="83" rx="22" ry="4" fill="rgba(0,0,0,0.22)" class="sc-ground-shadow" />

      <!-- Left Leg & Yellow Shoe -->
      <g class="sc-leg sc-leg-left">
        <rect x="25" y="65" width="8" height="11" rx="3.5" fill="#FED7AA" stroke="#0F172A" stroke-width="1.6" />
        <ellipse cx="28.5" cy="79" rx="8" ry="4.5" fill="#FACC15" stroke="#0F172A" stroke-width="1.6" />
        <ellipse cx="28.5" cy="80" rx="5" ry="1.5" fill="#FFFFFF" opacity="0.6" />
      </g>

      <!-- Right Leg & Yellow Shoe -->
      <g class="sc-leg sc-leg-right">
        <rect x="47" y="65" width="8" height="11" rx="3.5" fill="#FED7AA" stroke="#0F172A" stroke-width="1.6" />
        <ellipse cx="51.5" cy="79" rx="8" ry="4.5" fill="#FACC15" stroke="#0F172A" stroke-width="1.6" />
        <ellipse cx="51.5" cy="80" rx="5" ry="1.5" fill="#FFFFFF" opacity="0.6" />
      </g>

      <!-- Body / Outfit -->
      <g class="sc-body">
        <!-- Iconic Bright Yellow Shorts -->
        <path d="M 20 54 L 60 54 L 62 67 L 46 67 L 40 61 L 34 67 L 18 67 Z" fill="#FACC15" stroke="#0F172A" stroke-width="1.8" stroke-linejoin="round" />
        <line x1="40" y1="61" x2="40" y2="67" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" />

        <!-- Iconic Cherry-Red T-Shirt -->
        <path d="M 20 40 L 60 40 L 62 56 L 18 56 Z" fill="#EF4444" stroke="#0F172A" stroke-width="1.8" stroke-linejoin="round" />
        <!-- Round Yellow T-Shirt Collar -->
        <path d="M 32 40 Q 40 45 48 40" fill="none" stroke="#FACC15" stroke-width="2.6" stroke-linecap="round" />
      </g>

      <!-- Left Arm & Hand -->
      <g class="sc-arm sc-arm-left">
        <path d="M 20 41 L 10 49 L 14 54 L 22 47 Z" fill="#EF4444" stroke="#0F172A" stroke-width="1.6" stroke-linejoin="round" />
        <circle cx="11.5" cy="52" r="4.5" fill="#FED7AA" stroke="#0F172A" stroke-width="1.5" />
      </g>

      <!-- Right Arm & Hand -->
      <g class="sc-arm sc-arm-right">
        <path d="M 60 41 L 70 49 L 66 54 L 58 47 Z" fill="#EF4444" stroke="#0F172A" stroke-width="1.6" stroke-linejoin="round" />
        <circle cx="68.5" cy="52" r="4.5" fill="#FED7AA" stroke="#0F172A" stroke-width="1.5" />
      </g>

      <!-- Head & Facial Features -->
      <g class="sc-head">
        <!-- Authentic Yoshito Usui Shin-chan Potato Head Contour: Tall dome, bulbous left cheek pouch, round chin -->
        <path d="M 24 13 C 32 7, 50 7, 60 11 C 66 14, 69 20, 68 28 C 67 34, 63 41, 52 46 C 42 50, 30 49, 22 46 C 13 42, 8 36, 9 27 C 10 19, 16 14, 24 13 Z" fill="#FED7AA" stroke="#0F172A" stroke-width="1.8" stroke-linejoin="round" />

        <!-- Authentic Cropped Buzz-Cut Jet-Black Hair Cap -->
        <path d="M 21 16 C 28 9, 44 7, 58 9 C 65 11, 68 17, 68 27 C 66 21, 60 14, 48 11 C 34 9, 25 12, 21 16 Z" fill="#09090B" />
        <path d="M 64 15 C 68 20, 69 27, 66 33 C 65 28, 65 22, 63 16 Z" fill="#09090B" />

        <!-- Classic Right Ear with Inner Ridge -->
        <ellipse cx="66" cy="29" rx="4.2" ry="5.8" fill="#FED7AA" stroke="#0F172A" stroke-width="1.6" />
        <path d="M 65 27 Q 68 29 65 31" fill="none" stroke="#0F172A" stroke-width="1.2" stroke-linecap="round" />

        <!-- Facial Features -->
        ${faceContent}
      </g>
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
    container.classList.remove('is-hop', 'is-wiggle', 'is-cheer', 'is-spin', 'is-squish', 'is-nod', 'is-buri', 'is-shock', 'is-wink', 'is-walking', 'is-running');
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
      container.classList.remove('is-hop', 'is-wiggle', 'is-cheer', 'is-spin', 'is-squish', 'is-nod', 'is-buri', 'is-shock', 'is-wink', 'is-walking', 'is-running');
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
    { expr: 'buri', anim: 'is-buri', emote: 'Buri Buri~ 🍑' },
    { expr: 'happy', anim: 'is-cheer', emote: 'Yatta! 🔥' },
    { expr: 'wink', anim: 'is-wink', emote: 'Hehe! ✨' },
    { expr: 'eating', anim: 'is-hop', emote: 'Chocobi! 🍫' },
    { expr: 'focus', anim: 'is-nod', emote: 'Action Kamen! ⚡' },
    { expr: 'shocked', anim: 'is-shock', emote: 'Aiyoo! 💦' }
  ];
  let tapIndex = 0;

  const handleTap = () => {
    const action = SHINCHAN_TAP_ACTIONS[tapIndex % SHINCHAN_TAP_ACTIONS.length];
    tapIndex++;

    setPetExpression(action.expr, action.anim);
    showTamagotchiBubble(action.emote, 1300);

    if (burstsEl) {
      const symbols = ['🍑', '✨', '🔥', '★', '🍫'];
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

  function doAutonomousWalk() {
    if (isDragging || isWalking || !isPetEnabled() || isLoginScreenActive()) return;
    const now = Date.now();
    if (now - lastSiteInteractionTime < 9000) return; // User is active, don't interrupt

    const vw = window.innerWidth;
    const walkLeft = pos.x > vw / 2;
    const distance = 55 + Math.random() * 45;
    const targetX = walkLeft ? Math.max(16, pos.x - distance) : Math.min(vw - 75, pos.x + distance);
    const originWalkX = pos.x;

    isWalking = true;
    root.classList.add('is-walking');
    if (walkLeft) {
      root.classList.add('facing-left');
    } else {
      root.classList.remove('facing-left');
    }

    root.style.transition = 'transform 2.0s linear';
    pos.x = targetX;
    setPosition(targetX, pos.y);

    walkTimeout = setTimeout(() => {
      root.classList.remove('is-walking');
      root.style.transition = '';

      const funEmotes = [
        { expr: 'buri', anim: 'is-buri', emote: 'Buri Buri~ 🍑' },
        { expr: 'happy', anim: 'is-cheer', emote: 'Yatta! 🔥' },
        { expr: 'wink', anim: 'is-wink', emote: 'Hehe! ✨' },
        { expr: 'eating', anim: 'is-hop', emote: 'Chocobi! 🍫' }
      ];
      const pick = funEmotes[Math.floor(Math.random() * funEmotes.length)];
      setPetExpression(pick.expr, pick.anim);
      showTamagotchiBubble(pick.emote, 1400);

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
        root.style.transition = 'transform 2.0s linear';
        pos.x = originWalkX;
        setPosition(originWalkX, pos.y);

        setTimeout(() => {
          root.classList.remove('is-walking', 'facing-left');
          root.style.transition = '';
          isWalking = false;
        }, 2050);
      }, 2600);
    }, 2050);
  }

  setInterval(doAutonomousWalk, 24000);

  const onPointerDown = (e) => {
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
        showTamagotchiBubble('Wheee! 💨', 900);
      }
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
