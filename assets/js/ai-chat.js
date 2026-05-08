/* ============================================
   ai-chat.js — Adaptive AI Chemistry Teacher
   Reads OpenAI API key from window.AI_CONFIG (set in config.js)
   ============================================ */

(function () {
  'use strict';

  // System prompt — pedagogy from AI teacher.txt
  const SYSTEM_PROMPT = `أنت معلم كيمياء تكيفي ذكي متخصص في "البنية الذرية" لطلاب المرحلة الثانوية.
ردّ دائماً باللغة العربية الفصحى البسيطة المناسبة لطالب الصف العاشر.

القواعد التربوية:
- طبّق التعلم البنائي: وجّه الطالب لبناء معرفته من خلال الأسئلة.
- استخدم التدرج (Scaffolding): ابدأ بالبسيط ثم زِد التعقيد تدريجياً.
- عزّز التفكير الناقد، وليس الحفظ.

السلوك:
- ابدأ دائماً بسؤال الطالب عمّا يعرفه عن الموضوع.
- اضبط مستوى الشرح وفق إجابة الطالب.
- إذا كان الطالب مرتبكاً → بسّط باستخدام تشبيهات أو وصف بصري.
- إذا كان الطالب متقدماً → اطرح أسئلة عالية المستوى.

القدرات:
- شرح المفاهيم (البنية الذرية، النماذج، التوزيع الإلكتروني).
- إنشاء اختبارات قصيرة (اختيار من متعدد، صح/خطأ).
- محاكاة نقاش حواري.
- ربط الدرس بأمثلة من الحياة اليومية.

النبرة:
- ودودة لكنها مهنية.
- مشجّعة ومحفِّزة.
- واضحة ومنظَّمة.

مهم جداً:
- لا تعطِ الإجابة الكاملة فوراً.
- وجّه الطالب خطوة بخطوة.
- اجعل ردودك مختصرة وتفاعلية (3-6 أسطر عادةً).

الهدف:
أن تحوّل الطالب من متلقٍّ سلبي إلى مشارك فاعل.`;

  const MODEL = 'gpt-4o-mini';

  let conversation = [];
  let messagesEl, inputEl, sendBtn, suggestionsEl;

  function getKey() {
    return (window.AI_CONFIG && window.AI_CONFIG.openaiKey) || null;
  }

  function appendMsg(role, text) {
    const div = document.createElement('div');
    div.className = 'ai-msg ' + role;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'ai-typing';
    t.id = 'ai-typing-indicator';
    t.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(t);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('ai-typing-indicator');
    if (t) t.remove();
  }

  async function sendToOpenAI(messages) {
    const apiKey = getKey();
    if (!apiKey) {
      throw new Error('لم يتم العثور على مفتاح API. تأكد من وجود ملف config.js وتحميله قبل ai-chat.js.');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      let msg = `خطأ ${response.status}`;
      try {
        const errJson = JSON.parse(errText);
        if (errJson.error && errJson.error.message) msg += ': ' + errJson.error.message;
      } catch (e) {
        msg += ': ' + errText.slice(0, 200);
      }
      throw new Error(msg);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async function send(userText) {
    if (!userText || !userText.trim()) return;

    appendMsg('user', userText);
    conversation.push({ role: 'user', content: userText });
    inputEl.value = '';
    inputEl.style.height = 'auto';
    sendBtn.disabled = true;
    if (suggestionsEl) suggestionsEl.style.display = 'none';
    showTyping();

    try {
      const messages = [{ role: 'system', content: SYSTEM_PROMPT }, ...conversation];
      const reply = await sendToOpenAI(messages);
      hideTyping();
      appendMsg('assistant', reply);
      conversation.push({ role: 'assistant', content: reply });
    } catch (err) {
      hideTyping();
      appendMsg('error', '⚠ تعذّر الاتصال بـ OpenAI. ' + err.message);
      conversation.pop();
    } finally {
      sendBtn.disabled = false;
      inputEl.focus();
    }
  }

  function startConversation() {
    conversation = [];
    messagesEl.innerHTML = '';
    appendMsg(
      'assistant',
      'مرحباً! أنا معلمك الذكي في الكيمياء 👋\n\nقبل أن نبدأ، أخبرني: ماذا تعرف بالفعل عن النماذج الذرية؟ هل سمعت بأسماء مثل دالتون أو رذرفورد أو بور؟'
    );
    if (suggestionsEl) suggestionsEl.style.display = '';
  }

  function init() {
    const root = document.getElementById('ai-chat-root');
    if (!root) return;

    root.innerHTML = `
      <div class="ai-chat">
        <div class="ai-chat-header">
          <div class="ai-avatar" aria-hidden="true">🤖</div>
          <div style="flex: 1;">
            <h3 style="margin: 0; font-size: 1.1rem;">المعلم الذكي للكيمياء</h3>
            <div class="ai-status">
              <span class="dot-pulse"></span>
              <span>جاهز للحوار</span>
            </div>
          </div>
          <button class="btn btn-outline" id="ai-reset-btn" style="font-size: 0.85rem; padding: 0.4rem 0.9rem;" title="بدء محادثة جديدة">🔄 محادثة جديدة</button>
        </div>

        <div class="ai-messages" id="ai-messages" aria-live="polite"></div>

        <div class="ai-suggestions" id="ai-suggestions">
          <button class="ai-suggestion" data-q="اشرح لي ما هو النموذج الذري؟">ما النموذج الذري؟</button>
          <button class="ai-suggestion" data-q="ما الفرق بين نموذجي بور والكمي الحديث؟">الفرق بين بور والكمي</button>
          <button class="ai-suggestion" data-q="اختبرني بسؤال عن الجسيمات تحت الذرية.">اختبرني الآن!</button>
          <button class="ai-suggestion" data-q="كيف أحسب عدد النيوترونات في ذرة معطاة؟">حساب النيوترونات</button>
        </div>

        <div class="ai-input-row">
          <textarea
            id="ai-input"
            class="ai-input"
            placeholder="اكتب سؤالك للمعلم الذكي..."
            rows="1"
            aria-label="اكتب رسالة للمعلم الذكي"></textarea>
          <button class="ai-send" id="ai-send" aria-label="إرسال" title="إرسال (Enter)">✈</button>
        </div>
      </div>
    `;

    messagesEl = root.querySelector('#ai-messages');
    inputEl = root.querySelector('#ai-input');
    sendBtn = root.querySelector('#ai-send');
    suggestionsEl = root.querySelector('#ai-suggestions');

    if (!getKey()) {
      appendMsg(
        'error',
        '⚠ لم يتم تحميل مفتاح OpenAI API. يرجى التأكد من وجود ملف assets/js/config.js وتحديده قبل ai-chat.js في الصفحة.'
      );
    } else {
      startConversation();
    }

    sendBtn.addEventListener('click', () => send(inputEl.value));

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send(inputEl.value);
      }
    });

    inputEl.addEventListener('input', () => {
      inputEl.style.height = 'auto';
      inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
    });

    suggestionsEl.querySelectorAll('.ai-suggestion').forEach((btn) => {
      btn.addEventListener('click', () => {
        const q = btn.getAttribute('data-q');
        send(q);
      });
    });

    root.querySelector('#ai-reset-btn').addEventListener('click', () => {
      if (!getKey()) return;
      startConversation();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
