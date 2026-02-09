// ============================================================
// IDLE KINGDOM v3.1 — Balanced & Content-Rich Edition
// Dopamine Loops, Scarcity, FOMO, Variable Rewards, Near-Miss
// Daily Rewards, Flash Sales, Tap Jackpots, Streak System
// 12 Buildings, 10 Heroes, 12 Bosses, 20 Upgrades, 30 Achievements
// ============================================================

// ===== NUMBER FORMATTER =====
function fmt(n) {
    if (n >= 1e15) return (n / 1e15).toFixed(2) + 'Q';
    if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K';
    return Math.floor(n).toString();
}

// ===== ENHANCED SOUND SYSTEM =====
const SFX = {
    ctx: null,
    enabled: true,
    masterGain: null,
    volume: 0.5, // master volume 0-1
    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = this.volume;
            this.masterGain.connect(this.ctx.destination);
        } catch (e) { this.enabled = false; }
    },
    resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); },
    setVolume(v) { this.volume = v; if (this.masterGain) this.masterGain.gain.value = v; },

    // Core oscillator with optional filter
    _play(freq, type, dur, vol = 0.1, detune = 0, filterFreq = 0) {
        if (!this.enabled || !this.ctx || !this.masterGain) return;
        try {
            const c = this.ctx, t = c.currentTime;
            const o = c.createOscillator(), g = c.createGain();
            o.type = type; o.frequency.value = freq; o.detune.value = detune;
            g.gain.setValueAtTime(vol, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + dur);
            if (filterFreq > 0) {
                const f = c.createBiquadFilter();
                f.type = 'lowpass'; f.frequency.value = filterFreq; f.Q.value = 1;
                o.connect(f); f.connect(g);
            } else {
                o.connect(g);
            }
            g.connect(this.masterGain);
            o.start(t); o.stop(t + dur);
        } catch(e) {}
    },

    // Noise burst for impacts
    _noise(dur, vol = 0.05, filterFreq = 3000) {
        if (!this.enabled || !this.ctx || !this.masterGain) return;
        try {
            const c = this.ctx, t = c.currentTime;
            const bufSize = c.sampleRate * dur;
            const buf = c.createBuffer(1, bufSize, c.sampleRate);
            const data = buf.getChannelData(0);
            for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);
            const src = c.createBufferSource();
            src.buffer = buf;
            const g = c.createGain();
            g.gain.setValueAtTime(vol, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + dur);
            const f = c.createBiquadFilter();
            f.type = 'bandpass'; f.frequency.value = filterFreq; f.Q.value = 2;
            src.connect(f); f.connect(g); g.connect(this.masterGain);
            src.start(t); src.stop(t + dur);
        } catch(e) {}
    },

    // Chord: multiple frequencies at once
    _chord(freqs, type, dur, vol = 0.06) {
        freqs.forEach(f => this._play(f, type, dur, vol / freqs.length));
    },

    // --- GAME SOUNDS ---
    tap() {
        this._play(800, 'sine', 0.05, 0.07, 0, 2000);
        this._noise(0.02, 0.02, 5000);
    },
    critTap() {
        this._play(1000, 'sine', 0.06, 0.1);
        this._play(1500, 'sine', 0.04, 0.07);
        this._noise(0.04, 0.04, 6000);
        this._play(2000, 'triangle', 0.03, 0.04);
    },
    buy() {
        this._play(523, 'sine', 0.06, 0.08, 0, 3000);
        setTimeout(() => this._play(784, 'sine', 0.06, 0.06, 0, 3000), 40);
        this._noise(0.03, 0.015, 2000);
    },
    upgrade() {
        [440, 554, 659, 880].forEach((f, i) =>
            setTimeout(() => this._play(f, 'sine', 0.12, 0.09, 0, 4000), i * 70)
        );
        setTimeout(() => this._noise(0.05, 0.02, 4000), 200);
    },
    bossHit() {
        this._play(120, 'square', 0.04, 0.05, 0, 500);
        this._noise(0.03, 0.03, 800);
    },
    bossWin() {
        // Triumphant fanfare with harmony
        const fanfare = [523, 659, 784, 1047, 1319];
        fanfare.forEach((f, i) => {
            setTimeout(() => {
                this._play(f, 'sine', 0.25, 0.08);
                this._play(f * 1.5, 'triangle', 0.2, 0.03);
            }, i * 110);
        });
        setTimeout(() => this._chord([1047, 1319, 1568], 'sine', 0.4, 0.1), 550);
        setTimeout(() => this._noise(0.1, 0.02, 3000), 500);
    },
    bossLose() {
        this._play(300, 'sawtooth', 0.2, 0.06, 0, 600);
        setTimeout(() => this._play(200, 'sawtooth', 0.25, 0.05, 0, 400), 120);
        setTimeout(() => this._play(120, 'sawtooth', 0.3, 0.04, 0, 300), 260);
        this._noise(0.15, 0.03, 400);
    },
    prestige() {
        // Magical ascending with shimmer
        [880, 1047, 1175, 1319, 1568, 1760].forEach((f, i) => {
            setTimeout(() => {
                this._play(f, 'sine', 0.3, 0.08);
                this._play(f * 2, 'triangle', 0.15, 0.03);
            }, i * 100);
        });
        setTimeout(() => this._chord([1568, 1976, 2349], 'sine', 0.5, 0.08), 600);
        setTimeout(() => this._noise(0.2, 0.02, 6000), 550);
    },
    achievement() {
        [659, 784, 988, 1175, 1319].forEach((f, i) =>
            setTimeout(() => {
                this._play(f, 'triangle', 0.18, 0.07);
                this._play(f * 0.5, 'sine', 0.12, 0.03);
            }, i * 70)
        );
        setTimeout(() => this._noise(0.08, 0.015, 5000), 300);
    },
    lucky() {
        // Magical sparkle ascending
        [523, 659, 784, 988, 1175, 1319, 1568].forEach((f, i) =>
            setTimeout(() => this._play(f, 'sine', 0.12, 0.06, Math.random() * 20 - 10), i * 50)
        );
    },
    combo() {
        // Rising pitch based on combo count (connected from caller)
        this._play(800 + Math.random() * 400, 'sine', 0.03, 0.05);
    },
    comboMilestone() {
        // Every 10 combos
        this._chord([1047, 1319, 1568], 'sine', 0.15, 0.08);
        this._noise(0.04, 0.02, 4000);
    },
    jackpot() {
        // Slot machine celebration
        [784, 988, 1175].forEach((f, i) =>
            setTimeout(() => {
                this._play(f, 'sine', 0.15, 0.08);
                this._play(f, 'triangle', 0.1, 0.04);
            }, i * 60)
        );
        setTimeout(() => this._chord([1175, 1480, 1760], 'sine', 0.3, 0.1), 200);
        setTimeout(() => this._noise(0.08, 0.025, 5000), 250);
    },
    flashSale() {
        // Urgent notification
        this._play(1000, 'square', 0.05, 0.04, 0, 2000);
        setTimeout(() => this._play(1200, 'square', 0.05, 0.04, 0, 2000), 80);
        setTimeout(() => this._play(1000, 'square', 0.05, 0.04, 0, 2000), 160);
    },
    dailyReward() {
        // Gift unwrapping sound
        this._noise(0.05, 0.03, 3000);
        [523, 659, 784, 1047].forEach((f, i) =>
            setTimeout(() => this._play(f, 'sine', 0.2, 0.08), i * 80 + 50)
        );
    },
    error() {
        this._play(200, 'square', 0.08, 0.04, 0, 600);
        this._play(180, 'square', 0.06, 0.03, 0, 500);
    },
    // Background ambient hum (subtle)
    _ambientNode: null,
    startAmbient() {
        if (!this.enabled || !this.ctx || !this.masterGain || this._ambientNode) return;
        try {
            const c = this.ctx;
            const o = c.createOscillator();
            const g = c.createGain();
            const f = c.createBiquadFilter();
            o.type = 'sine'; o.frequency.value = 80;
            f.type = 'lowpass'; f.frequency.value = 120; f.Q.value = 0.5;
            g.gain.value = 0.008;
            o.connect(f); f.connect(g); g.connect(this.masterGain);
            o.start();
            this._ambientNode = { osc: o, gain: g };
        } catch(e) {}
    },
    stopAmbient() {
        if (this._ambientNode) {
            try { this._ambientNode.osc.stop(); } catch(e) {}
            this._ambientNode = null;
        }
    }
};

