/* math.js - Math Addition module */

(function () {
    var VISUAL_OBJECTS = ['🍎', '⭐', '💜', '🌸', '🐟', '🍪', '🦋', '🍊'];
    var LEVEL_UP_THRESHOLD = 10;
    var currentQuestion = null;
    var container = null;
    var answered = false;
    var streak = 0;
    var questionCount = 0;

    var WORD_TEMPLATES = [
        function (a, b, em) { return 'Sam has <b>' + a + '</b> ' + em + ' and finds <b>' + b + '</b> more. How many ' + em + ' total?'; },
        function (a, b, em) { return 'There are <b>' + a + '</b> ' + em + ' in the pond. <b>' + b + '</b> more swim in. How many now?'; },
        function (a, b, em) { return 'Lily baked <b>' + a + '</b> ' + em + ' and then <b>' + b + '</b> more. How many altogether?'; },
        function (a, b, em) { return 'A nest has <b>' + a + '</b> ' + em + '. Then <b>' + b + '</b> more arrive! How many in the nest?'; },
        function (a, b, em) { return 'Captain Zara found <b>' + a + '</b> ' + em + '. Her crew found <b>' + b + '</b> more. Total?'; }
    ];

    var FUN_FACTS = [
        { icon: '🔄', title: 'Flip it!', text: '3 + 5 = 5 + 3! Swapping numbers still gives the same answer.' },
        { icon: '0️⃣', title: 'Zero hero!', text: 'Adding zero to any number keeps it the same. 7 + 0 = 7!' },
        { icon: '🏛️', title: 'Ancient math!', text: 'Egyptians were adding numbers using hieroglyphics 5,000 years ago!' },
        { icon: '💻', title: 'Super fast!', text: 'Your phone adds billions of numbers every second!' },
        { icon: '🧩', title: 'Building blocks!', text: 'Addition is the foundation of all math — multiplication is just repeated addition!' }
    ];

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

    function getLevel() { return getModuleData('math-addition').level || 1; }

    function getMaxNum() {
        var lv = getLevel();
        return lv === 1 ? 5 : lv === 2 ? 10 : 20;
    }

    function generateQuestion() {
        var maxNum = getMaxNum();
        var a = randomInt(1, maxNum);
        var b = randomInt(1, maxNum);
        var correct = a + b;
        var emoji = VISUAL_OBJECTS[Math.floor(Math.random() * VISUAL_OBJECTS.length)];

        var distractors = new Set();
        var tries = 0;
        while (distractors.size < 3 && tries < 60) {
            var d = correct + randomInt(-3, 3);
            if (d !== correct && d > 0 && d <= maxNum * 2 + 2) distractors.add(d);
            tries++;
        }
        var fallback = 1;
        while (distractors.size < 3) { if (fallback !== correct) distractors.add(fallback); fallback++; }

        questionCount++;
        var isWord = (questionCount % 3 === 0);
        var tmpl = WORD_TEMPLATES[questionCount % WORD_TEMPLATES.length];

        return {
            a: a, b: b, correct: correct,
            answers: shuffle([correct].concat(Array.from(distractors).slice(0, 3))),
            emoji: emoji,
            isWord: isWord,
            wordText: isWord ? tmpl(a, b, emoji) : null
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
        var progressPct = level < 3 ? Math.min((correctCount / LEVEL_UP_THRESHOLD) * 100, 100) : 100;
        var levelLabel = level === 1 ? '(1–5)' : level === 2 ? '(1–10)' : '(1–20)';

        var html = '<div class="math-top-row">';
        html += streak > 0 ? '<div class="streak-badge">🔥 ' + streak + '</div>' : '<div></div>';
        html += '<div class="math-level-badge">Level ' + level + ' ' + levelLabel + '</div>';
        html += '</div>';

        if (level < 3) {
            html += '<div class="math-progress">';
            html += '<div class="math-progress-bar"><div class="math-progress-fill" style="width:' + progressPct + '%"></div></div>';
            html += '<div class="math-progress-label">' + correctCount + '/' + LEVEL_UP_THRESHOLD + ' to Level ' + (level + 1) + '</div>';
            html += '</div>';
        }

        if (q.isWord) {
            html += '<div class="word-problem-card">';
            html += '<div class="word-problem-label">📖 Story Problem</div>';
            html += '<div class="word-problem-text">' + q.wordText + '</div>';
            html += '</div>';
            html += '<div class="math-equation-sub">' + q.a + ' + ' + q.b + ' = ?</div>';
        } else {
            html += '<div class="math-question"><div class="math-question-text">' + q.a + ' + ' + q.b + ' = ?</div></div>';
        }

        if (q.a + q.b <= 20) {
            html += '<div class="visual-objects">';
            html += '<div class="visual-group">';
            for (var i = 0; i < q.a; i++) html += '<span class="visual-object" style="animation-delay:' + (i * 0.06) + 's">' + q.emoji + '</span>';
            html += '</div>';
            html += '<span class="visual-plus">+</span>';
            html += '<div class="visual-group">';
            for (var j = 0; j < q.b; j++) html += '<span class="visual-object" style="animation-delay:' + ((q.a + j) * 0.06) + 's">' + q.emoji + '</span>';
            html += '</div></div>';
        }

        html += '<div class="answer-grid">';
        q.answers.forEach(function (ans) {
            html += '<button class="answer-btn" data-value="' + ans + '">' + ans + '</button>';
        });
        html += '</div>';

        container.innerHTML = html;
        setMascot('thinking');
        container.querySelectorAll('.answer-btn').forEach(function (btn) {
            btn.addEventListener('click', function () { onAnswer(btn); });
        });
    }

    function onAnswer(btn) {
        if (answered) return;
        var value = parseInt(btn.getAttribute('data-value'), 10);
        playTapSound();

        if (value === currentQuestion.correct) {
            answered = true;
            streak++;
            btn.classList.add('correct');
            handleCorrectAnswer();

            var data = getModuleData('math-addition');
            var newCorrect = (data.correctCount || 0) + 1;
            var level = data.level || 1;
            var updates = { correctCount: newCorrect, totalAttempts: (data.totalAttempts || 0) + 1, stars: (data.stars || 0) + 1 };

            if (level < 3 && newCorrect >= LEVEL_UP_THRESHOLD) {
                updates.level = level + 1;
                updates.correctCount = 0;
                setTimeout(function () { setMascot('levelup'); playLevelUpSound(); }, 600);
            }

            updateModuleData('math-addition', updates);
            updateModuleStarDisplay();

            if (newCorrect % 5 === 0) {
                showFunFact(FUN_FACTS[Math.floor((newCorrect / 5 - 1)) % FUN_FACTS.length]);
                setTimeout(renderQuestion, 3200);
            } else {
                setTimeout(renderQuestion, 1800);
            }
        } else {
            streak = 0;
            btn.classList.add('wrong');
            handleWrongAnswer();
            showHint(['Try counting on your fingers! ✋', 'Start from the bigger number and count up! 🔢', 'Draw dots to help you count! ✏️']);
            setTimeout(function () { btn.classList.remove('wrong'); }, 500);
        }
    }

    function showFunFact(fact) {
        var el = document.createElement('div');
        el.className = 'fun-fact-toast';
        el.innerHTML = '<div class="fft-icon">' + fact.icon + '</div><div><div class="fft-title">' + fact.title + '</div><div class="fft-body">' + fact.text + '</div></div>';
        document.body.appendChild(el);
        setTimeout(function () { el.classList.add('fft-show'); }, 30);
        setTimeout(function () { el.classList.remove('fft-show'); setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 400); }, 2900);
    }

    function showHint(hints) {
        var existing = container.querySelector('.math-hint');
        if (existing) return;
        var el = document.createElement('div');
        el.className = 'math-hint';
        el.textContent = hints[Math.floor(Math.random() * hints.length)];
        container.appendChild(el);
    }

    function updateModuleStarDisplay() {
        var el = document.querySelector('#moduleStars .star-count');
        if (el) el.textContent = getModuleData('math-addition').stars || 0;
    }

    registerModule({
        id: 'math-addition',
        title: 'Addition',
        icon: '➕',
        color: '#FF6B6B',
        category: 'Math',
        init: function (el) { container = el; streak = 0; questionCount = 0; renderQuestion(); updateModuleStarDisplay(); },
        cleanup: function () { container = null; currentQuestion = null; streak = 0; },
        getProgress: function () {
            var data = getModuleData('math-addition');
            return { stars: data.stars || 0, detail: 'Level ' + (data.level || 1) };
        }
    });
})();
