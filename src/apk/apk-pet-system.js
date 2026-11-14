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
  {
    id: 'bandage-nurse-realistic',
    name: 'Bandage Nurse',
    tag: 'Realistic Nurse',
    desc: '3D figurine nurse with platform shoes & medical trim',
    emoji: '🩺'
  },
  {
    id: 'shinchan',
    name: 'Shinchan',
    tag: 'Mischievous',
    desc: 'Classic energetic companion in red & yellow',
    emoji: '🎈'
  },
  {
    id: 'banana-cat',
    name: 'Banana Cat',
    tag: 'Viral Meme',
    desc: 'Quirky early-3D banana cat companion',
    emoji: '🍌'
  },
  {
    id: 'moxie',
    name: 'Moxie',
    tag: 'Librarian',
    desc: 'Sage cardigan & cozy strawberry-blonde buddy',
    emoji: '📚'
  },
  {
    id: 'white-cat',
    name: 'Winter Cat',
    tag: 'Cute Kitten',
    desc: 'Gentle pure white companion cat',
    emoji: '🐾'
  },
  {
    id: 'yuki-cream-rabbit',
    name: 'Yuki Bunny',
    tag: 'Gentle Rabbit',
    desc: 'Fluffy cream rabbit with long pink ears',
    emoji: '🐰'
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
    return localStorage.getItem(STORAGE_ENABLED_KEY) !== 'false';
  } catch {
    return true;
  }
}

