const { Router } = require('express');
const productController = require('../controllers/product.controller');

const router = Router();

// Las rutas quedan mínimas: solo conectan el path con el método del Controller.
router.get('/', productController.list);
router.get('/:id', productController.getById);
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crea un nuevo pedido
 *     description: Genera un pedido a partir de los items seleccionados por el usuario.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Estado inválido en el pedido o datos incompletos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.remove);

module.exports = router;
