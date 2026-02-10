// ============================================================
// KELIME FETHI — Service Worker v5.0
// Offline-first caching strategy for PWA
// Auto-versioning with BUILD_TS
// ============================================================

// BUILD_TS will be updated by deploy script or manually
const BUILD_TS = '20250211b';
const CACHE_NAME = `kelime-fethi-${BUILD_TS}`;

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css?v=5',
    './js/app.js?v=6',
    './js/config.js',
    './js/utils.js',
    './js/haptic.js',
    './js/sound.js',
    './js/particles.js',
    './js/state.js',
    './js/words.js',
    './js/map.js',
    './js/puzzle.js',
    './js/keyboard.js',
    './js/stats.js',
    './js/cloud.js',
    './js/tutorial.js',
    './js/turkey-map-data.js',
    './js/achievements.js',
    './js/ads.js',
    './assets/icon-192.svg',
    './assets/icon-192.png',
    './assets/icon-512.svg',
    './assets/icon-512.png',
    './assets/og-image.svg',
    './assets/og-image.png',
    './assets/icons.js?v=3',
    './manifest.json',
    './data/words.json',
    './data/cities.json',
];

// Install — cache core assets
self.addEventListener('install', (event) => {
    console.log(`[SW] Installing ${CACHE_NAME}`);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

// Activate — clean ALL old caches
self.addEventListener('activate', (event) => {
    console.log(`[SW] Activating ${CACHE_NAME}`);
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => {
                        console.log(`[SW] Deleting old cache: ${key}`);
                        return caches.delete(key);
                    })
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch — smart caching strategy
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip external requests (API calls etc.)
    if (url.origin !== self.location.origin) return;

    // JSON data files — stale-while-revalidate (always get fresh on next load)
    if (url.pathname.endsWith('.json') && url.pathname.includes('/data/')) {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache =>
                cache.match(event.request).then(cached => {
                    const fetchPromise = fetch(event.request).then(response => {
                        if (response.ok) cache.put(event.request, response.clone());
                        return response;
                    }).catch(() => cached);

                    return cached || fetchPromise;
                })
            )
        );
        return;
    }

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

    // All other assets — cache-first with network fallback
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

// Listen for skip waiting message from client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
