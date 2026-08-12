const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/books', require('./routes/bookRoutes'));
app.use('/api/v1/borrow', require('./routes/borrowRoutes'));

// Health check / Root endpoint
app.get('/', (req, res) => {
  res.send('Smart Library System API is active and running');
});

// Port configuration & Server Binding for Render deployment
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;