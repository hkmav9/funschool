/* story.js - Story Spark: creativity module */

(function () {
    var container = null;
    var view = 'menu';   // 'menu' | 'build' | 'reveal' | 'done'
    var step = 0;        // 0-3 = pick phase; 4 = reveal
    var picks = {};      // { hero, world, challenge, magic }
    var transitioning = false; // guard against rapid double-taps

    /* ── Story Ingredient Data ──────────────────────────────────────── */

    var STEPS = [
        {
            key: 'hero',
            question: 'Who is your hero?',
            emoji: '🦸',
            color: '#FF6B9D',
            choices: [
                { label: 'Brave Knight',     icon: '🧝', color: '#A855F7' },
                { label: 'Tiny Robot',        icon: '🤖', color: '#3B82F6' },
                { label: 'Sky Dragon',        icon: '🐲', color: '#10B981' },
                { label: 'Ocean Mermaid',     icon: '🧜', color: '#06B6D4' },
                { label: 'Time Traveler',     icon: '🧑‍🚀', color: '#F59E0B' },
                { label: 'Magic Fox',         icon: '🦊', color: '#EF4444' }
            ]
        },
        {
            key: 'world',
            question: 'Where does the story happen?',
            emoji: '🌍',
            color: '#6C5CE7',
            choices: [
                { label: 'Cloud Castle',  icon: '🏰', color: '#8B5CF6' },
                { label: 'Deep Ocean',    icon: '🌊', color: '#0EA5E9' },
                { label: 'Candy Forest', icon: '🍭', color: '#EC4899' },
                { label: 'Space Station',icon: '🛸', color: '#1D4ED8' },
                { label: 'Mushroom Town',icon: '🍄', color: '#D97706' },
                { label: 'Frozen Tundra',icon: '❄️', color: '#67E8F9' }
            ]
        },
        {
            key: 'challenge',
            question: 'What is the big problem?',
            emoji: '⚡',
            color: '#F59E0B',
            choices: [
                { label: 'Something is lost!',    icon: '🔍', color: '#EF4444' },
                { label: 'A friend needs help',   icon: '🤝', color: '#10B981' },
                { label: 'A monster appeared',    icon: '👾', color: '#7C3AED' },
                { label: 'Everything went dark',  icon: '🌑', color: '#374151' },
                { label: 'Time is running out',   icon: '⏳', color: '#F97316' },
                { label: 'A riddle must be solved',icon: '❓', color: '#0891B2' }
            ]
        },
        {
            key: 'magic',
            question: 'What is your magic twist?',
            emoji: '✨',
            color: '#10B981',
            choices: [
                { label: 'A secret map appears',    icon: '🗺️', color: '#059669' },
                { label: 'Animals start talking',   icon: '🐾', color: '#D97706' },
                { label: 'You grow super tiny',     icon: '🔬', color: '#7C3AED' },
                { label: 'A rainbow bridge forms',  icon: '🌈', color: '#EC4899' },
                { label: 'Stars fall down to help', icon: '🌟', color: '#F59E0B' },
                { label: 'Music solves everything', icon: '🎵', color: '#3B82F6' }
            ]
        }
    ];

    /* ── Story Template Engine ──────────────────────────────────────── */

    var STORY_TEMPLATES = [
        '{hero} was exploring {world} when suddenly {challenge}! Everything felt impossible — until {magic}. Working hard and staying brave, {hero} saved the day. The whole {world} cheered! 🎉',
        'Deep inside {world}, {hero} discovered that {challenge}. Nobody knew what to do. Then {magic}, and everything changed! {hero} smiled and knew: even the toughest problems have answers. ✨',
        'It was a normal day in {world} — until {challenge}. {hero} took a deep breath and thought carefully. Just when hope seemed lost, {magic}! With courage and cleverness, {hero} turned the whole adventure into a triumph. 🌟',
        '{hero} had always dreamed of {world}. But on arrival, {challenge}. The journey was long and hard — then {magic} lit the way forward! {hero} learned that the best stories happen when you never give up. 🚀'
    ];

    function buildStory(p) {
        var template = STORY_TEMPLATES[Math.floor(Math.random() * STORY_TEMPLATES.length)];
        var heroText  = p.hero.icon + ' ' + p.hero.label;
        var worldText = p.world.icon + ' ' + p.world.label;
        var chalText  = p.challenge.label.toLowerCase();
        var magicText = p.magic.label.toLowerCase();
        return template
            .replace(/{hero}/g,      heroText)
            .replace(/{world}/g,     worldText)
            .replace(/{challenge}/g, chalText)
            .replace(/{magic}/g,     magicText);
    }

    /* ── Render Router ──────────────────────────────────────────────── */

    function render() {
        if (!container) return;
        if (view === 'menu')   renderMenu();
        else if (view === 'build')  renderBuild();
        else if (view === 'reveal') renderReveal();
    }

    /* ── Menu / Story Gallery ───────────────────────────────────────── */

    function renderMenu() {
        var data = getModuleData('story-spark');
        var stories = data.stories || [];

        var html = '';

        // Hero banner
        html += '<div class="ss-banner">';
        html += '  <div class="ss-banner-sparkles" aria-hidden="true">✨ 🌟 ⭐ 💫 ✨</div>';
        html += '  <div class="ss-banner-title">Story Spark</div>';
        html += '  <div class="ss-banner-sub">Pick • Mix • Create your own adventure!</div>';
        html += '  <button class="ss-create-btn" id="ss-new">🪄 Make a New Story</button>';
        html += '</div>';

        if (stories.length > 0) {
            html += '<div class="ss-section-label">Your Stories (' + stories.length + ')</div>';
            html += '<div class="ss-story-list">';
            stories.slice().reverse().forEach(function (s, i) {
                var idx = stories.length - 1 - i;
                html += '<div class="ss-story-card" data-idx="' + idx + '" style="--ss-color:' + s.heroColor + '">';
                html += '  <div class="ss-story-icons">' + s.heroIcon + s.worldIcon + s.challengeIcon + s.magicIcon + '</div>';
                html += '  <div class="ss-story-preview">' + escapeHTML(s.text.slice(0, 80)) + '…</div>';
                html += '  <div class="ss-story-read">Read →</div>';
                html += '</div>';
            });
            html += '</div>';
        } else {
            html += '<div class="ss-empty">Tap <b>Make a New Story</b> to begin your first adventure! 🌈</div>';
        }

        container.innerHTML = html;

        document.getElementById('ss-new').addEventListener('click', function () {
            playTapSound();
            step = 0;
            picks = {};
            view = 'build';
            render();
        });

        container.querySelectorAll('.ss-story-card').forEach(function (card) {
            card.addEventListener('click', function () {
                playTapSound();
                var idx = parseInt(card.getAttribute('data-idx'));
                var data = getModuleData('story-spark');
                var s = (data.stories || [])[idx];
                if (!s) return;
                picks = { savedText: s.text, heroIcon: s.heroIcon, heroColor: s.heroColor };
                view = 'reveal';
                render();
            });
        });
    }

    /* ── Build Wizard ───────────────────────────────────────────────── */

    function renderBuild() {
        var currentStep = STEPS[step];
        var progressPct = Math.round((step / STEPS.length) * 100);

        var html = '<div class="ss-build-wrap">';

        // Progress bar
        html += '<div class="ss-progress-bar"><div class="ss-progress-fill" style="width:' + progressPct + '%"></div></div>';

        // Step indicator pills
        html += '<div class="ss-step-pills">';
        STEPS.forEach(function (s, i) {
            var done  = i < step;
            var active = i === step;
            html += '<div class="ss-step-pill' + (done ? ' done' : '') + (active ? ' active' : '') + '">';
            if (done) html += picks[s.key].icon;
            else html += s.emoji;
            html += '</div>';
        });
        html += '</div>';

        // Question card
        html += '<div class="ss-question" style="--ss-qcolor:' + currentStep.color + '">';
        html += '  <div class="ss-q-number">Step ' + (step + 1) + ' of ' + STEPS.length + '</div>';
        html += '  <div class="ss-q-text">' + currentStep.question + '</div>';
        html += '</div>';

        // Choice grid
        html += '<div class="ss-choice-grid">';
        currentStep.choices.forEach(function (choice, i) {
            html += '<button class="ss-choice" data-i="' + i + '" style="--ss-ccolor:' + choice.color + '">';
            html += '  <div class="ss-choice-icon">' + choice.icon + '</div>';
            html += '  <div class="ss-choice-label">' + choice.label + '</div>';
            html += '</button>';
        });
        html += '</div>';

        // Back button
        if (step > 0) {
            html += '<button class="ss-back-link" id="ss-back">← Back</button>';
        } else {
            html += '<button class="ss-back-link" id="ss-back">← Stories</button>';
        }

        html += '</div>'; // .ss-build-wrap
        container.innerHTML = html;

        // Animate in
        requestAnimationFrame(function () {
            var grid = container.querySelector('.ss-choice-grid');
            if (grid) grid.classList.add('ss-animate-in');
        });

        container.querySelectorAll('.ss-choice').forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (transitioning) return;
                transitioning = true;
                playTapSound();
                var i = parseInt(btn.getAttribute('data-i'));
                var chosen = currentStep.choices[i];
                picks[currentStep.key] = chosen;

                btn.classList.add('ss-choice-selected');
                setTimeout(function () {
                    transitioning = false;
                    step++;
                    if (step >= STEPS.length) {
                        view = 'reveal';
                        finishStory();
                        render();
                    } else {
                        render();
                    }
                }, 260);
            });
        });

        var backBtn = document.getElementById('ss-back');
        if (backBtn) {
            backBtn.addEventListener('click', function () {
                playTapSound();
                if (step === 0) {
                    view = 'menu';
                } else {
                    step--;
                    delete picks[STEPS[step].key];
                }
                render();
            });
        }
    }

    /* ── Story Reveal ───────────────────────────────────────────────── */

    function finishStory() {
        var storyText = buildStory(picks);
        picks.builtText = storyText;

        // Save to progress
        var data = getModuleData('story-spark');
        var stories = data.stories || [];
        stories.push({
            text:          storyText,
            heroIcon:      picks.hero.icon,
            heroColor:     picks.hero.color,
            worldIcon:     picks.world.icon,
            challengeIcon: picks.challenge.icon,
            magicIcon:     picks.magic.icon
        });
        var totalStars = (data.stars || 0) + 1;
        updateModuleData('story-spark', { stories: stories, stars: totalStars });
        handleCorrectAnswer();
    }

    function renderReveal() {
        var text    = picks.builtText || picks.savedText || '';
        var accent  = (picks.hero && picks.hero.color) || (picks.heroColor) || '#A855F7';
        var heroIcon = (picks.hero && picks.hero.icon) || picks.heroIcon || '⭐';

        // Split into sentences for animated reveal
        var sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

        var html = '<div class="ss-reveal-wrap">';

        // Celebration header
        html += '<div class="ss-reveal-header" style="--ss-rcolor:' + accent + '">';
        html += '  <div class="ss-reveal-sparkles" aria-hidden="true">✨ 🌟 💫 ⭐ ✨</div>';
        html += '  <div class="ss-reveal-hero">' + heroIcon + '</div>';
        html += '  <div class="ss-reveal-headline">Your Story!</div>';
        html += '</div>';

        // Story card with animated sentences
        html += '<div class="ss-story-scroll">';
        html += '  <div class="ss-story-text">';
        sentences.forEach(function (sentence, i) {
            html += '<span class="ss-sentence" style="animation-delay:' + (i * 0.18) + 's">' + escapeHTML(sentence.trim()) + ' </span>';
        });
        html += '  </div>';
        html += '</div>';

        // Ingredient recap
        if (picks.hero) {
            html += '<div class="ss-ingredients">';
            html += '  <div class="ss-ing-label">Your mix:</div>';
            html += '  <div class="ss-ing-row">';
            ['hero','world','challenge','magic'].forEach(function (key) {
                if (picks[key]) {
                    html += '<div class="ss-ing-chip" style="background:' + picks[key].color + '22; border-color:' + picks[key].color + '">';
                    html += picks[key].icon + ' ' + picks[key].label;
                    html += '</div>';
                }
            });
            html += '  </div>';
            html += '</div>';
        }

        // Action buttons
        html += '<div class="ss-reveal-actions">';
        html += '  <button class="ss-btn-primary" id="ss-new-story" style="background:' + accent + '">🪄 Make Another</button>';
        html += '  <button class="ss-btn-secondary" id="ss-go-menu">📚 My Stories</button>';
        html += '</div>';

        html += '</div>'; // .ss-reveal-wrap
        container.innerHTML = html;

        document.getElementById('ss-new-story').addEventListener('click', function () {
            playTapSound();
            step = 0;
            picks = {};
            view = 'build';
            render();
        });
        document.getElementById('ss-go-menu').addEventListener('click', function () {
            playTapSound();
            view = 'menu';
            render();
        });
    }

    /* ── Helpers ────────────────────────────────────────────────────── */

    function escapeHTML(str) {
        return String(str)
            .replace(/&/g,'&amp;').replace(/</g,'&lt;')
            .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    /* ── Lifecycle ──────────────────────────────────────────────────── */

    function init(el) {
        container = el;
        view = 'menu';
        step = 0;
        picks = {};
        transitioning = false;
        render();
        setMascot('wave');
    }

    function cleanup() { container = null; }

    function getProgress() {
        var data = getModuleData('story-spark');
        var count = (data.stories || []).length;
        return {
            stars:  data.stars || 0,
            detail: count + ' stor' + (count === 1 ? 'y' : 'ies') + ' created'
        };
    }

    /* ── Register ───────────────────────────────────────────────────── */

    registerModule({
        id:       'story-spark',
        title:    'Story Spark',
        icon:     '🪄',
        color:    '#A855F7',
        category: 'Creativity',
        init:     init,
        cleanup:  cleanup,
        getProgress: getProgress
    });

})();
