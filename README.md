# 🔬 درس النماذج الذرية | ED633 — TMA2

موقع تعليمي تفاعلي لتدريس وحدة **"النماذج الذرية"** لطلاب الصف العاشر، يجمع بين الواقع المعزَّز (AR)، التلعيب (Gamification)، والذكاء الاصطناعي (AI) — مع **معلم ذكي حيّ** يحاور الطالب عبر OpenAI API.

ضمن متطلبات مقرر **تطبيقات في التكنولوجيا — ED633** في الجامعة العربية المفتوحة (AOU)، الفصل 2025-2026.

---

## 👥 فريق العمل

| الاسم | الرقم الجامعي |
|-------|----------------|
| سلطان بن زهران الحراصي | 250888 |
| محمد بن أحمد الحضرمي | 251506 |

**المحاضر:** د. أحمد المزروعي

---

## ✨ المميزات الرئيسية

- 🌗 **وضعان للعرض:** ليلي (داكن افتراضي) ونهاري (أزرق فاتح). زرّ التبديل في أعلى يسار كل صفحة، والاختيار يُحفظ تلقائياً.
- 🤖 **معلم ذكي حيّ** يطبّق التعلم البنائي (Constructivist) ويوجِّه الطالب خطوة بخطوة عبر OpenAI GPT-4o-mini.
- 🎬 **فيديو HeyGen** بأفاتار مدمج.
- 🎮 **Kahoot** ولعبة **Wordwall** عربية مدمجة.
- 📱 **Assemblr EDU AR** مع QR Code للهاتف.
- ✅ **تقويم ذاتي** بـ 5 أسئلة وتغذية راجعة فورية.
- 🌌 **خلفية متحركة** بالـ Canvas (تتفاعل مع الثيم).
- 📐 **Glassmorphism + Gradient + RTL** متجاوبة مع كل الأحجام.

---

## 📁 هيكل المشروع

```
atomic-models-lesson/
├── index.html                      ← صفحة الغلاف
├── pages/                          ← 19 صفحة من الدرس
│   ├── 01-guide.html  ...  19-references.html
├── assets/
│   ├── css/style.css               ← ثيم نهاري/ليلي + جميع الأنماط
│   ├── js/
│   │   ├── nav.js                  ← header/footer + theme toggle + التنقل
│   │   ├── particles.js            ← خلفية Canvas (تتجاوب مع الثيم)
│   │   ├── quiz.js                 ← التقويم الذاتي
│   │   ├── ai-chat.js              ← منطق دردشة OpenAI
│   │   └── config.local.example.js ← قالب لتخزين مفتاح API محلياً (اختياري)
│   └── images/
│       └── qr-assemblr.png
├── README.md
├── .gitignore                      ← يستثني config.local.js والملفات الحسّاسة
└── .nojekyll                       ← لتعطيل Jekyll على GitHub Pages
```

---

## 🔐 كيف يعمل المعلم الذكي + الأمان

تمّ تصميم نشاط الذكاء الاصطناعي بطريقة **آمنة افتراضياً**:

1. **لا يُكتب أيّ مفتاح API في الكود الذي يُرفع إلى GitHub.**
2. عند فتح صفحة "نشاط الذكاء الاصطناعي"، يُطلب من الطالب إدخال مفتاحه الخاص.
3. يُحفظ المفتاح في **`localStorage` للمتصفح فقط**، على جهاز كل طالب.
4. الاتصال يتمّ مباشرة من المتصفّح إلى `api.openai.com`، بدون مرور على أيّ خادم تابع لنا.

### للاستخدام الشخصي فقط (تخطّي إدخال المفتاح يدوياً)

> ⚠ هذا الخيار **غير آمن للنشر العام** — لا تستخدمه إلا للتجربة المحلية.

```bash
# داخل atomic-models-lesson/assets/js/
cp config.local.example.js config.local.js
# عدّل config.local.js وضع مفتاحك
```
ثم في `pages/16-ai.html`، ألغِ التعليق عن السطر:
```html
<!-- <script src="../assets/js/config.local.js"></script> -->
```

ملف `.gitignore` يستثني `config.local.js` تلقائياً، لذا لن يُرفع إلى GitHub.

---

## 🖥️ التشغيل المحلي

```bash
# داخل مجلد المشروع
python -m http.server 8000
```
ثم افتح: `http://localhost:8000/`

أو استخدم: `npx serve .` أو إضافة **Live Server** في VS Code.

---

## 🚀 النشر على GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit: atomic models lesson"
git branch -M main
git remote add origin https://github.com/<username>/atomic-models-lesson.git
git push -u origin main
```
ثم: **Settings → Pages → main / root → Save**.

الموقع متاح على: `https://<username>.github.io/atomic-models-lesson/`

> ⚠ تأكّد من **عدم رفع** أيّ مفتاح API. تحقّق بـ `git status` قبل `git push`.

---

## 🎨 نظام التصميم

| العنصر | الوضع الليلي | الوضع النهاري |
|--------|----------------|------------------|
| الخلفية | `#0a0e27` كحلي عميق | `#e6f1ff` أزرق سماوي فاتح |
| البطاقة | شبه شفافة على كحلي | بيضاء شبه شفافة |
| الأزرق المركزي | `#4a9eff` | `#2563eb` |
| الذهبي | `#ffd700` | `#d97706` |
| البنفسجي | `#9d4edd` | `#7c3aed` |
| النص | `#f0f4ff` | `#0f172a` |

التبديل يُحفَظ تحت `localStorage["atomic-theme"]`.

---

## 📋 الروابط الفعلية المضمّنة

| النشاط | الرابط |
|--------|--------|
| فيديو HeyGen | [العرض في HeyGen](https://app.heygen.com/videos/58e7ad74bde04f69aa6436e1535b56c0) |
| Kahoot | [تفاصيل اللعبة](https://create.kahoot.it/details/8dcaac4e-45da-409c-8796-52f46ed33358) |
| Wordwall | [نشاط المطابقة](https://wordwall.net/ar/embed/80c55b3d9e114dde9ab5141895bc6919) |
| Assemblr EDU | [نشاط AR](https://edu.assemblrworld.com/edukits/717) |

---

## 📜 الترخيص

هذا المشروع لأغراض تعليمية ضمن متطلبات مقرر ED633 — TMA2.

> صُمم بشغفٍ لمقرر **ED633 — Applications in Educational Technology** 🚀
