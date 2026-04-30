document.addEventListener('DOMContentLoaded', () => {
    const nameEl = document.getElementById('name-glitch');
    if (!nameEl) return;

    // --- PERSISTENCE CHECK ---
    // Check if the user has already triggered the breakdown
    if (localStorage.getItem('identity_state') === 'nobody') {
        nameEl.innerText = "Mr. Nobody";
        nameEl.style.color = "var(--subtle)";
        nameEl.classList.add('nobody');
        // Lock the width immediately so the rest of the sentence is stable
        nameEl.style.minWidth = "5.3rem"; 
        return; // Stop the script here so the click events never even load
    }

    // 1. Helper function to grab current theme colors
    function getThemeColors() {
        const style = getComputedStyle(document.body);
        return [
            style.getPropertyValue('--text').trim(),   // Your main text color
            style.getPropertyValue('--subtle').trim(), // Your orange/accent color
            style.getPropertyValue('--hover').trim(),  // Your hover/secondary color
            "#888" // A neutral gray that works in both modes
        ];
    }

    // Configuration
    const initialNames = ["Will", "Willie", "Billy", "Chillson", "Bill" ,];
    const randomNames = ["Librarian", "Archive", "λ", "Fragment", "Cipher", "Stranger", "Scribe", "Witness", "Found", "Lost", "Ghost", "Void"];


    let clickCount = 0;
    let isGlitching = false;

    // --- TRANSITION TO THE END ---
    function triggerFinalTransition() {
        // Immediately make the final glitchy name vanish
        nameEl.classList.remove('haywire');
        nameEl.classList.add('void'); 
    
        // The rest remains the same...
        setTimeout(() => {
            nameEl.innerText = "Mr. Nobody";
            nameEl.style.color = "var(--subtle)";
            nameEl.classList.remove('void');
            nameEl.classList.add('nobody');
            // --- SAVE THE LOSS ---
            localStorage.setItem('identity_state', 'nobody');
        }, 1500); 
    }

    // --- THE AUTO-PILOT LOOP ---
    function startAutoGlitch() {
        if (isGlitching) return;
        isGlitching = true;
        console.log("Identity: Auto-pilot engaged.");

        let autoIntensity = 1.5; 
        let autoSpeed = 0.6; // Starting slow (0.6 seconds)

        function glitchLoop() {
            // End condition: when intensity hits the ceiling
            if (autoIntensity > 15) {
                nameEl.style.minWidth = "5.3rem";
                triggerFinalTransition();
                return;
            }

            // Ramp up intensity and frequency
            autoIntensity += 0.35; 
            autoSpeed -= 0.025; // Each flick is 9% faster than the last
            if (autoSpeed < 0.06) autoSpeed = 0.06;
            nameEl.style.setProperty('--intensity', autoIntensity);
            nameEl.style.setProperty('--jitter-speed', `${autoSpeed}s`);

            // Randomize color and name
            // 2. Fetch the colors dynamically
            const currentPalette = getThemeColors();
            const randomColor = currentPalette[Math.floor(Math.random() * currentPalette.length)];
            nameEl.style.color = randomColor;
            // RANDOM NAMES (No Back-to-Back Repeats)
            let nextName;
            do {
                 nextName = randomNames[Math.floor(Math.random() * randomNames.length)];
            } while (nextName === nameEl.innerText); // Re-roll if it's the same as the current text

            nameEl.innerText = nextName;

            // Schedule the next flick
            setTimeout(glitchLoop, autoSpeed * 1000);
        }

        glitchLoop();
    }

    // --- CLICK LISTENER ---
    nameEl.addEventListener('click', () => {
        // Stop responding to clicks once auto-pilot starts
        if (isGlitching) return; 

        clickCount++;
        console.log(`Name Clicked: ${clickCount}`);
        
        // 1. Name Cycle
        if (clickCount <= initialNames.length) {
            nameEl.innerText = initialNames[clickCount - 1];
        } else {
            const randomIdx = Math.floor(Math.random() * randomNames.length);
            nameEl.innerText = randomNames[randomIdx];
        }

        // 2. Gradual Jitter Ramp
        if (clickCount >= 2) {
            nameEl.classList.add('haywire');
            const gradualIntensity = (clickCount - 1) * 0.15; 
            nameEl.style.setProperty('--intensity', gradualIntensity);
        }

        // 3. Trigger Auto-Pilot at 12 clicks
        if (clickCount >= 5) {
            startAutoGlitch();
        }
    });
});