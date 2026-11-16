import './style.css';
import './apk/apk-ui.css';
import './apk/apk-shell.js';

// Local storage key for persistent Saarthi chat
const SAARTHI_HISTORY_KEY = 'nnl_saarthi_chat_history_v2';

const chatLog = document.getElementById('saarthi-chat-log');
const chatForm = document.getElementById('saarthi-chat-form');
const chatInput = document.getElementById('saarthi-chat-input');
const backBtn = document.getElementById('saarthi-back-btn');
const clearBtn = document.getElementById('saarthi-clear-chat-btn');
const topicChips = document.getElementById('saarthi-topic-chips');

const INITIAL_GREETING = {
  role: 'bot',
  text: `
    <p>Namaste! I am <strong>NNL Saarthi</strong>, your dedicated 24/7 AI Clinical Study Mentor.</p>
    <p>I can help you master:</p>
    <ul>
      <li><strong>Clinical Drug Calculations:</strong> IV flow rates, pediatric dosages, mcg/kg/min infusions.</li>
      <li><strong>NORCET &amp; Nursing Officer High-Yield:</strong> Priority rationales, Gold Standard nursing interventions, mnemonics.</li>
      <li><strong>ECG &amp; Diagnostics:</strong> Dysrhythmias, electrolyte imbalances, arterial blood gas (ABG) interpretations.</li>
      <li><strong>Specialty Concepts:</strong> OBG labor stages, pediatric milestones, triage, emergency resuscitation.</li>
    </ul>
    <p>Choose any quick topic above or type your clinical question below!</p>
  `,
  timestamp: Date.now()
};

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
         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
           <path d="M12 2a8 8 0 0 0-8 8c0 3.37 2.1 6.25 5.08 7.37L9 22l4-2 4 2-.08-4.63A8 8 0 0 0 12 2z"/>
         </svg>
       </div>`
    : `<div class="saarthi-msg-avatar user-avatar">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
           <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
         </svg>
       </div>`;

  row.innerHTML = `
    ${avatarHtml}
    <div class="saarthi-msg-bubble">
      <div class="saarthi-msg-sender">${isBot ? 'NNL Saarthi' : 'You'}</div>
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

