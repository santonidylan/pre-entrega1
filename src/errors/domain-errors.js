const AppError = require('./AppError');

/**
 * Errores personalizados del dominio. Cada uno representa un caso de
 * negocio concreto (no un statusCode genérico) y ya trae resuelto su
 * código/mensaje/statusCode desde el ERROR_CATALOG. Los services lanzan
 * estas clases en vez de un `new Error()` ad-hoc con un `statusCode`
 * pegado a mano.
 */

// --- Usuarios ---
class UserNotFoundError extends AppError {
  constructor(details) {
    super('USER_NOT_FOUND', { details });
  }
}

class EmailAlreadyInUseError extends AppError {
  constructor(details) {
    super('EMAIL_ALREADY_IN_USE', { details });
  }
}

class InvalidRoleError extends AppError {
  constructor(details) {
    super('INVALID_ROLE', { details });
  }
}

// --- Productos ---
class ProductNotFoundError extends AppError {
  constructor(details) {
    super('PRODUCT_NOT_FOUND', { details });
  }
}

class InvalidPriceError extends AppError {
  constructor(details) {
    super('INVALID_PRICE', { details });
  }
}

// --- Pedidos ---
class OrderNotFoundError extends AppError {
  constructor(details) {
    super('ORDER_NOT_FOUND', { details });
  }
}

class InvalidOrderStatusError extends AppError {
  constructor(details) {
    super('INVALID_ORDER_STATUS', { details });
  }
}

// --- Mocking ---
class InvalidMockCollectionError extends AppError {
  constructor(details) {
    super('INVALID_MOCK_COLLECTION', { details });
  }
}

class InvalidMockQtyError extends AppError {
  constructor(details) {
    super('INVALID_MOCK_QTY', { details });
  }
}

class MockSeedError extends AppError {
  constructor(details) {
    super('MOCK_SEED_FAILED', { details });
  }
}

module.exports = {
  UserNotFoundError,
  EmailAlreadyInUseError,
  InvalidRoleError,
  ProductNotFoundError,
  InvalidPriceError,
  OrderNotFoundError,
  InvalidOrderStatusError,
  InvalidMockCollectionError,
  InvalidMockQtyError,
  MockSeedError,
};
