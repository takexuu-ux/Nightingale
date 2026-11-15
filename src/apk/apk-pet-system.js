// Nightingale Companion Pet System
// 100% Pure Code-Generated Dense Pixel-Art Vector Companions with Dynamic Facial & Body Expressions
// Zero external images, zero network requests, zero speech-bubble text clutter.
// STRICT RULE: Companion Pet is NEVER shown on the Login / Authentication screen.

const STORAGE_PET_KEY = 'nnl_companion_pet_id';
const STORAGE_ENABLED_KEY = 'nnl_companion_pet_enabled';

// Facial expression generators for each character
export function getPetSvg(petId, expression = 'default') {
  if (petId === 'shinchan') {
    return getShinchanSvg(expression);
  }
  if (petId === 'banana-cat') {
    return getBananaCatSvg(expression);
  }
  if (petId === 'moxie') {
    return getMoxieSvg(expression);
  }
  return getNurseSvg(expression);
}

function getNurseSvg(expr) {
  let faceContent = '';
  switch (expr) {
    case 'happy':
      faceContent = `
        <path d="M16 23 Q18 20 20 23" stroke="#0F172A" stroke-width="2" fill="none" stroke-linecap="round" />
        <path d="M28 23 Q30 20 32 23" stroke="#0F172A" stroke-width="2" fill="none" stroke-linecap="round" />
        <rect x="13" y="25" width="4" height="2.5" fill="#F43F5E" />
        <rect x="31" y="25" width="4" height="2.5" fill="#F43F5E" />
        <path d="M22 26 Q24 29.5 26 26 Z" fill="#E11D48" />
      `;
      break;
    case 'wink':
      faceContent = `
        <path d="M16 23 Q18 20 20 23" stroke="#0F172A" stroke-width="2" fill="none" stroke-linecap="round" />
        <rect x="28" y="21" width="4" height="5" fill="#0F172A" />
        <rect x="28" y="21" width="2" height="2" fill="#FFFFFF" />
        <rect x="30" y="24" width="2" height="2" fill="#38BDF8" />
        <rect x="14" y="26" width="3" height="2" fill="#FB7185" />
        <rect x="31" y="26" width="3" height="2" fill="#FB7185" />
        <rect x="23" y="27" width="3" height="1.2" fill="#E11D48" />
        <rect x="24" y="28.2" width="2" height="1" fill="#FB7185" />
      `;
      break;
    case 'heart-eyes':
      faceContent = `
        <path d="M16 22 A 1.5 1.5 0 0 1 18 21 A 1.5 1.5 0 0 1 20 22 Q 18 25.5 18 25.5 Q 16 22 16 22 Z" fill="#EF4444" />
        <path d="M28 22 A 1.5 1.5 0 0 1 30 21 A 1.5 1.5 0 0 1 32 22 Q 30 25.5 30 25.5 Q 28 22 28 22 Z" fill="#EF4444" />
        <rect x="13" y="25" width="4" height="2.5" fill="#FB7185" />
        <rect x="31" y="25" width="4" height="2.5" fill="#FB7185" />
        <path d="M22 26 Q24 29.5 26 26 Z" fill="#E11D48" />
      `;
      break;
    case 'shocked':
      faceContent = `
        <circle cx="18" cy="23" r="3" fill="#0F172A" />
        <circle cx="17.5" cy="22" r="1.1" fill="#FFFFFF" />
        <circle cx="30" cy="23" r="3" fill="#0F172A" />
        <circle cx="29.5" cy="22" r="1.1" fill="#FFFFFF" />
        <ellipse cx="24" cy="27" rx="1.6" ry="2" fill="#E11D48" />
        <path d="M13 18 Q12 21 13 22 Q14 21 13 18 Z" fill="#38BDF8" />
      `;
      break;
    case 'focus':
      faceContent = `
        <line x1="15" y1="19" x2="20" y2="21" stroke="#451A03" stroke-width="2" stroke-linecap="round" />
        <line x1="33" y1="19" x2="28" y2="21" stroke="#451A03" stroke-width="2" stroke-linecap="round" />
        <rect x="16" y="21" width="4" height="4" fill="#0F172A" />
        <rect x="18" y="21" width="2" height="2" fill="#FFFFFF" />
        <rect x="28" y="21" width="4" height="4" fill="#0F172A" />
        <rect x="28" y="21" width="2" height="2" fill="#FFFFFF" />
        <line x1="22" y1="27" x2="26" y2="26" stroke="#E11D48" stroke-width="1.6" stroke-linecap="round" />
      `;
      break;
    case 'sleepy':
      faceContent = `
        <path d="M16 23 Q18 25 20 23" stroke="#0F172A" stroke-width="2" fill="none" stroke-linecap="round" />
        <path d="M28 23 Q30 25 32 23" stroke="#0F172A" stroke-width="2" fill="none" stroke-linecap="round" />
        <line x1="23" y1="27" x2="25" y2="27" stroke="#E11D48" stroke-width="1.2" stroke-linecap="round" />
      `;
      break;
    default:
      faceContent = `
        <rect x="16" y="21" width="4" height="5" fill="#0F172A" />
        <rect x="16" y="21" width="2" height="2" fill="#FFFFFF" />
        <rect x="18" y="24" width="2" height="2" fill="#38BDF8" />
        <rect x="28" y="21" width="4" height="5" fill="#0F172A" />
        <rect x="28" y="21" width="2" height="2" fill="#FFFFFF" />
        <rect x="30" y="24" width="2" height="2" fill="#38BDF8" />
        <rect x="14" y="26" width="3" height="2" fill="#FB7185" />
        <rect x="31" y="26" width="3" height="2" fill="#FB7185" />
        <rect x="23" y="27" width="2" height="1" fill="#E11D48" />
      `;
      break;
  }

  return `
    <svg viewBox="0 0 48 48" width="100%" height="100%" shape-rendering="crispEdges" style="overflow:visible;" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="46" rx="14" ry="2.5" fill="rgba(0,0,0,0.22)" shape-rendering="auto" />
      <path d="M14 6 h20 v6 h-20 z" fill="#FFFFFF" />
      <path d="M13 10 h22 v3 h-22 z" fill="#F1F5F9" />
      <rect x="22" y="7" width="4" height="4" fill="#EF4444" />
      <rect x="23" y="6" width="2" height="6" fill="#EF4444" />
      <path d="M12 12 h24 v14 h-24 z" fill="#451A03" />
      <path d="M10 16 h4 v10 h-4 z" fill="#451A03" />
      <path d="M34 16 h4 v10 h-4 z" fill="#451A03" />
      <path d="M14 12 h20 v4 h-20 z" fill="#78350F" />
      <rect x="14" y="16" width="4" height="3" fill="#78350F" />
      <rect x="22" y="16" width="4" height="2" fill="#78350F" />
      <rect x="30" y="16" width="4" height="3" fill="#78350F" />
      <rect x="14" y="18" width="20" height="12" fill="#FED7AA" />
      <rect x="12" y="20" width="2" height="8" fill="#FED7AA" />
      <rect x="34" y="20" width="2" height="8" fill="#FED7AA" />
      ${faceContent}
      <rect x="15" y="30" width="18" height="12" fill="#EDE9FE" />
      <rect x="18" y="30" width="12" height="12" fill="#8E74E5" />
      <polygon points="21,30 27,30 24,34" fill="#FED7AA" shape-rendering="auto" />
      <path d="M19 32 v5 h2 v-5 z" fill="#38BDF8" />
      <path d="M27 32 v5 h2 v-5 z" fill="#38BDF8" />
      <circle cx="28" cy="38" r="2" fill="#94A3B8" shape-rendering="auto" />
      <rect x="19" y="38" width="3" height="3" fill="#FFFFFF" />
      <rect x="20" y="39" width="1" height="1" fill="#EF4444" />
      <circle cx="14" cy="36" r="2.2" fill="#FED7AA" shape-rendering="auto" />
      <circle cx="34" cy="36" r="2.2" fill="#FED7AA" shape-rendering="auto" />
      <rect x="18" y="42" width="5" height="3" fill="#6D28D9" />
      <rect x="25" y="42" width="5" height="3" fill="#6D28D9" />
      <rect x="17" y="44" width="6" height="2" fill="#FFFFFF" />
      <rect x="25" y="44" width="6" height="2" fill="#FFFFFF" />
    </svg>
  `;
}

