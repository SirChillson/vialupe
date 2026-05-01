document.addEventListener('DOMContentLoaded', () => {
    const cube = document.getElementById('cube');
    const shadow = document.getElementById('cube-shadow');
    const scoreDisplay = document.getElementById('cube-score');
    const currentCountEl = document.getElementById('current-count');
    const highScoreEl = document.getElementById('high-score-label');
    
    if (!cube || !shadow || !scoreDisplay || !currentCountEl || !highScoreEl) return;

    // --- PHYSICS ---
    const gravity = 0.35;
    const bounce = -0.15;
    const friction = 0.94;
    let groundY = (window.innerHeight * 0.85) - 100;

    const path = window.location.pathname.replace(/\/$/, "");
    const isHomePage = path === "" || path === "/index.html" || path.endsWith('index.html');
    let highScore = parseInt(localStorage.getItem('cube_high_score')) || 0;
    const isFirstHomeVisit = !sessionStorage.getItem('home_intro_done');

    // --- STATE ---
    let x, y = groundY;
    let vx = 0, vy = 0;
    let rotX = 0, rotY = 0, rotZ = 0;
    let vrX = 0, vrY = 0, vrZ = 0;
    let consecutiveClicks = 0;
    
    let readyToCreep = false;
    let hasEntered = false; 
    let isBanished = false;
    let isWaitingToHop = false;
    let mouseX = window.innerWidth / 2;

    // --- INITIALIZATION LOGIC ---
    if (isHomePage) {
        if (highScore < 3) {
            // LOW SCORE: Cube is a static object, no 'alive' behavior
            x = window.innerWidth - 300;
            hasEntered = true; 
            cube.style.opacity = "1";
        } else {
            // UNLOCKED: Cube is alive. 
            if (isFirstHomeVisit) {
                // First time this session: waiting at his post
                x = window.innerWidth - 300;
                hasEntered = true;
                cube.style.opacity = "1";
                sessionStorage.setItem('home_intro_done', 'true');
            } else {
                // Returning home: hops in after 3 seconds
                x = window.innerWidth + 600;
                cube.style.opacity = "0";
                setTimeout(() => { if (!isBanished) readyToCreep = true; }, 2300);
            }
        }
    } else {
        // SUB-PAGES: Start off-screen
        x = window.innerWidth + 600;
        cube.style.opacity = "0";
        // Only creep into sub-pages if score is 3+
        if (highScore >= 3) {
            setTimeout(() => { if (!isBanished) readyToCreep = true; }, 15000);
        }
    }

    // Apply starting X immediately
    cube.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    window.addEventListener('mousemove', (e) => { mouseX = e.clientX; });
    highScoreEl.textContent = `Best: ${highScore}`;
    if (isHomePage && highScore >= 3) scoreDisplay.classList.remove('hidden');

    function applyKick() {
        readyToCreep = false;
        isBanished = false;
        hasEntered = true;
        cube.style.opacity = "1";

        consecutiveClicks++;
        if (consecutiveClicks > highScore) {
            highScore = consecutiveClicks;
            localStorage.setItem('cube_high_score', highScore);
            highScoreEl.textContent = `Best: ${highScore}`;
        }
        if (highScore >= 3) scoreDisplay.classList.remove('hidden');
        if (consecutiveClicks >= 3) {
            currentCountEl.textContent = consecutiveClicks;
            currentCountEl.classList.remove('hidden');
        }
        const pushDir = x > window.innerWidth / 2 ? -1 : 1;
        vx = (Math.random() * 10) * pushDir;
        vy = -14 - (Math.random() * 4); 
        vrX = (Math.random() - 0.5) * 15;
        vrY = (Math.random() - 0.5) * 15;
    }

    const handleInput = (e) => {
        const rect = cube.getBoundingClientRect();
        const buffer = 45; 
        const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
        const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
        const isInside = (clientX >= rect.left - buffer && clientX <= rect.right + buffer &&
                          clientY >= rect.top - buffer && clientY <= rect.bottom + buffer);
        if (isInside) {
            if (e.button === 0 || e.type === 'touchstart') {
                applyKick();
            } else if (e.button === 2) {
                e.preventDefault();
                isBanished = true;
                readyToCreep = false;
                hasEntered = false; 
                scoreDisplay.classList.add('hidden'); 
            }
        }
    };

    window.addEventListener('mousedown', handleInput, true);
    window.addEventListener('touchstart', handleInput, { capture: true, passive: true });
    window.addEventListener('contextmenu', (e) => {
        const rect = cube.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) e.preventDefault();
    });

    function animate() {
        groundY = (window.innerHeight * 0.85) - 100;
        vy += gravity;
        if (vy > 0) vy *= 0.99;
        x += vx; y += vy;
        rotX += vrX; rotY += vrY; rotZ += vrZ;

        if (y >= groundY) {
            y = groundY;
            vy *= bounce; vx *= 0.94;
            vrX *= 0.92; vrY *= 0.92; vrZ *= 0.92;
            
            if (consecutiveClicks > 0) { 
                consecutiveClicks = 0; 
                currentCountEl.classList.add('hidden');
            }

            if (isBanished) {
                if (x < window.innerWidth + 200) {
                    if (!isWaitingToHop) {
                        isWaitingToHop = true;
                        setTimeout(() => { if (isBanished) { vx = 3; vy = -3.5; vrX = -1; } isWaitingToHop = false; }, 900);
                    }
                }
            } else if (readyToCreep) {
                cube.style.opacity = "1";
                const targetX = isHomePage ? window.innerWidth - 150 : mouseX - 50;
                const distance = targetX - x;
                
                if (Math.abs(distance) > 50 || x > window.innerWidth - 100) {
                    vx = distance > 0 ? 2.8 : -2.8; 
                    vy = -5.5; 
                    vrX = (Math.random() - 0.5) * 5;
                } else {
                    vx *= 0.4;
                    readyToCreep = false; 
                    hasEntered = true;
                }
            }

            if (Math.abs(vrX) < 4) {
                rotX += (Math.round(rotX / 90) * 90 - rotX) * 0.05;
                rotY += (Math.round(rotY / 90) * 90 - rotY) * 0.05;
                rotZ += (Math.round(rotZ / 90) * 90 - rotZ) * 0.05;
            }
        }

        // --- WALLS ---
        if (hasEntered) {
            if (x < 20) { x = 21; vx *= -0.6; }
            if (x > window.innerWidth - 120) { x = window.innerWidth - 121; vx *= -0.6; }
        }

        cube.style.transform = `translate3d(${x}px, ${y}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`;
        const height = groundY - y;
        shadow.style.transform = `translate3d(${x + 50}px, ${groundY + 105}px, 0) rotateX(90deg) scale(${1 + (height / 250)})`;
        shadow.style.opacity = (cube.style.opacity === "1") ? Math.max(0, 0.5 - (height / 400)) : "0";

        requestAnimationFrame(animate);
    }
    animate();
});