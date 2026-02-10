// ============================================================
// KELIME FETHI v3.0 — Rich Sound System
// Advanced Web Audio API synthesis with:
//   - ADSR envelopes, filters, reverb
//   - Layered oscillators & noise
//   - Musical chord progressions
//   - Achievement & UI feedback sounds
// ============================================================

import { Haptic } from './haptic.js';

export const SFX = {
    ctx: null,
    enabled: true,
    masterGain: null,
    reverbNode: null,
    volume: 0.5,

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = this.volume;

            // Create a simple convolution reverb
            this._createReverb();

            this.masterGain.connect(this.ctx.destination);
        } catch (e) { this.enabled = false; }
    },

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    },

    // ─── Reverb impulse (algorithmic) ───
    _createReverb() {
        if (!this.ctx) return;
        try {
            const c = this.ctx;
            const convolver = c.createConvolver();
            const rate = c.sampleRate;
            const length = rate * 0.8; // 0.8s reverb tail
            const impulse = c.createBuffer(2, length, rate);

            for (let ch = 0; ch < 2; ch++) {
                const data = impulse.getChannelData(ch);
                for (let i = 0; i < length; i++) {
                    // Exponential decay with slight randomness
                    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
                }
            }
            convolver.buffer = impulse;

            // Dry/wet mix
            const dryGain = c.createGain();
            const wetGain = c.createGain();
            dryGain.gain.value = 0.85;
            wetGain.gain.value = 0.15;

            // Routing: source → [dry→master, wet→convolver→master]
            this._dryGain = dryGain;
            this._wetGain = wetGain;
            this._convolver = convolver;

            dryGain.connect(this.masterGain);
            wetGain.connect(convolver);
            convolver.connect(this.masterGain);
        } catch (e) {
            // Fallback: direct connection
            this._dryGain = this.masterGain;
            this._wetGain = null;
        }
    },

    // ─── Core: ADSR Envelope oscillator ───
    _synth({ freq, type = 'sine', attack = 0.01, decay = 0.1, sustain = 0.3,
             release = 0.2, vol = 0.1, detune = 0, filterFreq = 0, filterQ = 1,
             delay = 0, useReverb = false }) {
        if (!this.enabled || !this.ctx) return;
        try {
            const c = this.ctx;
            const t = c.currentTime + delay;
            const dur = attack + decay + release;

            const osc = c.createOscillator();
            const env = c.createGain();

            osc.type = type;
            osc.frequency.value = freq;
            osc.detune.value = detune;

            // ADSR envelope
            env.gain.setValueAtTime(0.001, t);
            env.gain.linearRampToValueAtTime(vol, t + attack);
            env.gain.linearRampToValueAtTime(vol * sustain, t + attack + decay);
            env.gain.exponentialRampToValueAtTime(0.001, t + dur);

            osc.connect(env);

            // Optional lowpass filter
            if (filterFreq > 0) {
                const filter = c.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.value = filterFreq;
                filter.Q.value = filterQ;
                env.connect(filter);

                if (useReverb && this._dryGain && this._wetGain) {
                    filter.connect(this._dryGain);
                    filter.connect(this._wetGain);
                } else {
                    filter.connect(this._dryGain || this.masterGain);
                }
            } else {
                if (useReverb && this._dryGain && this._wetGain) {
                    env.connect(this._dryGain);
                    env.connect(this._wetGain);
                } else {
                    env.connect(this._dryGain || this.masterGain);
                }
            }

            osc.start(t);
            osc.stop(t + dur + 0.05);
        } catch (e) {}
    },

    // ─── Noise burst (for percussive textures) ───
    _noise({ dur = 0.05, vol = 0.03, filterFreq = 4000, attack = 0.002, delay = 0 }) {
        if (!this.enabled || !this.ctx) return;
        try {
            const c = this.ctx;
            const t = c.currentTime + delay;
            const bufSize = Math.floor(c.sampleRate * dur);
            const buf = c.createBuffer(1, bufSize, c.sampleRate);
            const data = buf.getChannelData(0);
            for (let i = 0; i < bufSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const src = c.createBufferSource();
            src.buffer = buf;

            const env = c.createGain();
            env.gain.setValueAtTime(0.001, t);
            env.gain.linearRampToValueAtTime(vol, t + attack);
            env.gain.exponentialRampToValueAtTime(0.001, t + dur);

            const filter = c.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = filterFreq;
            filter.Q.value = 0.7;

            src.connect(env);
            env.connect(filter);
            filter.connect(this._dryGain || this.masterGain);

            src.start(t);
            src.stop(t + dur + 0.01);
        } catch (e) {}
    },

    // ─── Musical chord helper ───
    _chord(freqs, opts = {}) {
        const perVol = (opts.vol || 0.08) / Math.max(freqs.length, 1);
        freqs.forEach(f => {
            this._synth({ ...opts, freq: f, vol: perVol });
        });
    },

    // ─── Arpeggio helper ───
    _arpeggio(freqs, { interval = 80, ...opts } = {}) {
        freqs.forEach((f, i) => {
            this._synth({ ...opts, freq: f, delay: (i * interval) / 1000 });
        });
    },


    // ═══════════════════════════════════════════
    //  GAME SOUNDS
    // ═══════════════════════════════════════════

    // ─── Keyboard tap: crisp click ───
    keyTap() {
        this._synth({
            freq: 800, type: 'sine',
            attack: 0.003, decay: 0.025, sustain: 0.1, release: 0.02,
            vol: 0.06
        });
        this._noise({ dur: 0.015, vol: 0.02, filterFreq: 6000 });
        Haptic.keyPress();
    },

    // ─── Tile reveal: CORRECT (green) — bright rising chime ───
    tileRevealCorrect() {
        // Primary bell tone
        this._synth({
            freq: 880, type: 'sine',
            attack: 0.005, decay: 0.08, sustain: 0.4, release: 0.15,
            vol: 0.09, useReverb: true
        });
        // Harmonic shimmer
        this._synth({
            freq: 1320, type: 'triangle',
            attack: 0.01, decay: 0.06, sustain: 0.2, release: 0.12,
            vol: 0.04, detune: 5, useReverb: true
        });
        // Subtle high sparkle
        this._synth({
            freq: 2640, type: 'sine',
            attack: 0.005, decay: 0.04, sustain: 0.1, release: 0.08,
            vol: 0.02
        });
        Haptic.correct();
    },

    // ─── Tile reveal: PRESENT (yellow) — warm muted note ───
    tileRevealPresent() {
        this._synth({
            freq: 660, type: 'sine',
            attack: 0.008, decay: 0.08, sustain: 0.3, release: 0.12,
            vol: 0.07, filterFreq: 2000, useReverb: true
        });
        this._synth({
            freq: 990, type: 'triangle',
            attack: 0.01, decay: 0.05, sustain: 0.15, release: 0.1,
            vol: 0.025, filterFreq: 1500
        });
        Haptic.present();
    },

    // ─── Tile reveal: ABSENT (gray) — soft thud ───
    tileRevealAbsent() {
        this._synth({
            freq: 250, type: 'sine',
            attack: 0.005, decay: 0.06, sustain: 0.15, release: 0.08,
            vol: 0.04, filterFreq: 800
        });
        this._noise({ dur: 0.03, vol: 0.015, filterFreq: 1200 });
        Haptic.absent();
    },

    // ─── WIN — epic victory fanfare with chord resolution ───
    win() {
        // Rising arpeggio: C5 → E5 → G5 → C6 → E6
        const notes = [523, 659, 784, 1047, 1319];
        notes.forEach((f, i) => {
            // Main bell tone
            this._synth({
                freq: f, type: 'sine',
                attack: 0.01, decay: 0.12, sustain: 0.5, release: 0.25,
                vol: 0.08, delay: (i * 100) / 1000, useReverb: true
            });
            // Octave shimmer
            this._synth({
                freq: f * 2, type: 'triangle',
                attack: 0.015, decay: 0.08, sustain: 0.2, release: 0.15,
                vol: 0.025, delay: (i * 100) / 1000, useReverb: true
            });
        });

        // Final resolution chord: C major (C6, E6, G6) with reverb
        const chordDelay = (notes.length * 100 + 80) / 1000;
        [1047, 1319, 1568].forEach(f => {
            this._synth({
                freq: f, type: 'sine',
                attack: 0.02, decay: 0.2, sustain: 0.6, release: 0.5,
                vol: 0.04, delay: chordDelay, useReverb: true
            });
        });

        // Sparkle noise at the end
        this._noise({
            dur: 0.1, vol: 0.02, filterFreq: 8000,
            delay: chordDelay + 0.05
        });

        Haptic.win();
    },

    // ─── LOSE — descending minor with gritty texture ───
    lose() {
        // Descending minor: Eb → C → Ab
        const notes = [
            { freq: 311, delay: 0 },
            { freq: 261, delay: 0.12 },
            { freq: 207, delay: 0.26 }
        ];
        notes.forEach(({ freq, delay }) => {
            this._synth({
                freq, type: 'sawtooth',
                attack: 0.01, decay: 0.12, sustain: 0.3, release: 0.2,
                vol: 0.05, delay, filterFreq: 1200, filterQ: 2
            });
            // Dark undertone
            this._synth({
                freq: freq * 0.5, type: 'sine',
                attack: 0.02, decay: 0.15, sustain: 0.2, release: 0.2,
                vol: 0.03, delay
            });
        });
        // Muffled thump
        this._noise({
            dur: 0.08, vol: 0.02, filterFreq: 600, delay: 0.4
        });
        Haptic.lose();
    },

    // ─── CONQUER CITY — triumphant ascending scale with timpani ───
    conquer() {
        // Heroic scale: A5 → C6 → D6 → E6 → G6 → A6
        const scale = [880, 1047, 1175, 1319, 1568, 1760];
        scale.forEach((f, i) => {
            const d = (i * 70) / 1000;
            // Main tone — progressively brighter
            this._synth({
                freq: f, type: 'sine',
                attack: 0.008, decay: 0.1, sustain: 0.5, release: 0.3,
                vol: 0.07 + i * 0.005, delay: d, useReverb: true
            });
            // Upper harmonic
            this._synth({
                freq: f * 2, type: 'triangle',
                attack: 0.01, decay: 0.06, sustain: 0.15, release: 0.15,
                vol: 0.02, delay: d, useReverb: true
            });
        });

        // Timpani boom at start
        this._synth({
            freq: 80, type: 'sine',
            attack: 0.005, decay: 0.15, sustain: 0.1, release: 0.3,
            vol: 0.06
        });
        this._noise({ dur: 0.06, vol: 0.03, filterFreq: 2000 });

        // Final triumphant chord
        const finalDelay = (scale.length * 70 + 50) / 1000;
        [1760, 2217, 2637].forEach(f => {
            this._synth({
                freq: f, type: 'sine',
                attack: 0.02, decay: 0.25, sustain: 0.5, release: 0.6,
                vol: 0.035, delay: finalDelay, useReverb: true
            });
        });

        Haptic.conquer();
    },

    // ─── HINT — magical sparkle (two-note chime) ───
    hint() {
        this._synth({
            freq: 1200, type: 'sine',
            attack: 0.005, decay: 0.04, sustain: 0.3, release: 0.1,
            vol: 0.06, useReverb: true
        });
        this._synth({
            freq: 1500, type: 'sine',
            attack: 0.005, decay: 0.04, sustain: 0.3, release: 0.1,
            vol: 0.05, delay: 0.06, useReverb: true
        });
        // Tiny sparkle
        this._noise({ dur: 0.02, vol: 0.015, filterFreq: 10000, delay: 0.08 });
    },

    // ─── ERROR — buzzer with filtered crunch ───
    error() {
        this._synth({
            freq: 200, type: 'square',
            attack: 0.005, decay: 0.08, sustain: 0.2, release: 0.1,
            vol: 0.05, filterFreq: 800, filterQ: 3
        });
        this._synth({
            freq: 150, type: 'sawtooth',
            attack: 0.01, decay: 0.06, sustain: 0.15, release: 0.08,
            vol: 0.03, filterFreq: 600
        });
        Haptic.error();
    },

    // ─── BONUS — magical ascending sparkles ───
    bonus() {
        const notes = [1047, 1319, 1568, 2093];
        notes.forEach((f, i) => {
            this._synth({
                freq: f, type: 'sine',
                attack: 0.005, decay: 0.06, sustain: 0.4, release: 0.15,
                vol: 0.06, delay: (i * 55) / 1000, useReverb: true
            });
            // Sparkle harmonic
            this._synth({
                freq: f * 1.5, type: 'triangle',
                attack: 0.01, decay: 0.04, sustain: 0.2, release: 0.1,
                vol: 0.02, delay: (i * 55 + 15) / 1000
            });
        });
        this._noise({ dur: 0.03, vol: 0.015, filterFreq: 12000, delay: 0.25 });
    },

    // ─── STREAK REWARD — triumphant horn call ───
    streakReward() {
        // Horn-like call: C5 → G5 → C6
        const call = [
            { freq: 523, delay: 0 },
            { freq: 784, delay: 0.08 },
            { freq: 1047, delay: 0.16 }
        ];
        call.forEach(({ freq, delay }) => {
            this._synth({
                freq, type: 'sine',
                attack: 0.01, decay: 0.08, sustain: 0.5, release: 0.2,
                vol: 0.07, delay, useReverb: true
            });
            // Warmth layer
            this._synth({
                freq: freq * 0.998, type: 'triangle',
                attack: 0.015, decay: 0.06, sustain: 0.3, release: 0.15,
                vol: 0.025, delay, detune: -3
            });
        });
        Haptic.streak();
    },

    // ─── ACHIEVEMENT UNLOCKED — majestic discovery sound ───
    achievement() {
        // Shimmering reveal
        this._noise({ dur: 0.04, vol: 0.02, filterFreq: 8000 });

        // Rising discovery notes: E5 → G#5 → B5 → E6
        const discovery = [659, 831, 988, 1319];
        discovery.forEach((f, i) => {
            this._synth({
                freq: f, type: 'sine',
                attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.3,
                vol: 0.07, delay: (i * 90 + 40) / 1000, useReverb: true
            });
            this._synth({
                freq: f * 2, type: 'triangle',
                attack: 0.015, decay: 0.06, sustain: 0.2, release: 0.2,
                vol: 0.02, delay: (i * 90 + 40) / 1000, useReverb: true
            });
        });

        // Grand resolution chord: E major
        const cd = (discovery.length * 90 + 120) / 1000;
        [1319, 1661, 1976].forEach(f => {
            this._synth({
                freq: f, type: 'sine',
                attack: 0.025, decay: 0.3, sustain: 0.6, release: 0.6,
                vol: 0.035, delay: cd, useReverb: true
            });
        });
    },

    // ─── REGION COMPLETE — epic orchestral swell ───
    regionComplete() {
        // Low timpani
        this._synth({
            freq: 65, type: 'sine',
            attack: 0.01, decay: 0.2, sustain: 0.15, release: 0.4,
            vol: 0.06
        });
        this._noise({ dur: 0.08, vol: 0.025, filterFreq: 1500 });

        // Ascending fanfare: C4 → E4 → G4 → C5 → E5 → G5 → C6
        const fanfare = [262, 330, 392, 523, 659, 784, 1047];
        fanfare.forEach((f, i) => {
            this._synth({
                freq: f, type: 'sine',
                attack: 0.01, decay: 0.12, sustain: 0.5, release: 0.35,
                vol: 0.06 + i * 0.003,
                delay: (i * 65 + 80) / 1000, useReverb: true
            });
        });

        // Majestic final chord with sustain
        const finalD = (fanfare.length * 65 + 160) / 1000;
        [1047, 1319, 1568, 2093].forEach(f => {
            this._synth({
                freq: f, type: 'sine',
                attack: 0.03, decay: 0.4, sustain: 0.6, release: 0.8,
                vol: 0.03, delay: finalD, useReverb: true
            });
        });

        // Final sparkle
        this._noise({
            dur: 0.12, vol: 0.015, filterFreq: 10000,
            delay: finalD + 0.1
        });
    },

    // ─── FREEZE USED — icy crystalline sound ───
    freeze() {
        // Ice crackle
        this._noise({ dur: 0.06, vol: 0.03, filterFreq: 12000 });

        // Crystalline descending: high → low shimmer
        [3520, 2637, 1760, 1319].forEach((f, i) => {
            this._synth({
                freq: f, type: 'sine',
                attack: 0.003, decay: 0.04, sustain: 0.3, release: 0.12,
                vol: 0.04, delay: (i * 45 + 30) / 1000, useReverb: true
            });
        });

        // Deep frozen bass
        this._synth({
            freq: 120, type: 'sine',
            attack: 0.02, decay: 0.2, sustain: 0.2, release: 0.3,
            vol: 0.04, delay: 0.25, filterFreq: 400
        });
    },

    // ─── MAP CLICK — subtle location ping ───
    mapClick() {
        this._synth({
            freq: 1000, type: 'sine',
            attack: 0.003, decay: 0.03, sustain: 0.2, release: 0.06,
            vol: 0.04
        });
        this._synth({
            freq: 1500, type: 'triangle',
            attack: 0.005, decay: 0.02, sustain: 0.1, release: 0.04,
            vol: 0.02, delay: 0.02
        });
    },

    // ─── TUTORIAL STEP — gentle notification ───
    tutorialStep() {
        this._synth({
            freq: 700, type: 'sine',
            attack: 0.01, decay: 0.06, sustain: 0.3, release: 0.12,
            vol: 0.05, useReverb: true
        });
        this._synth({
            freq: 1050, type: 'triangle',
            attack: 0.015, decay: 0.04, sustain: 0.2, release: 0.1,
            vol: 0.025, delay: 0.04
        });
    },
};
