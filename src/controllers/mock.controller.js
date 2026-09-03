const mockService = require('../services/mock.service');

/**
 * Controller de mocking. Única puerta de entrada HTTP para esta
 * funcionalidad: traduce req/res, no conoce Mongoose ni reglas de negocio.
 */
class MockController {
  async preview(req, res, next) {
    try {
      const { collection } = req.params;
      const data = await mockService.generatePreview(collection, req.query.qty);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  async seed(req, res, next) {
    try {
      const { collection } = req.params;
      const result = await mockService.seedCollection(collection, req.query.qty);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MockController();