function getShinchanSvg(expr) {
  let faceContent = '';
  switch (expr) {
    case 'happy':
      faceContent = `
        <path d="M15 13 h7 v3 h-7 z" fill="#000000" />
        <path d="M26 13 h7 v3 h-7 z" fill="#000000" />
        <path d="M17 21 Q19.5 17 22 21" stroke="#000000" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <path d="M27 21 Q29.5 17 32 21" stroke="#000000" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <rect x="12" y="23" width="4" height="3" fill="#FB923C" />
        <rect x="32" y="23" width="4" height="3" fill="#FB923C" />
        <path d="M21 24 Q24 30 27 24 Z" fill="#E11D48" />
        <path d="M22 26 Q24 29 26 26 Z" fill="#FB7185" />
      `;
      break;
    case 'wink':
      faceContent = `
        <path d="M15 15 h7 v3 h-7 z" fill="#000000" />
        <path d="M26 13 h7 v3 h-7 z" fill="#000000" />
        <path d="M17 21 Q19.5 17 22 21" stroke="#000000" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <rect x="27" y="19" width="5" height="5" fill="#000000" />
        <rect x="28" y="20" width="2" height="2" fill="#FFFFFF" />
        <rect x="13" y="24" width="3" height="3" fill="#FB923C" />
        <rect x="32" y="24" width="3" height="3" fill="#FB923C" />
        <line x1="22" y1="26" x2="27" y2="24" stroke="#E11D48" stroke-width="2.2" stroke-linecap="round" />
      `;
      break;
    case 'heart-eyes':
      faceContent = `
        <path d="M15 14 h7 v3 h-7 z" fill="#000000" />
        <path d="M26 14 h7 v3 h-7 z" fill="#000000" />
        <path d="M17 21 A 1.8 1.8 0 0 1 19.5 20 A 1.8 1.8 0 0 1 22 21 Q 19.5 25.5 19.5 25.5 Q 17 21 17 21 Z" fill="#EF4444" />
        <path d="M27 21 A 1.8 1.8 0 0 1 29.5 20 A 1.8 1.8 0 0 1 32 21 Q 29.5 25.5 29.5 25.5 Q 27 21 27 21 Z" fill="#EF4444" />
        <rect x="12" y="23" width="4" height="3" fill="#F43F5E" />
        <rect x="32" y="23" width="4" height="3" fill="#F43F5E" />
        <path d="M20 24 Q24 31 28 24 Z" fill="#E11D48" />
      `;
      break;
    case 'shocked':
      faceContent = `
        <path d="M14 13 Q18 10 22 13" stroke="#000000" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <path d="M26 13 Q30 10 34 13" stroke="#000000" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <circle cx="19.5" cy="21.5" r="3.2" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
        <circle cx="19.5" cy="21.5" r="1.3" fill="#000000" />
        <circle cx="29.5" cy="21.5" r="3.2" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
        <circle cx="29.5" cy="21.5" r="1.3" fill="#000000" />
        <ellipse cx="24" cy="27" rx="3" ry="3.5" fill="#E11D48" />
        <path d="M11 16 Q10 19 11 20 Q12 19 11 16 Z" fill="#38BDF8" />
      `;
      break;
    case 'focus':
      faceContent = `
        <line x1="14" y1="15" x2="22" y2="18" stroke="#000000" stroke-width="3.2" stroke-linecap="round" />
        <line x1="34" y1="15" x2="26" y2="18" stroke="#000000" stroke-width="3.2" stroke-linecap="round" />
        <rect x="17" y="20" width="5" height="3" fill="#000000" />
        <rect x="27" y="20" width="5" height="3" fill="#000000" />
        <line x1="22" y1="26" x2="26" y2="26" stroke="#E11D48" stroke-width="2" stroke-linecap="round" />
      `;
      break;
    case 'sleepy':
      faceContent = `
        <path d="M15 15 h7 v3 h-7 z" fill="#000000" />
        <path d="M26 15 h7 v3 h-7 z" fill="#000000" />
        <path d="M17 21 Q19.5 24 22 21" stroke="#000000" stroke-width="2.2" fill="none" stroke-linecap="round" />
        <path d="M27 21 Q29.5 24 32 21" stroke="#000000" stroke-width="2.2" fill="none" stroke-linecap="round" />
        <line x1="23" y1="26" x2="25" y2="26" stroke="#E11D48" stroke-width="1.5" stroke-linecap="round" />
      `;
      break;
    default:
      faceContent = `
        <path d="M15 15 h7 v3 h-7 z" fill="#000000" />
        <rect x="14" y="17" width="2" height="2" fill="#000000" />
        <path d="M26 15 h7 v3 h-7 z" fill="#000000" />
        <rect x="32" y="17" width="2" height="2" fill="#000000" />
        <rect x="17" y="19" width="5" height="5" fill="#000000" />
        <rect x="18" y="20" width="2" height="2" fill="#FFFFFF" />
        <rect x="27" y="19" width="5" height="5" fill="#000000" />
        <rect x="28" y="20" width="2" height="2" fill="#FFFFFF" />
        <rect x="13" y="24" width="3" height="3" fill="#FB923C" />
        <rect x="32" y="24" width="3" height="3" fill="#FB923C" />
        <rect x="22" y="25" width="4" height="3" fill="#E11D48" />
        <rect x="23" y="25" width="2" height="1" fill="#FFFFFF" />
      `;
      break;
  }

  return `
    <svg viewBox="0 0 48 48" width="100%" height="100%" shape-rendering="crispEdges" style="overflow:visible;" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="46" rx="13" ry="2.5" fill="rgba(0,0,0,0.22)" shape-rendering="auto" />
      <path d="M14 10 h18 v8 h-18 z" fill="#0A0A0A" />
      <path d="M12 12 h4 v6 h-4 z" fill="#0A0A0A" />
      <path d="M30 12 h4 v6 h-4 z" fill="#0A0A0A" />
      <rect x="14" y="16" width="18" height="14" fill="#FED7AA" />
      <rect x="30" y="20" width="5" height="10" fill="#FED7AA" />
      <rect x="12" y="20" width="4" height="10" fill="#FED7AA" />
      ${faceContent}
      <rect x="15" y="30" width="18" height="9" fill="#DC2626" />
      <rect x="11" y="31" width="4" height="5" fill="#DC2626" />
      <rect x="33" y="31" width="4" height="5" fill="#DC2626" />
      <circle cx="10" cy="35" r="2.2" fill="#FED7AA" shape-rendering="auto" />
      <circle cx="38" cy="34" r="2.2" fill="#FED7AA" shape-rendering="auto" />
      <rect x="16" y="39" width="16" height="4" fill="#FACC15" />
      <rect x="23" y="41" width="2" height="2" fill="#0A0A0A" />
      <rect x="18" y="43" width="3" height="2" fill="#FED7AA" />
      <rect x="27" y="43" width="3" height="2" fill="#FED7AA" />
      <rect x="17" y="44" width="5" height="1.5" fill="#FFFFFF" />
      <rect x="26" y="44" width="5" height="1.5" fill="#FFFFFF" />
      <rect x="16" y="45" width="6" height="2" fill="#0284C7" />
      <rect x="26" y="45" width="6" height="2" fill="#0284C7" />
    </svg>
  `;
}

