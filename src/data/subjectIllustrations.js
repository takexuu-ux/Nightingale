// Nightingale Subject Vector Illustrations — High-Resolution, Transparent Background, Cohesive Violet/Lavender Theme
// Minimal, aesthetic, luxury glassmorphism design that strictly defines each nursing & medical subject

export const SUBJECT_ILLUSTRATIONS = {
  // 1. Nursing Foundation / FON — Florence Nightingale Oil Lamp of Care + Stethoscope
  nursing_foundation: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="fonGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.30"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="fonViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#DDD6FE"/>
          <stop offset="50%" stop-color="#A78BFA"/>
          <stop offset="100%" stop-color="#7C3AED"/>
        </linearGradient>
      </defs>
      <!-- Stethoscope Contour -->
      <path d="M 22 28 C 16 38, 18 58, 40 58 C 62 58, 64 38, 58 28" stroke="url(#fonViolet)" stroke-width="2.6" stroke-linecap="round" fill="none"/>
      <path d="M 22 28 C 22 20, 29 16, 32 16 M 58 28 C 58 20, 51 16, 48 16" stroke="url(#fonViolet)" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <circle cx="32" cy="16" r="2" fill="#FFFFFF"/>
      <circle cx="48" cy="16" r="2" fill="#FFFFFF"/>
      <path d="M 40 58 L 40 65" stroke="url(#fonViolet)" stroke-width="2.6" stroke-linecap="round"/>
      <circle cx="40" cy="67" r="4" fill="rgba(167, 139, 250, 0.4)" stroke="#DDD6FE" stroke-width="1.8"/>
      <!-- Florence Nightingale Iconic Oil Lamp -->
      <path d="M 26 46 Q 30 52 40 52 Q 50 52 54 46 L 56 42 Q 40 44 24 42 Z" fill="rgba(124, 58, 237, 0.35)" stroke="url(#fonViolet)" stroke-width="1.8"/>
      <path d="M 33 52 L 31 56 L 49 56 L 47 52 Z" fill="rgba(124, 58, 237, 0.35)" stroke="url(#fonViolet)" stroke-width="1.5"/>
      <path d="M 24 42 Q 17 38 18 33 Q 22 30 26 36 L 27 42" fill="none" stroke="url(#fonViolet)" stroke-width="2" stroke-linecap="round"/>
      <path d="M 52 42 Q 62 40 64 36 Q 63 34 58 37" fill="none" stroke="url(#fonViolet)" stroke-width="2" stroke-linecap="round"/>
      <!-- Lamp Flame -->
      <path d="M 64 35 C 64 35, 68 27, 65 24 C 62 27, 61 31, 62 34 Z" fill="url(#fonViolet)"/>
      <path d="M 64 34 C 64 34, 66 29, 64 27 C 63 29, 63 31, 63 33 Z" fill="#FFFFFF"/>
      <!-- Caring Red Cross inside Lamp Body -->
      <path d="M 40 44 L 40 50 M 37 47 L 43 47" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
  `,

  // 2. Anatomy & Physiology — Anatomical Heart + Aorta Arch + ECG Cardiac Wave
  anatomy: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="anaGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#A78BFA" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="anaViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#DDD6FE"/>
          <stop offset="50%" stop-color="#A78BFA"/>
          <stop offset="100%" stop-color="#7C3AED"/>
        </linearGradient>
      </defs>
      <!-- Anatomical Heart Organ -->
      <path d="M 40 32 C 34 24, 23 27, 26 38 C 28 45, 36 53, 40 58 C 44 53, 52 45, 54 38 C 57 27, 46 24, 40 32 Z" fill="rgba(124, 58, 237, 0.32)" stroke="url(#anaViolet)" stroke-width="2"/>
      <!-- Aorta & Pulmonary Arteries -->
      <path d="M 35 27 C 35 20, 42 16, 46 19 C 48 21, 47 25, 45 27" fill="none" stroke="url(#anaViolet)" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M 42 20 L 44 14 M 46 21 L 49 16" stroke="url(#anaViolet)" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M 33 27 C 31 22, 29 18, 27 16" stroke="#DDD6FE" stroke-width="2" stroke-linecap="round"/>
      <!-- Arterial Pulse Wave -->
      <path d="M 18 45 L 28 45 L 32 37 L 36 51 L 40 41 L 43 47 L 46 45 L 62 45" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // 3. Child Health Nursing / Pediatrics — Tender Infant Footprint + Caring Embrace
  pediatrics: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pedGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="pedViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#EDE9FE"/>
          <stop offset="60%" stop-color="#A78BFA"/>
          <stop offset="100%" stop-color="#7C3AED"/>
        </linearGradient>
      </defs>
      <!-- Protective Caring Hands Frame -->
      <path d="M 18 52 C 16 38, 24 24, 40 22 C 56 24, 64 38, 62 52" stroke="url(#pedViolet)" stroke-width="1.8" stroke-dasharray="3 3" stroke-linecap="round" fill="none"/>
      <!-- Cute Infant Footprint — Sole & Heel -->
      <ellipse cx="38" cy="44" rx="8" ry="12" fill="rgba(124, 58, 237, 0.35)" stroke="url(#pedViolet)" stroke-width="1.8" transform="rotate(-8 38 44)"/>
      <ellipse cx="36" cy="56" rx="6.5" ry="7.5" fill="rgba(124, 58, 237, 0.35)" stroke="url(#pedViolet)" stroke-width="1.8" transform="rotate(-8 36 56)"/>
      <!-- Baby Toes -->
      <ellipse cx="44" cy="27" rx="3.5" ry="4.5" fill="url(#pedViolet)" transform="rotate(-5 44 27)"/>
      <ellipse cx="37" cy="28" rx="2.5" ry="3.5" fill="url(#pedViolet)" transform="rotate(-8 37 28)"/>
      <ellipse cx="32" cy="30" rx="2.2" ry="3" fill="url(#pedViolet)" transform="rotate(-10 32 30)"/>
      <ellipse cx="27" cy="33" rx="1.8" ry="2.4" fill="url(#pedViolet)" transform="rotate(-12 27 33)"/>
      <ellipse cx="23" cy="37" rx="1.5" ry="2" fill="url(#pedViolet)" transform="rotate(-15 23 37)"/>
      <!-- Warm Little Sparkle / Star of Care -->
      <path d="M 54 36 L 56 31 L 58 36 L 63 38 L 58 40 L 56 45 L 54 40 L 49 38 Z" fill="#FFFFFF" opacity="0.9"/>
    </svg>
  `,

  // 4. Adult Health Nursing (Medicine) / MSN — Clinical Stethoscope + Vitals Wave
  medicine: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="medGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.30"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="medViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#DDD6FE"/>
          <stop offset="60%" stop-color="#8E74E5"/>
          <stop offset="100%" stop-color="#6C4FD6"/>
        </linearGradient>
      </defs>
      <!-- Dual Stethoscope Binaural Tubes -->
      <path d="M 28 20 C 28 28, 33 34, 40 34 C 47 34, 52 28, 52 20" stroke="url(#medViolet)" stroke-width="2.6" stroke-linecap="round" fill="none"/>
      <circle cx="28" cy="20" r="2.4" fill="#FFFFFF"/>
      <circle cx="52" cy="20" r="2.4" fill="#FFFFFF"/>
      <!-- Flexible Tube Loop -->
      <path d="M 40 34 C 40 48, 22 46, 22 56 C 22 64, 38 66, 48 58" stroke="url(#medViolet)" stroke-width="2.8" stroke-linecap="round" fill="none"/>
      <!-- Chest Piece Diaphragm -->
      <circle cx="52" cy="54" r="9" fill="rgba(124, 58, 237, 0.35)" stroke="url(#medViolet)" stroke-width="2"/>
      <circle cx="52" cy="54" r="5" fill="#FFFFFF" opacity="0.9"/>
      <!-- Telemetry ECG Rhythm across chest -->
      <path d="M 16 38 L 26 38 L 29 30 L 33 46 L 37 34 L 40 40 L 43 38 L 58 38" stroke="#DDD6FE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // 5. Adult Health Nursing (Surgery) / OT — Precision Scalpel + Forceps + Sterile Field
  surgery: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="surgGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="surgViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="50%" stop-color="#C4B5FD"/>
          <stop offset="100%" stop-color="#7C3AED"/>
        </linearGradient>
      </defs>
      <!-- Sterile Boundary Circular Ring -->
      <circle cx="40" cy="40" r="28" stroke="rgba(167, 139, 250, 0.3)" stroke-width="1.4" stroke-dasharray="4 4" fill="none"/>
      <!-- Surgical Scalpel -->
      <g transform="rotate(-30 40 40)">
        <path d="M 38 16 L 42 16 L 42 52 L 38 52 Z" fill="rgba(124, 58, 237, 0.4)" stroke="url(#surgViolet)" stroke-width="1.6"/>
        <path d="M 38 52 C 38 52, 38 64, 46 64 C 43 58, 42 54, 42 52 Z" fill="#FFFFFF"/>
        <line x1="39" y1="26" x2="41" y2="26" stroke="#FFFFFF" stroke-width="1.2"/>
        <line x1="39" y1="32" x2="41" y2="32" stroke="#FFFFFF" stroke-width="1.2"/>
        <line x1="39" y1="38" x2="41" y2="38" stroke="#FFFFFF" stroke-width="1.2"/>
      </g>
      <!-- Surgical Forceps Crossed -->
      <g transform="rotate(30 40 40)">
        <path d="M 36 16 L 38 54 M 44 16 L 42 54" stroke="url(#surgViolet)" stroke-width="2" stroke-linecap="round"/>
        <path d="M 38 54 Q 40 60 42 54" stroke="url(#surgViolet)" stroke-width="2" fill="none"/>
        <circle cx="40" cy="22" r="3" stroke="#FFFFFF" stroke-width="1.2" fill="none"/>
      </g>
      <!-- Precision Incision Indicator -->
      <path d="M 28 62 L 52 62" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="2 3"/>
    </svg>
  `,

  // 6. Midwifery & Obstetrical Nursing / OBG — Maternal Silhouette & Embryonic Blossom
  obg: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="obgGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.32"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="obgViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#EDE9FE"/>
          <stop offset="60%" stop-color="#A78BFA"/>
          <stop offset="100%" stop-color="#7C3AED"/>
        </linearGradient>
      </defs>
      <!-- Pregnant Mother Silhouette Arc -->
      <path d="M 30 18 C 30 18, 38 20, 38 28 C 38 32, 32 35, 32 40 C 32 48, 48 54, 46 64" stroke="url(#obgViolet)" stroke-width="2.4" stroke-linecap="round" fill="none"/>
      <!-- Maternal Womb Embrace -->
      <path d="M 36 34 C 46 34, 54 42, 54 52 C 54 59, 48 64, 40 64" stroke="url(#obgViolet)" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <!-- Little Fetus Blossom inside Womb -->
      <circle cx="42" cy="46" r="4.2" fill="#FFFFFF"/>
      <path d="M 43 50 C 45 54, 42 58, 38 57" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none"/>
      <!-- Life Bloom Radiance -->
      <circle cx="36" cy="22" r="3.2" fill="url(#obgViolet)"/>
      <path d="M 52 28 Q 56 24 60 28 Q 64 32 60 36 Q 56 32 52 28 Z" fill="rgba(196, 181, 253, 0.45)" stroke="#DDD6FE" stroke-width="1.2"/>
    </svg>
  `,

  // 7. Community Health Nursing — Family Triad under Protective Shield
  community: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="chnGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="chnViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#DDD6FE"/>
          <stop offset="60%" stop-color="#8E74E5"/>
          <stop offset="100%" stop-color="#6C4FD6"/>
        </linearGradient>
      </defs>
      <!-- Protective Health Shield Outline -->
      <path d="M 40 14 Q 58 18 58 36 C 58 52, 40 64, 40 66 C 40 64, 22 52, 22 36 Q 22 18 40 14 Z" fill="rgba(124, 58, 237, 0.22)" stroke="url(#chnViolet)" stroke-width="2"/>
      <!-- Adult Figure (Left) -->
      <circle cx="33" cy="34" r="3" fill="#FFFFFF"/>
      <path d="M 28 48 C 28 42, 38 42, 38 48" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" fill="none"/>
      <!-- Adult Figure (Right) -->
      <circle cx="47" cy="34" r="3" fill="#FFFFFF"/>
      <path d="M 42 48 C 42 42, 52 42, 52 48" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" fill="none"/>
      <!-- Child Figure (Center) -->
      <circle cx="40" cy="42" r="2.4" fill="#DDD6FE"/>
      <path d="M 36 53 C 36 49, 44 49, 44 53" stroke="#DDD6FE" stroke-width="1.6" stroke-linecap="round" fill="none"/>
      <!-- Caring Cross at Shield Crest -->
      <path d="M 40 22 L 40 28 M 37 25 L 43 25" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
  `,

  // 8. Pharmacology — Prescription Medicine Bottle + Dropper + Chemical Capsules
  pharmacology: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="rxGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.30"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="rxViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#DDD6FE"/>
          <stop offset="60%" stop-color="#8E74E5"/>
          <stop offset="100%" stop-color="#6C4FD6"/>
        </linearGradient>
      </defs>
      <!-- Medicine Bottle Body -->
      <rect x="22" y="30" width="22" height="32" rx="4" fill="rgba(124, 58, 237, 0.32)" stroke="url(#rxViolet)" stroke-width="2"/>
      <rect x="25" y="24" width="16" height="6" rx="2" fill="url(#rxViolet)"/>
      <!-- Rx Cross Emblem on Bottle -->
      <path d="M 33 40 L 33 50 M 28 45 L 38 45" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
      <!-- Angled Capsule Pill -->
      <g transform="rotate(35 52 42)">
        <rect x="46" y="28" width="12" height="26" rx="6" fill="rgba(124, 58, 237, 0.4)" stroke="url(#rxViolet)" stroke-width="1.8"/>
        <!-- Top Half Fill of Capsule -->
        <path d="M 46 34 C 46 30.7, 48.7 28, 52 28 C 55.3 28, 58 30.7, 58 34 L 58 41 L 46 41 Z" fill="#FFFFFF"/>
        <line x1="46" y1="41" x2="58" y2="41" stroke="url(#rxViolet)" stroke-width="1.4"/>
      </g>
    </svg>
  `,

  // 9. Biochemistry & Nutrition — Benzene Ring Molecule + Vitamin Lattice
  biochemistry: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bioGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="bioViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#DDD6FE"/>
          <stop offset="60%" stop-color="#8E74E5"/>
          <stop offset="100%" stop-color="#6C4FD6"/>
        </linearGradient>
      </defs>
      <!-- Central Hexagon Molecule -->
      <polygon points="40,22 56,31 56,49 40,58 24,49 24,31" stroke="url(#bioViolet)" stroke-width="2.2" fill="rgba(124, 58, 237, 0.25)"/>
      <!-- Inner Double Bonds -->
      <polygon points="40,27 51,33 51,47 40,53 29,47 29,33" stroke="#DDD6FE" stroke-width="1.2" stroke-dasharray="4 3" fill="none"/>
      <!-- Bond Nodes -->
      <circle cx="40" cy="22" r="3.2" fill="#FFFFFF"/>
      <circle cx="56" cy="31" r="3.2" fill="#FFFFFF"/>
      <circle cx="56" cy="49" r="3.2" fill="#FFFFFF"/>
      <circle cx="40" cy="58" r="3.2" fill="#FFFFFF"/>
      <circle cx="24" cy="49" r="3.2" fill="#FFFFFF"/>
      <circle cx="24" cy="31" r="3.2" fill="#FFFFFF"/>
      <!-- Branching Functional Groups -->
      <line x1="40" y1="22" x2="40" y2="14" stroke="url(#bioViolet)" stroke-width="2" stroke-linecap="round"/>
      <circle cx="40" cy="14" r="2.2" fill="url(#bioViolet)"/>
      <line x1="56" y1="49" x2="64" y2="54" stroke="url(#bioViolet)" stroke-width="2" stroke-linecap="round"/>
      <circle cx="64" cy="54" r="2.2" fill="url(#bioViolet)"/>
    </svg>
  `,

  // 10. Pathology & Genetics — Laboratory Microscope & Cell Nucleus Slide
  pathology: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pathGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.30"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="pathViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#DDD6FE"/>
          <stop offset="60%" stop-color="#8E74E5"/>
          <stop offset="100%" stop-color="#6C4FD6"/>
        </linearGradient>
      </defs>
      <!-- Microscope Eyepiece & Body -->
      <path d="M 30 18 L 36 26 L 30 30" stroke="url(#pathViolet)" stroke-width="2.4" stroke-linecap="round" fill="none"/>
      <!-- Arm Curve -->
      <path d="M 35 25 C 48 26, 52 38, 48 50" stroke="url(#pathViolet)" stroke-width="2.6" stroke-linecap="round" fill="none"/>
      <!-- Objective Revolving Nosepiece -->
      <rect x="25" y="32" width="12" height="12" rx="2" fill="rgba(124, 58, 237, 0.35)" stroke="url(#pathViolet)" stroke-width="1.8"/>
      <line x1="31" y1="44" x2="31" y2="48" stroke="#FFFFFF" stroke-width="2"/>
      <!-- Stage & Base -->
      <line x1="20" y1="48" x2="42" y2="48" stroke="url(#pathViolet)" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M 22 62 L 54 62" stroke="url(#pathViolet)" stroke-width="3" stroke-linecap="round"/>
      <path d="M 48 50 L 48 62" stroke="url(#pathViolet)" stroke-width="2.6" stroke-linecap="round"/>
      <!-- Cell Specimen Under Lens with glowing nucleus -->
      <circle cx="31" cy="48" r="2.8" fill="#FFFFFF"/>
    </svg>
  `,

  // 11. Mental Health Nursing / Psychiatry — Mind Profile & Luminous Neural Network
  mental_health: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="menGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.30"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="menViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#DDD6FE"/>
          <stop offset="60%" stop-color="#8E74E5"/>
          <stop offset="100%" stop-color="#6C4FD6"/>
        </linearGradient>
      </defs>
      <!-- Human Head Profile Contour -->
      <path d="M 26 58 L 30 54 C 30 54, 24 50, 24 38 C 24 24, 34 16, 48 16 C 60 16, 64 26, 64 36 C 64 42, 60 48, 54 52 L 54 62" stroke="url(#menViolet)" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <!-- Synaptic Neural Network inside Brain -->
      <circle cx="44" cy="26" r="3" fill="#FFFFFF"/>
      <circle cx="54" cy="32" r="2.5" fill="#DDD6FE"/>
      <circle cx="40" cy="36" r="2.5" fill="#DDD6FE"/>
      <circle cx="50" cy="42" r="3" fill="#FFFFFF"/>
      <circle cx="36" cy="44" r="2.2" fill="#DDD6FE"/>
      <!-- Neural Synapse Connectors -->
      <line x1="44" y1="26" x2="54" y2="32" stroke="url(#menViolet)" stroke-width="1.4"/>
      <line x1="44" y1="26" x2="40" y2="36" stroke="url(#menViolet)" stroke-width="1.4"/>
      <line x1="54" y1="32" x2="50" y2="42" stroke="url(#menViolet)" stroke-width="1.4"/>
      <line x1="40" y1="36" x2="50" y2="42" stroke="url(#menViolet)" stroke-width="1.4"/>
      <line x1="40" y1="36" x2="36" y2="44" stroke="url(#menViolet)" stroke-width="1.4"/>
      <!-- Mind Balance Wave -->
      <path d="M 32 50 Q 40 46 48 50 Q 56 54 62 50" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" fill="none"/>
    </svg>
  `,

  // 12. Microbiology — Petri Dish Culture with Microorganism Colonies
  microbiology: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="micGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.30"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="micViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#DDD6FE"/>
          <stop offset="60%" stop-color="#8E74E5"/>
          <stop offset="100%" stop-color="#6C4FD6"/>
        </linearGradient>
      </defs>
      <!-- Glass Petri Dish Outer Rim -->
      <circle cx="40" cy="40" r="26" stroke="url(#micViolet)" stroke-width="2.2" fill="rgba(124, 58, 237, 0.22)"/>
      <circle cx="40" cy="40" r="22" stroke="rgba(167, 139, 250, 0.4)" stroke-width="1.2" stroke-dasharray="3 3" fill="none"/>
      <!-- Flagellated Bacterium Organism -->
      <ellipse cx="36" cy="38" rx="7" ry="4.5" fill="rgba(124, 58, 237, 0.5)" stroke="#FFFFFF" stroke-width="1.6" transform="rotate(-15 36 38)"/>
      <path d="M 43 36 Q 52 32 58 37" stroke="#DDD6FE" stroke-width="1.6" stroke-linecap="round" fill="none"/>
      <path d="M 43 39 Q 50 43 56 41" stroke="#DDD6FE" stroke-width="1.4" stroke-linecap="round" fill="none"/>
      <!-- Culture Colonies -->
      <circle cx="28" cy="48" r="3" fill="#FFFFFF"/>
      <circle cx="46" cy="50" r="2.2" fill="url(#micViolet)"/>
      <circle cx="44" cy="28" r="2.5" fill="#FFFFFF"/>
      <circle cx="28" cy="29" r="1.8" fill="url(#micViolet)"/>
    </svg>
  `,

  // 13. Nursing Research & Statistics — Clinical Trial Chart + Evidence Magnifier
  research: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="resGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="resViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#DDD6FE"/>
          <stop offset="60%" stop-color="#8E74E5"/>
          <stop offset="100%" stop-color="#6C4FD6"/>
        </linearGradient>
      </defs>
      <!-- Research Protocol Document -->
      <rect x="22" y="18" width="28" height="38" rx="3" fill="rgba(124, 58, 237, 0.28)" stroke="url(#resViolet)" stroke-width="2"/>
      <line x1="28" y1="26" x2="44" y2="26" stroke="#DDD6FE" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="28" y1="32" x2="40" y2="32" stroke="#DDD6FE" stroke-width="1.8" stroke-linecap="round"/>
      <!-- Statistical Growth Trend Chart -->
      <path d="M 27 46 L 33 42 L 38 44 L 45 36" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <!-- Magnifying Lens of Empirical Evidence -->
      <circle cx="48" cy="46" r="11" fill="rgba(18, 14, 28, 0.7)" stroke="url(#resViolet)" stroke-width="2.2"/>
      <path d="M 56 54 L 66 64" stroke="url(#resViolet)" stroke-width="3" stroke-linecap="round"/>
      <path d="M 44 46 L 52 46 M 48 42 L 48 50" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
  `,

  // 14. Nursing Management & Leadership — Hospital Medical Center & Leadership Crest
  management: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mgtGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.30"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="mgtViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#DDD6FE"/>
          <stop offset="60%" stop-color="#8E74E5"/>
          <stop offset="100%" stop-color="#6C4FD6"/>
        </linearGradient>
      </defs>
      <!-- Hospital Main Wing -->
      <rect x="28" y="24" width="24" height="38" rx="2" fill="rgba(124, 58, 237, 0.32)" stroke="url(#mgtViolet)" stroke-width="2"/>
      <!-- Hospital Left Wing -->
      <rect x="18" y="34" width="10" height="28" rx="2" fill="rgba(124, 58, 237, 0.22)" stroke="url(#mgtViolet)" stroke-width="1.8"/>
      <!-- Hospital Right Wing -->
      <rect x="52" y="34" width="10" height="28" rx="2" fill="rgba(124, 58, 237, 0.22)" stroke="url(#mgtViolet)" stroke-width="1.8"/>
      <!-- Hospital Cross Crest on Roof -->
      <path d="M 40 14 L 40 22 M 36 18 L 44 18" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>
      <!-- Clinical Wards Windows -->
      <rect x="33" y="30" width="4" height="4" rx="0.8" fill="#FFFFFF"/>
      <rect x="43" y="30" width="4" height="4" rx="0.8" fill="#FFFFFF"/>
      <rect x="33" y="38" width="4" height="4" rx="0.8" fill="#FFFFFF"/>
      <rect x="43" y="38" width="4" height="4" rx="0.8" fill="#FFFFFF"/>
      <!-- Main Entrance -->
      <rect x="36" y="52" width="8" height="10" rx="1" fill="url(#mgtViolet)"/>
    </svg>
  `,

  // 15. Nursing Education — Academic Textbook & Scholar Knowledge Quill
  education: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="eduGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.30"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="eduViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#DDD6FE"/>
          <stop offset="60%" stop-color="#8E74E5"/>
          <stop offset="100%" stop-color="#6C4FD6"/>
        </linearGradient>
      </defs>
      <!-- Open Academic Medical Textbook -->
      <path d="M 40 38 Q 24 34 18 36 L 18 56 Q 24 54 40 58 Q 56 54 62 56 L 62 36 Q 56 34 40 38 Z" fill="rgba(124, 58, 237, 0.32)" stroke="url(#eduViolet)" stroke-width="2"/>
      <line x1="40" y1="38" x2="40" y2="58" stroke="url(#eduViolet)" stroke-width="2"/>
      <!-- Text Lines on Pages -->
      <line x1="24" y1="42" x2="34" y2="44" stroke="#DDD6FE" stroke-width="1.4" stroke-linecap="round"/>
      <line x1="24" y1="48" x2="34" y2="50" stroke="#DDD6FE" stroke-width="1.4" stroke-linecap="round"/>
      <line x1="46" y1="44" x2="56" y2="42" stroke="#DDD6FE" stroke-width="1.4" stroke-linecap="round"/>
      <line x1="46" y1="50" x2="56" y2="48" stroke="#DDD6FE" stroke-width="1.4" stroke-linecap="round"/>
      <!-- Graduation Academic Mortarboard / Knowledge Cap -->
      <polygon points="40,16 58,23 40,30 22,23" fill="url(#eduViolet)" stroke="#FFFFFF" stroke-width="1.6"/>
      <path d="M 52 26 L 52 32 C 52 34 48 36 48 36" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round" fill="none"/>
    </svg>
  `,

  // 16. Nursing Informatics — Electronic Health Record (EHR) Telemetry Display
  informatics: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="infGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="infViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#DDD6FE"/>
          <stop offset="60%" stop-color="#8E74E5"/>
          <stop offset="100%" stop-color="#6C4FD6"/>
        </linearGradient>
      </defs>
      <!-- Hospital Telemetry Tablet Screen -->
      <rect x="20" y="20" width="40" height="36" rx="4" fill="rgba(124, 58, 237, 0.28)" stroke="url(#infViolet)" stroke-width="2"/>
      <rect x="24" y="24" width="32" height="24" rx="2" fill="rgba(18, 14, 28, 0.65)"/>
      <!-- Vital Signs Digital ECG on Screen -->
      <path d="M 26 36 L 31 36 L 33 30 L 36 42 L 39 34 L 41 38 L 44 36 L 54 36" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <!-- Binary Signal Waves -->
      <circle cx="40" cy="52" r="1.5" fill="#DDD6FE"/>
      <!-- Tablet Stand -->
      <path d="M 32 56 L 28 64 L 52 64 L 48 56" stroke="url(#infViolet)" stroke-width="2" stroke-linecap="round" fill="none"/>
    </svg>
  `,

  // 17. Aptitude & Reasoning — Analytical Gear Cog & Deductive Spark
  aptitude: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="aptGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.30"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="aptViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#DDD6FE"/>
          <stop offset="60%" stop-color="#8E74E5"/>
          <stop offset="100%" stop-color="#6C4FD6"/>
        </linearGradient>
      </defs>
      <!-- Interlocking Precision Gear Cog -->
      <circle cx="40" cy="40" r="15" stroke="url(#aptViolet)" stroke-width="2.4" fill="rgba(124, 58, 237, 0.3)"/>
      <circle cx="40" cy="40" r="6" fill="#FFFFFF"/>
      <!-- 8 Cog Teeth -->
      <rect x="38" y="19" width="4" height="6" rx="1" fill="url(#aptViolet)"/>
      <rect x="38" y="55" width="4" height="6" rx="1" fill="url(#aptViolet)"/>
      <rect x="19" y="38" width="6" height="4" rx="1" fill="url(#aptViolet)"/>
      <rect x="55" y="38" width="6" height="4" rx="1" fill="url(#aptViolet)"/>
      <g transform="rotate(45 40 40)">
        <rect x="38" y="19" width="4" height="6" rx="1" fill="url(#aptViolet)"/>
        <rect x="38" y="55" width="4" height="6" rx="1" fill="url(#aptViolet)"/>
        <rect x="19" y="38" width="6" height="4" rx="1" fill="url(#aptViolet)"/>
        <rect x="55" y="38" width="6" height="4" rx="1" fill="url(#aptViolet)"/>
      </g>
      <!-- Analytical Radiance Sparkles -->
      <path d="M 58 22 L 60 16 L 62 22 L 68 24 L 62 26 L 60 32 L 58 26 L 52 24 Z" fill="#FFFFFF"/>
    </svg>
  `,

  // 18. English & Communication — Dialogue Speech Bubbles & Clinical Terminology
  english: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="engGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="engViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#DDD6FE"/>
          <stop offset="60%" stop-color="#8E74E5"/>
          <stop offset="100%" stop-color="#6C4FD6"/>
        </linearGradient>
      </defs>
      <!-- Primary Speech Bubble -->
      <path d="M 22 24 C 22 19, 27 16, 36 16 L 52 16 C 60 16, 64 20, 64 26 L 64 38 C 64 44, 58 46, 50 46 L 42 46 L 34 54 L 34 46 L 30 46 C 24 46, 22 42, 22 36 Z" fill="rgba(124, 58, 237, 0.3)" stroke="url(#engViolet)" stroke-width="2"/>
      <!-- Communication Text Lines -->
      <line x1="30" y1="26" x2="54" y2="26" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
      <line x1="30" y1="33" x2="48" y2="33" stroke="#DDD6FE" stroke-width="1.8" stroke-linecap="round"/>
      <!-- Secondary Overlapping Care Speech Bubble -->
      <path d="M 20 42 C 20 38, 24 36, 28 36 L 36 36 C 36 44, 44 48, 44 56 L 32 56 L 24 64 L 24 56 C 21 56, 20 54, 20 50 Z" fill="rgba(167, 139, 250, 0.25)" stroke="#DDD6FE" stroke-width="1.6"/>
    </svg>
  `,

  // 19. Clinical Procedures — Calibrated Syringe & Sterile Measure
  clinical_procedures: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="procGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.30"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="procViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#DDD6FE"/>
          <stop offset="60%" stop-color="#8E74E5"/>
          <stop offset="100%" stop-color="#6C4FD6"/>
        </linearGradient>
      </defs>
      <!-- Angled Precision Medical Syringe -->
      <g transform="rotate(-40 40 40)">
        <!-- Plunger Rod -->
        <rect x="38" y="10" width="4" height="14" fill="url(#procViolet)"/>
        <rect x="34" y="8" width="12" height="3" rx="1" fill="#FFFFFF"/>
        <!-- Plunger Seal -->
        <rect x="35" y="22" width="10" height="4" fill="#FFFFFF"/>
        <!-- Barrel Tube -->
        <rect x="33" y="24" width="14" height="34" rx="2" fill="rgba(124, 58, 237, 0.32)" stroke="url(#procViolet)" stroke-width="1.8"/>
        <!-- Fluid Level Indicator -->
        <rect x="34" y="36" width="12" height="21" fill="rgba(196, 181, 253, 0.45)"/>
        <!-- Calibration Hash Marks -->
        <line x1="43" y1="30" x2="47" y2="30" stroke="#FFFFFF" stroke-width="1.2"/>
        <line x1="41" y1="36" x2="47" y2="36" stroke="#FFFFFF" stroke-width="1.2"/>
        <line x1="43" y1="42" x2="47" y2="42" stroke="#FFFFFF" stroke-width="1.2"/>
        <line x1="41" y1="48" x2="47" y2="48" stroke="#FFFFFF" stroke-width="1.2"/>
        <!-- Needle Hub & Beveled Tip -->
        <rect x="38" y="58" width="4" height="4" fill="url(#procViolet)"/>
        <line x1="40" y1="62" x2="40" y2="76" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"/>
      </g>
      <!-- Antiseptic Fluid Droplet -->
      <path d="M 64 24 C 64 24, 67 29, 67 32 C 67 34, 65 36, 64 36 C 63 36, 61 34, 61 32 C 61 29, 64 24, 64 24 Z" fill="#FFFFFF"/>
    </svg>
  `,

  // 20. Default / Master Medical Emblem — Asclepius Staff & Serpentine Caduceus
  default: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="defGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.30"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="defViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#DDD6FE"/>
          <stop offset="60%" stop-color="#8E74E5"/>
          <stop offset="100%" stop-color="#6C4FD6"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="28" stroke="rgba(167, 139, 250, 0.3)" stroke-width="1.5" stroke-dasharray="4 4" fill="none"/>
      <!-- Asclepius Central Medical Staff -->
      <line x1="40" y1="16" x2="40" y2="64" stroke="url(#defViolet)" stroke-width="3" stroke-linecap="round"/>
      <circle cx="40" cy="16" r="3.5" fill="#FFFFFF"/>
      <!-- Entwining Serpent of Healing -->
      <path d="M 40 24 C 48 26, 48 34, 40 36 C 32 38, 32 46, 40 48 C 48 50, 48 56, 40 58" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <!-- Medical Cross Core -->
      <path d="M 40 32 L 40 42 M 35 37 L 45 37" stroke="#DDD6FE" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `
};

