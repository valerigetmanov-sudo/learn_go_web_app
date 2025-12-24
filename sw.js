const CACHE_NAME = 'learn-go-v2';


const ASSETS = [
  'index.html',
  'style.css',
  'engin_app.js',
  'translations.js',
  'data_theory.js',
  'data_verbs.js',
  'data_prefixes.js',
  'images/logo_hum.png'
];

// Установка: кэшируем файлы
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Активация: чистим старый кэш
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Запросы: берем файлы из кэша
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});