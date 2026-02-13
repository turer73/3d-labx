// ============================================================
// KELIME FETHI v2.0 — Puzzle Mechanics
// ============================================================

import { WORD_LENGTH, MAX_GUESSES, SCORE_TABLE, STREAK_REWARDS, setMaxGuesses, setWordLength, LENGTH_SCORE_MULTIPLIER } from './config.js';
import { TR_UPPER, trUpper, trLen, showToast, floatText } from './utils.js';
import { SFX } from './sound.js';
import { Haptic } from './haptic.js';
import { Particles } from './particles.js';
import { state, save, getDifficultyConfig } from './state.js';
import { evaluateGuess, validateGuess, getDailyWord, getDailyWordLength, getTodayStr, getDayNumber, clearEvalCache, CITIES, REGIONS, getWordPoolForCity, setActiveLength, WORDS_BY_LENGTH } from './words.js';
import { renderMap, getConqueredCount, setOnCityClickCallback, playCityConquestAnimation, checkRegionUnlock } from './map.js';
import { updateStats } from './stats.js';
import { checkAchievements, trackNoHintWin, trackQuickWin } from './achievements.js';
import { submitDailyScore } from './leaderboard.js';

let currentInput = '';
let isAnimating = false;
let currentPuzzleComplete = false;
let keyboardState = {};

// Revealed (locked) letter positions: Map<position, letter>
// These are pre-filled by easy mode start and must stay fixed during input
// ONLY set by revealStartingLetters — affects free slot count & input blocking
let _revealedPositions = new Map();

// Green carry-over positions: Map<position, letter>
// Accumulated from correct guesses — visual pre-fill only, does NOT block input
let _greenCarryPositions = new Map();

// Keys eliminated at puzzle start (easy mode) — must survive updateKeyboardState resets
let _eliminatedKeys = new Set();

// ===== GUESS TIMER =====
let _guessTimerId = null;
let _guessTimerStart = 0;
let _guessTimerDuration = 0; // ms
let _guessTimerAnimFrame = null;

function startGuessTimer() {
    const dc = getDifficultyConfig();
    const sec = dc.guessTimerSec || 0;
    if (sec <= 0) return;
    if (_guessTimerId) return; // already running

    _guessTimerDuration = sec * 1000;
    _guessTimerStart = Date.now();

    // Show timer bar
    const bar = document.getElementById('guess-timer-bar');
    const container = document.getElementById('guess-timer');
    if (container) container.style.display = '';
    if (bar) { bar.style.width = '100%'; bar.classList.remove('timer-critical'); }

    // Animate the bar
    const animate = () => {
        const elapsed = Date.now() - _guessTimerStart;
        const remaining = Math.max(0, _guessTimerDuration - elapsed);
        const pct = (remaining / _guessTimerDuration) * 100;
        if (bar) {
            bar.style.width = pct + '%';
            if (pct <= 30) bar.classList.add('timer-critical');
        }
        if (remaining > 0) {
            _guessTimerAnimFrame = requestAnimationFrame(animate);
        }
    };
    _guessTimerAnimFrame = requestAnimationFrame(animate);

    // Set timeout for burn
    _guessTimerId = setTimeout(() => {
        onGuessTimerExpired();
    }, _guessTimerDuration);
}

function clearGuessTimer() {
    if (_guessTimerId) { clearTimeout(_guessTimerId); _guessTimerId = null; }
    if (_guessTimerAnimFrame) { cancelAnimationFrame(_guessTimerAnimFrame); _guessTimerAnimFrame = null; }
    const container = document.getElementById('guess-timer');
    if (container) container.style.display = 'none';
}

