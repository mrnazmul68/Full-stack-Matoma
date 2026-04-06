const express = require('express');
const cors = require('cors');
const { getDBStatus, isDBConnected } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const donorRoutes = require('./routes/donorRoutes');
const siteContentRoutes = require('./routes/siteContentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

const allowedOrigins = [process.env.FRONTEND_ORIGIN].filter(Boolean).map((origin) => {
  const normalizedOrigin = origin.trim().replace(/\/$/, '');
  return normalizedOrigin;
});

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.trim().replace(/\/$/, '');

      const isLocalhostOrigin =
        /^http:\/\/localhost:\d+$/.test(normalizedOrigin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(normalizedOrigin);

      if (allowedOrigins.includes(normalizedOrigin) || isLocalhostOrigin) {
        return callback(null, true);
      }

      return callback(new Error('Origin is not allowed by CORS.'));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '25mb' }));

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Matoma Backend API!',
    healthCheck: '/api/health',
    version: '1.0.0',
  });
});

app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();

  res.json({
    status: dbStatus.isConnected ? 'ok' : 'degraded',
    message: dbStatus.isConnected
      ? 'Matoma backend is running.'
      : 'Matoma backend is running, but MongoDB is not connected.',
    database: dbStatus,
  });
});

app.use('/api', (req, res, next) => {
  if (req.method === 'OPTIONS' || req.path === '/health') {
    return next();
  }

  if (!isDBConnected()) {
    return res.status(503).json({
      message:
        'Backend is running, but the database is unavailable right now. Please check your MongoDB Atlas IP access list and try again.',
    });
  }

  return next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/site-content', siteContentRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || err.status || 500).json({
    message: err.message || 'Internal server error.',
  });
});

module.exports = app;
