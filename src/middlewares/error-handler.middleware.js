const logger = require('../config/logger.js');

const errorHandler = (err, req, res, next) => {
    if (err.isOperational) {
        logger.warning(`Advertencia: ${err.message}`);
        return res.status(err.statusCode || 400).json({ status: 'error', message: err.message });
    }

    logger.error(`Error inesperado: ${err.message}`);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
};

module.exports = errorHandler;