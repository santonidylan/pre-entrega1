const Product = require('../models/product.model');

/**
 * Repository de Products.
 * Es el único módulo que importa/usa el modelo de Mongoose directamente.
 * No es un "pasamanos": encapsula proyecciones y filtros por defecto,
 * no solo hace `return Model.find()`.
 */
class ProductRepository {
  async getAll({ onlyAvailable = false } = {}) {
    const filter = {};
    if (onlyAvailable) {
      filter.stock = { $gt: 0 };
    }

    // Proyección: no exponemos campos internos innecesarios (__v).
    return Product.find(filter).select('-__v').lean();
  }

  async getById(id) {
    return Product.findById(id).select('-__v').lean();
  }

  async create(productData) {
    const product = new Product(productData);
    return product.save();
  }

  async update(id, updates) {
    return Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select('-__v');
  }

  async delete(id) {
    return Product.findByIdAndDelete(id);
  }
}

module.exports = new ProductRepository();
