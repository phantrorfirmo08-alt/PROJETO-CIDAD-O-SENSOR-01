const CACHE_NAME = 'sarah-gce-v4.1-cache';
const urlsToCache = [
  './index.html',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Instalação do Service Worker e cache dos recursos essenciais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache do G.C.E. aberto com sucesso');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptação de requisições (Estratégia: Cache com fallback para rede)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna do cache se encontrado, senão busca na rede
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // Fallback genérico caso falhe totalmente offline em requisições de página
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
