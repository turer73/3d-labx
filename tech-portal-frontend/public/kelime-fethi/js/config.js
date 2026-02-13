// ============================================================
// KELIME FETHI v2.0 — Configuration & Constants
// ============================================================

// Dynamic WORD_LENGTH — set per-puzzle via setWordLength()
export let WORD_LENGTH = 5;
export function setWordLength(n) { WORD_LENGTH = n; }

// Word length score multiplier (longer = harder = more points)
export const LENGTH_SCORE_MULTIPLIER = { 4: 0.8, 5: 1.0, 6: 1.3 };
export const SAVE_KEY = 'kelime_fethi_save_v1';
export const CLOUD_API = 'https://tech-portal-api.turgut-d01.workers.dev/api/game';
export const PLAYER_ID_KEY = 'kelime_fethi_player_id';

// Difficulty settings
export const DIFFICULTY = {
    easy:   { maxGuesses: 6, startHints: 5, revealLetters: 1, eliminateKeys: 10, consolationScore: 25, autoHintAfter: 2, hardModeForced: false, wordPool: 'easy', wordLength: 4, guessTimerSec: 10 },
    normal: { maxGuesses: 6, startHints: 3, revealLetters: 0, eliminateKeys: 0,  consolationScore: 0,  autoHintAfter: 0, hardModeForced: false, wordPool: 'daily', wordLength: 5, guessTimerSec: 0 },
    hard:   { maxGuesses: 6, startHints: 1, revealLetters: 0, eliminateKeys: 0,  consolationScore: 0,  autoHintAfter: 0, hardModeForced: true,  wordPool: 'all',   wordLength: 6, guessTimerSec: 0 },
};
export const DEFAULT_DIFFICULTY = 'easy';

// Dynamic MAX_GUESSES — use getDifficultyConfig().maxGuesses instead of this constant
export let MAX_GUESSES = 6;
export function setMaxGuesses(n) { MAX_GUESSES = n; }

// Score per guess count (variable reward — fewer guesses = more points)
export const SCORE_TABLE = { 1: 500, 2: 400, 3: 300, 4: 200, 5: 150, 6: 100 };

// Streak rewards
export const STREAK_REWARDS = {
    3: { hints: 1, message: '🔥 3 gün serisi! +1 ipucu kazandın!' },
    5: { hints: 2, message: '🔥🔥 5 gün serisi! +2 ipucu kazandın!' },
    7: { hints: 3, message: '🔥🔥🔥 7 gün serisi! +3 ipucu ve özel rozet!' },
    14: { hints: 3, message: '⭐ 14 gün serisi! +3 ipucu ve altın rozet!' },
    30: { hints: 5, message: '👑 30 gün serisi! +5 ipucu ve efsane rozet!' },
};

// Region colors
export const REGION_COLORS = {
    marmara:    { base: '#818cf8', conquered: '#6366f1', hover: '#a5b4fc' },
    ege:        { base: '#a78bfa', conquered: '#8b5cf6', hover: '#c4b5fd' },
    akdeniz:    { base: '#f472b6', conquered: '#ec4899', hover: '#f9a8d4' },
    'ic-anadolu': { base: '#fb923c', conquered: '#f97316', hover: '#fdba74' },
    karadeniz:  { base: '#2dd4bf', conquered: '#14b8a6', hover: '#5eead4' },
    dogu:       { base: '#38bdf8', conquered: '#0ea5e9', hover: '#7dd3fc' },
    guneydogu:  { base: '#facc15', conquered: '#eab308', hover: '#fde047' },
};

// Tutorial steps
export const TUTORIAL_STEPS = [
    {
        title: "Kelime Fethi'ne Hoş Geldin! 🗺️",
        text: 'Türkiye haritasında 81 şehri kelime bulmacalarıyla fethet!',
        icon: '🗺️',
    },
    {
        title: 'Nasıl Oynanır? ✍️',
        text: 'Haritadan bir şehir seç → kelimeyi bul!\nKolay=4 harf, Normal=5 harf, Zor=6 harf.',
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
