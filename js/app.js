const clientListeElement = document.querySelector('#listado-clientes');
const actionsElement = document.querySelector('#acciones');
let DB;

const createDataBase = () => {
  const request = indexedDB.open('clientes', 1);

  request.onupgradeneeded = (event) => {
    DB = event.target.result;

    const objectStore = DB.createObjectStore('clientes', {
      keyPath: 'id',
      autoIncrement: true
    });

    objectStore.createIndex('name', 'name', { unique: false });
    objectStore.createIndex('email', 'email', { unique: true });
    objectStore.createIndex('phone', 'phone', { unique: false });
    objectStore.createIndex('company', 'company', { unique: false });
    objectStore.createIndex('id', 'id', { unique: true });
  };

  request.onsuccess = () => {
    DB = request.result;
    showClients();
  };

  request.onerror = () => {
    console.log('Error al abrir la base de datos');
  };
};

const showClients = () => {
  cleanHtml();

  const objectStore = DB.transaction('clientes').objectStore('clientes');

  objectStore.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;

    if (cursor) {
      const { name, email, phone, company, id } = cursor.value;

      const clientElement = document.createElement('tr');
      clientElement.innerHTML = ` 
      <tr>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${name} </p>
              <p class="text-sm leading-10 text-gray-700"> ${email} </p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
              <p class="text-gray-700">${phone}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
              <p class="text-gray-600">${company}</p>
          </td>
          <td id="acciones" class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
              <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
              <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900">Eliminar</a>
          </td>
      </tr>  `;

      clientListeElement.appendChild(clientElement);
      cursor.continue();

    } else {
      if (!clientListeElement.firstChild) {
        clientListeElement.innerHTML = `
          <tr>
            <td colspan="5" class="border text-center py-4">No hay clientes</td>
          </tr>
        `;
      }
    }
  };
};

const cleanHtml = () => {
  while (clientListeElement.firstChild) {
    clientListeElement.removeChild(clientListeElement.firstChild);
  };
};

const deleteClient = (event) => {
  if (event.target.classList.contains('text-red-600')) {
    const clientID = event.target.dataset.cliente;

    const transaction = DB.transaction(['clientes'], 'readwrite');
    const objectStore = transaction.objectStore('clientes');

    objectStore.delete(clientID);

    transaction.oncomplete = () => {
      showClients();
    };

    transaction.onerror = () => {
      console.log('Hubo un error al eliminar el cliente');
    };
  };
};

document.addEventListener('DOMContentLoaded', () => {
  createDataBase();
  clientListeElement.addEventListener('click', deleteClient);
});