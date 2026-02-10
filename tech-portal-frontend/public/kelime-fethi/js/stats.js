// ============================================================
// KELIME FETHI v2.0 — Statistics
// ============================================================

import { MAX_GUESSES, REGION_COLORS } from './config.js';
import { state } from './state.js';
import { REGIONS } from './words.js';
import { getRegionProgress, isRegionUnlocked } from './map.js';
import { renderAchievements } from './achievements.js';

export function updateStats() {
    const el = (id) => document.getElementById(id);

    el('stat-played').textContent = state.gamesPlayed;
    el('stat-win-pct').textContent = state.gamesPlayed > 0 ? Math.round((state.gamesWon / state.gamesPlayed) * 100) : 0;
    el('stat-streak').textContent = state.currentStreak;
    el('stat-max-streak').textContent = state.maxStreak;

    // Guess distribution
    const distEl = document.getElementById('guess-distribution');
    if (distEl) {
        distEl.innerHTML = '';
        const maxCount = Math.max(1, ...Object.values(state.guessDistribution));

        for (let i = 1; i <= MAX_GUESSES; i++) {
            const count = state.guessDistribution[i] || 0;
            const pct = (count / maxCount) * 100;

            const row = document.createElement('div');
            row.className = 'dist-row';
            row.innerHTML = `
                <span class="dist-label">${i}</span>
                <div class="dist-bar-wrap">
                    <div class="dist-bar${count > 0 ? ' has-value' : ''}" style="width:${Math.max(pct, 5)}%">
                        <span>${count}</span>
                    </div>
                </div>
            `;
            distEl.appendChild(row);
        }
    }

    // Region progress
    const regionEl = document.getElementById('region-progress');
    if (regionEl && REGIONS.length > 0) {
        regionEl.innerHTML = '';
        REGIONS.forEach(region => {
            const progress = getRegionProgress(region.id);
            const unlocked = isRegionUnlocked(region.id);
            const pct = progress.total > 0 ? (progress.conquered / progress.total) * 100 : 0;

            const row = document.createElement('div');
            row.className = `region-progress-row${unlocked ? '' : ' locked'}`;
            row.innerHTML = `
                <div class="region-info">
                    <span class="region-name">${unlocked ? '' : '🔒 '}${region.name}</span>
                    <span class="region-count">${progress.conquered}/${progress.total}</span>
                </div>
                <div class="region-bar-wrap">
                    <div class="region-bar" style="width:${pct}%;${REGION_COLORS[region.id] ? `background:${REGION_COLORS[region.id].conquered}` : ''}"></div>
                </div>
            `;
            regionEl.appendChild(row);
        });
    }

    // Render achievements section
    renderAchievements();
}
