const CACHE_NAME = 'luna-caftan-runtime-v1';

// Optional: small static assets you want always available (e.g. logos)
const PRE_CACHE_URLS = ['/logo.png', '/logo-white.png'];

// Install: only pre-cache a few safe assets (no HTML, no _next/static)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRE_CACHE_URLS).catch(() => undefined);
    })
  );
});

// Runtime caching only for API + optimized images.
// Do NOT cache HTML or /_next/static/* here.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only handle same-origin requests
  const isSameOrigin = url.origin === self.location.origin;

  // API requests: NetworkFirst
  if (isSameOrigin && url.pathname.startsWith('/api/')) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(event.request);
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        } catch {
          const cached = await caches.match(event.request);
          return cached || new Response(null, { status: 504 });
        }
      })()
    );
    return;
  }

  // Next.js image optimizer: StaleWhileRevalidate
  if (isSameOrigin && url.pathname === '/_next/image') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(event.request);
        const networkPromise = fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return cached || networkPromise;
      })()
    );
    return;
  }

  // For everything else (HTML, _next/static, etc.), do NOT intercept:
  // let the browser/network handle it normally.
});

// Activate: clean up old runtime caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return undefined;
        })
      )
    )
  );
});
