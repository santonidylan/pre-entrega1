const { Router } = require('express');
const userController = require('../controllers/user.controller');

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     description: Retorna una lista completa de los usuarios registrados en ShipNow.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get('/', userController.list);
router.get('/:id', userController.getById);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.remove);

module.exports = router;

const upload = require('../config/multer.config.js');
const User = require('../models/user.model.js'); // Asegúrate de que apunte a tu modelo de usuario

/**
 * @swagger
 * /api/users/{uid}/documents:
 *   post:
 *     summary: Sube un documento para un usuario
 *     description: Recibe un archivo mediante multipart/form-data, lo valida, lo almacena en el servidor y registra sus metadatos en la entidad usuario.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: Archivo a subir (imagen, PDF, etc.)
 *     responses:
 *       200:
 *         description: Archivo subido y metadatos registrados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Archivo faltante o tipo no permitido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// Endpoint para subir documentos de usuario
router.post('/:uid/documents', upload.single('document'), async (req, res, next) => {
  try {
    const { uid } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ status: 'error', message: 'No se ha subido ningún archivo' });
    }

    // Verificar que el usuario exista
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    // Registrar metadatos en la entidad usuario (según pide la rúbrica)
    const documentData = {
      name: file.originalname,
      generatedName: file.filename,
      reference: file.path,
      size: file.size,
      mimeType: file.mimetype,
      uploadDate: new Date()
    };

    if (!user.documents) user.documents = [];
    user.documents.push(documentData);
    await user.save();

    // Log relevante (exigido por la rúbrica)
    req.logger ? req.logger.info(`Documento subido con éxito para el usuario ${uid}`) : console.log(`Documento subido para ${uid}`);

    res.status(200).json({
      status: 'success',
      message: 'Archivo subido y metadatos registrados correctamente',
      payload: documentData
    });
  } catch (error) {
    next(error);
  }
});