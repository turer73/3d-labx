// ============================================================
// KELIME FETHI v2.0 — Map System
// ============================================================

import { REGION_COLORS } from './config.js';
import { state, save } from './state.js';
import { CITIES, REGIONS, TURKEY_MAP } from './words.js';
import { Haptic } from './haptic.js';
import { SFX } from './sound.js';
import { showToast } from './utils.js';
import { Particles } from './particles.js';

export function getConqueredCount() {
    return Object.keys(state.conqueredCities).length;
}

export function isCityConquered(cityId) {
    return !!state.conqueredCities[cityId];
}

export function isCityAvailable(cityId) {
    const city = CITIES.find(c => c.id === cityId);
    if (!city) return false;
    const region = REGIONS.find(r => r.id === city.region);
    if (!region) return false;
    return getConqueredCount() >= region.unlockThreshold;
}

export function isRegionUnlocked(regionId) {
    const region = REGIONS.find(r => r.id === regionId);
    if (!region) return false;
    return getConqueredCount() >= region.unlockThreshold;
}

export function getRegionProgress(regionId) {
    const regionCities = CITIES.filter(c => c.region === regionId);
    const conquered = regionCities.filter(c => isCityConquered(c.id));
    return { total: regionCities.length, conquered: conquered.length };
}

export function getCityRegion(cityId) {
    const city = CITIES.find(c => c.id === cityId);
    return city ? city.region : null;
}

// onCityClick callback will be set by puzzle module
let _onCityClickCallback = null;
export function setOnCityClickCallback(fn) {
    _onCityClickCallback = fn;
}

export function renderMap() {
    const mapEl = document.getElementById('turkey-map');
    if (!mapEl || !TURKEY_MAP.paths) return;

    mapEl.innerHTML = '';

    TURKEY_MAP.paths.forEach(pathData => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData.d);
        path.setAttribute('id', `city-${pathData.id}`);
        path.dataset.cityId = pathData.id;
        path.dataset.name = pathData.name;

        const region = getCityRegion(pathData.id);
        if (region) {
            path.dataset.region = region;
        }

        const conquered = isCityConquered(pathData.id);
        const available = isCityAvailable(pathData.id);

        if (conquered) {
            path.classList.add('city-conquered');
            if (region && REGION_COLORS[region]) {
                path.style.fill = REGION_COLORS[region].conquered;
            }
        } else if (available) {
            path.classList.add('city-available');
            if (region && REGION_COLORS[region]) {
                path.style.fill = REGION_COLORS[region].base;
            }
        } else {
            path.classList.add('city-locked');
        }

        path.addEventListener('click', () => onCityClick(pathData.id));
        mapEl.appendChild(path);

        // City label
        if (pathData.labelX && pathData.labelY) {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', pathData.labelX);
            text.setAttribute('y', pathData.labelY);
            text.setAttribute('class', 'city-label');
            text.textContent = pathData.name;
            text.addEventListener('click', () => onCityClick(pathData.id));
            mapEl.appendChild(text);
        }
    });

    updateMapProgress();
}

export function updateMapProgress() {
    const count = getConqueredCount();
    const total = CITIES.length || 81;

    const countEl = document.getElementById('city-count');
    if (countEl) countEl.textContent = `${count}/${total}`;

    const progressEl = document.getElementById('map-progress');
    if (progressEl) progressEl.style.width = `${(count / total) * 100}%`;
}

function onCityClick(cityId) {
    const city = CITIES.find(c => c.id === cityId);
    if (!city) return;

    if (isCityConquered(cityId)) {
        const data = state.conqueredCities[cityId];
        showToast(`${city.name} zaten fethedildi! (${data.guesses}/6, +${data.score}⭐)`);
        return;
    }

    if (!isCityAvailable(cityId)) {
        const region = REGIONS.find(r => r.id === city.region);
        if (region) {
            showToast(`🔒 ${region.name} bölgesini açmak için ${region.unlockThreshold} şehir fethet!`);
        }
        Haptic.error();
        return;
    }

    if (_onCityClickCallback) {
        _onCityClickCallback(cityId);
    }
}

