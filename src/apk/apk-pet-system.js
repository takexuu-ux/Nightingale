// Codex Companion Pet System for Nightingale Hinglish APK & Web
// 100% vector SVG companions — zero heavy spritesheets, zero network loops, zero flickering.
// Companions: Nurse, Shinchan, Banana Cat, Muksi

const STORAGE_PET_KEY = 'nnl_companion_pet_id';
const STORAGE_ENABLED_KEY = 'nnl_companion_pet_enabled';

export const PET_CATALOG = [
  {
    id: 'bandage-nurse-realistic',
    name: 'Nurse',
    emoji: '🩺',
    gif: '/pets_gif/bandage-nurse-realistic.gif'
  },
  {
    id: 'shinchan',
    name: 'Shinchan',
    emoji: '🎈',
    gif: '/pets_gif/shinchan.gif'
  },
  {
    id: 'banana-cat',
    name: 'Banana Cat',
    emoji: '🍌',
    gif: '/pets_gif/banana-cat.gif'
  },
  {
    id: 'moxie',
    name: 'Muksi',
    emoji: '📚',
    gif: '/pets_gif/moxie.gif'
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
  return 'bandage-nurse-realistic';
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
    if (avatar) avatar.innerHTML = `<img src="${pet.gif}" alt="${pet.name}" style="width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 6px 12px rgba(0,0,0,0.35));" draggable="false" />`;
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
    <div class="apk-pet-avatar">
      <img src="${pet.gif}" alt="${pet.name}" style="width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 6px 12px rgba(0,0,0,0.35));" draggable="false" />
    </div>
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
