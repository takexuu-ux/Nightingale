// Nightingale Companion Pet System
// 100% Pure Code-Generated Dense Pixel-Art Vector Companions
// Zero external images, zero network requests, zero flickering, 100% clean alpha transparency.
// Companions: Nurse, Shinchan, Banana Cat, Muksi

const STORAGE_PET_KEY = 'nnl_companion_pet_id';
const STORAGE_ENABLED_KEY = 'nnl_companion_pet_enabled';

// High-Density Pixel-Art SVG Companions
export const PET_SVGS = {
  // 1. Nurse: Chibi anime nurse with nurse cap, red cross, brunette hair, anime eyes, blush, medical scrub & stethoscope
  'bandage-nurse-realistic': `
    <svg viewBox="0 0 48 48" width="100%" height="100%" shape-rendering="crispEdges" style="overflow:visible;" xmlns="http://www.w3.org/2000/svg">
      <!-- Drop Shadow -->
      <ellipse cx="24" cy="46" rx="14" ry="2.5" fill="rgba(0,0,0,0.22)" shape-rendering="auto" />
      
      <!-- Nurse Cap -->
      <path d="M14 6 h20 v6 h-20 z" fill="#FFFFFF" />
      <path d="M13 10 h22 v3 h-22 z" fill="#F1F5F9" />
      <!-- Red Cross on Cap -->
      <rect x="22" y="7" width="4" height="4" fill="#EF4444" />
      <rect x="23" y="6" width="2" height="6" fill="#EF4444" />

      <!-- Brunette Hair Back & Bangs -->
      <path d="M12 12 h24 v14 h-24 z" fill="#451A03" />
      <path d="M10 16 h4 v10 h-4 z" fill="#451A03" />
      <path d="M34 16 h4 v10 h-4 z" fill="#451A03" />
      <path d="M14 12 h20 v4 h-20 z" fill="#78350F" />
      <!-- Hair Bangs Details -->
      <rect x="14" y="16" width="4" height="3" fill="#78350F" />
      <rect x="22" y="16" width="4" height="2" fill="#78350F" />
      <rect x="30" y="16" width="4" height="3" fill="#78350F" />

      <!-- Cute Chibi Face -->
      <rect x="14" y="18" width="20" height="12" fill="#FED7AA" />
      <rect x="12" y="20" width="2" height="8" fill="#FED7AA" />
      <rect x="34" y="20" width="2" height="8" fill="#FED7AA" />

      <!-- Big Sparkling Anime Eyes -->
      <rect x="16" y="21" width="4" height="5" fill="#0F172A" />
      <rect x="16" y="21" width="2" height="2" fill="#FFFFFF" />
      <rect x="18" y="24" width="2" height="2" fill="#38BDF8" />

      <rect x="28" y="21" width="4" height="5" fill="#0F172A" />
      <rect x="28" y="21" width="2" height="2" fill="#FFFFFF" />
      <rect x="30" y="24" width="2" height="2" fill="#38BDF8" />

      <!-- Rosy Blush Cheeks -->
      <rect x="14" y="26" width="3" height="2" fill="#FB7185" />
      <rect x="31" y="26" width="3" height="2" fill="#FB7185" />

      <!-- Sweet Smile -->
      <rect x="23" y="27" width="2" height="1" fill="#E11D48" />

      <!-- Medical Scrub Uniform (Soft Violet/Iris & Mint) -->
      <rect x="15" y="30" width="18" height="12" fill="#EDE9FE" />
      <rect x="18" y="30" width="12" height="12" fill="#8E74E5" />
      <!-- Collar V-Neck -->
      <polygon points="21,30 27,30 24,34" fill="#FED7AA" shape-rendering="auto" />
      
      <!-- Stethoscope draped around neck -->
      <path d="M19 32 v5 h2 v-5 z" fill="#38BDF8" />
      <path d="M27 32 v5 h2 v-5 z" fill="#38BDF8" />
      <circle cx="28" cy="38" r="2" fill="#94A3B8" shape-rendering="auto" />
      
      <!-- Pocket with Little Heart Badge -->
      <rect x="19" y="38" width="3" height="3" fill="#FFFFFF" />
      <rect x="20" y="39" width="1" height="1" fill="#EF4444" />

      <!-- Cute Hands -->
      <circle cx="14" cy="36" r="2.2" fill="#FED7AA" shape-rendering="auto" />
      <circle cx="34" cy="36" r="2.2" fill="#FED7AA" shape-rendering="auto" />

      <!-- Scrub Pants & Shoes -->
      <rect x="18" y="42" width="5" height="3" fill="#6D28D9" />
      <rect x="25" y="42" width="5" height="3" fill="#6D28D9" />
      <rect x="17" y="44" width="6" height="2" fill="#FFFFFF" />
      <rect x="25" y="44" width="6" height="2" fill="#FFFFFF" />
    </svg>
  `,

  // 2. Shinchan: Shinnosuke Nohara with bold black eyebrows, round cheeks, red shirt, yellow shorts & teal shoes
  'shinchan': `
    <svg viewBox="0 0 48 48" width="100%" height="100%" shape-rendering="crispEdges" style="overflow:visible;" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow -->
      <ellipse cx="24" cy="46" rx="13" ry="2.5" fill="rgba(0,0,0,0.22)" shape-rendering="auto" />

      <!-- Shinchan Hair Cut -->
      <path d="M14 10 h18 v8 h-18 z" fill="#0A0A0A" />
      <path d="M12 12 h4 v6 h-4 z" fill="#0A0A0A" />
      <path d="M30 12 h4 v6 h-4 z" fill="#0A0A0A" />

      <!-- Head & Chubby Cheeks Shape -->
      <rect x="14" y="16" width="18" height="14" fill="#FED7AA" />
      <rect x="30" y="20" width="5" height="10" fill="#FED7AA" />
      <rect x="12" y="20" width="4" height="10" fill="#FED7AA" />

      <!-- Iconic Thick Curved Eyebrows -->
      <path d="M15 15 h7 v3 h-7 z" fill="#000000" />
      <rect x="14" y="17" width="2" height="2" fill="#000000" />

      <path d="M26 15 h7 v3 h-7 z" fill="#000000" />
      <rect x="32" y="17" width="2" height="2" fill="#000000" />

      <!-- Big Expressive Shinchan Eyes -->
      <rect x="17" y="19" width="5" height="5" fill="#000000" />
      <rect x="18" y="20" width="2" height="2" fill="#FFFFFF" />

      <rect x="27" y="19" width="5" height="5" fill="#000000" />
      <rect x="28" y="20" width="2" height="2" fill="#FFFFFF" />

      <!-- Chubby Cheek Blush -->
      <rect x="13" y="24" width="3" height="3" fill="#FB923C" />
      <rect x="32" y="24" width="3" height="3" fill="#FB923C" />

      <!-- Open Cheerful Mouth -->
      <rect x="22" y="25" width="4" height="3" fill="#E11D48" />
      <rect x="23" y="25" width="2" height="1" fill="#FFFFFF" />

      <!-- Iconic Red T-Shirt -->
      <rect x="15" y="30" width="18" height="9" fill="#DC2626" />
      <rect x="11" y="31" width="4" height="5" fill="#DC2626" />
      <rect x="33" y="31" width="4" height="5" fill="#DC2626" />

      <!-- Hands -->
      <circle cx="10" cy="35" r="2.2" fill="#FED7AA" shape-rendering="auto" />
      <circle cx="38" cy="34" r="2.2" fill="#FED7AA" shape-rendering="auto" />

      <!-- Canary Yellow Shorts -->
      <rect x="16" y="39" width="16" height="4" fill="#FACC15" />
      <rect x="23" y="41" width="2" height="2" fill="#0A0A0A" />

      <!-- Legs -->
      <rect x="18" y="43" width="3" height="2" fill="#FED7AA" />
      <rect x="27" y="43" width="3" height="2" fill="#FED7AA" />

      <!-- White Socks & Teal Shoes -->
      <rect x="17" y="44" width="5" height="1.5" fill="#FFFFFF" />
      <rect x="26" y="44" width="5" height="1.5" fill="#FFFFFF" />
      <rect x="16" y="45" width="6" height="2" fill="#0284C7" />
      <rect x="26" y="45" width="6" height="2" fill="#0284C7" />
    </svg>
  `,

  // 3. Banana Cat: The viral crying/cute kitten poking out of a bright yellow banana peel with green stem
  'banana-cat': `
    <svg viewBox="0 0 48 48" width="100%" height="100%" shape-rendering="crispEdges" style="overflow:visible;" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow -->
      <ellipse cx="24" cy="46" rx="14" ry="2.5" fill="rgba(0,0,0,0.22)" shape-rendering="auto" />

      <!-- Green Banana Stem on Top -->
      <rect x="23" y="4" width="3" height="4" fill="#15803D" />
      <rect x="24" y="2" width="3" height="3" fill="#16A34A" />

      <!-- Yellow Banana Peel Top Arc -->
      <path d="M16 8 h16 v6 h-16 z" fill="#EAB308" />
      <path d="M14 10 h20 v6 h-20 z" fill="#FACC15" />

      <!-- Kitten Ears poking out of banana -->
      <polygon points="15,14 18,7 21,14" fill="#FFFFFF" shape-rendering="auto" />
      <polygon points="16,13 18,9 20,13" fill="#F472B6" shape-rendering="auto" />

      <polygon points="27,14 30,7 33,14" fill="#FFFFFF" shape-rendering="auto" />
      <polygon points="28,13 30,9 32,13" fill="#F472B6" shape-rendering="auto" />

      <!-- Cat Face -->
      <rect x="16" y="14" width="16" height="12" fill="#FFFFFF" />
      <rect x="14" y="16" width="2" height="8" fill="#FFFFFF" />
      <rect x="32" y="16" width="2" height="8" fill="#FFFFFF" />

      <!-- Classic Viral Big Crying / Watery Anime Eyes -->
      <rect x="17" y="17" width="5" height="5" fill="#0284C7" />
      <rect x="18" y="17" width="3" height="3" fill="#0C4A6E" />
      <rect x="17" y="17" width="2" height="2" fill="#FFFFFF" />
      <rect x="20" y="20" width="1.5" height="1.5" fill="#38BDF8" />
      <!-- Tear drops below eyes -->
      <rect x="18" y="22" width="1.5" height="3" fill="#67E8F9" />

      <rect x="26" y="17" width="5" height="5" fill="#0284C7" />
      <rect x="27" y="17" width="3" height="3" fill="#0C4A6E" />
      <rect x="26" y="17" width="2" height="2" fill="#FFFFFF" />
      <rect x="29" y="20" width="1.5" height="1.5" fill="#38BDF8" />
      <!-- Tear drops below eyes -->
      <rect x="28" y="22" width="1.5" height="3" fill="#67E8F9" />

      <!-- Cute Pink Nose & W-mouth -->
      <polygon points="23,22 25,22 24,23" fill="#F43F5E" shape-rendering="auto" />
      <path d="M22 24 q2 1 2 0 q0 1 2 0" stroke="#475569" stroke-width="0.8" fill="none" shape-rendering="auto" />

      <!-- Tiny White Paws resting on Banana Rim -->
      <ellipse cx="17" cy="27" rx="2.5" ry="2" fill="#FFFFFF" shape-rendering="auto" />
      <ellipse cx="31" cy="27" rx="2.5" ry="2" fill="#FFFFFF" shape-rendering="auto" />

      <!-- Bright Yellow Banana Body & Peel -->
      <path d="M12 26 h24 v14 h-24 z" fill="#FACC15" />
      <path d="M14 28 h20 v12 h-20 z" fill="#FDE047" />
      <path d="M10 28 h4 v10 h-4 z" fill="#EAB308" />
      <path d="M34 28 h4 v10 h-4 z" fill="#CA8A04" />

      <!-- Bottom Tip of Banana -->
      <rect x="22" y="40" width="4" height="4" fill="#CA8A04" />
      <rect x="23" y="42" width="2" height="3" fill="#15803D" />
    </svg>
  `,

  // 4. Muksi: Adorable violet/lavender study pet mascot with spectacles, books, fluffy ears & glowing iris sparkles
  'moxie': `
    <svg viewBox="0 0 48 48" width="100%" height="100%" shape-rendering="crispEdges" style="overflow:visible;" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow -->
      <ellipse cx="24" cy="46" rx="14" ry="2.5" fill="rgba(0,0,0,0.22)" shape-rendering="auto" />

      <!-- Cute Head Sprout / Antenna -->
      <rect x="23" y="4" width="2" height="4" fill="#A78BFA" />
      <circle cx="24" cy="3" r="2.5" fill="#F472B6" shape-rendering="auto" />

      <!-- Fluffy Pet Ears -->
      <polygon points="12,14 16,8 20,15" fill="#7C3AED" shape-rendering="auto" />
      <polygon points="14,13 16,10 18,14" fill="#DDD6FE" shape-rendering="auto" />

      <polygon points="28,15 32,8 36,14" fill="#7C3AED" shape-rendering="auto" />
      <polygon points="30,14 32,10 34,13" fill="#DDD6FE" shape-rendering="auto" />

      <!-- Round Fluffy Body (Vibrant Violet / Iris) -->
      <rect x="14" y="12" width="20" height="18" fill="#8E74E5" />
      <rect x="12" y="15" width="2" height="12" fill="#7C3AED" />
      <rect x="34" y="15" width="2" height="12" fill="#7C3AED" />
      <rect x="16" y="14" width="16" height="14" fill="#A78BFA" />

      <!-- Nerdy Golden Spectacles -->
      <circle cx="19" cy="20" r="4.5" fill="none" stroke="#FBBF24" stroke-width="1.2" shape-rendering="auto" />
      <circle cx="29" cy="20" r="4.5" fill="none" stroke="#FBBF24" stroke-width="1.2" shape-rendering="auto" />
      <line x1="23.5" y1="20" x2="24.5" y2="20" stroke="#FBBF24" stroke-width="1.2" shape-rendering="auto" />

      <!-- Sparkling Big Eyes -->
      <circle cx="19" cy="20" r="2.5" fill="#1E1B4B" shape-rendering="auto" />
      <circle cx="18" cy="19" r="1" fill="#FFFFFF" shape-rendering="auto" />

      <circle cx="29" cy="20" r="2.5" fill="#1E1B4B" shape-rendering="auto" />
      <circle cx="28" cy="19" r="1" fill="#FFFFFF" shape-rendering="auto" />

      <!-- Blush -->
      <rect x="13" y="24" width="3" height="2" fill="#FB7185" />
      <rect x="32" y="24" width="3" height="2" fill="#FB7185" />

      <!-- Sweet Smile -->
      <path d="M22 25 q2 1.5 4 0" stroke="#1E1B4B" stroke-width="1" fill="none" shape-rendering="auto" />

      <!-- Lower Body & Tummy -->
      <rect x="15" y="30" width="18" height="12" fill="#7C3AED" />
      <ellipse cx="24" cy="35" rx="6" ry="5" fill="#DDD6FE" shape-rendering="auto" />

      <!-- Medical Study Book in Hands -->
      <rect x="20" y="33" width="8" height="7" fill="#38BDF8" rx="1" shape-rendering="auto" />
      <line x1="24" y1="33" x2="24" y2="40" stroke="#0284C7" stroke-width="0.8" shape-rendering="auto" />
      <rect x="21" y="34" width="2" height="1.5" fill="#FFFFFF" />

      <!-- Tiny Paws holding book -->
      <circle cx="18" cy="36" r="2" fill="#A78BFA" shape-rendering="auto" />
      <circle cx="30" cy="36" r="2" fill="#A78BFA" shape-rendering="auto" />

      <!-- Little Feet -->
      <rect x="17" y="42" width="4" height="3" fill="#6D28D9" rx="1" shape-rendering="auto" />
      <rect x="27" y="42" width="4" height="3" fill="#6D28D9" rx="1" shape-rendering="auto" />
    </svg>
  `
};

export const PET_CATALOG = [
  {
    id: 'bandage-nurse-realistic',
    name: 'Nurse',
    emoji: '🩺',
    svg: PET_SVGS['bandage-nurse-realistic']
  },
  {
    id: 'shinchan',
    name: 'Shinchan',
    emoji: '🎈',
    svg: PET_SVGS['shinchan']
  },
  {
    id: 'banana-cat',
    name: 'Banana Cat',
    emoji: '🍌',
    svg: PET_SVGS['banana-cat']
  },
  {
    id: 'moxie',
    name: 'Muksi',
    emoji: '📚',
    svg: PET_SVGS['moxie']
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
    <div class="apk-pet-avatar">
      ${pet.svg}
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
        p.textContent = i % 2 === 0 ? '♥' : '✧';
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
