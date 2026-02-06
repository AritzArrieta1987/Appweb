// =====================================================
// routes/dashboard.js - Estadísticas del Dashboard
// =====================================================

const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/dashboard/stats - Obtener estadísticas generales
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    // 1. Totales generales
    const [totalsResult] = await pool.query(`
      SELECT 
        COALESCE(SUM(revenue), 0) as total_revenue,
        COALESCE(SUM(quantity), 0) as total_streams
      FROM royalties
    `);

    // 2. Conteo de artistas y tracks
    const [countsResult] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM artists) as artist_count,
        (SELECT COUNT(*) FROM tracks) as track_count
    `);

    // 3. Revenue por plataforma
    const [platformData] = await pool.query(`
      SELECT 
        p.name as platform_name,
        p.color,
        COALESCE(SUM(r.revenue), 0) as revenue,
        COALESCE(SUM(r.quantity), 0) as streams
      FROM platforms p
      LEFT JOIN royalties r ON p.id = r.platform_id
      GROUP BY p.id, p.name, p.color
      ORDER BY revenue DESC
    `);

    // Crear objeto platformBreakdown
    const platformBreakdown = {};
    platformData.forEach(platform => {
      platformBreakdown[platform.platform_name] = parseFloat(platform.revenue);
    });

    // 4. Datos mensuales (últimos 12 meses o todos los disponibles)
    const [monthlyData] = await pool.query(`
      SELECT 
        sale_month as month,
        COALESCE(SUM(revenue), 0) as revenue,
        COALESCE(SUM(quantity), 0) as streams,
        COUNT(DISTINCT track_id) as tracks
      FROM royalties
      WHERE sale_month IS NOT NULL AND sale_month != ''
      GROUP BY sale_month
      ORDER BY 
        CASE 
          WHEN sale_month LIKE 'October%' THEN 1
          WHEN sale_month LIKE 'Octubre%' THEN 1
          WHEN sale_month LIKE 'November%' THEN 2
          WHEN sale_month LIKE 'Noviembre%' THEN 2
          WHEN sale_month LIKE 'December%' THEN 3
          WHEN sale_month LIKE 'Diciembre%' THEN 3
          WHEN sale_month LIKE 'January%' THEN 4
          WHEN sale_month LIKE 'Enero%' THEN 4
          WHEN sale_month LIKE 'February%' THEN 5
          WHEN sale_month LIKE 'Febrero%' THEN 5
          WHEN sale_month LIKE 'March%' THEN 6
          WHEN sale_month LIKE 'Marzo%' THEN 6
          WHEN sale_month LIKE 'April%' THEN 7
          WHEN sale_month LIKE 'Abril%' THEN 7
          WHEN sale_month LIKE 'May%' THEN 8
          WHEN sale_month LIKE 'Mayo%' THEN 8
          WHEN sale_month LIKE 'June%' THEN 9
          WHEN sale_month LIKE 'Junio%' THEN 9
          WHEN sale_month LIKE 'July%' THEN 10
          WHEN sale_month LIKE 'Julio%' THEN 10
          WHEN sale_month LIKE 'August%' THEN 11
          WHEN sale_month LIKE 'Agosto%' THEN 11
          WHEN sale_month LIKE 'September%' THEN 12
          WHEN sale_month LIKE 'Septiembre%' THEN 12
          ELSE 99
        END
      LIMIT 12
    `);

    // Formatear datos mensuales
    const formattedMonthlyData = monthlyData.map(item => ({
      month: item.month,
      revenue: parseFloat(item.revenue),
      streams: parseInt(item.streams)
    }));

    // Respuesta
    res.json({
      totalRevenue: parseFloat(totalsResult[0].total_revenue),
      totalStreams: parseInt(totalsResult[0].total_streams),
      artistCount: countsResult[0].artist_count,
      trackCount: countsResult[0].track_count,
      platformBreakdown,
      monthlyData: formattedMonthlyData
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas',
      error: error.message
    });
  }
});

module.exports = router;
