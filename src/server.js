const mongoose = require('mongoose');
const env = require('./config/env.config');
const app = require('./app');

async function start() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log('[db] Conectado a MongoDB');

    app.listen(env.port, () => {
      console.log(`[server] ShipNow API corriendo en http://localhost:${env.port} (${env.nodeEnv})`);
    });
  } catch (err) {
    console.error('[server] No se pudo iniciar la aplicación:', err.message);
    process.exit(1);
  }
}

start();
