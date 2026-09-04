const prisma = require('../lib/prisma');
const {
  NotFoundError,
  AuthorizationError,
  asyncHandler
} = require('../middleware/errorHandler');

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

  if (!quiz.isActive && req.user.role !== 'ADMIN') {
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
  const { title, description, questions = [] } = req.body;

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

// Publish quiz (Admin only)
const publishQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const quizId = parseInt(id, 10);

  const quiz = await prisma.quiz.update({
    where: { id: quizId },
    data: { isActive: true }
  });

  res.json({
    success: true,
    message: 'Quiz published successfully',
    data: quiz
  });
});

// Unpublish quiz (Admin only)
const unpublishQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const quizId = parseInt(id, 10);

  const quiz = await prisma.quiz.update({
    where: { id: quizId },
    data: { isActive: false }
  });

  res.json({
    success: true,
    message: 'Quiz unpublished successfully',
    data: quiz
  });
});

// Delete quiz (Admin only)
const deleteQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const quizId = parseInt(id, 10);

  // Cascade: delete answers, attempts, options, questions, then quiz
  await prisma.answer.deleteMany({ where: { question: { quizId } } });
  await prisma.quizAttempt.deleteMany({ where: { quizId } });
  await prisma.option.deleteMany({ where: { question: { quizId } } });
  await prisma.question.deleteMany({ where: { quizId } });
  await prisma.quiz.delete({ where: { id: quizId } });

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

// Get questions for a quiz (admin)
const getQuizQuestions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const quizId = parseInt(id, 10);

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: { options: { orderBy: { order: 'asc' } } },
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!quiz) throw new NotFoundError('Quiz not found');

  res.json({ success: true, message: 'Questions retrieved successfully', data: quiz.questions });
});

// Get all attempts (admin)
const getAllAttemptsAdmin = asyncHandler(async (req, res) => {
  const attempts = await prisma.quizAttempt.findMany({
    include: {
      quiz: { select: { id: true, title: true } },
      user: { select: { id: true, name: true, email: true } }
    },
    orderBy: { startedAt: 'desc' }
  });

  res.json({ success: true, message: 'Attempts retrieved successfully', data: attempts });
});

module.exports = {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  publishQuiz,
  unpublishQuiz,
  getAllQuizzesForAdmin,
  getQuizQuestions,
  getAllAttemptsAdmin
};
