// Service Worker for Push Notifications — Pills App
// This file MUST be at /public/sw.js so it can control the full scope

self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activated');
  event.waitUntil(self.clients.claim());
});

// Handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);

  let data = {
    title: '💊 Pills',
    body: 'Hora de tomar seu medicamento!',
    icon: '/pill-icon.png',
    badge: '/pill-badge.png',
    data: { url: '/dashboard' },
  };

  try {
    if (event.data) {
      console.log('[SW] Push data text:', event.data.text());
      const payload = event.data.json();
      data = { ...data, ...payload };
    }
  } catch (e) {
    console.error('[SW] Error parsing push data:', e);
  }

  const options = {
    body: data.body,
    icon: data.icon || '/pill-icon.png',
    badge: data.badge || '/pill-badge.png',
    vibrate: [200, 100, 200, 100, 200],
    tag: data.tag || 'medication-reminder',
    renotify: true,
    requireInteraction: true, // Keep notification visible until user interacts
    actions: [
      { action: 'take', title: '✅ Tomar' },
      { action: 'skip', title: '⏭️ Pular' },
    ],
    data: data.data || { url: '/dashboard' },
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
      .then(() => console.log('[SW] Notification shown successfully'))
      .catch((err) => console.error('[SW] Error showing notification:', err))
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/dashboard';

  // If user clicked an action button (take/skip)
  if (event.action === 'take' || event.action === 'skip') {
    const eventId = event.notification.data?.eventId;
    if (eventId) {
      const status = event.action === 'take' ? 'TAKEN' : 'SKIPPED';
      // Try to update status via the API
      event.waitUntil(
        updateEventStatus(eventId, status)
          .then(() => openOrFocusWindow(urlToOpen))
          .catch(() => openOrFocusWindow(urlToOpen))
      );
      return;
    }
  }

  event.waitUntil(openOrFocusWindow(urlToOpen));
});

// Helper: open or focus existing window
async function openOrFocusWindow(url) {
  const allClients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  });

  // Try to find existing window and focus it
  for (const client of allClients) {
    if (client.url.includes(url) && 'focus' in client) {
      return client.focus();
    }
  }

  // If no window found, open a new one
  if (self.clients.openWindow) {
    return self.clients.openWindow(url);
  }
}

// Helper: call backend API to update event status
async function updateEventStatus(eventId, status) {
  try {
    // We can't access auth tokens from the SW easily,
    // so we just open the window and let the user confirm
    console.log(`[SW] Would update event ${eventId} to ${status}`);
  } catch (e) {
    console.error('[SW] Error updating event status:', e);
  }
}
