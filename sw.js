const CACHE_NAME = 'sarah-ia-v4-cache';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Instalação do Service Worker e salvamento inicial em cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Ativação e limpeza de versões antigas de cache
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

// Interceptação de requisições (estratégia Cache First com fallback para a rede)
self.addEventListener('fetch', (event) => {
  // Evita cache de requisições para a API do Cloudflare ou Open-Meteo para garantir dados em tempo real
  if (event.request.url.includes('workers.dev') || event.request.url.includes('open-meteo.com') || event.request.url.includes('rainviewer.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
