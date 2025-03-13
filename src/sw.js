const CACHE_NAME = 'membrain-cache-v1';
const ASSETS_CACHE = 'membrain-assets-v1';
const LINK=import.meta.env.VITE_API_URL;

// Add Vite's development server paths
const VITE_ASSETS = [
  '/@vite/client',
  '/src/components/',
  '/node_modules/'
];

// Update static assets to include Vite paths
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/src/main.jsx',
  '/src/index.css',
  '/src/components/ThemeProvid er.jsx',
  '/src/components/Navbar.jsx',
 
  '/src/components/AllNotes.jsx',
  '/src/components/NoteDetails.jsx',
  '/src/components/Search.jsx',
  '/src/components/NoteForm.jsx', 
  '/src/components/NoteList.jsx',
  
];

// Add development mode check
const isDev = self.location.hostname === 'localhost';

// Modified fetch handler with Vite support
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip Vite HMR requests in development
  if (isDev && request.url.includes('/@vite/client')) return;

  event.respondWith(
    (async () => {
      try {
        // Check if request is for Vite assets in development
        if (isDev && VITE_ASSETS.some(path => request.url.includes(path))) {
          const response = await fetch(request);
          if (response.ok) return response;
          
          // If 404, try alternate paths
          const altPaths = [
            request.url.replace('/src/', '/dist/'),
            request.url.replace('?t=', ''),
            request.url.split('?')[0]
          ];

          for (const path of altPaths) {
            try {
              const altResponse = await fetch(path);
              if (altResponse.ok) return altResponse;
            } catch (e) {
              console.debug('Alt path failed:', path);
            }
          }
        }

        // API calls: Network first, fallback to cache
        if (request.url.includes('/api/')) {
          try {
            const networkResponse = await fetch(request);
            if (networkResponse.ok) {
              const cache = await caches.open(CACHE_NAME);
              await cache.put(request, networkResponse.clone());
              return networkResponse;
            }
          } catch (error) {
            const cachedResponse = await caches.match(request);
            if (cachedResponse) return cachedResponse;
          }
        }

        // Static assets: Cache first, fallback to network
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;

        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
          const cache = await caches.open(ASSETS_CACHE);
          await cache.put(request, networkResponse.clone());
          return networkResponse;
        }

        // Handle 404s
        if (networkResponse.status === 404) {
          console.warn('Resource not found:', request.url);
          return new Response('Resource not found', {
            status: 404,
            statusText: 'Not Found'
          });
        }

        return networkResponse;
      } catch (error) {
        console.error('Service Worker: Fetch failed:', error);
        if (request.mode === 'navigate') {
          const offlineResponse = await caches.match('/offline.html');
          if (offlineResponse) return offlineResponse;
        }
        throw error;
      }
    })()
  );
});

// ...existing notification handlers...

// Activation and cleanup
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        // Clean up old caches
        const cacheKeys = await caches.keys();
        const deletions = cacheKeys
          .filter(key => key !== CACHE_NAME && key !== ASSETS_CACHE)
          .map(key => caches.delete(key));
        
        await Promise.all(deletions);
      
        
        // Take control of all pages immediately
        await clients.claim();
      } catch (error) {
        console.error('Service Worker: Cleanup failed:', error);
      }
    })()
  );
});

// Fetch handler with network-first strategy for API calls
// and cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;

  event.respondWith(
    (async () => {
      try {
        // API calls: Network first, fallback to cache
        if (request.url.includes('/api/')) {
          try {
            const networkResponse = await fetch(request);
            // Cache successful responses
            if (networkResponse.ok) {
              const cache = await caches.open(CACHE_NAME);
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          } catch (error) {
            const cachedResponse = await caches.match(request);
            if (cachedResponse) return cachedResponse;
            throw error;
          }
        }

        // Static assets: Cache first, fallback to network
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;

        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
          const cache = await caches.open(ASSETS_CACHE);
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        console.error('Service Worker: Fetch failed:', error);
        // Return offline fallback page if available
        if (request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
        throw error;
      }
    })()
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  event.waitUntil(
    self.registration.showNotification('MemBrain', {
      body: data.message,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      data: data.url
    })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});