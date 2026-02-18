/* science.js - Science Planets module */

(function () {
    var PLANETS = [
        {
            id: 'mercury', name: 'Mercury', emoji: '⚫',
            color: '#B5B5B5', orbitPct: 14,
            facts: [
                { icon: '🏃', text: 'Mercury is the fastest planet!' },
                { icon: '☀️', text: 'It is the closest to the Sun' },
                { icon: '🤏', text: 'Mercury is very tiny' }
            ],
            quizHint: 'The smallest and fastest planet'
        },
        {
            id: 'venus', name: 'Venus', emoji: '🟡',
            color: '#FDCB6E', orbitPct: 22,
            facts: [
                { icon: '🌡️', text: 'Venus is the hottest planet!' },
                { icon: '☁️', text: 'It is covered in thick clouds' },
                { icon: '🔄', text: 'Venus spins backwards!' }
            ],
            quizHint: 'The hottest planet with thick clouds'
        },
        {
            id: 'earth', name: 'Earth', emoji: '🌍',
            color: '#4A90D9', orbitPct: 30,
            facts: [
                { icon: '🏠', text: 'This is where we live!' },
                { icon: '💧', text: 'Earth has lots of water' },
                { icon: '🌳', text: 'It has trees and animals' }
            ],
            quizHint: 'The blue planet where we live'
        },
        {
            id: 'mars', name: 'Mars', emoji: '🔴',
            color: '#E17055', orbitPct: 38,
            facts: [
                { icon: '🟥', text: 'Mars is called the Red Planet!' },
                { icon: '🤖', text: 'Robots explore Mars for us' },
                { icon: '🏔️', text: 'It has the tallest mountain ever!' }
            ],
            quizHint: 'The red planet with robots'
        },
        {
            id: 'jupiter', name: 'Jupiter', emoji: '🟤',
            color: '#FDCB6E', orbitPct: 52,
            facts: [
                { icon: '💪', text: 'Jupiter is the biggest planet!' },
                { icon: '🌀', text: 'It has a giant storm called the Great Red Spot' },
                { icon: '🌙', text: 'Jupiter has over 90 moons!' }
            ],
            quizHint: 'The biggest planet with a giant storm'
        },
        {
            id: 'saturn', name: 'Saturn', emoji: '🪐',
            color: '#DFE6E9', orbitPct: 64,
            facts: [
                { icon: '💍', text: 'Saturn has beautiful rings!' },
                { icon: '🛁', text: 'Saturn could float in a giant bathtub!' },
                { icon: '💨', text: 'It is made mostly of gas' }
            ],
            quizHint: 'The planet with beautiful rings'
        },
        {
            id: 'uranus', name: 'Uranus', emoji: '🔵',
            color: '#74B9FF', orbitPct: 76,
            facts: [
                { icon: '🧊', text: 'Uranus is super cold and icy!' },
                { icon: '🔄', text: 'It rolls on its side like a ball!' },
                { icon: '💙', text: 'Uranus looks blue-green' }
            ],
            quizHint: 'The icy planet that rolls on its side'
        },
        {
            id: 'neptune', name: 'Neptune', emoji: '🔷',
            color: '#0984E3', orbitPct: 88,
            facts: [
                { icon: '🌊', text: 'Neptune is named after the sea god!' },
                { icon: '💨', text: 'It has the strongest winds ever!' },
                { icon: '🏠', text: 'Neptune is the farthest planet' }
            ],
            quizHint: 'The farthest planet with super strong winds'
        }
    ];

    var container = null;
    var currentMode = 'explore';
    var currentQuiz = null;
    var quizAnswered = false;

    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
        }
        return a;
    }

    function renderModeTabs() {
        var html = '<div class="mode-tabs">';
        html += '<button class="mode-tab' + (currentMode === 'explore' ? ' active' : '') + '" data-mode="explore">🔭 Explore</button>';
        html += '<button class="mode-tab' + (currentMode === 'quiz' ? ' active' : '') + '" data-mode="quiz">❓ Quiz</button>';
        html += '</div>';
        return html;
    }

    function render() {
        if (!container) return;
        var html = renderModeTabs();
        html += '<div id="scienceContent"></div>';
        container.innerHTML = html;

        container.querySelectorAll('.mode-tab').forEach(function (tab) {
            tab.addEventListener('click', function () {
                currentMode = tab.getAttribute('data-mode');
                playTapSound();
                render();
            });
        });

        var content = container.querySelector('#scienceContent');
        if (currentMode === 'explore') {
            renderExplore(content);
        } else {
            renderQuiz(content);
        }

        updateModuleStarDisplay();
    }

    /* --- Explore Mode --- */
    function renderExplore(el) {
        var data = getModuleData('science-planets');
        var explored = data.exploredPlanets || [];

        var html = '<div class="solar-system">';
        html += '<span class="sun">☀️</span>';

        // Orbit rings
        PLANETS.forEach(function (p) {
            var size = p.orbitPct;
            html += '<div class="orbit-ring" style="width:' + size + '%;height:' + size + '%;top:' + (50 - size / 2) + '%;left:' + (50 - size / 2) + '%;"></div>';
        });

        // Planets
        PLANETS.forEach(function (p, idx) {
            var angle = (idx / PLANETS.length) * 360 + 30;
            var rad = angle * Math.PI / 180;
            var radius = p.orbitPct / 2;
            var x = 50 + radius * Math.cos(rad);
            var y = 50 + radius * Math.sin(rad);
            var isExplored = explored.indexOf(p.id) !== -1;

            html += '<button class="planet-btn' + (isExplored ? ' explored' : '') + '" data-planet="' + p.id + '" style="left:calc(' + x + '% - 30px);top:calc(' + y + '% - 30px);">';
            html += p.emoji;
            html += '<span class="planet-label">' + p.name + '</span>';
            html += '</button>';
        });

        html += '</div>';
        html += '<div style="text-align:center;padding:16px 0;color:var(--text-secondary);font-weight:600;">Tap a planet to explore! (' + explored.length + '/' + PLANETS.length + ')</div>';

        el.innerHTML = html;

        el.querySelectorAll('.planet-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var planetId = btn.getAttribute('data-planet');
                playTapSound();
                openPlanetSheet(planetId);
            });
        });
    }

    function openPlanetSheet(planetId) {
        var planet = PLANETS.find(function (p) { return p.id === planetId; });
        if (!planet) return;

        // Mark as explored
        var data = getModuleData('science-planets');
        var explored = data.exploredPlanets || [];
        if (explored.indexOf(planetId) === -1) {
            explored.push(planetId);
            updateModuleData('science-planets', { exploredPlanets: explored });
            awardStar();
            setMascot('explore');
        }

        var overlay = document.getElementById('sheetOverlay');
        var sheet = document.getElementById('bottomSheet');
        var iconEl = document.getElementById('sheetIcon');
        var nameEl = document.getElementById('sheetName');
        var factsEl = document.getElementById('sheetFacts');

        iconEl.textContent = planet.emoji;
        nameEl.textContent = planet.name;
        nameEl.style.color = planet.color;

        var factsHtml = '';
        planet.facts.forEach(function (f) {
            factsHtml += '<div class="fact-row">';
            factsHtml += '<span class="fact-icon">' + f.icon + '</span>';
            factsHtml += '<span class="fact-text">' + f.text + '</span>';
            factsHtml += '</div>';
        });
        factsEl.innerHTML = factsHtml;

        overlay.classList.add('active');
        requestAnimationFrame(function () {
            sheet.classList.add('open');
        });

        function closeSheet() {
            sheet.classList.remove('open');
            setTimeout(function () {
                overlay.classList.remove('active');
            }, 350);
            overlay.removeEventListener('click', closeSheet);
            // Re-render explore to show updated explored state
            if (currentMode === 'explore' && container) {
                var content = container.querySelector('#scienceContent');
                if (content) renderExplore(content);
            }
        }

        overlay.addEventListener('click', closeSheet);
    }

    /* --- Quiz Mode --- */
    function generateQuizQuestion() {
        var planet = PLANETS[Math.floor(Math.random() * PLANETS.length)];
        var others = PLANETS.filter(function (p) { return p.id !== planet.id; });
        var distractors = shuffle(others).slice(0, 3);
        var answers = shuffle([planet].concat(distractors));

        return {
            planet: planet,
            answers: answers
        };
    }

    function renderQuiz(el) {
        quizAnswered = false;
        currentQuiz = generateQuizQuestion();
        var q = currentQuiz;

        var html = '<div class="quiz-area">';
        html += '<div class="quiz-prompt">Which planet is this?</div>';
        html += '<div class="quiz-planet-display">' + q.planet.emoji + '</div>';
        html += '<div class="quiz-hint">' + q.planet.quizHint + '</div>';
        html += '<div class="answer-grid">';
        q.answers.forEach(function (p) {
            html += '<button class="answer-btn text-answer" data-planet="' + p.id + '">' + p.name + '</button>';
        });
        html += '</div>';
        html += '</div>';

        el.innerHTML = html;
        setMascot('thinking');

        el.querySelectorAll('.answer-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                onQuizAnswer(btn, el);
            });
        });
    }

    function onQuizAnswer(btn, el) {
        if (quizAnswered) return;
        var planetId = btn.getAttribute('data-planet');
        playTapSound();

        if (planetId === currentQuiz.planet.id) {
            quizAnswered = true;
            btn.classList.add('correct');
            handleCorrectAnswer();

            var data = getModuleData('science-planets');
            updateModuleData('science-planets', {
                quizCorrect: (data.quizCorrect || 0) + 1,
                quizTotal: (data.quizTotal || 0) + 1,
                stars: (data.stars || 0) + 1
            });
            updateModuleStarDisplay();

            setTimeout(function () {
                renderQuiz(el);
            }, 1800);
        } else {
            btn.classList.add('wrong');
            handleWrongAnswer();
            setTimeout(function () {
                btn.classList.remove('wrong');
            }, 500);
        }
    }

    function updateModuleStarDisplay() {
        var data = getModuleData('science-planets');
        var el = document.querySelector('#moduleStars .star-count');
        if (el) el.textContent = data.stars || 0;
    }

    registerModule({
        id: 'science-planets',
        title: 'Planets',
        icon: '🪐',
        color: '#4ECDC4',
        category: 'Science',
        init: function (el) {
            container = el;
            currentMode = 'explore';
            render();
        },
        cleanup: function () {
            container = null;
            currentQuiz = null;
            // Close any open sheet
            var overlay = document.getElementById('sheetOverlay');
            var sheet = document.getElementById('bottomSheet');
            if (overlay) overlay.classList.remove('active');
            if (sheet) sheet.classList.remove('open');
        },
        getProgress: function () {
            var data = getModuleData('science-planets');
            var explored = (data.exploredPlanets || []).length;
            return {
                stars: data.stars || 0,
                detail: explored + '/' + PLANETS.length + ' explored'
            };
        }
    });
})();
