self.addEventListener('push', function(event) {
    if (!event.data) return;

    const data = event.data.json();
    const title = data.title || 'ALERTA MTTO MAQUINARIA';
    const body = data.body || 'Nueva notificación recibida';
    
    const ahora = new Date();
    const fechaStr = ahora.toLocaleDateString() + ' ' + ahora.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    const options = {
        body: body,
        icon: 'icono.png',
        badge: 'icono.png'
    };

    event.waitUntil(
        Promise.all([
            self.registration.showNotification(title, options),
            guardarEnCache(title, body, fechaStr)
        ])
    );
});

// Usamos CacheStorage en lugar de IndexedDB para evitar bloqueos en iOS
async function guardarEnCache(title, body, fecha) {
    try {
        const cache = await caches.open('consorcio-vial-historial-v1');
        const timestamp = Date.now();
        const payload = JSON.stringify({ title, body, fecha, timestamp });
        await cache.put('/alerta-' + timestamp, new Response(payload, {
            headers: { 'Content-Type': 'application/json' }
        }));
    } catch (err) {
        console.error('Error guardando en caché:', err);
    }
}

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(clients.openWindow('/'));
});
