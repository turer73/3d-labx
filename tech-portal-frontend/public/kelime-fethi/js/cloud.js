// ============================================================
// KELIME FETHI v2.0 — Cloud Save System
// ============================================================

import { CLOUD_API } from './config.js';
import { state, save, replaceState, getPlayerId } from './state.js';
import { SFX } from './sound.js';
import { getConqueredCount } from './map.js';

export const CloudSave = {
    busy: false,
    lastSync: 0,

    show() {
        const overlay = document.getElementById('cloud-overlay');
        if (!overlay) return;
        overlay.classList.remove('hidden');
        document.getElementById('player-id-display').textContent = getPlayerId();
        this.checkStatus();
    },

    hide() {
        const overlay = document.getElementById('cloud-overlay');
        if (overlay) overlay.classList.add('hidden');
    },

    async checkStatus() {
        const statusEl = document.getElementById('cloud-status');
        if (!statusEl) return;

        try {
            statusEl.textContent = 'Kontrol ediliyor...';
            const res = await fetch(`${CLOUD_API}/check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId: getPlayerId() })
            });
            const data = await res.json();

            if (data.exists) {
                const date = new Date(data.updatedAt).toLocaleString('tr-TR');
                statusEl.innerHTML = `☁️ Kayıt mevcut (${date})`;
            } else {
                statusEl.innerHTML = '☁️ Bulut kaydı yok';
            }
        } catch (e) {
            statusEl.textContent = '⚠️ Bağlantı hatası';
        }
    },

    async saveToCloud() {
        if (this.busy) return;
        const pin = document.getElementById('cloud-pin')?.value;
        if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
            this.showMsg('❌ 4 haneli PIN girin!', 'error');
            return;
        }

        this.busy = true;
        this.showMsg('☁️ Kaydediliyor...', 'info');

        try {
            save();
            const res = await fetch(`${CLOUD_API}/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerId: getPlayerId(),
                    pin,
                    saveData: JSON.stringify(state),
                    gameVersion: '2.0',
                    totalGold: state.totalScore || 0,
                    prestigeStars: getConqueredCount(),
                    playTime: Math.floor((Date.now() - (state.startTime || Date.now())) / 1000)
                })
            });

            const data = await res.json();
            if (data.success) {
                this.showMsg('✅ Buluta kaydedildi!', 'success');
                this.lastSync = Date.now();
                SFX.win();
            } else {
                this.showMsg('❌ ' + (data.error || 'Kayıt hatası'), 'error');
            }
        } catch (e) {
            this.showMsg('❌ Bağlantı hatası', 'error');
        }
        this.busy = false;
    },

    async loadFromCloud(updateUICallback, renderMapCallback) {
        if (this.busy) return;
        const pin = document.getElementById('cloud-pin')?.value;
        if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
            this.showMsg('❌ 4 haneli PIN girin!', 'error');
            return;
        }

        this.busy = true;
        this.showMsg('☁️ Yükleniyor...', 'info');

        try {
            const res = await fetch(`${CLOUD_API}/load`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId: getPlayerId(), pin })
            });

            const data = await res.json();
            if (data.success && data.saveData) {
                const saved = JSON.parse(data.saveData);
                replaceState(saved);
                save();
                this.showMsg('✅ Buluttan yüklendi!', 'success');

                setTimeout(() => {
                    this.hide();
                    if (updateUICallback) updateUICallback();
                    if (renderMapCallback) renderMapCallback();
                }, 1000);
            } else {
                this.showMsg('❌ ' + (data.error || 'Yükleme hatası'), 'error');
            }
        } catch (e) {
            this.showMsg('❌ Bağlantı hatası', 'error');
        }
        this.busy = false;
    },

    showMsg(text, type) {
        const el = document.getElementById('cloud-msg');
        if (el) {
            el.textContent = text;
            el.className = 'cloud-msg ' + type;
        }
    },
};
