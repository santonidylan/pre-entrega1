const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../app.js');

describe('Testing Funcional - Módulo Users', function() {
  this.timeout(10000);

  before(async () => {
    await mongoose.connect('mongodb://localhost:27017/shipnow_test');
    try {
      await mongoose.connection.collections.users.drop();
    } catch (error) {}
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it('El endpoint GET /api/users debe devolver un status 200 y un arreglo', async () => {
    const response = await request(app).get('/api/users');
    
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array'); 
  });

  it('El endpoint GET /api/users/:id con un ID inválido debe devolver un error', async () => {
    const fakeId = '123456789012345678901234'; 
    const response = await request(app).get(`/api/users/${fakeId}`);
    
    expect(response.status).to.be.oneOf([400, 404, 500]);
    expect(response.body).to.have.property('status', 'error');
  });
});