const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Book = require('../models/Book');

dotenv.config();

const sampleCategories = [
  { name: 'Computer Science', description: 'Programming, Software Engineering, Architecture' },
  { name: 'Artificial Intelligence', description: 'Machine Learning, Deep Learning, Neural Networks' },
  { name: 'Data Structures', description: 'Algorithms, Complexity, Optimization' },
  { name: 'Web Development', description: 'Frontend, Backend, APIs, Cloud' }
];

const seedDatabase = async () => {
  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('🍃 Connected to MongoDB Atlas successfully!');

    console.log('🧹 Clearing old database entries...');
    await User.deleteMany();
    await Category.deleteMany();
    await Book.deleteMany();

    console.log('👤 Creating default Admin and Student users...');
    await User.create({
      name: 'Library Admin',
      email: 'admin@smartlib.edu',
      password: 'AdminPassword123',
      role: 'ADMIN',
      memberId: 'LIB-ADMIN-001',
      department: 'Library Administration'
    });

    await User.create({
      name: 'Rohit Student',
      email: 'rohit@university.edu',
      password: 'StudentPassword123',
      role: 'MEMBER',
      memberId: 'LIB-2026-0001',
      department: 'Computer Science'
    });

    console.log('📁 Creating Categories...');
    const createdCategories = await Category.insertMany(sampleCategories);
    
    const csCategory = createdCategories.find(c => c.name === 'Computer Science')._id;
    const aiCategory = createdCategories.find(c => c.name === 'Artificial Intelligence')._id;
    const dsCategory = createdCategories.find(c => c.name === 'Data Structures')._id;

    console.log('📚 Seeding Books Catalog...');
    await Book.create([
      {
        isbn: '978-0132350884',
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        category: csCategory,
        publisher: 'Prentice Hall',
        description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees.',
        coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop',
        totalCopies: 5,
        availableCopies: 4,
        shelfNumber: 'CS-102',
        rating: 4.9,
        status: 'AVAILABLE'
      },
      {
        isbn: '978-0134685991',
        title: 'Effective Java',
        author: 'Joshua Bloch',
        category: csCategory,
        publisher: 'Addison-Wesley',
        description: 'The definitive guide to Java platform best practices.',
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
        totalCopies: 3,
        availableCopies: 3,
        shelfNumber: 'CS-204',
        rating: 4.8,
        status: 'AVAILABLE'
      },
      {
        isbn: '978-0134610993',
        title: 'Artificial Intelligence: A Modern Approach',
        author: 'Stuart Russell, Peter Norvig',
        category: aiCategory,
        publisher: 'Pearson',
        description: 'The long-anticipated revision of this best-selling introduction to Artificial Intelligence.',
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop',
        totalCopies: 4,
        availableCopies: 1,
        shelfNumber: 'AI-501',
        rating: 4.95,
        status: 'AVAILABLE'
      },
      {
        isbn: '978-0262033848',
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        category: dsCategory,
        publisher: 'MIT Press',
        description: 'A comprehensive update of the leading textbook on computer algorithms.',
        coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop',
        totalCopies: 6,
        availableCopies: 6,
        shelfNumber: 'DS-201',
        rating: 4.85,
        status: 'AVAILABLE'
      }
    ]);

    console.log('\n==================================================');
    console.log('✅ DATABASE SEEDED SUCCESSFULLY WITH SAMPLE DATA!');
    console.log('==================================================');
    console.log('🔑 Default Admin Credentials:');
    console.log('   Email: admin@smartlib.edu | Password: AdminPassword123');
    console.log('🔑 Default Student Credentials:');
    console.log('   Email: rohit@university.edu | Password: StudentPassword123');
    console.log('==================================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();