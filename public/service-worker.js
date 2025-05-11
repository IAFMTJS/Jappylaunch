/* global workbox, self, caches, fetch, Promise, Response, Request, IndexedDB */

// Version control
const APP_VERSION = '1.0.0';
const CACHE_NAME = `japvoc-cache-v${APP_VERSION}`;
const DATA_CACHE_NAME = `japvoc-data-v${APP_VERSION}`;
const ROMAJI_DATA_URL = '/romaji-data.json';

// Cache configuration
const CACHE_CONFIG = {
  assets: {
    name: CACHE_NAME,
    urls: [
      '/',
      '/index.html',
      '/manifest.json',
      '/offline.html',
      '/static/js/main.chunk.js',
      '/static/js/0.chunk.js',
      '/static/js/bundle.js',
      '/static/css/main.chunk.css',
      // Icons
      '/icons/icon-72x72.png',
      '/icons/icon-96x96.png',
      '/icons/icon-128x128.png',
      '/icons/icon-144x144.png',
      '/icons/icon-152x152.png',
      '/icons/icon-192x192.png',
      '/icons/icon-384x384.png',
      '/icons/icon-512x512.png',
      // Shortcut icons
      '/icons/hiragana-96x96.png',
      '/icons/katakana-96x96.png',
      '/icons/kanji-96x96.png'
    ],
    strategy: 'cache-first'
  },
  data: {
    name: DATA_CACHE_NAME,
    urls: [ROMAJI_DATA_URL],
    strategy: 'stale-while-revalidate'
  }
};

// Sync configuration
const SYNC_CONFIG = {
  tags: {
    progress: 'sync-progress',
    romaji: 'sync-romaji-data'
  },
  retry: {
    maxAttempts: 3,
    backoff: {
      initial: 1000,
      multiplier: 2
    }
  }
};

// Install event - cache initial assets and data
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing version:', APP_VERSION);
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(CACHE_CONFIG.assets.name).then(cache => {
        console.log('[Service Worker] Caching static assets...');
        return cache.addAll(CACHE_CONFIG.assets.urls);
      }),
      
      // Cache initial data
      caches.open(CACHE_CONFIG.data.name).then(cache => {
        console.log('[Service Worker] Caching initial data...');
        return cache.addAll(CACHE_CONFIG.data.urls);
      })
    ]).then(() => {
      console.log('[Service Worker] Successfully cached all assets and data');
      // Skip waiting to activate immediately
      return self.skipWaiting();
    }).catch(error => {
      console.error('[Service Worker] Failed to cache assets:', error);
      throw error;
    })
  );
});

// Activate event - clean up old caches and take control
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating version:', APP_VERSION);
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!Object.values(CACHE_CONFIG).some(config => config.name === cacheName)) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ]).then(() => {
      console.log('[Service Worker] Activation complete');
      // Check for pending syncs
      return self.registration.sync.getTags().then(tags => {
        if (tags.includes(SYNC_CONFIG.tags.progress)) {
          return syncPendingProgress();
        }
      });
    })
  );
});

// Enhanced fetch handler with better caching strategies
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle different types of requests
  if (event.request.url.includes(ROMAJI_DATA_URL)) {
    event.respondWith(handleRomajiDataRequest(event.request));
  } else if (event.request.url.includes('/api/')) {
    event.respondWith(handleApiRequest(event.request));
  } else {
    event.respondWith(handleAssetRequest(event.request));
  }
});

