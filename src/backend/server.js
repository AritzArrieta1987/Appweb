// =====================================================
// server.js - Servidor principal Express
// =====================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Logger
const logger = require('./config/logger');

// Importar rutas
const authRoutes = require('./routes/auth');
const csvRoutes = require('./routes/csv');
const dashboardRoutes = require('./routes/dashboard');
const artistRoutes = require('./routes/artists');
const trackRoutes = require('./routes/tracks');
const notificationRoutes = require('./routes/notifications');
const contractRoutes = require('./routes/contracts');

const app = express();

// =====================================================
// MIDDLEWARES
// =====================================================

// Rate limiting - protección contra abuso
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Rate limiting más estricto para login
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos de login
  message: {
    success: false,
    message: 'Demasiados intentos de login. Por favor intenta de nuevo en 15 minutos.'
  },
  skipSuccessfulRequests: true, // No contar requests exitosos
});

// Rate limiting para uploads (más permisivo pero controlado)
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // máximo 20 uploads por hora
  message: {
    success: false,
    message: 'Demasiados archivos subidos. Por favor intenta de nuevo más tarde.'
  },
});

// Aplicar rate limiting a todas las rutas API
app.use('/api/', apiLimiter);

// CORS - Permitir peticiones desde el frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// =====================================================
// RUTAS API
// =====================================================

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/csv', uploadLimiter, csvRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contracts', contractRoutes);

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'BIGARTIST API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// =====================================================
// MANEJO DE ERRORES
// =====================================================

// 404 - Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// =====================================================
// INICIAR SERVIDOR
// =====================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🎵 BIGARTIST ROYALTIES API');
  console.log('='.repeat(50));
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log('='.repeat(50));
});

module.exports = app;