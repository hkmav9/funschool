/* app.js - Core routing, home screen, settings */

(function () {
    var CATEGORY_LABELS = {
        'Math': '🔢 Math',
        'Science': '🔬 Science',
        'Thinking': '🧠 Thinking',
        'Geography': '🗺️ Geography',
        'Creativity': '🎨 Creativity',
        'Story Time': '📖 Story Time'
    };

    // Parent-level subject tiles: icon, display name, colour
    var CATEGORY_META = {
        'Math':            { icon: '🔢', name: 'Math',            color: '#FF6B6B' },
        'Words':           { icon: '🔤', name: 'Words',           color: '#FF9F43' },
        'Science':         { icon: '🔬', name: 'Science',         color: '#00B894' },
        'Geography':       { icon: '🗺️', name: 'Geography',       color: '#0984E3' },
        'Thinking':        { icon: '🧠', name: 'Thinking',        color: '#A29BFE' },
        'Problem-Solving': { icon: '🧩', name: 'Problem-Solving', color: '#E17055' },
        'Creativity':      { icon: '🎨', name: 'Creativity',      color: '#A855F7' },
        'Story Time':      { icon: '📖', name: 'Story Time',      color: '#F9A825' }
    };
    var homeCategory = null; // null = subject tiles, otherwise the open subject

    /* --- Reset dialog (all progress, or one module) --- */
    var resetTarget = null;

    function openResetDialog(moduleId) {
        resetTarget = moduleId || null;
        var titleEl = document.querySelector('#confirmDialog .confirm-title');
        var textEl = document.querySelector('#confirmDialog .confirm-text');
        var mod = resetTarget ? getModule(resetTarget) : null;
        if (mod) {
            titleEl.textContent = 'Reset ' + mod.icon + ' ' + mod.title + '?';
            textEl.textContent = 'Type the 4-digit passcode to erase stars and progress for this module only.';
        } else {
            titleEl.textContent = 'Enter Passcode to Reset';
            textEl.textContent = 'Type the 4-digit passcode to erase all stars and progress.';
        }
        document.querySelectorAll('#passcodeDots .passcode-dot').forEach(function (d) { d.classList.remove('filled'); });
        var err = document.getElementById('passcodeError');
        if (err) err.classList.remove('visible');
        document.getElementById('confirmDialog').classList.add('active');
    }

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
    function categoryMeta(cat) {
        return CATEGORY_META[cat] || { icon: '⭐', name: cat, color: '#74B9FF' };
    }

    function renderHome() {
        updateStarDisplay();
        var cardsEl = document.getElementById('moduleCards');
        if (!cardsEl) return;

        // If the open subject no longer exists, fall back to the tiles
        if (homeCategory && getModulesByCategory(homeCategory).length === 0) homeCategory = null;

        var html = '';

        if (!homeCategory) {
            // Parent layer: one tile per subject
            html += '<div class="subject-grid">';
            getCategories().forEach(function (cat) {
                var meta = categoryMeta(cat);
                var mods = getModulesByCategory(cat);
                var stars = 0;
                mods.forEach(function (m) {
                    var p = m.getProgress ? m.getProgress() : { stars: 0 };
                    stars += p.stars || 0;
                });
                html += '<button class="subject-tile" data-category="' + cat + '" style="--sc:' + meta.color + '">';
                html += '<span class="subject-tile-icon">' + meta.icon + '</span>';
                html += '<span class="subject-tile-name">' + meta.name + '</span>';
                html += '<span class="subject-tile-meta">' + mods.length + (mods.length === 1 ? ' activity' : ' activities') + '</span>';
                html += '<span class="subject-tile-stars">⭐ ' + stars + '</span>';
                html += '</button>';
            });
            html += '</div>';
        } else {
            // Subject view: its activities
            var meta = categoryMeta(homeCategory);
            html += '<div class="subject-header" style="--sc:' + meta.color + '">';
            html += '<button class="subject-back" id="subjectBack" aria-label="Back to subjects">&#8592;</button>';
            html += '<span class="subject-header-icon">' + meta.icon + '</span>';
            html += '<span class="subject-header-name">' + meta.name + '</span>';
            html += '</div>';
            html += '<div class="module-grid">';

            getModulesByCategory(homeCategory).forEach(function (mod) {
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
        }

        cardsEl.innerHTML = html;
        window.scrollTo(0, 0);

        cardsEl.querySelectorAll('.subject-tile').forEach(function (tile) {
            tile.addEventListener('click', function () {
                playTapSound();
                homeCategory = tile.getAttribute('data-category');
                renderHome();
            });
        });

        var back = document.getElementById('subjectBack');
        if (back) {
            back.addEventListener('click', function () {
                playTapSound();
                homeCategory = null;
                renderHome();
            });
        }

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
                html += '<div class="progress-card-info">';
                html += '<div class="progress-card-title">' + mod.icon + ' ' + mod.title + '</div>';
                html += '<div class="progress-card-detail">' + (p.stars || 0) + ' stars' + (p.detail ? ' • ' + p.detail : '') + '</div>';
                html += '</div>';
                html += '<button class="module-reset-btn" data-reset="' + mod.id + '" aria-label="Reset ' + mod.title + '">↺ Reset</button>';
                html += '</div>';
            });
            progressEl.innerHTML = html;

            progressEl.querySelectorAll('.module-reset-btn').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    playTapSound();
                    openResetDialog(btn.getAttribute('data-reset'));
                });
            });
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

        // Reset progress with passcode
        var PASSCODE = '2709';
        var passcodeInput = '';

        function resetPasscodeUI() {
            passcodeInput = '';
            var dots = document.querySelectorAll('#passcodeDots .passcode-dot');
            dots.forEach(function (d) { d.classList.remove('filled'); });
            var err = document.getElementById('passcodeError');
            if (err) err.classList.remove('visible');
        }

        function closePasscodeDialog() {
            document.getElementById('confirmDialog').classList.remove('active');
            resetPasscodeUI();
        }

        function executeReset() {
            if (resetTarget) {
                resetModuleProgress(resetTarget);
                resetTarget = null;
                closePasscodeDialog();
                renderSettings();
                updateStarDisplay();
                showConfetti();
                return;
            }
            resetAllProgress();
            localStorage.removeItem(AVATAR_KEY);
            closePasscodeDialog();
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
        }

        function onPasscodeKey(key) {
            if (passcodeInput.length >= 4) return;
            passcodeInput += key;

            // Fill dots
            var dots = document.querySelectorAll('#passcodeDots .passcode-dot');
            dots.forEach(function (d, i) {
                d.classList.toggle('filled', i < passcodeInput.length);
            });

            playTapSound();

            // Check when 4 digits entered
            if (passcodeInput.length === 4) {
                setTimeout(function () {
                    if (passcodeInput === PASSCODE) {
                        executeReset();
                    } else {
                        var err = document.getElementById('passcodeError');
                        if (err) err.classList.add('visible');
                        // Clear after shake
                        setTimeout(function () {
                            resetPasscodeUI();
                        }, 800);
                    }
                }, 200);
            }
        }

        function onPasscodeDelete() {
            if (passcodeInput.length === 0) return;
            passcodeInput = passcodeInput.slice(0, -1);
            var dots = document.querySelectorAll('#passcodeDots .passcode-dot');
            dots.forEach(function (d, i) {
                d.classList.toggle('filled', i < passcodeInput.length);
            });
            var err = document.getElementById('passcodeError');
            if (err) err.classList.remove('visible');
        }

        document.getElementById('resetBtn').addEventListener('click', function () {
            openResetDialog(null);
        });

        document.getElementById('confirmCancel').addEventListener('click', function () {
            resetTarget = null;
            closePasscodeDialog();
        });

        document.getElementById('passcodeDelete').addEventListener('click', function () {
            onPasscodeDelete();
        });

        // Number key listeners
        document.querySelectorAll('#passcodePad .passcode-key[data-key]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                onPasscodeKey(btn.getAttribute('data-key'));
            });
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
