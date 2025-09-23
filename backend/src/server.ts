import express, { Application, Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth';
import tripRoutes from './routes/trips';
import { ApiResponse } from './types';

dotenv.config();

// --- Verificación de Variables de Entorno ---
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// --- Cliente de Prisma ---
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

const app: Application = express();

// --- Middlewares de Seguridad ---
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));


// =================================================================
//                    CONFIGURACIÓN DE CORS
// =================================================================
// Lista de orígenes (dominios) permitidos. Tu frontend DEBE estar aquí.
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://tripwase-9na1g6t33-franlys-projects-e0a57c06.vercel.app'
];

const corsOptions: CorsOptions = {
  // La función origin comprueba si el dominio que hace la petición está en nuestra lista permitida.
  origin: (origin, callback) => {
    // Si el origen está en la lista (o si no hay origen, como en las peticiones de Postman), se permite.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Permite que el frontend envíe cookies o cabeceras de autorización.
  optionsSuccessStatus: 200, // Para navegadores antiguos.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// 1. Maneja las peticiones de "preflight" (OPTIONS) que el navegador envía primero.
app.options('*', cors(corsOptions));

// 2. Aplica la configuración de CORS a todas las demás peticiones.
// ¡ESTO DEBE IR ANTES DE LAS RUTAS!
app.use(cors(corsOptions));
// =================================================================


// --- Middlewares Generales ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}


// --- Rutas Públicas (no requieren token) ---
app.get('/health', async (req: Request, res: Response<ApiResponse>) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      message: 'Server is healthy',
      data: { status: 'OK', timestamp: new Date().toISOString() }
    });
  } catch (error) {
    res.status(503).json({ success: false, message: 'Service unavailable' });
  }
});

const API_PREFIX = process.env.API_PREFIX || '/api';
const API_VERSION = process.env.API_VERSION || 'v1';
const basePath = `${API_PREFIX}/${API_VERSION}`;

app.get('/', (req: Request, res: Response<ApiResponse>) => {
  res.json({
    success: true,
    message: 'TripWase API Server is running!',
    data: { version: '1.0.6' }
  });
});


// --- Definición de Rutas de la API ---
// Todas las rutas de autenticación (login, register) son públicas.
app.use(`${basePath}/auth`, authRoutes);

// Todas las rutas de viajes son privadas y la protección se maneja DENTRO de tripRoutes.
app.use(`${basePath}/trips`, tripRoutes);


// --- Manejadores de Errores (deben ir al final) ---
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});


// --- Arranque del Servidor ---
const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    console.log('\n🚀 TripWase API Server Started');
    console.log('================================');
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('================================\n');
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }
});

export default app;