const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the Book model (or 'Book' depending on model name)
      ref: 'Book',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['BORROWED', 'RETURNED', 'OVERDUE'],
      default: 'BORROWED',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Borrow', borrowSchema);