const Borrow = require('../models/Borrow');
const Book = require('../models/Book');
const User = require('../models/User');

exports.issueBook = async (req, res) => {
  try {
    const { memberId, bookId } = req.body;

    const user = await User.findOne({ memberId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Member ID not found' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ success: false, message: 'No copies available for this book' });
    }

    const activeBorrows = await Borrow.countDocuments({ user: user._id, status: 'ISSUED' });
    if (activeBorrows >= user.maxAllowedBooks) {
      return res.status(400).json({ success: false, message: `Member limit reached (${user.maxAllowedBooks} max)` });
    }

    book.availableCopies -= 1;
    await book.save();

    const borrow = await Borrow.create({ user: user._id, book: book._id });

    res.status(201).json({ success: true, message: 'Book issued successfully', data: borrow });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find({ user: req.user.id })
      .populate('book', 'title author coverImage isbn shelfNumber')
      .sort({ createdAt: -1 });

    const now = new Date();
    const updatedBorrows = borrows.map(b => {
      const obj = b.toObject();
      if (obj.status === 'ISSUED' && new Date(obj.dueDate) < now) {
        const diffDays = Math.ceil((now - new Date(obj.dueDate)) / (1000 * 60 * 60 * 24));
        obj.fineAmount = diffDays * 10;
        obj.status = 'OVERDUE';
      }
      return obj;
    });

    res.status(200).json({ success: true, count: updatedBorrows.length, data: updatedBorrows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ success: false, message: 'Borrow record not found' });
    }

    if (borrow.status === 'RETURNED') {
      return res.status(400).json({ success: false, message: 'Book already returned' });
    }

    borrow.status = 'RETURNED';
    borrow.returnDate = new Date();
    await borrow.save();

    const book = await Book.findById(borrow.book);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    res.status(200).json({ success: true, message: 'Book returned successfully', data: borrow });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.renewBook = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ success: false, message: 'Borrow record not found' });
    }

    borrow.dueDate = new Date(new Date(borrow.dueDate).getTime() + 7 * 24 * 60 * 60 * 1000);
    await borrow.save();

    res.status(200).json({ success: true, message: 'Due date extended by 7 days', data: borrow });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllBorrows = async (req, res) => {
  try {
    const { department } = req.query;
    let query = {};

    if (department && department !== 'ALL') {
      const usersInDept = await User.find({ department }).select('_id');
      const userIds = usersInDept.map(u => u._id);
      query.user = { $in: userIds };
    }

    const borrows = await Borrow.find(query)
      .populate('user', 'name memberId department email')
      .populate('book', 'title author isbn shelfNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: borrows.length, data: borrows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};