function onGuessTimerExpired() {
    clearGuessTimer();
    if (isAnimating || currentPuzzleComplete) return;

    SFX.error();
    showToast('Süre doldu! Tahmin hakkın yandı', 2000);

    // Burn the guess: push empty/partial guess and advance
    const row = state.activeCityGuesses.length;
    const locked = getAllLockedPositions();
    // Clear current input from tiles
    for (let col = 0; col < WORD_LENGTH; col++) {
        if (locked.has(col)) continue;
        const tile = document.getElementById(`tile-${row}-${col}`);
        if (tile) { tile.textContent = ''; tile.classList.remove('filled'); }
    }

    // Push a dummy guess (all dashes) to consume the slot
    const dummyGuess = '·'.repeat(WORD_LENGTH);
    state.activeCityGuesses.push(dummyGuess);
    currentInput = '';

    // Mark the burned row visually
    shakeRow(row);

    // Check if that was the last guess
    const isLastGuess = state.activeCityGuesses.length >= MAX_GUESSES;
    if (isLastGuess) {
        currentPuzzleComplete = true;
        state.gamesPlayed++;
        const dc = getDifficultyConfig();
        const consolation = dc.consolationScore || 0;
        if (consolation > 0) { state.score += consolation; state.totalScore += consolation; }

        if (state.dailyDate === getTodayStr() && !state.dailyComplete) {
            state.dailyComplete = true;
            state.dailyWon = false;
        }
        save();
        setTimeout(() => {
            SFX.lose();
            const msg = consolation > 0
                ? `Doğru kelime: ${state.activeCityWord} (+${consolation} deneme puanı)`
                : `Doğru kelime: ${state.activeCityWord}`;
            showResultOverlay(false, msg, consolation, false, 0);
            updateUI();
        }, 500);
    } else {
        // Advance to next row with locked letters
        prefillNextRow();
        save();
    }
}

// ===== UI UPDATE CALLBACKS =====
let _updateUICallback = null;
export function setUpdateUICallback(fn) { _updateUICallback = fn; }

function updateUI() {
    if (_updateUICallback) _updateUICallback();
}

// ===== RENDER: GUESS GRID =====
let _gridBuilt = false;

function ensureGridBuilt() {
    const grid = document.getElementById('guess-grid');
    if (!grid) return;
    // Check both row count AND column count (word length may have changed)
    const firstRow = grid.querySelector('.grid-row');
    if (_gridBuilt && grid.children.length === MAX_GUESSES &&
        firstRow && firstRow.children.length === WORD_LENGTH) return;

    grid.innerHTML = '';
    for (let row = 0; row < MAX_GUESSES; row++) {
        const rowEl = document.createElement('div');
        rowEl.className = 'grid-row';
        for (let col = 0; col < WORD_LENGTH; col++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.id = `tile-${row}-${col}`;
            rowEl.appendChild(tile);
        }
        grid.appendChild(rowEl);
    }
    _gridBuilt = true;
}

export function renderGrid() {
    ensureGridBuilt();

    for (let row = 0; row < MAX_GUESSES; row++) {
        for (let col = 0; col < WORD_LENGTH; col++) {
            const tile = document.getElementById(`tile-${row}-${col}`);
            if (!tile) continue;

            // Reset classes
            tile.className = 'tile';
            tile.textContent = '';

            if (row < state.activeCityGuesses.length) {
                // Completed guess row
                const guess = state.activeCityGuesses[row];
                const evaluation = evaluateGuess(guess, state.activeCityWord);
                const chars = [...guess];
                tile.textContent = chars[col] || '';
                tile.classList.add('revealed', evaluation[col]);
            } else if (row === state.activeCityGuesses.length) {
                // Current input row — merge all locked + user input
                const locked = getAllLockedPositions();
                if (locked.has(col)) {
                    // Locked letter (from easy-mode start OR green carry-over)
                    tile.textContent = locked.get(col);
                    tile.classList.add('filled', 'correct', 'locked', 'hint-reveal');
                } else {
                    // Free slot — fill from user input (skip all locked positions)
                    const inputChars = [...currentInput];
                    let freeIdx = 0;
                    let charForCol = '';
                    for (let c = 0; c < WORD_LENGTH; c++) {
                        if (locked.has(c)) continue;
                        if (c === col) { charForCol = inputChars[freeIdx] || ''; break; }
                        freeIdx++;
                    }
                    tile.textContent = charForCol;
                    if (charForCol) tile.classList.add('filled');
                }
            }
        }
    }
}

