// ============================================================
// KELIME FETHI v2.0 — Keyboard Input
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
