// ============================================================
// IDLE KINGDOM v3.0 — SVG Icon System
// Professional game icons replacing emojis
// Each icon is a carefully crafted inline SVG
// ============================================================

const ICONS = {
    // ===== RESOURCE ICONS =====
    gold: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="#F59E0B"/>
        <circle cx="16" cy="16" r="12" fill="#FBBF24"/>
        <circle cx="16" cy="16" r="10" fill="url(#goldGrad)" stroke="#B45309" stroke-width="1"/>
        <text x="16" y="21" text-anchor="middle" font-size="14" font-weight="900" fill="#92400E" font-family="serif">$</text>
        <defs><radialGradient id="goldGrad" cx="0.35" cy="0.35"><stop offset="0%" stop-color="#FDE68A"/><stop offset="100%" stop-color="#F59E0B"/></radialGradient></defs>
    </svg>`,

    gem: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="16,2 28,12 24,28 8,28 4,12" fill="#8B5CF6"/>
        <polygon points="16,2 28,12 16,28 4,12" fill="#A78BFA" opacity="0.7"/>
        <polygon points="16,2 20,12 16,28 12,12" fill="#C4B5FD" opacity="0.5"/>
        <polygon points="16,4 10,12 16,10 22,12" fill="#DDD6FE" opacity="0.6"/>
        <polygon points="16,2 28,12 24,28 8,28 4,12" fill="none" stroke="#6D28D9" stroke-width="1"/>
    </svg>`,

    star: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="16,2 20,11 30,12 23,19 25,29 16,24 7,29 9,19 2,12 12,11" fill="#FBBF24"/>
        <polygon points="16,4 19,11 28,12 22,18 23,27 16,23 9,27 10,18 4,12 13,11" fill="url(#starGrad)"/>
        <polygon points="16,6 12,11 16,13 20,11" fill="#FEF3C7" opacity="0.6"/>
        <defs><radialGradient id="starGrad" cx="0.4" cy="0.3"><stop offset="0%" stop-color="#FEF3C7"/><stop offset="100%" stop-color="#F59E0B"/></radialGradient></defs>
    </svg>`,

    // ===== BUILDING ICONS =====
    farm: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="22" width="32" height="20" rx="2" fill="#92400E"/>
        <rect x="10" y="24" width="28" height="16" fill="#B45309"/>
        <polygon points="6,22 24,8 42,22" fill="#DC2626"/>
        <polygon points="8,22 24,10 40,22" fill="#EF4444"/>
        <polygon points="24,10 40,22 24,22" fill="#B91C1C" opacity="0.3"/>
        <rect x="20" y="30" width="8" height="12" fill="#78350F" rx="1"/>
        <rect x="22" y="32" width="4" height="4" fill="#FBBF24" opacity="0.5" rx="0.5"/>
        <rect x="12" y="26" width="6" height="5" fill="#93C5FD" rx="0.5" opacity="0.6"/>
        <rect x="30" y="26" width="6" height="5" fill="#93C5FD" rx="0.5" opacity="0.6"/>
        <line x1="8" y1="42" x2="42" y2="42" stroke="#78350F" stroke-width="2"/>
        <circle cx="36" cy="16" r="4" fill="#FBBF24" opacity="0.3"/>
        <path d="M4,42 Q10,38 16,42" stroke="#22C55E" stroke-width="2" fill="none"/>
        <path d="M32,42 Q38,38 44,42" stroke="#22C55E" stroke-width="2" fill="none"/>
    </svg>`,

    mine: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,42 L12,20 Q24,8 36,20 L36,42 Z" fill="#6B7280"/>
        <path d="M14,42 L14,22 Q24,12 34,22 L34,42 Z" fill="#4B5563"/>
        <path d="M16,42 L16,24 Q24,16 32,24 L32,42 Z" fill="#1F2937"/>
        <rect x="18" y="28" width="12" height="14" fill="#111827"/>
        <rect x="20" y="28" width="8" height="2" fill="#F59E0B" rx="1"/>
        <circle cx="24" cy="36" r="2" fill="#F59E0B" opacity="0.8"/>
        <circle cx="20" cy="33" r="1" fill="#FBBF24" opacity="0.6"/>
        <circle cx="28" cy="35" r="1.5" fill="#F59E0B" opacity="0.7"/>
        <line x1="22" y1="18" x2="26" y2="18" stroke="#9CA3AF" stroke-width="2"/>
        <line x1="24" y1="12" x2="24" y2="18" stroke="#9CA3AF" stroke-width="2"/>
        <rect x="22" y="10" width="4" height="4" fill="#D97706" rx="1"/>
        <path d="M8,42 L40,42" stroke="#6B7280" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

    lumber: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="14" width="8" height="28" rx="2" fill="#78350F"/>
        <rect x="22" y="16" width="4" height="24" fill="#92400E"/>
        <ellipse cx="24" cy="12" rx="14" ry="10" fill="#166534"/>
        <ellipse cx="24" cy="12" rx="12" ry="8" fill="#22C55E"/>
        <ellipse cx="22" cy="10" rx="8" ry="6" fill="#4ADE80" opacity="0.5"/>
        <ellipse cx="20" cy="9" rx="4" ry="3" fill="#86EFAC" opacity="0.4"/>
        <path d="M6,36 L12,24 L18,36 Z" fill="#9CA3AF"/>
        <rect x="10" y="24" width="4" height="18" fill="#B45309" rx="1"/>
        <line x1="6" y1="42" x2="42" y2="42" stroke="#78350F" stroke-width="2"/>
        <rect x="32" y="34" width="10" height="4" rx="2" fill="#B45309"/>
        <rect x="34" y="30" width="10" height="4" rx="2" fill="#92400E"/>
        <rect x="30" y="38" width="12" height="4" rx="2" fill="#78350F"/>
    </svg>`,

    blacksmith: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="20" width="32" height="22" rx="2" fill="#4B5563"/>
        <rect x="10" y="22" width="28" height="18" fill="#374151"/>
        <polygon points="6,20 24,6 42,20" fill="#6B7280"/>
        <polygon points="8,20 24,8 40,20" fill="#9CA3AF"/>
        <rect x="18" y="28" width="12" height="14" fill="#1F2937" rx="1"/>
        <rect x="20" y="30" width="8" height="4" fill="#F97316" opacity="0.8" rx="0.5"/>
        <rect x="20" y="35" width="8" height="3" fill="#EF4444" opacity="0.6" rx="0.5"/>
        <path d="M38,14 L42,10 L44,12 L40,16 Z" fill="#9CA3AF"/>
        <circle cx="38" cy="8" r="3" fill="#F97316" opacity="0.4"/>
        <circle cx="38" cy="8" r="2" fill="#FBBF24" opacity="0.3"/>
        <path d="M8,42 L40,42" stroke="#4B5563" stroke-width="2"/>
        <rect x="12" y="24" width="4" height="6" fill="#6B7280" rx="0.5"/>
        <rect x="32" y="24" width="4" height="6" fill="#6B7280" rx="0.5"/>
    </svg>`,

    market: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="18" width="36" height="24" rx="2" fill="#92400E"/>
        <rect x="8" y="20" width="32" height="20" fill="#B45309"/>
        <path d="M4,18 Q12,8 24,8 Q36,8 44,18 Z" fill="#DC2626"/>
        <path d="M4,18 Q12,10 24,10 Q36,10 44,18" fill="#EF4444"/>
        <path d="M8,18 Q16,12 24,12 Q32,12 40,18" fill="#F87171" opacity="0.5"/>
        <rect x="12" y="22" width="8" height="6" fill="#FDE68A" rx="1"/>
        <rect x="28" y="22" width="8" height="6" fill="#FDE68A" rx="1"/>
        <rect x="14" y="23" width="4" height="2" fill="#F59E0B" rx="0.5"/>
        <rect x="30" y="23" width="4" height="2" fill="#22C55E" rx="0.5"/>
        <rect x="18" y="30" width="12" height="12" fill="#78350F" rx="1"/>
        <rect x="20" y="32" width="8" height="4" fill="#FBBF24" opacity="0.4" rx="0.5"/>
        <circle cx="24" cy="38" r="1.5" fill="#F59E0B"/>
        <line x1="6" y1="42" x2="42" y2="42" stroke="#78350F" stroke-width="2"/>
    </svg>`,

    temple: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="14" width="32" height="4" fill="#F5F5F4" rx="1"/>
        <rect x="6" y="12" width="36" height="4" fill="#E7E5E4"/>
        <rect x="12" y="18" width="4" height="20" fill="#D6D3D1"/>
        <rect x="22" y="18" width="4" height="20" fill="#D6D3D1"/>
        <rect x="32" y="18" width="4" height="20" fill="#D6D3D1"/>
        <polygon points="4,12 24,2 44,12" fill="#E7E5E4"/>
        <polygon points="6,12 24,4 42,12" fill="#F5F5F4"/>
        <polygon points="24,4 42,12 24,12" fill="#D6D3D1" opacity="0.5"/>
        <rect x="6" y="38" width="36" height="4" fill="#E7E5E4" rx="1"/>
        <circle cx="24" cy="28" r="4" fill="#FBBF24" opacity="0.5"/>
        <circle cx="24" cy="28" r="2" fill="#FDE68A" opacity="0.7"/>
        <path d="M22,28 L24,24 L26,28" fill="#FBBF24" opacity="0.4"/>
        <line x1="6" y1="42" x2="42" y2="42" stroke="#A8A29E" stroke-width="2"/>
    </svg>`,

    academy: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="16" width="36" height="26" rx="2" fill="#1E3A5F"/>
        <rect x="8" y="18" width="32" height="22" fill="#1E4976"/>
        <polygon points="4,16 24,4 44,16" fill="#2563EB"/>
        <polygon points="6,16 24,6 42,16" fill="#3B82F6"/>
        <polygon points="24,6 42,16 24,16" fill="#1D4ED8" opacity="0.4"/>
        <rect x="10" y="20" width="6" height="10" fill="#93C5FD" rx="1" opacity="0.5"/>
        <rect x="21" y="20" width="6" height="10" fill="#93C5FD" rx="1" opacity="0.5"/>
        <rect x="32" y="20" width="6" height="10" fill="#93C5FD" rx="1" opacity="0.5"/>
        <rect x="18" y="32" width="12" height="10" fill="#0F172A" rx="1"/>
        <circle cx="24" cy="10" r="2" fill="#FBBF24"/>
        <rect x="12" y="20" width="2" height="10" fill="#BFDBFE" opacity="0.3"/>
        <rect x="23" y="20" width="2" height="10" fill="#BFDBFE" opacity="0.3"/>
        <rect x="34" y="20" width="2" height="10" fill="#BFDBFE" opacity="0.3"/>
        <line x1="6" y1="42" x2="42" y2="42" stroke="#1E3A5F" stroke-width="2"/>
    </svg>`,

    castle: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="18" width="28" height="24" fill="#6B7280"/>
        <rect x="12" y="20" width="24" height="20" fill="#4B5563"/>
        <rect x="6" y="10" width="8" height="32" fill="#6B7280"/>
        <rect x="34" y="10" width="8" height="32" fill="#6B7280"/>
        <rect x="6" y="6" width="3" height="6" fill="#9CA3AF"/>
        <rect x="11" y="6" width="3" height="6" fill="#9CA3AF"/>
        <rect x="34" y="6" width="3" height="6" fill="#9CA3AF"/>
        <rect x="39" y="6" width="3" height="6" fill="#9CA3AF"/>
        <rect x="18" y="8" width="12" height="6" fill="#9CA3AF"/>
        <rect x="20" y="4" width="3" height="6" fill="#9CA3AF"/>
        <rect x="25" y="4" width="3" height="6" fill="#9CA3AF"/>
        <rect x="20" y="28" width="8" height="14" rx="4" fill="#1F2937"/>
        <rect x="22" y="30" width="4" height="6" rx="2" fill="#374151"/>
        <rect x="14" y="22" width="5" height="6" fill="#93C5FD" rx="0.5" opacity="0.4"/>
        <rect x="29" y="22" width="5" height="6" fill="#93C5FD" rx="0.5" opacity="0.4"/>
        <circle cx="24" cy="20" r="3" fill="#F59E0B" opacity="0.6"/>
        <polygon points="23,2 24,0 25,2" fill="#FBBF24"/>
        <line x1="6" y1="42" x2="42" y2="42" stroke="#4B5563" stroke-width="2"/>
    </svg>`,

    // ===== HERO ICONS =====
    knight: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="14" r="8" fill="#9CA3AF"/>
        <rect x="20" y="6" width="8" height="4" rx="1" fill="#9CA3AF"/>
        <rect x="22" y="3" width="4" height="5" fill="#D97706"/>
        <path d="M22,2 L24,0 L26,2" fill="#FBBF24"/>
        <rect x="18" y="22" width="12" height="16" rx="2" fill="#6B7280"/>
        <rect x="20" y="24" width="8" height="12" fill="#9CA3AF"/>
        <rect x="22" y="26" width="4" height="6" fill="#D6D3D1" opacity="0.3"/>
        <rect x="16" y="24" width="4" height="12" rx="1" fill="#6B7280"/>
        <rect x="28" y="24" width="4" height="12" rx="1" fill="#6B7280"/>
        <rect x="18" y="38" width="5" height="6" rx="1" fill="#6B7280"/>
        <rect x="25" y="38" width="5" height="6" rx="1" fill="#6B7280"/>
        <rect x="6" y="20" width="4" height="20" rx="1" fill="#9CA3AF"/>
        <rect x="4" y="18" width="8" height="3" rx="1" fill="#D6D3D1"/>
        <rect x="21" y="12" width="2" height="3" fill="#1F2937" rx="0.5"/>
        <rect x="25" y="12" width="2" height="3" fill="#1F2937" rx="0.5"/>
    </svg>`,

    archer: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="12" r="7" fill="#F5F5F4"/>
        <rect x="21" y="6" width="6" height="4" fill="#22C55E"/>
        <path d="M20,5 L24,3 L28,5" fill="#16A34A"/>
        <rect x="18" y="19" width="12" height="16" rx="2" fill="#22C55E"/>
        <rect x="20" y="21" width="8" height="12" fill="#16A34A"/>
        <rect x="16" y="21" width="4" height="10" rx="1" fill="#22C55E"/>
        <rect x="28" y="21" width="4" height="10" rx="1" fill="#22C55E"/>
        <rect x="18" y="35" width="5" height="6" rx="1" fill="#78350F"/>
        <rect x="25" y="35" width="5" height="6" rx="1" fill="#78350F"/>
        <path d="M36,8 Q42,24 36,40" stroke="#92400E" stroke-width="2" fill="none"/>
        <line x1="36" y1="12" x2="36" y2="36" stroke="#78350F" stroke-width="1"/>
        <line x1="30" y1="24" x2="36" y2="24" stroke="#9CA3AF" stroke-width="1.5"/>
        <polygon points="29,23 30,24 29,25" fill="#9CA3AF"/>
        <rect x="22" y="10" width="1.5" height="2.5" fill="#1F2937" rx="0.5"/>
        <rect x="25" y="10" width="1.5" height="2.5" fill="#1F2937" rx="0.5"/>
    </svg>`,

    mage: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="14" r="7" fill="#F5F5F4"/>
        <polygon points="18,14 24,0 30,14" fill="#6D28D9"/>
        <polygon points="19,14 24,2 29,14" fill="#8B5CF6"/>
        <circle cx="24" cy="2" r="2" fill="#FBBF24"/>
        <rect x="18" y="21" width="12" height="18" rx="2" fill="#6D28D9"/>
        <rect x="20" y="23" width="8" height="14" fill="#7C3AED"/>
        <rect x="16" y="23" width="4" height="10" rx="1" fill="#6D28D9"/>
        <rect x="28" y="23" width="4" height="10" rx="1" fill="#6D28D9"/>
        <rect x="18" y="39" width="5" height="5" rx="1" fill="#4C1D95"/>
        <rect x="25" y="39" width="5" height="5" rx="1" fill="#4C1D95"/>
        <line x1="34" y1="18" x2="40" y2="8" stroke="#92400E" stroke-width="2"/>
        <circle cx="40" cy="6" r="3" fill="#A78BFA" opacity="0.6"/>
        <circle cx="40" cy="6" r="2" fill="#C4B5FD" opacity="0.8"/>
        <circle cx="40" cy="6" r="1" fill="#EDE9FE"/>
        <path d="M22,26 L24,24 L26,26 L24,32 Z" fill="#FBBF24" opacity="0.4"/>
        <rect x="22" y="12" width="1.5" height="2.5" fill="#1F2937" rx="0.5"/>
        <rect x="25" y="12" width="1.5" height="2.5" fill="#1F2937" rx="0.5"/>
    </svg>`,

    healer: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="14" r="7" fill="#F5F5F4"/>
        <circle cx="24" cy="6" r="4" fill="none" stroke="#FBBF24" stroke-width="1" opacity="0.6"/>
        <rect x="18" y="21" width="12" height="16" rx="2" fill="#F0FDF4"/>
        <rect x="20" y="23" width="8" height="12" fill="#DCFCE7"/>
        <rect x="22" y="25" width="4" height="2" fill="#22C55E"/>
        <rect x="23" y="24" width="2" height="4" fill="#22C55E"/>
        <rect x="16" y="23" width="4" height="10" rx="1" fill="#F0FDF4"/>
        <rect x="28" y="23" width="4" height="10" rx="1" fill="#F0FDF4"/>
        <rect x="18" y="37" width="5" height="6" rx="1" fill="#BBF7D0"/>
        <rect x="25" y="37" width="5" height="6" rx="1" fill="#BBF7D0"/>
        <circle cx="14" cy="28" r="3" fill="#22C55E" opacity="0.4"/>
        <circle cx="34" cy="28" r="3" fill="#22C55E" opacity="0.4"/>
        <circle cx="14" cy="28" r="1.5" fill="#4ADE80" opacity="0.6"/>
        <circle cx="34" cy="28" r="1.5" fill="#4ADE80" opacity="0.6"/>
        <rect x="22" y="12" width="1.5" height="2.5" fill="#1F2937" rx="0.5"/>
        <rect x="25" y="12" width="1.5" height="2.5" fill="#1F2937" rx="0.5"/>
    </svg>`,

    dragon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="30" rx="14" ry="10" fill="#DC2626"/>
        <ellipse cx="24" cy="30" rx="12" ry="8" fill="#EF4444"/>
        <circle cx="24" cy="16" r="8" fill="#DC2626"/>
        <circle cx="24" cy="16" r="6" fill="#EF4444"/>
        <ellipse cx="21" cy="14" rx="2" ry="2.5" fill="#FBBF24"/>
        <ellipse cx="27" cy="14" rx="2" ry="2.5" fill="#FBBF24"/>
        <circle cx="21" cy="14" r="1" fill="#1F2937"/>
        <circle cx="27" cy="14" r="1" fill="#1F2937"/>
        <path d="M20,20 Q24,24 28,20" stroke="#FCA5A5" stroke-width="1" fill="none"/>
        <path d="M12,14 L8,6 L14,12" fill="#DC2626"/>
        <path d="M36,14 L40,6 L34,12" fill="#DC2626"/>
        <path d="M10,28 L4,24 L6,30 L2,28 L8,32" fill="#DC2626" opacity="0.8"/>
        <path d="M38,28 L44,24 L42,30 L46,28 L40,32" fill="#DC2626" opacity="0.8"/>
        <path d="M18,40 Q24,46 30,40" fill="#DC2626"/>
        <ellipse cx="24" cy="30" rx="6" ry="4" fill="#FCA5A5" opacity="0.3"/>
    </svg>`,

    angel: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="6" rx="6" ry="2" fill="none" stroke="#FBBF24" stroke-width="1.5"/>
        <circle cx="24" cy="14" r="7" fill="#FEF3C7"/>
        <rect x="18" y="21" width="12" height="16" rx="2" fill="#F5F5F4"/>
        <rect x="20" y="23" width="8" height="12" fill="#FEFCE8"/>
        <rect x="16" y="23" width="4" height="10" rx="1" fill="#F5F5F4"/>
        <rect x="28" y="23" width="4" height="10" rx="1" fill="#F5F5F4"/>
        <rect x="18" y="37" width="5" height="6" rx="1" fill="#FEF9C3"/>
        <rect x="25" y="37" width="5" height="6" rx="1" fill="#FEF9C3"/>
        <path d="M12,20 Q4,28 10,38" fill="#F5F5F4" opacity="0.6"/>
        <path d="M36,20 Q44,28 38,38" fill="#F5F5F4" opacity="0.6"/>
        <path d="M10,20 Q2,28 8,38" fill="#FEFCE8" opacity="0.4"/>
        <path d="M38,20 Q46,28 40,38" fill="#FEFCE8" opacity="0.4"/>
        <circle cx="24" cy="26" r="3" fill="#FBBF24" opacity="0.3"/>
        <rect x="22" y="12" width="1.5" height="2" fill="#92400E" rx="0.5"/>
        <rect x="25" y="12" width="1.5" height="2" fill="#92400E" rx="0.5"/>
        <path d="M21,17 Q24,19 27,17" stroke="#D97706" stroke-width="0.8" fill="none"/>
    </svg>`,

    // ===== BOSS ICONS =====
    goblin: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="20" r="14" fill="#22C55E"/>
        <circle cx="24" cy="20" r="12" fill="#4ADE80"/>
        <ellipse cx="18" cy="18" rx="4" ry="5" fill="#FEF3C7"/>
        <ellipse cx="30" cy="18" rx="4" ry="5" fill="#FEF3C7"/>
        <circle cx="18" cy="18" r="2.5" fill="#DC2626"/>
        <circle cx="30" cy="18" r="2.5" fill="#DC2626"/>
        <circle cx="18" cy="18" r="1" fill="#1F2937"/>
        <circle cx="30" cy="18" r="1" fill="#1F2937"/>
        <path d="M18,26 Q24,30 30,26" stroke="#1F2937" stroke-width="2" fill="none"/>
        <rect x="20" y="26" width="2" height="3" fill="#F5F5F4" rx="0.5"/>
        <rect x="26" y="26" width="2" height="3" fill="#F5F5F4" rx="0.5"/>
        <path d="M8,16 L12,10 L14,18" fill="#22C55E"/>
        <path d="M40,16 L36,10 L34,18" fill="#22C55E"/>
        <ellipse cx="12" cy="12" rx="3" ry="2" fill="#4ADE80"/>
        <ellipse cx="36" cy="12" rx="3" ry="2" fill="#4ADE80"/>
    </svg>`,

    skeleton: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="16" r="12" fill="#F5F5F4"/>
        <circle cx="24" cy="16" r="10" fill="#E7E5E4"/>
        <ellipse cx="19" cy="14" rx="3.5" ry="4" fill="#1F2937"/>
        <ellipse cx="29" cy="14" rx="3.5" ry="4" fill="#1F2937"/>
        <circle cx="19" cy="14" r="1.5" fill="#DC2626"/>
        <circle cx="29" cy="14" r="1.5" fill="#DC2626"/>
        <ellipse cx="24" cy="20" rx="2" ry="1.5" fill="#1F2937"/>
        <path d="M18,24 L20,24 L22,26 L24,24 L26,26 L28,24 L30,24" stroke="#1F2937" stroke-width="1.5" fill="none"/>
        <rect x="20" y="28" width="8" height="14" fill="#E7E5E4" rx="1"/>
        <rect x="22" y="30" width="4" height="10" fill="#D6D3D1"/>
        <circle cx="24" cy="6" r="3" fill="#FBBF24" opacity="0.5"/>
    </svg>`,

    ogre: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="22" rx="16" ry="14" fill="#92400E"/>
        <ellipse cx="24" cy="22" rx="14" ry="12" fill="#B45309"/>
        <ellipse cx="17" cy="18" rx="4" ry="5" fill="#FEF3C7"/>
        <ellipse cx="31" cy="18" rx="4" ry="5" fill="#FEF3C7"/>
        <circle cx="17" cy="18" r="2.5" fill="#1F2937"/>
        <circle cx="31" cy="18" r="2.5" fill="#1F2937"/>
        <path d="M16,28 Q24,34 32,28" stroke="#78350F" stroke-width="2.5" fill="none"/>
        <rect x="18" y="28" width="3" height="4" fill="#F5F5F4" rx="0.5"/>
        <rect x="27" y="28" width="3" height="4" fill="#F5F5F4" rx="0.5"/>
        <rect x="22" y="29" width="2" height="3" fill="#F5F5F4" rx="0.5"/>
        <circle cx="24" cy="10" r="4" fill="#6B7280" opacity="0.5"/>
        <rect x="22" y="6" width="4" height="4" fill="#6B7280" rx="1"/>
    </svg>`,

    vampire: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8,12 Q24,0 40,12 L38,40 L10,40 Z" fill="#1F2937"/>
        <circle cx="24" cy="22" r="10" fill="#F5F5F4"/>
        <circle cx="24" cy="22" r="8" fill="#FEF3C7"/>
        <ellipse cx="20" cy="20" rx="2.5" ry="3" fill="#DC2626"/>
        <ellipse cx="28" cy="20" rx="2.5" ry="3" fill="#DC2626"/>
        <circle cx="20" cy="20" r="1" fill="#1F2937"/>
        <circle cx="28" cy="20" r="1" fill="#1F2937"/>
        <path d="M20,28 Q24,30 28,28" stroke="#DC2626" stroke-width="1.5" fill="none"/>
        <rect x="21" y="27" width="1.5" height="3" fill="#F5F5F4" rx="0.3"/>
        <rect x="25.5" y="27" width="1.5" height="3" fill="#F5F5F4" rx="0.3"/>
        <path d="M8,18 L10,12 L12,20" fill="#4C1D95" opacity="0.4"/>
        <path d="M40,18 L38,12 L36,20" fill="#4C1D95" opacity="0.4"/>
    </svg>`,

    dragonBoss: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="28" rx="16" ry="12" fill="#7C2D12"/>
        <ellipse cx="24" cy="28" rx="14" ry="10" fill="#9A3412"/>
        <circle cx="24" cy="14" r="10" fill="#7C2D12"/>
        <circle cx="24" cy="14" r="8" fill="#9A3412"/>
        <ellipse cx="20" cy="12" rx="3" ry="3.5" fill="#FBBF24"/>
        <ellipse cx="28" cy="12" rx="3" ry="3.5" fill="#FBBF24"/>
        <circle cx="20" cy="12" r="1.5" fill="#1F2937"/>
        <circle cx="28" cy="12" r="1.5" fill="#1F2937"/>
        <path d="M18,20 Q24,24 30,20" stroke="#F97316" stroke-width="2" fill="none"/>
        <path d="M10,12 L4,2 L14,10" fill="#7C2D12"/>
        <path d="M38,12 L44,2 L34,10" fill="#7C2D12"/>
        <path d="M20,20 L18,24 L22,22" fill="#F97316" opacity="0.6"/>
        <path d="M28,20 L30,24 L26,22" fill="#F97316" opacity="0.6"/>
        <path d="M8,26 L2,22 L6,30" fill="#7C2D12"/>
        <path d="M40,26 L46,22 L42,30" fill="#7C2D12"/>
        <ellipse cx="24" cy="28" rx="8" ry="5" fill="#EA580C" opacity="0.3"/>
    </svg>`,

    darkLord: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10,8 Q24,-2 38,8 L36,42 L12,42 Z" fill="#1F2937"/>
        <path d="M12,10 Q24,2 36,10 L34,40 L14,40 Z" fill="#111827"/>
        <ellipse cx="19" cy="18" rx="4" ry="5" fill="#7C3AED"/>
        <ellipse cx="29" cy="18" rx="4" ry="5" fill="#7C3AED"/>
        <circle cx="19" cy="18" r="2" fill="#A78BFA"/>
        <circle cx="29" cy="18" r="2" fill="#A78BFA"/>
        <circle cx="19" cy="18" r="1" fill="#EDE9FE"/>
        <circle cx="29" cy="18" r="1" fill="#EDE9FE"/>
        <path d="M18,28 Q24,32 30,28" stroke="#7C3AED" stroke-width="2" fill="none"/>
        <path d="M8,14 L12,8" stroke="#7C3AED" stroke-width="1.5"/>
        <path d="M40,14 L36,8" stroke="#7C3AED" stroke-width="1.5"/>
        <circle cx="8" cy="14" r="2" fill="#A78BFA" opacity="0.5"/>
        <circle cx="40" cy="14" r="2" fill="#A78BFA" opacity="0.5"/>
        <circle cx="24" cy="36" r="3" fill="#7C3AED" opacity="0.3"/>
    </svg>`,

    titan: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="8" width="24" height="34" rx="4" fill="#78716C"/>
        <rect x="14" y="10" width="20" height="30" rx="3" fill="#A8A29E"/>
        <ellipse cx="19" cy="20" rx="3" ry="4" fill="#44403C"/>
        <ellipse cx="29" cy="20" rx="3" ry="4" fill="#44403C"/>
        <circle cx="19" cy="20" r="1.5" fill="#F59E0B"/>
        <circle cx="29" cy="20" r="1.5" fill="#F59E0B"/>
        <path d="M18,30 L22,28 L24,30 L26,28 L30,30" stroke="#57534E" stroke-width="2" fill="none"/>
        <rect x="8" y="16" width="6" height="20" rx="2" fill="#78716C"/>
        <rect x="34" y="16" width="6" height="20" rx="2" fill="#78716C"/>
        <circle cx="24" cy="12" r="2" fill="#F59E0B" opacity="0.4"/>
        <path d="M14,8 L18,2 L16,8" fill="#A8A29E"/>
        <path d="M34,8 L30,2 L32,8" fill="#A8A29E"/>
    </svg>`,

    cosmicDestroyer: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="18" fill="#0F172A"/>
        <circle cx="24" cy="24" r="16" fill="#1E1B4B"/>
        <circle cx="24" cy="24" r="14" fill="url(#cosmicGrad)"/>
        <ellipse cx="18" cy="20" rx="4" ry="5" fill="#312E81"/>
        <ellipse cx="30" cy="20" rx="4" ry="5" fill="#312E81"/>
        <circle cx="18" cy="20" r="2.5" fill="#DC2626"/>
        <circle cx="30" cy="20" r="2.5" fill="#DC2626"/>
        <circle cx="18" cy="20" r="1" fill="#FBBF24"/>
        <circle cx="30" cy="20" r="1" fill="#FBBF24"/>
        <path d="M16,30 Q24,36 32,30" stroke="#7C3AED" stroke-width="2" fill="none"/>
        <circle cx="10" cy="10" r="1" fill="#FBBF24" opacity="0.6"/>
        <circle cx="38" cy="8" r="1.5" fill="#A78BFA" opacity="0.4"/>
        <circle cx="8" cy="30" r="1" fill="#EC4899" opacity="0.5"/>
        <circle cx="40" cy="34" r="1" fill="#FBBF24" opacity="0.3"/>
        <circle cx="24" cy="6" r="1.5" fill="#8B5CF6" opacity="0.5"/>
        <defs><radialGradient id="cosmicGrad" cx="0.4" cy="0.4"><stop offset="0%" stop-color="#312E81"/><stop offset="100%" stop-color="#0F172A"/></radialGradient></defs>
    </svg>`,

    // ===== UI ICONS =====
    tap: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="28" r="16" fill="none" stroke="#F59E0B" stroke-width="2" opacity="0.3"/>
        <circle cx="24" cy="28" r="12" fill="none" stroke="#F59E0B" stroke-width="1.5" opacity="0.2"/>
        <path d="M24,8 L24,16 M20,10 L24,8 L28,10" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
        <circle cx="24" cy="28" r="6" fill="#F59E0B" opacity="0.2"/>
        <circle cx="24" cy="28" r="3" fill="#FBBF24" opacity="0.4"/>
    </svg>`,

    sword: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="2" width="4" height="20" fill="#9CA3AF" rx="1"/>
        <rect x="15" y="4" width="2" height="16" fill="#D6D3D1"/>
        <rect x="10" y="20" width="12" height="3" fill="#92400E" rx="1"/>
        <rect x="14" y="23" width="4" height="6" fill="#78350F" rx="1"/>
        <circle cx="16" cy="26" r="1" fill="#F59E0B"/>
    </svg>`,

    shield: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4,6 L16,2 L28,6 L28,18 Q28,28 16,30 Q4,28 4,18 Z" fill="#3B82F6"/>
        <path d="M6,7 L16,4 L26,7 L26,17 Q26,26 16,28 Q6,26 6,17 Z" fill="#60A5FA"/>
        <path d="M16,8 L20,14 L16,20 L12,14 Z" fill="#BFDBFE" opacity="0.5"/>
    </svg>`,

    // ===== NEW BUILDINGS (Expansion) =====
    observatory: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="20" width="12" height="22" fill="#4B5563" rx="1"/>
        <rect x="20" y="22" width="8" height="18" fill="#374151"/>
        <circle cx="24" cy="14" r="10" fill="#1E3A5F"/>
        <circle cx="24" cy="14" r="8" fill="#1E4976"/>
        <circle cx="24" cy="14" r="3" fill="#93C5FD" opacity="0.6"/>
        <circle cx="24" cy="14" r="1.5" fill="#BFDBFE"/>
        <path d="M16,14 L6,10" stroke="#6B7280" stroke-width="2"/>
        <circle cx="6" cy="10" r="2" fill="#93C5FD" opacity="0.4"/>
        <circle cx="32" cy="8" r="1" fill="#FBBF24" opacity="0.5"/>
        <circle cx="38" cy="12" r="1.5" fill="#A78BFA" opacity="0.4"/>
        <circle cx="36" cy="6" r="1" fill="#FDE68A" opacity="0.6"/>
        <line x1="10" y1="42" x2="38" y2="42" stroke="#4B5563" stroke-width="2"/>
    </svg>`,

    wizard_tower: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16,42 L18,16 L30,16 L32,42 Z" fill="#6D28D9"/>
        <path d="M18,42 L20,18 L28,18 L30,42 Z" fill="#7C3AED"/>
        <polygon points="14,16 24,2 34,16" fill="#8B5CF6"/>
        <polygon points="16,16 24,4 32,16" fill="#A78BFA"/>
        <circle cx="24" cy="8" r="3" fill="#FBBF24" opacity="0.8"/>
        <circle cx="24" cy="8" r="1.5" fill="#FDE68A"/>
        <rect x="21" y="22" width="6" height="5" fill="#C4B5FD" rx="0.5" opacity="0.4"/>
        <rect x="21" y="30" width="6" height="5" fill="#C4B5FD" rx="0.5" opacity="0.4"/>
        <circle cx="24" cy="24" r="1.5" fill="#DDD6FE" opacity="0.6"/>
        <circle cx="24" cy="32" r="1.5" fill="#DDD6FE" opacity="0.6"/>
        <circle cx="18" cy="12" r="1" fill="#FBBF24" opacity="0.4"/>
        <circle cx="30" cy="10" r="1" fill="#A78BFA" opacity="0.5"/>
        <line x1="14" y1="42" x2="34" y2="42" stroke="#4C1D95" stroke-width="2"/>
    </svg>`,

    dragon_nest: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="36" rx="18" ry="8" fill="#78350F"/>
        <ellipse cx="24" cy="36" rx="16" ry="6" fill="#92400E"/>
        <ellipse cx="24" cy="36" rx="10" ry="4" fill="#B45309" opacity="0.5"/>
        <circle cx="20" cy="32" r="4" fill="#FDE68A"/>
        <circle cx="28" cy="34" r="3.5" fill="#FDE68A"/>
        <circle cx="24" cy="30" r="4" fill="#FBBF24"/>
        <circle cx="20" cy="32" r="2" fill="#F59E0B" opacity="0.5"/>
        <circle cx="28" cy="34" r="1.8" fill="#F59E0B" opacity="0.5"/>
        <circle cx="24" cy="30" r="2" fill="#F59E0B" opacity="0.5"/>
        <path d="M10,26 Q24,8 38,26" stroke="#DC2626" stroke-width="2" fill="none" opacity="0.4"/>
        <path d="M16,22 L14,14 L20,18" fill="#DC2626" opacity="0.3"/>
        <path d="M32,22 L34,14 L28,18" fill="#DC2626" opacity="0.3"/>
        <circle cx="24" cy="16" r="2" fill="#F97316" opacity="0.3"/>
    </svg>`,

    cosmic_gate: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="24" rx="16" ry="20" fill="none" stroke="#7C3AED" stroke-width="3"/>
        <ellipse cx="24" cy="24" rx="12" ry="16" fill="#1E1B4B" opacity="0.8"/>
        <ellipse cx="24" cy="24" rx="8" ry="12" fill="url(#gateGrad)"/>
        <circle cx="20" cy="18" r="1" fill="#FBBF24" opacity="0.7"/>
        <circle cx="28" cy="22" r="1.5" fill="#A78BFA" opacity="0.6"/>
        <circle cx="22" cy="28" r="1" fill="#EC4899" opacity="0.5"/>
        <circle cx="26" cy="16" r="0.8" fill="#FDE68A" opacity="0.8"/>
        <circle cx="24" cy="24" r="3" fill="#8B5CF6" opacity="0.4"/>
        <circle cx="24" cy="24" r="1.5" fill="#C4B5FD" opacity="0.6"/>
        <rect x="8" y="40" width="6" height="4" rx="1" fill="#6B7280"/>
        <rect x="34" y="40" width="6" height="4" rx="1" fill="#6B7280"/>
        <line x1="8" y1="44" x2="40" y2="44" stroke="#4B5563" stroke-width="2"/>
        <defs><radialGradient id="gateGrad" cx="0.4" cy="0.4"><stop offset="0%" stop-color="#4C1D95"/><stop offset="100%" stop-color="#0F172A"/></radialGradient></defs>
    </svg>`,

    // ===== NEW HERO ICONS (Expansion) =====
    phoenix: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24,4 Q32,16 28,28 Q26,34 24,36 Q22,34 20,28 Q16,16 24,4 Z" fill="#F97316"/>
        <path d="M24,8 Q30,18 27,28 Q25,32 24,34 Q23,32 21,28 Q18,18 24,8 Z" fill="#FBBF24"/>
        <path d="M24,14 Q28,22 26,28 Q25,30 24,32 Q23,30 22,28 Q20,22 24,14 Z" fill="#FDE68A"/>
        <path d="M16,20 L8,12 L14,22" fill="#F97316" opacity="0.6"/>
        <path d="M32,20 L40,12 L34,22" fill="#F97316" opacity="0.6"/>
        <path d="M18,28 L10,30 L16,28" fill="#EF4444" opacity="0.5"/>
        <path d="M30,28 L38,30 L32,28" fill="#EF4444" opacity="0.5"/>
        <circle cx="22" cy="20" r="1.5" fill="#1F2937"/>
        <circle cx="26" cy="20" r="1.5" fill="#1F2937"/>
        <path d="M20,36 Q24,44 28,36" fill="#DC2626" opacity="0.4"/>
    </svg>`,

    necromancer: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="14" r="8" fill="#374151"/>
        <path d="M16,10 L24,0 L32,10" fill="#1F2937"/>
        <path d="M18,12 L24,4 L30,12" fill="#374151"/>
        <rect x="18" y="22" width="12" height="18" rx="2" fill="#1F2937"/>
        <rect x="20" y="24" width="8" height="14" fill="#374151"/>
        <rect x="16" y="24" width="4" height="10" rx="1" fill="#1F2937"/>
        <rect x="28" y="24" width="4" height="10" rx="1" fill="#1F2937"/>
        <ellipse cx="21" cy="13" rx="2" ry="2.5" fill="#22C55E"/>
        <ellipse cx="27" cy="13" rx="2" ry="2.5" fill="#22C55E"/>
        <circle cx="21" cy="13" r="1" fill="#4ADE80"/>
        <circle cx="27" cy="13" r="1" fill="#4ADE80"/>
        <line x1="36" y1="16" x2="42" y2="8" stroke="#6B7280" stroke-width="2"/>
        <circle cx="42" cy="6" r="3" fill="#22C55E" opacity="0.4"/>
        <rect x="18" y="40" width="5" height="5" rx="1" fill="#1F2937"/>
        <rect x="25" y="40" width="5" height="5" rx="1" fill="#1F2937"/>
    </svg>`,

    valkyrie: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="14" r="7" fill="#FEF3C7"/>
        <path d="M18,10 L16,2 L20,8" fill="#D6D3D1"/>
        <path d="M30,10 L32,2 L28,8" fill="#D6D3D1"/>
        <rect x="18" y="21" width="12" height="16" rx="2" fill="#9CA3AF"/>
        <rect x="20" y="23" width="8" height="12" fill="#D6D3D1"/>
        <rect x="16" y="23" width="4" height="10" rx="1" fill="#9CA3AF"/>
        <rect x="28" y="23" width="4" height="10" rx="1" fill="#9CA3AF"/>
        <path d="M12,20 Q4,26 8,36" fill="#D6D3D1" opacity="0.5"/>
        <path d="M36,20 Q44,26 40,36" fill="#D6D3D1" opacity="0.5"/>
        <rect x="6" y="22" width="3" height="16" rx="1" fill="#9CA3AF"/>
        <rect x="4" y="20" width="7" height="3" rx="1" fill="#D6D3D1"/>
        <rect x="22" y="25" width="4" height="2" fill="#FBBF24" opacity="0.5"/>
        <rect x="22" y="12" width="1.5" height="2" fill="#1F2937" rx="0.5"/>
        <rect x="25" y="12" width="1.5" height="2" fill="#1F2937" rx="0.5"/>
        <rect x="18" y="37" width="5" height="6" rx="1" fill="#6B7280"/>
        <rect x="25" y="37" width="5" height="6" rx="1" fill="#6B7280"/>
    </svg>`,

    timeLord: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="16" fill="#1E3A5F"/>
        <circle cx="24" cy="24" r="14" fill="#1E4976"/>
        <circle cx="24" cy="24" r="12" fill="none" stroke="#60A5FA" stroke-width="1.5" opacity="0.5"/>
        <line x1="24" y1="24" x2="24" y2="14" stroke="#FBBF24" stroke-width="2" stroke-linecap="round"/>
        <line x1="24" y1="24" x2="32" y2="28" stroke="#60A5FA" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="24" cy="24" r="2" fill="#FBBF24"/>
        <circle cx="24" cy="12" r="1" fill="#60A5FA" opacity="0.6"/>
        <circle cx="36" cy="24" r="1" fill="#60A5FA" opacity="0.6"/>
        <circle cx="24" cy="36" r="1" fill="#60A5FA" opacity="0.6"/>
        <circle cx="12" cy="24" r="1" fill="#60A5FA" opacity="0.6"/>
        <path d="M24,4 L22,8 L24,6 L26,8 Z" fill="#FBBF24" opacity="0.6"/>
        <circle cx="24" cy="24" r="16" fill="none" stroke="#3B82F6" stroke-width="2" opacity="0.3"/>
    </svg>`,

    // ===== NEW BOSS ICONS (Expansion) =====
    kraken: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="18" rx="14" ry="12" fill="#0E7490"/>
        <ellipse cx="24" cy="18" rx="12" ry="10" fill="#0891B2"/>
        <ellipse cx="19" cy="16" rx="3" ry="4" fill="#FEF3C7"/>
        <ellipse cx="29" cy="16" rx="3" ry="4" fill="#FEF3C7"/>
        <circle cx="19" cy="16" r="2" fill="#1F2937"/>
        <circle cx="29" cy="16" r="2" fill="#1F2937"/>
        <path d="M8,28 Q4,36 8,42" stroke="#0E7490" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M14,28 Q10,38 14,44" stroke="#0891B2" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M24,28 Q24,38 24,44" stroke="#0E7490" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M34,28 Q38,38 34,44" stroke="#0891B2" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M40,28 Q44,36 40,42" stroke="#0E7490" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M20,22 Q24,26 28,22" stroke="#164E63" stroke-width="1.5" fill="none"/>
    </svg>`,

    stormGiant: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="8" width="20" height="34" rx="4" fill="#475569"/>
        <rect x="16" y="10" width="16" height="30" rx="3" fill="#64748B"/>
        <ellipse cx="20" cy="20" rx="3" ry="4" fill="#0F172A"/>
        <ellipse cx="28" cy="20" rx="3" ry="4" fill="#0F172A"/>
        <circle cx="20" cy="20" r="1.5" fill="#60A5FA"/>
        <circle cx="28" cy="20" r="1.5" fill="#60A5FA"/>
        <path d="M18,30 L24,28 L30,30" stroke="#334155" stroke-width="2" fill="none"/>
        <rect x="6" y="16" width="10" height="22" rx="3" fill="#475569"/>
        <rect x="32" y="16" width="10" height="22" rx="3" fill="#475569"/>
        <polygon points="12,6 16,2 20,6" fill="#FBBF24"/>
        <polygon points="28,6 32,2 36,6" fill="#FBBF24"/>
        <path d="M10,8 L6,4 L14,6" fill="#60A5FA" opacity="0.4"/>
        <path d="M38,8 L42,4 L34,6" fill="#60A5FA" opacity="0.4"/>
    </svg>`,

    ancientShadow: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="24" rx="18" ry="16" fill="#0F172A" opacity="0.8"/>
        <ellipse cx="24" cy="24" rx="14" ry="12" fill="#1E293B"/>
        <ellipse cx="18" cy="20" rx="4" ry="5" fill="#DC2626" opacity="0.6"/>
        <ellipse cx="30" cy="20" rx="4" ry="5" fill="#DC2626" opacity="0.6"/>
        <circle cx="18" cy="20" r="2" fill="#EF4444"/>
        <circle cx="30" cy="20" r="2" fill="#EF4444"/>
        <circle cx="18" cy="20" r="1" fill="#FCA5A5"/>
        <circle cx="30" cy="20" r="1" fill="#FCA5A5"/>
        <path d="M18,30 Q24,34 30,30" stroke="#4B5563" stroke-width="2" fill="none"/>
        <path d="M6,20 Q2,24 6,30" stroke="#1F2937" stroke-width="3" fill="none" opacity="0.5"/>
        <path d="M42,20 Q46,24 42,30" stroke="#1F2937" stroke-width="3" fill="none" opacity="0.5"/>
        <circle cx="12" cy="8" r="1" fill="#DC2626" opacity="0.3"/>
        <circle cx="36" cy="10" r="1" fill="#DC2626" opacity="0.3"/>
    </svg>`,

    doomAngel: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="6" rx="6" ry="2" fill="none" stroke="#DC2626" stroke-width="1.5"/>
        <circle cx="24" cy="14" r="7" fill="#FEF3C7"/>
        <rect x="18" y="21" width="12" height="16" rx="2" fill="#1F2937"/>
        <rect x="20" y="23" width="8" height="12" fill="#374151"/>
        <path d="M12,20 Q4,28 10,38" fill="#1F2937" opacity="0.6"/>
        <path d="M36,20 Q44,28 38,38" fill="#1F2937" opacity="0.6"/>
        <path d="M10,20 Q2,28 8,38" fill="#374151" opacity="0.4"/>
        <path d="M38,20 Q46,28 40,38" fill="#374151" opacity="0.4"/>
        <ellipse cx="21" cy="13" rx="2" ry="2.5" fill="#DC2626"/>
        <ellipse cx="27" cy="13" rx="2" ry="2.5" fill="#DC2626"/>
        <circle cx="21" cy="13" r="1" fill="#FBBF24"/>
        <circle cx="27" cy="13" r="1" fill="#FBBF24"/>
        <path d="M21,17 Q24,19 27,17" stroke="#DC2626" stroke-width="0.8" fill="none"/>
        <rect x="18" y="37" width="5" height="6" rx="1" fill="#1F2937"/>
        <rect x="25" y="37" width="5" height="6" rx="1" fill="#1F2937"/>
    </svg>`,

    // ===== NAV BAR ICONS =====
    navBuildings: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="10" width="18" height="12" rx="1" fill="currentColor" opacity="0.3"/>
        <polygon points="2,10 12,3 22,10" fill="currentColor" opacity="0.6"/>
        <rect x="8" y="14" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.8"/>
        <rect x="13" y="14" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.8"/>
        <rect x="10" y="18" width="4" height="4" rx="0.5" fill="currentColor"/>
    </svg>`,

    navHeroes: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="2" width="4" height="14" fill="currentColor" opacity="0.8" rx="0.5"/>
        <rect x="11" y="4" width="2" height="10" fill="currentColor" opacity="0.4"/>
        <rect x="6" y="14" width="12" height="2" rx="1" fill="currentColor" opacity="0.6"/>
        <rect x="10" y="16" width="4" height="5" rx="1" fill="currentColor" opacity="0.7"/>
        <circle cx="12" cy="19" r="1" fill="currentColor" opacity="0.9"/>
    </svg>`,

    navUpgrades: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="12,2 14,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 10,9" fill="currentColor" opacity="0.1"/>
        <path d="M12,2 L14,8 L12,12 L10,8 Z" fill="currentColor" opacity="0.8"/>
        <path d="M2,9 L10,9 L12,12 L8,14 Z" fill="currentColor" opacity="0.6"/>
        <path d="M22,9 L14,9 L12,12 L16,14 Z" fill="currentColor" opacity="0.6"/>
        <path d="M6,22 L8,14 L12,12 L12,17 Z" fill="currentColor" opacity="0.5"/>
        <path d="M18,22 L16,14 L12,12 L12,17 Z" fill="currentColor" opacity="0.5"/>
        <circle cx="12" cy="11" r="2" fill="currentColor"/>
    </svg>`,

    navAchievements: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="9" r="7" fill="currentColor" opacity="0.3"/>
        <circle cx="12" cy="9" r="5" fill="currentColor" opacity="0.5"/>
        <circle cx="12" cy="9" r="3" fill="currentColor" opacity="0.8"/>
        <polygon points="12,7 13,9 12,11 11,9" fill="currentColor"/>
        <path d="M8,15 L10,22 L12,18 L14,22 L16,15" fill="currentColor" opacity="0.6"/>
    </svg>`,

    navPrestige: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="12,1 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" fill="currentColor" opacity="0.4"/>
        <polygon points="12,3 14,8 20,9 16,13 17,19 12,16 7,19 8,13 4,9 10,8" fill="currentColor" opacity="0.7"/>
        <polygon points="12,5 10,8 12,9 14,8" fill="currentColor" opacity="0.9"/>
    </svg>`,

    navQuests: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="3" width="14" height="18" rx="2" fill="currentColor" opacity="0.3"/>
        <rect x="7" y="5" width="10" height="14" rx="1" fill="currentColor" opacity="0.5"/>
        <line x1="9" y1="8" x2="17" y2="8" stroke="currentColor" stroke-width="1.2" opacity="0.8"/>
        <line x1="9" y1="11" x2="17" y2="11" stroke="currentColor" stroke-width="1.2" opacity="0.8"/>
        <line x1="9" y1="14" x2="14" y2="14" stroke="currentColor" stroke-width="1.2" opacity="0.8"/>
        <circle cx="7" cy="8" r="1" fill="currentColor"/>
        <circle cx="7" cy="11" r="1" fill="currentColor"/>
        <circle cx="7" cy="14" r="1" fill="currentColor"/>
    </svg>`,

    scroll: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="4" width="20" height="24" rx="2" fill="#D4A76A"/>
        <rect x="8" y="6" width="16" height="20" rx="1" fill="#F5E6CC"/>
        <line x1="10" y1="10" x2="22" y2="10" stroke="#8B6914" stroke-width="1.2"/>
        <line x1="10" y1="14" x2="22" y2="14" stroke="#8B6914" stroke-width="1.2"/>
        <line x1="10" y1="18" x2="18" y2="18" stroke="#8B6914" stroke-width="1.2"/>
        <circle cx="10" cy="22" r="1.2" fill="#8B6914"/>
    </svg>`,

    // ===== MISC UI ICONS =====
    trophy: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8,4 L24,4 L24,14 Q24,22 16,24 Q8,22 8,14 Z" fill="#F59E0B"/>
        <path d="M10,6 L22,6 L22,13 Q22,20 16,22 Q10,20 10,13 Z" fill="#FBBF24"/>
        <path d="M4,4 L8,4 L8,10 Q4,10 4,6 Z" fill="#F59E0B" opacity="0.7"/>
        <path d="M28,4 L24,4 L24,10 Q28,10 28,6 Z" fill="#F59E0B" opacity="0.7"/>
        <rect x="12" y="24" width="8" height="3" fill="#D97706" rx="1"/>
        <rect x="10" y="27" width="12" height="2" fill="#B45309" rx="1"/>
        <polygon points="14,10 16,8 18,10 16,16" fill="#FDE68A" opacity="0.5"/>
    </svg>`,

    lock: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="11" width="14" height="10" rx="2" fill="#6B7280"/>
        <path d="M8,11 V8 Q8,4 12,4 Q16,4 16,8 V11" fill="none" stroke="#9CA3AF" stroke-width="2"/>
        <circle cx="12" cy="16" r="2" fill="#D1D5DB"/>
    </svg>`,

    fire: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,2 Q16,8 18,12 Q20,18 12,22 Q4,18 6,12 Q8,8 12,2 Z" fill="#EF4444"/>
        <path d="M12,6 Q14,10 16,13 Q18,17 12,20 Q6,17 8,13 Q10,10 12,6 Z" fill="#F97316"/>
        <path d="M12,10 Q14,14 14,16 Q14,19 12,20 Q10,19 10,16 Q10,14 12,10 Z" fill="#FBBF24"/>
    </svg>`,

    bolt: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="14,2 6,14 12,14 10,22 18,10 12,10" fill="#FBBF24"/>
        <polygon points="13,4 8,13 12,13 11,20 17,11 12,11" fill="#FDE68A" opacity="0.6"/>
    </svg>`,

    check: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#22C55E" opacity="0.3"/>
        <path d="M7,12 L10,15 L17,8" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>`,
};

// ===== ICON RENDERER =====
// Maps building/hero/boss IDs to their icon keys
const ICON_MAP = {
    // Buildings
    farm: 'farm', mine: 'mine', lumber: 'lumber', blacksmith: 'blacksmith',
    market: 'market', temple: 'temple', academy: 'academy', castle: 'castle',
    // Heroes
    knight: 'knight', archer: 'archer', mage: 'mage',
    healer: 'healer', dragon: 'dragon', angel: 'angel',
    // New Buildings
    observatory: 'observatory', wizard_tower: 'wizard_tower',
    dragon_nest: 'dragon_nest', cosmic_gate: 'cosmic_gate',
    // New Heroes
    phoenix: 'phoenix', necromancer: 'necromancer',
    valkyrie: 'valkyrie', timeLord: 'timeLord',
    // Bosses (by index)
    boss_0: 'goblin', boss_1: 'skeleton', boss_2: 'ogre', boss_3: 'vampire',
    boss_4: 'dragonBoss', boss_5: 'darkLord', boss_6: 'titan', boss_7: 'cosmicDestroyer',
    boss_8: 'kraken', boss_9: 'stormGiant', boss_10: 'ancientShadow', boss_11: 'doomAngel',
    // Upgrades (map to related building/UI icons)
    tap2x: 'tap', farm2x: 'farm', mine2x: 'mine', tap5x: 'bolt',
    lumber2x: 'lumber', allprod: 'gold', black2x: 'blacksmith',
    market2x: 'market', tap10x: 'bolt', allprod2: 'star',
    temple3x: 'temple', academy3x: 'academy',
    obs2x: 'observatory', wizard2x: 'wizard_tower',
    dragon_hoard: 'dragon_nest', cosmic_power: 'cosmic_gate',
    tap_critx2: 'bolt', boss_time: 'timeLord', auto_tap: 'tap', gem_find: 'gem', allprod3: 'bolt',
    // Nav icons
    navBuildings: 'navBuildings', navHeroes: 'navHeroes', navUpgrades: 'navUpgrades',
    navAchievements: 'navAchievements', navPrestige: 'navPrestige', navQuests: 'navQuests',
    // UI icons
    scroll: 'scroll',
    trophy: 'trophy', lock: 'lock', fire: 'fire', bolt: 'bolt', check: 'check',
};

// Returns an SVG icon HTML string for given ID
function getIcon(id, size) {
    const sz = size || 32;
    const key = ICON_MAP[id] || id;
    const svg = ICONS[key];
    if (!svg) return `<span style="font-size:${sz}px">❓</span>`;
    return `<div class="game-icon" style="width:${sz}px;height:${sz}px;display:inline-flex;align-items:center;justify-content:center;">${svg}</div>`;
}

// Get boss icon by boss array index
function getBossIcon(index) {
    const key = `boss_${index % 12}`;
    return ICON_MAP[key] ? getIcon(key, 36) : `<span style="font-size:36px">👹</span>`;
}
