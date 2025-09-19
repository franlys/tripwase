import { Router } from 'express';
import {
  getTripStats
} from '../controllers/tripController';
import { authenticate, rateLimitByUser } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(rateLimitByUser(50, 15 * 60 * 1000));

router.get('/stats', getTripStats);

export default router;