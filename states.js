/* states.js - USA States module */

(function () {
    var STATES_DATA = null;
    var container = null;
    var currentView = 'letters'; // 'letters' | 'list' | 'detail'
    var currentLetter = null;
    var currentState = null;

    var LETTER_COLORS = [
        '#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB', '#FF9FF3',
        '#54A0FF', '#5F27CD', '#00D2D3', '#1DD1A1', '#FF6B81',
        '#A29BFE', '#FD79A8', '#FDCB6E', '#6C5CE7', '#00B894',
        '#E17055', '#74B9FF', '#55EFC4', '#FAB1A0', '#0984E3',
        '#B2BEC3', '#D63031', '#00CEC9', '#E84393', '#81ECEC', '#2D3436'
    ];

    // Letters that have no US states
    var EMPTY_LETTERS = { B: true, E: true, J: true, Q: true, X: true, Y: true, Z: true };

    /* ── Data Loading ──────────────────────────────────────────────── */

    function loadStates(callback) {
        if (STATES_DATA) { callback(STATES_DATA); return; }
        fetch('./states-data.json')
            .then(function (r) { return r.json(); })
            .then(function (data) {
                STATES_DATA = data.states;
                callback(STATES_DATA);
            })
            .catch(function () {
                if (container) container.innerHTML = '<div class="states-error">Could not load states.</div>';
            });
    }

    /* ── Render Router ─────────────────────────────────────────────── */

    function render() {
        if (!container) return;
        if (currentView === 'letters') renderLetters();
        else if (currentView === 'list')    renderList();
        else if (currentView === 'detail')  renderDetail();
    }

    /* ── Letter Grid ───────────────────────────────────────────────── */

    function renderLetters() {
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
        container.innerHTML = html;

        container.querySelectorAll('.states-letter-tile:not(.empty)').forEach(function (tile) {
            tile.addEventListener('click', function () {
                playTapSound();
                currentLetter = tile.getAttribute('data-letter');
                currentView = 'list';
                render();
            });
        });
    }

    // Fix: reference correct variable name
    var LETTER_LETTERS = EMPTY_LETTERS;

    /* ── State List for a Letter ───────────────────────────────────── */

    function renderList() {
        loadStates(function (states) {
            var filtered = states.filter(function (s) {
                return s.name.charAt(0) === currentLetter;
            });

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
            container.innerHTML = html;

            document.getElementById('statesBackToLetters').addEventListener('click', function () {
                playTapSound();
                currentView = 'letters';
                render();
            });

            container.querySelectorAll('.states-state-card').forEach(function (card) {
                card.addEventListener('click', function () {
                    playTapSound();
                    var abbr = card.getAttribute('data-abbr');
                    currentState = states.find(function (s) { return s.abbr === abbr; });
                    currentView = 'detail';
                    render();
                });
            });
        });
    }

    /* ── State Detail ──────────────────────────────────────────────── */

    function renderDetail() {
        var s = currentState;

        // Award star for first visit
        var data = getModuleData('usa-states');
        var visited = data.visited ? data.visited.slice() : [];
        var isNew = visited.indexOf(s.abbr) === -1;
        if (isNew) {
            visited.push(s.abbr);
            var newStars = (data.stars || 0) + 1;
            updateModuleData('usa-states', { visited: visited, stars: newStars });
            addStars(1);
            updateModuleStarDisplay();
        }

        var factEmojis = ['🌟', '🎯', '💡', '🔥'];

        var html = '<div class="states-detail-wrap">';

        // Nav
        html += '<div class="states-detail-nav">';
        html += '<button class="states-back-btn" id="statesBackToList">← ' + currentLetter + ' States</button>';
        html += '<span class="states-detail-abbr">' + s.abbr + '</span>';
        html += '</div>';

        // Hero card
        html += '<div class="states-hero-card" style="background:linear-gradient(135deg,' + s.color + 'CC,' + s.color + '88)">';
        html += '<div class="states-hero-emoji">' + s.emoji + '</div>';
        html += '<div class="states-hero-name">' + s.name + '</div>';
        html += '</div>';

        // Capital
        html += '<div class="states-capital-row">';
        html += '<span class="states-capital-icon">🏛️</span>';
        html += '<div>';
        html += '<div class="states-capital-label">Capital City</div>';
        html += '<div class="states-capital-name">' + s.capital + '</div>';
        html += '</div>';
        html += '</div>';

        // Fun facts
        html += '<div class="states-facts-label">Fun Facts!</div>';
        html += '<div class="states-facts-list">';
        s.facts.forEach(function (fact, i) {
            html += '<div class="states-fact-card">';
            html += '<span class="states-fact-emoji">' + (factEmojis[i] || '⭐') + '</span>';
            html += '<div class="states-fact-text">' + fact + '</div>';
            html += '</div>';
        });
        html += '</div>';

        if (isNew) {
            html += '<div class="states-new-badge">New state explored! ⭐</div>';
        }

        html += '</div>';
        container.innerHTML = html;

        if (isNew) {
            setTimeout(function () { playCorrectSound(); setMascot('correct'); }, 200);
        }

        document.getElementById('statesBackToList').addEventListener('click', function () {
            playTapSound();
            currentView = 'list';
            render();
        });
    }

    /* ── Helpers ───────────────────────────────────────────────────── */

    function updateModuleStarDisplay() {
        var data = getModuleData('usa-states');
        var el = document.querySelector('#moduleStars .star-count');
        if (el) el.textContent = data.stars || 0;
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
            currentView = 'letters';
            currentLetter = null;
            currentState = null;
            render();
            updateModuleStarDisplay();
        },
        cleanup: function () {
            container = null;
            currentView = 'letters';
            currentLetter = null;
            currentState = null;
        },
        getProgress: function () {
            var data = getModuleData('usa-states');
            var count = (data.visited || []).length;
            return {
                stars: data.stars || 0,
                detail: count + ' / 50 states explored'
            };
        }
    });

})();
