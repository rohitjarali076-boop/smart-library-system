const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Request Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/auth', authRoutes);

// Base Route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Smart Library Management System API is running smoothly.',
    timestamp: new Date()
  });
});

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Cannot find route ${req.originalUrl} on this server.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: err.status || 'error',
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;