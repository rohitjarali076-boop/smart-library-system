const express = require('express');
const router = express.Router();
const { 
  reserveBook, 
  getMyReservations, 
  cancelReservation, 
  payFine 
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/reserve', reserveBook);
router.get('/reservations', getMyReservations);
router.delete('/reserve/:id', cancelReservation);
router.post('/pay-fine', payFine);

module.exports = router;