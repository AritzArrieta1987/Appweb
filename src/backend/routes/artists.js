// =====================================================
// routes/artists.js - CRUD de Artistas
// =====================================================

const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/artists - Obtener todos los artistas
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [artists] = await pool.query(`
      SELECT 
        a.id,
        a.name,
        a.email,
        a.phone,
        a.photo_url,
        a.total_revenue,
        a.total_streams,
        COUNT(DISTINCT t.id) as track_count
      FROM artists a
      LEFT JOIN tracks t ON a.id = t.artist_id
      GROUP BY a.id, a.name, a.email, a.phone, a.photo_url, a.total_revenue, a.total_streams
      ORDER BY a.total_revenue DESC
    `);

    res.json({
      success: true,
      data: artists
    });
  } catch (error) {
    console.error('Error obteniendo artistas:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo artistas'
    });
  }
});

// GET /api/artists/:id - Obtener artista específico
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [artists] = await pool.query(`
      SELECT 
        a.*,
        COUNT(DISTINCT t.id) as track_count
      FROM artists a
      LEFT JOIN tracks t ON a.id = t.artist_id
      WHERE a.id = ?
      GROUP BY a.id
    `, [id]);

    if (artists.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Artista no encontrado'
      });
    }

    res.json({
      success: true,
      data: artists[0]
    });
  } catch (error) {
    console.error('Error obteniendo artista:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo artista'
    });
  }
});

// POST /api/artists - Crear nuevo artista
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, photo_url } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del artista es requerido'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO artists (name, email, phone, photo_url) VALUES (?, ?, ?, ?)',
      [name, email || null, phone || null, photo_url || null]
    );

    res.json({
      success: true,
      data: {
        id: result.insertId,
        name,
        email,
        phone,
        photo_url
      }
    });
  } catch (error) {
    console.error('Error creando artista:', error);
    res.status(500).json({
      success: false,
      message: 'Error creando artista'
    });
  }
});

// PUT /api/artists/:id - Actualizar artista
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, photo_url } = req.body;

    await pool.query(
      'UPDATE artists SET name = ?, email = ?, phone = ?, photo_url = ? WHERE id = ?',
      [name, email || null, phone || null, photo_url || null, id]
    );

    res.json({
      success: true,
      message: 'Artista actualizado'
    });
  } catch (error) {
    console.error('Error actualizando artista:', error);
    res.status(500).json({
      success: false,
      message: 'Error actualizando artista'
    });
  }
});

// DELETE /api/artists/:id - Eliminar artista
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM artists WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Artista eliminado'
    });
  } catch (error) {
    console.error('Error eliminando artista:', error);
    res.status(500).json({
      success: false,
      message: 'Error eliminando artista'
    });
  }
});

module.exports = router;
