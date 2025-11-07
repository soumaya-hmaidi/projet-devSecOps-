const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const { register, login, getCurrentUser } = require('../controllers/authController');

const router = express.Router();

// Register
router.post('/register', validateRegister, register);

// Login
router.post('/login', validateLogin, login);

// Get current user
router.get('/me', authenticateToken, getCurrentUser);

module.exports = router;
