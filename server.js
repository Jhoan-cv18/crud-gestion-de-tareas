const express = require('express');
const path = require('path');
const tasksRoutes = require('./routes/tasks');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/tasks', tasksRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.path
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║  Servidor de Gestión de Tareas        ║
║  Ejecutándose en puerto ${PORT}             ║
║  URL: http://localhost:${PORT}         ║
╚═══════════════════════════════════════╝
  `);
});

module.exports = app;
