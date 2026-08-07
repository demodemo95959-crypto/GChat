// Ghost Chat — Service Worker (push notifications)

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle incoming push messages
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'Ghost Chat', body: event.data ? event.data.text() : 'New message' };
  }

  const title = data.title || 'Ghost Chat';
  const options = {
    body: data.body || 'You have a new message',
    icon: data.icon || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext y=".9em" font-size="90"%3E%F0%9F%91%BB%3C/text%3E%3C/svg%3E',
    badge: data.badge || undefined,
    data: data.url || '/',
    vibrate: [100, 50, 100],
    tag: data.tag || 'ghost-chat-message',
    renotify: true
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click — focus or open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
