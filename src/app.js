const express = require('express');
const routes = require('./routes');
const notFoundMiddleware = require('./middlewares/not-found.middleware');
const errorHandlerMiddleware = require('./middlewares/error-handler.middleware');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', routes);

// A partir de acá, solo middlewares de error: ninguna ruta ni controller
// responde un error por su cuenta, todo se deriva a esta capa común.
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;