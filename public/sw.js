const CACHE_NAME = 'omnichat-local-shell-v1'
const APP_SCOPE = new URL(self.registration.scope)
const INDEX_URL = new URL('index.html', APP_SCOPE).toString()
const SHELL_URLS = [
  APP_SCOPE.toString(),
  INDEX_URL,
  new URL('manifest.webmanifest', APP_SCOPE).toString(),
  new URL('omnichat.svg', APP_SCOPE).toString(),
]

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_URLS)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(names => Promise.all(
    names.filter(name => name.startsWith('omnichat-') && name !== CACHE_NAME).map(name => caches.delete(name)),
  )).then(() => self.clients.claim()))
})

self.addEventListener('fetch', event => {
  const request = event.request
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin || !url.pathname.startsWith(APP_SCOPE.pathname)) return

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request)
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME)
          await cache.put(INDEX_URL, response.clone())
        }
        return response
      } catch {
        return (await caches.match(INDEX_URL)) || Response.error()
      }
    })())
    return
  }

  event.respondWith((async () => {
    const cached = await caches.match(request)
    if (cached) return cached
    const response = await fetch(request)
    if (response.ok && response.type === 'basic') {
      const cache = await caches.open(CACHE_NAME)
      await cache.put(request, response.clone())
    }
    return response
  })())
})
