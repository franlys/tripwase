// src/routes/trips.ts
import { Router } from 'express';
import { getTripStats } from '../controllers/tripController';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /api/v1/trips/stats - Esta ruta ahora requiere un token
router.get('/stats', authenticate, getTripStats);

export default router;