function getBananaCatSvg(expr) {
  let faceContent = '';
  switch (expr) {
    case 'happy':
      faceContent = `
        <path d="M16 23 Q18 20 20 23" stroke="#0F172A" stroke-width="2" fill="none" stroke-linecap="round" />
        <path d="M28 23 Q30 20 32 23" stroke="#0F172A" stroke-width="2" fill="none" stroke-linecap="round" />
        <rect x="13" y="25" width="4" height="2.5" fill="#F43F5E" />
        <rect x="31" y="25" width="4" height="2.5" fill="#F43F5E" />
        <path d="M22 26 Q24 29.5 26 26 Z" fill="#E11D48" />
      `;
      break;
    case 'wink':
      faceContent = `
        <path d="M16 23 Q18 20 20 23" stroke="#0F172A" stroke-width="2" fill="none" stroke-linecap="round" />
        <rect x="28" y="21" width="4" height="5" fill="#0F172A" />
        <rect x="28" y="21" width="2" height="2" fill="#FFFFFF" />
        <rect x="30" y="24" width="2" height="2" fill="#38BDF8" />
        <rect x="14" y="26" width="3" height="2" fill="#FB7185" />
        <rect x="31" y="26" width="3" height="2" fill="#FB7185" />
        <path d="M22 27 Q23.5 29 25 27 Q26.5 29 28 27" stroke="#E11D48" stroke-width="1.4" fill="none" />
      `;
      break;
    case 'heart-eyes':
      faceContent = `
        <path d="M16 22 A 1.5 1.5 0 0 1 18 21 A 1.5 1.5 0 0 1 20 22 Q 18 25.5 18 25.5 Q 16 22 16 22 Z" fill="#EF4444" />
        <path d="M28 22 A 1.5 1.5 0 0 1 30 21 A 1.5 1.5 0 0 1 32 22 Q 30 25.5 30 25.5 Q 28 22 28 22 Z" fill="#EF4444" />
        <rect x="13" y="25" width="4" height="2.5" fill="#FB7185" />
        <rect x="31" y="25" width="4" height="2.5" fill="#FB7185" />
        <path d="M22 26 Q24 29.5 26 26 Z" fill="#E11D48" />
      `;
      break;
    case 'shocked':
      faceContent = `
        <circle cx="18" cy="23" r="3" fill="#0F172A" />
        <circle cx="17.5" cy="22" r="1.1" fill="#FFFFFF" />
        <circle cx="30" cy="23" r="3" fill="#0F172A" />
        <circle cx="29.5" cy="22" r="1.1" fill="#FFFFFF" />
        <ellipse cx="24" cy="27" rx="1.5" ry="2" fill="#E11D48" />
        <path d="M13 18 Q12 21 13 22 Q14 21 13 18 Z" fill="#38BDF8" />
      `;
      break;
    case 'focus':
      faceContent = `
        <line x1="15" y1="19" x2="20" y2="21" stroke="#CA8A04" stroke-width="2" stroke-linecap="round" />
        <line x1="33" y1="19" x2="28" y2="21" stroke="#CA8A04" stroke-width="2" stroke-linecap="round" />
        <rect x="16" y="21" width="4" height="4" fill="#0F172A" />
        <rect x="18" y="21" width="2" height="2" fill="#FFFFFF" />
        <rect x="28" y="21" width="4" height="4" fill="#0F172A" />
        <rect x="28" y="21" width="2" height="2" fill="#FFFFFF" />
        <line x1="22" y1="27" x2="26" y2="26" stroke="#E11D48" stroke-width="1.6" stroke-linecap="round" />
      `;
      break;
    case 'sleepy':
      faceContent = `
        <path d="M16 23 Q18 25 20 23" stroke="#0F172A" stroke-width="2" fill="none" stroke-linecap="round" />
        <path d="M28 23 Q30 25 32 23" stroke="#0F172A" stroke-width="2" fill="none" stroke-linecap="round" />
        <line x1="23" y1="27" x2="25" y2="27" stroke="#E11D48" stroke-width="1.2" stroke-linecap="round" />
      `;
      break;
    default:
      faceContent = `
        <rect x="16" y="21" width="4" height="5" fill="#0F172A" />
        <rect x="16" y="21" width="2" height="2" fill="#FFFFFF" />
        <rect x="18" y="24" width="2" height="2" fill="#38BDF8" />
        <rect x="28" y="21" width="4" height="5" fill="#0F172A" />
        <rect x="28" y="21" width="2" height="2" fill="#FFFFFF" />
        <rect x="30" y="24" width="2" height="2" fill="#38BDF8" />
        <rect x="14" y="26" width="3" height="2" fill="#FB7185" />
        <rect x="31" y="26" width="3" height="2" fill="#FB7185" />
        <rect x="22" y="27" width="4" height="1" fill="#E11D48" />
        <rect x="21" y="28" width="2" height="1" fill="#E11D48" />
        <rect x="25" y="28" width="2" height="1" fill="#E11D48" />
      `;
      break;
  }

  return `
    <svg viewBox="0 0 48 48" width="100%" height="100%" shape-rendering="crispEdges" style="overflow:visible;" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="46" rx="14" ry="2.5" fill="rgba(0,0,0,0.22)" shape-rendering="auto" />
      <rect x="23" y="2" width="2" height="4" fill="#15803D" />
      <rect x="24" y="1" width="2" height="2" fill="#16A34A" />
      <path d="M15 6 h18 v8 h-18 z" fill="#FACC15" />
      <path d="M13 11 h22 v3 h-22 z" fill="#EAB308" />
      <rect x="15" y="3" width="4" height="4" fill="#FACC15" />
      <rect x="16" y="4" width="2" height="2" fill="#FB7185" />
      <rect x="29" y="3" width="4" height="4" fill="#FACC15" />
      <rect x="30" y="4" width="2" height="2" fill="#FB7185" />
      <path d="M12 12 h24 v14 h-24 z" fill="#CA8A04" />
      <path d="M10 16 h4 v10 h-4 z" fill="#CA8A04" />
      <path d="M34 16 h4 v10 h-4 z" fill="#CA8A04" />
      <path d="M14 12 h20 v4 h-20 z" fill="#FACC15" />
      <rect x="14" y="16" width="4" height="3" fill="#FACC15" />
      <rect x="22" y="16" width="4" height="2" fill="#FACC15" />
      <rect x="30" y="16" width="4" height="3" fill="#FACC15" />
      <rect x="14" y="18" width="20" height="12" fill="#FED7AA" />
      <rect x="12" y="20" width="2" height="8" fill="#FED7AA" />
      <rect x="34" y="20" width="2" height="8" fill="#FED7AA" />
      ${faceContent}
      <rect x="15" y="30" width="18" height="11" fill="#FACC15" />
      <rect x="18" y="30" width="12" height="11" fill="#FDE047" />
      <polygon points="21,30 27,30 24,34" fill="#FED7AA" shape-rendering="auto" />
      <circle cx="14" cy="36" r="2.2" fill="#FED7AA" shape-rendering="auto" />
      <circle cx="34" cy="36" r="2.2" fill="#FED7AA" shape-rendering="auto" />
      <rect x="22" y="41" width="4" height="3" fill="#CA8A04" />
      <rect x="17" y="43" width="5" height="2" fill="#0284C7" />
      <rect x="26" y="43" width="5" height="2" fill="#0284C7" />
    </svg>
  `;
}

