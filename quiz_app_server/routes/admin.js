const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { 
  getAllQuizzesForAdmin,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz
} = require('../controllers/quizController');
const { 
  getDashboardStats,
  getQuizStats,
  getUserStats,
  getAnalytics
} = require('../controllers/statsController');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireRole('ADMIN'));

// Quiz Management Routes
router.get('/quizzes', getAllQuizzesForAdmin);
router.get('/quizzes/:id', getQuizById);
router.post('/quizzes', createQuiz);
router.put('/quizzes/:id', updateQuiz);
router.delete('/quizzes/:id', deleteQuiz);

// Dashboard Routes
router.get('/dashboard/stats', getDashboardStats);
router.get('/analytics/quiz/:id', getQuizStats);
router.get('/analytics/user/:id', getUserStats);
router.get('/analytics/system', getAnalytics);

module.exports = router;