// ===== PARTICLE SYSTEM (Gold Rain) =====
const Particles = {
    canvas: null,
    ctx: null,
    particles: [],
    active: false,
    init() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    },
    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    spawn(count, type) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * (this.canvas ? this.canvas.width : 400),
                y: -20 - Math.random() * 100,
                vx: (Math.random() - 0.5) * 2,
                vy: 2 + Math.random() * 4,
                size: 8 + Math.random() * 14,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.2,
                life: 1,
                decay: 0.008 + Math.random() * 0.008,
                emoji: type === 'gold' ? '🪙' : type === 'gem' ? '💎' : '⭐',
            });
        }
        if (!this.active) {
            this.active = true;
            this.animate();
        }
    },
    animate() {
        if (!this.ctx || !this.canvas) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // gravity
            p.rotation += p.rotSpeed;
            p.life -= p.decay;
            if (p.life <= 0) return false;
            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.ctx.font = `${p.size}px serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(p.emoji, 0, 0);
            this.ctx.restore();
            return true;
        });
        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.active = false;
            if (this.ctx && this.canvas) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
};

// ===== BUILDING DEFINITIONS =====
const BUILDINGS = [
    { id: 'farm',      icon: '🌾', name: 'Çiftlik',       desc: 'Temel altın üretir',        baseCost: 15,     baseGPS: 1,       costMult: 1.15, unlockAt: 0 },
    { id: 'mine',      icon: '⛏️', name: 'Maden',         desc: 'Topraktan altın çıkarır',    baseCost: 100,    baseGPS: 5,       costMult: 1.15, unlockAt: 50 },
    { id: 'lumber',    icon: '🪵', name: 'Kereste Ocağı', desc: 'Ağaçları altına çevirir',    baseCost: 500,    baseGPS: 22,      costMult: 1.15, unlockAt: 300 },
    { id: 'blacksmith',icon: '⚒️', name: 'Demirci',       desc: 'Silah ve zırh üretir',       baseCost: 2500,   baseGPS: 100,     costMult: 1.15, unlockAt: 1500 },
    { id: 'market',    icon: '🏪', name: 'Pazar',         desc: 'Ticaretle kazanç sağlar',    baseCost: 12000,  baseGPS: 450,     costMult: 1.15, unlockAt: 8000 },
    { id: 'temple',    icon: '⛪', name: 'Tapınak',       desc: 'Dua gücüyle altın yağar',    baseCost: 60000,  baseGPS: 2000,    costMult: 1.15, unlockAt: 40000 },
    { id: 'academy',   icon: '🏛️', name: 'Akademi',       desc: 'Bilgi güçtür, güç altındır', baseCost: 300000, baseGPS: 9000,    costMult: 1.15, unlockAt: 200000 },
    { id: 'castle',      icon: '🏰', name: 'Kale',           desc: 'Krallığın kalbi',              baseCost: 1.5e6,  baseGPS: 40000,   costMult: 1.15, unlockAt: 1e6 },
    { id: 'observatory', icon: '🔭', name: 'Gözlemevi',     desc: 'Yıldızlardan altın yaratır',   baseCost: 15e6,   baseGPS: 300000,  costMult: 1.15, unlockAt: 10e6 },
    { id: 'wizard_tower',icon: '🗼', name: 'Büyücü Kulesi', desc: 'Büyüyle altın çoğaltır',       baseCost: 150e6,  baseGPS: 2e6,     costMult: 1.15, unlockAt: 100e6 },
    { id: 'dragon_nest', icon: '🏔️', name: 'Ejderha Yuvası',desc: 'Ejderhalar hazine getirir',    baseCost: 1.5e9,  baseGPS: 15e6,    costMult: 1.15, unlockAt: 1e9 },
    { id: 'cosmic_gate', icon: '🌌', name: 'Evren Kapısı',  desc: 'Başka boyutlardan servet akıtır',baseCost: 15e9,  baseGPS: 100e6,   costMult: 1.15, unlockAt: 10e9 },
];

// ===== HERO DEFINITIONS =====
const HEROES = [
    { id: 'knight',    icon: '🗡️', name: 'Şövalye',       desc: 'Boss hasar x2',              baseCost: 500,    baseDPS: 10,    costMult: 1.20, unlockAt: 200, ability: 'bossDmg' },
    { id: 'archer',    icon: '🏹', name: 'Okçu',          desc: 'Kritik şans %10',            baseCost: 2000,   baseDPS: 25,    costMult: 1.20, unlockAt: 1000, ability: 'critChance' },
    { id: 'mage',      icon: '🧙', name: 'Büyücü',        desc: 'Altın üretimi +%15',         baseCost: 10000,  baseDPS: 80,    costMult: 1.20, unlockAt: 5000, ability: 'goldBoost' },
    { id: 'healer',    icon: '💚', name: 'Şifacı',        desc: 'Boss süresi +5s',            baseCost: 50000,  baseDPS: 200,   costMult: 1.20, unlockAt: 25000, ability: 'bossTime' },
    { id: 'dragon',    icon: '🐲', name: 'Ejderha Binici', desc: 'Tüm hasar x3',              baseCost: 250000, baseDPS: 600,   costMult: 1.20, unlockAt: 100000, ability: 'allDmg' },
    { id: 'angel',       icon: '👼', name: 'Melek',           desc: 'Offline kazanç x2',            baseCost: 1e6,    baseDPS: 2000,   costMult: 1.20, unlockAt: 500000, ability: 'offlineBoost' },
    { id: 'phoenix',     icon: '🔥', name: 'Anka Kuşu',      desc: 'Her 60s altın x2 patlaması',   baseCost: 5e6,    baseDPS: 8000,   costMult: 1.20, unlockAt: 3e6, ability: 'phoenix' },
    { id: 'necromancer', icon: '☠️', name: 'Ölü Büyücü',     desc: 'Her boss +%2 kalıcı altın',    baseCost: 25e6,   baseDPS: 30000,  costMult: 1.20, unlockAt: 15e6, ability: 'bossStack' },
    { id: 'valkyrie',    icon: '⚔️', name: 'Valkyrie',       desc: 'Combo x altın çarpanı',        baseCost: 125e6,  baseDPS: 120000, costMult: 1.20, unlockAt: 75e6, ability: 'comboGold' },
    { id: 'timeLord',    icon: '⏳', name: 'Zaman Lordu',    desc: 'Tüm üretim %20 hızlı',        baseCost: 750e6,  baseDPS: 500000, costMult: 1.20, unlockAt: 400e6, ability: 'timeAccel' },
];

// ===== UPGRADE DEFINITIONS =====
const UPGRADES = [
    { id: 'tap2x',      icon: '👆', name: 'Güçlü Dokunuş',      desc: 'Dokunuş gücü x2',                  cost: 200,    effect: () => { state.tapMult *= 2; } },
    { id: 'farm2x',     icon: '🌾', name: 'Verimli Çiftlik',     desc: 'Çiftlik üretimi x2',               cost: 500,    effect: () => { state.buildingMult.farm = (state.buildingMult.farm||1) * 2; } },
    { id: 'mine2x',     icon: '⛏️', name: 'Derin Maden',         desc: 'Maden üretimi x2',                 cost: 2000,   effect: () => { state.buildingMult.mine = (state.buildingMult.mine||1) * 2; } },
    { id: 'tap5x',      icon: '💥', name: 'Yıkıcı Dokunuş',     desc: 'Dokunuş gücü x5',                  cost: 10000,  effect: () => { state.tapMult *= 5; } },
    { id: 'lumber2x',   icon: '🪵', name: 'Keskin Balta',        desc: 'Kereste üretimi x2',               cost: 5000,   effect: () => { state.buildingMult.lumber = (state.buildingMult.lumber||1) * 2; } },
    { id: 'allprod',    icon: '📈', name: 'Ekonomi Devrimi',     desc: 'Tüm üretim x2',                   cost: 150000, effect: () => { state.globalMult *= 2; } },
    { id: 'black2x',    icon: '⚒️', name: 'Usta Demirci',        desc: 'Demirci üretimi x3',               cost: 25000,  effect: () => { state.buildingMult.blacksmith = (state.buildingMult.blacksmith||1) * 3; } },
    { id: 'market2x',   icon: '🏪', name: 'Ticaret İmparatorluğu', desc: 'Pazar üretimi x3',              cost: 100000, effect: () => { state.buildingMult.market = (state.buildingMult.market||1) * 3; } },
    { id: 'tap10x',     icon: '⚡', name: 'Tanrı Dokunuşu',     desc: 'Dokunuş gücü x10',                 cost: 500000, effect: () => { state.tapMult *= 10; } },
    { id: 'allprod2',   icon: '🚀', name: 'Sanayi Devrimi',     desc: 'Tüm üretim x5',                   cost: 5e6,    effect: () => { state.globalMult *= 5; } },
    { id: 'temple3x',   icon: '⛪', name: 'Kutsal Güç',          desc: 'Tapınak üretimi x3',               cost: 500000, effect: () => { state.buildingMult.temple = (state.buildingMult.temple||1) * 3; } },
    { id: 'academy3x',  icon: '🏛️', name: 'Altın Bilgi',         desc: 'Akademi üretimi x3',               cost: 2e6,    effect: () => { state.buildingMult.academy = (state.buildingMult.academy||1) * 3; } },
    { id: 'obs2x',      icon: '🔭', name: 'Gelişmiş Teleskop',  desc: 'Gözlemevi üretimi x3',             cost: 10e6,   effect: () => { state.buildingMult.observatory = (state.buildingMult.observatory||1) * 3; } },
    { id: 'wizard2x',   icon: '🗼', name: 'Büyü Yükseltmesi',   desc: 'Büyücü Kulesi üretimi x3',        cost: 100e6,  effect: () => { state.buildingMult.wizard_tower = (state.buildingMult.wizard_tower||1) * 3; } },
    { id: 'dragon_hoard',icon: '🏔️', name: 'Ejderha Hazinesi',  desc: 'Ejderha Yuvası üretimi x3',       cost: 1e9,    effect: () => { state.buildingMult.dragon_nest = (state.buildingMult.dragon_nest||1) * 3; } },
    { id: 'cosmic_power',icon: '🌌', name: 'Evren Gücü',         desc: 'Evren Kapısı üretimi x3',         cost: 10e9,   effect: () => { state.buildingMult.cosmic_gate = (state.buildingMult.cosmic_gate||1) * 3; } },
    { id: 'tap_critx2', icon: '💢', name: 'Kritik Patlama',     desc: 'Kritik hasar x2',                  cost: 5e6,    effect: () => { state.critDmgMult = (state.critDmgMult||3) * 2; } },
    { id: 'auto_tap',   icon: '🤖', name: 'Oto-Dokunuş',        desc: 'Saniyede 3 otomatik dokunuş',      cost: 50e6,   effect: () => { state.autoTapRate = (state.autoTapRate||0) + 3; } },
    { id: 'gem_find',   icon: '💎', name: 'Mücevher Madencisi', desc: 'Boss mücevheri %50 fazla',         cost: 100e6,  effect: () => { state.gemBossMult = (state.gemBossMult||1) * 1.5; } },
    { id: 'allprod3',   icon: '⚡', name: 'Kozmik Devrim',      desc: 'Tüm üretim x3',                   cost: 500e6,  effect: () => { state.globalMult *= 3; } },
];

// ===== BOSS DEFINITIONS =====
const BOSSES = [
    { name: 'Goblin Şef',      icon: '👺', hp: 200,    reward: 300,    gemReward: 1, timer: 45 },
    { name: 'İskelet Kral',    icon: '💀', hp: 2000,   reward: 1500,   gemReward: 2, timer: 30 },
    { name: 'Ogre Lordu',      icon: '👹', hp: 8000,   reward: 8000,   gemReward: 3, timer: 30 },
    { name: 'Vampir Kontu',    icon: '🧛', hp: 30000,  reward: 40000,  gemReward: 5, timer: 30 },
    { name: 'Ejderha',         icon: '🐉', hp: 100000, reward: 200000, gemReward: 10, timer: 30 },
    { name: 'Karanlık Lord',   icon: '😈', hp: 500000, reward: 1e6,    gemReward: 20, timer: 30 },
    { name: 'Titan',           icon: '🗿', hp: 2e6,    reward: 5e6,    gemReward: 50, timer: 30 },
    { name: 'Evren Yıkıcı',   icon: '🌑', hp: 1e7,    reward: 3e7,    gemReward: 100, timer: 30 },
    { name: 'Kraken',          icon: '🦑', hp: 5e7,    reward: 1.5e8,  gemReward: 200, timer: 30 },
    { name: 'Fırtına Dev',     icon: '⛈️', hp: 2.5e8,  reward: 8e8,    gemReward: 400, timer: 30 },
    { name: 'Kadim Gölge',     icon: '👤', hp: 1.5e9,  reward: 5e9,    gemReward: 800, timer: 30 },
    { name: 'Kıyamet Meleği',  icon: '😇', hp: 1e10,   reward: 4e10,   gemReward: 2000, timer: 30 },
];

// ===== ACHIEVEMENT DEFINITIONS =====
const ACHIEVEMENTS = [
    { id: 'first_tap',     icon: '👆', name: 'İlk Dokunuş',     desc: '1 kez dokun',           check: () => state.totalClicks >= 1, reward: 5 },
    { id: 'tap_100',       icon: '💪', name: 'Hızlı Parmak',    desc: '100 kez dokun',         check: () => state.totalClicks >= 100, reward: 10 },
    { id: 'tap_1000',      icon: '🔥', name: 'Ateş Parmak',     desc: '1000 kez dokun',        check: () => state.totalClicks >= 1000, reward: 25 },
    { id: 'tap_10000',     icon: '⚡', name: 'Şimşek Hızı',    desc: '10.000 kez dokun',      check: () => state.totalClicks >= 10000, reward: 100 },
    { id: 'gold_1k',       icon: '🪙', name: 'Altın Avcısı',    desc: '1K altın kazan',        check: () => state.totalGold >= 1000, reward: 5 },
    { id: 'gold_100k',     icon: '💰', name: 'Zengin',           desc: '100K altın kazan',      check: () => state.totalGold >= 100000, reward: 20 },
    { id: 'gold_1m',       icon: '🤑', name: 'Milyoner',         desc: '1M altın kazan',        check: () => state.totalGold >= 1e6, reward: 50 },
    { id: 'gold_1b',       icon: '👑', name: 'Milyarder',        desc: '1B altın kazan',        check: () => state.totalGold >= 1e9, reward: 200 },
    { id: 'building_5',    icon: '🏘️', name: 'Köy Kurucusu',    desc: '5 bina inşa et',        check: () => getKingdomLevel() >= 5, reward: 10 },
    { id: 'building_20',   icon: '🏙️', name: 'Şehir Plancısı',  desc: '20 bina inşa et',       check: () => getKingdomLevel() >= 20, reward: 25 },
    { id: 'building_50',   icon: '🌆', name: 'İmparator',        desc: '50 bina inşa et',       check: () => getKingdomLevel() >= 50, reward: 75 },
    { id: 'boss_1',        icon: '⚔️', name: 'Boss Avcısı',     desc: 'İlk bossu yen',         check: () => state.bossIndex >= 1, reward: 15 },
    { id: 'boss_5',        icon: '🛡️', name: 'Savaş Lordu',     desc: '5 boss yen',            check: () => state.bossIndex >= 5, reward: 40 },
    { id: 'boss_8',        icon: '🏆', name: 'Efsane',            desc: 'Tüm bossları yen',     check: () => state.bossIndex >= 12, reward: 100 },
    { id: 'hero_1',        icon: '🗡️', name: 'İlk Kahraman',    desc: 'Bir kahraman al',       check: () => Object.values(state.heroes).some(l => l > 0), reward: 10 },
    { id: 'hero_all',      icon: '⚔️', name: 'Ordu Komutanı',   desc: 'Tüm kahramanları al',   check: () => HEROES.every(h => (state.heroes[h.id]||0) > 0), reward: 100 },
    { id: 'prestige_1',    icon: '⭐', name: 'Yeniden Doğuş',   desc: 'İlk prestige yap',      check: () => state.prestigeStars >= 1, reward: 30 },
    { id: 'prestige_10',   icon: '🌟', name: 'Yıldız Lordu',    desc: '10 prestige yıldızı',   check: () => state.prestigeStars >= 10, reward: 100 },
    { id: 'combo_10',      icon: '🔥', name: 'Combo Ustası',    desc: '10x combo yap',         check: () => state.maxCombo >= 10, reward: 15 },
    { id: 'lucky_1',       icon: '🍀', name: 'Şanslı',           desc: 'Şans olayı yaşa',      check: () => state.luckyEvents >= 1, reward: 10 },
    { id: 'tap_50k',      icon: '🌪️', name: 'Kasırga Parmak',  desc: '50.000 kez dokun',      check: () => state.totalClicks >= 50000, reward: 300 },
    { id: 'gold_1t',      icon: '💸', name: 'Trilyoner',        desc: '1T altın kazan',        check: () => state.totalGold >= 1e12, reward: 500 },
    { id: 'building_100', icon: '🌍', name: 'Dünya İmparatoru', desc: '100 bina inşa et',      check: () => getKingdomLevel() >= 100, reward: 200 },
    { id: 'building_200', icon: '🏗️', name: 'Mega Mimar',      desc: '200 bina inşa et',      check: () => getKingdomLevel() >= 200, reward: 400 },
    { id: 'combo_50',     icon: '💥', name: 'Kombo Tanrısı',   desc: '50x combo yap',         check: () => state.maxCombo >= 50, reward: 75 },
    { id: 'prestige_5',   icon: '🌟', name: 'Yıldız Avcısı',   desc: '5 prestige yıldızı',    check: () => state.prestigeStars >= 5, reward: 50 },
    { id: 'prestige_50',  icon: '✨', name: 'Yıldız Efendisi',  desc: '50 prestige yıldızı',   check: () => state.prestigeStars >= 50, reward: 500 },
    { id: 'hero_maxed',   icon: '💪', name: 'Ordu Efsanesi',   desc: 'Bir kahramanı Lv.50',   check: () => Object.values(state.heroes).some(l => l >= 50), reward: 150 },
    { id: 'jackpot_1',    icon: '🎰', name: 'Şanslı Dokunuş',  desc: 'İlk jackpot!',          check: () => state.totalJackpots >= 1, reward: 15 },
    { id: 'jackpot_10',   icon: '🎯', name: 'Şans Ustası',     desc: '10 jackpot kazan',      check: () => state.totalJackpots >= 10, reward: 50 },
];

// ===== DAILY REWARD SYSTEM (Hook Model + Loss Aversion) =====
const DAILY_REWARDS = [
    { day: 1, icon: '🪙', name: '100 Altın',     type: 'gold', amount: 100 },
    { day: 2, icon: '💎', name: '5 Mücevher',     type: 'gem',  amount: 5 },
    { day: 3, icon: '🪙', name: '500 Altın',      type: 'gold', amount: 500 },
    { day: 4, icon: '💎', name: '10 Mücevher',    type: 'gem',  amount: 10 },
    { day: 5, icon: '⚡', name: 'x2 Üretim 60s',  type: 'boost', amount: 60 },
    { day: 6, icon: '💎', name: '25 Mücevher',    type: 'gem',  amount: 25 },
    { day: 7, icon: '🌟', name: 'MEGA ÖDÜL!',     type: 'mega', amount: 1 },
];

// ===== FLASH SALE DEFINITIONS (Scarcity Principle + FOMO) =====
const FLASH_SALES = [
    { id: 'prod2x',   icon: '📈', name: 'Üretim x2',        desc: '60 saniye tüm üretim 2 katı!',  normalCost: 80,  saleCost: 25, duration: 60, effect: 'prodBoost', mult: 2 },
    { id: 'tap5x',    icon: '👆', name: 'Mega Dokunuş',      desc: '30 saniye dokunuş 5 katı!',      normalCost: 60,  saleCost: 15, duration: 30, effect: 'tapBoost',  mult: 5 },
    { id: 'gold10x',  icon: '🪙', name: 'Altın Patlaması',   desc: '45 saniye altın 10 katı!',       normalCost: 150, saleCost: 40, duration: 45, effect: 'goldRain',  mult: 10 },
    { id: 'crit100',  icon: '🎯', name: 'Kritik Ustası',     desc: '30 saniye %100 kritik!',         normalCost: 100, saleCost: 30, duration: 30, effect: 'critBoost', mult: 1 },
];

// ===== TAP JACKPOT DEFINITIONS (Variable Ratio Reinforcement) =====
const TAP_JACKPOTS = [
    { chance: 0.05,   name: 'Mini Bonus!',      mult: 3,   icon: '✨', particles: 5 },   // 5% chance
    { chance: 0.015,  name: 'Süper Bonus!',      mult: 10,  icon: '💫', particles: 10 },  // 1.5% chance
    { chance: 0.003,  name: '🎰 JACKPOT!',       mult: 50,  icon: '🌟', particles: 25 },  // 0.3% chance
    { chance: 0.0005, name: '⭐ MEGA JACKPOT!',  mult: 200, icon: '👑', particles: 40 },  // 0.05% chance
];

// ===== LUCKY EVENTS =====
const LUCKY_EVENTS = [
    { icon: '🪙', text: 'Altın Yağmuru! x5 üretim',    duration: 10, effect: 'goldRain',   mult: 5 },
    { icon: '⚡', text: 'Dokunuş Fırtınası! x10 dokunuş', duration: 8, effect: 'tapStorm', mult: 10 },
    { icon: '💎', text: 'Mücevher Şöleni! +5 💎',        duration: 5, effect: 'gemBonus',   mult: 5 },
    { icon: '🔥', text: 'Çılgın Hız! x3 üretim',        duration: 15, effect: 'speedBoost', mult: 3 },
    { icon: '🎯', text: '%100 Kritik Şans!',              duration: 8, effect: 'critBoost',  mult: 1 },
];

// ===== TUTORIAL SYSTEM =====
// Steps: 0=tap to earn, 1=buy first building, 2=done (auto-dismiss)
const Tutorial = {
    step: -1, // -1 = not started
    active: false,
    dismissed: false,
    el: null,
    arrowEl: null,
    _lastStep: -1,
    _scrolled: false,
    _highlighted: false,

    init() {
        // Create tutorial banner
        this.el = document.createElement('div');
        this.el.id = 'tutorial-banner';
        this.el.style.display = 'none';
        this.el.innerHTML = `
            <div id="tutorial-content">
                <span id="tutorial-icon">👆</span>
                <span id="tutorial-text">Altın kazanmak için daireye dokun!</span>
            </div>
            <div id="tutorial-progress">
                <div class="tut-dot active"></div>
                <div class="tut-dot"></div>
                <div class="tut-dot"></div>
            </div>
        `;
        document.body.appendChild(this.el);

        // Create floating arrow
        this.arrowEl = document.createElement('div');
        this.arrowEl.id = 'tutorial-arrow';
        this.arrowEl.innerHTML = '👇';
        this.arrowEl.style.display = 'none';
        document.body.appendChild(this.arrowEl);
    },

    start(startStep) {
        this.step = startStep || 0;
        this.active = true;
        this.dismissed = false;
        this._lastStep = -1;
        this._scrolled = false;
        this._highlighted = false;
        this.render();
    },

    update() {
        if (this.dismissed || !this.active) return;

        const level = getKingdomLevel();

        // Step 0: Tap to earn gold — advance after 3 clicks
        if (this.step === 0 && state.totalClicks >= 3) {
            this.step = 1;
            this._scrolled = false;
            this._highlighted = false;
        }

        // Step 1: Buy first building
        if (this.step === 1 && level >= 1) {
            this.step = 2;
        }

        // Step 2: Tutorial complete
        if (this.step === 2) {
            this.complete();
            return;
        }

        // Only re-render on step change
        if (this.step !== this._lastStep) {
            this._lastStep = this.step;
            this.render();
        }
    },

    render() {
        if (!this.el || this.dismissed) return;
        this.el.style.display = 'block';

        const icon = this.el.querySelector('#tutorial-icon');
        const text = this.el.querySelector('#tutorial-text');
        const dots = this.el.querySelectorAll('.tut-dot');

        dots.forEach((d, i) => d.classList.toggle('active', i <= this.step));

        if (this.step === 0) {
            if (icon) icon.textContent = '👆';
            if (text) text.textContent = 'Altın kazanmak için daireye dokun!';
            if (this.arrowEl) this.arrowEl.style.display = 'none';
            this.removeHighlights();
        } else if (this.step === 1) {
            if (icon) icon.textContent = '👇';
            if (text) text.textContent = 'Şimdi aşağıdaki binaya tıkla! Otomatik altın kazanırsın!';
            // Scroll once only
            if (!this._scrolled) {
                this._scrolled = true;
                this.scrollToBuildings();
            }
            // Highlight once (will be re-applied after renderBuildings too)
            if (!this._highlighted) {
                this._highlighted = true;
                this.applyHighlight();
            }
        }
    },

    applyHighlight() {
        // Delay to let renderBuildings finish first
        setTimeout(() => {
            const cards = document.querySelectorAll('.building-card');
            if (cards.length > 0) {
                cards[0].classList.add('tutorial-highlight');
                // Position arrow
                if (this.arrowEl && this.active && !this.dismissed) {
                    const rect = cards[0].getBoundingClientRect();
                    this.arrowEl.style.display = 'block';
                    this.arrowEl.style.left = (rect.left + rect.width / 2 - 15) + 'px';
                    this.arrowEl.style.top = (rect.top - 40) + 'px';
                }
            }
        }, 150);
    },

    scrollToBuildings() {
        setTimeout(() => {
            const gameArea = document.getElementById('game-area');
            const buildingsPanel = document.getElementById('buildings-panel');
            if (gameArea && buildingsPanel) {
                const panelTop = buildingsPanel.offsetTop - 80;
                gameArea.scrollTo({ top: panelTop, behavior: 'smooth' });
            }
        }, 200);
    },

    removeHighlights() {
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
        if (this.arrowEl) this.arrowEl.style.display = 'none';
    },

    complete() {
        this.active = false;
        this.dismissed = true;

        if (this.el) {
            const icon = this.el.querySelector('#tutorial-icon');
            const text = this.el.querySelector('#tutorial-text');
            if (icon) icon.textContent = '🎉';
            if (text) text.textContent = 'Harika! Artık krallığını büyütebilirsin!';
            this.el.classList.add('tutorial-complete');

            setTimeout(() => {
                if (this.el) this.el.style.display = 'none';
            }, 3000);
        }

        this.removeHighlights();
    },

    // Check if should show (don't show if player already has buildings)
    shouldShow() {
        return getKingdomLevel() === 0 && !state.tutorialDone;
    }
};

// ===== GAME STATE =====
const state = {
    gold: 0,
    totalGold: 0,
    gems: 0,
    prestigeStars: 0,
    prestigeMult: 1,
    tapMult: 1,
    globalMult: 1,
    buildingMult: {},
    buildings: {},
    heroes: {},
    upgrades: {},
    achievements: {},
    bossIndex: 0,
    bossHP: 0,
    bossMaxHP: 0,
    bossActive: false,
    bossTimer: 0,
    currentTab: 'buildings',
    lastSave: Date.now(),
    lastTick: Date.now(),
    totalClicks: 0,
    tutorialDone: false,
    // New v2 state
    comboCount: 0,
    comboTimer: 0,
    maxCombo: 0,
    luckyActive: false,
    luckyEvent: null,
    luckyTimer: 0,
    luckyEvents: 0,
    critChance: 0.05, // 5% base
    // v3 Psychology systems
    dailyStreak: 0,
    dailyLastClaim: 0,    // timestamp of last daily claim
    dailyClaimed: [],      // array of day indexes claimed this week
    flashSaleActive: false,
    flashSale: null,
    flashSaleTimer: 0,
    flashSaleBoostTimer: 0,
    flashSaleBoost: null,
    totalJackpots: 0,
    lastSessionDate: '',   // YYYY-MM-DD string
    // v3.1 Expansion state
    autoTapRate: 0,        // auto-taps per second
    critDmgMult: 3,        // crit damage multiplier (default 3x)
    gemBossMult: 1,        // gem reward multiplier from bosses
    phoenixTimer: 0,       // phoenix hero cooldown
    phoenixActive: false,  // phoenix burst active
};

// ===== DOM CACHE =====
let DOM = {};
function cacheDom() {
    DOM = {
        goldAmount:    document.getElementById('gold-amount'),
        goldRate:      document.getElementById('gold-rate'),
        gemsAmount:    document.getElementById('gems-amount'),
        prestigeAmount:document.getElementById('prestige-amount'),
        prestigeMultEl:document.getElementById('prestige-mult'),
        kingdomLevel:  document.getElementById('kingdom-level'),
        kingdomScene:  document.getElementById('kingdom-buildings-visual'),
        tapCircle:     document.getElementById('tap-circle'),
        tapArea:       document.getElementById('tap-area'),
        tapIcon:       document.getElementById('tap-icon'),
        tapParticles:  document.getElementById('tap-particles'),
        dpsValue:      document.getElementById('dps-value'),
        bossSection:   document.getElementById('boss-section'),
        bossName:      document.getElementById('boss-name'),
        bossTimer:     document.getElementById('boss-timer'),
        bossHpFill:    document.getElementById('boss-hp-fill'),
        bossHpText:    document.getElementById('boss-hp-text'),
        buildingsList: document.getElementById('buildings-list'),
        buildingsCount:document.getElementById('buildings-count'),
        upgradesList:  document.getElementById('upgrades-list'),
        heroesPanel:   document.getElementById('heroes-panel'),
        heroesList:    document.getElementById('heroes-list'),
        heroesCount:   document.getElementById('heroes-count'),
        buildingsPanel:document.getElementById('buildings-panel'),
        upgradesPanel: document.getElementById('upgrades-panel'),
        achievementsPanel: document.getElementById('achievements-panel'),
        achievementsList:  document.getElementById('achievements-list'),
        achievementsProgress: document.getElementById('achievements-progress'),
        navBtns:       document.querySelectorAll('.nav-btn'),
        prestigeOverlay:document.getElementById('prestige-overlay'),
        prestigeEarn:  document.getElementById('prestige-earn'),
        prestigeNewMult:document.getElementById('prestige-new-mult'),
        btnPrestige:   document.getElementById('btn-prestige'),
        btnPrestigeClose:document.getElementById('btn-prestige-close'),
        offlinePopup:  document.getElementById('offline-popup'),
        offlineEarnings:document.getElementById('offline-earnings'),
        offlineTime:   document.getElementById('offline-time'),
        btnOfflineOk:  document.getElementById('btn-offline-ok'),
        floatContainer:document.getElementById('float-container'),
        milestoneTarget:document.getElementById('milestone-target'),
        milestoneFill: document.getElementById('milestone-fill'),
        statGPS:       document.getElementById('stat-gps'),
        statTap:       document.getElementById('stat-tap'),
        statClicks:    document.getElementById('stat-clicks'),
        statBoss:      document.getElementById('stat-boss'),
        bossPreview:   document.getElementById('boss-preview'),
        bossPreviewIcon:document.getElementById('boss-preview-icon'),
        bossPreviewName:document.getElementById('boss-preview-name'),
        bossPreviewHp: document.getElementById('boss-preview-hp'),
        btnFightBoss:  document.getElementById('btn-fight-boss'),
        luckyEvent:    document.getElementById('lucky-event'),
        luckyIcon:     document.getElementById('lucky-icon'),
        luckyText:     document.getElementById('lucky-text'),
        luckyTimerFill:document.getElementById('lucky-timer-fill'),
        achievementsBanner: document.getElementById('achievements-banner'),
        achievementIcon:    document.getElementById('achievement-icon'),
        achievementTitle:   document.getElementById('achievement-title'),
        achievementDesc:    document.getElementById('achievement-desc'),
        achievementReward:  document.getElementById('achievement-reward'),
        resGold:       document.getElementById('res-gold'),
        resGems:       document.getElementById('res-gems'),
        // v3 Psychology DOM
        streakIndicator: document.getElementById('streak-indicator'),
        flashSale:     document.getElementById('flash-sale'),
        saleDesc:      document.getElementById('sale-desc'),
        saleOriginal:  document.getElementById('sale-original'),
        salePrice:     document.getElementById('sale-price'),
        saleTimer:     document.getElementById('sale-timer'),
        saleTimerFill: document.getElementById('sale-timer-fill'),
        dailyOverlay:  document.getElementById('daily-reward-overlay'),
        dailyDays:     document.getElementById('daily-days'),
        dailyStreak:   document.getElementById('daily-streak-display'),
        btnDailyClaim: document.getElementById('btn-daily-claim'),
    };
}

// ===== CALCULATIONS =====
function getBuildingCost(def, level) {
    return Math.floor(def.baseCost * Math.pow(def.costMult, level));
}

function getBuildingGPS(def, level) {
    if (level === 0) return 0;
    const mult = (state.buildingMult[def.id] || 1) * state.globalMult * state.prestigeMult;
    const heroBoost = getHeroGoldBoost();
    return def.baseGPS * level * mult * heroBoost;
}

function getHeroCost(def, level) {
    return Math.floor(def.baseCost * Math.pow(def.costMult, level));
}

function getHeroDPS(def, level) {
    if (level === 0) return 0;
    return def.baseDPS * level * state.prestigeMult;
}

function getHeroGoldBoost() {
    const mageLevel = state.heroes.mage || 0;
    return Math.min(5, 1 + (mageLevel * 0.15)); // +15% per mage level, cap 5x
}

function getHeroBossDmgMult() {
    const knightLevel = state.heroes.knight || 0;
    const dragonLevel = state.heroes.dragon || 0;
    let mult = 1;
    if (knightLevel > 0) mult *= (1 + knightLevel * 0.5);
    if (dragonLevel > 0) mult *= (1 + dragonLevel * 1.0);
    return Math.min(50, mult); // cap boss dmg at 50x
}

function getHeroCritChance() {
    const archerLevel = state.heroes.archer || 0;
    return Math.min(0.75, state.critChance + (archerLevel * 0.05)); // cap 75% crit
}

function getHeroBossTimerBonus() {
    const healerLevel = state.heroes.healer || 0;
    return healerLevel * 2; // +2s per healer level
}

function getTotalGPS() {
    let total = 0;
    for (const def of BUILDINGS) {
        const level = state.buildings[def.id] || 0;
        total += getBuildingGPS(def, level);
    }
    // Lucky event bonus
    if (state.luckyActive && state.luckyEvent) {
        if (state.luckyEvent.effect === 'goldRain') total *= state.luckyEvent.mult;
        if (state.luckyEvent.effect === 'speedBoost') total *= state.luckyEvent.mult;
    }
    // Flash sale boost (prodBoost / goldRain)
    if (state.flashSaleBoostTimer > 0 && state.flashSaleBoost) {
        if (state.flashSaleBoost.effect === 'prodBoost' || state.flashSaleBoost.effect === 'goldRain') {
            total *= state.flashSaleBoost.mult;
        }
    }
    // Necromancer: +2% gold per boss defeated, cap 5x
    const necroLevel = state.heroes.necromancer || 0;
    if (necroLevel > 0) total *= Math.min(5, 1 + state.bossIndex * 0.02 * necroLevel);
    // Time Lord: +20% production speed per level, cap 3x
    const timeLordLevel = state.heroes.timeLord || 0;
    if (timeLordLevel > 0) total *= Math.min(3, 1 + timeLordLevel * 0.20);
    // Phoenix burst
    if (state.phoenixActive) total *= 2;
    return total;
}

function getTotalHeroDPS() {
    let total = 0;
    for (const def of HEROES) {
        const level = state.heroes[def.id] || 0;
        total += getHeroDPS(def, level);
    }
    return total;
}

function getTapValue() {
    const baseGPS = getTotalGPS();
    const tapFromGPS = Math.max(1, baseGPS * 0.05);
    let val = Math.floor(tapFromGPS * Math.min(50, state.tapMult) * state.prestigeMult);
    // Lucky tap boost
    if (state.luckyActive && state.luckyEvent && state.luckyEvent.effect === 'tapStorm') {
        val *= state.luckyEvent.mult;
    }
    // Flash sale tap boost
    if (state.flashSaleBoostTimer > 0 && state.flashSaleBoost && state.flashSaleBoost.effect === 'tapBoost') {
        val *= state.flashSaleBoost.mult;
    }
    // Flash sale crit boost
    if (state.flashSaleBoostTimer > 0 && state.flashSaleBoost && state.flashSaleBoost.effect === 'critBoost') {
        val *= 3; // always crit during crit boost
    }
    // Combo bonus: +5% per combo level (max +100%)
    const comboBonus = 1 + Math.min(state.comboCount * 0.05, 1.0);
    val = Math.floor(val * comboBonus);
    return val;
}

function getKingdomLevel() {
    let total = 0;
    for (const def of BUILDINGS) total += (state.buildings[def.id] || 0);
    return total;
}

function getPrestigeStarsEarned() {
    if (state.totalGold < 500000) return 0;
    // sqrt scaling with soft cap at high values
    const raw = Math.sqrt(state.totalGold / 500000);
    return Math.max(1, Math.floor(Math.min(raw, 50 + Math.log10(raw) * 20)));
}

function getPrestigeMult(stars) {
    return Math.min(1000, 1 + stars * 0.25 + stars * stars * 0.001);
}

// ===== RENDER =====
function renderBuildings() {
    if (!DOM.buildingsList) return;
    DOM.buildingsList.innerHTML = '';
    let unlockedCount = 0;
    for (const def of BUILDINGS) {
        const level = state.buildings[def.id] || 0;
        const cost = getBuildingCost(def, level);
        const gps = getBuildingGPS(def, level);
        const nextGPS = getBuildingGPS(def, level + 1) - gps;
        const canAfford = state.gold >= cost;
        const isUnlocked = state.totalGold >= def.unlockAt || level > 0;

        if (!isUnlocked) continue;
        unlockedCount++;

        const card = document.createElement('div');
        card.className = `building-card ${canAfford ? 'affordable' : ''}`;
        card.innerHTML = `
            <div class="build-icon">${getIcon(def.id, 40)}</div>
            <div class="build-info">
                <div class="build-name">${def.name} <span class="build-level">Lv ${level}</span></div>
                <div class="build-desc">${def.desc}</div>
                <div class="build-production">${level > 0 ? fmt(gps) + '/s' : ''} ${level > 0 ? '→ +' + fmt(nextGPS) + '/s' : '+' + fmt(def.baseGPS * state.globalMult * state.prestigeMult * (state.buildingMult[def.id]||1) * getHeroGoldBoost()) + '/s'}</div>
            </div>
            <button class="build-btn">${fmt(cost)} ${getIcon('gold', 14)}</button>
        `;
        card.addEventListener('click', () => buyBuilding(def.id));
        DOM.buildingsList.appendChild(card);
    }
    if (DOM.buildingsCount) DOM.buildingsCount.textContent = `${unlockedCount} / ${BUILDINGS.length}`;
    // Re-apply tutorial highlight after rebuilding cards
    if (Tutorial.active && !Tutorial.dismissed && Tutorial.step === 1) {
        const firstCard = DOM.buildingsList.querySelector('.building-card');
        if (firstCard) firstCard.classList.add('tutorial-highlight');
    }
}

function renderHeroes() {
    if (!DOM.heroesList) return;
    DOM.heroesList.innerHTML = '';
    let unlockedCount = 0;
    for (const def of HEROES) {
        const level = state.heroes[def.id] || 0;
        const cost = getHeroCost(def, level);
        const dps = getHeroDPS(def, level);
        const canAfford = state.gold >= cost;
        const isUnlocked = state.totalGold >= def.unlockAt || level > 0;

        const card = document.createElement('div');
        card.className = `hero-card ${canAfford && isUnlocked ? 'affordable' : ''} ${!isUnlocked ? 'locked' : ''}`;

        if (isUnlocked) unlockedCount++;

        card.innerHTML = `
            <div class="hero-icon-wrap">${getIcon(def.id, 40)}</div>
            <div class="hero-info">
                <div class="hero-name">${def.name} ${isUnlocked ? `<span class="hero-level">Lv ${level}</span>` : `<span class="hero-level">${getIcon('lock', 14)} ${fmt(def.unlockAt)} altın</span>`}</div>
                <div class="hero-desc">${def.desc}</div>
                <div class="hero-dps">${level > 0 ? `${getIcon('sword', 14)} ${fmt(dps)} DPS` : ''}</div>
            </div>
            <button class="hero-btn" ${!isUnlocked ? 'disabled' : ''}>${isUnlocked ? fmt(cost) + ' ' + getIcon('gold', 14) : getIcon('lock', 16)}</button>
        `;
        if (isUnlocked) card.addEventListener('click', () => buyHero(def.id));
        DOM.heroesList.appendChild(card);
    }
    if (DOM.heroesCount) DOM.heroesCount.textContent = `${unlockedCount} / ${HEROES.length}`;
}

function renderUpgrades() {
    if (!DOM.upgradesList) return;
    DOM.upgradesList.innerHTML = '';
    for (const def of UPGRADES) {
        const purchased = state.upgrades[def.id];
        const canAfford = state.gold >= def.cost;

        const card = document.createElement('div');
        card.className = `upgrade-card ${purchased ? 'purchased' : ''} ${canAfford && !purchased ? 'affordable' : ''}`;
        card.innerHTML = `
            <div class="upgrade-icon">${getIcon(def.id, 32)}</div>
            <div class="upgrade-info">
                <div class="upgrade-name">${def.name}${purchased ? ' ' + getIcon('check', 16) : ''}</div>
                <div class="upgrade-desc">${def.desc}</div>
            </div>
            <div class="upgrade-cost">${purchased ? 'Alındı' : fmt(def.cost) + ' ' + getIcon('gold', 14)}</div>
        `;
        if (!purchased) card.addEventListener('click', () => buyUpgrade(def.id));
        DOM.upgradesList.appendChild(card);
    }
}

function renderAchievements() {
    if (!DOM.achievementsList) return;
    DOM.achievementsList.innerHTML = '';
    let unlocked = 0;
    for (const def of ACHIEVEMENTS) {
        const done = state.achievements[def.id];
        if (done) unlocked++;

        const card = document.createElement('div');
        card.className = `achievement-card ${done ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
            <div class="ach-icon">${done ? def.icon : getIcon('lock', 24)}</div>
            <div class="ach-info">
                <div class="ach-name">${def.name}</div>
                <div class="ach-desc">${def.desc}</div>
            </div>
            <div class="ach-reward">${done ? getIcon('check', 20) : `+${def.reward} ${getIcon('gem', 14)}`}</div>
        `;
        DOM.achievementsList.appendChild(card);
    }
    if (DOM.achievementsProgress) DOM.achievementsProgress.textContent = `${unlocked} / ${ACHIEVEMENTS.length}`;
}

function renderKingdomScene() {
    if (!DOM.kingdomScene) return;
    const sceneEl = DOM.kingdomScene.parentElement;
    DOM.kingdomScene.innerHTML = '';
    let hasBuildings = false;
    for (const def of BUILDINGS) {
        const level = state.buildings[def.id] || 0;
        if (level <= 0) continue;
        hasBuildings = true;
        const el = document.createElement('div');
        el.className = 'kingdom-mini-building';
        el.innerHTML = `<span class="kb-icon">${getIcon(def.id, 28)}</span><span class="kb-level">${level}</span>`;
        DOM.kingdomScene.appendChild(el);
    }
    // Hide scene when no buildings
    if (sceneEl) {
        sceneEl.classList.toggle('empty', !hasBuildings);
    }
}

function renderHUD() {
    if (DOM.goldAmount) DOM.goldAmount.textContent = fmt(state.gold);
    const gps = getTotalGPS();
    const heroDPS = getTotalHeroDPS();
    if (DOM.goldRate) DOM.goldRate.textContent = `+${fmt(gps)}/s`;
    if (DOM.gemsAmount) DOM.gemsAmount.textContent = fmt(state.gems);
    if (DOM.prestigeAmount) DOM.prestigeAmount.textContent = fmt(state.prestigeStars);
    if (DOM.prestigeMultEl) DOM.prestigeMultEl.textContent = `x${state.prestigeMult.toFixed(2)}`;
    if (DOM.dpsValue) DOM.dpsValue.textContent = fmt(gps + heroDPS);

    // Kingdom level & icon
    const kl = getKingdomLevel();
    if (DOM.kingdomLevel) DOM.kingdomLevel.textContent = `Seviye ${kl}`;
    // Map kingdom level to building icon (progressive)
    const tapIconKeys = ['farm','farm','mine','lumber','blacksmith','market','temple','academy','castle'];
    const tapIconKey = tapIconKeys[Math.min(Math.floor(kl / 5), tapIconKeys.length - 1)];
    if (DOM.tapIcon) DOM.tapIcon.innerHTML = getIcon(tapIconKey, 48);

    // Mini stats
    if (DOM.statGPS) DOM.statGPS.textContent = fmt(gps);
    if (DOM.statTap) DOM.statTap.textContent = fmt(getTapValue());
    if (DOM.statClicks) DOM.statClicks.textContent = fmt(state.totalClicks);
    if (DOM.statBoss) DOM.statBoss.textContent = `${state.bossIndex + 1}`;

    renderMilestone();
    renderBossPreview();
}

function renderMilestone() {
    let nextTarget = null;
    let progress = 0;

    for (const def of BUILDINGS) {
        const level = state.buildings[def.id] || 0;
        if (level === 0 && state.totalGold < def.unlockAt) {
            nextTarget = { html: `${getIcon(def.id, 18)} ${def.name} Aç`, text: true };
            progress = Math.min(1, state.totalGold / def.unlockAt);
            break;
        }
    }

    if (!nextTarget) {
        if (!state.bossActive) {
            const boss = BOSSES[state.bossIndex % BOSSES.length];
            nextTarget = { html: `${getBossIcon(state.bossIndex % BOSSES.length)} ${boss.name} Yen`, text: true };
            progress = 1;
        } else {
            nextTarget = { html: `${getIcon('sword', 18)} Boss savaşı devam ediyor...`, text: true };
            progress = 1 - (state.bossHP / state.bossMaxHP);
        }
    }

    if (DOM.milestoneTarget) DOM.milestoneTarget.innerHTML = nextTarget ? nextTarget.html : '';
    if (DOM.milestoneFill) DOM.milestoneFill.style.width = (progress * 100) + '%';
}

function renderBossPreview() {
    if (!DOM.bossPreview) return;
    if (state.bossActive) {
        DOM.bossPreview.style.display = 'none';
        return;
    }
    DOM.bossPreview.style.display = 'flex';
    const idx = state.bossIndex % BOSSES.length;
    const scale = Math.floor(state.bossIndex / BOSSES.length) + 1;
    const boss = BOSSES[idx];
    const hpScale = Math.pow(10, scale - 1);
    if (DOM.bossPreviewIcon) DOM.bossPreviewIcon.innerHTML = getBossIcon(idx);
    if (DOM.bossPreviewName) DOM.bossPreviewName.textContent = `Sıradaki: ${boss.name}${scale > 1 ? ' x' + scale : ''}`;
    if (DOM.bossPreviewHp) DOM.bossPreviewHp.innerHTML = `HP: ${fmt(boss.hp * hpScale)} | Ödül: ${fmt(boss.reward * hpScale)} ${getIcon('gold', 14)} + ${boss.gemReward * scale} ${getIcon('gem', 14)}`;
}

function renderBoss() {
    if (!state.bossActive) {
        if (DOM.bossSection) DOM.bossSection.classList.add('hidden');
        return;
    }
    if (DOM.bossSection) DOM.bossSection.classList.remove('hidden');
    const boss = BOSSES[state.bossIndex % BOSSES.length];
    const scale = Math.floor(state.bossIndex / BOSSES.length) + 1;
    if (DOM.bossName) DOM.bossName.innerHTML = `${getBossIcon(state.bossIndex % BOSSES.length)} ${boss.name}${scale > 1 ? ' x' + scale : ''}`;
    if (DOM.bossTimer) DOM.bossTimer.textContent = `${Math.ceil(state.bossTimer)}s`;
    const ratio = Math.max(0, state.bossHP / state.bossMaxHP);
    if (DOM.bossHpFill) DOM.bossHpFill.style.width = (ratio * 100) + '%';
    if (DOM.bossHpText) DOM.bossHpText.textContent = `${fmt(state.bossHP)} / ${fmt(state.bossMaxHP)}`;
}

function renderPrestigeOverlay() {
    const stars = getPrestigeStarsEarned();
    const newTotal = state.prestigeStars + stars;
    const newMult = getPrestigeMult(newTotal);
    if (DOM.prestigeEarn) DOM.prestigeEarn.innerHTML = stars > 0 ? `+${stars} ${getIcon('star', 16)}` : '0 (daha fazla altın kazan!)';
    if (DOM.prestigeNewMult) DOM.prestigeNewMult.textContent = `x${newMult.toFixed(2)}`;
    if (DOM.btnPrestige) DOM.btnPrestige.disabled = stars <= 0;
}

function renderLuckyEvent() {
    if (!DOM.luckyEvent) return;
    if (!state.luckyActive) {
        DOM.luckyEvent.classList.add('hidden');
        return;
    }
    DOM.luckyEvent.classList.remove('hidden');
    if (DOM.luckyIcon && state.luckyEvent) DOM.luckyIcon.textContent = state.luckyEvent.icon;
    if (DOM.luckyText && state.luckyEvent) DOM.luckyText.textContent = state.luckyEvent.text;
    if (DOM.luckyTimerFill && state.luckyEvent) {
        const pct = (state.luckyTimer / state.luckyEvent.duration) * 100;
        DOM.luckyTimerFill.style.width = pct + '%';
    }
}

// ===== ACTIONS =====
function buyBuilding(id) {
    const def = BUILDINGS.find(b => b.id === id);
    const level = state.buildings[id] || 0;
    const cost = getBuildingCost(def, level);
    if (state.gold < cost) { SFX.error(); return; }

    state.gold -= cost;
    state.buildings[id] = level + 1;
    SFX.buy();

    // 🟢 Purchase burst effect — Green flash (positive reinforcement)
    const cards = DOM.buildingsList ? DOM.buildingsList.querySelectorAll('.building-card') : [];
    let idx = 0;
    for (const b of BUILDINGS) {
        if (b.id === id) break;
        if (state.totalGold >= b.unlockAt || (state.buildings[b.id] || 0) > 0) idx++;
    }
    if (cards[idx]) {
        cards[idx].classList.add('just-bought');
        setTimeout(() => cards[idx].classList.remove('just-bought'), 500);
    }

    // Gold counter bump animation
    if (DOM.goldAmount) {
        DOM.goldAmount.classList.add('tick-up');
        setTimeout(() => DOM.goldAmount.classList.remove('tick-up'), 200);
    }

    // Tutorial: first building bought!
    if (!state.tutorialDone && getKingdomLevel() >= 1) {
        state.tutorialDone = true;
        Tutorial.update();
    }

    renderBuildings();
    renderKingdomScene();
    renderHUD();
}

function buyHero(id) {
    const def = HEROES.find(h => h.id === id);
    if (!def) return;
    const level = state.heroes[id] || 0;
    const cost = getHeroCost(def, level);
    if (state.gold < cost) { SFX.error(); return; }

    state.gold -= cost;
    state.heroes[id] = level + 1;
    SFX.buy();
    renderHeroes();
    renderHUD();
}

function buyUpgrade(id) {
    const def = UPGRADES.find(u => u.id === id);
    if (state.upgrades[id] || state.gold < def.cost) { SFX.error(); return; }

    state.gold -= def.cost;
    state.upgrades[id] = true;
    def.effect();
    SFX.upgrade();
    renderUpgrades();
    renderBuildings();
    renderHUD();
}

function onTap(e) {
    try {
        SFX.resume();
        state.totalClicks++;

        // Combo system
        state.comboCount++;
        state.comboTimer = 1.5; // reset combo timer
        if (state.comboCount > state.maxCombo) state.maxCombo = state.comboCount;

        // Crit check
        const critChance = getHeroCritChance();
        const isCrit = (state.luckyActive && state.luckyEvent && state.luckyEvent.effect === 'critBoost') ? true : Math.random() < critChance;

        let value = getTapValue();
        // Valkyrie: combo gold multiplier, cap 10x
        const valkLevel = state.heroes.valkyrie || 0;
        if (valkLevel > 0 && state.comboCount > 0) {
            value = Math.floor(value * Math.min(10, 1 + state.comboCount * 0.05 * valkLevel));
        }
        if (isCrit) {
            value = Math.floor(value * (state.critDmgMult || 3)); // configurable crit multiplier
            SFX.critTap();
        } else {
            SFX.tap();
        }

        // 🎰 TAP JACKPOT — Variable Ratio Reinforcement (Skinner Box)
        let jackpotHit = null;
        const jackpotRoll = Math.random();
        let cumChance = 0;
        for (const jp of TAP_JACKPOTS) {
            cumChance += jp.chance;
            if (jackpotRoll < cumChance) {
                jackpotHit = jp;
                break;
            }
        }

        if (jackpotHit) {
            value = Math.floor(value * jackpotHit.mult);
            state.totalJackpots++;
            Particles.spawn(jackpotHit.particles, 'gold');
            SFX.jackpot();
            // Screen flash
            document.body.classList.add('screen-shake');
            setTimeout(() => document.body.classList.remove('screen-shake'), 300);
        }

        state.gold += value;
        state.totalGold += value;

        // Floating text
        if (DOM.tapCircle) {
            const rect = DOM.tapCircle.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top;

            if (jackpotHit) {
                // Jackpot — big glowing text
                spawnJackpotText(`${jackpotHit.icon} ${jackpotHit.name} +${fmt(value)}`, cx, cy - 30);
            } else {
                spawnFloatText(`${isCrit ? '💥 ' : '+'}${fmt(value)}`, cx + (Math.random()-0.5)*60, cy - 10, isCrit);
            }
            // Tap ripple
            spawnTapRipple(rect);
        }

        // Show combo
        if (state.comboCount >= 5) {
            showCombo();
            if (state.comboCount % 10 === 0) SFX.comboMilestone();
            else if (state.comboCount % 5 === 0) SFX.combo();
        }

        // Boss damage
        if (state.bossActive) {
            const bossDmg = value * getHeroBossDmgMult();
            state.bossHP -= bossDmg;
            SFX.bossHit();
            // Screen shake on boss hit
            if (isCrit) {
                document.body.classList.add('screen-shake');
                setTimeout(() => document.body.classList.remove('screen-shake'), 300);
            }
        }

        // Bump gold resource
        if (DOM.resGold) {
            DOM.resGold.classList.remove('bump');
            void DOM.resGold.offsetWidth;
            DOM.resGold.classList.add('bump');
        }

        renderHUD();
        if (state.bossActive) renderBoss();
    } catch (err) {
        console.error('TAP ERROR:', err);
    }
}

function spawnFloatText(text, x, y, isCrit) {
    const el = document.createElement('div');
    el.className = 'float-text' + (isCrit ? ' crit' : '');
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    if (DOM.floatContainer) DOM.floatContainer.appendChild(el);
    setTimeout(() => el.remove(), 900);
}

function spawnJackpotText(text, x, y) {
    const el = document.createElement('div');
    el.className = 'jackpot-text';
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    if (DOM.floatContainer) DOM.floatContainer.appendChild(el);
    setTimeout(() => el.remove(), 1500);
}

function spawnTapRipple(rect) {
    const el = document.createElement('div');
    el.className = 'tap-ripple';
    el.style.left = (rect.width/2 - 10) + 'px';
    el.style.top = (rect.height/2 - 10) + 'px';
    if (DOM.tapParticles) DOM.tapParticles.appendChild(el);
    setTimeout(() => el.remove(), 500);
}

function showCombo() {
    // Remove existing combo text
    const existing = DOM.tapArea ? DOM.tapArea.querySelector('.combo-text') : null;
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.className = 'combo-text';
    el.textContent = `🔥 x${state.comboCount} COMBO!`;
    if (DOM.tapArea) DOM.tapArea.appendChild(el);
    setTimeout(() => el.remove(), 2000);
}

// ===== LUCKY EVENT SYSTEM =====
let luckyCheckTimer = 0;

function checkLuckyEvent(dt) {
    if (state.luckyActive) {
        state.luckyTimer -= dt;
        if (state.luckyTimer <= 0) {
            state.luckyActive = false;
            state.luckyEvent = null;
            renderLuckyEvent();
            // Gem bonus is awarded when event starts
        }
        renderLuckyEvent();
        return;
    }

    luckyCheckTimer += dt;
    if (luckyCheckTimer >= 1) {
        luckyCheckTimer = 0;
        // 2% chance per second (roughly every 50 seconds on average)
        if (Math.random() < 0.02 && getTotalGPS() > 0) {
            triggerLuckyEvent();
        }
    }
}

function triggerLuckyEvent() {
    const event = LUCKY_EVENTS[Math.floor(Math.random() * LUCKY_EVENTS.length)];
    state.luckyActive = true;
    state.luckyEvent = event;
    state.luckyTimer = event.duration;
    state.luckyEvents++;

    SFX.lucky();
    Particles.spawn(20, 'gold');

    // Gem bonus
    if (event.effect === 'gemBonus') {
        state.gems += event.mult;
        if (DOM.resGems) {
            DOM.resGems.classList.remove('bump');
            void DOM.resGems.offsetWidth;
            DOM.resGems.classList.add('bump');
        }
    }

    renderLuckyEvent();
}

// ===== DAILY REWARD SYSTEM (Hook Model: Trigger → Action → Variable Reward → Investment) =====
const DailyReward = {
    // Check if player should see daily reward popup
    shouldShow() {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        if (state.lastSessionDate === today) return false; // Already claimed today
        return true;
    },

    show() {
        if (!DOM.dailyOverlay || !DOM.dailyDays) return;

        // Calculate which day of streak
        const today = new Date().toISOString().split('T')[0];
        const lastClaim = state.dailyLastClaim ? new Date(state.dailyLastClaim).toISOString().split('T')[0] : '';
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // Check if streak continues (claimed yesterday) or breaks
        if (lastClaim === yesterday) {
            // Streak continues!
            state.dailyStreak = Math.min(state.dailyStreak + 1, 7);
        } else if (lastClaim !== today) {
            // Streak broken — Loss Aversion kicks in: show what they lost
            state.dailyStreak = 1;
            state.dailyClaimed = [];
        }

        // Render days
        DOM.dailyDays.innerHTML = '';
        for (let i = 0; i < 7; i++) {
            const reward = DAILY_REWARDS[i];
            const claimed = state.dailyClaimed.includes(i);
            const isToday = (i === state.dailyStreak - 1);
            const upcoming = (i >= state.dailyStreak);

            const dayEl = document.createElement('div');
            dayEl.className = `daily-day ${claimed ? 'claimed' : ''} ${isToday ? 'today' : ''} ${upcoming && !isToday ? 'upcoming' : ''}`;
            dayEl.innerHTML = `<span class="day-icon">${claimed ? '✅' : reward.icon}</span><span>G${i + 1}</span>`;
            DOM.dailyDays.appendChild(dayEl);
        }

        // Streak display — Loss Aversion: show streak + warning
        if (DOM.dailyStreak) {
            DOM.dailyStreak.textContent = `🔥 ${state.dailyStreak}. Gün Serisi${state.dailyStreak >= 3 ? ' — Kaybetme!' : ''}`;
        }

        DOM.dailyOverlay.classList.remove('hidden');
    },

    claim() {
        const dayIdx = state.dailyStreak - 1;
        if (dayIdx < 0 || dayIdx >= DAILY_REWARDS.length) return;

        const reward = DAILY_REWARDS[dayIdx];

        // Apply reward
        switch (reward.type) {
            case 'gold':
                const goldAmount = reward.amount * Math.max(1, getTotalGPS() * 10);
                state.gold += goldAmount;
                state.totalGold += goldAmount;
                Particles.spawn(15, 'gold');
                spawnFloatText(`+${fmt(goldAmount)} 🪙`, window.innerWidth / 2, window.innerHeight / 3, false);
                break;
            case 'gem':
                state.gems += reward.amount;
                Particles.spawn(10, 'gem');
                spawnFloatText(`+${reward.amount} 💎`, window.innerWidth / 2, window.innerHeight / 3, false);
                break;
            case 'boost':
                // Temporary production boost
                state.flashSaleBoostTimer = reward.amount;
                state.flashSaleBoost = { effect: 'prodBoost', mult: 2 };
                Particles.spawn(20, 'gold');
                break;
            case 'mega':
                // MEGA reward: gems + gold + boost
                state.gems += 50;
                const megaGold = Math.max(5000, getTotalGPS() * 60);
                state.gold += megaGold;
                state.totalGold += megaGold;
                state.flashSaleBoostTimer = 120;
                state.flashSaleBoost = { effect: 'prodBoost', mult: 3 };
                Particles.spawn(40, 'gold');
                Particles.spawn(20, 'gem');
                SFX.prestige();
                spawnFloatText(`🌟 MEGA! +${fmt(megaGold)} 🪙 +50 💎`, window.innerWidth / 2, window.innerHeight / 3, false);
                break;
        }

        // Mark as claimed
        if (!state.dailyClaimed.includes(dayIdx)) {
            state.dailyClaimed.push(dayIdx);
        }
        state.dailyLastClaim = Date.now();
        state.lastSessionDate = new Date().toISOString().split('T')[0];

        SFX.dailyReward();
        if (DOM.dailyOverlay) DOM.dailyOverlay.classList.add('hidden');
        updateStreakDisplay();
        renderHUD();
        save();
    }
};

function updateStreakDisplay() {
    if (!DOM.streakIndicator) return;
    if (state.dailyStreak > 0) {
        DOM.streakIndicator.textContent = `🔥 ${state.dailyStreak} gün`;
        DOM.streakIndicator.classList.add('active');
    } else {
        DOM.streakIndicator.classList.remove('active');
    }
}

// ===== FLASH SALE SYSTEM (Scarcity + FOMO + Anchoring) =====
let flashSaleCheckTimer = 0;

function checkFlashSale(dt) {
    // Update active boost
    if (state.flashSaleBoostTimer > 0) {
        state.flashSaleBoostTimer -= dt;
        if (state.flashSaleBoostTimer <= 0) {
            state.flashSaleBoostTimer = 0;
            state.flashSaleBoost = null;
        }
    }

    // Update active sale timer
    if (state.flashSaleActive && state.flashSale) {
        state.flashSaleTimer -= dt;
        if (state.flashSaleTimer <= 0) {
            // Sale expired — FOMO: they missed it!
            state.flashSaleActive = false;
            state.flashSale = null;
            if (DOM.flashSale) DOM.flashSale.classList.add('hidden');
            return;
        }
        // Update UI
        if (DOM.saleTimer) DOM.saleTimer.textContent = `${Math.ceil(state.flashSaleTimer)}s`;
        if (DOM.saleTimerFill) DOM.saleTimerFill.style.width = (state.flashSaleTimer / 30 * 100) + '%';
        return;
    }

    // Check for new sale opportunity
    flashSaleCheckTimer += dt;
    if (flashSaleCheckTimer >= 1) {
        flashSaleCheckTimer = 0;
        // 0.5% chance per second (~every 200 seconds), only if GPS > 0 and has gems
        if (Math.random() < 0.005 && getTotalGPS() > 0 && state.gems >= 5) {
            triggerFlashSale();
        }
    }
}

function triggerFlashSale() {
    const sale = FLASH_SALES[Math.floor(Math.random() * FLASH_SALES.length)];
    state.flashSaleActive = true;
    state.flashSale = sale;
    state.flashSaleTimer = 30; // 30 second urgency window

    // Anchoring: Show "original" high price vs sale price
    if (DOM.flashSale) DOM.flashSale.classList.remove('hidden');
    if (DOM.saleDesc) DOM.saleDesc.textContent = sale.desc;
    if (DOM.saleOriginal) DOM.saleOriginal.innerHTML = `${sale.normalCost} ${getIcon('gem', 14)}`;
    if (DOM.salePrice) DOM.salePrice.innerHTML = `${sale.saleCost} ${getIcon('gem', 14)}`;
    if (DOM.saleTimer) DOM.saleTimer.textContent = '30s';

    SFX.flashSale();
}

function buyFlashSale() {
    if (!state.flashSaleActive || !state.flashSale) return;
    const sale = state.flashSale;
    if (state.gems < sale.saleCost) {
        SFX.error();
        return;
    }

    state.gems -= sale.saleCost;
    state.flashSaleActive = false;

    // Apply boost
    state.flashSaleBoostTimer = sale.duration;
    state.flashSaleBoost = { effect: sale.effect, mult: sale.mult };

    if (DOM.flashSale) DOM.flashSale.classList.add('hidden');
    SFX.upgrade();
    Particles.spawn(15, 'gem');
    spawnFloatText(`⚡ ${sale.name} aktif!`, window.innerWidth / 2, window.innerHeight / 3, false);
    renderHUD();
    save();
}

// ===== NEAR-MISS BOSS EFFECT (Near-Miss Psychology) =====
function updateBossNearMiss() {
    if (!state.bossActive || !DOM.bossHpFill) return;
    const ratio = state.bossHP / state.bossMaxHP;

    if (ratio <= 0.1 && ratio > 0) {
        // Boss almost dead! — Near miss effect
        DOM.bossHpFill.classList.add('near-death');
        // Show encouraging text
        const bossSection = document.getElementById('boss-section');
        if (bossSection && !bossSection.querySelector('.boss-near-miss-text')) {
            const nmText = document.createElement('div');
            nmText.className = 'boss-near-miss-text';
            nmText.textContent = '💥 Az kaldı! Hızlı dokun!';
            bossSection.style.position = 'relative';
            bossSection.appendChild(nmText);
        }
    } else {
        DOM.bossHpFill.classList.remove('near-death');
        const bossSection = document.getElementById('boss-section');
        if (bossSection) {
            const nm = bossSection.querySelector('.boss-near-miss-text');
            if (nm) nm.remove();
        }
    }
}

// ===== COMBO SYSTEM =====
function updateCombo(dt) {
    if (state.comboCount > 0) {
        state.comboTimer -= dt;
        if (state.comboTimer <= 0) {
            state.comboCount = 0;
            state.comboTimer = 0;
            // Remove combo text
            if (DOM.tapArea) {
                const c = DOM.tapArea.querySelector('.combo-text');
                if (c) c.remove();
            }
        }
    }
}

// ===== ACHIEVEMENT SYSTEM =====
let achievementQueue = [];
let achievementShowing = false;

function checkAchievements() {
    for (const def of ACHIEVEMENTS) {
        if (state.achievements[def.id]) continue;
        if (def.check()) {
            state.achievements[def.id] = true;
            state.gems += def.reward;
            achievementQueue.push(def);
            if (!achievementShowing) showNextAchievement();
        }
    }
}

function showNextAchievement() {
    if (achievementQueue.length === 0) {
        achievementShowing = false;
        return;
    }
    achievementShowing = true;
    const def = achievementQueue.shift();

    SFX.achievement();
    Particles.spawn(10, 'gem');

    if (DOM.achievementsBanner) {
        if (DOM.achievementIcon) DOM.achievementIcon.textContent = def.icon;
        if (DOM.achievementDesc) DOM.achievementDesc.textContent = def.name;
        if (DOM.achievementReward) DOM.achievementReward.innerHTML = `+${def.reward} ${getIcon('gem', 16)}`;
        DOM.achievementsBanner.classList.remove('hidden');

        setTimeout(() => {
            DOM.achievementsBanner.classList.add('hidden');
            setTimeout(() => showNextAchievement(), 300);
        }, 3000);
    }
}

// ===== BOSS SYSTEM =====
function startBoss() {
    if (state.bossActive) return;
    const idx = state.bossIndex % BOSSES.length;
    const scale = Math.floor(state.bossIndex / BOSSES.length) + 1;
    const boss = BOSSES[idx];
    const hpScale = Math.pow(10, scale - 1);

    state.bossActive = true;
    state.bossMaxHP = boss.hp * hpScale;
    state.bossHP = state.bossMaxHP;
    state.bossTimer = boss.timer + getHeroBossTimerBonus();
    renderBoss();
}

function updateBoss(dt) {
    if (!state.bossActive) return;

    // Auto-DPS damage (buildings + heroes)
    const dps = getTotalGPS() + getTotalHeroDPS();
    const bossDmgMult = getHeroBossDmgMult();
    state.bossHP -= dps * bossDmgMult * dt;

    state.bossTimer -= dt;

    if (state.bossHP <= 0) {
        // Victory!
        const idx = state.bossIndex % BOSSES.length;
        const scale = Math.floor(state.bossIndex / BOSSES.length) + 1;
        const boss = BOSSES[idx];
        const hpScale = Math.pow(10, scale - 1);

        const goldReward = boss.reward * hpScale;
        const gemReward = Math.floor(boss.gemReward * scale * (state.gemBossMult || 1));
        state.gold += goldReward;
        state.totalGold += goldReward;
        state.gems += gemReward;
        state.bossIndex++;
        state.bossActive = false;

        SFX.bossWin();
        Particles.spawn(30, 'gold');
        Particles.spawn(10, 'gem');
        spawnFloatText(`+${fmt(goldReward)} gold  +${gemReward} gem`, window.innerWidth/2, window.innerHeight/3, false);
        if (DOM.bossSection) {
            DOM.bossSection.classList.add('boss-defeated');
            setTimeout(() => DOM.bossSection.classList.remove('boss-defeated'), 600);
        }

        // Screen shake
        document.body.classList.add('screen-shake');
        setTimeout(() => document.body.classList.remove('screen-shake'), 300);

        renderHUD();
        renderBoss();
        return;
    }

    if (state.bossTimer <= 0) {
        state.bossActive = false;
        SFX.bossLose();
        renderBoss();
        return;
    }

    renderBoss();
}

// ===== PRESTIGE SYSTEM =====
function doPrestige() {
    const stars = getPrestigeStarsEarned();
    if (stars <= 0) return;

    state.prestigeStars += stars;
    state.prestigeMult = getPrestigeMult(state.prestigeStars);

    // Reset
    state.gold = 0;
    state.totalGold = 0;
    state.tapMult = 1;
    state.globalMult = 1;
    state.buildingMult = {};
    state.buildings = {};
    state.heroes = {};
    state.upgrades = {};
    state.bossIndex = 0;
    state.bossActive = false;
    state.bossHP = 0;
    state.comboCount = 0;
    state.flashSaleActive = false;
    state.flashSale = null;
    state.flashSaleTimer = 0;
    state.flashSaleBoostTimer = 0;
    state.flashSaleBoost = null;
    // Reset upgrade-derived state
    state.autoTapRate = 0;
    state.critDmgMult = 3;
    state.gemBossMult = 1;
    state.phoenixTimer = 0;
    state.phoenixActive = false;

    SFX.prestige();
    Particles.spawn(40, 'gold');
    if (DOM.prestigeOverlay) DOM.prestigeOverlay.classList.add('hidden');
    renderAll();
    save();
}

// ===== OFFLINE EARNINGS =====
function calcOfflineEarnings() {
    const now = Date.now();
    const elapsed = (now - state.lastTick) / 1000;
    if (elapsed < 60) return null;

    const maxOffline = 8 * 3600;
    const cappedTime = Math.min(elapsed, maxOffline);
    const gps = getTotalGPS();
    const angelLevel = state.heroes.angel || 0;
    const offlineRate = 0.5 * (1 + angelLevel * 0.5); // Angel boosts offline
    const earnings = gps * cappedTime * offlineRate;

    if (earnings <= 0) return null;
    return { earnings, time: cappedTime };
}

function showOfflinePopup(earnings, time) {
    const hours = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    let timeStr = '';
    if (hours > 0) timeStr += `${hours} saat `;
    timeStr += `${mins} dakika`;

    if (DOM.offlineEarnings) DOM.offlineEarnings.innerHTML = `+${fmt(earnings)} ${getIcon('gold', 20)}`;
    if (DOM.offlineTime) DOM.offlineTime.textContent = timeStr + ' boyunca';
    if (DOM.offlinePopup) DOM.offlinePopup.classList.remove('hidden');

    if (DOM.btnOfflineOk) DOM.btnOfflineOk.onclick = () => {
        state.gold += earnings;
        state.totalGold += earnings;
        if (DOM.offlinePopup) DOM.offlinePopup.classList.add('hidden');
        SFX.resume();
        SFX.upgrade();
        Particles.spawn(25, 'gold');
        renderHUD();
    };
}

// ===== SAVE / LOAD =====
const SAVE_KEY = 'idle_kingdom_save_v2';

function save() {
    state.lastSave = Date.now();
    state.lastTick = Date.now();
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) { console.warn('Save failed', e); }
}

function load() {
    try {
        // Try v2 save first
        let raw = localStorage.getItem(SAVE_KEY);
        // Fallback to v1 save
        if (!raw) raw = localStorage.getItem('idle_kingdom_save');
        if (!raw) return false;
        const saved = JSON.parse(raw);
        for (const key in saved) {
            if (saved[key] !== undefined) state[key] = saved[key];
        }
        // Ensure critical objects exist
        if (!state.buildings) state.buildings = {};
        if (!state.upgrades) state.upgrades = {};
        if (!state.buildingMult) state.buildingMult = {};
        if (!state.heroes) state.heroes = {};
        if (!state.achievements) state.achievements = {};
        if (typeof state.totalClicks !== 'number') state.totalClicks = 0;
        if (typeof state.bossIndex !== 'number') state.bossIndex = 0;
        if (typeof state.comboCount !== 'number') state.comboCount = 0;
        if (typeof state.maxCombo !== 'number') state.maxCombo = 0;
        if (typeof state.luckyEvents !== 'number') state.luckyEvents = 0;
        if (typeof state.critChance !== 'number') state.critChance = 0.05;
        if (typeof state.tutorialDone !== 'boolean') state.tutorialDone = false;
        // v3 Psychology defaults
        if (typeof state.dailyStreak !== 'number') state.dailyStreak = 0;
        if (typeof state.dailyLastClaim !== 'number') state.dailyLastClaim = 0;
        if (!Array.isArray(state.dailyClaimed)) state.dailyClaimed = [];
        if (typeof state.flashSaleActive !== 'boolean') state.flashSaleActive = false;
        if (typeof state.flashSaleBoostTimer !== 'number') state.flashSaleBoostTimer = 0;
        if (typeof state.totalJackpots !== 'number') state.totalJackpots = 0;
        if (typeof state.lastSessionDate !== 'string') state.lastSessionDate = '';
        // v3.1 Expansion defaults
        if (typeof state.autoTapRate !== 'number') state.autoTapRate = 0;
        if (typeof state.critDmgMult !== 'number') state.critDmgMult = 3;
        if (typeof state.gemBossMult !== 'number') state.gemBossMult = 1;
        if (typeof state.phoenixTimer !== 'number') state.phoenixTimer = 0;
        state.phoenixActive = false; // don't persist
        // Don't persist active flash sale (expires)
        state.flashSaleActive = false;
        state.flashSale = null;
        state.flashSaleTimer = 0;
        // Recalculate prestige multiplier (formula may have changed)
        state.prestigeMult = getPrestigeMult(state.prestigeStars);
        return true;
    } catch (e) {
        console.warn('Load failed, resetting:', e);
        return false;
    }
}

function reapplyUpgrades() {
    state.tapMult = 1;
    state.globalMult = 1;
    state.buildingMult = {};

    for (const def of UPGRADES) {
        if (state.upgrades[def.id]) {
            def.effect();
        }
    }
}

// ===== TAB NAVIGATION =====
function switchTab(tab) {
    state.currentTab = tab;
    DOM.navBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // Hide all panels
    if (DOM.buildingsPanel) DOM.buildingsPanel.style.display = 'none';
    if (DOM.upgradesPanel) DOM.upgradesPanel.style.display = 'none';
    if (DOM.heroesPanel) DOM.heroesPanel.style.display = 'none';
    if (DOM.achievementsPanel) DOM.achievementsPanel.style.display = 'none';

    switch (tab) {
        case 'buildings':
            if (DOM.buildingsPanel) DOM.buildingsPanel.style.display = 'block';
            renderBuildings();
            break;
        case 'heroes':
            if (DOM.heroesPanel) DOM.heroesPanel.style.display = 'block';
            renderHeroes();
            break;
        case 'upgrades':
            if (DOM.upgradesPanel) DOM.upgradesPanel.style.display = 'block';
            renderUpgrades();
            break;
        case 'achievements':
            if (DOM.achievementsPanel) DOM.achievementsPanel.style.display = 'block';
            renderAchievements();
            break;
        case 'prestige':
            renderPrestigeOverlay();
            if (DOM.prestigeOverlay) DOM.prestigeOverlay.classList.remove('hidden');
            break;
    }
}

// ===== LIGHTWEIGHT CARD UPDATES (no innerHTML rebuild) =====
function updateBuildingAffordable() {
    if (!DOM.buildingsList) return;
    const cards = DOM.buildingsList.querySelectorAll('.building-card');
    let i = 0;
    for (const def of BUILDINGS) {
        const level = state.buildings[def.id] || 0;
        const isUnlocked = state.totalGold >= def.unlockAt || level > 0;
        if (!isUnlocked) continue;
        if (i >= cards.length) break;
        const cost = getBuildingCost(def, level);
        const canAfford = state.gold >= cost;
        cards[i].classList.toggle('affordable', canAfford);
        // Update cost button text
        const btn = cards[i].querySelector('.build-btn');
        if (btn) btn.innerHTML = `${fmt(cost)} ${getIcon('gold', 14)}`;
        i++;
    }
    // Check if new buildings unlocked — if card count changed, do full rebuild
    let expectedCount = 0;
    for (const def of BUILDINGS) {
        if (state.totalGold >= def.unlockAt || (state.buildings[def.id] || 0) > 0) expectedCount++;
    }
    if (expectedCount !== cards.length) renderBuildings();
}

function updateHeroAffordable() {
    if (!DOM.heroesList) return;
    const cards = DOM.heroesList.querySelectorAll('.hero-card');
    let i = 0;
    for (const def of HEROES) {
        if (i >= cards.length) break;
        const level = state.heroes[def.id] || 0;
        const cost = getHeroCost(def, level);
        const canAfford = state.gold >= cost;
        const isUnlocked = state.totalGold >= def.unlockAt || level > 0;
        cards[i].classList.toggle('affordable', canAfford && isUnlocked);
        // Update cost button text
        const btn = cards[i].querySelector('.hero-btn');
        if (btn && isUnlocked) btn.innerHTML = `${fmt(cost)} ${getIcon('gold', 14)}`;
        i++;
    }
}

// ===== GAME LOOP =====
let lastTime = 0;
let saveCounter = 0;
let renderCounter = 0;
let achievementCheckTimer = 0;

function gameLoop(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime = timestamp;

    // Idle income
    const gps = getTotalGPS();
    if (gps > 0) {
        const earned = gps * dt;
        state.gold += earned;
        state.totalGold += earned;
    }

    // Boss
    updateBoss(dt);

    // Combo decay
    updateCombo(dt);

    // Lucky events
    checkLuckyEvent(dt);

    // Flash sale system (Scarcity + FOMO)
    checkFlashSale(dt);

    // Auto-tap system
    if (state.autoTapRate > 0) {
        const autoTaps = state.autoTapRate * dt;
        const autoValue = Math.floor(getTapValue() * autoTaps);
        if (autoValue > 0) {
            state.gold += autoValue;
            state.totalGold += autoValue;
            state.totalClicks += Math.floor(autoTaps); // count toward achievements
            if (state.bossActive) {
                state.bossHP -= autoValue * getHeroBossDmgMult();
            }
        }
    }

    // Phoenix hero timer
    const phoenixLevel = state.heroes.phoenix || 0;
    if (phoenixLevel > 0) {
        state.phoenixTimer = (state.phoenixTimer || 0) - dt;
        if (state.phoenixTimer <= 0) {
            state.phoenixActive = true;
            state.phoenixTimer = Math.max(10, 60 - phoenixLevel * 2); // faster at higher levels
            setTimeout(() => { state.phoenixActive = false; }, 1000 + phoenixLevel * 100);
        }
    }

    // Boss near-miss effect
    if (state.bossActive) updateBossNearMiss();

    // Check achievements every 2 seconds
    achievementCheckTimer += dt;
    if (achievementCheckTimer >= 2) {
        achievementCheckTimer = 0;
        checkAchievements();
    }

    // Tutorial update (check every 0.5s, not every frame)
    if (Tutorial.active && !Tutorial.dismissed) {
        if (!gameLoop._tutTimer) gameLoop._tutTimer = 0;
        gameLoop._tutTimer += dt;
        if (gameLoop._tutTimer >= 0.5) {
            gameLoop._tutTimer = 0;
            Tutorial.update();
        }
    }

    // Render every 3 frames (~20fps for DOM)
    renderCounter++;
    if (renderCounter % 3 === 0) {
        renderHUD();
        // Only update affordable status, don't rebuild cards (fixes click bug)
        if (state.currentTab === 'buildings') updateBuildingAffordable();
        else if (state.currentTab === 'heroes') updateHeroAffordable();
    }

    // Auto-save every 30 seconds
    saveCounter += dt;
    if (saveCounter >= 30) {
        saveCounter = 0;
        save();
    }

    requestAnimationFrame(gameLoop);
}

// ===== STATIC SVG ICON INITIALIZATION =====
function initStaticIcons() {
    // Resource bar icons
    const goldIcon = document.getElementById('res-gold-icon');
    const gemIcon = document.getElementById('res-gem-icon');
    const starIcon = document.getElementById('res-star-icon');
    if (goldIcon) goldIcon.innerHTML = getIcon('gold', 22);
    if (gemIcon) gemIcon.innerHTML = getIcon('gem', 22);
    if (starIcon) starIcon.innerHTML = getIcon('star', 22);

    // Bottom nav icons
    const navBuildings = document.getElementById('nav-icon-buildings');
    const navHeroes = document.getElementById('nav-icon-heroes');
    const navUpgrades = document.getElementById('nav-icon-upgrades');
    const navAchievements = document.getElementById('nav-icon-achievements');
    const navPrestige = document.getElementById('nav-icon-prestige');
    if (navBuildings) navBuildings.innerHTML = getIcon('navBuildings', 22);
    if (navHeroes) navHeroes.innerHTML = getIcon('navHeroes', 22);
    if (navUpgrades) navUpgrades.innerHTML = getIcon('navUpgrades', 22);
    if (navAchievements) navAchievements.innerHTML = getIcon('navAchievements', 22);
    if (navPrestige) navPrestige.innerHTML = getIcon('navPrestige', 22);

    // Panel header icons
    const phBuildings = document.getElementById('ph-buildings-icon');
    const phHeroes = document.getElementById('ph-heroes-icon');
    const phUpgrades = document.getElementById('ph-upgrades-icon');
    const phAchievements = document.getElementById('ph-achievements-icon');
    if (phBuildings) phBuildings.innerHTML = getIcon('castle', 20);
    if (phHeroes) phHeroes.innerHTML = getIcon('sword', 20);
    if (phUpgrades) phUpgrades.innerHTML = getIcon('bolt', 20);
    if (phAchievements) phAchievements.innerHTML = getIcon('trophy', 20);

    // Fight boss button icon
    const fightIcon = document.getElementById('fight-icon');
    if (fightIcon) fightIcon.innerHTML = getIcon('sword', 16);
}

// ===== RENDER ALL =====
function renderAll() {
    renderHUD();
    renderKingdomScene();
    renderBuildings();
    renderUpgrades();
    renderHeroes();
    renderBoss();
    renderAchievements();
    renderLuckyEvent();
}

// ===== INIT =====
function init() {
    try {
        cacheDom();
        SFX.init();
        Particles.init();

        const loaded = load();
        if (loaded) {
            reapplyUpgrades();
            const offline = calcOfflineEarnings();
            if (offline) {
                showOfflinePopup(offline.earnings, offline.time);
            }
        }

        // Event listeners
        if (DOM.tapCircle) {
            DOM.tapCircle.addEventListener('click', onTap);
            DOM.tapCircle.addEventListener('touchstart', (e) => {
                e.preventDefault();
                onTap(e);
            }, { passive: false });
        }

        DOM.navBtns.forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });

        if (DOM.btnPrestige) DOM.btnPrestige.addEventListener('click', doPrestige);
        if (DOM.btnPrestigeClose) DOM.btnPrestigeClose.addEventListener('click', () => {
            if (DOM.prestigeOverlay) DOM.prestigeOverlay.classList.add('hidden');
        });

        if (DOM.btnFightBoss) {
            DOM.btnFightBoss.addEventListener('click', () => {
                SFX.resume();
                startBoss();
                renderBoss();
                renderBossPreview();
            });
        }

        // Flash Sale click handler
        if (DOM.flashSale) {
            DOM.flashSale.addEventListener('click', () => buyFlashSale());
        }

        // Daily Reward claim handler
        if (DOM.btnDailyClaim) {
            DOM.btnDailyClaim.addEventListener('click', () => DailyReward.claim());
        }

        // Sound toggle button
        const btnSound = document.getElementById('btn-sound');
        if (btnSound) {
            btnSound.addEventListener('click', (e) => {
                e.stopPropagation();
                SFX.enabled = !SFX.enabled;
                btnSound.textContent = SFX.enabled ? '🔊' : '🔇';
                btnSound.classList.toggle('muted', !SFX.enabled);
                if (SFX.enabled) { SFX.resume(); SFX.startAmbient(); }
                else { SFX.stopAmbient(); }
                try { localStorage.setItem('idle_kingdom_sound', SFX.enabled ? '1' : '0'); } catch(e) {}
            });
            // Restore sound preference
            try {
                const pref = localStorage.getItem('idle_kingdom_sound');
                if (pref === '0') {
                    SFX.enabled = false;
                    btnSound.textContent = '🔇';
                    btnSound.classList.add('muted');
                }
            } catch(e) {}
        }

        // Resume audio on first touch
        document.addEventListener('click', () => { SFX.resume(); if (SFX.enabled) SFX.startAmbient(); }, { once: true });
        document.addEventListener('touchstart', () => { SFX.resume(); if (SFX.enabled) SFX.startAmbient(); }, { once: true });

        // Save on page hide
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) save();
        });
        window.addEventListener('beforeunload', save);

        // Initialize SVG icons in static HTML elements
        initStaticIcons();

        // Initial render
        renderAll();
        switchTab('buildings');

        // Streak display
        updateStreakDisplay();

        // Daily Reward check (Hook Model: Trigger!)
        // Show after offline popup (or immediately if no offline)
        setTimeout(() => {
            if (DailyReward.shouldShow()) {
                DailyReward.show();
            }
        }, 1500);

        // Tutorial system
        Tutorial.init();
        if (Tutorial.shouldShow()) {
            const startStep = state.totalClicks >= 3 ? 1 : 0;
            Tutorial.start(startStep);
        } else {
            Tutorial.active = false;
            Tutorial.dismissed = true;
        }

        // Start game loop
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);

        console.log('🏰 Idle Kingdom v3.0 — Psychology Edition loaded!');
    } catch (err) {
        console.error('INIT ERROR:', err);
    }
}

document.addEventListener('DOMContentLoaded', init);
