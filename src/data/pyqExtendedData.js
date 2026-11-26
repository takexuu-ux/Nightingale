// Extended 2x & 1x Previous Year Questions & Written Exam Model Solutions
// Ensures 100% coverage of all 2x repeated and 1x emerging/short-note questions across all 4 subjects.

export const PYQ_EXTENDED_TOPICS = {
  msn: [
    {
      id: "grp-msn-dialysis-renal",
      title: "Acute Kidney Injury, ESRD & Hemodialysis / Peritoneal Dialysis",
      repeatCount: 2,
      years: ["2019", "2022"],
      subItems: [
        { concept: "Indications, principles (diffusion, osmosis, ultrafiltration) & vascular access (AV fistula)", years: "2019, 2022" },
        { concept: "Nursing care before, during, and after hemodialysis & disequilibrium syndrome", years: "2022" }
      ],
      questions: [
        {
          paperBadge: "MPMSU 2022 — Short Essay [5 Marks]",
          weight: "Short Essay | Target: 2–3 Handwritten Pages",
          questionText: "Define Hemodialysis. Explain its principles, vascular access, and nursing management of a patient undergoing hemodialysis."
        },
        {
          paperBadge: "NTRUHS 2019 — Short Note [5 Marks]",
          weight: "Short Note | Target: 2 Handwritten Pages",
          questionText: "Write a short note on Peritoneal Dialysis and its complications."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Definition & Core Physiologic Principles</div>
          <div class="concept-body">
            <p><strong>Hemodialysis</strong> is an extracorporeal renal replacement therapy in which blood is diverted from the patient's vascular system through an artificial semipermeable membrane (dialyzer) to clear uremic toxins, correct electrolyte imbalances, and remove excess fluid.</p>
            <ul>
              <li><strong>Diffusion:</strong> Movement of solutes (urea, creatinine, potassium) from an area of higher concentration (blood) to lower concentration (dialysate) across the semipermeable membrane.</li>
              <li><strong>Osmosis:</strong> Movement of water across the membrane from lower solute concentration to higher solute concentration.</li>
              <li><strong>Ultrafiltration:</strong> Movement of fluid under hydrostatic/transmembrane pressure gradient to relieve fluid overload.</li>
            </ul>
          </div>
        </div>
        <div class="concept-card">
          <div class="concept-title">2. Vascular Access & Care of AV Fistula</div>
          <div class="concept-body">
            <ul>
              <li><strong>Temporary Access:</strong> Dual-lumen central venous catheter (internal jugular or femoral vein).</li>
              <li><strong>Permanent Access:</strong> Arteriovenous (AV) fistula (Brescia-Cimino) or AV graft.</li>
              <li><strong>Nursing Care of AV Fistula:</strong> Palpate for <em>thrill</em> and auscultate for <em>bruit</em> every shift. Strictly avoid BP measurements, venipuncture, IV lines, or tight clothing on the fistula arm.</li>
            </ul>
          </div>
        </div>
        <div class="concept-card">
          <div class="concept-title">3. Nursing Management & Complications</div>
          <div class="concept-body">
            <ul>
              <li><strong>Pre-Dialysis:</strong> Record baseline weight, vital signs, and hold antihypertensives/water-soluble vitamins prior to session as ordered.</li>
              <li><strong>Intra-Dialysis:</strong> Monitor BP every 30 min for intradialytic hypotension, maintain heparinization, and watch for air embolism or muscle cramps.</li>
              <li><strong>Dialysis Disequilibrium Syndrome:</strong> Rapid urea clearance from blood vs CSF causes cerebral edema (headache, nausea, seizures); slow blood flow rate and notify physician.</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      id: "grp-msn-myasthenia",
      title: "Myasthenia Gravis & Guillain-Barré Syndrome (GBS)",
      repeatCount: 2,
      years: ["2020", "2025"],
      subItems: [
        { concept: "Pathophysiology (acetylcholine receptor antibodies) & Tensilon (Edrophonium) test", years: "2020, 2025" },
        { concept: "Myasthenic crisis vs Cholinergic crisis & airway management", years: "2025" }
      ],
      questions: [
        {
          paperBadge: "MPMSU Feb 2025 (Supp) — Short Note [5 Marks]",
          weight: "Short Note | Target: 2–3 Handwritten Pages",
          questionText: "Explain Myasthenia Gravis: clinical manifestations, diagnostic evaluation, and nursing management."
        },
        {
          paperBadge: "MPMSU 2020 — Short Answer [3 Marks]",
          weight: "Short Answer | Target: 1–2 Handwritten Pages",
          questionText: "Differentiate between Myasthenic Crisis and Cholinergic Crisis."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Definition & Pathophysiology</div>
          <div class="concept-body">
            <p><strong>Myasthenia Gravis</strong> is a chronic autoimmune neuromuscular junction disorder characterized by IgG autoantibodies directed against postsynaptic nicotinic acetylcholine receptors (AChR), resulting in fluctuating weakness of voluntary skeletal muscles that worsens with activity and improves with rest.</p>
          </div>
        </div>
        <div class="concept-card">
          <div class="concept-title">2. Clinical Manifestations & Diagnosis</div>
          <div class="concept-body">
            <ul>
              <li><strong>Ocular Symptoms (Early):</strong> Ptosis (drooping eyelids) and diplopia (double vision).</li>
              <li><strong>Bulbar & Respiratory:</strong> Dysphagia, dysarthria, weak cough, and progressive respiratory muscle fatigue.</li>
              <li><strong>Diagnosis:</strong> Anti-AChR antibody titer, Repetitive Nerve Stimulation (decremental response), Ice-pack test, and Edrophonium (Tensilon) test (transient improvement within 30–60 sec).</li>
            </ul>
          </div>
        </div>
        <div class="concept-card">
          <div class="concept-title">3. Pharmacological & Nursing Management</div>
          <div class="concept-body">
            <ul>
              <li><strong>Anticholinesterases:</strong> Pyridostigmine (Mestinon) given 30–45 minutes before meals to optimize chewing and swallowing.</li>
              <li><strong>Immunotherapy & Thymectomy:</strong> Corticosteroids, azathioprine, plasmapheresis / IVIG in acute crisis.</li>
              <li><strong>Myasthenic vs Cholinergic Crisis:</strong> Myasthenic crisis = under-medication (needs more neostigmine + ventilator support); Cholinergic crisis = over-medication (SLUDGE symptoms, requires atropine).</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      id: "grp-msn-fracture-traction",
      title: "Fractures, Plaster Cast Care & Traction Nursing Management",
      repeatCount: 2,
      years: ["2019", "2020"],
      subItems: [
        { concept: "Stages of bone healing & Compartment Syndrome (6 P's)", years: "2019, 2020" },
        { concept: "Skin vs Skeletal traction & nursing principles", years: "2020" }
      ],
      questions: [
        {
          paperBadge: "MPMSU 2020 — Short Essay [5 Marks]",
          weight: "Short Essay | Target: 2–3 Handwritten Pages",
          questionText: "Describe the principles of Traction and nursing care of a patient with Skeletal Traction."
        },
        {
          paperBadge: "NTRUHS 2019 — Short Note [5 Marks]",
          weight: "Short Note | Target: 2 Handwritten Pages",
          questionText: "Explain Compartment Syndrome and stages of fracture healing."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Principles of Effective Traction</div>
          <div class="concept-body">
            <ul>
              <li>Maintain continuous pull; never remove weights without a physician's order.</li>
              <li>Weights must hang freely off the floor and not rest on bed frames.</li>
              <li>Maintain proper body alignment and counter-traction (patient's body weight / slight elevation of foot of bed).</li>
              <li>Ropes must remain unobstructed in pulley grooves and knots secured tightly.</li>
            </ul>
          </div>
        </div>
        <div class="concept-card">
          <div class="concept-title">2. Neurovascular Assessment (6 P's of Compartment Syndrome)</div>
          <div class="concept-body">
            <p>Check every 1–2 hours distal to the cast/traction: <strong>Pain</strong> (unrelieved by opioids, worst on passive stretch), <strong>Pallor</strong>, <strong>Pulselessness</strong>, <strong>Paresthesia</strong>, <strong>Paralysis</strong>, and <strong>Poikilothermia</strong> (coolness). Immediate fasciotomy is required if compartment pressure rises.</p>
          </div>
        </div>
      `
    },
    {
      id: "grp-msn-disaster-nursing",
      title: "Disaster Nursing, Phases & Disaster Management Cycle",
      repeatCount: 1,
      years: ["2025"],
      subItems: [
        { concept: "Mitigation, Preparedness, Response, Recovery & Rehabilitation", years: "2025" },
        { concept: "Role of nurse during mass casualty & psychological first aid", years: "2025" }
      ],
      questions: [
        {
          paperBadge: "MPMSU Feb 2025 (Supp) — Short Essay [5 Marks]",
          weight: "Short Essay | Target: 2–3 Handwritten Pages",
          questionText: "Define Disaster. Explain the Disaster Management Cycle and the role of a nurse in disaster preparedness and response."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Definition & Types of Disasters</div>
          <div class="concept-body">
            <p>A <strong>Disaster</strong> is a serious disruption of the functioning of a community or society causing widespread human, material, economic, or environmental losses exceeding the ability of the affected community to cope using its own resources. Classified into Natural (earthquakes, floods, cyclones) and Man-made (industrial chemical leaks, transport accidents, bioterrorism).</p>
          </div>
        </div>
        <div class="concept-card">
          <div class="concept-title">2. Disaster Management Cycle & Nursing Roles</div>
          <div class="concept-body">
            <ul>
              <li><strong>Mitigation:</strong> Hazard mapping, structural safety, public health policy.</li>
              <li><strong>Preparedness:</strong> Hospital disaster drills, stockpiling emergency kits, staff training, communication trees.</li>
              <li><strong>Response:</strong> Rapid Triage (Red-Immediate, Yellow-Delayed, Green-Minimal, Black-Expectant), airway/hemorrhage stabilization, infection control, safe shelter & water sanitation.</li>
              <li><strong>Recovery & Rehabilitation:</strong> Long-term wound care, prosthetic/mobility rehab, PTSD & grief counseling, epidemiological disease surveillance.</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      id: "grp-msn-dermatology-psoriasis",
      title: "Psoriasis, Pemphigus Vulgaris & Burn-like Dermatoses",
      repeatCount: 1,
      years: ["2022"],
      subItems: [
        { concept: "Silvery scales, Auspitz sign, PUVA therapy & topical corticosteroids", years: "2022" }
      ],
      questions: [
        {
          paperBadge: "MPMSU 2022 — Short Note [5 Marks]",
          weight: "Short Note | Target: 2 Handwritten Pages",
          questionText: "Define Psoriasis. Write its clinical manifestations, diagnostic signs, and nursing management."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Pathophysiology & Clinical Features</div>
          <div class="concept-body">
            <p><strong>Psoriasis</strong> is a chronic, non-infectious, immune-mediated inflammatory skin disorder marked by accelerated epidermal keratinocyte turnover (3–4 days instead of 28 days), leading to well-demarcated erythematous plaques topped with thick silvery-white scales over extensor surfaces (elbows, knees, scalp).</p>
            <ul>
              <li><strong>Auspitz Sign:</strong> Pinpoint bleeding when scales are gently scraped off.</li>
              <li><strong>Koebner Phenomenon:</strong> Appearance of new psoriatic lesions at sites of skin trauma.</li>
            </ul>
          </div>
        </div>
        <div class="concept-card">
          <div class="concept-title">2. Medical & Nursing Management</div>
          <div class="concept-body">
            <ul>
              <li><strong>Topical:</strong> Emollients, salicylic acid keratolytics, calcipotriene (Vitamin D analog), coal tar, corticosteroids.</li>
              <li><strong>Phototherapy & Systemic:</strong> Narrowband UVB, PUVA (Psoralen + UVA), Methotrexate, Cyclosporine, Biologics (anti-TNF).</li>
              <li><strong>Nursing Care:</strong> Advise gentle bathing with lukewarm water, avoid scratching, moisturize immediately post-bath, and provide psychosocial support for body image disturbance.</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      id: "grp-msn-hiv-aids",
      title: "HIV / AIDS, Opportunistic Infections & Post-Exposure Prophylaxis (PEP)",
      repeatCount: 1,
      years: ["2019"],
      subItems: [
        { concept: "CD4 count monitoring, ART regimen & Needle-stick injury PEP protocol", years: "2019" }
      ],
      questions: [
        {
          paperBadge: "NTRUHS 2019 — Short Note [5 Marks]",
          weight: "Short Note | Target: 2 Handwritten Pages",
          questionText: "Explain Post-Exposure Prophylaxis (PEP) for needle-stick injury and nursing care of a patient with HIV/AIDS."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Immediate Needle-Stick Injury & PEP Protocol</div>
          <div class="concept-body">
            <ul>
              <li>Wash wound immediately with soap and running water (do NOT squeeze or apply bleach/caustic agents).</li>
              <li>Report immediately to Infection Control Officer / ICTC and test source & exposed healthcare worker.</li>
              <li><strong>PEP Initiation:</strong> Start 3-drug Antiretroviral Therapy (Tenofovir + Lamivudine + Dolutegravir) ideally within <strong>2 hours</strong> (and no later than 72 hours) for 28 days.</li>
            </ul>
          </div>
        </div>
        <div class="concept-card">
          <div class="concept-title">2. Nursing Care & Opportunistic Infection Prevention</div>
          <div class="concept-body">
            <p>Monitor CD4+ T-cell counts (&lt;200 cells/mm³ defines AIDS) and viral load; enforce strict hand hygiene and neutropenic/food-safety precautions to prevent <em>Pneumocystis jirovecii</em> pneumonia (PCP), oral candidiasis, and tuberculosis; provide high-calorie, high-protein nutrition and strict ART adherence counseling.</p>
          </div>
        </div>
      `
    }
  ],

  chn: [
    {
      id: "grp-chn-chd-tof",
      title: "Congenital Heart Diseases & Tetralogy of Fallot (TOF)",
      repeatCount: 2,
      years: ["2019", "2022"],
      subItems: [
        { concept: "4 defects of TOF, Tet spells (hypercyanotic spells) & knee-chest position", years: "2019, 2022" },
        { concept: "Acyanotic vs Cyanotic CHD classification & Blalock-Taussig shunt", years: "2022" }
      ],
      questions: [
        {
          paperBadge: "MPMSU 2022 — Long Essay [10 Marks]",
          weight: "Essay Question | Target: 3–4 Handwritten Pages",
          questionText: "Classify Congenital Heart Diseases. Describe the pathophysiology, clinical features, and emergency nursing management of a child with Tetralogy of Fallot."
        },
        {
          paperBadge: "NTRUHS 2019 — Short Note [5 Marks]",
          weight: "Short Note | Target: 2 Handwritten Pages",
          questionText: "Write nursing management of a child experiencing a Hypercyanotic ('Tet') Spell."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Classification & Four Defects of TOF</div>
          <div class="concept-body">
            <p><strong>Acyanotic (Left-to-Right shunt):</strong> VSD, ASD, PDA. <strong>Cyanotic (Right-to-Left shunt):</strong> Tetralogy of Fallot (TOF), Transposition of Great Arteries (TGA).</p>
            <p><strong>Four Anatomical Defects of Tetralogy of Fallot (PROVe):</strong></p>
            <ul>
              <li><strong>P</strong>ulmonary Stenosis (right ventricular outflow tract obstruction)</li>
              <li><strong>R</strong>ight Ventricular Hypertrophy (boot-shaped heart on X-ray)</li>
              <li><strong>O</strong>verriding Aorta (aorta sits over the VSD)</li>
              <li><strong>Ve</strong>ntricular Septal Defect (large VSD)</li>
            </ul>
          </div>
        </div>
        <div class="concept-card">
          <div class="concept-title">2. Emergency Management of a Hypercyanotic ('Tet') Spell</div>
          <div class="concept-body">
            <ul>
              <li><strong>Position:</strong> Immediately place the child in the <strong>Knee-Chest (Squatting) Position</strong> to increase systemic vascular resistance and force blood back into the pulmonary artery.</li>
              <li><strong>Oxygen & Calming:</strong> Administer 100% humidified oxygen and calm the child/parents to reduce oxygen demand.</li>
              <li><strong>Medications:</strong> IV Morphine sulfate (decreases infundibular spasm and respiratory drive), IV fluids, and Propranolol/Sodium bicarbonate if acidotic.</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      id: "grp-chn-cleft-lip-palate",
      title: "Cleft Lip & Cleft Palate (Pre & Post-Operative Care)",
      repeatCount: 2,
      years: ["2020", "2025"],
      subItems: [
        { concept: "Rule of 10s for cheiloplasty & palatoplasty timing", years: "2020, 2025" },
        { concept: "ESSR feeding technique & suture line protection (Logan bow, elbow restraints)", years: "2025" }
      ],
      questions: [
        {
          paperBadge: "MPMSU Feb 2025 (Supp) — Short Essay [5 Marks]",
          weight: "Short Essay | Target: 2–3 Handwritten Pages",
          questionText: "Describe the feeding techniques and pre- & post-operative nursing management of an infant with Cleft Lip and Cleft Palate."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Surgical Timing & Feeding Techniques</div>
          <div class="concept-body">
            <ul>
              <li><strong>Cleft Lip Repair (Cheiloplasty):</strong> Performed at 3 months using the <em>Rule of 10s</em> (10 weeks old, 10 lbs weight, Hb &ge;10 g/dL).</li>
              <li><strong>Cleft Palate Repair (Palatoplasty):</strong> Performed around 12–18 months before speech development.</li>
              <li><strong>ESSR Feeding Technique:</strong> <strong>E</strong>nlarge nipple opening, <strong>S</strong>timulate suck reflex, <strong>S</strong>wallow upright (45–60°), <strong>R</strong>est & burp frequently to prevent aspiration and otitis media.</li>
            </ul>
          </div>
        </div>
        <div class="concept-card">
          <div class="concept-title">2. Post-Operative Nursing Care</div>
          <div class="concept-body">
            <ul>
              <li><strong>Positioning:</strong> Side-lying or supine after cleft lip repair (never prone, to prevent rubbing suture line); prone/side-lying after palate repair for drainage.</li>
              <li><strong>Suture Protection:</strong> Apply elbow restraints (remove every 2 hrs for ROM), use Logan bow if ordered, avoid pacifiers, straws, spoons, or hard objects in mouth, and clean suture line gently with sterile normal saline after every feed.</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      id: "grp-chn-hirschsprung",
      title: "Hirschsprung's Disease (Congenital Aganglionic Megacolon)",
      repeatCount: 2,
      years: ["2019", "2020"],
      subItems: [
        { concept: "Absence of Meissner's & Auerbach's ganglion cells, ribbon-like stools, enterocolitis", years: "2019, 2020" }
      ],
      questions: [
        {
          paperBadge: "MPMSU 2020 — Short Note [5 Marks]",
          weight: "Short Note | Target: 2 Handwritten Pages",
          questionText: "Define Hirschsprung's disease. Explain its pathophysiology, clinical manifestations, and surgical nursing care."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Pathophysiology & Clinical Signs</div>
          <div class="concept-body">
            <p><strong>Hirschsprung's Disease</strong> is a congenital anomaly caused by the absence of parasympathetic ganglion cells (Meissner's and Auerbach's plexuses) in the distal colon/rectum, leading to absent peristalsis, functional obstruction, and proximal colonic dilation (megacolon).</p>
            <ul>
              <li><strong>Neonatal Signs:</strong> Failure to pass meconium within 24–48 hours, bilious vomiting, abdominal distension.</li>
              <li><strong>Older Child:</strong> Chronic constipation, foul-smelling <strong>ribbon-like stools</strong>, failure to thrive.</li>
              <li><strong>Diagnosis:</strong> Rectal biopsy (gold standard confirming absent ganglion cells), Barium enema (transition zone).</li>
            </ul>
          </div>
        </div>
        <div class="concept-card">
          <div class="concept-title">2. Surgical & Nursing Management</div>
          <div class="concept-body">
            <p>Two-stage repair: temporary diverting colostomy followed by definitive pull-through procedure (Swenson/Duhamel/Soave). Pre-op nursing: isotonic saline bowel irrigations (never tap water enemas due to water intoxication), measure abdominal girth daily, watch closely for toxic enterocolitis (explosive watery diarrhea, fever, shock).</p>
          </div>
        </div>
      `
    },
    {
      id: "grp-chn-jaundice",
      title: "Neonatal Hyperbilirubinemia (Jaundice) & Phototherapy Care",
      repeatCount: 2,
      years: ["2020", "2022"],
      subItems: [
        { concept: "Physiological vs Pathological jaundice, Kernicterus & Phototherapy nursing protocol", years: "2020, 2022" }
      ],
      questions: [
        {
          paperBadge: "MPMSU 2022 — Short Note [5 Marks]",
          weight: "Short Note | Target: 2 Handwritten Pages",
          questionText: "Differentiate Physiological and Pathological Neonatal Jaundice. Explain nursing care of a newborn under Phototherapy."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Physiological vs Pathological Jaundice</div>
          <div class="concept-body">
            <ul>
              <li><strong>Physiological:</strong> Appears after 24 hours of life, peaks day 3–5 (&lt;12 mg/dL), resolves by 7–10 days.</li>
              <li><strong>Pathological:</strong> Appears within <strong>first 24 hours</strong>, bilirubin rises &gt;5 mg/dL/day or exceeds 15 mg/dL, persistent &gt;2 weeks. Risk of <strong>Kernicterus</strong> (bilirubin encephalopathy).</li>
            </ul>
          </div>
        </div>
        <div class="concept-card">
          <div class="concept-title">2. Nursing Care During Phototherapy (420–470 nm Blue Light)</div>
          <div class="concept-body">
            <ul>
              <li>Shield eyes completely with opaque eye patches and cover genitalia/gonads.</li>
              <li>Keep infant naked except diaper/eye shield, placed 35–45 cm from light source; turn every 2 hours.</li>
              <li>Monitor temperature every 2–4 hours, maintain hydration (encourage frequent breastfeeding + 10–20% extra fluid allowance), and track urine/stool output (greenish loose stools are expected).</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      id: "grp-chn-tef",
      title: "Tracheoesophageal Fistula (TEF) & Esophageal Atresia",
      repeatCount: 1,
      years: ["2025"],
      subItems: [
        { concept: "3 C's (Coughing, Choking, Cyanosis), frothy saliva & Replogle suction", years: "2025" }
      ],
      questions: [
        {
          paperBadge: "MPMSU Feb 2025 (Supp) — Short Answer [3 Marks]",
          weight: "Short Answer | Target: 1–2 Handwritten Pages",
          questionText: "Write the clinical features (3 C's) and immediate nursing management of a newborn with Tracheoesophageal Fistula."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Clinical Recognition (3 C's) & Management</div>
          <div class="concept-body">
            <p>Suspect TEF/Esophageal Atresia in a neonate with maternal polyhydramnios, excessive frothy white oral secretions, and the <strong>3 C's during first feed: Coughing, Choking, and Cyanosis</strong>, plus inability to pass a nasogastric tube (coils in blind upper pouch).</p>
            <ul>
              <li><strong>Immediate Action:</strong> Keep strictly <strong>NPO</strong>, elevate head 30–45° (to prevent gastric reflux through fistula into lungs), maintain continuous low-intermittent suction of upper esophageal pouch (Replogle tube), administer IV fluids and broad-spectrum antibiotics prior to primary surgical anastomosis.</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      id: "grp-chn-underfive",
      title: "Under-Five Clinic (Well Baby Clinic) & Play Therapy",
      repeatCount: 1,
      years: ["2019"],
      subItems: [
        { concept: "5 components of Under-Five Clinic symbol & therapeutic play for hospitalized children", years: "2019" }
      ],
      questions: [
        {
          paperBadge: "NTRUHS 2019 — Short Note [5 Marks]",
          weight: "Short Note | Target: 2 Handwritten Pages",
          questionText: "Explain the aims and components of an Under-Five Clinic with its standard emblem."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Emblem & Five Core Services</div>
          <div class="concept-body">
            <p>The <strong>Under-Five Clinic</strong> integrates preventive, promotive, curative, referral, and educational services for children aged 0–5 years, represented by the triangular emblem:</p>
            <ul>
              <li><strong>Apex:</strong> Care in Illness (diagnosis & treatment of acute respiratory infections, diarrhea, malnutrition).</li>
              <li><strong>Left Side:</strong> Adequate Nutrition & Growth Monitoring (Road-to-Health card).</li>
              <li><strong>Right Side:</strong> Immunization & Preventive Care (NIS vaccines, Vitamin A).</li>
              <li><strong>Center (Inverted Triangle):</strong> Family Planning & Spacing.</li>
              <li><strong>Outer Border:</strong> Health Education for Mothers.</li>
            </ul>
          </div>
        </div>
      `
    }
  ],

  mhn: [
    {
      id: "grp-mhn-substance-abuse",
      title: "Alcohol Dependence Syndrome, Withdrawal (Delirium Tremens) & De-addiction",
      repeatCount: 2,
      years: ["2019", "2022"],
      subItems: [
        { concept: "Wernicke-Korsakoff syndrome, Delirium Tremens, Disulfiram & Benzodiazepines", years: "2019, 2022" }
      ],
      questions: [
        {
          paperBadge: "MPMSU 2022 — Long Essay [10 Marks]",
          weight: "Essay Question | Target: 3–4 Handwritten Pages",
          questionText: "Define Alcohol Dependence Syndrome. Describe withdrawal symptoms, Delirium Tremens, and comprehensive nursing management including rehabilitation."
        },
        {
          paperBadge: "NTRUHS 2019 — Short Answer [3 Marks]",
          weight: "Short Answer | Target: 1–2 Handwritten Pages",
          questionText: "Explain Disulfiram (Antabuse) therapy and patient education."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Alcohol Withdrawal & Delirium Tremens (DTs)</div>
          <div class="concept-body">
            <ul>
              <li><strong>Early Withdrawal (6–24 hrs):</strong> Coarse hand tremors, diaphoresis, tachycardia, anxiety, insomnia.</li>
              <li><strong>Delirium Tremens (48–72 hrs):</strong> Life-threatening emergency marked by severe agitation, autonomic instability (fever, hypertension), disorientation, and vivid visual/tactile hallucinations (formication).</li>
            </ul>
          </div>
        </div>
        <div class="concept-card">
          <div class="concept-title">2. Medical & Nursing Management</div>
          <div class="concept-body">
            <ul>
              <li><strong>Detoxification:</strong> Long-acting Benzodiazepines (Chlordiazepoxide or Lorazepam) guided by CIWA-Ar score to prevent seizures.</li>
              <li><strong>Thiamine (Vitamin B1):</strong> Administer IV/IM Thiamine <strong>before</strong> glucose infusions to prevent Wernicke's encephalopathy.</li>
              <li><strong>Relapse Prevention:</strong> Disulfiram (educate strictly to avoid hidden alcohol in mouthwash, perfumes, cough syrups), Naltrexone, Acamprosate, and Alcoholics Anonymous (AA) group support.</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      id: "grp-mhn-phobia-anxiety",
      title: "Phobic Disorders, Generalized Anxiety & Systematic Desensitization",
      repeatCount: 2,
      years: ["2020", "2025"],
      subItems: [
        { concept: "Agoraphobia, Social Phobia, Flooding vs Systematic Desensitization", years: "2020, 2025" }
      ],
      questions: [
        {
          paperBadge: "MPMSU Feb 2025 (Supp) — Short Essay [5 Marks]",
          weight: "Short Essay | Target: 2–3 Handwritten Pages",
          questionText: "Define Phobia. Classify types of phobias and explain behavioral therapies (Systematic Desensitization & Flooding) with nursing management."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Classification & Clinical Picture</div>
          <div class="concept-body">
            <p>A <strong>Phobia</strong> is an irrational, persistent, intense fear of a specific object, activity, or situation that leads to compelling avoidance behavior despite the person recognizing the fear is excessive.</p>
            <ul>
              <li><strong>Agoraphobia:</strong> Fear of open spaces, crowds, or places where escape is difficult.</li>
              <li><strong>Social Phobia:</strong> Fear of scrutiny or embarrassment in social/performance settings.</li>
              <li><strong>Specific Phobia:</strong> Acrophobia (heights), Claustrophobia (closed spaces), Zoophobia (animals).</li>
            </ul>
          </div>
        </div>
        <div class="concept-card">
          <div class="concept-title">2. Behavioral & Nursing Management</div>
          <div class="concept-body">
            <ul>
              <li><strong>Systematic Desensitization (Wolpe):</strong> 3 steps — Relaxation training (Jacobson's PMR), constructing an anxiety hierarchy, and gradual graded exposure while relaxed.</li>
              <li><strong>Flooding:</strong> Immediate prolonged exposure to the most feared stimulus until anxiety peaks and extinguishes (never force without informed consent).</li>
              <li><strong>Pharmacotherapy:</strong> SSRIs (Fluoxetine/Sertraline), Propranolol for performance anxiety, short-term Benzodiazepines.</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      id: "grp-mhn-dementia-delirium",
      title: "Delirium vs Dementia (Organic Mental Disorders)",
      repeatCount: 2,
      years: ["2019", "2022"],
      subItems: [
        { concept: "Onset, consciousness, reversibility, sundowning & safety interventions", years: "2019, 2022" }
      ],
      questions: [
        {
          paperBadge: "MPMSU 2022 — Short Essay [5 Marks]",
          weight: "Short Essay | Target: 2–3 Handwritten Pages",
          questionText: "Differentiate between Delirium and Dementia. Describe nursing management of a patient with Alzheimer's Dementia."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Differential Comparison: Delirium vs Dementia</div>
          <div class="concept-body">
            <table class="ans-table">
              <thead><tr><th>Feature</th><th>Delirium</th><th>Dementia</th></tr></thead>
              <tbody>
                <tr><td>Onset</td><td>Acute / Sudden (hours to days)</td><td>Insidious / Gradual (months to years)</td></tr>
                <tr><td>Consciousness</td><td>Clouded, fluctuating attention</td><td>Clear until late terminal stages</td></tr>
                <tr><td>Course</td><td>Fluctuates (worse at night / sundowning)</td><td>Chronic, progressive decline</td></tr>
                <tr><td>Prognosis</td><td>Usually reversible when cause treated</td><td>Largely irreversible (Alzheimer's, Vascular)</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="concept-card">
          <div class="concept-title">2. Nursing Care in Dementia</div>
          <div class="concept-body">
            <p>Maintain structured daily routines, place large clocks/calendars for reality orientation, use short simple sentences, prevent wandering with ID bracelets and safe low-bed environment, and avoid arguing when patient confabulates (use validation and gentle redirection).</p>
          </div>
        </div>
      `
    },
    {
      id: "grp-mhn-tnpr",
      title: "Therapeutic Nurse-Patient Relationship (Peplau's Phases) & Communication",
      repeatCount: 2,
      years: ["2020", "2025"],
      subItems: [
        { concept: "Pre-interaction, Orientation, Working & Termination phases; Transference/Countertransference", years: "2020, 2025" }
      ],
      questions: [
        {
          paperBadge: "MPMSU Feb 2025 (Supp) — Short Essay [5 Marks]",
          weight: "Short Essay | Target: 2–3 Handwritten Pages",
          questionText: "Describe the phases of a Therapeutic Nurse-Patient Relationship and explain therapeutic communication techniques."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Four Phases of Peplau's Therapeutic Relationship</div>
          <div class="concept-body">
            <ul>
              <li><strong>Pre-Interaction Phase:</strong> Nurse reviews chart and explores own biases/anxieties before meeting the patient.</li>
              <li><strong>Orientation Phase:</strong> Establishing trust, rapport, confidentiality boundaries, and defining contract/goals.</li>
              <li><strong>Working Phase:</strong> Exploring stressors, overcoming resistance/transference, developing adaptive coping skills.</li>
              <li><strong>Termination Phase:</strong> Summarizing progress, preparing for discharge, and resolving separation anxiety.</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      id: "grp-mhn-suicide",
      title: "Suicide Risk Assessment & Psychiatric Emergency Prevention",
      repeatCount: 1,
      years: ["2022"],
      subItems: [
        { concept: "SAD PERSONS scale, Warning signs & One-to-One observation protocol", years: "2022" }
      ],
      questions: [
        {
          paperBadge: "MPMSU 2022 — Short Note [5 Marks]",
          weight: "Short Note | Target: 2 Handwritten Pages",
          questionText: "List the risk factors for suicide and describe nursing prevention & safety protocols in an inpatient psychiatric ward."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Risk Assessment & Immediate Inpatient Safety</div>
          <div class="concept-body">
            <ul>
              <li><strong>High-Risk Indicators:</strong> Specific lethal plan, prior attempt, hopelessness, sudden calm after severe depression, giving away prized possessions.</li>
              <li><strong>Ward Safety Protocol:</strong> Place on continuous <strong>1:1 constant observation</strong>, remove all sharp objects, belts, shoelaces, glass, and cords; perform mouth checks after medication administration ("cheeking"); establish a no-harm safety contract and notify psychiatrist immediately.</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      id: "grp-mhn-personality",
      title: "Personality Disorders (Cluster A, B, C) & Eating Disorders",
      repeatCount: 1,
      years: ["2019"],
      subItems: [
        { concept: "Borderline (splitting), Antisocial, Anorexia Nervosa vs Bulimia Nervosa", years: "2019" }
      ],
      questions: [
        {
          paperBadge: "NTRUHS 2019 — Short Note [5 Marks]",
          weight: "Short Note | Target: 2 Handwritten Pages",
          questionText: "Classify Personality Disorders and explain nursing management of Borderline Personality Disorder."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Classification & Nursing Approach</div>
          <div class="concept-body">
            <ul>
              <li><strong>Cluster A (Odd/Eccentric):</strong> Paranoid, Schizoid, Schizotypal.</li>
              <li><strong>Cluster B (Dramatic/Erratic):</strong> Antisocial, Borderline (impulsivity, self-harm, splitting), Histrionic, Narcissistic.</li>
              <li><strong>Cluster C (Anxious/Fearful):</strong> Avoidant, Dependent, Obsessive-Compulsive.</li>
              <li><strong>Nursing Care for BPD:</strong> Maintain firm, consistent team-wide limit setting to prevent staff <em>splitting</em>, validate feelings without reinforcing self-harm, and encourage Dialectical Behavior Therapy (DBT).</li>
            </ul>
          </div>
        </div>
      `
    }
  ],

  stats: [
    {
      id: "grp-stats-design",
      title: "Research Designs (Experimental, Quasi-Experimental & Non-Experimental)",
      repeatCount: 2,
      years: ["2019", "2022"],
      subItems: [
        { concept: "True experimental (Randomization, Control, Manipulation) vs Quasi-experimental", years: "2019, 2022" },
        { concept: "Descriptive, Correlational, Cohort & Case-Control designs", years: "2022" }
      ],
      questions: [
        {
          paperBadge: "MPMSU 2022 — Long Essay [10 Marks]",
          weight: "Essay Question | Target: 3–4 Handwritten Pages",
          questionText: "Define Research Design. Classify research designs and differentiate between True Experimental and Quasi-Experimental designs with nursing examples."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Definition & Pillars of True Experimental Design</div>
          <div class="concept-body">
            <p>A <strong>Research Design</strong> is the overall architectural blueprint or plan for conducting a study to answer research questions and control extraneous variables.</p>
            <ul>
              <li><strong>Manipulation:</strong> Researcher introduces an intervention/treatment to the experimental group.</li>
              <li><strong>Control:</strong> Use of a comparison/control group receiving standard care or placebo.</li>
              <li><strong>Randomization:</strong> Every participant has an equal chance of assignment to experimental or control group.</li>
            </ul>
            <p><strong>Quasi-Experimental Design:</strong> Lacks either randomization or a control group (e.g., Non-equivalent control group pretest-posttest design).</p>
          </div>
        </div>
      `
    },
    {
      id: "grp-stats-hypothesis",
      title: "Hypothesis: Types, Characteristics & Formulation",
      repeatCount: 2,
      years: ["2020", "2025"],
      subItems: [
        { concept: "Null (H0) vs Research (H1), Simple vs Complex, Directional vs Non-directional", years: "2020, 2025" }
      ],
      questions: [
        {
          paperBadge: "MPMSU Feb 2025 (Supp) — Short Essay [5 Marks]",
          weight: "Short Essay | Target: 2–3 Handwritten Pages",
          questionText: "Define Hypothesis. Explain its types and criteria of a good research hypothesis with examples."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Definition & Classification of Hypothesis</div>
          <div class="concept-body">
            <p>A <strong>Hypothesis</strong> is a tentative, testable statement of the predicted relationship between two or more variables.</p>
            <ul>
              <li><strong>Null Hypothesis (H0):</strong> States there is NO statistically significant relationship/difference between variables.</li>
              <li><strong>Alternative/Research Hypothesis (H1):</strong> States a relationship/difference exists.</li>
              <li><strong>Directional vs Non-directional:</strong> Directional predicts the exact direction (e.g., "increases" or "decreases"); Non-directional states a difference exists without specifying direction.</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      id: "grp-stats-data-collection",
      title: "Data Collection Methods & Tools (Questionnaire, Interview, Observation)",
      repeatCount: 2,
      years: ["2019", "2020"],
      subItems: [
        { concept: "Structured vs Unstructured, Likert Scale, Advantages & Limitations", years: "2019, 2020" }
      ],
      questions: [
        {
          paperBadge: "MPMSU 2020 — Short Essay [5 Marks]",
          weight: "Short Essay | Target: 2–3 Handwritten Pages",
          questionText: "Describe the various methods of data collection in nursing research. Compare Questionnaire and Interview methods."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Methods & Comparison</div>
          <div class="concept-body">
            <ul>
              <li><strong>Questionnaire:</strong> Self-administered paper/digital forms; economical for large samples, preserves anonymity, but lower response rate and requires literacy.</li>
              <li><strong>Interview:</strong> Face-to-face or telephonic verbal questioning; high response rate, allows clarification and observation of non-verbal cues, but time-consuming and prone to interviewer bias.</li>
              <li><strong>Observation & Biophysiologic Measures:</strong> Checklist/rating scale observation and clinical instruments (BP, HbA1c, pulse oximetry).</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      id: "grp-stats-reliability-validity",
      title: "Reliability & Validity of Research Instruments",
      repeatCount: 2,
      years: ["2020", "2022"],
      subItems: [
        { concept: "Test-retest, Split-half, Cronbach's alpha; Content, Construct & Criterion validity", years: "2020, 2022" }
      ],
      questions: [
        {
          paperBadge: "MPMSU 2022 — Short Note [5 Marks]",
          weight: "Short Note | Target: 2 Handwritten Pages",
          questionText: "Define Reliability and Validity. Explain their types and relationship in nursing research."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Reliability vs Validity</div>
          <div class="concept-body">
            <p><strong>Reliability</strong> is the consistency, stability, and repeatability of an instrument (Test-retest, Inter-rater, Split-half, Cronbach's alpha &ge; 0.70).</p>
            <p><strong>Validity</strong> is the degree to which an instrument accurately measures what it is intended to measure (Face, Content, Construct, and Criterion-related validity). <em>Note: A reliable tool is not always valid, but a valid tool must always be reliable.</em></p>
          </div>
        </div>
      `
    },
    {
      id: "grp-stats-npc",
      title: "Normal Probability Curve (NPC) & Properties",
      repeatCount: 2,
      years: ["2019", "2025"],
      subItems: [
        { concept: "Bell-shaped symmetrical curve, Mean=Median=Mode, 68-95-99.7% rule & Skewness", years: "2019, 2025" }
      ],
      questions: [
        {
          paperBadge: "MPMSU Feb 2025 (Supp) — Short Note [5 Marks]",
          weight: "Short Note | Target: 2 Handwritten Pages",
          questionText: "Explain the characteristics and applications of a Normal Probability Curve (NPC) in nursing statistics."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Characteristics of Normal Probability Curve</div>
          <div class="concept-body">
            <ul>
              <li>Bell-shaped, bilaterally symmetrical, and unimodal; Mean = Median = Mode at the center.</li>
              <li>Tails are asymptotic to the X-axis (never touch the baseline).</li>
              <li><strong>Empirical Rule:</strong> Mean ± 1 SD covers <strong>68.26%</strong>, Mean ± 2 SD covers <strong>95.44%</strong>, and Mean ± 3 SD covers <strong>99.72%</strong> of all observations.</li>
              <li><strong>Skewness:</strong> Positive skew (tail right, Mean &gt; Median &gt; Mode); Negative skew (tail left, Mean &lt; Median &lt; Mode).</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      id: "grp-stats-ethics",
      title: "Ethical Principles in Nursing Research & Informed Consent",
      repeatCount: 1,
      years: ["2025"],
      subItems: [
        { concept: "Beneficence, Respect for Human Dignity, Justice, IRB & Informed Consent", years: "2025" }
      ],
      questions: [
        {
          paperBadge: "MPMSU Feb 2025 (Supp) — Short Answer [3 Marks]",
          weight: "Short Answer | Target: 1–2 Handwritten Pages",
          questionText: "Discuss the Belmont ethical principles and elements of Informed Consent in nursing research."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Core Ethical Principles & Informed Consent</div>
          <div class="concept-body">
            <ul>
              <li><strong>Beneficence:</strong> Freedom from harm and maximizing benefits over risks.</li>
              <li><strong>Respect for Human Dignity:</strong> Right to self-determination (voluntary participation & right to withdraw anytime) and full disclosure.</li>
              <li><strong>Justice:</strong> Fair treatment and right to privacy, anonymity, and confidentiality.</li>
              <li><strong>Informed Consent:</strong> Written voluntary agreement after explaining purpose, procedures, risks/benefits, alternatives, and Institutional Review Board (IRB) approval.</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      id: "grp-stats-tests-significance",
      title: "Tests of Significance (t-test, Chi-Square Test & ANOVA) + Scales of Measurement",
      repeatCount: 1,
      years: ["2022"],
      subItems: [
        { concept: "Parametric vs Non-parametric tests; Nominal, Ordinal, Interval & Ratio scales", years: "2022" }
      ],
      questions: [
        {
          paperBadge: "MPMSU 2022 — Short Note [5 Marks]",
          weight: "Short Note | Target: 2 Handwritten Pages",
          questionText: "Write a short note on Scales of Measurement and differentiate Parametric vs Non-parametric tests (t-test vs Chi-square)."
        }
      ],
      answerHtml: `
        <div class="concept-card">
          <div class="concept-title">1. Four Scales of Measurement (NOIR)</div>
          <div class="concept-body">
            <ul>
              <li><strong>Nominal:</strong> Categories without order (Gender, Blood group).</li>
              <li><strong>Ordinal:</strong> Ranked categories without equal intervals (Pain scale, Socioeconomic class).</li>
              <li><strong>Interval:</strong> Equal intervals, arbitrary zero (°C temperature, IQ).</li>
              <li><strong>Ratio:</strong> Equal intervals with absolute true zero (Height, Weight, Age).</li>
            </ul>
          </div>
        </div>
        <div class="concept-card">
          <div class="concept-title">2. Parametric vs Non-Parametric Tests</div>
          <div class="concept-body">
            <p><strong>Parametric (t-test, ANOVA, Pearson r):</strong> Require normally distributed interval/ratio data. <strong>Non-Parametric (Chi-square χ², Mann-Whitney U, Spearman rho):</strong> Distribution-free, ideal for nominal/ordinal or skewed data.</p>
          </div>
        </div>
      `
    }
  ]
};
