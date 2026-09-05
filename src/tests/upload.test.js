const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../app.js');

describe('Testing Funcional - Carga de Archivos (Multer)', function() {
  this.timeout(10000);

  before(async () => {
    await mongoose.connect('mongodb://localhost:27017/shipnow_test');
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it('Debe devolver un error si se intenta subir un documento sin adjuntar archivo', async () => {
    const fakeId = '60b9b0b9e3b9c800158b4b1a';
    const response = await request(app)
      .post(`/api/users/${fakeId}/documents`); // Sin enviar el campo 'document'

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('status', 'error');
  });

 it('Debe devolver un error si el usuario no existe al intentar subir un archivo', async () => {
    const nonExistentId = '123456789012345678901234';
    const response = await request(app)
      .post(`/api/users/${nonExistentId}/documents`)
      .attach('document', Buffer.from('fake file content'), 'test.txt');

    // Aceptamos 404 (recurso no encontrado) o 500 (manejador global de errores)
    expect(response.status).to.be.oneOf([404, 500]);
    expect(response.body).to.have.property('status', 'error');
  });
});