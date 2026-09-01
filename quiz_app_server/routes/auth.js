const express = require('express');
const rateLimit = require('express-rate-limit');
const { authenticateToken } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const { register, login, getCurrentUser } = require('../controllers/authController');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { success: false, message: 'Too many attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Register
router.post('/register', authLimiter, validateRegister, register);

// Login
router.post('/login', authLimiter, validateLogin, login);

// Get current user
router.get('/me', authenticateToken, getCurrentUser);

module.exports = router;
