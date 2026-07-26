// sw.js — GhostChat Service Worker (handles push notifications)

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = { title: 'GhostChat', body: 'New message', url: '/' };
  try {
    if (event.data) data = event.data.json();
  } catch (e) {
    if (event.data) data.body = event.data.text();
  }

  const options = {
    body: data.body || 'New message',
    icon: data.icon || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 64 76\'%3E%3Cpath d=\'M32 2 C14 2 4 16 4 34 L4 66 C6 63 9 58 12 58 C16 58 18 66 22 66 C26 66 28 58 32 58 C36 58 38 66 42 66 C46 66 48 58 52 58 C55 58 58 63 60 66 L60 34 C60 16 50 2 32 2 Z\' fill=\'%237c3aed\'/%3E%3C/svg%3E',
    badge: data.badge || undefined,
    tag: data.tag || 'ghostchat-msg',
    renotify: true,
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' }
  };

  event.waitUntil(self.registration.showNotification(data.title || 'GhostChat', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
