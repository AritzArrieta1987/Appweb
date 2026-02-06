// =====================================================
// routes/tracks.js - CRUD de Tracks/Catálogo
// =====================================================

const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/tracks - Obtener todos los tracks
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [tracks] = await pool.query(`
      SELECT 
        t.id,
        t.title,
        t.isrc,
        t.upc,
        t.total_revenue,
        t.total_streams,
        t.artist_id,
        a.name as artist_name,
        GROUP_CONCAT(DISTINCT p.name) as platforms
      FROM tracks t
      JOIN artists a ON t.artist_id = a.id
      LEFT JOIN royalties r ON t.id = r.track_id
      LEFT JOIN platforms p ON r.platform_id = p.id
      GROUP BY t.id, t.title, t.isrc, t.upc, t.total_revenue, t.total_streams, t.artist_id, a.name
      ORDER BY t.total_revenue DESC
    `);

    // Procesar platforms de string a array
    const formattedTracks = tracks.map(track => ({
      ...track,
      platforms: track.platforms ? track.platforms.split(',') : []
    }));

    res.json({
      success: true,
      data: formattedTracks
    });
  } catch (error) {
    console.error('Error obteniendo tracks:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo tracks'
    });
  }
});

// GET /api/tracks/:id - Obtener track específico
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [tracks] = await pool.query(`
      SELECT 
        t.*,
        a.name as artist_name,
        GROUP_CONCAT(DISTINCT p.name) as platforms
      FROM tracks t
      JOIN artists a ON t.artist_id = a.id
      LEFT JOIN royalties r ON t.id = r.track_id
      LEFT JOIN platforms p ON r.platform_id = p.id
      WHERE t.id = ?
      GROUP BY t.id
    `, [id]);

    if (tracks.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Track no encontrado'
      });
    }

    const track = tracks[0];
    track.platforms = track.platforms ? track.platforms.split(',') : [];

    res.json({
      success: true,
      data: track
    });
  } catch (error) {
    console.error('Error obteniendo track:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo track'
    });
  }
});

module.exports = router;
