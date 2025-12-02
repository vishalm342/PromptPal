const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const promptRoutes = require('./routes/promptRoutes');
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

// Basic required env checks (log only; allow process to start so Render can report)
if (!process.env.MONGODB_URI) {
  console.warn('MONGODB_URI environment variable is not set. DB will not connect until set.');
}

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET environment variable is not set. Auth may fail.');
}

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

// CORS Configuration - prefer explicit FRONTEND_URL env var, fallback to permissive in non-production
const frontendOrigin = process.env.FRONTEND_URL;
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server or curl
    if (process.env.NODE_ENV === 'production') {
      if (frontendOrigin && origin === frontendOrigin) return callback(null, true);
      // allow the Render app domain if provided
      if (origin === process.env.RENDER_EXTERNAL_URL) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    }
    // development: allow common local origins and any origin when FRONTEND_URL not set
    const devAllow = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:3000',
      'http://127.0.0.1:5173'
    ];
    if (frontendOrigin) {
      devAllow.push(frontendOrigin);
    }
    if (devAllow.includes(origin) || !origin) return callback(null, true);
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes - make sure these are properly defined string paths
app.use('/api/auth', authRoutes);
app.use('/api/prompts', promptRoutes);

// Basic health check route
app.get('/', (req, res) => {
  res.json({
    message: 'PromptPal API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      prompts: '/api/prompts'
    }
  });
});

// Health check endpoint for Docker
app.get('/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
  res.status(200).json(healthcheck);
});

// Diagnostic endpoint
app.get('/diag', (req, res) => {
  res.json({
    server: 'ok',
    env: process.env.NODE_ENV || 'development',
    dbConnected: mongoose.connection.readyState === 1,
    endpoints: {
      health: '/health',
      promptsPublic: '/api/prompts/public'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

  // Connect to MongoDB asynchronously after server starts so the process can respond to pings even if DB is slow
  if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
      .then(() => {
        console.log('✅ Connected to MongoDB successfully');
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
      });
  } else {
    console.warn('Skipping MongoDB connect because MONGODB_URI is not set');
  }
});

// Global error handlers so Render logs show uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // keep process alive for crash reporting; optionally exit after logging
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = { app, server };
