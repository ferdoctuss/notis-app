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
            guardarAlertaEnHistorial(title, body, fechaStr)
        ])
    );
});

function guardarAlertaEnHistorial(title, body, fecha) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('NotisAppDB', 1);

        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('historial')) {
                db.createObjectStore('historial', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = function(event) {
            const db = event.target.result;
            
            if (!db.objectStoreNames.contains('historial')) {
                db.close(); // LIBERAR MEMORIA
                resolve();
                return;
            }
            
            const transaction = db.transaction('historial', 'readwrite');
            const store = transaction.objectStore('historial');
            
            store.add({
                title: title,
                body: body,
                fecha: fecha
            });

            transaction.oncomplete = function() {
                db.close(); // LIBERAR MEMORIA TRAS GUARDAR
                resolve();
            };
            
            transaction.onerror = function() {
                db.close(); // LIBERAR MEMORIA SI HAY ERROR
                reject();
            };
        };

        request.onerror = function() {
            reject();
        };
    });
}

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(clients.openWindow('/'));
});
