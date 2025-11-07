const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { 
  AppError, 
  ValidationError, 
  AuthenticationError, 
  ConflictError,
  asyncHandler 
} = require('../middleware/errorHandler');

const prisma = new PrismaClient();

// Register user
const register = asyncHandler(async (req, res) => {
  const { email, password, name, role = 'STUDENT' } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';

  console.log(`📝 Registration attempt from IP: ${clientIP}`);
  console.log(`📧 Email: ${email}`);
  console.log(`👤 Name: ${name}`);
  console.log(`🎭 Role: ${role}`);
  console.log(`🌐 User Agent: ${userAgent}`);
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log(`❌ Registration failed: User already exists for email: ${email}`);
      throw new ConflictError('User already exists');
    }

    console.log(`✅ Email available for registration: ${email}`);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`🔐 Password hashed successfully for: ${email}`);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    console.log(`👤 User created successfully: ${user.name} (${user.email}) - Role: ${user.role}`);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`🎫 JWT token generated for new user: ${user.name}`);
    console.log(`✅ Registration successful: ${user.name} (${user.email}) - Role: ${user.role}`);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.log(`💥 Registration error for ${email}:`, error.message);
    throw error;
  }
});

// Login user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';

  console.log(`🔐 Login attempt from IP: ${clientIP}`);
  console.log(`📧 Email: ${email}`);
  console.log(`🌐 User Agent: ${userAgent}`);
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log(`❌ Login failed: User not found for email: ${email}`);
      throw new AuthenticationError('Invalid credentials');
    }

    console.log(`👤 User found: ${user.name} (${user.email}) - Role: ${user.role}`);

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.log(`❌ Login failed: Invalid password for user: ${email}`);
      throw new AuthenticationError('Invalid credentials');
    }

    console.log(`✅ Password verified for user: ${email}`);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`🎫 JWT token generated for user: ${user.name}`);
    console.log(`✅ Login successful: ${user.name} (${user.email}) - Role: ${user.role}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.log(`💥 Login error for ${email}:`, error.message);
    throw error;
  }
});

// Get current user
const getCurrentUser = asyncHandler(async (req, res) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';

  console.log(`👤 Current user request from IP: ${clientIP}`);
  console.log(`👤 User: ${req.user.name} (${req.user.email}) - Role: ${req.user.role}`);
  console.log(`🌐 User Agent: ${userAgent}`);
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

  res.json({
    success: true,
    message: 'User retrieved successfully',
    data: {
      user: req.user
    }
  });
});

module.exports = {
  register,
  login,
  getCurrentUser
};
