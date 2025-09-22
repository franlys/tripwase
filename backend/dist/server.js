"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("./routes/auth"));
const trips_1 = __importDefault(require("./routes/trips"));
dotenv_1.default.config();
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`❌ Missing required environment variable: ${envVar}`);
        process.exit(1);
    }
}
const prisma = new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({
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
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
app.get('/health', async (req, res) => {
    try {
        await prisma.$queryRaw `SELECT 1`;
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
    }
    catch (error) {
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
app.get('/', (req, res) => {
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
app.use(`${basePath}/auth`, auth_1.default);
app.use(`${basePath}/trips`, trips_1.default);
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});
app.use((error, req, res, next) => {
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
        console.log('\n🚀 TripWase API Server Started');
        console.log('================================');
        console.log(`📡 Server: http://localhost:${PORT}`);
        console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`📊 Health Check: http://localhost:${PORT}/health`);
        console.log(`🔗 API Base: http://localhost:${PORT}${basePath}`);
        console.log('================================\n');
    }
    catch (error) {
        console.error('❌ Failed to connect to database:', error);
        process.exit(1);
    }
});
exports.default = app;
//# sourceMappingURL=server.js.map