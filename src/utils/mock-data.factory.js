const { faker } = require('@faker-js/faker');
const { ORDER_STATUS, ORDER_PRIORITY, DELIVERY_STATUS } = require('../constants');

/**
 * Factory de datos simulados. Solo construye objetos planos en base a
 * faker + las constantes del dominio. No conoce Mongoose ni hace queries:
 * eso es responsabilidad del Repository. No decide relaciones de negocio
 * (qué usuario le corresponde a qué pedido): eso es responsabilidad del
 * Service, que es quien le pasa los IDs u objetos ya resueltos.
 */

function randomEnumValue(enumObject) {
  const values = Object.values(enumObject);
  return values[faker.number.int({ min: 0, max: values.length - 1 })];
}

function buildFakeUser(role) {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password({ length: 10 }),
    role,
  };
}

function buildFakeOrderItems() {
  const itemCount = faker.number.int({ min: 1, max: 3 });
  return Array.from({ length: itemCount }, () => ({
    name: faker.commerce.productName(),
    quantity: faker.number.int({ min: 1, max: 5 }),
    price: Number(faker.commerce.price({ min: 5, max: 200 })),
  }));
}

/**
 * Arma un pedido simulado.
 * - Si recibe `customerId`, lo usa como referencia real (para seeding).
 * - Si recibe `customer`, lo embebe como objeto (para previews sin guardar,
 *   así se ve la relación pedido ↔ usuario aunque no exista en la base).
 */
function buildFakeOrder({ customer, customerId } = {}) {
  const items = buildFakeOrderItems();
  const total = Number(
    items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
  );

  const base = {
    items,
    total,
    status: randomEnumValue(ORDER_STATUS),
    priority: randomEnumValue(ORDER_PRIORITY),
  };

  return customerId ? { ...base, customer: customerId } : { ...base, customer };
}

/**
 * Arma una entrega simulada.
 * - Si recibe `orderId`/`courierId`, los usa como referencias reales (seeding).
 * - Si recibe `order`/`courier`, los embebe como objetos (preview).
 */
function buildFakeDelivery({ order, orderId, courier, courierId } = {}) {
  const base = {
    status: randomEnumValue(DELIVERY_STATUS),
    estimatedDeliveryDate: faker.date.soon({ days: 7 }),
  };

  if (orderId && courierId) {
    return { ...base, order: orderId, courier: courierId };
  }
  return { ...base, order, courier };
}

module.exports = {
  buildFakeUser,
  buildFakeOrder,
  buildFakeDelivery,
};
