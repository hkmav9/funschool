/* mythology.js - Mythology module: illustrated storybook chapters with a moral */

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
        fetch('./mythology-stories.json')
            .then(function (r) { return r.json(); })
            .then(function (data) {
                STORIES = data.stories;
                callback(STORIES);
            })
            .catch(function () {
                container.innerHTML = '<div class="myth-error">Could not load stories.</div>';
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
            var data = getModuleData('mythology');
            var completed = data.completed || {};

            var html = '';

            html += '<div class="myth-banner">';
            html += '  <div class="myth-banner-sparkles" aria-hidden="true">📜 ✨ 🏹 ✨ 📜</div>';
            html += '  <div class="myth-banner-title">Mythology</div>';
            html += '  <div class="myth-banner-sub">Epic tales from long ago, retold chapter by chapter</div>';
            html += '</div>';

            var seriesSeen = {};
            html += '<div class="myth-list">';
            stories.forEach(function (story) {
                var done = completed[story.id];
                var stars = done ? done.stars : 0;
                var starHtml = '';
                for (var i = 0; i < 3; i++) {
                    starHtml += '<span class="myth-mini-star' + (i < stars ? ' filled' : '') + '">★</span>';
                }

                if (story.series && !seriesSeen[story.series]) {
                    seriesSeen[story.series] = true;
                    html += '<div class="myth-series-label">📖 ' + story.series + '</div>';
                }

                html += '<div class="myth-card" data-id="' + story.id + '">';
                html += '<span class="myth-card-icon">' + story.icon + '</span>';
                html += '<div class="myth-card-info">';
                if (story.chapter) {
                    html += '<div class="myth-card-chapter">Chapter ' + story.chapter + ' of ' + story.chapterTotal + '</div>';
                }
                html += '<div class="myth-card-title">' + story.title + '</div>';
                html += '<div class="myth-card-meta">Level ' + story.level + ' · ' + story.readingTime + '</div>';
                html += '<div class="myth-card-stars">' + starHtml + '</div>';
                html += '</div>';
                if (done) html += '<span class="myth-card-badge">✓</span>';
                html += '</div>';
            });
            html += '</div>';

            container.innerHTML = html;

            container.querySelectorAll('.myth-card').forEach(function (card) {
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

        var html = '<div class="myth-read">';
        html += '<button class="myth-back-btn" id="mythBackBtn">← Mythology</button>';
        html += '<div class="myth-story-header">';
        html += '<span class="myth-story-icon">' + s.icon + '</span>';
        if (s.chapter) {
            html += '<div class="myth-story-chapter">' + s.series + ' · Chapter ' + s.chapter + ' of ' + s.chapterTotal + '</div>';
        }
        html += '<h2 class="myth-story-title">' + s.title + '</h2>';
        html += '</div>';
        html += '<div class="myth-story-body">';
        paragraphs.forEach(function (p) {
            html += '<p>' + p + '</p>';
        });
        html += '</div>';

        if (s.moral) {
            html += '<div class="myth-moral-card">';
            html += '  <div class="myth-moral-label">✨ Moral of the Story</div>';
            html += '  <div class="myth-moral-text">' + s.moral + '</div>';
            html += '</div>';
        }

        html += '<button class="myth-ready-btn" id="mythReadyBtn">I\'m Ready! 🧠</button>';
        html += '</div>';

        container.innerHTML = html;

        document.getElementById('mythBackBtn').addEventListener('click', function () {
            playTapSound();
            currentView = 'list';
            render();
        });

        document.getElementById('mythReadyBtn').addEventListener('click', function () {
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

        var html = '<div class="myth-quiz">';
        html += '<div class="myth-quiz-top">';
        html += '<button class="myth-back-btn" id="mythQuizBackBtn">← Mythology</button>';
        html += '<div class="myth-quiz-counter">' + (quizIndex + 1) + ' of ' + total + '</div>';
        html += '</div>';

        var pct = (quizIndex / total) * 100;
        html += '<div class="myth-quiz-bar"><div class="myth-quiz-bar-fill" style="width:' + pct + '%"></div></div>';

        html += '<div class="myth-quiz-question">🤔 ' + q.question + '</div>';
        if (q.hint) {
            html += '<div class="myth-quiz-hint">💡 ' + q.hint + '</div>';
        }

        html += '<div class="myth-quiz-options">';
        q.options.forEach(function (opt, i) {
            html += '<button class="myth-option-btn" data-index="' + i + '">' + opt + '</button>';
        });
        html += '</div>';
        html += '</div>';

        container.innerHTML = html;
        quizAnswered = false;
        setMascot('thinking');

        document.getElementById('mythQuizBackBtn').addEventListener('click', function () {
            playTapSound();
            currentView = 'list';
            render();
        });

        container.querySelectorAll('.myth-option-btn').forEach(function (btn) {
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
        var allBtns = container.querySelectorAll('.myth-option-btn');

        if (chosen === q.correct) {
            btn.classList.add('correct');
            quizScore++;
            handleCorrectAnswer();
        } else {
            btn.classList.add('wrong');
            allBtns[q.correct].classList.add('correct');
            handleWrongAnswer();
        }

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

        var data = getModuleData('mythology');
        var completed = data.completed || {};
        var prevStars = (completed[currentStory.id] || {}).stars || 0;
        var starGain = Math.max(0, stars - prevStars);

        completed[currentStory.id] = { stars: stars };
        var newTotalStars = (data.stars || 0) + starGain;
        updateModuleData('mythology', { completed: completed, stars: newTotalStars });
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
            starsHtml += '<span class="myth-result-star' + (i < stars ? ' filled' : '') + '">★</span>';
        }

        var msg = stars === 3 ? 'Perfect! You know this chapter by heart! 🏆'
                : stars === 2 ? 'Great thinking! Almost perfect! 🌟'
                : 'Good try! Reading it again might help! 💪';

        var html = '<div class="myth-results">';
        html += '<div class="myth-results-icon">' + currentStory.icon + '</div>';
        html += '<div class="myth-results-title">' + currentStory.title + '</div>';
        html += '<div class="myth-results-stars">' + starsHtml + '</div>';
        html += '<div class="myth-results-score">' + quizScore + ' / ' + total + ' correct</div>';
        html += '<div class="myth-results-msg">' + msg + '</div>';

        if (currentStory.moral) {
            html += '<div class="myth-moral-card myth-moral-card-small">';
            html += '  <div class="myth-moral-label">✨ Remember</div>';
            html += '  <div class="myth-moral-text">' + currentStory.moral + '</div>';
            html += '</div>';
        }

        html += '<div class="myth-results-actions">';
        html += '<button class="myth-retry-btn" id="mythRetryBtn">Try Again 🔄</button>';
        html += '<button class="myth-ready-btn" id="mythDoneBtn">More Chapters →</button>';
        html += '</div>';
        html += '</div>';

        container.innerHTML = html;

        document.getElementById('mythRetryBtn').addEventListener('click', function () {
            playTapSound();
            quizIndex = 0;
            quizScore = 0;
            quizAnswered = false;
            currentView = 'quiz';
            render();
        });

        document.getElementById('mythDoneBtn').addEventListener('click', function () {
            playTapSound();
            currentView = 'list';
            render();
        });
    }

    /* ── Helpers ───────────────────────────────────────────────────── */

    function updateModuleStarDisplay() {
        var data = getModuleData('mythology');
        var el = document.querySelector('#moduleStars .star-count');
        if (el) el.textContent = data.stars || 0;
    }

    /* ── Module Registration ───────────────────────────────────────── */

    registerModule({
        id: 'mythology',
        title: 'Mythology',
        icon: '📜',
        color: '#B45309',
        category: 'Story Time',
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
            var data = getModuleData('mythology');
            var doneCount = Object.keys(data.completed || {}).length;
            return {
                stars: data.stars || 0,
                detail: doneCount + ' ' + (doneCount === 1 ? 'chapter' : 'chapters') + ' done'
            };
        }
    });

})();
