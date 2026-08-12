const Borrow = require('../models/Borrow');
const Book = require('../models/Book');
const User = require('../models/User');

// @desc    Issue book to a student (Manual Name or Registered Member)
// @route   POST /api/v1/borrow/issue
// @access  Private (Admin / Librarian)
exports.issueBook = async (req, res) => {
  try {
    const { studentName, bookId, days = 14 } = req.body;

    if (!studentName || !bookId) {
      return res.status(400).json({
        success: false,
        message: 'Student name and book selection are required.',
      });
    }

    const query = studentName.trim();

    // Check if user exists in database
    let student = null;
    try {
      student = await User.findOne({
        $or: [
          { name: { $regex: `^${query}$`, $options: 'i' } },
          { memberId: query },
          { email: query },
        ],
      });
    } catch (err) {
      console.log('User query skipped:', err.message);
    }

    // Find Book
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

    // Due Date Calculation
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Number(days));

    // Save Borrow Record
    const borrowRecord = await Borrow.create({
      user: student ? student._id : null,
      studentName: student ? student.name : query,
      book: book._id,
      bookTitle: book.title,
      dueDate,
      status: 'BORROWED',
    });

    // Deduct available copies
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
      message: error.message || 'Server error occurred while issuing book',
    });
  }
};

// @desc    Get all borrow records
// @route   GET /api/v1/borrow/all
// @access  Private (Admin / Librarian)
exports.getAllBorrows = async (req, res) => {
  try {
    const records = await Borrow.find()
      .populate('user', 'name email memberId')
      .populate('book', 'title author category')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};