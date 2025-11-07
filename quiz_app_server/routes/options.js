const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { 
  validateOptionId, 
  validateQuestionId, 
  validateCreateOption, 
  validateUpdateOption 
} = require('../validators/optionValidator');
const { 
  getOptionById,
  createOption,
  updateOption,
  deleteOption,
  getOptionsByQuestion
} = require('../controllers/optionController');

const router = express.Router();

// All option routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Option Management Routes
// Get option by ID
router.get('/:id', validateOptionId, getOptionById);

// Create option for a question
router.post('/questions/:questionId', validateQuestionId, validateCreateOption, createOption);

// Update option
router.put('/:id', validateOptionId, validateUpdateOption, updateOption);

// Delete option
router.delete('/:id', validateOptionId, deleteOption);

// Get all options for a question
router.get('/questions/:questionId/all', validateQuestionId, getOptionsByQuestion);

module.exports = router;

