const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateCreateQuiz, validateUpdateQuiz, validateQuizId } = require('../validators/quizValidator');
const { 
  getAllQuizzes, 
  getQuizById, 
  createQuiz, 
  updateQuiz, 
  deleteQuiz, 
  getAllQuizzesForAdmin 
} = require('../controllers/quizController');

const router = express.Router();

// Get all quizzes (for students)
router.get('/', authenticateToken, getAllQuizzes);

// Get quiz by ID with questions
router.get('/:id', authenticateToken, validateQuizId, getQuizById);

// Create quiz (Admin only)
router.post('/', authenticateToken, requireAdmin, validateCreateQuiz, createQuiz);

// Update quiz (Admin only)
router.put('/:id', authenticateToken, requireAdmin, validateUpdateQuiz, updateQuiz);

// Delete quiz (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, validateQuizId, deleteQuiz);

// Get all quizzes for admin (including inactive)
router.get('/admin/all', authenticateToken, requireAdmin, getAllQuizzesForAdmin);

module.exports = router;
