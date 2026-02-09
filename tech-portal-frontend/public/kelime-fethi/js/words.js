// ============================================================
// KELIME FETHI v2.0 — Word Evaluation & Validation
// ============================================================

import { WORD_LENGTH, MAX_GUESSES } from './config.js';
import { trUpper, trLen } from './utils.js';
import { state } from './state.js';

// Game data (loaded from JSON)
export let WORDS = [];
export let DAILY_WORDS = [];
export let CITIES = [];
export let REGIONS = [];
export let TURKEY_MAP = {};

// FIX: Use Set for O(1) word lookup instead of Array.includes O(n)
let WORD_SET = new Set();

export async function loadGameData() {
    try {
        const [wordsRes, citiesRes] = await Promise.all([
            fetch('./data/words.json'),
            fetch('./data/cities.json'),
        ]);

        if (wordsRes.ok) {
            const wordsData = await wordsRes.json();
            WORDS = wordsData.words || [];
            DAILY_WORDS = wordsData.daily || [];
            WORD_SET = new Set(WORDS); // Create Set for fast lookup
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

// Wordle evaluation algorithm
export function evaluateGuess(guess, target) {
    const result = new Array(WORD_LENGTH).fill('absent');
    const guessArr = [...guess];
    const targetArr = [...target];
    const targetUsed = new Array(WORD_LENGTH).fill(false);
    const guessUsed = new Array(WORD_LENGTH).fill(false);

    // Pass 1: correct positions (green)
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessArr[i] === targetArr[i]) {
            result[i] = 'correct';
            targetUsed[i] = true;
            guessUsed[i] = true;
        }
    }

    // Pass 2: present but wrong position (yellow)
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

// FIX: O(1) word validation with Set
export function isValidWord(word) {
    return WORD_SET.has(word);
}

export function validateGuess(guess) {
    if (trLen(guess) !== WORD_LENGTH) {
        return { valid: false, message: '5 harfli bir kelime girin!' };
    }
    if (!isValidWord(guess)) {
        return { valid: false, message: 'Bu kelime sözlükte yok!' };
    }

    // Hard mode validation
    if (state.hardMode && state.activeCityGuesses.length > 0) {
        const guessArr = [...guess];
        const requiredPositions = {};
        const requiredLetters = {};

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

            for (const [letter, count] of Object.entries(letterCounts)) {
                requiredLetters[letter] = Math.max(requiredLetters[letter] || 0, count);
            }
        }

        for (const [pos, letter] of Object.entries(requiredPositions)) {
            if (guessArr[parseInt(pos)] !== letter) {
                return { valid: false, message: `${parseInt(pos)+1}. harf ${letter} olmalı!` };
            }
        }

        for (const [letter, minCount] of Object.entries(requiredLetters)) {
            const actualCount = guessArr.filter(c => c === letter).length;
            if (actualCount < minCount) {
                return { valid: false, message: `${letter} harfi kullanılmalı!` };
            }
        }
    }

    return { valid: true };
}

// Daily word selection
export function getDailyWord() {
    if (DAILY_WORDS.length === 0) return null;
    const dateStr = new Date().toISOString().slice(0, 10);
    let seed = 0;
    for (let i = 0; i < dateStr.length; i++) {
        seed = ((seed << 5) - seed) + dateStr.charCodeAt(i);
        seed = seed & seed;
    }
    seed = Math.abs(seed);
    return DAILY_WORDS[seed % DAILY_WORDS.length];
}

export function getTodayStr() {
    return new Date().toISOString().slice(0, 10);
}

export function getDayNumber() {
    const start = new Date('2025-01-01');
    const today = new Date(getTodayStr());
    return Math.floor((today - start) / (1000 * 60 * 60 * 24));
}
