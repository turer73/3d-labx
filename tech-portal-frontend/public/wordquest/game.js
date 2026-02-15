// ===== WORDQUEST - GAME ENGINE =====

(function() {
    'use strict';

    // ===== STATE =====
    const QUESTIONS_PER_ROUND = 10;
    const TIMER_SECONDS = 30;
    const XP_CORRECT = 10;
    const XP_STREAK_BONUS = 5;
    const XP_TIME_BONUS = 3;
    const XP_PER_LEVEL = 100;

    let wordData = null;
    let state = {
        mode: 'vocabulary',
        exam: 'all',
        level: 'all',
        questions: [],
        currentIndex: 0,
        score: 0,
        xpEarned: 0,
        streak: 0,
        bestStreak: 0,
        timer: TIMER_SECONDS,
        timerInterval: null,
        answered: false,
        wrongAnswers: []
    };

    let stats = loadStats();

    // ===== DOM ELEMENTS =====
    const $ = (id) => document.getElementById(id);
    const screens = {
        splash: $('splash'),
        home: $('home'),
        quiz: $('quiz'),
        results: $('results')
    };

    // ===== INIT =====
    async function init() {
        try {
            const res = await fetch('data/words.json');
            wordData = await res.json();
            updateHomeUI();
            setTimeout(() => showScreen('home'), 2200);
        } catch(e) {
            console.error('Word data load error:', e);
            document.querySelector('.splash-hint').textContent = 'Veri yüklenirken hata oluştu!';
        }
        bindEvents();
    }

    // ===== STATS =====
    function loadStats() {
        try {
            const saved = localStorage.getItem('wq_stats');
            return saved ? JSON.parse(saved) : {
                totalXP: 0,
                level: 1,
                streak: 0,
                lastPlayDate: null,
                gamesPlayed: 0,
                totalCorrect: 0,
                totalQuestions: 0,
                bestStreak: 0,
                learnedWords: []
            };
        } catch(e) {
            return { totalXP: 0, level: 1, streak: 0, lastPlayDate: null, gamesPlayed: 0, totalCorrect: 0, totalQuestions: 0, bestStreak: 0, learnedWords: [] };
        }
    }

    function saveStats() {
        try { localStorage.setItem('wq_stats', JSON.stringify(stats)); } catch(e) {}
    }

    // ===== SCREENS =====
    function showScreen(name) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        screens[name].classList.add('active');
        if (name === 'home') updateHomeUI();
    }

    // ===== HOME UI =====
    function updateHomeUI() {
        if (!wordData) return;

        // Stats
        $('total-xp').textContent = stats.totalXP;
        $('streak-count').textContent = stats.streak;
        $('level-display').textContent = stats.level;

        // Counts
        const filtered = getFilteredQuestions();
        const vocabCount = filtered.filter(q => q._type === 'vocabulary').length;
        const phrasalCount = filtered.filter(q => q._type === 'phrasal_verb').length;
        $('vocab-count').textContent = vocabCount;
        $('phrasal-count').textContent = phrasalCount;
        $('mixed-count').textContent = vocabCount + phrasalCount;

        // Quick Stats
        $('qs-played').textContent = stats.gamesPlayed;
        $('qs-correct').textContent = stats.totalQuestions > 0
            ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) + '%'
            : '0%';
        $('qs-words').textContent = stats.learnedWords.length;
        $('qs-best').textContent = stats.bestStreak;

        // Check daily streak
        checkDailyStreak();
    }

    function checkDailyStreak() {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (stats.lastPlayDate === today) return;
        if (stats.lastPlayDate !== yesterday && stats.lastPlayDate !== today) {
            stats.streak = 0;
            saveStats();
        }
    }

    function getFilteredQuestions() {
        if (!wordData) return [];

        let questions = [];

        // Add vocabulary
        if (state.mode !== 'phrasal_verb') {
            questions.push(...wordData.vocabulary.map(q => ({...q, _type: 'vocabulary'})));
        }

        // Add phrasal verbs
        if (state.mode !== 'vocabulary') {
            questions.push(...wordData.phrasal_verbs.map(q => ({...q, _type: 'phrasal_verb'})));
        }

        // Filter by exam
        if (state.exam !== 'all') {
            questions = questions.filter(q => q.exam === state.exam);
        }

        // Filter by level
        if (state.level !== 'all') {
            questions = questions.filter(q => q.level === state.level);
        }

        return questions;
    }

    // ===== EVENTS =====
    function bindEvents() {
        // Mode selection
        document.querySelectorAll('.mode-card').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.mode-card').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                state.mode = btn.dataset.mode;
                updateHomeUI();
            });
        });

        // Exam pills
        document.querySelectorAll('.exam-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('.exam-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                state.exam = pill.dataset.exam;
                updateHomeUI();
            });
        });

        // Difficulty pills
        document.querySelectorAll('.diff-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('.diff-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                state.level = pill.dataset.level;
                updateHomeUI();
            });
        });

        // Start
        $('start-game').addEventListener('click', startGame);

        // Quiz back
        $('quiz-back').addEventListener('click', () => {
            clearInterval(state.timerInterval);
            showScreen('home');
        });

        // Next
        $('next-btn').addEventListener('click', nextQuestion);

        // Results
        $('play-again').addEventListener('click', startGame);
        $('go-home').addEventListener('click', () => showScreen('home'));

        // Default selection
        document.querySelector('.mode-card[data-mode="vocabulary"]').classList.add('selected');
    }

    // ===== GAME =====
    function startGame() {
        const pool = getFilteredQuestions();
        if (pool.length === 0) {
            alert('Bu filtrelere uygun soru bulunamadı!');
            return;
        }

        // Shuffle & pick
        const shuffled = shuffleArray([...pool]);
        state.questions = shuffled.slice(0, Math.min(QUESTIONS_PER_ROUND, shuffled.length));
        state.currentIndex = 0;
        state.score = 0;
        state.xpEarned = 0;
        state.streak = 0;
        state.bestStreak = 0;
        state.wrongAnswers = [];

        showScreen('quiz');
        showQuestion();
    }

    function showQuestion() {
        const q = state.questions[state.currentIndex];
        state.answered = false;

        // Progress
        const progress = ((state.currentIndex) / state.questions.length) * 100;
        $('progress-fill').style.width = progress + '%';
        $('progress-text').textContent = `${state.currentIndex + 1}/${state.questions.length}`;

        // Status
        $('quiz-streak').textContent = state.streak;
        $('quiz-xp').textContent = state.xpEarned;

        // Badge & Level
        $('question-badge').textContent = q._type === 'vocabulary' ? 'Kelime Bilgisi' : 'Phrasal Verb';
        $('question-level').textContent = q.level;

        // Question text - highlight the blank
        const highlighted = q.sentence.replace('----', '<span style="color: var(--accent); font-weight: 800; border-bottom: 2px dashed var(--accent);">____</span>');
        $('question-text').innerHTML = highlighted;

        // Options
        const letters = ['A', 'B', 'C', 'D', 'E'];
        const optionsHTML = q.options.map((opt, i) => `
            <button class="option-btn" data-index="${i}">
                <span class="option-letter">${letters[i]}</span>
                <span class="option-text">${opt}</span>
            </button>
        `).join('');

        $('options-area').innerHTML = optionsHTML;

        // Bind option clicks
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.index)));
        });

        // Hide word info & next
        $('word-info').classList.add('hidden');
        $('next-btn').classList.add('hidden');

        // Start timer
        startTimer();
    }

    function handleAnswer(selectedIndex) {
        if (state.answered) return;
        state.answered = true;

        clearInterval(state.timerInterval);

        const q = state.questions[state.currentIndex];
        const isCorrect = selectedIndex === q.answer;

        // Mark options
        document.querySelectorAll('.option-btn').forEach((btn, i) => {
            btn.classList.add('disabled');
            if (i === q.answer) btn.classList.add('correct');
            if (i === selectedIndex && !isCorrect) btn.classList.add('wrong');
        });

        // XP calculation
        let xp = 0;
        if (isCorrect) {
            state.score++;
            state.streak++;
            if (state.streak > state.bestStreak) state.bestStreak = state.streak;

            xp = XP_CORRECT;
            if (state.streak >= 3) xp += XP_STREAK_BONUS;
            if (state.timer > 20) xp += XP_TIME_BONUS;

            state.xpEarned += xp;

            // Add to learned words
            if (!stats.learnedWords.includes(q.word)) {
                stats.learnedWords.push(q.word);
            }

            showXPPopup('+' + xp + ' XP');
        } else {
            state.streak = 0;
            state.wrongAnswers.push(q);
        }

        // Update status
        $('quiz-streak').textContent = state.streak;
        $('quiz-xp').textContent = state.xpEarned;

        // Show word info
        $('word-en').textContent = q.word;
        $('word-tr').textContent = q.meaning_tr;
        $('word-info').classList.remove('hidden');

        // Show next button
        $('next-btn').classList.remove('hidden');
        $('next-btn').textContent = state.currentIndex >= state.questions.length - 1 ? 'Sonuçları Gör →' : 'Sonraki Soru →';
    }

    function nextQuestion() {
        state.currentIndex++;
        if (state.currentIndex >= state.questions.length) {
            endGame();
        } else {
            showQuestion();
        }
    }

    function endGame() {
        clearInterval(state.timerInterval);

        // Update stats
        stats.totalXP += state.xpEarned;
        stats.level = Math.floor(stats.totalXP / XP_PER_LEVEL) + 1;
        stats.gamesPlayed++;
        stats.totalCorrect += state.score;
        stats.totalQuestions += state.questions.length;
        if (state.bestStreak > stats.bestStreak) stats.bestStreak = state.bestStreak;

        // Daily streak
        const today = new Date().toDateString();
        if (stats.lastPlayDate !== today) {
            stats.streak++;
            stats.lastPlayDate = today;
        }

        saveStats();

        // Show results
        showResults();
    }

    // ===== TIMER =====
    function startTimer() {
        state.timer = TIMER_SECONDS;
        $('timer-value').textContent = state.timer;
        $('timer-value').className = 'timer-value';

        clearInterval(state.timerInterval);
        state.timerInterval = setInterval(() => {
            state.timer--;
            $('timer-value').textContent = state.timer;

            if (state.timer <= 10) $('timer-value').className = 'timer-value warning';
            if (state.timer <= 5) $('timer-value').className = 'timer-value danger';

            if (state.timer <= 0) {
                clearInterval(state.timerInterval);
                if (!state.answered) {
                    // Time's up - auto wrong
                    handleAnswer(-1);
                }
            }
        }, 1000);
    }

    // ===== RESULTS =====
    function showResults() {
        const pct = Math.round((state.score / state.questions.length) * 100);

        // Emoji & message
        let emoji, title, subtitle;
        if (pct >= 90) { emoji = '🏆'; title = 'Mükemmel!'; subtitle = 'Sen bir kelime ustasısın!'; }
        else if (pct >= 70) { emoji = '🎉'; title = 'Harika!'; subtitle = 'Çok iyi bir performans!'; }
        else if (pct >= 50) { emoji = '👍'; title = 'İyi!'; subtitle = 'Biraz daha pratik yaparak gelişebilirsin.'; }
        else if (pct >= 30) { emoji = '💪'; title = 'Devam Et!'; subtitle = 'Pratik mükemmelleştirir!'; }
        else { emoji = '📖'; title = 'Çalışmaya Devam!'; subtitle = 'Her oyun seni daha ileriye taşır.'; }

        $('results-emoji').textContent = emoji;
        $('results-title').textContent = title;
        $('results-subtitle').textContent = subtitle;

        // Score circle
        $('score-num').textContent = pct;
        const circumference = 2 * Math.PI * 52;
        const offset = circumference - (pct / 100) * circumference;
        setTimeout(() => {
            $('score-circle').style.strokeDashoffset = offset;
            // Color based on score
            if (pct >= 70) $('score-circle').style.stroke = 'var(--success)';
            else if (pct >= 40) $('score-circle').style.stroke = 'var(--warning)';
            else $('score-circle').style.stroke = 'var(--danger)';
        }, 100);

        // Stats
        $('rs-correct').textContent = state.score;
        $('rs-wrong').textContent = state.questions.length - state.score;
        $('rs-xp').textContent = state.xpEarned;
        $('rs-streak').textContent = state.bestStreak;

        // Wrong answers review
        const reviewSection = $('review-section');
        const reviewList = $('review-list');
        reviewList.innerHTML = '';

        if (state.wrongAnswers.length > 0) {
            reviewSection.classList.remove('hidden');
            state.wrongAnswers.forEach(q => {
                const item = document.createElement('div');
                item.className = 'review-item';
                item.innerHTML = `
                    <span class="review-word">${q.word}</span>
                    <span class="review-meaning">${q.meaning_tr}</span>
                `;
                reviewList.appendChild(item);
            });
        } else {
            reviewSection.classList.add('hidden');
        }

        // Reset score circle for animation
        $('score-circle').style.strokeDashoffset = circumference;

        showScreen('results');
    }

    // ===== HELPERS =====
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function showXPPopup(text) {
        const popup = document.createElement('div');
        popup.className = 'xp-popup';
        popup.textContent = text;
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 1000);
    }

    // ===== SERVICE WORKER =====
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(e => console.log('SW error:', e));
    }

    // ===== START =====
    document.addEventListener('DOMContentLoaded', init);

})();