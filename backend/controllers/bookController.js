const Book = require('../models/Book');

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBook = async (req, res) => {
  try {
    const { title, author, isbn, category, totalCopies, shelfNumber, coverImage, description } = req.body;

    if (!title || !author || !isbn) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields: Title, Author, and ISBN'
      });
    }

    const existingBook = await Book.findOne({ isbn: isbn.trim() });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: `A book with ISBN '${isbn}' already exists in catalog`
      });
    }

    const copies = Number(totalCopies) > 0 ? Number(totalCopies) : 1;

    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      category: category ? category.trim() : 'Computer Science',
      totalCopies: copies,
      availableCopies: copies,
      shelfNumber: shelfNumber ? shelfNumber.trim() : 'CS-101',
      coverImage: coverImage ? coverImage.trim() : 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300',
      description: description ? description.trim() : ''
    });

    res.status(201).json({
      success: true,
      message: 'Book added to catalog successfully!',
      data: book
    });
  } catch (error) {
    console.error('Create Book Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while adding book'
    });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { title, author, isbn, category, totalCopies, shelfNumber, coverImage, description } = req.body;

    let book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (totalCopies !== undefined) {
      const diff = Number(totalCopies) - book.totalCopies;
      book.totalCopies = Number(totalCopies);
      book.availableCopies = Math.max(0, book.availableCopies + diff);
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.isbn = isbn || book.isbn;
    book.category = category || book.category;
    book.shelfNumber = shelfNumber || book.shelfNumber;
    book.coverImage = coverImage || book.coverImage;
    book.description = description !== undefined ? description : book.description;

    await book.save();

    res.status(200).json({
      success: true,
      message: 'Book details updated successfully!',
      data: book
    });
  } catch (error) {
    console.error('Update Book Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};