// ===== WORDQUEST SERVICE WORKER =====
const CACHE_NAME = 'wordquest-v1.0.0';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './game.js',
    './data/words.json',
    './manifest.json'
];

// Install
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// Fetch - Cache first, network fallback
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request)
            .then(cached => cached || fetch(e.request)
                .then(res => {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
                    return res;
                })
            )
            .catch(() => {
                if (e.request.destination === 'document') {
                    return caches.match('./index.html');
                }
            })
    );
});