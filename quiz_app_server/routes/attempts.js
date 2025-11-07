const express = require('express');
const { authenticateToken, requireStudent } = require('../middleware/auth');
const { 
  validateStartAttempt, 
  validateSubmitAnswer, 
  validateSubmitAttempt,
  validateCompleteAttempt, 
  validateAttemptId 
} = require('../validators/attemptValidator');
const { 
  startAttempt, 
  submitAnswer, 
  submitAttempt,
  completeAttempt, 
  getUserAttempts, 
  getAttemptById 
} = require('../controllers/attemptController');

const router = express.Router();

// Start quiz attempt
router.post('/start', authenticateToken, requireStudent, validateStartAttempt, startAttempt);

// Submit answer
router.post('/:attemptId/answers', authenticateToken, requireStudent, validateSubmitAnswer, submitAnswer);

// Submit all answers and complete attempt
router.post('/:attemptId/submit', authenticateToken, requireStudent, validateSubmitAttempt, submitAttempt);

// Complete quiz attempt
router.post('/:attemptId/complete', authenticateToken, requireStudent, validateCompleteAttempt, completeAttempt);

// Get user's attempts
router.get('/my-attempts', authenticateToken, requireStudent, getUserAttempts);

// Get attempt details
router.get('/:attemptId', authenticateToken, requireStudent, validateAttemptId, getAttemptById);

module.exports = router;
