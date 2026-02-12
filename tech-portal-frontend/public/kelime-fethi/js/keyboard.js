// ============================================================
// KELIME FETHI v3.0 — Keyboard Input + Swipe Support
// ============================================================

import { TR_UPPER, trUpper } from './utils.js';
import { SFX } from './sound.js';
import { addLetter, removeLetter, submitGuess } from './puzzle.js';

function handleKeyPress(key) {
    if (key === 'ENTER') {
        submitGuess();
    } else if (key === 'BACKSPACE') {
        removeLetter();
    } else if (TR_UPPER.includes(key)) {
        addLetter(key);
    }
}

export function initPhysicalKeyboard() {
    document.addEventListener('keydown', (e) => {
        const puzzleView = document.getElementById('puzzle-view');
        if (!puzzleView || !puzzleView.classList.contains('active')) return;

        if (e.key === 'Enter') {
            e.preventDefault();
            handleKeyPress('ENTER');
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            handleKeyPress('BACKSPACE');
        } else {
            const upper = trUpper(e.key);
            if (upper.length === 1 && TR_UPPER.includes(upper)) {
                e.preventDefault();
                handleKeyPress(upper);
            }
        }
    });
}

export function initVirtualKeyboard() {
    document.querySelectorAll('#keyboard .key').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            SFX.resume();
            const key = btn.dataset.key;
            handleKeyPress(key);
        });
    });
}

// ===== SWIPE KEYBOARD =====
// Touch-swipe over keyboard keys to type letters by dragging
export function initSwipeKeyboard() {
    const keyboard = document.getElementById('keyboard');
    if (!keyboard) return;

    let isSwiping = false;
    let lastKey = null;
    let swipedKeys = new Set(); // prevent double-fire on same key during one swipe

    function getKeyFromTouch(touch) {
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        if (!el) return null;
        const keyBtn = el.closest('.key');
        if (!keyBtn || !keyBtn.dataset.key) return null;
        return { element: keyBtn, key: keyBtn.dataset.key };
    }

    function highlightKey(btn) {
        btn.classList.add('swipe-active');
    }

    function unhighlightKey(btn) {
        btn.classList.remove('swipe-active');
    }

    keyboard.addEventListener('touchstart', (e) => {
        // Only activate swipe if starting on a letter key (not ENTER/BACKSPACE)
        const info = getKeyFromTouch(e.touches[0]);
        if (!info) return;
        if (info.key === 'ENTER' || info.key === 'BACKSPACE') return;

        isSwiping = true;
        lastKey = info.key;
        swipedKeys.clear();
        swipedKeys.add(info.key);

        // Fire the first key normally (click handler already does it)
        // But since we prevent default, we handle it here
        // Note: click event already fires for the initial touch,
        // so we DON'T fire here to avoid double input
        highlightKey(info.element);
    }, { passive: true });

    keyboard.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;

        const info = getKeyFromTouch(e.touches[0]);
        if (!info) return;

        // Skip ENTER and BACKSPACE during swipe
        if (info.key === 'ENTER' || info.key === 'BACKSPACE') return;

        if (info.key !== lastKey) {
            // Unhighlight previous
            if (lastKey) {
                const prevBtn = keyboard.querySelector(`.key[data-key="${lastKey}"]`);
                if (prevBtn) unhighlightKey(prevBtn);
            }

            // New key touched — fire if not already swiped
            if (!swipedKeys.has(info.key)) {
                swipedKeys.add(info.key);
                SFX.resume();
                handleKeyPress(info.key);
                SFX.keyTap();
            }

            highlightKey(info.element);
            lastKey = info.key;
        }

        // Prevent page scroll while swiping on keyboard
        e.preventDefault();
    }, { passive: false });

    keyboard.addEventListener('touchend', () => {
        if (!isSwiping) return;
        isSwiping = false;

        // Unhighlight all
        keyboard.querySelectorAll('.key.swipe-active').forEach(k => {
            unhighlightKey(k);
        });

        lastKey = null;
        swipedKeys.clear();
    }, { passive: true });

    keyboard.addEventListener('touchcancel', () => {
        isSwiping = false;
        keyboard.querySelectorAll('.key.swipe-active').forEach(k => {
            unhighlightKey(k);
        });
        lastKey = null;
        swipedKeys.clear();
    }, { passive: true });
}
