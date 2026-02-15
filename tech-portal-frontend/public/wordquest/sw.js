// ===== WORDQUEST SERVICE WORKER =====
const BUILD_TS = '2026-02-16T06:00:00Z';
const CACHE_NAME = 'wordquest-' + BUILD_TS;
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './game.js',
    './data/words.json',
    './manifest.json'
];

// Install - no-cache fetch to ensure fresh assets
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => Promise.all(
                ASSETS.map(url => fetch(url, { cache: 'no-cache' }).then(res => cache.put(url, res)))
            ))
            .then(() => self.skipWaiting())
    );
});

// Activate - clean old caches
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// Notification click — open WordQuest
self.addEventListener('notificationclick', (e) => {
    e.notification.close();
    e.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(tabs => {
            for (const tab of tabs) {
                if (tab.url.includes('/wordquest/')) {
                    return tab.focus();
                }
            }
            return clients.openWindow('./index.html');
        })
    );
});

// Message from client — schedule notification
self.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'SCHEDULE_NOTIFICATION') {
        const { delayMs, title, body, tag } = e.data;
        setTimeout(() => {
            self.registration.showNotification(title, {
                body,
                tag,
                icon: './icons/icon-192.png',
                badge: './icons/icon-192.png',
                vibrate: [200, 100, 200],
                data: { url: './index.html' },
                requireInteraction: false
            });
        }, delayMs);
    }
});

// Fetch - stale-while-revalidate
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(cached => {
            const fetchPromise = fetch(e.request).then(res => {
                if (res.ok) {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
                }
                return res;
            }).catch(() => cached);

            return cached || fetchPromise;
        })
    );
});