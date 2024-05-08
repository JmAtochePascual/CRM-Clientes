let db;

const crearBaseDeDatos = () => {

  // Crear base de datos
  const request = indexedDB.open('clientes', 1);

  // Crear el esquema de la base de datos
  request.onupgradeneeded = () => {
    db = request.result;

    const objectStore = db.createObjectStore('clientes', {
      keyPath: 'id',
      autoIncrement: true
    });

    objectStore.createIndex('nombre', 'nombre', { unique: false });
    objectStore.createIndex('email', 'email', { unique: true });
    objectStore.createIndex('telefono', 'telefono', { unique: false });
    objectStore.createIndex('empresa', 'empresa', { unique: false });
  };

  // Si la base de datos se abrió correctamente
  request.onsuccess = () => {
    db = request.result;
    // console.log('Base de datos creada correctamente');
  };

  // Si la base de datos no se abrió correctamente
  request.onerror = () => {
    // console.log('Error al abrir la base de datos');
  };
};

document.addEventListener('DOMContentLoaded', () => {
  crearBaseDeDatos();
});