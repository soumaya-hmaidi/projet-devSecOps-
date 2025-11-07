const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validationErrorHandler');

// Option ID validation
const validateOptionId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid option ID'),
  handleValidationErrors
];

// Question ID validation for options
const validateQuestionId = [
  param('questionId')
    .isInt({ min: 1 })
    .withMessage('Invalid question ID'),
  handleValidationErrors
];

// Create option validation
const validateCreateOption = [
  body('text')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Option text must be between 1 and 500 characters'),
  body('isCorrect')
    .optional()
    .isBoolean()
    .withMessage('isCorrect must be a boolean'),
  body('order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer'),
  handleValidationErrors
];

// Update option validation
const validateUpdateOption = [
  body('text')
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Option text must be between 1 and 500 characters'),
  body('isCorrect')
    .optional()
    .isBoolean()
    .withMessage('isCorrect must be a boolean'),
  body('order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer'),
  handleValidationErrors
];

module.exports = {
  validateOptionId,
  validateQuestionId,
  validateCreateOption,
  validateUpdateOption
};

