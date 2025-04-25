const companyElement = document.querySelector('#empresa');
const emailElement = document.querySelector('#email');
const formElement = document.querySelector('#formulario');
const nameElement = document.querySelector('#nombre');
const phoneElement = document.querySelector('#telefono');

const parameterURL = new URLSearchParams(window.location.search);
const clientID = parameterURL.get('id');
let DB;

const openConectionDB = () => {
  const conectionDB = indexedDB.open('clientes', 1);

  conectionDB.onerror = () => {
    console.log('Error al abrir la base de datos');
  };

  conectionDB.onsuccess = () => {
    DB = conectionDB.result;
    getClient();
  };
};

const getClient = () => {
  const objectStore = DB.transaction('clientes').objectStore('clientes');
  objectStore.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;

    if (cursor) {
      if (cursor.value.id === clientID) {
        const { name, email, phone, company } = cursor.value;

        companyElement.value = company;
        emailElement.value = email;
        nameElement.value = name;
        phoneElement.value = phone;
      }
      cursor.continue();
    };
  };
};

const startApp = (event) => {
  event.preventDefault();

  const clientUpdated = {
    company: companyElement.value.trim(),
    email: emailElement.value.trim(),
    id: clientID,
    name: nameElement.value.trim(),
    phone: phoneElement.value.trim(),
  };

  if (Object.values(clientUpdated).includes('')) {
    return;
  };

  formElement.reset();

  updateClient(clientUpdated);
};

const showAlert = (typeMessage, message, type = true) => {
  const hasAlert = document.querySelector('.alerta');

  if (hasAlert) return;

  const alertElement = document.createElement('p');

  alertElement.innerHTML = ` 
    <strong class="font-bold">${typeMessage}</strong>  <span class="block sm:inline">${message}</span>`;
  alertElement.classList.add('alerta', 'text-center', 'mt-4', 'p-3', 'rounded', 'max-w-md', 'mx-auto');

  type
    ? alertElement.classList.add('text-green-700', 'bg-green-100', 'border-green-400')
    : alertElement.classList.add('text-red-700', 'bg-red-100', 'border-red-400');

  formElement.appendChild(alertElement);

  setTimeout(() => {
    alertElement.remove();
  }, 3000);
};

const updateClient = (cliente) => {
  const transaction = DB.transaction(['clientes'], 'readwrite');
  const objectStore = transaction.objectStore('clientes');

  objectStore.put(cliente);

  transaction.oncomplete = () => {
    showAlert('Correcto!', 'El cliente se actualizó correctamente', true);
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 3000);
  };

  transaction.onerror = () => {
    showAlert('Error!', 'Hubo un error al actualizar el cliente', false);
  };
};

document.addEventListener('DOMContentLoaded', () => {
  openConectionDB();
  formElement.addEventListener('submit', startApp);
});