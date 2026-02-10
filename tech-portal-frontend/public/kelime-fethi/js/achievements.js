// ============================================================
// KELIME FETHI v2.0 — Achievement / Badge System
// Psikoloji: Endowment Effect + Variable Ratio Reinforcement
// ============================================================

import { state, save } from './state.js';
import { showToast, floatText } from './utils.js';
import { SFX } from './sound.js';
import { getConqueredCount } from './map.js';

// ===== ACHIEVEMENT DEFINITIONS =====
export const ACHIEVEMENTS = [
    // ── Başlangıç ──
    { id: 'first_win',       icon: '🏅', name: 'İlk Zafer',         desc: 'İlk bulmacayı çöz',             tier: 'bronze' },
    { id: 'first_city',      icon: '🏙️', name: 'İlk Fetih',         desc: 'İlk şehri fethet',              tier: 'bronze' },
    { id: 'first_daily',     icon: '📅', name: 'Günlük Başlangıç',  desc: 'İlk günlük bulmacayı tamamla',   tier: 'bronze' },

    // ── Ustalık ──
    { id: 'genius',          icon: '🧠', name: 'Deha',              desc: 'Bir kelimeyi ilk denemede bul',  tier: 'gold' },
    { id: 'no_hint_win',     icon: '💪', name: 'Yardımsız',         desc: 'İpucu kullanmadan 10 oyun kazan', tier: 'silver' },
    { id: 'speed_demon',     icon: '⚡', name: 'Hız Şeytanı',      desc: '3 denemede 5 bulmaca çöz',       tier: 'silver' },
    { id: 'perfect_week',    icon: '✨', name: 'Mükemmel Hafta',    desc: '7 günlük bulmacayı üst üste kazan', tier: 'gold' },

    // ── Fetih ──
    { id: 'conquer_5',       icon: '⚔️', name: 'Fatih',             desc: '5 şehir fethet',                 tier: 'bronze' },
    { id: 'conquer_20',      icon: '🗡️', name: 'Komutan',           desc: '20 şehir fethet',                tier: 'silver' },
    { id: 'conquer_50',      icon: '👑', name: 'Sultan',            desc: '50 şehir fethet',                tier: 'gold' },
    { id: 'conquer_81',      icon: '🏆', name: 'Cihan Padişahı',   desc: 'Tüm 81 şehri fethet',           tier: 'diamond' },
    { id: 'region_complete', icon: '🌍', name: 'Bölge Hakimi',     desc: 'Bir bölgedeki tüm şehirleri fethet', tier: 'silver' },

    // ── Seri ──
    { id: 'streak_3',        icon: '🔥', name: 'Ateş Başlangıcı',  desc: '3 günlük seri yap',              tier: 'bronze' },
    { id: 'streak_7',        icon: '🔥', name: 'Haftalık Ateş',    desc: '7 günlük seri yap',              tier: 'silver' },
    { id: 'streak_30',       icon: '🔥', name: 'Ateş Ustası',      desc: '30 günlük seri yap',             tier: 'gold' },
    { id: 'streak_100',      icon: '💎', name: 'Efsane',            desc: '100 günlük seri yap',            tier: 'diamond' },

    // ── Puan ──
    { id: 'score_1000',      icon: '⭐', name: 'Yıldız',           desc: '1.000 puan topla',               tier: 'bronze' },
    { id: 'score_5000',      icon: '🌟', name: 'Süper Yıldız',     desc: '5.000 puan topla',               tier: 'silver' },
    { id: 'score_20000',     icon: '💫', name: 'Galaktik',          desc: '20.000 puan topla',              tier: 'gold' },

    // ── Gizli ──
    { id: 'lucky_bonus',     icon: '🍀', name: 'Şanslı',           desc: 'Bonus kelime yakala',            tier: 'gold',   hidden: true },
    { id: 'comeback_kid',    icon: '🦾', name: 'Geri Dönüş',       desc: 'Son denemede bil',               tier: 'silver', hidden: true },
];

// Tier priority for sorting
const TIER_ORDER = { diamond: 0, gold: 1, silver: 2, bronze: 3 };

