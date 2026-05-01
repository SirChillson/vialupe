document.addEventListener('DOMContentLoaded', () => {
    const cube = document.getElementById('cube');
    const shadow = document.getElementById('cube-shadow');
    const currentCountEl = document.getElementById('current-count');
    const highScoreEl = document.getElementById('high-score-label');
    
    if (!cube || !shadow || !currentCountEl || !highScoreEl) return;

    // --- PHYSICS SETTINGS ---
    const gravity = 0.35;
    const bounce = -0.15;
    const friction = 0.94;
    const rotFriction = 0.92;
    let groundY = (window.innerHeight * 0.85) - 100;

    let x = window.innerWidth - 300, y = groundY; 
    let vx = 0, vy = 0;
    let rotX = 0, rotY = 0, rotZ = 0;
    let vrX = 0, vrY = 0, vrZ = 0;

    // --- SCORE STATE ---
    let consecutiveClicks = 0;
    let highScore = parseInt(localStorage.getItem('cube_high_score')) || 0;
    highScoreEl.textContent = `Best: ${highScore}`;

    function applyKick() {
        consecutiveClicks++;
        
        if (consecutiveClicks > highScore) {
            highScore = consecutiveClicks;
            localStorage.setItem('cube_high_score', highScore);
            highScoreEl.textContent = `Best: ${highScore}`;
        }

        if (consecutiveClicks >= 3) {
            currentCountEl.textContent = consecutiveClicks;
            currentCountEl.classList.remove('hidden');
        }

        // Horizontal velocity: push it toward the center of the screen slightly
        const pushDir = x > window.innerWidth / 2 ? -1 : 1;
        vx = (Math.random() * 10) * pushDir;
        
        vy = -14 - (Math.random() * 4); 
        vrX = (Math.random() - 0.5) * 10;
        vrY = (Math.random() - 0.5) * 10;
        vrZ = (Math.random() - 0.5) * 5;
    }

    // --- FORGIVING INPUT HANDLER ---
    const handleInput = (clientX, clientY) => {
        const rect = cube.getBoundingClientRect();
        
        // buffer: increase this (pixels) to make it easier to hit
        const buffer = 40; 

        const isInside = (
            clientX >= rect.left - buffer &&
            clientX <= rect.right + buffer &&
            clientY >= rect.top - buffer &&
            clientY <= rect.bottom + buffer
        );

        if (isInside) {
            applyKick();
        }
    };

    // Capture phase listeners (true) ensure we beat the "Lupe" overlay
    window.addEventListener('mousedown', (e) => handleInput(e.clientX, e.clientY), true);
    
    // Instant response for mobile/touch devices
    window.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        handleInput(touch.clientX, touch.clientY);
    }, { capture: true, passive: true });

    function animate() {
        groundY = (window.innerHeight * 0.85) - 100;
        vy += gravity;
        if (vy > 0) vy *= 0.99;

        x += vx; y += vy;
        rotX += vrX; rotY += vrY; rotZ += vrZ;

        if (y >= groundY) {
            y = groundY;
            vy *= bounce; vx *= friction;
            vrX *= rotFriction; vrY *= rotFriction; vrZ *= rotFriction;

            if (consecutiveClicks > 0) {
                consecutiveClicks = 0;
                currentCountEl.classList.add('hidden');
            }

            if (Math.abs(vrX) < 4) {
                rotX += (Math.round(rotX / 90) * 90 - rotX) * 0.05;
                rotY += (Math.round(rotY / 90) * 90 - rotY) * 0.05;
                rotZ += (Math.round(rotZ / 90) * 90 - rotZ) * 0.05;
            }
        }

        // Wall bounce: stop it from getting stuck on edges
        if (x < 20) { x = 21; vx *= -0.6; }
        if (x > window.innerWidth - 120) { x = window.innerWidth - 121; vx *= -0.6; }

        cube.style.transform = `translate3d(${x}px, ${y}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`;
        
        const height = groundY - y;
        const sScale = 1 + (height / 250);
        const sOpacity = Math.max(0, 0.5 - (height / 400));
        shadow.style.transform = `translate3d(${x + 50}px, ${groundY + 105}px, 0) rotateX(90deg) scale(${sScale})`;
        shadow.style.opacity = sOpacity;

        requestAnimationFrame(animate);
    }
    animate();
});