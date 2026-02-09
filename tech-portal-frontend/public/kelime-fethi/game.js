// ============================================================
// KELIME FETHI v1.0 — Turkey Map Word Puzzle Game
// Psychology: Variable Rewards, Loss Aversion, Completion Bias
// Flow State, Near-Miss, Dopamine Loops, Color Psychology
// ============================================================

// ===== TURKISH CHARACTER HANDLING =====
const TR_UPPER = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';
const TR_LOWER = 'abcçdefgğhıijklmnoöprsştuüvyz';

function trUpper(str) {
    let result = '';
    for (const ch of str) {
        const idx = TR_LOWER.indexOf(ch);
        result += idx >= 0 ? TR_UPPER[idx] : ch.toUpperCase();
    }
    return result;
}

function trLower(str) {
    let result = '';
    for (const ch of str) {
        const idx = TR_UPPER.indexOf(ch);
        result += idx >= 0 ? TR_LOWER[idx] : ch.toLowerCase();
    }
    return result;
}

// Turkish char length (each Turkish char = 1)
function trLen(str) {
    return [...str].length;
}

// ===== HAPTIC FEEDBACK =====
const Haptic = {
    enabled: true,
    _vib(pattern) {
        if (!this.enabled || !navigator.vibrate) return;
        try { navigator.vibrate(pattern); } catch(e) {}
    },
    tap()       { this._vib(8); },
    keyPress()  { this._vib(5); },
    correct()   { this._vib([15, 30, 15]); },
    present()   { this._vib([10, 20, 10]); },
    absent()    { this._vib(3); },
    win()       { this._vib([30, 50, 30, 50, 60]); },
    lose()      { this._vib([80, 40, 120]); },
    conquer()   { this._vib([20, 30, 20, 30, 40, 30, 60]); },
    error()     { this._vib([40, 20, 40]); },
    streak()    { this._vib([15, 40, 25]); },
};

// ===== SOUND SYSTEM (Web Audio API Oscillator Synthesis) =====
const SFX = {
    ctx: null,
    enabled: true,
    masterGain: null,
    volume: 0.5,
    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = this.volume;
            this.masterGain.connect(this.ctx.destination);
        } catch (e) { this.enabled = false; }
    },
    resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); },

    _play(freq, type, dur, vol = 0.1, detune = 0) {
        if (!this.enabled || !this.ctx || !this.masterGain) return;
        try {
            const c = this.ctx, t = c.currentTime;
            const o = c.createOscillator(), g = c.createGain();
            o.type = type; o.frequency.value = freq; o.detune.value = detune;
            g.gain.setValueAtTime(vol, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + dur);
            o.connect(g); g.connect(this.masterGain);
            o.start(t); o.stop(t + dur);
        } catch(e) {}
    },

    _chord(freqs, type, dur, vol = 0.06) {
        freqs.forEach(f => this._play(f, type, dur, vol / freqs.length));
    },

    // --- Game Sounds ---
    keyTap() {
        this._play(800, 'sine', 0.04, 0.06);
        Haptic.keyPress();
    },
    tileRevealCorrect() {
        this._play(880, 'sine', 0.12, 0.08);
        this._play(1320, 'triangle', 0.08, 0.04);
        Haptic.correct();
    },
    tileRevealPresent() {
        this._play(660, 'sine', 0.1, 0.07);
        Haptic.present();
    },
    tileRevealAbsent() {
        this._play(300, 'sine', 0.06, 0.04);
        Haptic.absent();
    },
    win() {
        const fanfare = [523, 659, 784, 1047, 1319];
        fanfare.forEach((f, i) => {
            setTimeout(() => {
                this._play(f, 'sine', 0.25, 0.08);
                this._play(f * 1.5, 'triangle', 0.2, 0.03);
            }, i * 110);
        });
        setTimeout(() => this._chord([1047, 1319, 1568], 'sine', 0.4, 0.1), 550);
        Haptic.win();
    },
    lose() {
        this._play(300, 'sawtooth', 0.2, 0.06);
        setTimeout(() => this._play(200, 'sawtooth', 0.25, 0.05), 120);
        setTimeout(() => this._play(120, 'sawtooth', 0.3, 0.04), 260);
        Haptic.lose();
    },
    conquer() {
        [880, 1047, 1175, 1319, 1568, 1760].forEach((f, i) => {
            setTimeout(() => {
                this._play(f, 'sine', 0.3, 0.08);
                this._play(f * 2, 'triangle', 0.15, 0.03);
            }, i * 80);
        });
        Haptic.conquer();
    },
    hint() {
        this._play(1200, 'sine', 0.08, 0.06);
        setTimeout(() => this._play(1400, 'sine', 0.06, 0.05), 60);
    },
    error() {
        this._play(200, 'square', 0.15, 0.05);
        Haptic.error();
    },
    bonus() {
        [1047, 1319, 1568, 2093].forEach((f, i) => {
            setTimeout(() => this._play(f, 'sine', 0.15, 0.07), i * 60);
        });
    },
    streakReward() {
        this._play(523, 'sine', 0.1, 0.06);
        setTimeout(() => this._play(784, 'sine', 0.1, 0.06), 80);
        setTimeout(() => this._play(1047, 'sine', 0.15, 0.08), 160);
        Haptic.streak();
    },
};

// ===== PARTICLES =====
const Particles = {
    canvas: null,
    ctx: null,
    particles: [],
    animId: null,

    init() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    },
    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    spawn(x, y, count = 30, colors = ['#16a34a', '#ca8a04', '#f59e0b', '#2563eb']) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
            const speed = 2 + Math.random() * 4;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                life: 1,
                decay: 0.015 + Math.random() * 0.02,
                size: 3 + Math.random() * 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                shape: Math.random() > 0.5 ? 'circle' : 'rect',
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.2,
            });
        }
        if (!this.animId) this.animate();
    },
    animate() {
        if (!this.ctx || this.particles.length === 0) {
            this.animId = null;
            return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.08; // gravity
            p.life -= p.decay;
            p.rotation += p.rotSpeed;
            if (p.life <= 0) return false;

            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.ctx.fillStyle = p.color;
            if (p.shape === 'circle') {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            }
            this.ctx.restore();
            return true;
        });
        this.animId = requestAnimationFrame(() => this.animate());
    },
    confetti(centerX, centerY) {
        this.spawn(centerX, centerY, 60, ['#16a34a', '#ca8a04', '#f59e0b', '#ef4444', '#2563eb', '#a855f7']);
    },
};

// ===== FLOAT TEXT =====
function floatText(text, x, y, color = '#16a34a') {
    const el = document.createElement('div');
    el.className = 'float-text';
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.color = color;
    const container = document.getElementById('float-container');
    if (container) {
        container.appendChild(el);
        setTimeout(() => el.remove(), 1200);
    }
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, duration = 2500) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ===== GAME STATE =====
const DEFAULT_STATE = {
    // Core
    score: 0,
    totalScore: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    hints: 3,

    // Daily
    dailyDate: null,
    dailyGuesses: [],
    dailyComplete: false,
    dailyWon: false,
    dailyWord: null,

    // City progress
    conqueredCities: {},  // { cityId: { word, guesses, score, date } }
    activeCityId: null,
    activeCityGuesses: [],
    activeCityWord: null,

    // Guess distribution
    guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },

    // Streak
    lastPlayDate: null,

    // Settings
    hardMode: false,
    soundEnabled: true,
    hapticEnabled: true,

    // Meta
    tutorialDone: false,
    startTime: Date.now(),
    lastSave: Date.now(),
    version: '1.0',
};

let state = JSON.parse(JSON.stringify(DEFAULT_STATE));

// ===== GAME DATA (loaded from JSON) =====
let WORDS = [];       // Full word list (valid guesses)
let DAILY_WORDS = []; // Daily puzzle word pool
let CITIES = [];      // 81 city data
let REGIONS = [];     // Region data
let TURKEY_MAP = {};  // SVG path data

// ===== CONSTANTS =====
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;
const SAVE_KEY = 'kelime_fethi_save_v1';
const CLOUD_API = 'https://tech-portal-api.turgut-d01.workers.dev/api/game';
const PLAYER_ID_KEY = 'kelime_fethi_player_id';

// Score per guess count (variable reward — fewer guesses = more points)
const SCORE_TABLE = { 1: 500, 2: 400, 3: 300, 4: 200, 5: 150, 6: 100 };

