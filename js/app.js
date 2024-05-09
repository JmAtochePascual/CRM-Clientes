const ListadoClientesElement = document.querySelector('#listado-clientes');

let DB;

// Crear la base de datos
const crearBaseDeDatos = () => {

  // Crear base de datos
  const request = indexedDB.open('clientes', 1);

  // Crear el esquema de la base de datos
  request.onupgradeneeded = (event) => {
    DB = event.target.result;

    const objectStore = DB.createObjectStore('clientes', {
      keyPath: 'id',
      autoIncrement: true
    });

    objectStore.createIndex('nombre', 'nombre', { unique: false });
    objectStore.createIndex('email', 'email', { unique: true });
    objectStore.createIndex('telefono', 'telefono', { unique: false });
    objectStore.createIndex('empresa', 'empresa', { unique: false });
    objectStore.createIndex('id', 'id', { unique: true });

  };

  // Si la base de datos se abrió correctamente
  request.onsuccess = () => {
    DB = request.result;
    mostrarClientes();
    // console.log('Base de datos creada correctamente');
  };

  // Si la base de datos no se abrió correctamente
  request.onerror = () => {
    // console.log('Error al abrir la base de datos');
  };
};

// Muestra los clientes de la base de datos en el HTML
const mostrarClientes = () => {

  // Limpiar los clientes anteriores
  while (ListadoClientesElement.firstChild) {
    ListadoClientesElement.removeChild(ListadoClientesElement.firstChild);
  }

  const objectStore = DB.transaction('clientes').objectStore('clientes');

  objectStore.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;

    if (cursor) {
      const { nombre, email, telefono, empresa, id } = cursor.value;

      const clienteElement = document.createElement('tr');
      clienteElement.innerHTML = ` 
      <tr>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
              <p class="text-sm leading-10 text-gray-700"> ${email} </p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
              <p class="text-gray-700">${telefono}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
              <p class="text-gray-600">${empresa}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
              <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
              <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900">Eliminar</a>
          </td>
      </tr>  `;

      ListadoClientesElement.appendChild(clienteElement);
      cursor.continue();

    } else {
      if (!ListadoClientesElement.firstChild) {
        ListadoClientesElement.innerHTML = `
          <tr>
            <td colspan="5" class="border text-center py-4">No hay clientes</td>
          </tr>
        `;
      }
    }
  };
};


document.addEventListener('DOMContentLoaded', () => {
  crearBaseDeDatos();
});