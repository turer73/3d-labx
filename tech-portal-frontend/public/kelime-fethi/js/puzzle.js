// ============================================================
// KELIME FETHI v2.0 — Puzzle Mechanics
// ============================================================

import { WORD_LENGTH, MAX_GUESSES, SCORE_TABLE, STREAK_REWARDS } from './config.js';
import { trUpper, trLen, showToast, floatText } from './utils.js';
import { SFX } from './sound.js';
import { Haptic } from './haptic.js';
import { Particles } from './particles.js';
import { state, save } from './state.js';
import { evaluateGuess, validateGuess, getDailyWord, getTodayStr, getDayNumber, CITIES, REGIONS } from './words.js';
import { renderMap, getConqueredCount, setOnCityClickCallback } from './map.js';
import { updateStats } from './stats.js';

let currentInput = '';
let isAnimating = false;
let currentPuzzleComplete = false;
let keyboardState = {};

// ===== UI UPDATE CALLBACKS =====
let _updateUICallback = null;
export function setUpdateUICallback(fn) { _updateUICallback = fn; }

function updateUI() {
    if (_updateUICallback) _updateUICallback();
}

// ===== RENDER: GUESS GRID =====
export function renderGrid() {
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

            if (row < state.activeCityGuesses.length) {
                const guess = state.activeCityGuesses[row];
                const evaluation = evaluateGuess(guess, state.activeCityWord);
                const chars = [...guess];
                tile.textContent = chars[col] || '';
                tile.classList.add('revealed', evaluation[col]);
            } else if (row === state.activeCityGuesses.length) {
                const chars = [...currentInput];
                tile.textContent = chars[col] || '';
                if (chars[col]) tile.classList.add('filled');
            }

            rowEl.appendChild(tile);
        }
        grid.appendChild(rowEl);
    }
}