// Streak rewards
const STREAK_REWARDS = {
    3: { hints: 1, message: '🔥 3 gün serisi! +1 ipucu kazandın!' },
    5: { hints: 2, message: '🔥🔥 5 gün serisi! +2 ipucu kazandın!' },
    7: { hints: 3, message: '🔥🔥🔥 7 gün serisi! +3 ipucu ve özel rozet!' },
    14: { hints: 3, message: '⭐ 14 gün serisi! +3 ipucu ve altın rozet!' },
    30: { hints: 5, message: '👑 30 gün serisi! +5 ipucu ve efsane rozet!' },
};

// ===== DATA LOADING =====
async function loadGameData() {
    try {
        const [wordsRes, citiesRes] = await Promise.all([
            fetch('./data/words.json'),
            fetch('./data/cities.json'),
        ]);

        if (wordsRes.ok) {
            const wordsData = await wordsRes.json();
            WORDS = wordsData.words || [];
            DAILY_WORDS = wordsData.daily || [];
            console.log(`[Kelime Fethi] ${WORDS.length} kelime, ${DAILY_WORDS.length} günlük kelime yüklendi`);
        } else {
            console.warn('[Kelime Fethi] words.json yüklenemedi');
        }

        if (citiesRes.ok) {
            const citiesData = await citiesRes.json();
            CITIES = citiesData.cities || [];
            REGIONS = citiesData.regions || [];
            console.log(`[Kelime Fethi] ${CITIES.length} şehir, ${REGIONS.length} bölge yüklendi`);
        } else {
            console.warn('[Kelime Fethi] cities.json yüklenemedi');
        }
    } catch (e) {
        console.error('[Kelime Fethi] Veri yükleme hatası:', e);
    }
}

// ===== DAILY PUZZLE WORD SELECTION =====
function getDailyWord() {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10); // YYYY-MM-DD

    if (DAILY_WORDS.length === 0) return null;

    // Deterministic seed from date
    let seed = 0;
    for (let i = 0; i < dateStr.length; i++) {
        seed = ((seed << 5) - seed) + dateStr.charCodeAt(i);
        seed = seed & seed; // Convert to 32bit integer
    }
    seed = Math.abs(seed);

    return DAILY_WORDS[seed % DAILY_WORDS.length];
}

function getTodayStr() {
    return new Date().toISOString().slice(0, 10);
}

// ===== WORD EVALUATION (Wordle Algorithm with Turkish chars) =====
function evaluateGuess(guess, target) {
    const result = new Array(WORD_LENGTH).fill('absent');
    const guessArr = [...guess];
    const targetArr = [...target];
    const targetUsed = new Array(WORD_LENGTH).fill(false);
    const guessUsed = new Array(WORD_LENGTH).fill(false);

    // Pass 1: Find correct positions (green)
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessArr[i] === targetArr[i]) {
            result[i] = 'correct';
            targetUsed[i] = true;
            guessUsed[i] = true;
        }
    }

    // Pass 2: Find present but wrong position (yellow)
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessUsed[i]) continue;
        for (let j = 0; j < WORD_LENGTH; j++) {
            if (targetUsed[j]) continue;
            if (guessArr[i] === targetArr[j]) {
                result[i] = 'present';
                targetUsed[j] = true;
                break;
            }
        }
    }

    return result;
}

// ===== GUESS VALIDATION =====
function isValidWord(word) {
    return WORDS.includes(word);
}

function validateGuess(guess) {
    if (trLen(guess) !== WORD_LENGTH) {
        return { valid: false, message: '5 harfli bir kelime girin!' };
    }
    if (!isValidWord(guess)) {
        return { valid: false, message: 'Bu kelime sözlükte yok!' };
    }

    // Hard mode validation — tüm önceki tahminlerden elde edilen bilgiler kullanılmalı
    if (state.hardMode && state.activeCityGuesses.length > 0) {
        const guessArr = [...guess];

        // Tüm önceki tahminlerden correct ve present harfleri topla
        const requiredPositions = {}; // pozisyon -> harf (yeşil)
        const requiredLetters = {};   // harf -> minimum adet (sarı + yeşil)

        for (const prevGuess of state.activeCityGuesses) {
            const prevEval = evaluateGuess(prevGuess, state.activeCityWord);
            const prevArr = [...prevGuess];
            const letterCounts = {};

            for (let i = 0; i < WORD_LENGTH; i++) {
                if (prevEval[i] === 'correct') {
                    requiredPositions[i] = prevArr[i];
                    letterCounts[prevArr[i]] = (letterCounts[prevArr[i]] || 0) + 1;
                } else if (prevEval[i] === 'present') {
                    letterCounts[prevArr[i]] = (letterCounts[prevArr[i]] || 0) + 1;
                }
            }

            // Her harf için minimum gerekli adeti güncelle
            for (const [letter, count] of Object.entries(letterCounts)) {
                requiredLetters[letter] = Math.max(requiredLetters[letter] || 0, count);
            }
        }

        // 1. Yeşil harfler doğru pozisyonda olmalı
        for (const [pos, letter] of Object.entries(requiredPositions)) {
            if (guessArr[parseInt(pos)] !== letter) {
                return { valid: false, message: `${parseInt(pos)+1}. harf ${letter} olmalı!` };
            }
        }

        // 2. Sarı + yeşil harfler yeterli sayıda bulunmalı
        for (const [letter, minCount] of Object.entries(requiredLetters)) {
            const actualCount = guessArr.filter(c => c === letter).length;
            if (actualCount < minCount) {
                return { valid: false, message: `${letter} harfi kullanılmalı!` };
            }
        }
    }

    return { valid: true };
}

// ===== RENDER: GUESS GRID =====
function renderGrid() {
    const grid = document.getElementById('guess-grid');
    if (!grid) return;

    grid.innerHTML = '';

    for (let row = 0; row < MAX_GUESSES; row++) {
        const rowEl = document.createElement('div');
        rowEl.className = 'grid-row';

        for (let col = 0; col < WORD_LENGTH; col++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.id = `tile-${row}-${col}`;

            // Submitted guesses
            if (row < state.activeCityGuesses.length) {
                const guess = state.activeCityGuesses[row];
                const evaluation = evaluateGuess(guess, state.activeCityWord);
                const chars = [...guess];
                tile.textContent = chars[col] || '';
                tile.classList.add('revealed', evaluation[col]);
            }
            // Current row (typing)
            else if (row === state.activeCityGuesses.length) {
                const chars = [...currentInput];
                tile.textContent = chars[col] || '';
                if (chars[col]) tile.classList.add('filled');
            }

            rowEl.appendChild(tile);
        }
        grid.appendChild(rowEl);
    }
}

// ===== RENDER: KEYBOARD STATE =====
let keyboardState = {}; // letter -> 'correct' | 'present' | 'absent'

function updateKeyboardState() {
    keyboardState = {};

    state.activeCityGuesses.forEach(guess => {
        if (!state.activeCityWord) return;
        const evaluation = evaluateGuess(guess, state.activeCityWord);
        const chars = [...guess];

        chars.forEach((ch, i) => {
            const current = keyboardState[ch];
            const newState = evaluation[i];

            // Priority: correct > present > absent
            if (newState === 'correct') {
                keyboardState[ch] = 'correct';
            } else if (newState === 'present' && current !== 'correct') {
                keyboardState[ch] = 'present';
            } else if (!current) {
                keyboardState[ch] = 'absent';
            }
        });
    });
}

function renderKeyboard() {
    document.querySelectorAll('#keyboard .key').forEach(btn => {
        const key = btn.dataset.key;
        if (!key || key === 'ENTER' || key === 'BACKSPACE') return;

        btn.classList.remove('correct', 'present', 'absent');
        if (keyboardState[key]) {
            btn.classList.add(keyboardState[key]);
        }
    });
}

// ===== INPUT HANDLING =====
let currentInput = '';
let isAnimating = false;
let currentPuzzleComplete = false;

function addLetter(letter) {
    if (isAnimating || currentPuzzleComplete) return;
    if (trLen(currentInput) >= WORD_LENGTH) return;

    currentInput += letter;
    SFX.keyTap();

    // Pop animation on current tile
    const row = state.activeCityGuesses.length;
    const col = trLen(currentInput) - 1;
    const tile = document.getElementById(`tile-${row}-${col}`);
    if (tile) {
        tile.textContent = letter;
        tile.classList.add('filled', 'pop');
        setTimeout(() => tile.classList.remove('pop'), 100);
    }
}

function removeLetter() {
    if (isAnimating || currentPuzzleComplete) return;
    if (currentInput.length === 0) return;

    const row = state.activeCityGuesses.length;
    const col = trLen(currentInput) - 1;
    const tile = document.getElementById(`tile-${row}-${col}`);
    if (tile) {
        tile.textContent = '';
        tile.classList.remove('filled');
    }

    // Remove last character (handle multi-byte properly)
    const chars = [...currentInput];
    chars.pop();
    currentInput = chars.join('');

    Haptic.tap();
}

