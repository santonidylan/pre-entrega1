const AppError = require('../errors/AppError');
const ERROR_CATALOG = require('../errors/error-catalog');

/**
 * Middleware global de manejo de errores. Es el ÚNICO lugar de todo el
 * proyecto que arma la respuesta HTTP de un error: los services detectan
 * y lanzan errores (con `throw`), los controllers solo los propagan con
 * `next(err)`, y acá se decide qué status code y qué cuerpo JSON
 * devolver. Ninguna ruta ni controller responde un error por su cuenta.
 *
 * Estructura de respuesta uniforme para TODOS los errores:
 * {
 *   "error": {
 *     "code": "USER_NOT_FOUND",
 *     "message": "El usuario solicitado no existe.",
 *     "details": ... (opcional, solo si el error lo trae)
 *   }
 * }
 */
// eslint-disable-next-line no-unused-vars
function errorHandlerMiddleware(err, req, res, next) {
  // 1. Errores de dominio: ya vienen con code/statusCode/message resueltos.
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details !== undefined ? { details: err.details } : {}),
      },
    });
  }

  // 2. Errores de validación de esquema de Mongoose (campo requerido
  //    faltante, valor fuera del enum, etc.) que no pasaron por un
  //    error de dominio propio.
  if (err.name === 'ValidationError' && err.errors) {
    const entry = ERROR_CATALOG.VALIDATION_ERROR;
    return res.status(entry.statusCode).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: entry.message,
        details: Object.values(err.errors).map((e) => e.message),
      },
    });
  }

  // 3. Un ObjectId con formato inválido (ej. /api/users/abc123).
  if (err.name === 'CastError') {
    const entry = ERROR_CATALOG.INVALID_ID;
    return res.status(entry.statusCode).json({
      error: {
        code: 'INVALID_ID',
        message: `El identificador "${err.value}" no tiene un formato válido.`,
      },
    });
  }

  // 4. Cualquier otro error no controlado. Se loguea internamente para
  //    debug, pero nunca se expone el detalle interno al cliente.
  console.error('[error-handler] Error no controlado:', err);
  const entry = ERROR_CATALOG.INTERNAL_ERROR;
  return res.status(entry.statusCode).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: entry.message,
    },
  });
}

module.exports = errorHandlerMiddleware;
