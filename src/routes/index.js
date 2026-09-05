const loggerRoutes = require('./logger.routes.js');
const { Router } = require('express');
const productRoutes = require('./product.routes');
const userRoutes = require('./user.routes');
const mockRoutes = require('./mock.routes');

const router = Router();

router.use('/products', productRoutes);
router.use('/users', userRoutes);
router.use('/mocks', mockRoutes);
router.use('/loggerTest', loggerRoutes);

module.exports = router;
