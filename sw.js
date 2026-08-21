const CACHE_NAME = 'bpp-v781d6afd';

// Precache mínimo: app shell. El resto se cachea en runtime.
// IMPORTANTE: cache.addAll() es atómico — un solo 404 rompe la instalación.
// Solo listar archivos cuya existencia esté verificada.
const PRECACHE_URLS = [
  '/',
  '/proyectos/',
  '/pensamiento/',
  '/reporte-impacto/',
  '/privacidad/',
  '/usina/',
  '/usina/tesis-01/',
  '/offline.html',
  '/styles.min.css',
  '/main.min.js',
  '/img/logo-160.webp',
  '/img/logo-320.webp',
  '/favicon-32x32.png',
  '/apple-touch-icon.png'
];

// Install: precache del shell + activación inmediata
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: limpiar caches viejos y tomar control de los clientes
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch:
// - Navegaciones (HTML): network-first → el contenido nunca queda congelado.
//   Fallback a cache, y si tampoco hay, offline.html.
// - Assets estáticos: cache-first con runtime caching (solo GET same-origin 200).
self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') {
    return;
  }

  // HTML / navegación: network-first
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then(cached => cached || caches.match('/offline.html'))
        )
    );
    return;
  }

  // Assets: cache-first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) {
        return cached;
      }

      return fetch(request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;
      });
    }).catch(() =>
      new Response('', { status: 408, statusText: 'Network request timeout' })
    )
  );
});
