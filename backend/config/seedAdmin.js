const dns = require('dns');
// Force Node.js to use Google DNS for MongoDB Atlas SRV lookup
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const seedUsers = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/smartlib';
    console.log('Connecting to MongoDB Atlas...');

    await mongoose.connect(mongoUri);
    console.log('Connected successfully!');

    // 1. Create/Update Admin Account
    const adminExists = await User.findOne({ email: 'admin@smartlib.edu' });
    if (!adminExists) {
      await User.create({
        name: 'System Administrator',
        email: 'admin@smartlib.edu',
        password: 'AdminPassword123',
        role: 'ADMIN',
        memberId: 'LIB-ADMIN-001',
        department: 'Library Administration'
      });
      console.log('✅ Admin user created: admin@smartlib.edu');
    } else {
      console.log('ℹ️ Admin user already exists.');
    }

    // 2. Create/Update Student Demo Account
    const studentExists = await User.findOne({ email: 'alex@smartlib.edu' });
    if (!studentExists) {
      await User.create({
        name: 'Alex Johnson',
        email: 'alex@smartlib.edu',
        password: 'StudentPassword123',
        role: 'MEMBER',
        memberId: 'LIB-2026-0042',
        department: 'Computer Science'
      });
      console.log('✅ Student demo user created: alex@smartlib.edu');
    } else {
      console.log('ℹ️ Student demo user already exists.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    process.exit(1);
  }
};

seedUsers();