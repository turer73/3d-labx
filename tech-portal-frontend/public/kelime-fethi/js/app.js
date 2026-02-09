// ============================================================
// KELIME FETHI v2.0 — Main Application Entry
// Modular Architecture
// ============================================================

import { state, save, loadSave, resetState } from './state.js';
import { SFX } from './sound.js';
import { Haptic } from './haptic.js';
import { Particles } from './particles.js';
import { showToast } from './utils.js';
import { loadGameData, TURKEY_MAP } from './words.js';
import { renderMap, updateMapProgress, initRegionSelector, initMapZoom, initRegionTracking, checkRegionUnlock } from './map.js';
import { updateStats } from './stats.js';
import { CloudSave } from './cloud.js';
import { initPhysicalKeyboard, initVirtualKeyboard } from './keyboard.js';
import {
    startDailyPuzzle, startCityPuzzle, useHint, shareResult, hideResultOverlay,
    updateHintDisplay, setSwitchViewFn, setUpdateUICallback
} from './puzzle.js';
import { showTutorial, nextTutorialStep } from './tutorial.js';
import { getTodayStr as getToday } from './words.js';
import { TURKEY_MAP_DATA } from './turkey-map-data.js';

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
}

// Register updateUI callback
setUpdateUICallback(updateUI);

function updateSoundButton() {
    const btn = document.getElementById('btn-sound');
    if (btn) btn.textContent = SFX.enabled ? '🔊' : '🔇';
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

    const dot = document.getElementById('daily-dot');
    if (dot) {
        const today = getToday();
        dot.style.display = (state.dailyDate !== today || !state.dailyComplete) ? 'block' : 'none';
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

    document.getElementById('btn-tutorial-next')?.addEventListener('click', () => nextTutorialStep());
}

// ===== MAIN INIT =====
async function init() {
    console.log('[Kelime Fethi] v2.0 Modüler — başlatılıyor...');

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
    // TURKEY_MAP is imported from words.js but we need to set it
    // The map data is now in turkey-map-data.js
    Object.assign(TURKEY_MAP, TURKEY_MAP_DATA);
    updateSplash(80);

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
    updateSplash(100);

    // Init map interactions (zoom/pan)
    initMapZoom();
    initRegionTracking();

    // Init icons
    initIcons();

    // Daily countdown timer
    setInterval(updateDailyCountdown, 1000);

    // Auto-save every 60 seconds
    setInterval(save, 60000);

    // Streak warning
    if (state.currentStreak > 0) {
        const today = getToday();
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
