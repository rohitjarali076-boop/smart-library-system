const express = require('express');
const router = express.Router();
const { getBooks, getBookById, createBook, updateBook } = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getBooks);
router.get('/:id', getBookById);
router.post('/', protect, authorize('ADMIN', 'LIBRARIAN'), createBook);
router.put('/:id', protect, authorize('ADMIN', 'LIBRARIAN'), updateBook);

module.exports = router;