function submitGuess() {
    if (isAnimating || currentPuzzleComplete) return;

    const guess = trUpper(currentInput);
    const validation = validateGuess(guess);

    if (!validation.valid) {
        shakeRow(state.activeCityGuesses.length);
        showToast(validation.message);
        SFX.error();
        return;
    }

    // Add guess to state
    state.activeCityGuesses.push(guess);
    currentInput = '';

    // Animate reveal
    revealRow(state.activeCityGuesses.length - 1, guess);
}

// ===== TILE REVEAL ANIMATION =====
function revealRow(rowIndex, guess) {
    isAnimating = true;
    const evaluation = evaluateGuess(guess, state.activeCityWord);
    const chars = [...guess];

    chars.forEach((ch, col) => {
        setTimeout(() => {
            const tile = document.getElementById(`tile-${rowIndex}-${col}`);
            if (!tile) return;

            tile.classList.add('revealing');

            setTimeout(() => {
                tile.textContent = ch;
                tile.classList.remove('revealing');
                tile.classList.add('revealed', evaluation[col]);

                // Play sound for each tile
                if (evaluation[col] === 'correct') SFX.tileRevealCorrect();
                else if (evaluation[col] === 'present') SFX.tileRevealPresent();
                else SFX.tileRevealAbsent();
            }, 250);

            // Last tile — check result
            if (col === WORD_LENGTH - 1) {
                setTimeout(() => {
                    updateKeyboardState();
                    renderKeyboard();
                    isAnimating = false;
                    checkPuzzleResult(guess, evaluation, rowIndex);
                }, 400);
            }
        }, col * 300);
    });
}

function shakeRow(rowIndex) {
    const rows = document.querySelectorAll('.grid-row');
    if (rows[rowIndex]) {
        rows[rowIndex].classList.add('shake');
        setTimeout(() => rows[rowIndex].classList.remove('shake'), 600);
    }
}

function bounceRow(rowIndex) {
    const row = document.querySelectorAll('.grid-row')[rowIndex];
    if (!row) return;
    const tiles = row.querySelectorAll('.tile');
    tiles.forEach((tile, i) => {
        setTimeout(() => tile.classList.add('bounce'), i * 80);
    });
}

// ===== PUZZLE RESULT CHECK =====
function checkPuzzleResult(guess, evaluation, rowIndex) {
    const isCorrect = evaluation.every(e => e === 'correct');
    const isLastGuess = state.activeCityGuesses.length >= MAX_GUESSES;

    if (isCorrect) {
        // WIN
        currentPuzzleComplete = true;
        bounceRow(rowIndex);

        const guessCount = state.activeCityGuesses.length;
        const baseScore = SCORE_TABLE[guessCount] || 100;

        // 3% bonus chance (variable reward — dopamine)
        const hasBonus = Math.random() < 0.03;
        const bonusScore = hasBonus ? 200 : 0;
        const totalScore = baseScore + bonusScore;

        // Update state
        state.score += totalScore;
        state.totalScore += totalScore;
        state.gamesPlayed++;
        state.gamesWon++;
        state.guessDistribution[guessCount] = (state.guessDistribution[guessCount] || 0) + 1;

        // Is this a city puzzle?
        if (state.activeCityId) {
            state.conqueredCities[state.activeCityId] = {
                word: state.activeCityWord,
                guesses: guessCount,
                score: totalScore,
                date: getTodayStr(),
            };
        }

        // Is this the daily puzzle? Streak sadece günlük bulmacada güncellenir
        if (state.dailyDate === getTodayStr() && !state.dailyComplete) {
            state.dailyComplete = true;
            state.dailyWon = true;
            updateStreak(true);
        }

        save();

        // Show result after animation
        setTimeout(() => {
            SFX.win();

            if (hasBonus) {
                SFX.bonus();
                showToast('🎉 BONUS KELİME! +200 ekstra puan!', 3000);
            }

            // Near-miss psychology message
            let message = '';
            if (guessCount === 1) message = '🤯 İNANILMAZ! İlk denemede!';
            else if (guessCount === 2) message = '🧠 Deha! 2 denemede bildin!';
            else if (guessCount === 3) message = '🎯 Harika! 3 denemede!';
            else if (guessCount === 4) message = '👏 Güzel! 4 denemede buldum!';
            else if (guessCount === 5) message = '😅 Son anda! 5. denemede!';
            else message = '😰 Zar zor! Son denemede başardın!';

            showResultOverlay(true, message, totalScore, hasBonus, guessCount);

            // Particles
            const grid = document.getElementById('guess-grid');
            if (grid) {
                const rect = grid.getBoundingClientRect();
                Particles.confetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
            }

            // Float text
            floatText(`+${totalScore} ⭐`, window.innerWidth / 2, window.innerHeight / 2 - 60, '#16a34a');
            if (hasBonus) {
                setTimeout(() => floatText('+200 BONUS!', window.innerWidth / 2, window.innerHeight / 2 - 100, '#f59e0b'), 500);
            }

            updateUI();
        }, 800);

    } else if (isLastGuess) {
        // LOSE
        currentPuzzleComplete = true;

        state.gamesPlayed++;

        // Streak sadece günlük bulmacada kırılır
        if (state.dailyDate === getTodayStr() && !state.dailyComplete) {
            state.dailyComplete = true;
            state.dailyWon = false;
            updateStreak(false);
        }

        save();

        setTimeout(() => {
            SFX.lose();
            showResultOverlay(false, `Doğru kelime: ${state.activeCityWord}`, 0, false, 0);
            updateUI();
        }, 500);
    }
}

// ===== STREAK SYSTEM =====
function updateStreak(won) {
    const today = getTodayStr();

    if (won) {
        if (state.lastPlayDate) {
            const lastDate = new Date(state.lastPlayDate);
            const todayDate = new Date(today);
            const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Consecutive day
                state.currentStreak++;
            } else if (diffDays > 1) {
                // Streak broken
                state.currentStreak = 1;
            }
            // Same day — don't change streak
        } else {
            state.currentStreak = 1;
        }

        state.lastPlayDate = today;

        if (state.currentStreak > state.maxStreak) {
            state.maxStreak = state.currentStreak;
        }

        // Check streak rewards
        checkStreakRewards();
    } else {
        // Günlük bulmacada kaybetmek seriyi kırar
        state.currentStreak = 0;
        state.lastPlayDate = today;
    }
}

function checkStreakRewards() {
    const reward = STREAK_REWARDS[state.currentStreak];
    if (reward) {
        state.hints += reward.hints;
        SFX.streakReward();
        setTimeout(() => {
            showToast(reward.message, 4000);
        }, 1500);
    }
}

// ===== RESULT OVERLAY =====
function showResultOverlay(won, message, score, hasBonus, guessCount) {
    const overlay = document.getElementById('result-overlay');
    if (!overlay) return;

    document.getElementById('result-icon').textContent = won ? '🏆' : '😢';
    document.getElementById('result-title').textContent = won ? 'Tebrikler!' : 'Kaybettin!';
    document.getElementById('result-message').textContent = message;
    document.getElementById('result-score').textContent = won ? `+${score} ⭐` : '';
    document.getElementById('result-score').style.display = won ? 'block' : 'none';

    // Generate share grid
    const shareGridEl = document.getElementById('result-grid-share');
    if (shareGridEl) {
        shareGridEl.innerHTML = generateShareGrid();
    }

    // Show/hide next city button
    const nextBtn = document.getElementById('btn-next-city');
    if (nextBtn) {
        nextBtn.style.display = state.activeCityId ? 'inline-flex' : 'none';
    }

    overlay.classList.remove('hidden');
}

function hideResultOverlay() {
    const overlay = document.getElementById('result-overlay');
    if (overlay) overlay.classList.add('hidden');
}

// ===== SHARE GRID (Emoji Grid) =====
function generateShareGrid() {
    const guesses = state.activeCityGuesses;
    const word = state.activeCityWord;
    if (!word || guesses.length === 0) return '';

    let shareText = '';
    const isDaily = state.dailyDate === getTodayStr();
    const title = isDaily ? `Kelime Fethi - Günlük #${getDayNumber()}` : 'Kelime Fethi';

    const won = guesses.some(g => g === word);
    shareText += `${title} ${won ? guesses.length : 'X'}/${MAX_GUESSES}\n\n`;

    guesses.forEach(guess => {
        const eval_ = evaluateGuess(guess, word);
        const emojiRow = eval_.map(e => {
            if (e === 'correct') return '🟩';
            if (e === 'present') return '🟨';
            return '⬛';
        }).join('');
        shareText += emojiRow + '\n';
    });

    return shareText;
}

