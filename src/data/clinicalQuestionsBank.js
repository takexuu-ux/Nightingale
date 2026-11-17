/**
 * clinicalQuestionsBank.js
 * High-yield NORCET clinical question bank with comprehensive clinical rationales,
 * physiological mechanisms, distractor analyses, and golden pearls.
 */

export function getClinicalFallbackQuestions(testTitle = '', duration = 1800) {
  const qBank = [
    {
      title: 'Which heart valve prevents the backflow of blood from the left ventricle into the left atrium during ventricular systole?',
      choices: [
        { id: 101, title: 'Tricuspid valve', is_correct: false },
        { id: 102, title: 'Mitral (Bicuspid) valve', is_correct: true },
        { id: 103, title: 'Aortic semilunar valve', is_correct: false },
        { id: 104, title: 'Pulmonary semilunar valve', is_correct: false }
      ],
      explanation: `
        <div class="clinical-rationale-block">
          <div style="margin-bottom:8px;"><strong style="color:#4ade80;font-size:13.5px;">✓ Correct Answer: Option B — Mitral (Bicuspid) valve</strong></div>
          <p style="margin:0 0 8px 0;line-height:1.55;">The <strong>mitral (bicuspid) valve</strong> is the dual-flap atrioventricular valve located between the left atrium and left ventricle. During ventricular systole, intraventricular pressure exceeds atrial pressure, forcing the valve cusps closed while papillary muscles and chordae tendineae prevent cusp prolapse and regurgitation.</p>
          <div style="margin-bottom:8px;"><strong style="color:#38bdf8;font-size:13px;">⚙️ Physiological &amp; Anatomical Mechanism:</strong></div>
          <p style="margin:0 0 8px 0;line-height:1.55;">During isovolumetric ventricular contraction and subsequent ventricular ejection, the left ventricle generates pressures up to 120 mmHg. The strong mitral valve leaflets, tethered by chordae tendineae to anterior and posterior papillary muscles, withstand this massive pressure gradient to prevent retrograde flow into the pulmonary venous system.</p>
          <div style="margin-bottom:8px;"><strong style="color:#f87171;font-size:13px;">❌ Why Other Options Are Incorrect:</strong></div>
          <ul style="margin:0 0 8px 0;padding-left:18px;line-height:1.55;">
            <li><strong>Tricuspid valve:</strong> Located on the right side of the heart between the right atrium and right ventricle.</li>
            <li><strong>Aortic semilunar valve:</strong> Prevents backflow from the ascending aorta back into the left ventricle during ventricular diastole.</li>
            <li><strong>Pulmonary semilunar valve:</strong> Prevents backflow from the pulmonary trunk back into the right ventricle during diastole.</li>
          </ul>
          <div style="background:rgba(234,179,8,0.12);border:1px solid rgba(234,179,8,0.3);border-radius:8px;padding:8px 12px;margin-top:6px;">
            <strong style="color:#facc15;font-size:12.5px;">🌟 NORCET Golden High-Yield Pearl:</strong>
            <div style="font-size:12px;margin-top:2px;">Mitral valve auscultation site: 5th intercostal space at midclavicular line (apex). Closure of the mitral and tricuspid valves produces the first heart sound (S1 - "lub").</div>
          </div>
        </div>
      `
    },
    {
      title: 'What is the primary physiological pacemaker of the human heart responsible for initiating normal electrical impulses?',
      choices: [
        { id: 105, title: 'Atrioventricular (AV) node', is_correct: false },
        { id: 106, title: 'Bundle of His', is_correct: false },
        { id: 107, title: 'Sinoatrial (SA) node', is_correct: true },
        { id: 108, title: 'Purkinje fibers', is_correct: false }
      ],
      explanation: `
        <div class="clinical-rationale-block">
          <div style="margin-bottom:8px;"><strong style="color:#4ade80;font-size:13.5px;">✓ Correct Answer: Option C — Sinoatrial (SA) node</strong></div>
          <p style="margin:0 0 8px 0;line-height:1.55;">The <strong>sinoatrial (SA) node</strong>, located subepicardially in the posterosuperior wall of the right atrium near the entrance of the superior vena cava, generates intrinsic spontaneous action potentials at an intrinsic rate of 60-100 impulses per minute, driving normal sinus rhythm.</p>
          <div style="margin-bottom:8px;"><strong style="color:#38bdf8;font-size:13px;">⚙️ Physiological Mechanism (Phase 4 Pacemaker Potential):</strong></div>
          <p style="margin:0 0 8px 0;line-height:1.55;">SA nodal cells exhibit automaticity due to 'funny' sodium-potassium inward currents (If channels) and T-type calcium channels, causing gradual diastolic depolarization toward threshold (-40 mV).</p>
          <div style="margin-bottom:8px;"><strong style="color:#f87171;font-size:13px;">❌ Why Other Options Are Incorrect:</strong></div>
          <ul style="margin:0 0 8px 0;padding-left:18px;line-height:1.55;">
            <li><strong>AV Node:</strong> Secondary/backup pacemaker generating 40-60 bpm; its primary role is physiological delay (0.12-0.20s) for ventricular filling.</li>
            <li><strong>Bundle of His:</strong> Conducts impulses from AV node through the fibrous cardiac skeleton at 40-50 bpm.</li>
            <li><strong>Purkinje fibers:</strong> Tertiary escape pacemaker generating only 20-40 bpm with rapid terminal myocardial conduction.</li>
          </ul>
          <div style="background:rgba(234,179,8,0.12);border:1px solid rgba(234,179,8,0.3);border-radius:8px;padding:8px 12px;margin-top:6px;">
            <strong style="color:#facc15;font-size:12.5px;">🌟 NORCET Golden High-Yield Pearl:</strong>
            <div style="font-size:12px;margin-top:2px;">Blood supply to the SA node is derived predominantly from the SA nodal artery arising from the Right Coronary Artery (RCA) in ~60% of individuals and Circumflex Artery (LCx) in ~40%.</div>
          </div>
        </div>
      `
    },
    {
      title: 'Which cranial nerve is primarily responsible for sensory innervation of the face and motor innervation of the muscles of mastication?',
      choices: [
        { id: 109, title: 'Cranial Nerve V (Trigeminal)', is_correct: true },
        { id: 110, title: 'Cranial Nerve VII (Facial)', is_correct: false },
        { id: 111, title: 'Cranial Nerve IX (Glossopharyngeal)', is_correct: false },
        { id: 112, title: 'Cranial Nerve XII (Hypoglossal)', is_correct: false }
      ],
      explanation: `
        <div class="clinical-rationale-block">
          <div style="margin-bottom:8px;"><strong style="color:#4ade80;font-size:13.5px;">✓ Correct Answer: Option A — Cranial Nerve V (Trigeminal)</strong></div>
          <p style="margin:0 0 8px 0;line-height:1.55;"><strong>Cranial Nerve V (Trigeminal)</strong> is a mixed cranial nerve providing general somatic sensation to the face, scalp, cornea, and oral cavity via its three divisions (V1 Ophthalmic, V2 Maxillary, V3 Mandibular), and motor innervation to the muscles of mastication (masseter, temporalis, medial and lateral pterygoids) via V3.</p>
          <div style="margin-bottom:8px;"><strong style="color:#f87171;font-size:13px;">❌ Why Other Options Are Incorrect:</strong></div>
          <ul style="margin:0 0 8px 0;padding-left:18px;line-height:1.55;">
            <li><strong>CN VII (Facial):</strong> Controls muscles of facial expression, taste on anterior 2/3 of tongue, and lacrimal/salivary secretions (Bell's palsy affects CN VII).</li>
            <li><strong>CN IX (Glossopharyngeal):</strong> Supplies sensation and taste to posterior 1/3 of tongue and innervates the stylopharyngeus muscle and parotid gland.</li>
            <li><strong>CN XII (Hypoglossal):</strong> Pure motor innervation to all intrinsic and extrinsic muscles of the tongue except palatoglossus.</li>
          </ul>
        </div>
      `
    },
    {
      title: 'During assessment of a patient with suspected hypocalcemia, light tapping over the facial nerve anterior to the earlobe elicits facial muscle twitching. This is documented as:',
      choices: [
        { id: 113, title: 'Trousseau sign', is_correct: false },
        { id: 114, title: 'Chvostek sign', is_correct: true },
        { id: 115, title: 'Kernig sign', is_correct: false },
        { id: 116, title: 'Brudzinski sign', is_correct: false }
      ],
      explanation: `
        <div class="clinical-rationale-block">
          <div style="margin-bottom:8px;"><strong style="color:#4ade80;font-size:13.5px;">✓ Correct Answer: Option B — Chvostek sign</strong></div>
          <p style="margin:0 0 8px 0;line-height:1.55;"><strong>Chvostek sign</strong> is a classic clinical indicator of neuromuscular hyperexcitability (tetany) secondary to <strong>hypocalcemia</strong> (serum calcium &lt; 8.5 mg/dL or ionized calcium &lt; 4.6 mg/dL). Light tapping over the trunk of facial nerve (CN VII) just anterior to the tragus and angle of the mandible causes ipsilateral spasm of facial muscles.</p>
          <div style="margin-bottom:8px;"><strong style="color:#f87171;font-size:13px;">❌ Why Other Options Are Incorrect:</strong></div>
          <ul style="margin:0 0 8px 0;padding-left:18px;line-height:1.55;">
            <li><strong>Trousseau sign:</strong> Carpopedal spasm induced by inflating a BP cuff above systolic pressure for 3 minutes (more sensitive and specific for hypocalcemia than Chvostek).</li>
            <li><strong>Kernig sign:</strong> Sign of meningeal irritation where extension of knee beyond 90 degrees with hip flexed causes resistance and pain.</li>
            <li><strong>Brudzinski sign:</strong> Sign of meningeal irritation where passive neck flexion induces involuntary flexion of hips and knees.</li>
          </ul>
          <div style="background:rgba(234,179,8,0.12);border:1px solid rgba(234,179,8,0.3);border-radius:8px;padding:8px 12px;margin-top:6px;">
            <strong style="color:#facc15;font-size:12.5px;">🌟 NORCET Emergency Priority:</strong>
            <div style="font-size:12px;margin-top:2px;">Immediate treatment for acute symptomatic hypocalcemia with tetany/stridor is slow intravenous infusion of 10% Calcium Gluconate with continuous ECG monitoring.</div>
          </div>
        </div>
      `
    },
    {
      title: 'Which electrocardiogram (ECG) abnormality is classic for acute hyperkalemia with serum potassium levels exceeding 6.0 mEq/L?',
      choices: [
        { id: 117, title: 'Prominent U waves and ST-segment depression', is_correct: false },
        { id: 118, title: 'Tall, narrow, peaked T waves', is_correct: true },
        { id: 119, title: 'Prolonged QT interval and flattened T waves', is_correct: false },
        { id: 120, title: 'Shortened PR interval with delta waves', is_correct: false }
      ],
      explanation: `
        <div class="clinical-rationale-block">
          <div style="margin-bottom:8px;"><strong style="color:#4ade80;font-size:13.5px;">✓ Correct Answer: Option B — Tall, narrow, peaked T waves</strong></div>
          <p style="margin:0 0 8px 0;line-height:1.55;">In <strong>hyperkalemia</strong> (serum potassium &gt; 5.5 mEq/L), elevated extracellular K+ accelerates Phase 3 cardiac repolarization via enhanced outward potassium conductances, generating symmetrical, tall, tented, peaked T waves with a narrow base.</p>
          <div style="margin-bottom:8px;"><strong style="color:#f87171;font-size:13px;">❌ Why Other Options Are Incorrect:</strong></div>
          <ul style="margin:0 0 8px 0;padding-left:18px;line-height:1.55;">
            <li><strong>Prominent U waves &amp; ST depression:</strong> Hallmarks of severe <em>hypokalemia</em> (&lt; 3.5 mEq/L).</li>
            <li><strong>Prolonged QT interval:</strong> Characteristic of <em>hypocalcemia</em> or <em>hypomagnesemia</em>.</li>
            <li><strong>Short PR with Delta waves:</strong> Diagnostic of Wolff-Parkinson-White (WPW) pre-excitation syndrome.</li>
          </ul>
        </div>
      `
    },
    {
      title: 'What specific pharmacological reversal agent is administered for active bleeding secondary to unfractionated heparin toxicity?',
      choices: [
        { id: 121, title: 'Vitamin K1 (Phytonadione)', is_correct: false },
        { id: 122, title: 'Protamine sulfate', is_correct: true },
        { id: 123, title: 'Naloxone hydrochloride', is_correct: false },
        { id: 124, title: 'Aminocaproic acid', is_correct: false }
      ],
      explanation: `
        <div class="clinical-rationale-block">
          <div style="margin-bottom:8px;"><strong style="color:#4ade80;font-size:13.5px;">✓ Correct Answer: Option B — Protamine sulfate</strong></div>
          <p style="margin:0 0 8px 0;line-height:1.55;"><strong>Protamine sulfate</strong> is a basic positively charged polycationic peptide derived from salmon sperm. It binds strongly to negatively charged, highly acidic heparin molecules via electrostatic salt formation, creating an inert, non-anticoagulant stable complex.</p>
          <div style="margin-bottom:8px;"><strong style="color:#f87171;font-size:13px;">❌ Antidote Equivalents Reference:</strong></div>
          <ul style="margin:0 0 8px 0;padding-left:18px;line-height:1.55;">
            <li><strong>Vitamin K1:</strong> Reversal agent for Warfarin (Coumadin) toxicity.</li>
            <li><strong>Naloxone:</strong> Reversal agent for Opioid overdose (morphine, fentanyl).</li>
            <li><strong>Aminocaproic acid:</strong> Antifibrinolytic agent used to neutralize excessive thrombolytic/fibrinolytic activity.</li>
          </ul>
        </div>
      `
    },
    {
      title: 'According to AHA/BLS guidelines for adult cardiopulmonary resuscitation, what is the target chest compression rate?',
      choices: [
        { id: 125, title: '80 to 100 compressions per minute', is_correct: false },
        { id: 126, title: '100 to 120 compressions per minute', is_correct: true },
        { id: 127, title: '120 to 140 compressions per minute', is_correct: false },
        { id: 128, title: 'At least 150 compressions per minute', is_correct: false }
      ],
      explanation: `
        <div class="clinical-rationale-block">
          <div style="margin-bottom:8px;"><strong style="color:#4ade80;font-size:13.5px;">✓ Correct Answer: Option B — 100 to 120 compressions per minute</strong></div>
          <p style="margin:0 0 8px 0;line-height:1.55;">American Heart Association (AHA) and ERC guidelines establish an optimal compression rate of <strong>100 to 120 compressions/min</strong>. Rates below 100 reduce coronary perfusion pressure, while rates exceeding 120 prevent adequate diastolic cardiac refill between compressions.</p>
          <div style="background:rgba(234,179,8,0.12);border:1px solid rgba(234,179,8,0.3);border-radius:8px;padding:8px 12px;margin-top:6px;">
            <strong style="color:#facc15;font-size:12.5px;">🌟 High-Yield Quality CPR Metrics:</strong>
            <div style="font-size:12px;margin-top:2px;">Compression depth: 2 to 2.4 inches (5 to 6 cm) in adults; complete chest recoil after each compression; minimize interruptions to &lt; 10 seconds; 30:2 ratio for single rescuer.</div>
          </div>
        </div>
      `
    },
    {
      title: 'An arterial blood gas (ABG) report shows: pH 7.27, PaCO2 42 mmHg, HCO3- 17 mEq/L. This clinical pattern represents:',
      choices: [
        { id: 129, title: 'Uncompensated metabolic acidosis', is_correct: true },
        { id: 130, title: 'Fully compensated respiratory acidosis', is_correct: false },
        { id: 131, title: 'Uncompensated respiratory alkalosis', is_correct: false },
        { id: 132, title: 'Partially compensated metabolic alkalosis', is_correct: false }
      ],
      explanation: `
        <div class="clinical-rationale-block">
          <div style="margin-bottom:8px;"><strong style="color:#4ade80;font-size:13.5px;">✓ Correct Answer: Option A — Uncompensated metabolic acidosis</strong></div>
          <p style="margin:0 0 8px 0;line-height:1.55;">Stepwise ABG analysis:
          <br>1. <strong>pH 7.27</strong> (Normal 7.35-7.45) = Acidosis.
          <br>2. <strong>PaCO2 42 mmHg</strong> (Normal 35-45 mmHg) = Within normal limits (no respiratory compensation yet).
          <br>3. <strong>HCO3- 17 mEq/L</strong> (Normal 22-26 mEq/L) = Low (primary metabolic disturbance causing acidosis).
          <br>Conclusion: <strong>Uncompensated Metabolic Acidosis</strong> (e.g., DKA, lactic acidosis, renal failure).</p>
        </div>
      `
    },
    {
      title: 'Following a percutaneous liver biopsy, which post-procedure position is vital to prevent puncture site hemorrhage and bile leakage?',
      choices: [
        { id: 133, title: 'Left lateral position with head elevated 30 degrees', is_correct: false },
        { id: 134, title: 'Right lateral decubitus position with pressure dressing applied', is_correct: true },
        { id: 135, title: 'Prone position with pillow under abdomen', is_correct: false },
        { id: 136, title: 'Dorsal recumbent with knees elevated', is_correct: false }
      ],
      explanation: `
        <div class="clinical-rationale-block">
          <div style="margin-bottom:8px;"><strong style="color:#4ade80;font-size:13.5px;">✓ Correct Answer: Option B — Right lateral decubitus position with pressure dressing applied</strong></div>
          <p style="margin:0 0 8px 0;line-height:1.55;">The liver is a highly vascular organ located in the right upper quadrant. Positioning the patient on their <strong>right lateral side</strong> for a minimum of 2 hours applies direct mechanical compression (tamponade) on the puncture site using patient body weight against a small folded towel or sandbag, drastically reducing hemorrhagic complications.</p>
        </div>
      `
    },
    {
      title: 'Which insulin preparation demonstrates the most rapid onset of action (10-15 minutes) and is intended for mealtime bolus coverage?',
      choices: [
        { id: 137, title: 'Regular Insulin (Humulin R)', is_correct: false },
        { id: 138, title: 'Insulin Lispro (Humalog) or Aspart (NovoLog)', is_correct: true },
        { id: 139, title: 'Isophane NPH Insulin', is_correct: false },
        { id: 140, title: 'Insulin Detemir (Levemir)', is_correct: false }
      ],
      explanation: `
        <div class="clinical-rationale-block">
          <div style="margin-bottom:8px;"><strong style="color:#4ade80;font-size:13.5px;">✓ Correct Answer: Option B — Insulin Lispro (Humalog) or Aspart (NovoLog)</strong></div>
          <p style="margin:0 0 8px 0;line-height:1.55;"><strong>Rapid-acting insulins</strong> (Lispro, Aspart, Glulisine) have an onset of <strong>10 to 15 minutes</strong>, peak in 45-90 minutes, and duration of 3-5 hours. Patients must have their meal tray immediately available prior to injection to prevent sudden hypoglycemia.</p>
          <div style="margin-bottom:8px;"><strong style="color:#f87171;font-size:13px;">❌ Insulin Pharmacokinetics Comparison:</strong></div>
          <ul style="margin:0 0 8px 0;padding-left:18px;line-height:1.55;">
            <li><strong>Regular Insulin:</strong> Short-acting; onset 30-60 mins, peak 2-4 hrs (only insulin given IV).</li>
            <li><strong>NPH (Isophane):</strong> Intermediate-acting; cloudy; onset 1-2 hrs, peak 4-12 hrs.</li>
            <li><strong>Detemir / Glargine:</strong> Long-acting basal; peakless, duration up to 24 hrs.</li>
          </ul>
        </div>
      `
    },
    {
      title: 'Prior to administering oral digoxin (Lanoxin) to an adult patient, the nurse assesses the apical pulse for 1 full minute. The dose is safely held if the rate is below:',
      choices: [
        { id: 141, title: '50 beats per minute', is_correct: false },
        { id: 142, title: '60 beats per minute', is_correct: true },
        { id: 143, title: '70 beats per minute', is_correct: false },
        { id: 144, title: '80 beats per minute', is_correct: false }
      ],
      explanation: `
        <div class="clinical-rationale-block">
          <div style="margin-bottom:8px;"><strong style="color:#4ade80;font-size:13.5px;">✓ Correct Answer: Option B — 60 beats per minute</strong></div>
          <p style="margin:0 0 8px 0;line-height:1.55;">Digoxin exerts negative chronotropic and negative dromotropic effects by stimulating the vagus nerve and inhibiting the AV node. In adults, if apical pulse is <strong>&lt; 60 bpm</strong> (in children &lt; 70 bpm, infants &lt; 90-100 bpm), the dose is withheld, and the prescriber notified. Hypokalemia drastically potentiates digoxin toxicity.</p>
        </div>
      `
    },
    {
      title: 'Which neurohormone synthesized by hypothalamic magnocellular neurons is released by the posterior pituitary to stimulate renal water retention?',
      choices: [
        { id: 145, title: 'Aldosterone', is_correct: false },
        { id: 146, title: 'Antidiuretic Hormone (Vasopressin)', is_correct: true },
        { id: 147, title: 'Atrial Natriuretic Peptide', is_correct: false },
        { id: 148, title: 'Angiotensin II', is_correct: false }
      ],
      explanation: `
        <div class="clinical-rationale-block">
          <div style="margin-bottom:8px;"><strong style="color:#4ade80;font-size:13.5px;">✓ Correct Answer: Option B — Antidiuretic Hormone (Vasopressin)</strong></div>
          <p style="margin:0 0 8px 0;line-height:1.55;"><strong>ADH (Vasopressin)</strong> is synthesized by the supraoptic and paraventricular nuclei of the hypothalamus and stored/secreted by the posterior pituitary (neurohypophysis). It acts on renal V2 receptors to insert <strong>Aquaporin-2</strong> water channels in principal cells of the collecting ducts, increasing free water reabsorption.</p>
        </div>
      `
    },
    {
      title: 'The Glasgow Coma Scale (GCS) provides a standardized scoring system for neurological assessment by grading which three specific categories of patient responses?',
      choices: [
        { id: 149, title: 'Eye opening, verbal response, and motor response', is_correct: true },
        { id: 150, title: 'Pupil reaction, reflex status, and speech clarity', is_correct: false },
        { id: 151, title: 'Orientation, tactile response, and deep tendon reflexes', is_correct: false },
        { id: 152, title: 'Motor strength, sensory level, and cranial nerve function', is_correct: false }
      ],
      explanation: `
        <div class="clinical-rationale-block">
          <div style="margin-bottom:8px;"><strong style="color:#4ade80;font-size:13.5px;">✓ Correct Answer: Option A — Eye opening, verbal response, and motor response</strong></div>
          <p style="margin:0 0 8px 0;line-height:1.55;">GCS score is evaluated across:
          <br>• <strong>Eye Opening (E 1-4):</strong> Spontaneous (4), To sound (3), To pressure (2), None (1).
          <br>• <strong>Verbal Response (V 1-5):</strong> Oriented (5), Confused (4), Inappropriate words (3), Incomprehensible sounds (2), None (1).
          <br>• <strong>Motor Response (M 1-6):</strong> Obeys commands (6), Localizes (5), Normal flexion/withdrawal (4), Abnormal flexion/decorticate (3), Extension/decerebrate (2), None (1).
          <br><em>Total range: 3 to 15. A score &le; 8 indicates severe coma and dictates airway protection via endotracheal intubation.</em></p>
        </div>
      `
    },
    {
      title: 'In patients with end-stage COPD and chronic carbon dioxide retention, why must supplemental oxygen flow rates be carefully controlled?',
      choices: [
        { id: 153, title: 'High flow causes immediate pulmonary interstitial fibrosis', is_correct: false },
        { id: 154, title: 'Excessive oxygen dampens peripheral chemoreceptor hypoxic ventilatory drive', is_correct: true },
        { id: 155, title: 'Oxygen at high concentrations accelerates bronchial mucus plug formation', is_correct: false },
        { id: 156, title: 'It induces sudden coronary artery vasospasm', is_correct: false }
      ],
      explanation: `
        <div class="clinical-rationale-block">
          <div style="margin-bottom:8px;"><strong style="color:#4ade80;font-size:13.5px;">✓ Correct Answer: Option B — Excessive oxygen dampens peripheral chemoreceptor hypoxic ventilatory drive</strong></div>
          <p style="margin:0 0 8px 0;line-height:1.55;">In chronic hypercapnia (COPD CO2 retainers), central respiratory medullary chemoreceptors become desensitized to high PaCO2. Ventilatory drive becomes dependent on <strong>hypoxic stimulation of peripheral carotid and aortic body chemoreceptors</strong>. Administering excessive FiO2 eliminates this stimulus and increases V/Q mismatch and Haldane effect, triggering acute CO2 narcosis and respiratory arrest.</p>
        </div>
      `
    },
    {
      title: 'What definitive diagnostic laboratory procedure confirms the diagnosis of active pulmonary tuberculosis by detecting Mycobacterium tuberculosis?',
      choices: [
        { id: 157, title: 'Mantoux tuberculin skin test (PPD)', is_correct: false },
        { id: 158, title: 'Sputum smear and culture for Acid-Fast Bacilli (AFB)', is_correct: true },
        { id: 159, title: 'High-resolution chest computed tomography scan', is_correct: false },
        { id: 160, title: 'Serum erythrocyte sedimentation rate (ESR)', is_correct: false }
      ],
      explanation: `
        <div class="clinical-rationale-block">
          <div style="margin-bottom:8px;"><strong style="color:#4ade80;font-size:13.5px;">✓ Correct Answer: Option B — Sputum smear and culture for Acid-Fast Bacilli (AFB)</strong></div>
          <p style="margin:0 0 8px 0;line-height:1.55;">The <strong>gold standard confirmation</strong> of active pulmonary tuberculosis is the identification of <em>Mycobacterium tuberculosis</em> through <strong>sputum smear microscopy (Ziehl-Neelsen / Auramine-rhodamine) and mycobacterial culture (Lowenstein-Jensen / MGIT)</strong> on three consecutive early morning sputum samples. Mantoux (PPD) indicates exposure or latent infection, not active disease.</p>
        </div>
      `
    }
  ];

  return qBank.map((q, idx) => ({
    id: `fb-q-${idx + 1}`,
    title: q.title,
    level_str: 'Medium',
    choices: q.choices,
    explanation: q.explanation
  }));
}
