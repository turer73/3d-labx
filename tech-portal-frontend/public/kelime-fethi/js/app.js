// ============================================================
// KELIME FETHI v4.0 — Main Application Entry
// Modular Architecture + Social Layer
// ============================================================

import { state, save, loadSave, resetState, getDifficultyConfig, getPlayerId } from './state.js';
import { DIFFICULTY } from './config.js';
import { SFX } from './sound.js';
import { Haptic } from './haptic.js';
import { Particles } from './particles.js';
import { showToast } from './utils.js';
import { loadGameData, TURKEY_MAP, getDayNumber } from './words.js';
import { renderMap, updateMapProgress, initRegionSelector, initMapZoom, initRegionTracking, checkRegionUnlock } from './map.js';
import { updateStats } from './stats.js';
import { CloudSave } from './cloud.js';
import { initPhysicalKeyboard, initVirtualKeyboard, initSwipeKeyboard } from './keyboard.js';
import {
    startDailyPuzzle, startCityPuzzle, useHint, shareResult, hideResultOverlay,
    updateHintDisplay, setSwitchViewFn, setUpdateUICallback, generateShareGrid, startChallengePuzzle,
    skipPuzzle
} from './puzzle.js';
import { showTutorial, nextTutorialStep } from './tutorial.js';
import { getTodayStr as getToday } from './words.js';
import { TURKEY_MAP_DATA } from './turkey-map-data.js';
import { checkAchievements } from './achievements.js';
import { initAds } from './ads.js';
import { fetchDailyLeaderboard, fetchAlltimeLeaderboard, renderDailyLeaderboard, renderAlltimeLeaderboard } from './leaderboard.js';
import { initSocialUI, shareViaWhatsApp, createChallenge, loadChallenge } from './social.js';
import { initNotifications, scheduleDailyReminder } from './notifications.js';

// ===== ANALYTICS =====
function trackEvent(eventName, params) {
    try {
        if (window.dataLayer) {
            window.dataLayer.push({ event: eventName, ...params });
        }
        if (window.gtag) {
            window.gtag('event', eventName, params);
        }
    } catch(e) {}
}

// Export for use in other modules
window._trackEvent = trackEvent;

// ===== ICON INTEGRATION =====
function initIcons() {
    if (typeof window.setIcon !== 'function') return;

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
            window.setIcon(iconEl, iconMap[tab], 20);
        }
    });

    const cloudBtn = document.getElementById('btn-cloud');
    if (cloudBtn) window.setIcon(cloudBtn, 'cloud', 18);

    const soundBtn = document.getElementById('btn-sound');
    if (soundBtn) window.setIcon(soundBtn, 'sound', 18);
}

// ===== VIEW SWITCHING =====
function switchView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

    let targetId;
    if (viewName === 'map') targetId = 'map-view';
    else if (viewName === 'puzzle') targetId = 'puzzle-view';
    else if (viewName === 'stats') targetId = 'stats-view';
    else if (viewName === 'settings') targetId = 'settings-view';
    else if (viewName === 'daily') {
        startDailyPuzzle(switchView);
        return;
    }

    const target = document.getElementById(targetId);
    if (target) target.classList.add('active');

    // Reset scroll position on view switch
    const gameArea = document.getElementById('game-area');
    if (gameArea) gameArea.scrollTop = 0;

    // Disable game-area scrolling when puzzle is active
    if (gameArea) {
        gameArea.style.overflowY = (viewName === 'puzzle') ? 'hidden' : 'auto';
    }

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === viewName);
    });
}

// Register switchView
setSwitchViewFn(switchView);

// ===== UI UPDATE =====
function updateUI() {
    document.getElementById('streak-indicator').textContent = `🔥 ${state.currentStreak}`;
    // Animated streak indicator classes
    const streakEl = document.getElementById('streak-indicator');
    if (streakEl) {
        streakEl.classList.remove('streak-3', 'streak-7', 'streak-14', 'streak-30');
        if (state.currentStreak >= 30) streakEl.classList.add('streak-30');
        else if (state.currentStreak >= 14) streakEl.classList.add('streak-14');
        else if (state.currentStreak >= 7) streakEl.classList.add('streak-7');
        else if (state.currentStreak >= 3) streakEl.classList.add('streak-3');
    }
    document.getElementById('score-display').textContent = `⭐ ${state.totalScore}`;
    updateSoundButton();
    updateHintDisplay();
    updateMapProgress();
    updateDailyCountdown();
    updateStats();

    // Update freeze count display
    const freezeEl = document.getElementById('freeze-count');
    if (freezeEl) freezeEl.textContent = state.streakFreezeCount || 0;

    // Schedule next daily reminder (after game complete, for next day)
    scheduleDailyReminder();
}

