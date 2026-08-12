const express = require('express');
const router = express.Router();
const { getAdminDashboardStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/stats', getAdminDashboardStats);

module.exports = router;