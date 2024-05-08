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

};

document.addEventListener('DOMContentLoaded', () => {
  formularioElement.addEventListener('submit', init);
});