function getMoxieSvg(expr) {
  let faceContent = '';
  switch (expr) {
    case 'happy':
      faceContent = `
        <path d="M16 23 Q18 20 20 23" stroke="#0F172A" stroke-width="2" fill="none" stroke-linecap="round" />
        <path d="M28 23 Q30 20 32 23" stroke="#0F172A" stroke-width="2" fill="none" stroke-linecap="round" />
        <rect x="13" y="25" width="4" height="2.5" fill="#F43F5E" />
        <rect x="31" y="25" width="4" height="2.5" fill="#F43F5E" />
        <path d="M22 26 Q24 29.5 26 26 Z" fill="#E11D48" />
      `;
      break;
    case 'wink':
      faceContent = `
        <path d="M16 23 Q18 20 20 23" stroke="#0F172A" stroke-width="2" fill="none" stroke-linecap="round" />
        <rect x="28" y="21" width="4" height="5" fill="#0F172A" />
        <rect x="28" y="21" width="2" height="2" fill="#FFFFFF" />
        <rect x="30" y="24" width="2" height="2" fill="#A78BFA" />
        <rect x="13" y="26" width="3" height="2" fill="#FB7185" />
        <rect x="32" y="26" width="3" height="2" fill="#FB7185" />
        <line x1="22" y1="27" x2="26" y2="26" stroke="#E11D48" stroke-width="1.8" stroke-linecap="round" />
      `;
      break;
    case 'heart-eyes':
      faceContent = `
        <path d="M16 22 A 1.5 1.5 0 0 1 18 21 A 1.5 1.5 0 0 1 20 22 Q 18 25.5 18 25.5 Q 16 22 16 22 Z" fill="#EF4444" />
        <path d="M28 22 A 1.5 1.5 0 0 1 30 21 A 1.5 1.5 0 0 1 32 22 Q 30 25.5 30 25.5 Q 28 22 28 22 Z" fill="#EF4444" />
        <rect x="13" y="25" width="4" height="2.5" fill="#FB7185" />
        <rect x="31" y="25" width="4" height="2.5" fill="#FB7185" />
        <path d="M22 26 Q24 29.5 26 26 Z" fill="#E11D48" />
      `;
      break;
    case 'shocked':
      faceContent = `
        <circle cx="18" cy="23" r="3" fill="#0F172A" />
        <circle cx="17.5" cy="22" r="1.1" fill="#FFFFFF" />
        <circle cx="30" cy="23" r="3" fill="#0F172A" />
        <circle cx="29.5" cy="22" r="1.1" fill="#FFFFFF" />
        <ellipse cx="24" cy="27" rx="1.5" ry="2" fill="#E11D48" />
        <path d="M13 18 Q12 21 13 22 Q14 21 13 18 Z" fill="#38BDF8" />
      `;
      break;
    case 'focus':
      faceContent = `
        <line x1="16" y1="20" x2="20" y2="24" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" />
        <line x1="28" y1="20" x2="32" y2="24" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" />
        <rect x="16" y="21" width="4" height="4" fill="#0F172A" />
        <rect x="18" y="21" width="2" height="2" fill="#FFFFFF" />
        <rect x="28" y="21" width="4" height="4" fill="#0F172A" />
        <rect x="28" y="21" width="2" height="2" fill="#FFFFFF" />
        <line x1="22" y1="27" x2="26" y2="26" stroke="#E11D48" stroke-width="1.8" stroke-linecap="round" />
      `;
      break;
    case 'sleepy':
      faceContent = `
        <path d="M16 23 Q18 25 20 23" stroke="#0F172A" stroke-width="2" fill="none" stroke-linecap="round" />
        <path d="M28 23 Q30 25 32 23" stroke="#0F172A" stroke-width="2" fill="none" stroke-linecap="round" />
        <line x1="23" y1="27" x2="25" y2="27" stroke="#E11D48" stroke-width="1.2" stroke-linecap="round" />
      `;
      break;
    default:
      faceContent = `
        <rect x="16" y="21" width="4" height="5" fill="#0F172A" />
        <rect x="16" y="21" width="2" height="2" fill="#FFFFFF" />
        <rect x="18" y="24" width="2" height="2" fill="#A78BFA" />
        <rect x="28" y="21" width="4" height="5" fill="#0F172A" />
        <rect x="28" y="21" width="2" height="2" fill="#FFFFFF" />
        <rect x="30" y="24" width="2" height="2" fill="#A78BFA" />
        <rect x="13" y="26" width="3" height="2" fill="#FB7185" />
        <rect x="32" y="26" width="3" height="2" fill="#FB7185" />
        <rect x="23" y="27" width="2" height="1" fill="#E11D48" />
      `;
      break;
  }

  return `
    <svg viewBox="0 0 48 48" width="100%" height="100%" shape-rendering="crispEdges" style="overflow:visible;" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="46" rx="14" ry="2.5" fill="rgba(0,0,0,0.22)" shape-rendering="auto" />
      <path d="M15 5 h18 v8 h-18 z" fill="#6D28D9" />
      <path d="M13 11 h22 v3 h-22 z" fill="#5B21B6" />
      <rect x="22" y="7" width="4" height="4" fill="#FBBF24" />
      <rect x="23" y="6" width="2" height="6" fill="#FBBF24" />
      <path d="M12 12 h24 v14 h-24 z" fill="#1E1B4B" />
      <path d="M10 16 h4 v10 h-4 z" fill="#1E1B4B" />
      <path d="M34 16 h4 v10 h-4 z" fill="#1E1B4B" />
      <path d="M14 12 h20 v4 h-20 z" fill="#312E81" />
      <rect x="14" y="16" width="4" height="3" fill="#4338CA" />
      <rect x="22" y="16" width="4" height="2" fill="#4338CA" />
      <rect x="30" y="16" width="4" height="3" fill="#4338CA" />
      <rect x="14" y="18" width="20" height="12" fill="#FED7AA" />
      <rect x="12" y="20" width="2" height="8" fill="#FED7AA" />
      <rect x="34" y="20" width="2" height="8" fill="#FED7AA" />
      <circle cx="18" cy="23" r="3.5" fill="none" stroke="#FBBF24" stroke-width="1.1" shape-rendering="auto" />
      <circle cx="30" cy="23" r="3.5" fill="none" stroke="#FBBF24" stroke-width="1.1" shape-rendering="auto" />
      <line x1="21.5" y1="23" x2="26.5" y2="23" stroke="#FBBF24" stroke-width="1.1" shape-rendering="auto" />
      ${faceContent}
      <rect x="15" y="30" width="18" height="12" fill="#7C3AED" />
      <rect x="18" y="30" width="12" height="12" fill="#8E74E5" />
      <polygon points="21,30 27,30 24,34" fill="#FED7AA" shape-rendering="auto" />
      <rect x="20" y="34" width="8" height="6" fill="#38BDF8" rx="1" shape-rendering="auto" />
      <line x1="24" y1="34" x2="24" y2="40" stroke="#0284C7" stroke-width="0.8" shape-rendering="auto" />
      <circle cx="14" cy="36" r="2.2" fill="#FED7AA" shape-rendering="auto" />
      <circle cx="34" cy="36" r="2.2" fill="#FED7AA" shape-rendering="auto" />
      <rect x="18" y="42" width="5" height="3" fill="#4338CA" />
      <rect x="25" y="42" width="5" height="3" fill="#4338CA" />
      <rect x="17" y="44" width="6" height="2" fill="#1E1B4B" />
      <rect x="25" y="44" width="6" height="2" fill="#1E1B4B" />
    </svg>
  `;
}

