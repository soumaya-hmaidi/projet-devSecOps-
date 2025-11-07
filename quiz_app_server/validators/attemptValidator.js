const { body, param, validationResult } = require('express-validator');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Start attempt validation
const validateStartAttempt = [
  body('quizId')
    .isInt({ min: 1 })
    .withMessage('Invalid quiz ID'),
  handleValidationErrors
];

// Submit answer validation
const validateSubmitAnswer = [
  param('attemptId')
    .isInt({ min: 1 })
    .withMessage('Invalid attempt ID'),
  body('questionId')
    .isInt({ min: 1 })
    .withMessage('Invalid question ID'),
  body('optionId')
    .optional()
    .custom((value) => {
      if (value === undefined || value === null) return true;
      const num = parseInt(value, 10);
      return !isNaN(num) && num >= 1;
    })
    .withMessage('Invalid option ID'),
  body('textAnswer')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Text answer must be less than 1000 characters'),
  handleValidationErrors
];

// Submit attempt validation
const validateSubmitAttempt = [
  param('attemptId')
    .isInt({ min: 1 })
    .withMessage('Invalid attempt ID'),
  body('answers')
    .isObject()
    .withMessage('Answers must be an object'),
  handleValidationErrors
];

// Complete attempt validation
const validateCompleteAttempt = [
  param('attemptId')
    .isInt({ min: 1 })
    .withMessage('Invalid attempt ID'),
  handleValidationErrors
];

// Attempt ID validation
const validateAttemptId = [
  param('attemptId')
    .isInt({ min: 1 })
    .withMessage('Invalid attempt ID'),
  handleValidationErrors
];

module.exports = {
  validateStartAttempt,
  validateSubmitAnswer,
  validateSubmitAttempt,
  validateCompleteAttempt,
  validateAttemptId,
  handleValidationErrors
};
