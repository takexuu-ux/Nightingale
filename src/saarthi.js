import './style.css';
import './apk/apk-ui.css';
import './apk/apk-shell.js';

// Local storage key for persistent Saarthi chat cache
const SAARTHI_HISTORY_KEY = 'nnl_saarthi_chat_history_v3';

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
  return localStorage.getItem('nnl_access_token') || sessionStorage.getItem('nnl_access_token') || '';
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
         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
           <path d="M12 2a8 8 0 0 0-8 8c0 3.37 2.1 6.25 5.08 7.37L9 22l4-2 4 2-.08-4.63A8 8 0 0 0 12 2z"/>
         </svg>
       </div>`
    : `<div class="saarthi-msg-avatar user-avatar">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
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

// Fetch user question history from real NNL backend
async function loadServerHistory() {
  const token = getAuthToken();
  if (!token) return;

  try {
    const res = await fetch('/api/api/ai/question_history/', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) return;
    const json = await res.json();
    const items = json?.data || (Array.isArray(json) ? json : null);
    if (!items || !Array.isArray(items) || items.length === 0) return;

    const serverMsgs = [];
    serverMsgs.push(INITIAL_GREETING);

    items.forEach(it => {
      if (it.question) {
        serverMsgs.push({
          role: 'user',
          text: it.question.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
          timestamp: it.created ? new Date(it.created).getTime() : Date.now()
        });
      }
      if (it.answer) {
        serverMsgs.push({
          role: 'bot',
          text: formatMarkdown(it.answer),
          timestamp: it.created ? new Date(it.created).getTime() + 500 : Date.now()
        });
      }
    });

    if (serverMsgs.length > 1) {
      saveHistory(serverMsgs);
      renderAllMessages();
    }
  } catch (e) {
    console.warn('[Saarthi] History sync note:', e);
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

  // Check auth token
  if (!token) {
    typingRow.remove();
    const loginPrompt = {
      role: 'bot',
      text: `
        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 12px; margin-bottom: 8px;">
          <h4 style="color: #ef4444; margin: 0 0 6px 0; font-size: 13px;">🔒 Authentication Required</h4>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: var(--text-secondary);">
            To communicate with <strong>NNL Saarthi AI</strong>, please log in to your NNL account.
          </p>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <a href="/" style="background: #ef4444; color: #fff; padding: 6px 14px; border-radius: 6px; font-size: 11px; font-weight: 700; text-decoration: none;">Log In with Mobile</a>
            <a href="https://nnlsaarthi.nnlone.com/" target="_blank" rel="noopener" style="background: rgba(255,255,255,0.1); color: #fff; padding: 6px 14px; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none;">Open Saarthi Web Platform ↗</a>
          </div>
        </div>
      `,
      timestamp: Date.now()
    };
    history.push(loginPrompt);
    saveHistory(history);
    renderMessage(loginPrompt);
    return;
  }

  try {
    const res = await fetch('/api/api/ai/ask_question/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ question: userText })
    });

    typingRow.remove();

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const errMsg = errJson?.error?.message || errJson?.detail || errJson?.message || `Server returned error (${res.status})`;
      
      const errorResponse = {
        role: 'bot',
        text: `
          <div style="color: #f87171; background: rgba(239, 68, 68, 0.08); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.2);">
            <strong>⚠️ Saarthi AI Response:</strong> ${errMsg}
            <p style="margin: 6px 0 0 0; font-size: 11px; opacity: 0.85;">
              If your daily question limit was reached or your session expired, you can also launch the <a href="https://nnlsaarthi.nnlone.com/" target="_blank" rel="noopener" style="color: #60a5fa; text-decoration: underline;">NNL Saarthi Web Platform</a>.
            </p>
          </div>
        `,
        timestamp: Date.now()
      };
      history.push(errorResponse);
      saveHistory(history);
      renderMessage(errorResponse);
      return;
    }

    const data = await res.json();
    const rawAnswer = data.answer || data.text || data.data?.answer || '';
    const formattedAnswer = rawAnswer ? formatMarkdown(rawAnswer) : 'Thank you for your question. I am analyzing this clinical concept.';

    const botResponse = {
      role: 'bot',
      text: formattedAnswer,
      subject: data.subject || data.topic || '',
      remainingQuestions: data.remainingQuestions,
      timestamp: Date.now()
    };

    history.push(botResponse);
    saveHistory(history);
    renderMessage(botResponse);
  } catch (err) {
    typingRow.remove();
    const netErrResponse = {
      role: 'bot',
      text: `
        <div style="color: #f87171; background: rgba(239, 68, 68, 0.08); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.2);">
          <strong>Network Error:</strong> Could not reach NNL AI server (${err.message}).
          <p style="margin: 6px 0 0 0; font-size: 11px;">Please check your connection or access the <a href="https://nnlsaarthi.nnlone.com/" target="_blank" rel="noopener" style="color: #60a5fa; text-decoration: underline;">Saarthi Web Portal</a> directly.</p>
        </div>
      `,
      timestamp: Date.now()
    };
    history.push(netErrResponse);
    saveHistory(history);
    renderMessage(netErrResponse);
  }
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
  loadSuggestedQuestions();
  loadServerHistory();
  chatInput?.focus();
});
renderAllMessages();
loadSuggestedQuestions();
loadServerHistory();