// FIX: Improved filterMapByRegion with proper label filtering
export function filterMapByRegion(regionId) {
    const mapEl = document.getElementById('turkey-map');
    if (!mapEl) return;

    const paths = mapEl.querySelectorAll('path');
    paths.forEach(path => {
        const cityId = parseInt(path.dataset.cityId);
        const city = CITIES.find(c => c.id === cityId);

        if (regionId === 'all') {
            path.style.opacity = '1';
        } else if (city && city.region === regionId) {
            path.style.opacity = '1';
        } else {
            path.style.opacity = '0.15';
        }
    });

    // FIX: Properly filter labels using text content matching
    const labels = mapEl.querySelectorAll('.city-label');
    labels.forEach(label => {
        if (regionId === 'all') {
            label.style.opacity = '1';
        } else {
            // Find the city by label text
            const cityName = label.textContent;
            const city = CITIES.find(c => c.name === cityName);
            if (city && city.region === regionId) {
                label.style.opacity = '1';
            } else {
                label.style.opacity = '0.15';
            }
        }
    });
}

export function initRegionSelector() {
    document.querySelectorAll('.region-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterMapByRegion(btn.dataset.region);
        });
    });
}

// ===== ZOOM / PAN SUPPORT =====
let mapScale = 1;
let mapTranslateX = 0;
let mapTranslateY = 0;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;
let lastTouchDist = 0;

function applyMapTransform() {
    const mapEl = document.getElementById('turkey-map');
    if (!mapEl) return;
    mapEl.style.transform = `translate(${mapTranslateX}px, ${mapTranslateY}px) scale(${mapScale})`;
    mapEl.style.transformOrigin = 'center center';
}

function resetMapZoom() {
    mapScale = 1;
    mapTranslateX = 0;
    mapTranslateY = 0;
    applyMapTransform();
}

export function initMapZoom() {
    const container = document.getElementById('map-container');
    if (!container) return;

    // Mouse wheel zoom
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        mapScale = Math.min(3, Math.max(1, mapScale + delta));
        if (mapScale === 1) {
            mapTranslateX = 0;
            mapTranslateY = 0;
        }
        applyMapTransform();
    }, { passive: false });

    // Mouse pan
    container.addEventListener('mousedown', (e) => {
        if (mapScale <= 1) return;
        isPanning = true;
        panStartX = e.clientX - mapTranslateX;
        panStartY = e.clientY - mapTranslateY;
        container.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        mapTranslateX = e.clientX - panStartX;
        mapTranslateY = e.clientY - panStartY;
        // Clamp translation
        const maxT = (mapScale - 1) * 200;
        mapTranslateX = Math.min(maxT, Math.max(-maxT, mapTranslateX));
        mapTranslateY = Math.min(maxT, Math.max(-maxT, mapTranslateY));
        applyMapTransform();
    });

    window.addEventListener('mouseup', () => {
        isPanning = false;
        container.style.cursor = '';
    });

    // Touch: pinch zoom + pan
    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            lastTouchDist = Math.sqrt(dx * dx + dy * dy);
        } else if (e.touches.length === 1 && mapScale > 1) {
            isPanning = true;
            panStartX = e.touches[0].clientX - mapTranslateX;
            panStartY = e.touches[0].clientY - mapTranslateY;
        }
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (lastTouchDist > 0) {
                const scaleDelta = (dist - lastTouchDist) * 0.005;
                mapScale = Math.min(3, Math.max(1, mapScale + scaleDelta));
                if (mapScale === 1) {
                    mapTranslateX = 0;
                    mapTranslateY = 0;
                }
                applyMapTransform();
            }
            lastTouchDist = dist;
        } else if (isPanning && e.touches.length === 1) {
            mapTranslateX = e.touches[0].clientX - panStartX;
            mapTranslateY = e.touches[0].clientY - panStartY;
            const maxT = (mapScale - 1) * 200;
            mapTranslateX = Math.min(maxT, Math.max(-maxT, mapTranslateX));
            mapTranslateY = Math.min(maxT, Math.max(-maxT, mapTranslateY));
            applyMapTransform();
        }
    }, { passive: false });

    container.addEventListener('touchend', () => {
        isPanning = false;
        lastTouchDist = 0;
    });

    // Double-tap to reset zoom
    let lastTap = 0;
    container.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTap < 300 && e.changedTouches.length === 1) {
            if (mapScale > 1) {
                resetMapZoom();
            } else {
                mapScale = 2;
                applyMapTransform();
            }
        }
        lastTap = now;
    });
}

