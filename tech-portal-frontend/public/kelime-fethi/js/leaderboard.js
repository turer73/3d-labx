// ============================================================
// KELIME FETHI v4.0 — Leaderboard Module
// ============================================================

import { CLOUD_API } from './config.js';
import { state, save } from './state.js';
import { getPlayerId } from './state.js';
import { getDayNumber } from './words.js';

// Cache: avoid re-fetching within 5 minutes
let _dailyCache = { day: -1, data: null, ts: 0 };
let _alltimeCache = { data: null, ts: 0 };
const CACHE_TTL = 5 * 60 * 1000; // 5 min

// ===== FETCH =====

export async function fetchDailyLeaderboard(day) {
    const dayNum = day ?? getDayNumber();
    const now = Date.now();

    if (_dailyCache.day === dayNum && _dailyCache.data && now - _dailyCache.ts < CACHE_TTL) {
        return _dailyCache.data;
    }

    try {
        const res = await fetch(`${CLOUD_API}/leaderboard/daily?day=${dayNum}`);
        if (!res.ok) return null;
        const data = await res.json();
        _dailyCache = { day: dayNum, data, ts: now };
        return data;
    } catch (e) {
        console.warn('[Leaderboard] Daily fetch failed:', e.message);
        return _dailyCache.data; // Return stale cache
    }
}

export async function fetchAlltimeLeaderboard() {
    const now = Date.now();

    if (_alltimeCache.data && now - _alltimeCache.ts < CACHE_TTL) {
        return _alltimeCache.data;
    }

    try {
        const res = await fetch(`${CLOUD_API}/leaderboard/alltime`);
        if (!res.ok) return null;
        const data = await res.json();
        _alltimeCache = { data, ts: now };
        return data;
    } catch (e) {
        console.warn('[Leaderboard] Alltime fetch failed:', e.message);
        return _alltimeCache.data;
    }
}

// ===== SUBMIT =====

export async function submitDailyScore({ guesses, solved, solveTimeMs, score, difficulty, wordLength }) {
    if (!state.nickname || !state.leaderboardOptIn) return;

    const playerId = getPlayerId();
    const dayNumber = getDayNumber();

    try {
        const res = await fetch(`${CLOUD_API}/daily-score`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                playerId, dayNumber, guesses, solved,
                solveTimeMs, score, difficulty, wordLength
            })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            console.warn('[Leaderboard] Submit failed:', err.error || res.status);
        }
    } catch (e) {
        console.warn('[Leaderboard] Submit error:', e.message);
    }
}

// ===== RENDER =====

export function renderDailyLeaderboard(container, data, myPlayerId) {
    if (!container) return;
    if (!data || !data.leaderboard || data.leaderboard.length === 0) {
        container.innerHTML = '<div class="lb-empty">Henüz kimse katılmadı</div>';
        return;
    }

    let html = `<div class="lb-header">Günlük #${data.day} — ${data.count} oyuncu</div>`;
    html += '<div class="lb-list">';

    data.leaderboard.forEach(entry => {
        const isMe = entry.playerId === myPlayerId;
        const statusIcon = entry.solved ? '✅' : '❌';
        const timeStr = entry.timeMs > 0 ? formatTime(entry.timeMs) : '-';
        html += `
            <div class="lb-row${isMe ? ' lb-me' : ''}">
                <span class="lb-rank">${entry.rank}</span>
                <span class="lb-avatar">${entry.avatar}</span>
                <span class="lb-nick">${escapeHtml(entry.nickname)}</span>
                <span class="lb-stat">${statusIcon} ${entry.guesses}/${entry.wordLength}h</span>
                <span class="lb-time">${timeStr}</span>
                <span class="lb-score">${entry.score}⭐</span>
            </div>`;
    });

    html += '</div>';
    container.innerHTML = html;
}

export function renderAlltimeLeaderboard(container, data, myPlayerId) {
    if (!container) return;
    if (!data || !data.leaderboard || data.leaderboard.length === 0) {
        container.innerHTML = '<div class="lb-empty">Henüz sıralama yok</div>';
        return;
    }

    let html = `<div class="lb-header">Tüm Zamanlar — ${data.count} oyuncu</div>`;
    html += '<div class="lb-list">';

    data.leaderboard.forEach(entry => {
        const isMe = entry.playerId === myPlayerId;
        const medal = entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank - 1] : `#${entry.rank}`;
        html += `
            <div class="lb-row${isMe ? ' lb-me' : ''}">
                <span class="lb-rank">${medal}</span>
                <span class="lb-avatar">${entry.avatar}</span>
                <span class="lb-nick">${escapeHtml(entry.nickname)}</span>
                <span class="lb-score">${entry.totalScore}⭐</span>
                <span class="lb-cities">${entry.cities}🏙️</span>
            </div>`;
    });

    html += '</div>';
    container.innerHTML = html;
}

// Find player's rank in daily leaderboard
export function getMyDailyRank(data, myPlayerId) {
    if (!data || !data.leaderboard) return null;
    const entry = data.leaderboard.find(e => e.playerId === myPlayerId);
    return entry ? entry.rank : null;
}

// ===== HELPERS =====

function formatTime(ms) {
    const sec = Math.floor(ms / 1000);
    if (sec < 60) return `${sec}s`;
    const min = Math.floor(sec / 60);
    const remSec = sec % 60;
    return `${min}m${remSec}s`;
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
