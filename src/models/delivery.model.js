const mongoose = require('mongoose');
const { DELIVERY_STATUS } = require('../constants');

// El modelo solo define el esquema. Ninguna lógica de negocio ni de
// controlador vive acá: eso pertenece a Service y Controller.
const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    courier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(DELIVERY_STATUS),
      default: DELIVERY_STATUS.ASSIGNED,
    },
    estimatedDeliveryDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Delivery', deliverySchema);
