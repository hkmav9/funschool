/* app.js - Core routing, home screen, settings */

(function () {
    var CATEGORY_LABELS = {
        'Math': '🔢 Math',
        'Science': '🔬 Science'
    };

    /* --- Screen Navigation --- */
    var isFirstLoad = true;

    function showScreen(screenId, direction) {
        var prev = document.querySelector('.screen.active');
        var next = document.getElementById(screenId);
        if (!next) return;

        // Skip animation on first load
        if (isFirstLoad) {
            isFirstLoad = false;
            if (prev) prev.classList.remove('active');
            next.classList.add('active');
            FunSchool.currentScreen = screenId;
            return;
        }

        var dir = direction || 'forward';

        if (prev && prev !== next) {
            prev.classList.add(dir === 'forward' ? 'exit-left' : 'exit-right');
            prev.classList.remove('active');
        }

        next.classList.remove('exit-left', 'exit-right');
        next.classList.add('active', dir === 'forward' ? 'enter-right' : 'enter-left');

        // Cleanup classes after animation
        setTimeout(function () {
            if (prev) prev.classList.remove('exit-left', 'exit-right');
            next.classList.remove('enter-right', 'enter-left');
        }, 300);

        FunSchool.currentScreen = screenId;
    }

    function goHome() {
        if (FunSchool.currentModule) {
            var mod = getModule(FunSchool.currentModule);
            if (mod && mod.cleanup) mod.cleanup();
            FunSchool.currentModule = null;
        }
        showScreen('homeScreen', 'back');
        renderHome();
    }

    function openModule(moduleId) {
        var mod = getModule(moduleId);
        if (!mod) return;

        FunSchool.currentModule = moduleId;
        document.getElementById('moduleTitle').textContent = mod.title;
        showScreen('moduleScreen', 'forward');

        var content = document.getElementById('moduleContent');
        content.innerHTML = '';
        mod.init(content);
    }

    function openSettings() {
        showScreen('settingsScreen', 'forward');
        renderSettings();
    }

    /* --- Avatar / Welcome Picture --- */
    var AVATAR_KEY = 'funschool_avatar';
    var ANIMALS = ['🦁', '🐻', '🐼', '🦊', '🐸', '🐵', '🦄', '🐯', '🐰', '🐙', '🦋', '🐢'];

    function getRandomAnimal() {
        return ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    }

    function setupAvatar() {
        var wrapper = document.getElementById('avatarWrapper');
        var input = document.getElementById('avatarInput');
        var img = document.getElementById('avatarImg');
        var defaultEl = document.getElementById('avatarDefault');
        var greetingSub = document.querySelector('.greeting-sub');

        // Load saved photo
        var saved = localStorage.getItem(AVATAR_KEY);
        if (saved) {
            img.src = saved;
            img.classList.add('visible');
            defaultEl.classList.add('hidden');
            wrapper.classList.add('has-photo');
            if (greetingSub) greetingSub.textContent = 'What do you want to learn?';
        } else {
            // Random fun animal each load
            defaultEl.textContent = getRandomAnimal();
        }

        // Tap to pick photo
        wrapper.addEventListener('click', function () {
            playTapSound();
            input.click();
        });

        // Handle file selection
        input.addEventListener('change', function () {
            var file = input.files && input.files[0];
            if (!file) return;

            // Resize and store as data URL
            var reader = new FileReader();
            reader.onload = function (e) {
                var tempImg = new Image();
                tempImg.onload = function () {
                    // Resize to 256px to save localStorage space
                    var canvas = document.createElement('canvas');
                    var size = 256;
                    canvas.width = size;
                    canvas.height = size;
                    var ctx = canvas.getContext('2d');

                    // Center crop
                    var sx = 0, sy = 0, sw = tempImg.width, sh = tempImg.height;
                    if (sw > sh) {
                        sx = (sw - sh) / 2;
                        sw = sh;
                    } else {
                        sy = (sh - sw) / 2;
                        sh = sw;
                    }

                    ctx.drawImage(tempImg, sx, sy, sw, sh, 0, 0, size, size);
                    var dataUrl = canvas.toDataURL('image/jpeg', 0.8);

                    // Save and display
                    localStorage.setItem(AVATAR_KEY, dataUrl);
                    img.src = dataUrl;
                    img.classList.add('visible', 'just-set');
                    defaultEl.classList.add('hidden');
                    wrapper.classList.add('has-photo');
                    if (greetingSub) greetingSub.textContent = 'What do you want to learn?';

                    // Celebrate the new photo!
                    showConfetti();
                    playCorrectSound();
                    setMascot('correct');

                    setTimeout(function () {
                        img.classList.remove('just-set');
                    }, 600);
                };
                tempImg.src = e.target.result;
            };
            reader.readAsDataURL(file);

            // Reset input so same file can be selected again
            input.value = '';
        });
    }

    /* --- Home Screen --- */
    function renderHome() {
        updateStarDisplay();
        var cardsEl = document.getElementById('moduleCards');
        if (!cardsEl) return;

        var html = '';
        var categories = getCategories();

        categories.forEach(function (cat) {
            html += '<div class="category-label">' + (CATEGORY_LABELS[cat] || cat) + '</div>';
            html += '<div class="module-grid">';

            getModulesByCategory(cat).forEach(function (mod) {
                var progress = mod.getProgress ? mod.getProgress() : { stars: 0 };
                var starDots = '';
                for (var i = 0; i < 5; i++) {
                    starDots += '<div class="star-dot' + (i < Math.min(progress.stars, 5) ? ' filled' : '') + '"></div>';
                }

                html += '<div class="module-card" data-module="' + mod.id + '" style="border-color:' + mod.color + '22">';
                html += '<span class="module-card-icon">' + mod.icon + '</span>';
                html += '<div class="module-card-title">' + mod.title + '</div>';
                if (progress.detail) {
                    html += '<div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:6px;">' + progress.detail + '</div>';
                }
                html += '<div class="module-card-stars">' + starDots + '</div>';
                html += '</div>';
            });

            html += '</div>';
        });

        cardsEl.innerHTML = html;

        cardsEl.querySelectorAll('.module-card').forEach(function (card) {
            card.addEventListener('click', function () {
                playTapSound();
                openModule(card.getAttribute('data-module'));
            });
        });
    }

    /* --- Settings --- */
    function renderSettings() {
        var settings = getSettings();

        // Sound toggle
        var soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.className = 'toggle' + (settings.soundEnabled ? ' on' : '');
        }

        // Progress cards
        var progressEl = document.getElementById('progressCards');
        if (progressEl) {
            var html = '';
            getAllModules().forEach(function (mod) {
                var p = mod.getProgress ? mod.getProgress() : { stars: 0 };
                html += '<div class="progress-card">';
                html += '<div class="progress-card-title">' + mod.icon + ' ' + mod.title + '</div>';
                html += '<div class="progress-card-detail">' + (p.stars || 0) + ' stars' + (p.detail ? ' • ' + p.detail : '') + '</div>';
                html += '</div>';
            });
            progressEl.innerHTML = html;
        }
    }

    /* --- Parent Gate (3-second hold) --- */
    var gearTimer = null;
    var GATE_DURATION = 3000;

    function setupParentGate() {
        var btn = document.getElementById('settingsBtn');
        if (!btn) return;

        function startHold(e) {
            e.preventDefault();
            btn.classList.add('holding');
            gearTimer = setTimeout(function () {
                btn.classList.remove('holding');
                playTapSound();
                openSettings();
            }, GATE_DURATION);
        }

        function endHold(e) {
            e.preventDefault();
            btn.classList.remove('holding');
            if (gearTimer) {
                clearTimeout(gearTimer);
                gearTimer = null;
            }
        }

        btn.addEventListener('touchstart', startHold, { passive: false });
        btn.addEventListener('touchend', endHold);
        btn.addEventListener('touchcancel', endHold);
        // Mouse fallback for desktop testing
        btn.addEventListener('mousedown', startHold);
        btn.addEventListener('mouseup', endHold);
        btn.addEventListener('mouseleave', endHold);
    }

    /* --- Event Listeners --- */
    function init() {
        // Back buttons
        document.getElementById('backBtn').addEventListener('click', function () {
            playTapSound();
            goHome();
        });

        document.getElementById('settingsBackBtn').addEventListener('click', function () {
            playTapSound();
            goHome();
        });

        // Sound toggle
        document.getElementById('soundToggle').addEventListener('click', function () {
            var settings = getSettings();
            var newVal = !settings.soundEnabled;
            updateSettings({ soundEnabled: newVal });
            this.className = 'toggle' + (newVal ? ' on' : '');
            if (newVal) playTapSound();
        });

        // Reset progress
        document.getElementById('resetBtn').addEventListener('click', function () {
            document.getElementById('confirmDialog').classList.add('active');
        });

        document.getElementById('confirmCancel').addEventListener('click', function () {
            document.getElementById('confirmDialog').classList.remove('active');
        });

        document.getElementById('confirmReset').addEventListener('click', function () {
            resetAllProgress();
            localStorage.removeItem(AVATAR_KEY);
            document.getElementById('confirmDialog').classList.remove('active');
            renderSettings();
            updateStarDisplay();
            // Reset avatar display
            var img = document.getElementById('avatarImg');
            var defaultEl = document.getElementById('avatarDefault');
            var wrapper = document.getElementById('avatarWrapper');
            var greetingSub = document.querySelector('.greeting-sub');
            if (img) { img.classList.remove('visible'); img.src = ''; }
            if (defaultEl) { defaultEl.classList.remove('hidden'); defaultEl.textContent = getRandomAnimal(); }
            if (wrapper) wrapper.classList.remove('has-photo');
            if (greetingSub) greetingSub.textContent = 'Tap your picture to make it you!';
        });

        // Initialize audio context on first interaction
        document.addEventListener('touchstart', initAudioOnInteraction, { once: true });
        document.addEventListener('click', initAudioOnInteraction, { once: true });

        // Parent gate
        setupParentGate();

        // Avatar
        setupAvatar();

        // Render home
        renderHome();
    }

    // Start the app
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
