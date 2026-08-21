const productRepository = require('../repositories/product.repository');
const { PRODUCT_STATUS } = require('../constants');

/**
 * Service de Products: acá vive la lógica de negocio.
 * Llama al Repository, nunca a Mongoose directamente.
 */
class ProductService {
  async listProducts({ onlyAvailable = false } = {}) {
    const products = await productRepository.getAll({ onlyAvailable });

    // Ejemplo de lógica de negocio: derivar el status según el stock
    // antes de devolver la lista, en lugar de confiar ciegamente en la DB.
    return products.map((product) => ({
      ...product,
      status: product.stock > 0 ? product.status : PRODUCT_STATUS.OUT_OF_STOCK,
    }));
  }

  async getProduct(id) {
    const product = await productRepository.getById(id);
    if (!product) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  async createProduct(data) {
    if (data.price < 0) {
      const error = new Error('El precio no puede ser negativo');
      error.statusCode = 400;
      throw error;
    }
    return productRepository.create(data);
  }

  async updateProduct(id, updates) {
    const product = await productRepository.update(id, updates);
    if (!product) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  async deleteProduct(id) {
    const deleted = await productRepository.delete(id);
    if (!deleted) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }
    return deleted;
  }
}

module.exports = new ProductService();
