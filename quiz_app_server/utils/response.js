// Success response helper
const successResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message
  };
  
  if (data) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

// Error response helper
const errorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

// Validation error response
const validationErrorResponse = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors: errors.array()
  });
};

// Server error response
const serverErrorResponse = (res, error) => {
  console.error('Server error:', error);
  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};

module.exports = {
  successResponse,
  errorResponse,
  validationErrorResponse,
  serverErrorResponse
};
