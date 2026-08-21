const mongoose = require('mongoose');
const { PRODUCT_STATUS } = require('../constants');

// El modelo solo define el esquema. Ninguna lógica de negocio ni de
// controlador vive acá: eso pertenece a Service y Controller.
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUS),
      default: PRODUCT_STATUS.AVAILABLE,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
