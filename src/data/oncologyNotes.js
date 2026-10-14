// Dr. Deepak Marwah Master Oncology Medical-Surgical Nursing Repository
// High-yield, comprehensive, NORCET / AIIMS / NCLEX clinical notes dataset.
// Designed with publication-quality medical formatting, print-to-PDF support, and direct download capabilities.

export const ONCOLOGY_SUBJECT = {
  id: 'oncology-marwah',
  title: 'Oncology (Dr. Deepak Marwah)',
  shortTitle: 'Oncology',
  category: 'Dr. Deepak Marwah',
  faculty: 'Dr. Deepak Marwah',
  isCuratedOncology: true,
  description: 'Official clinical notes and handwritten lecture materials by Dr. Deepak Marwah.'
};

function buildHtmlTemplate({ title, day, subtitle, badge, sections, tables, protocols, mnemonics, clinicalPearls, questions }) {
  const sectionsHtml = (sections || []).map(sec => `
    <section class="doc-section">
      <h2 class="section-title"><span class="section-num">${sec.num || '•'}</span> ${sec.heading}</h2>
      <div class="section-content">${sec.content}</div>
    </section>
  `).join('');

  const tablesHtml = (tables || []).map(tbl => `
    <div class="doc-table-card">
      <h3 class="table-card-title">${tbl.title}</h3>
      ${tbl.caption ? `<p class="table-card-caption">${tbl.caption}</p>` : ''}
      <div class="table-responsive">
        <table class="medical-table">
          <thead>
            <tr>${tbl.headers.map(h => `<th>${h}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${tbl.rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `).join('');

  const protocolsHtml = (protocols || []).map(p => `
    <div class="protocol-box">
      <div class="protocol-header">
        <span class="protocol-badge">EMERGENCY PROTOCOL</span>
        <h3 class="protocol-title">${p.title}</h3>
      </div>
      <ol class="protocol-steps">
        ${p.steps.map(s => `<li><strong>${s.step}:</strong> ${s.action}</li>`).join('')}
      </ol>
      ${p.note ? `<div class="protocol-warning">⚠️ <strong>Critical Clinical Rule:</strong> ${p.note}</div>` : ''}
    </div>
  `).join('');

  const mnemonicsHtml = (mnemonics || []).map(m => `
    <div class="mnemonic-card">
      <div class="mnemonic-word">${m.word}</div>
      <div class="mnemonic-meaning">${m.meaning}</div>
      <div class="mnemonic-context">💡 <em>Clinical Context:</em> ${m.context}</div>
    </div>
  `).join('');

  const pearlsHtml = (clinicalPearls || []).map(p => `
    <div class="pearl-item">
      <div class="pearl-bullet">⭐</div>
      <div class="pearl-text"><strong>${p.title}:</strong> ${p.text}</div>
    </div>
  `).join('');

  const questionsHtml = (questions || []).map((q, idx) => `
    <div class="question-card">
      <div class="q-header">
        <span class="q-tag">AIIMS / NORCET High-Yield Vignette #${idx + 1}</span>
      </div>
      <p class="q-text">${q.question}</p>
      <div class="q-options">
        ${q.options.map((opt, oIdx) => `<div class="q-opt ${oIdx === q.correctIndex ? 'correct' : ''}"><strong>${String.fromCharCode(65 + oIdx)}.</strong> ${opt}</div>`).join('')}
      </div>
      <div class="q-rationale">
        <strong>Rationale:</strong> ${q.rationale}
      </div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Dr. Deepak Marwah (NNL ONE)</title>
  <style>
    :root {
      --bg-primary: #0a0c14;
      --bg-surface: #121522;
      --bg-surface-elevated: #1a1e30;
      --text-main: #e2e8f0;
      --text-muted: #94a3b8;
      --accent: #ff2d55;
      --accent-glow: rgba(255, 45, 85, 0.25);
      --border: rgba(255, 255, 255, 0.08);
      --success: #10b981;
      --warning: #f59e0b;
      --info: #38bdf8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg-primary);
      color: var(--text-main);
      line-height: 1.65;
      padding: 0;
      margin: 0;
      font-size: 15px;
    }
    /* Action Bar (Screen Only) */
    .top-action-bar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(18, 21, 34, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    .brand-mark {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-weight: 700;
      font-size: 0.85rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #fff;
    }
    .brand-badge {
      background: var(--accent);
      color: #fff;
      font-size: 0.65rem;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-weight: 800;
    }
    .action-buttons {
      display: flex;
      gap: 0.6rem;
    }
    .btn {
      appearance: none;
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.06);
      color: #fff;
      padding: 0.45rem 0.9rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      text-decoration: none;
      transition: all 0.15s ease;
    }
    .btn:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.2);
    }
    .btn-primary {
      background: var(--accent);
      border-color: var(--accent);
      color: #fff;
    }
    .btn-primary:hover {
      background: #e02449;
    }
    /* Main Layout */
    .doc-container {
      max-width: 960px;
      margin: 0 auto;
      padding: 2.5rem 1.75rem 5rem;
    }
    .doc-header {
      border-bottom: 1px solid var(--border);
      padding-bottom: 2rem;
      margin-bottom: 2.5rem;
    }
    .doc-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
    }
    .pill-day {
      background: rgba(255, 45, 85, 0.15);
      color: var(--accent);
      border: 1px solid rgba(255, 45, 85, 0.3);
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .pill-batch {
      background: rgba(255, 255, 255, 0.06);
      color: var(--text-muted);
      border: 1px solid var(--border);
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
    }
    .doc-title {
      font-size: 1.85rem;
      color: #fff;
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.25;
      margin-bottom: 0.6rem;
    }
    .doc-subtitle {
      font-size: 1rem;
      color: var(--text-muted);
      max-width: 760px;
    }
    .doc-faculty-box {
      margin-top: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      padding: 0.75rem 1rem;
      border-radius: 8px;
    }
    .faculty-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--accent);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.9rem;
    }
    .faculty-info strong {
      color: #fff;
      display: block;
      font-size: 0.85rem;
    }
    .faculty-info span {
      color: var(--text-muted);
      font-size: 0.75rem;
    }
    /* Section Styles */
    .doc-section {
      margin-bottom: 2.75rem;
    }
    .section-title {
      font-size: 1.25rem;
      color: #fff;
      font-weight: 700;
      margin-bottom: 1.2rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 0.5rem;
    }
    .section-num {
      color: var(--accent);
      font-size: 0.9rem;
      background: rgba(255, 45, 85, 0.12);
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .section-content p {
      margin-bottom: 1rem;
      color: var(--text-main);
    }
    .section-content ul, .section-content ol {
      margin: 0.75rem 0 1.25rem 1.5rem;
    }
    .section-content li {
      margin-bottom: 0.45rem;
    }
    /* Medical Tables */
    .doc-table-card {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1.25rem;
      margin: 1.75rem 0;
    }
    .table-card-title {
      color: #fff;
      font-size: 0.95rem;
      font-weight: 700;
      margin-bottom: 0.35rem;
    }
    .table-card-caption {
      color: var(--text-muted);
      font-size: 0.8rem;
      margin-bottom: 1rem;
    }
    .table-responsive {
      overflow-x: auto;
    }
    .medical-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
      text-align: left;
    }
    .medical-table th {
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
      padding: 0.65rem 0.85rem;
      font-weight: 700;
      border-bottom: 1px solid var(--border);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .medical-table td {
      padding: 0.65rem 0.85rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      color: var(--text-main);
      vertical-align: top;
    }
    .medical-table tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }
    /* Emergency Protocol Box */
    .protocol-box {
      background: rgba(239, 68, 68, 0.06);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-left: 4px solid #ef4444;
      border-radius: 8px;
      padding: 1.25rem;
      margin: 1.5rem 0;
    }
    .protocol-header {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }
    .protocol-badge {
      background: #ef4444;
      color: #fff;
      font-size: 0.65rem;
      font-weight: 800;
      padding: 0.2rem 0.5rem;
      border-radius: 3px;
      letter-spacing: 0.08em;
    }
    .protocol-title {
      color: #fff;
      font-size: 1rem;
      font-weight: 700;
    }
    .protocol-steps {
      margin-left: 1.25rem;
      color: var(--text-main);
    }
    .protocol-steps li {
      margin-bottom: 0.5rem;
    }
    .protocol-warning {
      margin-top: 1rem;
      padding: 0.65rem 0.85rem;
      background: rgba(245, 158, 11, 0.12);
      border-left: 3px solid #f59e0b;
      border-radius: 4px;
      color: #fbbf24;
      font-size: 0.82rem;
    }
    /* Mnemonics */
    .mnemonic-card {
      background: rgba(56, 189, 248, 0.06);
      border: 1px solid rgba(56, 189, 248, 0.2);
      border-left: 4px solid var(--info);
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin: 1rem 0;
    }
    .mnemonic-word {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--info);
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }
    .mnemonic-meaning {
      color: #fff;
      font-size: 0.9rem;
      margin-bottom: 0.4rem;
    }
    .mnemonic-context {
      color: var(--text-muted);
      font-size: 0.78rem;
    }
    /* Clinical Pearls */
    .pearl-item {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 0.85rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 0.75rem 1rem;
    }
    .pearl-bullet {
      color: #f59e0b;
      font-size: 1rem;
      flex-shrink: 0;
    }
    .pearl-text {
      font-size: 0.85rem;
      color: var(--text-main);
    }
    /* Case Questions */
    .question-card {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1.25rem;
      margin: 1.25rem 0;
    }
    .q-header {
      margin-bottom: 0.65rem;
    }
    .q-tag {
      background: rgba(16, 185, 129, 0.12);
      color: var(--success);
      border: 1px solid rgba(16, 185, 129, 0.3);
      font-size: 0.68rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .q-text {
      color: #fff;
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 0.85rem;
    }
    .q-options {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 1rem;
    }
    .q-opt {
      padding: 0.45rem 0.75rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      border-radius: 5px;
      font-size: 0.82rem;
      color: var(--text-muted);
    }
    .q-opt.correct {
      background: rgba(16, 185, 129, 0.1);
      border-color: rgba(16, 185, 129, 0.4);
      color: #a7f3d0;
      font-weight: 600;
    }
    .q-rationale {
      font-size: 0.8rem;
      color: var(--text-muted);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 0.65rem;
    }
    /* Footer */
    .doc-footer {
      margin-top: 3.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--text-muted);
      font-size: 0.75rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    /* Print Styling */
    @media print {
      .top-action-bar { display: none !important; }
      body {
        background: #ffffff !important;
        color: #1a202c !important;
        font-size: 11pt !important;
      }
      .doc-container {
        max-width: 100% !important;
        padding: 0 !important;
      }
      .doc-header {
        border-bottom: 2px solid #000 !important;
      }
      .doc-title {
        color: #000 !important;
        font-size: 18pt !important;
      }
      .section-title {
        color: #000 !important;
        border-bottom: 1px solid #ccc !important;
      }
      .medical-table th {
        background: #edf2f7 !important;
        color: #000 !important;
        border: 1px solid #cbd5e0 !important;
      }
      .medical-table td {
        border: 1px solid #e2e8f0 !important;
        color: #000 !important;
      }
      .protocol-box {
        background: #fff5f5 !important;
        border-left: 4px solid #c53030 !important;
        color: #000 !important;
      }
      .mnemonic-card {
        background: #ebf8ff !important;
        border-left: 4px solid #3182ce !important;
        color: #000 !important;
      }
      .q-opt.correct {
        background: #f0fff4 !important;
        border-color: #38a169 !important;
        color: #22543d !important;
      }
    }
  </style>
</head>
<body>
  <div class="top-action-bar">
    <div class="brand-mark">
      <span class="brand-badge">NNL ONE</span>
      <span>Nightingale Nursing • Red Sapphire Academic Archive</span>
    </div>
    <div class="action-buttons">
      <button class="btn btn-primary" onclick="window.print()">
        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24-1.077-.32-2.164-.32-3.329 0-4.015 3.018-7.5 7.5-7.5s7.5 3.485 7.5 7.5c0 1.165-.08 2.252-.32 3.329M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
        <span>Print / Save PDF</span>
      </button>
      <button class="btn" onclick="saveAsHtmlFile()">
        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
        <span>Download HTML</span>
      </button>
    </div>
  </div>

  <main class="doc-container">
    <header class="doc-header">
      <div class="doc-meta">
        <span class="pill-day">${day}</span>
        <span class="pill-batch">Adult Health Nursing (Med-Surg)</span>
        <span class="pill-batch">${badge || 'High-Yield Clinical Handout'}</span>
      </div>
      <h1 class="doc-title">${title}</h1>
      <p class="doc-subtitle">${subtitle || 'Exhaustive clinical and theoretical lecture notes synthesized directly from Dr. Deepak Marwah Sir\'s NNL ONE lecture series.'}</p>
      
      <div class="doc-faculty-box">
        <div class="faculty-avatar">DM</div>
        <div class="faculty-info">
          <strong>Lectures by Dr. Deepak Marwah</strong>
          <span>Faculty of Medicine &amp; Adult Health Nursing • NNL ONE Expert Series</span>
        </div>
      </div>
    </header>

    ${sectionsHtml}
    ${tablesHtml}
    ${protocolsHtml}

    ${mnemonics && mnemonics.length > 0 ? `
      <section class="doc-section">
        <h2 class="section-title"><span class="section-num">💡</span> High-Yield Clinical Mnemonics</h2>
        ${mnemonicsHtml}
      </section>
    ` : ''}

    ${clinicalPearls && clinicalPearls.length > 0 ? `
      <section class="doc-section">
        <h2 class="section-title"><span class="section-num">⭐</span> Dr. Deepak Marwah's Golden Pearls &amp; Warnings</h2>
        <div class="pearls-container">
          ${pearlsHtml}
        </div>
      </section>
    ` : ''}

    ${questions && questions.length > 0 ? `
      <section class="doc-section">
        <h2 class="section-title"><span class="section-num">📝</span> NORCET &amp; AIIMS Golden Clinical Vignettes</h2>
        <div class="questions-container">
          ${questionsHtml}
        </div>
      </section>
    ` : ''}

    <footer class="doc-footer">
      <div>© Nightingale Nursing Learning &amp; NNL ONE • Dr. Deepak Marwah Lectures</div>
      <div>Official Red Sapphire Batch Academic Archive • Clean Print Edition</div>
    </footer>
  </main>

  <script>
    function saveAsHtmlFile() {
      const htmlContent = document.documentElement.outerHTML;
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '${(title || 'Oncology_Notes').replace(/[^a-zA-Z0-9_-]/g, '_')}.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>`;
}

function makeDataUri(html) {
  return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
}

// ── MODULE 1: General Oncology, Carcinogenesis Principles & TNM Staging ──
const module1Html = buildHtmlTemplate({
  day: 'Oncology Day 1',
  title: 'Cellular Biology of Cancer, Carcinogenesis & TNM Staging',
  subtitle: 'Proto-oncogenes, tumor suppressors, chemical/physical/viral carcinogens, and AJCC 8th Edition staging criteria.',
  badge: 'Day-Wise Foundation',
  sections: [
    {
      num: '1',
      heading: 'Hallmarks of Cancer & Molecular Pathophysiology',
      content: `
        <p>Cancer is fundamentally a disorder of cellular proliferation, differentiation, and survival regulation. Hanahan &amp; Weinberg defined the fundamental hallmarks acquired during multistep tumor development:</p>
        <ul>
          <li><strong>Self-sufficiency in growth signals:</strong> Constitutive activation of oncogenes (e.g. <em>KRAS, HER2/neu, BCR-ABL</em>).</li>
          <li><strong>Insensitivity to anti-growth signals:</strong> Inactivation of tumor suppressor genes like <em>TP53</em> (Guardian of the Genome) and <em>RB1</em> (Retinoblastoma gene controlling G1-S checkpoint).</li>
          <li><strong>Evading apoptosis:</strong> Upregulation of anti-apoptotic Bcl-2 and downregulation of pro-apoptotic Bax/Bak.</li>
          <li><strong>Limitless replicative potential:</strong> Telomerase reactivation preventing cellular senescence.</li>
          <li><strong>Sustained angiogenesis:</strong> Secretion of VEGF (Vascular Endothelial Growth Factor) and bFGF, inducing neovascularization.</li>
          <li><strong>Tissue invasion and metastasis:</strong> Loss of E-cadherin cell-to-cell adhesion and secretion of matrix metalloproteinases (MMPs).</li>
          <li><strong>Reprogramming of energy metabolism (Warburg Effect):</strong> Preferential anaerobic glycolysis even in the presence of oxygen.</li>
        </ul>
      `
    },
    {
      num: '2',
      heading: 'Stages of Carcinogenesis (Chemical, Viral & Radiation)',
      content: `
        <p>Carcinogenesis proceeds in three distinct, sequential biological phases:</p>
        <ol>
          <li><strong>Initiation:</strong> Rapid, irreversible alteration in cellular DNA caused by an initiator carcinogen. Cells appear morphologically normal but carry mutational damage.</li>
          <li><strong>Promotion:</strong> Reversible, prolonged clonal expansion of initiated cells driven by promoters (e.g. phorbol esters, hormones, chronic inflammation). Promotion does not alter DNA directly and is reversible if the agent is removed.</li>
          <li><strong>Progression:</strong> Irreversible conversion of pre-neoplastic cells into fully malignant phenotype with chromosomal instability, aneuploidy, invasive growth, and metastatic potential.</li>
        </ol>
      `
    }
  ],
  tables: [
    {
      title: 'High-Yield Oncogenic Viruses & Microorganisms Matrix',
      caption: 'Crucial for NORCET & AIIMS medical-surgical nursing multiple-choice questions.',
      headers: ['Microorganism / Virus', 'Target Malignancy', 'Mechanism / Oncogene'],
      rows: [
        ['Human Papillomavirus (HPV 16, 18)', 'Cervical, Anal, Oropharyngeal Carcinoma', 'E6 binds/degrades p53; E7 binds/inactivates pRb'],
        ['Epstein-Barr Virus (EBV)', 'Burkitt Lymphoma, Nasopharyngeal Carcinoma', 'LMP-1 activation, t(8;14) c-MYC translocation'],
        ['Hepatitis B & C Viruses (HBV, HCV)', 'Hepatocellular Carcinoma (HCC)', 'HBx protein transactivation, chronic cirrhosis inflammation'],
        ['Helicobacter pylori', 'Gastric Adenocarcinoma & Gastric MALToma', 'CagA virulence factor, chronic gastritis and lymphoid hyperplasia'],
        ['Human Herpesvirus 8 (HHV-8 / KSHV)', 'Kaposi Sarcoma (AIDS-defining)', 'Viral G-protein coupled receptor, VEGF angiogenic cascade'],
        ['Schistosoma haematobium', 'Squamous Cell Carcinoma of Urinary Bladder', 'Chronic irritation by ova in bladder wall'],
        ['Clonorchis sinensis (Liver fluke)', 'Cholangiocarcinoma (Bile duct cancer)', 'Chronic biliary inflammation and ductal metaplasia']
      ]
    },
    {
      title: 'AJCC 8th Edition TNM Classification Reference',
      caption: 'Standard clinical staging framework for solid malignant tumors.',
      headers: ['Stage Category', 'Designation', 'Clinical Definition'],
      rows: [
        ['Primary Tumor (T)', 'Tx / T0 / Tis', 'Tx: Cannot be assessed; T0: No primary tumor; Tis: Carcinoma in situ (no basement membrane invasion)'],
        ['Primary Tumor (T)', 'T1, T2, T3, T4', 'Progressive increase in tumor size, depth of anatomical invasion, or local organ involvement'],
        ['Regional Nodes (N)', 'Nx / N0', 'Nx: Cannot be assessed; N0: No regional lymph node metastasis'],
        ['Regional Nodes (N)', 'N1, N2, N3', 'Increasing involvement, number, and anatomical distance of regional lymph node stations'],
        ['Distant Metastasis (M)', 'M0 / M1', 'M0: No distant metastasis; M1: Confirmed distant organ or non-regional nodal metastasis']
      ]
    }
  ],
  mnemonics: [
    {
      word: 'CAUTION',
      meaning: 'American Cancer Society 7 Cardinal Warning Signs',
      context: 'C = Change in bowel/bladder habits; A = A sore that does not heal; U = Unusual bleeding or discharge; T = Thickening or lump in breast/testes; I = Indigestion or difficulty swallowing; O = Obvious change in wart/mole; N = Nagging cough or persistent hoarseness.'
    }
  ],
  clinicalPearls: [
    {
      title: 'In Situ vs Invasive Carcinoma',
      text: 'Carcinoma in situ (Tis) has NOT penetrated the epithelial basement membrane. Therefore, it has zero potential for vascular or lymphatic metastasis until the basement membrane is breached.'
    },
    {
      title: 'Biopsy Rule of Thumb',
      text: 'Fine Needle Aspiration Cytology (FNAC) provides cytology only. Definitive histological staging, grading, and receptor profiling (ER/PR/HER2) requires Core Needle Biopsy or Excisional Biopsy.'
    }
  ],
  questions: [
    {
      question: 'Which of the following cellular genes is appropriately recognized as the "Guardian of the Genome" due to its ability to induce cell cycle arrest at G1-S checkpoint or trigger apoptosis following DNA damage?',
      options: ['HER2/neu oncogene', 'TP53 tumor suppressor gene', 'KRAS proto-oncogene', 'Bcl-2 anti-apoptotic gene'],
      correctIndex: 1,
      rationale: 'TP53 encodes the p53 protein, known as the "Guardian of the Genome". In response to DNA damage, p53 transactivates p21 (CIP1/WAF1) to arrest the cell cycle at G1, allowing DNA repair. If damage is irreparable, it activates Bax/PUMA to initiate apoptosis.'
    }
  ]
});

// ── MODULE 2: Diagnostic Oncology & Complete Tumor Marker Guide ──
const module2Html = buildHtmlTemplate({
  day: 'Oncology Day 2',
  title: 'Diagnostic Oncology & Complete Tumor Marker Guide',
  subtitle: 'Comprehensive analysis of serum biomarkers: CEA, CA-125, CA 19-9, PSA, AFP, Calcitonin, and Beta-hCG.',
  badge: 'High-Yield Diagnostics',
  sections: [
    {
      num: '1',
      heading: 'Clinical Utility & Limitations of Tumor Markers',
      content: `
        <p>Tumor markers are biochemical indicators produced either directly by neoplastic cells or by normal host tissues in response to malignancy. Key clinical principles taught by Dr. Deepak Marwah:</p>
        <ul>
          <li><strong>Not for primary population screening:</strong> With the exception of PSA in selected demographics, tumor markers generally lack sufficient sensitivity and specificity for definitive diagnosis.</li>
          <li><strong>Gold standard for monitoring recurrence:</strong> Following surgical resection or curative chemo-radiotherapy, rising tumor marker levels indicate subclinical disease recurrence months before radiologic detection.</li>
          <li><strong>Therapeutic response tracking:</strong> A precipitous drop following chemotherapy indicates effective cytotoxic destruction of tumor burden.</li>
          <li><strong>Baseline levels correlate with tumor volume:</strong> Higher pre-treatment levels frequently signify advanced staging or micrometastatic burden.</li>
        </ul>
      `
    }
  ],
  tables: [
    {
      title: 'Master Clinical Tumor Marker Reference Table',
      caption: 'Memorize these associations for AIIMS NORCET examinations.',
      headers: ['Tumor Marker', 'Primary Cancer Association', 'Non-Malignant Causes of Elevation', 'Clinical Role'],
      rows: [
        ['CEA (Carcinoembryonic Antigen)', 'Colorectal Carcinoma, Pancreatic, Gastric, Lung', 'Heavy smoking, Cirrhosis, Ulcerative Colitis, Pancreatitis', 'Serial monitoring after colorectal resection; cut-off >5 ng/mL'],
        ['CA-125', 'Epithelial Ovarian Carcinoma', 'Endometriosis, Pelvic Inflammatory Disease (PID), Pregnancy, Ascites', 'Monitoring ovarian cancer recurrence; normal <35 U/mL'],
        ['CA 19-9', 'Pancreatic Ductal Adenocarcinoma, Cholangiocarcinoma', 'Biliary obstruction, Cholecystitis, Cirrhosis', 'Monitoring pancreatic cancer response; normal <37 U/mL'],
        ['CA 15-3 & CA 27-29', 'Metastatic Breast Cancer', 'Benign breast disease, Hepatitis', 'Surveillance for systemic metastasis in breast cancer'],
        ['PSA (Prostate Specific Antigen)', 'Prostate Adenocarcinoma', 'Benign Prostatic Hyperplasia (BPH), Prostatitis, Urinary catheterization, DRE', 'Screening (>4.0 ng/mL); Free-to-Total PSA <15% strongly favors malignancy'],
        ['Alpha-Fetoprotein (AFP)', 'Hepatocellular Carcinoma (HCC), Non-Seminomatous Testicular Tumors', 'Pregnancy, Acute/Chronic viral hepatitis, Cirrhosis', 'Surveillance in cirrhotic patients with hepatic nodules; levels >500 mcg/L diagnostic'],
        ['Beta-hCG', 'Choriocarcinoma, Testicular Germ Cell Tumors, Hydatidiform Mole', 'Pregnancy, Exogenous testosterone abuse', 'Diagnostic and post-molar monitoring to zero titer'],
        ['Calcitonin', 'Medullary Carcinoma of Thyroid (MCT)', 'Hyperparathyroidism, Renal failure', 'Diagnosis, familial screening in MEN 2A and MEN 2B syndromes'],
        ['Bence Jones Protein', 'Multiple Myeloma (Light Chain)', 'Macroglobulinemia, Amyloidosis', 'Urine protein electrophoresis (UPEP) showing monoclonal free light chains']
      ]
    }
  ],
  mnemonics: [
    {
      word: '19-9 = PANCREAS',
      meaning: 'CA 19-9 for Pancreatic Cancer',
      context: 'CA 19-9 is elevated in Pancreatic adenocarcinoma and biliary tumors. CA 125 is Ovarian, CA 15-3 is Breast.'
    }
  ],
  clinicalPearls: [
    {
      title: 'Free vs Total PSA Ratio',
      text: 'In patients with borderline PSA (4.0 to 10.0 ng/mL), a Free PSA percentage <15% indicates a high probability of prostate cancer and mandates a transrectal ultrasound (TRUS) guided biopsy.'
    },
    {
      title: 'Avoid DRE before PSA Blood Draw',
      text: 'Digital rectal examination (DRE), vigorous prostate massage, or Foley catheter insertion can temporarily elevate serum PSA levels. Always draw blood for PSA prior to rectal exams or wait 48 hours.'
    }
  ],
  questions: [
    {
      question: 'A 62-year-old male with a history of hepatitis B cirrhosis is undergoing routine surveillance. Which tumor marker is most specific for detecting early hepatocellular carcinoma in this patient?',
      options: ['Carcinoembryonic Antigen (CEA)', 'Alpha-Fetoprotein (AFP)', 'CA 19-9', 'Calcitonin'],
      correctIndex: 1,
      rationale: 'Alpha-Fetoprotein (AFP) is the primary serum biomarker used alongside abdominal ultrasonography for hepatocellular carcinoma (HCC) surveillance in cirrhotic patients.'
    }
  ]
});

// ── MODULE 3: Cancer Chemotherapy Pharmacology, Classifications & Toxicities ──
const module3Html = buildHtmlTemplate({
  day: 'Oncology Day 3',
  title: 'Chemotherapy Pharmacology, Classifications & Cytotoxic Safety',
  subtitle: 'Cell cycle kinetics, alkylating agents, antimetabolites, anthracyclines, taxanes, and biological containment.',
  badge: 'Pharmacology Core',
  sections: [
    {
      num: '1',
      heading: 'Cell Cycle Kinetics in Chemotherapy',
      content: `
        <p>Antineoplastic drugs are classified based on their relationship with the cell cycle:</p>
        <ul>
          <li><strong>Cell Cycle-Specific (CCS) Agents:</strong> Exert cytotoxic effects exclusively during specific phases of the cell cycle. Schedule-dependent (more effective when administered as continuous infusions or frequent small doses).
            <ul>
              <li><strong>S Phase (DNA synthesis):</strong> Antimetabolites (Methotrexate, 5-Fluorouracil, Cytarabine, 6-Mercaptopurine, Hydroxyurea).</li>
              <li><strong>M Phase (Mitosis):</strong> Spindle inhibitors including Vinca alkaloids (Vincristine, Vinblastine) and Taxanes (Paclitaxel, Docetaxel).</li>
              <li><strong>G2 Phase:</strong> Bleomycin, Etoposide (Topoisomerase II inhibitor).</li>
            </ul>
          </li>
          <li><strong>Cell Cycle-Non-Specific (CCNS) Agents:</strong> Kill cells whether in resting G0 or actively cycling phases. Dose-dependent (higher doses directly translate to greater cell fraction kill).
            <ul>
              <li>Alkylating agents (Cyclophosphamide, Ifosfamide, Busulfan, Melphalan).</li>
              <li>Platinum analogs (Cisplatin, Carboplatin, Oxaliplatin).</li>
              <li>Antitumor antibiotics (Doxorubicin, Daunorubicin).</li>
            </ul>
          </li>
        </ul>
      `
    },
    {
      num: '2',
      heading: 'Safe Handling & Cytotoxic Containment Protocols',
      content: `
        <p>Because antineoplastic agents are mutagenic, teratogenic, and carcinogenic, strict institutional precautions must be maintained during preparation and administration:</p>
        <ul>
          <li><strong>Preparation Area:</strong> Must be prepared in a dedicated Class II Type B Biological Safety Cabinet (laminar airflow hood with HEPA filtration vented to the outside).</li>
          <li><strong>Personal Protective Equipment (PPE):</strong> Chemo-tested powder-free nitrile gloves (double-gloving recommended, outer glove over gown cuff), disposable low-permeability lint-free gown with closed front and elastic knit cuffs, eye goggles, and full-face respirator if aerosolization risk exists.</li>
          <li><strong>Spill Kit Readiness:</strong> A certified chemotherapy spill kit must be immediately accessible in preparation and clinical administration units.</li>
          <li><strong>Waste Disposal:</strong> All chemotherapy contaminated items (tubing, syringes, pads, gloves) must be disposed of in designated yellow/puncture-resistant sharps containers labeled "CYTOTOXIC WASTE".</li>
        </ul>
      `
    }
  ],
  tables: [
    {
      title: 'High-Yield Chemotherapy Toxicities & Specific Antidotes',
      caption: 'The definitive clinical antidote matrix taught by Dr. Deepak Marwah.',
      headers: ['Chemotherapeutic Agent', 'Signature / Dose-Limiting Toxicity', 'Preventive Strategy / Specific Antidote'],
      rows: [
        ['Cyclophosphamide / Ifosfamide', 'Hemorrhagic Cystitis (caused by metabolite Acrolein)', 'Aggressive IV hydration (3 L/day) + MESNA (2-Mercaptoethane sulfonate sodium)'],
        ['Cisplatin', 'Severe Nephrotoxicity (ATN), Ototoxicity, Severe emesis', 'Vigorous pre/post hydration with 0.9% NS + Amifostine + Aprepitant/Ondansetron'],
        ['Doxorubicin / Daunorubicin ("Red Devil")', 'Dilated Cardiomyopathy, Congestive Heart Failure', 'Lifetime cumulative dose limit (450-550 mg/m²) + Dexrazoxane (Zinecard)'],
        ['Bleomycin', 'Pulmonary Fibrosis (dose-dependent)', 'Lifetime limit (400 units); baseline DLCO & Pulmonary Function Tests (PFTs)'],
        ['Vincristine', 'Peripheral Neuropathy, Foot drop, Paralytic ileus', 'NEVER administer intrathecally (100% fatal!). Administer IV only + bowel regimen'],
        ['Vinblastine', 'Severe Myelosuppression (Bone marrow depression)', 'Monitor Absolute Neutrophil Count (ANC); G-CSF (Filgrastim) support'],
        ['Methotrexate', 'Myelosuppression, Mucositis, Renal tubular injury', 'Leucovorin (Folinic Acid) rescue + Sodium Bicarbonate urine alkalinization (pH >7.0)'],
        ['5-Fluorouracil (5-FU)', 'Hand-Foot Syndrome, Coronary vasospasm, Mucositis', 'Ice chips in mouth 10 min prior to IV bolus; Uridine Triacetate for overdose'],
        ['Paclitaxel', 'Severe Hypersensitivity (Cremophor vehicle), Neuropathy', 'Premedication with Dexamethasone + Diphenhydramine + H2 blocker (Famotidine)']
      ]
    }
  ],
  mnemonics: [
    {
      word: 'MESNA for BLADDER',
      meaning: 'MESNA binds Acrolein in Cyclophosphamide toxicity',
      context: 'Cyclophosphamide breaks down to Acrolein, which irritates the bladder urothelium causing painless massive hematuria. MESNA neutralizes Acrolein in urine.'
    },
    {
      word: 'VINCRISTINE = NERVES, VINBLASTINE = BLASTS MARROW',
      meaning: 'Vincristine vs Vinblastine Toxicities',
      context: 'Vincristine causes Neurotoxicity and autonomic neuropathy; Vinblastine causes Bone Marrow Suppression.'
    }
  ],
  clinicalPearls: [
    {
      title: 'Intrathecal Vincristine Warning',
      text: 'Vincristine injected intrathecally causes ascending encephalomyeloradiculopathy and is 100% FATAL. Vincristine must always be dispensed in an infusion minibag (never a syringe) clearly labeled: "FOR INTRAVENOUS USE ONLY — FATAL IF GIVEN BY OTHER ROUTES".'
    },
    {
      title: 'Urine Alkalinization with High-Dose Methotrexate',
      text: 'High-dose Methotrexate precipitates in acidic renal tubules causing acute renal failure. IV Sodium Bicarbonate must be administered to keep urine pH > 7.0 before, during, and after infusion.'
    }
  ],
  questions: [
    {
      question: 'A patient receiving high-dose Cyclophosphamide therapy is prescribed MESNA. The nurse explains to the patient that the primary therapeutic purpose of MESNA is to:',
      options: ['Enhance cytotoxic cell killing', 'Prevent Acrolein-induced hemorrhagic cystitis', 'Stimulate neutrophil recovery', 'Prevent peripheral neuropathy'],
      correctIndex: 1,
      rationale: 'Cyclophosphamide produces the toxic urothelial metabolite Acrolein. MESNA contains sulfhydryl groups that bind Acrolein in the urinary bladder, forming a stable, non-toxic compound and preventing hemorrhagic cystitis.'
    }
  ]
});

// ── MODULE 4: Chemotherapy Extravasation Management & Vesicant Guidelines ──
const module4Html = buildHtmlTemplate({
  day: 'Oncology Day 4',
  title: 'Chemotherapy Extravasation Protocol & Antidote Management',
  subtitle: 'Vesicants vs irritants, thermal interventions (cold vs warm), and specific antidote infiltration techniques.',
  badge: 'Emergency Clinical Nursing',
  sections: [
    {
      num: '1',
      heading: 'Vesicants, Irritants & Pathogenesis of Tissue Injury',
      content: `
        <p>Chemotherapy extravasation is the accidental leakage of antineoplastic agents from the vascular compartment into surrounding subcutaneous tissues:</p>
        <ul>
          <li><strong>Vesicant Drugs:</strong> Agents that produce severe cellular destruction, chemical cellulitis, tissue necrosis, deep ulceration, tendon injury, and nerve entrapment, often requiring surgical debridement or skin grafting.
            <ul>
              <li><strong>DNA-Binding Vesicants:</strong> Anthracyclines (Doxorubicin, Daunorubicin, Epirubicin), Mechlorethamine, Mitomycin C. These bind cell DNA and are repeatedly released as dead cells lyse, causing progressive, chronic tissue ulceration.</li>
              <li><strong>Non-DNA Binding Vesicants:</strong> Vinca alkaloids (Vincristine, Vinblastine), Taxanes (Paclitaxel). These are slowly metabolized and cleared by local tissue fluid.</li>
            </ul>
          </li>
          <li><strong>Irritant Drugs:</strong> Agents that cause acute venous aching, tightness, and phlebitic erythema along the venous pathway without causing full-thickness tissue necrosis (e.g. Carboplatin, Carmustine, Gemcitabine, Etoposide).</li>
        </ul>
      `
    }
  ],
  protocols: [
    {
      title: 'The 6-Step Immediate Emergency Extravasation Response',
      steps: [
        { step: 'Step 1: STOP INFUSION', action: 'Immediately halt the chemotherapy infusion at the very first report of pain, burning, stinging, or swelling. Do NOT flush the line!' },
        { step: 'Step 2: DISCONNECT TUBING', action: 'Disconnect the IV administration set from the cannula hub. Leave the IV cannula or needle strictly in place.' },
        { step: 'Step 3: ASPIRATE FLUID', action: 'Attach a small 3-5 mL syringe to the cannula and gently aspirate as much extravasated drug, blood, and tissue fluid as possible (aim for 3-5 mL).' },
        { step: 'Step 4: ADMINISTER ANTIDOTE', action: 'If an antidote is indicated to be given through the cannula (e.g. Sodium thiosulfate), instill it now. Then gently withdraw the cannula.' },
        { step: 'Step 5: DELINEATE BORDER', action: 'Mark the outer visible erythematous extravasation boundary with an indelible skin marker to monitor for progressive spread.' },
        { step: 'Step 6: ELEVATE EXTREMITY', action: 'Elevate the affected extremity above the level of the heart for 48 hours to minimize dependent edema and hydrostatic tissue pressure.' }
      ],
      note: 'Thermal application depends strictly on the drug class! Never apply heat to an anthracycline or cold to a vinca alkaloid.'
    }
  ],
  tables: [
    {
      title: 'Master Thermal & Antidote Matrix for Chemotherapy Extravasation',
      caption: 'The most heavily tested extravasation rules in AIIMS and NORCET.',
      headers: ['Drug Class', 'Exemplar Drugs', 'Thermal Intervention', 'Specific Antidote & Administration'],
      rows: [
        [
          'Anthracyclines',
          'Doxorubicin, Daunorubicin, Epirubicin',
          'COLD COMPRESS (Ice pack 15-20 min qid for 24-48h to cause vasoconstriction)',
          'Dexrazoxane (Totect) IV: Day 1 (1000 mg/m²), Day 2 (1000 mg/m²), Day 3 (500 mg/m²); OR topical 99% DMSO q8h for 14 days'
        ],
        [
          'Vinca Alkaloids',
          'Vincristine, Vinblastine, Vinorelbine',
          'WARM COMPRESS (Dry heat 15-20 min qid for 24-48h to cause vasodilation & dispersal)',
          'Hyaluronidase: Inject 150-300 units subcutaneously in 5-6 divided clockwise peri-extravasation sites using a 25G needle'
        ],
        [
          'Alkylating Agents',
          'Mechlorethamine, Cisplatin (>20 mL concentrated)',
          'COLD COMPRESS (Local vasoconstriction)',
          'Sodium Thiosulfate 1/6 M: Inject 2-4 mL subcutaneously around extravasation site to neutralize alkylating radicals'
        ],
        [
          'Taxanes',
          'Paclitaxel, Docetaxel',
          'COLD or WARM (Institutional guideline; Cold favored to reduce cellular uptake)',
          'Hyaluronidase or local supportive care + corticosteroid cream'
        ]
      ]
    }
  ],
  mnemonics: [
    {
      word: 'COLD for RED, WARM for PLANT',
      meaning: 'Extravasation Temperature Rule',
      context: 'Red Devil (Doxorubicin / Anthracycline) = COLD ice pack to prevent spread. Plant Alkaloids (Vincristine) = WARM compress to disperse and dilute.'
    }
  ],
  clinicalPearls: [
    {
      title: 'Peripheral Venipuncture Rules for Vesicants',
      text: 'Avoid veins in the antecubital fossa, wrist, and hand dorsum for vesicant infusions due to proximity to tendons and nerves. Use the forearm. Always verify brisk blood return every 2-3 mL during bolus administration.'
    }
  ],
  questions: [
    {
      question: 'During intravenous infusion of Vincristine, the patient reports intense burning and the nurse notes swelling at the IV site. Which thermal application is indicated?',
      options: ['Cold compress for 48 hours', 'Warm dry compress for 15-20 minutes qid', 'Alternate hot and cold every 10 minutes', 'Alcohol immersion pack'],
      correctIndex: 1,
      rationale: 'Vincristine is a Vinca alkaloid. Warm compresses cause local vasodilation, which facilitates drug absorption, dilution, and clearance from surrounding subcutaneous tissues. Cold is strictly contraindicated because it increases tissue destruction from Vinca alkaloids.'
    }
  ]
});

// ── MODULE 5: High-Yield Oncological Emergencies ──
const module5Html = buildHtmlTemplate({
  day: 'Oncology Day 5',
  title: 'High-Yield Oncological Emergencies',
  subtitle: 'Tumor Lysis Syndrome (Cairo-Bishop criteria), Superior Vena Cava Syndrome, Spinal Cord Compression & Hypercalcemia.',
  badge: 'Critical Care Oncology',
  sections: [
    {
      num: '1',
      heading: 'Tumor Lysis Syndrome (TLS) Pathophysiology & Management',
      content: `
        <p>Tumor Lysis Syndrome is a life-threatening oncologic emergency characterized by massive, rapid destruction of malignant cells and release of intracellular contents into systemic circulation:</p>
        <ul>
          <li><strong>Trigger Cancers:</strong> High tumor burden and rapid cell turnover (Burkitt lymphoma, ALL, acute leukemia, bulky diffuse large B-cell lymphoma).</li>
          <li><strong>Cairo-Bishop Diagnostic Criteria (Two or more within 3 days before or 7 days after chemotherapy):</strong>
            <ul>
              <li><strong>Hyperkalemia:</strong> Potassium &ge; 6.0 mEq/L (peaked T waves, QRS widening, ventricular arrhythmias).</li>
              <li><strong>Hyperphosphatemia:</strong> Phosphorus &ge; 4.5 mg/dL (calcium phosphate crystallization in renal tubules).</li>
              <li><strong>Hyperuricemia:</strong> Uric acid &ge; 8.0 mg/dL (precipitation in distal tubule and collecting ducts causing acute oliguric renal failure).</li>
              <li><strong>Hypocalcemia:</strong> Calcium &le; 7.0 mg/dL or ionized Ca &lt; 1.12 mg/dL (secondary to phosphate precipitation &rarr; tetany, Chvostek and Trousseau signs, prolonged QT interval).</li>
            </ul>
          </li>
          <li><strong>Clinical Interventions:</strong>
            <ul>
              <li><strong>Aggressive IV Pre-hydration:</strong> 2.5 to 3.0 L/m²/day of 0.9% Normal Saline to maintain urine output &gt; 100 mL/m²/hr.</li>
              <li><strong>Rasburicase (Recombinant Urate Oxidase):</strong> Converts insoluble uric acid into soluble allantoin; rapid reduction within 4 hours.</li>
              <li><strong>Allopurinol:</strong> Xanthine oxidase inhibitor; prevents new uric acid synthesis.</li>
            </ul>
          </li>
        </ul>
      `
    },
    {
      num: '2',
      heading: 'Superior Vena Cava (SVC) Syndrome',
      content: `
        <p>Obstruction of venous blood return through the SVC to the right atrium, caused by extrinsic compression or intraluminal thrombosis from mediastinal tumors (Small Cell Lung Cancer in 75%, Lymphoma in 15%):</p>
        <ul>
          <li><strong>Clinical Presentation:</strong> Facial, periorbital, and neck edema; sensation of collar fullness; distended neck and anterior chest wall collateral veins; dyspnea, orthopnea, stridor; Pemberton's Sign.</li>
          <li><strong>Nursing &amp; Emergency Management:</strong> Elevate head of bed to semi-Fowler's position (&ge;45&deg;); administer high-flow oxygen; NEVER use upper extremities for IV access, venipuncture, or blood pressure cuffs; administer STAT IV Dexamethasone (16-24 mg daily); arrange emergent thoracic radiation or endovascular stenting.</li>
        </ul>
      `
    },
    {
      num: '3',
      heading: 'Spinal Cord Compression (SCC) & Hypercalcemia of Malignancy',
      content: `
        <p><strong>Spinal Cord Compression:</strong> Metastasis to epidural space (breast, lung, prostate, myeloma). Earliest sign is persistent, progressive back pain worsening in recumbent position. Later: motor weakness, sensory dermatomal deficit, and late bladder/bowel incontinence. <em>STAT IV Dexamethasone (10-16 mg bolus) + emergent whole-spine MRI + neurosurgical decompression or radiation within 24 hours.</em></p>
        <p><strong>Hypercalcemia of Malignancy:</strong> Mediated by tumor secretion of PTHrP (Squamous cell cancers) or osteolytic bone metastasis. Symptoms: "Bones, Stones, Abdominal Groans, Psychiatric Moans" + shortened QT interval. <em>Treatment: Aggressive IV 0.9% NS hydration (200-300 mL/hr) &rarr; IV Bisphosphonates (Zoledronic acid 4 mg over 15 min) &rarr; Subcutaneous Calcitonin (rapid onset).</em></p>
      `
    }
  ],
  tables: [
    {
      title: 'Cairo-Bishop Diagnostic Criteria for Tumor Lysis Syndrome',
      caption: 'Memorize the cardinal 4 metabolic abnormalities.',
      headers: ['Metabolic Parameter', 'Cut-Off Value', 'Clinical Manifestations', 'Specific Treatment'],
      rows: [
        ['Potassium (Hyperkalemia)', '&ge; 6.0 mEq/L (or 25% increase)', 'Peaked T waves, ventricular arrhythmias, muscle weakness', 'IV Calcium gluconate (cardiac stabilization) + Insulin/Dextrose + Kayexalate'],
        ['Phosphorus (Hyperphosphatemia)', '&ge; 4.5 mg/dL (or 25% increase)', 'Nausea, acute renal failure, calcium-phosphate precipitation', 'Oral phosphate binders (Sevelamer, Aluminum hydroxide); avoid IV calcium unless symptomatic'],
        ['Uric Acid (Hyperuricemia)', '&ge; 8.0 mg/dL (or 25% increase)', 'Urate nephropathy, oliguria, crystalluria, flank pain', 'Rasburicase (0.2 mg/kg IV) or Allopurinol + hyperhydration'],
        ['Calcium (Hypocalcemia)', '&le; 7.0 mg/dL (or 25% decrease)', 'Tetany, seizures, paresthesias, prolonged QT, Chvostek sign', 'Correct only if symptomatic (tetany/arrhythmia) with slow IV Calcium gluconate']
      ]
    }
  ],
  mnemonics: [
    {
      word: 'P-U-K-E (Up) & Calcium (Down)',
      meaning: 'Tumor Lysis Syndrome Electrolytes',
      context: 'Phosphate UP, Uric acid UP, Potassium UP; Calcium is the ONLY electrolyte that drops DOWN in TLS.'
    },
    {
      word: 'PEMBERTON SIGN',
      meaning: 'SVC Syndrome Physical Exam',
      context: 'Have patient elevate both arms over head for 60 seconds &rarr; facial flushing, cyanosis, and jugular vein engorgement confirms thoracic inlet venous obstruction.'
    }
  ],
  clinicalPearls: [
    {
      title: 'Neutropenic Fever Golden Hour Rule',
      text: 'A single temperature &ge;38.3°C (101°F) with ANC &lt;500/mcL requires 2 sets of blood cultures drawn and broad-spectrum antipseudomonal IV monotherapy (Piperacillin-Tazobactam or Cefepime) administered within 60 MINUTES!'
    }
  ],
  questions: [
    {
      question: 'A patient receiving induction chemotherapy for Acute Lymphoblastic Leukemia develops a potassium level of 6.3 mEq/L, uric acid of 9.2 mg/dL, and calcium of 6.8 mg/dL. Which medication should the nurse expect to administer to immediately degrade circulating uric acid?',
      options: ['Allopurinol', 'Rasburicase', 'Sodium Bicarbonate', 'Furosemide'],
      correctIndex: 1,
      rationale: 'Rasburicase is a recombinant urate oxidase enzyme that directly degrades uric acid into the water-soluble and easily excretable metabolite allantoin. Allopurinol only inhibits new uric acid synthesis and does not lower existing uric acid levels.'
    }
  ]
});

// ── MODULE 6: Radiation Oncology, Brachytherapy Care & ALARA Safety Protocols ──
const module6Html = buildHtmlTemplate({
  day: 'Oncology Day 6',
  title: 'Radiation Oncology, Brachytherapy & Radiation Safety',
  subtitle: 'External beam radiotherapy skin care, sealed vs unsealed brachytherapy, and ALARA radiation protection rules.',
  badge: 'Radiation Safety',
  sections: [
    {
      num: '1',
      heading: 'Principles of Radiation Delivery (EBRT vs Brachytherapy)',
      content: `
        <p>Radiation therapy destroys malignant cells by damaging cellular DNA directly or indirectly via free radical generation from water radiolysis:</p>
        <ul>
          <li><strong>External Beam Radiation Therapy (EBRT / Teletherapy):</strong> Radiation source is positioned outside the patient (Linear Accelerator or Cobalt-60). The patient is NOT radioactive during or following teletherapy treatments.</li>
          <li><strong>Brachytherapy (Internal Sealed Source):</strong> Radioactive isotopes (Cesium-137, Iridium-192, Iodine-125) are sealed in needles, seeds, wires, or intracavitary applicators placed directly into or adjacent to the tumor. <em>The patient emits radiation while the sealed source is inside the body!</em></li>
          <li><strong>Systemic Unsealed Radiation Therapy:</strong> Radioactive liquid (Iodine-131 for thyroid cancer) administered orally or IV. Body secretions (urine, sweat, saliva) are radioactive.</li>
        </ul>
      `
    },
    {
      num: '2',
      heading: 'Nursing Care for External Beam Radiation Skin Reactions',
      content: `
        <p>Radiation dermatitis is the most common adverse effect of teletherapy. Strict nursing care rules include:</p>
        <ul>
          <li>Gently cleanse the irradiated skin daily using ONLY lukewarm water and mild, unscented, non-alkaline soap. Pat dry with a soft towel; NEVER rub or scrub.</li>
          <li>Do NOT wash off the radiation ink/tattoo alignment markings placed by the radiation therapy team.</li>
          <li>Do NOT apply perfumes, deodorants, powders, alcohol rubs, or petroleum-based ointments to the radiation portal unless explicitly prescribed.</li>
          <li>Wear loose-fitting, soft cotton clothing over the treated area; avoid tight collars or elastic bands.</li>
          <li>Protect irradiated skin from all direct sun exposure; do NOT apply ice packs, hot water bottles, or heating pads to the field.</li>
        </ul>
      `
    }
  ],
  protocols: [
    {
      title: 'Dislodged Radioactive Sealed Source Emergency Protocol',
      steps: [
        { step: 'Step 1: DO NOT TOUCH', action: 'NEVER touch the radioactive source with bare hands, gloved hands, or bed linen.' },
        { step: 'Step 2: RETRIEVE WITH FORCEPS', action: 'Immediately grasp the dislodged source using the dedicated long-handled lead forceps kept inside the patient room.' },
        { step: 'Step 3: PLACE IN LEAD CONTAINER', action: 'Deposit the radioactive source immediately into the heavy lead storage container ("lead pig") located in the corner of the room.' },
        { step: 'Step 4: SECURE & NOTIFY', action: 'Keep patient safely in bed, step behind the lead shield, and contact the Radiation Safety Officer (RSO) and Radiation Oncologist STAT.' }
      ],
      note: 'All personnel must remain in the room until the RSO completes a radiation survey.'
    }
  ],
  tables: [
    {
      title: 'ALARA Radiation Safety Rules for Brachytherapy',
      caption: 'As Low As Reasonably Achievable — Fundamental radiation protection tri-pillar.',
      headers: ['Principle', 'Nursing Implementation', 'Clinical Threshold / Standard'],
      rows: [
        ['TIME', 'Organize tasks to minimize direct bedside exposure time', 'Maximum 30 minutes of direct contact per nurse per 8-hour shift'],
        ['DISTANCE', 'Radiation intensity decreases with square of distance (1/d²)', 'Maintain minimum 6 feet (2 meters) distance when not providing hands-on care'],
        ['SHIELDING', 'Lead barriers attenuate ionizing radiation', 'Wear 0.5 mm lead apron during hands-on care; keep rolling bedside lead shield between patient and door'],
        ['DOSIMETER', 'Film badge / TLD measures cumulative occupational dose', 'Wear dosimeter at collar level outside lead apron; never share or leave in patient room'],
        ['ROOM RULES', 'Private room at end of hallway; warning sign on door', 'Strict restriction: NO visitors under 18 years; NO pregnant visitors or staff; visitor max 30 min/day']
      ]
    }
  ],
  mnemonics: [
    {
      word: 'ALARA',
      meaning: 'As Low As Reasonably Achievable',
      context: 'Time, Distance, Shielding. The cornerstone of all ionizing radiation protection protocols.'
    }
  ],
  clinicalPearls: [
    {
      title: 'Care of Patient with Tandem & Ovoids (Cervical Brachytherapy)',
      text: 'Patient must remain on strict bedrest with head of bed elevated &le;20-30° to prevent applicator displacement. A Foley catheter is placed to keep the bladder completely empty, which pulls the anterior bladder wall away from the cesium source and prevents radiation cystitis.'
    }
  ],
  questions: [
    {
      question: 'A nurse enters the room of a patient receiving intracavitary cesium brachytherapy for cervical cancer and observes that the radioactive applicator has dislodged onto the bed linens. What is the nurse\'s FIRST action?',
      options: ['Call the radiation oncologist immediately', 'Pick up the source using long-handled forceps and place in lead container', 'Don two pairs of gloves and replace the applicator', 'Evacuate the patient into the hallway'],
      correctIndex: 1,
      rationale: 'If a sealed radiation source dislodges, the nurse must NEVER touch it with bare or gloved hands. The nurse immediately uses long-handled lead forceps to place the source into the bedside lead container, then notifies the Radiation Safety Officer and oncologist.'
    }
  ]
});

// ── MODULE 7: Hematological Malignancies (Leukemias, Lymphomas & Multiple Myeloma) ──
const module7Html = buildHtmlTemplate({
  day: 'Oncology Day 7',
  title: 'Hematological Malignancies & Plasma Cell Disorders',
  subtitle: 'Leukemias (ALL, AML, CML, CLL), Hodgkin vs Non-Hodgkin Lymphoma, and Multiple Myeloma CRAB criteria.',
  badge: 'Hematology Mastery',
  sections: [
    {
      num: '1',
      heading: 'Classification of Acute vs Chronic Leukemias',
      content: `
        <p>Leukemias are malignant clonal proliferations of hematopoietic stem cells in the bone marrow:</p>
        <ul>
          <li><strong>Acute Lymphoblastic Leukemia (ALL):</strong> Most common childhood cancer (peak 2-5 years). Characterized by &gt;20% lymphoblasts in marrow, positive for TdT and CD10 (CALLA). <em>Sanctuary sites: CNS and Testes &rarr; mandates prophylactic Intrathecal Methotrexate.</em></li>
          <li><strong>Acute Myeloid Leukemia (AML):</strong> Common in adults (median age 65). Bone marrow replaced by myeloblasts (&gt;20%). <em>Pathognomonic hallmark: Auer Rods (needle-like crystalline aggregates of myeloperoxidase).</em> Subtype M3 (Acute Promyelocytic Leukemia) carries translocation t(15;17) PML-RARA; high risk of severe DIC; treated with All-Trans Retinoic Acid (ATRA) and Arsenic Trioxide.</li>
          <li><strong>Chronic Myeloid Leukemia (CML):</strong> Driven by the Philadelphia Chromosome: reciprocal translocation t(9;22) producing BCR-ABL1 fusion tyrosine kinase. Triphasic course (chronic, accelerated, blast crisis). Low Leukocyte Alkaline Phosphatase (LAP) score. Targeted therapy: Imatinib (Gleevec).</li>
          <li><strong>Chronic Lymphocytic Leukemia (CLL):</strong> Most common leukemia of older adults. Clonal proliferation of mature, incompetent B-cells. Blood smear reveals fragile "Smudge Cells" / "Basket Cells".</li>
        </ul>
      `
    },
    {
      num: '2',
      heading: 'Multiple Myeloma & The CRAB Criteria',
      content: `
        <p>Multiple Myeloma is a clonal proliferation of malignant plasma cells in the bone marrow producing excess monoclonal immunoglobulin (M-protein, typically IgG or IgA):</p>
        <ul>
          <li><strong>Pathology:</strong> Plasma cells infiltrate marrow, stimulate osteoclasts via RANKL, and secrete light chains that damage distal renal tubules (Bence Jones proteinuria).</li>
          <li><strong>Diagnostic Findings:</strong> Serum Protein Electrophoresis (SPEP) shows sharp M-Spike; peripheral blood film demonstrates Rouleaux formation ("stack-of-coins"); markedly elevated ESR (&gt;100 mm/hr).</li>
        </ul>
      `
    }
  ],
  tables: [
    {
      title: 'Hodgkin vs Non-Hodgkin Lymphoma Comparison Matrix',
      caption: 'Crucial for differential diagnosis in medical-surgical examinations.',
      headers: ['Feature', 'Hodgkin Lymphoma', 'Non-Hodgkin Lymphoma (NHL)'],
      rows: [
        ['Pathognomonic Cell', 'Reed-Sternberg (RS) Cell ("Owl-Eye" appearance, CD15+, CD30+)', 'Absent (diverse malignant B or T cell clones)'],
        ['Pattern of Nodal Spread', 'Contiguous, orderly along anatomical axial chains (cervical &rarr; mediastinal)', 'Non-contiguous, widely disseminated, skips nodal stations'],
        ['Extranodal Involvement', 'Extremely rare (&lt;5% at presentation)', 'Very common (GI tract, bone marrow, liver, skin, Waldeyer ring)'],
        ['B-Symptoms (Fever, Sweats, Wt loss)', 'Frequently present; high prognostic value', 'Less common at presentation; present in advanced stages'],
        ['Unique Clinical Signs', 'Pel-Ebstein cyclical fever; alcohol-induced lymph node pain', 'Abdominal mass (Burkitt t(8;14) with starry-sky histology); rapid doubling time']
      ]
    },
    {
      title: 'Multiple Myeloma "CRAB" Clinical Diagnostic Matrix',
      caption: 'The definitive 4 clinical hallmarks of plasma cell dyscrasia.',
      headers: ['Letter', 'Clinical Hallmark', 'Underlying Mechanism', 'Diagnostic Threshold'],
      rows: [
        ['C', 'Calcium Elevation (Hypercalcemia)', 'Extensive osteoclast activation and osteolysis', 'Serum Calcium > 11.0 mg/dL'],
        ['R', 'Renal Impairment / Insufficiency', 'Bence Jones free light chains precipitate in renal tubules', 'Serum Creatinine > 2.0 mg/dL'],
        ['A', 'Anemia (Normocytic, normochromic)', 'Bone marrow displacement by clonal plasma cells', 'Hemoglobin < 10.0 g/dL (or >2 g below normal)'],
        ['B', 'Bone Lytic Lesions & Pathological Fractures', '"Punched-out" lytic lesions on skull/spine skeletal survey', '>= 1 osteolytic lesion on X-ray, CT, or PET-CT']
      ]
    }
  ],
  mnemonics: [
    {
      word: 'CRAB',
      meaning: 'Multiple Myeloma Hallmarks',
      context: 'Calcium elevated, Renal impairment, Anemia, Bone lytic lesions.'
    },
    {
      word: 'OWL EYES = HODGKIN',
      meaning: 'Reed-Sternberg Cells',
      context: 'Giant bilobed binucleated cells with large inclusion-like eosinophilic nucleoli resembling Owl Eyes are diagnostic for Hodgkin Lymphoma.'
    }
  ],
  clinicalPearls: [
    {
      title: 'Imatinib (Gleevec) Monitoring in CML',
      text: 'Imatinib specifically blocks the ATP binding site of BCR-ABL tyrosine kinase. Patients must be monitored with serial quantitative RT-PCR for BCR-ABL transcripts to verify Major Molecular Response (MMR).'
    }
  ],
  questions: [
    {
      question: 'A 68-year-old male presents with persistent low back pain, fatigue, and recurrent infections. Laboratory analysis reveals serum calcium 11.8 mg/dL, creatinine 2.4 mg/dL, and normocytic anemia. Skull X-ray demonstrates multiple "punched-out" radiolucent lesions. What diagnosis is most likely?',
      options: ['Osteosarcoma', 'Multiple Myeloma', 'Chronic Myeloid Leukemia', 'Metastatic Prostate Cancer'],
      correctIndex: 1,
      rationale: 'The presentation satisfies all elements of the classic CRAB criteria for Multiple Myeloma: Hypercalcemia (11.8), Renal insufficiency (2.4), Anemia, and Bone lytic "punched-out" lesions on skeletal survey.'
    }
  ]
});

// ── MODULE 8: System-Specific Surgical Oncology & Perioperative Nursing Care ──
const module8Html = buildHtmlTemplate({
  day: 'Oncology Day 8',
  title: 'System-Specific Surgical Oncology & Nursing Handouts',
  subtitle: 'Breast cancer MRM and lymphedema prevention, lung cancer paraneoplastic syndromes, colorectal stoma care.',
  badge: 'Surgical Nursing Focus',
  sections: [
    {
      num: '1',
      heading: 'Breast Cancer & Post-Mastectomy Nursing Care',
      content: `
        <p>Breast cancer is the most common female malignancy. Postoperative care following Modified Radical Mastectomy (MRM) requires strict adherence to anatomical precautions:</p>
        <ul>
          <li><strong>Positioning:</strong> Place patient in semi-Fowler's position (30-45°) with the operative arm elevated on a pillow above heart level to facilitate lymph and venous drainage.</li>
          <li><strong>Jackson-Pratt (JP) Drain:</strong> Maintain continuous closed-suction. Empty bulb when half-full. Drain is removed when 24-hour serous output decreases to &lt;25-30 mL.</li>
          <li><strong>Post-Op Exercises:</strong> Start squeezing a soft ball or flexing wrist on Post-Op Day 1. Wall-climbing and arm circles commence after drain removal to regain full shoulder abduction.</li>
        </ul>
      `
    },
    {
      num: '2',
      heading: 'Colorectal Cancer & Stoma Assessment',
      content: `
        <p>Surgical resection (hemicolectomy, abdominoperineal resection) frequently involves temporary or permanent ostomy creation:</p>
        <ul>
          <li><strong>Healthy Stoma:</strong> Should appear beefy red to bright pink, moist, and slightly protruding above skin level.</li>
          <li><strong>Compromised Stoma:</strong> A dusky blue, purple, dark brown, or black stoma indicates severe tissue ischemia and vascular necrosis. <em>Notify surgeon STAT!</em></li>
          <li><strong>Appliance Fit:</strong> Cut skin barrier wafer 1/16 to 1/8 inch larger than stoma base. Empty pouch when 1/3 to 1/2 full to prevent adhesive leakage.</li>
        </ul>
      `
    }
  ],
  protocols: [
    {
      title: 'Lifelong Post-Mastectomy Lymphedema Prevention Protocol',
      steps: [
        { step: 'Rule 1: POST WARNING SIGN', action: 'Place a visible sign above the bed: "NO BP / NO IV / NO INJECTIONS / NO VENIPUNCTURE IN OPERATIVE ARM".' },
        { step: 'Rule 2: NO CONSTRICTIVE WEAR', action: 'Never wear tight jewelry, wristwatches, tight elastic sleeves, or carry heavy bags on the operative side.' },
        { step: 'Rule 3: TRAUMA & BURN PREVENTION', action: 'Wear protective heavy oven mitts when cooking, garden gloves outdoors, and electric razors for axillary hair.' },
        { step: 'Rule 4: CUTICLE & SKIN CARE', action: 'Never cut nail cuticles; push them back gently. Apply unscented moisturizer to prevent skin fissures.' }
      ],
      note: 'Lymphedema can develop months to decades after axillary lymph node dissection. These are LIFELONG rules.'
    }
  ],
  tables: [
    {
      title: 'Lung Cancer Subtypes & Paraneoplastic Syndromes',
      caption: 'High-yield systemic manifestations in bronchogenic carcinoma.',
      headers: ['Histologic Subtype', 'Anatomical Location', 'Unique Features', 'Paraneoplastic Association'],
      rows: [
        ['Small Cell Lung Cancer (SCLC)', 'Central (mainstem bronchus)', 'Neuroendocrine, aggressive, early hematogenous spread', 'SIADH (hyponatremia), Ectopic ACTH (Cushing syndrome), Lambert-Eaton syndrome'],
        ['Adenocarcinoma', 'Peripheral lung zones', 'Most common lung cancer in non-smokers and females', 'Hypertrophic Osteoarthropathy (digital clubbing)'],
        ['Squamous Cell Carcinoma', 'Central (hilar cavitating)', 'Strong smoking link; produces keratin pearls', 'PTHrP-mediated Hypercalcemia'],
        ['Large Cell Carcinoma', 'Peripheral or subpleural', 'Rapid doubling time, highly anaplastic', 'Gynecomastia']
      ]
    }
  ],
  mnemonics: [
    {
      word: 'S-CELL = CENTRAL, S-CELL = SMOKING, S-CELL = SIADH',
      meaning: 'Small Cell Lung Cancer Characteristics',
      context: 'All start with S: Small cell, Smoking history, Central location, SIADH paraneoplastic syndrome.'
    }
  ],
  clinicalPearls: [
    {
      title: 'Chest Tube Care in Thoracic Oncology',
      text: 'Continuous bubbling in the water seal chamber indicates an air leak. Normal bubbling occurs only in the suction control chamber. Never clamp a chest tube during transport as this precipitates tension pneumothorax.'
    }
  ],
  questions: [
    {
      question: 'A patient is 1 day postoperative following a right Modified Radical Mastectomy with axillary lymph node dissection. Which nursing intervention is essential to prevent lymphedema?',
      options: ['Keep the right arm dependent at the side', 'Elevate the right arm on a pillow above the level of the heart', 'Measure blood pressure in the right arm to monitor distal perfusion', 'Apply an ice pack continuously to the right wrist'],
      correctIndex: 1,
      rationale: 'Elevating the operative arm on a pillow above heart level facilitates gravity-assisted lymphatic and venous drainage, minimizing interstitial fluid accumulation and acute lymphedema.'
    }
  ]
});

// ── MODULE 9: Oncology Palliative Care, WHO Analgesic Ladder & Opioid Titration Protocols ──
const module9Html = buildHtmlTemplate({
  day: 'Oncology Day 9',
  title: 'Oncology Palliative Care & Cancer Pain Management',
  subtitle: 'WHO 3-step analgesic ladder, breakthrough pain management, opioid bowel regimens, and Naloxone titration.',
  badge: 'Palliative Mastery',
  sections: [
    {
      num: '1',
      heading: 'The WHO 3-Step Cancer Pain Relief Ladder',
      content: `
        <p>The World Health Organization (WHO) ladder provides a systematic framework for cancer pain management:</p>
        <ul>
          <li><strong>Step 1: Mild Pain (VAS 1 to 3):</strong> Non-opioids (Acetaminophen / Paracetamol max 4 g/day; NSAIDs like Ibuprofen, Naproxen, Ketorolac) &plusmn; Adjuvant analgesics.</li>
          <li><strong>Step 2: Moderate Pain (VAS 4 to 6):</strong> Weak opioids (Codeine, Tramadol) combined with Step 1 non-opioids &plusmn; Adjuvants.</li>
          <li><strong>Step 3: Severe Pain (VAS 7 to 10):</strong> Strong opioids (Morphine, Fentanyl, Hydromorphone, Oxycodone) &plusmn; Non-opioids &plusmn; Adjuvants.</li>
        </ul>
      `
    },
    {
      num: '2',
      heading: 'Cardinal Principles of Cancer Opioid Administration',
      content: `
        <p>Dr. Deepak Marwah emphasizes 4 core guidelines for clinical cancer pain control:</p>
        <ol>
          <li><strong>"By the Clock" (ATC):</strong> Administer scheduled long-acting opioids at fixed round-the-clock intervals to prevent pain recurrence, rather than waiting for pain to emerge.</li>
          <li><strong>Breakthrough Pain Rescue:</strong> Provide immediate-release opioid doses (equal to 10-15% of total 24-hour baseline opioid dose) PRN every 1-2 hours for acute breakthrough pain spikes.</li>
          <li><strong>"By the Mouth":</strong> Prefer the oral route whenever feasible. Oral Morphine to IV Morphine conversion ratio is 3:1 (30 mg oral = 10 mg IV).</li>
          <li><strong>Proactive Bowel Regimen:</strong> Tolerance NEVER develops to opioid-induced constipation! Every patient prescribed chronic opioids must concurrently receive a stimulant laxative (Senna / Bisacodyl) plus stool softener (Docusate).</li>
        </ol>
      `
    }
  ],
  tables: [
    {
      title: 'Adjuvant Analgesics in Cancer Pain Management',
      caption: 'Targeted medications tailored to specific cancer pain mechanisms.',
      headers: ['Drug Class', 'Exemplar Agents', 'Primary Indication in Oncology', 'Mechanism'],
      rows: [
        ['Corticosteroids', 'Dexamethasone, Prednisone', 'Spinal cord compression, brain metastasis, capsular liver stretch', 'Reduces vasogenic peritumoral edema and inflammatory mediators'],
        ['Anticonvulsants', 'Gabapentin, Pregabalin', 'Neuropathic shooting, lancinating, burning pain', 'Modulates voltage-gated calcium channels in dorsal horn'],
        ['Antidepressants', 'Duloxetine, Amitriptyline', 'Post-herpetic neuralgia, chemotherapy-induced neuropathy', 'Inhibits serotonin and norepinephrine reuptake (SNRI)'],
        ['Bisphosphonates', 'Zoledronic Acid, Pamidronate', 'Metastatic bone pain, osteolytic fractures', 'Inhibits osteoclastic bone resorption and bone remodeling pain']
      ]
    }
  ],
  mnemonics: [
    {
      word: 'ATC NOT PRN FOR BASELINE PAIN',
      meaning: 'Around The Clock Scheduling',
      context: 'Chronic cancer pain must be dosed around the clock. PRN dosing is reserved exclusively for acute breakthrough episodes.'
    }
  ],
  clinicalPearls: [
    {
      title: 'Transdermal Fentanyl Patch Instructions',
      text: 'Fentanyl patches take 12-24 hours to reach peak therapeutic blood levels. Never apply external heat (heating pads) over the patch as heat dramatically accelerates fentanyl absorption, causing fatal respiratory arrest.'
    },
    {
      title: 'Naloxone Titration in Cancer Patients',
      text: 'Do NOT give full 0.4 mg IV Naloxone bolus to chronic cancer patients with opioid toxicity unless in cardiac arrest. Dilute 0.4 mg in 9 mL NS and administer 1 mL (0.04 mg) every 2-3 minutes to restore respiratory rate without triggering excruciating withdrawal pain crisis.'
    }
  ],
  questions: [
    {
      question: 'A patient with metastatic prostate cancer is receiving oral Morphine 60 mg every 12 hours for chronic bone pain. What medication MUST the nurse expect to be initiated concurrently?',
      options: ['Furosemide', 'Senna plus Docusate (Stimulant laxative)', 'Naloxone oral solution', 'Diphenhydramine'],
      correctIndex: 1,
      rationale: 'Opioids decrease peristalsis and gastrointestinal secretions. Tolerance never develops to opioid-induced constipation. A proactive bowel regimen with a stimulant laxative and stool softener is mandatory for every patient receiving chronic opioid therapy.'
    }
  ]
});

// ── MODULE 10: Dr. Deepak Marwah Special Med-Surg Pearls, Mnemonics & NORCET Golden Points ──
const module10Html = buildHtmlTemplate({
  day: 'Oncology Day 10',
  title: 'Dr. Deepak Marwah Master Pearls, Mnemonics & NORCET Golden Points',
  subtitle: 'High-yield memory tables, rapid clinical pearls, and high-frequency exam vignettes for comprehensive oncology revision.',
  badge: 'Grand Revision Pearls',
  sections: [
    {
      num: '1',
      heading: 'High-Frequency Rapid Revision Matrix',
      content: `
        <p>This master sheet consolidates the high-frequency test points emphasized in Dr. Deepak Marwah\'s medical-surgical oncology lectures:</p>
        <ul>
          <li><strong>Cyclophosphamide:</strong> Acrolein &rarr; Hemorrhagic Cystitis &rarr; Hydration + MESNA.</li>
          <li><strong>Cisplatin:</strong> Nephrotoxicity &rarr; Amifostine + Pre/Post 0.9% NS diuresis.</li>
          <li><strong>Doxorubicin ("Red Devil"):</strong> Dilated Cardiomyopathy &rarr; Lifetime limit 450-550 mg/m² + Dexrazoxane.</li>
          <li><strong>Bleomycin:</strong> Pulmonary Fibrosis &rarr; DLCO and PFT monitoring.</li>
          <li><strong>Vincristine:</strong> Peripheral Neuropathy &rarr; Never give intrathecally (100% fatal!).</li>
          <li><strong>Methotrexate:</strong> Folinic Acid (Leucovorin) rescue + Sodium Bicarbonate alkalinization (pH &gt;7.0).</li>
          <li><strong>Extravasation:</strong> Anthracyclines = COLD/Ice; Vinca Alkaloids = WARM/Heat.</li>
          <li><strong>Tumor Lysis Syndrome:</strong> High Potassium, High Phosphate, High Uric Acid, Low Calcium &rarr; Rasburicase.</li>
          <li><strong>Superior Vena Cava Syndrome:</strong> Facial edema + Pemberton sign &rarr; Semi-Fowler\'s + IV Dexamethasone.</li>
          <li><strong>Multiple Myeloma:</strong> CRAB (Calcium, Renal, Anemia, Bone lytic lesions) + M-Spike.</li>
        </ul>
      `
    }
  ],
  tables: [
    {
      title: 'Grand Antineoplastic Antidote & Rescue Summary',
      caption: 'The definitive rapid-recall table for AIIMS / NORCET exams.',
      headers: ['Toxic Agent / Clinical Emergency', 'Specific Antidote / Rescue Drug', 'Key Administration Rule'],
      rows: [
        ['Cyclophosphamide Acrolein Cystitis', 'MESNA (2-Mercaptoethane sulfonate)', 'Administer concurrently at 20%, 40%, and 80% of Cyclophosphamide dose'],
        ['Methotrexate Toxicity', 'Leucovorin (Folinic Acid)', 'Bypasses blocked dihydrofolate reductase; start within 24-48 hours'],
        ['Doxorubicin Extravasation', 'Dexrazoxane (Totect)', 'Administer IV within 6 hours of extravasation; 3-day treatment cycle'],
        ['Vincristine Extravasation', 'Hyaluronidase', 'Inject subcutaneously in clock-face pattern around site + warm compress'],
        ['Tumor Lysis Syndrome Uric Acid', 'Rasburicase (Urate Oxidase)', '0.2 mg/kg IV infusion; cleaves uric acid into water-soluble allantoin'],
        ['Opioid Respiratory Depression', 'Naloxone (Narcan)', 'Dilute in saline; titrate 0.04-0.08 mg IV every 2-3 minutes']
      ]
    }
  ],
  mnemonics: [
    {
      word: 'CAUTION',
      meaning: '7 Warning Signs of Cancer',
      context: 'Change in bowel/bladder, A sore that won\'t heal, Unusual bleeding, Thickening/lump, Indigestion, Obvious change in mole, Nagging cough.'
    },
    {
      word: 'CRAB',
      meaning: 'Multiple Myeloma Hallmarks',
      context: 'Calcium high, Renal impairment, Anemia, Bone lytic lesions.'
    },
    {
      word: 'ALARA',
      meaning: 'Radiation Protection',
      context: 'As Low As Reasonably Achievable: Time, Distance, Shielding.'
    }
  ],
  clinicalPearls: [
    {
      title: 'Absolute Neutrophil Count (ANC) Calculation',
      text: 'ANC = Total WBC × (% Neutrophils + % Bands) / 100. Severe neutropenia is defined as ANC < 500/mcL. At this level, life-threatening opportunistic infections can occur without localized pus formation.'
    },
    {
      title: 'Superior Vena Cava Syndrome Precaution',
      text: 'In patients with suspected or confirmed SVC syndrome, NEVER insert an IV line or draw blood from either upper extremity. Use lower extremity veins or femoral access if necessary to prevent exacerbating upper body venous congestion.'
    }
  ],
  questions: [
    {
      question: 'Which chemotherapy agent is specifically associated with dose-limiting dilated cardiomyopathy and requires routine monitoring of cumulative lifetime dose along with echocardiographic left ventricular ejection fraction?',
      options: ['Bleomycin', 'Doxorubicin', 'Vincristine', 'Methotrexate'],
      correctIndex: 1,
      rationale: 'Doxorubicin (an anthracycline antitumor antibiotic) causes cumulative, dose-dependent myocardial free-radical damage leading to dilated cardiomyopathy and congestive heart failure. The lifetime cumulative dose is strictly capped at 450 to 550 mg/m².'
    }
  ]
});

// Official Real Notes from NNL ONE CloudFront Storage (Multi-Page PDFs)
export const ONCOLOGY_MASTER_NOTES = [
  {
    id: 'onco-real-day1',
    title: 'Day 1 — Clinical Blackboard Notes (Part 1)',
    category: 'HANDWRITTEN',
    subject: ONCOLOGY_SUBJECT.title,
    faculty: 'Dr. Deepak Marwah',
    downloadName: 'Day1_Class_Notes_Part1.pdf',
    url: 'https://d22wftpsnydqiu.cloudfront.net/handwritten_notes/3ced84f9-66bc-47f1-b012-4d4041d8104e.pdf',
    size: '15.7 MB',
    pages: 'Multi-Page'
  },
  {
    id: 'onco-real-day2',
    title: 'Day 2 — Clinical Blackboard Notes (Part 2)',
    category: 'HANDWRITTEN',
    subject: ONCOLOGY_SUBJECT.title,
    faculty: 'Dr. Deepak Marwah',
    downloadName: 'Day2_Class_Notes_Part2.pdf',
    url: 'https://d22wftpsnydqiu.cloudfront.net/handwritten_notes/3809dc94-9b3d-4eec-a7ac-3449d42d74de.pdf',
    size: '15.7 MB',
    pages: 'Multi-Page'
  },
  {
    id: 'onco-real-day3',
    title: 'Day 3 — Clinical Pharmacology & Chemotherapeutic Class Notes',
    category: 'HANDWRITTEN',
    subject: ONCOLOGY_SUBJECT.title,
    faculty: 'Dr. Deepak Marwah',
    downloadName: 'Day3_Clinical_Pharmacology_Chemo_Notes.pdf',
    url: 'https://d22wftpsnydqiu.cloudfront.net/handwritten_notes/dff71e8e-5b9e-4ed7-bd96-7dd3038e0771.pdf',
    size: '7.5 MB',
    pages: '81 Pages'
  },
  {
    id: 'onco-real-day4',
    title: 'Day 4 — Fastrack Clinical Medicine & Handouts',
    category: 'HANDWRITTEN',
    subject: ONCOLOGY_SUBJECT.title,
    faculty: 'Dr. Deepak Marwah',
    downloadName: 'Day4_Fastrack_Clinical_Medicine.pdf',
    url: 'https://d22wftpsnydqiu.cloudfront.net/handwritten_notes/430c0428-9d12-4c09-bb68-fba57a8710d7.pdf',
    size: '12.8 MB',
    pages: '126 Pages'
  },
  {
    id: 'onco-real-day5',
    title: 'Day 5 — Master Curriculum & Official Subject Catalog',
    category: 'HIGH-YIELD',
    subject: ONCOLOGY_SUBJECT.title,
    faculty: 'Dr. Deepak Marwah',
    downloadName: 'Master_Batch_Syllabus_Catalog.pdf',
    url: 'https://d22wftpsnydqiu.cloudfront.net/Pearl__Blue_Sapphire_Batch_TOC.pdf',
    size: 'Official PDF',
    pages: 'Complete TOC'
  }
];
