const dotenv = require('dotenv');

dotenv.config();

/**
 * Único punto de acceso a las variables de entorno.
 * Ningún otro archivo del proyecto debería leer `process.env` directamente:
 * todos importan este módulo y usan el objeto ya validado.
 */

// Variables sin las cuales la aplicación no puede funcionar de forma segura.
const REQUIRED_VARS = ['PORT', 'MONGODB_URI', 'NODE_ENV'];

function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    // Error descriptivo: decimos exactamente qué falta y dónde se soluciona.
    throw new Error(
      `[config] Faltan variables de entorno obligatorias: ${missing.join(', ')}. ` +
        'Revisá tu archivo .env (podés basarte en .env.example).'
    );
  }
}

validateEnv();

const env = Object.freeze({
  port: Number(process.env.PORT),
  mongoUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV,
  isProduction: process.env.NODE_ENV === 'production',
});

module.exports = env;
