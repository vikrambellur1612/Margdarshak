// Service Worker for Margdarshak FAQ PWA
// Enhanced caching strategies and offline functionality
const CACHE_NAME = 'margdarshak-v1';
const STATIC_CACHE = 'margdarshak-static-v2.0.0';
const DYNAMIC_CACHE = 'margdarshak-dynamic-v2.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './icons/favicon-32x32.png',
  './favicon.png'
];

// Documents that should be cached for offline access
const DOCUMENT_FILES = [
  './documents/Margdarshak FAQ - General.html',
  './documents/Operational FAQ.html',
  './documents/Margdarshak FAQ - KCET.html',
  './documents/Margdarshak FAQ - JEE.html',
  './documents/Margdarshak FAQ - ComedK.html',
  './documents/Margdarshak FAQ - PESU.html',
  './documents/Medical.html',
  './documents/Science and Mathematics.html',
  './documents/BITS.html',
  './documents/VIT.html',
  './documents/JEE - Tips from Parents.html'
];

// Data analytics files
const ANALYTICS_FILES = [
  './documents/KCET 2025 Analytics.html',
  './documents/ComedK - Marks vs Rank Analysis.html',
  './documents/JEE - Percentile vs Rank Analysis.html',
  './documents/PES - JOSAA Counseling Analysis.html'
];

// All files to cache
const CACHE_FILES = [...STATIC_FILES, ...DOCUMENT_FILES, ...ANALYTICS_FILES];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Margdarshak PWA Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching app files for offline access...');
        return cache.addAll(CACHE_FILES);
      })
      .then(() => {
        console.log('All files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Margdarshak PWA Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Old caches cleaned up');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle network requests with caching strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests and non-HTTP(S) schemes
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Skip iframe and document navigation requests entirely - let browser handle them
  if (request.destination === 'iframe' || 
      request.destination === 'document' ||
      request.mode === 'navigate' ||
      url.pathname.includes('/documents/')) {
    console.log('Bypassing service worker for navigation/iframe request:', url.pathname);
    return; // Let the browser handle these requests directly
  }

  // Only cache app files (JS, CSS, icons, manifest)
  if (isAppFile(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request));
  }
  // For everything else, let the browser handle it normally
});

// Cache First Strategy - Good for app files
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Create a new request with proper options for compatibility
    const fetchRequest = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      mode: 'cors',
      credentials: 'same-origin',
      redirect: 'follow'
    });
    
    const networkResponse = await fetch(fetchRequest);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache First Strategy failed:', error);
    return getOfflineFallback(request);
  }
}

// Network First Strategy - Good for dynamic content
async function networkFirstStrategy(request) {
  try {
    // Create a new request with proper options for compatibility
    const fetchRequest = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      mode: 'cors',
      credentials: 'same-origin',
      redirect: 'follow'
    });
    
    const networkResponse = await fetch(fetchRequest);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network request failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || getOfflineFallback(request);
  }
}

// Stale While Revalidate Strategy - Good for documents
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    mode: 'cors',
    credentials: 'same-origin',
    redirect: 'follow'
  })).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch((error) => {
    console.log('Stale while revalidate fetch failed:', error);
    return null;
  });
  
  return cachedResponse || fetchPromise;
}

// Helper functions
function isAppFile(pathname) {
  return pathname === '/' || 
         pathname.endsWith('.html') && !pathname.startsWith('/documents/') ||
         pathname.endsWith('.json') ||
         pathname.includes('/icons/');
}

function isDocumentFile(pathname) {
  return pathname.startsWith('/documents/') || 
         pathname.startsWith('/data/');
}

async function getOfflineFallback(request) {
  if (request.mode === 'navigate') {
    const cache = await caches.open(STATIC_CACHE);
    const cachedIndex = await cache.match('./index.html');
    if (cachedIndex) {
      return cachedIndex;
    }
  }
  
  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Offline - Margdarshak FAQ</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin: 0; padding: 40px; text-align: center; color: white; min-height: 100vh;
          display: flex; flex-direction: column; justify-content: center; align-items: center;
        }
        .offline-message {
          background: rgba(255,255,255,0.1); padding: 40px; border-radius: 15px;
          backdrop-filter: blur(10px); max-width: 500px;
        }
        .icon { font-size: 64px; margin-bottom: 20px; }
        h1 { margin: 0 0 20px 0; font-size: 2rem; }
        p { font-size: 1.1rem; line-height: 1.6; margin-bottom: 15px; }
        .retry-btn {
          background: #2c5aa0; color: white; border: none; padding: 12px 24px;
          border-radius: 8px; font-size: 1rem; cursor: pointer; margin-top: 20px;
        }
        .retry-btn:hover { background: #1e3a8a; }
      </style>
    </head>
    <body>
      <div class="offline-message">
        <div class="icon">📚</div>
        <h1>You're Offline</h1>
        <p>Margdarshak FAQ is not available right now. Please check your internet connection and try again.</p>
        <p><strong>Good news:</strong> Many documents are cached and available offline once you've visited them online.</p>
        <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
      </div>
    </body>
    </html>
  `, {
    status: 503,
    statusText: 'Service Unavailable',
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache'
    }
  });
}

// Background sync for offline actions (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  console.log('Background sync triggered - handling offline actions');
  // Future: Handle any offline actions when back online
}

// Push notification handling (future enhancement)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'New educational guidance available',
    icon: './icons/icon-192x192.png',
    badge: './icons/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: [
      { action: 'open', title: 'Open App', icon: './icons/action-open.png' },
      { action: 'dismiss', title: 'Dismiss', icon: './icons/action-dismiss.png' }
    ],
    tag: 'margdarshak-notification',
    requireInteraction: false
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Margdarshak FAQ', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || event.action === '') {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes('margdarshak') && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if app is not open
        if (clients.openWindow) {
          return clients.openWindow('./');
        }
      })
    );
  }
});

// Handle app updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Margdarshak FAQ PWA Service Worker loaded successfully');
