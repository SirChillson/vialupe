(function() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let scrollY = window.scrollY;
  
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
      const size = Math.random() * 2 + 0.5; // Slightly larger range
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        size: size,
        // CRANKED UP: Exponential depth. 
        // Larger particles now move MUCH faster than smaller ones.
        parallaxFactor: Math.pow(size, 2) * 0.15 
      });
    }
  }

  function animate() {
    const theme = getTheme();
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = theme.text;
    ctx.globalAlpha = 0.15; 
    
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Screen wrap for the underlying coordinates
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Parallax Shift
      // As you scroll down (scrollY increases), particles shift UP (negative).
      let visualY = p.y - (scrollY * p.parallaxFactor);
      
      // Infinite scroll wrap for the visual position
      visualY = ((visualY % canvas.height) + canvas.height) % canvas.height;

      ctx.beginPath();
      ctx.arc(p.x, visualY, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.globalAlpha = 1.0;
    requestAnimationFrame(animate);
  }
  
    window.addEventListener('resize', init);
    init();
    animate();
  })();