// ===== KEYBOARD STATE =====
export function updateKeyboardState() {
    keyboardState = {};
    // Re-apply initially eliminated keys (easy mode)
    _eliminatedKeys.forEach(ch => { keyboardState[ch] = 'absent'; });
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
    const locked = getAllLockedPositions();
    // Check against free slots (non-locked), not total WORD_LENGTH
    if (trLen(currentInput) >= (WORD_LENGTH - locked.size)) return;

    const wasEmpty = currentInput.length === 0;
    currentInput += letter;
    SFX.keyTap();

    // Start guess timer on first letter typed
    if (wasEmpty) startGuessTimer();

    // Find which visual column this letter lands on (skip all locked positions)
    const inputChars = [...currentInput];
    let inputIdx = 0;
    let targetCol = -1;
    for (let col = 0; col < WORD_LENGTH; col++) {
        if (locked.has(col)) continue;
        inputIdx++;
        if (inputIdx === inputChars.length) { targetCol = col; break; }
    }

    if (targetCol >= 0) {
        const row = state.activeCityGuesses.length;
        const tile = document.getElementById(`tile-${row}-${targetCol}`);
        if (tile) {
            tile.textContent = letter;
            tile.classList.add('filled', 'pop');
            setTimeout(() => tile.classList.remove('pop'), 100);
        }
    }
}

export function removeLetter() {
    if (isAnimating || currentPuzzleComplete) return;
    if (currentInput.length === 0) return;

    const locked = getAllLockedPositions();
    // Find visual column of the last free-slot letter being removed
    const inputChars = [...currentInput];
    let inputIdx = 0;
    let targetCol = -1;
    for (let col = 0; col < WORD_LENGTH; col++) {
        if (locked.has(col)) continue;
        inputIdx++;
        if (inputIdx === inputChars.length) { targetCol = col; break; }
    }

    if (targetCol >= 0) {
        const row = state.activeCityGuesses.length;
        const tile = document.getElementById(`tile-${row}-${targetCol}`);
        if (tile) {
            tile.textContent = '';
            tile.classList.remove('filled');
        }
    }

    const chars = [...currentInput];
    chars.pop();
    currentInput = chars.join('');
    Haptic.tap();
}

export function submitGuess() {
    if (isAnimating || currentPuzzleComplete) return;
    clearGuessTimer();

    // Build full word: merge locked letters + user input
    const fullWord = buildFullWord();
    const guess = trUpper(fullWord);

    // Check if all slots filled
    if (trLen(guess) < WORD_LENGTH) {
        shakeRow(state.activeCityGuesses.length);
        showToast('Tüm harfleri doldur!');
        SFX.error();
        return;
    }

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

            if (col === chars.length - 1) {
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
        const lengthMult = LENGTH_SCORE_MULTIPLIER[WORD_LENGTH] || 1.0;
        const totalScore = Math.round((baseScore + bonusScore) * lengthMult);

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
                wordLength: WORD_LENGTH,
            };
        }

        const isDaily = state.dailyDate === getTodayStr() && !state.dailyComplete;
        if (isDaily) {
            state.dailyComplete = true;
            state.dailyWon = true;
            updateStreak(true);

            // Auto-submit daily score to leaderboard
            const solveTimeMs = Date.now() - (state.startTime || Date.now());
            submitDailyScore({
                guesses: guessCount,
                solved: true,
                solveTimeMs,
                score: totalScore,
                difficulty: state.difficulty,
                wordLength: WORD_LENGTH
            });
        }

        // Track achievement helpers
        trackNoHintWin(state.hintUsedThisGame);
        trackQuickWin(guessCount);

        save();

        setTimeout(() => {
            SFX.win();

            if (hasBonus) {
                SFX.bonus();
                showToast('BONUS KELiME! +200 ekstra puan!', 3000);
            }

            let message = '';
            if (guessCount === 1) message = 'İNANILMAZ! İlk denemede!';
            else if (guessCount === 2) message = 'Deha! 2 denemede bildin!';
            else if (guessCount === 3) message = 'Harika! 3 denemede!';
            else if (guessCount === 4) message = 'Güzel! 4 denemede buldun!';
            else if (guessCount === 5) message = 'Son anda! 5. denemede!';
            else message = 'Zar zor! Son denemede başardın!';

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

            // Check achievements after win
            setTimeout(() => {
                checkAchievements({
                    guessCount,
                    won: true,
                    hasBonus,
                    regionComplete: false,
                });
            }, 600);

            if (state.activeCityId) {
                renderMap();
                // Play conquest animation (flag, particles, glow)
                playCityConquestAnimation(state.activeCityId);
                // Check if a new region was unlocked
                setTimeout(() => checkRegionUnlock(), 1200);
            }
        }, 800);

    } else if (isLastGuess) {
        currentPuzzleComplete = true;
        state.gamesPlayed++;

        // Consolation score for easy mode
        const dc = getDifficultyConfig();
        const consolation = dc.consolationScore || 0;
        if (consolation > 0) {
            state.score += consolation;
            state.totalScore += consolation;
        }

        if (state.dailyDate === getTodayStr() && !state.dailyComplete) {
            state.dailyComplete = true;
            state.dailyWon = false;
            updateStreak(false);

            // Submit lost daily score to leaderboard
            const solveTimeMs = Date.now() - (state.startTime || Date.now());
            submitDailyScore({
                guesses: MAX_GUESSES,
                solved: false,
                solveTimeMs,
                score: consolation,
                difficulty: state.difficulty,
                wordLength: WORD_LENGTH
            });
        }

        save();

        setTimeout(() => {
            SFX.lose();
            const msg = consolation > 0
                ? `Doğru kelime: ${state.activeCityWord} (+${consolation} deneme puanı)`
                : `Doğru kelime: ${state.activeCityWord}`;
            showResultOverlay(false, msg, consolation, false, 0);
            updateUI();
            if (consolation > 0) {
                floatText(`+${consolation}`, window.innerWidth / 2, window.innerHeight / 2 - 60, '#f59e0b');
            }
        }, 500);
    } else {
        // Not correct, not last guess — check auto-hint
        checkAutoHint(evaluation);
        // Lock all correct (green) positions from this guess + carry over to next row
        updateRevealedFromEvaluation(guess, evaluation);
        prefillNextRow();
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

    // Award streak freeze at milestones
    const freezeMilestones = [7, 14, 21, 30, 50, 75, 100];
    if (freezeMilestones.includes(state.currentStreak)) {
        state.streakFreezeCount = (state.streakFreezeCount || 0) + 1;
        save();
        setTimeout(() => {
            showToast(`❄️ Seri dondurma kazandın! (${state.streakFreezeCount} hak)`, 3500);
        }, 5500);
    }
}

