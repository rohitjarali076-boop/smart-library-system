const Borrow = require('../models/Borrow');
const Book = require('../models/Book');
const User = require('../models/User');

// @desc    Issue book to a student (Manual Name or Registered User)
// @route   POST /api/v1/borrow/issue
// @access  Private (Admin / Librarian)
exports.issueBook = async (req, res) => {
  try {
    const { studentName, bookId, days = 14 } = req.body;

    if (!studentName || !bookId) {
      return res.status(400).json({
        success: false,
        message: 'Student Name and Book selection are required.',
      });
    }

    const query = studentName.trim();

    // Look for matching registered user if available
    const student = await User.findOne({
      $or: [
        { name: { $regex: `^${query}$`, $options: 'i' } },
        { memberId: query },
        { email: query },
      ],
    });

    // Check book availability
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const currentCopies = book.availableCopies !== undefined ? book.availableCopies : (book.copies || 1);
    if (currentCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: `No available copies left for "${book.title}"`,
      });
    }

    // Calculate Due Date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Number(days));

    // Save borrow record permanently
    const borrowRecord = await Borrow.create({
      user: student ? student._id : null,
      studentName: student ? student.name : query,
      book: book._id,
      bookTitle: book.title,
      dueDate,
      status: 'BORROWED',
    });

    // Reduce available copies in database
    book.availableCopies = Math.max(0, currentCopies - 1);
    await book.save();

    return res.status(201).json({
      success: true,
      message: `Successfully issued "${book.title}" to ${query}`,
      data: borrowRecord,
    });
  } catch (error) {
    console.error('Error issuing book:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while issuing book',
    });
  }
};