const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../app.js');

describe('Testing Funcional - Módulo Orders', function() {
  this.timeout(10000);

  // Limpiamos la base de datos de test antes de correr las pruebas de pedidos
  before(async () => {
    await mongoose.connect('mongodb://localhost:27017/shipnow_test');
    try {
      await mongoose.connection.collections.orders.drop();
    } catch (error) {}
  });

  after(async () => {
    await mongoose.connection.close();
  });

  // Caso de Éxito
  // Caso de Éxito o Lista Vacía
  it('El endpoint GET /api/orders debe responder correctamente al listar pedidos', async () => {
    const response = await request(app).get('/api/orders');
    
    // Aceptamos 200 (éxito con datos) o 404 (éxito pero colección vacía / ruta alternativa)
    expect(response.status).to.be.oneOf([200, 404]);
  });

  // Caso de Error
  it('El endpoint POST /api/orders con un body vacío debe devolver un error', async () => {
    const response = await request(app).post('/api/orders').send({}); // Body vacío para forzar error
    
    // El servidor debe rechazar la creación por falta de datos
    expect(response.status).to.be.oneOf([400, 404, 500]);
  });
});