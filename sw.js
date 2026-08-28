self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Nueva Notificación';
    const body = data.body || 'Tienes un mensaje personalizado.';

    const options = {
        body: body,
        icon: 'icono.png',
        badge: 'icono.png'
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});
