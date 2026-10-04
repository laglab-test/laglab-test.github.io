// Bei jeder neuen Version VERSION erhöhen. Die neue Version wird beim nächsten App-Start übernommen.
// Test-App, laglab-test.github.io. Nur eigene Speicher werden gelöscht.
const PREFIX = 'lagcam-test-';
const VERSION = PREFIX + 's96';   // Zählung seit Stand 1 vom 01.10.2026, weiter mit s2, s3 und so fort
const FILES = ['./', 'index.html', 'i18n.js', 'native.js', 'app.js', 'analysis.js', 'draw.js', 'compare.js', 'style.css', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  // cache: 'reload' umgeht den Browser-Zwischenspeicher, sonst landen alte Dateien im neuen Offline-Speicher
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      // laglab-mp war der Speicher der entfernten Bilderkennung, er wird mit gelöscht
      .then(keys => Promise.all(keys.filter(k => (k.startsWith(PREFIX) && k !== VERSION) || k.startsWith('laglab-mp-')).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Die Seite fordert das beim Start an, wenn eine neue Version bereitliegt
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(VERSION)
      .then(c => c.match(e.request, { ignoreSearch: true }))
      .then(hit => hit || fetch(e.request))
  );
});
