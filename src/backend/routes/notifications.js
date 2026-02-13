// =====================================================
// routes/notifications.js - Gestión de Notificaciones
// =====================================================

const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/notifications - Obtener todas las notificaciones del usuario
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [notifications] = await pool.query(`
      SELECT 
        id,
        user_id,
        title,
        message,
        type,
        is_read,
        created_at
      FROM notifications
      WHERE user_id = ? OR user_id IS NULL
      ORDER BY created_at DESC
      LIMIT 50
    `, [userId]);

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo notificaciones'
    });
  }
});

// POST /api/notifications - Crear nueva notificación
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { user_id, title, message, type } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Título y mensaje son requeridos'
      });
    }

    const [result] = await pool.query(`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (?, ?, ?, ?)
    `, [user_id || null, title, message, type || 'info']);

    res.json({
      success: true,
      message: 'Notificación creada',
      data: {
        id: result.insertId
      }
    });
  } catch (error) {
    console.error('Error creando notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error creando notificación'
    });
  }
});

// PUT /api/notifications/:id/read - Marcar notificación como leída
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await pool.query(`
      UPDATE notifications
      SET is_read = TRUE
      WHERE id = ? AND user_id = ?
    `, [id, userId]);

    res.json({
      success: true,
      message: 'Notificación marcada como leída'
    });
  } catch (error) {
    console.error('Error actualizando notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error actualizando notificación'
    });
  }
});

// PUT /api/notifications/read-all - Marcar todas como leídas
router.put('/read-all', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.query(`
      UPDATE notifications
      SET is_read = TRUE
      WHERE user_id = ? AND is_read = FALSE
    `, [userId]);

    res.json({
      success: true,
      message: 'Todas las notificaciones marcadas como leídas'
    });
  } catch (error) {
    console.error('Error actualizando notificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error actualizando notificaciones'
    });
  }
});

// DELETE /api/notifications/:id - Eliminar notificación
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await pool.query(`
      DELETE FROM notifications
      WHERE id = ? AND user_id = ?
    `, [id, userId]);

    res.json({
      success: true,
      message: 'Notificación eliminada'
    });
  } catch (error) {
    console.error('Error eliminando notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error eliminando notificación'
    });
  }
});

module.exports = router;
