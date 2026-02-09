// ============================================================
// KELIME FETHI — Service Worker v1.0
// Offline-first caching strategy for PWA
// ============================================================

const CACHE_NAME = 'kelime-fethi-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css?v=1',
    './game.js?v=1',
    './assets/icons.js?v=1',
    './assets/icon-192.svg',
    './assets/icon-512.svg',
    './manifest.json',
    './data/words.json',
    './data/cities.json',
];

// Install — cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch — network-first for HTML, cache-first for assets
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip external requests (API calls etc.)
    if (url.origin !== self.location.origin) return;

    // Navigation requests (HTML) — network-first
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // All other assets — cache-first
    event.respondWith(
        caches.match(event.request)
            .then(cached => {
                if (cached) return cached;
                return fetch(event.request).then(response => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    }
                    return response;
                });
            })
            .catch(() => new Response('Offline', { status: 503 }))
    );
});
