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

      // Crear tabla user_preferences si no existe
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "user_preferences" (
          "id" TEXT PRIMARY KEY,
          "userId" TEXT UNIQUE NOT NULL,
          "currency" TEXT DEFAULT 'USD',
          "language" TEXT DEFAULT 'ES',
          "notifications" BOOLEAN DEFAULT true,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
        );
      `;

      // Crear tabla destinations si no existe
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "destinations" (
          "id" TEXT PRIMARY KEY,
          "name" TEXT NOT NULL,
          "country" TEXT NOT NULL,
          "description" TEXT,
          "averagePrice" REAL,
          "popularityScore" INTEGER DEFAULT 0,
          "categories" TEXT DEFAULT '[]',
          "imageUrl" TEXT,
          "averageTemp" REAL,
          "climate" TEXT,
          "bestMonths" TEXT DEFAULT '[]',
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE("name", "country")
        );
      `;

      // Crear tabla trips si no existe
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "trips" (
          "id" TEXT PRIMARY KEY,
          "userId" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "status" TEXT DEFAULT 'PLANNING',
          "isArchived" BOOLEAN DEFAULT false,
          "destinationId" TEXT NOT NULL,
          "originCity" TEXT NOT NULL,
          "originCountry" TEXT NOT NULL,
          "startDate" TIMESTAMP NOT NULL,
          "endDate" TIMESTAMP NOT NULL,
          "duration" INTEGER NOT NULL,
          "totalCost" REAL NOT NULL,
          "budgetTotal" REAL NOT NULL,
          "budgetUsed" REAL DEFAULT 0,
          "budgetRemaining" REAL,
          "currency" TEXT DEFAULT 'USD',
          "adultsCount" INTEGER DEFAULT 1,
          "childrenCount" INTEGER DEFAULT 0,
          "interests" TEXT DEFAULT '[]',
          "travelStyle" TEXT,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
          FOREIGN KEY ("destinationId") REFERENCES "destinations"("id")
        );
      `;

      // Crear tabla favorites si no existe
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "favorites" (
          "id" TEXT PRIMARY KEY,
          "userId" TEXT NOT NULL,
          "destinationId" TEXT NOT NULL,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
          FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE CASCADE,
          UNIQUE("userId", "destinationId")
        );
      `;

      // Crear tabla notifications si no existe
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "notifications" (
          "id" TEXT PRIMARY KEY,
          "userId" TEXT NOT NULL,
          "type" TEXT DEFAULT 'INFO',
          "title" TEXT NOT NULL,
          "message" TEXT NOT NULL,
          "read" BOOLEAN DEFAULT false,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
        );
      `;

      console.log('✅ All tables created successfully');

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