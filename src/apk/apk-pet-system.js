// Codex Companion Pet System for Nightingale Hinglish APK & Web
// 100% vector SVG companions — zero heavy spritesheets, zero network loops, zero flickering.
// Companions: Nurse, Shinchan, Banana Cat, Muksi

const STORAGE_PET_KEY = 'nnl_companion_pet_id';
const STORAGE_ENABLED_KEY = 'nnl_companion_pet_enabled';

export const PET_CATALOG = [
  {
    id: 'nurse',
    name: 'Nurse',
    emoji: '🩺',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="88" rx="28" ry="7" fill="rgba(0,0,0,0.18)"/>
      <!-- Body / Coat -->
      <path d="M30 84 C30 58 70 58 70 84 Z" fill="#FFFFFF"/>
      <path d="M42 62 L50 74 L58 62" stroke="#8E74E5" stroke-width="3" stroke-linecap="round" fill="none"/>
      <!-- Stethoscope -->
      <path d="M38 65 C38 78 62 78 62 65" stroke="#7C5CE0" stroke-width="2.4" stroke-linecap="round" fill="none"/>
      <circle cx="50" cy="77" r="3" fill="#A78BFA"/>
      <!-- Head -->
      <circle cx="50" cy="44" r="22" fill="#FFE2D1"/>
      <!-- Blush -->
      <ellipse cx="36" cy="49" rx="4" ry="2.5" fill="#FCA5A5" opacity="0.6"/>
      <ellipse cx="64" cy="49" rx="4" ry="2.5" fill="#FCA5A5" opacity="0.6"/>
      <!-- Eyes -->
      <circle cx="41" cy="42" r="2.8" fill="#2E1065"/>
      <circle cx="59" cy="42" r="2.8" fill="#2E1065"/>
      <circle cx="42" cy="41" r="1" fill="#FFFFFF"/>
      <circle cx="60" cy="41" r="1" fill="#FFFFFF"/>
      <!-- Smile -->
      <path d="M46 48 Q50 52 54 48" stroke="#831843" stroke-width="2" stroke-linecap="round" fill="none"/>
      <!-- Nurse Cap -->
      <path d="M32 30 C32 20 68 20 68 30 Z" fill="#FFFFFF"/>
      <rect x="47" y="22" width="6" height="6" rx="1" fill="#EF4444"/>
      <rect x="49" y="20" width="2" height="10" rx="0.5" fill="#EF4444"/>
      <rect x="45" y="24" width="10" height="2" rx="0.5" fill="#EF4444"/>
    </svg>`
  },
  {
    id: 'shinchan',
    name: 'Shinchan',
    emoji: '🎈',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="90" rx="26" ry="6" fill="rgba(0,0,0,0.18)"/>
      <!-- Shorts (Yellow) -->
      <rect x="36" y="74" width="28" height="14" rx="4" fill="#FACC15"/>
      <!-- Shirt (Red) -->
      <path d="M30 76 C30 56 70 56 70 76 Z" fill="#EF4444"/>
      <!-- Arms -->
      <ellipse cx="26" cy="68" rx="5" ry="8" fill="#FFE0BD" transform="rotate(-20 26 68)"/>
      <ellipse cx="74" cy="68" rx="5" ry="8" fill="#FFE0BD" transform="rotate(20 74 68)"/>
      <!-- Distinctive Shinchan Head -->
      <path d="M26 44 C24 30 40 22 62 25 C78 28 80 44 76 52 C72 60 56 62 38 60 C28 58 24 50 26 44 Z" fill="#FFE0BD"/>
      <!-- Thick Wavy Eyebrows -->
      <path d="M32 33 Q44 26 50 33" stroke="#18181B" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M56 34 Q66 28 72 35" stroke="#18181B" stroke-width="5" stroke-linecap="round" fill="none"/>
      <!-- Big Cheeky Eyes -->
      <ellipse cx="44" cy="41" rx="4.5" ry="6" fill="#18181B"/>
      <ellipse cx="64" cy="42" rx="4.5" ry="6" fill="#18181B"/>
      <circle cx="45" cy="39" r="1.8" fill="#FFFFFF"/>
      <circle cx="65" cy="40" r="1.8" fill="#FFFFFF"/>
      <!-- Big Rosy Cheeks -->
      <circle cx="34" cy="48" r="5" fill="#F87171" opacity="0.75"/>
      <circle cx="72" cy="49" r="5" fill="#F87171" opacity="0.75"/>
      <!-- Wavy Smile -->
      <path d="M48 49 Q54 54 60 49" stroke="#991B1B" stroke-width="2.4" stroke-linecap="round" fill="none"/>
    </svg>`
  },
  {
    id: 'banana-cat',
    name: 'Banana Cat',
    emoji: '🍌',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="90" rx="30" ry="6" fill="rgba(0,0,0,0.18)"/>
      <!-- Banana Body Outer Peel -->
      <path d="M18 72 C18 40 82 40 82 72 C82 86 64 90 50 90 C36 90 18 86 18 72 Z" fill="#FDE047"/>
      <!-- Banana Stem -->
      <path d="M48 88 L52 96 L47 96 Z" fill="#65A30D"/>
      <!-- Cat Head Emerging -->
      <ellipse cx="50" cy="44" rx="20" ry="17" fill="#FFFFFF"/>
      <!-- Cat Ears with Pink Inner -->
      <polygon points="34,34 42,20 48,31" fill="#FFFFFF"/>
      <polygon points="36,32 42,23 46,30" fill="#F472B6"/>
      <polygon points="52,31 58,20 66,34" fill="#FFFFFF"/>
      <polygon points="54,30 58,23 64,32" fill="#F472B6"/>
      <!-- Big Tearful Shiny Eyes (Signature Banana Cat Look) -->
      <ellipse cx="42" cy="44" rx="4.5" ry="6" fill="#0284C7"/>
      <ellipse cx="58" cy="44" rx="4.5" ry="6" fill="#0284C7"/>
      <circle cx="43" cy="42" r="2.2" fill="#FFFFFF"/>
      <circle cx="59" cy="42" r="2.2" fill="#FFFFFF"/>
      <circle cx="40" cy="46" r="1.1" fill="#FFFFFF"/>
      <circle cx="56" cy="46" r="1.1" fill="#FFFFFF"/>
      <!-- Cute Cat Nose & Crying Mouth -->
      <polygon points="49,49 51,49 50,51" fill="#F472B6"/>
      <path d="M46 53 Q50 50 54 53" stroke="#0369A1" stroke-width="1.8" stroke-linecap="round" fill="none"/>
      <!-- Big Tear Drops -->
      <path d="M36 48 C36 48 34 56 36 58 C38 60 40 56 36 48 Z" fill="#38BDF8" opacity="0.85"/>
      <path d="M64 48 C64 48 66 56 64 58 C62 60 60 56 64 48 Z" fill="#38BDF8" opacity="0.85"/>
    </svg>`
  },
  {
    id: 'moxie',
    name: 'Muksi',
    emoji: '🤖',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="90" rx="26" ry="6" fill="rgba(0,0,0,0.18)"/>
      <!-- Moxie Round Robot Body -->
      <circle cx="50" cy="62" r="26" fill="#0EA5E9"/>
      <!-- Belly Glow Screen -->
      <ellipse cx="50" cy="66" rx="14" ry="11" fill="#E0F2FE"/>
      <!-- Heart on Belly -->
      <path d="M47 64 C45 61 41 63 41 66 C41 70 50 74 50 74 C50 74 59 70 59 66 C59 63 55 61 53 64 L50 67 Z" fill="#F43F5E"/>
      <!-- Head -->
      <rect x="28" y="20" width="44" height="34" rx="16" fill="#0284C7"/>
      <!-- Screen Face -->
      <rect x="33" y="24" width="34" height="26" rx="12" fill="#0C4A6E"/>
      <!-- Friendly Cyan Animated Screen Eyes -->
      <ellipse cx="43" cy="36" rx="4" ry="5.5" fill="#38BDF8"/>
      <ellipse cx="57" cy="36" rx="4" ry="5.5" fill="#38BDF8"/>
      <circle cx="44" cy="34" r="1.5" fill="#FFFFFF"/>
      <circle cx="58" cy="34" r="1.5" fill="#FFFFFF"/>
      <!-- Antenna with Glowing Bulb -->
      <rect x="48" y="10" width="4" height="11" rx="2" fill="#0284C7"/>
      <circle cx="50" cy="9" r="4.5" fill="#38BDF8"/>
    </svg>`
  }
];

