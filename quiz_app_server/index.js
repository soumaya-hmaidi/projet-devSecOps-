const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { PrismaClient } = require('@prisma/client');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config({ path: '.env.local' });

// Debug environment variables
console.log('🔧 Environment variables loaded:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('PORT:', process.env.PORT ? '✅ Set' : '❌ Missing');
console.log(`DATABASE_URL: process.env.DATABASE_URL ${process.env.DATABASE_URL}`);
console.log(`JWT_SECRET: process.env.JWT_SECRET ${process.env.JWT_SECRET}`);
console.log(`PORT: process.env.PORT ${process.env.PORT}`);

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// HTTP request logging with Morgan
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/attempts', require('./routes/attempts'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/admin/questions', require('./routes/questions'));
app.use('/api/admin/options', require('./routes/options'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'Quiz App Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Handle 404 routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