// ===== RESULT OVERLAY =====
function showResultOverlay(won, message, score, hasBonus, guessCount) {
    const overlay = document.getElementById('result-overlay');
    if (!overlay) return;

    document.getElementById('result-icon').textContent = won ? '🏆' : '😔';
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
        if (state.activeCityId) {
            nextBtn.style.display = 'inline-flex';
            nextBtn.textContent = 'Sonraki Şehir →';
        } else {
            // Daily puzzle — show "Tamam" instead of hiding
            nextBtn.style.display = 'inline-flex';
            nextBtn.textContent = 'Tamam ✓';
        }
    }

    overlay.classList.remove('hidden');
}

export function hideResultOverlay() {
    const overlay = document.getElementById('result-overlay');
    if (overlay) overlay.classList.add('hidden');
}

// ===== SHARE =====
export function generateShareGrid() {
    const guesses = state.activeCityGuesses;
    const word = state.activeCityWord;
    if (!word || guesses.length === 0) return '';

    let shareText = '';
    const isDaily = state.dailyDate === getTodayStr();
    const title = isDaily ? `Kelime Fethi - Günlük #${getDayNumber()}` : 'Kelime Fethi';
    const won = guesses.some(g => g === word);
    shareText += `${title} ${won ? guesses.length : 'X'}/${MAX_GUESSES} (${WORD_LENGTH} harf)\n\n`;

    guesses.forEach(guess => {
        const eval_ = evaluateGuess(guess, word);
        const emojiRow = eval_.map(e => {
            if (e === 'correct') return '🟩';
            if (e === 'present') return '🟨';
            return '⬛';
        }).join('');
        shareText += emojiRow + '\n';
    });

    shareText += '\nhttps://3d-labx.com/kelime-fethi/';
    return shareText;
}

export function shareResult() {
    const text = generateShareGrid();
    if (!text) return;

    if (navigator.share) {
        navigator.share({ text }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Panoya kopyalandı!');
        }).catch(() => {
            showToast('Kopyalama başarısız');
        });
    }
}

// ===== HINT =====
export function useHint() {
    if (state.hints <= 0) {
        showToast('İpucu hakkın kalmadı!');
        return;
    }
    if (isAnimating || currentPuzzleComplete) return;
    if (!state.activeCityWord) return;

    const targetChars = [...state.activeCityWord];
    const locked = getAllLockedPositions();
    const knownCorrect = new Set(locked.keys());
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
        showToast('Zaten tüm harfleri biliyorsun!');
        return;
    }

    const pos = unknownPositions[Math.floor(Math.random() * unknownPositions.length)];
    const revealedLetter = targetChars[pos];

    state.hints--;
    state.hintUsedThisGame = true;
    SFX.hint();
    showToast(`${pos + 1}. harf: ${revealedLetter}`);
    updateHintDisplay();
    save();
}

