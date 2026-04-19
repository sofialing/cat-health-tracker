const CACHE_NAME = "cat-health-tracker-v1.0.0";
const urlsToCache = [
  "/",
  "/manifest.json",
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
  // Cache critical routes
  "/login",
  "/profile",
  "/cats",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  // Only cache GET requests
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request).then((fetchResponse) => {
        // Don't cache non-successful responses
        if (!fetchResponse.ok) return fetchResponse;

        // Clone the response for caching
        const responseClone = fetchResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });

        return fetchResponse;
      });
    }).catch(() => {
      // Return offline fallback if available
      return caches.match("/");
    })
  );
});

self.addEventListener("activate", (event) => {
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