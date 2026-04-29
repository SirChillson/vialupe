document.addEventListener('DOMContentLoaded', () => {
  const link = document.getElementById('lupe-link');
  const area = document.getElementById('secret-area');
  if (!link || !area) return;

  let exposure = 0;
  const revealSpeed = 0.018; // Keeping it "hard to get"
  const decaySpeed = 0.005;

  // Unified function to check if a point (x, y) is inside the secret area
  function handleInput(clientX, clientY) {
    const rect = area.getBoundingClientRect();
    const isInside = (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );

    if (isInside && exposure < 1) {
      exposure += revealSpeed;
    }
  }

  // 1. Mouse Listener (Desktop)
  window.addEventListener('mousemove', (e) => {
    handleInput(e.clientX, e.clientY);
  });

  // 2. Touch Listener (Mobile)
  window.addEventListener('touchmove', (e) => {
    // We use the first finger touch detected
    const touch = e.touches[0];
    handleInput(touch.clientX, touch.clientY);
  }, { passive: true }); // 'passive' ensures scrolling stays smooth

  function animate() {
    if (exposure > 0) {
      exposure -= decaySpeed;
      exposure = Math.max(0, exposure);
    }

    // Apply the "Threshold" math so it stays invisible until they work for it
    const visualOpacity = exposure > 0.4 ? (exposure - 0.4) / 0.6 : 0;
    link.style.opacity = visualOpacity;

    if (visualOpacity > 0.8) {
      link.classList.add('revealed');
      link.style.pointerEvents = "auto";
    } else {
      link.classList.remove('revealed');
      link.style.pointerEvents = "none";
    }

    requestAnimationFrame(animate);
  }

  animate();
});