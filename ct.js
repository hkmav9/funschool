/* ct.js - Critical Thinking Stories module */

(function () {
    var STORIES = null;
    var container = null;
    var currentStory = null;
    var currentView = 'list'; // 'list' | 'read' | 'quiz' | 'results'
    var quizIndex = 0;
    var quizScore = 0;
    var quizAnswered = false;

    /* ── Data Loading ──────────────────────────────────────────────── */

    function loadStories(callback) {
        if (STORIES) { callback(STORIES); return; }
        fetch('./ct-stories.json')
            .then(function (r) { return r.json(); })
            .then(function (data) {
                STORIES = data.stories;
                callback(STORIES);
            })
            .catch(function () {
                container.innerHTML = '<div class="ct-error">Could not load stories.</div>';
            });
    }

    /* ── Render Router ─────────────────────────────────────────────── */

    function render() {
        if (!container) return;
        if (currentView === 'list')    renderList();
        else if (currentView === 'read')    renderRead();
        else if (currentView === 'quiz')    renderQuiz();
        else if (currentView === 'results') renderResults();
    }

    /* ── Story List ────────────────────────────────────────────────── */

    function renderList() {
        loadStories(function (stories) {
            var data = getModuleData('critical-thinking');
            var completed = data.completed || {};

            var html = '<div class="ct-list">';
            stories.forEach(function (story) {
                var done = completed[story.id];
                var stars = done ? done.stars : 0;
                var starHtml = '';
                for (var i = 0; i < 3; i++) {
                    starHtml += '<span class="ct-mini-star' + (i < stars ? ' filled' : '') + '">★</span>';
                }
                html += '<div class="ct-card" data-id="' + story.id + '">';
                html += '<span class="ct-card-icon">' + story.icon + '</span>';
                html += '<div class="ct-card-info">';
                html += '<div class="ct-card-title">' + story.title + '</div>';
                html += '<div class="ct-card-meta">Level ' + story.level + ' · ' + story.readingTime + '</div>';
                html += '<div class="ct-card-stars">' + starHtml + '</div>';
                html += '</div>';
                if (done) html += '<span class="ct-card-badge">✓</span>';
                html += '</div>';
            });
            html += '</div>';

            container.innerHTML = html;

            container.querySelectorAll('.ct-card').forEach(function (card) {
                card.addEventListener('click', function () {
                    playTapSound();
                    var id = card.getAttribute('data-id');
                    currentStory = stories.find(function (s) { return s.id === id; });
                    currentView = 'read';
                    render();
                });
            });
        });
    }

    /* ── Story Reader ──────────────────────────────────────────────── */

    function renderRead() {
        var s = currentStory;
        var paragraphs = s.story.split('\n').filter(function (p) { return p.trim(); });

        var html = '<div class="ct-read">';
        html += '<button class="ct-back-btn" id="ctBackBtn">← Stories</button>';
        html += '<div class="ct-story-header">';
        html += '<span class="ct-story-icon">' + s.icon + '</span>';
        html += '<h2 class="ct-story-title">' + s.title + '</h2>';
        html += '</div>';
        html += '<div class="ct-story-body">';
        paragraphs.forEach(function (p) {
            html += '<p>' + p + '</p>';
        });
        html += '</div>';
        html += '<button class="ct-ready-btn" id="ctReadyBtn">I\'m Ready! 🧠</button>';
        html += '</div>';

        container.innerHTML = html;

        document.getElementById('ctBackBtn').addEventListener('click', function () {
            playTapSound();
            currentView = 'list';
            render();
        });

        document.getElementById('ctReadyBtn').addEventListener('click', function () {
            playTapSound();
            quizIndex = 0;
            quizScore = 0;
            quizAnswered = false;
            currentView = 'quiz';
            render();
        });
    }

    /* ── Quiz ──────────────────────────────────────────────────────── */

    function renderQuiz() {
        var s = currentStory;
        var q = s.questions[quizIndex];
        var total = s.questions.length;

        var html = '<div class="ct-quiz">';
        html += '<div class="ct-quiz-top">';
        html += '<button class="ct-back-btn" id="ctQuizBackBtn">← Stories</button>';
        html += '<div class="ct-quiz-counter">' + (quizIndex + 1) + ' of ' + total + '</div>';
        html += '</div>';

        var pct = (quizIndex / total) * 100;
        html += '<div class="ct-quiz-bar"><div class="ct-quiz-bar-fill" style="width:' + pct + '%"></div></div>';

        html += '<div class="ct-quiz-question">🤔 ' + q.question + '</div>';
        if (q.hint) {
            html += '<div class="ct-quiz-hint">💡 ' + q.hint + '</div>';
        }

        html += '<div class="ct-quiz-options">';
        q.options.forEach(function (opt, i) {
            html += '<button class="ct-option-btn" data-index="' + i + '">' + opt + '</button>';
        });
        html += '</div>';
        html += '</div>';

        container.innerHTML = html;
        quizAnswered = false;
        setMascot('thinking');

        document.getElementById('ctQuizBackBtn').addEventListener('click', function () {
            playTapSound();
            currentView = 'list';
            render();
        });

        container.querySelectorAll('.ct-option-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                onQuizAnswer(btn, q);
            });
        });
    }

    function onQuizAnswer(btn, q) {
        if (quizAnswered) return;
        quizAnswered = true;
        playTapSound();

        var chosen = parseInt(btn.getAttribute('data-index'), 10);
        var allBtns = container.querySelectorAll('.ct-option-btn');

        if (chosen === q.correct) {
            btn.classList.add('correct');
            quizScore++;
            handleCorrectAnswer();
        } else {
            btn.classList.add('wrong');
            allBtns[q.correct].classList.add('correct');
            handleWrongAnswer();
        }

        // Disable all buttons
        allBtns.forEach(function (b) { b.disabled = true; });

        var total = currentStory.questions.length;
        setTimeout(function () {
            quizIndex++;
            if (quizIndex < total) {
                currentView = 'quiz';
                render();
            } else {
                currentView = 'results';
                render();
            }
        }, 1400);
    }

    /* ── Results ───────────────────────────────────────────────────── */

    function renderResults() {
        var total = currentStory.questions.length;
        var stars = quizScore >= total ? 3 : quizScore >= Math.ceil(total / 2) ? 2 : 1;

        // Save progress — only add star improvement to avoid double-counting
        var data = getModuleData('critical-thinking');
        var completed = data.completed || {};
        var prevStars = (completed[currentStory.id] || {}).stars || 0;
        var starGain = Math.max(0, stars - prevStars);

        completed[currentStory.id] = { stars: stars };
        var newTotalStars = (data.stars || 0) + starGain;
        updateModuleData('critical-thinking', { completed: completed, stars: newTotalStars });
        if (starGain > 0) addStars(starGain);
        updateModuleStarDisplay();

        if (stars === 3) {
            showConfetti();
            playLevelUpSound();
            setMascot('correct');
        } else {
            playCorrectSound();
            setMascot('correct');
        }

        var starsHtml = '';
        for (var i = 0; i < 3; i++) {
            starsHtml += '<span class="ct-result-star' + (i < stars ? ' filled' : '') + '">★</span>';
        }

        var msg = stars === 3 ? 'Perfect! You got everything right! 🏆'
                : stars === 2 ? 'Great thinking! Almost perfect! 🌟'
                : 'Good try! Reading again might help! 💪';

        var html = '<div class="ct-results">';
        html += '<div class="ct-results-icon">' + currentStory.icon + '</div>';
        html += '<div class="ct-results-title">' + currentStory.title + '</div>';
        html += '<div class="ct-results-stars">' + starsHtml + '</div>';
        html += '<div class="ct-results-score">' + quizScore + ' / ' + total + ' correct</div>';
        html += '<div class="ct-results-msg">' + msg + '</div>';
        html += '<div class="ct-results-actions">';
        html += '<button class="ct-retry-btn" id="ctRetryBtn">Try Again 🔄</button>';
        html += '<button class="ct-ready-btn" id="ctDoneBtn">More Stories →</button>';
        html += '</div>';
        html += '</div>';

        container.innerHTML = html;

        document.getElementById('ctRetryBtn').addEventListener('click', function () {
            playTapSound();
            quizIndex = 0;
            quizScore = 0;
            quizAnswered = false;
            currentView = 'quiz';
            render();
        });

        document.getElementById('ctDoneBtn').addEventListener('click', function () {
            playTapSound();
            currentView = 'list';
            render();
        });
    }

    /* ── Helpers ───────────────────────────────────────────────────── */

    function updateModuleStarDisplay() {
        var data = getModuleData('critical-thinking');
        var el = document.querySelector('#moduleStars .star-count');
        if (el) el.textContent = data.stars || 0;
    }

    /* ── Module Registration ───────────────────────────────────────── */

    registerModule({
        id: 'critical-thinking',
        title: 'Critical Thinking',
        icon: '🧠',
        color: '#6C5CE7',
        category: 'Thinking',
        init: function (el) {
            container = el;
            currentView = 'list';
            render();
            updateModuleStarDisplay();
        },
        cleanup: function () {
            container = null;
            currentStory = null;
            currentView = 'list';
            quizIndex = 0;
            quizScore = 0;
        },
        getProgress: function () {
            var data = getModuleData('critical-thinking');
            var doneCount = Object.keys(data.completed || {}).length;
            return {
                stars: data.stars || 0,
                detail: doneCount + ' ' + (doneCount === 1 ? 'story' : 'stories') + ' done'
            };
        }
    });

})();
