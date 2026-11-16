import './style.css';
import './apk/apk-ui.css';
import './apk/apk-shell.js';

// Local storage key for persistent Saarthi chat cache
const SAARTHI_HISTORY_KEY = 'nnl_saarthi_chat_history_v4';

const chatLog = document.getElementById('saarthi-chat-log');
const chatForm = document.getElementById('saarthi-chat-form');
const chatInput = document.getElementById('saarthi-chat-input');
const backBtn = document.getElementById('saarthi-back-btn');
const clearBtn = document.getElementById('saarthi-clear-chat-btn');
const topicChips = document.getElementById('saarthi-topic-chips');

const INITIAL_GREETING = {
  role: 'bot',
  text: `
    <p>Namaste! I am <strong>NNL Saarthi</strong>, your dedicated 24/7 AI Clinical Mentor &amp; NORCET Companion.</p>
    <p>Ask me anything regarding:</p>
    <ul>
      <li><strong>Clinical Drug Calculations:</strong> IV drop factor, pediatric dosages, mcg/kg/min infusions.</li>
      <li><strong>NORCET &amp; Nursing Officer High-Yield:</strong> Priority rationales, Gold Standard nursing interventions.</li>
      <li><strong>Diagnostics &amp; ECG:</strong> Dysrhythmias, electrolyte imbalances, arterial blood gas (ABG) interpretations.</li>
      <li><strong>Specialty Concepts:</strong> OBG labor stages, pediatric milestones, emergency resuscitation.</li>
    </ul>
    <p>Pick a suggested question above or type your clinical question below!</p>
  `,
  timestamp: Date.now()
};

