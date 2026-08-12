const User = require('../models/User');
const Book = require('../models/Book');

exports.getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMembers = await User.countDocuments({ role: 'MEMBER' });
    const totalBooks = await Book.countDocuments();

    const booksInventory = await Book.aggregate([
      {
        $group: {
          _id: null,
          totalCopies: { $sum: '$totalCopies' },
          availableCopies: { $sum: '$availableCopies' }
        }
      }
    ]);

    const totalCopies = booksInventory[0]?.totalCopies || 0;
    const totalAvailableCopies = booksInventory[0]?.availableCopies || 0;
    const totalBorrowedCopies = totalCopies - totalAvailableCopies;

    const outOfStockBooks = await Book.find({ availableCopies: 0 }).select('title isbn shelfNumber');
    const recentMembers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');

    res.status(200).json({
      success: true,
      data: {
        users: { total: totalUsers, members: totalMembers, recent: recentMembers },
        catalog: {
          uniqueTitles: totalBooks,
          totalCopies,
          availableCopies: totalAvailableCopies,
          borrowedCopies: totalBorrowedCopies,
          outOfStockCount: outOfStockBooks.length,
          outOfStockBooks
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};