export function updateHintDisplay() {
    const el = document.getElementById('hint-count');
    if (el) el.textContent = state.hints;
}

// ===== DIFFICULTY HELPERS =====
let _autoHintCount = 0; // Track wrong guesses for auto-hint

function applyDifficultySettings() {
    const dc = getDifficultyConfig();
    setMaxGuesses(dc.maxGuesses);
}

function revealStartingLetters() {
    const dc = getDifficultyConfig();
    const count = dc.revealLetters || 0;
    if (count <= 0 || !state.activeCityWord) return;

    _revealedPositions.clear();
    _greenCarryPositions.clear();
    const chars = [...state.activeCityWord];
    // Pick random unique positions to reveal
    const positions = Array.from({ length: WORD_LENGTH }, (_, i) => i);
    const revealed = [];
    for (let i = 0; i < Math.min(count, WORD_LENGTH); i++) {
        const idx = Math.floor(Math.random() * positions.length);
        const pos = positions.splice(idx, 1)[0];
        revealed.push({ pos, letter: chars[pos] });
    }
    revealed.sort((a, b) => a.pos - b.pos);

    // Register as locked positions and show on grid
    revealed.forEach(({ pos, letter }) => {
        _revealedPositions.set(pos, letter);
        const tile = document.getElementById(`tile-0-${pos}`);
        if (tile) {
            tile.textContent = letter;
            tile.classList.add('revealed', 'correct', 'hint-reveal', 'locked');
        }
    });

    const hintText = revealed.map(r => `${r.pos + 1}. harf: ${r.letter}`).join(', ');
    showToast(`Başlangıç ipucu: ${hintText}`, 4000);
}

// Update _greenCarryPositions with all correct (green) positions from a guess evaluation
// These are visual-only carry-overs that DON'T reduce free slot count
function updateRevealedFromEvaluation(guess, evaluation) {
    const chars = [...guess];
    evaluation.forEach((result, col) => {
        if (result === 'correct') {
            if (!_revealedPositions.has(col) && !_greenCarryPositions.has(col)) {
                _greenCarryPositions.set(col, chars[col]);
            }
        }
    });
}

// Pre-fill the current (next) row with all locked letters (start + green carry)
function prefillNextRow() {
    const locked = getAllLockedPositions();
    if (locked.size === 0) return;
    const row = state.activeCityGuesses.length; // next row index
    locked.forEach((letter, col) => {
        const tile = document.getElementById(`tile-${row}-${col}`);
        if (tile) {
            tile.textContent = letter;
            tile.classList.add('filled', 'correct', 'locked', 'hint-reveal');
        }
    });
}

// Get next available (non-locked) column index for typing
function getNextFreeCol() {
    const locked = getAllLockedPositions();
    const inputChars = [...currentInput];
    let inputIdx = 0;
    for (let col = 0; col < WORD_LENGTH; col++) {
        if (locked.has(col)) continue; // skip all locked
        if (inputIdx >= inputChars.length) return col; // first empty free slot
        inputIdx++;
    }
    return -1; // all free slots filled
}

// Get all locked positions (start-reveal + green carry-over combined)
function getAllLockedPositions() {
    const merged = new Map(_revealedPositions);
    _greenCarryPositions.forEach((letter, col) => {
        if (!merged.has(col)) merged.set(col, letter);
    });
    return merged;
}

// Count how many free (non-locked) slots exist
function getFreeSlotCount() {
    return WORD_LENGTH - getAllLockedPositions().size;
}

// Build full word combining all locked letters (start + green carry) + user input
function buildFullWord() {
    const locked = getAllLockedPositions();
    const inputChars = [...currentInput];
    let inputIdx = 0;
    let result = '';
    for (let col = 0; col < WORD_LENGTH; col++) {
        if (locked.has(col)) {
            result += locked.get(col);
        } else {
            result += (inputIdx < inputChars.length) ? inputChars[inputIdx++] : '';
        }
    }
    return result;
}