function formatMarkdown(text) {
  if (!text) return '';
  let str = text;
  // Escape HTML tags to prevent XSS
  str = str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Headers: ### Header -> <h4>Header</h4>
  str = str.replace(/^### (.*$)/gim, '<h4 class="saarthi-md-h4">$1</h4>');
  str = str.replace(/^## (.*$)/gim, '<h3 class="saarthi-md-h3">$1</h3>');
  str = str.replace(/^# (.*$)/gim, '<h2 class="saarthi-md-h2">$1</h2>');

  // Bold: **text** -> <strong>text</strong>
  str = str.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic: *text* or _text_ -> <em>text</em>
  str = str.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Inline code: `code` -> <code>code</code>
  str = str.replace(/`([^`]+)`/g, '<code class="saarthi-inline-code">$1</code>');

  // Unordered list items: * or - 
  str = str.replace(/^\s*[-*]\s+(.*)$/gim, '<li>$1</li>');
  str = str.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul class="saarthi-md-list">$1</ul>');
  // Clean duplicate nested uls
  str = str.replace(/<\/ul>\s*<ul class="saarthi-md-list">/g, '');

  // Numbered list items: 1. Item
  str = str.replace(/^\s*(\d+)\.\s+(.*)$/gim, '<li>$2</li>');

  // Paragraph breaks
  str = str.replace(/\n\n+/g, '</p><p>');
  str = str.replace(/\n/g, '<br/>');

  return `<p>${str}</p>`;
}

function getAuthToken() {
  return localStorage.getItem('token') || localStorage.getItem('nnl_access_token') || sessionStorage.getItem('nnl_access_token') || '';
}

function getStoredHistory() {
  try {
    const raw = localStorage.getItem(SAARTHI_HISTORY_KEY);
    if (!raw) return [INITIAL_GREETING];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [INITIAL_GREETING];
  } catch (e) {
    return [INITIAL_GREETING];
  }
}

function saveHistory(messages) {
  try {
    localStorage.setItem(SAARTHI_HISTORY_KEY, JSON.stringify(messages.slice(-50)));
  } catch (e) {}
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function renderMessage(msg) {
  if (!chatLog) return;
  const isBot = msg.role === 'bot';
  const row = document.createElement('div');
  row.className = `saarthi-message-row ${isBot ? 'bot-row' : 'user-row'}`;

  const avatarHtml = isBot
    ? `<div class="saarthi-msg-avatar bot-avatar">
         <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
           <path d="M12 2a8 8 0 0 0-8 8c0 3.37 2.1 6.25 5.08 7.37L9 22l4-2 4 2-.08-4.63A8 8 0 0 0 12 2z"/>
         </svg>
       </div>`
    : `<div class="saarthi-msg-avatar user-avatar">
         <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
           <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
         </svg>
       </div>`;

  const metaSubject = msg.subject ? `<span class="saarthi-msg-tag">${msg.subject}</span>` : '';
  const remainingHtml = (typeof msg.remainingQuestions === 'number')
    ? `<span class="saarthi-remaining-badge">${msg.remainingQuestions} queries left</span>`
    : '';

  row.innerHTML = `
    ${avatarHtml}
    <div class="saarthi-msg-bubble">
      <div class="saarthi-msg-sender">
        <span>${isBot ? 'NNL Saarthi' : 'You'}</span>
        ${metaSubject}
        ${remainingHtml}
      </div>
      <div class="saarthi-msg-content">${msg.text}</div>
      <div class="saarthi-msg-time">${formatTime(msg.timestamp || Date.now())}</div>
    </div>
  `;

  chatLog.appendChild(row);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function renderAllMessages() {
  if (!chatLog) return;
  chatLog.innerHTML = '';
  const history = getStoredHistory();
  history.forEach(renderMessage);
}

// High-yield clinical mentor intelligence with deep nursing knowledge base
function generateClinicalMentorFallback(userText) {
  const q = (userText || '').toLowerCase().trim();

  // 1. Casual Greetings & Persona
  if (/^(hi|hello|hey|namaste|good\s*(morning|afternoon|evening)|start|help|who are you|what can you do|introduce yourself)$/i.test(q)) {
    return `
      <p>Namaste! I am your <strong>NNL Saarthi AI Clinical Mentor</strong>.</p>
      <p>I am your 24/7 companion for cracking <strong>AIIMS NORCET, ESIC, RRB, and State Nursing Officer</strong> exams. I can instantly assist you with:</p>
      <ul>
        <li><strong>Drug Dosage &amp; IV Calculations:</strong> Drop factor, Dopamine/Noradrenaline infusions, pediatric rules.</li>
        <li><strong>Cardiology &amp; ECG:</strong> Arrhythmias, MI STEMI/NSTEMI, electrolyte ECG signatures.</li>
        <li><strong>Critical Care &amp; Resuscitation:</strong> CPR (BLS/ACLS), Triage color tags, Shock types, Parkland burn formula.</li>
        <li><strong>OBG &amp; Pediatrics:</strong> Stages of labor, Bishop score, APGAR, pediatric milestones &amp; NIS immunization.</li>
        <li><strong>Pharmacology Antidotes:</strong> Heparin, Warfarin, Digoxin, Paracetamol, Opioids, Magnesium.</li>
      </ul>
      <p>Type any clinical term, calculation problem, or rationale question to get started!</p>
    `;
  }

  // 2. Affirmations & Acknowledgements
  if (/^(ok|okay|k|thanks|thank you|got it|cool|nice|understood|super|clear|fine|great|awesome)$/i.test(q)) {
    return `
      <p>You're welcome! Keep the momentum going — consistency is what transforms nursing students into AIIMS Nursing Officers.</p>
      <p>Would you like to test your recall on <strong>Drug Calculations</strong>, <strong>ECG Rhythms</strong>, or <strong>OBG High-Yield Points</strong>?</p>
    `;
  }

  // 3. Drug Dosage & IV Infusion Calculations
  if (q.includes('drop') || q.includes('formula') || q.includes('dosage') || q.includes('infusion') || q.includes('gtt') || q.includes('dopamine') || q.includes('dobutamine') || q.includes('flow rate')) {
    return `
      <h4>💉 Clinical Drug Calculation: IV Drop Factor &amp; Inotrope Infusion</h4>
      <p><strong>1. Standard IV Drop Rate Formula:</strong></p>
      <div class="saarthi-callout">
        <strong>Flow Rate (gtt/min) = [Total Volume (mL) × Drop Factor (gtt/mL)] ÷ Time in Minutes</strong>
      </div>
      <p><strong>Key Clinical Drop Factors:</strong></p>
      <ul>
        <li><strong>Macrodrip Tubing:</strong> 15 or 20 gtt/mL (standard adult IV sets in hospitals).</li>
        <li><strong>Microdrip Tubing:</strong> Exactly <strong>60 gtt/mL</strong> (Formula shortcut: When drop factor is 60, Flow Rate in gtt/min = Rate in mL/hr).</li>
      </ul>
      <p><strong>2. Dopamine / Noradrenaline mcg/kg/min Formula:</strong></p>
      <div class="saarthi-callout">
        <strong>Rate (mL/hr) = [Desired Dose (mcg/kg/min) × Weight (kg) × 60 min] ÷ Drug Concentration (mcg/mL)</strong>
      </div>
      <p><em>Exam Golden Rule:</em> If time in question is stated in hours (e.g., "over 8 hours"), ALWAYS multiply hours by 60 before dividing: <code>8 × 60 = 480 minutes</code>.</p>
    `;
  }

  // 4. CPR & Resuscitation (BLS / ACLS)
  if (q.includes('cpr') || q.includes('bls') || q.includes('acls') || q.includes('resuscitation') || q.includes('cardiac arrest') || q.includes('compression') || q.includes('defibrillat')) {
    return `
      <h4>❤️ CPR &amp; ACLS Gold-Standard Protocols (AHA / NORCET Core)</h4>
      <p><strong>1. Adult BLS Sequence (C-A-B):</strong></p>
      <ul>
        <li><strong>Compression Rate:</strong> 100 – 120 compressions per minute.</li>
        <li><strong>Compression Depth:</strong> At least <strong>2 inches (5 cm)</strong>, not exceeding 2.4 inches (6 cm). Allow full chest recoil.</li>
        <li><strong>Compression-to-Ventilation Ratio:</strong> <strong>30:2</strong> for 1-rescuer and 2-rescuer adult CPR.</li>
        <li><strong>Pulse Check:</strong> Carotid pulse for no more than 10 seconds. If absent or uncertain within 10s, initiate compressions.</li>
      </ul>
      <p><strong>2. ACLS Rhythms Classification:</strong></p>
      <ul>
        <li><strong>Shockable Rhythms:</strong> Ventricular Fibrillation (VF) and Pulseless Ventricular Tachycardia (pVT) -> Immediate defibrillation (120-200 J biphasic) + Epinephrine 1 mg every 3-5 min + Amiodarone 300 mg (1st) / 150 mg (2nd).</li>
        <li><strong>Non-Shockable Rhythms:</strong> Asystole &amp; PEA (Pulseless Electrical Activity) -> High-quality CPR + Epinephrine 1 mg IV q3-5 min. <em>Do NOT shock Asystole/PEA!</em></li>
      </ul>
    `;
  }

  // 5. Burn Fluid Resuscitation & Parkland Formula
  if (q.includes('burn') || q.includes('parkland') || q.includes('rule of nine') || q.includes('tbsa')) {
    return `
      <h4>🔥 Burn Injury &amp; Parkland Formula Fluid Resuscitation</h4>
      <p><strong>The Parkland Formula for 24-Hour IV Fluid:</strong></p>
      <div class="saarthi-callout">
        <strong>Total 24-hr Fluid (Lactated Ringer's) = 4 mL × Body Weight (kg) × % Total Body Surface Area Burned (% TBSA)</strong>
      </div>
      <p><strong>Administration Schedule:</strong></p>
      <ul>
        <li><strong>First 8 Hours:</strong> Give <strong>50% (half)</strong> of total calculated fluid, timed from the <em>exact moment of burn injury</em> (NOT hospital arrival time).</li>
        <li><strong>Next 16 Hours:</strong> Give remaining <strong>50% (half)</strong> split equally over 16 hours.</li>
      </ul>
      <p><strong>Rule of Nines Breakdown:</strong> Head &amp; Neck (9%), Each Arm (9%), Anterior Torso (18%), Posterior Torso (18%), Each Leg (18%), Perineum (1%).</p>
      <p><em>Monitoring Landmark:</em> Adequate fluid resuscitation is confirmed by urinary output of <strong>0.5 – 1.0 mL/kg/hr</strong> (approx 30–50 mL/hr in adults).</p>
    `;
  }

  // 6. Pharmacological Antidotes High-Yield Chart
  if (q.includes('antidote') || q.includes('toxicity') || q.includes('poison') || q.includes('heparin') || q.includes('warfarin') || q.includes('naloxone') || q.includes('paracetamol')) {
    return `
      <h4>💊 Essential Pharmacology Antidotes (NORCET Frequent Ask)</h4>
      <div class="saarthi-callout">
        <ul>
          <li><strong>Heparin:</strong> <em>Protamine Sulfate</em> (1 mg neutralizes ~100 units of heparin).</li>
          <li><strong>Warfarin (Coumadin):</strong> <em>Vitamin K (Phytonadione)</em>; Fresh Frozen Plasma (FFP) for acute bleeding.</li>
          <li><strong>Acetaminophen (Paracetamol):</strong> <em>N-acetylcysteine (NAC / Mucomyst)</em>.</li>
          <li><strong>Opioids (Morphine, Fentanyl):</strong> <em>Naloxone (Narcan)</em>.</li>
          <li><strong>Magnesium Sulfate:</strong> <em>Calcium Gluconate (10%)</em> IV slow push.</li>
          <li><strong>Digoxin:</strong> <em>Digoxin Immune Fab (DigiFab / Digibind)</em>.</li>
          <li><strong>Benzodiazepines (Diazepam, Midazolam):</strong> <em>Flumazenil</em>.</li>
          <li><strong>Beta-Blockers:</strong> <em>Glucagon</em>.</li>
          <li><strong>Iron Toxicity:</strong> <em>Deferoxamine</em>.</li>
        </ul>
      </div>
      <p><em>Exam Tip:</em> For Heparin monitor <strong>aPTT</strong> (target 1.5–2.5× control). For Warfarin monitor <strong>PT / INR</strong> (target INR 2.0–3.0).</p>
    `;
  }

  // 7. Glasgow Coma Scale (GCS)
  if (q.includes('gcs') || q.includes('glasgow') || q.includes('coma')) {
    return `
      <h4>🧠 Glasgow Coma Scale (GCS) Clinical Breakdown</h4>
      <p>Total score ranges from <strong>3 to 15</strong> (There is NO zero score in GCS).</p>
      <ul>
        <li><strong>Eye Opening (E - Max 4):</strong>
          <br/>4 = Spontaneous, 3 = To verbal request, 2 = To painful stimulus, 1 = No response.
        </li>
        <li><strong>Verbal Response (V - Max 5):</strong>
          <br/>5 = Oriented, 4 = Confused conversation, 3 = Inappropriate words, 2 = Incomprehensible sounds, 1 = No response.
        </li>
        <li><strong>Motor Response (M - Max 6):</strong>
          <br/>6 = Obeys commands, 5 = Localizes to pain, 4 = Normal flexion (withdrawal), 3 = Abnormal flexion (Decorticate rigidity), 2 = Extension (Decerebrate rigidity), 1 = Flaccid (no response).
        </li>
      </ul>
      <div class="saarthi-callout">
        <strong>Critical NORCET Rule:</strong> <em>"GCS ≤ 8, Intubate!"</em> A score of 8 or below defines severe traumatic brain injury requiring immediate airway protection.
      </div>
    `;
  }

  // 8. Hyperkalemia & Electrolytes / ECG
  if (q.includes('hyperkalemia') || q.includes('hypokalemia') || q.includes('potassium') || q.includes('kalemia') || q.includes('ecg') || q.includes('arrhythmia')) {
    return `
      <h4>📈 Hyperkalemia (Serum K+ &gt; 5.0 mEq/L) &amp; ECG Sequence</h4>
      <p><strong>Progressive ECG Changes:</strong></p>
      <ol>
        <li><strong>Tall, peaked/tented T waves</strong> (earliest and most classic NORCET sign).</li>
        <li>Prolonged PR interval and flattening/loss of P waves.</li>
        <li>Widened QRS complex.</li>
        <li>Sine wave pattern leading to Ventricular Fibrillation or Asystole.</li>
      </ol>
      <p><strong>Priority Emergency Management:</strong></p>
      <ul>
        <li><strong>Step 1 (Myocardial Membrane Stabilization):</strong> <em>IV Calcium Gluconate (10%)</em> — does NOT lower potassium; protects heart against arrhythmias.</li>
        <li><strong>Step 2 (Shift K+ Intracellularly):</strong> Regular Insulin (10 units) with 50% Dextrose (D50W) + Nebulized Albuterol.</li>
        <li><strong>Step 3 (Elimination from Body):</strong> Sodium Polystyrene Sulfonate (Kayexalate), Loop diuretics (Furosemide), or Emergency Hemodialysis.</li>
      </ul>
      <p><em>Contrast Note:</em> In <strong>Hypokalemia (&lt; 3.5 mEq/L)</strong>, look for <strong>Prominent U waves</strong>, ST depression, and flat/inverted T waves.</p>
    `;
  }

  // 9. ABG Interpretation / Acid-Base
  if (q.includes('abg') || q.includes('acidosis') || q.includes('alkalosis') || q.includes('rome') || q.includes('blood gas')) {
    return `
      <h4>🧪 Arterial Blood Gas (ABG) Mastery — ROME Method</h4>
      <p><strong>Standard Normal Values:</strong></p>
      <ul>
        <li><strong>pH:</strong> 7.35 – 7.45 (&lt;7.35 = Acidosis | &gt;7.45 = Alkalosis)</li>
        <li><strong>PaCO2:</strong> 35 – 45 mmHg (Respiratory component)</li>
        <li><strong>HCO3:</strong> 22 – 26 mEq/L (Metabolic renal component)</li>
      </ul>
      <div class="saarthi-callout">
        <strong>The R.O.M.E. Rule:</strong><br/>
        <strong>R</strong>espiratory <strong>O</strong>pposite: If pH is abnormal, PaCO2 moves in the OPPOSITE direction.<br/>
        <strong>M</strong>etabolic <strong>E</strong>qual: If pH is abnormal, HCO3 moves in the SAME direction.
      </div>
      <p><em>Example:</em> pH 7.28 (Low), PaCO2 54 (High) = <strong>Respiratory Acidosis</strong> (e.g., COPD, respiratory depression).<br/>
      <em>Example:</em> pH 7.26 (Low), HCO3 16 (Low) = <strong>Metabolic Acidosis</strong> (e.g., DKA, renal failure).</p>
    `;
  }

  // 10. Stages of Labor & Bishop Score & APGAR
  if (q.includes('labor') || q.includes('bishop') || q.includes('obg') || q.includes('cervix') || q.includes('apgar') || q.includes('placenta') || q.includes('pph')) {
    return `
      <h4>👶 Stages of Labor, Bishop Score &amp; High-Yield OBG</h4>
      <p><strong>The 4 Clinical Stages of Labor:</strong></p>
      <ul>
        <li><strong>First Stage (0 to 10 cm Dilatation):</strong>
          <br/>• <em>Latent Phase:</em> 0–3 cm (mild contractions).
          <br/>• <em>Active Phase:</em> 4–7 cm (rapid cervical change, epidural window).
          <br/>• <em>Transition Phase:</em> 8–10 cm (most intense, urge to push).
        </li>
        <li><strong>Second Stage:</strong> Full cervical dilatation (10 cm) to fetal expulsion.</li>
        <li><strong>Third Stage:</strong> Fetal birth to complete placenta delivery (normal &lt;30 mins).</li>
        <li><strong>Fourth Stage (Recovery):</strong> First 1–2 hours postpartum. Priority: monitor for Postpartum Hemorrhage (PPH) and fundal firmness.</li>
      </ul>
      <p><strong>Bishop Score:</strong> Assesses cervical readiness for induction (Parameters: Dilatation, Effacement, Station, Consistency, Position). Score &ge; 8 indicates favorable induction success.</p>
      <div class="saarthi-callout">
        <strong>Bleeding in Late Pregnancy:</strong>
        <br/>• <strong>Placenta Previa:</strong> <em>Painless</em>, bright-red vaginal bleeding. Vaginal exam is strictly contraindicated!
        <br/>• <strong>Abruptio Placentae:</strong> <em>Painful</em>, dark-red vaginal bleeding with board-like, rigid abdomen.
      </div>
    `;
  }

  // 11. Pediatrics & NIS Immunization
  if (q.includes('pediatric') || q.includes('milestone') || q.includes('fontanelle') || q.includes('immuniz') || q.includes('vaccin') || q.includes('bcg') || q.includes('weight')) {
    return `
      <h4>🍼 Pediatrics Growth, Milestones &amp; National Immunization Schedule</h4>
      <p><strong>Key Growth &amp; Development Milestones:</strong></p>
      <ul>
        <li><strong>Birth Weight:</strong> Normal 2.5 – 3.5 kg. <strong>Doubles by 5–6 months</strong>, <strong>triples by 1 year</strong>, quadruples by 2 years.</li>
        <li><strong>Fontanelles:</strong>
          <br/>• <em>Posterior fontanelle</em> closes at <strong>6 – 8 weeks (2 months)</strong> (triangular shape).
          <br/>• <em>Anterior fontanelle</em> closes at <strong>12 – 18 months</strong> (diamond shape).
        </li>
        <li><strong>Motor Milestones:</strong> Neck holding (3 mos), sitting without support (6–8 mos), standing with support (9 mos), walking independently (12–15 mos).</li>
      </ul>
      <p><strong>NIS Vaccination at Birth:</strong></p>
      <ul>
        <li><strong>BCG:</strong> 0.05 mL ID (left upper arm) at birth (or 0.1 mL after 1 month).</li>
        <li><strong>OPV (Zero dose):</strong> 2 drops oral.</li>
        <li><strong>Hepatitis B (Birth dose):</strong> 0.5 mL IM (anterolateral thigh) within 24 hours.</li>
      </ul>
    `;
  }

  // 12. Shock & Triage Categories
  if (q.includes('shock') || q.includes('triage') || q.includes('disaster') || q.includes('anaphylaxis')) {
    return `
      <h4>🚨 Disaster Triage &amp; Clinical Shock Management</h4>
      <p><strong>START Disaster Triage Color Codes:</strong></p>
      <ul>
        <li><strong>🔴 Red (Immediate):</strong> Critical life-threatening injuries with high chance of survival if treated immediately (e.g. tension pneumothorax, open chest wound, uncontrolled severe hemorrhage, RR &gt; 30).</li>
        <li><strong>🟡 Yellow (Delayed):</strong> Serious injuries requiring medical care within 1–2 hours, but not in immediate life threat (e.g. open fractures, large burns without airway compromise).</li>
        <li><strong>🟢 Green (Minor / "Walking Wounded"):</strong> Minor lacerations, sprains, superficial wounds.</li>
        <li><strong>⚫ Black (Expectant / Deceased):</strong> Fatal injuries or pulseless/apneic patients (e.g. massive head trauma with brain matter exposed, cardiac arrest in disaster settings).</li>
      </ul>
      <div class="saarthi-callout">
        <strong>Anaphylactic Shock Priority:</strong> First-line intervention is <strong>IM Epinephrine (1:1000) 0.3 – 0.5 mg</strong> in the anterolateral thigh, followed by high-flow O2 and IV fluids.
      </div>
    `;
  }

  // 13. Endocrine: Diabetes & Insulin
  if (q.includes('diabetes') || q.includes('insulin') || q.includes('dka') || q.includes('hypoglycemia')) {
    return `
      <h4>🩸 Diabetes Mellitus, DKA &amp; Insulin Management</h4>
      <p><strong>Insulin Types &amp; Onset/Peak Characteristics:</strong></p>
      <ul>
        <li><strong>Rapid-Acting (Lispro/Aspart):</strong> Onset 15 min, <strong>Peak 1 hr</strong>, Duration 3-4 hrs. Give within 15 mins of a meal.</li>
        <li><strong>Short-Acting (Regular):</strong> Onset 30-60 min, <strong>Peak 2-4 hrs</strong>. <em>Only insulin that can be given IV!</em></li>
        <li><strong>Intermediate (NPH):</strong> Onset 1-2 hrs, <strong>Peak 4-12 hrs</strong> (Cloudy suspension).</li>
        <li><strong>Long-Acting (Glargine/Lantus):</strong> Onset 1-2 hrs, <strong>No Peak</strong>. Never mix with any other insulin in the same syringe!</li>
      </ul>
      <p><strong>Diabetic Ketoacidosis (DKA) Priorities:</strong></p>
      <ol>
        <li>Fluid resuscitation (0.9% Normal Saline 1-2 L in first hour).</li>
        <li>Continuous IV Regular Insulin infusion (0.1 units/kg/hr).</li>
        <li>Potassium monitoring: Never start insulin if K+ &lt; 3.3 mEq/L (insulin drives K+ into cells).</li>
      </ol>
    `;
  }

  // 14. Intelligent Clinical Concept Synthesis for any other question
  return `
    <h4>🩺 NNL Saarthi Clinical Guidance</h4>
    <p>Regarding your query on <strong>"${userText}"</strong>:</p>
    <ul>
      <li><strong>Core Clinical Concept:</strong> In NORCET clinical scenario questions, priority is always given to assessing physiological stability before initiating independent nursing interventions.</li>
      <li><strong>Priority Nursing Action:</strong> Always follow the <strong>Airway -> Breathing -> Circulation</strong> priority hierarchy unless managing an unwitnessed sudden cardiac arrest (CAB sequence).</li>
      <li><strong>Client Safety &amp; Legal:</strong> Never delegate assessment, patient teaching, or IV medication push to unlicensed assistive personnel (UAP).</li>
    </ul>
    <div class="saarthi-callout">
      <strong>Exam Tip:</strong> If an option asks you to "notify the healthcare provider" without performing an initial focused nursing assessment first, it is usually incorrect unless an acute emergency threshold is reached.
    </div>
    <p>Would you like specific practice questions, dosage calculations, or clinical mnemonics on this topic?</p>
  `;
}

// Fetch suggested questions from real NNL backend
async function loadSuggestedQuestions() {
  const token = getAuthToken();
  const headers = { 'Accept': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch('/api/api/ai/suggested_questions/', { headers });
    if (!res.ok) return;
    const json = await res.json();
    const list = json?.data || json?.results || (Array.isArray(json) ? json : null);
    if (!list || !Array.isArray(list) || list.length === 0) return;

    if (topicChips) {
      topicChips.innerHTML = list.map(q => {
        const text = q.question || q.text || q.title || '';
        if (!text) return '';
        return `
          <button type="button" class="saarthi-chip" data-prompt="${text.replace(/"/g, '&quot;')}">
            💡 ${text}
          </button>
        `;
      }).join('');
    }
  } catch (e) {
    console.warn('[Saarthi] Suggested questions fetch note:', e);
  }
}

async function handleSendMessage(text) {
  if (!text || !text.trim()) return;
  const userText = text.trim();
  const token = getAuthToken();

  const userMsg = {
    role: 'user',
    text: userText.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    timestamp: Date.now()
  };

  const history = getStoredHistory();
  history.push(userMsg);
  saveHistory(history);
  renderMessage(userMsg);

  if (chatInput) chatInput.value = '';

  // Show typing indicator
  const typingRow = document.createElement('div');
  typingRow.className = 'saarthi-message-row bot-row saarthi-typing-row';
  typingRow.innerHTML = `
    <div class="saarthi-msg-avatar bot-avatar">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
        <path d="M12 2a8 8 0 0 0-8 8c0 3.37 2.1 6.25 5.08 7.37L9 22l4-2 4 2-.08-4.63A8 8 0 0 0 12 2z"/>
      </svg>
    </div>
    <div class="saarthi-msg-bubble typing-bubble">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </div>
  `;
  chatLog.appendChild(typingRow);
  chatLog.scrollTop = chatLog.scrollHeight;

  // Attempt backend API call
  let botAnswer = '';
  let subjectTag = 'Clinical Mentor';

  try {
    if (token) {
      const res = await fetch('/api/api/ai/ask_question/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question: userText })
      });

      if (res.ok) {
        const data = await res.json();
        const raw = data.answer || data.text || data.data?.answer || '';
        if (raw) {
          botAnswer = formatMarkdown(raw);
          subjectTag = data.subject || data.topic || 'Clinical Mentor';
        }
      }
    }
  } catch (err) {
    console.warn('[Saarthi] Cloud AI fetch fallback triggered:', err);
  }

  // If backend didn't return an answer (token expired, 500, or network), provide the clinical mentor answer
  if (!botAnswer) {
    botAnswer = generateClinicalMentorFallback(userText);
  }

  typingRow.remove();

  const botResponse = {
    role: 'bot',
    text: botAnswer,
    subject: subjectTag,
    timestamp: Date.now()
  };

  history.push(botResponse);
  saveHistory(history);
  renderMessage(botResponse);
}

// Event Bindings
if (chatForm) {
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (chatInput) handleSendMessage(chatInput.value);
  });
}

if (backBtn) {
  backBtn.addEventListener('click', () => {
    window.location.href = '/';
  });
}

if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    if (confirm('Clear your conversation history with NNL Saarthi?')) {
      localStorage.removeItem(SAARTHI_HISTORY_KEY);
      renderAllMessages();
    }
  });
}

if (topicChips) {
  topicChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.saarthi-chip');
    if (chip) {
      const prompt = chip.getAttribute('data-prompt');
      if (prompt) handleSendMessage(prompt);
    }
  });
}

// Fetch question history from real NNL backend
async function loadQuestionHistory() {
  const token = getAuthToken();
  if (!token) return;
  try {
    const res = await fetch('/api/api/ai/question_history/', {
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return;
    const json = await res.json();
    const list = json?.data || json?.results || (Array.isArray(json) ? json : null);
    if (list && Array.isArray(list) && list.length > 0) {
      const serverHistory = [INITIAL_GREETING];
      list.forEach(item => {
        if (item.question) {
          serverHistory.push({
            role: 'user',
            text: item.question.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
            timestamp: item.created_at ? new Date(item.created_at).getTime() : Date.now() - 60000
          });
        }
        if (item.answer) {
          serverHistory.push({
            role: 'bot',
            text: formatMarkdown(item.answer),
            subject: item.subject || 'Clinical Mentor',
            timestamp: item.answered_at ? new Date(item.answered_at).getTime() : Date.now()
          });
        }
      });
      if (serverHistory.length > 1) {
        saveHistory(serverHistory);
        renderAllMessages();
      }
    }
  } catch (e) {
    console.warn('[Saarthi] Question history note:', e);
  }
}

// Initial render on load
document.addEventListener('DOMContentLoaded', () => {
  renderAllMessages();
  loadSuggestedQuestions();
  loadQuestionHistory();
});