/**
 * Returns a high-resolution, transparent-background SVG illustration matching the subject title.
 * Analyzes keywords in the subject title to find the most accurate subject definition.
 */
export function getSubjectIllustration(title) {
  const t = String(title || '').toLowerCase().trim();

  // Child Health / Pediatrics
  if (t.includes('child') || t.includes('pediatric') || t.includes('paediatric')) {
    return SUBJECT_ILLUSTRATIONS.pediatrics;
  }

  // Midwifery & Obstetrical Nursing / Gynecology
  if (t.includes('midwife') || t.includes('midwifery') || t.includes('obg') || t.includes('obstetric') || t.includes('gynaec') || t.includes('gynec')) {
    return SUBJECT_ILLUSTRATIONS.obg;
  }

  // Adult Health Nursing (Surgery) / Surgical
  if (t.includes('surg') || t.includes('operation') || t.includes('ot')) {
    return SUBJECT_ILLUSTRATIONS.surgery;
  }

  // Adult Health Nursing (Medicine) / MSN
  if (t.includes('medicine') || (t.includes('adult health') && !t.includes('surgery')) || t.includes('msn')) {
    return SUBJECT_ILLUSTRATIONS.medicine;
  }

  // Pharmacology
  if (t.includes('pharma') || t.includes('drug') || t.includes('medicament')) {
    return SUBJECT_ILLUSTRATIONS.pharmacology;
  }

  // Anatomy & Physiology
  if (t.includes('anatom') || t.includes('physiol')) {
    return SUBJECT_ILLUSTRATIONS.anatomy;
  }

  // Community Health Nursing
  if (t.includes('community') || t.includes('chn') || t.includes('public health')) {
    return SUBJECT_ILLUSTRATIONS.community;
  }

  // Mental Health Nursing / Psychology / Psychiatry
  if (t.includes('mental') || t.includes('psych') || t.includes('behavioral')) {
    return SUBJECT_ILLUSTRATIONS.mental_health;
  }

  // Microbiology
  if (t.includes('microbio') || t.includes('bacteria') || t.includes('virus')) {
    return SUBJECT_ILLUSTRATIONS.microbiology;
  }

  // Pathology & Genetics
  if (t.includes('patho') || t.includes('genetic')) {
    return SUBJECT_ILLUSTRATIONS.pathology;
  }

  // Biochemistry & Nutrition
  if (t.includes('biochem') || t.includes('nutrit')) {
    return SUBJECT_ILLUSTRATIONS.biochemistry;
  }

  // Nursing Research & Statistics
  if (t.includes('research') || t.includes('statist') || t.includes('biostat')) {
    return SUBJECT_ILLUSTRATIONS.research;
  }

  // Nursing Management & Leadership
  if (t.includes('management') || t.includes('administr') || t.includes('leader')) {
    return SUBJECT_ILLUSTRATIONS.management;
  }

  // Nursing Education
  if (t.includes('education') || t.includes('teaching')) {
    return SUBJECT_ILLUSTRATIONS.education;
  }

  // Informatics & Computers
  if (t.includes('informatic') || t.includes('computer')) {
    return SUBJECT_ILLUSTRATIONS.informatics;
  }

  // Aptitude & Reasoning
  if (t.includes('aptitude') || t.includes('reasoning') || t.includes('math')) {
    return SUBJECT_ILLUSTRATIONS.aptitude;
  }

  // English
  if (t.includes('english') || t.includes('communicat')) {
    return SUBJECT_ILLUSTRATIONS.english;
  }

  // Clinical Procedures
  if (t.includes('procedure') || t.includes('skill') || t.includes('clinical')) {
    return SUBJECT_ILLUSTRATIONS.clinical_procedures;
  }

  // Nursing Foundation / FON (checked after compound names)
  if (t.includes('foundation') || t.includes('fon') || t.includes('nursing')) {
    return SUBJECT_ILLUSTRATIONS.nursing_foundation;
  }

  return SUBJECT_ILLUSTRATIONS.default;
}