function getDayNumber() {
    // Days since game launch (arbitrary start date)
    const start = new Date('2025-01-01');
    const today = new Date(getTodayStr());
    return Math.floor((today - start) / (1000 * 60 * 60 * 24));
}

function shareResult() {
    const text = generateShareGrid();
    if (!text) return;

    if (navigator.share) {
        navigator.share({ text }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text).then(() => {
            showToast('📋 Panoya kopyalandı!');
        }).catch(() => {
            showToast('Kopyalama başarısız');
        });
    }
}

// ===== HINT SYSTEM =====
function useHint() {
    if (state.hints <= 0) {
        showToast('İpucu hakkın kalmadı!');
        return;
    }
    if (isAnimating || currentPuzzleComplete) return;
    if (!state.activeCityWord) return;

    const targetChars = [...state.activeCityWord];
    const inputChars = [...currentInput];

    // Find unrevealed correct letters
    const knownCorrect = new Set();
    state.activeCityGuesses.forEach(guess => {
        const eval_ = evaluateGuess(guess, state.activeCityWord);
        [...guess].forEach((ch, i) => {
            if (eval_[i] === 'correct') knownCorrect.add(i);
        });
    });

    // Find a position not yet known
    const unknownPositions = [];
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (!knownCorrect.has(i)) unknownPositions.push(i);
    }

    if (unknownPositions.length === 0) {
        showToast('Zaten tüm harfleri biliyorsun!');
        return;
    }

    // Pick random unknown position and reveal it
    const pos = unknownPositions[Math.floor(Math.random() * unknownPositions.length)];
    const revealedLetter = targetChars[pos];

    state.hints--;
    SFX.hint();

    showToast(`💡 ${pos + 1}. harf: ${revealedLetter}`);
    updateHintDisplay();
    save();
}

function updateHintDisplay() {
    const el = document.getElementById('hint-count');
    if (el) el.textContent = state.hints;
}

// ===== MAP SYSTEM =====
function getConqueredCount() {
    return Object.keys(state.conqueredCities).length;
}

function isCityConquered(cityId) {
    return !!state.conqueredCities[cityId];
}

function isCityAvailable(cityId) {
    const city = CITIES.find(c => c.id === cityId);
    if (!city) return false;

    const region = REGIONS.find(r => r.id === city.region);
    if (!region) return false;

    return getConqueredCount() >= region.unlockThreshold;
}

function isRegionUnlocked(regionId) {
    const region = REGIONS.find(r => r.id === regionId);
    if (!region) return false;
    return getConqueredCount() >= region.unlockThreshold;
}

function getRegionProgress(regionId) {
    const regionCities = CITIES.filter(c => c.region === regionId);
    const conquered = regionCities.filter(c => isCityConquered(c.id));
    return { total: regionCities.length, conquered: conquered.length };
}

function renderMap() {
    const mapEl = document.getElementById('turkey-map');
    if (!mapEl || !TURKEY_MAP.paths) return;

    mapEl.innerHTML = '';

    TURKEY_MAP.paths.forEach(pathData => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData.d);
        path.setAttribute('id', `city-${pathData.id}`);
        path.dataset.cityId = pathData.id;
        path.dataset.name = pathData.name;

        // Set class based on state
        if (isCityConquered(pathData.id)) {
            path.classList.add('city-conquered');
        } else if (isCityAvailable(pathData.id)) {
            path.classList.add('city-available');
        } else {
            path.classList.add('city-locked');
        }

        // Click handler
        path.addEventListener('click', () => onCityClick(pathData.id));

        mapEl.appendChild(path);

        // City label
        if (pathData.labelX && pathData.labelY) {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', pathData.labelX);
            text.setAttribute('y', pathData.labelY);
            text.setAttribute('class', 'city-label');
            text.textContent = pathData.name;
            text.addEventListener('click', () => onCityClick(pathData.id));
            mapEl.appendChild(text);
        }
    });

    updateMapProgress();
}

function updateMapProgress() {
    const count = getConqueredCount();
    const total = CITIES.length || 81;

    const countEl = document.getElementById('city-count');
    if (countEl) countEl.textContent = `${count}/${total}`;

    const progressEl = document.getElementById('map-progress');
    if (progressEl) progressEl.style.width = `${(count / total) * 100}%`;
}

// ===== CITY CLICK HANDLER =====
function onCityClick(cityId) {
    const city = CITIES.find(c => c.id === cityId);
    if (!city) return;

    if (isCityConquered(cityId)) {
        const data = state.conqueredCities[cityId];
        showToast(`${city.name} zaten fethedildi! (${data.guesses}/6, +${data.score}⭐)`);
        return;
    }

    if (!isCityAvailable(cityId)) {
        const region = REGIONS.find(r => r.id === city.region);
        if (region) {
            showToast(`🔒 ${region.name} bölgesini açmak için ${region.unlockThreshold} şehir fethet!`);
        }
        Haptic.error();
        return;
    }

    // Start city puzzle
    startCityPuzzle(cityId);
}

// ===== START PUZZLE =====
function startCityPuzzle(cityId) {
    const city = CITIES.find(c => c.id === cityId);
    if (!city || !city.words || city.words.length === 0) return;

    // Pick a random word from city's themed word pool
    const word = city.words[Math.floor(Math.random() * city.words.length)];

    state.activeCityId = cityId;
    state.activeCityWord = word;
    state.activeCityGuesses = [];
    currentInput = '';
    currentPuzzleComplete = false;
    keyboardState = {};

    // Update UI
    document.getElementById('puzzle-city-name').textContent = city.name;
    const regionData = REGIONS.find(r => r.id === city.region);
    document.getElementById('puzzle-region-name').textContent = regionData ? regionData.name : '';

    renderGrid();
    renderKeyboard();
    updateHintDisplay();

    // Switch to puzzle view
    switchView('puzzle');

    SFX.resume();
}

function startDailyPuzzle() {
    const today = getTodayStr();

    // Already completed today
    if (state.dailyDate === today && state.dailyComplete) {
        showToast('Bugünkü bulmacayı zaten tamamladın!');
        return;
    }

    const word = getDailyWord();
    if (!word) {
        showToast('Kelime verisi yüklenemedi!');
        return;
    }

    // Continue existing daily or start new
    if (state.dailyDate !== today) {
        state.dailyDate = today;
        state.dailyGuesses = [];
        state.dailyComplete = false;
        state.dailyWon = false;
        state.dailyWord = word;
    }

    state.activeCityId = null; // Not a city puzzle
    state.activeCityWord = state.dailyWord;
    state.activeCityGuesses = state.dailyGuesses;
    currentInput = '';
    currentPuzzleComplete = state.dailyComplete;
    keyboardState = {};

    // Rebuild keyboard state from existing guesses
    updateKeyboardState();

    // Update UI
    document.getElementById('puzzle-city-name').textContent = 'Günlük Bulmaca';
    document.getElementById('puzzle-region-name').textContent = `#${getDayNumber()}`;

    renderGrid();
    renderKeyboard();
    updateHintDisplay();

    switchView('puzzle');
    SFX.resume();
}

// ===== VIEW SWITCHING =====
function switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

    // Show target view
    let targetId;
    if (viewName === 'map') targetId = 'map-view';
    else if (viewName === 'puzzle') targetId = 'puzzle-view';
    else if (viewName === 'stats') targetId = 'stats-view';
    else if (viewName === 'settings') targetId = 'settings-view';
    else if (viewName === 'daily') {
        startDailyPuzzle();
        return;
    }

    const target = document.getElementById(targetId);
    if (target) target.classList.add('active');

    // Update nav
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === viewName);
    });
}

// ===== DAILY COUNTDOWN =====
function updateDailyCountdown() {
    const el = document.getElementById('daily-countdown');
    if (!el) return;

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const diff = tomorrow - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    el.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Daily dot notification
    const dot = document.getElementById('daily-dot');
    if (dot) {
        dot.style.display = (state.dailyDate !== getTodayStr() || !state.dailyComplete) ? 'block' : 'none';
    }
}

