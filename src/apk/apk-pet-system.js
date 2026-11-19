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
        <!-- High Arched Classic Thick Eyebrows on Forehead -->
        <path d="M 17 21 Q 25 13 34 20" stroke="#09090B" stroke-width="6.2" stroke-linecap="round" fill="none" />
        <path d="M 42 20 Q 51 13 59 21" stroke="#09090B" stroke-width="6.2" stroke-linecap="round" fill="none" />
        <!-- Happy Curved Smiling Eye Arcs (⌒ ⌒) -->
        <path d="M 20 30 Q 26 22 32 30" stroke="#09090B" stroke-width="4.2" stroke-linecap="round" fill="none" />
        <path d="M 43 30 Q 49 22 55 30" stroke="#09090B" stroke-width="4.2" stroke-linecap="round" fill="none" />
        <!-- Big Laughing Open "D" Mouth with Tongue -->
        <path d="M 32 38 Q 38.5 49 45 38 Z" fill="#E11D48" stroke="#0F172A" stroke-width="1.8" />
        <ellipse cx="38.5" cy="44" rx="4.5" ry="2.6" fill="#FDA4AF" />
        <!-- Soft Anime Rosy Cheek Blush -->
        <ellipse cx="14" cy="35" rx="4.5" ry="2.5" fill="#FB7185" opacity="0.75" />
        <ellipse cx="56" cy="35" rx="3.5" ry="2" fill="#FB7185" opacity="0.6" />
      `;
      break;

    case 'shocked':
      faceContent = `
        <!-- Wavy Worried Eyebrows on Forehead -->
        <path d="M 17 21 Q 25 26 34 20" stroke="#09090B" stroke-width="6.0" stroke-linecap="round" fill="none" />
        <path d="M 42 20 Q 51 26 59 21" stroke="#09090B" stroke-width="6.0" stroke-linecap="round" fill="none" />
        <!-- Shocked Wide White Eyes with Tiny Dot Pupils -->
        <ellipse cx="25.5" cy="29.5" rx="6.5" ry="7.2" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.8" />
        <circle cx="25.5" cy="29.5" r="2.2" fill="#09090B" />
        <ellipse cx="48.5" cy="29.5" rx="6.5" ry="7.2" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.8" />
        <circle cx="48.5" cy="29.5" r="2.2" fill="#09090B" />
        <!-- O-Shaped Shocked Mouth -->
        <ellipse cx="38.5" cy="41" rx="4.0" ry="5.5" fill="#E11D48" stroke="#0F172A" stroke-width="1.6" />
        <!-- Anime Blue Sweat Drop on Temple -->
        <path d="M 11 23 C 11 18, 15 15, 15 15 C 15 15, 19 18, 19 23 C 19 25.5, 17 27.5, 15 27.5 C 13 27.5, 11 25.5, 11 23 Z" fill="#38BDF8" stroke="#0284C7" stroke-width="1" />
        <circle cx="13.5" cy="23" r="1" fill="#FFFFFF" />
      `;
      break;

    case 'wink':
      faceContent = `
        <!-- Playful Arched Eyebrows on Forehead -->
        <path d="M 17 21 Q 25 14 34 20" stroke="#09090B" stroke-width="6.2" stroke-linecap="round" fill="none" />
        <path d="M 42 20 Q 51 14 59 21" stroke="#09090B" stroke-width="6.2" stroke-linecap="round" fill="none" />
        <!-- Left Wink (> Line) -->
        <path d="M 20 27 L 27 30 L 20 33" stroke="#09090B" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        <!-- Right Open Eye with Star Sparkle -->
        <ellipse cx="48.5" cy="29" rx="6.2" ry="6" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.8" />
        <ellipse cx="48" cy="29.5" rx="3.8" ry="4.2" fill="#09090B" />
        <circle cx="46.5" cy="27.5" r="1.5" fill="#FFFFFF" />
        <polygon points="50,25 51,27 53,27 51.5,28.5 52,30.5 50,29.2 48,30.5 48.5,28.5 47,27 49,27" fill="#FACC15" />
        <!-- Playful Cat Smirk -->
        <path d="M 32 39 Q 35.5 36 38.5 39 Q 41.5 36 45 39" stroke="#991B1B" stroke-width="2.6" fill="none" stroke-linecap="round" />
        <!-- Blushing Cheek -->
        <ellipse cx="14" cy="35" rx="4.5" ry="2.5" fill="#FB7185" opacity="0.75" />
        <ellipse cx="56" cy="35" rx="3.5" ry="2" fill="#FB7185" opacity="0.6" />
      `;
      break;

    case 'focus':
      faceContent = `
        <!-- Action Kamen / Student Victory Headband with Red Sun -->
        <path d="M 14 13 L 62 13 L 61 18 L 15 18 Z" fill="#FFFFFF" stroke="#475569" stroke-width="1" />
        <circle cx="38" cy="15.5" r="2.2" fill="#EF4444" />
        <!-- Determined Slanted Eyebrows -->
        <line x1="17" y1="23" x2="33" y2="19" stroke="#09090B" stroke-width="6.5" stroke-linecap="round" />
        <line x1="59" y1="23" x2="43" y2="19" stroke="#09090B" stroke-width="6.5" stroke-linecap="round" />
        <!-- Focused Eyes -->
        <ellipse cx="25.5" cy="29" rx="5.8" ry="6.2" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.8" />
        <circle cx="26" cy="29" r="3.2" fill="#09090B" />
        <circle cx="24.8" cy="27.8" r="1.1" fill="#FFFFFF" />
        <ellipse cx="48.5" cy="29" rx="5.8" ry="6.2" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.8" />
        <circle cx="48" cy="29" r="3.2" fill="#09090B" />
        <circle cx="46.8" cy="27.8" r="1.1" fill="#FFFFFF" />
        <!-- Determined Grin -->
        <path d="M 32 39 Q 38.5 44 45 39" stroke="#0F172A" stroke-width="2.6" fill="#FFFFFF" />
        <ellipse cx="14" cy="35" rx="4" ry="2.2" fill="#FB7185" opacity="0.65" />
      `;
      break;

    case 'eating':
      faceContent = `
        <!-- High Arched Eyebrows on Forehead -->
        <path d="M 17 21 Q 25 14 34 20" stroke="#09090B" stroke-width="6.2" stroke-linecap="round" fill="none" />
        <path d="M 42 20 Q 51 14 59 21" stroke="#09090B" stroke-width="6.2" stroke-linecap="round" fill="none" />
        <!-- Happy Eating Eyes -->
        <path d="M 20 29 Q 25 22 31 29" stroke="#09090B" stroke-width="4.0" stroke-linecap="round" fill="none" />
        <path d="M 43 29 Q 48 22 54 29" stroke="#09090B" stroke-width="4.0" stroke-linecap="round" fill="none" />
        <!-- Chewing Mouth with Puffed Cheeks -->
        <ellipse cx="38" cy="39" rx="3.8" ry="3.2" fill="#991B1B" />
        <!-- Green Chocobi Star Biscuit -->
        <polygon points="48,40 50,43 53,43 51,45 52,48 49,46 46,48 47,45 45,43 48,43" fill="#10B981" stroke="#065F46" stroke-width="0.8" />
        <!-- Blushing Cheeks -->
        <ellipse cx="14" cy="35" rx="4.5" ry="2.5" fill="#FB7185" opacity="0.75" />
        <ellipse cx="56" cy="35" rx="3.5" ry="2" fill="#FB7185" opacity="0.6" />
      `;
      break;

    case 'buri':
      faceContent = `
        <!-- Signature Arched Eyebrows on Forehead -->
        <path d="M 17 21 Q 25 14 34 20" stroke="#09090B" stroke-width="6.2" stroke-linecap="round" fill="none" />
        <path d="M 42 20 Q 51 14 59 21" stroke="#09090B" stroke-width="6.2" stroke-linecap="round" fill="none" />
        <!-- Blissful Closed Eyes -->
        <path d="M 20 29 Q 25 21 31 29" stroke="#09090B" stroke-width="4.2" stroke-linecap="round" fill="none" />
        <path d="M 43 29 Q 48 21 54 29" stroke="#09090B" stroke-width="4.2" stroke-linecap="round" fill="none" />
        <!-- Singing / Dancing Open Smile -->
        <path d="M 32 39 Q 38.5 47 45 39" stroke="#E11D48" stroke-width="2.6" fill="#FDA4AF" stroke-linecap="round" />
        <!-- Rosy Blushing Cheeks -->
        <ellipse cx="14" cy="35" rx="4.5" ry="2.5" fill="#FB7185" opacity="0.8" />
        <ellipse cx="56" cy="35" rx="3.5" ry="2" fill="#FB7185" opacity="0.7" />
      `;
      break;

    default:
      faceContent = `
        <!-- SIGNATURE ULTRA-THICK ARCHED CRAYON SHIN-CHAN EYEBROWS (Placed naturally on forehead) -->
        <path d="M 17 22 Q 25 14 34 21" stroke="#09090B" stroke-width="6.2" stroke-linecap="round" fill="none" />
        <path d="M 42 21 Q 51 14 59 22" stroke="#09090B" stroke-width="6.2" stroke-linecap="round" fill="none" />
        <!-- Classic Shin-chan Eyes: Large white capsules with big black pupils and shine -->
        <ellipse cx="25.5" cy="29" rx="6.2" ry="6" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.8" />
        <ellipse cx="25" cy="29.5" rx="3.8" ry="4.2" fill="#09090B" />
        <circle cx="23.5" cy="27.8" r="1.4" fill="#FFFFFF" />
        <ellipse cx="48.5" cy="29" rx="6.2" ry="6" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.8" />
        <ellipse cx="48" cy="29.5" rx="3.8" ry="4.2" fill="#09090B" />
        <circle cx="46.5" cy="27.8" r="1.4" fill="#FFFFFF" />
        <!-- Iconic Mischievous Sideways Smirk with Pink Tongue -->
        <path d="M 32 39 Q 38.5 46 45 39" stroke="#991B1B" stroke-width="2.6" fill="#FDA4AF" stroke-linecap="round" />
        <!-- Soft Anime Rosy Cheek Blush on the Potato Cheek -->
        <ellipse cx="14" cy="35" rx="4.5" ry="2.5" fill="#FB7185" opacity="0.75" />
        <ellipse cx="56" cy="35" rx="3.5" ry="2" fill="#FB7185" opacity="0.6" />
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
        <!-- Authentic Yoshito Usui Shin-chan Potato Head Contour: Clear dome, bulbous left cheek pouch, round chin -->
        <path d="M 22 10 C 32 4, 52 4, 62 9 C 68 12, 71 18, 70 26 C 69 33, 65 40, 54 45 C 44 49, 32 48, 24 45 C 14 41, 7 35, 8 26 C 9 17, 15 11, 22 10 Z" fill="#FED7AA" stroke="#0F172A" stroke-width="1.8" stroke-linejoin="round" />

        <!-- Authentic Cropped Buzz-Cut Jet-Black Hair Cap covering crown and temple -->
        <path d="M 22 10 C 32 4, 52 4, 62 9 C 68 12, 71 18, 70 26 C 67 19, 59 11, 46 9 C 34 8, 25 11, 22 10 Z" fill="#09090B" />
        <path d="M 64 11 C 69 16, 70 23, 67 30 C 66 24, 65 18, 63 13 Z" fill="#09090B" />

        <!-- Classic Right Ear with Inner Ridge -->
        <ellipse cx="68" cy="28" rx="4.2" ry="5.8" fill="#FED7AA" stroke="#0F172A" stroke-width="1.6" />
        <path d="M 67 26 Q 70 28 67 30" fill="none" stroke="#0F172A" stroke-width="1.2" stroke-linecap="round" />

        <!-- Facial Features (forehead clearly separated above eyebrows) -->
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
    const x = Math.max(16, vw - 76);
    const y = Math.round(vh * 0.58);
    return { x, y };
  };

  let pos = getBottomRightDefault();
  setPosition(pos.x, pos.y);

  const burstsEl = root.querySelector('.apk-pet-bursts');

  const SHINCHAN_TAP_ACTIONS = [
    { expr: 'buri', anim: 'is-buri' },
    { expr: 'happy', anim: 'is-cheer' },
    { expr: 'wink', anim: 'is-wink' },
    { expr: 'eating', anim: 'is-hop' },
    { expr: 'focus', anim: 'is-nod' },
    { expr: 'happy', anim: 'is-spin' }
  ];
  let tapIndex = 0;

  const handleTap = () => {
    const action = SHINCHAN_TAP_ACTIONS[tapIndex % SHINCHAN_TAP_ACTIONS.length];
    tapIndex++;

    // Play lively Shin-chan action animation without any ugly text speech bubble
    setPetExpression(action.expr, action.anim);

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

  // Patrol Walking (Backward & Forward along screen edge)
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
        { expr: 'buri', anim: 'is-buri' },
        { expr: 'happy', anim: 'is-cheer' },
        { expr: 'wink', anim: 'is-wink' }
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

  setInterval(doAutonomousWalk, 14000);

  // ── Page Scroll & Click Dynamic Reactions ──
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
      if (avatar && !root.classList.contains('is-cheer') && !root.classList.contains('is-buri')) {
        avatar.innerHTML = getShinchanSvg('happy');
      }
    }

    clearTimeout(scrollReactionTimeout);
    scrollReactionTimeout = setTimeout(() => {
      root.classList.remove('is-walking');
      const avatar = root.querySelector('.apk-pet-avatar');
      if (avatar && !root.classList.contains('is-cheer') && !root.classList.contains('is-buri')) {
        avatar.innerHTML = getShinchanSvg('default');
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
