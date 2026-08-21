const productService = require('../services/product.service');

/**
 * Controller de Products: única puerta de entrada HTTP.
 * Solo gestiona req/res y códigos de estado. Nunca importa Mongoose
 * ni conoce detalles de la base de datos.
 */
class ProductController {
  async list(req, res, next) {
    try {
      const onlyAvailable = req.query.onlyAvailable === 'true';
      const products = await productService.listProducts({ onlyAvailable });
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const product = await productService.getProduct(req.params.id);
      res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      await productService.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProductController();
