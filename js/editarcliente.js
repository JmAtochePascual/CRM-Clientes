const formularioElement = document.querySelector('#formulario');
const nombreElement = document.querySelector('#nombre');
const emailElement = document.querySelector('#email');
const telefonoElement = document.querySelector('#telefono');
const empresaElement = document.querySelector('#empresa');

let DB;


// Abrir conexión con la base de datos
const abrirConexionIndexDB = () => {
  const abrirConexion = indexedDB.open('clientes', 1);

  abrirConexion.onerror = () => {
    // console.log('Error al abrir la base de datos');
  };

  abrirConexion.onsuccess = () => {
    // console.log('Base de datos abierta');
    DB = abrirConexion.result;
    obtenerCliente();
  }
};

// Obtener cliente de la base de datos por su id
const obtenerCliente = () => {
  // Obtener el id de la url
  const parametrosURL = new URLSearchParams(window.location.search);
  const idCliente = parametrosURL.get('id');

  const objectStore = DB.transaction('clientes').objectStore('clientes');
  objectStore.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;

    if (cursor) {
      if (cursor.value.id === idCliente) {
        const { nombre, email, telefono, empresa } = cursor.value;

        nombreElement.value = nombre;
        emailElement.value = email;
        telefonoElement.value = telefono;
        empresaElement.value = empresa;
      }
      cursor.continue();
    }
  };
};


document.addEventListener('DOMContentLoaded', () => {
  abrirConexionIndexDB();

  // formularioElement.addEventListener('submit', actualizarCliente);
});

