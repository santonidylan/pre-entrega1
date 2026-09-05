const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShipNow API',
      version: '1.0.0',
      description: 'API para la gestión de envíos, usuarios y pedidos de ShipNow.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
    ],
    tags: [
      { name: 'Users', description: 'Endpoints de usuarios' },
      { name: 'Orders', description: 'Endpoints de pedidos' },
      { name: 'Deliveries', description: 'Endpoints de entregas' },
      { name: 'Mocks', description: 'Generación de datos de prueba' },
      { name: 'Logger', description: 'Herramienta de validación de logs' }
    ],
    components: {
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Descripción detallada del error' }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string', example: 'Operación realizada con éxito' },
            payload: { type: 'object' }
          }
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '60b9b0b9e3b9c800158b4b1a' },
            first_name: { type: 'string', example: 'Juan' },
            last_name: { type: 'string', example: 'Perez' },
            email: { type: 'string', example: 'juan@correo.com' },
            role: { type: 'string', example: 'user' }
          }
        }, // <-- Esta era la coma que faltaba
        OrderItem: {
          type: 'object',
          properties: {
            productId: { type: 'string', example: '60b9b0b9e3b9c800158b4b1c' },
            quantity: { type: 'integer', example: 2 }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '60b9b0b9e3b9c800158b4b1b' },
            userId: { type: 'string', example: '60b9b0b9e3b9c800158b4b1a' },
            items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
            status: { type: 'string', example: 'pending' }
          }
        },
        Delivery: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '60b9b0b9e3b9c800158b4b1d' },
            orderId: { type: 'string', example: '60b9b0b9e3b9c800158b4b1b' },
            status: { type: 'string', example: 'in_transit' }
          }
        }
      }
    }
  },
  // Le indicamos a Swagger dónde leer los comentarios de la documentación
  apis: ['./src/routes/*.js'], 
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = swaggerDocs;