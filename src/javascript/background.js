const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    // Create 100 subtle particles
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2
        });
    }
}

function animate() {
    // This creates a slight "trailing" effect
    const isDark = document.body.classList.contains('dark-mode');
    ctx.fillStyle = isDark ? 'rgba(26, 26, 26, 0.05)' : 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
    
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', init);
init();
animate();