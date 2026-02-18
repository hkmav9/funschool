/* math.js - Math Addition module */

(function () {
    var VISUAL_OBJECTS = ['🍎', '⭐', '💜', '🌸', '🐟', '🍪', '🦋', '🍊'];
    var LEVEL_UP_THRESHOLD = 10;
    var currentQuestion = null;
    var container = null;
    var answered = false;

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
        }
        return a;
    }

    function getMaxNum() {
        var data = getModuleData('math-addition');
        return (data.level || 1) === 1 ? 5 : 10;
    }

    function generateQuestion() {
        var maxNum = getMaxNum();
        var a = randomInt(1, maxNum);
        var b = randomInt(1, maxNum);
        var correct = a + b;
        var emoji = VISUAL_OBJECTS[Math.floor(Math.random() * VISUAL_OBJECTS.length)];

        var distractors = new Set();
        var attempts = 0;
        while (distractors.size < 3 && attempts < 50) {
            var d = correct + randomInt(-3, 3);
            if (d !== correct && d > 0 && d <= maxNum * 2) {
                distractors.add(d);
            }
            attempts++;
        }
        // Fallback: fill with sequential numbers if needed
        var fallback = 1;
        while (distractors.size < 3) {
            if (fallback !== correct) distractors.add(fallback);
            fallback++;
        }

        return {
            a: a,
            b: b,
            correct: correct,
            answers: shuffle([correct].concat(Array.from(distractors).slice(0, 3))),
            emoji: emoji
        };
    }

    function renderQuestion() {
        if (!container) return;
        answered = false;
        currentQuestion = generateQuestion();
        var q = currentQuestion;
        var data = getModuleData('math-addition');
        var level = data.level || 1;

        var correctCount = data.correctCount || 0;
        var progressPct = level === 1 ? Math.min((correctCount / LEVEL_UP_THRESHOLD) * 100, 100) : 100;

        var html = '';
        html += '<div class="math-question">';
        html += '<div class="math-question-text">' + q.a + ' + ' + q.b + ' = ?</div>';
        html += '<div class="math-level-badge">Level ' + level + (level === 1 ? ' (1-5)' : ' (1-10)') + '</div>';
        if (level === 1) {
            html += '<div class="math-progress">';
            html += '<div class="math-progress-bar">';
            html += '<div class="math-progress-fill" style="width:' + progressPct + '%"></div>';
            html += '</div>';
            html += '<div class="math-progress-label">' + correctCount + '/' + LEVEL_UP_THRESHOLD + ' to Level 2</div>';
            html += '</div>';
        }
        html += '</div>';

        // Visual objects
        html += '<div class="visual-objects">';
        html += '<div class="visual-group">';
        for (var i = 0; i < q.a; i++) {
            html += '<span class="visual-object" style="animation-delay:' + (i * 0.06) + 's">' + q.emoji + '</span>';
        }
        html += '</div>';
        html += '<span class="visual-plus">+</span>';
        html += '<div class="visual-group">';
        for (var j = 0; j < q.b; j++) {
            html += '<span class="visual-object" style="animation-delay:' + ((q.a + j) * 0.06) + 's">' + q.emoji + '</span>';
        }
        html += '</div>';
        html += '</div>';

        // Answer buttons
        html += '<div class="answer-grid">';
        for (var k = 0; k < q.answers.length; k++) {
            html += '<button class="answer-btn" data-value="' + q.answers[k] + '">' + q.answers[k] + '</button>';
        }
        html += '</div>';

        container.innerHTML = html;
        setMascot('thinking');

        // Attach listeners
        var btns = container.querySelectorAll('.answer-btn');
        btns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                onAnswer(btn);
            });
        });
    }

    function onAnswer(btn) {
        if (answered) return;
        var value = parseInt(btn.getAttribute('data-value'), 10);
        playTapSound();

        if (value === currentQuestion.correct) {
            answered = true;
            btn.classList.add('correct');
            handleCorrectAnswer();

            // Update progress
            var data = getModuleData('math-addition');
            var newCorrect = (data.correctCount || 0) + 1;
            var newTotal = (data.totalAttempts || 0) + 1;
            var newStars = (data.stars || 0) + 1;
            var level = data.level || 1;

            var updates = {
                correctCount: newCorrect,
                totalAttempts: newTotal,
                stars: newStars
            };

            // Check level up
            if (level === 1 && newCorrect >= LEVEL_UP_THRESHOLD) {
                updates.level = 2;
                updates.correctCount = 0; // reset for new level
                setTimeout(function () {
                    setMascot('levelup');
                    playLevelUpSound();
                    var badge = container.querySelector('.math-level-badge');
                    if (badge) {
                        badge.textContent = 'Level 2 (1-10)';
                        badge.classList.add('level-up');
                    }
                }, 600);
            }

            updateModuleData('math-addition', updates);
            updateModuleStarDisplay();

            // Next question after delay
            setTimeout(renderQuestion, 1800);
        } else {
            btn.classList.add('wrong');
            handleWrongAnswer();
            setTimeout(function () {
                btn.classList.remove('wrong');
            }, 500);
        }
    }

    function updateModuleStarDisplay() {
        var data = getModuleData('math-addition');
        var el = document.querySelector('#moduleStars .star-count');
        if (el) el.textContent = data.stars || 0;
    }

    registerModule({
        id: 'math-addition',
        title: 'Addition',
        icon: '➕',
        color: '#FF6B6B',
        category: 'Math',
        init: function (el) {
            container = el;
            renderQuestion();
            updateModuleStarDisplay();
        },
        cleanup: function () {
            container = null;
            currentQuestion = null;
        },
        getProgress: function () {
            var data = getModuleData('math-addition');
            return {
                stars: data.stars || 0,
                detail: 'Level ' + (data.level || 1)
            };
        }
    });
})();
