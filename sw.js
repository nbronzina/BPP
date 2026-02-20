const CACHE_NAME = 'bpp-v75';
const urlsToCache = [
  '/',
  '/index.html',
  '/proyectos/',
  '/proyectos/index.html',
  '/offline.html',
  '/styles.min.css',
  '/main.min.js',
  '/img/logo.png',
  '/img/logo-160.webp',
  '/img/logo-320.webp',
  '/img/Nicolas-240.webp',
  '/img/Nicolas-320.webp',
  '/img/Nicolas-480.webp',
  '/img/Sergio-240.webp',
  '/img/Sergio-480.webp',
  '/img/Ezequiel-240.webp',
  '/img/Ezequiel-480.webp',
  '/img/JornadaCESBA.webp',
  '/img/Ajedrez.webp',
  '/img/workshop-latam2036.webp',
  '/img/workshop-latam2036.png',
  '/img/workshop-latam2036-mobile.webp',
  '/img/workshop-latam2036-mobile.png',
  '/img/inhabiting-future.webp',
  '/img/inhabiting-future.jpg',
  '/img/alquileres-negociacion.webp',
  '/img/alquileres-negociacion.png',
  '/img/otros-futuros-ied.webp',
  '/img/otros-futuros-ied.png',
  '/img/otros-futuros-ied-mobile.webp',
  '/img/otros-futuros-ied-mobile.png',
  '/img/NatalidadOptima-mobile.webp',
  '/img/NatalidadOptima-mobile.png',
  '/img/micelio.webp',
  '/img/micelio.png',
  '/img/Heated.webp',
  '/img/Heated.png',
  '/img/logo-cesba.webp',
  '/img/logo-cesba.png',
  '/img/trace-logo.webp',
  '/img/trace-logo.png',
  '/img/hermanas-minimas-logo.webp',
  '/img/hermanas-minimas-logo.png',
  '/img/EscInn.webp',
  '/img/EscInn.png',
  '/img/olamestudio.webp',
  '/img/olamestudio.png',
  '/img/og-image.jpg',
  '/img/Ajedrez.png',
  '/img/dassen1.webp',
  '/img/lab-logo-coral.webp',
  '/img/lab-logo-coral.png',
  '/img/otros-futuros.webp',
  '/img/otros-futuros.png',
  '/img/manifiesto-bar.webp',
  '/img/manifiesto-bar.png',
  '/img/comunicaciones-syp.webp',
  '/img/comunicaciones-syp.png',
  '/favicon-32x32.png',
  '/apple-touch-icon.png'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
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
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Background sync (optional, for future use)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms());
  }
});

async function syncForms() {
  // Implement form sync logic here if needed
}
