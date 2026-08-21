const express = require('express');
const routes = require('./routes');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', routes);

// 404 para rutas no definidas
app.use((req, res) => {
  res.status(404).json({ message: 'Recurso no encontrado' });
});

// Middleware de manejo de errores centralizado.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Los errores de validación de Mongoose (campo requerido faltante,
  // valor fuera de rango, etc.) son errores del cliente, no del servidor.
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message || 'Error interno del servidor' });
});

module.exports = app;
