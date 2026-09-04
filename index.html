self.addEventListener('push', function(event) {
    if (!event.data) return;

    const data = event.data.json();
    const ahora = new Date();
    const fechaStr = ahora.toLocaleDateString() + ' ' + ahora.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    const alerta = {
        title: data.title || 'ALERTA MTTO MAQUINARIA',
        body: data.body || 'Nueva notificación',
        fecha: fechaStr
    };

    const options = {
        body: alerta.body,
        icon: 'icono.png',
        badge: 'icono.png'
    };

    event.waitUntil(
        Promise.all([
            // 1. Mostrar la notificación en el teléfono
            self.registration.showNotification(alerta.title, options),
            
            // 2. Guardar en la base de datos local y cerrar la conexión rápido
            guardarAlertaEnHistorial(alerta).then(() => {
                // 3. LA MAGIA: Avisarle directamente a la app abierta para que lo dibuje al instante
                return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
                    clients.forEach(client => {
                        client.postMessage({
                            tipo: 'NUEVA_ALERTA_EN_TIEMPO_REAL',
                            datos: alerta
                        });
                    });
                });
            })
        ])
    );
});

function guardarAlertaEnHistorial(alerta) {
    return new Promise((resolve) => {
        const request = indexedDB.open('NotisAppDB', 1);
        request.onupgradeneeded = function(e) {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('historial')) {
                db.createObjectStore('historial', { keyPath: 'id', autoIncrement: true });
            }
        };
        request.onsuccess = function(e) {
            const db = e.target.result;
            if (db.objectStoreNames.contains('historial')) {
                const tx = db.transaction('historial', 'readwrite');
                tx.objectStore('historial').add(alerta);
                tx.oncomplete = () => { db.close(); resolve(); };
                tx.onerror = () => { db.close(); resolve(); };
            } else {
                db.close(); resolve();
            }
        };
        request.onerror = () => resolve();
    });
}

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(clients.openWindow('/'));
});
