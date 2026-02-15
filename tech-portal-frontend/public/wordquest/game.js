// ===== WORDQUEST - GAME ENGINE v7 =====

(function() {
    'use strict';

    // ===== CONFIG =====
    const QUESTIONS_PER_ROUND = 10;
    const TIMER_DEFAULT = 30;
    const TIMER_LONG = 45;
    const XP_CORRECT = 10;
    const XP_STREAK_BONUS = 5;
    const XP_TIME_BONUS = 3;
    const XP_PER_LEVEL = 100;
    const DAILY_GOAL = 20;

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
        timer: TIMER_DEFAULT,
        timerInterval: null,
        answered: false,
        wrongAnswers: []
    };

    let stats = loadStats();
    let leitner = loadLeitner();
    let catStats = loadCatStats();

    // ===== DOM =====
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
            const def = { totalXP: 0, level: 1, streak: 0, lastPlayDate: null, gamesPlayed: 0, totalCorrect: 0, totalQuestions: 0, bestStreak: 0, learnedWords: [], dailyCount: 0, dailyDate: null };
            if (!saved) return def;
            const s = JSON.parse(saved);
            // Migrate: add dailyCount/dailyDate if missing
            if (s.dailyCount === undefined) { s.dailyCount = 0; s.dailyDate = null; }
            return s;
        } catch(e) {
            return { totalXP: 0, level: 1, streak: 0, lastPlayDate: null, gamesPlayed: 0, totalCorrect: 0, totalQuestions: 0, bestStreak: 0, learnedWords: [], dailyCount: 0, dailyDate: null };
        }
    }

    function saveStats() {
        try { localStorage.setItem('wq_stats', JSON.stringify(stats)); } catch(e) {}
    }

    // ===== LEITNER SYSTEM =====
    // Boxes: 1 = new/wrong, 2 = learning, 3 = known
    function loadLeitner() {
        try {
            const saved = localStorage.getItem('wq_leitner');
            return saved ? JSON.parse(saved) : {};
        } catch(e) { return {}; }
    }

    function saveLeitner() {
        try { localStorage.setItem('wq_leitner', JSON.stringify(leitner)); } catch(e) {}
    }

    function getLeitnerBox(qId) {
        return leitner[qId] || 0; // 0 = never seen
    }

    function updateLeitnerBox(qId, isCorrect) {
        const current = leitner[qId] || 0;
        if (isCorrect) {
            leitner[qId] = Math.min(current + 1, 3);
        } else {
            leitner[qId] = 1; // wrong → back to box 1
        }
        saveLeitner();
    }

    // ===== CATEGORY STATS =====
    function loadCatStats() {
        try {
            const saved = localStorage.getItem('wq_cat_stats');
            return saved ? JSON.parse(saved) : {};
        } catch(e) { return {}; }
    }

    function saveCatStats() {
        try { localStorage.setItem('wq_cat_stats', JSON.stringify(catStats)); } catch(e) {}
    }

    function updateCatStats(type, isCorrect) {
        if (!catStats[type]) catStats[type] = { correct: 0, total: 0 };
        catStats[type].total++;
        if (isCorrect) catStats[type].correct++;
        saveCatStats();
    }

    // ===== DAILY GOAL =====
    function getDailyProgress() {
        const today = new Date().toDateString();
        if (stats.dailyDate !== today) {
            stats.dailyCount = 0;
            stats.dailyDate = today;
            saveStats();
        }
        return stats.dailyCount;
    }

    function addDailyProgress(count) {
        const today = new Date().toDateString();
        if (stats.dailyDate !== today) {
            stats.dailyCount = 0;
            stats.dailyDate = today;
        }
        stats.dailyCount += count;
        saveStats();
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
        let allQuestions = getAllQuestions();
        if (state.exam !== 'all') allQuestions = allQuestions.filter(q => q.exam === state.exam);
        if (state.level !== 'all') allQuestions = allQuestions.filter(q => q.level === state.level);

        const counts = {};
        ['vocabulary','phrasal_verb','grammar','sentence_completion','cloze_test','dialogue','restatement'].forEach(t => {
            counts[t] = allQuestions.filter(q => q._type === t).length;
        });

        $('vocab-count').textContent = counts.vocabulary;
        $('phrasal-count').textContent = counts.phrasal_verb;
        if ($('grammar-count')) $('grammar-count').textContent = counts.grammar;
        if ($('sc-count')) $('sc-count').textContent = counts.sentence_completion;
        if ($('cloze-count')) $('cloze-count').textContent = counts.cloze_test;
        if ($('dialogue-count')) $('dialogue-count').textContent = counts.dialogue;
        if ($('restatement-count')) $('restatement-count').textContent = counts.restatement;
        $('mixed-count').textContent = allQuestions.length;

        // Leitner review count
        const reviewCount = allQuestions.filter(q => {
            const box = getLeitnerBox(q.word || q.id);
            return box === 1 || box === 2;
        }).length;
        if ($('review-count')) $('review-count').textContent = reviewCount;

        // Quick Stats
        $('qs-played').textContent = stats.gamesPlayed;
        $('qs-correct').textContent = stats.totalQuestions > 0
            ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) + '%'
            : '0%';
        $('qs-words').textContent = stats.learnedWords.length;
        $('qs-best').textContent = stats.bestStreak;

        // Daily Goal
        const dailyProgress = getDailyProgress();
        const dailyPct = Math.min(100, Math.round((dailyProgress / DAILY_GOAL) * 100));
        if ($('daily-progress-fill')) $('daily-progress-fill').style.width = dailyPct + '%';
        if ($('daily-progress-text')) $('daily-progress-text').textContent = `${dailyProgress}/${DAILY_GOAL}`;
        if ($('daily-check')) {
            $('daily-check').textContent = dailyProgress >= DAILY_GOAL ? '✅' : '';
        }

        // Category Stats
        updateCategoryStatsUI(allQuestions);

        checkDailyStreak();
    }

    function updateCategoryStatsUI(allQuestions) {
        const container = $('cat-stats-grid');
        if (!container) return;

        const typeLabels = {
            vocabulary: 'Kelime', phrasal_verb: 'Phrasal', grammar: 'Dilbilgisi',
            sentence_completion: 'Cümle T.', cloze_test: 'Boşluk D.',
            dialogue: 'Diyalog', restatement: 'Yakın Anlam'
        };

        const types = Object.keys(typeLabels);
        let html = '';

        types.forEach(type => {
            const cs = catStats[type];
            const pct = cs && cs.total > 0 ? Math.round((cs.correct / cs.total) * 100) : 0;
            const total = cs ? cs.total : 0;

            if (total === 0) return; // don't show categories not yet played

            let barColor = 'var(--danger)';
            if (pct >= 70) barColor = 'var(--success)';
            else if (pct >= 40) barColor = 'var(--warning)';

            html += `
                <div class="cat-stat-item">
                    <div class="cat-stat-header">
                        <span class="cat-stat-name">${typeLabels[type]}</span>
                        <span class="cat-stat-pct">${pct}%</span>
                    </div>
                    <div class="cat-stat-bar">
                        <div class="cat-stat-fill" style="width:${pct}%;background:${barColor}"></div>
                    </div>
                    <span class="cat-stat-detail">${cs.correct}/${cs.total}</span>
                </div>
            `;
        });

        container.innerHTML = html || '<p style="color:var(--text-dim);font-size:0.82rem;text-align:center">Henüz veri yok. Oynamaya başla!</p>';
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

    function getAllQuestions() {
        if (!wordData) return [];
        return [
            ...wordData.vocabulary.map(q => ({...q, _type: 'vocabulary'})),
            ...wordData.phrasal_verbs.map(q => ({...q, _type: 'phrasal_verb'})),
            ...(wordData.grammar || []).map(q => ({...q, _type: 'grammar'})),
            ...(wordData.sentence_completion || []).map(q => ({...q, _type: 'sentence_completion'})),
            ...(wordData.cloze_test || []).map(q => ({...q, _type: 'cloze_test'})),
            ...(wordData.dialogue || []).map(q => ({...q, _type: 'dialogue'})),
            ...(wordData.restatement || []).map(q => ({...q, _type: 'restatement'}))
        ];
    }

    function getFilteredQuestions() {
        if (!wordData) return [];

        let questions = [];

        if (state.mode === 'mixed') {
            questions = getAllQuestions();
        } else if (state.mode === 'review') {
            // Leitner review: prioritize box 1 & 2
            questions = getAllQuestions().filter(q => {
                const box = getLeitnerBox(q.word || q.id);
                return box === 1 || box === 2;
            });
        } else if (state.mode === 'vocabulary') {
            questions.push(...wordData.vocabulary.map(q => ({...q, _type: 'vocabulary'})));
        } else if (state.mode === 'phrasal_verb') {
            questions.push(...wordData.phrasal_verbs.map(q => ({...q, _type: 'phrasal_verb'})));
        } else if (state.mode === 'grammar') {
            questions.push(...(wordData.grammar || []).map(q => ({...q, _type: 'grammar'})));
        } else if (state.mode === 'sentence_completion') {
            questions.push(...(wordData.sentence_completion || []).map(q => ({...q, _type: 'sentence_completion'})));
        } else if (state.mode === 'cloze_test') {
            questions.push(...(wordData.cloze_test || []).map(q => ({...q, _type: 'cloze_test'})));
        } else if (state.mode === 'dialogue') {
            questions.push(...(wordData.dialogue || []).map(q => ({...q, _type: 'dialogue'})));
        } else if (state.mode === 'restatement') {
            questions.push(...(wordData.restatement || []).map(q => ({...q, _type: 'restatement'})));
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

        // Quiz back - with confirmation
        $('quiz-back').addEventListener('click', () => {
            if (state.currentIndex > 0 || state.answered) {
                if (!confirm('Oyundan çıkmak istediğine emin misin? İlerleme kaybolacak.')) return;
            }
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
        let pool = getFilteredQuestions();
        if (pool.length === 0) {
            if (state.mode === 'review') {
                alert('Tekrar edilecek soru yok! Önce biraz oyna.');
            } else {
                alert('Bu filtrelere uygun soru bulunamadı!');
            }
            return;
        }

        // Leitner-weighted shuffle for review mode: box 1 first, then box 2
        if (state.mode === 'review') {
            const box1 = pool.filter(q => getLeitnerBox(q.word || q.id) === 1);
            const box2 = pool.filter(q => getLeitnerBox(q.word || q.id) === 2);
            pool = [...shuffleArray(box1), ...shuffleArray(box2)];
        } else {
            pool = shuffleArray([...pool]);
        }

        state.questions = pool.slice(0, Math.min(QUESTIONS_PER_ROUND, pool.length));
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
        const badges = { vocabulary: 'Kelime Bilgisi', phrasal_verb: 'Phrasal Verb', grammar: 'Dilbilgisi', sentence_completion: 'Cümle Tamamlama', cloze_test: 'Boşluk Doldurma', dialogue: 'Diyalog Tamamlama', restatement: 'Yakın Anlam' };
        $('question-badge').textContent = badges[q._type] || q._type;
        $('question-level').textContent = q.level;

        // Leitner box indicator
        const box = getLeitnerBox(q.word || q.id);
        const boxIcons = ['🆕', '🔴', '🟡', '🟢'];
        if ($('question-badge')) {
            $('question-badge').textContent = (badges[q._type] || q._type) + ' ' + (boxIcons[box] || '');
        }

        // Question text
        let questionHTML = q.sentence;
        $('question-text').classList.remove('dialogue-text');
        if (q._type === 'dialogue') {
            questionHTML = questionHTML.replace(/([A-ZÇĞİÖŞÜa-zçğıöşü]+):/g, '<strong>$1:</strong>');
            questionHTML = questionHTML.replace(/\n/g, '<br>');
            $('question-text').classList.add('dialogue-text');
        }
        questionHTML = questionHTML.replace('----', '<span style="color: var(--accent); font-weight: 800; border-bottom: 2px dashed var(--accent);">____</span>');
        $('question-text').innerHTML = questionHTML;

        // Shuffle options
        const indices = q.options.map((_, i) => i);
        shuffleArray(indices);
        state.shuffledAnswer = indices.indexOf(q.answer);

        // Options
        const letters = ['A', 'B', 'C', 'D', 'E'];
        const isLong = q._type === 'grammar' || q._type === 'sentence_completion' || q._type === 'cloze_test' || q._type === 'dialogue' || q._type === 'restatement';
        const optionsHTML = indices.map((origIdx, i) => `
            <button class="option-btn" data-index="${i}">
                <span class="option-letter">${letters[i]}</span>
                <span class="option-text${isLong ? ' option-text-long' : ''}">${q.options[origIdx]}</span>
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
        const correctIdx = state.shuffledAnswer;
        const isCorrect = selectedIndex === correctIdx;
        const qKey = q.word || q.id;

        // Mark options
        document.querySelectorAll('.option-btn').forEach((btn, i) => {
            btn.classList.add('disabled');
            if (i === correctIdx) btn.classList.add('correct');
            if (i === selectedIndex && !isCorrect) btn.classList.add('wrong');
        });

        // Update Leitner box
        updateLeitnerBox(qKey, isCorrect);

        // Update category stats
        updateCatStats(q._type, isCorrect);

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

            // Add to learned words (cap at 500)
            if (!stats.learnedWords.includes(qKey)) {
                if (stats.learnedWords.length >= 500) stats.learnedWords.shift();
                stats.learnedWords.push(qKey);
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
        if (q.word && q.meaning_tr) {
            $('word-en').textContent = q.word;
            $('word-tr').textContent = q.meaning_tr;
        } else {
            $('word-en').textContent = isCorrect ? 'Doğru!' : 'Doğru Cevap:';
            $('word-tr').textContent = q.options[q.answer];
        }
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

        // Daily goal progress
        addDailyProgress(state.questions.length);

        saveStats();

        // Show results
        showResults();
    }

    // ===== TIMER =====
    function startTimer() {
        const q = state.questions[state.currentIndex];
        const timerSecs = (q._type === 'grammar' || q._type === 'sentence_completion' || q._type === 'cloze_test' || q._type === 'dialogue' || q._type === 'restatement') ? TIMER_LONG : TIMER_DEFAULT;
        state.timer = timerSecs;
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
                    handleTimeUp();
                }
            }
        }, 1000);
    }

    // ===== TIME UP =====
    function handleTimeUp() {
        state.answered = true;
        const q = state.questions[state.currentIndex];
        const correctIdx = state.shuffledAnswer;
        const qKey = q.word || q.id;

        // Mark all disabled + show correct
        document.querySelectorAll('.option-btn').forEach((btn, i) => {
            btn.classList.add('disabled');
            if (i === correctIdx) btn.classList.add('correct');
        });

        // Update Leitner (wrong)
        updateLeitnerBox(qKey, false);
        updateCatStats(q._type, false);

        // Reset streak, add to wrong
        state.streak = 0;
        state.wrongAnswers.push(q);

        // Update status
        $('quiz-streak').textContent = state.streak;
        $('timer-value').textContent = '0';
        $('timer-value').className = 'timer-value danger';

        // Show word info
        if (q.word && q.meaning_tr) {
            $('word-en').textContent = q.word;
            $('word-tr').textContent = q.meaning_tr;
        } else {
            $('word-en').textContent = 'Doğru Cevap:';
            $('word-tr').textContent = q.options[q.answer];
        }
        $('word-info').classList.remove('hidden');

        showXPPopup('Süre Doldu!');

        $('next-btn').classList.remove('hidden');
        $('next-btn').textContent = state.currentIndex >= state.questions.length - 1 ? 'Sonuçları Gör →' : 'Sonraki Soru →';
    }

    // ===== RESULTS =====
    function showResults() {
        const pct = Math.round((state.score / state.questions.length) * 100);

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
        const circumference = 2 * Math.PI * 52;
        $('score-circle').style.transition = 'none';
        $('score-circle').style.strokeDashoffset = circumference;
        $('score-num').textContent = pct;

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
                if (q.word && q.meaning_tr) {
                    item.innerHTML = `
                        <span class="review-word">${q.word}</span>
                        <span class="review-meaning">${q.meaning_tr}</span>
                    `;
                } else {
                    const short = q.sentence.length > 60 ? q.sentence.substring(0, 60) + '...' : q.sentence;
                    item.innerHTML = `
                        <span class="review-word" style="font-size:0.78rem">${short}</span>
                        <span class="review-meaning">${q.options[q.answer].substring(0, 40)}...</span>
                    `;
                }
                reviewList.appendChild(item);
            });
        } else {
            reviewSection.classList.add('hidden');
        }

        showScreen('results');

        // Animate score circle
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                $('score-circle').style.transition = 'stroke-dashoffset 1.5s ease';
                const offset = circumference - (pct / 100) * circumference;
                $('score-circle').style.strokeDashoffset = offset;
                if (pct >= 70) $('score-circle').style.stroke = 'var(--success)';
                else if (pct >= 40) $('score-circle').style.stroke = 'var(--warning)';
                else $('score-circle').style.stroke = 'var(--danger)';
            });
        });
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