// Register updateUI callback
setUpdateUICallback(updateUI);

function updateSoundButton() {
    const btn = document.getElementById('btn-sound');
    if (btn) btn.textContent = SFX.enabled ? '🔊' : '🔇';
}

// ===== COLORBLIND MODE =====
function applyColorblindMode() {
    if (state.colorblindMode) {
        document.body.classList.add('colorblind-mode');
    } else {
        document.body.classList.remove('colorblind-mode');
    }
}

// ===== DAILY COUNTDOWN (Turkey timezone UTC+3) =====
function updateDailyCountdown() {
    const el = document.getElementById('daily-countdown');
    if (!el) return;

    // Calculate time until midnight Turkey time (UTC+3)
    const now = new Date();
    const trNow = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    const trMidnight = new Date(trNow);
    trMidnight.setUTCHours(24, 0, 0, 0); // Next midnight in TR time

    const diff = trMidnight - trNow;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    el.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const dot = document.getElementById('daily-dot');
    if (dot) {
        const today = getToday();
        dot.style.display = (state.dailyDate !== today || !state.dailyComplete) ? 'block' : 'none';
    }
}

// ===== STREAK RECOVERY =====
function checkStreakRecovery() {
    if (state.currentStreak <= 0) return;

    const today = getToday();
    if (!state.lastPlayDate) return;

    const lastDate = new Date(state.lastPlayDate);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

    // If missed exactly 1 day and have freeze available
    if (diffDays === 2 && state.streakFreezeCount > 0) {
        showStreakRecoveryDialog();
    }
}

function showStreakRecoveryDialog() {
    const existing = document.querySelector('.streak-recovery-dialog');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.className = 'overlay';
    backdrop.id = 'streak-recovery-backdrop';

    const dialog = document.createElement('div');
    dialog.className = 'streak-recovery-dialog';
    dialog.innerHTML = `
        <div style="font-size:3rem;margin-bottom:8px;">❄️</div>
        <div class="streak-lost">🔥 ${state.currentStreak} gün</div>
        <h2>Serin Tehlikede!</h2>
        <p>Dünkü bulmacayı kaçırdın! Seri dondurma kullanarak serini koru.</p>
        <p style="font-size:0.75rem;color:var(--text3);">${state.streakFreezeCount} dondurma hakkın var</p>
        <div class="streak-recovery-actions">
            <button class="freeze-btn" id="btn-use-freeze">❄️ Dondur</button>
            <button class="skip-btn" id="btn-skip-freeze">Vazgeç</button>
        </div>
    `;

    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);

    document.getElementById('btn-use-freeze').addEventListener('click', () => {
        state.streakFreezeCount--;
        state.lastStreakFreeze = getToday();
        // Set lastPlayDate to yesterday so the streak continues
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        state.lastPlayDate = yesterday.toISOString().split('T')[0];
        save();
        SFX.freeze();
        showToast('❄️ Seri donduruldu! Serin devam ediyor.', 3000);
        backdrop.remove();
        updateUI();
    });

    document.getElementById('btn-skip-freeze').addEventListener('click', () => {
        backdrop.remove();
    });
}

// ===== DIFFICULTY INFO =====
const DIFFICULTY_INFO = {
    easy: '7 deneme, 1 harf açık, klavye daraltılır, bonus ipucu',
    normal: '6 deneme, 3 ipucu',
    hard: '5 deneme, 1 ipucu, zor mod zorunlu',
};

function updateDifficultyUI() {
    const btns = document.querySelectorAll('.diff-btn');
    btns.forEach(btn => btn.classList.toggle('active', btn.dataset.diff === state.difficulty));

    const infoEl = document.getElementById('difficulty-info');
    if (infoEl) infoEl.textContent = DIFFICULTY_INFO[state.difficulty] || '';

    // Hide hard mode toggle when difficulty is 'hard' (auto-forced)
    const hardRow = document.getElementById('hard-mode-row');
    if (hardRow) hardRow.style.display = state.difficulty === 'hard' ? 'none' : '';
}

