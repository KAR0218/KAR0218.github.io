const CACHE_NAME = "ps5-portal-v2";

self.addEventListener("install", event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith("/ps5/")) return;

  // Navigation: network first, cached portal fallback offline.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).then(response => {
        const copy=response.clone();
        caches.open(CACHE_NAME).then(c=>c.put(req,copy));
        return response;
      }).catch(() =>
        caches.match(req).then(r => r || caches.match("/ps5/index.html"))
      )
    );
    return;
  }

  // Other portal resources: cache first, then network and store.
  event.respondWith(
    caches.match(req).then(cached => {
      if(cached) return cached;
      return fetch(req).then(response => {
        if(response && response.ok){
          const copy=response.clone();
          caches.open(CACHE_NAME).then(c=>c.put(req,copy));
        }
        return response;
      });
    })
  );
});
