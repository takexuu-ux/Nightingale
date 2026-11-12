// Cute Tiny Pixel-Art Ghost Pet for Nightingale Hinglish APK
// Roams softly across the viewport, sits on top of UI cards, reacts to hovers, clicks, drags & taps.

const STORAGE_KEY = 'nnl_apk_ghost_pet_enabled';

const EMOTIONS = {
  idle: { blush: true, mouth: 'tiny', eyes: 'normal', prop: '' },
  happy: { blush: true, mouth: 'smile', eyes: 'happy', prop: '' },
  curious: { blush: false, mouth: 'oh', eyes: 'wide', prop: 'question' },
  excited: { blush: true, mouth: 'open', eyes: 'star', prop: 'sparkle' },
  love: { blush: true, mouth: 'smile', eyes: 'heart', prop: 'heart' },
  sleepy: { blush: false, mouth: 'flat', eyes: 'sleepy', prop: 'zzz' },
  shy: { blush: true, mouth: 'wavy', eyes: 'shy', prop: 'blush' },
  spook: { blush: false, mouth: 'boo', eyes: 'wide', prop: 'boo' },
  proud: { blush: true, mouth: 'smirk', eyes: 'shades', prop: 'sparkle' }
};

function renderGhostPixelSvg(emotionName = 'idle', { blink = false, sitting = false, frame = 0 } = {}) {
  const emo = EMOTIONS[emotionName] || EMOTIONS.idle;
  const waveShift = sitting ? 0 : (frame % 2);
  const eyeStyle = blink ? 'happy' : emo.eyes;

  // 16x18 pixel grid rendered with crispEdges: cute ghost wearing a crisp white nurse coat + cap
  let eyesSvg = '';
  if (eyeStyle === 'normal') {
    eyesSvg = `
      <rect x="5" y="6" width="2" height="2" fill="#2E1A5B"/>
      <rect x="9" y="6" width="2" height="2" fill="#2E1A5B"/>
      <rect x="5" y="6" width="1" height="1" fill="#FFFFFF" opacity="0.9"/>
      <rect x="9" y="6" width="1" height="1" fill="#FFFFFF" opacity="0.9"/>
    `;
  } else if (eyeStyle === 'wide') {
    eyesSvg = `
      <rect x="4" y="5" width="3" height="3" fill="#2E1A5B"/>
      <rect x="9" y="5" width="3" height="3" fill="#2E1A5B"/>
      <rect x="5" y="6" width="1" height="1" fill="#FFFFFF"/>
      <rect x="10" y="6" width="1" height="1" fill="#FFFFFF"/>
    `;
  } else if (eyeStyle === 'happy') {
    eyesSvg = `
      <rect x="4" y="7" width="1" height="1" fill="#2E1A5B"/>
      <rect x="5" y="6" width="1" height="1" fill="#2E1A5B"/>
      <rect x="6" y="7" width="1" height="1" fill="#2E1A5B"/>
      <rect x="9" y="7" width="1" height="1" fill="#2E1A5B"/>
      <rect x="10" y="6" width="1" height="1" fill="#2E1A5B"/>
      <rect x="11" y="7" width="1" height="1" fill="#2E1A5B"/>
    `;
  } else if (eyeStyle === 'sleepy') {
    eyesSvg = `
      <rect x="4" y="7" width="3" height="1" fill="#4C1D95"/>
      <rect x="9" y="7" width="3" height="1" fill="#4C1D95"/>
    `;
  } else if (eyeStyle === 'shy') {
    eyesSvg = `
      <rect x="4" y="6" width="1" height="1" fill="#2E1A5B"/>
      <rect x="5" y="7" width="1" height="1" fill="#2E1A5B"/>
      <rect x="4" y="8" width="1" height="1" fill="#2E1A5B"/>
      <rect x="11" y="6" width="1" height="1" fill="#2E1A5B"/>
      <rect x="10" y="7" width="1" height="1" fill="#2E1A5B"/>
      <rect x="11" y="8" width="1" height="1" fill="#2E1A5B"/>
    `;
  } else if (eyeStyle === 'heart') {
    eyesSvg = `
      <rect x="4" y="6" width="1" height="1" fill="#F43F5E"/>
      <rect x="6" y="6" width="1" height="1" fill="#F43F5E"/>
      <rect x="4" y="7" width="3" height="1" fill="#F43F5E"/>
      <rect x="5" y="8" width="1" height="1" fill="#F43F5E"/>
      <rect x="9" y="6" width="1" height="1" fill="#F43F5E"/>
      <rect x="11" y="6" width="1" height="1" fill="#F43F5E"/>
      <rect x="9" y="7" width="3" height="1" fill="#F43F5E"/>
      <rect x="10" y="8" width="1" height="1" fill="#F43F5E"/>
    `;
  } else if (eyeStyle === 'star') {
    eyesSvg = `
      <rect x="5" y="5" width="1" height="3" fill="#6D28D9"/>
      <rect x="4" y="6" width="3" height="1" fill="#6D28D9"/>
      <rect x="10" y="5" width="1" height="3" fill="#6D28D9"/>
      <rect x="9" y="6" width="3" height="1" fill="#6D28D9"/>
      <rect x="5" y="6" width="1" height="1" fill="#F59E0B"/>
      <rect x="10" y="6" width="1" height="1" fill="#F59E0B"/>
    `;
  } else if (eyeStyle === 'shades') {
    eyesSvg = `
      <rect x="3" y="6" width="10" height="1" fill="#3B2378"/>
      <rect x="4" y="6" width="3" height="2" fill="#3B2378"/>
      <rect x="9" y="6" width="3" height="2" fill="#3B2378"/>
      <rect x="4" y="6" width="1" height="1" fill="#A78BFA"/>
      <rect x="9" y="6" width="1" height="1" fill="#A78BFA"/>
    `;
  }

  let mouthSvg = '';
  if (emo.mouth === 'smile' || emo.mouth === 'smirk') {
    mouthSvg = `<rect x="7" y="9" width="2" height="1" fill="#2E1A5B"/>`;
  } else if (emo.mouth === 'oh' || emo.mouth === 'boo') {
    mouthSvg = `<rect x="7" y="9" width="2" height="2" fill="#4C1D95"/>`;
  } else if (emo.mouth === 'open') {
    mouthSvg = `
      <rect x="6" y="9" width="4" height="1" fill="#2E1A5B"/>
      <rect x="7" y="10" width="2" height="1" fill="#FB7185"/>
    `;
  } else if (emo.mouth === 'wavy') {
    mouthSvg = `
      <rect x="6" y="9" width="1" height="1" fill="#2E1A5B"/>
      <rect x="7" y="10" width="2" height="1" fill="#2E1A5B"/>
      <rect x="9" y="9" width="1" height="1" fill="#2E1A5B"/>
    `;
  } else if (emo.mouth === 'flat') {
    mouthSvg = `<rect x="7" y="9" width="2" height="1" fill="#6D5E96"/>`;
  } else {
    mouthSvg = `<rect x="7" y="9" width="1" height="1" fill="#4C1D95"/>`;
  }

  const blushSvg = emo.blush
    ? `<rect x="3" y="8" width="2" height="1" fill="#FDA4AF" opacity="0.92"/>
       <rect x="11" y="8" width="2" height="1" fill="#FDA4AF" opacity="0.92"/>`
    : '';

  const armsSvg = emotionName === 'spook' || emotionName === 'excited'
    ? `<rect x="1" y="10" width="1" height="2" fill="#FFFFFF"/>
       <rect x="14" y="10" width="1" height="2" fill="#FFFFFF"/>
       <rect x="1" y="10" width="1" height="1" fill="#DDD6FE"/>
       <rect x="14" y="10" width="1" height="1" fill="#DDD6FE"/>`
    : `<rect x="1" y="11" width="1" height="3" fill="#FFFFFF"/>
       <rect x="14" y="11" width="1" height="3" fill="#FFFFFF"/>
       <rect x="1" y="14" width="1" height="1" fill="#E9D5FF"/>
       <rect x="14" y="14" width="1" height="1" fill="#E9D5FF"/>`;

  // Floating/sitting ghost tail below coat (y=16..17)
  const skirtSvg = sitting
    ? `<rect x="3" y="16" width="10" height="1" fill="#E2DAFA"/>
       <rect x="4" y="17" width="8" height="1" fill="#C4B5FD"/>`
    : (waveShift === 0
      ? `<rect x="2" y="16" width="3" height="2" fill="#EDE9FE"/>
         <rect x="6" y="16" width="4" height="2" fill="#EDE9FE"/>
         <rect x="11" y="16" width="3" height="2" fill="#EDE9FE"/>`
      : `<rect x="3" y="16" width="3" height="2" fill="#EDE9FE"/>
         <rect x="7" y="16" width="3" height="2" fill="#EDE9FE"/>
         <rect x="11" y="16" width="2" height="2" fill="#EDE9FE"/>`);

  return `
    <svg viewBox="0 0 16 18" shape-rendering="crispEdges" width="38" height="43" aria-hidden="true">
      <!-- White Nurse Cap -->
      <rect x="5" y="0" width="6" height="2" fill="#FFFFFF"/>
      <rect x="5" y="0" width="6" height="1" fill="#DDD6FE" opacity="0.6"/>
      <rect x="4" y="1" width="8" height="1" fill="#FFFFFF"/>
      <rect x="7" y="0" width="2" height="2" fill="#EF4444" opacity="0.88"/>
      <rect x="6" y="1" width="4" height="1" fill="#EF4444" opacity="0.88"/>
      <rect x="7" y="1" width="2" height="1" fill="#EF4444"/>

      <!-- Soft outline & ghost aura -->
      <rect x="4" y="2" width="8" height="1" fill="#7C5CE0" opacity="0.4"/>
      <rect x="2" y="3" width="12" height="13" fill="#7C5CE0" opacity="0.22"/>

      <!-- Soft Ghost Head (pearl lavender tint so white nurse coat clearly stands out) -->
      <rect x="4" y="2" width="8" height="2" fill="#F5F3FF"/>
      <rect x="3" y="3" width="10" height="7" fill="#F5F3FF"/>
      <rect x="2" y="4" width="12" height="6" fill="#F5F3FF"/>
      <rect x="3" y="4" width="1" height="5" fill="#EDE9FE"/>
      <rect x="12" y="4" width="1" height="6" fill="#DDD6FE"/>

      <!-- White Nurse Coat Body (y=10..15) -->
      <rect x="2" y="10" width="12" height="6" fill="#FFFFFF"/>
      <!-- Coat border / lapel shading -->
      <rect x="2" y="10" width="1" height="6" fill="#CBD5E1" opacity="0.55"/>
      <rect x="13" y="10" width="1" height="6" fill="#CBD5E1" opacity="0.55"/>
      <rect x="2" y="15" width="12" height="1" fill="#CBD5E1" opacity="0.6"/>
      <!-- Inner violet scrubs V-neck -->
      <rect x="6" y="10" width="4" height="2" fill="#7C5CE0"/>
      <rect x="7" y="12" width="2" height="2" fill="#7C5CE0"/>
      <!-- Crisp coat lapel fold & buttons -->
      <rect x="5" y="10" width="1" height="2" fill="#CBD5E1"/>
      <rect x="10" y="10" width="1" height="2" fill="#CBD5E1"/>
      <rect x="6" y="12" width="1" height="2" fill="#E2E8F0"/>
      <rect x="9" y="12" width="1" height="2" fill="#E2E8F0"/>
      <rect x="7" y="14" width="2" height="1" fill="#94A3B8"/>
      <!-- Coat chest pocket + tiny medical cross & stethoscope tube -->
      <rect x="10" y="13" width="2" height="2" fill="#E2E8F0"/>
      <rect x="10" y="13" width="1" height="1" fill="#FB7185"/>
      <rect x="4" y="10" width="1" height="3" fill="#4C1D95" opacity="0.72"/>
      <rect x="4" y="13" width="1" height="1" fill="#94A3B8"/>

      ${armsSvg}
      ${skirtSvg}
      ${blushSvg}
      ${eyesSvg}
      ${mouthSvg}
    </svg>
  `;
}

