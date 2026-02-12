// ============================================================
// KELIME FETHI v2.0 — Word Evaluation & Validation
// ============================================================

import { WORD_LENGTH, MAX_GUESSES } from './config.js';
import { trUpper, trLen } from './utils.js';
import { state, getDifficultyConfig } from './state.js';

// Game data (loaded from JSON)
export let WORDS = [];
export let DAILY_WORDS = [];
export let CITIES = [];
export let REGIONS = [];
export let TURKEY_MAP = {};

// FIX: Use Set for O(1) word lookup instead of Array.includes O(n)
let WORD_SET = new Set();
let EASY_WORDS = []; // Subset: common/daily words for easy mode

// Multi-length word data stores
export let WORDS_BY_LENGTH = { 4: [], 5: [], 6: [] };
export let DAILY_BY_LENGTH = { 4: [], 5: [], 6: [] };
export let EASY_BY_LENGTH = { 4: [], 5: [], 6: [] };
export let WORD_SET_BY_LENGTH = { 4: new Set(), 5: new Set(), 6: new Set() };

// Switch active word lists to a specific length
export function setActiveLength(len) {
    WORDS = WORDS_BY_LENGTH[len] || WORDS_BY_LENGTH[5];
    DAILY_WORDS = DAILY_BY_LENGTH[len] || DAILY_BY_LENGTH[5];
    EASY_WORDS = EASY_BY_LENGTH[len] || EASY_BY_LENGTH[5];
    WORD_SET = WORD_SET_BY_LENGTH[len] || WORD_SET_BY_LENGTH[5];
}

// ===== Offline Data Cache =====
const DATA_CACHE_KEY = 'kf_data_cache';

function cacheGameData(wordsData, citiesData) {
    try {
        localStorage.setItem(DATA_CACHE_KEY, JSON.stringify({
            words: wordsData,
            cities: citiesData,
            cachedAt: Date.now()
        }));
    } catch (e) { /* localStorage full — ignore */ }
}