// ===== SETTINGS =====
function initSettings() {
    // Difficulty selector
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const diff = btn.dataset.diff;
            if (!DIFFICULTY[diff]) return;

            state.difficulty = diff;
            // Reset hints to the difficulty default
            const dc = DIFFICULTY[diff];
            if (state.hints < dc.startHints) state.hints = dc.startHints;

            save();
            updateDifficultyUI();
            updateHintDisplay();

            const labels = { easy: 'Kolay', normal: 'Normal', hard: 'Zor' };
            showToast(`Zorluk: ${labels[diff] || diff}`);
        });
    });
    updateDifficultyUI();

    const hardEl = document.getElementById('setting-hard-mode');
    const soundEl = document.getElementById('setting-sound');
    const hapticEl = document.getElementById('setting-haptic');
    const colorblindEl = document.getElementById('setting-colorblind');

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

    if (colorblindEl) {
        colorblindEl.checked = state.colorblindMode;
        colorblindEl.addEventListener('change', () => {
            state.colorblindMode = colorblindEl.checked;
            applyColorblindMode();
            save();
            showToast(state.colorblindMode ? '🎨 Renk körü modu açık' : 'Renk körü modu kapalı');
        });
    }

    const resetBtn = document.getElementById('btn-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Tüm ilerlemeniz silinecek! Emin misiniz?')) {
                localStorage.removeItem('kelime_fethi_save_v1');
                resetState();
                save();
                location.reload();
            }
        });
    }
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            SFX.resume();
            switchView(btn.dataset.tab);
        });
    });

    document.getElementById('btn-back')?.addEventListener('click', () => switchView('map'));

    document.getElementById('btn-skip')?.addEventListener('click', () => skipPuzzle());

    document.getElementById('btn-daily')?.addEventListener('click', () => {
        SFX.resume();
        startDailyPuzzle(switchView);
    });

    document.getElementById('btn-hint')?.addEventListener('click', () => useHint());

    document.getElementById('btn-cloud')?.addEventListener('click', () => CloudSave.show());
    document.getElementById('btn-cloud-close')?.addEventListener('click', () => CloudSave.hide());
    document.getElementById('btn-cloud-save')?.addEventListener('click', () => CloudSave.saveToCloud());
    document.getElementById('btn-cloud-load')?.addEventListener('click', () => CloudSave.loadFromCloud(updateUI, renderMap));

    document.getElementById('btn-sound')?.addEventListener('click', () => {
        SFX.enabled = !SFX.enabled;
        state.soundEnabled = SFX.enabled;
        updateSoundButton();
        save();
    });

    document.getElementById('btn-share')?.addEventListener('click', () => shareResult());
    document.getElementById('btn-next-city')?.addEventListener('click', () => {
        hideResultOverlay();
        switchView('map');
    });

    // Close result overlay by tapping outside the content
    document.getElementById('result-overlay')?.addEventListener('click', (e) => {
        if (e.target.id === 'result-overlay') {
            hideResultOverlay();
        }
    });

    document.getElementById('btn-tutorial-next')?.addEventListener('click', () => nextTutorialStep());

    // === SOCIAL BUTTONS ===
    document.getElementById('btn-share-whatsapp')?.addEventListener('click', () => {
        const text = generateShareGrid();
        if (text) shareViaWhatsApp(text);
    });

    document.getElementById('btn-challenge')?.addEventListener('click', async () => {
        if (!state.activeCityWord) return;
        const btn = document.getElementById('btn-challenge');
        btn.textContent = '...';
        const result = await createChallenge(state.activeCityWord, state.activeCityWordLength || 5);
        if (result) {
            const shareText = `⚔️ Kelime Fethi Meydan Okuma!\nBu kelimeyi bulabilir misin? (${result.url})`;
            if (navigator.share) {
                navigator.share({ text: shareText }).catch(() => {});
            } else {
                navigator.clipboard.writeText(shareText).then(() => showToast('Link kopyalandı!'));
            }
            btn.textContent = '✓ Gönderildi';
        } else {
            btn.textContent = '⚔️ Meydan Oku';
        }
        setTimeout(() => { btn.textContent = '⚔️ Meydan Oku'; }, 3000);
    });

    // === LEADERBOARD TABS ===
    document.querySelectorAll('.stats-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.stats-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.stats-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const panelId = `stats-panel-${tab.dataset.stab}`;
            const panel = document.getElementById(panelId);
            if (panel) panel.classList.add('active');

            // Lazy-load leaderboards
            if (tab.dataset.stab === 'daily') loadDailyLeaderboard();
            if (tab.dataset.stab === 'alltime') loadAlltimeLeaderboard();
        });
    });
}

