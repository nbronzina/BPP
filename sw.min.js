// Kill-switch: este service worker ya no forma parte del sitio.
// Se mantiene un tiempo para que los navegadores que lo tenían instalado
// lo reemplacen por esta versión, que borra los caches y se desregistra.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then(clients => clients.forEach(c => c.navigate(c.url)))
  );
});