// Pre-eliminate some keyboard keys in easy mode
// Keeps: word letters + some random extras. Marks the rest as absent.
function eliminateInitialKeys() {
    const dc = getDifficultyConfig();
    const count = dc.eliminateKeys || 0;
    if (count <= 0 || !state.activeCityWord) return;

    const wordLetters = new Set([...state.activeCityWord]);
    // All alphabet letters not in the word
    const nonWordLetters = [...TR_UPPER].filter(ch => !wordLetters.has(ch));

    // Shuffle non-word letters
    for (let i = nonWordLetters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nonWordLetters[i], nonWordLetters[j]] = [nonWordLetters[j], nonWordLetters[i]];
    }

    // Eliminate up to `count` letters
    const toEliminate = nonWordLetters.slice(0, Math.min(count, nonWordLetters.length));
    const eliminateSet = new Set(toEliminate);

    // Store eliminated keys persistently so they survive updateKeyboardState resets
    toEliminate.forEach(ch => _eliminatedKeys.add(ch));

    // Mark them as absent on keyboard
    toEliminate.forEach(ch => {
        keyboardState[ch] = 'absent';
    });
    renderKeyboard();

    const remaining = TR_UPPER.length - toEliminate.length;
    showToast(`Klavye daraltıldı! ${remaining} harf kaldı`, 3000);
}

function checkAutoHint(evaluation) {
    const dc = getDifficultyConfig();
    if (dc.autoHintAfter <= 0) return;
    const isCorrect = evaluation.every(e => e === 'correct');
    if (isCorrect) return;

    _autoHintCount++;
    if (_autoHintCount > 0 && _autoHintCount % dc.autoHintAfter === 0) {
        state.hints++;
        save();
        updateHintDisplay();
        showToast('Bonus ipucu kazandın! (+1)', 2500);
        SFX.hint();
    }
}

// ===== DYNAMIC TILE SIZING =====
function updateTileSize() {
    const maxWidth = Math.min(380, window.innerWidth - 24);
    const gap = 6;
    const size = Math.floor((maxWidth - gap * (WORD_LENGTH - 1)) / WORD_LENGTH);
    const clamped = Math.min(76, Math.max(42, size));
    document.documentElement.style.setProperty('--tile-size', clamped + 'px');
}

// ===== START PUZZLE =====
export function startCityPuzzle(cityId, switchViewFn) {
    const city = CITIES.find(c => c.id === cityId);
    if (!city || !city.words) return;

    applyDifficultySettings();

    // Word length is determined by difficulty level (easy=4, normal=5, hard=6)
    const dc = getDifficultyConfig();
    const wordLength = dc.wordLength || 5;
    let pool;
    const cityWords = city.words;

    if (typeof cityWords === 'object' && !Array.isArray(cityWords)) {
        // New format: { "4": [...], "5": [...], "6": [...] }
        pool = cityWords[wordLength] || cityWords[String(wordLength)] || [];
        // Fallback to 5-letter if chosen length has no words for this city
        if (pool.length === 0 && wordLength !== 5) {
            pool = cityWords[5] || cityWords['5'] || [];
        }
    } else if (Array.isArray(cityWords) && cityWords.length > 0) {
        // Legacy format: flat array of 5-letter words
        pool = cityWords;
    } else {
        return;
    }
    if (pool.length === 0) return;

    // Set dynamic word length
    setWordLength(wordLength);
    setActiveLength(wordLength);

    // Pick word from difficulty-filtered pool
    const wordPool = getWordPoolForCity(pool);
    if (wordPool.length === 0) return;
    const word = wordPool[Math.floor(Math.random() * wordPool.length)];

    state.activeCityId = cityId;
    state.activeCityWord = word;
    state.activeCityGuesses = [];
    state.activeCityWordLength = wordLength;
    state.hintUsedThisGame = false;
    _autoHintCount = 0;
    clearGuessTimer();
    currentInput = '';
    currentPuzzleComplete = false;
    keyboardState = {};
    _gridBuilt = false;
    _revealedPositions.clear();
    _greenCarryPositions.clear();
    _eliminatedKeys.clear();
    clearEvalCache();

    document.getElementById('puzzle-city-name').textContent = city.name;
    const regionData = REGIONS.find(r => r.id === city.region);
    document.getElementById('puzzle-region-name').textContent = regionData ? regionData.name : '';

    // Update word length badge
    const lengthBadge = document.getElementById('puzzle-word-length');
    if (lengthBadge) lengthBadge.textContent = `${wordLength} harf`;

    updateTileSize();
    renderGrid();
    renderKeyboard();
    updateHintDisplay();

    switchViewFn('puzzle');
    SFX.resume();

    // Easy mode: eliminate some keys + reveal letters
    eliminateInitialKeys();
    setTimeout(() => revealStartingLetters(), 500);
}

