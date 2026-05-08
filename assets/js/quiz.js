/* ============================================
   quiz.js — Self-assessment interactive quiz
   ============================================ */

class AtomicQuiz {
  constructor(containerId, questions) {
    this.container = document.getElementById(containerId);
    this.questions = questions;
    this.currentIndex = 0;
    this.answers = [];
    this.score = 0;
    if (this.container) this.render();
  }

  render() {
    if (this.currentIndex >= this.questions.length) {
      this.renderResult();
      return;
    }
    const q = this.questions[this.currentIndex];
    const total = this.questions.length;

    let progressHtml = '<div class="quiz-progress">';
    for (let i = 0; i < total; i++) {
      let cls = '';
      if (i < this.currentIndex) cls = 'done';
      else if (i === this.currentIndex) cls = 'active';
      progressHtml += `<div class="step ${cls}"></div>`;
    }
    progressHtml += '</div>';

    let optionsHtml = '';
    q.options.forEach((opt, i) => {
      optionsHtml += `<button class="quiz-option" data-index="${i}">${opt}</button>`;
    });

    this.container.innerHTML = `
      ${progressHtml}
      <div class="quiz-question">
        <p class="text-secondary">السؤال ${this.currentIndex + 1} من ${total}</p>
        <h3>${q.question}</h3>
        <div class="quiz-options">${optionsHtml}</div>
        <div class="quiz-feedback" id="quiz-feedback"></div>
        <div class="quiz-actions">
          <span></span>
          <button class="btn btn-gold" id="quiz-next" style="display:none;">
            ${this.currentIndex === total - 1 ? 'عرض النتيجة' : 'السؤال التالي ←'}
          </button>
        </div>
      </div>
    `;

    const options = this.container.querySelectorAll('.quiz-option');
    options.forEach((opt) => {
      opt.addEventListener('click', () => this.selectOption(parseInt(opt.dataset.index, 10)));
    });

    const nextBtn = this.container.querySelector('#quiz-next');
    nextBtn.addEventListener('click', () => {
      this.currentIndex++;
      this.render();
      window.scrollTo({ top: this.container.offsetTop - 100, behavior: 'smooth' });
    });
  }

  selectOption(index) {
    const q = this.questions[this.currentIndex];
    const options = this.container.querySelectorAll('.quiz-option');
    const feedback = this.container.querySelector('#quiz-feedback');
    const nextBtn = this.container.querySelector('#quiz-next');

    options.forEach((o) => o.classList.add('locked'));
    options[index].classList.add('selected');

    const correct = index === q.correctIndex;
    if (correct) {
      this.score++;
      options[index].classList.add('correct');
      feedback.className = 'quiz-feedback correct';
      feedback.innerHTML = `✓ إجابة صحيحة! ${q.explanation || ''}`;
    } else {
      options[index].classList.add('wrong');
      options[q.correctIndex].classList.add('correct');
      feedback.className = 'quiz-feedback wrong';
      feedback.innerHTML = `✗ إجابة غير صحيحة. ${q.explanation || ''}`;
    }

    this.answers.push({ questionIndex: this.currentIndex, selected: index, correct });
    nextBtn.style.display = 'inline-flex';
  }

  renderResult() {
    const total = this.questions.length;
    const percent = Math.round((this.score / total) * 100);

    let message = '';
    let emoji = '';
    if (percent >= 80) {
      emoji = '🌟';
      message = 'أداء ممتاز! لقد أتقنت موضوع النماذج الذرية بشكل رائع.';
    } else if (percent >= 60) {
      emoji = '👍';
      message = 'أداء جيد! راجع بعض النقاط لتعزيز فهمك أكثر.';
    } else if (percent >= 40) {
      emoji = '📖';
      message = 'لا بأس، لديك أساس. أعد قراءة الصفحات السابقة وحاول مجدداً.';
    } else {
      emoji = '💪';
      message = 'لا تستسلم! العلم رحلة، عُد للمحتوى وستصل للنتيجة المرجوة.';
    }

    this.container.innerHTML = `
      <div class="quiz-result card">
        <div style="font-size: 4rem; margin-bottom: 1rem;">${emoji}</div>
        <div class="quiz-score">${this.score} / ${total}</div>
        <p style="font-size: 1.5rem; margin: 1rem 0;">النسبة المئوية: ${percent}%</p>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">${message}</p>
        <button class="btn" id="quiz-restart">إعادة التقييم 🔁</button>
      </div>
    `;

    this.container.querySelector('#quiz-restart').addEventListener('click', () => {
      this.currentIndex = 0;
      this.score = 0;
      this.answers = [];
      this.render();
    });
  }
}

// Default questions for the lesson
const DEFAULT_QUESTIONS = [
  {
    question: 'أيُّ العلماء التاليين اقترح أن الذرة تشبه "كرة صلبة غير قابلة للتجزئة"؟',
    options: ['طومسون', 'دالتون', 'رذرفورد', 'بور'],
    correctIndex: 1,
    explanation: 'دالتون (1808) قدّم أول نظرية ذرية حديثة تصف الذرة ككرة صلبة غير قابلة للتجزئة.'
  },
  {
    question: 'ما الجسيم تحت الذري الذي اكتشفه طومسون من خلال تجاربه على أشعة المهبط؟',
    options: ['البروتون', 'النيوترون', 'الإلكترون', 'البوزيترون'],
    correctIndex: 2,
    explanation: 'طومسون اكتشف الإلكترون عام 1897 وقدّم نموذج "كعكة الزبيب".'
  },
  {
    question: 'إذا كان العدد الذري لعنصر يساوي 11 وعدده الكتلي 23، فكم عدد النيوترونات في نواته؟',
    options: ['11', '12', '23', '34'],
    correctIndex: 1,
    explanation: 'عدد النيوترونات = العدد الكتلي − العدد الذري = 23 − 11 = 12.'
  },
  {
    question: 'ما الفرق الجوهري بين نموذج بور والنموذج الكمي الحديث؟',
    options: [
      'بور وضع الإلكترونات في النواة، أما الكمي فخارج النواة',
      'بور أعطى مسارات محددة، أما الكمي فيعتمد على احتمالية وجود الإلكترون',
      'بور لم يستخدم الرياضيات، أما الكمي فيستخدمها',
      'لا فرق جوهري بينهما'
    ],
    correctIndex: 1,
    explanation: 'النموذج الكمي يصف مناطق احتمال وجود الإلكترون (سحب إلكترونية) بدلاً من مدارات حتمية محددة.'
  },
  {
    question: 'أيُّ تجربة قادت إلى استنتاج أن الذرة تحتوي على نواة صغيرة موجبة الشحنة؟',
    options: [
      'تجربة أشعة المهبط',
      'تجربة قطرة الزيت',
      'تجربة صفيحة الذهب لرذرفورد',
      'تجربة الانبعاث الطيفي للهيدروجين'
    ],
    correctIndex: 2,
    explanation: 'تجربة رذرفورد (1911) بقذف رقائق الذهب بجسيمات ألفا أثبتت وجود نواة كثيفة موجبة الشحنة.'
  }
];

// Auto-init if container exists
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('quiz-root');
  if (container) {
    new AtomicQuiz('quiz-root', DEFAULT_QUESTIONS);
  }
});
