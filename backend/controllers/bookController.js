const Book = require('../models/Book');

// @desc    Get all books
// @route   GET /api/v1/books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get book by ID
// @route   GET /api/v1/books/:id
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    return res.status(200).json({ success: true, data: book });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add new book
// @route   POST /api/v1/books
exports.addBook = async (req, res) => {
  try {
    const { title, author, isbn, category, copies } = req.body;
    if (!title || !author) {
      return res.status(400).json({ success: false, message: 'Title and Author are required.' });
    }

    const numCopies = Number(copies) || 1;
    const newBook = await Book.create({
      title,
      author,
      isbn: isbn || `ISBN-${Date.now()}`,
      category: category || 'General',
      copies: numCopies,
      availableCopies: numCopies,
    });

    return res.status(201).json({ success: true, data: newBook });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update book
// @route   PUT /api/v1/books/:id
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    return res.status(200).json({ success: true, data: book });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete book
// @route   DELETE /api/v1/books/:id
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    return res.status(200).json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};