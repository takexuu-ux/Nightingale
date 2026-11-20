// Nightingale Subject Vector Illustrations — High-Resolution, Transparent Background, Themed Visual Art
// Unmistakably defines each nursing & medical subject with cyber-luminous styling

export const SUBJECT_ILLUSTRATIONS = {
  // 1. Nursing Foundation / FON
  nursing_foundation: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="fonGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#A78BFA" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="fonGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE047"/>
          <stop offset="60%" stop-color="#F59E0B"/>
          <stop offset="100%" stop-color="#D97706"/>
        </linearGradient>
        <linearGradient id="fonViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#C4B5FD"/>
          <stop offset="100%" stop-color="#7C3AED"/>
        </linearGradient>
      </defs>
      <!-- Background Halo -->
      <circle cx="40" cy="40" r="36" fill="url(#fonGlow)"/>
      <!-- Stethoscope Tubing Wrapped Gracefully -->
      <path d="M 22 28 C 16 38, 18 58, 40 58 C 62 58, 64 38, 58 28" stroke="url(#fonViolet)" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M 22 28 C 22 20, 29 16, 32 16 M 58 28 C 58 20, 51 16, 48 16" stroke="url(#fonViolet)" stroke-width="2.6" stroke-linecap="round"/>
      <circle cx="32" cy="16" r="2.2" fill="#E2E8F0"/>
      <circle cx="48" cy="16" r="2.2" fill="#E2E8F0"/>
      <path d="M 40 58 L 40 65" stroke="url(#fonViolet)" stroke-width="3.2" stroke-linecap="round"/>
      <circle cx="40" cy="67" r="4.5" fill="#38BDF8" stroke="#FFFFFF" stroke-width="1.8"/>
      <!-- Florence Nightingale Iconic Oil Lamp of Knowledge -->
      <path d="M 26 46 Q 30 52 40 52 Q 50 52 54 46 L 56 42 Q 40 44 24 42 Z" fill="url(#fonGold)"/>
      <path d="M 33 52 L 31 56 L 49 56 L 47 52 Z" fill="url(#fonGold)"/>
      <path d="M 24 42 Q 17 38 18 33 Q 22 30 26 36 L 27 42" fill="none" stroke="url(#fonGold)" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M 52 42 Q 62 40 64 36 Q 63 34 58 37" fill="none" stroke="url(#fonGold)" stroke-width="2.6" stroke-linecap="round"/>
      <!-- Glowing Lamp Flame -->
      <path d="M 64 35 C 64 35, 68 28, 65 24 C 62 27, 61 31, 62 34 Z" fill="#F43F5E"/>
      <path d="M 64 34 C 64 34, 66 29, 64 26 C 62 28, 62 31, 63 33 Z" fill="#FDE047"/>
      <!-- Caring Red Cross inside Lamp Body -->
      <path d="M 40 44 L 40 50 M 37 47 L 43 47" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
  `,

  // 2. Anatomy & Physiology
  anatomy: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="anaGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#F43F5E" stop-opacity="0.32"/>
          <stop offset="100%" stop-color="#E11D48" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="anaCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FB7185"/>
          <stop offset="50%" stop-color="#E11D48"/>
          <stop offset="100%" stop-color="#881337"/>
        </linearGradient>
        <linearGradient id="anaBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38BDF8"/>
          <stop offset="100%" stop-color="#0284C7"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="url(#anaGlow)"/>
      <!-- Symmetrical Ribcage Silhouette -->
      <path d="M 40 18 L 40 60" stroke="#CBD5E1" stroke-width="2.2" stroke-linecap="round" opacity="0.6"/>
      <path d="M 38 24 Q 24 22 22 30 M 42 24 Q 56 22 58 30" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>
      <path d="M 38 31 Q 20 30 18 39 M 42 31 Q 60 30 62 39" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>
      <path d="M 38 38 Q 22 40 20 48 M 42 38 Q 58 40 60 48" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>
      <!-- Anatomical Heart Organ -->
      <path d="M 40 32 C 34 24, 23 27, 26 38 C 28 45, 36 53, 40 58 C 44 53, 52 45, 54 38 C 57 27, 46 24, 40 32 Z" fill="url(#anaCrimson)" stroke="#FDA4AF" stroke-width="1.6"/>
      <!-- Aorta & Pulmonary Arteries -->
      <path d="M 35 27 C 35 20, 42 16, 46 19 C 48 21, 47 25, 45 27" fill="none" stroke="url(#anaCrimson)" stroke-width="3" stroke-linecap="round"/>
      <path d="M 42 21 L 44 14 M 46 22 L 49 16" stroke="url(#anaCrimson)" stroke-width="2" stroke-linecap="round"/>
      <!-- Vena Cava Blue Branch -->
      <path d="M 32 28 C 30 22, 28 17, 26 15" stroke="url(#anaBlue)" stroke-width="2.8" stroke-linecap="round"/>
      <!-- Neon Arterial Pulse Wave across heart -->
      <path d="M 16 46 L 27 46 L 31 38 L 35 52 L 39 42 L 42 48 L 45 46 L 64 46" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // 3. Child Health Nursing / Pediatrics
  pediatrics: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pedGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.32"/>
          <stop offset="100%" stop-color="#0284C7" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="pedHands" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#67E8F9"/>
          <stop offset="100%" stop-color="#06B6D4"/>
        </linearGradient>
        <linearGradient id="pedBaby" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE047"/>
          <stop offset="100%" stop-color="#F59E0B"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="url(#pedGlow)"/>
      <!-- Protective Nurse Hands Cradling -->
      <path d="M 18 52 C 18 42, 26 40, 32 46 C 36 50, 40 56, 40 62 C 34 62, 26 60, 20 56 Z" fill="url(#pedHands)" opacity="0.85"/>
      <path d="M 62 52 C 62 42, 54 40, 48 46 C 44 50, 40 56, 40 62 C 46 62, 54 60, 60 56 Z" fill="url(#pedHands)" opacity="0.85"/>
      <!-- Infant Head with peaceful smile -->
      <circle cx="40" cy="30" r="14" fill="#FFE4E6" stroke="#FDA4AF" stroke-width="1.8"/>
      <!-- Cute baby hair tuft -->
      <path d="M 40 16 Q 44 11 41 9 Q 38 11 40 16" fill="url(#pedBaby)"/>
      <!-- Sleeping Eyes & Cheeks -->
      <path d="M 33 29 Q 36 32 38 29" stroke="#E11D48" stroke-width="1.8" stroke-linecap="round" fill="none"/>
      <path d="M 42 29 Q 44 32 47 29" stroke="#E11D48" stroke-width="1.8" stroke-linecap="round" fill="none"/>
      <circle cx="31" cy="33" r="2.2" fill="#FDA4AF" opacity="0.8"/>
      <circle cx="49" cy="33" r="2.2" fill="#FDA4AF" opacity="0.8"/>
      <!-- Pacifier / Gentle Smile -->
      <path d="M 37 35 Q 40 38 43 35" stroke="#E11D48" stroke-width="1.6" stroke-linecap="round" fill="none"/>
      <!-- Adorable Baby Feet Print in background -->
      <circle cx="23" cy="20" r="2.2" fill="#38BDF8"/>
      <circle cx="27" cy="18" r="1.8" fill="#38BDF8"/>
      <circle cx="30" cy="19" r="1.5" fill="#38BDF8"/>
      <ellipse cx="23" cy="28" rx="4" ry="6" fill="#38BDF8" transform="rotate(-15 23 28)"/>
      <!-- Protective Starburst sparkles -->
      <path d="M 58 18 L 60 22 L 64 24 L 60 26 L 58 30 L 56 26 L 52 24 L 56 22 Z" fill="#FDE047"/>
    </svg>
  `,

  // 4. Adult Health Nursing (Medicine)
  medicine: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="medGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#0284C7" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="medCyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38BDF8"/>
          <stop offset="100%" stop-color="#0284C7"/>
        </linearGradient>
        <linearGradient id="medViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#C4B5FD"/>
          <stop offset="100%" stop-color="#6366F1"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="url(#medGlow)"/>
      <!-- Hospital Cross Shield -->
      <path d="M 40 12 L 60 20 V 40 C 60 52 51 63 40 68 C 29 63 20 52 20 40 V 20 Z" fill="rgba(15, 23, 42, 0.65)" stroke="url(#medCyan)" stroke-width="2.4"/>
      <!-- Intravenous (IV) Infusion Drip Bottle -->
      <path d="M 33 26 Q 40 24 47 26 L 47 42 Q 40 45 33 42 Z" fill="url(#medViolet)" opacity="0.6"/>
      <path d="M 37 20 L 43 20 L 43 24 L 37 24 Z" fill="#E2E8F0"/>
      <!-- Stethoscope Wrapped Around Shield -->
      <path d="M 24 35 C 20 48 30 62 44 62 C 54 62 58 52 56 42" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round"/>
      <circle cx="56" cy="38" r="4.5" fill="#38BDF8" stroke="#FFFFFF" stroke-width="1.8"/>
      <!-- Emergency ECG Vitals Waveform -->
      <path d="M 23 42 L 31 42 L 34 32 L 38 52 L 42 36 L 45 44 L 48 42 L 57 42" stroke="#34D399" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Red Medicine Pill Capsule -->
      <g transform="translate(48, 14) rotate(45)">
        <rect x="0" y="0" width="8" height="18" rx="4" fill="#F43F5E"/>
        <path d="M 0 9 H 8 V 14 A 4 4 0 0 1 0 14 Z" fill="#F8FAFC"/>
      </g>
    </svg>
  `,

  // 5. Adult Health Nursing (Surgery)
  surgery: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="surgGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#0891B2" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="50%" stop-color="#CBD5E1"/>
          <stop offset="100%" stop-color="#64748B"/>
        </linearGradient>
        <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38BDF8"/>
          <stop offset="100%" stop-color="#1E293B"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="url(#surgGlow)"/>
      <!-- Operating Theatre Surgical Light Dome Beam -->
      <path d="M 40 10 L 16 66 L 64 66 Z" fill="rgba(6, 182, 212, 0.08)"/>
      <ellipse cx="40" cy="11" rx="14" ry="4" fill="#38BDF8" opacity="0.8"/>
      <!-- Crossed Precision Surgical Scalpel -->
      <g transform="translate(18, 16)">
        <!-- Scalpel 1: angled diagonal down-right -->
        <path d="M 6 42 L 28 20 L 32 23 L 10 45 Z" fill="url(#handleGrad)"/>
        <!-- Fine Scalpel Blade -->
        <path d="M 28 20 L 42 6 Q 44 14 36 19 L 32 23 Z" fill="url(#bladeGrad)" stroke="#E2E8F0" stroke-width="0.8"/>
        <!-- Scalpel grip ridges -->
        <line x1="14" y1="36" x2="18" y2="39" stroke="#94A3B8" stroke-width="1.2"/>
        <line x1="18" y1="32" x2="22" y2="35" stroke="#94A3B8" stroke-width="1.2"/>
      </g>
      <!-- Surgical Forceps crossing behind -->
      <g transform="translate(16, 16)">
        <path d="M 38 45 L 18 20 L 14 18 L 8 6 L 12 12 L 18 18 L 34 43 Z" fill="url(#bladeGrad)" opacity="0.85"/>
      </g>
      <!-- Curved Suture Needle with glowing silk thread -->
      <path d="M 48 36 C 60 38 66 52 56 62 C 48 70 34 66 30 58" stroke="#38BDF8" stroke-width="2.2" stroke-linecap="round" fill="none" stroke-dasharray="4 2"/>
      <!-- Sterile Cross Marker -->
      <circle cx="40" cy="54" r="5" fill="#0EA5E9" stroke="#FFFFFF" stroke-width="1.5"/>
      <path d="M 40 51 L 40 57 M 37 54 L 43 54" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"/>
    </svg>
  `,

  // 6. Midwifery & Obstetrical Nursing (OBG)
  obg: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="obgGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#F43F5E" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#E11D48" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="obgRose" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDA4AF"/>
          <stop offset="60%" stop-color="#F43F5E"/>
          <stop offset="100%" stop-color="#BE123C"/>
        </linearGradient>
        <linearGradient id="obgViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#DDD6FE"/>
          <stop offset="100%" stop-color="#8B5CF6"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="url(#obgGlow)"/>
      <!-- Elegant Mother Profile silhouette cradling womb -->
      <path d="M 40 14 C 44 14, 48 17, 48 22 C 48 26, 44 29, 41 31 C 46 34, 54 41, 54 52 C 54 62, 44 66, 38 66 C 30 66, 26 58, 26 50 C 26 38, 33 32, 36 29 C 34 27, 33 24, 33 21 C 33 16, 36 14, 40 14 Z" fill="url(#obgRose)" opacity="0.3"/>
      <!-- Maternal Loving Embracing Curve -->
      <path d="M 32 18 C 38 12, 52 14, 54 26 C 56 36, 48 44, 52 54 C 54 60, 48 66, 40 66 C 32 66, 24 58, 24 46 C 24 32, 28 22, 32 18 Z" stroke="url(#obgRose)" stroke-width="2.8" stroke-linecap="round" fill="none"/>
      <!-- Fetus in Womb Silhouette inside warm glowing heart -->
      <path d="M 40 38 C 36 34, 30 36, 30 42 C 30 50, 40 56, 40 56 C 40 56, 50 50, 50 42 C 50 36, 44 34, 40 38 Z" fill="url(#obgRose)"/>
      <!-- Unborn Fetus Curling Form -->
      <circle cx="39" cy="43" r="3.2" fill="#FFFFFF"/>
      <path d="M 39 46 C 41 48, 43 51, 39 53" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" fill="none"/>
      <!-- Umbilical Cord Blossom -->
      <path d="M 37 49 Q 34 50 34 53" stroke="#FDE047" stroke-width="1.6" stroke-linecap="round"/>
      <!-- Glowing Maternal Halo Hearts -->
      <path d="M 52 20 C 50 18, 47 19, 47 22 C 47 26, 52 29, 52 29 C 52 29, 57 26, 57 22 C 57 19, 54 18, 52 20 Z" fill="#FDA4AF"/>
    </svg>
  `,

  // 7. Community Health Nursing (CHN)
  community: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="chnGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#10B981" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#059669" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="chnTeal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#34D399"/>
          <stop offset="100%" stop-color="#059669"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="url(#chnGlow)"/>
      <!-- Global Epidemiological Shield / World Ring -->
      <circle cx="40" cy="40" r="28" stroke="url(#chnTeal)" stroke-width="2.2" stroke-dasharray="6 3"/>
      <!-- Family & Community Figures Under Protective Care -->
      <!-- Father Figure -->
      <circle cx="28" cy="30" r="5" fill="#38BDF8"/>
      <path d="M 21 48 C 21 40, 25 38, 28 38 C 31 38, 35 40, 35 48 Z" fill="#38BDF8"/>
      <!-- Mother Figure -->
      <circle cx="52" cy="30" r="5" fill="#F472B6"/>
      <path d="M 45 48 C 45 40, 49 38, 52 38 C 55 38, 59 40, 59 48 Z" fill="#F472B6"/>
      <!-- Child Figure in Center -->
      <circle cx="40" cy="37" r="4" fill="#FDE047"/>
      <path d="M 34 54 C 34 46, 37 45, 40 45 C 43 45, 46 46, 46 54 Z" fill="#FDE047"/>
      <!-- Protective Public Health Umbrella / Medical Cross Overhead -->
      <path d="M 20 22 C 30 16, 50 16, 60 22" stroke="url(#chnTeal)" stroke-width="3" stroke-linecap="round"/>
      <circle cx="40" cy="16" r="3" fill="#10B981"/>
      <!-- Red Cross Badge in Ground -->
      <rect x="36" y="58" width="8" height="8" rx="2" fill="#EF4444"/>
      <path d="M 40 60 L 40 64 M 38 62 L 42 62" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"/>
    </svg>
  `,

  // 8. Pharmacology
  pharmacology: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pharmaGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#D97706" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="pillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F43F5E"/>
          <stop offset="100%" stop-color="#BE123C"/>
        </linearGradient>
        <linearGradient id="vialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38BDF8"/>
          <stop offset="100%" stop-color="#0284C7"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="url(#pharmaGlow)"/>
      <!-- Chemical Benzene Ring Molecule in background -->
      <polygon points="40,14 56,23 56,41 40,50 24,41 24,23" stroke="#A78BFA" stroke-width="1.8" fill="rgba(167, 139, 250, 0.12)"/>
      <circle cx="40" cy="14" r="2.5" fill="#A78BFA"/>
      <circle cx="56" cy="23" r="2.5" fill="#A78BFA"/>
      <circle cx="56" cy="41" r="2.5" fill="#A78BFA"/>
      <circle cx="40" cy="50" r="2.5" fill="#A78BFA"/>
      <circle cx="24" cy="41" r="2.5" fill="#A78BFA"/>
      <circle cx="24" cy="23" r="2.5" fill="#A78BFA"/>
      <!-- Medicine Infusion Vial with liquid -->
      <rect x="22" y="32" width="16" height="28" rx="4" fill="rgba(30, 41, 59, 0.85)" stroke="#38BDF8" stroke-width="2"/>
      <rect x="25" y="28" width="10" height="4" rx="1.5" fill="#E2E8F0"/>
      <path d="M 23 44 Q 30 46 37 44 L 37 57 A 3 3 0 0 1 34 60 L 25 60 A 3 3 0 0 1 22 57 Z" fill="url(#vialGrad)"/>
      <!-- Rx Symbol on Vial -->
      <text x="25" y="42" fill="#FFFFFF" font-size="9" font-weight="bold" font-family="sans-serif">Rx</text>
      <!-- Big Capsule Pill angled across -->
      <g transform="translate(34, 26) rotate(35)">
        <rect x="0" y="0" width="12" height="28" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.2"/>
        <path d="M 0 14 H 12 V 22 A 6 6 0 0 1 0 22 Z" fill="url(#pillGrad)"/>
        <!-- Medicine Sparkle Specks -->
        <circle cx="4" cy="8" r="1.2" fill="#F59E0B"/>
        <circle cx="8" cy="6" r="1" fill="#F59E0B"/>
        <circle cx="6" cy="11" r="1.2" fill="#F59E0B"/>
      </g>
    </svg>
  `,

  // 9. Biochemistry & Nutrition
  biochemistry: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bioGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#10B981" stop-opacity="0.32"/>
          <stop offset="100%" stop-color="#059669" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="bioHelix" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38BDF8"/>
          <stop offset="50%" stop-color="#A78BFA"/>
          <stop offset="100%" stop-color="#34D399"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="url(#bioGlow)"/>
      <!-- DNA Double Helix Spirals -->
      <path d="M 30 14 C 50 24, 50 36, 30 46 C 10 56, 10 68, 30 78" stroke="url(#bioHelix)" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M 50 14 C 30 24, 30 36, 50 46 C 70 56, 70 68, 50 78" stroke="url(#bioHelix)" stroke-width="3" stroke-linecap="round" fill="none"/>
      <!-- Base Pair Rungs -->
      <line x1="33" y1="20" x2="47" y2="20" stroke="#FDE047" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="38" y1="30" x2="42" y2="30" stroke="#F43F5E" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="33" y1="40" x2="47" y2="40" stroke="#38BDF8" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="38" y1="50" x2="42" y2="50" stroke="#FDE047" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="33" y1="60" x2="47" y2="60" stroke="#34D399" stroke-width="2.2" stroke-linecap="round"/>
      <!-- Nutrition Organic Apple Silhouette -->
      <path d="M 40 32 C 34 26 24 30 24 40 C 24 54 36 60 40 64 C 44 60 56 54 56 40 C 56 30 46 26 40 32 Z" fill="rgba(16, 185, 129, 0.28)" stroke="#34D399" stroke-width="1.8"/>
      <path d="M 40 32 C 40 26, 44 24, 46 22" stroke="#10B981" stroke-width="2.2" stroke-linecap="round"/>
      <ellipse cx="44" cy="22" rx="3.5" ry="2" fill="#34D399" transform="rotate(-30 44 22)"/>
    </svg>
  `,

  // 10. Pathology & Genetics
  pathology: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pathGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#6D28D9" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="url(#pathGlow)"/>
      <!-- Microscopic Laboratory Glass Slide -->
      <rect x="18" y="22" width="44" height="36" rx="4" fill="rgba(30, 41, 59, 0.75)" stroke="#A78BFA" stroke-width="2"/>
      <circle cx="40" cy="40" r="14" fill="rgba(139, 92, 246, 0.25)" stroke="#C4B5FD" stroke-width="1.5" stroke-dasharray="3 2"/>
      <!-- Dividing Biopsy Cells & Mitosis -->
      <circle cx="36" cy="38" r="5" fill="#F43F5E" opacity="0.85"/>
      <circle cx="36" cy="38" r="2.2" fill="#FFFFFF"/>
      <circle cx="44" cy="42" r="5" fill="#38BDF8" opacity="0.85"/>
      <circle cx="44" cy="42" r="2.2" fill="#FFFFFF"/>
      <circle cx="41" cy="34" r="3.5" fill="#F59E0B" opacity="0.85"/>
      <!-- Chromosomal Karyotype X Genetics Mark -->
      <g transform="translate(48, 14)">
        <path d="M 2 2 Q 6 8 2 14 M 10 2 Q 6 8 10 14" stroke="#FDE047" stroke-width="2.4" stroke-linecap="round"/>
        <line x1="4" y1="8" x2="8" y2="8" stroke="#FDE047" stroke-width="2"/>
      </g>
    </svg>
  `,

  // 11. Mental Health Nursing / Psychology / Psychiatry
  mental_health: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mentGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#6366F1" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#4F46E5" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="mentBrain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#A5B4FC"/>
          <stop offset="50%" stop-color="#6366F1"/>
          <stop offset="100%" stop-color="#4338CA"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="url(#mentGlow)"/>
      <!-- Human Head Profile Contour -->
      <path d="M 26 58 V 50 C 26 46, 24 44, 24 38 C 24 24, 34 16, 48 16 C 58 16, 64 24, 64 34 C 64 42, 60 46, 56 48 L 56 58" stroke="#94A3B8" stroke-width="2.4" stroke-linecap="round" fill="none" opacity="0.6"/>
      <!-- Glowing Brain Cortex with Convolutions -->
      <path d="M 38 22 C 34 22, 31 25, 32 29 C 29 29, 27 32, 28 36 C 26 38, 27 42, 30 43 C 30 47, 34 49, 38 49 C 40 49, 42 47, 43 45 C 44 47, 47 49, 50 49 C 54 49, 57 46, 56 42 C 59 40, 59 36, 57 33 C 58 29, 56 26, 52 26 C 51 23, 47 22, 44 23 C 42 22, 40 22, 38 22 Z" fill="url(#mentBrain)" stroke="#C7D2FE" stroke-width="1.8"/>
      <!-- Synaptic Firing Sparks & Energy Aura -->
      <path d="M 36 32 Q 42 34 40 40 M 46 29 Q 44 36 50 38 M 36 42 Q 44 40 46 45" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" fill="none"/>
      <circle cx="42" cy="34" r="2.2" fill="#FDE047"/>
      <circle cx="48" cy="38" r="1.8" fill="#FDE047"/>
      <circle cx="37" cy="41" r="1.8" fill="#38BDF8"/>
      <!-- Peaceful Thought Waves radiate from top -->
      <path d="M 38 12 Q 44 8 50 12" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M 34 8 Q 44 3 54 8" stroke="#818CF8" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.8"/>
    </svg>
  `,

  // 12. Microbiology
  microbiology: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="microGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#10B981" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#059669" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="microLens" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#34D399"/>
          <stop offset="100%" stop-color="#059669"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="url(#microGlow)"/>
      <!-- Microscope Lens / Circular Petri Dish Field -->
      <circle cx="38" cy="38" r="24" fill="rgba(15, 23, 42, 0.75)" stroke="url(#microLens)" stroke-width="3"/>
      <!-- Focusing Crosshairs -->
      <line x1="38" y1="16" x2="38" y2="22" stroke="#34D399" stroke-width="1.8"/>
      <line x1="38" y1="54" x2="38" y2="60" stroke="#34D399" stroke-width="1.8"/>
      <line x1="16" y1="38" x2="22" y2="38" stroke="#34D399" stroke-width="1.8"/>
      <line x1="54" y1="38" x2="60" y2="38" stroke="#34D399" stroke-width="1.8"/>
      <!-- Bacilli Bacteria Rods -->
      <rect x="26" y="32" width="14" height="6" rx="3" fill="#38BDF8" transform="rotate(-25 26 32)"/>
      <rect x="34" y="44" width="16" height="6" rx="3" fill="#A78BFA" transform="rotate(15 34 44)"/>
      <!-- Cocci Bacteria Clusters -->
      <circle cx="32" cy="46" r="3" fill="#F43F5E"/>
      <circle cx="36" cy="48" r="2.5" fill="#F43F5E"/>
      <circle cx="30" cy="50" r="2.5" fill="#F43F5E"/>
      <!-- Viral Spiked Capsid Sphere -->
      <circle cx="44" cy="28" r="5" fill="#FDE047"/>
      <line x1="44" y1="21" x2="44" y2="35" stroke="#FDE047" stroke-width="1.5"/>
      <line x1="37" y1="28" x2="51" y2="28" stroke="#FDE047" stroke-width="1.5"/>
      <line x1="39" y1="23" x2="49" y2="33" stroke="#FDE047" stroke-width="1.5"/>
      <!-- Microscope Adjusting Knobs in bottom right -->
      <circle cx="60" cy="58" r="6" fill="#64748B" stroke="#CBD5E1" stroke-width="2"/>
    </svg>
  `,

  // 13. Nursing Research & Statistics
  research: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="resGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#0284C7" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="resCyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38BDF8"/>
          <stop offset="100%" stop-color="#6366F1"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="url(#resGlow)"/>
      <!-- Research Clipboard -->
      <rect x="20" y="16" width="36" height="48" rx="4" fill="rgba(30, 41, 59, 0.85)" stroke="#64748B" stroke-width="2"/>
      <rect x="30" y="12" width="16" height="7" rx="2" fill="#E2E8F0"/>
      <!-- Statistical Bar Chart Histogram -->
      <rect x="26" y="44" width="4" height="12" rx="1" fill="#818CF8"/>
      <rect x="33" y="36" width="4" height="20" rx="1" fill="#38BDF8"/>
      <rect x="40" y="28" width="4" height="28" rx="1" fill="#34D399"/>
      <rect x="47" y="38" width="4" height="18" rx="1" fill="#F43F5E"/>
      <!-- Upward Trending Analytics Line Graph -->
      <path d="M 26 46 L 35 34 L 42 26 L 50 36" stroke="#FDE047" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Magnifying Glass Inspecting Data in bottom right -->
      <circle cx="52" cy="48" r="10" fill="rgba(15, 23, 42, 0.85)" stroke="#38BDF8" stroke-width="2.6"/>
      <line x1="59" y1="55" x2="68" y2="64" stroke="#38BDF8" stroke-width="3.5" stroke-linecap="round"/>
      <text x="47" y="52" fill="#FDE047" font-size="11" font-weight="bold" font-family="sans-serif">p&lt;</text>
    </svg>
  `,

  // 14. Nursing Management & Leadership
  management: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mgtGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#B45309" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="goldCrown" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE047"/>
          <stop offset="60%" stop-color="#F59E0B"/>
          <stop offset="100%" stop-color="#D97706"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="url(#mgtGlow)"/>
      <!-- Leadership Hospital Pillar / Podium -->
      <path d="M 22 62 L 58 62 M 26 58 L 54 58 M 28 58 L 28 36 M 52 36 L 52 58" stroke="#CBD5E1" stroke-width="2.2" stroke-linecap="round"/>
      <!-- Healthcare Hospital Building Emblem in center -->
      <rect x="32" y="32" width="16" height="26" rx="2" fill="rgba(30, 41, 59, 0.85)" stroke="#A78BFA" stroke-width="1.8"/>
      <path d="M 40 37 L 40 43 M 37 40 L 43 40" stroke="#F43F5E" stroke-width="2.2" stroke-linecap="round"/>
      <!-- Leadership Crown of Excellence -->
      <path d="M 28 26 L 33 16 L 40 22 L 47 16 L 52 26 Z" fill="url(#goldCrown)" stroke="#FDE047" stroke-width="1.2"/>
      <circle cx="33" cy="15" r="1.8" fill="#FFFFFF"/>
      <circle cx="40" cy="21" r="1.8" fill="#FFFFFF"/>
      <circle cx="47" cy="15" r="1.8" fill="#FFFFFF"/>
      <!-- Laurel Wreath Branch on Sides -->
      <path d="M 20 46 C 18 36, 24 26, 28 24" stroke="url(#goldCrown)" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M 60 46 C 62 36, 56 26, 52 24" stroke="url(#goldCrown)" stroke-width="2" stroke-linecap="round" fill="none"/>
    </svg>
  `,

  // 15. Nursing Education & Teaching
  education: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="eduGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#6D28D9" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="url(#eduGlow)"/>
      <!-- Graduation Mortarboard Cap -->
      <polygon points="40,16 64,26 40,36 16,26" fill="#6366F1" stroke="#A5B4FC" stroke-width="1.8"/>
      <path d="M 28 32 V 42 C 28 47, 52 47, 52 42 V 32" fill="#4338CA" stroke="#818CF8" stroke-width="1.6"/>
      <!-- Tassel Ribbon & Pearl -->
      <path d="M 40 26 L 58 34 L 59 46" stroke="#FDE047" stroke-width="2" stroke-linecap="round" fill="none"/>
      <circle cx="59" cy="47" r="2.2" fill="#FDE047"/>
      <!-- Illuminated Open Medical Textbook -->
      <path d="M 18 52 C 26 48, 38 50, 40 54 C 42 50, 54 48, 62 52 L 60 66 C 52 62, 42 64, 40 68 C 38 64, 28 62, 20 66 Z" fill="rgba(30, 41, 59, 0.9)" stroke="#E2E8F0" stroke-width="1.8"/>
      <line x1="40" y1="54" x2="40" y2="68" stroke="#CBD5E1" stroke-width="2"/>
      <!-- Torch / Knowledge Rays -->
      <line x1="40" y1="8" x2="40" y2="12" stroke="#FDE047" stroke-width="2" stroke-linecap="round"/>
      <line x1="30" y1="10" x2="33" y2="13" stroke="#FDE047" stroke-width="2" stroke-linecap="round"/>
      <line x1="50" y1="10" x2="47" y2="13" stroke="#FDE047" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  // 16. Nursing Informatics & Computers
  informatics: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="infoGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#0284C7" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#0369A1" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="url(#infoGlow)"/>
      <!-- Medical EHR Tablet / Computer Monitor -->
      <rect x="18" y="20" width="44" height="32" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#38BDF8" stroke-width="2.2"/>
      <path d="M 32 52 L 28 62 L 52 62 L 48 52" fill="#334155" stroke="#64748B" stroke-width="1.6"/>
      <!-- Digital Heart Rate ECG Telemetry Waveform -->
      <path d="M 22 36 L 30 36 L 33 28 L 37 44 L 41 32 L 44 38 L 47 36 L 58 36" stroke="#34D399" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Binary Matrix Code Specks -->
      <text x="23" y="29" fill="#38BDF8" font-size="6" font-family="monospace">0101</text>
      <text x="44" y="29" fill="#38BDF8" font-size="6" font-family="monospace">1010</text>
      <text x="23" y="47" fill="#A78BFA" font-size="6" font-family="monospace">AI-EHR</text>
      <circle cx="54" cy="46" r="2.5" fill="#34D399"/>
    </svg>
  `,

  // 17. Aptitude & Reasoning
  aptitude: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="aptGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#D97706" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="url(#aptGlow)"/>
      <!-- Interlocking Logical Cogwheels -->
      <g transform="translate(32, 32)">
        <circle cx="0" cy="0" r="10" stroke="#F59E0B" stroke-width="3" fill="none"/>
        <line x1="-13" y1="0" x2="13" y2="0" stroke="#F59E0B" stroke-width="2.5"/>
        <line x1="0" y1="-13" x2="0" y2="13" stroke="#F59E0B" stroke-width="2.5"/>
        <circle cx="0" cy="0" r="4" fill="#FDE047"/>
      </g>
      <g transform="translate(48, 46)">
        <circle cx="0" cy="0" r="8" stroke="#38BDF8" stroke-width="2.6" fill="none"/>
        <circle cx="0" cy="0" r="3" fill="#38BDF8"/>
      </g>
      <!-- Mathematical Symbols Floating: Pi, Sigma, Delta -->
      <text x="22" y="24" fill="#FDE047" font-size="14" font-weight="bold" font-family="serif">π</text>
      <text x="50" y="25" fill="#38BDF8" font-size="14" font-weight="bold" font-family="serif">∑</text>
      <text x="20" y="58" fill="#F43F5E" font-size="14" font-weight="bold" font-family="serif">Δ</text>
      <!-- Target Bullseye & Arrow in top right -->
      <circle cx="52" cy="20" r="6" stroke="#EF4444" stroke-width="1.5" fill="none"/>
      <circle cx="52" cy="20" r="2" fill="#EF4444"/>
    </svg>
  `,

  // 18. English & Communication
  english: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="engGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.32"/>
          <stop offset="100%" stop-color="#0284C7" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="url(#engGlow)"/>
      <!-- Dialogue Speech Bubble Pair -->
      <path d="M 22 24 C 22 18, 30 16, 40 16 C 50 16, 58 18, 58 24 C 58 32, 48 35, 42 35 L 36 41 L 36 35 C 28 35, 22 32, 22 24 Z" fill="rgba(30, 41, 59, 0.85)" stroke="#38BDF8" stroke-width="2"/>
      <text x="32" y="28" fill="#FDE047" font-size="12" font-weight="bold" font-family="sans-serif">Aa</text>
      <!-- Quill Feather Pen -->
      <path d="M 58 26 C 50 36, 44 46, 32 62 L 28 64 L 30 60 C 38 48, 48 36, 58 26 Z" fill="#C4B5FD" stroke="#A78BFA" stroke-width="1.4"/>
      <path d="M 30 60 L 32 62" stroke="#FFFFFF" stroke-width="1.8"/>
    </svg>
  `,

  // 19. Clinical Procedures & Skills
  clinical_procedures: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="clinGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#0891B2" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="url(#clinGlow)"/>
      <!-- Hypodermic Syringe with dosage measurement -->
      <g transform="translate(20, 20) rotate(-45)">
        <rect x="14" y="0" width="12" height="32" rx="2" fill="rgba(30, 41, 59, 0.85)" stroke="#38BDF8" stroke-width="1.8"/>
        <!-- Plunger -->
        <rect x="18" y="32" width="4" height="14" fill="#CBD5E1"/>
        <rect x="13" y="46" width="14" height="3" rx="1.5" fill="#E2E8F0"/>
        <!-- Needle -->
        <line x1="20" y1="0" x2="20" y2="-12" stroke="#E2E8F0" stroke-width="1.6"/>
        <!-- Liquid & Measurement lines -->
        <rect x="15" y="10" width="10" height="21" fill="#06B6D4" opacity="0.6"/>
        <line x1="22" y1="6" x2="25" y2="6" stroke="#FFFFFF" stroke-width="1.2"/>
        <line x1="20" y1="12" x2="25" y2="12" stroke="#FFFFFF" stroke-width="1.2"/>
        <line x1="22" y1="18" x2="25" y2="18" stroke="#FFFFFF" stroke-width="1.2"/>
        <line x1="20" y1="24" x2="25" y2="24" stroke="#FFFFFF" stroke-width="1.2"/>
      </g>
      <!-- Droplet of Medication forming at needle tip -->
      <circle cx="56" cy="18" r="2.5" fill="#38BDF8"/>
    </svg>
  `,

  // 20. Default / Universal Medical
  default: `
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="defGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#A78BFA" stop-opacity="0.32"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="defGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#C4B5FD"/>
          <stop offset="50%" stop-color="#8B5CF6"/>
          <stop offset="100%" stop-color="#6D28D9"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="url(#defGlow)"/>
      <!-- Nightingale Medical Caduceus Star of Life -->
      <path d="M 40 14 L 46 26 L 59 26 L 49 34 L 53 46 L 40 38 L 27 46 L 31 34 L 21 26 L 34 26 Z" fill="rgba(124, 58, 237, 0.25)" stroke="url(#defGrad)" stroke-width="2"/>
      <path d="M 40 24 L 40 56 M 32 36 L 48 36" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round"/>
      <circle cx="40" cy="40" r="24" stroke="#A78BFA" stroke-width="1.5" stroke-dasharray="4 3"/>
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
