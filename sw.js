/* Service worker — makes the Field Kit installable and playable offline.
   Network-first so updates land immediately; cache fallback keeps game night
   alive if the Wi-Fi dies at 2:47. */

const CACHE = "twh-v1";
const CORE = [
  "./", "./index.html", "./styles.css", "./manifest.webmanifest",
  "./icon-192.png", "./icon-512.png",
  "./js/data.js", "./js/census.js", "./js/sync.js", "./js/dice.js",
  "./js/sound.js", "./js/art.js", "./js/scenes.js", "./js/scene-art.js",
  "./js/app.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
