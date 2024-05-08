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
    empresa: empresaElement.value.trim()
  };

  if (validarCliente(cliente)) {
    mostarAlerta('Error!', 'Todos los campos son obligatorios', false);
    return;
  }
  console.log('Todos los campos son correctos');
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
    alertaElement.classList.add('alerta', 'text-center', 'mt-4', 'p-3', 'rounded', 'max-w-md', 'mx-auto', 'text-green-700');

    tipo
      ? alertaElement.classList.add('bg-green-100', 'border-green-400')
      : alertaElement.classList.add('bg-red-100', 'border-red-400');

    formularioElement.appendChild(alertaElement);

    setTimeout(() => {
      alertaElement.remove();
    }, 3000);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  formularioElement.addEventListener('submit', init);
});