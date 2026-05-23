const CACHE_NAME = 'tuhingarai-portfolio-v1.0.3';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/tokens.css',
  '/styles/base.css',
  '/styles/layout.css',
  '/styles/components.css',
  '/styles/devops.css',
  '/styles/responsive.css',
  '/scripts/main.js',
  '/assets/favicon.svg',
  '/assets/favicon-16x16.svg',
  '/assets/favicon-32x32.svg',
  '/assets/apple-touch-icon.svg',
  '/assets/tuhin_portfolio_pic_dark.jpg',
  '/assets/tuhin_portfolio_pic_light.jpg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event (forces immediately taking control)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event (claims control immediately)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event (Network-First for HTML/CSS/JS, Cache-First for assets)
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  // Strip query parameters for clean cache keys
  const cleanUrl = event.request.url.split('?')[0];

  // For HTML, CSS, JS, and Web Manifest, use Network First strategy
  const isCachableAsset = event.request.mode === 'navigate' ||
                          cleanUrl.endsWith('.html') ||
                          cleanUrl.endsWith('.css') ||
                          cleanUrl.endsWith('.js') ||
                          cleanUrl.endsWith('manifest.json');

  if (isCachableAsset) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(cleanUrl, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(cleanUrl);
        })
    );
  } else {
    // For images, fonts, and other assets, use Cache First strategy
    event.respondWith(
      caches.match(cleanUrl)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(cleanUrl, responseToCache);
              });
            }
            return networkResponse;
          });
        })
    );
  }
});