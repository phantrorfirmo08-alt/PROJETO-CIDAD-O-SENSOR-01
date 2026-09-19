const CACHE_NAME = 'sarah-ia-v4-cache';

// Instalação do Service Worker e salvamento inicial
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json'
      ]);
    })
  );
  self.skipWaiting();
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia segura: tenta a rede primeiro (garantindo dados frescos), com fallback para o cache
self.addEventListener('fetch', (event) => {
  // Ignora requisições de APIs dinâmicas
  if (
    event.request.url.includes('workers.dev') || 
    event.request.url.includes('open-meteo.com') || 
    event.request.url.includes('rainviewer.com')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
