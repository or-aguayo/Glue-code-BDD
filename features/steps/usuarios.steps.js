const { Given, When, Then, BeforeAll, AfterAll } = require('@cucumber/cucumber');
const axios = require('axios');
const assert = require('assert');
const { spawn } = require('child_process');

let servidor;

BeforeAll(function() {
  servidor = spawn('uvicorn', ['app.main:app', '--port', '8000']);
  return new Promise(resolve => setTimeout(resolve, 1000));
});

AfterAll(function() {
  servidor.kill();
});

When('creo un usuario con nombre {string} y correo {string}', async function (nombre, correo) {
  this.respuesta = await axios.post('http://localhost:8000/usuarios', { nombre, correo });
  this.usuarioId = this.respuesta.data.id;
});

Given('que existe un usuario con nombre {string} y correo {string}', async function (nombre, correo) {
  const res = await axios.post('http://localhost:8000/usuarios', { nombre, correo });
  this.usuarioId = res.data.id;
  this.respuesta = res;
});

When('actualizo el usuario a nombre {string}', async function (nuevoNombre) {
  this.respuesta = await axios.put(`http://localhost:8000/usuarios/${this.usuarioId}`, { nombre: nuevoNombre });
});

When('agrego la certificación {string} al usuario', async function (certificacion) {
  this.respuesta = await axios.post(`http://localhost:8000/usuarios/${this.usuarioId}/certificaciones`, { nombre: certificacion });
});

Then('el resultado es exitoso', function () {
  assert.ok(this.respuesta.status >= 200 && this.respuesta.status < 300);
});

Then('el usuario creado tiene el nombre {string}', function (nombre) {
  assert.strictEqual(this.respuesta.data.nombre, nombre);
});

Then('el usuario modificado tiene nombre {string}', function (nombre) {
  assert.strictEqual(this.respuesta.data.nombre, nombre);
});

Then('el usuario tiene la certificación {string}', function (certificacion) {
  assert.ok(this.respuesta.data.certificaciones.includes(certificacion));
});
