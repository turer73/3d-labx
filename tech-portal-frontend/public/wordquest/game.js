// ===== WORDQUEST - GAME ENGINE v8 =====

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
    const ADAPTIVE_STREAK_UP = 3;   // 3 correct in a row → difficulty up
    const ADAPTIVE_STREAK_DOWN = 2; // 2 wrong in a row → difficulty down
    const API_URL = 'https://tech-portal-api.turgut-d01.workers.dev/api/wq';
    const PLAYER_ID_KEY = 'wq_player_id';

    // ===== BONUS WORDS (Günlük Kullanım İngilizce-Türkçe) =====
    const BONUS_WORDS = [
        { en: 'accomplish', tr: 'başarmak', ex: 'She accomplished her goal.' },
        { en: 'anxious', tr: 'endişeli', ex: 'He felt anxious about the exam.' },
        { en: 'appreciate', tr: 'takdir etmek', ex: 'I appreciate your help.' },
        { en: 'awkward', tr: 'garip, tuhaf', ex: 'It was an awkward silence.' },
        { en: 'bargain', tr: 'pazarlık, kelepir', ex: 'This coat was a real bargain.' },
        { en: 'beneath', tr: 'altında', ex: 'The cat hid beneath the table.' },
        { en: 'brief', tr: 'kısa, öz', ex: 'He gave a brief explanation.' },
        { en: 'capable', tr: 'yetenekli, muktedir', ex: 'She is capable of great things.' },
        { en: 'cautious', tr: 'tedbirli, dikkatli', ex: 'Be cautious when crossing the road.' },
        { en: 'concern', tr: 'endişe, ilgi', ex: 'There is growing concern about pollution.' },
        { en: 'convince', tr: 'ikna etmek', ex: 'She convinced him to stay.' },
        { en: 'curious', tr: 'meraklı', ex: 'The child was curious about everything.' },
        { en: 'decent', tr: 'uygun, iyi', ex: 'He earns a decent salary.' },
        { en: 'deny', tr: 'inkar etmek', ex: 'He denied all the accusations.' },
        { en: 'determine', tr: 'belirlemek, kararlı olmak', ex: 'We need to determine the cause.' },
        { en: 'eager', tr: 'istekli, hevesli', ex: 'She was eager to learn.' },
        { en: 'enormous', tr: 'devasa, muazzam', ex: 'The building was enormous.' },
        { en: 'essential', tr: 'temel, zorunlu', ex: 'Water is essential for life.' },
        { en: 'eventually', tr: 'sonunda', ex: 'He eventually found his keys.' },
        { en: 'familiar', tr: 'tanıdık, bilinen', ex: 'This place looks familiar.' },
        { en: 'fortunate', tr: 'şanslı', ex: 'We were fortunate to survive.' },
        { en: 'generous', tr: 'cömert', ex: 'She is very generous with her time.' },
        { en: 'genuine', tr: 'gerçek, samimi', ex: 'He showed genuine interest.' },
        { en: 'grateful', tr: 'minnettar', ex: 'I am grateful for your support.' },
        { en: 'hesitate', tr: 'tereddüt etmek', ex: "Don't hesitate to ask for help." },
        { en: 'ignore', tr: 'görmezden gelmek', ex: 'She ignored his comments.' },
        { en: 'impress', tr: 'etkilemek', ex: 'His speech impressed the audience.' },
        { en: 'inevitable', tr: 'kaçınılmaz', ex: 'Change is inevitable.' },
        { en: 'involve', tr: 'dahil etmek, içermek', ex: 'The project involves many people.' },
        { en: 'launch', tr: 'başlatmak, fırlatmak', ex: 'They launched a new product.' },
        { en: 'maintain', tr: 'sürdürmek, bakımını yapmak', ex: 'Maintain a healthy lifestyle.' },
        { en: 'modest', tr: 'mütevazı, alçakgönüllü', ex: 'She is very modest about her success.' },
        { en: 'numerous', tr: 'çok sayıda', ex: 'There were numerous complaints.' },
        { en: 'obtain', tr: 'elde etmek', ex: 'She obtained a new passport.' },
        { en: 'obvious', tr: 'açık, bariz', ex: 'The answer is obvious.' },
        { en: 'particular', tr: 'belirli, özel', ex: 'Is there a particular reason?' },
        { en: 'postpone', tr: 'ertelemek', ex: 'They postponed the meeting.' },
        { en: 'pursue', tr: 'peşinden gitmek, takip etmek', ex: 'He decided to pursue his dream.' },
        { en: 'recognize', tr: 'tanımak, fark etmek', ex: 'I barely recognized her.' },
        { en: 'recommend', tr: 'tavsiye etmek', ex: 'I recommend this restaurant.' },
        { en: 'reluctant', tr: 'isteksiz, gönülsüz', ex: 'He was reluctant to leave.' },
        { en: 'resemble', tr: 'benzemek', ex: 'She resembles her mother.' },
        { en: 'reveal', tr: 'ortaya çıkarmak', ex: 'The report revealed the truth.' },
        { en: 'severe', tr: 'ciddi, şiddetli', ex: 'There was severe weather damage.' },
        { en: 'struggle', tr: 'mücadele etmek', ex: 'He struggled to find work.' },
        { en: 'sufficient', tr: 'yeterli', ex: 'We have sufficient evidence.' },
        { en: 'surround', tr: 'çevrelemek', ex: 'Mountains surround the village.' },
        { en: 'tend', tr: 'eğiliminde olmak', ex: 'People tend to forget things.' },
        { en: 'thorough', tr: 'kapsamlı, titiz', ex: 'She did a thorough research.' },
        { en: 'valid', tr: 'geçerli', ex: 'Your ticket is still valid.' },
        { en: 'vast', tr: 'geniş, uçsuz bucaksız', ex: 'The desert is vast and empty.' },
        { en: 'willing', tr: 'istekli, gönüllü', ex: 'She was willing to help.' },
        { en: 'witness', tr: 'tanık, şahit', ex: 'He was a witness to the accident.' },
        { en: 'afford', tr: 'karşılayabilmek (maddi)', ex: "I can't afford a new car." },
        { en: 'attempt', tr: 'girişim, denemek', ex: 'She made an attempt to escape.' },
        { en: 'boundary', tr: 'sınır', ex: 'The river forms the boundary.' },
        { en: 'commitment', tr: 'bağlılık, taahhüt', ex: 'He showed great commitment.' },
        { en: 'consistent', tr: 'tutarlı, istikrarlı', ex: 'Be consistent in your efforts.' },
        { en: 'emphasize', tr: 'vurgulamak', ex: 'She emphasized the importance of education.' },
        { en: 'glimpse', tr: 'kısa bakış', ex: 'I caught a glimpse of the sunset.' },
        { en: 'narrow', tr: 'dar', ex: 'The street was very narrow.' },
        { en: 'permanent', tr: 'kalıcı, daimi', ex: 'Is this a permanent position?' },
        { en: 'precise', tr: 'kesin, dakik', ex: 'Give me the precise location.' },
        { en: 'remarkable', tr: 'dikkat çekici, olağanüstü', ex: 'She made a remarkable recovery.' },
        { en: 'subtle', tr: 'ince, belirsiz', ex: 'There was a subtle difference.' },
        { en: 'urge', tr: 'dürtmek, ısrar etmek', ex: 'I urge you to reconsider.' },
        { en: 'vital', tr: 'hayati, çok önemli', ex: 'Exercise is vital for health.' },
        { en: 'abandon', tr: 'terk etmek', ex: 'They abandoned the sinking ship.' },
        { en: 'breeze', tr: 'esinti, meltem', ex: 'A cool breeze was blowing.' },
        { en: 'confuse', tr: 'karıştırmak, şaşırtmak', ex: "Don't confuse the two words." },
        { en: 'demand', tr: 'talep etmek', ex: 'They demanded an explanation.' },
        { en: 'emerge', tr: 'ortaya çıkmak', ex: 'A new leader emerged.' },
        { en: 'frequent', tr: 'sık, sık sık olan', ex: 'She is a frequent visitor.' },
        { en: 'harm', tr: 'zarar', ex: 'Smoking causes great harm.' },
        { en: 'inspire', tr: 'ilham vermek', ex: 'Her story inspired millions.' },
        { en: 'merely', tr: 'sadece, yalnızca', ex: 'He is merely a child.' },
        { en: 'occur', tr: 'meydana gelmek', ex: 'The accident occurred at night.' },
        { en: 'penalty', tr: 'ceza', ex: 'There is a penalty for late payment.' },
        { en: 'rapid', tr: 'hızlı', ex: 'There was rapid growth in the city.' },
        { en: 'scarce', tr: 'kıt, yetersiz', ex: 'Fresh water is scarce in the desert.' },
        { en: 'threat', tr: 'tehdit', ex: 'Climate change is a major threat.' },
        { en: 'venture', tr: 'girişim, risk almak', ex: 'Starting a business is a venture.' }
    ];
    const BONUS_SEEN_KEY = 'wq_bonus_seen';

    // ===== ANALYTICS =====
    function trackEvent(eventName, params) {
        try {
            if (window.dataLayer) {
                window.dataLayer.push({ event: eventName, ...params });
            }
            if (window.gtag) {
                window.gtag('event', eventName, params);
            }
        } catch(e) {}
    }

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
        wrongAnswers: [],
        answerResults: [],
        gameStartTime: 0,
        totalTimeMs: 0,
        challengeId: null,
        challengeCreator: null,
        challengeCreatorScore: null,
        challengeCreatorPct: null,
        challengeQuestionIds: null,
        challengeMode: null,
        adaptiveLevel: null  // current adaptive difficulty: B1/B2/C1
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
        results: $('results'),
        stats: $('stats'),
        leaderboard: $('leaderboard'),
        dictionary: $('dictionary')
    };

    // ===== INIT =====
    async function init() {
        try {
            const res = await fetch('data/words.json');
            wordData = await res.json();

            // Check for challenge URL
            const hasChallenge = await loadChallengeFromUrl();

            updateHomeUI();
            initNotifications();
            setTimeout(() => {
                showScreen('home');
                if (hasChallenge) showChallengeBanner();
            }, 2200);
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

    // ===== PLAYER ID =====
    function getPlayerId() {
        let id = localStorage.getItem(PLAYER_ID_KEY);
        if (!id) {
            id = 'wq_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 10);
            localStorage.setItem(PLAYER_ID_KEY, id);
        }
        return id;
    }

    // ===== SHARE =====
    function generateShareText() {
        const pct = Math.round((state.score / state.questions.length) * 100);
        const modeLabels = {
            vocabulary: 'Kelime Bilgisi', phrasal_verb: 'Phrasal Verb', grammar: 'Dilbilgisi',
            sentence_completion: 'Cümle Tamamlama', cloze_test: 'Boşluk Doldurma',
            dialogue: 'Diyalog', restatement: 'Yakın Anlam', mixed: 'Karışık', review: 'Tekrar'
        };

        let text = `📚 WordQuest - ${modeLabels[state.mode] || state.mode}\n`;
        text += `${state.score}/${state.questions.length} (%${pct})\n\n`;

        state.questions.forEach((q, i) => {
            const wasWrong = state.wrongAnswers.some(w => (w.word || w.id) === (q.word || q.id));
            text += wasWrong ? '❌' : '✅';
            if ((i + 1) % 5 === 0) text += '\n';
        });

        text += `\n\n🔥 Seri: ${state.bestStreak} | ⭐ ${state.xpEarned} XP`;
        text += `\n\nhttps://3d-labx.com/wordquest/`;
        return text;
    }

    function shareResult() {
        const text = generateShareText();
        trackEvent('share', { method: 'native', content_type: 'game_result', game_name: 'wordquest' });
        if (navigator.share) {
            navigator.share({ text }).catch(() => copyToClipboard(text));
        } else {
            copyToClipboard(text);
        }
    }

    function shareViaWhatsApp() {
        const text = generateShareText();
        trackEvent('share', { method: 'whatsapp', content_type: 'game_result', game_name: 'wordquest' });
        window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(text), '_blank');
    }

    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => showToast('📋 Panoya kopyalandı!')).catch(() => showToast('Kopyalanamadı'));
        } else {
            showToast('Kopyalanamadı');
        }
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2200);
    }

    // ===== CHALLENGE =====
    async function createChallenge() {
        const btn = $('btn-challenge');
        if (btn) { btn.disabled = true; btn.textContent = '⏳ Oluşturuluyor...'; }

        try {
            const questionIds = state.questions.map(q => q.id || q.word);
            const pct = Math.round((state.score / state.questions.length) * 100);

            const res = await fetch(`${API_URL}/challenge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    creatorId: getPlayerId(),
                    creatorNickname: localStorage.getItem('wq_nickname') || 'Anonim',
                    mode: state.mode,
                    questionIds,
                    creatorScore: state.score,
                    creatorPct: pct,
                    creatorTimeMs: state.totalTimeMs || 0,
                    creatorAnswers: state.answerResults
                })
            });

            const data = await res.json();
            if (data.success) {
                const shareText = `⚔️ WordQuest Meydan Okuma!\n${state.score}/${state.questions.length} yaptım, sen kaç yaparsın?\nHerkes katılabilir! 🎉\n\n${data.url}`;
                if (navigator.share) {
                    navigator.share({ text: shareText }).catch(() => copyToClipboard(shareText));
                } else {
                    copyToClipboard(shareText);
                }
                if (btn) { btn.textContent = '✅ Link Kopyalandı!'; }
            } else {
                showToast('Meydan okuma oluşturulamadı');
                if (btn) { btn.textContent = '⚔️ Meydan Oku'; btn.disabled = false; }
            }
        } catch(e) {
            console.warn('Challenge error:', e);
            showToast('Bağlantı hatası');
            if (btn) { btn.textContent = '⚔️ Meydan Oku'; btn.disabled = false; }
        }

        setTimeout(() => { if (btn) { btn.textContent = '⚔️ Meydan Oku'; btn.disabled = false; } }, 4000);
    }

    async function loadChallengeFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const challengeId = params.get('challenge');
        if (!challengeId || challengeId.length !== 6) return false;

        try {
            const res = await fetch(`${API_URL}/challenge/${challengeId}`);
            if (!res.ok) return false;
            const data = await res.json();

            state.challengeId = data.challengeId;
            state.challengeCreator = data.creatorNickname;
            state.challengeCreatorScore = data.creatorScore;
            state.challengeCreatorPct = data.creatorPct;
            state.challengeQuestionIds = data.questionIds;
            state.challengeMode = data.mode;
            state.challengePlayCount = data.playCount || 0;
            return true;
        } catch(e) {
            console.warn('Challenge load error:', e);
            return false;
        }
    }

    function showChallengeBanner() {
        const banner = $('challenge-banner');
        if (!banner || !state.challengeId) return;
        $('challenge-creator-name').textContent = state.challengeCreator || 'Birisi';
        const playCount = state.challengePlayCount || 0;
        const targetText = playCount > 1
            ? `🎉 ${playCount} kişi katıldı • Hedef: %${state.challengeCreatorPct || 0}`
            : `Hedef: %${state.challengeCreatorPct || 0}`;
        $('challenge-target').textContent = targetText;
        banner.classList.remove('hidden');
    }

    function startChallengeGame() {
        const allQ = getAllQuestions();
        const qMap = {};
        allQ.forEach(q => { qMap[q.id || q.word] = q; });

        const challengeQuestions = state.challengeQuestionIds
            .map(id => qMap[id])
            .filter(q => q !== undefined);

        if (challengeQuestions.length === 0) {
            alert('Meydan okuma soruları yüklenemedi!');
            return;
        }

        state.mode = state.challengeMode || 'mixed';
        state.questions = challengeQuestions;
        state.currentIndex = 0;
        state.score = 0;
        state.xpEarned = 0;
        state.streak = 0;
        state.bestStreak = 0;
        state.wrongAnswers = [];
        state.answerResults = [];
        state.gameStartTime = Date.now();

        showScreen('quiz');
        showQuestion();
    }

    async function submitChallengeResult() {
        if (!state.challengeId) return;
        try {
            const pct = Math.round((state.score / state.questions.length) * 100);
            const res = await fetch(`${API_URL}/challenge/${state.challengeId}/result`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerId: getPlayerId(),
                    nickname: localStorage.getItem('wq_nickname') || 'Anonim',
                    score: state.score,
                    pct,
                    timeMs: state.totalTimeMs || 0,
                    answers: state.answerResults
                })
            });
            const data = await res.json();
            if (data.comparison) showChallengeComparison(data.comparison);
            if (data.participants && data.participants.length > 2) {
                showPartyResults(data.participants);
            }
        } catch(e) { console.warn('Challenge result error:', e); }
    }

    function showChallengeComparison(c) {
        const el = $('challenge-comparison');
        if (!el) return;

        const winLabel = c.winner === 'tie' ? '🤝 Berabere!' : (c.winner === 'challenger' ? '🏆 Kazandın!' : '😤 Rakip Kazandı!');

        el.innerHTML = `
            <h3 class="comparison-title">⚔️ Meydan Okuma Sonucu</h3>
            <div class="comparison-grid">
                <div class="comp-player ${c.winner === 'creator' ? 'winner' : ''}">
                    <div class="comp-name">${c.creator.nickname}</div>
                    <div class="comp-score">${c.creator.score}/${state.questions.length}</div>
                    <div class="comp-pct">%${c.creator.pct}</div>
                </div>
                <div class="comp-vs">VS</div>
                <div class="comp-player ${c.winner === 'challenger' ? 'winner' : ''}">
                    <div class="comp-name">${c.challenger.nickname}</div>
                    <div class="comp-score">${c.challenger.score}/${state.questions.length}</div>
                    <div class="comp-pct">%${c.challenger.pct}</div>
                </div>
            </div>
            <div class="comp-winner">${winLabel}</div>
        `;
        el.classList.remove('hidden');
    }

    function showPartyResults(participants) {
        const el = $('challenge-comparison');
        if (!el) return;

        const myId = getPlayerId();
        const medals = ['🥇', '🥈', '🥉'];

        let html = `
            <h3 class="comparison-title">🎉 Grup Yarışması Sonuçları</h3>
            <div class="party-subtitle">${participants.length} katılımcı</div>
            <div class="party-results">
        `;

        participants.forEach((p, i) => {
            const isMe = p.playerId === myId;
            const rankDisplay = i < 3 ? medals[i] : `#${p.rank}`;
            const timeStr = p.timeMs > 0 ? `${Math.round(p.timeMs / 1000)}s` : '-';
            html += `
                <div class="party-row ${isMe ? 'party-me' : ''} ${i < 3 ? 'party-top-' + (i+1) : ''}">
                    <span class="party-rank">${rankDisplay}</span>
                    <span class="party-name">${p.nickname}${isMe ? ' (Sen)' : ''}${p.isCreator ? ' 👑' : ''}</span>
                    <span class="party-score">%${p.pct}</span>
                    <span class="party-time">${timeStr}</span>
                </div>
            `;
        });

        html += '</div>';

        // My rank message
        const myEntry = participants.find(p => p.playerId === myId);
        if (myEntry) {
            if (myEntry.rank === 1) html += '<div class="party-message">🏆 Birinci oldun!</div>';
            else if (myEntry.rank <= 3) html += `<div class="party-message">🎉 ${myEntry.rank}. sıradasın!</div>`;
            else html += `<div class="party-message">${myEntry.rank}/${participants.length} sırada</div>`;
        }

        el.innerHTML = html;
        el.classList.remove('hidden');
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
        if (state.level !== 'all' && state.level !== 'adaptive') allQuestions = allQuestions.filter(q => q.level === state.level);

        // Show adaptive info hint on home
        const adaptiveHint = $('adaptive-hint');
        if (adaptiveHint) {
            if (state.level === 'adaptive') {
                const strength = getPlayerStrength(null);
                const labels = { B1: 'Kolay (B1)', B2: 'Orta (B2)', C1: 'Zor (C1)' };
                const emoji = { B1: '🟢', B2: '🟡', C1: '🔴' };
                adaptiveHint.innerHTML = `${emoji[strength]} Tahmini seviye: <strong>${labels[strength]}</strong>`;
                adaptiveHint.classList.remove('hidden');
            } else {
                adaptiveHint.classList.add('hidden');
            }
        }

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

    // ===== STATS PAGE =====
    function showStats() {
        showScreen('stats');
        updateStatsUI();
    }

    function updateStatsUI() {
        // --- Genel Özet ---
        $('s-xp').textContent = stats.totalXP;
        $('s-level').textContent = stats.level;
        $('s-games').textContent = stats.gamesPlayed;
        $('s-streak').textContent = stats.streak;

        // XP progress bar (to next level)
        const xpInLevel = stats.totalXP % XP_PER_LEVEL;
        const xpPct = Math.round((xpInLevel / XP_PER_LEVEL) * 100);
        $('s-xp-fill').style.width = xpPct + '%';
        $('s-xp-text').textContent = xpInLevel + '/' + XP_PER_LEVEL + ' XP → Seviye ' + (stats.level + 1);

        // --- Accuracy Ring ---
        const totalQ = stats.totalQuestions;
        const totalC = stats.totalCorrect;
        const pct = totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;
        const circumference = 2 * Math.PI * 54; // ≈ 339.29
        const offset = circumference * (1 - pct / 100);

        const ringFill = $('s-ring-fill');
        ringFill.style.strokeDasharray = circumference;
        ringFill.style.strokeDashoffset = circumference; // start empty

        // Animate after paint
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                ringFill.style.transition = 'stroke-dashoffset 1.2s ease';
                ringFill.style.strokeDashoffset = offset;
                // Color based on accuracy
                if (pct >= 70) ringFill.style.stroke = 'var(--success)';
                else if (pct >= 40) ringFill.style.stroke = 'var(--warning)';
                else ringFill.style.stroke = 'var(--danger)';
            });
        });

        $('s-accuracy-pct').textContent = pct + '%';
        $('s-correct').textContent = totalC;
        $('s-wrong').textContent = totalQ - totalC;
        $('s-total').textContent = totalQ;
        $('s-learned').textContent = stats.learnedWords.length;

        // --- Kategori Detay ---
        updateStatsCategoryUI();

        // --- Leitner Kutuları ---
        updateStatsLeitnerUI();

        // --- Günlük Hedef ---
        const dailyProgress = getDailyProgress();
        $('s-daily-count').textContent = dailyProgress;
        $('s-best-streak').textContent = stats.bestStreak;
    }

    function updateStatsCategoryUI() {
        const container = $('s-cat-details');
        if (!container) return;

        const typeLabels = {
            vocabulary: { name: 'Kelime Bilgisi', icon: '📖' },
            phrasal_verb: { name: 'Phrasal Verb', icon: '🔗' },
            grammar: { name: 'Dilbilgisi', icon: '📝' },
            sentence_completion: { name: 'Cümle Tamamlama', icon: '✏️' },
            cloze_test: { name: 'Boşluk Doldurma', icon: '🔲' },
            dialogue: { name: 'Diyalog', icon: '💬' },
            restatement: { name: 'Yakın Anlam', icon: '🔄' }
        };

        let html = '';
        const types = Object.keys(typeLabels);

        types.forEach(type => {
            const cs = catStats[type];
            const correct = cs ? cs.correct : 0;
            const total = cs ? cs.total : 0;
            const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

            let barColor = 'var(--danger)';
            if (pct >= 70) barColor = 'var(--success)';
            else if (pct >= 40) barColor = 'var(--warning)';

            const info = typeLabels[type];
            html += `
                <div class="cat-detail-card">
                    <div class="cat-detail-header">
                        <span class="cat-detail-name">${info.icon} ${info.name}</span>
                        <span class="cat-detail-pct" style="color:${barColor}">${pct}%</span>
                    </div>
                    <div class="cat-detail-bar">
                        <div class="cat-detail-fill" style="width:${pct}%;background:${barColor}"></div>
                    </div>
                    <div class="cat-detail-info">${correct} doğru / ${total} soru</div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    function updateStatsLeitnerUI() {
        if (!wordData) return;

        const allQ = getAllQuestions();
        let box0 = 0, box1 = 0, box2 = 0, box3 = 0;

        allQ.forEach(q => {
            const box = getLeitnerBox(q.word || q.id);
            if (box === 0) box0++;
            else if (box === 1) box1++;
            else if (box === 2) box2++;
            else if (box === 3) box3++;
        });

        $('s-box0').textContent = box0;
        $('s-box1').textContent = box1;
        $('s-box2').textContent = box2;
        $('s-box3').textContent = box3;

        // Stacked progress bar
        const total = allQ.length || 1;
        $('s-lp0').style.width = (box0 / total * 100) + '%';
        $('s-lp1').style.width = (box1 / total * 100) + '%';
        $('s-lp2').style.width = (box2 / total * 100) + '%';
        $('s-lp3').style.width = (box3 / total * 100) + '%';
    }

    function resetStats() {
        if (!confirm('Tüm istatistikleri sıfırlamak istediğinize emin misiniz?\nBu işlem geri alınamaz!')) return;
        localStorage.removeItem('wq_stats');
        localStorage.removeItem('wq_cat_stats');
        localStorage.removeItem('wq_leitner');
        stats = loadStats();
        catStats = loadCatStats();
        leitner = loadLeitner();
        updateStatsUI();
        showToast('🗑️ İstatistikler sıfırlandı');
    }

    // ===== LEADERBOARD =====
    let lbCurrentTab = 'overall';
    let lbCurrentSort = 'xp';

    async function syncScore() {
        try {
            await fetch(`${API_URL}/score`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerId: getPlayerId(),
                    nickname: localStorage.getItem('wq_nickname') || 'Anonim',
                    mode: state.mode,
                    score: state.score,
                    total: state.questions.length,
                    pct: Math.round((state.score / state.questions.length) * 100),
                    xpEarned: state.xpEarned,
                    timeMs: state.totalTimeMs || 0,
                    totalXP: stats.totalXP,
                    level: stats.level,
                    gamesPlayed: stats.gamesPlayed,
                    totalCorrect: stats.totalCorrect,
                    totalQuestions: stats.totalQuestions,
                    bestStreak: stats.bestStreak
                })
            });
        } catch(e) { console.warn('Score sync error:', e); }
    }

    function showLeaderboard() {
        showScreen('leaderboard');
        // Fill my card
        $('lb-my-name').textContent = localStorage.getItem('wq_nickname') || 'Anonim';
        $('lb-my-stat').textContent = `${stats.totalXP} XP • Seviye ${stats.level}`;
        // Fill nickname input
        const nameInput = $('lb-nickname-input');
        if (nameInput) nameInput.value = localStorage.getItem('wq_nickname') || '';
        // Load data
        lbCurrentTab = 'overall';
        lbCurrentSort = 'xp';
        loadLeaderboard();
    }

    async function loadLeaderboard() {
        const list = $('lb-list');
        list.innerHTML = '<div class="lb-loading">Yükleniyor...</div>';

        // Show/hide sort pills
        const sortPills = $('lb-sort-pills');
        if (sortPills) sortPills.style.display = lbCurrentTab === 'overall' ? 'flex' : 'none';

        try {
            let url;
            if (lbCurrentTab === 'weekly') {
                url = `${API_URL}/leaderboard/weekly`;
            } else {
                url = `${API_URL}/leaderboard?type=${lbCurrentSort}`;
            }
            const res = await fetch(url);
            const data = await res.json();
            renderLeaderboard(data.leaderboard || []);
        } catch(e) {
            list.innerHTML = '<div class="lb-empty">Bağlantı hatası. Tekrar dene.</div>';
        }
    }

    function renderLeaderboard(entries) {
        const list = $('lb-list');
        const myId = getPlayerId();

        if (entries.length === 0) {
            list.innerHTML = '<div class="lb-empty">Henüz veri yok. Oynamaya başla!</div>';
            $('lb-my-rank-num').textContent = '#-';
            return;
        }

        const medals = ['🥇', '🥈', '🥉'];
        let html = '';
        entries.forEach((e, i) => {
            const isMe = e.playerId === myId;
            const rankDisplay = i < 3 ? medals[i] : `#${e.rank}`;

            let statLine;
            if (lbCurrentTab === 'weekly') {
                statLine = `${e.weeklyXP} XP • ${e.gamesThisWeek} oyun`;
            } else {
                statLine = `${e.totalXP} XP • Sv.${e.level} • %${e.accuracy}`;
            }

            html += `
                <div class="lb-row ${isMe ? 'me' : ''} ${i < 3 ? 'top-' + (i+1) : ''}">
                    <span class="lb-rank">${rankDisplay}</span>
                    <span class="lb-avatar">${e.avatar || '📚'}</span>
                    <div class="lb-player-info">
                        <span class="lb-name">${e.nickname || 'Anonim'}${isMe ? ' (Sen)' : ''}</span>
                        <span class="lb-stat-line">${statLine}</span>
                    </div>
                </div>
            `;
        });
        list.innerHTML = html;

        // Update my rank card
        const myEntry = entries.find(e => e.playerId === myId);
        if (myEntry) {
            $('lb-my-rank-num').textContent = '#' + myEntry.rank;
            $('lb-my-name').textContent = myEntry.nickname || 'Anonim';
            $('lb-my-stat').textContent = `${myEntry.totalXP || 0} XP • Seviye ${myEntry.level || 1}`;
        } else {
            $('lb-my-rank-num').textContent = '#-';
        }
    }

    async function saveNickname() {
        const input = $('lb-nickname-input');
        const name = (input.value || '').trim().substring(0, 16);
        if (!name) { showToast('İsim boş olamaz'); return; }
        localStorage.setItem('wq_nickname', name);
        $('lb-my-name').textContent = name;
        try {
            await fetch(`${API_URL}/profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId: getPlayerId(), nickname: name })
            });
            showToast('✅ İsim kaydedildi');
        } catch(e) { showToast('Kayıt hatası'); }
    }

    // ===== NOTIFICATIONS =====
    const NOTIF_KEY = 'wq_notifications';
    const NOTIF_REMINDER_HOUR = 19; // 19:00 default

    function loadNotifSettings() {
        try {
            const saved = localStorage.getItem(NOTIF_KEY);
            return saved ? JSON.parse(saved) : { enabled: false, reminderHour: NOTIF_REMINDER_HOUR, lastScheduled: null };
        } catch(e) { return { enabled: false, reminderHour: NOTIF_REMINDER_HOUR, lastScheduled: null }; }
    }

    function saveNotifSettings(settings) {
        try { localStorage.setItem(NOTIF_KEY, JSON.stringify(settings)); } catch(e) {}
    }

    async function requestNotificationPermission() {
        if (!('Notification' in window)) {
            showToast('Bu tarayıcı bildirimleri desteklemiyor');
            return false;
        }
        if (Notification.permission === 'granted') return true;
        if (Notification.permission === 'denied') {
            showToast('Bildirimler engellendi. Tarayıcı ayarlarından açabilirsin.');
            return false;
        }
        const result = await Notification.requestPermission();
        return result === 'granted';
    }

    async function toggleNotifications() {
        const settings = loadNotifSettings();
        const toggle = $('notif-toggle');

        if (!settings.enabled) {
            // Turning ON
            const granted = await requestNotificationPermission();
            if (!granted) {
                if (toggle) toggle.checked = false;
                return;
            }
            settings.enabled = true;
            saveNotifSettings(settings);
            if (toggle) toggle.checked = true;
            scheduleDailyReminder();
            showToast('🔔 Bildirimler açıldı');
        } else {
            // Turning OFF
            settings.enabled = false;
            saveNotifSettings(settings);
            if (toggle) toggle.checked = false;
            showToast('🔕 Bildirimler kapatıldı');
        }
        updateNotifUI();
    }

    function scheduleDailyReminder() {
        const settings = loadNotifSettings();
        if (!settings.enabled) return;
        if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) return;

        const today = new Date().toDateString();
        // Don't schedule if already played today
        if (stats.dailyDate === today && stats.dailyCount >= DAILY_GOAL) return;

        // Calculate delay until reminder hour
        const now = new Date();
        const reminderTime = new Date();
        reminderTime.setHours(settings.reminderHour, 0, 0, 0);

        // If reminder time has passed, schedule for tomorrow
        if (now >= reminderTime) {
            reminderTime.setDate(reminderTime.getDate() + 1);
        }

        const delayMs = reminderTime.getTime() - now.getTime();

        // Don't reschedule if already scheduled today
        if (settings.lastScheduled === today) return;
        settings.lastScheduled = today;
        saveNotifSettings(settings);

        const messages = [
            '📚 Günlük kelime antrenmanını yapmayı unutma!',
            '🎯 Bugün henüz pratik yapmadın. Hadi başlayalım!',
            '💪 Birkaç dakika pratik yaparak kelime gücünü artır!',
            '🔥 Streak\'ini kaybetme! Bugün bir oyun oyna.',
            '📖 Günde 10 soru, sınavda fark yaratır!'
        ];
        const body = messages[Math.floor(Math.random() * messages.length)];

        navigator.serviceWorker.controller.postMessage({
            type: 'SCHEDULE_NOTIFICATION',
            delayMs,
            title: 'WordQuest Hatırlatma',
            body,
            tag: 'wq-daily-reminder'
        });
    }

    function scheduleStreakReminder() {
        const settings = loadNotifSettings();
        if (!settings.enabled) return;
        if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) return;
        if (stats.streak < 2) return; // Only remind if there's a streak to protect

        const today = new Date().toDateString();
        if (stats.lastPlayDate === today) return; // Already played today

        // Schedule for 2 hours from now (if not too late)
        const now = new Date();
        if (now.getHours() >= 22) return; // Don't send late night

        const delayMs = 2 * 60 * 60 * 1000; // 2 hours

        navigator.serviceWorker.controller.postMessage({
            type: 'SCHEDULE_NOTIFICATION',
            delayMs,
            title: '🔥 Streak Uyarısı!',
            body: `${stats.streak} günlük serinizi kaybetmeyin! Bugün bir oyun oynayın.`,
            tag: 'wq-streak-reminder'
        });
    }

    function updateNotifUI() {
        const settings = loadNotifSettings();
        const toggle = $('notif-toggle');
        const timeSelect = $('notif-time');
        const statusText = $('notif-status');

        if (toggle) toggle.checked = settings.enabled;
        if (timeSelect) timeSelect.value = settings.reminderHour;
        if (statusText) {
            if (!('Notification' in window)) {
                statusText.textContent = 'Desteklenmiyor';
                statusText.className = 'notif-status-text off';
            } else if (Notification.permission === 'denied') {
                statusText.textContent = 'Engellendi';
                statusText.className = 'notif-status-text off';
            } else if (settings.enabled) {
                statusText.textContent = `Aktif (${String(settings.reminderHour).padStart(2,'0')}:00)`;
                statusText.className = 'notif-status-text on';
            } else {
                statusText.textContent = 'Kapalı';
                statusText.className = 'notif-status-text off';
            }
        }
    }

    function changeNotifTime() {
        const timeSelect = $('notif-time');
        if (!timeSelect) return;
        const settings = loadNotifSettings();
        settings.reminderHour = parseInt(timeSelect.value, 10);
        settings.lastScheduled = null; // Force reschedule
        saveNotifSettings(settings);
        if (settings.enabled) {
            scheduleDailyReminder();
        }
        updateNotifUI();
        showToast('⏰ Hatırlatma saati güncellendi');
    }

    function initNotifications() {
        updateNotifUI();
        const settings = loadNotifSettings();
        if (settings.enabled && Notification.permission === 'granted') {
            scheduleDailyReminder();
            scheduleStreakReminder();
        }
    }

    // ===== ADAPTIVE DIFFICULTY =====
    const LEVEL_ORDER = ['B1', 'B2', 'C1'];

    function getPlayerStrength(modeType) {
        // Calculate player's effective level based on performance
        // Consider: overall accuracy, category accuracy, Leitner data
        const overall = stats.totalQuestions > 0
            ? (stats.totalCorrect / stats.totalQuestions) : 0.5;

        // Category-specific accuracy (if available)
        let catAcc = overall;
        if (modeType && catStats[modeType] && catStats[modeType].total >= 10) {
            catAcc = catStats[modeType].correct / catStats[modeType].total;
        }

        // Weighted: 40% category, 60% overall (category has smaller sample)
        const acc = catStats[modeType] && catStats[modeType].total >= 10
            ? catAcc * 0.4 + overall * 0.6
            : overall;

        if (acc < 0.45) return 'B1';
        if (acc < 0.72) return 'B2';
        return 'C1';
    }

    function buildAdaptivePool(questions) {
        // Determine player's starting level
        const modeType = state.mode === 'mixed' ? null : state.mode;
        const strength = getPlayerStrength(modeType);
        state.adaptiveLevel = strength;

        // Group questions by level
        const byLevel = { B1: [], B2: [], C1: [] };
        questions.forEach(q => {
            if (byLevel[q.level]) byLevel[q.level].push(q);
        });

        // Weight distribution based on strength
        // Player at B1: 50% B1, 35% B2, 15% C1 (mostly easy, some challenge)
        // Player at B2: 20% B1, 50% B2, 30% C1 (balanced)
        // Player at C1: 10% B1, 30% B2, 60% C1 (mostly hard, some review)
        const weights = {
            B1: { B1: 0.50, B2: 0.35, C1: 0.15 },
            B2: { B1: 0.20, B2: 0.50, C1: 0.30 },
            C1: { B1: 0.10, B2: 0.30, C1: 0.60 }
        };

        const w = weights[strength];
        const total = QUESTIONS_PER_ROUND;

        // Calculate target count per level
        let targets = {
            B1: Math.round(total * w.B1),
            B2: Math.round(total * w.B2),
            C1: Math.round(total * w.C1)
        };

        // Ensure total matches
        const diff = total - (targets.B1 + targets.B2 + targets.C1);
        targets[strength] += diff;

        // Prioritize Leitner box 1 & 2 (wrong/learning) within each level
        const pool = [];
        for (const lvl of LEVEL_ORDER) {
            const available = shuffleArray([...byLevel[lvl]]);
            // Sort: box 1 first, then box 2, then box 0, then box 3
            available.sort((a, b) => {
                const boxA = getLeitnerBox(a.word || a.id);
                const boxB = getLeitnerBox(b.word || b.id);
                const priority = { 1: 0, 2: 1, 0: 2, 3: 3 };
                return (priority[boxA] || 3) - (priority[boxB] || 3);
            });
            pool.push(...available.slice(0, targets[lvl]));
        }

        // If not enough questions at certain levels, fill from others
        if (pool.length < total) {
            const poolIds = new Set(pool.map(q => q.id));
            const remaining = shuffleArray(questions.filter(q => !poolIds.has(q.id)));
            pool.push(...remaining.slice(0, total - pool.length));
        }

        return shuffleArray(pool);
    }

    function getAdaptiveNextLevel() {
        // Mid-game adaptation: check recent answers to adjust difficulty
        const results = state.answerResults;
        if (results.length < 2) return state.adaptiveLevel;

        const currentIdx = LEVEL_ORDER.indexOf(state.adaptiveLevel);

        // Check for streak up (consecutive correct)
        const recentCorrect = results.slice(-ADAPTIVE_STREAK_UP);
        if (recentCorrect.length >= ADAPTIVE_STREAK_UP && recentCorrect.every(r => r === 'correct')) {
            if (currentIdx < LEVEL_ORDER.length - 1) {
                return LEVEL_ORDER[currentIdx + 1];
            }
        }

        // Check for streak down (consecutive wrong)
        const recentWrong = results.slice(-ADAPTIVE_STREAK_DOWN);
        if (recentWrong.length >= ADAPTIVE_STREAK_DOWN && recentWrong.every(r => r !== 'correct')) {
            if (currentIdx > 0) {
                return LEVEL_ORDER[currentIdx - 1];
            }
        }

        return state.adaptiveLevel;
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

        // Filter by level (skip for adaptive mode — buildAdaptivePool handles it)
        if (state.level !== 'all' && state.level !== 'adaptive') {
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

        // Share buttons
        if ($('btn-share-copy')) $('btn-share-copy').addEventListener('click', () => copyToClipboard(generateShareText()));
        if ($('btn-share-whatsapp')) $('btn-share-whatsapp').addEventListener('click', shareViaWhatsApp);
        if ($('btn-share-native')) $('btn-share-native').addEventListener('click', shareResult);

        // Challenge button
        if ($('btn-challenge')) $('btn-challenge').addEventListener('click', createChallenge);

        // Challenge accept button
        if ($('btn-challenge-accept')) {
            $('btn-challenge-accept').addEventListener('click', () => {
                const banner = $('challenge-banner');
                if (banner) banner.classList.add('hidden');
                startChallengeGame();
            });
        }
        if ($('btn-challenge-decline')) {
            $('btn-challenge-decline').addEventListener('click', () => {
                state.challengeId = null;
                state.challengeQuestionIds = null;
                const banner = $('challenge-banner');
                if (banner) banner.classList.add('hidden');
                // Clean URL
                window.history.replaceState({}, '', window.location.pathname);
            });
        }

        // Stats page
        if ($('btn-stats')) $('btn-stats').addEventListener('click', showStats);
        if ($('btn-stats-back')) $('btn-stats-back').addEventListener('click', () => showScreen('home'));
        if ($('btn-reset-stats')) $('btn-reset-stats').addEventListener('click', resetStats);

        // Leaderboard
        if ($('btn-leaderboard')) $('btn-leaderboard').addEventListener('click', showLeaderboard);
        if ($('btn-lb-back')) $('btn-lb-back').addEventListener('click', () => showScreen('home'));
        if ($('btn-lb-save-name')) $('btn-lb-save-name').addEventListener('click', saveNickname);

        document.querySelectorAll('.lb-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                lbCurrentTab = tab.dataset.tab;
                loadLeaderboard();
            });
        });

        document.querySelectorAll('.lb-sort-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('.lb-sort-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                lbCurrentSort = pill.dataset.sort;
                loadLeaderboard();
            });
        });

        // Notifications
        if ($('notif-toggle')) $('notif-toggle').addEventListener('change', toggleNotifications);
        if ($('notif-time')) $('notif-time').addEventListener('change', changeNotifTime);

        // Dictionary
        if ($('btn-dictionary')) $('btn-dictionary').addEventListener('click', showDictionary);
        if ($('btn-dict-back')) $('btn-dict-back').addEventListener('click', () => showScreen('home'));
        if ($('dict-search-input')) {
            let dictDebounce = null;
            $('dict-search-input').addEventListener('input', (e) => {
                dictSearchTerm = e.target.value.trim();
                const clearBtn = $('dict-clear-btn');
                if (clearBtn) clearBtn.classList.toggle('hidden', !dictSearchTerm);
                clearTimeout(dictDebounce);
                dictDebounce = setTimeout(() => renderDictionary(), 200);
            });
        }
        if ($('dict-clear-btn')) {
            $('dict-clear-btn').addEventListener('click', () => {
                const input = $('dict-search-input');
                if (input) input.value = '';
                dictSearchTerm = '';
                $('dict-clear-btn').classList.add('hidden');
                renderDictionary();
            });
        }
        document.querySelectorAll('.dict-filter-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('.dict-filter-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                dictCurrentFilter = pill.dataset.dictFilter;
                renderDictionary();
            });
        });

        // Quiz Word Lookup
        if ($('quiz-lookup-btn')) $('quiz-lookup-btn').addEventListener('click', openQuizLookup);
        if ($('lookup-close-btn')) $('lookup-close-btn').addEventListener('click', closeQuizLookup);
        if ($('lookup-search-input')) {
            let lookupDebounce = null;
            $('lookup-search-input').addEventListener('input', (e) => {
                clearTimeout(lookupDebounce);
                lookupDebounce = setTimeout(() => searchLookup(e.target.value.trim()), 250);
            });
        }

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

        // Build question pool based on mode and difficulty setting
        if (state.mode === 'review') {
            // Leitner-weighted shuffle: box 1 first, then box 2
            const box1 = pool.filter(q => getLeitnerBox(q.word || q.id) === 1);
            const box2 = pool.filter(q => getLeitnerBox(q.word || q.id) === 2);
            pool = [...shuffleArray(box1), ...shuffleArray(box2)];
            state.questions = pool.slice(0, Math.min(QUESTIONS_PER_ROUND, pool.length));
        } else if (state.level === 'adaptive') {
            // Adaptive difficulty: weighted mix based on player performance
            state.questions = buildAdaptivePool(pool);
        } else {
            pool = shuffleArray([...pool]);
            state.questions = pool.slice(0, Math.min(QUESTIONS_PER_ROUND, pool.length));
        }
        state.currentIndex = 0;
        state.score = 0;
        state.xpEarned = 0;
        state.streak = 0;
        state.bestStreak = 0;
        state.wrongAnswers = [];
        state.answerResults = [];
        state.gameStartTime = Date.now();

        trackEvent('game_start', {
            game_name: 'wordquest',
            game_mode: state.mode,
            exam_filter: state.exam,
            level_filter: state.level,
            question_count: state.questions.length
        });

        showScreen('quiz');
        showQuestion();
    }

    function showQuestion() {
        const q = state.questions[state.currentIndex];
        state.answered = false;
        closeQuizLookup(); // Close lookup panel on new question

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

        // Adaptive difficulty indicator
        const adaptiveIndicator = $('adaptive-indicator');
        if (adaptiveIndicator) {
            if (state.level === 'adaptive') {
                // Check mid-game level shift
                const newLevel = getAdaptiveNextLevel();
                if (newLevel !== state.adaptiveLevel) {
                    state.adaptiveLevel = newLevel;
                    showToast(newLevel === 'C1' ? '🔥 Zorluk arttı!' : newLevel === 'B1' ? '💡 Zorluk azaldı' : '📊 Zorluk ayarlandı');
                }
                const levelEmoji = { B1: '🟢', B2: '🟡', C1: '🔴' };
                adaptiveIndicator.innerHTML = `<span class="adaptive-badge adaptive-${state.adaptiveLevel.toLowerCase()}">${levelEmoji[state.adaptiveLevel]} ${state.adaptiveLevel}</span>`;
                adaptiveIndicator.classList.remove('hidden');
            } else {
                adaptiveIndicator.classList.add('hidden');
            }
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

        // Track answer result for sharing/challenge
        state.answerResults.push(isCorrect ? 'correct' : 'wrong');

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
        state.totalTimeMs = Date.now() - state.gameStartTime;

        // Submit challenge result if in challenge mode
        if (state.challengeId) submitChallengeResult();

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

        // Sync score to leaderboard server
        syncScore();

        // Reschedule notifications (daily goal may have changed)
        scheduleDailyReminder();

        const pctEnd = Math.round((state.score / state.questions.length) * 100);
        trackEvent('game_complete', {
            game_name: 'wordquest',
            game_mode: state.mode,
            score: state.score,
            total_questions: state.questions.length,
            percentage: pctEnd,
            xp_earned: state.xpEarned,
            best_streak: state.bestStreak,
            time_ms: state.totalTimeMs,
            is_challenge: !!state.challengeId
        });

        // AdSense: refresh ad on results screen
        try {
            if (window.adsbygoogle) (adsbygoogle = window.adsbygoogle || []).push({});
        } catch(e) {}

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

        // Track timeout answer
        state.answerResults.push('timeout');

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

        // Adaptive difficulty summary
        const adaptiveSummary = $('rs-adaptive');
        if (adaptiveSummary) {
            if (state.level === 'adaptive' && state.adaptiveLevel) {
                const levelLabels = { B1: 'Kolay (B1)', B2: 'Orta (B2)', C1: 'Zor (C1)' };
                const levelEmoji = { B1: '🟢', B2: '🟡', C1: '🔴' };
                // Count questions by level
                const levelCounts = { B1: 0, B2: 0, C1: 0 };
                state.questions.forEach(q => { if (levelCounts[q.level] !== undefined) levelCounts[q.level]++; });
                adaptiveSummary.innerHTML = `
                    <div class="rs-adaptive-card">
                        <span class="rs-adaptive-title">🎯 Adaptif Zorluk</span>
                        <span class="rs-adaptive-level">${levelEmoji[state.adaptiveLevel]} Seviye: ${levelLabels[state.adaptiveLevel]}</span>
                        <div class="rs-adaptive-dist">
                            <span class="rs-ad-pill b1">B1: ${levelCounts.B1}</span>
                            <span class="rs-ad-pill b2">B2: ${levelCounts.B2}</span>
                            <span class="rs-ad-pill c1">C1: ${levelCounts.C1}</span>
                        </div>
                    </div>
                `;
                adaptiveSummary.classList.remove('hidden');
            } else {
                adaptiveSummary.classList.add('hidden');
            }
        }

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

        // Render bonus words
        renderBonusWords();

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

    // ===== BONUS WORDS =====
    function getBonusWords(count) {
        // Load seen list
        let seen = [];
        try { seen = JSON.parse(localStorage.getItem(BONUS_SEEN_KEY) || '[]'); } catch(e) { seen = []; }

        // Filter unseen words
        let available = BONUS_WORDS.filter(w => !seen.includes(w.en));

        // If all seen, reset
        if (available.length < count) {
            seen = [];
            available = [...BONUS_WORDS];
        }

        // Pick random unseen words
        shuffleArray(available);
        const picked = available.slice(0, count);

        // Mark as seen
        picked.forEach(w => { if (!seen.includes(w.en)) seen.push(w.en); });
        // Keep seen list reasonable (last 60)
        if (seen.length > 60) seen = seen.slice(-60);
        try { localStorage.setItem(BONUS_SEEN_KEY, JSON.stringify(seen)); } catch(e) {}

        return picked;
    }

    function renderBonusWords() {
        const section = $('bonus-words-section');
        const list = $('bonus-words-list');
        if (!section || !list) return;

        const words = getBonusWords(3);
        if (words.length === 0) { section.classList.add('hidden'); return; }

        let html = '';
        words.forEach(w => {
            html += `
                <div class="bonus-word-card">
                    <div class="bonus-word-top">
                        <span class="bonus-word-en">${w.en}</span>
                        <span class="bonus-word-tr">${w.tr}</span>
                    </div>
                    <div class="bonus-word-ex">"${w.ex}"</div>
                </div>
            `;
        });
        list.innerHTML = html;
        section.classList.remove('hidden');
    }

    // ===== DICTIONARY =====
    let dictCurrentFilter = 'all';
    let dictSearchTerm = '';

    function buildDictionaryData() {
        // Combine: vocabulary words (with word+meaning_tr) + bonus words
        const items = [];

        // From game questions: only vocabulary & phrasal_verb have word+meaning_tr
        if (wordData) {
            (wordData.vocabulary || []).forEach(q => {
                if (q.word && q.meaning_tr) {
                    items.push({
                        en: q.word,
                        tr: q.meaning_tr,
                        ex: q.sentence || '',
                        level: q.level || '',
                        type: 'vocabulary',
                        id: q.word,
                        leitner: getLeitnerBox(q.word)
                    });
                }
            });
            (wordData.phrasal_verbs || []).forEach(q => {
                if (q.word && q.meaning_tr) {
                    items.push({
                        en: q.word,
                        tr: q.meaning_tr,
                        ex: q.sentence || '',
                        level: q.level || '',
                        type: 'phrasal_verb',
                        id: q.word,
                        leitner: getLeitnerBox(q.word)
                    });
                }
            });
        }

        // Bonus words
        BONUS_WORDS.forEach(w => {
            // Don't duplicate if already in vocabulary
            if (!items.some(i => i.en.toLowerCase() === w.en.toLowerCase())) {
                items.push({
                    en: w.en,
                    tr: w.tr,
                    ex: w.ex || '',
                    level: '',
                    type: 'bonus',
                    id: 'bonus_' + w.en,
                    leitner: -1 // no Leitner for bonus
                });
            }
        });

        // Sort alphabetically
        items.sort((a, b) => a.en.localeCompare(b.en, 'en'));
        return items;
    }

    function showDictionary() {
        showScreen('dictionary');
        dictCurrentFilter = 'all';
        dictSearchTerm = '';
        const searchInput = $('dict-search-input');
        if (searchInput) searchInput.value = '';
        const clearBtn = $('dict-clear-btn');
        if (clearBtn) clearBtn.classList.add('hidden');
        // Reset filter pills
        document.querySelectorAll('.dict-filter-pill').forEach(p => p.classList.remove('active'));
        document.querySelector('.dict-filter-pill[data-dict-filter="all"]').classList.add('active');
        renderDictionary();
    }

    function renderDictionary() {
        const list = $('dict-list');
        const countEl = $('dict-count');
        if (!list) return;

        const allItems = buildDictionaryData();
        let filtered = allItems;

        // Apply filter
        if (dictCurrentFilter === 'vocabulary') {
            filtered = filtered.filter(i => i.type === 'vocabulary' || i.type === 'phrasal_verb');
        } else if (dictCurrentFilter === 'bonus') {
            filtered = filtered.filter(i => i.type === 'bonus');
        } else if (dictCurrentFilter === 'learned') {
            filtered = filtered.filter(i => i.leitner === 3);
        } else if (dictCurrentFilter === 'weak') {
            filtered = filtered.filter(i => i.leitner === 1);
        }

        // Apply search
        if (dictSearchTerm) {
            const term = dictSearchTerm.toLowerCase();
            filtered = filtered.filter(i =>
                i.en.toLowerCase().includes(term) ||
                i.tr.toLowerCase().includes(term)
            );
        }

        if (countEl) countEl.textContent = filtered.length + ' kelime';

        if (filtered.length === 0) {
            list.innerHTML = '<div class="dict-empty">Sonuç bulunamadı.</div>';
            return;
        }

        // Render max 100 initially for performance
        const display = filtered.slice(0, 100);
        const typeLabels = { vocabulary: 'Kelime', phrasal_verb: 'Phrasal', bonus: 'Bonus' };

        let html = '';
        display.forEach(item => {
            const isBonus = item.type === 'bonus';
            const boxClass = item.leitner >= 0 ? `box-${item.leitner}` : 'box-0';
            const exShort = item.ex.length > 70 ? item.ex.substring(0, 70) + '...' : item.ex;

            html += `
                <div class="dict-word-card ${isBonus ? 'dict-bonus' : ''}">
                    ${!isBonus ? `<span class="dict-leitner-dot ${boxClass}"></span>` : ''}
                    <div class="dict-word-main">
                        <span class="dict-word-en">${item.en}</span>
                        <span class="dict-word-tr">${item.tr}</span>
                        ${exShort ? `<span class="dict-word-ex">"${exShort}"</span>` : ''}
                    </div>
                    <div class="dict-word-meta">
                        ${item.level ? `<span class="dict-word-level">${item.level}</span>` : ''}
                        <span class="dict-word-type">${typeLabels[item.type] || ''}</span>
                    </div>
                </div>
            `;
        });

        if (filtered.length > 100) {
            html += `<div class="dict-empty">+${filtered.length - 100} daha... Aramayı daralt.</div>`;
        }

        list.innerHTML = html;
    }

    // ===== QUIZ WORD LOOKUP =====
    let lookupAllWords = null; // cached

    function buildLookupIndex() {
        if (lookupAllWords) return lookupAllWords;
        const map = new Map();

        // Vocabulary & phrasal verbs with word+meaning_tr
        if (wordData) {
            (wordData.vocabulary || []).forEach(q => {
                if (q.word && q.meaning_tr) {
                    map.set(q.word.toLowerCase(), { en: q.word, tr: q.meaning_tr, level: q.level || '', type: 'vocab' });
                }
            });
            (wordData.phrasal_verbs || []).forEach(q => {
                if (q.word && q.meaning_tr) {
                    map.set(q.word.toLowerCase(), { en: q.word, tr: q.meaning_tr, level: q.level || '', type: 'phrasal' });
                }
            });
        }

        // Bonus words
        BONUS_WORDS.forEach(w => {
            if (!map.has(w.en.toLowerCase())) {
                map.set(w.en.toLowerCase(), { en: w.en, tr: w.tr, level: '', type: 'bonus' });
            }
        });

        lookupAllWords = map;
        return map;
    }

    function openQuizLookup() {
        const panel = $('quiz-lookup-panel');
        if (!panel) return;
        panel.classList.remove('hidden');
        const input = $('lookup-search-input');
        if (input) { input.value = ''; input.focus(); }
        // Show current question's words as suggestions
        showLookupSuggestions();
    }

    function closeQuizLookup() {
        const panel = $('quiz-lookup-panel');
        if (panel) panel.classList.add('hidden');
    }

    function showLookupSuggestions() {
        const results = $('lookup-results');
        if (!results) return;

        const index = buildLookupIndex();
        const q = state.questions[state.currentIndex];
        if (!q) { results.innerHTML = '<p class="lookup-hint">Soru bulunamadı.</p>'; return; }

        // Extract words from question text
        const text = (q.sentence || '').replace(/----/g, '');
        const words = text.match(/[a-zA-Z]+/g) || [];
        const unique = [...new Set(words.map(w => w.toLowerCase()))];

        // Find matches in our dictionary
        const found = [];
        unique.forEach(w => {
            if (w.length < 3) return; // skip short words (a, an, the, is, etc.)
            const entry = index.get(w);
            if (entry) found.push(entry);
        });

        if (found.length > 0) {
            let html = '<p class="lookup-hint" style="padding:8px 0 4px;font-size:0.75rem;">📌 Bu soruda geçen kelimeler:</p>';
            found.forEach(e => {
                const isBonus = e.type === 'bonus';
                html += `
                    <div class="lookup-word-item ${isBonus ? 'lookup-bonus' : ''}">
                        <span class="lookup-word-en">${e.en}</span>
                        <span class="lookup-word-tr">${e.tr}</span>
                        ${e.level ? `<span class="lookup-word-level">${e.level}</span>` : ''}
                    </div>
                `;
            });
            html += '<p class="lookup-hint" style="padding:8px 0 0;font-size:0.72rem;">Yukarıda arama yaparak başka kelimeler de sorgulayabilirsin.</p>';
            results.innerHTML = html;
        } else {
            results.innerHTML = '<p class="lookup-hint">Soruda sözlükteki kelimelerden bulunamadı. Yukarıdan arama yapabilirsin.</p>';
        }
    }

    function searchLookup(term) {
        const results = $('lookup-results');
        if (!results) return;

        if (!term || term.length < 2) {
            showLookupSuggestions();
            return;
        }

        const index = buildLookupIndex();
        const lowerTerm = term.toLowerCase();
        const matches = [];

        index.forEach((entry) => {
            if (entry.en.toLowerCase().includes(lowerTerm) || entry.tr.toLowerCase().includes(lowerTerm)) {
                matches.push(entry);
            }
        });

        if (matches.length === 0) {
            results.innerHTML = `<p class="lookup-hint">"${term}" için sonuç bulunamadı.</p>`;
            return;
        }

        // Limit to 20
        const display = matches.slice(0, 20);
        let html = '';
        display.forEach(e => {
            const isBonus = e.type === 'bonus';
            html += `
                <div class="lookup-word-item ${isBonus ? 'lookup-bonus' : ''}">
                    <span class="lookup-word-en">${e.en}</span>
                    <span class="lookup-word-tr">${e.tr}</span>
                    ${e.level ? `<span class="lookup-word-level">${e.level}</span>` : ''}
                </div>
            `;
        });
        if (matches.length > 20) {
            html += `<p class="lookup-hint">+${matches.length - 20} daha...</p>`;
        }
        results.innerHTML = html;
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
