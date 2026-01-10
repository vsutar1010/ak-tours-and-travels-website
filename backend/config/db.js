const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI;

// Cache connection for serverless functions
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Check if MongoDB URI is configured
  if (!mongoURI) {
    const error = 'MongoDB connection string is missing. Please set MONGODB_URI environment variable.';
    console.error('❌', error);
    throw new Error(error);
  }

  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    console.log('✅ MongoDB already connected');
    return mongoose.connection;
  }

  // Return cached connection if available
  if (cached.conn && mongoose.connection.readyState === 1) {
    console.log('✅ Using cached MongoDB connection');
    return cached.conn;
  }

  // If connection is in progress, wait for it
  if (cached.promise) {
    console.log('⏳ Waiting for existing connection attempt...');
    try {
      cached.conn = await cached.promise;
      if (mongoose.connection.readyState === 1) {
        return cached.conn;
      }
    } catch (e) {
      // Connection failed, reset and try again
      cached.promise = null;
      cached.conn = null;
    }
  }

  // Start new connection
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // 10 seconds (increased)
    socketTimeoutMS: 45000, // 45 seconds
    maxPoolSize: 10,
    minPoolSize: 1,
  };

  console.log('🔄 Connecting to MongoDB...');
  console.log('📍 Connection string:', mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@')); // Hide password
  
  cached.promise = mongoose.connect(mongoURI, opts)
    .then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      console.log('📍 Database:', mongoose.connection.db.databaseName);
      cached.conn = mongoose.connection;
      return mongoose.connection;
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
      console.error('❌ Error details:', {
        name: err.name,
        code: err.code,
        message: err.message
      });
      cached.promise = null; // Reset promise on error
      cached.conn = null;
      throw err;
    });

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    console.error('❌ Failed to connect to MongoDB:', e.message);
    throw e;
  }
};

module.exports = connectDB;
