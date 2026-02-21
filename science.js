/* science.js - Science Planets module */

(function () {
    var PLANETS = [
        {
            id: 'mercury', name: 'Mercury', emoji: '⚫', size: 0.5,
            color: '#B5B5B5', svgColor: '#8C7853', orbitPct: 14,
            facts: [
                { icon: '🏃', text: 'Mercury is the fastest planet!' },
                { icon: '☀️', text: 'It is the closest to the Sun' },
                { icon: '🤏', text: 'Mercury is very tiny' }
            ],
            quizHint: 'The smallest and fastest planet'
        },
        {
            id: 'venus', name: 'Venus', emoji: '🟡', size: 0.9,
            color: '#FDCB6E', svgColor: '#FDB813', orbitPct: 22,
            facts: [
                { icon: '🌡️', text: 'Venus is the hottest planet!' },
                { icon: '☁️', text: 'It is covered in thick clouds' },
                { icon: '🔄', text: 'Venus spins backwards!' }
            ],
            quizHint: 'The hottest planet with thick clouds'
        },
        {
            id: 'earth', name: 'Earth', emoji: '🌍', size: 1.0,
            color: '#4A90D9', svgColor: '#1E90FF', orbitPct: 30,
            facts: [
                { icon: '🏠', text: 'This is where we live!' },
                { icon: '💧', text: 'Earth has lots of water' },
                { icon: '🌳', text: 'It has trees and animals' }
            ],
            quizHint: 'The blue planet where we live'
        },
        {
            id: 'mars', name: 'Mars', emoji: '🔴', size: 0.6,
            color: '#E17055', svgColor: '#E74C3C', orbitPct: 38,
            facts: [
                { icon: '🟥', text: 'Mars is called the Red Planet!' },
                { icon: '🤖', text: 'Robots explore Mars for us' },
                { icon: '🏔️', text: 'It has the tallest mountain ever!' }
            ],
            quizHint: 'The red planet with robots'
        },
        {
            id: 'jupiter', name: 'Jupiter', emoji: '🟤', size: 1.8,
            color: '#FDCB6E', svgColor: '#D4A574', orbitPct: 52,
            facts: [
                { icon: '💪', text: 'Jupiter is the biggest planet!' },
                { icon: '🌀', text: 'It has a giant storm called the Great Red Spot' },
                { icon: '🌙', text: 'Jupiter has over 90 moons!' }
            ],
            quizHint: 'The biggest planet with a giant storm'
        },
        {
            id: 'saturn', name: 'Saturn', emoji: '🪐', size: 1.6,
            color: '#DFE6E9', svgColor: '#F4D03F', orbitPct: 64,
            facts: [
                { icon: '💍', text: 'Saturn has beautiful rings!' },
                { icon: '🛁', text: 'Saturn could float in a giant bathtub!' },
                { icon: '💨', text: 'It is made mostly of gas' }
            ],
            quizHint: 'The planet with beautiful rings'
        },
        {
            id: 'uranus', name: 'Uranus', emoji: '🔵', size: 1.2,
            color: '#74B9FF', svgColor: '#3498DB', orbitPct: 76,
            facts: [
                { icon: '🧊', text: 'Uranus is super cold and icy!' },
                { icon: '🔄', text: 'It rolls on its side like a ball!' },
                { icon: '💙', text: 'Uranus looks blue-green' }
            ],
            quizHint: 'The icy planet that rolls on its side'
        },
        {
            id: 'neptune', name: 'Neptune', emoji: '🔷', size: 1.2,
            color: '#0984E3', svgColor: '#2E86DE', orbitPct: 88,
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

    function renderPlanetSVG(planet, size) {
        var baseSize = 60;
        var scaledSize = baseSize * (planet.size || 1) * size;
        var viewBox = (60 - scaledSize) / 2;

        var svg = '<svg class="planet-svg" width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">';

        // Special handling for Saturn with rings
        if (planet.id === 'saturn') {
            svg += '<ellipse cx="30" cy="32" rx="24" ry="8" fill="none" stroke="' + planet.svgColor + '" stroke-width="2" opacity="0.6"/>';
            svg += '<ellipse cx="30" cy="32" rx="20" ry="6" fill="none" stroke="' + planet.svgColor + '" stroke-width="1.5" opacity="0.4"/>';
            svg += '<circle cx="30" cy="30" r="' + scaledSize / 2 + '" fill="' + planet.svgColor + '" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2))"/>';
        }
        // Special handling for Earth with blue water
        else if (planet.id === 'earth') {
            svg += '<circle cx="30" cy="30" r="' + scaledSize / 2 + '" fill="' + planet.svgColor + '"/>';
            svg += '<circle cx="24" cy="26" r="' + (scaledSize / 8) + '" fill="#55EFC4" opacity="0.7"/>';
            svg += '<circle cx="36" cy="35" r="' + (scaledSize / 10) + '" fill="#55EFC4" opacity="0.7"/>';
            svg += '<circle cx="30" cy="30" r="' + scaledSize / 2 + '" fill="none" stroke="rgba(30,144,255,0.3)" stroke-width="1"/>';
        }
        // Special handling for Jupiter with storm
        else if (planet.id === 'jupiter') {
            svg += '<circle cx="30" cy="30" r="' + scaledSize / 2 + '" fill="' + planet.svgColor + '"/>';
            svg += '<ellipse cx="30" cy="28" rx="' + (scaledSize / 2.5) + '" ry="' + (scaledSize / 6) + '" fill="#D9534F" opacity="0.6"/>';
            svg += '<path d="M ' + (30 - scaledSize / 3) + ' 26 Q 30 24 ' + (30 + scaledSize / 3) + ' 26" stroke="rgba(255,255,255,0.3)" stroke-width="1" fill="none"/>';
        }
        // Default circular planet
        else {
            svg += '<circle cx="30" cy="30" r="' + scaledSize / 2 + '" fill="' + planet.svgColor + '" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.15))"/>';
        }

        svg += '</svg>';
        return svg;
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
            html += renderPlanetSVG(p, 1);
            html += '<span class="planet-label">' + p.name + '</span>';
            html += '</button>';
        });

        html += '</div>';

        // Add progress bar
        html += renderProgressBar({
            current: explored.length,
            max: PLANETS.length,
            label: 'Planets Explored',
            color: '#4ECDC4'
        });

        html += '<div style="text-align:center;padding:8px 0;color:var(--text-secondary);font-weight:600;font-size:0.9rem;">Tap a planet to learn more!</div>';

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
