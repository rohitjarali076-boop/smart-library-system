const express = require('express');
const router = express.Router();
const { issueBook, getAllBorrows } = require('../controllers/borrowController');

router.post('/issue', issueBook);
router.get('/all', getAllBorrows);

module.exports = router;