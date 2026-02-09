// ============================================================
// KELIME FETHI v2.0 — Sound System (Web Audio API Oscillator Synthesis)
// ============================================================

import { Haptic } from './haptic.js';

export const SFX = {
    ctx: null,
    enabled: true,
    masterGain: null,
    volume: 0.5,
    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = this.volume;
            this.masterGain.connect(this.ctx.destination);
        } catch (e) { this.enabled = false; }
    },
    resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); },

    _play(freq, type, dur, vol = 0.1, detune = 0) {
        if (!this.enabled || !this.ctx || !this.masterGain) return;
        try {
            const c = this.ctx, t = c.currentTime;
            const o = c.createOscillator(), g = c.createGain();
            o.type = type; o.frequency.value = freq; o.detune.value = detune;
            g.gain.setValueAtTime(vol, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + dur);
            o.connect(g); g.connect(this.masterGain);
            o.start(t); o.stop(t + dur);
        } catch(e) {}
    },

    _chord(freqs, type, dur, vol = 0.06) {
        freqs.forEach(f => this._play(f, type, dur, vol / freqs.length));
    },

    keyTap() {
        this._play(800, 'sine', 0.04, 0.06);
        Haptic.keyPress();
    },
    tileRevealCorrect() {
        this._play(880, 'sine', 0.12, 0.08);
        this._play(1320, 'triangle', 0.08, 0.04);
        Haptic.correct();
    },
    tileRevealPresent() {
        this._play(660, 'sine', 0.1, 0.07);
        Haptic.present();
    },
    tileRevealAbsent() {
        this._play(300, 'sine', 0.06, 0.04);
        Haptic.absent();
    },
    win() {
        const fanfare = [523, 659, 784, 1047, 1319];
        fanfare.forEach((f, i) => {
            setTimeout(() => {
                this._play(f, 'sine', 0.25, 0.08);
                this._play(f * 1.5, 'triangle', 0.2, 0.03);
            }, i * 110);
        });
        setTimeout(() => this._chord([1047, 1319, 1568], 'sine', 0.4, 0.1), 550);
        Haptic.win();
    },
    lose() {
        this._play(300, 'sawtooth', 0.2, 0.06);
        setTimeout(() => this._play(200, 'sawtooth', 0.25, 0.05), 120);
        setTimeout(() => this._play(120, 'sawtooth', 0.3, 0.04), 260);
        Haptic.lose();
    },
    conquer() {
        [880, 1047, 1175, 1319, 1568, 1760].forEach((f, i) => {
            setTimeout(() => {
                this._play(f, 'sine', 0.3, 0.08);
                this._play(f * 2, 'triangle', 0.15, 0.03);
            }, i * 80);
        });
        Haptic.conquer();
    },
    hint() {
        this._play(1200, 'sine', 0.08, 0.06);
        setTimeout(() => this._play(1400, 'sine', 0.06, 0.05), 60);
    },
    error() {
        this._play(200, 'square', 0.15, 0.05);
        Haptic.error();
    },
    bonus() {
        [1047, 1319, 1568, 2093].forEach((f, i) => {
            setTimeout(() => this._play(f, 'sine', 0.15, 0.07), i * 60);
        });
    },
    streakReward() {
        this._play(523, 'sine', 0.1, 0.06);
        setTimeout(() => this._play(784, 'sine', 0.1, 0.06), 80);
        setTimeout(() => this._play(1047, 'sine', 0.15, 0.08), 160);
        Haptic.streak();
    },
};
