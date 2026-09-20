const CACHE_NAME = 'sarah-ia-v51-cache-v1';
const urlsToCache = [
  './',
  './index.html'
];

// Instalação do Service Worker e armazenamento em cache do app autossuficiente
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SARAH IA v5.1: Cache do aplicativo principal instalado com sucesso.');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Ativação e limpeza de versões antigas de cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('SARAH IA v5.1: Removendo cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptação de requisições para garantir o funcionamento 100% offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna do cache se disponível, senão busca na rede
        return response || fetch(event.request);
      })
  );
});
