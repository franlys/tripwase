import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth';
import tripRoutes from './routes/trips';
import { ApiResponse, ErrorResponse } from './types';

dotenv.config();

const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

const app: Application = express();

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

const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.get('/health', async (req: Request, res: Response<ApiResponse>) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      success: true,
      message: 'Server is healthy',
      data: {
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: 'Connected'
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      success: false,
      message: 'Service unavailable'
    });
  }
});

const API_PREFIX = process.env.API_PREFIX || '/api';
const API_VERSION = process.env.API_VERSION || 'v1';
const basePath = `${API_PREFIX}/${API_VERSION}`;

app.get('/', (req: Request, res: Response<ApiResponse>) => {
  res.json({
    success: true,
    message: 'TripWase API Server',
    data: {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      endpoints: {
        auth: `${basePath}/auth`,
        trips: `${basePath}/trips`,
        health: '/health'
      }
    }
  });
});

app.use(`${basePath}/auth`, authRoutes);
app.use(`${basePath}/trips`, tripRoutes);

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

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Setup automático de base de datos
    try {
      console.log('🔧 Setting up database...');
      
      // Crear tabla users si no existe
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

      // Verificar si el usuario demo ya existe
      const existingUser = await prisma.$queryRaw`
        SELECT * FROM "users" WHERE "email" = 'demo@tripwase.com'
      `;

      if (!Array.isArray(existingUser) || existingUser.length === 0) {
        // Crear usuario demo
        await prisma.$executeRaw`
          INSERT INTO "users" ("id", "email", "name", "password", "role") 
          VALUES ('demo-user-id', 'demo@tripwase.com', 'Usuario Demo', '$2a$10$rOJ8vQw8h8TzAKqnFzN9XO8vkZz4vxQa7L8Rc2zKj3mXDcJ6K8F4S', 'USER')
        `;
        console.log('✅ Demo user created: demo@tripwase.com');
      } else {
        console.log('✅ Demo user already exists');
      }

      console.log('✅ Database setup completed');
    } catch (setupError) {
      // Corrección del error TypeScript: verificar si es una instancia de Error
      const errorMessage = setupError instanceof Error ? setupError.message : String(setupError);
      console.log('⚠️ Database setup error (might already exist):', errorMessage);
    }
    
    console.log('\n🚀 TripWase API Server Started');
    console.log('================================');
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Health Check: http://localhost:${PORT}/health`);
    console.log(`🔗 API Base: http://localhost:${PORT}${basePath}`);
    console.log('================================\n');
    
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }
});

export default app;