// ===== STATS =====
function updateStats() {
    const el = (id) => document.getElementById(id);

    el('stat-played').textContent = state.gamesPlayed;
    el('stat-win-pct').textContent = state.gamesPlayed > 0 ? Math.round((state.gamesWon / state.gamesPlayed) * 100) : 0;
    el('stat-streak').textContent = state.currentStreak;
    el('stat-max-streak').textContent = state.maxStreak;

    // Guess distribution
    const distEl = document.getElementById('guess-distribution');
    if (distEl) {
        distEl.innerHTML = '';
        const maxCount = Math.max(1, ...Object.values(state.guessDistribution));

        for (let i = 1; i <= MAX_GUESSES; i++) {
            const count = state.guessDistribution[i] || 0;
            const pct = (count / maxCount) * 100;

            const row = document.createElement('div');
            row.className = 'dist-row';
            row.innerHTML = `
                <span class="dist-label">${i}</span>
                <div class="dist-bar-wrap">
                    <div class="dist-bar${count > 0 ? ' has-value' : ''}" style="width:${Math.max(pct, 5)}%">
                        <span>${count}</span>
                    </div>
                </div>
            `;
            distEl.appendChild(row);
        }
    }

    // Region progress
    const regionEl = document.getElementById('region-progress');
    if (regionEl && REGIONS.length > 0) {
        regionEl.innerHTML = '';
        REGIONS.forEach(region => {
            const progress = getRegionProgress(region.id);
            const unlocked = isRegionUnlocked(region.id);
            const pct = progress.total > 0 ? (progress.conquered / progress.total) * 100 : 0;

            const row = document.createElement('div');
            row.className = `region-progress-row${unlocked ? '' : ' locked'}`;
            row.innerHTML = `
                <div class="region-info">
                    <span class="region-name">${unlocked ? '' : '🔒 '}${region.name}</span>
                    <span class="region-count">${progress.conquered}/${progress.total}</span>
                </div>
                <div class="region-bar-wrap">
                    <div class="region-bar" style="width:${pct}%"></div>
                </div>
            `;
            regionEl.appendChild(row);
        });
    }
}

// ===== SETTINGS =====
function initSettings() {
    const hardEl = document.getElementById('setting-hard-mode');
    const soundEl = document.getElementById('setting-sound');
    const hapticEl = document.getElementById('setting-haptic');

    if (hardEl) {
        hardEl.checked = state.hardMode;
        hardEl.addEventListener('change', () => {
            state.hardMode = hardEl.checked;
            save();
            showToast(state.hardMode ? 'Zor mod açık!' : 'Zor mod kapalı');
        });
    }

    if (soundEl) {
        soundEl.checked = state.soundEnabled;
        soundEl.addEventListener('change', () => {
            state.soundEnabled = soundEl.checked;
            SFX.enabled = state.soundEnabled;
            save();
            updateSoundButton();
        });
    }

    if (hapticEl) {
        hapticEl.checked = state.hapticEnabled;
        hapticEl.addEventListener('change', () => {
            state.hapticEnabled = hapticEl.checked;
            Haptic.enabled = state.hapticEnabled;
            save();
        });
    }

    // Reset button
    const resetBtn = document.getElementById('btn-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Tüm ilerlemeniz silinecek! Emin misiniz?')) {
                localStorage.removeItem(SAVE_KEY);
                state = JSON.parse(JSON.stringify(DEFAULT_STATE));
                save();
                location.reload();
            }
        });
    }
}

function updateSoundButton() {
    const btn = document.getElementById('btn-sound');
    if (btn) btn.textContent = SFX.enabled ? '🔊' : '🔇';
}

// ===== SAVE / LOAD =====
function save() {
    state.lastSave = Date.now();
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) { console.warn('[KF] Save failed', e); }
}

function loadSave() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return false;
        const saved = JSON.parse(raw);

        // Merge saved into state
        for (const key in saved) {
            if (saved[key] !== undefined) state[key] = saved[key];
        }

        // Ensure critical fields exist
        if (!state.conqueredCities) state.conqueredCities = {};
        if (!state.guessDistribution) state.guessDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        if (typeof state.score !== 'number') state.score = 0;
        if (typeof state.totalScore !== 'number') state.totalScore = 0;
        if (typeof state.gamesPlayed !== 'number') state.gamesPlayed = 0;
        if (typeof state.gamesWon !== 'number') state.gamesWon = 0;
        if (typeof state.currentStreak !== 'number') state.currentStreak = 0;
        if (typeof state.maxStreak !== 'number') state.maxStreak = 0;
        if (typeof state.hints !== 'number') state.hints = 3;
        if (typeof state.hardMode !== 'boolean') state.hardMode = false;
        if (typeof state.soundEnabled !== 'boolean') state.soundEnabled = true;
        if (typeof state.hapticEnabled !== 'boolean') state.hapticEnabled = true;
        if (typeof state.tutorialDone !== 'boolean') state.tutorialDone = false;

        // Apply settings
        SFX.enabled = state.soundEnabled;
        Haptic.enabled = state.hapticEnabled;

        return true;
    } catch (e) {
        console.warn('[KF] Load failed:', e);
        return false;
    }
}

// ===== CLOUD SAVE SYSTEM =====
function getPlayerId() {
    let id = localStorage.getItem(PLAYER_ID_KEY);
    if (!id) {
        id = 'kf_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 10);
        localStorage.setItem(PLAYER_ID_KEY, id);
    }
    return id;
}

const CloudSave = {
    busy: false,
    lastSync: 0,

    show() {
        const overlay = document.getElementById('cloud-overlay');
        if (!overlay) return;
        overlay.classList.remove('hidden');
        document.getElementById('player-id-display').textContent = getPlayerId();
        this.checkStatus();
    },

    hide() {
        const overlay = document.getElementById('cloud-overlay');
        if (overlay) overlay.classList.add('hidden');
    },

    async checkStatus() {
        const statusEl = document.getElementById('cloud-status');
        if (!statusEl) return;

        try {
            statusEl.textContent = 'Kontrol ediliyor...';
            const res = await fetch(`${CLOUD_API}/check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId: getPlayerId() })
            });
            const data = await res.json();

            if (data.exists) {
                const date = new Date(data.updatedAt).toLocaleString('tr-TR');
                statusEl.innerHTML = `☁️ Kayıt mevcut (${date})`;
            } else {
                statusEl.innerHTML = '☁️ Bulut kaydı yok';
            }
        } catch (e) {
            statusEl.textContent = '⚠️ Bağlantı hatası';
        }
    },

    async saveToCloud() {
        if (this.busy) return;
        const pin = document.getElementById('cloud-pin')?.value;
        if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
            this.showMsg('❌ 4 haneli PIN girin!', 'error');
            return;
        }

        this.busy = true;
        this.showMsg('☁️ Kaydediliyor...', 'info');

        try {
            save();
            const res = await fetch(`${CLOUD_API}/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerId: getPlayerId(),
                    pin,
                    saveData: JSON.stringify(state),
                    gameVersion: '1.0',
                    totalGold: state.totalScore || 0,
                    prestigeStars: getConqueredCount(),
                    playTime: Math.floor((Date.now() - (state.startTime || Date.now())) / 1000)
                })
            });

            const data = await res.json();
            if (data.success) {
                this.showMsg('✅ Buluta kaydedildi!', 'success');
                this.lastSync = Date.now();
                SFX.win();
            } else {
                this.showMsg('❌ ' + (data.error || 'Kayıt hatası'), 'error');
            }
        } catch (e) {
            this.showMsg('❌ Bağlantı hatası', 'error');
        }
        this.busy = false;
    },

    async loadFromCloud() {
        if (this.busy) return;
        const pin = document.getElementById('cloud-pin')?.value;
        if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
            this.showMsg('❌ 4 haneli PIN girin!', 'error');
            return;
        }

        this.busy = true;
        this.showMsg('☁️ Yükleniyor...', 'info');

        try {
            const res = await fetch(`${CLOUD_API}/load`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId: getPlayerId(), pin })
            });

            const data = await res.json();
            if (data.success && data.saveData) {
                const saved = JSON.parse(data.saveData);
                for (const key in saved) {
                    if (saved[key] !== undefined) state[key] = saved[key];
                }
                if (!state.conqueredCities) state.conqueredCities = {};
                if (!state.guessDistribution) state.guessDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

                SFX.enabled = state.soundEnabled;
                Haptic.enabled = state.hapticEnabled;

                save();
                this.showMsg('✅ Buluttan yüklendi!', 'success');

                setTimeout(() => {
                    this.hide();
                    updateUI();
                    renderMap();
                }, 1000);
            } else {
                this.showMsg('❌ ' + (data.error || 'Yükleme hatası'), 'error');
            }
        } catch (e) {
            this.showMsg('❌ Bağlantı hatası', 'error');
        }
        this.busy = false;
    },

    showMsg(text, type) {
        const el = document.getElementById('cloud-msg');
        if (el) {
            el.textContent = text;
            el.className = 'cloud-msg ' + type;
        }
    },
};

