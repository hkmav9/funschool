/* sounds.js - Web Audio API sound effects */

let _audioCtx = null;

function getAudioContext() {
    if (!_audioCtx) {
        _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (_audioCtx.state === 'suspended') {
        _audioCtx.resume();
    }
    return _audioCtx;
}

function initAudioOnInteraction() {
    getAudioContext();
}

function isSoundEnabled() {
    return getSettings().soundEnabled;
}

function playTone(frequency, duration, type, delay) {
    if (!isSoundEnabled()) return;
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type || 'sine';
        osc.frequency.value = frequency;
        const startTime = ctx.currentTime + (delay || 0);
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
    } catch (e) {
        // Silently fail if audio not available
    }
}

function playCorrectSound() {
    playTone(523, 0.15, 'sine', 0);
    playTone(659, 0.25, 'sine', 0.12);
}

function playWrongSound() {
    playTone(280, 0.25, 'triangle', 0);
}

function playLevelUpSound() {
    playTone(523, 0.15, 'sine', 0);
    playTone(659, 0.15, 'sine', 0.12);
    playTone(784, 0.15, 'sine', 0.24);
    playTone(1047, 0.3, 'sine', 0.36);
}

function playTapSound() {
    playTone(800, 0.04, 'sine', 0);
    haptic('light');
}

/* Haptic feedback (iOS Safari) */
function haptic(style) {
    try {
        if (navigator.vibrate) {
            var ms = style === 'heavy' ? 30 : style === 'medium' ? 15 : 8;
            navigator.vibrate(ms);
        }
    } catch (e) {}
}

function hapticSuccess() { haptic('medium'); }
function hapticError() { haptic('heavy'); }

function playStarSound() {
    playTone(1200, 0.08, 'sine', 0);
    playTone(1500, 0.12, 'sine', 0.06);
}
