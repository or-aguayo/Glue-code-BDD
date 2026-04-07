const { Given, When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const assert = require('assert');

const BASE_URL = 'http://127.0.0.1:8000';

function tablaCampoValorAObjeto(dataTable) {
  const filas = dataTable.hashes();
  return filas.reduce((acc, fila) => {
    acc[fila.campo] = fila.valor;
    return acc;
  }, {});
}

Given('que existen los siguientes usuarios base', async function (dataTable) {
  const usuariosBase = dataTable.hashes();
  this.usuariosPorNombre = this.usuariosPorNombre || {};

  for (const usuario of usuariosBase) {
    const respuesta = await axios.post(`${BASE_URL}/usuarios`, usuario);
    this.usuariosPorNombre[respuesta.data.nombre] = respuesta.data;
  }
});

Given('que selecciono al usuario {string}', function (nombre) {
  assert.ok(this.usuariosPorNombre?.[nombre], `No se encontró el usuario base ${nombre}`);
  this.usuarioSeleccionado = this.usuariosPorNombre[nombre];
  this.usuarioId = this.usuarioSeleccionado.id;
});

Given('que no existe un usuario con id {int}', function (usuarioId) {
  this.usuarioIdInexistente = usuarioId;
});

When('creo los siguientes usuarios', async function (dataTable) {
  const usuarios = dataTable.hashes();
  this.respuestasLote = [];

  for (const usuario of usuarios) {
    const respuesta = await axios.post(`${BASE_URL}/usuarios`, usuario);
    this.respuestasLote.push(respuesta);
  }
});

When('actualizo el usuario seleccionado con los datos', async function (dataTable) {
  const payload = tablaCampoValorAObjeto(dataTable);
  this.respuesta = await axios.put(`${BASE_URL}/usuarios/${this.usuarioId}`, payload);
});

When('intento agregar la certificación {string} al usuario con id {int}', async function (certificacion, usuarioId) {
  try {
    await axios.post(`${BASE_URL}/usuarios/${usuarioId}/certificaciones`, { nombre: certificacion });
    assert.fail('Se esperaba error 404 y la operación fue exitosa');
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    this.errorHttp = error.response;
  }
});

When('intento actualizar el usuario con id {int} con los datos', async function (usuarioId, dataTable) {
  const payload = tablaCampoValorAObjeto(dataTable);

  try {
    await axios.put(`${BASE_URL}/usuarios/${usuarioId}`, payload);
    assert.fail('Se esperaba error 404 y la operación fue exitosa');
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    this.errorHttp = error.response;
  }
});

Then('todos los resultados son exitosos', function () {
  assert.ok(Array.isArray(this.respuestasLote) && this.respuestasLote.length > 0);
  this.respuestasLote.forEach((respuesta) => {
    assert.ok(respuesta.status >= 200 && respuesta.status < 300);
  });
});

Then('los usuarios creados incluyen', function (dataTable) {
  const esperados = dataTable.hashes().map((fila) => fila.nombre);
  const obtenidos = this.respuestasLote.map((respuesta) => respuesta.data.nombre);

  esperados.forEach((nombreEsperado) => {
    assert.ok(obtenidos.includes(nombreEsperado), `No se encontró ${nombreEsperado} en ${obtenidos}`);
  });
});

Then('el usuario seleccionado tiene los datos', function (dataTable) {
  const esperado = tablaCampoValorAObjeto(dataTable);

  Object.entries(esperado).forEach(([campo, valor]) => {
    assert.strictEqual(String(this.respuesta.data[campo]), valor);
  });
});

Then('el servicio responde con código {int}', function (statusCode) {
  assert.ok(this.errorHttp, 'No se capturó error HTTP');
  assert.strictEqual(this.errorHttp.status, statusCode);
});

Then('el error contiene {string}', function (mensajeEsperado) {
  assert.ok(this.errorHttp?.data?.detail, 'No hay detalle de error para validar');
  assert.ok(this.errorHttp.data.detail.includes(mensajeEsperado));
});
