const Book = require('../models/Book');

// @desc    Get all books from catalog
// @route   GET /api/v1/books
// @access  Public / Member
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching catalog',
      error: error.message,
    });
  }
};

// @desc    Get single book by ID
// @route   GET /api/v1/books/:id
// @access  Public / Member
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching book details',
      error: error.message,
    });
  }
};

// @desc    Add new book permanently to database
// @route   POST /api/v1/books
// @access  Private (Admin / Librarian)
exports.addBook = async (req, res) => {
  try {
    const { title, author, isbn, category, copies } = req.body;

    if (!title || !author) {
      return res.status(400).json({
        success: false,
        message: 'Title and Author are required fields.',
      });
    }

    const numCopies = Number(copies) || 1;

    // Create and save new book document directly to MongoDB Atlas
    const newBook = await Book.create({
      title,
      author,
      isbn: isbn || `ISBN-${Date.now()}`,
      category: category || 'General',
      copies: numCopies,
      availableCopies: numCopies,
    });

    return res.status(201).json({
      success: true,
      message: 'Book successfully added and saved permanently to catalog.',
      data: newBook,
    });
  } catch (error) {
    console.error('Error adding book:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save book to database',
      error: error.message,
    });
  }
};

// @desc    Update book details
// @route   PUT /api/v1/books/:id
// @access  Private (Admin / Librarian)
exports.updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book,
    });
  } catch (error) {
    console.error('Error updating book:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update book details',
      error: error.message,
    });
  }
};

// @desc    Delete book from catalog
// @route   DELETE /api/v1/books/:id
// @access  Private (Admin / Librarian)
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    await book.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Book removed permanently from catalog',
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete book from database',
      error: error.message,
    });
  }
};