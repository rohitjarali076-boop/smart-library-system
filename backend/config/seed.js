const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');

dotenv.config();

const demoBooks = [
  {
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    category: 'Computer Science',
    shelfNumber: 'CS-101',
    totalCopies: 5,
    availableCopies: 5,
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
    description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees.'
  },
  {
    title: 'Data Structures and Algorithms in Python',
    author: 'Michael T. Goodrich',
    isbn: '978-1118290279',
    category: 'Data Structures',
    shelfNumber: 'DS-201',
    totalCopies: 4,
    availableCopies: 4,
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500',
    description: 'A comprehensive guide on fundamental data structures, algorithms, stacks, queues, trees, and graphs.'
  },
  {
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell & Peter Norvig',
    isbn: '978-0134610993',
    category: 'Artificial Intelligence',
    shelfNumber: 'AI-301',
    totalCopies: 3,
    availableCopies: 3,
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500',
    description: 'The leading textbook in Artificial Intelligence covering intelligent agents, search algorithms, and machine learning.'
  },
  {
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
    isbn: '978-0201633610',
    category: 'Software Engineering',
    shelfNumber: 'SE-104',
    totalCopies: 6,
    availableCopies: 6,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
    description: 'Captures solutions to common software design problems in object-oriented development.'
  },
  {
    title: 'Full-Stack React, Node, and MongoDB Development',
    author: 'Robin Wieruch',
    isbn: '978-1789132220',
    category: 'Web Development',
    shelfNumber: 'WD-202',
    totalCopies: 5,
    availableCopies: 5,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500',
    description: 'Practical guide to building modern full-stack web applications using MERN stack.'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartlib');
    console.log('MongoDB Connected for seeding...');

    for (const book of demoBooks) {
      await Book.updateOne({ isbn: book.isbn }, { $setOnInsert: book }, { upsert: true });
    }

    console.log('✅ Demo books added/updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding books:', error.message);
    process.exit(1);
  }
};

seedDB();