async function loadDailyLeaderboard() {
    const container = document.getElementById('leaderboard-daily');
    if (!container) return;
    container.innerHTML = '<div class="lb-loading">Yükleniyor...</div>';
    const data = await fetchDailyLeaderboard();
    renderDailyLeaderboard(container, data, getPlayerId());
}

async function loadAlltimeLeaderboard() {
    const container = document.getElementById('leaderboard-alltime');
    if (!container) return;
    container.innerHTML = '<div class="lb-loading">Yükleniyor...</div>';
    const data = await fetchAlltimeLeaderboard();
    renderAlltimeLeaderboard(container, data, getPlayerId());
}

// ===== MAIN INIT =====
async function init() {
    console.log('[Kelime Fethi] v4.0 — başlatılıyor...');

    // Update splash progress
    const splashProgress = document.getElementById('splash-progress');
    const updateSplash = (pct) => { if (splashProgress) splashProgress.style.width = pct + '%'; };
    updateSplash(10);

    // Load saved state
    loadSave();
    updateSplash(30);

    // Load game data
    await loadGameData();
    updateSplash(60);

    // Set Turkey map data from separate file
    Object.assign(TURKEY_MAP, TURKEY_MAP_DATA);
    updateSplash(80);

    // Init systems
    SFX.init();
    Particles.init();

    // Apply colorblind mode from saved state
    applyColorblindMode();

    // Init UI
    initVirtualKeyboard();
    initPhysicalKeyboard();
    initSwipeKeyboard();
    initEventListeners();
    initRegionSelector();
    initSettings();

    // Render
    renderMap();
    updateUI();
    updateSplash(100);

    // Init map interactions (zoom/pan)
    initMapZoom();
    initRegionTracking();

    // Init icons
    initIcons();

    // Init ads (reward-based, non-intrusive)
    initAds();

    // Init social UI (nickname, avatar, leaderboard opt-in)
    initSocialUI();

    // Init push notifications
    initNotifications();

    // Daily countdown timer
    setInterval(updateDailyCountdown, 1000);

    // Auto-save every 60 seconds
    setInterval(save, 60000);

    // Streak warning + recovery check
    if (state.currentStreak > 0) {
        const today = getToday();
        if (state.dailyDate !== today || !state.dailyComplete) {
            setTimeout(() => {
                showToast(`🔥 ${state.currentStreak} günlük serini kaybetme!`, 4000);
            }, 2000);
        }
        // Check if streak needs recovery
        setTimeout(checkStreakRecovery, 1500);
    }

    // Handle URL shortcuts (from manifest shortcuts)
    const urlParams = new URLSearchParams(window.location.search);
    const startView = urlParams.get('view');
    const challengeId = urlParams.get('challenge');

    if (challengeId) {
        // Challenge URL: ?challenge=XXXXXX
        setTimeout(async () => {
            const challenge = await loadChallenge(challengeId);
            if (challenge && typeof startChallengePuzzle === 'function') {
                startChallengePuzzle(challenge, switchView);
            }
        }, 600);
    } else if (startView === 'daily') {
        setTimeout(() => startDailyPuzzle(switchView), 600);
    } else if (startView === 'map') {
        // Already default
    }

    // Show tutorial for first time
    if (!state.tutorialDone && !startView && !challengeId) {
        setTimeout(showTutorial, 500);
    }

    // Hide splash screen
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) splash.classList.add('hidden');
    }, 400);

    console.log('[Kelime Fethi] Hazır! ✅');
}

// Start when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
