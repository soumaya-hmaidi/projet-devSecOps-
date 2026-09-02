const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const {
  getAllQuizzesForAdmin,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  publishQuiz,
  unpublishQuiz
} = require('../controllers/quizController');
const { createQuestion } = require('../controllers/questionController');
const {
  getDashboardStats,
  getQuizStats,
  getUserStats,
  getAnalytics
} = require('../controllers/statsController');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireRole('ADMIN'));

// Quiz Management Routes
router.get('/quizzes', getAllQuizzesForAdmin);
router.get('/quizzes/:id', getQuizById);
router.post('/quizzes', createQuiz);
router.put('/quizzes/:id', updateQuiz);
router.post('/quizzes/:id/publish', publishQuiz);
router.post('/quizzes/:id/unpublish', unpublishQuiz);
router.delete('/quizzes/:id', deleteQuiz);
router.post('/quizzes/:id/questions', (req, res, next) => {
  req.body.quizId = parseInt(req.params.id);
  next();
}, createQuestion);

// User Management Routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Dashboard Routes
router.get('/dashboard/stats', getDashboardStats);
router.get('/analytics/quiz/:id', getQuizStats);
router.get('/analytics/user/:id', getUserStats);
router.get('/analytics/system', getAnalytics);

module.exports = router;
