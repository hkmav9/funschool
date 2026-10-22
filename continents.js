/* continents.js - Geography Continents module */

(function () {
    var MODULE_ID = 'science-continents';

    var CONTINENTS = [
        {
            id: 'asia', name: 'Asia', icon: '🐼', color: '#FF6B6B',
            facts: [
                { icon: '🏆', text: 'Asia is the biggest continent!' },
                { icon: '🏔️', text: 'Mount Everest, the tallest mountain, is here' },
                { icon: '👨‍👩‍👧‍👦', text: 'More people live in Asia than anywhere else' },
                { icon: '🐼', text: 'Giant pandas live in the forests of China' }
            ],
            story: 'Asia is the biggest continent in the whole world! It is home to Mount Everest, the tallest mountain on Earth, way up in the snowy Himalayas. More than half of all the people in the world live in Asia, in countries like India, China, and Japan. You can find fluffy giant pandas munching bamboo, tigers hiding in the jungle, and camels walking across the desert!',
            quizHint: 'The biggest continent, home of pandas'
        },
        {
            id: 'africa', name: 'Africa', icon: '🦁', color: '#FDCB6E',
            facts: [
                { icon: '🏜️', text: 'The Sahara is the biggest hot desert in the world' },
                { icon: '🌊', text: 'The Nile is one of the longest rivers on Earth' },
                { icon: '🦒', text: 'Lions, elephants, and giraffes live here' },
                { icon: '🗺️', text: 'Africa has more countries than any other continent' }
            ],
            story: 'Africa is a giant continent full of amazing animals! On the wide grassy savanna, lions roar, zebras gallop, and tall giraffes nibble leaves from the treetops. Africa has the Sahara, the biggest hot desert in the world, with sand dunes as tall as buildings. The long Nile River flows past the ancient pyramids of Egypt!',
            quizHint: 'Land of lions and the Sahara Desert'
        },
        {
            id: 'north-america', name: 'North America', icon: '🦅', color: '#4ECDC4',
            facts: [
                { icon: '🇺🇸', text: 'The USA, Canada, and Mexico are here' },
                { icon: '🏞️', text: 'The Grand Canyon is a giant canyon carved by a river' },
                { icon: '🧊', text: 'Greenland, the biggest island, is part of it' },
                { icon: '🦅', text: 'Bald eagles soar in the sky here' }
            ],
            story: 'North America is where the USA, Canada, and Mexico are! It has the Grand Canyon, a giant canyon that a river carved out over millions of years. Way up north, it is so cold that polar bears live on the ice, and down south it is warm with sunny beaches. Bald eagles fly high over forests, mountains, and big lakes!',
            quizHint: 'Home of the USA, Canada, and Mexico'
        },
        {
            id: 'south-america', name: 'South America', icon: '🦜', color: '#55EFC4',
            facts: [
                { icon: '🌳', text: 'The Amazon is the biggest rainforest in the world' },
                { icon: '⛰️', text: 'The Andes are the longest mountains on land' },
                { icon: '💦', text: 'Angel Falls is the tallest waterfall' },
                { icon: '🦜', text: 'Colorful parrots and toucans live here' }
            ],
            story: 'South America has the Amazon, the biggest rainforest in the world! It is full of colorful parrots, sleepy sloths, jumping monkeys, and huge snakes. The Andes Mountains run all along one side, and fluffy llamas live up high in them. South America also has Angel Falls, the tallest waterfall on Earth — the water falls almost a whole kilometer!',
            quizHint: 'Home of the Amazon rainforest'
        },
        {
            id: 'europe', name: 'Europe', icon: '🏰', color: '#A29BFE',
            facts: [
                { icon: '🏰', text: 'Europe has thousands of old castles' },
                { icon: '🤏', text: 'Vatican City, the smallest country, is here' },
                { icon: '🗼', text: 'The Eiffel Tower is in Paris, France' },
                { icon: '🍕', text: 'Pizza was invented in Italy!' }
            ],
            story: 'Europe is a small continent packed with lots of countries close together! It has thousands of old castles where kings and queens used to live. You can visit the Eiffel Tower in France, Big Ben in England, and eat yummy pizza in Italy, where it was invented. Europe even has the smallest country in the world, Vatican City!',
            quizHint: 'Land of castles and the Eiffel Tower'
        },
        {
            id: 'australia', name: 'Australia', icon: '🦘', color: '#FD79A8',
            facts: [
                { icon: '🤏', text: 'Australia is the smallest continent' },
                { icon: '🦘', text: 'Kangaroos and koalas live here in the wild' },
                { icon: '🐠', text: 'The Great Barrier Reef is the biggest coral reef' },
                { icon: '🏝️', text: 'It is a country AND a continent!' }
            ],
            story: 'Australia is the smallest continent, and it is also a country! It is the only place where kangaroos hop around in the wild and koalas sleep in eucalyptus trees. Off the coast is the Great Barrier Reef, the biggest coral reef in the world, so big you can see it from space! It is full of bright fish and sea turtles.',
            quizHint: 'The smallest continent, with kangaroos'
        },
        {
            id: 'antarctica', name: 'Antarctica', icon: '🐧', color: '#74B9FF',
            facts: [
                { icon: '🥶', text: 'Antarctica is the coldest place on Earth' },
                { icon: '🧊', text: 'It is almost all covered in thick ice' },
                { icon: '🐧', text: 'Emperor penguins live here' },
                { icon: '🏜️', text: 'It is a desert because it hardly ever rains or snows' }
            ],
            story: 'Antarctica is at the very bottom of the world, and it is the coldest place on Earth! Almost all of it is covered in ice that is thicker than the tallest buildings. No one lives there all the time — only scientists who visit to study it. Emperor penguins huddle together to stay warm, and seals and whales swim in the icy sea!',
            quizHint: 'The coldest continent, with penguins'
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
        html += '<div id="continentsContent"></div>';
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

        var content = container.querySelector('#continentsContent');
        if (currentMode === 'explore') renderExplore(content);
        else renderQuiz(content);

        updateModuleStarDisplay();
    }

    /* --- Explore Mode --- */
    function renderExplore(el) {
        var data = getModuleData(MODULE_ID);
        var explored = data.explored || [];
        var progressPct = Math.min((explored.length / CONTINENTS.length) * 100, 100);

        var html = '<div class="explore-progress">';
        html += '<div class="explore-progress-header">';
        html += '<span>Continents Explored</span>';
        html += '<span>' + explored.length + '/' + CONTINENTS.length + '</span>';
        html += '</div>';
        html += '<div class="math-progress-bar">';
        html += '<div class="math-progress-fill explore-fill" style="width:' + progressPct + '%"></div>';
        html += '</div>';
        if (explored.length === CONTINENTS.length) {
            html += '<div class="explore-complete">All 7 continents explored! You\'re a world explorer! 🌍</div>';
        }
        html += '</div>';

        html += '<div class="continent-globe">🌍</div>';
        html += '<div class="continent-grid">';
        CONTINENTS.forEach(function (c) {
            var isExplored = explored.indexOf(c.id) !== -1;
            html += '<button class="continent-btn' + (isExplored ? ' explored' : '') + '" data-continent="' + c.id + '" style="--c:' + c.color + ';">';
            html += '<span class="continent-btn-icon">' + c.icon + '</span>';
            html += '<span class="continent-btn-name">' + c.name + '</span>';
            if (isExplored) html += '<span class="continent-btn-check">✓</span>';
            html += '</button>';
        });
        html += '</div>';
        html += '<div style="text-align:center;padding:12px 0;color:var(--text-secondary);font-weight:600;font-size:0.9rem;">Tap a continent to explore!</div>';

        el.innerHTML = html;

        el.querySelectorAll('.continent-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                playTapSound();
                openContinentSheet(btn.getAttribute('data-continent'));
            });
        });
    }

    function openContinentSheet(continentId) {
        var c = CONTINENTS.find(function (x) { return x.id === continentId; });
        if (!c) return;

        var data = getModuleData(MODULE_ID);
        var explored = data.explored || [];
        if (explored.indexOf(continentId) === -1) {
            explored.push(continentId);
            updateModuleData(MODULE_ID, { explored: explored, stars: (data.stars || 0) + 1 });
            awardStar();
            setMascot('explore');
            updateModuleStarDisplay();
        }

        var overlay = document.getElementById('sheetOverlay');
        var sheet = document.getElementById('bottomSheet');
        var iconEl = document.getElementById('sheetIcon');
        var nameEl = document.getElementById('sheetName');
        var factsEl = document.getElementById('sheetFacts');

        iconEl.textContent = c.icon;
        nameEl.textContent = c.name;
        nameEl.style.color = c.color;

        var factsHtml = '<div class="planet-story">';
        factsHtml += '<div class="planet-story-label">📖 Story</div>';
        factsHtml += '<div class="planet-story-text">' + c.story + '</div>';
        factsHtml += '</div>';
        factsHtml += '<div class="planet-facts-label">⭐ Fun Facts</div>';
        c.facts.forEach(function (f) {
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
                var content = container.querySelector('#continentsContent');
                if (content) renderExplore(content);
            }
        }

        overlay.addEventListener('click', closeSheet);
    }

    /* --- Quiz Mode (10 questions per round) --- */
    function startNewQuizRound() {
        quizQuestionNum = 0;
        quizCorrectInRound = 0;
        quizQuestions = [];
        var shuffled = shuffle(CONTINENTS);
        for (var i = 0; i < QUIZ_TOTAL; i++) {
            var c = shuffled[i % shuffled.length];
            var others = CONTINENTS.filter(function (x) { return x.id !== c.id; });
            quizQuestions.push({
                continent: c,
                answers: shuffle([c].concat(shuffle(others).slice(0, 3)))
            });
        }
    }

    function renderQuiz(el) {
        quizAnswered = false;

        if (quizQuestionNum >= QUIZ_TOTAL) {
            renderQuizComplete(el);
            return;
        }

        currentQuiz = quizQuestions[quizQuestionNum];
        var q = currentQuiz;
        var progressPct = (quizQuestionNum / QUIZ_TOTAL) * 100;

        var html = '<div class="quiz-progress">';
        html += '<div class="quiz-progress-header">';
        html += '<span>Question ' + (quizQuestionNum + 1) + ' of ' + QUIZ_TOTAL + '</span>';
        html += '<span>' + quizCorrectInRound + ' correct</span>';
        html += '</div>';
        html += '<div class="math-progress-bar">';
        html += '<div class="math-progress-fill quiz-fill" style="width:' + progressPct + '%"></div>';
        html += '</div>';
        html += '</div>';

        html += '<div class="quiz-area">';
        html += '<div class="quiz-prompt">Which continent is this?</div>';
        html += '<div class="quiz-planet-display">' + q.continent.icon + '</div>';
        html += '<div class="quiz-hint">' + q.continent.quizHint + '</div>';
        html += '<div class="answer-grid">';
        q.answers.forEach(function (c) {
            html += '<button class="answer-btn text-answer" data-continent="' + c.id + '">' + c.name + '</button>';
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
        var msg, emoji;
        if (pct === 100) { msg = 'Perfect score! Amazing!'; emoji = '🏆'; }
        else if (pct >= 70) { msg = 'Great job, world explorer!'; emoji = '🌍'; }
        else if (pct >= 40) { msg = 'Good try! Keep learning!'; emoji = '⭐'; }
        else { msg = 'Keep exploring the continents!'; emoji = '💪'; }

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
        setMascot(pct >= 70 ? 'correct' : 'encourage');

        el.querySelector('.quiz-restart-btn').addEventListener('click', function () {
            playTapSound();
            startNewQuizRound();
            renderQuiz(el);
        });
    }

    function onQuizAnswer(btn, el) {
        if (quizAnswered) return;
        playTapSound();

        if (btn.getAttribute('data-continent') === currentQuiz.continent.id) {
            quizAnswered = true;
            btn.classList.add('correct');
            handleCorrectAnswer();
            quizCorrectInRound++;

            var data = getModuleData(MODULE_ID);
            updateModuleData(MODULE_ID, {
                quizCorrect: (data.quizCorrect || 0) + 1,
                quizTotal: (data.quizTotal || 0) + 1,
                stars: (data.stars || 0) + 1
            });
            updateModuleStarDisplay();

            quizQuestionNum++;
            setTimeout(function () { renderQuiz(el); }, 1500);
        } else {
            btn.classList.add('wrong');
            handleWrongAnswer();
            setTimeout(function () { btn.classList.remove('wrong'); }, 500);
            var wrongCount = parseInt(btn.parentElement.getAttribute('data-wrongs') || '0', 10) + 1;
            btn.parentElement.setAttribute('data-wrongs', wrongCount);
            if (wrongCount >= 3) {
                quizQuestionNum++;
                setTimeout(function () { renderQuiz(el); }, 1200);
            }
        }
    }

    function updateModuleStarDisplay() {
        var data = getModuleData(MODULE_ID);
        var el = document.querySelector('#moduleStars .star-count');
        if (el) el.textContent = data.stars || 0;
    }

    registerModule({
        id: MODULE_ID,
        title: 'Continents',
        icon: '🌍',
        color: '#55EFC4',
        category: 'Geography',
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
            var data = getModuleData(MODULE_ID);
            return {
                stars: data.stars || 0,
                detail: (data.explored || []).length + '/' + CONTINENTS.length + ' explored'
            };
        }
    });
})();
