"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.ts
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// --- Rutas Públicas ---
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
// --- Rutas Privadas (requieren token) ---
router.get('/profile', auth_1.authenticate, authController_1.getProfile);
router.post('/logout', auth_1.authenticate, authController_1.logout);
exports.default = router;
//# sourceMappingURL=auth.js.map