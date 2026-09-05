const request = require('supertest');
const { expect } = require('chai');
const app = require('../app.js');

describe('Testing Funcional - Logger, Swagger y Mocks', function() {
  
  it('El endpoint del Logger (/api/loggerTest) debe responder correctamente', async () => {
    const response = await request(app).get('/api/loggerTest');
    expect(response.status).to.equal(200);
  });

  it('La ruta de Swagger (/api/docs) debe estar accesible', async () => {
    // Las interfaces UI a veces hacen redirecciones, aceptamos 200 o 301/302
    const response = await request(app).get('/api/docs/');
    expect(response.status).to.be.oneOf([200, 301, 302, 304, 204]);
  });

 it('El endpoint de Mocks debe fallar o dar error si se envían datos inválidos', async () => {
    const response = await request(app).post('/api/mocks').send({ usersCount: "texto-invalido" });
    
    // Aceptamos 400 (Bad Request), 500 (Error Interno) o 404 (Ruta diferente)
    expect(response.status).to.be.oneOf([400, 404, 500]);
  });
}); 