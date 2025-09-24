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
//                    CONFIGURACIÓN DE CORS DEFINITIVA
// =================================================================

// Función inteligente para validar orígenes
const isValidOrigin = (origin: string): boolean => {
  // Orígenes locales (desarrollo)
  const localOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001'
  ];
  
  if (localOrigins.includes(origin)) {
    return true;
  }
  
  // Dominios de Vercel - permite cualquier subdominio de tu cuenta
  if (origin.includes('franlys-projects-e0a57c06.vercel.app') || 
      origin.includes('tripwase.vercel.app') ||
      origin.endsWith('.vercel.app')) {
    return true;
  }
  
  // Dominios personalizados (agregar aquí cuando tengas dominio propio)
  const customDomains = [
    'https://tripwase.com',
    'https://www.tripwase.com'
  ];
  
  if (customDomains.includes(origin)) {
    return true;
  }
  
  return false;
};

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Permitir peticiones sin origin (mobile apps, Postman, etc.)
    if (!origin) {
      console.log('✅ CORS: Petición sin origen permitida (mobile/Postman)');
      return callback(null, true);
    }
    
    // Validar origen
    if (isValidOrigin(origin)) {
      console.log(`✅ CORS: Origen permitido - ${origin}`);
      callback(null, true);
    } else {
      console.error(`❌ CORS: Origen BLOQUEADO - ${origin}`);
      callback(new Error(`Origen no permitido por CORS: ${origin}`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  maxAge: 86400 // 24 horas de cache para preflight
};

// Aplicar CORS antes que cualquier otra ruta
app.use(cors(corsOptions));

// Manejar preflight OPTIONS explícitamente
app.options('*', cors(corsOptions));

// =================================================================

// --- Middlewares Generales ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging mejorado
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// --- Rutas Públicas ---
app.get('/health', async (req: Request, res: Response<ApiResponse>) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      message: 'Server is healthy',
      data: { 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: '1.0.7',
        cors: 'Smart CORS enabled'
      }
    });
  } catch (error) {
    res.status(503).json({ 
      success: false, 
      message: 'Service unavailable' 
    });
  }
});

// Endpoint para debugging CORS
app.get('/cors-test', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'CORS test successful',
    data: {
      origin: req.get('Origin') || 'No origin header',
      headers: req.headers
    }
  });
});

const API_PREFIX = process.env.API_PREFIX || '/api';
const API_VERSION = process.env.API_VERSION || 'v1';
const basePath = `${API_PREFIX}/${API_VERSION}`;

app.get('/', (req: Request, res: Response<ApiResponse>) => {
  res.json({
    success: true,
    message: 'TripWase API Server is running!',
    data: { 
      version: '1.0.7',
      cors: 'Smart CORS enabled',
      endpoints: {
        health: '/health',
        corsTest: '/cors-test',
        auth: `${basePath}/auth`,
        trips: `${basePath}/trips`
      }
    }
  });
});

// --- Rutas de la API ---
app.use(`${basePath}/auth`, authRoutes);
app.use(`${basePath}/trips`, tripRoutes);

// --- Manejadores de Errores ---
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error handler:', error);
  
  // Error específico de CORS
  if (error.message.includes('CORS')) {
    return res.status(403).json({ 
      success: false, 
      message: 'CORS Error: Origen no permitido',
      data: {
        origin: req.get('Origin'),
        allowedOrigins: [
          'localhost:3000',
          '*.vercel.app',
          'tripwase.com'
        ]
      }
    });
  }
  
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Internal server error'
  });
});

// --- Arranque del Servidor ---
const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Setup de base de datos automático
    try {
      console.log('🔧 Setting up database...');
      
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "users" (
          "id" TEXT PRIMARY KEY,
          "email" TEXT UNIQUE NOT NULL,
          "name" TEXT NOT NULL,
          "password" TEXT NOT NULL,
          "role" TEXT DEFAULT 'USER',
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "lastLogin" TIMESTAMP
        );
      `;

      console.log('✅ Users table ready');

      // Verificar usuario demo
      const existingUser = await prisma.$queryRaw`
        SELECT * FROM "users" WHERE "email" = 'demo@tripwase.com' LIMIT 1
      `;

      if (!Array.isArray(existingUser) || existingUser.length === 0) {
        await prisma.$executeRaw`
          INSERT INTO "users" ("id", "email", "name", "password", "role") 
          VALUES ('demo-user-id', 'demo@tripwase.com', 'Usuario Demo', '$2a$10$rOJ8vQw8h8TzAKqnFzN9XO8vkZz4vxQa7L8Rc2zKj3mXDcJ6K8F4S', 'USER')
        `;
        console.log('✅ Demo user created');
      } else {
        console.log('✅ Demo user exists');
      }

      console.log('✅ Database setup completed');
    } catch (setupError) {
      const errorMessage = setupError instanceof Error ? setupError.message : String(setupError);
      console.log('⚠️ Database setup warning:', errorMessage);
    }
    
    console.log('\n🚀 TripWase API Server Started');
    console.log('================================');
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔒 Smart CORS: Enabled`);
    console.log(`📊 Health: http://localhost:${PORT}/health`);
    console.log(`🔗 API: http://localhost:${PORT}${basePath}`);
    console.log('================================\n');
    
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }
});

export default app;