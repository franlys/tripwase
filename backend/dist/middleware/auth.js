"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitByUser = exports.authenticate = void 0;
const client_1 = require("@prisma/client");
const jwt_1 = require("../utils/jwt");
const prisma = new client_1.PrismaClient();
const authenticate = async (req, res, next) => {
    try {
        const token = (0, jwt_1.extractTokenFromHeader)(req.headers.authorization);
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Token de acceso requerido'
            });
            return;
        }
        let decoded;
        try {
            decoded = (0, jwt_1.verifyToken)(token);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Token inválido';
            res.status(401).json({
                success: false,
                message
            });
            return;
        }
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                preferences: true
            }
        });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.authenticate = authenticate;
const rateLimitByUser = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
    const userRequests = new Map();
    return (req, res, next) => {
        const userId = req.user?.id || req.ip || 'anonymous';
        const now = Date.now();
        const userLimit = userRequests.get(userId);
        if (!userLimit || now > userLimit.resetTime) {
            userRequests.set(userId, {
                count: 1,
                resetTime: now + windowMs
            });
            next();
            return;
        }
        if (userLimit.count >= maxRequests) {
            res.status(429).json({
                success: false,
                message: 'Demasiadas solicitudes. Intenta de nuevo más tarde.'
            });
            return;
        }
        userLimit.count++;
        next();
    };
};
exports.rateLimitByUser = rateLimitByUser;
//# sourceMappingURL=auth.js.map