const { PrismaClient } = require('@prisma/client');
const { 
  AppError, 
  NotFoundError, 
  AuthorizationError,
  asyncHandler 
} = require('../middleware/errorHandler');

const prisma = new PrismaClient();

// Get all quizzes (for students)
const getAllQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await prisma.quiz.findMany({
    where: { isActive: true },
    include: {
      createdBy: {
        select: { name: true }
      },
      _count: {
        select: { questions: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json({
    success: true,
    message: 'Quizzes retrieved successfully',
    data: quizzes
  });
});

// Get quiz by ID with questions
const getQuizById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const quizId = parseInt(id, 10);

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: {
          options: true
        },
        orderBy: { order: 'asc' }
      },
      createdBy: {
        select: { name: true }
      }
    }
  });

  if (!quiz) {
    throw new NotFoundError('Quiz not found');
  }

  if (!quiz.isActive) {
    throw new AuthorizationError('Quiz is not active');
  }

  res.json({
    success: true,
    message: 'Quiz retrieved successfully',
    data: quiz
  });
});

// Create quiz (Admin only)
const createQuiz = asyncHandler(async (req, res) => {
  const { title, description, questions } = req.body;

  const quiz = await prisma.quiz.create({
    data: {
      title,
      description,
      createdById: req.user.id,
      questions: {
        create: questions.map((question, index) => ({
          question: question.question,
          type: question.type,
          points: question.points || 1,
          order: index + 1,
          options: {
            create: question.options?.map((option, optionIndex) => ({
              text: option.text,
              isCorrect: option.isCorrect || false,
              order: optionIndex + 1
            })) || []
          }
        }))
      }
    },
  });

  res.status(201).json({
    success: true,
    message: 'Quiz created successfully',
    data: quiz
  });
});

// Update quiz (Admin only)
const updateQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const quizId = parseInt(id, 10);
  const { title, description, isActive } = req.body;

  const quiz = await prisma.quiz.update({
    where: { id: quizId },
    data: {
      title,
      description,
      isActive
    }
  });

  res.json({
    success: true,
    message: 'Quiz updated successfully',
    data: quiz
  });
});

// Delete quiz (Admin only)
const deleteQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const quizId = parseInt(id, 10);

  await prisma.quiz.delete({
    where: { id: quizId }
  });

  res.json({ 
    success: true,
    message: 'Quiz deleted successfully' 
  });
});

// Get all quizzes for admin (including inactive)
const getAllQuizzesForAdmin = asyncHandler(async (req, res) => {
  const quizzes = await prisma.quiz.findMany({
    include: {
      createdBy: {
        select: { name: true }
      },
      _count: {
        select: { 
          questions: true,
          attempts: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json({
    success: true,
    message: 'Admin quizzes retrieved successfully',
    data: quizzes
  });
});

module.exports = {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getAllQuizzesForAdmin
};
