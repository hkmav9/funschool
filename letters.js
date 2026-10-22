/* letters.js - Letters & Words module (beginner path, 12 compounding activities)
 *
 * Each activity unlocks the next. From activity 3 on, every round also mixes in
 * a review question from an earlier activity, so old skills keep coming back.
 */

(function () {
    var MODULE_ID = 'letters-words';
    var ROUND = 5;          // questions per round
    var PASS = 4;           // correct answers needed to unlock the next activity

    /* ---------- Data ---------- */
    var ALPHABET = [
        { l: 'A', w: 'Apple', e: '🍎' }, { l: 'B', w: 'Ball', e: '⚽' },
        { l: 'C', w: 'Cat', e: '🐱' }, { l: 'D', w: 'Dog', e: '🐶' },
        { l: 'E', w: 'Egg', e: '🥚' }, { l: 'F', w: 'Fish', e: '🐟' },
        { l: 'G', w: 'Grapes', e: '🍇' }, { l: 'H', w: 'Hat', e: '🎩' },
        { l: 'I', w: 'Ice cream', e: '🍦' }, { l: 'J', w: 'Juice', e: '🧃' },
        { l: 'K', w: 'Kite', e: '🪁' }, { l: 'L', w: 'Lion', e: '🦁' },
        { l: 'M', w: 'Moon', e: '🌙' }, { l: 'N', w: 'Nose', e: '👃' },
        { l: 'O', w: 'Octopus', e: '🐙' }, { l: 'P', w: 'Pig', e: '🐷' },
        { l: 'Q', w: 'Queen', e: '👑' }, { l: 'R', w: 'Rabbit', e: '🐰' },
        { l: 'S', w: 'Sun', e: '☀️' }, { l: 'T', w: 'Tree', e: '🌳' },
        { l: 'U', w: 'Umbrella', e: '☂️' }, { l: 'V', w: 'Van', e: '🚐' },
        { l: 'W', w: 'Whale', e: '🐳' }, { l: 'X', w: 'X-ray', e: '🩻' },
        { l: 'Y', w: 'Yo-yo', e: '🪀' }, { l: 'Z', w: 'Zebra', e: '🦓' }
    ];
    var LETTERS = ALPHABET.map(function (a) { return a.l; });

    // Short 3-letter words with a clear picture
    var WORDS = [
        { w: 'cat', e: '🐱' }, { w: 'dog', e: '🐶' }, { w: 'sun', e: '☀️' },
        { w: 'hat', e: '🎩' }, { w: 'bus', e: '🚌' }, { w: 'pig', e: '🐷' },
        { w: 'bed', e: '🛏️' }, { w: 'box', e: '📦' }, { w: 'fox', e: '🦊' },
        { w: 'bat', e: '🦇' }, { w: 'map', e: '🗺️' }, { w: 'pen', e: '🖊️' },
        { w: 'web', e: '🕸️' }, { w: 'bug', e: '🐛' }, { w: 'van', e: '🚐' },
        { w: 'egg', e: '🥚' }, { w: 'ant', e: '🐜' }, { w: 'cow', e: '🐮' },
        { w: 'bee', e: '🐝' }, { w: 'owl', e: '🦉' }, { w: 'car', e: '🚗' },
        { w: 'key', e: '🔑' }
    ];
    // Words whose middle letter is a vowel (for "Missing Vowel")
    var CVC = WORDS.filter(function (x) { return 'aeiou'.indexOf(x.w[1]) !== -1 && 'aeiou'.indexOf(x.w[0]) === -1; });

    var RHYMES = [
        [{ w: 'cat', e: '🐱' }, { w: 'hat', e: '🎩' }],
        [{ w: 'fox', e: '🦊' }, { w: 'box', e: '📦' }],
        [{ w: 'car', e: '🚗' }, { w: 'star', e: '⭐' }],
        [{ w: 'bee', e: '🐝' }, { w: 'tree', e: '🌳' }],
        [{ w: 'cake', e: '🎂' }, { w: 'snake', e: '🐍' }],
        [{ w: 'moon', e: '🌙' }, { w: 'spoon', e: '🥄' }],
        [{ w: 'goat', e: '🐐' }, { w: 'boat', e: '⛵' }],
        [{ w: 'bear', e: '🐻' }, { w: 'chair', e: '🪑' }],
        [{ w: 'mouse', e: '🐭' }, { w: 'house', e: '🏠' }],
        [{ w: 'frog', e: '🐸' }, { w: 'log', e: '🪵' }],
        [{ w: 'king', e: '🤴' }, { w: 'ring', e: '💍' }]
    ];

    var SIGHT = ['the', 'and', 'is', 'it', 'a', 'to', 'in', 'I', 'you', 'my', 'we', 'see', 'go', 'can', 'me', 'up'];

    /* ---------- Helpers ---------- */
    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function others(arr, not, n) {
        return shuffle(arr.filter(function (x) { return x !== not; })).slice(0, n);
    }

    // Spoken letter names, so the voice says "ay" for A instead of "uh"
    var LETTER_NAMES = {
        A: 'ay', B: 'bee', C: 'see', D: 'dee', E: 'ee', F: 'eff', G: 'jee', H: 'aitch',
        I: 'eye', J: 'jay', K: 'kay', L: 'el', M: 'em', N: 'en', O: 'oh', P: 'pee',
        Q: 'cue', R: 'ar', S: 'ess', T: 'tee', U: 'you', V: 'vee', W: 'double you',
        X: 'ex', Y: 'why', Z: 'zee'
    };
    function letterName(l) { return LETTER_NAMES[l.toUpperCase()] || l; }

    function speak(text) {
        if (!('speechSynthesis' in window) || !isSoundEnabled()) return;
        try {
            window.speechSynthesis.cancel();
            var u = new SpeechSynthesisUtterance(text);
            u.lang = 'en-US';
            u.rate = 0.8;
            u.pitch = 1.1;
            window.speechSynthesis.speak(u);
        } catch (e) { /* speech not available */ }
    }

    /* ---------- Question generators ----------
     * A choice question: { kind:'choice', prompt, big, bigClass, say, options:[{label,value}], answer, optClass }
     * A build question:  { kind:'build', word, e }
     */
    function qFindLetter() {
        var l = pick(LETTERS);
        return {
            kind: 'choice', prompt: 'Tap the letter you hear', big: '🔊', bigClass: 'lw-big-tap', say: letterName(l),
            options: shuffle([l].concat(others(LETTERS, l, 3))).map(function (x) { return { label: x, value: x }; }),
            answer: l, optClass: 'lw-opt-letter'
        };
    }
    function qBigSmall() {
        var l = pick(LETTERS);
        var opts = shuffle([l].concat(others(LETTERS, l, 3)));
        return {
            kind: 'choice', prompt: 'Find the small letter for', big: l, bigClass: 'lw-big-letter', say: letterName(l),
            options: opts.map(function (x) { return { label: x.toLowerCase(), value: x }; }),
            answer: l, optClass: 'lw-opt-letter'
        };
    }
    function qStartsWith() {
        var a = pick(ALPHABET.filter(function (x) { return x.l !== 'X'; }));
        return {
            kind: 'choice', prompt: a.w + ' starts with…', big: a.e, bigClass: 'lw-big-emoji', say: a.w,
            options: shuffle([a.l].concat(others(LETTERS, a.l, 3))).map(function (x) { return { label: x, value: x }; }),
            answer: a.l, optClass: 'lw-opt-letter'
        };
    }
    function qWhatsNext() {
        var i = Math.floor(Math.random() * 24);       // A..X so two letters show before the gap
        var ans = LETTERS[i + 2];
        return {
            kind: 'choice', prompt: 'What comes next?', big: LETTERS[i] + ' ' + LETTERS[i + 1] + ' _', bigClass: 'lw-big-seq',
            say: letterName(LETTERS[i]) + ', ' + letterName(LETTERS[i + 1]) + ', what comes next?',
            options: shuffle([ans].concat(others(LETTERS, ans, 3))).map(function (x) { return { label: x, value: x }; }),
            answer: ans, optClass: 'lw-opt-letter'
        };
    }
    function qFirstLetter() {
        var x = pick(WORDS);
        var first = x.w[0];
        var pool = 'abcdefghijklmnoprstuvw'.split('');
        return {
            kind: 'choice', prompt: 'Which letter is missing?', big: x.e + '<div class="lw-gapword">_' + x.w.slice(1) + '</div>',
            bigClass: 'lw-big-emoji', say: x.w,
            options: shuffle([first].concat(others(pool, first, 3))).map(function (l) { return { label: l, value: l }; }),
            answer: first, optClass: 'lw-opt-letter'
        };
    }
    function qBuild() {
        var x = pick(WORDS);
        return { kind: 'build', word: x.w, e: x.e };
    }
    function qRhyme() {
        var pair = pick(RHYMES);
        var flip = Math.random() < 0.5;
        var base = flip ? pair[1] : pair[0];
        var ans = flip ? pair[0] : pair[1];
        var wrong = shuffle(RHYMES.filter(function (p) { return p !== pair; })).slice(0, 2)
            .map(function (p) { return pick(p); });
        return {
            kind: 'choice', prompt: 'What rhymes with ' + base.w + '?', big: base.e, bigClass: 'lw-big-emoji',
            say: 'What rhymes with ' + base.w + '?',
            options: shuffle([ans].concat(wrong)).map(function (x) {
                return { label: '<span class="lw-opt-emoji">' + x.e + '</span><span class="lw-opt-sub">' + x.w + '</span>', value: x.w };
            }),
            answer: ans.w, optClass: 'lw-opt-pic lw-three'
        };
    }
    function qVowel() {
        var x = pick(CVC);
        return {
            kind: 'choice', prompt: 'Fill in the vowel', big: x.e + '<div class="lw-gapword">' + x.w[0] + '_' + x.w[2] + '</div>',
            bigClass: 'lw-big-emoji', say: x.w,
            options: ['a', 'e', 'i', 'o', 'u'].map(function (v) { return { label: v, value: v }; }),
            answer: x.w[1], optClass: 'lw-opt-letter lw-five'
        };
    }
    function qSight() {
        var w = pick(SIGHT);
        return {
            kind: 'choice', prompt: 'Tap the word you hear', big: '🔊', bigClass: 'lw-big-tap', say: w,
            options: shuffle([w].concat(others(SIGHT, w, 3))).map(function (x) { return { label: x, value: x }; }),
            answer: w, optClass: 'lw-opt-word'
        };
    }
    function qReadMatch() {
        var x = pick(WORDS);
        var wrong = others(WORDS, x, 3);
        return {
            kind: 'choice', prompt: 'Read the word. Find the picture!', big: x.w, bigClass: 'lw-big-word', say: null,
            options: shuffle([x].concat(wrong)).map(function (o) { return { label: '<span class="lw-opt-emoji">' + o.e + '</span>', value: o.w }; }),
            answer: x.w, optClass: 'lw-opt-pic', sayAfter: x.w
        };
    }

    /* ---------- The path ---------- */
    var ACTIVITIES = [
        { id: 'abc1', title: 'Letters A to M', icon: '🔤', desc: 'Tap each letter to hear it', type: 'explore', letters: LETTERS.slice(0, 13) },
        { id: 'abc2', title: 'Letters N to Z', icon: '🔠', desc: 'Tap each letter to hear it', type: 'explore', letters: LETTERS.slice(13) },
        { id: 'find', title: 'Find the Letter', icon: '👂', desc: 'Listen and tap the letter', gen: qFindLetter },
        { id: 'bigsmall', title: 'Big & Small', icon: '🐘', desc: 'Match big and small letters', gen: qBigSmall },
        { id: 'starts', title: 'Starts With', icon: '🍎', desc: 'What letter does it start with?', gen: qStartsWith },
        { id: 'order', title: 'ABC Order', icon: '🚂', desc: 'What letter comes next?', gen: qWhatsNext },
        { id: 'first', title: 'Missing First Letter', icon: '🧩', desc: 'Finish the word', gen: qFirstLetter },
        { id: 'build', title: 'Build a Word', icon: '🧱', desc: 'Put the letters in order', gen: qBuild },
        { id: 'vowel', title: 'Missing Vowel', icon: '🅰️', desc: 'a, e, i, o, u', gen: qVowel },
        { id: 'rhyme', title: 'Rhyme Time', icon: '🎵', desc: 'Find words that sound alike', gen: qRhyme },
        { id: 'sight', title: 'Sight Words', icon: '👀', desc: 'Words we see every day', gen: qSight },
        { id: 'read', title: 'Read & Match', icon: '📚', desc: 'Read a word, find its picture', gen: qReadMatch }
    ];

    /* ---------- State ---------- */
    var container = null;
    var view = 'path';       // 'path' | 'activity'
    var act = null;
    var questions = [];
    var qIndex = 0;
    var correctCount = 0;
    var answered = false;
    var timers = [];

    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function clearTimers() { timers.forEach(clearTimeout); timers = []; }

    function getData() {
        var d = getModuleData(MODULE_ID);
        return { completed: d.completed || {}, explored: d.explored || {}, stars: d.stars || 0 };
    }
    function isUnlocked(i) {
        if (i === 0) return true;
        return !!getData().completed[ACTIVITIES[i - 1].id];
    }
    function addModuleStar() {
        var d = getModuleData(MODULE_ID);
        updateModuleData(MODULE_ID, { stars: (d.stars || 0) + 1 });
        updateModuleStarDisplay();
    }
    function updateModuleStarDisplay() {
        var el = document.querySelector('#moduleStars .star-count');
        if (el) el.textContent = getData().stars;
    }

    /* ---------- Path screen ---------- */
    function renderPath() {
        clearTimers();
        view = 'path';
        var data = getData();
        var doneCount = ACTIVITIES.filter(function (a) { return data.completed[a.id]; }).length;

        var html = '<div class="explore-progress">';
        html += '<div class="explore-progress-header"><span>Activities done</span><span>' + doneCount + '/' + ACTIVITIES.length + '</span></div>';
        html += '<div class="math-progress-bar"><div class="math-progress-fill explore-fill" style="width:' + (doneCount / ACTIVITIES.length * 100) + '%"></div></div>';
        if (doneCount === ACTIVITIES.length) html += '<div class="explore-complete">You finished every activity! Super reader! 📚</div>';
        html += '</div>';

        html += '<div class="lw-path">';
        ACTIVITIES.forEach(function (a, i) {
            var unlocked = isUnlocked(i);
            var best = data.completed[a.id];
            var cls = 'lw-step' + (best ? ' done' : '') + (unlocked ? '' : ' locked');
            var isNext = unlocked && !best;
            if (isNext) cls += ' next';
            html += '<button class="' + cls + '" data-idx="' + i + '"' + (unlocked ? '' : ' disabled') + '>';
            html += '<span class="lw-step-num">' + (best ? '✓' : (unlocked ? (i + 1) : '🔒')) + '</span>';
            html += '<span class="lw-step-icon">' + a.icon + '</span>';
            html += '<span class="lw-step-text"><span class="lw-step-title">' + a.title + '</span><span class="lw-step-desc">' + a.desc + '</span></span>';
            if (best && best.stars) {
                html += '<span class="lw-step-stars">' + '⭐'.repeat(best.stars) + '</span>';
            }
            html += '</button>';
        });
        html += '</div>';

        container.innerHTML = html;
        setMascot('wave');
        updateModuleStarDisplay();

        container.querySelectorAll('.lw-step:not(.locked)').forEach(function (btn) {
            btn.addEventListener('click', function () {
                playTapSound();
                openActivity(parseInt(btn.getAttribute('data-idx'), 10));
            });
        });

        var nextEl = container.querySelector('.lw-step.next');
        if (nextEl && nextEl.scrollIntoView) {
            later(function () { nextEl.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 150);
        }
    }

    function activityHeader(a) {
        return '<div class="lw-act-header"><button class="lw-back" id="lwBack">← Activities</button>' +
            '<span class="lw-act-title">' + a.icon + ' ' + a.title + '</span></div>';
    }
    function wireBack() {
        var b = container.querySelector('#lwBack');
        if (b) b.addEventListener('click', function () {
            playTapSound();
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            renderPath();
        });
    }

    function openActivity(i) {
        clearTimers();
        view = 'activity';
        act = ACTIVITIES[i];
        act._idx = i;
        if (act.type === 'explore') {
            renderExplore();
        } else {
            startRound();
            renderQuestion();
        }
    }

    /* ---------- Explore activity (letters) ---------- */
    function renderExplore(selected) {
        var data = getData();
        var seen = data.explored[act.id] || [];
        var a = selected ? ALPHABET[LETTERS.indexOf(selected)] : null;

        var html = activityHeader(act);
        html += '<div class="explore-progress"><div class="explore-progress-header"><span>Letters heard</span><span>' +
            seen.length + '/' + act.letters.length + '</span></div>';
        html += '<div class="math-progress-bar"><div class="math-progress-fill explore-fill" style="width:' +
            (seen.length / act.letters.length * 100) + '%"></div></div></div>';

        html += '<div class="lw-spotlight">';
        if (a) {
            html += '<div class="lw-spot-letter">' + a.l + '<span>' + a.l.toLowerCase() + '</span></div>';
            html += '<div class="lw-spot-word"><span class="lw-spot-emoji">' + a.e + '</span>' +
                '<b>' + a.l + '</b> is for ' + a.w + '</div>';
        } else {
            html += '<div class="lw-spot-hint">Tap a letter! 👇</div>';
        }
        html += '</div>';

        html += '<div class="lw-letter-grid">';
        act.letters.forEach(function (l) {
            html += '<button class="lw-letter' + (seen.indexOf(l) !== -1 ? ' seen' : '') + (l === selected ? ' active' : '') +
                '" data-l="' + l + '">' + l + '</button>';
        });
        html += '</div>';

        if (seen.length === act.letters.length) {
            html += '<button class="quiz-restart-btn lw-next-btn" id="lwNext">Next activity ➜</button>';
        }

        container.innerHTML = html;
        wireBack();

        container.querySelectorAll('.lw-letter').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var l = btn.getAttribute('data-l');
                var al = ALPHABET[LETTERS.indexOf(l)];
                speak(letterName(l) + ' is for ' + al.w);
                var d = getData();
                var list = d.explored[act.id] || [];
                if (list.indexOf(l) === -1) {
                    list.push(l);
                    d.explored[act.id] = list;
                    updateModuleData(MODULE_ID, { explored: d.explored });
                    awardStar();
                    addModuleStar();
                    setMascot('explore');
                    if (list.length === act.letters.length) finishActivity(3, true);
                } else {
                    playTapSound();
                }
                renderExplore(l);
            });
        });

        var next = container.querySelector('#lwNext');
        if (next) next.addEventListener('click', function () {
            playTapSound();
            if (act._idx + 1 < ACTIVITIES.length) openActivity(act._idx + 1);
            else renderPath();
        });
    }

    /* ---------- Rounds (with review from earlier activities) ---------- */
    function startRound() {
        qIndex = 0;
        correctCount = 0;
        questions = [];
        var reviewPool = ACTIVITIES.slice(0, act._idx).filter(function (a) { return a.gen; });
        for (var i = 0; i < ROUND; i++) {
            var q;
            // Compounding: the last question of a round reviews an earlier skill
            if (i === ROUND - 1 && reviewPool.length) {
                var from = pick(reviewPool);
                q = from.gen();
                q.review = from.title;
            } else {
                q = act.gen();
            }
            questions.push(q);
        }
    }

    function roundProgressHTML() {
        var html = '<div class="quiz-progress"><div class="quiz-progress-header">';
        html += '<span>Question ' + (qIndex + 1) + ' of ' + ROUND + '</span><span>' + correctCount + ' correct</span></div>';
        html += '<div class="math-progress-bar"><div class="math-progress-fill quiz-fill" style="width:' + (qIndex / ROUND * 100) + '%"></div></div></div>';
        return html;
    }

    function renderQuestion() {
        clearTimers();
        answered = false;
        if (qIndex >= ROUND) { renderRoundComplete(); return; }
        var q = questions[qIndex];
        if (q.kind === 'build') { renderBuild(q); return; }

        var html = activityHeader(act) + roundProgressHTML();
        html += '<div class="quiz-area lw-q">';
        if (q.review) html += '<div class="lw-review">🔁 Review: ' + q.review + '</div>';
        html += '<div class="quiz-prompt">' + q.prompt + '</div>';
        html += '<button class="lw-big ' + q.bigClass + '" id="lwSay"' + (q.say ? '' : ' disabled') + '>' + q.big + '</button>';
        if (q.say) html += '<div class="lw-hear">🔊 Tap to hear again</div>';
        html += '<div class="answer-grid lw-answers ' + (q.optClass || '') + '">';
        q.options.forEach(function (o) {
            html += '<button class="answer-btn text-answer" data-v="' + o.value + '">' + o.label + '</button>';
        });
        html += '</div></div>';

        container.innerHTML = html;
        wireBack();
        setMascot('thinking');

        if (q.say) {
            later(function () { speak(q.say); }, 250);
            container.querySelector('#lwSay').addEventListener('click', function () { speak(q.say); });
        }

        var wrongs = 0;
        container.querySelectorAll('.lw-answers .answer-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (answered) return;
                if (btn.getAttribute('data-v') === String(q.answer)) {
                    answered = true;
                    btn.classList.add('correct');
                    if (q.sayAfter) speak(q.sayAfter);
                    if (wrongs === 0) {
                        correctCount++;
                        handleCorrectAnswer();
                        addModuleStar();
                    } else {
                        playCorrectSound();
                        setMascot('correct');
                    }
                    qIndex++;
                    later(renderQuestion, 1400);
                } else {
                    wrongs++;
                    btn.classList.add('wrong');
                    handleWrongAnswer();
                    later(function () { btn.classList.remove('wrong'); }, 500);
                    if (wrongs >= 2) {
                        // Show the right answer, then move on
                        answered = true;
                        var right = container.querySelector('.lw-answers .answer-btn[data-v="' + q.answer + '"]');
                        if (right) right.classList.add('correct');
                        qIndex++;
                        later(renderQuestion, 1600);
                    }
                }
            });
        });
    }

    /* Build-a-word: tap scrambled letters in order */
    function renderBuild(q) {
        var letters = q.word.split('');
        var tiles = shuffle(letters.map(function (l, i) { return { l: l, i: i }; }));
        // Avoid showing the word already in order
        if (tiles.map(function (t) { return t.l; }).join('') === q.word && letters.length > 1) tiles.reverse();
        var pos = 0;
        var mistakes = 0;

        var html = activityHeader(act) + roundProgressHTML();
        html += '<div class="quiz-area lw-q">';
        if (q.review) html += '<div class="lw-review">🔁 Review: ' + q.review + '</div>';
        html += '<div class="quiz-prompt">Build the word</div>';
        html += '<button class="lw-big lw-big-emoji" id="lwSay">' + q.e + '</button>';
        html += '<div class="lw-hear">🔊 Tap to hear again</div>';
        html += '<div class="lw-slots">';
        letters.forEach(function () { html += '<div class="lw-slot"></div>'; });
        html += '</div><div class="lw-tiles">';
        tiles.forEach(function (t, k) { html += '<button class="lw-tile" data-k="' + k + '">' + t.l + '</button>'; });
        html += '</div></div>';

        container.innerHTML = html;
        wireBack();
        setMascot('thinking');
        later(function () { speak(q.word); }, 250);
        container.querySelector('#lwSay').addEventListener('click', function () { speak(q.word); });

        var slots = container.querySelectorAll('.lw-slot');
        container.querySelectorAll('.lw-tile').forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (answered || btn.classList.contains('used')) return;
                var t = tiles[parseInt(btn.getAttribute('data-k'), 10)];
                if (t.l === letters[pos]) {
                    btn.classList.add('used');
                    slots[pos].textContent = t.l;
                    slots[pos].classList.add('filled');
                    speak(letterName(t.l));
                    pos++;
                    if (pos === letters.length) {
                        answered = true;
                        later(function () { speak(q.word); }, 400);
                        if (mistakes <= 1) {
                            correctCount++;
                            handleCorrectAnswer();
                            addModuleStar();
                        } else {
                            playCorrectSound();
                            setMascot('correct');
                        }
                        qIndex++;
                        later(renderQuestion, 1700);
                    } else {
                        playTapSound();
                    }
                } else {
                    mistakes++;
                    btn.classList.add('wrong');
                    handleWrongAnswer();
                    later(function () { btn.classList.remove('wrong'); }, 500);
                }
            });
        });
    }

    function renderRoundComplete() {
        var passed = correctCount >= PASS;
        var stars = correctCount === ROUND ? 3 : (passed ? 2 : 1);
        if (passed) finishActivity(stars, false);

        var isLast = act._idx === ACTIVITIES.length - 1;
        var html = activityHeader(act);
        html += '<div class="quiz-complete">';
        html += '<div class="quiz-complete-emoji">' + (stars === 3 ? '🏆' : passed ? '🌟' : '💪') + '</div>';
        html += '<div class="quiz-complete-score">' + correctCount + '/' + ROUND + '</div>';
        html += '<div class="lw-round-stars">' + '⭐'.repeat(stars) + '<span class="lw-dim">' + '⭐'.repeat(3 - stars) + '</span></div>';
        html += '<div class="quiz-complete-msg">' + (passed
            ? (isLast ? 'You finished the whole path! 🎉' : 'Next activity unlocked! 🔓')
            : 'Get ' + PASS + ' right to unlock the next one. You can do it!') + '</div>';
        html += '<div class="lw-done-btns">';
        html += '<button class="quiz-restart-btn" id="lwAgain">Play Again 🔄</button>';
        if (passed && !isLast) html += '<button class="quiz-restart-btn lw-next-btn" id="lwNext">Next ➜</button>';
        html += '</div></div>';

        container.innerHTML = html;
        wireBack();
        setMascot(passed ? 'correct' : 'encourage');
        if (passed) speak(isLast ? 'Amazing! You finished everything!' : 'Great job!');

        container.querySelector('#lwAgain').addEventListener('click', function () {
            playTapSound();
            startRound();
            renderQuestion();
        });
        var next = container.querySelector('#lwNext');
        if (next) next.addEventListener('click', function () {
            playTapSound();
            openActivity(act._idx + 1);
        });
    }

    function finishActivity(stars, celebrate) {
        var d = getData();
        var prev = d.completed[act.id];
        var firstTime = !prev;
        if (!prev || (prev.stars || 0) < stars) {
            d.completed[act.id] = { stars: stars };
            updateModuleData(MODULE_ID, { completed: d.completed });
        }
        if (firstTime && celebrate) {
            showConfetti();
            playLevelUpSound();
            setMascot('levelup');
        } else if (firstTime) {
            playLevelUpSound();
        }
    }

    registerModule({
        id: MODULE_ID,
        title: 'Letters & Words',
        icon: '🔤',
        color: '#FF9F43',
        category: 'Words',
        init: function (el) {
            container = el;
            renderPath();
        },
        cleanup: function () {
            clearTimers();
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            container = null;
        },
        getProgress: function () {
            var d = getData();
            var done = ACTIVITIES.filter(function (a) { return d.completed[a.id]; }).length;
            return { stars: d.stars, detail: done + '/' + ACTIVITIES.length + ' activities' };
        }
    });
})();
