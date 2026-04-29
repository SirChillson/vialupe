document.addEventListener('DOMContentLoaded', () => {
  const link = document.getElementById('lupe-link');
  const area = document.getElementById('secret-area');
  
  if (!link || !area) return;

  let exposure = 0;
  const revealSpeed = 0.018;
  const decaySpeed = 0.005;

  // Global listener is much more reliable
  window.addEventListener('mousemove', (e) => {
    // Get the exact position of the secret area on the screen
    const rect = area.getBoundingClientRect();
    
    // Check if the mouse is inside that rectangle
    const isInside = (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    );

    if (isInside) {
      if (exposure < 1) {
        exposure += revealSpeed;
        /*console.log("Scrubbing successful. Exposure:", exposure.toFixed(2));*/
      }
    }
  });

  function animate() {
    // Decay logic
    if (exposure > 0) {
      exposure -= decaySpeed;
      exposure = Math.max(0, exposure);
    }

    link.style.opacity = exposure;

    if (exposure > 0.8) {
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