/**
 * Diccionario de errores del dominio.
 *
 * Cada código de error tiene un statusCode HTTP y un mensaje por defecto
 * asociados. Las clases de error personalizadas (ver domain-errors.js) se
 * apoyan acá en vez de tener statusCodes/mensajes escritos a mano en cada
 * lugar del código donde se lanza un error. Object.freeze evita que se
 * mute por accidente, siguiendo el mismo criterio que src/constants.
 */
const ERROR_CATALOG = Object.freeze({
  // Usuarios
  USER_NOT_FOUND: { statusCode: 404, message: 'El usuario solicitado no existe.' },
  EMAIL_ALREADY_IN_USE: { statusCode: 409, message: 'Ya existe un usuario registrado con ese email.' },
  INVALID_ROLE: { statusCode: 400, message: 'El rol indicado no es válido.' },

  // Productos
  PRODUCT_NOT_FOUND: { statusCode: 404, message: 'El producto solicitado no existe.' },
  INVALID_PRICE: { statusCode: 400, message: 'El precio no puede ser negativo.' },

  // Pedidos
  ORDER_NOT_FOUND: { statusCode: 404, message: 'El pedido solicitado no existe.' },
  INVALID_ORDER_STATUS: { statusCode: 400, message: 'El estado de pedido indicado no es válido.' },

  // Mocking
  INVALID_MOCK_COLLECTION: { statusCode: 400, message: 'La colección de mocks indicada no es válida.' },
  INVALID_MOCK_QTY: { statusCode: 400, message: 'La cantidad (qty) indicada no es válida.' },
  MOCK_SEED_FAILED: {
    statusCode: 502,
    message: 'No se pudo completar la carga de datos de prueba en la base de datos.',
  },

  // Genéricos / transversales
  VALIDATION_ERROR: { statusCode: 400, message: 'Los datos enviados no son válidos.' },
  INVALID_ID: { statusCode: 400, message: 'El identificador indicado no tiene un formato válido.' },
  NOT_FOUND_ROUTE: { statusCode: 404, message: 'El recurso solicitado no existe.' },
  INTERNAL_ERROR: { statusCode: 500, message: 'Ocurrió un error interno inesperado.' },
});

module.exports = ERROR_CATALOG;
