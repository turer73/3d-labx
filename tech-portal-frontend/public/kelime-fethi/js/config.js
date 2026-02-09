// ============================================================
// KELIME FETHI v2.0 — Configuration & Constants
// ============================================================

export const MAX_GUESSES = 6;
export const WORD_LENGTH = 5;
export const SAVE_KEY = 'kelime_fethi_save_v1';
export const CLOUD_API = 'https://tech-portal-api.turgut-d01.workers.dev/api/game';
export const PLAYER_ID_KEY = 'kelime_fethi_player_id';

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
