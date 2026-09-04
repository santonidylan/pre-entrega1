const mockRepository = require('../repositories/mock.repository');
const { buildFakeUser, buildFakeOrder, buildFakeDelivery } = require('../utils/mock-data.factory');
const { ROLES, MOCK_COLLECTIONS } = require('../constants');
const { InvalidMockCollectionError, InvalidMockQtyError, MockSeedError } = require('../errors');

const DEFAULT_QTY = 5;
const MAX_QTY = 100;

function parseQty(qty) {
  const parsed = Number(qty ?? DEFAULT_QTY);

  if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
    throw new InvalidMockQtyError({
      qty,
      motivo: 'El parámetro qty debe ser un número entero.',
    });
  }

  if (parsed <= 0) {
    throw new InvalidMockQtyError({
      qty,
      motivo: 'El parámetro qty debe ser un número positivo (no puede ser cero ni negativo).',
    });
  }

  if (parsed > MAX_QTY) {
    throw new InvalidMockQtyError({
      qty,
      motivo: `El parámetro qty no puede ser mayor a ${MAX_QTY}.`,
    });
  }

  return parsed;
}

function assertValidCollection(collection) {
  if (!Object.values(MOCK_COLLECTIONS).includes(collection)) {
    throw new InvalidMockCollectionError({
      coleccion: collection,
      valoresPermitidos: Object.values(MOCK_COLLECTIONS),
    });
  }
}

/**
 * Envuelve cualquier operación que toque MongoDB durante el seeding.
 * Si Mongoose/Mongo fallan (conexión caída, documento inválido que
 * se coló, etc.), la falla técnica se traduce acá a un error de
 * dominio (MockSeedError) en vez de dejar que un error crudo de
 * Mongoose se propague tal cual hasta el cliente.
 */
async function runSeedOperation(coleccion, operation) {
  try {
    return await operation();
  } catch (err) {
    throw new MockSeedError({
      coleccion,
      motivo: 'Falló la inserción de los datos de prueba en MongoDB.',
      causa: err.message,
    });
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
    const inserted = await runSeedOperation(collectionName, () => mockRepository.insertUsers(docs));
    return { insertados: inserted.length, coleccion: collectionName };
  }

  async _seedOrders(qty) {
    const customers = await this._ensureUsersByRole(ROLES.USER, qty);
    const docs = Array.from({ length: qty }, (_, i) =>
      buildFakeOrder({ customerId: customers[i % customers.length]._id })
    );
    const inserted = await runSeedOperation(MOCK_COLLECTIONS.PEDIDOS, () =>
      mockRepository.insertOrders(docs)
    );
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
    const inserted = await runSeedOperation(MOCK_COLLECTIONS.ENTREGAS, () =>
      mockRepository.insertDeliveries(docs)
    );
    return { insertados: inserted.length, coleccion: MOCK_COLLECTIONS.ENTREGAS };
  }

  /**
   * Devuelve al menos `minAmount` usuarios con el rol pedido, creando los
   * que falten. Así "pedidos" y "entregas" siempre pueden apoyarse en
   * usuarios/repartidores reales, aunque la base esté vacía.
   */
  async _ensureUsersByRole(role, minAmount) {
    const existing = await runSeedOperation('usuarios', () =>
      mockRepository.findUsersByRole(role, minAmount)
    );
    if (existing.length >= minAmount) return existing;

    const missing = minAmount - existing.length;
    const newDocs = Array.from({ length: missing }, () => buildFakeUser(role));
    const created = await runSeedOperation('usuarios', () => mockRepository.insertUsers(newDocs));
    return [...existing, ...created];
  }

  /**
   * Igual que _ensureUsersByRole, pero para pedidos: si faltan, los crea
   * (y de paso asegura los clientes que esos pedidos nuevos necesitan).
   */
  async _ensureOrders(minAmount) {
    const existing = await runSeedOperation('pedidos', () => mockRepository.findOrders(minAmount));
    if (existing.length >= minAmount) return existing;

    const missing = minAmount - existing.length;
    const customers = await this._ensureUsersByRole(ROLES.USER, missing);
    const newDocs = Array.from({ length: missing }, (_, i) =>
      buildFakeOrder({ customerId: customers[i % customers.length]._id })
    );
    const created = await runSeedOperation('pedidos', () => mockRepository.insertOrders(newDocs));
    return [...existing, ...created];
  }
}

module.exports = new MockService();