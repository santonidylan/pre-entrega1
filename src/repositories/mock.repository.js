const User = require('../models/user.model');
const Order = require('../models/order.model');
const Delivery = require('../models/delivery.model');

/**
 * Repository de mocking. Único lugar que conoce Mongoose para esta
 * funcionalidad: inserciones masivas y las búsquedas necesarias para
 * poder resolver relaciones reales al momento de sembrar datos.
 */
class MockRepository {
  async insertUsers(docs) {
    if (docs.length === 0) return [];
    return User.insertMany(docs);
  }

  async insertOrders(docs) {
    if (docs.length === 0) return [];
    return Order.insertMany(docs);
  }

  async insertDeliveries(docs) {
    if (docs.length === 0) return [];
    return Delivery.insertMany(docs);
  }

  async findUsersByRole(role, limit) {
    return User.find({ role }).limit(limit).select('_id name email role');
  }

  async findOrders(limit) {
    return Order.find().limit(limit).select('_id customer status priority');
  }
}

module.exports = new MockRepository();
