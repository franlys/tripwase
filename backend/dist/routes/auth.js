"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }
        // Buscar usuario por email (sin relaciones para evitar problemas)
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                role: true,
                createdAt: true,
                lastLogin: true
            }
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }
        // Verificar contraseña
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }
        // Actualizar último login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });
        // Generar JWT
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '24h' });
        // Respuesta exitosa
        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    lastLogin: user.lastLogin
                },
                token
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});
// POST /api/v1/auth/register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'Email, contraseña y nombre son requeridos'
            });
        }
        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'El usuario ya existe'
            });
        }
        // Hashear contraseña
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Crear usuario
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: 'USER'
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true
            }
        });
        // Generar JWT
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: {
                user,
                token
            }
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map