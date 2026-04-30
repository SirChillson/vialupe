document.addEventListener('DOMContentLoaded', () => {
    const nameEl = document.getElementById('name-glitch');
    
    if (!nameEl) {
        console.error("Identity Script: Could not find element with ID 'name-glitch'. Check your HTML!");
        return;
    }

    console.log("Identity Script: Found the name! Ready for clicks.");

    const names = ["William", "Will", "Bill", "Billy", "Liam", "W.", "...", " "];
    let nameIndex = 0;
    let clickCount = 0;
    let lastClickTime = 0;
    let isDead = false;

    nameEl.addEventListener('click', () => {
        console.log("Name clicked! Current count:", clickCount + 1);
        
        if (isDead) return;

        const now = Date.now();
        const isFast = (now - lastClickTime) < 400;
        lastClickTime = now;
        clickCount++;

        nameIndex = (nameIndex + 1) % names.length;
        nameEl.innerText = names[nameIndex];

        if (clickCount > 8 || (clickCount > 4 && isFast)) {
            nameEl.classList.add('haywire');
        }

        if (clickCount > 15) {
            isDead = true;
            nameEl.classList.remove('haywire');
            nameEl.classList.add('falling');

            setTimeout(() => {
                nameEl.innerText = "Mr. Nobody";
                nameEl.classList.remove('falling');
                nameEl.style.transform = "translateY(0)";
                nameEl.style.opacity = "1";
                nameEl.style.color = "var(--hover)";
                console.log("Identity Script: Transformation to Mr. Nobody complete.");
            }, 1000);
        }
    });
});