// ===== CHECK ACHIEVEMENTS =====
export function checkAchievements(context = {}) {
    if (!state.achievements) state.achievements = {};

    const newlyUnlocked = [];

    const checks = {
        first_win:       () => state.gamesWon >= 1,
        first_city:      () => getConqueredCount() >= 1,
        first_daily:     () => state.dailyWon === true,
        genius:          () => context.guessCount === 1,
        no_hint_win:     () => (state.noHintWins || 0) >= 10,
        speed_demon:     () => (state.quickWins || 0) >= 5,
        perfect_week:    () => state.currentStreak >= 7 && state.dailyWon,
        conquer_5:       () => getConqueredCount() >= 5,
        conquer_20:      () => getConqueredCount() >= 20,
        conquer_50:      () => getConqueredCount() >= 50,
        conquer_81:      () => getConqueredCount() >= 81,
        region_complete: () => context.regionComplete === true,
        streak_3:        () => state.currentStreak >= 3,
        streak_7:        () => state.currentStreak >= 7,
        streak_30:       () => state.currentStreak >= 30,
        streak_100:      () => state.currentStreak >= 100,
        score_1000:      () => state.totalScore >= 1000,
        score_5000:      () => state.totalScore >= 5000,
        score_20000:     () => state.totalScore >= 20000,
        lucky_bonus:     () => context.hasBonus === true,
        comeback_kid:    () => context.guessCount === 6 && context.won === true,
    };

    for (const achievement of ACHIEVEMENTS) {
        if (state.achievements[achievement.id]) continue; // Already unlocked

        const checkFn = checks[achievement.id];
        if (checkFn && checkFn()) {
            state.achievements[achievement.id] = {
                unlockedAt: Date.now(),
                date: new Date().toISOString().split('T')[0],
            };
            newlyUnlocked.push(achievement);
        }
    }

    if (newlyUnlocked.length > 0) {
        save();
        // Show notifications with stagger
        newlyUnlocked.forEach((ach, i) => {
            setTimeout(() => showAchievementNotification(ach), i * 1800);
        });
    }

    return newlyUnlocked;
}

// ===== NOTIFICATION =====
function showAchievementNotification(achievement) {
    SFX.streakReward();

    // Create achievement popup
    const popup = document.createElement('div');
    popup.className = `achievement-popup achievement-${achievement.tier}`;
    popup.innerHTML = `
        <div class="ach-popup-icon">${achievement.icon}</div>
        <div class="ach-popup-info">
            <div class="ach-popup-label">Başarım Açıldı!</div>
            <div class="ach-popup-name">${achievement.name}</div>
            <div class="ach-popup-desc">${achievement.desc}</div>
        </div>
    `;

    document.body.appendChild(popup);

    // Animate in
    requestAnimationFrame(() => popup.classList.add('show'));

    // Remove after delay
    setTimeout(() => {
        popup.classList.remove('show');
        popup.classList.add('hiding');
        setTimeout(() => popup.remove(), 500);
    }, 3500);
}

// ===== RENDER ACHIEVEMENTS LIST =====
export function renderAchievements() {
    const container = document.getElementById('achievements-list');
    if (!container) return;

    if (!state.achievements) state.achievements = {};

    container.innerHTML = '';

    // Sort: unlocked first (by date), then locked (by tier)
    const sorted = [...ACHIEVEMENTS].sort((a, b) => {
        const aUnlocked = !!state.achievements[a.id];
        const bUnlocked = !!state.achievements[b.id];

        if (aUnlocked && !bUnlocked) return -1;
        if (!aUnlocked && bUnlocked) return 1;

        if (aUnlocked && bUnlocked) {
            return state.achievements[a.id].unlockedAt - state.achievements[b.id].unlockedAt;
        }

        return (TIER_ORDER[a.tier] || 3) - (TIER_ORDER[b.tier] || 3);
    });

    const unlockedCount = ACHIEVEMENTS.filter(a => state.achievements[a.id]).length;
    const totalVisible = ACHIEVEMENTS.filter(a => !a.hidden || state.achievements[a.id]).length;

    // Progress header
    const header = document.createElement('div');
    header.className = 'ach-progress-header';
    header.innerHTML = `
        <span class="ach-count">${unlockedCount}/${totalVisible}</span>
        <div class="ach-progress-bar">
            <div class="ach-progress-fill" style="width:${(unlockedCount / totalVisible) * 100}%"></div>
        </div>
    `;
    container.appendChild(header);

    sorted.forEach(ach => {
        const unlocked = !!state.achievements[ach.id];
        const isHidden = ach.hidden && !unlocked;

        const el = document.createElement('div');
        el.className = `ach-item ach-${ach.tier}${unlocked ? ' unlocked' : ''}${isHidden ? ' hidden-ach' : ''}`;
        el.innerHTML = `
            <div class="ach-icon">${isHidden ? '❓' : ach.icon}</div>
            <div class="ach-info">
                <div class="ach-name">${isHidden ? '???' : ach.name}</div>
                <div class="ach-desc">${isHidden ? 'Gizli başarım' : ach.desc}</div>
            </div>
            ${unlocked ? '<div class="ach-check">✅</div>' : ''}
        `;
        container.appendChild(el);
    });
}

// ===== HELPER: Track no-hint wins =====
export function trackNoHintWin(usedHint) {
    if (!usedHint) {
        state.noHintWins = (state.noHintWins || 0) + 1;
    }
}

// ===== HELPER: Track quick wins (≤3 guesses) =====
export function trackQuickWin(guessCount) {
    if (guessCount <= 3) {
        state.quickWins = (state.quickWins || 0) + 1;
    }
}
