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
    console.log('Todos los campos son obligatorios', 'error');
    return;
  }
  console.log('Todos los campos son correctos');
};

// Validar el formulario
const validarCliente = (cliente) => Object.values(cliente).includes('') ? true : false;

document.addEventListener('DOMContentLoaded', () => {
  formularioElement.addEventListener('submit', init);
});