const express = require('express');
const router = express.Router();

// Example user route placeholder
router.get('/profile', (req, res) => {
  res.json({ message: 'User profile endpoint' });
});

module.exports = router;