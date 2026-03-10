// വേർഷൻ v1 ൽ നിന്ന് v2 ആക്കി മാറ്റി. 
// (ഇനി ഭാവിയിൽ കോഡിൽ മാറ്റങ്ങൾ വരുത്തുമ്പോൾ ഇത് v3, v4 എന്നിങ്ങനെ മാറ്റിക്കൊടുക്കുക)
const CACHE_NAME = "pdf-compressor-v7"; 
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// ഇൻസ്റ്റാൾ ചെയ്യുമ്പോൾ പുതിയ ഫയലുകൾ കാഷെ ചെയ്യുന്നു
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  // പുതിയ വേർഷൻ വന്നാൽ ഉടൻ തന്നെ ആക്റ്റീവ് ആകാൻ ഇത് സഹായിക്കും
  self.skipWaiting(); 
});

// ആക്റ്റീവ് ആകുമ്പോൾ പഴയ കാഷെ (ഉദാഹരണത്തിന് v1) ഓട്ടോമാറ്റിക് ആയി ഡിലീറ്റ് ചെയ്യുന്നു
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('പഴയ കാഷെ ഡിലീറ്റ് ചെയ്യുന്നു:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    // നെറ്റ്വർക്കിൽ നിന്ന് പുതിയ ഫയൽ എടുക്കാൻ ശ്രമിക്കുക, പരാജയപ്പെട്ടാൽ മാത്രം കാഷെയിൽ നിന്ന് എടുക്കുക
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
