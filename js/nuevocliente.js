import { DB } from "./app.js";

// Selectores
const formularioElement = document.querySelector('#formulario');
const nombreElement = document.querySelector('#nombre');
const emailElement = document.querySelector('#email');
const telefonoElement = document.querySelector('#telefono');
const empresaElement = document.querySelector('#empresa');


const init = (event) => {
  event.preventDefault();

  const cliente = {
    nombre: nombreElement.value.trim(),
    email: emailElement.value.trim(),
    telefono: telefonoElement.value.trim(),
    empresa: empresaElement.value.trim(),
    id: Date.now() + Math.random().toString(36).substring(2)
  };


  if (validarCliente(cliente)) {
    mostarAlerta('Error!', 'Todos los campos son obligatorios', false);
    return;
  }

  // Agregar cliente a la base de datos
  agregarClienteIndexDB(cliente);
  console.log('cliente agregado');
};

// Validar el formulario
const validarCliente = (cliente) => Object.values(cliente).includes('') ? true : false;


// Mostrar alerta en pantalla
const mostarAlerta = (tipoMensaje, mensaje, tipo = true) => {
  const alerta = document.querySelector('.alerta');

  if (!alerta) {
    const alertaElement = document.createElement('p');

    alertaElement.innerHTML = ` 
    <strong class="font-bold">${tipoMensaje}</strong>  <span class="block sm:inline">${mensaje}</span>`;
    alertaElement.classList.add('alerta', 'text-center', 'mt-4', 'p-3', 'rounded', 'max-w-md', 'mx-auto');

    tipo
      ? alertaElement.classList.add('text-green-700', 'bg-green-100', 'border-green-400')
      : alertaElement.classList.add('text-red-700', 'bg-red-100', 'border-red-400');

    formularioElement.appendChild(alertaElement);

    setTimeout(() => {
      alertaElement.remove();
    }, 3000);
  }
};

// Agregar cliente a la base de datos
const agregarClienteIndexDB = (cliente) => {

  const transacción = DB.db.transaction(['clientes'], 'readwrite')
  const objectStore = transacción.objectStore('clientes');
  objectStore.add(cliente);

  transacción.onerror = () => {
    mostarAlerta('Error!', 'Hubo un error al agregar el cliente', false);
  };

  transacción.oncomplete = () => {
    formularioElement.reset();
    mostarAlerta('Correcto!', 'El cliente se agregó correctamente', true);

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  };
};

document.addEventListener('DOMContentLoaded', () => {
  formularioElement.addEventListener('submit', init);
});