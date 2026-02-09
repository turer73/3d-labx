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

            // Trigger city conquered animation on map
            if (state.activeCityId) {
                renderMap();
                const cityPath = document.getElementById(`city-${state.activeCityId}`);
                if (cityPath) {
                    cityPath.classList.add('city-just-conquered');
                    setTimeout(() => cityPath.classList.remove('city-just-conquered'), 1500);
                }
            }
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

function getCityRegion(cityId) {
    const city = CITIES.find(c => c.id === cityId);
    return city ? city.region : null;
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

        // Set region attribute for CSS styling
        const region = getCityRegion(pathData.id);
        if (region) {
            path.dataset.region = region;
        }

        // Set class and region-based fill color
        const conquered = isCityConquered(pathData.id);
        const available = isCityAvailable(pathData.id);

        if (conquered) {
            path.classList.add('city-conquered');
            // Use region color for conquered cities
            if (region && REGION_COLORS[region]) {
                path.style.fill = REGION_COLORS[region].conquered;
            }
        } else if (available) {
            path.classList.add('city-available');
            // Use lighter region color for available cities
            if (region && REGION_COLORS[region]) {
                path.style.fill = REGION_COLORS[region].base;
            }
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
                    <div class="region-bar" style="width:${pct}%;${REGION_COLORS[region.id] ? `background:${REGION_COLORS[region.id].conquered}` : ''}"></div>
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


// ===== REGION COLORS =====
const REGION_COLORS = {
    marmara:    { base: '#818cf8', conquered: '#6366f1', hover: '#a5b4fc' },
    ege:        { base: '#a78bfa', conquered: '#8b5cf6', hover: '#c4b5fd' },
    akdeniz:    { base: '#f472b6', conquered: '#ec4899', hover: '#f9a8d4' },
    'ic-anadolu': { base: '#fb923c', conquered: '#f97316', hover: '#fdba74' },
    karadeniz:  { base: '#2dd4bf', conquered: '#14b8a6', hover: '#5eead4' },
    dogu:       { base: '#38bdf8', conquered: '#0ea5e9', hover: '#7dd3fc' },
    guneydogu:  { base: '#facc15', conquered: '#eab308', hover: '#fde047' },
};

// ===== TURKEY MAP SVG DATA =====
// Detailed Turkey map paths for 81 provinces (from paintmaps.com SVG)
// Each province has: id (plate number), name, d (SVG path), labelX, labelY
const TURKEY_MAP_DATA = {
    viewBox: '0 0 900 600',
    paths: [

        // Marmara
        { id: 10, name: 'Balıkesir', d: 'M106.6,198.9l4.1,1.5L110,202l-4.9,2l-2.9-1.7l-0.3-2.2L106.6,198.9z M63.3,283.3l-2.3-5.6l-4.9-1.1l9.7-6.6 l-0.5-2l5.7-2.7l0.9-5.1l-1.9-0.7l-10.2,1.3L60,256l1.8-4.4l5.8,0.5l8.9-4.4l4.7-0.2l6.5,2l7.5-3.7l2.4-6.7l-1.4-2l2.7-7.1l-3.3-3.3 l6.7-4.7l0.5-3.1l9.6,0.2l4.4-3.6l-4.1-0.6l-4.3-6.6l3.4-1.8l9.1,2.5l2.7,1.8l-6,4l1.7,2l7.5-1.4l4.2,0.1l-5.1,5.6l2,4.4l-1.8,4 l2.3,6.2l3,3.3l1.3,6.1l11.2,9.2l3.5,0.6l2.2-1.5l1.4,6.1l2.9,2.8l5.9,0.1l2.3,1.9l-2.9,6.8l-0.8,4.1l-4,6.2l-6.6,2.7l-0.6,4.8 l-3.9-0.8l-4.2,1.9l-7.1,0.5l-3,2.4l-5.9,0.1l-2.1-5.3l-4.4-5.5l-5.1,0.1l2.1-4.4l-1-1.9l-9.6-1l-6.9-3.9l-3.5,1.6l-2.9-4.6 l-2.5-0.6l-11.1,5.8l-2.8,3.4L63.3,283.3z', labelX: 109, labelY: 246 },
        { id: 11, name: 'Bilecik', d: 'M201.2,317.4l-1,4.6l-2.8,2.7l-2.7,7.4l-5.7,1.1l-0.3,7l-3.2,1.7l-6.6-0.5l-3,3.5l-5.8,0.1l-3-2l-4.9,1.4 l-5.1-2.3l-4.1-3l2.7-3.3l1.1-4.6l-0.3-5.4l-2.2-3.9l8.5-7.2l2.5-2l5.3,2l6.2,0.5l8.4-1.5l2.1-5.8l5.3-1l6.8,2.1l2,2.5L201.2,317.4z', labelX: 177, labelY: 326 },
        { id: 16, name: 'Bursa', d: 'M206.6,208.9l0.2,1.3l0.4,1.3l-4.2,2.9l-2.3,6.3l1.3,4.8l-5.3,5.9l-1.4,8.6l3.3,4.5l0.6,3l-4.7,0.1l-5.5,0.6 l-4.5-2l-2.3,1.5l-3.9,10.2l-2.2,1.5l-1.5,6.5l-2.5,1.5l-8.2-1.3l-1.7-1.4l-2.3-1.9l-5.9-0.1l-2.9-2.8l-1.4-6.1l-2.2,1.5l-3.5-0.6 l-11.2-9.2l-1.3-6.1l-3-3.3l-2.3-6.2l1.8-4l-2-4.4l5.1-5.6l12.2,0.6l6.5,2.3l6-1.9l8,2.7l4.8-0.4l1.2-3l2.7-0.3l-3.6-2.9l-3.8,0.7 l0.2-6.3l4.4,0.7l6.5,3.3l2.8-0.4l2.9-2.9l2.7,0.6l5,0.8l11.2-3.2L206.6,208.9z', labelX: 167, labelY: 237 },
        { id: 17, name: 'Çanakkale', d: 'M33.4,241.6l1.8,0.7l-0.6,2.9l-3.9-2.4L33.4,241.6z M69.9,193.1v-0.2l6.3,1.1l-0.3,4.7L77,203l-12.7,5.3 l-3.3,5.4l-8.1,6.3l-4.5,2.1l1.2,2.8l-6.8,4.7l-3.3,0.3l5.2-7.8l0.6-3.6l-2.2-4l5.1-2l5.2-4l7.5-3.6l3.3,0.2l2.9-2.9l4.4-1.9 l-1.9-3.5L69.9,193.1z M22.6,219.5l6.9-1.4l2.5,1.3l-0.6,3.7l2.1,0.8l-11.1,2l-4.4-2.1L22.6,219.5z M59.9,260.8l-9.5,1l-4.4,2 l-2.9-0.6l-6.5,1.3l-3.4-1.2l2.2-7l1.8-1.5l1-4.6l-0.8-2.2l1.4-11.7l2.3-3.7l5.1-0.2l4-4.9l1-4.9l4.1-0.8l11.1-10.3l12.2,1.5 l3.8-3.3l9.2,0.4l1.1,5.1l4.9,3.2l5.3,0.7l-0.5,3.1l-6.7,4.7l3.3,3.3l-2.7,7.1l1.4,2l-2.4,6.7l-7.5,3.7l-6.5-2l-4.7,0.2l-8.9,4.4 l-5.8-0.5L60,256L59.9,260.8z', labelX: 60, labelY: 229 },
        { id: 22, name: 'Edirne', d: 'M69.9,192.9v0.2l-0.6,3.6l-7.6,0.6l-4.7,2l-2.5-1.4l-6.3,0.6l-9.9-1.4l-1.4-7.3l4.6-1.6l3.7-4.4l0.8-3l6.1-3.4 l-1.1-9.2l1.2-7.6l2.7-0.1l6.7-4.9l2.2,1.5l2.2-2.7l-0.8-13.8l-0.9,1.2l-4.6-3.7l0.6-1.5l-6-2.7l0.4-4.5l1.9-1.5l6.5,0.1l1.4-5.9 L68,120l4.8,0.8l4.4-0.5l1.6,12.4l0.1,5.6l-1.4,5.6l-5.3,10.9l1.1,2.8l0.2,9.1l-3.3,6.1l-2.6,7.4v4.8L69.9,192.9z', labelX: 58, labelY: 160 },
        { id: 34, name: 'İstanbul', d: 'M132.1,152.2L132.1,152.2l2.2-2.7l7.6,5.7l9.2,4.7l13,7l8.6,2.2l-1.3,3.8l2.1-2.3l4.5-1.6l16.6,4.2l10.5,2 l0.5,4.2l-1.3,2.9l-7.9,3.9l-1.2,2.8l-2.8-1.1l-3.3-4.8l-2.2-0.3l-8.9,7.4l-4.6-2.5l-4.9-4l-0.7-3l2.5-2.4l0.3-2.9l-4,6.9l-1.8-0.3 l-5.3,2.3l-3.3-1.2l-6.5-0.2l-0.7-5.2l-1.6,4.4l-3.3-2.7l-9.6-3.5h-2.6l-0.7-7.8l2.3-8.1L132.1,152.2z', labelX: 168, labelY: 170 },
        { id: 39, name: 'Kırklareli', d: 'M134.3,149.5l-2.1,2.7h-0.1L117,153l-9.1,1.9l-4,6.1l-5.4,2.3l-6.4-6.3L80,156.9l-6.6,1l-1.1-2.8l5.3-10.9 l1.4-5.6l-0.1-5.6l-1.6-12.4l4.4-1l3.9-4.2l6.5,1.4l4.4-1.7l5.8,7.3l5.2,4.6l2.9-2.9l4.9-0.5l2.7,1.6l1-2.9l8.9,1.8l0.9,4.8h-2.9 l-0.5,3.8l4.5,8.7l-0.3,1.8L134.3,149.5z', labelX: 103, labelY: 139 },
        { id: 41, name: 'Kocaeli', d: 'M205,175.4l11.9,1l6-3.7l6.8,2.5l-1.8,4.4l0.6,3l3.2,0.6l-1.2,5.7l-6.3-1.1l0.6,2.3l-2.9,3l-2.1,8.6l-1.8,3.6 l-8.4,3.4l-3,0.2l-5.9-2.4l-11.2,3.2l-5-0.8l0.5-2.1l0.2-5.2l3.3-2.1l2.5,2.2l8.5-1.6l7.4,0.8l0.3-2.4H200l-4.2-1.9h-10.4l-3.2,0.7 l-4.2-6.8l8.9-7.4l2.2,0.3l3.3,4.8l2.8,1.1l1.2-2.8l7.9-3.9l1.3-2.9L205,175.4z', labelX: 205, labelY: 191 },
        { id: 54, name: 'Sakarya', d: 'M207.1,211.4l2.6,5l3.3,3.4l3.8,1.4l6.1-1.5l5.3,0.4l3,3.3l5.6,0.7l0.6,2.5l4.1,7l-4.5,0.1l-3.7,2.8l-1.5,5.9 l-3.9,4.2l-4.6,0.8l-4.1,3.9l-0.6,5.9l-4.6,6.2l-8.4,1.5l-1.9-0.5l-8-5.7l-2.1-4.1l0.8-7.3l4.7-0.1l-0.6-3l-3.3-4.5l1.4-8.6l5.3-5.9 l-1.3-4.8l2.3-6.3L207.1,211.4z', labelX: 218, labelY: 238 },
        { id: 59, name: 'Tekirdağ', d: 'M131.6,176.1l-7.2,2l-2.5,3.6l-4.3-0.4l-5.3-2.3l-9.3,0.8l-2.5,2.5l-2.5,6.3l-4.3,3.9l-2.1,3.1l-5.1,3.9 l-5.8,0.7L77,203l-1.1-4.4l0.3-4.7l-6.3-1.1l-2.2-7.6v-4.8l2.6-7.4l3.3-6.1l-0.2-9.1l6.6-1l12.1,0.2l6.4,6.3l5.4-2.3l4-6.1l9.1-1.9 l15.1-0.8l1.1,8.1l-2.3,8.1L131.6,176.1z', labelX: 100, labelY: 178 },
        { id: 77, name: 'Yalova', d: 'M184.9,206.7l-0.5,2.1l-2.7-0.6l-2.9,2.9l-2.8,0.4l-6.5-3.3l-4.4-0.7l-0.2,6.3l-2.8-0.4l-6.1-3.3l0.9-1.8 l8.7-4.9l13-0.6l4.9-2.2l1.5,1.1L184.9,206.7z', labelX: 171, labelY: 207 },

        // Ege
        { id: 3, name: 'Afyonkarahisar', d: 'M205.2,371.7l-4.1-0.4l-3.7,1.2l-1.9-3.7l-6.1-2l0.2-5.9l16.2-11.7l0.7-5.3l-5.7-10l-6.2-1.7l2.7-7.4l2.8-2.7 l1-4.6l9.6-5.3l3.3-4.6l4.3-11.3l5.3-2.2l3.3-4.8l2.8,1.7l1.6,3.1l3.4,2.3l6.7-3l4.5-4l4.1,3.4l13.4-7.1l3,3.5l2.2,5.1l3.3,2.7 l5.8-0.5l5.2,0.6l-1.1,5.3l1.8,4.2l-4.9,8.4l-0.7,6.7l-7.5,8.7l-8,5.2l-6.8-5.5l-8.9,7.8l-5.7,5.7l-5.4,1.5l-6.1,3.2l-4.7,4.6 l-10.2,8.4l-0.7,6.1l-1.6,2.8L205.2,371.7z', labelX: 237, labelY: 329 },
        { id: 9, name: 'Aydın', d: 'M140,349.9l6.1,0.3l3.4,4.6l0.9,7.2l-1.7,3.4l2.5,4.6l2.9,0.7l0.2,2.9l-3.2,1l-4.8,5.2l-6.8,0.1l-1,2.1l1.9,4.6 l-5.9-1.2l-6.1-4.6l-3.3-1L119,386l-8.8-0.1l-1.8-1.2l-6.3-0.2l-3.1-2.3l-6.9-2.8l-3,0.7l-4,7.1l-3.5,3.3l-3.9,0.6l-1.5-1.3L77,383 l-2.1,0.5l1.9-7.5l-8.8-4.6l5.3-1.1l5.8-2.8l1-8.4l6.8-1.1l5.7-3.4l2.4-0.2l11.1,1.5l10.7-2.2l8.8,0.3L140,349.9z', labelX: 111, labelY: 371 },
        { id: 20, name: 'Denizli', d: 'M194.6,332.1l6.2,1.7l5.7,10l-0.7,5.3l-16.2,11.7l-0.2,5.9l6.1,2l1.9,3.7l-7.2,4.7l-1.2,2.5l-5.9,2.9l0.2,5.5 l1.6,4.2l-8.3,13.4l-1.4,6.2l-2.2,1.6l-0.5,3.8l-3.2,3.5l-8.1-4.2l-1-7.3l-6-4.5l-1.8-3l-3.4-0.6l-3.1-7.4l-4.9-1.6l-0.6-5.5 l-1.9-4.6l1-2.1l6.8-0.1l4.8-5.2l3.2-1l-0.2-2.9l-2.9-0.7l-2.5-4.6l1.7-3.4l-0.9-7.2l-3.4-4.6l4-0.6l2.7-6.8l4.2-0.8l5.1,2.3 l4.9-1.4l3,2l5.8-0.1l3-3.5l6.6,0.5l3.2-1.7l0.3-7L194.6,332.1z', labelX: 173, labelY: 376 },
        { id: 35, name: 'İzmir', d: 'M146.1,350.2l-6.1-0.3l-4.7-10.9l-5.4-2.5l-7.4,0.7l-2.8-5.1l-7-1.2l-2,3.7l-2.3,0.4l-2.9-5.6l-6.4-4.2 l-1.9-4.7l-9.1-0.8l-2.5-2.5l-1-4l-2.8-3.2l4.1-6.4l1.1-4.4l5.4-2.5l4.4-3.6l0.6-3l-2.2-5.4L92.7,273l3.5-1.6l6.9,3.9l9.6,1l1,1.9 l-2.1,4.4l5.1-0.1l4.4,5.5l2.1,5.3l5.9-0.1l3-2.4l7.1-0.5l4.2-1.9l3.9,0.8l3,3.3l7.9,2.9l3.3,6.6l-0.6,3.6l2.2,5.5l-0.4,3.6 l-8.5,7.2l2.2,3.9l0.3,5.4l-1.1,4.6L153,339l4.1,3l-4.2,0.8l-2.7,6.8L146.1,350.2z', labelX: 122, labelY: 311 },
        { id: 43, name: 'Kütahya', d: 'M162.8,314.5l0.4-3.6l-2.2-5.5l0.6-3.6l-3.3-6.6l-7.9-2.9l-3-3.3l0.6-4.8l6.6-2.7l4-6.2l0.8-4.1l2.9-6.8 l1.7,1.4l8.2,1.3l2.5-1.5l1.5-6.5l2.2-1.5l3.9-10.2l2.3-1.5l4.5,2l5.5-0.6l-0.8,7.3l2.1,4.1l8,5.7l1.9,0.5l8.4-1.5l6.4,7.8l1.5,8 l4.3,6.2l0.7,3.7l-3.3,4.8l-5.3,2.2l-4.3,11.3l-3.3,4.6l-9.6,5.3l0.2-5.9l-2-2.5l-6.8-2.1l-5.3,1l-2.1,5.8l-8.4,1.5l-6.2-0.5l-5.3-2 L162.8,314.5z', labelX: 187, labelY: 282 },
        { id: 45, name: 'Manisa', d: 'M80.3,359.2l-0.6-5.8l-5.6-0.7l-2.2-2.9l-5.2-1.9l-3.9,1.4l-1.4-6.3l-2.6-4.4l-5.7,0.4l-2.5,5.4l-6.2-6.6 l-9.2-4.2l3.9-3.4l2.4,1.4l5-2.5l-0.9-3.6l2.8-0.1l-4.7-3.6l-1.9-8l3.2-3.2l4,1.9l5.1,8.1l-1.3,6.1l2.4,6.5l0.2-4.6l2.7-2.5l1.6,4 l7.2-0.3L71,328l3.3,0.8l3.2-3.2l-6-0.5l-4,1.4l-1.8-4.9l-2.4-2l0.8-2.9l-4.2-1.5l-1.1-6.1l4.6-1.7l3,1.4l1.7-1.5l-1-3.3l7.7-3.5 l-0.8-3.2l-2.7,1l-2.5-1.3l-3.2,1.1l-2.1-2l0.3-4.9l3.6-1.9l-4.3-6.1l10-6.4l2.8-3.4l11.1-5.8l2.5,0.6l2.9,4.6l2.5,11.7l2.2,5.4 l-0.6,3l-4.4,3.6l-5.4,2.5l-1.1,4.4l-4.1,6.4l2.8,3.2l1,4l2.5,2.5l9.1,0.8l1.9,4.7l6.4,4.2l2.9,5.6l2.3-0.4l2-3.7l7,1.2l2.8,5.1 l7.4-0.7l5.4,2.5l4.7,10.9l-14.3,4.2l-8.8-0.3l-10.7,2.2l-11.1-1.5l-2.4,0.2l-5.7,3.4L80.3,359.2z', labelX: 87, labelY: 313 },
        { id: 48, name: 'Muğla', d: 'M167.5,456.5l-7.4-5.9l1.6-1.2l-1.4-4l1-4.1l-3.7,0.3l0.5-4.6l3.5-0.4l-0.9-1.9l-7.1-5.3l-3.7,3.3l-1,3.1 l-6.4-4.1l-3.7,0.1l-0.6-6.8l-6.5-0.4l-0.6-3.8l-3.3,1.6l2.2,1.6l-1.4,2.1l-5.5-3.8l-1.8,2.1l2.2,4.2l-6.1,3.8l-2.5,3.8l-5.7,2.2 l-1.4-2.5l3.4,0.2l2.7-2.3l-5.3-3.1l6.8-1.2l-3-2.8l-6.1,1.1l-8.4-1.7l-2.5,1.9l-0.8,3.9l-5.3-1.9l-4.3,1l-4.2-1.6l4.7-3.8l7-0.1 l0.7-2.1l6.2,1.5l1.9-1.4l8.9,1.1l2.9-0.4l-2.1-3l2.3-0.6l-1.1-3.4l7.2-0.3l1.4-3.5l5.5-1.5l-1.1-1.2l-9.1,0.5l-10.2-0.1l-5,1.6 l-2.7-0.8l-7.4,1.5l-5.5-3.5l-5.1,0.4l-1.1,3.2l-2.1-0.4l-1.2-5.8l4.5-3.3l3-0.1l3.9,2.3l3.8-2l-1-3.7l3.7-0.1l0.6-4.4l-7.1,0.8 l1.5-4.2h-4.3l2.2-3.8l-1.5-1.4l3.9-7.1l3-0.7l6.9,2.8l3.1,2.3l6.3,0.2l1.8,1.2l8.8,0.1l6.2-6.2l3.3,1l6.1,4.6l5.9,1.2l0.6,5.5 l4.9,1.6l3.1,7.4l3.4,0.6l1.8,3l6,4.5l1,7.3l8.1,4.2l3.2-3.5l0.5-3.8l2.2-1.6l0.1,6.4l1.8,0.6l2.3-2.7l5.6-0.5l3.7,5.5l-5.4,11.5 l-0.4,6.7l-4.5,3.5l-0.4,3l-5.4,0.8l-2.9,8L167.5,456.5z', labelX: 132, labelY: 418 },
        { id: 64, name: 'Uşak', d: 'M332.3,136.7l5.4-1.3l3.5-2l6.8-2.3l6.8-3.6l9.2,0.5l3.1,0.8l11.1,1.1l5.6-0.5l9.1,1.2l0.3,3.3l-3.3,8l2.8,1.1 l11.2,1.1l2.9,0.7l2.4,3.2l-1.4,3.9l-2.5,2.2l-1.2,4.2l0.8,2.2l-0.2,7.5l-2.2,0.6l-2.6,5.4l-3,3.1l-3.3,6.9l3.2,4l-1,2.9l-10,3.6 l-3.6-0.4l-5.4-3.3l-1.7-2.8l2.9-5l-2.6-2l-7,3.8l-3.3,0.6l-6.2,3.4l-7.6-5.1l-5.6-0.7l-1.6-1.8l-1.4-2.1l-4.7-1.4l-0.5-8.2l4.2-5 l4.3-1l-2.5-8l-3.1-2.3l-5.8,1.5l-1.4-1.7l-0.4-4l2.7-2l-2.7-6.9L332.3,136.7z', labelX: 371, labelY: 161 },

        // Akdeniz
        { id: 1, name: 'Adana', d: 'M481.5,416.2l-2-0.6l-4.5,5.1l0.8,3.6l-5.7,5.8l-5.6,0.8l-5,3.7l4.2-0.7l-1.4,6.2l-4,1.2l-1.5-1.4l-7.5,4.2 l-14.3-8.5l-5.1-1.7l6.1-4.1l-0.9-9.7l1.3-3.7l-1.8-1.8l-5-1.4l-1.4-9.2l-2.2-1.7l-3.3-6.6l0.1-4l3.1-5.6l-1.8-7.3l1.4-2.2l4.6,0.8 l4.5-0.8l5.8-6.2l7.9,0.4l9.8,3.1l2.4-1.3l-1.3-10.6l16.5-12.2l5.3-9.2l1.8-5l5.3-3.7l3.7-1.2l2.4,1l5,7.6l-3.7,6.1l-3.5,18 l1.9,10.4l-3.5,3.8l-7.7,0.5l-2,3.6l-5.3,13.7l0.2,4.5l1.5,4.2l3.9,0.3l2.5,5.1L481.5,416.2z', labelX: 461, labelY: 387 },
        { id: 7, name: 'Antalya', d: 'M315.8,437.8l3.4,8.2l5.6,5.5l-0.2,9.8l-3.6,10.2l-2.7-0.5l-6.8-4.4l-3.8-4.4l-0.2-2l-3.9-4.1l-4.1-7.5 l-3.5-3.3l-9.6-2.9l-3.7-3.1l-15.1-7.2l-3-2.8l-18.4-3.1l-7.6,0.2l-4.1-2.5l-4,3l-1.5,3.3l-0.8,9.4l0.4,5.3l-2.3,2.1l-2.2,5.1l2,3.5 l-5.8,7.8l0.1-2.4l-6.6-3.7l-4.5,0.4l-0.7,2.5l-7.3,1.9h-3.6l-8.2,5.1l1.8-2h-3.2l-1.7,1.9l-3.1-4.9l-4.9-0.4l-3.7-3.5l-2.6,1.8 l-4.3-3.6l2.2-1.7l2.9-8l5.4-0.8l0.2-3.2l4.5-3.5l0.4-6.7l5.4-11.5l2.6-0.7l4.4-6.1l0.9-4.4l2.6-3.4l8.4-4l9.7-3.2l2.7,0.5l3.8,4 l15.8,0.1l3.7-5.4l3.3-2.8l4,1.7l7.2-1.9l4.5-2.3l2.5,0.4l3.7,3.9l6.5,1l11.7,2.7l9.9,7.6l4.3,5.4l5.7,5.2l3.3,1.7l-0.9,5.9l5.5,1.4 l1.7,5.3L315.8,437.8z', labelX: 246, labelY: 432 },
        { id: 15, name: 'Burdur', d: 'M197.4,372.4l3.7-1.2l4.1,0.4l1.4,3.7l3.4-0.1l10-7.2l7.8,8.2l6.1,0.7l2.6,1.8l2.6,7.4l3.8,6.4l2.1,0.2l1.6,3.1 l-3.3,2.8l-3.7,5.4l-15.8-0.1l-3.8-4l-2.7-0.5l-9.7,3.2l-8.4,4l-2.6,3.4l-0.9,4.4l-4.4,6.1l-2.6,0.7l-3.7-5.5l-5.6,0.5l-2.3,2.7 l-1.8-0.6l-0.1-6.4l1.4-6.2l8.3-13.4l-1.6-4.2l-0.2-5.5l5.9-2.9l1.2-2.5L197.4,372.4z', labelX: 211, labelY: 395 },
        { id: 31, name: 'Hatay', d: 'M499.6,418.3l6.8,4.5l2.9,3l-2.4,4.8l-1.3,7.4v5.1l-1.3,2.2l2.7,9.8l2.3,0.4l1.5,5l-7.7,0.4l-2.2,1.7l-3.7-1.6 l-0.6,3.6l0.3,10.1h-3.7l-0.3,2.1l-3.3,0.5l-2.5,7.8l-6.9-3.1l-0.7-3l-3.2,0.6l2.9-5.9l-1.4-3.9l-7.2-11l-0.6-2.2l3.3-3.2l2.5-4.5 l5.3-4.8l6.9-4.7l1.1-3.1l-1.5-8.4l-6.2-6.6l-3.4,0.3l-2.3,2.5l-0.8-3.6l4.5-5.1l2,0.6l10.1-0.1l3.3,2.7L499.6,418.3z', labelX: 490, labelY: 450 },
        { id: 32, name: 'Isparta', d: 'M264.7,393.8l-2.5-0.4l-4.5,2.3l-7.2,1.9l-4-1.7l-1.6-3.1l-2.1-0.2l-3.8-6.4l-2.6-7.4l-2.6-1.8l-6.1-0.7 l-7.8-8.2l-10,7.2l-3.4,0.1l-1.4-3.7l6.8-1.7l1.6-2.8l0.7-6.1l10.2-8.4l4.7-4.6l6.1-3.2l5.4-1.5l5.7-5.7l8.9-7.8l6.8,5.5l1.2,4.2 l6.2,6.7l8.8,7.9l-0.3,1.9l-7.6,3.8l-1,3.8l1,9.1l-2.2,5.7l-3.5,2.3l1.7,5.9L264.7,393.8z', labelX: 242, labelY: 364 },
        { id: 33, name: 'Mersin', d: 'M430,433.9l-7.6-5l-3.6,0.1l-6.3,2.9l-6.4,6.2l-6.4,4.5l-4.5,6.7l-4.6,3.5l0.1,4.9l-3.6,1.6l-1.8,5.2l-1.4-4.5 l-2.8-1.4l-3.3,4.9l-2.6,1.1l-2.6,4.1l-1.8-2.9l-4.4,3.8l-4.4-1.8l-3.3,1.2l-11.7,0.3l-2.2,3L338,471l-6.5,4.5l-6.1-1.2l-4.6-2.8 l3.6-10.2l0.2-9.8l8.8,0.3l5.4-1.8l4.3-0.1l2.3-5.1l4.8,1.2l1.2-1.6l-3.3-3.4l-5.4-3.1l-2.9-7.6l5.9-2.3l2.8,1.8l1.5-4.2l7.9-5.9 l7.7-1.1l3.6-1.5l5.4,0.1l6.1-1.7l4.4-3.4l8.4-2.3l2.8-2.8l6.5-2.9l6.6-4.2l0.5-1.8l3.5-0.2l6.1-2.9l3.2,0.7l3.3,6.6l2.2,1.7 l1.4,9.2l5,1.4l1.8,1.8l-1.3,3.7l0.9,9.7L430,433.9z', labelX: 379, labelY: 435 },
        { id: 46, name: 'Kahramanmaraş', d: 'M548.4,366.1l-6.1,7.6l1.8,6.1l7.9,3.7l-0.1,6.1L550,391l-5.7,0.6l-14.2,5.1l-4,4.7l-3.6-1.1l-1.5-5.1l-2.2-1.3 l-2.1,3l-5.4,2.9l-2.2-2.9l-6-3.7L492,396l-1.9-2.2l-2.2-6.8l2.5-5l-0.2-4.5l3.5-3.8l-1.9-10.4l3.5-18l3.7-6.1l6.2-8.3l2.6-7.2 l1.4-1.1l5.9-1.7l8.2,1.7l10-1.3l-2.4,4.6l0.6,3.4l3.3-0.6l6.8,1.2l5.9,3.2l6.8,2.2l2.4,3.8l-2.5,10.9l-2.4,3.9l-1.9,8.7 L548.4,366.1z', labelX: 522, labelY: 361 },
        { id: 80, name: 'Osmaniye', d: 'M572.4,422.3l-9.3,4.9l-7.6,2l-5.9,3.7l-4.1-3.4l-7.9-3.8l-1.4,1l-6-6.1l-6.8-2.8l-1.6-3.2l-3,0.4l-0.3,3.9 l-6.8,4.1l-2.5,2.5l-2.9-3l-6.8-4.5l5.7-8.1l2.3-5.2l3.7-5.2l5.4-2.9l2.1-3l2.2,1.3l1.5,5.1l3.6,1.1l4-4.7l14.2-5.1l5.7-0.6l1.9-1.4 l0.1-6.1l10-1.5l5.4,1.8l3.8,3l-3,0.7l-3.8,5.1l-1.8,5l1.8,10.9l2.5,1.9l2.5-0.5L569,413l2,1.9L572.4,422.3z', labelX: 536, labelY: 407 },

        // İç Anadolu
        { id: 6, name: 'Ankara', d: 'M361.8,323.5l-4.5-8.9l0.3-13.1l-2.4-5.6l-9.6-5.9h-1.9l-2.4,6.9l-6.6-3.1l-8.3,7.1l-3.3-1.4l-5.5,3.4l-8.8-3.8 l-6.9,1.6l-7.9-5.9l-3.9-2.1l6.2-3.5l2-2.4l-2.6-4.4l0.5-8.5l-1.9-5.2l-2.2-2l-2.4-9.1l1.8-2l-1.5-3.7l-2.8-1l-2.3-7.8l-13.1-0.2 L270,241l-6.2-0.2l-2.5,1.9l-4.8-1.5l-4.2,1.7l-2.9-0.2l-0.6-4.7l-1.8-2.5l2.8-3.6l3.7-2l2.9-9.8l7.9,3.9l7.4-0.6l1.4,1.6l5,1.5 l4-1.5h7.2l11.9-3.4l3.7-1.9l6.1,1l3.6-1.8l3.6-5.3l-1.7-4.7l0.2-3.1l2.8-1.9l6.9,0.5l12.7,6.1l3.7,5.4l5.7,4l1.4,3.5l2.9,2.2 l3.2-0.3l2.3-3.4l8.7,3.2l-1.1,8.1l-0.2,10.7l-8.4,2l-1.9,5l-2.4,9.9l1.1,4.9l4.8,6.6l1.8,8.2l3.6,7l1,3.3l8.7,5.8l8.9,4.2l-0.3,1.9 l-1.4,3.9l1.8,4.8l-0.1,3.4l-5.4,4.6l-4.1-0.1L361.8,323.5z', labelX: 315, labelY: 264 },
        { id: 18, name: 'Çankırı', d: 'M319.4,203.7l0.7-3.1l0.2-1.7l4.5-2.1l5.2-4.1l3.7-4.8l4.2,0.5l4.1-2.3l1.9-4.8l1.6,1.8l5.6,0.7l7.6,5.1 l6.2-3.4l3.3-0.6l7-3.8l2.6,2l-2.9,5l1.7,2.8l5.4,3.3l3.6,0.4l2.2,3.6l-1.4,4.6l2.2,10.9l2.7,6.2l-2.9,6.7l-5.1,2.7l-4.1-0.4 l-12.1-3.8l-8.7-3.2l-2.3,3.4l-3.2,0.3l-2.9-2.2l-1.4-3.5l-5.7-4l-3.7-5.4l-12.7-6.1L319.4,203.7z', labelX: 355, labelY: 205 },
        { id: 26, name: 'Eskişehir', d: 'M241.4,233.7l2.6,1.1l2.9,0.5l1.8,2.5l0.6,4.7l2.9,0.2l4.2-1.7l4.8,1.5l2.5-1.9l6.2,0.2l1.8,1.9l13.1,0.2 l2.3,7.8l2.8,1l1.5,3.7l-1.8,2l2.4,9.1l2.2,2l1.9,5.2l-0.5,8.5l2.6,4.4l-2,2.4l-6.2,3.5l-1.2,4.2l-6.1,0.2l-5.2-0.6l-5.8,0.5 l-3.3-2.7l-2.2-5.1l-3-3.5l-13.4,7.1l-4.1-3.4l-4.5,4l-6.7,3l-3.4-2.3l-1.6-3.1l-2.8-1.7l-0.7-3.7l-4.3-6.2l-1.5-8l-6.4-7.8l4.6-6.2 l0.6-5.9l4.1-3.9l4.6-0.8l3.9-4.2l1.5-5.9l3.7-2.8H241.4z', labelX: 256, labelY: 265 },
        { id: 38, name: 'Kayseri', d: 'M509.4,322.6l-1.4,1.1l-2.6,7.2l-6.2,8.3l-5-7.6l-2.4-1l-3.7,1.2l-5.3,3.7l-1.8,5l-5.3,9.2l-16.5,12.2l1.3,10.6 l-2.4,1.3l-9.8-3.1l-7.9-0.4l0.9-6.6l2.1-1.4l-1.5-4l0.1-5l-1.3-3.8l-7.3,0.1l-2.7-2.9l-3.3-8.7l6.8-11l-0.2-8.1l-5.4-8.2l3.1-11.3 l10.2,1.4l6.9-4.1l14.2-9.9l3.6-5.4l4.5,1.2l8.7,5.8l4.5,0.5l3.3-1.4l7.4,0.7l4.5,2.4l4-1.6l8,0.3l3.7,1.8l1.8,5.1l-3.3,10 L509.4,322.6z', labelX: 472, labelY: 328 },
        { id: 40, name: 'Kırşehir', d: 'M396.2,306.7l-6.1,1.7l-2.4-3.9l-5.3-1.9l0.3-1.9l-8.9-4.2l-8.7-5.8l-1-3.3l4.9-8.8l7.2-5.9l3-5l1.9-5.9 l7.1-6.9l4.1,1.7l4.6,4.7l5.6,0.6l1.8,3.7l6.2,7.5l4.2,1.6l3.2,4.4l-6.3,0.4l1.8,8.1l-0.5,3.7l2.4,4.7l-1.8,2.3l-10.5,5.3l-1,3.1 l0.8,3.9l-1.8,0.5L396.2,306.7z', labelX: 391, labelY: 283 },
        { id: 42, name: 'Konya', d: 'M282.8,297l6.1-0.2l1.2-4.2l3.9,2.1l7.9,5.9l6.9-1.6l8.8,3.8l5.5-3.4l3.3,1.4l8.3-7.1l6.6,3.1l2.4-6.9h1.9 l9.6,5.9l2.4,5.6l-0.3,13.1l4.5,8.9l-4.4,6.6l-4.3,14.2l-0.3,4.7l2.8,5.6l1,4.6l4.9,5.5l7.4-1.1l10.6-0.4l10.5-3.2l3.3,0.4l2.2,5.3 l4.3,2l6.7,9l0.6,3.4l-2.8,5.7l-0.2,4.4l5.7,7.8l-0.5,1.8l-6.6,4.2l-6.5,2.9l-2.8,2.8l-4.3-7.5l-11.7-12.5l-1.3-7.4l-6.4-1l-5.6,6.3 l-4.7,1.7l-13.9,1.4l-4.3,1.7l-7.8,8.8l-9.9,13.4l-0.9,5.8l5.5,1.6l0.6,3.3l-8,8.7l-5.2,3.9l0.3-3.9l-1.7-5.3l-5.5-1.4l0.9-5.9 l-3.3-1.7l-5.7-5.2l-4.3-5.4l-9.9-7.6l-11.7-2.7l-6.5-1l-3.7-3.9l1.8-6.7l-1.7-5.9l3.5-2.3l2.2-5.7l-1-9.1l1-3.8l7.6-3.8l0.3-1.9 l-8.8-7.9l-6.2-6.7l-1.2-4.2l8-5.2l7.5-8.7l0.7-6.7l4.9-8.4l-1.8-4.2L282.8,297z', labelX: 336, labelY: 364 },
        { id: 50, name: 'Nevşehir', d: 'M431.5,299.5l-3.1,11.3l5.4,8.2l0.2,8.1l-6.8,11l-4.7,1.8l-5.5-3.1l-9,1.1l-6-4.8l0.8-8.4h-2.9l-4.3-1.9 l-0.7-2.9l2.2-5.6l-1.5-5.2l0.5-2.3l4.9,4.2l1.8-0.5l-0.8-3.9l1-3.1l10.5-5.3l1.8-2.3l-2.4-4.7l0.5-3.7l-1.8-8.1l6.3-0.4l5.6,5.8 l1.6,4l3.6,2.2L431.5,299.5z', labelX: 414, labelY: 309 },
        { id: 51, name: 'Niğde', d: 'M393.5,360.4l14.7-22.6l9-1.1l5.5,3.1l4.7-1.8l3.3,8.7l2.7,2.9l7.3-0.1l1.3,3.8l-0.1,5l1.5,4l-2.1,1.4l-0.9,6.6 l-5.8,6.2l-4.5,0.8l-4.6-0.8l-1.4,2.2l1.8,7.3l-3.1,5.6l-0.1,4l-3.2-0.7l-6.1,2.9L410,398l-5.7-7.8l0.2-4.4l2.8-5.7l-0.6-3.4l-6.7-9 l-4.3-2L393.5,360.4z', labelX: 418, labelY: 367 },
        { id: 58, name: 'Sivas', d: 'M543.8,212.6l2.7,4.6l5,2.2l4-4.1l4.5-0.7l0.1-4l6.5-2.9l6.2,19.3l8.2,4.6l4.5-1.4l9.2,3.1l-0.7,5.3l-4.1-0.1 l-4.3,2.2l-4.3-1.7l-1.9,1.4l-0.9,6.7l6.2-1.3l0.6,2.7l-3.3,1.3l-2.9,5.1l-0.5,10.3l4.3,3.6l-3.3,4.4l1.8,10.3l-1.2,3.6l-6.5,4 l-12.5,2.1l-6.3,4.1l-3.7,1l-3.8-1.7l-2.9,3l2.5,7.8l-3.7,5.8l-2.9,1.8l-4.3,5.1l-2.6,1.4l-10,1.3l-8.2-1.7l-5.9,1.7l4.1-16.2 l3.3-10l-1.8-5.1l-3.7-1.8l-8-0.3l-4,1.6l-4.5-2.4l-7.4-0.7l-3.3,1.4l-4.5-0.5l-8.7-5.8l-4.5-1.2l3.6-3.6l5.1-8.3l6.8-6.6l1.2-4.8 l-4.5-7.1l-1.4-4.2l10.2-2.4l7.2-0.7l7.8-4.2l2.5-9.1l3.2-1.7l5.1,0.4l7.2-2.5l11.4-1.5l7.5-3.7L543.8,212.6z', labelX: 531, labelY: 265 },
        { id: 66, name: 'Yozgat', d: 'M388.4,254.7l-0.4-2.4l-0.6-2.3l2.5-1.3l6.9-1l8.4-3.4l6.8,1.1l8-1.3l6.5-3.4l5.8,0.7l4.5-3.8l0.4-6.7l6-1.1 l1.6,1.9l6.5,0.5l6.7,5.6l7.6,0.2l7.7-2.2l1.9,1.7l-0.2,5.6l2.3,3.6l1.4,4.2l4.5,7.1l-1.2,4.8l-6.8,6.6l-5.1,8.3l-3.6,3.6l-3.6,5.4 l-14.2,9.9l-6.9,4.1l-10.2-1.4l-2.6-8.5l-3.6-2.2l-1.6-4l-5.6-5.8l-3.2-4.4l-4.2-1.6l-6.2-7.5l-1.8-3.7l-5.6-0.6l-4.6-4.7 L388.4,254.7z', labelX: 435, labelY: 265 },
        { id: 68, name: 'Aksaray', d: 'M408.1,337.8l-14.7,22.6l-3.3-0.4l-10.5,3.2l-10.6,0.4l-7.4,1.1l-4.9-5.5l-1-4.6l-2.8-5.6l0.3-4.7l4.3-14.2 l4.4-6.6l11.5-4.4l4.1,0.1l5.4-4.6l0.1-3.4l-1.8-4.8l1.4-3.9l5.3,1.9l2.4,3.9l6.1-1.7l-0.5,2.3l1.5,5.2l-2.2,5.6l0.7,2.9l4.3,1.9 h2.9l-0.8,8.4L408.1,337.8z', labelX: 381, labelY: 334 },
        { id: 70, name: 'Karaman', d: 'M324.8,451.5l-5.6-5.5l-3.4-8.2l5.2-3.9l8-8.7l-0.6-3.3l-5.5-1.6l0.9-5.8l9.9-13.4l7.8-8.8l4.3-1.7l13.9-1.4 l4.7-1.7l5.6-6.3l6.4,1l1.3,7.4l11.7,12.5l4.3,7.5l-8.4,2.3l-4.4,3.4l-6.1,1.7l-5.4-0.1l-3.6,1.5l-7.7,1.1l-7.9,5.9l-1.5,4.2 l-2.8-1.8l-5.9,2.3l2.9,7.6l5.4,3.1l3.3,3.4l-1.2,1.6l-4.8-1.2l-2.3,5.1L339,450l-5.4,1.8L324.8,451.5z', labelX: 355, labelY: 417 },
        { id: 71, name: 'Kırıkkale', d: 'M383.3,229.2l2.3,6.8l3,2.1l0.6,4.9l-2,3.9l0.1,3l0.6,2.3l0.4,2.4l-7.1,6.9l-1.9,5.9l-3,5l-7.2,5.9l-4.9,8.8 l-3.6-7l-1.8-8.2l-4.8-6.6l-1.1-4.9l2.4-9.9l1.9-5l8.4-2l0.2-10.7l1.1-8.1l12.1,3.8L383.3,229.2z', labelX: 371, labelY: 256 },

        // Karadeniz
        { id: 5, name: 'Amasya', d: 'M451.2,232.3l-6.5-0.5l-1.6-1.9l0.7-6.9l3.7-5.9l0.8-6.4l-1.2-2.5l-5.6-2.4l-8.7-2l-3.5-7.3l0.6-9.7l1.6-6.1 l13.5,3.5l2.7-0.6l7.9,5.5l2.9,3l10.8-0.2l3.4,1.5l5.3-3.3l1.9-5.1l1.7-1.2l4.2,4.4l4.8,3.2l-0.8,3.4l3.3,3.8l-3.9,9.2l-3.5,1.1 l-0.2,2.9l-7.5,5l-5.7-2.8l-7.2-0.4l-6.5,11.6l-4.7,2L451.2,232.3z', labelX: 461, labelY: 207 },
        { id: 8, name: 'Artvin', d: 'M695.5,152.2l3.4-3.4l4.4-2l1.7-4.4l3.2-4l4.8,1.5l3.3-0.8l5.1,3.4l5.3-5.4l3.3,0.8l5.9-1.5l13.1,2.7l1.5,5.6 l3.8,7.9l-0.7,4l-3.4,2.3l-3.3,4.6l-2.2,5.8l-11,1.9l-2.7,2.2l0.2,4.9l-2.5,4.5l-0.4,5l-1.7,3.2l-7.5-2.3l-3.3,1.3l-7.3,4.8 l-3.3-2.3l0.6-9.1l-7.1-0.7l-3.6-1.6l0.4-2.4l9.4-13.9l-6.2-5.1L695.5,152.2z', labelX: 725, labelY: 166 },
        { id: 14, name: 'Bolu', d: 'M320.3,198.9l-0.2,1.7l-0.7,3.1l-2.8,1.9l-0.2,3.1l1.7,4.7l-3.6,5.3l-3.6,1.8l-6.1-1l-3.7,1.9l-11.9,3.4H282 l-4,1.5l-5-1.5l-1.4-1.6l-7.4,0.6l-7.9-3.9l-2.9,9.8l-3.7,2l-2.8,3.6l-2.9-0.5l-2.6-1.1l-4.1-7l-0.6-2.5l0.9-2.1l-2-4.8l4.4-7.2 l5.9-1.1l0.2-5.4l2.8-2.1l3.6,1.4l7.1-0.1l4.9,2.2l4.2-0.3l3.4-2.7l1.9-7.1l2.2-1.7l9.6-1.7l2.2-2.5l0.9-5.1l5.8,1.2l9.3,0.4l5.9,1 l-0.3,3.1l9.3,4.8L320.3,198.9z', labelX: 278, labelY: 210 },
        { id: 19, name: 'Çorum', d: 'M387.3,249.9l-0.1-3l2-3.9l-0.6-4.9l-3-2.1l-2.3-6.8l5.1-2.7l2.9-6.7l-2.7-6.2l-2.2-10.9l1.4-4.6l-2.2-3.6 l10-3.6l1-2.9l-3.2-4l3.3-6.9l3-3.1l2.6-5.4l2.2-0.6l1.2,1.5l7.4,1.1l2.4,2.1l4.9,1.4l2.1-3.9l2.3,3.9l1.8,6.6l4.9-0.1l-1.6,6.1 l-0.6,9.7l3.5,7.3l8.7,2l5.6,2.4l1.2,2.5l-0.8,6.4l-3.7,5.9l-0.7,6.9l-6,1.1l-0.4,6.7l-4.5,3.8l-5.8-0.7l-6.5,3.4l-8,1.3l-6.8-1.1 l-8.4,3.4l-6.9,1L387.3,249.9z', labelX: 416, labelY: 209 },
        { id: 28, name: 'Giresun', d: 'M602.2,231.8l-1.7,0.8l-5.8,0.5l-9.2-3.1l-4.5,1.4l-8.2-4.6l-6.2-19.3l-4.5-4.5l0.5-8.6l-1.3-5.4l1.8-6.7 l7.6,0.3l2,1.5l9.1-1.1l4.5-3.1l3.1,1l2.7-3l6.1-2.8l4.9-0.4l4.5-2l-0.7,7.2l0.8,8.2l1,2.2l-5.2,1l-4.8,4.6l0.2,3.3l-2.4,3.8 l0.1,5.2l1.3,1.3l5.3,1.1l3.6,2.2l-0.1,2.1l-6.5,5.3l0.4,5.9L602.2,231.8z', labelX: 585, labelY: 203 },
        { id: 29, name: 'Gümüşhane', d: 'M639.8,200.4l3.3-2.8l4.8,3.8l7.5,0.6l13.2-3l1.7,3.4l3.3,11.3l2.9,1.3l7.2,1l-1.8,5l-7.7,3.8l-3.5,3.7 l-8.8,0.2l-7.3-1l-3.7,2.8l-7,1.5l-3.1-7.3l1.5-7.3l-0.3-8.5L639.8,200.4z', labelX: 662, labelY: 215 },
        { id: 37, name: 'Kastamonu', d: 'M304,185.4l0.1-5.2l2.2-7.8l3.9-5.2l4.7,0.4l4.5-1.3l5.3-4.4l2-4.2l2.4-0.6l4.1-4l1.4,1.7l5.8-1.5l3.1,2.3 l2.5,8l-4.3,1l-4.2,5l0.5,8.2l4.7,1.4l1.4,2.1l-1.9,4.8l-4.1,2.3l-4.2-0.5l-3.7,4.8l-5.2,4.1l-4.5,2.1l-1.4-4.7l-9.3-4.8l0.3-3.1 L304,185.4z', labelX: 325, labelY: 176 },
        { id: 52, name: 'Ordu', d: 'M502.2,191.2l5.3-1.7l7.2-5.6l6.1-10.1l4.9-0.2l5.8,1.9l4.9,3.6l3.3,0.2l4.4-6.3l4.1,0.7l0.2,3.6l5.1,4.4 l3.7-0.7l5.9,1.5l-1.8,6.7l1.3,5.4l-0.5,8.6l4.5,4.5l-6.5,2.9l-0.1,4l-4.5,0.7l-4,4.1l-5-2.2l-2.7-4.6l-2.5-6.3h-5.9l-10.4-6.6 l-9,0.3l-14-5.6L502.2,191.2z', labelX: 534, labelY: 196 },
        { id: 53, name: 'Rize', d: 'M660.3,173.3l4.6-3.6h4.1l5.8-3.7l5.1-6.4l3.1,0.3l5.2-2.5l4-4l3.3-1.2l3.1,7.2l6.2,5.1l-9.4,13.9l-0.4,2.4 l-7.5,6.8l-5.2,1.8l-1,3.4l-6.1,2l-6.8,4.2l-0.7-7.6l-3.3-6.8l-0.9-4L660.3,173.3z', labelX: 683, labelY: 176 },
        { id: 55, name: 'Samsun', d: 'M520.8,173.8l-6.1,10.1l-7.2,5.6l-5.3,1.7l-2.4-2.3l-9.1,2.3l-4.8-3.2l-4.2-4.4l-1.7,1.2l-1.9,5.1l-5.3,3.3 l-3.4-1.5l-10.8,0.2l-2.9-3l-7.9-5.5l-2.7,0.6l-13.5-3.5l-4.9,0.1l-1.8-6.6l-2.3-3.9l2-2.9l7.2-4l1.7,2.4l6.8,4.7l9-1.7l-1.7-7.8 l-0.7-9l1.6-4l5.2,0.3l11.6-4.7l2.6-1.7l3.9,1.8l3.3,4.2l1,9.6l4.7,5.8l4.4,2.1l0.4,1.7l4.7,2.7l5.1-3.5l1.9-4.6l9.4,1l6.6,3 l2.2,2.9l0.5,3.6L520.8,173.8z', labelX: 472, labelY: 167 },
        { id: 57, name: 'Sinop', d: 'M392.9,130.5l5,0.6l6.5-1.7l3.3,1.3l5.7,0.2l4.4-1l3.8-2.8l2.5-5.3l3.2,0.3l5,4l-1.8,4.4l5.9,10.5l3.3,2.7 l4.5,1.3l4.3,2.8l-1.6,4l0.7,9l1.7,7.8l-9,1.7l-6.8-4.7l-1.7-2.4l-7.2,4l-2,2.9l-2.1,3.9l-4.9-1.4l-2.4-2.1l-7.4-1.1l-1.2-1.5 l0.2-7.5l-0.8-2.2l1.2-4.2l2.5-2.2l1.4-3.9l-2.4-3.2l-2.9-0.7l-11.2-1.1l-2.8-1.1l3.3-8L392.9,130.5z', labelX: 420, labelY: 148 },
        { id: 60, name: 'Tokat', d: 'M490.7,191.2l9.1-2.3l2.4,2.3l-0.2,3.3l14,5.6l9-0.3l10.4,6.6h5.9l2.5,6.3l-4.4,8.6l-7.5,3.7l-11.4,1.5 l-7.2,2.5l-5.1-0.4l-3.2,1.7l-2.5,9.1l-7.8,4.2l-7.2,0.7l-10.2,2.4l-2.3-3.6l0.2-5.6l-1.9-1.7l-7.7,2.2l-7.6-0.2l-6.7-5.6l2.9-5.3 l4.7-2l6.5-11.6l7.2,0.4l5.7,2.8l7.5-5l0.2-2.9l3.5-1.1l3.9-9.2l-3.3-3.8L490.7,191.2z', labelX: 498, labelY: 218 },
        { id: 61, name: 'Trabzon', d: 'M607.7,172.9l5.5,0.8l6.5-4l2.8,0.4l4.6,4.1l3.5,1.1l2.5-1.1l5.8,2.5l6.1-1.5l5.8,3.1l9.5-5.1l3.3,7.3l0.9,4 l3.3,6.8l0.7,7.6l-13.2,3l-7.5-0.6l-4.8-3.8l-3.3,2.8l-2.4-3.4l-3.2-1.8l-1.6,3.6l-4.1,0.8l-10.5-3.4l-6-7.1l-3.3,1.4l-1-2.2 l-0.8-8.2L607.7,172.9z', labelX: 638, labelY: 186 },
        { id: 67, name: 'Zonguldak', d: 'M252.3,180.9l0.2,3.5l-4.1,5.7l1,3.3l-0.3,8.1l-2.8,2.1l-0.2,5.4l-5.9,1.1l-4.4,7.2l2,4.8l-0.9,2.1l-5.6-0.7 l-3-3.3l-5.3-0.4l-6.1,1.5l-3.8-1.4l-3.3-3.4l-2.6-5l-0.4-1.3l-0.2-1.3l3-0.2l8.4-3.4l1.8-3.6l2.1-8.6l2.9-3l-0.6-2.3l6.3,1.1 l1.2-5.7l-3.2-0.6l-0.6-3l1.8-4.4l11.6,3.2l2.1,1.8L252.3,180.9z', labelX: 230, labelY: 200 },
        { id: 69, name: 'Bayburt', d: 'M643.7,232l-3.3,4.9l-7.2,3l-10.4,0.8l-5.4-1.8l-1.6-1.7l-8.4-3.9l-5.3-1.5l-1.5-5.5l-0.4-5.9l6.5-5.3l0.1-2.1 l-3.6-2.2l-5.3-1.1l-1.3-1.3l-0.1-5.2l2.4-3.8l-0.2-3.3l4.8-4.6l5.2-1l3.3-1.4l6,7.1l10.5,3.4l4.1-0.8l1.6-3.6l3.2,1.8l2.4,3.4 l2.1,8.5l0.3,8.5l-1.5,7.3L643.7,232z', labelX: 620, labelY: 215 },
        { id: 74, name: 'Bartın', d: 'M303.6,151.7l5.7-6.9l5.8-1.3l9.2-5.6l8-1.2l0.4,3.5l2.7,6.9l-2.7,2l0.4,4l-4.1,4l-2.4,0.6l-2,4.2l-5.3,4.4 l-4.5,1.3l-4.7-0.4l1-4.9l-2.4-7L303.6,151.7z', labelX: 320, labelY: 152 },
        { id: 78, name: 'Karabük', d: 'M310.1,167.3l-3.9,5.2l-2.2,7.8l-0.1,5.2l-9.3-0.4l-5.8-1.2l-10.6-1.1l-7.3-3.9l-1.7-1.6l2.5-3l0.2-6.6 l11.1-4.6l9.2-6.1l7.3-4l4.1-1.4l5,3.7l2.4,7L310.1,167.3z', labelX: 290, labelY: 169 },
        { id: 81, name: 'Düzce', d: 'M252.3,180.9l11.9-0.3l5-3.3l1.7,1.6l7.3,3.9l10.6,1.1l-0.9,5.1l-2.2,2.5l-9.6,1.7l-2.2,1.7L272,202l-3.4,2.7 l-4.2,0.3l-4.9-2.2l-7.1,0.1l-3.6-1.4l0.3-8.1l-1-3.3l4.1-5.7L252.3,180.9z', labelX: 268, labelY: 191 },

        // Doğu Anadolu
        { id: 4, name: 'Ağrı', d: 'M760,252l1.4-5.3l-1-7.9l0.9-2.1l-6.6-1.8l-4.1-4.1l4.9-0.6l7.6-5.6l8.8,0.7l13.1-5.4l8.9-0.8l2.5,0.7l2.5,9.4 l2.4,1l5.4-3.9l6.2,1.8l2.7,3.6l7.1,1.7l0.8,1.6l8.5-1l6.9,0.6l7.7-2.9l2.6,0.7l-1.3,4.1l0.4,8.3l-1.4,2l-4.3,1.8l-3.3-1.3l-6.1,1.4 l-1.9,1.8l1.7,1.9l-6.1,2.5l-9.2-0.8l-3.8,2.9l-5.6-0.1l-5-3.5l-6.7-0.7l-3.2,4l-5.1,2l-0.2,1.8l3.7,1.4l0.6,5.8l-6,4l-8,2.8 l-6.7,4.9l-0.9-13.7l-7.1-7.3L760,252z', labelX: 800, labelY: 249 },
        { id: 12, name: 'Bingöl', d: 'M676.2,256.7l2.9,0.7l4,0.2l6.3-4l6.1,4.5l6.2,1.4l4.4,5.3l-1.1,3.7l1.8,5.7l3.5,4.8l0.2,4.9l-2.8,4.1l-1,4.8 l5.1,8.2l-15.4,9.6l-11.6-0.1L678,313l-0.1,3.3l-2.7,3.1l-5.3,0.6l-1.1-5.3l-2.6-3.4l1.6-6.4l2.9,0.6l1.2-6.1l-3.9-5.1l-1.4-4.4 l0.6-4.1l3.6-7.2l-1.6-2.8l-5,2.7l-9.9,6.4l0.9-3.9l-1.3-4.2l0.6-5.9l2.6-2.1l3.8-0.4l0.6-2.1l4.1-1.1l3.7-5.1l3.3,0.1L676.2,256.7z', labelX: 683, labelY: 287 },
        { id: 13, name: 'Bitlis', d: 'M725,310.5l7.1-4l7.7-0.2l3-2.1l4.1-5l-2.2-4.7l0.6-2.1l4-0.3l1.1-3.7l7.3-4h7.4l6.5-4.8l6.7-4.9l8-2.8l2.2,7.2 l5.7,2.5l2.2,2.8l-0.9,4.4l-5.2,5.9l-4.8,10.3l-7.2,5.5l-0.8,3.5l2.4,4.8l1.4,7.2l2.5,0.5L782,332l0.7,6.4l-2.9,2.4l-11.2-5.8 l-8.8-2.2l-6.1-4.5l-3.2-1.1l-7.6,3.4H738l-4.9-1.3l-0.8-6.9l-3.6-10.8L725,310.5z', labelX: 761, labelY: 306 },
        { id: 23, name: 'Elazığ', d: 'M595.2,293.4l1.1-0.6l1.4-0.4l1.9,2.5l-0.3,4.9l2.1,1.7l8.2-1.7l10.4,1.7l11.6,4.7l2.3-2.7l7.5-1.1l4.1-2 l2.5-3.3l1.4-5.3l-1-4.2l1.4-1.6l4.5-1.1l9.9-6.4l5-2.7l1.6,2.8l-3.6,7.2l-0.6,4.1l1.4,4.4l3.9,5.1l-1.2,6.1l-2.9-0.6l-1.6,6.4 l2.6,3.4l1.1,5.3l-15.1,1.6l-5.4-1.3l-2.5,5.7l-2.8,1.7l-6.9,0.6l-6.5,2.5l-7.7-0.7l-6.1,1.6l-5.5,1.4l-4.9-2l-3.7-4.1l-5.4,1.4 l-5.7-2.1l-3.9-0.4l-5-3.2l-1.4-3.4l2.2-4.7l2.5-1.3l2-3.8l4.9,0.1l0.6-2l-1.1-6.5l-1.5-3.2l1-4.1L595.2,293.4z', labelX: 627, labelY: 304 },
        { id: 24, name: 'Erzincan', d: 'M594.7,233.2l5.8-0.5l1.7-0.8l5.3,1.5l8.4,3.9l1.6,1.7l5.4,1.8l10.4-0.8l7.2-3l3.3-4.9l7-1.5l3.7-2.8l7.3,1 l-1.2,6.5l2.5,1.1l7.6-0.5l3.3,3.7l2,5.3l5.3,3.3l-2.1,5.6l0.2,3.7l-2.9-0.7l-13.9,0.2l-2.6-0.8l-8.5,3.7l-6.1-1.9l-6.5,4.7 l-10.2,1.8l-6.9-0.5l-5.9,1.4l-6.6,2.7l-1.8,2.8l-6.5,4l0.7,4.7l-3.3,1.9l-1.9,4.2l1.5,6.9l-1.4,0.4l-1.1,0.6l-3.1-3.3l-4.1-1.7 l-4.2,0.1l-3.7-1.6l1.2-3.6l-1.8-10.3l3.3-4.4l-4.3-3.6l0.5-10.3l2.9-5.1l3.3-1.3l-0.6-2.7l-6.2,1.3l0.9-6.7l1.9-1.4l4.3,1.7 l4.3-2.2l4.1,0.1L594.7,233.2z', labelX: 630, labelY: 261 },
        { id: 25, name: 'Erzurum', d: 'M757.9,186.9l-0.6,4.1l1.8,5.7l-8.7,6.8l-6.2,2.8l-1,3.3l4.1,4.4l6.7,1.4l5.1,3.3l4.1,5.8l-7.6,5.6l-4.9,0.6 l4.1,4.1l6.6,1.8l-0.9,2.1l1,7.9L760,252l-4.2,1.1l-5.7,3.7l-1.2,7.8l-4.9,4.7l-5.4,1.5l-3.3,2.9l-7.8-1.1l-4.1-4.4l-6.5-4.8 l-3.7-0.5l-7,1.9l-4.4-5.3l-6.2-1.4l-6.1-4.5l-6.3,4l-4-0.2l-0.2-3.7l2.1-5.6l-5.3-3.3l-2-5.3l-3.3-3.7l-7.6,0.5l-2.5-1.1l1.2-6.5 l8.8-0.2l3.5-3.7l7.7-3.8l1.8-5l-7.2-1l-2.9-1.3l-3.3-11.3l-1.7-3.4l6.8-4.2l6.1-2l1-3.4l5.2-1.8l7.5-6.8l3.6,1.6l7.1,0.7l-0.6,9.1 l3.3,2.3l7.3-4.8l3.3-1.3l7.5,2.3l1.7-3.2l0.4-5l2.5-4.5l-0.2-4.9l2.7-2.2l11-1.9l1.4,4.4l5.7,5.5L757.9,186.9z', labelX: 712, labelY: 221 },
        { id: 30, name: 'Hakkari', d: 'M850.3,335.1l0.9,1.6l4.5-0.6l2.8,1.1l4,4.7l2.5-1.1l4.5,3.2l-1.9,5.2l2.2,1.6l0.3,9l11.9,7.6l-1.4,3.7l0.9,5.3 l-1.7-1.3l-7.2,1l-6.2,6.8l-3.7,1.8l-1.2,4H858l-3.2-5.7l2.2-4.5l-1.4-5.5l-6.6-2.7l-4.5,0.5l-3.9,5.6l-3.7,1.9l-2-1.4l-7,0.8 l-6.5-0.2l-5.7-3l1.3-4.5l-0.2-5.2l-3-6.7l0.2-8.8l6.1-0.7l8.4-3.3l3.9,0.6l5.8-1.3l2.4-1.8l2.2-6.8L850.3,335.1z', labelX: 848, labelY: 362 },
        { id: 36, name: 'Kars', d: 'M810.7,209.6l-13.1,5.7l-1.2,4.4l-2.5-0.7l-8.9,0.8l-13.1,5.4l-8.8-0.7l-4.1-5.8l-5.1-3.3l-6.7-1.4l-4.1-4.4 l1-3.3l6.2-2.8l8.7-6.8l-1.8-5.7l0.6-4.1l10.1-2.7l0.7-15.9l4.9-3.4l20.2-12.1l1.5,4.8l6.7,2.7l5.9,10.1l1.5,5.9l-2.3,9l-3.4,4.1 l3,2.3l-0.9,4.5l4.1,4.2l2.7,5.4l-2.8,2.1L810.7,209.6z', labelX: 778, labelY: 189 },
        { id: 44, name: 'Malatya', d: 'M580.2,286.9l3.7,1.6l4.2-0.1l4.1,1.7l3.1,3.3l-3.2,0.3l-1,4.1l1.5,3.2l1.1,6.5l-0.6,2l-4.9-0.1l-2,3.8 l-2.5,1.3l-2.2,4.7l1.4,3.4l5,3.2l3.9,0.4l5.7,2.1l5.4-1.4l3.7,4.1l4.9,2l5.5-1.4l1.8,3.3l-1.2,5.4l-1.8,2.5l-6.1,3l-5.7,1.3h-6.4 l-4.3-1.4l2.2-3.7l-2.9-2.2l-5.8,1.3l-5.7,8.5l-3.4,2.1l-1,5.4l-2.6,2.8l-6.9,2.7l-3.9-0.7l-14.5,4.2l1.8-3.5l1.9-8.7l2.4-3.9 l2.5-10.9l-2.4-3.8l-6.8-2.2l-5.9-3.2l-6.8-1.2l-3.3,0.6l-0.6-3.4l2.4-4.6l2.6-1.4l4.3-5.1l2.9-1.8l3.7-5.8l-2.5-7.8l2.9-3l3.8,1.7 l3.7-1l6.3-4.1l12.5-2.1L580.2,286.9z', labelX: 575, labelY: 327 },
        { id: 49, name: 'Muş', d: 'M725,310.5l-2.5,0.7l-2.5,1l-2.1-1.8l-0.4-4.7l-5.8-4.8l-5.1-8.2l1-4.8l2.8-4.1l-0.2-4.9l-3.5-4.8l-1.8-5.7 l1.1-3.7l7-1.9l3.7,0.5l6.5,4.8l4.1,4.4l7.8,1.1l3.3-2.9l5.4-1.5l4.9-4.7l1.2-7.8l5.7-3.7l4.2-1.1l3.8,6.5l7.1,7.3l0.9,13.7 l-6.5,4.8h-7.4l-7.3,4l-1.1,3.7l-4,0.3l-0.6,2.1l2.2,4.7l-4.1,5l-3,2.1l-7.7,0.2L725,310.5z', labelX: 738, labelY: 282 },
        { id: 62, name: 'Tunceli', d: 'M597.7,292.4l-1.5-6.9l1.9-4.2l3.3-1.9l-0.7-4.7l6.5-4l1.8-2.8l6.6-2.7l5.9-1.4l6.9,0.5l10.2-1.8l6.5-4.7 l6.1,1.9l8.5-3.7l2.6,0.8l13.9-0.2l-3.7,3.4l-3.3-0.1l-3.7,5.1l-4.1,1.1l-0.6,2.1l-3.8,0.4l-2.6,2.1l-0.6,5.9l1.3,4.2l-0.9,3.9 l-4.5,1.1l-1.4,1.6l1,4.2l-1.4,5.3l-2.5,3.3l-4.1,2l-7.5,1.1l-2.3,2.7l-11.6-4.7l-10.4-1.7l-8.2,1.7l-2.1-1.7l0.3-4.9L597.7,292.4z', labelX: 636, labelY: 281 },
        { id: 65, name: 'Van', d: 'M833,252.5l2.4,7.9l5.3,2.5l0.5,6.5l-1.5,2.7l3.1,5.7l4.1,2.2l-0.1,10.9l2.6,1.8l1.4,14.1l6.1-0.5l2,3l-3.4,4.8 l0.2,6.1l-5,11.3l-0.3,3.7l-7.3,1.2l-2.2,6.8l-2.4,1.8l-5.8,1.3l-3.9-0.6l-8.4,3.3l-6.1,0.7l-4.4,0.8l-8.8-1.3l-3.4,2.4l-2.3-4.1 l0.8-3.2l0.2-8.4l-1.6-8.8l-7.1-1.2l-3.5,0.6l-2.5-0.5l-1.4-7.2l-2.4-4.8l0.8-3.5l7.2-5.5l4.8-10.3l5.2-5.9l0.9-4.4l-2.2-2.8 l-5.7-2.5l-2.2-7.2l6-4l-0.6-5.8l-3.7-1.4l0.2-1.8l5.1-2l3.2-4l6.7,0.7l5,3.5l5.6,0.1l3.8-2.9l9.2,0.8L833,252.5z', labelX: 818, labelY: 302 },
        { id: 75, name: 'Ardahan', d: 'M748.9,139l3.6-5.1l0.5-3.4l4-1.7l6.9,0.1l-1.8,4.2l2.9,1.5l1.4-1.8l6.6,6.2l8.5,4.2l-3.3,3.1h3l3,3.8l3.9-1.7 l5.2,1.5l0.5,2.9l-20.2,12.1l-4.9,3.4l-0.7,15.9l-10.1,2.7l-6.2-7.8l-5.7-5.5l-1.4-4.4l2.2-5.8l3.3-4.6l3.4-2.3l0.7-4l-3.8-7.9 L748.9,139z', labelX: 769, labelY: 158 },
        { id: 76, name: 'Iğdır', d: 'M796.3,219.7l1.2-4.4l13.1-5.7l11.5,3.7l5.4,0.2l9.6-3.3l3.2,0.1l6.6,2.8l5.3,5.2l5.7,3.8l4,3.8l2.7,4.6 l-11.6-5.9l-4.2,4.6l0.4,3.3l-2.6-0.7l-7.7,2.9l-6.9-0.6l-8.5,1l-0.8-1.6l-7.1-1.7l-2.7-3.6l-6.2-1.8l-5.4,3.9l-2.4-1L796.3,219.7z', labelX: 830, labelY: 222 },

        // Güneydoğu Anadolu
        { id: 2, name: 'Adıyaman', d: 'M617.5,340.5l4.9-1.1l1.8,2.9l-2.6,6.6l-5.7,3.7l-0.2,2.8l-3.2,2.2l-0.1,8.5l-3.3,1.4l1.6,1.5l-5.5,1.3l3.3,2.4 l-10,2.2l-5.6,7l-11,2.7l-3.7,3.8l-4.3-2.1l-2.5,0.6l-3.8-3l-5.4-1.8l-10,1.5l-7.9-3.7l-1.8-6.1l6.1-7.6l14.5-4.2l3.9,0.7l6.9-2.7 l2.6-2.8l1-5.4l3.4-2.1l5.7-8.5l5.8-1.3l2.9,2.2l-2.2,3.7l4.3,1.4h6.4l5.7-1.3l6.1-3L617.5,340.5z', labelX: 583, labelY: 364 },
        { id: 21, name: 'Diyarbakır', d: 'M621.4,348.8l2.6-6.6l-1.8-2.9l-4.9,1.1l1.2-5.4l-1.8-3.3l6.1-1.6l7.7,0.7l6.5-2.5l6.9-0.6l2.8-1.7l2.5-5.7 l5.4,1.3l15.1-1.6l5.3-0.6l2.7-3.1l0.1-3.3l6.8-2.5l11.6,0.1l15.4-9.6l5.8,4.8l0.4,4.7l2.1,1.8l0.5,1.9l-6.8,3.5l-0.9,1.5l-1,8.8 l1.1,9.6l-2.9,10l-4,5.4l2.2,5.5l-2.7,1.6l-16,1l-4.9,1.5l-2.4,4.6l-3.7,0.5l-13.5,11.4l-4.1,6.2l-2.3-2.2l-3.7-7.4l-1.8-6.9 l-0.2-6.4l-5-3.4l-0.8,1.6l-7.1-3.4l-6.1-5l-9-1.3L621.4,348.8z', labelX: 669, labelY: 343 },
        { id: 27, name: 'Gaziantep', d: 'M511.3,399.8l-3.7,5.2l-2.3,5.2l-5.7,8.1l-4.6,0.4l-3.3-2.7l-10.1,0.1l1.8-6.7l-2.5-5.1L477,404l-1.5-4.2 l-0.2-4.5l5.3-13.7l2-3.6l7.7-0.5l0.2,4.5l-2.5,5l2.2,6.8l1.9,2.2l11.2-2.8l6,3.7L511.3,399.8z', labelX: 493, labelY: 398 },
        { id: 47, name: 'Mardin', d: 'M749.3,390.6l-18.8,6.4l-12.7,1.7l-14.3-2.1l-8.5,2l-8,5l-4.1,1.2l-7.6,5.7l-2.2-0.8l-4.7-7.1l-0.6-5.8 l-5.5-4.7l-1.1-6.9l4.1-6.2l13.5-11.4l3.7-0.5l2.4-4.6l4.9-1.5l16-1l2.7-1.6l2.1,0.2l3.6,3.8l3.8,6.5l5.2,2.7l6.8-2.1l12.7-11.1 l5.2,11.9l-0.2,3.9l-7.4,4.8l-1.7,2.3l1,2.3l5.5,1.3l3.1,2.1L749.3,390.6z', labelX: 705, labelY: 384 },
        { id: 56, name: 'Siirt', d: 'M797.5,351.6l-0.2,3.3l-2.5,3.2l-17.6-0.3l-9.5-1.5l-6.1,0.4l-3.3,3.9l-9.1,0.2l-6.8-2.5l-5.4-5l-8.5-2.7 l-5.3-4.1l-0.7-3.7l1.3-2.9l5.1-1.9l4.5-8.6l4.9,1.3h4.9l7.6-3.4l3.2,1.1l6.1,4.5l8.8,2.2l11.2,5.8l2.9-2.4l-0.7-6.4l1.8-5.5 l3.5-0.6l7.1,1.2l1.6,8.8l-0.2,8.4l-0.8,3.2L797.5,351.6z', labelX: 760, labelY: 343 },
        { id: 63, name: 'Şanlıurfa', d: 'M675.1,410.4l-12.5,7.8l-9.6,4.6l-24,6.4l-2.5,0.2l-7.3-1.9l-10.8,1.5l-6.2-1.5l-6.6-6.3l-11.2-3.3h-4.6 l-7.3,4.5l-1.2-7l-2-1.9l0.3-3.4l-2.5,0.5l-2.5-1.9l-1.8-10.9l1.8-5l3.8-5.1l3-0.7l2.5-0.6l4.3,2.1l3.7-3.8l11-2.7l5.6-7l10-2.2 l-3.3-2.4l5.5-1.3l-1.6-1.5l3.3-1.4l0.1-8.5l3.2-2.2l0.2-2.8l5.7-3.7l3.7,1.8l9,1.3l6.1,5l7.1,3.4l0.8-1.6l5,3.4l0.2,6.4l1.8,6.9 l3.7,7.4l2.3,2.2l1.1,6.9l5.5,4.7l0.6,5.8l4.7,7.1L675.1,410.4z', labelX: 619, labelY: 389 },
        { id: 72, name: 'Batman', d: 'M720.1,312.2l2.5-1l2.5-0.7l4,1.2l3.6,10.8l0.8,6.9L729,338l-5.1,1.9l-1.3,2.9l0.7,3.7l5.3,4.1l8.5,2.7l5.4,5 l-12.7,11.1l-6.8,2.1l-5.2-2.7l-3.8-6.5l-3.6-3.8l-2.1-0.2l-2.2-5.5l4-5.4l2.9-10l-1.1-9.6l1-8.8l0.9-1.5l6.8-3.5L720.1,312.2z', labelX: 724, labelY: 341 },
        { id: 73, name: 'Şırnak', d: 'M815.7,374.7l-4.6,0.1l-6.4-2.7l-2.2,0.2l-6.5,3.6l-10.1-1.3l-6.1,13.2l-9.2,3.1l-1.4-3.4l0.5-3.4l-3.1-3.1 l-3.2,0.1l-0.8-2.1l-6.5,8.2l-6.9,3.3L748,387l-3.1-2.1l-5.5-1.3l-1-2.3l1.7-2.3l7.4-4.8l0.2-3.9l-5.2-11.9l6.8,2.5l9.1-0.2l3.3-3.9 l6.1-0.4l9.5,1.5l17.6,0.3l2.5-3.2l0.2-3.3l3.4-2.4l8.8,1.3l4.4-0.8l-0.2,8.8l3,6.7l0.2,5.2L815.7,374.7z', labelX: 778, labelY: 370 },
        { id: 79, name: 'Kilis', d: 'M549.6,432.9l-3.4,2.3l-9.5-1l-6.4,0.7L528,437l-1.8-1.2l-0.3-4.6l-2.2-1.8l-14.3-3.7l2.5-2.5l6.8-4.1l0.3-3.9 l3-0.4l1.6,3.2l6.8,2.8l6,6.1l1.4-1l7.9,3.8L549.6,432.9z', labelX: 530, labelY: 426 },
    ],
};

// Initialize map data
TURKEY_MAP = TURKEY_MAP_DATA;

// ===== ICON INTEGRATION =====
function initIcons() {
    if (typeof setIcon !== 'function') return;

    // Replace emoji nav icons with SVG icons
    const iconMap = {
        'map': 'map',
        'daily': 'calendar',
        'stats': 'stats',
        'settings': 'settings'
    };

    document.querySelectorAll('.nav-btn').forEach(btn => {
        const tab = btn.dataset.tab;
        const iconEl = btn.querySelector('.nav-icon');
        if (tab && iconMap[tab] && iconEl) {
            setIcon(iconEl, iconMap[tab], 20);
        }
    });

    // Replace header button emojis
    const cloudBtn = document.getElementById('btn-cloud');
    if (cloudBtn) setIcon(cloudBtn, 'cloud', 18);

    const soundBtn = document.getElementById('btn-sound');
    if (soundBtn) setIcon(soundBtn, 'sound', 18);
}

// ===== MAIN INIT =====
async function init() {
    console.log('[Kelime Fethi] v2.0 başlatılıyor...');

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

    // Init icons (replace emoji with SVG)
    initIcons();

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
