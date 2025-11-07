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

// Quiz creation validation
const validateCreateQuiz = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('questions')
    .isArray({ min: 1 })
    .withMessage('At least one question is required'),
  body('questions.*.question')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Question must be between 5 and 500 characters'),
  body('questions.*.type')
    .isIn(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'TEXT'])
    .withMessage('Question type must be MULTIPLE_CHOICE, TRUE_FALSE, or TEXT'),
  body('questions.*.points')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Points must be between 1 and 10'),
  body('questions.*.options')
    .if(body('questions.*.type').isIn(['MULTIPLE_CHOICE', 'TRUE_FALSE']))
    .isArray({ min: 2 })
    .withMessage('Multiple choice and true/false questions must have at least 2 options'),
  body('questions.*.options.*.text')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Option text must be between 1 and 200 characters'),
  body('questions.*.options.*.isCorrect')
    .isBoolean()
    .withMessage('isCorrect must be a boolean'),
  handleValidationErrors
];

// Quiz update validation
const validateUpdateQuiz = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid quiz ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  handleValidationErrors
];

// Quiz ID validation
const validateQuizId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid quiz ID'),
  handleValidationErrors
];

module.exports = {
  validateCreateQuiz,
  validateUpdateQuiz,
  validateQuizId,
  handleValidationErrors
};
