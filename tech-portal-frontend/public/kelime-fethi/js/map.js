// ============================================================
// KELIME FETHI v2.0 — Map System
// ============================================================

import { REGION_COLORS } from './config.js';
import { state } from './state.js';
import { CITIES, REGIONS, TURKEY_MAP } from './words.js';
import { Haptic } from './haptic.js';
import { showToast } from './utils.js';

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