// ===== KEYBOARD STATE =====
export function updateKeyboardState() {
    keyboardState = {};
    state.activeCityGuesses.forEach(guess => {
        if (!state.activeCityWord) return;
        const evaluation = evaluateGuess(guess, state.activeCityWord);
        const chars = [...guess];
        chars.forEach((ch, i) => {
            const current = keyboardState[ch];
            const newState = evaluation[i];
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

export function renderKeyboard() {
    document.querySelectorAll('#keyboard .key').forEach(btn => {
        const key = btn.dataset.key;
        if (!key || key === 'ENTER' || key === 'BACKSPACE') return;
        btn.classList.remove('correct', 'present', 'absent');
        if (keyboardState[key]) {
            btn.classList.add(keyboardState[key]);
        }
    });
}

// ===== INPUT =====
export function addLetter(letter) {
    if (isAnimating || currentPuzzleComplete) return;
    if (trLen(currentInput) >= WORD_LENGTH) return;

    currentInput += letter;
    SFX.keyTap();

    const row = state.activeCityGuesses.length;
    const col = trLen(currentInput) - 1;
    const tile = document.getElementById(`tile-${row}-${col}`);
    if (tile) {
        tile.textContent = letter;
        tile.classList.add('filled', 'pop');
        setTimeout(() => tile.classList.remove('pop'), 100);
    }
}

export function removeLetter() {
    if (isAnimating || currentPuzzleComplete) return;
    if (currentInput.length === 0) return;

    const row = state.activeCityGuesses.length;
    const col = trLen(currentInput) - 1;
    const tile = document.getElementById(`tile-${row}-${col}`);
    if (tile) {
        tile.textContent = '';
        tile.classList.remove('filled');
    }

    const chars = [...currentInput];
    chars.pop();
    currentInput = chars.join('');
    Haptic.tap();
}

export function submitGuess() {
    if (isAnimating || currentPuzzleComplete) return;

    const guess = trUpper(currentInput);
    const validation = validateGuess(guess);

    if (!validation.valid) {
        shakeRow(state.activeCityGuesses.length);
        showToast(validation.message);
        SFX.error();
        return;
    }

    state.activeCityGuesses.push(guess);
    currentInput = '';
    revealRow(state.activeCityGuesses.length - 1, guess);
}

// ===== TILE ANIMATIONS =====
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

                if (evaluation[col] === 'correct') SFX.tileRevealCorrect();
                else if (evaluation[col] === 'present') SFX.tileRevealPresent();
                else SFX.tileRevealAbsent();
            }, 250);

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

// ===== RESULT CHECK =====
function checkPuzzleResult(guess, evaluation, rowIndex) {
    const isCorrect = evaluation.every(e => e === 'correct');
    const isLastGuess = state.activeCityGuesses.length >= MAX_GUESSES;

    if (isCorrect) {
        currentPuzzleComplete = true;
        bounceRow(rowIndex);

        const guessCount = state.activeCityGuesses.length;
        const baseScore = SCORE_TABLE[guessCount] || 100;
        const hasBonus = Math.random() < 0.03;
        const bonusScore = hasBonus ? 200 : 0;
        const totalScore = baseScore + bonusScore;

        state.score += totalScore;
        state.totalScore += totalScore;
        state.gamesPlayed++;
        state.gamesWon++;
        state.guessDistribution[guessCount] = (state.guessDistribution[guessCount] || 0) + 1;

        if (state.activeCityId) {
            state.conqueredCities[state.activeCityId] = {
                word: state.activeCityWord,
                guesses: guessCount,
                score: totalScore,
                date: getTodayStr(),
            };
        }

        if (state.dailyDate === getTodayStr() && !state.dailyComplete) {
            state.dailyComplete = true;
            state.dailyWon = true;
            updateStreak(true);
        }

        save();

        setTimeout(() => {
            SFX.win();

            if (hasBonus) {
                SFX.bonus();
                showToast('BONUS KELiME! +200 ekstra puan!', 3000);
            }

            let message = '';
            if (guessCount === 1) message = 'iNANILMAZ! ilk denemede!';
            else if (guessCount === 2) message = 'Deha! 2 denemede bildin!';
            else if (guessCount === 3) message = 'Harika! 3 denemede!';
            else if (guessCount === 4) message = 'Guzel! 4 denemede buldum!';
            else if (guessCount === 5) message = 'Son anda! 5. denemede!';
            else message = 'Zar zor! Son denemede basardin!';

            showResultOverlay(true, message, totalScore, hasBonus, guessCount);

            const grid = document.getElementById('guess-grid');
            if (grid) {
                const rect = grid.getBoundingClientRect();
                Particles.confetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
            }

            floatText(`+${totalScore}`, window.innerWidth / 2, window.innerHeight / 2 - 60, '#16a34a');
            if (hasBonus) {
                setTimeout(() => floatText('+200 BONUS!', window.innerWidth / 2, window.innerHeight / 2 - 100, '#f59e0b'), 500);
            }

            updateUI();

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
        currentPuzzleComplete = true;
        state.gamesPlayed++;

        if (state.dailyDate === getTodayStr() && !state.dailyComplete) {
            state.dailyComplete = true;
            state.dailyWon = false;
            updateStreak(false);
        }

        save();

        setTimeout(() => {
            SFX.lose();
            showResultOverlay(false, `Dogru kelime: ${state.activeCityWord}`, 0, false, 0);
            updateUI();
        }, 500);
    }
}

// ===== STREAK =====
function updateStreak(won) {
    const today = getTodayStr();

    if (won) {
        if (state.lastPlayDate) {
            const lastDate = new Date(state.lastPlayDate);
            const todayDate = new Date(today);
            const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                state.currentStreak++;
            } else if (diffDays > 1) {
                state.currentStreak = 1;
            }
        } else {
            state.currentStreak = 1;
        }

        state.lastPlayDate = today;

        if (state.currentStreak > state.maxStreak) {
            state.maxStreak = state.currentStreak;
        }

        checkStreakRewards();
    } else {
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

    document.getElementById('result-icon').textContent = won ? 'Tebrikler' : 'Kaybettin';
    document.getElementById('result-title').textContent = won ? 'Tebrikler!' : 'Kaybettin!';
    document.getElementById('result-message').textContent = message;
    document.getElementById('result-score').textContent = won ? `+${score}` : '';
    document.getElementById('result-score').style.display = won ? 'block' : 'none';

    const shareGridEl = document.getElementById('result-grid-share');
    if (shareGridEl) {
        shareGridEl.innerHTML = generateShareGrid();
    }

    const nextBtn = document.getElementById('btn-next-city');
    if (nextBtn) {
        nextBtn.style.display = state.activeCityId ? 'inline-flex' : 'none';
    }

    overlay.classList.remove('hidden');
}

export function hideResultOverlay() {
    const overlay = document.getElementById('result-overlay');
    if (overlay) overlay.classList.add('hidden');
}

// ===== SHARE =====
function generateShareGrid() {
    const guesses = state.activeCityGuesses;
    const word = state.activeCityWord;
    if (!word || guesses.length === 0) return '';

    let shareText = '';
    const isDaily = state.dailyDate === getTodayStr();
    const title = isDaily ? `Kelime Fethi - Gunluk #${getDayNumber()}` : 'Kelime Fethi';
    const won = guesses.some(g => g === word);
    shareText += `${title} ${won ? guesses.length : 'X'}/${MAX_GUESSES}\n\n`;

    guesses.forEach(guess => {
        const eval_ = evaluateGuess(guess, word);
        const emojiRow = eval_.map(e => {
            if (e === 'correct') return 'G';
            if (e === 'present') return 'S';
            return 'X';
        }).join('');
        shareText += emojiRow + '\n';
    });

    return shareText;
}

export function shareResult() {
    const text = generateShareGrid();
    if (!text) return;

    if (navigator.share) {
        navigator.share({ text }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Panoya kopyalandi!');
        }).catch(() => {
            showToast('Kopyalama basarisiz');
        });
    }
}

// ===== HINT =====
export function useHint() {
    if (state.hints <= 0) {
        showToast('ipucu hakkin kalmadi!');
        return;
    }
    if (isAnimating || currentPuzzleComplete) return;
    if (!state.activeCityWord) return;

    const targetChars = [...state.activeCityWord];
    const knownCorrect = new Set();
    state.activeCityGuesses.forEach(guess => {
        const eval_ = evaluateGuess(guess, state.activeCityWord);
        [...guess].forEach((ch, i) => {
            if (eval_[i] === 'correct') knownCorrect.add(i);
        });
    });

    const unknownPositions = [];
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (!knownCorrect.has(i)) unknownPositions.push(i);
    }

    if (unknownPositions.length === 0) {
        showToast('Zaten tum harfleri biliyorsun!');
        return;
    }

    const pos = unknownPositions[Math.floor(Math.random() * unknownPositions.length)];
    const revealedLetter = targetChars[pos];

    state.hints--;
    SFX.hint();
    showToast(`${pos + 1}. harf: ${revealedLetter}`);
    updateHintDisplay();
    save();
}

export function updateHintDisplay() {
    const el = document.getElementById('hint-count');
    if (el) el.textContent = state.hints;
}

// ===== START PUZZLE =====
export function startCityPuzzle(cityId, switchViewFn) {
    const city = CITIES.find(c => c.id === cityId);
    if (!city || !city.words || city.words.length === 0) return;

    const word = city.words[Math.floor(Math.random() * city.words.length)];

    state.activeCityId = cityId;
    state.activeCityWord = word;
    state.activeCityGuesses = [];
    currentInput = '';
    currentPuzzleComplete = false;
    keyboardState = {};

    document.getElementById('puzzle-city-name').textContent = city.name;
    const regionData = REGIONS.find(r => r.id === city.region);
    document.getElementById('puzzle-region-name').textContent = regionData ? regionData.name : '';

    renderGrid();
    renderKeyboard();
    updateHintDisplay();

    switchViewFn('puzzle');
    SFX.resume();
}

export function startDailyPuzzle(switchViewFn) {
    const today = getTodayStr();

    if (state.dailyDate === today && state.dailyComplete) {
        showToast('Bugunku bulmaciyi zaten tamamladin!');
        return;
    }

    const word = getDailyWord();
    if (!word) {
        showToast('Kelime verisi yuklenemedi!');
        return;
    }

    if (state.dailyDate !== today) {
        state.dailyDate = today;
        state.dailyGuesses = [];
        state.dailyComplete = false;
        state.dailyWon = false;
        state.dailyWord = word;
    }

    state.activeCityId = null;
    state.activeCityWord = state.dailyWord;
    state.activeCityGuesses = state.dailyGuesses;
    currentInput = '';
    currentPuzzleComplete = state.dailyComplete;
    keyboardState = {};

    updateKeyboardState();

    document.getElementById('puzzle-city-name').textContent = 'Gunluk Bulmaca';
    document.getElementById('puzzle-region-name').textContent = `#${getDayNumber()}`;

    renderGrid();
    renderKeyboard();
    updateHintDisplay();

    switchViewFn('puzzle');
    SFX.resume();
}

// Register city click callback
setOnCityClickCallback((cityId) => {
    startCityPuzzle(cityId, switchView);
});

// switchView reference (will be set from app.js)
let switchView = () => {};
export function setSwitchViewFn(fn) { switchView = fn; }
