/* newton.js – Newton's Laws of Motion */

(function () {

    /* ── Law Data ─────────────────────────────────────────────────── */

    var LAWS = [
        {
            id: 'law1',
            number: 1,
            badge: '1st',
            name: 'The Lazy Law',
            subtitle: 'Things keep doing what they\'re already doing!',
            icon: '🍎',
            color: '#E84393',
            realName: 'Law of Inertia',
            story: 'One quiet afternoon, Isaac Newton was resting under an apple tree — BONK! An apple landed right on his head. Instead of just saying "ouch," Newton wondered: why does everything fall DOWN? This big question led him to his First Law. It says: a resting object wants to STAY resting, and a moving object wants to KEEP moving — forever! That sleeping apple was perfectly happy on its branch. But once it let go, nothing could stop it until it found Newton\'s head! In space, with no friction, a ball thrown will travel forever without ever slowing down.',
            facts: [
                { icon: '😴', text: 'A resting object is "lazy" — it won\'t budge unless pushed!' },
                { icon: '🚀', text: 'In space there\'s no friction — tools float away forever once let go!' },
                { icon: '🚗', text: 'Seatbelts save your life because your body wants to keep going forward in a crash!' },
                { icon: '🏒', text: 'Hockey pucks slide huge distances on ice because there\'s almost zero friction!' }
            ],
            demoType: 'inertia'
        },
        {
            id: 'law2',
            number: 2,
            badge: '2nd',
            name: 'The Push Law',
            subtitle: 'Bigger push = faster! Heavier object = slower!',
            icon: '💪',
            color: '#F9A825',
            realName: 'Force = Mass × Acceleration',
            story: 'After the Lazy Law, Newton asked: what actually happens when you DO push something? He discovered two things. First: the harder you push, the faster the object speeds up (accelerates). Second: the heavier the object, the harder it is to move! Push an empty shopping cart — easy! Now push one overflowing with groceries — much harder for the same speed! Newton summed this up in the most famous formula in science: Force = Mass × Acceleration (F = m × a). Engineers use this every single day to design rockets, bridges, and racing cars!',
            facts: [
                { icon: '🛒', text: 'An empty cart is easy to push — a full one needs way more force!' },
                { icon: '⚽', text: 'Kick a ball hard and it flies fast. A gentle tap — it rolls slow!' },
                { icon: '🚀', text: 'Rockets burn massive fuel to accelerate their huge mass into orbit!' },
                { icon: '⚖️', text: 'F = m × a is used by every engineer and physicist on the planet!' }
            ],
            demoType: 'force'
        },
        {
            id: 'law3',
            number: 3,
            badge: '3rd',
            name: 'The Bounce-Back Law',
            subtitle: 'Every push gets an equal push right back!',
            icon: '🚀',
            color: '#00B894',
            realName: 'Action & Reaction',
            story: 'Newton\'s Third Law is everywhere you look! When you push something, it pushes back on YOU just as hard. Jump off the ground — your feet push DOWN, and the ground pushes you UP into the air. A rocket blasts hot fire DOWN and the rocket flies UP into space. Even swimming uses this law — your arms push water BACKWARD and you glide FORWARD. Newton realised forces always come in matched pairs! The amazing part? Rockets work in empty space because they don\'t push against air — they push their own exhaust gases, and the exhaust pushes the rocket back!',
            facts: [
                { icon: '🤸', text: 'When you jump, you push the Earth down! (The Earth barely moves — it\'s enormous!)' },
                { icon: '🏊', text: 'Swimmers push water backward with each stroke to move forward!' },
                { icon: '🎈', text: 'Let go of a balloon — air shoots one way, balloon flies the other!' },
                { icon: '🚀', text: 'Rocket engines work in the vacuum of space — no air needed!' }
            ],
            demoType: 'reaction'
        }
    ];

    /* ── Quiz Questions (3 per law = 9 total) ───────────────────── */

    var ALL_QUIZ_Q = [
        { scenario: '🏒  A hockey puck keeps sliding across smooth ice for a very long time without stopping', lawNum: 1, hint: 'It wants to keep moving — nothing stops it!' },
        { scenario: '🚗  The car stops suddenly and your drink flies forward and spills all over you!', lawNum: 1, hint: 'Your drink wanted to keep moving forward!' },
        { scenario: '🪨  A big boulder has been sitting in a field for 100 years and has never moved once', lawNum: 1, hint: 'It just wants to stay still!' },
        { scenario: '⚽  You kick a soccer ball really HARD and it zooms way faster than a gentle tap', lawNum: 2, hint: 'More force → more acceleration!' },
        { scenario: '🏋️  It\'s easy to push a toy car but almost impossible to push a real car by hand', lawNum: 2, hint: 'More mass needs much more force!' },
        { scenario: '🚀  A rocket needs enormous engines just to lift its huge heavy body off the ground', lawNum: 2, hint: 'F = m × a — more mass, more force needed!' },
        { scenario: '🎈  You let go of a balloon — air shoots out one side and the balloon flies the other way!', lawNum: 3, hint: 'Action: air shoots out. Reaction: balloon flies!' },
        { scenario: '🤸  To jump up into the air, you first push your feet DOWN against the ground', lawNum: 3, hint: 'Push the Earth down → Earth pushes you up!' },
        { scenario: '🚣  A canoe moves forward when the paddler pushes the oar backward through the water', lawNum: 3, hint: 'Push water one way → you move the other!' }
    ];

    var QUIZ_TOTAL = 9;
    var container    = null;
    var currentMode  = 'explore';
    var quizQuestions = [];
    var quizIndex    = 0;
    var quizCorrect  = 0;
    var quizAnswered = false;

    /* ── Helpers ─────────────────────────────────────────────────── */

    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    function updateModuleStarDisplay() {
        var data = getModuleData('newton-laws');
        var el = document.querySelector('#moduleStars .star-count');
        if (el) el.textContent = data.stars || 0;
    }

    /* ── Render Root ─────────────────────────────────────────────── */

    function render() {
        if (!container) return;

        var html = '<div class="mode-tabs">';
        html += '<button class="mode-tab' + (currentMode === 'explore' ? ' active' : '') + '" data-mode="explore">📖 Explore</button>';
        html += '<button class="mode-tab' + (currentMode === 'quiz'    ? ' active' : '') + '" data-mode="quiz">🧪 Quiz</button>';
        html += '</div>';
        html += '<div id="newtonContent"></div>';

        container.innerHTML = html;

        container.querySelectorAll('.mode-tab').forEach(function (tab) {
            tab.addEventListener('click', function () {
                var m = tab.getAttribute('data-mode');
                if (m !== currentMode) {
                    currentMode = m;
                    if (m === 'quiz') startQuizRound();
                    playTapSound();
                    render();
                }
            });
        });

        var content = container.querySelector('#newtonContent');
        if (currentMode === 'explore') renderExplore(content);
        else renderQuiz(content);
        updateModuleStarDisplay();
    }

    /* ── Explore Mode ────────────────────────────────────────────── */

    function renderExplore(el) {
        var data    = getModuleData('newton-laws');
        var explored = data.explored || [];
        var pct     = Math.min((explored.length / LAWS.length) * 100, 100);

        /* progress bar */
        var html = '<div class="explore-progress">';
        html += '<div class="explore-progress-header"><span>Laws Discovered</span><span>' + explored.length + '/' + LAWS.length + '</span></div>';
        html += '<div class="math-progress-bar"><div class="math-progress-fill explore-fill" style="width:' + pct + '%"></div></div>';
        if (explored.length === LAWS.length) {
            html += '<div class="explore-complete">All laws discovered! You\'re a physicist! 🔬</div>';
        }
        html += '</div>';

        /* Newton illustration banner */
        html += '<div class="nw-scene-banner">';
        html += '<div class="nw-banner-tree">🌳</div>';
        html += '<div class="nw-banner-content">';
        html += '<div class="nw-banner-name">Isaac Newton</div>';
        html += '<div class="nw-banner-dates">Mathematician · Physicist · 1643–1727</div>';
        html += '<div class="nw-banner-quote">"What we know is a drop, what we don\'t know is an ocean."</div>';
        html += '</div>';
        html += '<div class="nw-banner-scientist">👨‍🔬</div>';
        html += '<div class="nw-banner-apple">🍎</div>';
        html += '</div>';

        html += '<div class="nw-tap-hint">Tap a law card to discover it and try the interactive demo!</div>';

        /* Law cards */
        html += '<div class="nw-law-list">';
        LAWS.forEach(function (law) {
            var done = explored.indexOf(law.id) !== -1;
            html += '<div class="nw-law-card' + (done ? ' nw-explored' : '') + '" data-id="' + law.id + '">';
            html += '<div class="nw-law-accent" style="background:' + law.color + '"></div>';
            html += '<div class="nw-law-inner">';
            html += '  <div class="nw-law-icon-wrap" style="background:' + law.color + '22;border:2px solid ' + law.color + '44">' + law.icon + '</div>';
            html += '  <div class="nw-law-text">';
            html += '    <div class="nw-law-badge" style="background:' + law.color + '">' + law.badge + ' Law</div>';
            html += '    <div class="nw-law-title">' + law.name + '</div>';
            html += '    <div class="nw-law-sub">' + law.subtitle + '</div>';
            html += '    <div class="nw-law-formula">' + law.realName + '</div>';
            html += '  </div>';
            html += '  <div class="nw-law-chevron">' + (done ? '✅' : '›') + '</div>';
            html += '</div></div>';
        });
        html += '</div>';

        el.innerHTML = html;

        el.querySelectorAll('.nw-law-card').forEach(function (card) {
            card.addEventListener('click', function () {
                playTapSound();
                openLawSheet(card.getAttribute('data-id'));
            });
        });
    }

    /* ── Bottom Sheet ────────────────────────────────────────────── */

    function openLawSheet(lawId) {
        var law = LAWS.find(function (l) { return l.id === lawId; });
        if (!law) return;

        /* mark explored + award star */
        var data     = getModuleData('newton-laws');
        var explored = data.explored || [];
        var isNew    = explored.indexOf(law.id) === -1;
        if (isNew) {
            explored.push(law.id);
            updateModuleData('newton-laws', { explored: explored, stars: (data.stars || 0) + 1 });
            awardStar();
            setMascot('explore');
            updateModuleStarDisplay();
        }

        var overlay = document.getElementById('sheetOverlay');
        var sheet   = document.getElementById('bottomSheet');
        var iconEl  = document.getElementById('sheetIcon');
        var nameEl  = document.getElementById('sheetName');
        var factsEl = document.getElementById('sheetFacts');

        iconEl.innerHTML =
            '<div class="nw-sheet-icon-bg" style="background:' + law.color + '22">' +
            '<span class="nw-sheet-icon-emoji">' + law.icon + '</span>' +
            '<div class="nw-sheet-badge" style="background:' + law.color + '">' + law.badge + ' Law</div>' +
            '</div>';
        nameEl.textContent = law.name;
        nameEl.style.color = law.color;

        var html = '';
        html += '<div class="nw-sheet-formula" style="color:' + law.color + '">' + law.realName + '</div>';

        /* story */
        html += '<div class="planet-story">';
        html += '<div class="planet-story-label">📖 The Story</div>';
        html += '<div class="planet-story-text">' + law.story + '</div>';
        html += '</div>';

        /* interactive demo */
        html += '<div class="nw-demo-section">';
        html += '<div class="planet-story-label">🎮 Try it yourself!</div>';
        html += buildDemoHTML(law.demoType);
        html += '</div>';

        /* fun facts */
        html += '<div class="planet-facts-label">⭐ Real-World Examples</div>';
        law.facts.forEach(function (f) {
            html += '<div class="fact-row"><span class="fact-icon">' + f.icon + '</span><span class="fact-text">' + f.text + '</span></div>';
        });

        factsEl.innerHTML = html;
        setupDemo(law.demoType, factsEl);

        overlay.classList.add('active');
        requestAnimationFrame(function () { sheet.classList.add('open'); });

        function closeSheet() {
            sheet.classList.remove('open');
            setTimeout(function () { overlay.classList.remove('active'); }, 350);
            overlay.removeEventListener('click', closeSheet);
            if (currentMode === 'explore' && container) {
                var c = container.querySelector('#newtonContent');
                if (c) renderExplore(c);
            }
        }
        overlay.addEventListener('click', closeSheet);
    }

    /* ── Demo HTML Builders ──────────────────────────────────────── */

    function buildDemoHTML(type) {
        if (type === 'inertia')  return buildInertiaHTML();
        if (type === 'force')    return buildForceHTML();
        if (type === 'reaction') return buildReactionHTML();
        return '';
    }

    function buildInertiaHTML() {
        return '<div class="nw-demo" id="nw-demo-inertia">' +
          '<div class="nw-stage" id="nw-inertia-stage">' +
            '<div class="nw-stage-ground" id="nw-stage-ground"></div>' +
            '<div class="nw-stage-stars" id="nw-stage-stars">★ ✦ ✧ ★ ✦ ✧ ★</div>' +
            '<div class="nw-demo-ball" id="nw-demo-ball">🏀</div>' +
            '<div class="nw-demo-wall" id="nw-demo-wall">🧱</div>' +
          '</div>' +
          '<div class="nw-demo-caption" id="nw-inertia-caption">The ball is resting. Give it a push!</div>' +
          '<div class="nw-demo-btns">' +
            '<button class="nw-btn" id="nw-btn-push" style="--c:#E84393">Push it! 🤜</button>' +
            '<button class="nw-btn" id="nw-btn-space" style="--c:#6C5CE7">Go to Space 🚀</button>' +
          '</div>' +
        '</div>';
    }

    function buildForceHTML() {
        return '<div class="nw-demo" id="nw-demo-force">' +
          '<div class="nw-force-group">' +
            '<div class="nw-force-label">How hard is the push?</div>' +
            '<div class="nw-force-btns">' +
              '<button class="nw-force-btn" data-force="1" id="nw-f1">🤏 Gentle</button>' +
              '<button class="nw-force-btn nw-force-active" data-force="2" id="nw-f2">👋 Medium</button>' +
              '<button class="nw-force-btn" data-force="3" id="nw-f3">💪 Hard!</button>' +
            '</div>' +
          '</div>' +
          '<div class="nw-force-group">' +
            '<div class="nw-force-label">How heavy is the object?</div>' +
            '<div class="nw-force-btns">' +
              '<button class="nw-force-btn nw-force-active" data-mass="1" id="nw-m1">🏐 Light</button>' +
              '<button class="nw-force-btn" data-mass="3" id="nw-m3">🎳 Heavy</button>' +
            '</div>' +
          '</div>' +
          '<div class="nw-fma-display" id="nw-fma">F=2 · m=1 · a=<span id="nw-accel">20</span> units</div>' +
          '<div class="nw-track">' +
            '<div class="nw-track-ball" id="nw-track-ball">🏐</div>' +
            '<div class="nw-track-flag">🏁</div>' +
          '</div>' +
          '<div class="nw-demo-caption" id="nw-force-caption">Pick force &amp; mass, then launch!</div>' +
          '<button class="nw-btn nw-btn-wide" id="nw-btn-launch" style="--c:#F9A825;color:#333">Launch! 🚀</button>' +
        '</div>';
    }

    function buildReactionHTML() {
        return '<div class="nw-demo" id="nw-demo-reaction">' +
          '<div class="nw-rtabs">' +
            '<button class="nw-rtab active" data-sub="rocket" id="nw-rt-rocket">🚀 Rocket</button>' +
            '<button class="nw-rtab" data-sub="balloon" id="nw-rt-balloon">🎈 Balloon</button>' +
            '<button class="nw-rtab" data-sub="skate" id="nw-rt-skate">🛹 Skaters</button>' +
          '</div>' +
          '<div id="nw-rsub">' + buildRocketSub() + '</div>' +
        '</div>';
    }

    function buildRocketSub() {
        return '<div class="nw-rsub-wrap" id="nw-rsub-rocket">' +
          '<div class="nw-rocket-stage" id="nw-rkt-stage">' +
            '<div class="nw-rkt-rocket" id="nw-rkt">🚀</div>' +
            '<div class="nw-rkt-flame"  id="nw-rkt-flame">🔥</div>' +
            '<div class="nw-rkt-pad">🏗️</div>' +
          '</div>' +
          '<div class="nw-arrow-pair" id="nw-arrow-pair">' +
            '<div class="nw-arrow-up" id="nw-arr-up">⬆ Rocket flies UP</div>' +
            '<div class="nw-arrow-dn" id="nw-arr-dn">⬇ Fire shoots DOWN</div>' +
          '</div>' +
          '<div class="nw-demo-caption" id="nw-rkt-caption">Ready for launch!</div>' +
          '<button class="nw-btn nw-btn-wide" id="nw-btn-rkt" style="--c:#00B894">Launch! 🔥</button>' +
        '</div>';
    }

    function buildBalloonSub() {
        return '<div class="nw-rsub-wrap" id="nw-rsub-balloon">' +
          '<div class="nw-balloon-stage">' +
            '<div class="nw-balloon-obj" id="nw-balloon">🎈</div>' +
            '<div class="nw-air-puff"    id="nw-air-puff">💨</div>' +
          '</div>' +
          '<div class="nw-demo-caption" id="nw-balloon-caption">Fill the balloon first!</div>' +
          '<div class="nw-demo-btns">' +
            '<button class="nw-btn" id="nw-btn-blow"    style="--c:#6C5CE7">Blow up! 💨</button>' +
            '<button class="nw-btn" id="nw-btn-release" style="--c:#E84393" disabled>Let go! ✋</button>' +
          '</div>' +
        '</div>';
    }

    function buildSkateSub() {
        return '<div class="nw-rsub-wrap" id="nw-rsub-skate">' +
          '<div class="nw-skate-stage">' +
            '<div class="nw-skater" id="nw-ska">🧒</div>' +
            '<div class="nw-push-icon" id="nw-push-icon">👐</div>' +
            '<div class="nw-skater" id="nw-skb">👦</div>' +
          '</div>' +
          '<div class="nw-demo-caption" id="nw-skate-caption">Two skaters face each other. What happens when they push?</div>' +
          '<button class="nw-btn nw-btn-wide" id="nw-btn-skate" style="--c:#00B894">They push! 🤜🤛</button>' +
        '</div>';
    }

    /* ── Demo Wiring ─────────────────────────────────────────────── */

    function setupDemo(type, el) {
        if (type === 'inertia')  setupInertia(el);
        if (type === 'force')    setupForce(el);
        if (type === 'reaction') setupReaction(el);
    }

    /* Inertia */
    function setupInertia(el) {
        var spaceMode = false;
        var moving    = false;
        var ball      = el.querySelector('#nw-demo-ball');
        var caption   = el.querySelector('#nw-inertia-caption');
        var btnPush   = el.querySelector('#nw-btn-push');
        var btnSpace  = el.querySelector('#nw-btn-space');
        var stage     = el.querySelector('#nw-inertia-stage');
        var wall      = el.querySelector('#nw-demo-wall');

        function resetBall() {
            moving = false;
            ball.className = 'nw-demo-ball';
            ball.style.left = '';
            wall.style.opacity = '0';
            btnPush.textContent = 'Push it! 🤜';
        }

        btnSpace.addEventListener('click', function () {
            playTapSound();
            spaceMode = !spaceMode;
            resetBall();
            if (spaceMode) {
                stage.classList.add('nw-space-mode');
                btnSpace.textContent = 'Back to Ground 🌍';
                caption.textContent = 'We\'re in SPACE! No air, no friction. Watch what happens...';
            } else {
                stage.classList.remove('nw-space-mode');
                btnSpace.textContent = 'Go to Space 🚀';
                caption.textContent = 'Back on the ground. Push the ball!';
            }
        });

        btnPush.addEventListener('click', function () {
            if (moving) { resetBall(); return; }
            playTapSound();
            moving = true;
            btnPush.textContent = 'Reset ↺';
            if (spaceMode) {
                ball.classList.add('nw-ball-float');
                caption.textContent = '🚀 In space: NO friction! The ball floats on FOREVER — Newton\'s 1st Law!';
            } else {
                ball.classList.add('nw-ball-slide');
                setTimeout(function () {
                    wall.style.opacity = '1';
                    caption.textContent = '🧱 Friction slows it and it stops. Without friction it would roll on forever!';
                }, 900);
            }
        });
    }

    /* Force = Mass × Acceleration */
    function setupForce(el) {
        var force = 2, mass = 1;
        var trackBall  = el.querySelector('#nw-track-ball');
        var caption    = el.querySelector('#nw-force-caption');
        var fmaDisplay = el.querySelector('#nw-fma');
        var accelEl    = el.querySelector('#nw-accel');
        var btnLaunch  = el.querySelector('#nw-btn-launch');

        function setActiveBtn(group, val) {
            el.querySelectorAll('[data-' + group + ']').forEach(function (b) {
                b.classList.toggle('nw-force-active', parseInt(b.getAttribute('data-' + group)) === val);
            });
        }

        function refreshFMA() {
            var a = Math.round((force / mass) * 10);
            accelEl.textContent = a;
            fmaDisplay.textContent = 'F=' + force + '  ·  m=' + mass + '  ·  a=' + a + ' units';
            trackBall.textContent = mass === 1 ? '🏐' : '🎳';
            trackBall.style.transition = 'none';
            trackBall.style.left = '4%';
        }

        el.querySelectorAll('[data-force]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                playTapSound();
                force = parseInt(btn.getAttribute('data-force'));
                setActiveBtn('force', force);
                refreshFMA();
            });
        });

        el.querySelectorAll('[data-mass]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                playTapSound();
                mass = parseInt(btn.getAttribute('data-mass'));
                setActiveBtn('mass', mass);
                refreshFMA();
            });
        });

        refreshFMA();

        btnLaunch.addEventListener('click', function () {
            playTapSound();
            trackBall.style.transition = 'none';
            trackBall.style.left = '4%';
            var accel = force / mass;
            var target = Math.min(12 + accel * 22, 82);
            var dur    = Math.max(0.25, 1.4 - accel * 0.2);
            setTimeout(function () {
                trackBall.style.transition = 'left ' + dur + 's ease-out';
                trackBall.style.left = target + '%';
            }, 60);
            if (force >= 3 && mass <= 1) {
                handleCorrectAnswer();
                caption.textContent = '🚀 MAX SPEED! Hard push + light ball = huge acceleration! F = m × a!';
            } else if (force <= 1 && mass >= 3) {
                caption.textContent = '🐢 Very slow! Gentle push on a heavy ball = tiny acceleration.';
            } else {
                caption.textContent = '⚡ Try all combos to feel the difference!';
            }
        });
    }

    /* Action & Reaction */
    function setupReaction(el) {
        var rsubEl  = el.querySelector('#nw-rsub');
        var current = 'rocket';

        function switchSub(type) {
            current = type;
            el.querySelectorAll('.nw-rtab').forEach(function (t) {
                t.classList.toggle('active', t.getAttribute('data-sub') === type);
            });
            if (type === 'rocket')  rsubEl.innerHTML = buildRocketSub();
            if (type === 'balloon') rsubEl.innerHTML = buildBalloonSub();
            if (type === 'skate')   rsubEl.innerHTML = buildSkateSub();
            wireReactionSub(type, rsubEl);
        }

        el.querySelectorAll('.nw-rtab').forEach(function (tab) {
            tab.addEventListener('click', function () {
                playTapSound();
                switchSub(tab.getAttribute('data-sub'));
            });
        });

        wireReactionSub('rocket', rsubEl);
    }

    function wireReactionSub(type, el) {
        if (type === 'rocket') {
            var rocket  = el.querySelector('#nw-rkt');
            var flame   = el.querySelector('#nw-rkt-flame');
            var arrUp   = el.querySelector('#nw-arr-up');
            var arrDn   = el.querySelector('#nw-arr-dn');
            var caption = el.querySelector('#nw-rkt-caption');
            var btn     = el.querySelector('#nw-btn-rkt');
            var fired   = false;

            btn.addEventListener('click', function () {
                if (fired) {
                    rocket.classList.remove('nw-rkt-up');
                    flame.classList.remove('nw-flame-dn');
                    arrUp.classList.remove('nw-arr-active');
                    arrDn.classList.remove('nw-arr-active');
                    fired = false;
                    btn.textContent = 'Launch! 🔥';
                    caption.textContent = 'Ready for launch!';
                    return;
                }
                playTapSound();
                fired = true;
                rocket.classList.add('nw-rkt-up');
                flame.classList.add('nw-flame-dn');
                setTimeout(function () {
                    arrUp.classList.add('nw-arr-active');
                    arrDn.classList.add('nw-arr-active');
                }, 300);
                caption.textContent = '🚀 Fire pushes DOWN → Rocket flies UP! That\'s action & reaction!';
                btn.textContent = 'Reset ↺';
                handleCorrectAnswer();
            });
        }

        if (type === 'balloon') {
            var balloon = el.querySelector('#nw-balloon');
            var airPuff = el.querySelector('#nw-air-puff');
            var caption = el.querySelector('#nw-balloon-caption');
            var btnBlow = el.querySelector('#nw-btn-blow');
            var btnRel  = el.querySelector('#nw-btn-release');
            var blown   = false;

            btnBlow.addEventListener('click', function () {
                if (blown) return;
                playTapSound();
                blown = true;
                balloon.classList.add('nw-balloon-big');
                btnBlow.disabled = true;
                btnRel.disabled = false;
                caption.textContent = '💨 The balloon is full. Air is pushing to escape...';
            });

            btnRel.addEventListener('click', function () {
                playTapSound();
                balloon.classList.remove('nw-balloon-big');
                balloon.classList.add('nw-balloon-fly');
                airPuff.classList.add('nw-puff-shoot');
                caption.textContent = '🎈 Air shoots RIGHT → Balloon flies LEFT! Action & Reaction!';
                btnBlow.disabled = false;
                btnRel.disabled = true;
                blown = false;
                setTimeout(function () {
                    balloon.classList.remove('nw-balloon-fly');
                    airPuff.classList.remove('nw-puff-shoot');
                }, 1400);
            });
        }

        if (type === 'skate') {
            var ska     = el.querySelector('#nw-ska');
            var skb     = el.querySelector('#nw-skb');
            var caption = el.querySelector('#nw-skate-caption');
            var btn     = el.querySelector('#nw-btn-skate');
            var pushed  = false;

            btn.addEventListener('click', function () {
                if (pushed) {
                    ska.classList.remove('nw-ska-left');
                    skb.classList.remove('nw-skb-right');
                    pushed = false;
                    btn.textContent = 'They push! 🤜🤛';
                    caption.textContent = 'Two skaters face each other. What happens when they push?';
                    return;
                }
                playTapSound();
                pushed = true;
                ska.classList.add('nw-ska-left');
                skb.classList.add('nw-skb-right');
                caption.textContent = '🛹 Both skaters slide AWAY from each other! You can\'t push without being pushed back!';
                btn.textContent = 'Reset ↺';
            });
        }
    }

    /* ── Quiz Mode ───────────────────────────────────────────────── */

    function startQuizRound() {
        quizIndex    = 0;
        quizCorrect  = 0;
        quizAnswered = false;
        quizQuestions = shuffle(ALL_QUIZ_Q);
    }

    function renderQuiz(el) {
        quizAnswered = false;
        if (quizIndex >= QUIZ_TOTAL) { renderQuizComplete(el); return; }

        var q   = quizQuestions[quizIndex];
        var pct = (quizIndex / QUIZ_TOTAL) * 100;

        var html = '<div class="quiz-progress">';
        html += '<div class="quiz-progress-header"><span>Question ' + (quizIndex + 1) + ' of ' + QUIZ_TOTAL + '</span><span>' + quizCorrect + ' correct</span></div>';
        html += '<div class="math-progress-bar"><div class="math-progress-fill quiz-fill" style="width:' + pct + '%"></div></div>';
        html += '</div>';

        html += '<div class="quiz-area nw-quiz-area">';
        html += '<div class="nw-q-scenario">' + q.scenario + '</div>';
        html += '<div class="quiz-prompt">Which of Newton\'s Laws explains this?</div>';
        html += '<div class="nw-q-hint"><span class="nw-q-hint-icon">💡</span>' + q.hint + '</div>';
        html += '<div class="nw-answer-col">';
        LAWS.forEach(function (law) {
            html += '<button class="nw-law-btn" data-law="' + law.number + '" style="--lc:' + law.color + '">';
            html += '<span class="nw-law-btn-icon">' + law.icon + '</span>';
            html += '<div class="nw-law-btn-text">';
            html += '<span class="nw-law-btn-badge" style="background:' + law.color + '">' + law.badge + ' Law</span>';
            html += '<span class="nw-law-btn-name">' + law.name + '</span>';
            html += '</div></button>';
        });
        html += '</div></div>';

        el.innerHTML = html;
        setMascot('thinking');

        el.querySelectorAll('.nw-law-btn').forEach(function (btn) {
            btn.addEventListener('click', function () { onAnswer(btn, el, q); });
        });
    }

    function onAnswer(btn, el, q) {
        if (quizAnswered) return;
        quizAnswered = true;
        playTapSound();
        var chosen = parseInt(btn.getAttribute('data-law'));

        if (chosen === q.lawNum) {
            btn.classList.add('correct');
            handleCorrectAnswer();
            quizCorrect++;
            var data = getModuleData('newton-laws');
            updateModuleData('newton-laws', { stars: (data.stars || 0) + 1 });
            updateModuleStarDisplay();
        } else {
            btn.classList.add('wrong');
            el.querySelectorAll('.nw-law-btn').forEach(function (b) {
                if (parseInt(b.getAttribute('data-law')) === q.lawNum) b.classList.add('correct');
            });
            handleWrongAnswer();
        }

        quizIndex++;
        setTimeout(function () { renderQuiz(el); }, 1600);
    }

    function renderQuizComplete(el) {
        var pct = Math.round((quizCorrect / QUIZ_TOTAL) * 100);
        var emoji, msg;
        if (pct === 100) { emoji = '🏆'; msg = 'Perfect! Newton would be proud!'; }
        else if (pct >= 70) { emoji = '🔬'; msg = 'Great scientific thinking!'; }
        else if (pct >= 40) { emoji = '⭐'; msg = 'Good try! Keep exploring the laws!'; }
        else                { emoji = '💪'; msg = 'Head back to Explore and try again!'; }

        var html = '<div class="quiz-complete">';
        html += '<div class="quiz-complete-emoji">' + emoji + '</div>';
        html += '<div class="quiz-complete-score">' + quizCorrect + ' / ' + QUIZ_TOTAL + '</div>';
        html += '<div class="quiz-complete-msg">' + msg + '</div>';
        html += '<button class="quiz-restart-btn">Play Again 🔄</button>';
        html += '</div>';

        el.innerHTML = html;
        if (pct >= 70) setMascot('correct'); else setMascot('encourage');

        el.querySelector('.quiz-restart-btn').addEventListener('click', function () {
            playTapSound();
            startQuizRound();
            renderQuiz(el);
        });
    }

    /* ── Register ────────────────────────────────────────────────── */

    registerModule({
        id: 'newton-laws',
        title: "Newton's Laws",
        icon: '🍎',
        color: '#00B894',
        category: 'Science',
        init: function (el) {
            container   = el;
            currentMode = 'explore';
            startQuizRound();
            render();
        },
        cleanup: function () {
            container = null;
            var overlay = document.getElementById('sheetOverlay');
            var sheet   = document.getElementById('bottomSheet');
            if (overlay) overlay.classList.remove('active');
            if (sheet)   sheet.classList.remove('open');
        },
        getProgress: function () {
            var data     = getModuleData('newton-laws');
            var explored = (data.explored || []).length;
            return { stars: data.stars || 0, detail: explored + '/' + LAWS.length + ' laws explored' };
        }
    });

})();