export const PET_CATALOG = [
  {
    id: 'bandage-nurse-realistic',
    name: 'Nurse',
    emoji: '🩺',
    svg: getNurseSvg('default')
  },
  {
    id: 'shinchan',
    name: 'Shinchan',
    emoji: '🎈',
    svg: getShinchanSvg('default')
  },
  {
    id: 'banana-cat',
    name: 'Banana Cat',
    emoji: '🍌',
    svg: getBananaCatSvg('default')
  },
  {
    id: 'moxie',
    name: 'Muksi',
    emoji: '📚',
    svg: getMoxieSvg('default')
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
    if (avatar) avatar.innerHTML = getPetSvg(petId, 'default');
    container.classList.remove('is-hop', 'is-wiggle', 'is-cheer', 'is-spin', 'is-squish', 'is-nod');
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

// STRICT CHECK: Determine if the current screen is the Login / Authentication screen
export function isLoginScreenActive() {
  if (typeof document === 'undefined') return false;
  if (document.body.classList.contains('on-login-screen')) return true;
  const authScreen = document.getElementById('auth-screen');
  if (authScreen && !authScreen.classList.contains('hide')) {
    return true;
  }
  // Check if unauthenticated on root/index
  const isIndex = window.location.pathname.endsWith('/index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
  if (isIndex) {
    const token = localStorage.getItem('token') || localStorage.getItem('nnl_auth_token') || localStorage.getItem('nnl_auth_session');
    if (!token) return true;
  }
  return false;
}

// Synchronize Pet Visibility: NEVER visible on login screen, and only if enabled by user
export function syncPetVisibility() {
  const el = document.getElementById('apk-companion-pet');
  const onLogin = isLoginScreenActive();
  const enabled = isPetEnabled();

  if (onLogin) {
    if (el) {
      el.style.display = 'none';
      el.classList.add('hide', 'hide-on-auth');
    }
    document.body.classList.add('on-login-screen');
    return;
  }

  document.body.classList.remove('on-login-screen');
  document.body.classList.toggle('apk-pet-disabled', !enabled);

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
  const currentPetId = getActivePetId();
  const avatar = container.querySelector('.apk-pet-avatar');
  if (avatar) {
    avatar.innerHTML = getPetSvg(currentPetId, expr);
  }

  if (bodyAnim) {
    container.classList.remove('is-hop', 'is-wiggle', 'is-cheer', 'is-spin', 'is-squish', 'is-nod');
    void container.offsetWidth; // trigger reflow
    container.classList.add(bodyAnim);
  }

  clearTimeout(expressionResetTimeout);
  if (expr !== 'default') {
    expressionResetTimeout = setTimeout(() => {
      const curAvatar = container.querySelector('.apk-pet-avatar');
      if (curAvatar) {
        curAvatar.innerHTML = getPetSvg(currentPetId, 'default');
      }
      container.classList.remove('is-hop', 'is-wiggle', 'is-cheer', 'is-spin', 'is-squish', 'is-nod');
    }, 2600);
  }
}

function renderPetElement() {
  if (document.getElementById('apk-companion-pet')) return;
  if (isLoginScreenActive()) return; // NEVER render on login screen

  const currentPetId = getActivePetId();

  const root = document.createElement('div');
  root.id = 'apk-companion-pet';
  root.className = 'apk-companion-pet';
  root.setAttribute('role', 'button');
  root.setAttribute('tabindex', '0');
  root.setAttribute('aria-label', `Companion Pet`);
  root.style.display = (isPetEnabled() && !isLoginScreenActive()) ? 'flex' : 'none';

  root.innerHTML = `
    <div class="apk-pet-bursts" aria-hidden="true"></div>
    <div class="apk-pet-avatar">
      ${getPetSvg(currentPetId, 'default')}
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

  const burstsEl = root.querySelector('.apk-pet-bursts');

  // Dynamic emotional expressions cycle: facial emotion + body reaction + micro sparkles
  const EXPRESSIONS = [
    { expr: 'happy', anim: 'is-hop', burst: ['✨', '★', '💛'] },
    { expr: 'wink', anim: 'is-wiggle', burst: ['✧', '♪', '🌸'] },
    { expr: 'heart-eyes', anim: 'is-cheer', burst: ['♥', '💖', '✨'] },
    { expr: 'focus', anim: 'is-nod', burst: ['⚡', '✦', '🔥'] },
    { expr: 'shocked', anim: 'is-squish', burst: ['💧', '!', '✦'] },
    { expr: 'happy', anim: 'is-spin', burst: ['🌟', '♫', '✨'] }
  ];
  let exprIndex = 0;

  const handleTap = () => {
    const item = EXPRESSIONS[exprIndex % EXPRESSIONS.length];
    exprIndex++;

    // Apply facial expression + body change animation
    setPetExpression(item.expr, item.anim);

    // Cute emotional micro-particle burst (Zero text bubbles!)
    if (burstsEl) {
      for (let i = 0; i < 4; i++) {
        const p = document.createElement('span');
        p.className = 'apk-pet-burst-item';
        p.textContent = item.burst[i % item.burst.length];
        p.style.setProperty('--bx', `${(Math.random() - 0.5) * 60}px`);
        p.style.setProperty('--by', `${-25 - Math.random() * 40}px`);
        burstsEl.appendChild(p);
        setTimeout(() => p.remove(), 750);
      }
    }
  };

  // Drag and drop support with touch pointer capture
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
    try { root.setPointerCapture(e.pointerId); } catch (_) {}
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const cx = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const cy = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const dx = cx - startX;
    const dy = cy - startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) moved = true;
    const newX = Math.max(10, Math.min(window.innerWidth - 68, originX + dx));
    const newY = Math.max(10, Math.min(window.innerHeight - 80, originY + dy));
    pos.x = newX;
    pos.y = newY;
    setPosition(newX, newY);
  };

  const onPointerUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    root.classList.remove('is-dragging');
    try { root.releasePointerCapture(e.pointerId); } catch (_) {}
    if (!moved) {
      handleTap();
    }
  };

  root.addEventListener('pointerdown', onPointerDown);
  root.addEventListener('pointermove', onPointerMove);
  root.addEventListener('pointerup', onPointerUp);
  root.addEventListener('pointercancel', onPointerUp);

  // Periodically perform subtle natural idle micro-expressions (blink, cute ear twitch) - NO text!
  setInterval(() => {
    if (isDragging || isLoginScreenActive() || !isPetEnabled()) return;
    if (Math.random() < 0.4) {
      // Natural quick blink or subtle wink
      const randomExpr = Math.random() < 0.5 ? 'sleepy' : 'wink';
      const curAvatar = root.querySelector('.apk-pet-avatar');
      const curPetId = getActivePetId();
      if (curAvatar) {
        curAvatar.innerHTML = getPetSvg(curPetId, randomExpr);
        setTimeout(() => {
          if (curAvatar) curAvatar.innerHTML = getPetSvg(curPetId, 'default');
        }, 220);
      }
    }
  }, 24000);

  window.addEventListener('resize', () => {
    pos.x = Math.max(10, Math.min(window.innerWidth - 68, pos.x));
    pos.y = Math.max(10, Math.min(window.innerHeight - 80, pos.y));
    setPosition(pos.x, pos.y);
  });
}

export function initPetSystem() {
  if (typeof window === 'undefined' || window.__nnlPetMounted) return;
  window.__nnlPetMounted = true;

  // Observe login state changes dynamically
  const observer = new MutationObserver(() => {
    syncPetVisibility();
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  const authScreen = document.getElementById('auth-screen');
  if (authScreen) {
    observer.observe(authScreen, { attributes: true, attributeFilter: ['class', 'style'] });
  }

  // Initial check
  syncPetVisibility();
}
