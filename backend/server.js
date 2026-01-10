const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Import routes
const feedbackRoutes = require('./routes/feedback');
const adminRoutes = require('./routes/admin');
const newsRoutes = require('./routes/news');

const app = express();

// CORS configuration - allow your frontend domain
const allowedOrigins = [
  'https://www.aktoursandtravels.info',
  'https://aktoursandtravels.info',
  'http://localhost:5173', // Vite dev server
  'http://localhost:3000', // Alternative dev port
  'http://localhost:5174'  // Alternative Vite port
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.warn('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB (for serverless, connection is handled per-request)
// For local development, connect immediately
if (require.main === module) {
  connectDB().catch(err => {
    console.error('Failed to connect to MongoDB in local mode:', err);
  });
} else {
  // For Vercel serverless, connect on first request
  let isConnecting = false;
  let connectionPromise = null;
  
  app.use(async (req, res, next) => {
    try {
      const mongoose = require('mongoose');
      const readyState = mongoose.connection.readyState;
      
      // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
      if (readyState === 0) {
        // Not connected, try to connect
        if (!isConnecting) {
          isConnecting = true;
          console.log('🔄 Attempting MongoDB connection...');
          connectionPromise = connectDB().catch(err => {
            console.error('❌ MongoDB connection failed:', err.message);
            isConnecting = false; // Reset so we can retry
            throw err;
          });
        }
        
        try {
          await connectionPromise;
          console.log('✅ MongoDB connection established');
        } catch (err) {
          console.error('❌ Failed to establish MongoDB connection:', err.message);
          return res.status(503).json({
            error: 'Database connection unavailable',
            details: err.message || 'MongoDB connection failed. Please check MONGODB_URI environment variable.',
            readyState: mongoose.connection.readyState
          });
        }
      } else if (readyState === 1) {
        // Already connected
        // console.log('✅ MongoDB already connected');
      } else if (readyState === 2) {
        // Connecting, wait for it
        console.log('⏳ MongoDB connection in progress, waiting...');
        if (connectionPromise) {
          await connectionPromise;
        }
      } else {
        // State 3 (disconnecting) or unknown
        console.warn('⚠️ MongoDB in unexpected state:', readyState);
      }
      
      // Verify connection is ready before proceeding
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
          error: 'Database connection not ready',
          details: `Connection state: ${mongoose.connection.readyState}. Please try again.`,
          readyState: mongoose.connection.readyState
        });
      }
      
      next();
    } catch (err) {
      console.error('❌ MongoDB connection error in middleware:', err);
      return res.status(503).json({
        error: 'Database connection error',
        details: err.message || 'Failed to connect to database',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    }
  });
}

// Routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/news', newsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Backend server is running' });
});

// Error handling middleware - MUST send CORS headers even on errors
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Get origin from request
  const origin = req.headers.origin;
  const isAllowedOrigin = !origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development';
  
  // Set CORS headers even on error
  if (isAllowedOrigin && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Send error response
  const statusCode = err.status || 500;
  res.status(statusCode).json({ 
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Export for Vercel serverless
module.exports = app;

// Start server (only for local development)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
