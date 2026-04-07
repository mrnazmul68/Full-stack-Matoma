require('dotenv').config();

const app = require('./app');
const mongoose = require('mongoose');
const { startDBConnection } = require('./config/db');

// Essential environment variable validation
const requiredEnvVars = [
  'MONGO_URI',
  'FRONTEND_ORIGIN',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'ADMIN_SESSION_SECRET',
  'SMTP_USER',
  'SMTP_PASSWORD',
];

const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(
    `Error: The following required environment variables are missing: ${missingEnvVars.join(', ')}`,
  );
  process.exit(1);
}

const PORT = process.env.PORT || 10000;

let server;

function startServer() {
  try {
    server = app.listen(PORT, () => {
      console.log(`Backend server listening on port ${PORT}`);
    });

    startDBConnection();
  } catch (error) {
    console.error('Failed to start backend:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown handling
const shutdown = () => {
  console.log('Shutting down server...');
  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed.');
        process.exit(0);
      });
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startServer();
