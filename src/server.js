require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const logger = require('./config/logger.js');
const env = require('./config/env.config');
const app = require('./app');

// 1. Validación de variables críticas antes de iniciar cualquier cosa
const PORT = env.port || 3000;
if (!env.mongoUri) {
  console.error('[Error Crítico] Falta la variable de entorno obligatoria para la base de datos.');
  process.exit(1);
}

async function start() {
  try {
    await mongoose.connect(env.mongoUri);
    logger.info('Conexión a MongoDB establecida');
    
    app.listen(PORT, () => {
      logger.info(`Servidor ShipNow escuchando en el puerto ${PORT}`);
    });
  } catch (err) {
    logger.fatal(`No se pudo iniciar la aplicación: ${err.message}`);
    process.exit(1);
  }
}

start();