/* sw.js - Service Worker for offline support */

var CACHE_NAME = 'funschool-v8';
var FILES = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './modules.js',
    './math.js',
    './science.js',
    './rewards.js',
    './sounds.js',
    './storage.js',
    './progress.js',
    './ct.js',
    './ct-stories.json',
    './states.js',
    './states-data.json',
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
    e.respondWith(
        caches.match(e.request).then(function (cached) {
            return cached || fetch(e.request).then(function (response) {
                // Cache new requests dynamically
                if (response.status === 200) {
                    var clone = response.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(e.request, clone);
                    });
                }
                return response;
            });
        }).catch(function () {
            // Fallback to index for navigation requests
            if (e.request.mode === 'navigate') {
                return caches.match('./index.html');
            }
        })
    );
});
