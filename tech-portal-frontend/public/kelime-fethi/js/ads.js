// ============================================================
// KELIME FETHI v3.0 — Ads Manager
// Reward-based ad system (non-intrusive monetization)
// Supports: Google AdMob (via AdSense for web), fallback stub
// ============================================================
//
// MONETIZATION STRATEGY:
// ─ No banner ads (preserves clean game UI)
// ─ No interstitial ads (respects player flow)
// ─ Reward ads ONLY: player chooses to watch for benefits
//   • Extra hint (watch ad → get 1 free hint)
//   • Streak freeze (watch ad → earn 1 freeze)
//   • Continue after loss (watch ad → get 1 more guess)
// ─ All rewards are optional, never pay-to-win
// ============================================================

import { state, save } from './state.js';
import { showToast } from './utils.js';
import { SFX } from './sound.js';

// ─── Configuration ───
const ADS_CONFIG = {
    // Replace with your actual AdMob/AdSense IDs after approval
    // For web PWA, use AdSense auto ads or AdMob mediation
    publisherId: 'ca-pub-XXXXXXXXXXXXXXXX',       // Your AdSense publisher ID
    rewardSlotId: 'ca-pub-XXXXXXXXXXXXXXXX/YYYYYY', // Reward ad unit ID

    // Rate limiting
    maxAdsPerDay: 5,            // Max reward ads per day
    cooldownMs: 60 * 1000,     // 60s between ads

    // Feature flags
    enabled: false,             // Set true after AdMob approval
    debugMode: false,           // Set true for console logs
};

// ─── State ───
let adLoaded = false;
let lastAdTime = 0;
let adsShownToday = 0;
let lastAdDate = '';

