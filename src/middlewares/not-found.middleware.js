const ERROR_CATALOG = require('../errors/error-catalog');

/**
 * Middleware para cualquier ruta que no matchea ninguna definida.
 * Responde con el mismo formato uniforme que el resto de los errores,
 * en vez de un 404 con un cuerpo distinto al del resto de la API.
 */
function notFoundMiddleware(req, res) {
  const entry = ERROR_CATALOG.NOT_FOUND_ROUTE;
  res.status(entry.statusCode).json({
    error: {
      code: 'NOT_FOUND_ROUTE',
      message: entry.message,
    },
  });
}

module.exports = notFoundMiddleware;
