const mockRepository = require('../repositories/mock.repository');
const { buildFakeUser, buildFakeOrder, buildFakeDelivery } = require('../utils/mock-data.factory');
const { ROLES, MOCK_COLLECTIONS } = require('../constants');

const DEFAULT_QTY = 5;
const MAX_QTY = 100;

function parseQty(qty) {
  const parsed = Number(qty ?? DEFAULT_QTY);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    const error = new Error('El parámetro qty debe ser un número entero positivo');
    error.statusCode = 400;
    throw error;
  }

  if (parsed > MAX_QTY) {
    const error = new Error(`El parámetro qty no puede ser mayor a ${MAX_QTY}`);
    error.statusCode = 400;
    throw error;
  }

  return parsed;
}

function assertValidCollection(collection) {
  if (!Object.values(MOCK_COLLECTIONS).includes(collection)) {
    const error = new Error(
      `Colección de mock inválida "${collection}". Valores permitidos: ${Object.values(
        MOCK_COLLECTIONS
      ).join(', ')}`
    );
    error.statusCode = 400;
    throw error;
  }
}

class MockService {
  /**
   * Genera datos simulados de la colección pedida SIN guardarlos en la base.
   */
  async generatePreview(collection, qty) {
    assertValidCollection(collection);
    const n = parseQty(qty);

    switch (collection) {
      case MOCK_COLLECTIONS.USUARIOS:
        return Array.from({ length: n }, () => buildFakeUser(ROLES.USER));

      case MOCK_COLLECTIONS.REPARTIDORES:
        return Array.from({ length: n }, () => buildFakeUser(ROLES.REPARTIDOR));

      case MOCK_COLLECTIONS.PEDIDOS:
        // El customer se embebe como objeto (no como ref) porque en preview
        // no hay ningún documento real en la base todavía.
        return Array.from({ length: n }, () =>
          buildFakeOrder({ customer: buildFakeUser(ROLES.USER) })
        );

      case MOCK_COLLECTIONS.ENTREGAS:
        return Array.from({ length: n }, () =>
          buildFakeDelivery({
            order: buildFakeOrder({ customer: buildFakeUser(ROLES.USER) }),
            courier: buildFakeUser(ROLES.REPARTIDOR),
          })
        );

      /* istanbul ignore next: cubierto por assertValidCollection */
      default:
        return [];
    }
  }

  /**
   * Inserta datos simulados reales en MongoDB, resolviendo relaciones
   * con documentos ya existentes (o creándolos si hace falta).
   */
  async seedCollection(collection, qty) {
    assertValidCollection(collection);
    const n = parseQty(qty);

    switch (collection) {
      case MOCK_COLLECTIONS.USUARIOS:
        return this._seedUsersByRole(ROLES.USER, n, MOCK_COLLECTIONS.USUARIOS);

      case MOCK_COLLECTIONS.REPARTIDORES:
        return this._seedUsersByRole(ROLES.REPARTIDOR, n, MOCK_COLLECTIONS.REPARTIDORES);

      case MOCK_COLLECTIONS.PEDIDOS:
        return this._seedOrders(n);

      case MOCK_COLLECTIONS.ENTREGAS:
        return this._seedDeliveries(n);

      /* istanbul ignore next: cubierto por assertValidCollection */
      default:
        return { insertados: 0, coleccion: collection };
    }
  }

  async _seedUsersByRole(role, qty, collectionName) {
    const docs = Array.from({ length: qty }, () => buildFakeUser(role));
    const inserted = await mockRepository.insertUsers(docs);
    return { insertados: inserted.length, coleccion: collectionName };
  }

  async _seedOrders(qty) {
    const customers = await this._ensureUsersByRole(ROLES.USER, qty);
    const docs = Array.from({ length: qty }, (_, i) =>
      buildFakeOrder({ customerId: customers[i % customers.length]._id })
    );
    const inserted = await mockRepository.insertOrders(docs);
    return { insertados: inserted.length, coleccion: MOCK_COLLECTIONS.PEDIDOS };
  }

  async _seedDeliveries(qty) {
    const couriers = await this._ensureUsersByRole(ROLES.REPARTIDOR, qty);
    const orders = await this._ensureOrders(qty);

    const docs = Array.from({ length: qty }, (_, i) =>
      buildFakeDelivery({
        orderId: orders[i % orders.length]._id,
        courierId: couriers[i % couriers.length]._id,
      })
    );
    const inserted = await mockRepository.insertDeliveries(docs);
    return { insertados: inserted.length, coleccion: MOCK_COLLECTIONS.ENTREGAS };
  }

  /**
   * Devuelve al menos `minAmount` usuarios con el rol pedido, creando los
   * que falten. Así "pedidos" y "entregas" siempre pueden apoyarse en
   * usuarios/repartidores reales, aunque la base esté vacía.
   */
  async _ensureUsersByRole(role, minAmount) {
    const existing = await mockRepository.findUsersByRole(role, minAmount);
    if (existing.length >= minAmount) return existing;

    const missing = minAmount - existing.length;
    const newDocs = Array.from({ length: missing }, () => buildFakeUser(role));
    const created = await mockRepository.insertUsers(newDocs);
    return [...existing, ...created];
  }

  /**
   * Igual que _ensureUsersByRole, pero para pedidos: si faltan, los crea
   * (y de paso asegura los clientes que esos pedidos nuevos necesitan).
   */
  async _ensureOrders(minAmount) {
    const existing = await mockRepository.findOrders(minAmount);
    if (existing.length >= minAmount) return existing;

    const missing = minAmount - existing.length;
    const customers = await this._ensureUsersByRole(ROLES.USER, missing);
    const newDocs = Array.from({ length: missing }, (_, i) =>
      buildFakeOrder({ customerId: customers[i % customers.length]._id })
    );
    const created = await mockRepository.insertOrders(newDocs);
    return [...existing, ...created];
  }
}

module.exports = new MockService();
