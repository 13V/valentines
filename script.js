// ============================================
// Valentine's Day Interactive Experience
// For Charné 💕
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();
    createSparkles();
    initEnvelope();
    initTimeline();
    initQuestion();
});

// ============================================
// FLOATING HEARTS BACKGROUND
// ============================================
function createFloatingHearts() {
    const container = document.getElementById('heartsBg');
    const hearts = ['💕', '💗', '💖', '❤️', '🤍', '💘', '✨', '🌸'];

    function addHeart() {
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (12 + Math.random() * 20) + 'px';
        heart.style.animationDuration = (8 + Math.random() * 12) + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(heart);

        setTimeout(() => heart.remove(), 22000);
    }

    // Initial burst
    for (let i = 0; i < 15; i++) {
        setTimeout(addHeart, i * 300);
    }

    // Continuous hearts
    setInterval(addHeart, 1500);
}

// ============================================
// SPARKLES
// ============================================
function createSparkles() {
    const field = document.getElementById('sparkleField');
    if (!field) return;

    for (let i = 0; i < 30; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 2 + 's';
        sparkle.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
        field.appendChild(sparkle);
    }
}

// ============================================
// SCREEN TRANSITIONS
// ============================================
function switchScreen(currentId, nextId) {
    const current = document.getElementById(currentId);
    const next = document.getElementById(nextId);

    current.style.opacity = '0';
    setTimeout(() => {
        current.classList.remove('active');
        current.style.visibility = 'hidden';
        next.classList.add('active');
        next.style.opacity = '1';
        next.style.visibility = 'visible';
    }, 1000);
}

// ============================================
// SCREEN 1: ENVELOPE
// ============================================
function initEnvelope() {
    const envelope = document.getElementById('envelope');
    let opened = false;

    envelope.addEventListener('click', () => {
        if (opened) return;
        opened = true;

        envelope.classList.add('opened');

        // Transition to story after animation
        setTimeout(() => {
            switchScreen('screen-envelope', 'screen-story');
            // Start observing timeline items after transition
            setTimeout(observeTimeline, 500);
        }, 2000);
    });
}

// ============================================
// SCREEN 2: TIMELINE
// ============================================
function initTimeline() {
    // Timeline items will be observed when the screen becomes active
}

function observeTimeline() {
    const items = document.querySelectorAll('.timeline-item');

    // Make first few visible immediately with staggered delay
    items.forEach((item, index) => {
        if (index < 2) {
            setTimeout(() => {
                item.classList.add('visible');
            }, 300 + (index * 400));
        }
    });

    // Observe the rest with IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        root: document.getElementById('screen-story')
    });

    items.forEach((item, index) => {
        if (index >= 2) {
            observer.observe(item);
        }
    });

    // Continue button
    const continueBtn = document.getElementById('continueBtn');
    continueBtn.addEventListener('click', () => {
        switchScreen('screen-story', 'screen-question');
    });
}

// ============================================
// SCREEN 3: THE QUESTION
// ============================================
function initQuestion() {
    const btnYes = document.getElementById('btnYes');
    const btnNo = document.getElementById('btnNo');

    btnYes.addEventListener('click', () => {
        launchConfetti('confetti');
        setTimeout(() => {
            switchScreen('screen-question', 'screen-celebration');
            setTimeout(() => launchConfetti('confettiCelebrate'), 500);
            setTimeout(() => launchConfetti('confettiCelebrate'), 1500);
            setTimeout(() => launchConfetti('confettiCelebrate'), 3000);
        }, 800);
    });

    // The "No" button runs away!
    let noClickCount = 0;
    const noMessages = [
        "Are you sure? 🥺",
        "Really?? 😭",
        "Try again! 💕",
        "You can't say no! 🌹",
        "C'mon Charné! 💖",
        "Pretty please? 🥹",
    ];

    btnNo.addEventListener('mouseover', () => {
        const x = Math.random() * (window.innerWidth - 200);
        const y = Math.random() * (window.innerHeight - 100);
        btnNo.style.position = 'fixed';
        btnNo.style.left = x + 'px';
        btnNo.style.top = y + 'px';
        btnNo.style.zIndex = '1000';
        btnNo.textContent = noMessages[noClickCount % noMessages.length];
        noClickCount++;
    });

    btnNo.addEventListener('click', () => {
        btnNo.textContent = "Nice try! Click Yes! 💕";
        const x = Math.random() * (window.innerWidth - 200);
        const y = Math.random() * (window.innerHeight - 100);
        btnNo.style.left = x + 'px';
        btnNo.style.top = y + 'px';
    });
}

// ============================================
// CONFETTI
// ============================================
function launchConfetti(containerId) {
    const container = document.getElementById(containerId);
    const colors = ['#e74c6f', '#f8a4b8', '#d4a844', '#ff6b8a', '#ffd700', '#ff1493', '#ffffff', '#ff69b4'];
    const shapes = ['❤️', '💕', '💖', '🌹', '✨', '💗', '🎉', '💘'];

    for (let i = 0; i < 80; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';

        const isEmoji = Math.random() > 0.5;
        if (isEmoji) {
            piece.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            piece.style.fontSize = (14 + Math.random() * 20) + 'px';
        } else {
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            piece.style.width = (6 + Math.random() * 10) + 'px';
            piece.style.height = (6 + Math.random() * 10) + 'px';
        }

        piece.style.left = Math.random() * 100 + '%';
        piece.style.animationDuration = (2 + Math.random() * 3) + 's';
        piece.style.animationDelay = Math.random() * 1 + 's';

        container.appendChild(piece);

        setTimeout(() => piece.remove(), 6000);
    }
}