// Handle romaji data requests with stale-while-revalidate strategy
async function handleRomajiDataRequest(request) {
  const cache = await caches.open(CACHE_CONFIG.data.name);
  
  try {
    // Try to serve from cache first
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      console.log('[Service Worker] Serving romaji data from cache');
      
      // Update cache in background
      fetch(request).then(async response => {
        if (response.ok) {
          await cache.put(request, response.clone());
          console.log('[Service Worker] Updated romaji data cache');
        }
      }).catch(error => {
        console.error('[Service Worker] Failed to update romaji data cache:', error);
      });
      
      return cachedResponse;
    }
    
    // If not in cache, fetch from network
    console.log('[Service Worker] Fetching romaji data from network');
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`Failed to fetch romaji data: ${response.status}`);
    }
    
    // Cache the response
    await cache.put(request, response.clone());
    return response;
  } catch (error) {
    console.error('[Service Worker] Error handling romaji data request:', error);
    throw error;
  }
}

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  try {
    // Try network first
    const response = await fetch(request);
    if (response.ok) {
      return response;
    }
    throw new Error(`API request failed: ${response.status}`);
  } catch (error) {
    console.error('[Service Worker] API request failed:', error);
    
    // If offline, try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If no cache, return offline response
    return new Response(
      JSON.stringify({ error: 'You are offline and no cached data is available' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle asset requests with cache-first strategy
async function handleAssetRequest(request) {
  const cache = await caches.open(CACHE_CONFIG.assets.name);
  
  try {
    // Try cache first
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If not in cache, fetch from network
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`Failed to fetch asset: ${response.status}`);
    }
    
    // Cache the response
    await cache.put(request, response.clone());
    return response;
  } catch (error) {
    console.error('[Service Worker] Error handling asset request:', error);
    
    // For HTML requests, return offline page
    if (request.headers.get('accept').includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

// Enhanced background sync with retry logic
self.addEventListener('sync', (event) => {
  if (event.tag === SYNC_CONFIG.tags.progress) {
    event.waitUntil(syncWithRetry(syncPendingProgress));
  } else if (event.tag === SYNC_CONFIG.tags.romaji) {
    event.waitUntil(syncWithRetry(syncRomajiData));
  }
});

// Retry logic for sync operations
async function syncWithRetry(syncFunction, attempt = 1) {
  try {
    await syncFunction();
  } catch (error) {
    console.error(`[Service Worker] Sync attempt ${attempt} failed:`, error);
    
    if (attempt < SYNC_CONFIG.retry.maxAttempts) {
      const backoff = SYNC_CONFIG.retry.backoff.initial * 
                     Math.pow(SYNC_CONFIG.retry.backoff.multiplier, attempt - 1);
      
      console.log(`[Service Worker] Retrying in ${backoff}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return syncWithRetry(syncFunction, attempt + 1);
    }
    
    // If all retries failed, schedule another sync
    console.log('[Service Worker] All retry attempts failed, scheduling new sync');
    await self.registration.sync.register(syncFunction.name === 'syncPendingProgress' 
      ? SYNC_CONFIG.tags.progress 
      : SYNC_CONFIG.tags.romaji);
  }
}

// Handle online/offline status changes
self.addEventListener('online', () => {
  console.log('[Service Worker] Online, checking for pending syncs...');
  self.registration.sync.getTags().then(tags => {
    if (!tags.includes(SYNC_CONFIG.tags.progress)) {
      return self.registration.sync.register(SYNC_CONFIG.tags.progress);
    }
  }).catch(error => {
    console.error('[Service Worker] Failed to register sync:', error);
  });
});

// Enhanced progress sync implementation
async function syncPendingProgress() {
  console.log('[Service Worker] Starting progress sync...');
  
  try {
    const db = await openIndexedDB();
    const tx = db.transaction('pending', 'readonly');
    const store = tx.objectStore('pending');
    const index = store.index('timestamp');
    const pending = await index.getAll();
    
    if (!pending || pending.length === 0) {
      console.log('[Service Worker] No pending progress to sync');
      return;
    }
    
    console.log('[Service Worker] Found', pending.length, 'pending progress items to sync');
    
    // Group progress by user ID for batch updates
    const progressByUser = pending.reduce((acc, item) => {
      if (!acc[item.userId]) {
        acc[item.userId] = [];
      }
      acc[item.userId].push(item);
      return acc;
    }, {});
    
    // Sync each user's progress
    for (const [userId, items] of Object.entries(progressByUser)) {
      try {
        const response = await fetch('/api/sync-progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': userId
          },
          body: JSON.stringify({
            userId,
            progress: items,
            version: APP_VERSION
          })
        });
        
        if (response.ok) {
          console.log('[Service Worker] Successfully synced progress for user:', userId);
          // Clear synced items from IndexedDB
          await clearSyncedProgress(db, items.map(item => item.id));
        } else {
          throw new Error(`Sync failed with status: ${response.status}`);
        }
      } catch (error) {
        console.error('[Service Worker] Error syncing progress for user:', userId, error);
        throw error; // Propagate error for retry
      }
    }
  } catch (error) {
    console.error('[Service Worker] Error in syncPendingProgress:', error);
    throw error;
  }
}

// Clear synced progress from IndexedDB
async function clearSyncedProgress(db, syncedIds) {
  const tx = db.transaction('pending', 'readwrite');
  const store = tx.objectStore('pending');
  
  await Promise.all(syncedIds.map(id => store.delete(id)));
  await new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Handle push notifications with enhanced options
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      version: APP_VERSION
    },
    actions: [
      {
        action: 'explore',
        title: 'Start Quiz',
        icon: '/icons/quiz-96x96.png'
      },
      {
        action: 'sync',
        title: 'Sync Progress',
        icon: '/icons/sync-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/close-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('JapVoc', options)
  );
});

// Enhanced notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/quiz')
    );
  } else if (event.action === 'sync') {
    event.waitUntil(
      self.registration.sync.register(SYNC_CONFIG.tags.progress)
    );
  }
});

// Enhanced IndexedDB implementation
async function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('JapVocDB', 2); // Increment version for schema update
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create or update pending progress store
      if (!db.objectStoreNames.contains('pending')) {
        const store = db.createObjectStore('pending', { keyPath: 'id', autoIncrement: true });
        // Add indexes for efficient querying
        store.createIndex('userId', 'userId', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('section', 'section', { unique: false });
      }
      
      // Create or update settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

async function syncRomajiData() {
  // Implementation of syncRomajiData function
} 