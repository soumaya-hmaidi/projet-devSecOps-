const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateQuestionId, validateCreateQuestion, validateUpdateQuestion } = require('../validators/questionValidator');
const { 
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
} = require('../controllers/questionController');

const router = express.Router();

// All question routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Question Management Routes
router.get('/:id', validateQuestionId, getQuestionById);
router.post('/', validateCreateQuestion, createQuestion);
router.put('/:id', validateQuestionId, validateUpdateQuestion, updateQuestion);
router.delete('/:id', validateQuestionId, deleteQuestion);

module.exports = router;
