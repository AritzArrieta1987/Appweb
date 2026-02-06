// =====================================================
// routes/csv.js - PROCESAMIENTO DE CSV 📊
// =====================================================

const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Configurar multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max
});

// POST /api/csv/upload - Subir y procesar CSV
router.post('/upload', authMiddleware, upload.single('csvFile'), async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó archivo CSV'
      });
    }

    console.log(`📤 Procesando CSV: ${req.file.originalname}`);
    
    await connection.beginTransaction();
    
    const file = req.file;
    const results = [];
    let totalRevenue = 0;
    let totalStreams = 0;
    const artistsSet = new Set();
    const tracksSet = new Set();
    const monthlyStats = {};
    const platformStats = {};
    
    // Leer y parsear CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`📋 Total de líneas: ${results.length}`);

    // Procesar cada línea del CSV
    for (const row of results) {
      try {
        // 1. ARTISTA - Obtener o crear
        const artistName = (row['Artist Name'] || row['Artist'] || '').trim();
        if (!artistName) continue;

        let [artistRows] = await connection.query(
          'SELECT id FROM artists WHERE name = ?',
          [artistName]
        );
        
        let artistId;
        if (artistRows.length === 0) {
          const [result] = await connection.query(
            'INSERT INTO artists (name, total_revenue, total_streams) VALUES (?, 0, 0)',
            [artistName]
          );
          artistId = result.insertId;
          console.log(`✅ Nuevo artista creado: ${artistName} (ID: ${artistId})`);
        } else {
          artistId = artistRows[0].id;
        }
        artistsSet.add(artistId);
        
        // 2. TRACK - Obtener o crear
        const trackTitle = (row['Track Name'] || row['Track'] || '').trim();
        const isrc = (row['ISRC'] || '').trim() || null;
        const upc = (row['UPC'] || '').trim() || null;
        
        if (!trackTitle) continue;

        let [trackRows] = await connection.query(
          'SELECT id FROM tracks WHERE title = ? AND artist_id = ?',
          [trackTitle, artistId]
        );
        
        let trackId;
        if (trackRows.length === 0) {
          const [result] = await connection.query(
            'INSERT INTO tracks (title, artist_id, isrc, upc, total_revenue, total_streams) VALUES (?, ?, ?, ?, 0, 0)',
            [trackTitle, artistId, isrc, upc]
          );
          trackId = result.insertId;
          console.log(`✅ Nuevo track creado: ${trackTitle} (ID: ${trackId})`);
        } else {
          trackId = trackRows[0].id;
        }
        tracksSet.add(trackId);
        
        // 3. PLATAFORMA - Obtener o crear
        const platformName = (row['DMS'] || row['DSP'] || row['Platform'] || row['Store'] || '').trim();
        if (!platformName) continue;

        let [platformRows] = await connection.query(
          'SELECT id FROM platforms WHERE name = ?',
          [platformName]
        );
        
        let platformId;
        if (platformRows.length === 0) {
          const [result] = await connection.query(
            'INSERT INTO platforms (name, display_name) VALUES (?, ?)',
            [platformName, platformName]
          );
          platformId = result.insertId;
          console.log(`✅ Nueva plataforma creada: ${platformName}`);
        } else {
          platformId = platformRows[0].id;
        }
        
        // 4. PROCESAR REVENUE Y STREAMS
        const revenueStr = (row['Label Share Net Receipts'] || row['Revenue'] || row['Earnings'] || '0')
          .toString()
          .replace(/[$€£¥]/g, '')
          .replace(/\s/g, '')
          .trim();
        
        let revenue = 0;
        if (revenueStr.includes('.') && revenueStr.includes(',')) {
          // Formato europeo: 1.234,56
          revenue = parseFloat(revenueStr.replace(/\./g, '').replace(',', '.'));
        } else if (revenueStr.includes(',') && !revenueStr.includes('.')) {
          // Formato europeo: 1234,56
          revenue = parseFloat(revenueStr.replace(',', '.'));
        } else {
          // Formato americano: 1,234.56 o simple: 1234.56
          revenue = parseFloat(revenueStr.replace(/,/g, ''));
        }
        
        const streams = parseInt((row['Quantity'] || row['Streams'] || row['Units'] || '0')
          .toString()
          .replace(/,/g, '')
          .trim()) || 0;
        
        // 5. PROCESAR PERIODO (Sale Month)
        const saleMonth = (row['Sale Month'] || row['Period'] || row['Month'] || '').trim();
        const saleDate = row['Sale Date'] || null;
        const territory = (row['Territory'] || row['Country'] || '').trim() || null;
        
        totalRevenue += revenue;
        totalStreams += streams;
        
        // 6. INSERTAR ROYALTY
        await connection.query(
          `INSERT INTO royalties 
           (track_id, platform_id, sale_month, sale_date, quantity, revenue, territory, csv_filename, uploaded_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [trackId, platformId, saleMonth, saleDate, streams, revenue, territory, file.originalname]
        );

        // 7. ACUMULAR ESTADÍSTICAS MENSUALES
        if (saleMonth) {
          if (!monthlyStats[saleMonth]) {
            monthlyStats[saleMonth] = { revenue: 0, streams: 0 };
          }
          monthlyStats[saleMonth].revenue += revenue;
          monthlyStats[saleMonth].streams += streams;
        }

        // 8. ACUMULAR ESTADÍSTICAS POR PLATAFORMA
        if (!platformStats[platformName]) {
          platformStats[platformName] = { revenue: 0, streams: 0 };
        }
        platformStats[platformName].revenue += revenue;
        platformStats[platformName].streams += streams;

      } catch (rowError) {
        console.error(`⚠️ Error procesando fila:`, rowError.message);
        // Continuar con la siguiente fila
      }
    }
    
    console.log(`💰 Revenue total: €${totalRevenue.toFixed(2)}`);
    console.log(`📊 Streams totales: ${totalStreams.toLocaleString()}`);
    console.log(`🎤 Artistas únicos: ${artistsSet.size}`);
    console.log(`🎵 Tracks únicos: ${tracksSet.size}`);
    
    // 9. ACTUALIZAR TOTALES DE ARTISTAS
    for (const artistId of artistsSet) {
      await connection.query('CALL update_artist_totals(?)', [artistId]);
    }
    
    // 10. ACTUALIZAR TOTALES DE TRACKS
    for (const trackId of tracksSet) {
      await connection.query('CALL update_track_totals(?)', [trackId]);
    }

    // 11. ACTUALIZAR/CREAR ESTADÍSTICAS MENSUALES
    for (const [month, stats] of Object.entries(monthlyStats)) {
      const year = 2024; // Extraer del CSV si es posible
      
      await connection.query(
        `INSERT INTO monthly_stats (month, year, total_revenue, total_streams, artist_count, track_count) 
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         total_revenue = total_revenue + VALUES(total_revenue),
         total_streams = total_streams + VALUES(total_streams),
         artist_count = ?,
         track_count = ?`,
        [month, year, stats.revenue, stats.streams, artistsSet.size, tracksSet.size, artistsSet.size, tracksSet.size]
      );
    }

    // 12. REGISTRAR UPLOAD EN LA TABLA csv_uploads
    const [uploadResult] = await connection.query(
      `INSERT INTO csv_uploads 
       (filename, rows_processed, total_revenue, total_streams, unique_artists, unique_tracks, status, uploaded_by_user_id) 
       VALUES (?, ?, ?, ?, ?, ?, 'completed', ?)`,
      [file.originalname, results.length, totalRevenue, totalStreams, artistsSet.size, tracksSet.size, req.user.id]
    );
    
    await connection.commit();
    
    // Eliminar archivo temporal
    fs.unlinkSync(file.path);
    
    console.log('✅ CSV procesado exitosamente');
    
    res.json({
      success: true,
      message: 'CSV procesado correctamente',
      data: {
        filename: file.originalname,
        rows_processed: results.length,
        total_revenue: totalRevenue,
        total_streams: totalStreams,
        unique_artists: artistsSet.size,
        unique_tracks: tracksSet.size,
        upload_id: uploadResult.insertId,
        monthly_breakdown: monthlyStats,
        platform_breakdown: platformStats
      }
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('❌ Error procesando CSV:', error);
    
    // Eliminar archivo si existe
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Error procesando CSV',
      error: error.message
    });
  } finally {
    connection.release();
  }
});

// GET /api/csv/history - Historial de archivos subidos
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const [uploads] = await pool.query(
      `SELECT id, filename, rows_processed, total_revenue, total_streams, 
              unique_artists, unique_tracks, upload_date, status
       FROM csv_uploads 
       ORDER BY upload_date DESC 
       LIMIT 50`
    );

    res.json({
      success: true,
      data: uploads
    });
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo historial'
    });
  }
});

module.exports = router;
