const CACHE_NAME = "ps5-portal-v1";

const PRECACHE = [
    "/ps5/",
    "/ps5/index.html"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {
            let done = 0;
            const total = PRECACHE.length;

            async function notify(type, extra) {
                const clients = await self.clients.matchAll({
                    includeUncontrolled: true,
                    type: "window"
                });
                for (const client of clients) {
                    client.postMessage(Object.assign({
                        type, done, total,
                        percent: total ? Math.floor(done / total * 100) : 100
                    }, extra || {}));
                }
            }

            await notify("PORTAL_CACHE_START");

            for (const url of PRECACHE) {
                try {
                    await cache.add(url);
                    done++;
                    await notify("PORTAL_CACHE_PROGRESS", {url});
                } catch (e) {
                    done++;
                    await notify("PORTAL_CACHE_PROGRESS", {url, failed:true});
                }
            }

            await notify("PORTAL_CACHE_COMPLETE");
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME)
                    .map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    const req = event.request;
    if (req.method !== "GET") return;

    const url = new URL(req.url);

    // Only cache the PS5 portal's own origin/path.
    if (url.origin !== self.location.origin) return;
    if (!url.pathname.startsWith("/ps5/")) return;

    event.respondWith(
        caches.match(req, {ignoreSearch:true}).then(cached => {
            if (cached) return cached;

            return fetch(req).then(response => {
                if (response && response.ok) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(req, copy);
                    });
                }
                return response;
            }).catch(() => {
                if (req.mode === "navigate") {
                    return caches.match("/ps5/index.html");
                }
                return new Response("Offline resource unavailable", {
                    status:503,
                    statusText:"Offline"
                });
            });
        })
    );
});
