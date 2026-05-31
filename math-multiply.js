/* math-multiply.js - Math Multiplication module */

(function () {
    var VISUAL_OBJECTS = ['🐱', '🌻', '🍩', '⚡', '🦄', '🍦', '🐸', '🎯'];
    var LEVEL_UP_THRESHOLD = 10;
    var currentQuestion = null;
    var container = null;
    var answered = false;
    var streak = 0;
    var questionCount = 0;

    var WORD_TEMPLATES = [
        function (a, b, em) { return 'There are <b>' + a + '</b> bags with <b>' + b + '</b> ' + em + ' in each. How many ' + em + ' total?'; },
        function (a, b, em) { return '<b>' + a + '</b> friends each have <b>' + b + '</b> ' + em + '. How many ' + em + ' altogether?'; },
        function (a, b, em) { return 'A garden has <b>' + a + '</b> rows with <b>' + b + '</b> ' + em + ' in each row. How many ' + em + '?'; },
        function (a, b, em) { return 'A spaceship has <b>' + a + '</b> decks. Each deck has <b>' + b + '</b> ' + em + '. How many total?'; },
        function (a, b, em) { return 'There are <b>' + a + '</b> boxes, each holding <b>' + b + '</b> ' + em + '. How many ' + em + ' in all?'; }
    ];

    var FUN_FACTS = [
        { icon: '🔁', title: 'Repeated adding!', text: '3 × 4 means 3 + 3 + 3 + 3. Multiplication is just a shortcut for addition!' },
        { icon: '🔄', title: 'Flip it!', text: '3 × 5 = 5 × 3 = 15. The order doesn\'t change the answer!' },
        { icon: '🧑‍💻', title: 'Pixel art!', text: 'Computer screens are grids. A tiny 3×3 icon has 3 × 3 = 9 pixels!' },
        { icon: '🐝', title: 'Honey cells!', text: 'A honeycomb with 6 rows of 8 cells has 6 × 8 = 48 cells for honey!' },
        { icon: '🏟️', title: 'Stadiums!', text: 'Sports arenas have rows × columns of seats — all multiplication!' }
    ];

    var TIMES_TABLE_HINTS = {
        2: 'The 2× table is just doubling! 2×6 = 6+6 = 12',
        3: 'The 3× table: add the digits to check — they should add to 3, 6, or 9!',
        4: 'The 4× table is just doubling twice! 4×7 = double 7 twice = 28',
        5: 'The 5× table always ends in 0 or 5! Easy!',
        10: 'The 10× table: just add a zero! 10×8 = 80'
    };

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

    function getLevel() { return getModuleData('math-multiply').level || 1; }

    function getMaxNum() {
        var lv = getLevel();
        return lv === 1 ? 5 : lv === 2 ? 10 : 12;
    }

    function generateQuestion() {
        var maxNum = getMaxNum();
        var a = randomInt(1, Math.min(maxNum, 6));
        var b = randomInt(1, Math.min(maxNum, 6));
        var correct = a * b;
        var emoji = VISUAL_OBJECTS[Math.floor(Math.random() * VISUAL_OBJECTS.length)];

        var distractors = new Set();
        var tries = 0;
        while (distractors.size < 3 && tries < 60) {
            var d = correct + randomInt(-4, 4);
            if (d !== correct && d > 0) distractors.add(d);
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
        var data = getModuleData('math-multiply');
        var level = data.level || 1;
        var correctCount = data.correctCount || 0;
        var progressPct = level < 3 ? Math.min((correctCount / LEVEL_UP_THRESHOLD) * 100, 100) : 100;
        var levelLabel = level === 1 ? '(×1–5)' : level === 2 ? '(×1–10)' : '(×1–12)';

        var html = '<div class="math-top-row">';
        html += streak > 0 ? '<div class="streak-badge streak-mul">🔥 ' + streak + '</div>' : '<div></div>';
        html += '<div class="math-level-badge">Level ' + level + ' ' + levelLabel + '</div>';
        html += '</div>';

        if (level < 3) {
            html += '<div class="math-progress">';
            html += '<div class="math-progress-bar"><div class="math-progress-fill mm-fill" style="width:' + progressPct + '%"></div></div>';
            html += '<div class="math-progress-label">' + correctCount + '/' + LEVEL_UP_THRESHOLD + ' to Level ' + (level + 1) + '</div>';
            html += '</div>';
        }

        if (q.isWord) {
            html += '<div class="word-problem-card word-problem-mul">';
            html += '<div class="word-problem-label">📖 Story Problem</div>';
            html += '<div class="word-problem-text">' + q.wordText + '</div>';
            html += '</div>';
            html += '<div class="math-equation-sub">' + q.a + ' × ' + q.b + ' = ?</div>';
        } else {
            html += '<div class="math-question"><div class="math-question-text">' + q.a + ' × ' + q.b + ' = ?</div></div>';
        }

        // Array grid visual
        html += '<div class="mm-grid-wrap">';
        for (var row = 0; row < q.a; row++) {
            html += '<div class="mm-row">';
            for (var col = 0; col < q.b; col++) {
                var delay = (row * q.b + col) * 0.05;
                html += '<span class="visual-object" style="animation-delay:' + delay + 's">' + q.emoji + '</span>';
            }
            html += '</div>';
            if (row < q.a - 1) html += '<div class="mm-row-sep"></div>';
        }
        html += '</div>';
        html += '<div class="mm-hint">' + q.a + ' groups of ' + q.b + '</div>';

        // Times table hint for specific tables
        if (TIMES_TABLE_HINTS[q.b]) {
            html += '<div class="mm-table-hint">💡 ' + TIMES_TABLE_HINTS[q.b] + '</div>';
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

            var data = getModuleData('math-multiply');
            var newCorrect = (data.correctCount || 0) + 1;
            var level = data.level || 1;
            var updates = { correctCount: newCorrect, totalAttempts: (data.totalAttempts || 0) + 1, stars: (data.stars || 0) + 1 };

            if (level < 3 && newCorrect >= LEVEL_UP_THRESHOLD) {
                updates.level = level + 1;
                updates.correctCount = 0;
                setTimeout(function () { setMascot('levelup'); playLevelUpSound(); }, 600);
            }

            updateModuleData('math-multiply', updates);
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
            var q = currentQuestion;
            showHint(['Count the rows: ' + q.a + ' rows × ' + q.b + ' in each = ?', 'Try skip counting by ' + q.b + '! 🔢', 'Remember: ' + q.a + ' groups of ' + q.b + ' objects total how many?']);
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
        if (el) el.textContent = getModuleData('math-multiply').stars || 0;
    }

    registerModule({
        id: 'math-multiply',
        title: 'Multiplication',
        icon: '✖️',
        color: '#A29BFE',
        category: 'Math',
        init: function (el) { container = el; streak = 0; questionCount = 0; renderQuestion(); updateModuleStarDisplay(); },
        cleanup: function () { container = null; currentQuestion = null; streak = 0; },
        getProgress: function () {
            var data = getModuleData('math-multiply');
            return { stars: data.stars || 0, detail: 'Level ' + (data.level || 1) };
        }
    });
})();
