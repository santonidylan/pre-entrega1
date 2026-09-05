const { Router } = require('express');
const logger = require('../config/logger.js'); 

const router = Router();

/**
 * @swagger
 * /api/loggerTest:
 *   get:
 *     summary: Prueba los distintos niveles del logger
 *     description: Herramienta interna de validación para comprobar que los niveles de log (debug, http, info, warning, error, fatal) se registren en consola y archivos. No es una funcionalidad de negocio.
 *     tags: [Logger]
 *     responses:
 *       200:
 *         description: Logs generados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logs generados. Revisa la consola y la carpeta logs/
 */

router.get('/', (req, res) => {
  logger.fatal('Prueba de log fatal: El sistema está a punto de caer.');
  logger.error('Prueba de log error: Hubo un fallo al procesar la petición.');
  logger.warning('Prueba de log warning: Cuidado, falta un repartidor asignado.');
  logger.info('Prueba de log info: Todo funciona correctamente.');
  logger.http('Prueba de log http: Petición GET recibida en /loggerTest.');
  logger.debug('Prueba de log debug: Objeto de prueba renderizado.');

  res.send({ message: 'Logs generados. Revisa la consola y la carpeta logs/' });
});

module.exports = router;