function loadCachedData() {
    try {
        const raw = localStorage.getItem(DATA_CACHE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) { return null; }
}

export async function loadGameData() {
    let wordsData = null;
    let citiesData = null;

    try {
        const [wordsRes, citiesRes] = await Promise.all([
            fetch('./data/words.json'),
            fetch('./data/cities.json'),
        ]);

        if (wordsRes.ok) {
            wordsData = await wordsRes.json();
        }
        if (citiesRes.ok) {
            citiesData = await citiesRes.json();
        }

        // Cache successful fetch for offline use
        if (wordsData && citiesData) {
            cacheGameData(wordsData, citiesData);
        }
    } catch (e) {
        console.warn('[Kelime Fethi] Ağ hatası, önbellek deneniyor...', e.message);
    }

    // Fallback to cached data if fetch failed
    if (!wordsData || !citiesData) {
        const cached = loadCachedData();
        if (cached) {
            if (!wordsData) wordsData = cached.words;
            if (!citiesData) citiesData = cached.cities;
            console.log('[Kelime Fethi] Önbellekten yüklendi');
        }
    }

    // Apply data
    if (wordsData) {
        if (wordsData.version >= 5 && wordsData.words4) {
            // v5 flat format: words4/daily4/easy4, words5/..., words6/...
            for (const len of [4, 5, 6]) {
                const wKey = `words${len}`, dKey = `daily${len}`, eKey = `easy${len}`;
                WORDS_BY_LENGTH[len] = wordsData[wKey] || [];
                DAILY_BY_LENGTH[len] = wordsData[dKey] || [];
                EASY_BY_LENGTH[len] = wordsData[eKey] || wordsData[dKey] || [];
                WORD_SET_BY_LENGTH[len] = new Set(WORDS_BY_LENGTH[len]);
            }
            setActiveLength(5);
            const total = Object.values(WORDS_BY_LENGTH).reduce((s, a) => s + a.length, 0);
            console.log(`[Kelime Fethi] v5 format: ${total} kelime (4h:${WORDS_BY_LENGTH[4].length}, 5h:${WORDS_BY_LENGTH[5].length}, 6h:${WORDS_BY_LENGTH[6].length})`);
        } else if (wordsData.lengths) {
            // v5 nested format (alternate): lengths.4.words, lengths.5.words, etc.
            for (const len of [4, 5, 6]) {
                const d = wordsData.lengths[len] || wordsData.lengths[String(len)];
                if (d) {
                    WORDS_BY_LENGTH[len] = d.words || [];
                    DAILY_BY_LENGTH[len] = d.daily || [];
                    EASY_BY_LENGTH[len] = d.easy || d.daily || [];
                    WORD_SET_BY_LENGTH[len] = new Set(d.words);
                }
            }
            setActiveLength(5);
            const total = Object.values(WORDS_BY_LENGTH).reduce((s, a) => s + a.length, 0);
            console.log(`[Kelime Fethi] v5 nested: ${total} kelime (4h:${WORDS_BY_LENGTH[4].length}, 5h:${WORDS_BY_LENGTH[5].length}, 6h:${WORDS_BY_LENGTH[6].length})`);
        } else {
            // Legacy v4 format — all 5-letter
            WORDS = wordsData.words || [];
            DAILY_WORDS = wordsData.daily || [];
            EASY_WORDS = wordsData.easy || DAILY_WORDS;
            WORD_SET = new Set(WORDS);
            // Also populate multi-length stores for backward compat
            WORDS_BY_LENGTH[5] = WORDS;
            DAILY_BY_LENGTH[5] = DAILY_WORDS;
            EASY_BY_LENGTH[5] = EASY_WORDS;
            WORD_SET_BY_LENGTH[5] = WORD_SET;
            console.log(`[Kelime Fethi] v4 format: ${WORDS.length} kelime, ${DAILY_WORDS.length} günlük, ${EASY_WORDS.length} kolay`);
        }
    } else {
        console.error('[Kelime Fethi] Kelime verisi yüklenemedi! Çevrimdışı ve önbellek boş.');
    }

    if (citiesData) {
        CITIES = citiesData.cities || [];
        REGIONS = citiesData.regions || [];
        console.log(`[Kelime Fethi] ${CITIES.length} şehir, ${REGIONS.length} bölge yüklendi`);
    } else {
        console.error('[Kelime Fethi] Şehir verisi yüklenemedi!');
    }
}

// Wordle evaluation algorithm with memoization
const _evalCache = new Map();
const EVAL_CACHE_MAX = 500;

export function evaluateGuess(guess, target) {
    const key = guess + '|' + target;
    if (_evalCache.has(key)) return _evalCache.get(key);

    // Derive length from actual word (supports 4, 5, 6 letters)
    const guessArr = [...guess];
    const targetArr = [...target];
    const len = targetArr.length;
    const result = new Array(len).fill('absent');
    const targetUsed = new Array(len).fill(false);
    const guessUsed = new Array(len).fill(false);

    // Pass 1: correct positions (green)
    for (let i = 0; i < len; i++) {
        if (guessArr[i] === targetArr[i]) {
            result[i] = 'correct';
            targetUsed[i] = true;
            guessUsed[i] = true;
        }
    }

    // Pass 2: present but wrong position (yellow)
    for (let i = 0; i < len; i++) {
        if (guessUsed[i]) continue;
        for (let j = 0; j < len; j++) {
            if (targetUsed[j]) continue;
            if (guessArr[i] === targetArr[j]) {
                result[i] = 'present';
                targetUsed[j] = true;
                break;
            }
        }
    }

    // Cache result (evict oldest if full)
    if (_evalCache.size >= EVAL_CACHE_MAX) {
        const firstKey = _evalCache.keys().next().value;
        _evalCache.delete(firstKey);
    }
    _evalCache.set(key, result);

    return result;
}

// Clear eval cache (on new puzzle)
export function clearEvalCache() {
    _evalCache.clear();
}

// FIX: O(1) word validation with Set
export function isValidWord(word) {
    return WORD_SET.has(word);
}

export function validateGuess(guess) {
    if (trLen(guess) !== WORD_LENGTH) {
        return { valid: false, message: `${WORD_LENGTH} harfli bir kelime girin!` };
    }
    if (!isValidWord(guess)) {
        return { valid: false, message: 'Bu kelime sözlükte yok!' };
    }

    // Hard mode validation (forced in hard difficulty)
    const dc = getDifficultyConfig();
    const hardActive = (state.hardMode || dc.hardModeForced) && state.activeCityGuesses.length > 0;
    if (hardActive) {
        const guessArr = [...guess];
        const requiredPositions = {};
        const requiredLetters = {};

        for (const prevGuess of state.activeCityGuesses) {
            const prevEval = evaluateGuess(prevGuess, state.activeCityWord);
            const prevArr = [...prevGuess];
            const letterCounts = {};

            const evalLen = prevEval.length;
            for (let i = 0; i < evalLen; i++) {
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

// Türkiye saatine göre bugünün tarihi (UTC+3 — TRT)
export function getTodayStr() {
    const now = new Date();
    const trTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    return trTime.toISOString().slice(0, 10);
}

export function getDayNumber() {
    const start = new Date('2025-01-01T00:00:00Z');
    const today = new Date(getTodayStr() + 'T00:00:00Z');
    return Math.floor((today - start) / (1000 * 60 * 60 * 24));
}

// Seeded pseudo-random number generator (Mulberry32)
function mulberry32(seed) {
    return function() {
        seed |= 0; seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

// Generate a deterministic permutation for a given cycle
// Ensures no repeats within poolSize days
function getDailyPermutation(cycleNum, poolSize) {
    const n = poolSize || DAILY_WORDS.length;
    const indices = Array.from({ length: n }, (_, i) => i);
    // Seed based on cycle number — different permutation each cycle
    const rng = mulberry32(cycleNum * 7919 + 42);
    // Fisher-Yates shuffle with seeded RNG
    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
}

// Get word pool based on difficulty
export function getWordPoolForCity(cityWords) {
    const dc = getDifficultyConfig();
    if (dc.wordPool === 'easy') {
        // Filter city words to only common/easy ones; fallback to full pool if too few
        const easySet = new Set(EASY_WORDS);
        const filtered = cityWords.filter(w => easySet.has(w));
        return filtered.length >= 3 ? filtered : cityWords;
    }
    return cityWords;
}

// Daily word length pattern — most days 5, some 4 or 6
const DAILY_LENGTH_PATTERN = [5, 5, 5, 4, 5, 5, 6];

// Get today's daily word length
export function getDailyWordLength() {
    const dayNum = getDayNumber();
    return DAILY_LENGTH_PATTERN[dayNum % DAILY_LENGTH_PATTERN.length];
}

// Daily word selection — permutation-based, no repeats within cycle
// Returns { word, length } object
// forceLength: override word length (used when difficulty determines length)
export function getDailyWord(forceLength) {
    const dayNum = getDayNumber();
    const dailyLen = forceLength || getDailyWordLength();

    // Get pool for this length
    const pool = DAILY_BY_LENGTH[dailyLen];
    if (!pool || pool.length === 0) {
        // Fallback to 5-letter
        if (DAILY_WORDS.length === 0) return null;
        const n = DAILY_WORDS.length;
        const cycleNum = Math.floor(dayNum / n);
        const dayInCycle = dayNum % n;
        const perm = getDailyPermutation(cycleNum, n);
        return { word: DAILY_WORDS[perm[dayInCycle]], length: 5 };
    }

    const n = pool.length;
    const cycleNum = Math.floor(dayNum / n);
    const dayInCycle = dayNum % n;
    const perm = getDailyPermutation(cycleNum, n);
    return { word: pool[perm[dayInCycle]], length: dailyLen };
}
