const { Given, When, Then, BeforeAll, AfterAll } = require('@cucumber/cucumber');
const axios = require('axios');
const assert = require('assert');
const { spawn } = require('child_process');

const BASE_URL = 'http://127.0.0.1:8000';
let servidor;

async function esperarServidorListo(maxIntentos = 25, pausaMs = 200) {
  for (let intento = 0; intento < maxIntentos; intento += 1) {
    try {
      await axios.get(`${BASE_URL}/openapi.json`);
      return;
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, pausaMs));
    }
  }

  throw new Error('No fue posible iniciar la API en http://127.0.0.1:8000');
}

BeforeAll(async function () {
  servidor = spawn('uvicorn', ['app.main:app', '--host', '0.0.0.0', '--port', '8000'], {
    stdio: 'ignore'
  });

  await esperarServidorListo();
});

AfterAll(function () {
  if (servidor) {
    servidor.kill();
  }
});

When('creo un usuario con nombre {string} y correo {string}', async function (nombre, correo) {
  this.respuesta = await axios.post(`${BASE_URL}/usuarios`, { nombre, correo });
  this.usuarioId = this.respuesta.data.id;
});

Given('que existe un usuario con nombre {string} y correo {string}', async function (nombre, correo) {
  const res = await axios.post(`${BASE_URL}/usuarios`, { nombre, correo });
  this.usuarioId = res.data.id;
  this.respuesta = res;
});

When('actualizo el usuario a nombre {string}', async function (nuevoNombre) {
  this.respuesta = await axios.put(`${BASE_URL}/usuarios/${this.usuarioId}`, { nombre: nuevoNombre });
});

When('agrego la certificación {string} al usuario', async function (certificacion) {
  this.respuesta = await axios.post(`${BASE_URL}/usuarios/${this.usuarioId}/certificaciones`, { nombre: certificacion });
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
