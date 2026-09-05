const logger = require('./config/logger.js');
const mongoose = require('mongoose');
const env = require('./config/env.config');
const app = require('./app');

// Nos aseguramos de que PORT tenga un valor por defecto si no viene del .env
const PORT = env.port || 3000;

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