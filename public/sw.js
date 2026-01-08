// Service Worker Minimalista para Habilitar Instalação PWA
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando Razonete Pro...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativo e pronto.');
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Pass-through simples: busca sempre na rede.
  // Isso garante que o usuário veja sempre a versão mais recente do app.
  event.respondWith(fetch(event.request));
});
