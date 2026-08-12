const Borrow = require('../models/Borrow');
const Book = require('../models/Book');
const User = require('../models/User');

// @desc    Issue book to a student
// @route   POST /api/v1/borrow/issue
// @access  Private (Admin / Librarian)
exports.issueBook = async (req, res) => {
  try {
    const { userId, bookId, days = 14 } = req.body;

    // 1. Verify student exists
    const student = await User.findById(userId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student user not found' });
    }

    // 2. Verify book exists and has copies
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ success: false, message: 'No available copies of this book left' });
    }

    // 3. Calculate Due Date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Number(days));

    // 4. Create Borrow Record
    const borrowRecord = await Borrow.create({
      user: userId,
      book: bookId,
      dueDate,
      status: 'BORROWED',
    });

    // 5. Decrement available copies
    book.availableCopies -= 1;
    await book.save();

    return res.status(201).json({
      success: true,
      message: `Successfully issued "${book.title}" to ${student.name}`,
      data: borrowRecord,
    });
  } catch (error) {
    console.error('Error issuing book:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all issuing records (Who took which book)
// @route   GET /api/v1/borrow/all
// @access  Private (Admin / Librarian)
exports.getAllBorrows = async (req, res) => {
  try {
    const records = await Borrow.find()
      .populate('user', 'name email department memberId')
      .populate('book', 'title author category')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};