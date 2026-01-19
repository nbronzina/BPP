const CACHE_NAME = 'bpp-v21';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/styles.min.css',
  '/main.min.js',
  '/img/logo.png',
  '/img/logo-160.webp',
  '/img/logo-320.webp',
  '/img/Nicolas-240.webp',
  '/img/Nicolas-480.webp',
  '/img/Sergio-240.webp',
  '/img/Sergio-480.webp',
  '/img/Ezequiel-240.webp',
  '/img/Ezequiel-480.webp',
  '/img/JornadaCESBA.webp',
  '/favicon-32x32.png',
  '/apple-touch-icon.png'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Fetch event with offline fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }

        return fetch(event.request).then(fetchResponse => {
          // Cache successful responses
          if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
            return fetchResponse;
          }

          const responseToCache = fetchResponse.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return fetchResponse;
        });
      })
      .catch(() => {
        // Network request failed, show offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }

        // For other requests (images, etc), fail silently
        return new Response('', {
          status: 408,
          statusText: 'Network request timeout'
        });
      })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Background sync (optional, for future use)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms());
  }
});

async function syncForms() {
  console.log('Syncing offline form submissions...');
  // Implement form sync logic here if needed
}
