const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Main API v1 Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/books', require('./routes/bookRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));
app.use('/api/v1/borrows', require('./routes/borrowRoutes'));
app.use('/api/v1/student', require('./routes/studentRoutes'));

// Fallbacks
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/borrows', require('./routes/borrowRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Library System API Online' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`==================================================\n`);
});