const { Router } = require('express');
const mockController = require('../controllers/mock.controller');

const router = Router();

// GET  /api/mocks/:collection?qty=N   -> datos simulados, sin guardar
// POST /api/mocks/seed/:collection?qty=N -> inserta datos simulados en MongoDB
router.post('/seed/:collection', mockController.seed);
router.get('/:collection', mockController.preview);

module.exports = router;
