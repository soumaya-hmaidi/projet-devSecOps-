const prisma = require('../lib/prisma');
const {
  NotFoundError,
  AuthorizationError,
  asyncHandler
} = require('../middleware/errorHandler');

// GET /api/teacher/dashboard - stats for teacher's quizzes
const getTeacherDashboard = asyncHandler(async (req, res) => {
  const teacherId = req.user.id;

  const quizzes = await prisma.quiz.findMany({
    where: { createdById: teacherId },
    include: {
      _count: { select: { questions: true, attempts: true } },
      attempts: { select: { score: true, completed: true } }
    }
  });

  const totalQuizzes = quizzes.length;
  const totalAttempts = quizzes.reduce((sum, q) => sum + q._count.attempts, 0);
  const completedAttempts = quizzes.flatMap(q => q.attempts).filter(a => a.completed);
  const averageScore = completedAttempts.length > 0
    ? Math.round(completedAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / completedAttempts.length)
    : 0;

  res.json({
    success: true,
    message: 'Teacher dashboard stats retrieved',
    data: { totalQuizzes, totalAttempts, averageScore }
  });
});

// GET /api/teacher/quizzes - get teacher's own quizzes
const getTeacherQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await prisma.quiz.findMany({
    where: { createdById: req.user.id },
    include: {
      _count: { select: { questions: true, attempts: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json({ success: true, message: 'Quizzes retrieved', data: quizzes });
});

// GET /api/teacher/quizzes/:id - get one quiz with questions
const getTeacherQuizById = asyncHandler(async (req, res) => {
  const quizId = parseInt(req.params.id, 10);

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
  if (quiz.createdById !== req.user.id) throw new AuthorizationError('Not your quiz');

  res.json({ success: true, message: 'Quiz retrieved', data: quiz });
});

// POST /api/teacher/quizzes - create quiz with optional questions
const createTeacherQuiz = asyncHandler(async (req, res) => {
  const { title, description, isActive = false, questions = [] } = req.body;

  const quiz = await prisma.quiz.create({
    data: {
      title,
      description,
      isActive,
      createdById: req.user.id,
      questions: {
        create: questions.map((q, index) => ({
          question: q.question,
          type: q.type,
          points: q.points || 1,
          order: index + 1,
          options: {
            create: (q.options || []).map((opt, i) => ({
              text: opt.text,
              isCorrect: opt.isCorrect || false,
              order: i + 1
            }))
          }
        }))
      }
    },
    include: {
      questions: { include: { options: true } }
    }
  });

  res.status(201).json({ success: true, message: 'Quiz created', data: quiz });
});

// PUT /api/teacher/quizzes/:id - update quiz metadata
const updateTeacherQuiz = asyncHandler(async (req, res) => {
  const quizId = parseInt(req.params.id, 10);
  const { title, description, isActive } = req.body;

  const existing = await prisma.quiz.findUnique({ where: { id: quizId } });
  if (!existing) throw new NotFoundError('Quiz not found');
  if (existing.createdById !== req.user.id) throw new AuthorizationError('Not your quiz');

  const quiz = await prisma.quiz.update({
    where: { id: quizId },
    data: { title, description, isActive }
  });

  res.json({ success: true, message: 'Quiz updated', data: quiz });
});

// DELETE /api/teacher/quizzes/:id - delete quiz
const deleteTeacherQuiz = asyncHandler(async (req, res) => {
  const quizId = parseInt(req.params.id, 10);

  const existing = await prisma.quiz.findUnique({ where: { id: quizId } });
  if (!existing) throw new NotFoundError('Quiz not found');
  if (existing.createdById !== req.user.id) throw new AuthorizationError('Not your quiz');

  await prisma.quiz.delete({ where: { id: quizId } });

  res.json({ success: true, message: 'Quiz deleted' });
});

// POST /api/teacher/quizzes/:id/questions - add a question with options
const addQuestion = asyncHandler(async (req, res) => {
  const quizId = parseInt(req.params.id, 10);
  const { question, type, points = 1, options = [] } = req.body;

  const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
  if (!quiz) throw new NotFoundError('Quiz not found');
  if (quiz.createdById !== req.user.id) throw new AuthorizationError('Not your quiz');

  const count = await prisma.question.count({ where: { quizId } });

  const newQuestion = await prisma.question.create({
    data: {
      question,
      type,
      points,
      order: count + 1,
      quizId,
      options: {
        create: options.map((opt, i) => ({
          text: opt.text,
          isCorrect: opt.isCorrect || false,
          order: i + 1
        }))
      }
    },
    include: { options: true }
  });

  res.status(201).json({ success: true, message: 'Question added', data: newQuestion });
});

// PUT /api/teacher/questions/:id - update a question
const updateQuestion = asyncHandler(async (req, res) => {
  const questionId = parseInt(req.params.id, 10);
  const { question, type, points, options } = req.body;

  const existing = await prisma.question.findUnique({
    where: { id: questionId },
    include: { quiz: true }
  });

  if (!existing) throw new NotFoundError('Question not found');
  if (existing.quiz.createdById !== req.user.id) throw new AuthorizationError('Not your quiz');

  const updated = await prisma.question.update({
    where: { id: questionId },
    data: { question, type, points }
  });

  if (options && options.length > 0) {
    await prisma.option.deleteMany({ where: { questionId } });
    await prisma.option.createMany({
      data: options.map((opt, i) => ({
        text: opt.text,
        isCorrect: opt.isCorrect || false,
        order: i + 1,
        questionId
      }))
    });
  }

  const result = await prisma.question.findUnique({
    where: { id: questionId },
    include: { options: { orderBy: { order: 'asc' } } }
  });

  res.json({ success: true, message: 'Question updated', data: result });
});

// DELETE /api/teacher/questions/:id - delete a question
const deleteQuestion = asyncHandler(async (req, res) => {
  const questionId = parseInt(req.params.id, 10);

  const existing = await prisma.question.findUnique({
    where: { id: questionId },
    include: { quiz: true }
  });

  if (!existing) throw new NotFoundError('Question not found');
  if (existing.quiz.createdById !== req.user.id) throw new AuthorizationError('Not your quiz');

  await prisma.question.delete({ where: { id: questionId } });

  res.json({ success: true, message: 'Question deleted' });
});

// GET /api/teacher/results - all attempts for teacher's quizzes
const getTeacherResults = asyncHandler(async (req, res) => {
  const teacherQuizIds = await prisma.quiz.findMany({
    where: { createdById: req.user.id },
    select: { id: true }
  });

  const quizIdList = teacherQuizIds.map(q => q.id);

  const attempts = await prisma.quizAttempt.findMany({
    where: { quizId: { in: quizIdList }, completed: true },
    include: {
      quiz: { select: { id: true, title: true } },
      user: { select: { id: true, name: true, email: true } }
    },
    orderBy: { completedAt: 'desc' }
  });

  res.json({ success: true, message: 'Results retrieved', data: attempts });
});

module.exports = {
  getTeacherDashboard,
  getTeacherQuizzes,
  getTeacherQuizById,
  createTeacherQuiz,
  updateTeacherQuiz,
  deleteTeacherQuiz,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getTeacherResults
};