export function setPetEnabled(enabled) {
  try {
    localStorage.setItem(STORAGE_ENABLED_KEY, enabled ? 'true' : 'false');
  } catch {}
  const el = document.getElementById('apk-companion-pet');
  if (el) el.style.display = enabled ? 'flex' : 'none';
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

  // Curated UI Spots tailored for Nightingale screens
  const getCuratedSpots = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const spots = [];

    const isElemVisible = (el) => {
      if (!el || !el.isConnected) return false;
      const st = window.getComputedStyle(el);
      if (st.display === 'none' || st.visibility === 'hidden' || parseFloat(st.opacity) === 0) return false;
      const r = el.getBoundingClientRect();
      return r.width > 8 && r.height > 8 && r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
    };

    // 1. Beside Live Classes Title / Hero Title
    const titleEl = Array.from(document.querySelectorAll('#apk-live-topbar .apk-editorial-title, .notes-hero-title, .tests-hero-title, .page-hero-title')).find(isElemVisible);
    if (titleEl) {
      spots.push({
        id: 'beside-live-title',
        sitting: false,
        facing: -1,
        compute: () => {
          if (!isElemVisible(titleEl)) return null;
          const r = titleEl.getBoundingClientRect();
          let textRight = r.right;
          try {
            const firstText = Array.from(titleEl.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
            if (firstText) {
              const range = document.createRange();
              range.selectNodeContents(firstText);
              const tr = range.getBoundingClientRect();
              if (tr.width > 8) textRight = tr.right;
            }
          } catch (_) {}
          const batchEl = document.querySelector('.apk-batch-pill-btn');
          let maxRight = vw - 70;
          if (batchEl && isElemVisible(batchEl)) {
            const br = batchEl.getBoundingClientRect();
            if (Math.abs(br.top - r.top) < 48) {
              maxRight = Math.min(maxRight, br.left - 66);
            }
          }
          const px = getViewportClamp(textRight + 6, Math.max(12, r.left), Math.max(16, maxRight));
          const py = getViewportClamp(r.top + r.height / 2 - 38, 6, vh - 86);
          return { x: px, y: py, facing: -1, sitting: false };
        }
      });
    }

    // 2. Beside Batch Selection Pill
    const batchEl = Array.from(document.querySelectorAll('.apk-batch-pill-btn, #header-batch-btn')).find(isElemVisible);
    if (batchEl) {
      spots.push({
        id: 'beside-batch',
        sitting: false,
        facing: 1,
        compute: () => {
          if (!isElemVisible(batchEl)) return null;
          const r = batchEl.getBoundingClientRect();
          const preferLeft = r.left >= 70;
          const px = preferLeft
            ? getViewportClamp(r.left - 62, 8, vw - 66)
            : getViewportClamp(r.right + 8, 8, vw - 66);
          const py = getViewportClamp(r.top + r.height / 2 - 30, 6, vh - 72);
          return { x: px, y: py, facing: preferLeft ? 1 : -1, sitting: false };
        }
      });
    }

    // 3. Top of Live Navigation Tab
    const liveBtn = document.getElementById('tab-live');
    if (isElemVisible(liveBtn)) {
      spots.push({
        id: 'top-live-btn',
        sitting: true,
        facing: 1,
        compute: () => {
          if (!isElemVisible(liveBtn)) return null;
          const r = liveBtn.getBoundingClientRect();
          const px = getViewportClamp(r.left + r.width / 2 - 28, 6, vw - 66);
          const py = getViewportClamp(r.top - 46, 6, vh - 72);
          return { x: px, y: py, facing: 1, sitting: true };
        }
      });
    }

    // 4. Beside Logo Badge
    const logoEl = Array.from(document.querySelectorAll('.header-logo, #auth-screen:not(.hide) .apk-brand-inline-row .apk-logo-badge')).find(isElemVisible);
    if (logoEl) {
      spots.push({
        id: 'below-logo',
        sitting: false,
        facing: 1,
        compute: () => {
          if (!isElemVisible(logoEl)) return null;
          const r = logoEl.getBoundingClientRect();
          const px = getViewportClamp(r.left + r.width / 2 - 28, 6, vw - 66);
          const py = getViewportClamp(r.bottom + 6, 8, vh - 72);
          return { x: px, y: py, facing: 1, sitting: false };
        }
      });
    }

    return spots;
  };

  let x = Math.max(16, Math.round(window.innerWidth * 0.16));
  let y = 76;
  let targetX = x;
  let targetY = y;
  let activeSpot = null;
  let spotSitting = false;
  let facing = 1;
  let preferredFacing = 1;

  // Animation row states:
  // 0: idle, 1: walk/run, 3: wave, 4: jump, 5: scare/fail, 6: sit/rest
  let animRow = 0;
  let animCol = 0;
  let animRowOverrideUntil = 0;
  let lastFrameTime = 0;
  let lastSpookAt = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragOriginX = 0;
  let dragOriginY = 0;
  let didDragMove = false;

  const spawnBurst = (symbol = '♥', color = '#EC4899') => {
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

  const playSpecialAnim = (row, durationMs = 2400, burstSymbol = null, burstColor = '#7C5CE0') => {
    animRow = row;
    animRowOverrideUntil = durationMs > 0 ? performance.now() + durationMs : 0;
    if (burstSymbol) spawnBurst(burstSymbol, burstColor);
  };

  const applySpot = (spot, immediate = false) => {
    if (!spot) return false;
    const pos = spot.compute();
    if (!pos) return false;
    activeSpot = spot;
    targetX = pos.x;
    targetY = pos.y;
    preferredFacing = pos.facing;
    spotSitting = Boolean(pos.sitting);
    if (immediate) {
      x = pos.x;
      y = pos.y;
      facing = pos.facing;
    }
    return true;
  };

  const pickNextTarget = (preferredSpotId = null, immediate = false) => {
    const spots = getCuratedSpots();
    if (spots.length === 0) {
      activeSpot = null;
      return;
    }

    if (preferredSpotId) {
      const matched = spots.find(s => s.id === preferredSpotId);
      if (matched && applySpot(matched, immediate)) return;
    }

    const others = activeSpot && spots.length > 1
      ? spots.filter(s => s.id !== activeSpot.id)
      : spots;
    const chosen = others[Math.floor(Math.random() * others.length)];
    applySpot(chosen, immediate);
  };

  const reactToTap = () => {
    // Alternate between wave (row 3) and jump (row 4)
    const pickJump = Math.random() < 0.5;
    const row = pickJump ? 4 : 3;
    const sym = pickJump ? '★' : '♥';
    const clr = pickJump ? '#F59E0B' : '#E11D48';
    playSpecialAnim(row, 2600, sym, clr);

    root.classList.remove('is-hop');
    void root.offsetWidth;
    root.classList.add('is-hop');

    if (Math.random() < 0.35) {
      setTimeout(() => pickNextTarget(), 800);
    }
  };

  root.addEventListener('pointerenter', () => {
    if (!isDragging && performance.now() > animRowOverrideUntil) {
      playSpecialAnim(3, 1800, '♥', '#EC4899');
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
      const spots = getCuratedSpots();
      let bestSpot = null;
      let bestDist = Infinity;
      for (const s of spots) {
        const pos = s.compute();
        if (!pos) continue;
        const d = Math.hypot(pos.x - x, pos.y - y);
        if (d < bestDist && d < 180) {
          bestDist = d;
          bestSpot = s;
        }
      }
      if (bestSpot) {
        applySpot(bestSpot);
        playSpecialAnim(3, 2200, '♥', '#E11D48');
      } else {
        playSpecialAnim(0, 0);
      }
    }
  };
  root.addEventListener('pointerup', endDrag);
  root.addEventListener('pointercancel', endDrag);

  // Periodic ambient movement & life
  setInterval(() => {
    if (!isPetEnabled() || isDragging) return;
    if (Math.random() < 0.35) {
      pickNextTarget();
    } else if (Math.random() < 0.45 && performance.now() > animRowOverrideUntil) {
      playSpecialAnim(Math.random() < 0.5 ? 3 : 0, 2800);
    }
  }, 14000);

  setTimeout(() => pickNextTarget('top-live-btn', true), 400);

  // Animation frame loop
  const tick = (now) => {
    if (isPetEnabled()) {
      const modalOpen = document.querySelector('#quiz-viewer:not(.hide), #pdf-modal:not(.hide), #recording-viewer:not(.hide)');
      if (modalOpen) {
        root.style.opacity = '0.24';
        root.style.pointerEvents = 'none';
      } else {
        root.style.opacity = '1';
        root.style.pointerEvents = 'auto';
      }

      if (!isDragging) {
        const synced = activeSpot && activeSpot.compute();
        if (synced) {
          targetX = synced.x;
          targetY = synced.y;
          preferredFacing = synced.facing;
          spotSitting = Boolean(synced.sitting);
        } else {
          pickNextTarget();
        }

        const dx = targetX - x;
        const dy = targetY - y;
        const dist = Math.hypot(dx, dy);

        if (dist > 1.5) {
          x += dx * 0.026;
          y += dy * 0.026;
          if (Math.abs(dx) > 0.8) facing = dx >= 0 ? 1 : -1;
        } else {
          facing = preferredFacing;
        }
      }

      const isMoving = isDragging || Math.hypot(targetX - x, targetY - y) > 3.5;
      const isSitting = !isMoving && spotSitting;

      // Determine active sprite row
      if (animRowOverrideUntil > 0 && now < animRowOverrideUntil) {
        // keep override
      } else {
        animRowOverrideUntil = 0;
        if (isMoving) {
          animRow = 1; // walk/run
        } else if (isSitting) {
          animRow = 6; // sit/rest
        } else {
          animRow = 0; // idle
        }
      }

      // Step frame column (0 to 7) at ~10 fps
      if (now - lastFrameTime > 95) {
        lastFrameTime = now;
        animCol = (animCol + 1) % 8;
      }

      const bob = isDragging ? 0 : (isSitting ? Math.sin(now * 0.0028) * 1.1 : Math.sin(now * 0.0036) * 2.0);

      root.style.transform = `translate3d(${x.toFixed(1)}px, ${(y + bob).toFixed(1)}px, 0)`;
      spriteEl.style.transform = `scaleX(${facing})`;
      spriteEl.style.setProperty('--col', animCol);
      spriteEl.style.setProperty('--row', animRow);

      shadowEl.style.transform = `scale(${isSitting ? 1.05 : 0.82})`;
      shadowEl.style.opacity = isSitting ? '0.24' : '0.14';
    }
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}
