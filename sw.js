self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Nueva Notificación';
    const options = {
        body: data.body || 'Tienes un mensaje personalizado.',
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});