function generateClinicalResponse(query) {
  const q = (query || '').toLowerCase().trim();

  if (q.includes('drop') || q.includes('flow rate') || q.includes('dosage') || q.includes('formula') || q.includes('calc')) {
    return `
      <h4>💉 Clinical Formula &amp; Drug Dosage Guide</h4>
      <p><strong>1. IV Flow Rate (Drops per Minute - gtt/min):</strong></p>
      <div class="saarthi-callout">
        <code>Flow Rate (gtt/min) = [Total Volume (mL) × Drop Factor (gtt/mL)] ÷ Time (in minutes)</code>
      </div>
      <ul>
        <li><strong>Standard Macro-drip:</strong> 10, 15, or 20 gtt/mL.</li>
        <li><strong>Micro-drip (Pediatric):</strong> 60 gtt/mL (Remember: in micro-drip, <code>mL/hr = gtt/min</code>).</li>
      </ul>
      <p><strong>Example:</strong> Infuse 1000 mL Normal Saline over 8 hours using a 15 gtt/mL set.<br/>
      <code>gtt/min = (1000 × 15) ÷ (8 × 60) = 15000 ÷ 480 ≈ 31.25 → 31 drops/min</code>.</p>
      <p><strong>Clinical Pearl:</strong> Always double check high-alert infusions (Heparin, Insulin, Potassium, Inotropes) with an independent second nurse!</p>
    `;
  }

  if (q.includes('glasgow') || q.includes('gcs')) {
    return `
      <h4>🧠 Glasgow Coma Scale (GCS) Breakdown</h4>
      <p>Total score ranges from <strong>3 (Deep coma/death)</strong> to <strong>15 (Fully awake/oriented)</strong> across 3 categories:</p>
      <ol>
        <li><strong>Eye Opening (E - Max 4):</strong>
          <ul>
            <li>4 = Spontaneous</li>
            <li>3 = To sound/verbal command</li>
            <li>2 = To pressure/pain</li>
            <li>1 = None</li>
          </ul>
        </li>
        <li><strong>Verbal Response (V - Max 5):</strong>
          <ul>
            <li>5 = Oriented (Person, place, time)</li>
            <li>4 = Confused conversation</li>
            <li>3 = Inappropriate words</li>
            <li>2 = Incomprehensible sounds (moaning)</li>
            <li>1 = None</li>
          </ul>
        </li>
        <li><strong>Motor Response (M - Max 6):</strong>
          <ul>
            <li>6 = Obeys commands</li>
            <li>5 = Localizes to pain</li>
            <li>4 = Normal flexion (withdrawal from pain)</li>
            <li>3 = Abnormal flexion (Decorticate posturing - arms flexed to core)</li>
            <li>2 = Extension (Decerebrate posturing - arms extended, pronated; worse prognosis)</li>
            <li>1 = None (Flaccid)</li>
          </ul>
        </li>
      </ol>
      <p><strong>NORCET Golden Rule:</strong> <code>GCS ≤ 8 → Intubate!</code> ("GCS eight, intubate").</p>
    `;
  }

  if (q.includes('ecg') || q.includes('hyperkalemia') || q.includes('potassium')) {
    return `
      <h4>📈 Hyperkalemia &amp; Cardiac Rhythm Management</h4>
      <p><strong>Progressive ECG Changes in Hyperkalemia (K<sup>+</sup> &gt; 5.0 mEq/L):</strong></p>
      <ol>
        <li><strong>Mild (5.5 - 6.5 mEq/L):</strong> Tall, narrow, tented (peaked) T waves; shortened QT interval.</li>
        <li><strong>Moderate (6.5 - 7.5 mEq/L):</strong> Flattened or lost P waves; prolonged PR interval; ST depression.</li>
        <li><strong>Severe (&gt; 7.5 - 8.0 mEq/L):</strong> Widening of QRS complex, bundle branch blocks, merging into a fatal <em>Sine Wave</em> pattern → Ventricular Fibrillation or Asystole.</li>
      </ol>
      <p><strong>Emergency Treatment Hierarchy (ACLS):</strong></p>
      <ul>
        <li><strong>Step 1 (Myocardial Membrane Stabilization):</strong> <em>Calcium Gluconate 10%</em> IV over 2–5 min (Protects heart from dysrhythmia; does NOT lower serum K<sup>+</sup>).</li>
        <li><strong>Step 2 (Shift K<sup>+</sup> into Cells):</strong> Regular Insulin 10 units IV + 50 mL 50% Dextrose (D50) IV push; nebulized Albuterol.</li>
        <li><strong>Step 3 (Eliminate K<sup>+</sup> from Body):</strong> IV Furosemide (Lasix), Sodium Polystyrene Sulfonate (Kayexalate), or emergent Hemodialysis.</li>
      </ul>
    `;
  }

  if (q.includes('labor') || q.includes('stages') || q.includes('obg') || q.includes('bishop')) {
    return `
      <h4>👶 Stages of Labor &amp; Clinical Management</h4>
      <ol>
        <li><strong>First Stage (Cervical Dilation: 0 to 10 cm):</strong>
          <ul>
            <li><em>Latent Phase:</em> 0 to 5 cm (mild contractions, mother excited/talkative).</li>
            <li><em>Active Phase:</em> 6 to 10 cm (rapid dilation &ge; 1 cm/hr, intense contractions, patient needs focused breathing).</li>
          </ul>
        </li>
        <li><strong>Second Stage (Fetal Expulsion: 10 cm to Birth):</strong>
          <ul>
            <li>Active pushing; crown of fetal head visible.</li>
            <li>Assess for early decelerations (benign head compression) vs variable (cord compression) or late decelerations (uteroplacental insufficiency).</li>
          </ul>
        </li>
        <li><strong>Third Stage (Placental Delivery: Birth to Placenta Expulsion):</strong>
          <ul>
            <li>Normal duration: 5 to 30 minutes.</li>
            <li>Cardinal signs of separation: Sudden gush of blood, lengthening of umbilical cord, uterus becomes firm and globular (fundus rises).</li>
            <li>Management: Active Management of Third Stage of Labor (AMTSL) with 10 IU Oxytocin IM/IV.</li>
          </ul>
        </li>
        <li><strong>Fourth Stage (Maternal Recovery: First 1–2 hours postpartum):</strong>
          <ul>
            <li>Monitor for Postpartum Hemorrhage (PPH). Fundus must be firm and at the level of the umbilicus. If boggy: <em>Massage fundus immediately!</em></li>
          </ul>
        </li>
      </ol>
    `;
  }

  if (q.includes('abg') || q.includes('acid') || q.includes('alkalosis')) {
    return `
      <h4>🧪 Rapid ABG Interpretation (ROME Method)</h4>
      <div class="saarthi-callout">
        <strong>Normal Reference Values:</strong><br/>
        • pH: <strong>7.35 – 7.45</strong> (Acidic &lt; 7.35 | Alkalotic &gt; 7.45)<br/>
        • PaCO<sub>2</sub>: <strong>35 – 45 mmHg</strong> (Respiratory parameter)<br/>
        • HCO<sub>3</sub><sup>-</sup>: <strong>22 – 26 mEq/L</strong> (Metabolic parameter)
      </div>
      <p><strong>The ROME Rule:</strong></p>
      <ul>
        <li><strong>R-O (Respiratory Opposite):</strong> If pH is high and PaCO<sub>2</sub> is low → <em>Respiratory Alkalosis</em> (Hyperventilation, panic). If pH is low and PaCO<sub>2</sub> is high → <em>Respiratory Acidosis</em> (COPD, hypoventilation).</li>
        <li><strong>M-E (Metabolic Equal):</strong> If pH is low and HCO<sub>3</sub> is low → <em>Metabolic Acidosis</em> (DKA, shock, renal failure). If pH is high and HCO<sub>3</sub> is high → <em>Metabolic Alkalosis</em> (Severe vomiting, NG suctioning).</li>
      </ul>
    `;
  }

  // General high yield nursing rationale
  return `
    <h4>📚 Clinical Guidance &amp; NORCET Concept</h4>
    <p>Regarding <strong>"${query}"</strong>:</p>
    <ul>
      <li><strong>Priority Nursing Action:</strong> Always assess ABCs (Airway, Breathing, Circulation) first unless the patient is in sudden unwitnessed collapse (CAB in CPR).</li>
      <li><strong>Assessment vs Intervention:</strong> Never select a physician order or intervention before completing a rapid focused nursing assessment unless life-threatening shock or arrest is evident.</li>
      <li><strong>Client Teaching:</strong> Emphasize compliance, adverse effect recognition (e.g. Digoxin toxicity halos, Lithium tremors, Aminoglycoside ototoxicity), and emergency reporting triggers.</li>
    </ul>
    <p>Would you like specific practice questions, dosage calculations, or clinical mnemonics on this topic?</p>
  `;
}

function handleSendMessage(text) {
  if (!text || !text.trim()) return;
  const userText = text.trim();

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
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
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

  setTimeout(() => {
    typingRow.remove();
    const botResponse = {
      role: 'bot',
      text: generateClinicalResponse(userText),
      timestamp: Date.now()
    };
    history.push(botResponse);
    saveHistory(history);
    renderMessage(botResponse);
  }, 450);
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

// Initial render on load
document.addEventListener('DOMContentLoaded', () => {
  renderAllMessages();
  chatInput?.focus();
});
renderAllMessages();
