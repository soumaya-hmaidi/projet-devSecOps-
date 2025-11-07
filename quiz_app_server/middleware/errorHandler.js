const { Prisma } = require('@prisma/client');

// Custom error classes
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400);
    this.errors = errors;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

// Handle Prisma errors
const handlePrismaError = (error) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return new ConflictError('A record with this information already exists');
      case 'P2025':
        return new NotFoundError('Record not found');
      case 'P2003':
        return new ValidationError('Invalid reference to related record');
      default:
        return new AppError('Database operation failed', 500);
    }
  }
  
  if (error instanceof Prisma.PrismaClientValidationError) {
    return new ValidationError('Invalid data provided');
  }
  
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new AppError('Database connection failed', 500);
  }
  
  return error;
};

// Handle JWT errors
const handleJWTError = (error) => {
  if (error.name === 'JsonWebTokenError') {
    return new AuthenticationError('Invalid token');
  }
  if (error.name === 'TokenExpiredError') {
    return new AuthenticationError('Token expired');
  }
  return error;
};

// Handle validation errors
const handleValidationError = (error) => {
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message
    }));
    return new ValidationError('Validation failed', errors);
  }
  return error;
};

// Main error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle specific error types
  if (err instanceof Prisma.PrismaClientKnownRequestError || 
      err instanceof Prisma.PrismaClientValidationError ||
      err instanceof Prisma.PrismaClientInitializationError) {
    error = handlePrismaError(err);
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    error = handleJWTError(err);
  }

  if (err.name === 'ValidationError') {
    error = handleValidationError(err);
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ConflictError(`${field} already exists`);
  }

  // Handle cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    error = new ValidationError('Invalid ID format');
  }

  // Default to 500 server error
  if (!error.statusCode) {
    error.statusCode = 500;
    error.message = 'Internal server error';
  }

  // Send error response
  const response = {
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  // Add validation errors if they exist
  if (error.errors && error.errors.length > 0) {
    response.errors = error.errors;
  }

  res.status(error.statusCode).json(response);
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler for undefined routes
const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  errorHandler,
  asyncHandler,
  notFoundHandler
};
