const prisma = require('../lib/prisma');
const { asyncHandler } = require('../middleware/errorHandler');

// Get dashboard statistics
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalQuizzes,
    totalUsers,
    totalAttempts,
    totalQuestions
  ] = await Promise.all([
    prisma.quiz.count(),
    prisma.user.count(),
    prisma.quizAttempt.count(),
    prisma.question.count()
  ]);

  const completedAttempts = await prisma.quizAttempt.findMany({
    where: { completedAt: { not: null } },
    select: { score: true }
  });

  const averageScore = completedAttempts.length > 0
    ? Math.round(completedAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / completedAttempts.length * 100) / 100
    : 0;

  const recentQuizzes = await prisma.quiz.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { attempts: true } } }
  });

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });

  const quizPerformance = await prisma.quiz.findMany({
    include: {
      _count: { select: { attempts: true } },
      attempts: {
        where: { completedAt: { not: null } },
        select: { score: true }
      }
    }
  });

  const topQuizzes = quizPerformance.map(quiz => {
    const completed = quiz.attempts.filter(a => a.score !== null);
    const avgScore = completed.length > 0
      ? Math.round(completed.reduce((sum, a) => sum + (a.score || 0), 0) / completed.length * 100) / 100
      : 0;
    return { id: quiz.id, title: quiz.title, attempts: quiz._count.attempts, averageScore: avgScore };
  }).sort((a, b) => b.attempts - a.attempts).slice(0, 5);

  res.json({
    success: true,
    message: 'Dashboard statistics retrieved successfully',
    data: {
      totalQuizzes, totalUsers, totalAttempts, totalQuestions, averageScore,
      recentQuizzes: recentQuizzes.map(q => ({ id: q.id, title: q.title, attempts: q._count.attempts, createdAt: q.createdAt })),
      recentUsers,
      topQuizzes
    }
  });
});

// Get quiz statistics
const getQuizStats = asyncHandler(async (req, res) => {
  const quizzes = await prisma.quiz.findMany({
    include: {
      _count: { select: { attempts: true } },
      attempts: {
        where: { completedAt: { not: null } },
        select: { score: true }
      }
    }
  });

  const quizStats = quizzes.map(quiz => {
    const completed = quiz.attempts.filter(a => a.score !== null);
    const avgScore = completed.length > 0
      ? Math.round(completed.reduce((sum, a) => sum + (a.score || 0), 0) / completed.length * 100) / 100
      : 0;
    return {
      id: quiz.id, title: quiz.title, description: quiz.description,
      questions: quiz._count.questions || 0, attempts: quiz._count.attempts,
      averageScore: avgScore, status: 'active', createdAt: quiz.createdAt
    };
  });

  res.json({ success: true, message: 'Quiz statistics retrieved successfully', data: quizStats });
});

// Get user statistics
const getUserStats = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true, name: true, email: true, role: true, createdAt: true,
      _count: { select: { attempts: true } }
    }
  });

  const userStats = await Promise.all(users.map(async (user) => {
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId: user.id, completedAt: { not: null } },
      select: { score: true }
    });
    const avgScore = attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length * 100) / 100
      : 0;
    return {
      id: user.id, name: user.name, email: user.email, role: user.role,
      quizzesTaken: user._count.attempts, averageScore: avgScore,
      lastLogin: user.createdAt, status: 'active'
    };
  }));

  res.json({ success: true, message: 'User statistics retrieved successfully', data: userStats });
});

// Get analytics data
const getAnalytics = asyncHandler(async (req, res) => {
  const [
    totalQuizzes, totalUsers, totalAttempts, completedCount
  ] = await Promise.all([
    prisma.quiz.count(),
    prisma.user.count(),
    prisma.quizAttempt.count(),
    prisma.quizAttempt.count({ where: { completedAt: { not: null } } })
  ]);

  const completionRate = totalAttempts > 0
    ? Math.round((completedCount / totalAttempts) * 100 * 100) / 100
    : 0;

  const attemptsWithScores = await prisma.quizAttempt.findMany({
    where: { completedAt: { not: null }, score: { not: null } },
    select: { score: true }
  });

  const averageScore = attemptsWithScores.length > 0
    ? Math.round(attemptsWithScores.reduce((sum, a) => sum + (a.score || 0), 0) / attemptsWithScores.length * 100) / 100
    : 0;

  const quizPerformance = await prisma.quiz.findMany({
    include: {
      _count: { select: { attempts: true } },
      attempts: { where: { completedAt: { not: null } }, select: { score: true } }
    }
  });

  const topQuizzes = quizPerformance.map(quiz => {
    const completed = quiz.attempts.filter(a => a.score !== null);
    const avgScore = completed.length > 0
      ? Math.round(completed.reduce((sum, a) => sum + (a.score || 0), 0) / completed.length * 100) / 100
      : 0;
    return { name: quiz.title, attempts: quiz._count.attempts, averageScore: avgScore };
  }).sort((a, b) => b.attempts - a.attempts).slice(0, 5);

  const scoreRanges = [
    { min: 90, max: 100, label: '90-100%' },
    { min: 80, max: 89, label: '80-89%' },
    { min: 70, max: 79, label: '70-79%' },
    { min: 60, max: 69, label: '60-69%' },
    { min: 0, max: 59, label: 'Below 60%' }
  ];

  const scoreDistribution = await Promise.all(
    scoreRanges.map(async (range) => ({
      range: range.label,
      count: await prisma.quizAttempt.count({
        where: { completedAt: { not: null }, score: { gte: range.min, lte: range.max } }
      })
    }))
  );

  res.json({
    success: true,
    message: 'Analytics data retrieved successfully',
    data: { totalQuizzes, totalUsers, totalAttempts, averageScore, completionRate, topQuizzes, scoreDistribution }
  });
});

module.exports = { getDashboardStats, getQuizStats, getUserStats, getAnalytics };
