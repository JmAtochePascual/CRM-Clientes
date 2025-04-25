const companyElement = document.querySelector('#empresa');
const emailElement = document.querySelector('#email');
const formElement = document.querySelector('#formulario');
const nameElement = document.querySelector('#nombre');
const phoneElement = document.querySelector('#telefono');
let DB;

const openConectionDB = () => {
  const conectionDB = indexedDB.open('clientes', 1);

  conectionDB.onerror = () => {
    console.log('Error al abrir la base de datos');
  };

  conectionDB.onsuccess = () => {
    DB = conectionDB.result;
  };
};

const startApp = (event) => {
  event.preventDefault();

  const client = {
    company: companyElement.value.trim(),
    email: emailElement.value.trim(),
    id: Date.now() + Math.random().toString(36).substring(2),
    name: nameElement.value.trim(),
    phone: phoneElement.value.trim(),
  };

  if (Object.values(client).includes('')) {
    showAlert('Error!', 'Todos los campos son obligatorios', false);
    return;
  };

  createClient(client);
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

const createClient = (cliente) => {
  const transaction = DB.transaction(['clientes'], 'readwrite')
  const objectStore = transaction.objectStore('clientes');
  objectStore.add(cliente);

  transaction.onerror = () => {
    showAlert('Error!', 'Hubo un error al agregar el cliente', false);
  };

  transaction.oncomplete = () => {
    formElement.reset();
    showAlert('Correcto!', 'El cliente se agregó correctamente', true);

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  };
};

document.addEventListener('DOMContentLoaded', () => {
  openConectionDB();
  formElement.addEventListener('submit', startApp);
});