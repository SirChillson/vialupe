// Quiet drifting dust behind the page. Static for readers who prefer reduced motion.
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let particles = [];

  function theme() {
    const s = getComputedStyle(document.body);
    return { bg: s.getPropertyValue('--bg').trim(), text: s.getPropertyValue('--text').trim() };
  }

  function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      size: Math.random() * 2 + 0.5,
    }));
  }

  function paint() {
    const t = theme();
    ctx.fillStyle = t.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = t.text;
    ctx.globalAlpha = 0.15;
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function animate() {
    for (const p of particles) {
      p.x = (p.x + p.vx + canvas.width) % canvas.width;
      p.y = (p.y + p.vy + canvas.height) % canvas.height;
    }
    paint();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { init(); if (reduceMotion) paint(); });
  // Repaint when the theme toggle changes colors
  new MutationObserver(() => { if (reduceMotion) paint(); }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  init();
  if (reduceMotion) paint(); else animate();
})();
