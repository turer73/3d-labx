// ============================================================
// KELIME FETHI — Push Notification System
// Local notifications via Service Worker
// ============================================================

import { state, save } from './state.js';
import { showToast } from './utils.js';
import { getTodayStr } from './words.js';

const NOTIF_KEY = 'kf_notifications';
const DEFAULT_HOUR = 19; // 19:00

// ===== SETTINGS PERSISTENCE =====
function loadSettings() {
    try {
        const raw = localStorage.getItem(NOTIF_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { enabled: false, hour: DEFAULT_HOUR };
}

function saveSettings(settings) {
    try {
        localStorage.setItem(NOTIF_KEY, JSON.stringify(settings));
    } catch (e) {}
}

// ===== PERMISSION =====
async function requestPermission() {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    const result = await Notification.requestPermission();
    return result === 'granted';
}

// ===== TOGGLE =====
export async function toggleNotifications() {
    const settings = loadSettings();

    if (!settings.enabled) {
        // Turning on
        const granted = await requestPermission();
        if (!granted) {
            showToast('Bildirim izni reddedildi');
            updateUI();
            return;
        }
        settings.enabled = true;
        saveSettings(settings);
        scheduleDailyReminder();
        scheduleStreakReminder();
        showToast('🔔 Hatırlatmalar açıldı');
    } else {
        // Turning off
        settings.enabled = false;
        saveSettings(settings);
        showToast('🔕 Hatırlatmalar kapatıldı');
    }
    updateUI();
}

// ===== SCHEDULE DAILY REMINDER =====
export function scheduleDailyReminder() {
    const settings = loadSettings();
    if (!settings.enabled) return;
    if (!navigator.serviceWorker || !navigator.serviceWorker.controller) return;

    // If already played today, don't remind
    const today = getTodayStr();
    if (state.dailyDate === today && state.dailyComplete) return;

    // Calculate delay until reminder hour (Turkey time UTC+3)
    const now = new Date();
    const trNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const trHour = trNow.getUTCHours();
    const targetHour = settings.hour || DEFAULT_HOUR;

    let delayMs;
    if (trHour < targetHour) {
        // Today at targetHour
        const target = new Date(trNow);
        target.setUTCHours(targetHour, 0, 0, 0);
        delayMs = target - trNow;
    } else {
        // Tomorrow at targetHour
        const target = new Date(trNow);
        target.setUTCDate(target.getUTCDate() + 1);
        target.setUTCHours(targetHour, 0, 0, 0);
        delayMs = target - trNow;
    }

    if (delayMs <= 0 || delayMs > 24 * 60 * 60 * 1000) return;

    navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        delayMs,
        title: '🗺️ Günlük Bulmaca Bekliyor!',
        body: state.currentStreak > 0
            ? `🔥 ${state.currentStreak} günlük serini kaybetme! Bugünkü bulmacayı çöz.`
            : 'Bugünkü kelimeyi tahmin etmeye hazır mısın?',
        tag: 'kf-daily-reminder'
    });
}

// ===== SCHEDULE STREAK REMINDER =====
export function scheduleStreakReminder() {
    const settings = loadSettings();
    if (!settings.enabled) return;
    if (!navigator.serviceWorker || !navigator.serviceWorker.controller) return;
    if (state.currentStreak < 2) return;

    // If already played today, no need
    const today = getTodayStr();
    if (state.dailyDate === today && state.dailyComplete) return;

    // Remind in 2 hours
    const delayMs = 2 * 60 * 60 * 1000;

    navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        delayMs,
        title: `🔥 ${state.currentStreak} Günlük Seri Tehlikede!`,
        body: 'Bugünkü günlük bulmacayı çözmeden gün bitmesine izin verme!',
        tag: 'kf-streak-reminder'
    });
}

// ===== CHANGE TIME =====
export function changeNotifTime() {
    const select = document.getElementById('kf-notif-time');
    if (!select) return;
    const settings = loadSettings();
    settings.hour = parseInt(select.value, 10) || DEFAULT_HOUR;
    saveSettings(settings);
    // Force reschedule
    if (settings.enabled) scheduleDailyReminder();
    showToast(`⏰ Hatırlatma saati: ${String(settings.hour).padStart(2, '0')}:00`);
}

// ===== UI UPDATE =====
export function updateUI() {
    const settings = loadSettings();
    const toggle = document.getElementById('kf-notif-toggle');
    const status = document.getElementById('kf-notif-status');
    const timeRow = document.getElementById('kf-notif-time-row');
    const timeSelect = document.getElementById('kf-notif-time');

    if (toggle) toggle.checked = settings.enabled;

    if (status) {
        if (!('Notification' in window)) {
            status.textContent = 'Desteklenmiyor';
            status.className = 'kf-notif-status-text off';
        } else if (Notification.permission === 'denied') {
            status.textContent = 'İzin reddedildi';
            status.className = 'kf-notif-status-text off';
        } else if (settings.enabled) {
            status.textContent = 'Açık';
            status.className = 'kf-notif-status-text on';
        } else {
            status.textContent = 'Kapalı';
            status.className = 'kf-notif-status-text off';
        }
    }

    if (timeRow) {
        timeRow.style.display = settings.enabled ? 'flex' : 'none';
    }

    if (timeSelect) {
        timeSelect.value = String(settings.hour || DEFAULT_HOUR);
    }
}

// ===== INIT =====
export function initNotifications() {
    const settings = loadSettings();
    updateUI();

    // Event listeners
    const toggle = document.getElementById('kf-notif-toggle');
    if (toggle) toggle.addEventListener('change', toggleNotifications);

    const timeSelect = document.getElementById('kf-notif-time');
    if (timeSelect) timeSelect.addEventListener('change', changeNotifTime);

    // If enabled, schedule reminders
    if (settings.enabled) {
        scheduleDailyReminder();
        scheduleStreakReminder();
    }
}