export function getAvailablePets() {
  return PET_CATALOG;
}

export function getActivePetId() {
  try {
    const saved = localStorage.getItem(STORAGE_PET_KEY);
    if (saved && PET_CATALOG.some(p => p.id === saved)) return saved;
  } catch (_) {}
  return 'nurse';
}

export function setActivePetId(petId) {
  const pet = PET_CATALOG.find(p => p.id === petId);
  if (!pet) return;
  try {
    localStorage.setItem(STORAGE_PET_KEY, petId);
  } catch (_) {}
  window.__nnlActivePetId = petId;
  const container = document.getElementById('apk-companion-pet');
  if (container) {
    const avatar = container.querySelector('.apk-pet-avatar');
    if (avatar) avatar.innerHTML = pet.svg;
    container.classList.remove('is-hop');
    void container.offsetWidth;
    container.classList.add('is-hop');
  }
}

export function isPetEnabled() {
  try {
    const val = localStorage.getItem(STORAGE_ENABLED_KEY);
    return val === 'true'; // Default strictly FALSE (OFF)
  } catch {}
  return false;
}

export function setPetEnabled(enabled) {
  try {
    localStorage.setItem(STORAGE_ENABLED_KEY, enabled ? 'true' : 'false');
  } catch {}
  document.body.classList.toggle('apk-pet-disabled', !enabled);
  const el = document.getElementById('apk-companion-pet');
  if (enabled) {
    if (!el) {
      renderPetElement();
    } else {
      el.style.display = 'flex';
      el.classList.remove('hide');
    }
  } else {
    if (el) {
      el.style.display = 'none';
      el.classList.add('hide');
    }
  }
}

