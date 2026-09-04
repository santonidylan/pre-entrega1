const ERROR_CATALOG = require('./error-catalog');

/**
 * Error base del dominio. Todas las clases de error personalizadas
 * (ver domain-errors.js) extienden de acá.
 *
 * Se apoya en el diccionario ERROR_CATALOG para resolver statusCode y
 * mensaje por defecto a partir de un código, en vez de repetirlos cada
 * vez que se lanza un error. El middleware global de errores es el
 * único que lee `statusCode`/`code`/`details` para armar la respuesta:
 * ni el service ni el controller arman la respuesta HTTP directamente.
 */
class AppError extends Error {
  constructor(code, { message, details } = {}) {
    const entry = ERROR_CATALOG[code] || ERROR_CATALOG.INTERNAL_ERROR;
    super(message || entry.message);

    this.name = this.constructor.name;
    this.code = ERROR_CATALOG[code] ? code : 'INTERNAL_ERROR';
    this.statusCode = entry.statusCode;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
