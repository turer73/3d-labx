// ============================================================
// KELIME FETHI v4.0 — Social Module
// Nickname, WhatsApp share, Challenge links
// ============================================================

import { CLOUD_API } from './config.js';
import { state, save, getPlayerId } from './state.js';
import { showToast } from './utils.js';

const AVATAR_OPTIONS = ['🎮', '🦊', '🌟', '🎯', '🔥', '💎', '🎪', '🦁', '🐺', '🎲', '🏆', '🌙'];

export { AVATAR_OPTIONS };

// ===== NICKNAME & PROFILE =====

export async function saveProfile() {
    const playerId = getPlayerId();
    if (!state.nickname) return false;

    try {
        const conqueredCount = Object.keys(state.conqueredCities || {}).length;
        const res = await fetch(`${CLOUD_API}/profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                playerId,
                nickname: state.nickname,
                avatarEmoji: state.avatarEmoji || '🎮',
                totalScore: state.totalScore || 0,
                citiesConquered: conqueredCount
            })
        });

        const data = await res.json();
        if (!res.ok) {
            if (data.code === 'NICKNAME_TAKEN') {
                showToast('Bu rumuz zaten kullanılıyor!');
            } else {
                showToast(data.error || 'Profil kaydedilemedi');
            }
            return false;
        }

        state.leaderboardOptIn = true;
        save();
        return true;
    } catch (e) {
        console.warn('[Social] Profile save error:', e.message);
        showToast('Bağlantı hatası');
        return false;
    }
}

export async function loadProfile() {
    const playerId = getPlayerId();

    try {
        const res = await fetch(`${CLOUD_API}/profile?playerId=${playerId}`);
        if (!res.ok) return null;
        const data = await res.json();
        if (data.exists) {
            return {
                nickname: data.nickname,
                avatarEmoji: data.avatarEmoji,
                totalScore: data.totalScore,
                leaderboardOptIn: data.leaderboardOptIn,
            };
        }
        return null;
    } catch (e) {
        return null;
    }
}

// ===== WHATSAPP SHARING =====

export function generateWhatsAppUrl(shareText) {
    const encoded = encodeURIComponent(shareText);
    return `https://api.whatsapp.com/send?text=${encoded}`;
}

export function shareViaWhatsApp(shareText) {
    const url = generateWhatsAppUrl(shareText);
    window.open(url, '_blank');
    state.shareCount = (state.shareCount || 0) + 1;
    save();

    // GA4 tracking
    if (window._trackEvent) window._trackEvent('share', {
        game_name: 'kelime-fethi',
        method: 'whatsapp',
        content_type: 'puzzle_result'
    });
}

// ===== CHALLENGE LINKS =====

export async function createChallenge(word, wordLength) {
    const playerId = getPlayerId();

    try {
        const res = await fetch(`${CLOUD_API}/challenge`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                creatorId: playerId,
                word: word,
                wordLength: wordLength || [...word].length
            })
        });

        if (!res.ok) {
            showToast('Meydan okuma oluşturulamadı');
            return null;
        }

        const data = await res.json();
        return {
            challengeId: data.challengeId,
            url: data.url,
            expiresAt: data.expiresAt
        };
    } catch (e) {
        console.warn('[Social] Challenge create error:', e.message);
        showToast('Bağlantı hatası');
        return null;
    }
}

export async function loadChallenge(challengeId) {
    try {
        const res = await fetch(`${CLOUD_API}/challenge/${challengeId}`);
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            if (data.code === 'CHALLENGE_EXPIRED') {
                showToast('Meydan okuma süresi dolmuş!');
            } else if (data.code === 'CHALLENGE_NOT_FOUND') {
                showToast('Meydan okuma bulunamadı!');
            }
            return null;
        }

        const data = await res.json();
        return {
            word: data.word,
            wordLength: data.wordLength,
            playCount: data.playCount,
            challengeId: data.challengeId
        };
    } catch (e) {
        console.warn('[Social] Challenge load error:', e.message);
        return null;
    }
}

// ===== INIT SOCIAL UI =====

export function initSocialUI() {
    // Avatar selector
    const avatarContainer = document.getElementById('avatar-selector');
    if (avatarContainer) {
        avatarContainer.innerHTML = AVATAR_OPTIONS.map(emoji =>
            `<button class="avatar-btn${state.avatarEmoji === emoji ? ' active' : ''}" data-emoji="${emoji}">${emoji}</button>`
        ).join('');

        avatarContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.avatar-btn');
            if (!btn) return;
            state.avatarEmoji = btn.dataset.emoji;
            save();
            avatarContainer.querySelectorAll('.avatar-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    }

    // Nickname save
    const nickInput = document.getElementById('nickname-input');
    const nickSaveBtn = document.getElementById('btn-save-nickname');
    if (nickInput) {
        nickInput.value = state.nickname || '';
    }
    if (nickSaveBtn) {
        nickSaveBtn.addEventListener('click', async () => {
            const nick = (nickInput?.value || '').trim();
            if (nick.length < 2 || nick.length > 16) {
                showToast('Rumuz 2-16 karakter olmalı');
                return;
            }
            state.nickname = nick;
            save();
            nickSaveBtn.textContent = '...';
            const ok = await saveProfile();
            nickSaveBtn.textContent = ok ? '✓ Kaydedildi' : '✗ Hata';
            setTimeout(() => { nickSaveBtn.textContent = 'Kaydet'; }, 2000);
        });
    }

    // Leaderboard opt-in toggle
    const optInEl = document.getElementById('setting-leaderboard');
    if (optInEl) {
        optInEl.checked = state.leaderboardOptIn;
        optInEl.addEventListener('change', () => {
            state.leaderboardOptIn = optInEl.checked;
            save();
            if (optInEl.checked && state.nickname) {
                saveProfile();
            }
        });
    }
}
