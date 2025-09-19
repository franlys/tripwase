import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  UserResponse, 
  ApiResponse,
  AuthenticatedRequest
} from '../types';
import { generateToken, createUserPayload } from '../utils/jwt';

const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'Nombre demasiado largo'),
  email: z.string().email('Email inválido').min(1, 'Email requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(128, 'Contraseña demasiado larga')
});

const formatUserResponse = (user: any): UserResponse => {
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

export const register = async (
  req: Request<{}, ApiResponse<AuthResponse>, RegisterRequest>,
  res: Response<ApiResponse<AuthResponse>>
): Promise<void> => {
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
    const hashedPassword = await bcrypt.hash(password, saltRounds);

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

    const payload = createUserPayload(user);
    const token = generateToken(payload);

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

  } catch (error) {
    console.error('Register error:', error);

    if (error instanceof z.ZodError) {
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

export const login = async (
  req: Request<{}, ApiResponse<AuthResponse>, LoginRequest>,
  res: Response<ApiResponse<AuthResponse>>
): Promise<void> => {
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

    const isPasswordValid = await bcrypt.compare(password, user.password);

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

    const payload = createUserPayload(user);
    const token = generateToken(payload);

    res.json({
      success: true,
      data: {
        user: formatUserResponse(user),
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      },
      message: 'Inicio de sesión exitoso'
    });

  } catch (error) {
    console.error('Login error:', error);

    if (error instanceof z.ZodError) {
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

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse<UserResponse>>
): Promise<void> => {
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

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const logout = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    if (req.user) {
      console.log(`User ${req.user.email} logged out at ${new Date().toISOString()}`);
    }

    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};