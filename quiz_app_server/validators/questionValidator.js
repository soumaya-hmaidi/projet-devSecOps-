const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validationErrorHandler');

// Question ID validation
const validateQuestionId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid question ID'),
  handleValidationErrors
];

// Create question validation
const validateCreateQuestion = [
  body('question')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Question text must be between 1 and 1000 characters'),
  body('type')
    .isIn(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'TEXT'])
    .withMessage('Invalid question type'),
  body('points')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Points must be between 1 and 100'),
  body('order')
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer'),
  body('quizId')
    .isInt({ min: 1 })
    .withMessage('Invalid quiz ID'),
  body('options')
    .optional()
    .isArray()
    .withMessage('Options must be an array'),
  body('options.*.text')
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Option text must be between 1 and 500 characters'),
  body('options.*.isCorrect')
    .optional()
    .isBoolean()
    .withMessage('isCorrect must be a boolean'),
  body('options.*.order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Option order must be a positive integer'),
  handleValidationErrors
];

// Update question validation
const validateUpdateQuestion = [
  body('question')
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Question text must be between 1 and 1000 characters'),
  body('type')
    .optional()
    .isIn(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'TEXT'])
    .withMessage('Invalid question type'),
  body('points')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Points must be between 1 and 100'),
  body('order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer'),
  body('options')
    .optional()
    .isArray()
    .withMessage('Options must be an array'),
  body('options.*.text')
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Option text must be between 1 and 500 characters'),
  body('options.*.isCorrect')
    .optional()
    .isBoolean()
    .withMessage('isCorrect must be a boolean'),
  body('options.*.order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Option order must be a positive integer'),
  handleValidationErrors
];

module.exports = {
  validateQuestionId,
  validateCreateQuestion,
  validateUpdateQuestion
};