// ===== CITY CONQUEST ANIMATION =====
export function playCityConquestAnimation(cityId) {
    const cityPath = document.getElementById(`city-${cityId}`);
    if (!cityPath) return;

    // Add conquest animation class
    cityPath.classList.add('city-just-conquered');
    setTimeout(() => cityPath.classList.remove('city-just-conquered'), 1500);

    // Add mini flag SVG element on conquered city
    const mapEl = document.getElementById('turkey-map');
    if (!mapEl) return;

    const bbox = cityPath.getBBox();
    const cx = bbox.x + bbox.width / 2;
    const cy = bbox.y + bbox.height / 2;

    // Create a flag/star icon over the city
    const flagGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    flagGroup.classList.add('conquest-marker');
    flagGroup.innerHTML = `
        <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"
              font-size="10" class="conquest-flag-text"
              style="pointer-events:none; animation: flagPlantSVG 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards;">
            🏴
        </text>
    `;
    mapEl.appendChild(flagGroup);

    // Remove flag after 3s and keep permanent small star
    setTimeout(() => {
        flagGroup.remove();
    }, 3000);

    // Particle burst from city location on screen
    const mapContainer = document.getElementById('map-container');
    if (mapContainer) {
        const rect = mapContainer.getBoundingClientRect();
        const svgRect = mapEl.getBoundingClientRect();
        // Convert SVG coords to screen coords
        const svgWidth = 900;
        const svgHeight = 600;
        const screenX = rect.left + (cx / svgWidth) * svgRect.width;
        const screenY = rect.top + (cy / svgHeight) * svgRect.height;
        Particles.confetti(screenX, screenY);
    }
}

// ===== REGION UNLOCK BANNER =====
let lastUnlockedRegions = new Set();

export function initRegionTracking() {
    // Record currently unlocked regions on startup
    REGIONS.forEach(r => {
        if (getConqueredCount() >= r.unlockThreshold) {
            lastUnlockedRegions.add(r.id);
        }
    });
}

export function checkRegionUnlock() {
    const count = getConqueredCount();
    let newlyUnlocked = null;

    REGIONS.forEach(r => {
        if (count >= r.unlockThreshold && !lastUnlockedRegions.has(r.id)) {
            lastUnlockedRegions.add(r.id);
            newlyUnlocked = r;
        }
    });

    if (newlyUnlocked) {
        showRegionUnlockBanner(newlyUnlocked);
    }
}

function showRegionUnlockBanner(region) {
    // Remove any existing banner
    const existing = document.querySelector('.region-unlock-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.className = 'region-unlock-banner';
    banner.innerHTML = `
        <span class="unlock-icon">🔓</span>
        <h2>Yeni Bölge Açıldı!</h2>
        <p>${region.name} bölgesi artık keşfedilebilir!</p>
    `;
    document.body.appendChild(banner);

    SFX.streakReward();
    Haptic.conquer();

    // Auto remove after 3 seconds
    setTimeout(() => {
        banner.style.animation = 'regionUnlockOut 0.4s ease-in forwards';
        setTimeout(() => banner.remove(), 400);
    }, 3000);
}
