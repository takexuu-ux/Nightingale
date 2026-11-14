// Codex Companion Pet System for Nightingale Hinglish APK & Web
// High-performance spritesheet companion supporting 6 unique companions:
// 1. Bandage Nurse (bandage-nurse-realistic - Default)
// 2. Shinchan (shinchan)
// 3. Banana Cat (banana-cat)
// 4. Moxie (moxie)
// 5. Winter the Cat (white-cat)
// 6. Yuki Bunny (yuki-cream-rabbit)
//
// Smooth 60fps physics, landmarks anchoring, tap waves/hops, drag-and-drop,
// fast-scroll scare reaction (row 5 failed/scared sprite + hop), zero annoying text bubbles.

const STORAGE_PET_KEY = 'nnl_companion_pet_id';
const STORAGE_ENABLED_KEY = 'nnl_companion_pet_enabled';

export const PET_CATALOG = [
  { id: 'bandage-nurse-realistic', name: 'Nurse', emoji: '🩺' },
  { id: 'shinchan', name: 'Shinchan', emoji: '🎈' },
  { id: 'banana-cat', name: 'Banana Cat', emoji: '🍌' },
  { id: 'moxie', name: 'Moxie', emoji: '📚' },
  { id: 'white-cat', name: 'White Cat', emoji: '🐾' },
  { id: 'yuki-cream-rabbit', name: 'Yuki Bunny', emoji: '🐰' }
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
  if (!PET_CATALOG.some(p => p.id === petId)) return;
  try {
    localStorage.setItem(STORAGE_PET_KEY, petId);
  } catch (_) {}
  window.__nnlActivePetId = petId;
  const sprite = document.querySelector('#apk-companion-pet .apk-pet-sprite');
  if (sprite) {
    sprite.style.backgroundImage = `url('./pets/${petId}/spritesheet.webp')`;
  }
  const root = document.getElementById('apk-companion-pet');
  if (root) {
    root.classList.remove('is-hop');
    void root.offsetWidth;
    root.classList.add('is-hop');
  }
}

export function isPetEnabled() {
  try {
    const val = localStorage.getItem(STORAGE_ENABLED_KEY);
    if (val === 'false') return false;
    if (val === 'true') return true;
  } catch {}
  return false; // Default OFF until user explicitly enables
}

export function setPetEnabled(enabled) {
  try {
    localStorage.setItem(STORAGE_ENABLED_KEY, enabled ? 'true' : 'false');
  } catch {}
  const el = document.getElementById('apk-companion-pet');
  if (el) {
    el.style.display = enabled ? 'flex' : 'none';
    el.classList.toggle('hide', !enabled);
  }
  document.body.classList.toggle('apk-pet-disabled', !enabled);
}