export function startDailyPuzzle(switchViewFn) {
    const today = getTodayStr();

    if (state.dailyDate === today && state.dailyComplete) {
        showToast('Bugünkü bulmacayı zaten tamamladın!');
        return;
    }

    applyDifficultySettings();

    // Word length determined by difficulty (easy=4, normal=5, hard=6)
    const dc = getDifficultyConfig();
    const wordLength = dc.wordLength || 5;

    const dailyData = getDailyWord(wordLength);
    if (!dailyData || !dailyData.word) {
        showToast('Kelime verisi yüklenemedi!');
        return;
    }
    setWordLength(wordLength);
    setActiveLength(wordLength);

    if (state.dailyDate !== today) {
        state.dailyDate = today;
        state.dailyGuesses = [];
        state.dailyComplete = false;
        state.dailyWon = false;
        state.dailyWord = dailyData.word;
        state.dailyWordLength = wordLength;
    }

    state.activeCityId = null;
    state.activeCityWord = state.dailyWord;
    state.activeCityGuesses = state.dailyGuesses;
    state.hintUsedThisGame = false;
    _autoHintCount = 0;
    clearGuessTimer();
    currentInput = '';
    currentPuzzleComplete = state.dailyComplete;
    keyboardState = {};
    _gridBuilt = false;
    _revealedPositions.clear();
    _greenCarryPositions.clear();
    _eliminatedKeys.clear();
    clearEvalCache();

    // Restore word length from saved state (for returning to an in-progress daily)
    if (state.dailyWordLength && state.dailyDate === today) {
        setWordLength(state.dailyWordLength);
        setActiveLength(state.dailyWordLength);
    }

    updateKeyboardState();

    document.getElementById('puzzle-city-name').textContent = 'Günlük Bulmaca';
    document.getElementById('puzzle-region-name').textContent = `#${getDayNumber()}`;

    // Update word length badge
    const lengthBadge = document.getElementById('puzzle-word-length');
    if (lengthBadge) lengthBadge.textContent = `${WORD_LENGTH} harf`;

    updateTileSize();
    renderGrid();
    renderKeyboard();
    updateHintDisplay();

    switchViewFn('puzzle');
    SFX.resume();

    // Easy mode: eliminate some keys + reveal letters (only for new puzzles)
    if (!state.dailyComplete && state.dailyGuesses.length === 0) {
        eliminateInitialKeys();
        setTimeout(() => revealStartingLetters(), 500);
    }
}

// Register city click callback
setOnCityClickCallback((cityId) => {
    startCityPuzzle(cityId, switchView);
});

// switchView reference (will be set from app.js)
let switchView = () => {};
export function setSwitchViewFn(fn) { switchView = fn; }

// ===== CHALLENGE PUZZLE =====
export function startChallengePuzzle(challengeData, switchViewFn) {
    if (!challengeData || !challengeData.word) return;

    const word = challengeData.word;
    const wordLen = challengeData.wordLength || [...word].length;

    applyDifficultySettings();
    setWordLength(wordLen);
    setActiveLength(wordLen);

    state.activeCityId = null;
    state.activeCityWord = word;
    state.activeCityGuesses = [];
    state.activeCityWordLength = wordLen;
    state.hintUsedThisGame = false;
    _autoHintCount = 0;
    clearGuessTimer();
    currentInput = '';
    currentPuzzleComplete = false;
    keyboardState = {};
    _gridBuilt = false;
    _revealedPositions.clear();
    _greenCarryPositions.clear();
    _eliminatedKeys.clear();
    clearEvalCache();

    document.getElementById('puzzle-city-name').textContent = '⚔️ Meydan Okuma';
    document.getElementById('puzzle-region-name').textContent = `#${challengeData.challengeId}`;

    const lengthBadge = document.getElementById('puzzle-word-length');
    if (lengthBadge) lengthBadge.textContent = `${wordLen} harf`;

    updateTileSize();
    renderGrid();
    renderKeyboard();
    updateHintDisplay();

    switchViewFn('puzzle');
    SFX.resume();

    eliminateInitialKeys();
    setTimeout(() => revealStartingLetters(), 500);
}
