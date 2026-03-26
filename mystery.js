/* mystery.js - Mystery Solver module (Problem-Solving) */

(function () {
    var container = null;
    var currentView = 'list'; // 'list' | 'puzzle' | 'complete'
    var currentPuzzle = null;
    var currentStep = 0;      // which attempt the child is on (0, 1, 2...)
    var showingHint = false;
    var solved = false;

    /* ── Puzzle Data ────────────────────────────────────────────────── */

    var PUZZLES = [
        {
            id: 'river',
            icon: '🦊',
            title: 'Help Finn Cross the River',
            teaser: 'A clever fox needs your help to find a way across!',
            color: '#20BF8E',
            picture: renderRiverScene,
            story: 'Finn the fox smells his family\'s dinner cooking — but a big rushing river stands in the way! He needs to get home before the food gets cold. Can you figure out a way?',
            attempts: [
                {
                    label: '🌉 Try the old wooden bridge',
                    result: 'fail',
                    feedback: 'Crack! The old bridge breaks and Finn splashes into the water! 💦 That path is no good.',
                    sceneState: 'bridge-fail'
                },
                {
                    label: '🪨 Hop on the stepping stones',
                    result: 'partial',
                    feedback: 'Finn made it halfway! But the stones are too far apart to jump the rest of the way… 😮 So close!',
                    sceneState: 'stones-partial'
                }
            ],
            hint: 'Hmm… the stones look closer together on the other side of the river. What if Finn started from there?',
            solution: {
                label: '🔄 Start from the other bank!',
                feedback: 'Yes!! From the other side the stones are perfectly spaced! Finn hops across and makes it home for dinner! 🎉🦊',
                sceneState: 'solved'
            }
        },
        {
            id: 'scale',
            icon: '⚖️',
            title: "Chef Bea's Magic Recipe",
            teaser: 'A baker needs her scale balanced before she can cook!',
            color: '#E17055',
            picture: renderScaleScene,
            story: "Chef Bea is baking her famous magic cookies, but the recipe says the scale MUST be perfectly balanced! Right now it's tipping way too far to the left. Can you figure out a way to fix it?",
            attempts: [
                {
                    label: '➕ Add more blocks to the right',
                    result: 'fail',
                    feedback: 'Whoops! Now it tips too far to the RIGHT! The cookies will be ruined! 😬 Adding more made it worse.',
                    sceneState: 'overload'
                },
                {
                    label: '➖ Remove blocks from the left',
                    result: 'partial',
                    feedback: "Getting closer… but it's still a little uneven. Bea counts and counts but can't figure out how many to remove. 🤔",
                    sceneState: 'still-off'
                }
            ],
            hint: 'What if instead of adding or removing, Bea moved one block from the heavy side to the light side?',
            solution: {
                label: '↔️ Move a block to the other side!',
                feedback: 'Perfect balance! Moving the block shifted two sides at once — like magic! The scale is even and the cookies are saved! 🍪✨',
                sceneState: 'balanced'
            }
        },
        {
            id: 'maze',
            icon: '🐭',
            title: "Milo's Cheesy Maze",
            teaser: 'A little mouse can smell the cheese but can\'t find the way!',
            color: '#6C5CE7',
            picture: renderMazeScene,
            story: "Milo the mouse can smell the most delicious cheese just on the other side of this maze. He's tried running everywhere but keeps getting lost! Can you figure out a way to guide him through?",
            attempts: [
                {
                    label: '⬅️ Go left at the first turn',
                    result: 'fail',
                    feedback: "Dead end! There's a big wall blocking the left path. Milo bumps his nose! 🐭💫 Back to the start.",
                    sceneState: 'left-blocked'
                },
                {
                    label: '➡️ Go right at the first turn',
                    result: 'partial',
                    feedback: "Good progress! Milo gets pretty far going right… but then hits another wall. He's halfway but stuck! 🧱",
                    sceneState: 'right-partial'
                }
            ],
            hint: 'There\'s a hidden middle path that most people don\'t notice. What if Milo went straight through the center?',
            solution: {
                label: '⬆️ Go straight through the middle!',
                feedback: 'The middle path was a shortcut all along! Milo zooms straight to the cheese. Dinner is served! 🧀🎉',
                sceneState: 'solved'
            }
        },
        {
            id: 'sort',
            icon: '🤖',
            title: "Rainbow Robot's Mixed-Up Blocks",
            teaser: 'A factory robot has jumbled all the color blocks!',
            color: '#F9A825',
            picture: renderSortScene,
            story: "Rainbow Robot works in the block factory, but today all the colored blocks got totally mixed up! The sorting machine won't start until the blocks are in the right order. Can you figure out a way to sort them?",
            attempts: [
                {
                    label: '📏 Sort them by size (big to small)',
                    result: 'fail',
                    feedback: "BUZZ! The machine rejects them! It doesn't care about size at all. 🚫 The blocks are still a jumbled mess.",
                    sceneState: 'size-fail'
                },
                {
                    label: '🔺 Sort them by shape',
                    result: 'partial',
                    feedback: 'Some blocks match by shape, but the colors are still all wrong. The machine only accepts part of the order. 🤖💭',
                    sceneState: 'shape-partial'
                }
            ],
            hint: 'Look very carefully at the blocks… they each have a different color. What if the machine needs them sorted by COLOR?',
            solution: {
                label: '🌈 Sort by color (red → blue → green)!',
                feedback: 'DING DING DING! The machine whirs to life! Color was the key all along! Rainbow Robot does a happy spin! 🌈🤖✨',
                sceneState: 'sorted'
            }
        },
        {
            id: 'tower',
            icon: '⭐',
            title: "Builder Billy's Wobbly Tower",
            teaser: 'A brave builder needs to stack blocks to reach a star!',
            color: '#0984E3',
            picture: renderTowerScene,
            story: "Builder Billy spotted a beautiful star floating in the sky and wants to touch it! He has a pile of blocks in different sizes, but every tower he builds keeps wobbling and falling down. Can you figure out a way to stack them so the tower is tall AND steady?",
            attempts: [
                {
                    label: '🔼 Put the small blocks on the bottom',
                    result: 'fail',
                    feedback: "Timber! The tiny blocks can't hold the heavy blocks above and the whole tower crashes down! 😱 BOOM.",
                    sceneState: 'topple'
                },
                {
                    label: '📦 Stack all same-size blocks',
                    result: 'partial',
                    feedback: "The tower is steady… but it's not tall enough to reach the star! Billy stretches on his tippy-toes and still can't reach. 🌟",
                    sceneState: 'too-short'
                }
            ],
            hint: 'Think about real buildings and trees — they\'re always wider and heavier at the bottom. What if the BIGGEST blocks go at the bottom?',
            solution: {
                label: '🏗️ Biggest blocks on the bottom!',
                feedback: 'The tower stands TALL and STRONG! Biggest at the bottom, smallest at the top — Billy reaches the star! ⭐🎊',
                sceneState: 'solved'
            }
        }
    ];

    /* ── Scene Renderers ────────────────────────────────────────────── */

    function renderRiverScene(state) {
        var scenes = {
            default: `
                <div class="mys-scene-row">
                    <div class="mys-scene-block mys-ground">🌲</div>
                    <div class="mys-scene-block mys-river">〰️〰️〰️</div>
                    <div class="mys-scene-block mys-ground">🏠</div>
                </div>
                <div class="mys-scene-row">
                    <div class="mys-scene-fox">🦊</div>
                    <div class="mys-scene-options">
                        <div class="mys-scene-item">🌉<span>Bridge</span></div>
                        <div class="mys-scene-item">🪨<span>Stones</span></div>
                    </div>
                    <div class="mys-scene-goal">🍖</div>
                </div>`,
            'bridge-fail': `
                <div class="mys-scene-row">
                    <div class="mys-scene-block mys-ground">🌲</div>
                    <div class="mys-scene-block mys-river">💦🌉💥</div>
                    <div class="mys-scene-block mys-ground">🏠</div>
                </div>
                <div class="mys-scene-row mys-center">
                    <span class="mys-scene-big">🦊💦</span>
                </div>`,
            'stones-partial': `
                <div class="mys-scene-row">
                    <div class="mys-scene-block mys-ground">🌲</div>
                    <div class="mys-scene-block mys-river">🪨&nbsp;&nbsp;&nbsp;&nbsp;🪨&nbsp;&nbsp;&nbsp;&nbsp;🪨</div>
                    <div class="mys-scene-block mys-ground">🏠</div>
                </div>
                <div class="mys-scene-row mys-center">
                    <span class="mys-scene-big">🦊😮 halfway!</span>
                </div>`,
            solved: `
                <div class="mys-scene-row">
                    <div class="mys-scene-block mys-ground">🌲</div>
                    <div class="mys-scene-block mys-river mys-success-river">🪨🦊🪨🪨🪨</div>
                    <div class="mys-scene-block mys-ground">🏠✅</div>
                </div>
                <div class="mys-scene-row mys-center">
                    <span class="mys-scene-big mys-pop">🦊🎉 Made it!</span>
                </div>`
        };
        return scenes[state] || scenes['default'];
    }

    function renderScaleScene(state) {
        var scenes = {
            default: `
                <div class="mys-scale-wrap">
                    <div class="mys-scale-beam mys-tilt-left">
                        <div class="mys-scale-pan mys-pan-left">
                            <span>🟦🟦🟦🟦</span><br><small>Heavy!</small>
                        </div>
                        <div class="mys-scale-pivot">▲</div>
                        <div class="mys-scale-pan mys-pan-right">
                            <span>🟨🟨</span><br><small>Light</small>
                        </div>
                    </div>
                </div>`,
            overload: `
                <div class="mys-scale-wrap">
                    <div class="mys-scale-beam mys-tilt-right">
                        <div class="mys-scale-pan mys-pan-left">
                            <span>🟦🟦🟦🟦</span>
                        </div>
                        <div class="mys-scale-pivot">▲</div>
                        <div class="mys-scale-pan mys-pan-right">
                            <span>🟨🟨🟨🟨🟨</span><br><small>Too heavy!</small>
                        </div>
                    </div>
                    <div class="mys-scene-row mys-center"><span>😬</span></div>
                </div>`,
            'still-off': `
                <div class="mys-scale-wrap">
                    <div class="mys-scale-beam mys-tilt-left-sm">
                        <div class="mys-scale-pan mys-pan-left">
                            <span>🟦🟦🟦</span><br><small>Still off…</small>
                        </div>
                        <div class="mys-scale-pivot">▲</div>
                        <div class="mys-scale-pan mys-pan-right">
                            <span>🟨🟨</span>
                        </div>
                    </div>
                </div>`,
            balanced: `
                <div class="mys-scale-wrap">
                    <div class="mys-scale-beam mys-balanced">
                        <div class="mys-scale-pan mys-pan-left">
                            <span>🟦🟦🟦</span>
                        </div>
                        <div class="mys-scale-pivot mys-success-pivot">▲</div>
                        <div class="mys-scale-pan mys-pan-right">
                            <span>🟨🟨🟦</span>
                        </div>
                    </div>
                    <div class="mys-scene-row mys-center"><span class="mys-pop">⚖️✅ Balanced!</span></div>
                </div>`
        };
        return scenes[state] || scenes['default'];
    }

    function renderMazeScene(state) {
        var grids = {
            default: [
                ['S','·','·','·'],
                ['█','█','·','█'],
                ['·','·','·','·'],
                ['·','█','█','C']
            ],
            'left-blocked': [
                ['S','█','·','·'],
                ['█','█','·','█'],
                ['·','·','·','·'],
                ['·','█','█','C']
            ],
            'right-partial': [
                ['S','·','·','·'],
                ['█','█','·','█'],
                ['·','·','🐭','·'],
                ['·','█','█','C']
            ],
            solved: [
                ['🐭','·','·','·'],
                ['█','█','·','█'],
                ['·','·','·','·'],
                ['·','█','█','🧀']
            ]
        };
        var grid = grids[state] || grids['default'];
        var cellColors = { 'S': '#6C5CE7', 'C': '#F9A825', '🐭': '#6C5CE7', '🧀': '#F9A825', '█': '#2D3436' };
        var html = '<div class="mys-maze">';
        grid.forEach(function (row) {
            html += '<div class="mys-maze-row">';
            row.forEach(function (cell) {
                var bg = cellColors[cell] || 'transparent';
                var isWall = cell === '█';
                html += '<div class="mys-maze-cell' + (isWall ? ' mys-wall' : '') + '" style="background:' + (isWall ? bg : 'transparent') + '">';
                if (!isWall) html += cell === '·' ? '' : cell;
                html += '</div>';
            });
            html += '</div>';
        });
        html += '</div>';
        if (state === 'solved') html += '<div class="mys-scene-row mys-center mys-pop"><span>🐭🧀 Found it!</span></div>';
        return html;
    }

    function renderSortScene(state) {
        var configs = {
            default:        ['🟥','🟦','🟩','🟥','🟩','🟦'],
            'size-fail':    ['🔴','🟠','🟡','🟢','🔵','🟣'],
            'shape-partial':['🔺','🔺','🟦','🟥','🔷','🟩'],
            sorted:         ['🟥','🟥','🟦','🟦','🟩','🟩']
        };
        var blocks = configs[state] || configs['default'];
        var label = state === 'sorted' ? '✅ Sorted by color!' : (state === 'default' ? 'All mixed up!' : '');
        return '<div class="mys-sort-row">' +
            blocks.map(function (b) { return '<span class="mys-sort-block">' + b + '</span>'; }).join('') +
            '</div>' +
            (label ? '<div class="mys-scene-row mys-center' + (state === 'sorted' ? ' mys-pop' : '') + '"><span>' + label + '</span></div>' : '');
    }

    function renderTowerScene(state) {
        var towers = {
            default: ['small at top ↑', '🟦🟦', '🟩🟩🟩', '🟥🟥🟥🟥', 'big at bottom? ↓'],
            topple:  ['💥 CRASH! 💥', '🟦 🟩 🟥', '(all fallen)'],
            'too-short': ['⭐ ← too far!', '│', '🟦🟦🟦', '🟦🟦🟦', '🟦🟦🟦'],
            solved:  ['⭐ ← reached!', '🟦🟦', '🟩🟩🟩', '🟥🟥🟥🟥']
        };
        var layers = towers[state] || towers['default'];
        return '<div class="mys-tower">' +
            layers.map(function (l, i) {
                var isStar = l.includes('⭐');
                return '<div class="mys-tower-layer' + (isStar ? ' mys-star-layer' : '') + (state === 'solved' && i === 0 ? ' mys-pop' : '') + '">' + l + '</div>';
            }).join('') +
            '</div>';
    }

    /* ── Render Router ──────────────────────────────────────────────── */

    function render() {
        if (!container) return;
        if (currentView === 'list')    renderList();
        else if (currentView === 'puzzle') renderPuzzle();
        else if (currentView === 'complete') renderComplete();
    }

    /* ── Puzzle List ────────────────────────────────────────────────── */

    function renderList() {
        var data = getModuleData('mystery-solver');
        var completed = data.completed || {};

        var html = '<div class="mys-intro-banner">';
        html += '<div class="mys-intro-icon">🔍</div>';
        html += '<div class="mys-intro-text">';
        html += '<div class="mys-intro-title">Mystery Solver</div>';
        html += '<div class="mys-intro-sub">Think, try, and figure it out!</div>';
        html += '</div></div>';

        html += '<div class="mys-list">';
        PUZZLES.forEach(function (puzzle, idx) {
            var done = completed[puzzle.id];
            var locked = idx > 0 && !completed[PUZZLES[idx - 1].id];
            var starsHtml = '';
            for (var i = 0; i < 3; i++) {
                starsHtml += '<span class="mys-mini-star' + (done && i === 0 ? ' filled' : '') + '">★</span>';
            }
            html += '<div class="mys-puzzle-card' + (locked ? ' mys-locked' : '') + '" data-id="' + puzzle.id + '" style="--puz-color:' + puzzle.color + '">';
            html += '<div class="mys-card-color-bar" style="background:' + puzzle.color + '"></div>';
            html += '<div class="mys-card-body">';
            html += '<div class="mys-card-icon">' + puzzle.icon + '</div>';
            html += '<div class="mys-card-info">';
            html += '<div class="mys-card-title">' + puzzle.title + '</div>';
            html += '<div class="mys-card-teaser">' + puzzle.teaser + '</div>';
            html += '<div class="mys-card-stars">' + starsHtml + '</div>';
            html += '</div>';
            if (locked) {
                html += '<div class="mys-lock-badge">🔒</div>';
            } else if (done) {
                html += '<div class="mys-done-badge">✓</div>';
            } else {
                html += '<div class="mys-play-badge" style="background:' + puzzle.color + '">▶</div>';
            }
            html += '</div></div>';
        });
        html += '</div>';

        container.innerHTML = html;

        container.querySelectorAll('.mys-puzzle-card:not(.mys-locked)').forEach(function (card) {
            card.addEventListener('click', function () {
                playTapSound();
                var id = card.getAttribute('data-id');
                currentPuzzle = PUZZLES.find(function (p) { return p.id === id; });
                currentStep = 0;
                showingHint = false;
                solved = false;
                currentView = 'puzzle';
                render();
            });
        });
    }

    /* ── Puzzle View ────────────────────────────────────────────────── */

    function renderPuzzle() {
        if (!currentPuzzle) { currentView = 'list'; render(); return; }

        var p = currentPuzzle;
        var allAttemptsDone = currentStep >= p.attempts.length;
        var currentAttempt = !allAttemptsDone ? p.attempts[currentStep] : null;

        // Determine which scene state to show
        var sceneState = 'default';
        if (solved) {
            sceneState = p.solution.sceneState;
        } else if (currentStep > 0 && p.attempts[currentStep - 1]) {
            sceneState = p.attempts[currentStep - 1].sceneState;
        }

        var html = '<div class="mys-puzzle-wrap">';

        // Back nav
        html += '<button class="mys-back-link" id="mys-back">← All Puzzles</button>';

        // Story header
        html += '<div class="mys-story-header" style="border-color:' + p.color + '">';
        html += '<div class="mys-story-icon">' + p.icon + '</div>';
        html += '<div class="mys-story-body">';
        html += '<div class="mys-story-title">' + p.title + '</div>';
        html += '<div class="mys-story-text">' + p.story + '</div>';
        html += '</div></div>';

        // Visual scene
        html += '<div class="mys-scene-card">';
        html += '<div class="mys-scene-label">🖼️ The Puzzle</div>';
        html += '<div class="mys-scene-art" id="mys-scene-art">' + p.picture(sceneState) + '</div>';
        html += '</div>';

        // Prompt
        html += '<div class="mys-prompt" style="border-left-color:' + p.color + '">';
        html += '<span class="mys-prompt-emoji">🤔</span>';
        html += '<span class="mys-prompt-text">' + (solved ? '🎉 Puzzle solved!' : '"Can you figure out a way?"') + '</span>';
        html += '</div>';

        // Feedback from last attempt
        if (currentStep > 0 && !solved) {
            var lastAttempt = p.attempts[currentStep - 1];
            var feedbackClass = lastAttempt.result === 'fail' ? 'mys-feedback-fail' : 'mys-feedback-partial';
            html += '<div class="mys-feedback ' + feedbackClass + '">';
            html += '<div class="mys-feedback-icon">' + (lastAttempt.result === 'fail' ? '❌' : '🔶') + '</div>';
            html += '<div class="mys-feedback-text">' + lastAttempt.feedback + '</div>';
            html += '</div>';
        }

        // Solved feedback
        if (solved) {
            html += '<div class="mys-feedback mys-feedback-success">';
            html += '<div class="mys-feedback-icon">🌟</div>';
            html += '<div class="mys-feedback-text">' + p.solution.feedback + '</div>';
            html += '</div>';
            html += '<button class="mys-btn-primary mys-btn-done" id="mys-done-btn" style="background:' + p.color + '">Back to Puzzles →</button>';
        } else {
            // Hint from app
            if (showingHint) {
                html += '<div class="mys-hint-bubble">';
                html += '<div class="mys-hint-avatar">🤖</div>';
                html += '<div class="mys-hint-content">';
                html += '<div class="mys-hint-label">Hint from your helper:</div>';
                html += '<div class="mys-hint-text">' + p.hint + '</div>';
                html += '</div></div>';
            }

            // Choices
            html += '<div class="mys-choices">';
            html += '<div class="mys-choices-label">What should ' + p.icon + ' try?</div>';

            if (!allAttemptsDone) {
                // Show remaining attempts
                for (var i = currentStep; i < p.attempts.length; i++) {
                    html += '<button class="mys-choice-btn" data-attempt="' + i + '" style="--choice-color:' + p.color + '">' + p.attempts[i].label + '</button>';
                }
            }

            // Always show the solution after all wrong attempts
            if (allAttemptsDone || showingHint) {
                html += '<button class="mys-choice-btn mys-choice-solution" id="mys-solution-btn" style="--choice-color:' + p.color + '">' + p.solution.label + '</button>';
            }

            html += '</div>';
        }

        html += '</div>'; // .mys-puzzle-wrap
        container.innerHTML = html;

        // Wire up back
        var backBtn = document.getElementById('mys-back');
        if (backBtn) {
            backBtn.addEventListener('click', function () {
                playTapSound();
                currentView = 'list';
                render();
            });
        }

        // Wire up attempt buttons
        container.querySelectorAll('.mys-choice-btn[data-attempt]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var idx = parseInt(btn.getAttribute('data-attempt'));
                playTapSound();
                handleAttempt(idx);
            });
        });

        // Wire up solution button
        var solBtn = document.getElementById('mys-solution-btn');
        if (solBtn) {
            solBtn.addEventListener('click', function () {
                playTapSound();
                handleSolution();
            });
        }

        // Wire up done button
        var doneBtn = document.getElementById('mys-done-btn');
        if (doneBtn) {
            doneBtn.addEventListener('click', function () {
                playTapSound();
                currentView = 'list';
                render();
            });
        }
    }

    function handleAttempt(idx) {
        var attempt = currentPuzzle.attempts[idx];
        if (!attempt) return;

        currentStep = idx + 1;
        var allDone = currentStep >= currentPuzzle.attempts.length;

        if (allDone) {
            showingHint = true;
        }

        // Wrong / partial sound
        if (typeof playWrongSound === 'function') playWrongSound();
        if (navigator.vibrate) navigator.vibrate(attempt.result === 'fail' ? [40] : [20, 20, 20]);

        setMascot(attempt.result === 'fail' ? 'encourage' : 'thinking');
        render();
    }

    function handleSolution() {
        solved = true;

        // Save progress
        var data = getModuleData('mystery-solver');
        var completed = data.completed || {};
        var isNew = !completed[currentPuzzle.id];

        if (isNew) {
            completed[currentPuzzle.id] = { stars: 1 };
            var newStars = (data.stars || 0) + 1;
            updateModuleData('mystery-solver', { completed: completed, stars: newStars });
            handleCorrectAnswer();
        } else {
            setMascot('correct');
            playCorrectSound();
        }

        render();
    }

    /* ── Init & Cleanup ─────────────────────────────────────────────── */

    function init(el) {
        container = el;
        currentView = 'list';
        currentPuzzle = null;
        currentStep = 0;
        showingHint = false;
        solved = false;
        render();
        setMascot('wave');
    }

    function cleanup() {
        container = null;
    }

    function getProgress() {
        var data = getModuleData('mystery-solver');
        var completed = data.completed || {};
        var count = Object.keys(completed).length;
        return {
            stars: data.stars || 0,
            detail: count + ' / ' + PUZZLES.length + ' puzzles solved'
        };
    }

    /* ── Register ───────────────────────────────────────────────────── */

    registerModule({
        id: 'mystery-solver',
        title: 'Mystery Solver',
        icon: '🔍',
        color: '#E17055',
        category: 'Problem-Solving',
        init: init,
        cleanup: cleanup,
        getProgress: getProgress
    });

})();
