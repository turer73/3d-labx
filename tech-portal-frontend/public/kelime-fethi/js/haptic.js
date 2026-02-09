// ============================================================
// KELIME FETHI v2.0 — Haptic Feedback System
// ============================================================

export const Haptic = {
    enabled: true,
    _vib(pattern) {
        if (!this.enabled || !navigator.vibrate) return;
        try { navigator.vibrate(pattern); } catch(e) {}
    },
    tap()       { this._vib(8); },
    keyPress()  { this._vib(5); },
    correct()   { this._vib([15, 30, 15]); },
    present()   { this._vib([10, 20, 10]); },
    absent()    { this._vib(3); },
    win()       { this._vib([30, 50, 30, 50, 60]); },
    lose()      { this._vib([80, 40, 120]); },
    conquer()   { this._vib([20, 30, 20, 30, 40, 30, 60]); },
    error()     { this._vib([40, 20, 40]); },
    streak()    { this._vib([15, 40, 25]); },
};
