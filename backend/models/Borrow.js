const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Made optional so unregistered student names work
    },
    studentName: {
      type: String,
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    bookTitle: {
      type: String,
    },
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
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