/* rewards.js - Confetti, stars, mascot reactions */

const CONFETTI_COLORS = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#A29BFE', '#55EFC4', '#FD79A8', '#FDCB6E'];

function showConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;

    for (let i = 0; i < 40; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.backgroundColor = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        piece.style.animationDelay = Math.random() * 0.4 + 's';
        piece.style.animationDuration = (1.2 + Math.random() * 0.8) + 's';
        piece.style.width = (6 + Math.random() * 8) + 'px';
        piece.style.height = (6 + Math.random() * 8) + 'px';
        if (Math.random() > 0.5) piece.style.borderRadius = '50%';
        container.appendChild(piece);
    }

    setTimeout(function () {
        container.innerHTML = '';
    }, 2500);
}

function updateStarDisplay() {
    var total = getTotalStars();
    var counters = document.querySelectorAll('.star-count');
    counters.forEach(function (el) {
        el.textContent = total;
    });
}

function animateStarCounter() {
    var counters = document.querySelectorAll('.star-counter');
    counters.forEach(function (el) {
        el.classList.remove('pulse');
        void el.offsetWidth; // reflow
        el.classList.add('pulse');
    });
    setTimeout(function () {
        counters.forEach(function (el) { el.classList.remove('pulse'); });
    }, 500);
}

function awardStar() {
    addStars(1);
    updateStarDisplay();
    animateStarCounter();
    playStarSound();
}

/* Mascot states */
var MASCOT_STATES = {
    thinking: { emoji: '\u{1F914}', message: '' },
    correct: { emoji: '\u{1F389}', message: 'Great job!' },
    encourage: { emoji: '\u{1F917}', message: 'Try again!' },
    levelup: { emoji: '\u{1F31F}', message: 'Level up!' },
    wave: { emoji: '\u{1F44B}', message: '' },
    explore: { emoji: '\u{1F60D}', message: 'Wow, cool!' }
};

function setMascot(state) {
    var mascot = document.getElementById('mascot');
    if (!mascot) return;

    var info = MASCOT_STATES[state] || MASCOT_STATES.thinking;
    var emojiEl = mascot.querySelector('.mascot-emoji');
    var msgEl = mascot.querySelector('.mascot-message');

    if (emojiEl) emojiEl.textContent = info.emoji;
    if (msgEl) msgEl.textContent = info.message;

    mascot.className = 'mascot';
    void mascot.offsetWidth; // reflow for re-triggering animation

    if (state === 'correct') mascot.classList.add('celebrate');
    else if (state === 'encourage') mascot.classList.add('encourage');
    else if (state === 'levelup') mascot.classList.add('levelup');
}

function handleCorrectAnswer() {
    showConfetti();
    playCorrectSound();
    hapticSuccess();
    awardStar();
    setMascot('correct');
}

function handleWrongAnswer() {
    playWrongSound();
    hapticError();
    setMascot('encourage');
}
