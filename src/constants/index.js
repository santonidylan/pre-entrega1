/**
 * Diccionario de constantes del dominio.
 * Se usan Object.freeze para evitar mutaciones accidentales y
 * para no tener "strings mágicos" repartidos por el código.
 */

const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  USER: 'USER',
  REPARTIDOR: 'REPARTIDOR',
});

const PRODUCT_STATUS = Object.freeze({
  AVAILABLE: 'AVAILABLE',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  DISCONTINUED: 'DISCONTINUED',
});

const ORDER_STATUS = Object.freeze({
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
});

const ORDER_PRIORITY = Object.freeze({
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
});

const DELIVERY_STATUS = Object.freeze({
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
});

// Nombres lógicos de "colección" que acepta el módulo de mocking.
// No son necesariamente colecciones físicas distintas (los repartidores
// viven en la misma colección de Users), sino la entidad de negocio
// que el cliente de la API le está pidiendo mockear.
const MOCK_COLLECTIONS = Object.freeze({
  USUARIOS: 'usuarios',
  REPARTIDORES: 'repartidores',
  PEDIDOS: 'pedidos',
  ENTREGAS: 'entregas',
});

module.exports = {
  ROLES,
  PRODUCT_STATUS,
  ORDER_STATUS,
  ORDER_PRIORITY,
  DELIVERY_STATUS,
  MOCK_COLLECTIONS,
};