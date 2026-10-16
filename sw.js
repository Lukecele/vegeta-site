// sw.js – Service Worker per Vegeta: Il Principe dei Saiyan PWA
// Strategia: Network-First per freschezza assoluta, con Cache Fallback per offline

const CACHE_NAME = 'vegeta-pwa-v11';
const STATIC_ASSETS = [
  '/',
  '/index.html?v=2.2.0',
  '/style.css?v=2.2.0',
  '/script.js?v=2.2.0',
  '/quotes.json?v=2.2.0',
  '/manifest.json',
  '/assets/favicon.svg',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/assets/apple-touch-icon.png',
  '/assets/og-image.svg',
  '/assets/og-image.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Vegeta SW] Pre-caching v3 static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Vegeta SW] Eliminazione vecchia cache obsoleta:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// NETWORK-FIRST per garantire che l'utente veda SEMPRE la versione più recente
self.addEventListener('fetch', (event) => {
  // Ignora richieste non GET o estensioni Chrome
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  const url = new URL(event.request.url);

  // Network-First assoluto per HTML, JS, JSON e CSS locali
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback offline dalla cache se la rete non è disponibile
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
  );
});
