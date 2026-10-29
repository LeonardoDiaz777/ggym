// Permite que GGym funcione sin conexión una vez instalada.
// Cambia VERSION cada vez que publiques cambios para que los celulares descarguen la nueva versión.
const VERSION = 'ggym-v1';
const ARCHIVOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/estilos.css',
  './js/app.js',
  './js/datos.js',
  './js/motor.js',
  './js/almacen.js',
  './js/riot-api.js',
  './js/graficos.js',
  './iconos/icono-192.png',
  './iconos/icono-512.png',
  './iconos/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Primero intenta la red (para recibir actualizaciones); si no hay conexión, usa la copia guardada.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((resp) => {
        if (resp.ok && new URL(e.request.url).origin === self.location.origin) {
          const copia = resp.clone();
          caches.open(VERSION).then((cache) => cache.put(e.request, copia));
        }
        return resp;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html'))),
  );
});
