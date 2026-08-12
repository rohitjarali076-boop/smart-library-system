const express = require('express');
const router = express.Router();
const { issueBook, getMyBorrows, returnBook, renewBook, getAllBorrows } = require('../controllers/borrowController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/my-books', getMyBorrows);
router.put('/renew/:id', renewBook);

router.get('/all', authorize('ADMIN', 'LIBRARIAN'), getAllBorrows);
router.post('/issue', authorize('ADMIN', 'LIBRARIAN'), issueBook);
router.put('/return/:id', authorize('ADMIN', 'LIBRARIAN'), returnBook);

module.exports = router;