function renderPetElement() {
  if (document.getElementById('apk-companion-pet')) return;
  const currentPetId = getActivePetId();
  const pet = PET_CATALOG.find(p => p.id === currentPetId) || PET_CATALOG[0];

  const root = document.createElement('div');
  root.id = 'apk-companion-pet';
  root.className = 'apk-companion-pet';
  root.setAttribute('role', 'button');
  root.setAttribute('tabindex', '0');
  root.setAttribute('aria-label', `Companion Pet: ${pet.name}`);
  root.style.display = isPetEnabled() ? 'flex' : 'none';

  root.innerHTML = `
    <div class="apk-pet-bursts" aria-hidden="true"></div>
    <div class="apk-pet-avatar">${pet.svg}</div>
  `;

  document.body.appendChild(root);

  // Position at bottom-right corner of screen
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

  // Tap reaction: Gentle squish + floating heart burst
  const burstsEl = root.querySelector('.apk-pet-bursts');
  const handleTap = () => {
    root.classList.remove('is-hop');
    void root.offsetWidth;
    root.classList.add('is-hop');

    if (burstsEl) {
      for (let i = 0; i < 3; i++) {
        const p = document.createElement('span');
        p.className = 'apk-pet-burst-item';
        p.textContent = i % 2 === 0 ? '♥' : '✦';
        p.style.color = '#A78BFA';
        p.style.setProperty('--bx', `${(Math.random() - 0.5) * 50}px`);
        p.style.setProperty('--by', `${-20 - Math.random() * 35}px`);
        burstsEl.appendChild(p);
        setTimeout(() => p.remove(), 750);
      }
    }
  };

  root.addEventListener('click', handleTap);

  // Drag and drop support
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
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const cx = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const cy = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const dx = cx - startX;
    const dy = cy - startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
    const newX = Math.max(10, Math.min(window.innerWidth - 68, originX + dx));
    const newY = Math.max(10, Math.min(window.innerHeight - 80, originY + dy));
    pos.x = newX;
    pos.y = newY;
    setPosition(newX, newY);
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    isDragging = false;
    root.classList.remove('is-dragging');
  };

  root.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });

  window.addEventListener('resize', () => {
    pos.x = Math.max(10, Math.min(window.innerWidth - 68, pos.x));
    pos.y = Math.max(10, Math.min(window.innerHeight - 80, pos.y));
    setPosition(pos.x, pos.y);
  });
}

export function initPetSystem() {
  if (typeof window === 'undefined' || window.__nnlPetMounted) return;
  window.__nnlPetMounted = true;
  document.body.classList.toggle('apk-pet-disabled', !isPetEnabled());
  if (isPetEnabled()) {
    renderPetElement();
  }
}
