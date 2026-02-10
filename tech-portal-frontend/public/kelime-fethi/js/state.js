// ============================================================
// KELIME FETHI v2.0 — Game State Management
// ============================================================

import { SAVE_KEY, PLAYER_ID_KEY } from './config.js';
import { SFX } from './sound.js';
import { Haptic } from './haptic.js';

export const DEFAULT_STATE = {
    score: 0,
    totalScore: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    hints: 3,
    dailyDate: null,
    dailyGuesses: [],
    dailyComplete: false,
    dailyWon: false,
    dailyWord: null,
    conqueredCities: {},
    activeCityId: null,
    activeCityGuesses: [],
    activeCityWord: null,
    guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    lastPlayDate: null,
    hardMode: false,
    soundEnabled: true,
    hapticEnabled: true,
    tutorialDone: false,
    startTime: Date.now(),
    lastSave: Date.now(),
    achievements: {},
    noHintWins: 0,
    quickWins: 0,
    hintUsedThisGame: false,
    colorblindMode: false,
    streakFreezeCount: 0,
    lastStreakFreeze: null,
    version: '2.1',
};

// Reactive state with deep clone
export let state = JSON.parse(JSON.stringify(DEFAULT_STATE));

export function resetState() {
    // Clear all properties and repopulate from defaults
    // (keeps same object reference for other modules)
    for (const key in state) {
        delete state[key];
    }
    const fresh = JSON.parse(JSON.stringify(DEFAULT_STATE));
    Object.assign(state, fresh);
    return state;
}

// Replace entire state (for cloud load)
export function replaceState(newState) {
    for (const key in newState) {
        if (newState[key] !== undefined) state[key] = newState[key];
    }
    ensureStateIntegrity();
    SFX.enabled = state.soundEnabled;
    Haptic.enabled = state.hapticEnabled;
}

function ensureStateIntegrity() {
    // Merge missing keys from DEFAULT_STATE (forward-compatible)
    for (const key in DEFAULT_STATE) {
        if (state[key] === undefined || state[key] === null) {
            state[key] = JSON.parse(JSON.stringify(DEFAULT_STATE[key]));
        }
    }

    // Type safety — numbers
    const nums = ['score', 'totalScore', 'gamesPlayed', 'gamesWon', 'currentStreak', 'maxStreak', 'hints'];
    nums.forEach(k => { if (typeof state[k] !== 'number' || isNaN(state[k])) state[k] = DEFAULT_STATE[k]; });

    // Clamp negative values
    if (state.hints < 0) state.hints = 0;
    if (state.currentStreak < 0) state.currentStreak = 0;

    // Type safety — booleans
    const bools = ['hardMode', 'soundEnabled', 'hapticEnabled', 'tutorialDone', 'dailyComplete', 'dailyWon'];
    bools.forEach(k => { if (typeof state[k] !== 'boolean') state[k] = DEFAULT_STATE[k]; });

    // Type safety — objects/arrays
    if (!state.conqueredCities || typeof state.conqueredCities !== 'object') state.conqueredCities = {};
    if (!state.guessDistribution || typeof state.guessDistribution !== 'object') {
        state.guessDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    }
    if (!Array.isArray(state.dailyGuesses)) state.dailyGuesses = [];
    if (!Array.isArray(state.activeCityGuesses)) state.activeCityGuesses = [];
    if (!state.achievements || typeof state.achievements !== 'object') state.achievements = {};

    // Ensure new numeric fields
    ['noHintWins', 'quickWins', 'streakFreezeCount'].forEach(k => {
        if (typeof state[k] !== 'number' || isNaN(state[k])) state[k] = 0;
    });
    if (typeof state.hintUsedThisGame !== 'boolean') state.hintUsedThisGame = false;
    if (typeof state.colorblindMode !== 'boolean') state.colorblindMode = false;

    // Version migration
    if (state.version !== '2.1') {
        state.version = '2.1';
        console.log('[KF] State migrated to v2.1');
    }
}

export function save() {
    state.lastSave = Date.now();
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) { console.warn('[KF] Save failed', e); }
}

export function loadSave() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return false;
        const saved = JSON.parse(raw);
        replaceState(saved);
        return true;
    } catch (e) {
        console.warn('[KF] Load failed:', e);
        return false;
    }
}

export function getPlayerId() {
    let id = localStorage.getItem(PLAYER_ID_KEY);
    if (!id) {
        id = 'kf_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 10);
        localStorage.setItem(PLAYER_ID_KEY, id);
    }
    return id;
}