// ===== TUTORIAL =====
const TUTORIAL_STEPS = [
    {
        title: 'Kelime Fethi\'ne Hoş Geldin! 🗺️',
        text: 'Türkiye haritasında 81 şehri kelime bulmacalarıyla fethet!',
        icon: '🗺️',
    },
    {
        title: 'Nasıl Oynanır? ✍️',
        text: 'Haritadan bir şehir seç → 5 harfli kelimeyi 6 denemede bul!',
        icon: '✍️',
    },
    {
        title: 'Renkler Ne Anlama Gelir? 🎨',
        text: '🟩 Yeşil = Doğru harf, doğru yer\n🟨 Sarı = Doğru harf, yanlış yer\n⬛ Gri = Bu harf kelimede yok',
        icon: '🎨',
    },
    {
        title: 'Günlük Bulmaca 📅',
        text: 'Her gün yeni bir bulmaca! Seriyi kırmadan devam et, ipucu kazan!',
        icon: '📅',
    },
];

let tutorialStep = 0;

function showTutorial() {
    tutorialStep = 0;
    renderTutorialStep();
    const overlay = document.getElementById('tutorial-overlay');
    if (overlay) overlay.classList.remove('hidden');
}

function renderTutorialStep() {
    const step = TUTORIAL_STEPS[tutorialStep];
    if (!step) return;

    const stepEl = document.getElementById('tutorial-step');
    if (stepEl) {
        stepEl.innerHTML = `
            <div class="tutorial-icon">${step.icon}</div>
            <h3>${step.title}</h3>
            <p>${step.text}</p>
        `;
    }

    const nextBtn = document.getElementById('btn-tutorial-next');
    if (nextBtn) {
        nextBtn.textContent = tutorialStep < TUTORIAL_STEPS.length - 1 ? 'Devam →' : 'Başla! 🚀';
    }

    // Dots
    const dotsEl = document.getElementById('tutorial-dots');
    if (dotsEl) {
        dotsEl.innerHTML = TUTORIAL_STEPS.map((_, i) =>
            `<span class="tut-dot${i === tutorialStep ? ' active' : ''}"></span>`
        ).join('');
    }
}

function nextTutorialStep() {
    tutorialStep++;
    if (tutorialStep >= TUTORIAL_STEPS.length) {
        // Tutorial complete
        const overlay = document.getElementById('tutorial-overlay');
        if (overlay) overlay.classList.add('hidden');
        state.tutorialDone = true;
        save();
        return;
    }
    renderTutorialStep();
}

// ===== REGION SELECTOR =====
function initRegionSelector() {
    document.querySelectorAll('.region-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const region = btn.dataset.region;
            filterMapByRegion(region);
        });
    });
}

function filterMapByRegion(regionId) {
    const mapEl = document.getElementById('turkey-map');
    if (!mapEl) return;

    const paths = mapEl.querySelectorAll('path');
    paths.forEach(path => {
        const cityId = parseInt(path.dataset.cityId);
        const city = CITIES.find(c => c.id === cityId);

        if (regionId === 'all') {
            path.style.opacity = '1';
        } else if (city && city.region === regionId) {
            path.style.opacity = '1';
        } else {
            path.style.opacity = '0.15';
        }
    });

    const labels = mapEl.querySelectorAll('.city-label');
    labels.forEach(label => {
        const cityId = parseInt(label.parentElement?.dataset?.cityId);
        // For simplicity, show all labels when filtering
    });
}

// ===== UI UPDATE =====
function updateUI() {
    // Top bar
    document.getElementById('streak-indicator').textContent = `🔥 ${state.currentStreak}`;
    document.getElementById('score-display').textContent = `⭐ ${state.totalScore}`;

    updateSoundButton();
    updateHintDisplay();
    updateMapProgress();
    updateDailyCountdown();
    updateStats();
}

// ===== KEYBOARD EVENT HANDLERS =====
function handleKeyPress(key) {
    if (key === 'ENTER') {
        submitGuess();
    } else if (key === 'BACKSPACE') {
        removeLetter();
    } else if (TR_UPPER.includes(key)) {
        addLetter(key);
    }
}

// Physical keyboard
function initPhysicalKeyboard() {
    document.addEventListener('keydown', (e) => {
        // Only handle when puzzle view is active
        const puzzleView = document.getElementById('puzzle-view');
        if (!puzzleView || !puzzleView.classList.contains('active')) return;

        if (e.key === 'Enter') {
            e.preventDefault();
            handleKeyPress('ENTER');
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            handleKeyPress('BACKSPACE');
        } else {
            const upper = trUpper(e.key);
            if (upper.length === 1 && TR_UPPER.includes(upper)) {
                e.preventDefault();
                handleKeyPress(upper);
            }
        }
    });
}

// Virtual keyboard
function initVirtualKeyboard() {
    document.querySelectorAll('#keyboard .key').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            SFX.resume();
            const key = btn.dataset.key;
            handleKeyPress(key);
        });
    });
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
    // Bottom nav
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            SFX.resume();
            switchView(btn.dataset.tab);
        });
    });

    // Back button
    document.getElementById('btn-back')?.addEventListener('click', () => {
        switchView('map');
    });

    // Daily puzzle
    document.getElementById('btn-daily')?.addEventListener('click', () => {
        SFX.resume();
        startDailyPuzzle();
    });

    // Hint
    document.getElementById('btn-hint')?.addEventListener('click', () => {
        useHint();
    });

    // Cloud save
    document.getElementById('btn-cloud')?.addEventListener('click', () => {
        CloudSave.show();
    });
    document.getElementById('btn-cloud-close')?.addEventListener('click', () => {
        CloudSave.hide();
    });
    document.getElementById('btn-cloud-save')?.addEventListener('click', () => {
        CloudSave.saveToCloud();
    });
    document.getElementById('btn-cloud-load')?.addEventListener('click', () => {
        CloudSave.loadFromCloud();
    });

    // Sound toggle
    document.getElementById('btn-sound')?.addEventListener('click', () => {
        SFX.enabled = !SFX.enabled;
        state.soundEnabled = SFX.enabled;
        updateSoundButton();
        save();
    });

    // Result overlay
    document.getElementById('btn-share')?.addEventListener('click', () => {
        shareResult();
    });
    document.getElementById('btn-next-city')?.addEventListener('click', () => {
        hideResultOverlay();
        switchView('map');
    });

    // Tutorial
    document.getElementById('btn-tutorial-next')?.addEventListener('click', () => {
        nextTutorialStep();
    });
}