function renderBubbleHtml(emotionName) {
  if (emotionName === 'love') {
    return `<span class="apk-ghost-bubble is-love">&#9829;</span>`;
  }
  if (emotionName === 'spook') {
    return `<span class="apk-ghost-bubble">boo!</span>`;
  }
  if (emotionName === 'sleepy') {
    return `<span class="apk-ghost-bubble is-zzz">zZ</span>`;
  }
  if (emotionName === 'curious') {
    return `<span class="apk-ghost-bubble">?</span>`;
  }
  if (emotionName === 'excited' || emotionName === 'proud') {
    return `<span class="apk-ghost-bubble is-star">&#10022;</span>`;
  }
  if (emotionName === 'shy') {
    return `<span class="apk-ghost-bubble is-love">///</span>`;
  }
  return '';
}

export function isGhostPetEnabled() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'false';
  } catch {
    return true;
  }
}

export function setGhostPetEnabled(enabled) {
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
  } catch {}
  const el = document.getElementById('apk-ghost-pet');
  if (el) el.style.display = enabled ? 'flex' : 'none';
}

export function initGhostPet() {
  if (typeof window === 'undefined' || window.__nnlGhostPetMounted) return;
  window.__nnlGhostPetMounted = true;

  const root = document.createElement('div');
  root.id = 'apk-ghost-pet';
  root.setAttribute('role', 'button');
  root.setAttribute('tabindex', '0');
  root.setAttribute('aria-label', 'Playful pixel ghost pet');
  root.style.display = isGhostPetEnabled() ? 'flex' : 'none';

  root.innerHTML = `
    <div class="apk-ghost-prop" aria-hidden="true"></div>
    <div class="apk-ghost-sprite">${renderGhostPixelSvg('idle')}</div>
    <div class="apk-ghost-shadow" aria-hidden="true"></div>
  `;
  document.body.appendChild(root);

  const spriteEl = root.querySelector('.apk-ghost-sprite');
  const propEl = root.querySelector('.apk-ghost-prop');
  const shadowEl = root.querySelector('.apk-ghost-shadow');

  let x = Math.max(24, window.innerWidth - 88);
  let y = Math.max(88, Math.round(window.innerHeight * 0.24));
  let targetX = x;
  let targetY = y;
  let perchedCard = null;
  let perchOffsetRatio = 0.82; // Near card top-right or top-left ledge
  let facing = -1;
  let emotion = 'idle';
  let emotionUntil = 0;
  let pokeCount = 0;
  let lastPokeAt = 0;
  let blinkActive = false;
  let walkFrame = 0;
  let lastMoveTime = performance.now();
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragOriginX = 0;
  let dragOriginY = 0;
  let didDragMove = false;
  let lastRenderKey = '';

  const setEmotion = (next, durationMs = 2400) => {
    emotion = next;
    emotionUntil = durationMs > 0 ? performance.now() + durationMs : 0;
  };

  const getCandidateCards = () => {
    const selectors = [
      '.class-card:not(.hide)',
      '.subject-card:not(.hide)',
      '.note-doc-card:not(.hide)',
      '.sd-lecture-card:not(.hide)',
      '.apk-schedule-banner',
      '#auth-screen:not(.hide)'
    ];
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const nodes = Array.from(document.querySelectorAll(selectors.join(',')));
    return nodes.filter(el => {
      const r = el.getBoundingClientRect();
      return r.width > 120 && r.height > 44 && r.top > 48 && r.top < vh - 96 && r.left >= 0 && r.right <= vw + 20;
    });
  };

  const pickNextTarget = (preferredCard = null) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cards = getCandidateCards();

    if (preferredCard && preferredCard.isConnected) {
      const r = preferredCard.getBoundingClientRect();
      if (r.top > 42 && r.top < vh - 80) {
        perchedCard = preferredCard;
        perchOffsetRatio = 0.14 + Math.random() * 0.72;
        return;
      }
    }

    if (cards.length > 0 && Math.random() < 0.78) {
      perchedCard = cards[Math.floor(Math.random() * Math.min(cards.length, 10))];
      perchOffsetRatio = Math.random() < 0.5 ? (0.10 + Math.random() * 0.18) : (0.72 + Math.random() * 0.18);
      return;
    }

    perchedCard = null;
    targetX = 28 + Math.random() * Math.max(60, vw - 96);
    targetY = 64 + Math.random() * Math.max(80, vh - 190);
  };

  // Reaction cycles when tapped/clicked
  const reactToTap = () => {
    const now = performance.now();
    if (now - lastPokeAt < 1800) pokeCount++;
    else pokeCount = 1;
    lastPokeAt = now;

    if (pokeCount >= 4) {
      setEmotion('shy', 2600);
      root.classList.remove('is-hop');
      void root.offsetWidth;
      root.classList.add('is-hop');
      return;
    }

    const cycle = ['love', 'excited', 'spook', 'happy', 'proud', 'curious'];
    const chosen = cycle[Math.floor(Math.random() * cycle.length)];
    setEmotion(chosen, 2600);
    root.classList.remove('is-hop');
    void root.offsetWidth;
    root.classList.add('is-hop');

    if (chosen === 'excited' && Math.random() < 0.65) {
      pickNextTarget();
    }
  };

  // Hover & click around the page
  root.addEventListener('mouseenter', () => {
    if (!isDragging && emotion === 'idle') setEmotion('happy', 1800);
  });

  document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('#apk-ghost-pet')) return;
    if (!isGhostPetEnabled()) return;
    const card = e.target.closest('.class-card, .subject-card, .note-doc-card, .sd-lecture-card');
    if (card && Math.random() < 0.45) {
      setEmotion('excited', 1600);
      if (Math.random() < 0.5) pickNextTarget(card);
    }
  }, { passive: true });

  document.addEventListener('mouseover', (e) => {
    if (!isGhostPetEnabled() || isDragging) return;
    const card = e.target.closest('.class-card, .subject-card, .note-doc-card, .sd-lecture-card');
    if (card && card !== perchedCard && Math.random() < 0.25) {
      pickNextTarget(card);
      setEmotion('curious', 1500);
    }
  }, { passive: true });

  // Pointer drag / tap support (works on both Android touch and mouse)
  root.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    isDragging = true;
    didDragMove = false;
    perchedCard = null;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragOriginX = x;
    dragOriginY = y;
    root.setPointerCapture?.(e.pointerId);
    setEmotion('curious', 0);
  });

  root.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) didDragMove = true;
    x = Math.max(8, Math.min(window.innerWidth - 48, dragOriginX + dx));
    y = Math.max(12, Math.min(window.innerHeight - 64, dragOriginY + dy));
    targetX = x;
    targetY = y;
    if (Math.abs(dx) > 2) facing = dx >= 0 ? 1 : -1;
    setEmotion('shy', 0);
  });

  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    if (!didDragMove) {
      reactToTap();
    } else {
      // Snap onto nearest card under drop point if close
      const cards = getCandidateCards();
      const nearest = cards.find(c => {
        const r = c.getBoundingClientRect();
        return x >= r.left - 24 && x <= r.right + 24 && Math.abs(y - (r.top - 30)) < 68;
      });
      if (nearest) {
        const r = nearest.getBoundingClientRect();
        perchedCard = nearest;
        perchOffsetRatio = Math.max(0.08, Math.min(0.92, (x - r.left) / Math.max(1, r.width)));
        setEmotion('happy', 1800);
      } else {
        setEmotion('proud', 1600);
      }
    }
  };
  root.addEventListener('pointerup', endDrag);
  root.addEventListener('pointercancel', endDrag);

  // Periodic roam, blink, and sleepy timers
  setInterval(() => {
    if (!isGhostPetEnabled() || isDragging) return;
    if (Math.random() < 0.72) {
      blinkActive = true;
      setTimeout(() => { blinkActive = false; }, 140);
    }
  }, 3400);

  setInterval(() => {
    if (!isGhostPetEnabled() || isDragging) return;
    if (Math.random() < 0.65) {
      pickNextTarget();
    } else if (perchedCard) {
      // Fall asleep gently while perched on a card
      setEmotion(Math.random() < 0.55 ? 'sleepy' : 'happy', 3200);
    }
  }, 7500);

  // Initial perch onto first visible card after short settle
  setTimeout(() => pickNextTarget(), 900);

  const tick = (now) => {
    if (isGhostPetEnabled()) {
      const quizOpen = document.querySelector('#quiz-viewer:not(.hide), #pdf-modal:not(.hide), #recording-viewer:not(.hide)');
      if (quizOpen) {
        root.style.opacity = '0.28';
        root.style.pointerEvents = 'none';
      } else {
        root.style.opacity = '1';
        root.style.pointerEvents = 'auto';
      }

      if (!isDragging) {
        if (perchedCard && perchedCard.isConnected) {
          const r = perchedCard.getBoundingClientRect();
          if (r.top < 36 || r.top > window.innerHeight - 64) {
            pickNextTarget();
          } else {
            targetX = Math.max(14, Math.min(window.innerWidth - 54, r.left + r.width * perchOffsetRatio - 19));
            targetY = Math.max(14, r.top - 32);
          }
        }

        const dx = targetX - x;
        const dy = targetY - y;
        const dist = Math.hypot(dx, dy);

        if (dist > 1.5) {
          x += dx * 0.065;
          y += dy * 0.065;
          if (Math.abs(dx) > 0.6) facing = dx > 0 ? 1 : -1;
          lastMoveTime = now;
        }
      }

      if (emotionUntil > 0 && now > emotionUntil) {
        emotion = 'idle';
        emotionUntil = 0;
      }

      const isMoving = isDragging || Math.hypot(targetX - x, targetY - y) > 4;
      const isSitting = !isMoving && Boolean(perchedCard && perchedCard.isConnected);
      const bob = isDragging ? 0 : (isSitting ? Math.sin(now * 0.004) * 1.4 : Math.sin(now * 0.007) * 3.8);

      walkFrame = Math.floor(now / 220) % 2;
      root.style.transform = `translate3d(${x.toFixed(1)}px, ${(y + bob).toFixed(1)}px, 0)`;
      spriteEl.style.transform = `scaleX(${facing})`;
      shadowEl.style.transform = `scale(${isSitting ? 1 : 0.78})`;
      shadowEl.style.opacity = isSitting ? '0.24' : '0.14';

      const renderKey = `${emotion}|${blinkActive ? 1 : 0}|${isSitting ? 1 : 0}|${isMoving ? walkFrame : 0}`;
      if (renderKey !== lastRenderKey) {
        lastRenderKey = renderKey;
        spriteEl.innerHTML = renderGhostPixelSvg(emotion, { blink: blinkActive, sitting: isSitting, frame: walkFrame });
        propEl.innerHTML = renderBubbleHtml(emotion);
      }
    }
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}
