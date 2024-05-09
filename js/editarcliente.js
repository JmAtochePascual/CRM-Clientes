
const formularioElement = document.querySelector('#formulario');
const nombreElement = document.querySelector('#nombre');
const emailElement = document.querySelector('#email');
const telefonoElement = document.querySelector('#telefono');
const empresaElement = document.querySelector('#empresa');

// Obtener el id de la url
const parametrosURL = new URLSearchParams(window.location.search);
const idCliente = parametrosURL.get('id');
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

// Validar el formulario
const init = (event) => {
  event.preventDefault();

  const clienteActualizado = {
    nombre: nombreElement.value.trim(),
    email: emailElement.value.trim(),
    telefono: telefonoElement.value.trim(),
    empresa: empresaElement.value.trim(),
    id: idCliente
  };

  if (validarCliente(clienteActualizado)) {
    mostarAlerta('Error!', 'Todos los campos son obligatorios', false);
    return;
  }

  formularioElement.reset();

  // Actualizar cliente en la base de datos
  actualizarCliente(clienteActualizado);
};

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

// Actualiza un clieente en la base de datos
const actualizarCliente = (cliente) => {
  const transaction = DB.transaction(['clientes'], 'readwrite');
  const objectStore = transaction.objectStore('clientes');

  objectStore.put(cliente);

  transaction.oncomplete = () => {
    mostarAlerta('Correcto!', 'El cliente se actualizó correctamente', true);
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 3000);
  };

  transaction.onerror = () => {
    mostarAlerta('Error!', 'Hubo un error al actualizar el cliente', false);
  };
};


document.addEventListener('DOMContentLoaded', () => {
  abrirConexionIndexDB();
  formularioElement.addEventListener('submit', init);
});