// ===== TURKEY MAP SVG DATA =====
// Simplified Turkey map paths for 81 provinces
// Each province has: id (plate number), name, d (SVG path), labelX, labelY
const TURKEY_MAP_DATA = {
    viewBox: '0 0 1000 500',
    paths: [
        // Marmara Region
        { id: 34, name: 'İstanbul', d: 'M 212 95 L 230 82 L 248 88 L 255 100 L 250 115 L 240 120 L 225 118 L 215 112 Z', labelX: 232, labelY: 105 },
        { id: 16, name: 'Bursa', d: 'M 200 135 L 225 125 L 250 130 L 258 148 L 248 165 L 225 170 L 200 160 L 195 148 Z', labelX: 225, labelY: 150 },
        { id: 41, name: 'Kocaeli', d: 'M 252 88 L 275 85 L 288 95 L 285 110 L 270 118 L 255 115 L 250 100 Z', labelX: 268, labelY: 102 },
        { id: 54, name: 'Sakarya', d: 'M 288 90 L 310 88 L 322 98 L 318 115 L 302 120 L 288 115 L 285 100 Z', labelX: 303, labelY: 105 },
        { id: 59, name: 'Tekirdağ', d: 'M 162 78 L 185 72 L 200 80 L 210 92 L 200 102 L 180 100 L 165 92 Z', labelX: 185, labelY: 88 },
        { id: 10, name: 'Balıkesir', d: 'M 148 115 L 175 108 L 198 118 L 200 140 L 188 155 L 162 158 L 145 145 L 140 130 Z', labelX: 170, labelY: 138 },
        { id: 17, name: 'Çanakkale', d: 'M 110 100 L 135 90 L 150 100 L 155 118 L 145 135 L 125 140 L 108 130 L 105 115 Z', labelX: 130, labelY: 118 },
        { id: 22, name: 'Edirne', d: 'M 125 55 L 150 48 L 168 58 L 170 75 L 158 85 L 138 82 L 122 72 Z', labelX: 148, labelY: 68 },
        { id: 39, name: 'Kırklareli', d: 'M 160 52 L 180 45 L 198 55 L 200 72 L 188 80 L 170 78 L 158 68 Z', labelX: 178, labelY: 65 },
        { id: 11, name: 'Bilecik', d: 'M 275 130 L 295 125 L 310 135 L 308 150 L 295 158 L 278 152 L 272 140 Z', labelX: 290, labelY: 142 },
        { id: 77, name: 'Yalova', d: 'M 235 118 L 250 115 L 260 122 L 255 132 L 242 135 L 233 128 Z', labelX: 247, labelY: 126 },

        // Ege Region
        { id: 35, name: 'İzmir', d: 'M 105 185 L 130 175 L 150 185 L 155 205 L 145 225 L 120 230 L 102 218 L 98 200 Z', labelX: 128, labelY: 205 },
        { id: 9, name: 'Aydın', d: 'M 138 228 L 165 222 L 182 235 L 180 255 L 165 268 L 142 265 L 130 250 L 132 238 Z', labelX: 158, labelY: 248 },
        { id: 20, name: 'Denizli', d: 'M 185 235 L 215 228 L 235 240 L 238 260 L 225 275 L 200 272 L 185 258 L 182 245 Z', labelX: 210, labelY: 255 },
        { id: 45, name: 'Manisa', d: 'M 140 170 L 168 162 L 190 175 L 192 195 L 178 210 L 155 212 L 138 200 L 135 185 Z', labelX: 165, labelY: 190 },
        { id: 48, name: 'Muğla', d: 'M 135 268 L 160 260 L 185 270 L 195 290 L 185 310 L 160 315 L 140 305 L 130 288 Z', labelX: 162, labelY: 290 },
        { id: 3, name: 'Afyonkarahisar', d: 'M 255 175 L 285 168 L 308 180 L 312 200 L 298 218 L 272 215 L 252 202 L 250 188 Z', labelX: 280, labelY: 195 },
        { id: 43, name: 'Kütahya', d: 'M 228 148 L 258 140 L 278 152 L 280 172 L 265 188 L 242 185 L 225 172 L 222 158 Z', labelX: 252, labelY: 168 },
        { id: 64, name: 'Uşak', d: 'M 210 200 L 235 195 L 252 205 L 250 222 L 238 235 L 218 232 L 205 218 Z', labelX: 230, labelY: 218 },

        // Akdeniz Region
        { id: 7, name: 'Antalya', d: 'M 245 290 L 280 282 L 310 292 L 325 315 L 315 340 L 285 348 L 255 338 L 240 318 L 238 302 Z', labelX: 280, labelY: 318 },
        { id: 1, name: 'Adana', d: 'M 455 280 L 485 270 L 510 282 L 520 305 L 508 325 L 482 330 L 458 320 L 448 300 Z', labelX: 483, labelY: 302 },
        { id: 33, name: 'Mersin', d: 'M 375 305 L 405 295 L 435 305 L 450 325 L 440 345 L 410 350 L 385 340 L 370 322 Z', labelX: 410, labelY: 325 },
        { id: 31, name: 'Hatay', d: 'M 515 310 L 535 300 L 548 312 L 550 335 L 542 355 L 525 362 L 510 350 L 508 330 Z', labelX: 530, labelY: 335 },
        { id: 46, name: 'K.Maraş', d: 'M 510 248 L 538 240 L 555 252 L 558 272 L 545 288 L 522 285 L 508 272 L 505 258 Z', labelX: 532, labelY: 265 },
        { id: 80, name: 'Osmaniye', d: 'M 492 275 L 512 268 L 525 278 L 522 295 L 510 305 L 495 300 L 488 288 Z', labelX: 508, labelY: 288 },
        { id: 15, name: 'Burdur', d: 'M 240 255 L 265 248 L 282 258 L 280 278 L 265 290 L 245 288 L 235 272 Z', labelX: 260, labelY: 272 },
        { id: 32, name: 'Isparta', d: 'M 268 228 L 295 220 L 315 232 L 318 252 L 305 268 L 280 265 L 265 252 L 262 238 Z', labelX: 292, labelY: 248 },

        // İç Anadolu Region
        { id: 6, name: 'Ankara', d: 'M 355 148 L 395 138 L 425 152 L 432 178 L 418 198 L 388 205 L 358 195 L 345 175 L 348 158 Z', labelX: 388, labelY: 172 },
        { id: 42, name: 'Konya', d: 'M 335 235 L 380 222 L 420 235 L 438 265 L 425 295 L 388 305 L 348 292 L 328 268 L 325 248 Z', labelX: 378, labelY: 265 },
        { id: 38, name: 'Kayseri', d: 'M 448 195 L 485 185 L 510 200 L 515 225 L 500 245 L 472 248 L 448 238 L 440 215 Z', labelX: 478, labelY: 220 },
        { id: 26, name: 'Eskişehir', d: 'M 298 140 L 335 132 L 358 145 L 360 168 L 345 185 L 318 188 L 295 178 L 290 158 Z', labelX: 328, labelY: 162 },
        { id: 58, name: 'Sivas', d: 'M 518 168 L 560 158 L 590 172 L 598 198 L 585 218 L 555 225 L 525 215 L 512 195 L 515 178 Z', labelX: 555, labelY: 195 },
        { id: 66, name: 'Yozgat', d: 'M 438 162 L 468 155 L 490 165 L 492 185 L 480 200 L 458 202 L 438 192 L 432 178 Z', labelX: 462, labelY: 180 },
        { id: 68, name: 'Aksaray', d: 'M 398 218 L 425 212 L 442 225 L 440 245 L 428 258 L 408 255 L 395 242 L 392 228 Z', labelX: 418, labelY: 238 },
        { id: 71, name: 'Kırıkkale', d: 'M 410 148 L 435 142 L 448 155 L 445 172 L 432 180 L 415 178 L 405 165 Z', labelX: 428, labelY: 162 },
        { id: 40, name: 'Kırşehir', d: 'M 420 185 L 445 178 L 458 190 L 455 208 L 442 218 L 425 215 L 415 202 Z', labelX: 438, labelY: 200 },
        { id: 50, name: 'Nevşehir', d: 'M 440 200 L 462 195 L 478 208 L 475 225 L 462 238 L 445 235 L 435 220 Z', labelX: 458, labelY: 218 },
        { id: 51, name: 'Niğde', d: 'M 442 248 L 468 242 L 485 255 L 482 275 L 468 288 L 448 285 L 438 272 L 435 258 Z', labelX: 462, labelY: 268 },
        { id: 70, name: 'Karaman', d: 'M 382 272 L 408 265 L 425 278 L 428 298 L 415 312 L 392 310 L 378 298 L 375 282 Z', labelX: 402, labelY: 290 },
        { id: 18, name: 'Çankırı', d: 'M 378 115 L 408 108 L 428 120 L 425 140 L 410 150 L 388 148 L 372 135 Z', labelX: 400, labelY: 130 },

        // Karadeniz Region
        { id: 61, name: 'Trabzon', d: 'M 618 98 L 648 90 L 668 100 L 670 118 L 655 130 L 632 128 L 615 118 Z', labelX: 642, labelY: 112 },
        { id: 55, name: 'Samsun', d: 'M 498 88 L 535 80 L 558 92 L 560 112 L 545 125 L 518 128 L 498 118 L 492 102 Z', labelX: 528, labelY: 105 },
        { id: 52, name: 'Ordu', d: 'M 558 85 L 585 78 L 605 90 L 608 108 L 595 120 L 572 118 L 555 108 L 552 95 Z', labelX: 580, labelY: 100 },
        { id: 28, name: 'Giresun', d: 'M 598 88 L 622 82 L 640 92 L 642 110 L 630 122 L 610 120 L 595 108 Z', labelX: 618, labelY: 105 },
        { id: 53, name: 'Rize', d: 'M 665 92 L 688 85 L 705 95 L 708 112 L 695 122 L 678 120 L 665 110 Z', labelX: 685, labelY: 105 },
        { id: 8, name: 'Artvin', d: 'M 700 82 L 722 75 L 738 88 L 740 108 L 728 120 L 710 118 L 698 105 Z', labelX: 718, labelY: 100 },
        { id: 29, name: 'Gümüşhane', d: 'M 638 118 L 665 112 L 682 125 L 680 145 L 665 155 L 645 152 L 632 140 Z', labelX: 658, labelY: 138 },
        { id: 69, name: 'Bayburt', d: 'M 672 112 L 695 105 L 710 118 L 712 138 L 698 148 L 680 145 L 668 132 Z', labelX: 690, labelY: 128 },
        { id: 60, name: 'Tokat', d: 'M 518 125 L 548 118 L 568 130 L 572 150 L 558 162 L 535 160 L 518 148 L 512 138 Z', labelX: 542, labelY: 142 },
        { id: 5, name: 'Amasya', d: 'M 488 112 L 515 105 L 530 118 L 528 138 L 515 148 L 498 145 L 485 132 Z', labelX: 508, labelY: 128 },
        { id: 19, name: 'Çorum', d: 'M 440 108 L 475 100 L 498 112 L 500 132 L 488 145 L 462 148 L 442 138 L 435 122 Z', labelX: 468, labelY: 125 },
        { id: 57, name: 'Sinop', d: 'M 468 70 L 498 62 L 518 72 L 520 88 L 508 100 L 488 98 L 472 88 L 465 78 Z', labelX: 492, labelY: 82 },
        { id: 37, name: 'Kastamonu', d: 'M 408 78 L 445 68 L 472 80 L 475 102 L 460 115 L 432 118 L 410 108 L 402 92 Z', labelX: 440, labelY: 95 },
        { id: 74, name: 'Bartın', d: 'M 370 72 L 395 65 L 410 78 L 408 95 L 395 105 L 378 102 L 368 90 Z', labelX: 390, labelY: 85 },
        { id: 67, name: 'Zonguldak', d: 'M 338 78 L 365 72 L 380 82 L 378 98 L 365 108 L 348 105 L 335 95 Z', labelX: 358, labelY: 92 },
        { id: 78, name: 'Karabük', d: 'M 365 92 L 388 85 L 402 98 L 400 115 L 388 125 L 370 122 L 362 108 Z', labelX: 382, labelY: 108 },
        { id: 14, name: 'Bolu', d: 'M 320 100 L 348 92 L 368 105 L 370 125 L 355 138 L 332 135 L 318 122 L 315 110 Z', labelX: 342, labelY: 118 },
        { id: 81, name: 'Düzce', d: 'M 308 88 L 330 82 L 342 92 L 340 108 L 328 118 L 312 115 L 305 102 Z', labelX: 322, labelY: 102 },

        // Doğu Anadolu Region
        { id: 25, name: 'Erzurum', d: 'M 650 148 L 700 138 L 730 155 L 735 185 L 718 205 L 685 210 L 655 198 L 645 175 L 648 158 Z', labelX: 690, labelY: 178 },
        { id: 65, name: 'Van', d: 'M 755 210 L 795 200 L 822 215 L 830 245 L 818 268 L 790 275 L 762 262 L 748 238 L 750 222 Z', labelX: 790, labelY: 240 },
        { id: 44, name: 'Malatya', d: 'M 550 218 L 585 210 L 610 225 L 615 248 L 600 265 L 572 268 L 548 255 L 542 238 Z', labelX: 578, labelY: 242 },
        { id: 23, name: 'Elazığ', d: 'M 578 192 L 612 185 L 632 198 L 635 218 L 620 232 L 595 228 L 575 218 L 572 205 Z', labelX: 605, labelY: 212 },
        { id: 24, name: 'Erzincan', d: 'M 598 158 L 638 148 L 660 162 L 662 185 L 648 200 L 620 205 L 598 195 L 592 175 Z', labelX: 628, labelY: 178 },
        { id: 62, name: 'Tunceli', d: 'M 610 202 L 640 195 L 658 208 L 655 228 L 642 242 L 620 238 L 608 225 L 605 212 Z', labelX: 632, labelY: 220 },
        { id: 12, name: 'Bingöl', d: 'M 640 200 L 668 192 L 688 205 L 690 228 L 678 242 L 655 238 L 638 225 Z', labelX: 665, labelY: 220 },
        { id: 49, name: 'Muş', d: 'M 688 210 L 718 202 L 738 215 L 740 238 L 728 252 L 705 248 L 688 235 Z', labelX: 712, labelY: 228 },
        { id: 13, name: 'Bitlis', d: 'M 725 228 L 755 220 L 772 235 L 770 255 L 758 268 L 738 265 L 722 252 Z', labelX: 748, labelY: 245 },
        { id: 30, name: 'Hakkari', d: 'M 800 260 L 828 252 L 848 265 L 850 290 L 838 305 L 815 302 L 798 288 L 795 272 Z', labelX: 822, labelY: 280 },
        { id: 4, name: 'Ağrı', d: 'M 748 168 L 785 158 L 812 172 L 818 198 L 805 215 L 778 218 L 752 205 L 742 188 Z', labelX: 780, labelY: 192 },
        { id: 36, name: 'Kars', d: 'M 730 135 L 765 125 L 790 140 L 795 165 L 780 180 L 752 178 L 730 165 L 725 148 Z', labelX: 760, labelY: 155 },
        { id: 76, name: 'Iğdır', d: 'M 798 152 L 825 145 L 842 158 L 845 178 L 832 192 L 812 188 L 798 175 Z', labelX: 820, labelY: 170 },
        { id: 75, name: 'Ardahan', d: 'M 738 102 L 768 95 L 788 108 L 790 128 L 775 142 L 752 140 L 735 128 L 732 115 Z', labelX: 762, labelY: 120 },

        // Güneydoğu Anadolu Region
        { id: 27, name: 'Gaziantep', d: 'M 535 268 L 565 260 L 585 272 L 588 292 L 575 308 L 552 305 L 535 295 L 530 280 Z', labelX: 558, labelY: 285 },
        { id: 63, name: 'Şanlıurfa', d: 'M 580 272 L 625 262 L 652 278 L 658 305 L 642 325 L 610 328 L 582 315 L 575 295 Z', labelX: 615, labelY: 298 },
        { id: 21, name: 'Diyarbakır', d: 'M 630 228 L 672 218 L 698 235 L 702 262 L 688 280 L 658 285 L 632 272 L 625 250 Z', labelX: 662, labelY: 255 },
        { id: 47, name: 'Mardin', d: 'M 660 280 L 700 272 L 722 288 L 725 310 L 712 325 L 685 328 L 662 315 L 655 298 Z', labelX: 690, labelY: 302 },
        { id: 72, name: 'Batman', d: 'M 702 252 L 728 245 L 745 258 L 742 278 L 728 290 L 708 288 L 698 272 Z', labelX: 720, labelY: 270 },
        { id: 56, name: 'Siirt', d: 'M 738 248 L 762 242 L 778 255 L 775 275 L 762 288 L 742 285 L 732 272 Z', labelX: 755, labelY: 268 },
        { id: 73, name: 'Şırnak', d: 'M 770 268 L 798 260 L 818 275 L 820 298 L 808 312 L 785 310 L 768 298 L 765 282 Z', labelX: 792, labelY: 290 },
        { id: 2, name: 'Adıyaman', d: 'M 555 240 L 582 232 L 602 245 L 605 265 L 592 280 L 568 278 L 552 265 L 548 252 Z', labelX: 578, labelY: 258 },
        { id: 79, name: 'Kilis', d: 'M 535 295 L 555 290 L 565 300 L 562 315 L 550 322 L 538 318 L 530 308 Z', labelX: 548, labelY: 308 },
    ],
};

// Initialize map data
TURKEY_MAP = TURKEY_MAP_DATA;

// ===== MAIN INIT =====
async function init() {
    console.log('[Kelime Fethi] v1.0 başlatılıyor...');

    // Load saved state
    loadSave();

    // Load game data
    await loadGameData();

    // Init systems
    SFX.init();
    Particles.init();

    // Init UI
    initVirtualKeyboard();
    initPhysicalKeyboard();
    initEventListeners();
    initRegionSelector();
    initSettings();

    // Render
    renderMap();
    updateUI();

    // Daily countdown timer
    setInterval(updateDailyCountdown, 1000);

    // Auto-save every 60 seconds
    setInterval(save, 60000);

    // Streak warning (FOMO / loss aversion)
    if (state.currentStreak > 0) {
        const today = getTodayStr();
        if (state.dailyDate !== today || !state.dailyComplete) {
            setTimeout(() => {
                showToast(`🔥 ${state.currentStreak} günlük serini kaybetme!`, 4000);
            }, 2000);
        }
    }

    // Show tutorial for first time
    if (!state.tutorialDone) {
        setTimeout(showTutorial, 500);
    }

    console.log('[Kelime Fethi] Hazır! ✅');
}

// Start when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
