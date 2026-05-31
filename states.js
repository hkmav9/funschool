/* states.js - USA States module */

(function () {
    var STATES_DATA = null;
    var container = null;
    var currentMode = 'explore'; // 'explore' | 'quiz'
    var currentView = 'letters'; // 'letters' | 'list' | 'detail'
    var currentLetter = null;
    var currentState = null;

    // Quiz state
    var quizQuestions = [];
    var quizIndex = 0;
    var quizScore = 0;
    var quizAnswered = false;
    var QUIZ_LENGTH = 8;

    var LETTER_COLORS = [
        '#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB', '#FF9FF3',
        '#54A0FF', '#5F27CD', '#00D2D3', '#1DD1A1', '#FF6B81',
        '#A29BFE', '#FD79A8', '#FDCB6E', '#6C5CE7', '#00B894',
        '#E17055', '#74B9FF', '#55EFC4', '#FAB1A0', '#0984E3',
        '#B2BEC3', '#D63031', '#00CEC9', '#E84393', '#81ECEC', '#2D3436'
    ];

    var EMPTY_LETTERS = { B: true, E: true, J: true, Q: true, X: true, Y: true, Z: true };
    var LETTER_LETTERS = EMPTY_LETTERS;

    /* ── Data Loading ──────────────────────────────────────────────── */

    function loadStates(callback) {
        if (STATES_DATA) { callback(STATES_DATA); return; }
        fetch('./states-data.json')
            .then(function (r) { return r.json(); })
            .then(function (data) { STATES_DATA = data.states; callback(STATES_DATA); })
            .catch(function () { if (container) container.innerHTML = '<div class="states-error">Could not load states.</div>'; });
    }

    /* ── Render Router ─────────────────────────────────────────────── */

    function render() {
        if (!container) return;
        var html = '<div class="mode-tabs">';
        html += '<button class="mode-tab' + (currentMode === 'explore' ? ' active' : '') + '" data-mode="explore">🗺️ Explore</button>';
        html += '<button class="mode-tab' + (currentMode === 'quiz'    ? ' active' : '') + '" data-mode="quiz">🧠 Quiz</button>';
        html += '</div>';
        html += '<div id="statesContent"></div>';
        container.innerHTML = html;

        container.querySelectorAll('.mode-tab').forEach(function (tab) {
            tab.addEventListener('click', function () {
                var m = tab.getAttribute('data-mode');
                if (m === currentMode) return;
                playTapSound();
                currentMode = m;
                if (m === 'quiz') { loadStates(function (states) { startQuiz(states); }); return; }
                render();
            });
        });

        var content = document.getElementById('statesContent');
        if (currentMode === 'explore') {
            if (currentView === 'letters')    renderLetters(content);
            else if (currentView === 'list')  renderList(content);
            else if (currentView === 'detail') renderDetail(content);
        } else {
            renderQuiz(content);
        }
    }

    /* ── Letter Grid ───────────────────────────────────────────────── */

    function renderLetters(el) {
        var html = '<div class="states-letters-wrap">';
        html += '<div class="states-letters-title">Tap a letter!</div>';
        html += '<div class="states-letter-grid">';
        for (var i = 0; i < 26; i++) {
            var letter = String.fromCharCode(65 + i);
            var isEmpty = LETTER_LETTERS[letter];
            var color = LETTER_COLORS[i];
            if (isEmpty) {
                html += '<div class="states-letter-tile empty" style="--lc:' + color + '">' + letter + '</div>';
            } else {
                html += '<div class="states-letter-tile" data-letter="' + letter + '" style="--lc:' + color + '">' + letter + '</div>';
            }
        }
        html += '</div>';
        html += '<div class="states-letters-hint">Grey letters have no states</div>';
        html += '</div>';
        el.innerHTML = html;

        el.querySelectorAll('.states-letter-tile:not(.empty)').forEach(function (tile) {
            tile.addEventListener('click', function () {
                playTapSound();
                currentLetter = tile.getAttribute('data-letter');
                currentView = 'list';
                var c = document.getElementById('statesContent');
                if (c) loadStates(function () { renderList(c); });
            });
        });
    }

    /* ── State List for a Letter ───────────────────────────────────── */

    function renderList(el) {
        loadStates(function (states) {
            var filtered = states.filter(function (s) { return s.name.charAt(0) === currentLetter; });
            var data = getModuleData('usa-states');
            var visited = data.visited || [];

            var html = '<div class="states-list-wrap">';
            html += '<button class="states-back-btn" id="statesBackToLetters">← Letters</button>';
            html += '<div class="states-list-header">' + currentLetter + ' States</div>';
            html += '<div class="states-list">';
            filtered.forEach(function (state) {
                var isVisited = visited.indexOf(state.abbr) !== -1;
                html += '<div class="states-state-card" data-abbr="' + state.abbr + '" style="--sc:' + state.color + '">';
                html += '<div class="states-state-emoji">' + state.emoji + '</div>';
                html += '<div class="states-state-info">';
                html += '<div class="states-state-name">' + state.name + '</div>';
                html += '<div class="states-state-abbr">' + state.abbr + '</div>';
                html += '</div>';
                if (isVisited) html += '<span class="states-visited-badge">⭐</span>';
                html += '</div>';
            });
            html += '</div></div>';
            el.innerHTML = html;

            document.getElementById('statesBackToLetters').addEventListener('click', function () {
                playTapSound();
                currentView = 'letters';
                var c = document.getElementById('statesContent');
                if (c) renderLetters(c);
            });

            el.querySelectorAll('.states-state-card').forEach(function (card) {
                card.addEventListener('click', function () {
                    playTapSound();
                    var abbr = card.getAttribute('data-abbr');
                    currentState = states.find(function (s) { return s.abbr === abbr; });
                    currentView = 'detail';
                    var c = document.getElementById('statesContent');
                    if (c) renderDetail(c);
                });
            });
        });
    }

    /* ── State Detail ──────────────────────────────────────────────── */

    function renderDetail(el) {
        var s = currentState;
        var data = getModuleData('usa-states');
        var visited = data.visited ? data.visited.slice() : [];
        var isNew = visited.indexOf(s.abbr) === -1;
        if (isNew) {
            visited.push(s.abbr);
            updateModuleData('usa-states', { visited: visited, stars: (data.stars || 0) + 1 });
            addStars(1);
            updateModuleStarDisplay();
        }

        var factEmojis = ['🌟', '🎯', '💡', '🔥'];
        var html = '<div class="states-detail-wrap">';
        html += '<div class="states-detail-nav">';
        html += '<button class="states-back-btn" id="statesBackToList">← ' + currentLetter + ' States</button>';
        html += '<span class="states-detail-abbr">' + s.abbr + '</span>';
        html += '</div>';

        html += '<div class="states-hero-card" style="background:linear-gradient(135deg,' + s.color + 'CC,' + s.color + '88)">';
        html += '<div class="states-hero-emoji">' + s.emoji + '</div>';
        html += '<div class="states-hero-name">' + s.name + '</div>';
        html += '</div>';

        html += '<div class="states-capital-row">';
        html += '<span class="states-capital-icon">🏛️</span>';
        html += '<div><div class="states-capital-label">Capital City</div><div class="states-capital-name">' + s.capital + '</div></div>';
        html += '</div>';

        html += '<div class="states-facts-label">Fun Facts!</div>';
        html += '<div class="states-facts-list">';
        s.facts.forEach(function (fact, i) {
            html += '<div class="states-fact-card">';
            html += '<span class="states-fact-emoji">' + (factEmojis[i] || '⭐') + '</span>';
            html += '<div class="states-fact-text">' + fact + '</div>';
            html += '</div>';
        });
        html += '</div>';

        // Quiz this state button
        html += '<button class="states-quiz-this-btn" id="statesQuizThis" style="background:' + s.color + '">🧠 Quiz me on ' + s.name + '!</button>';

        if (isNew) html += '<div class="states-new-badge">New state explored! ⭐</div>';
        html += '</div>';
        el.innerHTML = html;

        if (isNew) setTimeout(function () { playCorrectSound(); setMascot('correct'); }, 200);

        document.getElementById('statesBackToList').addEventListener('click', function () {
            playTapSound();
            currentView = 'list';
            var c = document.getElementById('statesContent');
            if (c) renderList(c);
        });

        document.getElementById('statesQuizThis').addEventListener('click', function () {
            playTapSound();
            currentMode = 'quiz';
            loadStates(function (states) { startQuiz(states, s); });
            render();
        });
    }

    /* ── Quiz Mode ─────────────────────────────────────────────────── */

    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    function startQuiz(states, focusState) {
        quizIndex = 0;
        quizScore = 0;
        quizAnswered = false;
        quizQuestions = buildQuizQuestions(states, focusState);
        var c = document.getElementById('statesContent');
        if (c) renderQuiz(c);
    }

    function buildQuizQuestions(states, focusState) {
        var pool = shuffle(states).slice(0, QUIZ_LENGTH);
        // If focusState given, make sure it's in the pool
        if (focusState) {
            pool[0] = focusState;
            pool = shuffle(pool);
        }
        return pool.map(function (state) {
            // Alternate between capital and fact questions
            var useCapital = Math.random() > 0.4;
            if (useCapital) {
                return buildCapitalQuestion(state, states);
            } else {
                return buildFactQuestion(state, states);
            }
        });
    }

    function buildCapitalQuestion(state, allStates) {
        var wrongCaps = shuffle(allStates.filter(function (s) { return s.abbr !== state.abbr; }))
            .slice(0, 3).map(function (s) { return s.capital; });
        return {
            type: 'capital',
            prompt: 'What is the capital of',
            stateName: state.name,
            stateEmoji: state.emoji,
            stateColor: state.color,
            correct: state.capital,
            answers: shuffle([state.capital].concat(wrongCaps))
        };
    }

    function buildFactQuestion(state, allStates) {
        var fact = state.facts[Math.floor(Math.random() * state.facts.length)];
        var wrongNames = shuffle(allStates.filter(function (s) { return s.abbr !== state.abbr; }))
            .slice(0, 3).map(function (s) { return s.name; });
        return {
            type: 'fact',
            prompt: 'Which state is this about?',
            fact: fact,
            stateEmoji: state.emoji,
            stateColor: state.color,
            correct: state.name,
            answers: shuffle([state.name].concat(wrongNames))
        };
    }

    function renderQuiz(el) {
        if (!quizQuestions.length) {
            loadStates(function (states) { startQuiz(states); });
            return;
        }

        if (quizIndex >= quizQuestions.length) {
            renderQuizResults(el);
            return;
        }

        var q = quizQuestions[quizIndex];
        var progressPct = Math.round((quizIndex / quizQuestions.length) * 100);

        var html = '<div class="sq-wrap">';
        html += '<div class="sq-progress-row">';
        html += '<span class="sq-counter">' + (quizIndex + 1) + ' / ' + quizQuestions.length + '</span>';
        html += '<div class="sq-score-badge">⭐ ' + quizScore + '</div>';
        html += '</div>';
        html += '<div class="sq-progress-bar"><div class="sq-progress-fill" style="width:' + progressPct + '%;background:' + (q.stateColor || '#0984E3') + '"></div></div>';

        html += '<div class="sq-question-card" style="border-color:' + (q.stateColor || '#0984E3') + '22">';
        html += '<div class="sq-state-emoji">' + q.stateEmoji + '</div>';
        if (q.type === 'capital') {
            html += '<div class="sq-prompt">' + q.prompt + '</div>';
            html += '<div class="sq-state-name">' + q.stateName + '</div>';
            html += '<div class="sq-sub-prompt">Pick the capital city 🏛️</div>';
        } else {
            html += '<div class="sq-prompt">' + q.prompt + '</div>';
            html += '<div class="sq-fact-bubble">"' + q.fact + '"</div>';
        }
        html += '</div>';

        html += '<div class="sq-answer-grid">';
        q.answers.forEach(function (ans) {
            html += '<button class="sq-btn" data-ans="' + ans + '">' + ans + '</button>';
        });
        html += '</div>';
        html += '</div>';
        el.innerHTML = html;

        quizAnswered = false;
        el.querySelectorAll('.sq-btn').forEach(function (btn) {
            btn.addEventListener('click', function () { onQuizAnswer(btn, q, el); });
        });
    }

    function onQuizAnswer(btn, q, el) {
        if (quizAnswered) return;
        quizAnswered = true;
        playTapSound();
        var chosen = btn.getAttribute('data-ans');
        var isCorrect = chosen === q.correct;

        el.querySelectorAll('.sq-btn').forEach(function (b) {
            if (b.getAttribute('data-ans') === q.correct) b.classList.add('sq-correct');
            else if (b === btn && !isCorrect) b.classList.add('sq-wrong');
        });

        if (isCorrect) {
            quizScore++;
            handleCorrectAnswer();
        } else {
            handleWrongAnswer();
            // Show the correct answer label
            var hint = el.querySelector('.sq-wrap');
            if (hint) {
                var note = document.createElement('div');
                note.className = 'sq-hint-note';
                note.innerHTML = '✅ The answer is: <b>' + q.correct + '</b>';
                hint.appendChild(note);
            }
        }

        setTimeout(function () {
            quizIndex++;
            var c = document.getElementById('statesContent');
            if (c) renderQuiz(c);
        }, 1400);
    }

    function renderQuizResults(el) {
        var pct = Math.round((quizScore / quizQuestions.length) * 100);
        var medal = pct >= 90 ? '🥇' : pct >= 70 ? '🥈' : pct >= 50 ? '🥉' : '📚';
        var msg = pct >= 90 ? 'Amazing! You\'re a geography genius!' :
                  pct >= 70 ? 'Great job! Keep exploring!' :
                  pct >= 50 ? 'Good effort! Try again to improve!' :
                              'Keep learning — explore more states!';

        // Award a star for completing quiz
        var data = getModuleData('usa-states');
        updateModuleData('usa-states', { stars: (data.stars || 0) + 1 });
        awardStar();
        updateModuleStarDisplay();

        var html = '<div class="sq-results">';
        html += '<div class="sq-medal">' + medal + '</div>';
        html += '<div class="sq-result-score">' + quizScore + ' / ' + quizQuestions.length + '</div>';
        html += '<div class="sq-result-pct">' + pct + '% correct</div>';
        html += '<div class="sq-result-msg">' + msg + '</div>';

        // Show what they got wrong
        var wrongs = quizQuestions.filter(function (q, i) { return i >= 0; }); // all questions for review
        html += '<div class="sq-review-label">Quick Review</div>';
        html += '<div class="sq-review-list">';
        quizQuestions.forEach(function (q) {
            if (q.type === 'capital') {
                html += '<div class="sq-review-row"><span>' + q.stateName + '</span><span class="sq-review-answer">→ ' + q.correct + '</span></div>';
            }
        });
        html += '</div>';

        html += '<button class="sq-retry-btn" id="sqRetry">🔄 Play Again</button>';
        html += '<button class="sq-explore-btn" id="sqExplore">🗺️ Explore States</button>';
        html += '</div>';
        el.innerHTML = html;

        if (pct >= 70) { showConfetti(); }

        document.getElementById('sqRetry').addEventListener('click', function () {
            playTapSound();
            loadStates(function (states) { startQuiz(states); });
        });
        document.getElementById('sqExplore').addEventListener('click', function () {
            playTapSound();
            currentMode = 'explore';
            currentView = 'letters';
            render();
        });
    }

    /* ── Helpers ───────────────────────────────────────────────────── */

    function updateModuleStarDisplay() {
        var el = document.querySelector('#moduleStars .star-count');
        if (el) el.textContent = getModuleData('usa-states').stars || 0;
    }

    /* ── Module Registration ───────────────────────────────────────── */

    registerModule({
        id: 'usa-states',
        title: 'USA States',
        icon: '🗺️',
        color: '#0984E3',
        category: 'Geography',
        init: function (el) {
            container = el;
            currentMode = 'explore';
            currentView = 'letters';
            currentLetter = null;
            currentState = null;
            render();
            updateModuleStarDisplay();
        },
        cleanup: function () {
            container = null;
            currentMode = 'explore';
            currentView = 'letters';
            currentLetter = null;
            currentState = null;
        },
        getProgress: function () {
            var data = getModuleData('usa-states');
            var count = (data.visited || []).length;
            return { stars: data.stars || 0, detail: count + ' / 50 states explored' };
        }
    });

})();