// ─── Initialize Ads ───
export function initAds() {
    // Reset daily counter
    const today = new Date().toISOString().split('T')[0];
    if (lastAdDate !== today) {
        adsShownToday = 0;
        lastAdDate = today;
    }

    if (!ADS_CONFIG.enabled) {
        if (ADS_CONFIG.debugMode) console.log('[Ads] Disabled in config');
        return;
    }

    // Load Google AdSense script
    try {
        if (!document.querySelector('script[src*="adsbygoogle"]')) {
            const script = document.createElement('script');
            script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CONFIG.publisherId}`;
            script.async = true;
            script.crossOrigin = 'anonymous';
            script.onerror = () => {
                if (ADS_CONFIG.debugMode) console.log('[Ads] AdSense script blocked (ad blocker?)');
            };
            document.head.appendChild(script);
        }
        adLoaded = true;
    } catch (e) {
        if (ADS_CONFIG.debugMode) console.log('[Ads] Init error:', e);
    }
}

// ─── Can Show Ad? ───
export function canShowRewardAd() {
    if (!ADS_CONFIG.enabled) return false;

    const now = Date.now();
    const today = new Date().toISOString().split('T')[0];

    // Reset daily if needed
    if (lastAdDate !== today) {
        adsShownToday = 0;
        lastAdDate = today;
    }

    // Rate limits
    if (adsShownToday >= ADS_CONFIG.maxAdsPerDay) return false;
    if (now - lastAdTime < ADS_CONFIG.cooldownMs) return false;

    return adLoaded;
}

// ─── Show Reward Ad ───
// Returns a Promise that resolves with the reward type if user completes the ad
export function showRewardAd(rewardType = 'hint') {
    return new Promise((resolve, reject) => {
        if (!canShowRewardAd()) {
            reject(new Error('Ad not available'));
            return;
        }

        if (ADS_CONFIG.debugMode) {
            console.log(`[Ads] Showing reward ad for: ${rewardType}`);
            // In debug mode, simulate ad completion after 2s
            setTimeout(() => {
                onRewardEarned(rewardType);
                resolve(rewardType);
            }, 2000);
            return;
        }

        // Real AdMob/AdSense reward ad flow
        // Note: For PWA, the actual ad API depends on your setup:
        // - Google AdSense doesn't natively support reward ads on web
        // - You may need AdMob mediation via TWA or a third-party SDK
        // - For initial launch, we use a stub that can be replaced

        try {
            // Attempt to show ad via Google Interactive Media Ads (IMA)
            // This is a placeholder — actual implementation depends on ad provider
            showAdPlaceholder(rewardType).then(() => {
                onRewardEarned(rewardType);
                resolve(rewardType);
            }).catch(reject);
        } catch (e) {
            reject(e);
        }
    });
}

// ─── Ad Placeholder (pre-approval) ───
// Before AdMob approval, this shows a simulated "support the developer" dialog
function showAdPlaceholder(rewardType) {
    return new Promise((resolve, reject) => {
        const rewardLabels = {
            hint: '💡 Ekstra İpucu',
            freeze: '❄️ Seri Dondurma',
            continue: '🔄 Ekstra Deneme',
        };

        const backdrop = document.createElement('div');
        backdrop.className = 'overlay';
        backdrop.id = 'ad-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'ad-reward-dialog';
        dialog.innerHTML = `
            <div class="ad-reward-header">
                <span class="ad-reward-icon">🎬</span>
                <h3>Ödüllü İzleme</h3>
            </div>
            <div class="ad-reward-body">
                <p>Kısa bir reklam izleyerek ödül kazan!</p>
                <div class="ad-reward-prize">
                    <span>${rewardLabels[rewardType] || rewardType}</span>
                </div>
                <div class="ad-placeholder-note">
                    Reklam sistemi yakında aktif olacak.<br>
                    Şimdilik ödül ücretsiz! 🎉
                </div>
            </div>
            <div class="ad-reward-actions">
                <button class="ad-btn-watch" id="btn-ad-watch">🎁 Ödülü Al</button>
                <button class="ad-btn-skip" id="btn-ad-skip">Vazgeç</button>
            </div>
        `;

        backdrop.appendChild(dialog);
        document.body.appendChild(backdrop);

        // Animate in
        requestAnimationFrame(() => backdrop.classList.add('show'));

        document.getElementById('btn-ad-watch').addEventListener('click', () => {
            backdrop.classList.remove('show');
            setTimeout(() => backdrop.remove(), 300);
            resolve();
        });

        document.getElementById('btn-ad-skip').addEventListener('click', () => {
            backdrop.classList.remove('show');
            setTimeout(() => backdrop.remove(), 300);
            reject(new Error('User skipped'));
        });
    });
}

// ─── Process Reward ───
function onRewardEarned(rewardType) {
    lastAdTime = Date.now();
    adsShownToday++;

    switch (rewardType) {
        case 'hint':
            state.hintsUsed = Math.max(0, (state.hintsUsed || 0) - 1); // Refund 1 hint
            SFX.bonus();
            showToast('💡 Ekstra ipucu kazandın!', 2500);
            break;

        case 'freeze':
            state.streakFreezeCount = (state.streakFreezeCount || 0) + 1;
            SFX.freeze();
            showToast(`❄️ Seri dondurma kazandın! (${state.streakFreezeCount} hak)`, 2500);
            break;

        case 'continue':
            // This needs to integrate with puzzle.js — emit an event
            SFX.bonus();
            showToast('🔄 Ekstra deneme hakkı kazandın!', 2500);
            break;

        default:
            SFX.bonus();
            showToast('🎁 Ödül kazandın!', 2500);
    }

    save();
    if (ADS_CONFIG.debugMode) console.log(`[Ads] Reward earned: ${rewardType} (${adsShownToday}/${ADS_CONFIG.maxAdsPerDay} today)`);
}

// ─── Get remaining ads count ───
export function getRemainingAds() {
    const today = new Date().toISOString().split('T')[0];
    if (lastAdDate !== today) return ADS_CONFIG.maxAdsPerDay;
    return Math.max(0, ADS_CONFIG.maxAdsPerDay - adsShownToday);
}

// ─── Check if ads are available ───
export function isAdsEnabled() {
    return ADS_CONFIG.enabled;
}
