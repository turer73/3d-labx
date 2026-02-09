// ============================================================
// KELIME FETHI v2.0 — Turkish Character Handling & Utilities
// ============================================================

export const TR_UPPER = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';
export const TR_LOWER = 'abcçdefgğhıijklmnoöprsştuüvyz';

export function trUpper(str) {
    let result = '';
    for (const ch of str) {
        const idx = TR_LOWER.indexOf(ch);
        result += idx >= 0 ? TR_UPPER[idx] : ch.toUpperCase();
    }
    return result;
}

export function trLower(str) {
    let result = '';
    for (const ch of str) {
        const idx = TR_UPPER.indexOf(ch);
        result += idx >= 0 ? TR_LOWER[idx] : ch.toLowerCase();
    }
    return result;
}

export function trLen(str) {
    return [...str].length;
}

// ===== TOAST NOTIFICATIONS =====
export function showToast(message, duration = 2500) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ===== FLOAT TEXT =====
export function floatText(text, x, y, color = '#16a34a') {
    const el = document.createElement('div');
    el.className = 'float-text';
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.color = color;
    const container = document.getElementById('float-container');
    if (container) {
        container.appendChild(el);
        setTimeout(() => el.remove(), 1200);
    }
}
