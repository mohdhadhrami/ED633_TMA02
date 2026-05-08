/* ============================================
   nav.js — Injects shared header/footer/side-panel
   Auto-detects current page and provides prev/next
   ============================================ */

(function () {
  'use strict';

  // Apply saved theme as early as possible to avoid flash
  try {
    const saved = localStorage.getItem('atomic-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  const PAGES = [
    { file: 'index.html',           title: 'صفحة الغلاف',              icon: '🏠', root: true },
    { file: '01-guide.html',        title: 'دليل الاستخدام',            icon: '📖' },
    { file: '02-intro.html',        title: 'المقدمة',                   icon: '✨' },
    { file: '03-toc.html',          title: 'الفهرس',                    icon: '📑' },
    { file: '04-video.html',        title: 'الفيديو التعريفي (AI)',     icon: '🎬' },
    { file: '05-objectives.html',   title: 'الأهداف التعليمية',          icon: '🎯' },
    { file: '06-dalton.html',       title: 'نموذج دالتون',              icon: '⚪' },
    { file: '07-thomson.html',      title: 'نموذج طومسون',              icon: '🍮' },
    { file: '08-rutherford.html',   title: 'نموذج رذرفورد',             icon: '☢️' },
    { file: '09-bohr.html',         title: 'نموذج بور',                 icon: '🪐' },
    { file: '10-quantum.html',      title: 'النموذج الكمي الحديث',       icon: '⚛️' },
    { file: '11-particles.html',    title: 'الجسيمات تحت الذرية',        icon: '🔬' },
    { file: '12-numbers.html',      title: 'العدد الذري والكتلي',        icon: '🔢' },
    { file: '13-kahoot.html',       title: 'لعبة Kahoot',               icon: '🎮' },
    { file: '14-wordwall.html',     title: 'نشاط Wordwall',             icon: '🧩' },
    { file: '15-ar.html',           title: 'الواقع المعزز Assemblr',    icon: '📱' },
    { file: '16-ai.html',           title: 'نشاط الذكاء الاصطناعي',     icon: '🤖' },
    { file: '17-assessment.html',   title: 'التقويم الذاتي',             icon: '✅' },
    { file: '18-conclusion.html',   title: 'الخاتمة',                   icon: '🌟' },
    { file: '19-references.html',   title: 'المراجع',                   icon: '📚' }
  ];

  function detectCurrentPage() {
    let path = window.location.pathname.split('/').pop() || 'index.html';
    if (!path.endsWith('.html')) path = 'index.html';
    return path;
  }

  function getPagePath(page, currentPage) {
    const isAtRoot = currentPage === 'index.html' || currentPage === '';
    if (page.file === 'index.html') {
      return isAtRoot ? 'index.html' : '../index.html';
    }
    return isAtRoot ? `pages/${page.file}` : page.file;
  }

  function injectHeader(currentPage) {
    const isAtRoot = currentPage === 'index.html' || currentPage === '';
    const logoSrc = isAtRoot ? 'assets/images/aou-logo.png' : '../assets/images/aou-logo.png';

    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
      <div class="header-inner">
        <div class="logo-area">
          <img src="${logoSrc}" alt="شعار الجامعة العربية المفتوحة" class="aou-logo" />
        </div>
        <h1 class="header-title">النماذج الذرية</h1>
        <div class="header-controls">
          <button class="theme-toggle" id="theme-toggle" aria-label="تبديل الوضع النهاري/الليلي" title="تبديل الوضع النهاري/الليلي">
            <span id="theme-toggle-icon">🌙</span>
          </button>
          <button class="menu-toggle" aria-label="فتح القائمة" id="menu-toggle">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    `;
    document.body.insertBefore(header, document.body.firstChild);

    setupThemeToggle();
  }

  function setupThemeToggle() {
    const root = document.documentElement;
    const btn = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-toggle-icon');

    function applyTheme(theme) {
      root.setAttribute('data-theme', theme);
      if (icon) icon.textContent = theme === 'light' ? '☀️' : '🌙';
      try { localStorage.setItem('atomic-theme', theme); } catch (e) {}
      document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }

    let saved = 'dark';
    try { saved = localStorage.getItem('atomic-theme') || 'dark'; } catch (e) {}
    applyTheme(saved);

    btn && btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  function injectSidePanel(currentPage) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay-backdrop';
    overlay.id = 'overlay-backdrop';

    const panel = document.createElement('aside');
    panel.className = 'side-panel';
    panel.id = 'side-panel';
    panel.setAttribute('aria-label', 'قائمة صفحات الدرس');

    let listHtml = '';
    PAGES.forEach((page) => {
      const isCurrent = page.file === currentPage;
      const href = getPagePath(page, currentPage);
      listHtml += `<li><a href="${href}" class="${isCurrent ? 'current' : ''}"><span aria-hidden="true">${page.icon}</span> ${page.title}</a></li>`;
    });

    panel.innerHTML = `
      <button class="side-panel-close" id="side-panel-close" aria-label="إغلاق القائمة">×</button>
      <h3>محتوى الدرس</h3>
      <ol>${listHtml}</ol>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    const toggle = document.getElementById('menu-toggle');
    const closeBtn = document.getElementById('side-panel-close');

    function openPanel() {
      panel.classList.add('open');
      overlay.classList.add('show');
    }
    function closePanel() {
      panel.classList.remove('open');
      overlay.classList.remove('show');
    }

    toggle && toggle.addEventListener('click', openPanel);
    closeBtn && closeBtn.addEventListener('click', closePanel);
    overlay.addEventListener('click', closePanel);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });
  }

  function injectFooter(currentPage) {
    const idx = PAGES.findIndex((p) => p.file === currentPage);
    const prev = idx > 0 ? PAGES[idx - 1] : null;
    const next = idx >= 0 && idx < PAGES.length - 1 ? PAGES[idx + 1] : null;

    const prevHtml = prev
      ? `<a href="${getPagePath(prev, currentPage)}" class="btn btn-outline">→ ${prev.title}</a>`
      : '';
    const nextHtml = next
      ? `<a href="${getPagePath(next, currentPage)}" class="btn">${next.title} ←</a>`
      : '';

    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="footer-inner">
        <div class="footer-col">
          <h4>الطلاب</h4>
          <p>سلطان بن زهران الحراصي — 250888</p>
          <p>محمد بن أحمد الحضرمي — 251506</p>
          <p>المحاضر: د. أحمد المزروعي</p>
          <p>الفصل الدراسي: 2025 - 2026</p>
        </div>
        <div class="footer-col">
          <h4>التنقل</h4>
          <div class="footer-nav">
            ${prevHtml}
            ${nextHtml}
          </div>
        </div>
        <div class="footer-col">
          <h4>عن الدرس</h4>
          <p>درس تفاعلي ضمن متطلبات مقرر تطبيقات في التكنولوجيا — ED633</p>
          <span class="course-badge">صُمم لمقرر ED633</span>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 — الجامعة العربية المفتوحة | جميع الحقوق محفوظة</p>
      </div>
    `;
    document.body.appendChild(footer);
  }

  function setupScrollDots() {
    const sections = document.querySelectorAll('[data-scroll-dot]');
    if (sections.length < 2) return;

    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'scroll-dots';
    sections.forEach((section, i) => {
      const dot = document.createElement('div');
      dot.className = 'dot';
      dot.title = section.getAttribute('data-scroll-dot') || `قسم ${i + 1}`;
      dot.addEventListener('click', () => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      dotsContainer.appendChild(dot);
    });
    document.body.appendChild(dotsContainer);

    const dots = dotsContainer.querySelectorAll('.dot');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(sections).indexOf(entry.target);
            dots.forEach((d, i) => d.classList.toggle('active', i === idx));
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((s) => observer.observe(s));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const currentPage = detectCurrentPage();
    injectHeader(currentPage);
    injectSidePanel(currentPage);
    injectFooter(currentPage);
    setupScrollDots();
  });
})();
