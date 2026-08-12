const Borrow = require('../models/Borrow');
const Book = require('../models/Book');
const Reservation = require('../models/Reservation');

// @desc    Reserve a book for pickup
// @route   POST /api/v1/student/reserve
exports.reserveBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ success: false, message: 'No copies available for reservation' });
    }

    const existing = await Reservation.findOne({ user: userId, book: bookId, status: 'PENDING' });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have an active reservation for this book.' });
    }

    const reservation = await Reservation.create({ user: userId, book: bookId });

    res.status(201).json({
      success: true,
      message: 'Book reserved successfully! Collect at main circulation counter.',
      data: reservation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user active reservations
// @route   GET /api/v1/student/reservations
exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate('book', 'title author coverImage shelfNumber availableCopies')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reservations.length, data: reservations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel a reservation
// @route   DELETE /api/v1/student/reserve/:id
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    res.status(200).json({ success: true, message: 'Reservation cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Pay student outstanding fine
// @route   POST /api/v1/student/pay-fine
exports.payFine = async (req, res) => {
  try {
    await Borrow.updateMany(
      { user: req.user.id, isFinePaid: false },
      { $set: { fineAmount: 0, isFinePaid: true } }
    );

    res.status(200).json({ success: true, message: 'Outstanding fine cleared successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};