import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import apiRoutes from './routes/index.js';
import docsRoutes from './routes/docsRoutes.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// Security and middleware defaults
app.use(helmet({
  contentSecurityPolicy: false, // Allows Swagger UI inline scripts/styles
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve OpenAPI Swagger Docs at /docs
app.use(docsRoutes);

// Apply Rate Limiter to all /api routes
app.use('/api', apiRateLimiter);

// Mount versioned API routes under /api
app.use('/api', apiRoutes);

// Fallback Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
