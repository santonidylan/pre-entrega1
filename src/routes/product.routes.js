const { Router } = require('express');
const productController = require('../controllers/product.controller');

const router = Router();

// Las rutas quedan mínimas: solo conectan el path con el método del Controller.
router.get('/', productController.list);
router.get('/:id', productController.getById);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.remove);

module.exports = router;