export function initPetSystem() {
  if (typeof window === 'undefined' || window.__nnlPetMounted) return;
  window.__nnlPetMounted = true;

  const currentPetId = getActivePetId();
  window.__nnlActivePetId = currentPetId;

  const root = document.createElement('div');
  root.id = 'apk-companion-pet';
  root.setAttribute('role', 'button');
  root.setAttribute('tabindex', '0');
  root.setAttribute('aria-label', 'Classroom companion pet');
  root.style.display = isPetEnabled() ? 'flex' : 'none';

  root.innerHTML = `
    <div class="apk-pet-bursts" aria-hidden="true"></div>
    <div class="apk-pet-sprite" style="background-image: url('./pets/${currentPetId}/spritesheet.webp')"></div>
    <div class="apk-pet-shadow" aria-hidden="true"></div>
  `;
  document.body.appendChild(root);

  const spriteEl = root.querySelector('.apk-pet-sprite');
  const burstsEl = root.querySelector('.apk-pet-bursts');
  const shadowEl = root.querySelector('.apk-pet-shadow');

  const getViewportClamp = (val, min, max) => Math.max(min, Math.min(max, val));

  // Natural wandering spots along the bottom of the screen
  const getRandomWanderSpot = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const bottomY = getViewportClamp(vh - 96, 20, vh - 70);
    // Pick from distinct zones: left, mid-left, center, mid-right, right
    const zones = [
      24,
      Math.max(30, Math.floor(vw * 0.22)),
      Math.max(30, Math.floor(vw * 0.48)),
      Math.max(30, Math.floor(vw * 0.72)),
      Math.max(30, vw - 60)
    ];
    const targetZoneX = zones[Math.floor(Math.random() * zones.length)];
    const finalX = getViewportClamp(targetZoneX + (Math.random() - 0.5) * 30, 20, vw - 54);
    return {
      x: finalX,
      y: bottomY,
      facing: targetZoneX > (vw / 2) ? -1 : 1
    };
  };

  const initPos = getRandomWanderSpot();
  let x = initPos.x;
  let y = initPos.y;
  let targetX = x;
  let targetY = y;
  let facing = 1;
  let isMoving = false;
  let nextWanderTime = performance.now() + 6000;

  const pickNextWander = () => {
    const spot = getRandomWanderSpot();
    targetX = spot.x;
    targetY = spot.y;
    facing = targetX >= x ? 1 : -1;
    isMoving = true;
    nextWanderTime = performance.now() + 9000 + Math.random() * 8000;
  };

  // Animation row states: Row 0 is continuous breathing/idle; Row 1 is walk
  let animRow = 0;
  let animCol = 0;
  let lastFrameTime = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragOriginX = 0;
  let dragOriginY = 0;
  let didDragMove = false;

  const spawnBurst = (symbol = '♥', color = '#A78BFA') => {
    if (!burstsEl) return;
    for (let i = 0; i < 4; i++) {
      const p = document.createElement('span');
      p.className = 'apk-pet-burst-item';
      p.textContent = i % 2 === 0 ? symbol : '✦';
      p.style.color = color;
      p.style.setProperty('--gx', `${(Math.random() - 0.5) * 58}px`);
      p.style.setProperty('--gy', `${-22 - Math.random() * 32}px`);
      burstsEl.appendChild(p);
      setTimeout(() => p.remove(), 750);
    }
  };

  const reactToTap = () => {
    spawnBurst('♥', '#A78BFA');
    root.classList.remove('is-hop');
    void root.offsetWidth;
    root.classList.add('is-hop');
    // After tap, occasionally start wandering
    setTimeout(() => {
      pickNextWander();
    }, 600);
  };

  root.addEventListener('pointerenter', () => {
    if (!isDragging) {
      spawnBurst('✦', '#F0C69E');
    }
  });

  // Fast-scroll scare reaction:
  // User loved the scared expression when scrolling fast!
  // Plays row 5 (failed / panic / shocked) + scared hop + exclamation
  const scrollTrackMap = new WeakMap();
  const handleFastScroll = (e) => {
    if (!isPetEnabled() || isDragging) return;
    const scroller = (e.target === document || e.target === window)
      ? (document.scrollingElement || document.documentElement)
      : e.target;
    if (!scroller || typeof scroller.scrollTop !== 'number') return;

    const now = performance.now();
    const curTop = (scroller === document.scrollingElement || scroller === document.documentElement)
      ? (window.scrollY || scroller.scrollTop || 0)
      : scroller.scrollTop;
    const prev = scrollTrackMap.get(scroller);
    scrollTrackMap.set(scroller, { top: curTop, at: now });
    if (!prev) return;

    const dt = Math.max(8, now - prev.at);
    const delta = Math.abs(curTop - prev.top);
    const velocity = delta / dt;

    if ((delta > 40 && velocity > 0.8) || velocity > 1.25) {
      if (now - lastSpookAt > 1100) {
        lastSpookAt = now;
        // Row 5 is the startled/failed/shocked spritesheet frame
        playSpecialAnim(5, 2400, '!', '#F43F5E');
        root.classList.remove('is-hop');
        void root.offsetWidth;
        root.classList.add('is-hop');
      }
    }
  };
  window.addEventListener('scroll', handleFastScroll, { capture: true, passive: true });

  // Drag and drop interaction
  root.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    isDragging = true;
    didDragMove = false;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragOriginX = x;
    dragOriginY = y;
    root.setPointerCapture?.(e.pointerId);
    playSpecialAnim(4, 0); // hop/air float
  });

  root.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) didDragMove = true;
    x = Math.max(8, Math.min(window.innerWidth - 64, dragOriginX + dx));
    y = Math.max(12, Math.min(window.innerHeight - 84, dragOriginY + dy));
    targetX = x;
    targetY = y;
    if (Math.abs(dx) > 2) facing = dx >= 0 ? 1 : -1;
  });

  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    if (!didDragMove) {
      reactToTap();
    } else {
      targetX = x;
      targetY = y;
      isMoving = false;
      nextWanderTime = performance.now() + 10000;
    }
  };
  root.addEventListener('pointerup', endDrag);
  root.addEventListener('pointercancel', endDrag);

  // Animation frame loop
  const tick = (now) => {
    if (!isPetEnabled()) {
      if (root.style.display !== 'none') {
        root.style.display = 'none';
        root.classList.add('hide');
      }
      requestAnimationFrame(tick);
      return;
    }

    if (root.style.display !== 'flex') {
      root.style.display = 'flex';
      root.classList.remove('hide');
    }

    const modalOpen = document.querySelector('#quiz-viewer:not(.hide), #pdf-modal:not(.hide), #recording-viewer:not(.hide)');
    if (modalOpen) {
      root.style.opacity = '0.24';
      root.style.pointerEvents = 'none';
    } else {
      root.style.opacity = '1';
      root.style.pointerEvents = 'auto';
    }

    // Wandering trigger: if idle long enough, stroll to a new location
    if (!isDragging && now > nextWanderTime) {
      pickNextWander();
    }

    if (!isDragging) {
      const dx = targetX - x;
      const dy = targetY - y;
      const dist = Math.hypot(dx, dy);

      if (dist > 3.0) {
        x += dx * 0.024;
        y += dy * 0.024;
        facing = dx >= 0 ? 1 : -1;
        isMoving = true;
      } else {
        isMoving = false;
      }
    }

    // Row 1 for walking, Row 0 for resting breathing
    animRow = (isMoving || isDragging) ? 1 : 0;

    // Continuous 5fps animation loop
    if (now - lastFrameTime > 190) {
      lastFrameTime = now;
      animCol = (animCol + 1) % 8;
      spriteEl.style.setProperty('--col', animCol);
      spriteEl.style.setProperty('--row', animRow);
    }

    const bob = (isDragging || isMoving) ? 0 : Math.sin(now * 0.002) * 0.8;

    root.style.transform = `translate3d(${x.toFixed(1)}px, ${(y + bob).toFixed(1)}px, 0)`;
    spriteEl.style.transform = `scaleX(${facing})`;

    shadowEl.style.transform = `scale(${isMoving ? 0.82 : 1.05})`;
    shadowEl.style.opacity = isMoving ? '0.14' : '0.22';

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}
