/* science.js - Science Planets module */

(function () {
    var PLANETS = [
        {
            id: 'mercury', name: 'Mercury',
            color: '#B5B5B5', color2: '#8E8E8E', orbitPct: 14, size: 18,
            facts: [
                { icon: '☿', text: 'Mercury is the fastest planet!' },
                { icon: '☀️', text: 'It is the closest to the Sun' },
                { icon: '🤏', text: 'Mercury is very tiny' }
            ],
            story: 'Mercury is a tiny, speedy planet that zooms around the Sun faster than any other! It is so close to the Sun that daytime is super hot, but at night it gets freezing cold. Mercury has no air to breathe and no moons to keep it company. Even though it is small, it is full of craters from space rocks that bumped into it long ago!',
            quizHint: 'The smallest and fastest planet'
        },
        {
            id: 'venus', name: 'Venus',
            color: '#FDCB6E', color2: '#E8A838', orbitPct: 22, size: 24,
            facts: [
                { icon: '♀️', text: 'Venus is the hottest planet!' },
                { icon: '☁️', text: 'It is covered in thick clouds' },
                { icon: '🔄', text: 'Venus spins backwards!' }
            ],
            story: 'Venus is wrapped in thick, puffy clouds that make it the hottest planet of all! It spins the wrong way around, so on Venus the Sun rises in the west. Venus is sometimes called Earth\'s twin because they are almost the same size. At night, you can see Venus shining bright in the sky — people call it the Evening Star!',
            quizHint: 'The hottest planet with thick clouds'
        },
        {
            id: 'earth', name: 'Earth',
            color: '#4A90D9', color2: '#55EFC4', orbitPct: 30, size: 26,
            facts: [
                { icon: '🌍', text: 'This is where we live!' },
                { icon: '💧', text: 'Earth has lots of water' },
                { icon: '🌳', text: 'It has trees and animals' }
            ],
            story: 'Earth is our beautiful home! It is the only planet we know that has oceans, trees, animals, and people. From space, Earth looks like a big blue marble because most of it is covered in water. Earth has one Moon that lights up the night sky. Our planet is just the right distance from the Sun — not too hot and not too cold!',
            quizHint: 'The blue planet where we live'
        },
        {
            id: 'mars', name: 'Mars',
            color: '#E17055', color2: '#D63031', orbitPct: 38, size: 22,
            facts: [
                { icon: '♂️', text: 'Mars is called the Red Planet!' },
                { icon: '🤖', text: 'Robots explore Mars for us' },
                { icon: '🏔️', text: 'It has the tallest mountain ever!' }
            ],
            story: 'Mars is called the Red Planet because its dusty ground looks like rusty red dirt! Brave little robots drive around Mars taking pictures and studying rocks. Mars has the tallest mountain in the whole solar system — it is called Olympus Mons and is three times taller than Mount Everest! Maybe one day, people will visit Mars too!',
            quizHint: 'The red planet with robots'
        },
        {
            id: 'jupiter', name: 'Jupiter',
            color: '#FDCB6E', color2: '#E17055', orbitPct: 52, size: 40,
            facts: [
                { icon: '♃', text: 'Jupiter is the biggest planet!' },
                { icon: '🌀', text: 'It has a giant storm called the Great Red Spot' },
                { icon: '🌙', text: 'Jupiter has over 90 moons!' }
            ],
            story: 'Jupiter is the king of the planets — it is SO big that all the other planets could fit inside it! Jupiter has a giant storm called the Great Red Spot that has been spinning for hundreds of years. It has over 90 moons! Jupiter is made mostly of gas, so you could never stand on it. It is like a giant swirling ball of clouds!',
            quizHint: 'The biggest planet with a giant storm'
        },
        {
            id: 'saturn', name: 'Saturn',
            color: '#DFE6E9', color2: '#FDCB6E', orbitPct: 64, size: 36,
            hasRings: true,
            facts: [
                { icon: '♄', text: 'Saturn has beautiful rings!' },
                { icon: '🛁', text: 'Saturn could float in a giant bathtub!' },
                { icon: '💨', text: 'It is made mostly of gas' }
            ],
            story: 'Saturn is the most beautiful planet because of its amazing rings! The rings are made of billions of pieces of ice and rock, some tiny like sand and some as big as a house! Saturn is so light that if you had a bathtub big enough, Saturn would float in the water! It has over 140 moons — more than any other planet!',
            quizHint: 'The planet with beautiful rings'
        },
        {
            id: 'uranus', name: 'Uranus',
            color: '#74B9FF', color2: '#81ECEC', orbitPct: 76, size: 32,
            hasRings: true,
            facts: [
                { icon: '⛢', text: 'Uranus is super cold and icy!' },
                { icon: '🔄', text: 'It rolls on its side like a ball!' },
                { icon: '💙', text: 'Uranus looks blue-green' }
            ],
            story: 'Uranus is a funny planet that rolls on its side like a ball rolling down a hill! Scientists think something really big crashed into it long ago and knocked it over. Uranus is super cold and icy, and it looks blue-green because of special gases in its sky. It also has faint rings, just like Saturn, but much harder to see!',
            quizHint: 'The icy planet that rolls on its side'
        },
        {
            id: 'neptune', name: 'Neptune',
            color: '#0984E3', color2: '#6C5CE7', orbitPct: 88, size: 30,
            facts: [
                { icon: '♆', text: 'Neptune is named after the sea god!' },
                { icon: '💨', text: 'It has the strongest winds ever!' },
                { icon: '🔭', text: 'Neptune is the farthest planet' }
            ],
            story: 'Neptune is the farthest planet from the Sun, way out in the dark, cold part of space! It is named after the Roman god of the sea because of its beautiful deep blue color. Neptune has the strongest winds of any planet — they blow faster than the fastest jet planes! It takes Neptune 165 years to go around the Sun just once!',
            quizHint: 'The farthest planet with super strong winds'
        }
    ];

    var QUIZ_TOTAL = 10;
    var container = null;
    var currentMode = 'explore';
    var currentQuiz = null;
    var quizAnswered = false;
    var quizQuestionNum = 0;
    var quizCorrectInRound = 0;
    var quizQuestions = [];

    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
        }
        return a;
    }

    /* --- CSS Planet Rendering --- */
    function planetHTML(planet, sizeOverride) {
        var s = sizeOverride || planet.size;
        var html = '<div class="css-planet" style="width:' + s + 'px;height:' + s + 'px;">';
        html += '<div class="css-planet-body" style="background:radial-gradient(circle at 35% 35%,' + planet.color + ',' + planet.color2 + ');width:' + s + 'px;height:' + s + 'px;"></div>';
        if (planet.hasRings) {
            html += '<div class="css-planet-ring" style="width:' + (s * 1.8) + 'px;height:' + (s * 0.4) + 'px;"></div>';
        }
        html += '</div>';
        return html;
    }

    function planetHTMLLarge(planet) {
        return planetHTML(planet, 100);
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
                var newMode = tab.getAttribute('data-mode');
                if (newMode !== currentMode) {
                    currentMode = newMode;
                    if (newMode === 'quiz') startNewQuizRound();
                    playTapSound();
                    render();
                }
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
        var progressPct = Math.min((explored.length / PLANETS.length) * 100, 100);

        // Progress bar
        var html = '<div class="explore-progress">';
        html += '<div class="explore-progress-header">';
        html += '<span>Planets Explored</span>';
        html += '<span>' + explored.length + '/' + PLANETS.length + '</span>';
        html += '</div>';
        html += '<div class="math-progress-bar">';
        html += '<div class="math-progress-fill explore-fill" style="width:' + progressPct + '%"></div>';
        html += '</div>';
        if (explored.length === PLANETS.length) {
            html += '<div class="explore-complete">All planets explored! You\'re a space expert! 🚀</div>';
        }
        html += '</div>';

        html += '<div class="solar-system">';
        html += '<div class="sun-visual"><div class="sun-glow"></div>☀️</div>';

        // Orbit rings
        PLANETS.forEach(function (p) {
            var size = p.orbitPct;
            html += '<div class="orbit-ring" style="width:' + size + '%;height:' + size + '%;top:' + (50 - size / 2) + '%;left:' + (50 - size / 2) + '%;"></div>';
        });

        // Planets with CSS visuals
        PLANETS.forEach(function (p, idx) {
            var angle = (idx / PLANETS.length) * 360 + 30;
            var rad = angle * Math.PI / 180;
            var radius = p.orbitPct / 2;
            var x = 50 + radius * Math.cos(rad);
            var y = 50 + radius * Math.sin(rad);
            var isExplored = explored.indexOf(p.id) !== -1;

            html += '<button class="planet-btn' + (isExplored ? ' explored' : '') + '" data-planet="' + p.id + '" style="left:calc(' + x + '% - 30px);top:calc(' + y + '% - 30px);">';
            html += planetHTML(p);
            html += '<span class="planet-label">' + p.name + '</span>';
            html += '</button>';
        });

        html += '</div>';
        html += '<div style="text-align:center;padding:12px 0;color:var(--text-secondary);font-weight:600;font-size:0.9rem;">Tap a planet to explore!</div>';

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
        var isNew = explored.indexOf(planetId) === -1;
        if (isNew) {
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

        // Replace emoji with CSS planet in sheet
        iconEl.innerHTML = planetHTMLLarge(planet);
        nameEl.textContent = planet.name;
        nameEl.style.color = planet.color;

        var factsHtml = '';

        // Story section
        factsHtml += '<div class="planet-story">';
        factsHtml += '<div class="planet-story-label">📖 Story</div>';
        factsHtml += '<div class="planet-story-text">' + planet.story + '</div>';
        factsHtml += '</div>';

        // Fun facts
        factsHtml += '<div class="planet-facts-label">⭐ Fun Facts</div>';
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
            if (currentMode === 'explore' && container) {
                var content = container.querySelector('#scienceContent');
                if (content) renderExplore(content);
            }
        }

        overlay.addEventListener('click', closeSheet);
    }

    /* --- Quiz Mode (10 questions per round) --- */
    function startNewQuizRound() {
        quizQuestionNum = 0;
        quizCorrectInRound = 0;
        // Generate 10 questions upfront, cycling through planets
        quizQuestions = [];
        var shuffled = shuffle(PLANETS);
        for (var i = 0; i < QUIZ_TOTAL; i++) {
            var planet = shuffled[i % shuffled.length];
            var others = PLANETS.filter(function (p) { return p.id !== planet.id; });
            var distractors = shuffle(others).slice(0, 3);
            quizQuestions.push({
                planet: planet,
                answers: shuffle([planet].concat(distractors))
            });
        }
    }

    function renderQuiz(el) {
        quizAnswered = false;

        // Check if round is complete
        if (quizQuestionNum >= QUIZ_TOTAL) {
            renderQuizComplete(el);
            return;
        }

        currentQuiz = quizQuestions[quizQuestionNum];
        var q = currentQuiz;
        var qNum = quizQuestionNum + 1;
        var progressPct = (quizQuestionNum / QUIZ_TOTAL) * 100;

        var html = '';

        // Progress bar
        html += '<div class="quiz-progress">';
        html += '<div class="quiz-progress-header">';
        html += '<span>Question ' + qNum + ' of ' + QUIZ_TOTAL + '</span>';
        html += '<span>' + quizCorrectInRound + ' correct</span>';
        html += '</div>';
        html += '<div class="math-progress-bar">';
        html += '<div class="math-progress-fill quiz-fill" style="width:' + progressPct + '%"></div>';
        html += '</div>';
        html += '</div>';

        html += '<div class="quiz-area">';
        html += '<div class="quiz-prompt">Which planet is this?</div>';
        html += '<div class="quiz-planet-display">' + planetHTMLLarge(q.planet) + '</div>';
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

    function renderQuizComplete(el) {
        var pct = Math.round((quizCorrectInRound / QUIZ_TOTAL) * 100);
        var msg = '';
        var emoji = '';
        if (pct === 100) { msg = 'Perfect score! Amazing!'; emoji = '🏆'; }
        else if (pct >= 70) { msg = 'Great job, space explorer!'; emoji = '🚀'; }
        else if (pct >= 40) { msg = 'Good try! Keep learning!'; emoji = '⭐'; }
        else { msg = 'Keep exploring the planets!'; emoji = '💪'; }

        var html = '<div class="quiz-complete">';
        html += '<div class="quiz-complete-emoji">' + emoji + '</div>';
        html += '<div class="quiz-complete-score">' + quizCorrectInRound + '/' + QUIZ_TOTAL + '</div>';
        html += '<div class="quiz-complete-msg">' + msg + '</div>';
        html += '<div class="math-progress-bar" style="max-width:200px;margin:16px auto;">';
        html += '<div class="math-progress-fill quiz-fill" style="width:100%"></div>';
        html += '</div>';
        html += '<button class="quiz-restart-btn">Play Again 🔄</button>';
        html += '</div>';

        el.innerHTML = html;

        if (pct >= 70) setMascot('correct');
        else setMascot('encourage');

        el.querySelector('.quiz-restart-btn').addEventListener('click', function () {
            playTapSound();
            startNewQuizRound();
            renderQuiz(el);
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
            quizCorrectInRound++;

            var data = getModuleData('science-planets');
            updateModuleData('science-planets', {
                quizCorrect: (data.quizCorrect || 0) + 1,
                quizTotal: (data.quizTotal || 0) + 1,
                stars: (data.stars || 0) + 1
            });
            updateModuleStarDisplay();

            quizQuestionNum++;
            setTimeout(function () {
                renderQuiz(el);
            }, 1500);
        } else {
            btn.classList.add('wrong');
            handleWrongAnswer();
            setTimeout(function () {
                btn.classList.remove('wrong');
            }, 500);
            // After 2 wrong attempts, move on
            var wrongCount = parseInt(btn.parentElement.getAttribute('data-wrongs') || '0', 10) + 1;
            btn.parentElement.setAttribute('data-wrongs', wrongCount);
            if (wrongCount >= 3) {
                quizQuestionNum++;
                setTimeout(function () {
                    renderQuiz(el);
                }, 1200);
            }
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
            startNewQuizRound();
            render();
        },
        cleanup: function () {
            container = null;
            currentQuiz = null;
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
