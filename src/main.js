import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';

import paymentRoutes from './routes/paymentRoutes.js';
import participantRoutes from './routes/participantRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';


const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}

// Security middleware
app.use(helmet());
app.use(cors(corsOptions));
app.options("*",cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
});
app.use(limiter);

// Stricter limit for payment creation
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    message: 'Too many payment attempts, please try again later'
  }
});

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV 
  });
});

// API Routes
app.use('/api/v1/payment', paymentLimiter, paymentRoutes);
app.use('/api/v1/participants', participantRoutes);
app.use('/api/v1/auth', authRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
