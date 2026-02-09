// ============================================================
// IDLE KINGDOM — Service Worker v1.0
// Offline-first caching strategy for PWA
// ============================================================

const CACHE_NAME = 'idle-kingdom-v8';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css?v=7',
    './game.js?v=7',
    './assets/icons.js?v=7',
    './assets/icon-192.svg',
    './assets/icon-512.svg',
    './manifest.json'
];

// Install: cache all core assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching core assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => {
                        console.log('[SW] Removing old cache:', key);
                        return caches.delete(key);
                    })
            ))
            .then(() => self.clients.claim())
    );
});

// Fetch: cache-first for assets, network-first for HTML
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip chrome-extension and other non-http requests
    if (!url.protocol.startsWith('http')) return;

    // For HTML pages: network-first (get latest version)
    if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    return response;
                })
                .catch(() => caches.match(event.request) || caches.match('./index.html'))
        );
        return;
    }

    // For all other assets: cache-first
    event.respondWith(
        caches.match(event.request)
            .then(cached => {
                if (cached) return cached;

                return fetch(event.request).then(response => {
                    // Only cache successful same-origin responses
                    if (response.ok && url.origin === self.location.origin) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    }
                    return response;
                });
            })
            .catch(() => {
                // Offline fallback for images
                if (event.request.destination === 'image') {
                    return new Response(
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect fill="#1E293B" width="32" height="32"/><text x="16" y="20" text-anchor="middle" fill="#F59E0B" font-size="12">?</text></svg>',
                        { headers: { 'Content-Type': 'image/svg+xml' } }
                    );
                }
            })
    );
});
