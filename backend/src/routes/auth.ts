// src/routes/auth.ts
import { Router } from 'express';
import { register, login, getProfile, logout } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// --- Rutas Públicas ---
router.post('/register', register);
router.post('/login', login);

// --- Rutas Privadas (requieren token) ---
router.get('/profile', authenticate, getProfile);
router.post('/logout', authenticate, logout);

export default router;