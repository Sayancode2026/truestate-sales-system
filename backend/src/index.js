import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import dotenv from 'dotenv';
import salesRoutes from './routes/sales.routes.js';
import healthRoutes from './routes/health.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(helmet());


app.use(cors({ 
  origin: process.env.CORS_ORIGIN || '*', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(compression());


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});


app.use('/api/health', healthRoutes);

app.use('/api/sales', salesRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Not Found', 
    message: `Route ${req.method} ${req.path} not found` 
  });
});


app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    success: false,
    error: err.message || 'Internal server error', 
    status: err.status || 500 
  });
});

const server = app.listen(PORT, () => {
  console.log('\n TruEstate Sales Management API');
  console.log(` Server running on port ${PORT}`);
  console.log(` Health: http://localhost:${PORT}/api/health`);
  console.log(` API: http://localhost:${PORT}/api/sales\n`);
});


process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
