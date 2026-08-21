/**
 * Diccionario de constantes del dominio.
 * Se usan Object.freeze para evitar mutaciones accidentales y
 * para no tener "strings mágicos" repartidos por el código.
 */

const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  USER: 'USER',
});

const PRODUCT_STATUS = Object.freeze({
  AVAILABLE: 'AVAILABLE',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  DISCONTINUED: 'DISCONTINUED',
});

module.exports = {
  ROLES,
  PRODUCT_STATUS,
};
