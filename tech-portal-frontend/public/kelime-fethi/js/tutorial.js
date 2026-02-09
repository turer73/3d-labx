// ============================================================
// KELIME FETHI v2.0 — Tutorial System
// ============================================================

import { TUTORIAL_STEPS } from './config.js';
import { state, save } from './state.js';

let tutorialStep = 0;

export function showTutorial() {
    tutorialStep = 0;
    renderTutorialStep();
    const overlay = document.getElementById('tutorial-overlay');
    if (overlay) overlay.classList.remove('hidden');
}

function renderTutorialStep() {
    const step = TUTORIAL_STEPS[tutorialStep];
    if (!step) return;

    const stepEl = document.getElementById('tutorial-step');
    if (stepEl) {
        stepEl.innerHTML = `
            <div class="tutorial-icon">${step.icon}</div>
            <h3>${step.title}</h3>
            <p>${step.text}</p>
        `;
    }

    const nextBtn = document.getElementById('btn-tutorial-next');
    if (nextBtn) {
        nextBtn.textContent = tutorialStep < TUTORIAL_STEPS.length - 1 ? 'Devam' : 'Basla!';
    }

    const dotsEl = document.getElementById('tutorial-dots');
    if (dotsEl) {
        dotsEl.innerHTML = TUTORIAL_STEPS.map((_, i) =>
            `<span class="tut-dot${i === tutorialStep ? ' active' : ''}"></span>`
        ).join('');
    }
}

export function nextTutorialStep() {
    tutorialStep++;
    if (tutorialStep >= TUTORIAL_STEPS.length) {
        const overlay = document.getElementById('tutorial-overlay');
        if (overlay) overlay.classList.add('hidden');
        state.tutorialDone = true;
        save();
        return;
    }
    renderTutorialStep();
}
