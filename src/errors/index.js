const AppError = require('./AppError');
const ERROR_CATALOG = require('./error-catalog');
const domainErrors = require('./domain-errors');

module.exports = {
  AppError,
  ERROR_CATALOG,
  ...domainErrors,
};
