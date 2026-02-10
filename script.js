// ============================================
// Valentine's Day — Premium Interactive Experience
// For Charné 💕
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initEnvelope();
    initQuestion();
});

// ============================================
// PARTICLE SYSTEM (Canvas-based hearts & sparkles)
// ============================================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Track mouse for interactive glow
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 20;
            this.size = 1 + Math.random() * 3;
            this.speedY = -(0.3 + Math.random() * 0.8);
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.opacity = 0;
            this.maxOpacity = 0.2 + Math.random() * 0.5;
            this.fadeIn = true;
            this.life = 0;
            this.maxLife = 400 + Math.random() * 400;
            this.hue = 340 + Math.random() * 30; // pink-red range
            this.isHeart = Math.random() > 0.85;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.02;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = 0.01 + Math.random() * 0.02;
        }

        update() {
            this.life++;
            this.wobble += this.wobbleSpeed;
            this.x += this.speedX + Math.sin(this.wobble) * 0.3;
            this.y += this.speedY;
            this.rotation += this.rotSpeed;

            // Fade in/out
            if (this.life < 60) {
                this.opacity = (this.life / 60) * this.maxOpacity;
            } else if (this.life > this.maxLife - 80) {
                this.opacity = ((this.maxLife - this.life) / 80) * this.maxOpacity;
            }

            // Mouse interaction — particles glow near cursor
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                this.opacity = Math.min(this.maxOpacity * 2, 1);
                this.size += 0.02;
            }

            if (this.life >= this.maxLife || this.y < -20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);

            if (this.isHeart) {
                // Draw tiny heart
                ctx.fillStyle = `hsl(${this.hue}, 80%, 65%)`;
                ctx.beginPath();
                const s = this.size * 2;
                ctx.moveTo(0, s * 0.3);
                ctx.bezierCurveTo(-s, -s * 0.3, -s * 0.5, -s, 0, -s * 0.4);
                ctx.bezierCurveTo(s * 0.5, -s, s, -s * 0.3, 0, s * 0.3);
                ctx.fill();
            } else {
                // Draw glowing dot
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 2);
                gradient.addColorStop(0, `hsla(${this.hue}, 80%, 70%, 1)`);
                gradient.addColorStop(0.5, `hsla(${this.hue}, 80%, 60%, 0.3)`);
                gradient.addColorStop(1, `hsla(${this.hue}, 80%, 60%, 0)`);
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(0, 0, this.size * 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }
    }

    // Create particles
    for (let i = 0; i < 80; i++) {
        const p = new Particle();
        p.y = Math.random() * canvas.height; // Spread initial positions
        p.life = Math.random() * p.maxLife;
        particles.push(p);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw mouse glow
        if (mouse.x > 0 && mouse.y > 0) {
            const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120);
            glow.addColorStop(0, 'rgba(231, 76, 111, 0.06)');
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2);
            ctx.fill();
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// ============================================
// SCREEN TRANSITIONS
// ============================================
function switchScreen(currentId, nextId, callback) {
    const current = document.getElementById(currentId);
    const next = document.getElementById(nextId);

    current.style.opacity = '0';
    setTimeout(() => {
        current.classList.remove('active');
        current.style.visibility = 'hidden';
        next.classList.add('active');
        next.style.opacity = '1';
        next.style.visibility = 'visible';
        if (callback) callback();
    }, 1200);
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

        setTimeout(() => {
            switchScreen('screen-envelope', 'screen-story', () => {
                initStoryScroll();
            });
        }, 2200);
    });
}

// ============================================
// SCREEN 2: STORY SCROLL
// ============================================
function initStoryScroll() {
    const scrollContainer = document.getElementById('storyScroll');
    const sections = document.querySelectorAll('.photo-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        root: scrollContainer
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Continue button
    const continueBtn = document.getElementById('continueBtn');
    continueBtn.addEventListener('click', () => {
        switchScreen('screen-story', 'screen-question');
    });

    // Parallax effect on photo cards
    scrollContainer.addEventListener('scroll', () => {
        const scrollTop = scrollContainer.scrollTop;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const centerOffset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
            const img = section.querySelector('img');
            if (img && Math.abs(centerOffset) < 1) {
                img.style.transform = `scale(${1 + Math.abs(centerOffset) * 0.05}) translateY(${centerOffset * -20}px)`;
            }
        });
    });
}

// ============================================
// SCREEN 3: THE QUESTION
// ============================================
function initQuestion() {
    const btnYes = document.getElementById('btnYes');
    const btnNo = document.getElementById('btnNo');

    btnYes.addEventListener('click', () => {
        // Immediate confetti burst
        launchConfetti();

        setTimeout(() => {
            switchScreen('screen-question', 'screen-celebration', () => {
                // Multi-wave celebration confetti
                launchConfetti();
                setTimeout(() => launchConfetti(), 1200);
                setTimeout(() => launchConfetti(), 2400);
                setTimeout(() => launchConfetti(), 4000);
            });
        }, 1000);
    });

    // The "No" button — dodges the cursor!
    let noCount = 0;
    const noMessages = [
        "Are you sure? 🥺",
        "Really?? 😭",
        "Think again! 💕",
        "You can't! 🌹",
        "C'mon Charné! 💖",
        "Pretty please? 🥹",
        "Not an option! 😤",
        "Nope, try Yes! 💗",
    ];

    function moveNoButton() {
        const margin = 100;
        const x = margin + Math.random() * (window.innerWidth - margin * 2 - 150);
        const y = margin + Math.random() * (window.innerHeight - margin * 2 - 60);
        btnNo.style.position = 'fixed';
        btnNo.style.left = x + 'px';
        btnNo.style.top = y + 'px';
        btnNo.style.zIndex = '1000';
        btnNo.style.transition = 'left 0.15s ease, top 0.15s ease';
        btnNo.textContent = noMessages[noCount % noMessages.length];
        noCount++;
    }

    btnNo.addEventListener('mouseover', moveNoButton);
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    });

    btnNo.addEventListener('click', (e) => {
        e.preventDefault();
        moveNoButton();
    });
}

// ============================================
// CONFETTI SYSTEM
// ============================================
function launchConfetti() {
    const container = document.getElementById('confettiCelebrate') || document.body;
    const colors = ['#e74c6f', '#f8a4b8', '#d4a844', '#ff6b8a', '#ffd700', '#ff1493', '#ffffff', '#ff69b4', '#c0263d'];
    const emojis = ['❤️', '💕', '💖', '🌹', '✨', '💗', '🎉', '💘', '🥂', '💐', '🤍'];

    for (let i = 0; i < 100; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';

        const isEmoji = Math.random() > 0.6;
        if (isEmoji) {
            piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            piece.style.fontSize = (14 + Math.random() * 24) + 'px';
        } else {
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            const shapes = ['50%', '3px', '0'];
            piece.style.borderRadius = shapes[Math.floor(Math.random() * shapes.length)];
            piece.style.width = (5 + Math.random() * 12) + 'px';
            piece.style.height = (5 + Math.random() * 12) + 'px';
        }

        piece.style.left = Math.random() * 100 + '%';
        piece.style.animationDuration = (2.5 + Math.random() * 3.5) + 's';
        piece.style.animationDelay = Math.random() * 1.5 + 's';

        container.appendChild(piece);
        setTimeout(() => piece.remove(), 7000);
    }
}
