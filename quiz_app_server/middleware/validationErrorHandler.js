const { validationResult } = require('express-validator');

// Handle express-validator errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
      location: error.location
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }
  
  next();
};

// Custom validation for specific scenarios
const validateQuizAttempt = (req, res, next) => {
  const { quizId } = req.body;
  
  if (!quizId) {
    return res.status(400).json({
      success: false,
      message: 'Quiz ID is required',
      errors: [{
        field: 'quizId',
        message: 'Quiz ID is required'
      }]
    });
  }
  
  next();
};

const validateAnswerSubmission = (req, res, next) => {
  const { questionId, optionId, textAnswer } = req.body;
  
  if (!questionId) {
    return res.status(400).json({
      success: false,
      message: 'Question ID is required',
      errors: [{
        field: 'questionId',
        message: 'Question ID is required'
      }]
    });
  }
  
  // For multiple choice and true/false, optionId is required
  // For text questions, textAnswer is required
  if (!optionId && !textAnswer) {
    return res.status(400).json({
      success: false,
      message: 'Either optionId or textAnswer is required',
      errors: [{
        field: 'optionId',
        message: 'Either optionId or textAnswer is required'
      }]
    });
  }
  
  next();
};

module.exports = {
  handleValidationErrors,
  validateQuizAttempt,
  validateAnswerSubmission
};
