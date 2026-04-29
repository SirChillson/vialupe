(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function getTheme() {
    const style = getComputedStyle(document.body);
    return {
      bg: style.getPropertyValue('--bg').trim(),
      text: style.getPropertyValue('--text').trim()
    };
  }

  function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.1, // Drifting speed
        vy: (Math.random() - 0.5) * 0.1,
        size: Math.random() * 2 + 0.5
      });
    }
  }

  function animate() {
    const theme = getTheme();
    
    // Paint background
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Paint particles
    ctx.fillStyle = theme.text;
    ctx.globalAlpha = 0.15; 
    
    particles.forEach(p => {
      // Direct movement
      p.x += p.vx;
      p.y += p.vy;

      // Wrap-around logic
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.globalAlpha = 1.0;
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', init);
  init();
  animate();
})();