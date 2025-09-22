"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getProfile = exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const jwt_1 = require("../utils/jwt");
const prisma = new client_1.PrismaClient();
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido').min(1, 'Email requerido'),
    password: zod_1.z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'Nombre demasiado largo'),
    email: zod_1.z.string().email('Email inválido').min(1, 'Email requerido'),
    password: zod_1.z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(128, 'Contraseña demasiado larga')
});
const formatUserResponse = (user) => {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        lastLogin: user.lastLogin?.toISOString(),
        preferences: user.preferences ? {
            currency: user.preferences.currency,
            language: user.preferences.language,
            notifications: user.preferences.notifications
        } : undefined
    };
};
const register = async (req, res) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const { name, email, password } = validatedData;
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'Este email ya está registrado',
                errors: [{ field: 'email', message: 'Email ya está en uso' }]
            });
            return;
        }
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.toLowerCase(),
                password: hashedPassword,
                lastLogin: new Date(),
                preferences: {
                    create: {
                        currency: 'USD',
                        language: 'ES',
                        notifications: true
                    }
                }
            },
            include: {
                preferences: true
            }
        });
        const payload = (0, jwt_1.createUserPayload)(user);
        const token = (0, jwt_1.generateToken)(payload);
        await prisma.notification.create({
            data: {
                userId: user.id,
                type: 'INFO',
                title: '¡Bienvenido a TripWase!',
                message: 'Tu cuenta ha sido creada exitosamente. ¡Comienza a planificar tu próximo viaje!',
                read: false
            }
        });
        res.status(201).json({
            success: true,
            data: {
                user: formatUserResponse(user),
                token,
                expiresIn: process.env.JWT_EXPIRES_IN || '7d'
            },
            message: 'Usuario registrado exitosamente'
        });
    }
    catch (error) {
        console.error('Register error:', error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                success: false,
                message: 'Datos de entrada inválidos',
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        const { email, password } = validatedData;
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            include: {
                preferences: true
            }
        });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Email o contraseña incorrectos'
            });
            return;
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Email o contraseña incorrectos'
            });
            return;
        }
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });
        const payload = (0, jwt_1.createUserPayload)(user);
        const token = (0, jwt_1.generateToken)(payload);
        res.json({
            success: true,
            data: {
                user: formatUserResponse(user),
                token,
                expiresIn: process.env.JWT_EXPIRES_IN || '7d'
            },
            message: 'Inicio de sesión exitoso'
        });
    }
    catch (error) {
        console.error('Login error:', error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                success: false,
                message: 'Datos de entrada inválidos',
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
            return;
        }
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: {
                preferences: true
            }
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }
        res.json({
            success: true,
            data: formatUserResponse(user),
            message: 'Perfil obtenido exitosamente'
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getProfile = getProfile;
const logout = async (req, res) => {
    try {
        if (req.user) {
            console.log(`User ${req.user.email} logged out at ${new Date().toISOString()}`);
        }
        res.json({
            success: true,
            message: 'Sesión cerrada exitosamente'
        });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.logout = logout;
//# sourceMappingURL=authController.js.map