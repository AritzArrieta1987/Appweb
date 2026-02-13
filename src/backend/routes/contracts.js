// =====================================================
// routes/contracts.js - CRUD de Contratos
// =====================================================

const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');
const logger = require('../config/logger');

const router = express.Router();

// GET /api/contracts - Obtener todos los contratos
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [contracts] = await pool.query(`
      SELECT 
        c.*,
        a.name as artist_name,
        a.photo_url as artist_photo,
        a.email as artist_email
      FROM contracts c
      LEFT JOIN artists a ON c.artist_id = a.id
      ORDER BY c.created_at DESC
    `);

    logger.info('Contratos obtenidos', { count: contracts.length });

    res.json({
      success: true,
      data: contracts
    });
  } catch (error) {
    logger.error('Error obteniendo contratos:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo contratos'
    });
  }
});

// GET /api/contracts/:id - Obtener contrato específico
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [contracts] = await pool.query(`
      SELECT 
        c.*,
        a.name as artist_name,
        a.photo_url as artist_photo,
        a.email as artist_email,
        a.phone as artist_phone
      FROM contracts c
      LEFT JOIN artists a ON c.artist_id = a.id
      WHERE c.id = ?
    `, [id]);

    if (contracts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contrato no encontrado'
      });
    }

    res.json({
      success: true,
      data: contracts[0]
    });
  } catch (error) {
    logger.error('Error obteniendo contrato:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo contrato'
    });
  }
});

// GET /api/contracts/artist/:artistId - Obtener contratos de un artista
router.get('/artist/:artistId', authMiddleware, async (req, res) => {
  try {
    const { artistId } = req.params;

    const [contracts] = await pool.query(`
      SELECT 
        c.*,
        a.name as artist_name,
        a.photo_url as artist_photo
      FROM contracts c
      LEFT JOIN artists a ON c.artist_id = a.id
      WHERE c.artist_id = ?
      ORDER BY c.created_at DESC
    `, [artistId]);

    res.json({
      success: true,
      data: contracts
    });
  } catch (error) {
    logger.error('Error obteniendo contratos del artista:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo contratos del artista'
    });
  }
});

// POST /api/contracts - Crear nuevo contrato
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      artist_id,
      percentage,
      start_date,
      end_date,
      service_type,
      contract_type,
      territory,
      advance_payment,
      terms,
      status
    } = req.body;

    // Validaciones
    if (!artist_id || !percentage || !start_date || !end_date || !service_type) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios: artist_id, percentage, start_date, end_date, service_type'
      });
    }

    if (percentage < 0 || percentage > 100) {
      return res.status(400).json({
        success: false,
        message: 'El porcentaje debe estar entre 0 y 100'
      });
    }

    // Verificar que el artista existe
    const [artists] = await pool.query('SELECT id FROM artists WHERE id = ?', [artist_id]);
    if (artists.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Artista no encontrado'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO contracts 
       (artist_id, percentage, start_date, end_date, service_type, contract_type, territory, advance_payment, terms, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        artist_id,
        percentage,
        start_date,
        end_date,
        service_type,
        contract_type || 'Estándar',
        territory || 'Mundial',
        advance_payment || 0,
        terms || '',
        status || 'active'
      ]
    );

    logger.info('Contrato creado', {
      contractId: result.insertId,
      artistId: artist_id,
      percentage,
      serviceType: service_type
    });

    res.json({
      success: true,
      message: 'Contrato creado exitosamente',
      data: {
        id: result.insertId,
        artist_id,
        percentage,
        start_date,
        end_date,
        service_type,
        contract_type: contract_type || 'Estándar',
        territory: territory || 'Mundial',
        advance_payment: advance_payment || 0,
        terms: terms || '',
        status: status || 'active'
      }
    });
  } catch (error) {
    logger.error('Error creando contrato:', error);
    res.status(500).json({
      success: false,
      message: 'Error creando contrato'
    });
  }
});

// PUT /api/contracts/:id - Actualizar contrato
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      percentage,
      start_date,
      end_date,
      service_type,
      contract_type,
      territory,
      advance_payment,
      terms,
      status
    } = req.body;

    // Verificar que el contrato existe
    const [existing] = await pool.query('SELECT id FROM contracts WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contrato no encontrado'
      });
    }

    // Construir query dinámicamente solo con campos proporcionados
    const updates = [];
    const values = [];

    if (percentage !== undefined) {
      if (percentage < 0 || percentage > 100) {
        return res.status(400).json({
          success: false,
          message: 'El porcentaje debe estar entre 0 y 100'
        });
      }
      updates.push('percentage = ?');
      values.push(percentage);
    }
    if (start_date) {
      updates.push('start_date = ?');
      values.push(start_date);
    }
    if (end_date) {
      updates.push('end_date = ?');
      values.push(end_date);
    }
    if (service_type) {
      updates.push('service_type = ?');
      values.push(service_type);
    }
    if (contract_type) {
      updates.push('contract_type = ?');
      values.push(contract_type);
    }
    if (territory) {
      updates.push('territory = ?');
      values.push(territory);
    }
    if (advance_payment !== undefined) {
      updates.push('advance_payment = ?');
      values.push(advance_payment);
    }
    if (terms !== undefined) {
      updates.push('terms = ?');
      values.push(terms);
    }
    if (status) {
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron campos para actualizar'
      });
    }

    values.push(id);

    await pool.query(
      `UPDATE contracts SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    logger.info('Contrato actualizado', { contractId: id });

    res.json({
      success: true,
      message: 'Contrato actualizado exitosamente'
    });
  } catch (error) {
    logger.error('Error actualizando contrato:', error);
    res.status(500).json({
      success: false,
      message: 'Error actualizando contrato'
    });
  }
});

// DELETE /api/contracts/:id - Eliminar contrato
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el contrato existe
    const [existing] = await pool.query('SELECT id FROM contracts WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contrato no encontrado'
      });
    }

    await pool.query('DELETE FROM contracts WHERE id = ?', [id]);

    logger.info('Contrato eliminado', { contractId: id });

    res.json({
      success: true,
      message: 'Contrato eliminado exitosamente'
    });
  } catch (error) {
    logger.error('Error eliminando contrato:', error);
    res.status(500).json({
      success: false,
      message: 'Error eliminando contrato'
    });
  }
});

module.exports = router;
