const mongoose = require('mongoose');

const DB_RETRY_DELAY_MS = 5000;

let isConnecting = false;
let retryTimer = null;
let lastConnectionError = null;

function getMongoOptions() {
  return {
    dbName: process.env.MONGO_DB_NAME || 'matoma',
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 10000,
    family: 4,
  };
}

function getMongoUri() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not configured.');
  }

  return mongoUri;
}

function isDBConnected() {
  return mongoose.connection.readyState === 1;
}

function getDBStatus() {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    isConnected: isDBConnected(),
    state: states[mongoose.connection.readyState] || 'unknown',
    lastError: lastConnectionError,
  };
}

function scheduleReconnect() {
  if (retryTimer || isDBConnected() || isConnecting) {
    return;
  }

  retryTimer = setTimeout(async () => {
    retryTimer = null;

    try {
      await connectDB();
    } catch (error) {
      scheduleReconnect();
    }
  }, DB_RETRY_DELAY_MS);
}

async function connectDB() {
  if (isDBConnected()) {
    return mongoose.connection;
  }

  if (isConnecting) {
    return mongoose.connection;
  }

  isConnecting = true;

  try {
    await mongoose.connect(getMongoUri(), getMongoOptions());
    lastConnectionError = null;
    console.log(`MongoDB connected to database "${getMongoOptions().dbName}"`);
    return mongoose.connection;
  } catch (error) {
    lastConnectionError = error.message;
    throw error;
  } finally {
    isConnecting = false;
  }
}

function startDBConnection() {
  mongoose.connection.on('connected', () => {
    lastConnectionError = null;
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Retrying connection...');
    scheduleReconnect();
  });

  mongoose.connection.on('error', (error) => {
    lastConnectionError = error.message;
    console.error('MongoDB connection error:', error.message);
  });

  connectDB().catch((error) => {
    console.error('Initial MongoDB connection failed:', error.message);
    scheduleReconnect();
  });
}

module.exports = {
  connectDB,
  getDBStatus,
  isDBConnected,
  startDBConnection,
};
