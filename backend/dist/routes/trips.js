"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
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
    }
    catch (error) {
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
    }
    catch (error) {
        console.error('Create trip error:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});
exports.default = router;
//# sourceMappingURL=trips.js.map