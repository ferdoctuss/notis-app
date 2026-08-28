// Nombre de la base de datos local para el historial
const DB_NAME = 'NotisAppDB';
const STORE_NAME = 'historial';

function guardarEnHistorial(titulo, cuerpo) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            
            const nuevaNotificacion = {
                title: titulo,
                body: cuerpo,
                fecha: new Date().toLocaleString() // Guarda la fecha y hora exacta
            };

            store.add(nuevaNotificacion);
            transaction.oncomplete = () => resolve();
            transaction.onerror = (err) => reject(err);
        };

        request.onerror = (err) => reject(err);
    });
}

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
        Promise.all([
            self.registration.showNotification(title, options),
            guardarEnHistorial(title, body)
        ])
    );
});
