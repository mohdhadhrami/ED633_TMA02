/* ============================================
   particles.js — Canvas-based atomic particles
   Subtle drifting dots, ~30 particles, blurred
   ============================================ */

(function () {
  'use strict';

  const PARTICLE_COUNT = 30;

  function readThemeColors() {
    const styles = getComputedStyle(document.documentElement);
    return {
      colors: [
        styles.getPropertyValue('--particle-color-1').trim() || 'rgba(74, 158, 255, 0.7)',
        styles.getPropertyValue('--particle-color-2').trim() || 'rgba(255, 215, 0, 0.6)',
        styles.getPropertyValue('--particle-color-3').trim() || 'rgba(157, 78, 221, 0.6)',
        styles.getPropertyValue('--particle-color-4').trim() || 'rgba(240, 244, 255, 0.5)'
      ],
      line: styles.getPropertyValue('--particle-line').trim() || 'rgba(74, 158, 255, 0.06)'
    };
  }

  let canvas, ctx, particles = [], width = 0, height = 0, rafId;
  let themeColors = { colors: [], line: '' };

  function init() {
    canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    themeColors = readThemeColors();
    resize();
    spawn();
    animate();
    window.addEventListener('resize', resize);
    document.addEventListener('themechange', () => {
      themeColors = readThemeColors();
      // re-assign colors to existing particles for smoother transition
      particles.forEach((p) => {
        p.color = themeColors.colors[Math.floor(Math.random() * themeColors.colors.length)];
      });
    });
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  function spawn() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 2.2 + 0.8,
        color: themeColors.colors[Math.floor(Math.random() * themeColors.colors.length)],
        opacity: Math.random() * 0.4 + 0.15
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines first (behind particles)
    ctx.strokeStyle = themeColors.line;
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.globalAlpha = (1 - dist / 140) * 0.4;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    // Draw particles
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      // Glow effect
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = Math.min(p.opacity * 2, 1);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
  }

  function animate() {
    step();
    rafId = requestAnimationFrame(animate);
  }

  // Pause when tab hidden to save resources
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      animate();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
