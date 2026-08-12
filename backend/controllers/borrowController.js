const Borrow = require('../models/Borrow');
const Book = require('../models/Book');
const User = require('../models/User');

// @desc    Issue book to a student using Name, Member ID, or Email
// @route   POST /api/v1/borrow/issue
// @access  Private (Admin / Librarian)
exports.issueBook = async (req, res) => {
  try {
    const { studentName, bookId, days = 14 } = req.body;

    if (!studentName || !bookId) {
      return res.status(400).json({
        success: false,
        message: 'Student identifier and Book selection are required.',
      });
    }

    // Search user flexible match by Name, Member ID, or Email
    const query = studentName.trim();
    let student = await User.findOne({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { memberId: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    });

    // Fallback: If no exact user found, create a lightweight borrow record with the provided name
    const userId = student ? student._id : null;
    const displayName = student ? student.name : query;

    // Verify book exists and has available copies
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const currentCopies = book.availableCopies !== undefined ? book.availableCopies : book.copies;
    if (currentCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: `No available copies left for "${book.title}"`,
      });
    }

    // Calculate Due Date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Number(days));

    // Create Borrow Record
    const borrowRecord = await Borrow.create({
      user: userId,
      studentName: displayName,
      book: bookId,
      bookTitle: book.title,
      dueDate,
      status: 'BORROWED',
    });

    // Decrement available copies
    book.availableCopies = Math.max(0, currentCopies - 1);
    await book.save();

    return res.status(201).json({
      success: true,
      message: `Successfully issued "${book.title}" to ${displayName}`,
      data: borrowRecord,
    });
  } catch (error) {
    console.error('Error issuing book:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to issue book',
    });
  }
};