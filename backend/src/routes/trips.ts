import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/v1/trips
router.get('/', async (req, res) => {
  try {
    // Por ahora retornamos array vacío
    // En el futuro se implementará autenticación JWT y filtro por usuario
    res.json({
      success: true,
      message: 'Trips retrieved successfully',
      data: []
    });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/v1/trips
router.post('/', async (req, res) => {
  try {
    // Placeholder para crear viajes
    res.status(501).json({
      success: false,
      message: 'Funcionalidad no implementada aún'
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

export default router;