const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/books', require('./routes/bookRoutes'));
app.use('/api/v1/borrow', require('./routes/borrowRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));

// Root endpoint test
app.get('/', (req, res) => {
  res.send('Smart Library System API is running...');
});

// Port configuration (Single declaration)
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;