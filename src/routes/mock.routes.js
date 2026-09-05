const { Router } = require('express');
const mockController = require('../controllers/mock.controller');

const router = Router();

// GET  /api/mocks/:collection?qty=N   -> datos simulados, sin guardar
// POST /api/mocks/seed/:collection?qty=N -> inserta datos simulados en MongoDB

/**
 * @swagger
 * /api/mocks:
 *   post:
 *     summary: Genera datos de prueba (Mocks)
 *     description: Inserta usuarios y pedidos falsos en la base de datos para pruebas.
 *     tags: [Mocks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usersCount:
 *                 type: integer
 *                 example: 50
 *                 description: Cantidad de usuarios a generar.
 *     responses:
 *       201:
 *         description: Datos de prueba generados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Cantidad inválida enviada al endpoint
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.post('/seed/:collection', mockController.seed);
router.get('/:collection', mockController.preview);

module.exports = router;
