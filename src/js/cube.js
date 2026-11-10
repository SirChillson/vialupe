// The cube: a small wooden toy on the home page.
// Click or tap it to kick it into the air; keep it aloft to build a streak.
(function () {
  const cube = document.getElementById('cube');
  const shadow = document.getElementById('cube-shadow');
  const scoreBox = document.getElementById('cube-score');
  const bestEl = document.getElementById('high-score-label');
  const streakEl = document.getElementById('current-count');
  if (!cube || !shadow) return;

  const SIZE = 100;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tooNarrow = () => window.innerWidth < 720;

  const GRAVITY = 0.35;
  const BOUNCE = -0.15;
  const SHOW_SCORE_AT = 3;

  let best = 0;
  try { best = parseInt(localStorage.getItem('cube_high_score'), 10) || 0; } catch (e) {}

  const ground = () => window.innerHeight * 0.85 - SIZE;
  const restX = () => window.innerWidth - SIZE - 60;

  let x = restX(), y = ground();
  let vx = 0, vy = 0;
  let rx = 0, ry = 0, vrx = 0, vry = 0;
  let streak = 0;
  let running = false;

  function setScore() {
    bestEl.textContent = `Best: ${best}`;
    scoreBox.classList.toggle('hidden', best < SHOW_SCORE_AT);
    streakEl.textContent = streak;
    streakEl.classList.toggle('hidden', streak < 2);
  }

  function draw() {
    cube.style.transform = `translate3d(${x}px, ${y}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`;
    const h = Math.max(0, ground() - y);
    shadow.style.transform = `translate3d(${x + SIZE / 2 - 40}px, ${ground() + SIZE + 5}px, 0) rotateX(90deg) scale(${1 + h / 250})`;
    shadow.style.opacity = Math.max(0, 0.5 - h / 400);
  }

  function step() {
    vy += GRAVITY;
    x += vx; y += vy;
    rx += vrx; ry += vry;

    // Walls
    if (x < 20) { x = 20; vx *= -0.6; }
    if (x > window.innerWidth - SIZE - 20) { x = window.innerWidth - SIZE - 20; vx *= -0.6; }

    // Ground
    if (y >= ground()) {
      y = ground();
      vy *= BOUNCE; vx *= 0.9;
      vrx *= 0.9; vry *= 0.9;
      if (streak) { streak = 0; setScore(); }
      // Settle onto a flat face
      if (Math.abs(vrx) < 4) {
        rx += (Math.round(rx / 90) * 90 - rx) * 0.1;
        ry += (Math.round(ry / 90) * 90 - ry) * 0.1;
      }
    }

    draw();

    const atRest = y >= ground() - 0.5 && Math.abs(vx) < 0.05 && Math.abs(vy) < 0.5 &&
      Math.abs(vrx) < 0.05 && Math.abs(vry) < 0.05 &&
      Math.abs(rx % 90) < 0.5 && Math.abs(ry % 90) < 0.5;
    if (atRest) { running = false; return; }
    requestAnimationFrame(step);
  }

  function start() {
    if (!running) { running = true; requestAnimationFrame(step); }
  }

  function kick() {
    streak++;
    if (streak > best) {
      best = streak;
      try { localStorage.setItem('cube_high_score', best); } catch (e) {}
    }
    setScore();
    const dir = x > window.innerWidth / 2 ? -1 : 1;
    vx = Math.random() * 8 * dir;
    vy = -14 - Math.random() * 4;
    vrx = (Math.random() - 0.5) * 15;
    vry = (Math.random() - 0.5) * 15;
    start();
  }

  // Listen at the window so the cube can be kicked even where text overlaps it
  function onPointer(e) {
    if (e.button !== undefined && e.button !== 0) return;
    const r = cube.getBoundingClientRect();
    const pad = 30;
    if (e.clientX >= r.left - pad && e.clientX <= r.right + pad &&
        e.clientY >= r.top - pad && e.clientY <= r.bottom + pad) {
      kick();
    }
  }

  function layout() {
    const hide = tooNarrow();
    document.getElementById('cube-scene').style.display = hide ? 'none' : '';
    scoreBox.style.display = hide ? 'none' : '';
    if (!running) { x = Math.min(x, restX()); y = ground(); }
    draw();
  }

  setScore();
  layout();
  window.addEventListener('resize', layout);
  if (!reduceMotion) window.addEventListener('pointerdown', onPointer, true);
})();
