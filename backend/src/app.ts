import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { apiRouter } from './routes/index.js';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Routes
app.use('/api/v1', apiRouter);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'SUJJU FOODS API',
    description: 'Tea Powder Manufacturing, Sales & Distributor Management Platform',
    status: 'active',
    documentation: '/api/v1/health',
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
});
