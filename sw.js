/* sw.js - Service Worker for offline support */

var CACHE_NAME = 'funschool-v28';
var FILES = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './modules.js',
    './math.js',
    './math-subtract.js',
    './math-multiply.js',
    './letters.js',
    './science.js',
    './continents.js',
    './rewards.js',
    './sounds.js',
    './storage.js',
    './progress.js',
    './ct.js',
    './ct-stories.json',
    './states.js',
    './states-data.json',
    './newton.js',
    './mystery.js',
    './story.js',
    './mythology.js',
    './mythology-stories.json',
    './manifest.json',
    './icon.svg'
];

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(FILES);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (names) {
            return Promise.all(
                names.filter(function (name) {
                    return name !== CACHE_NAME;
                }).map(function (name) {
                    return caches.delete(name);
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', function (e) {
    if (e.request.method !== 'GET') return;
    // Network-first: always show the latest files when online, fall back to cache offline
    e.respondWith(
        fetch(e.request, { cache: 'no-cache' }).then(function (response) {
            if (response.status === 200) {
                var clone = response.clone();
                caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(e.request, clone);
                });
            }
            return response;
        }).catch(function () {
            return caches.match(e.request).then(function (cached) {
                if (cached) return cached;
                if (e.request.mode === 'navigate') return caches.match('./index.html');
            });
        }).catch(function () {
            // Fallback to index for navigation requests
            if (e.request.mode === 'navigate') {
                return caches.match('./index.html');
            }
        })
    );
});
