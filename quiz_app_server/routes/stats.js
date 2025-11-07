const express = require('express');
const router = express.Router();
const { getDashboardStats, getQuizStats, getUserStats, getAnalytics } = require('../controllers/statsController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// All stats routes require authentication and admin role
router.use(authenticateToken);
router.use(requireRole('ADMIN'));

// Dashboard statistics
router.get('/dashboard', getDashboardStats);

// Quiz statistics
router.get('/quizzes', getQuizStats);

// User statistics
router.get('/users', getUserStats);

// Analytics data
router.get('/analytics', getAnalytics);

module.exports = router;
