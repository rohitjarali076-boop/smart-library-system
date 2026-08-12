const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a book title'],
      trim: true
    },
    author: {
      type: String,
      required: [true, 'Please add an author'],
      trim: true
    },
    isbn: {
      type: String,
      required: [true, 'Please add an ISBN'],
      unique: true,
      trim: true
    },
    category: {
      type: String,
      default: 'Computer Science'
    },
    totalCopies: {
      type: Number,
      default: 1
    },
    availableCopies: {
      type: Number,
      default: 1
    },
    shelfNumber: {
      type: String,
      default: 'CS-101'
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300'
    },
    description: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);