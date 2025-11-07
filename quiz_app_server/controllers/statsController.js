const { PrismaClient } = require('@prisma/client');
const { asyncHandler } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

// Get dashboard statistics
const getDashboardStats = asyncHandler(async (req, res) => {
  console.log('📊 Fetching dashboard statistics...');

  try {
    // Get total counts
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

    // Get average score from all completed attempts
    const completedAttempts = await prisma.quizAttempt.findMany({
      where: {
        completedAt: { not: null }
      },
      select: {
        score: true
      }
    });

    const averageScore = completedAttempts.length > 0 
      ? Math.round(completedAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / completedAttempts.length * 100) / 100
      : 0;

    // Get recent quizzes (last 5)
    const recentQuizzes = await prisma.quiz.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { attempts: true }
        }
      }
    });

    // Get recent users (last 5)
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    // Get quiz performance data
    const quizPerformance = await prisma.quiz.findMany({
      include: {
        _count: {
          select: { attempts: true }
        },
        attempts: {
          where: { completedAt: { not: null } },
          select: { score: true }
        }
      }
    });

    const quizStats = quizPerformance.map(quiz => {
      const completedAttempts = quiz.attempts.filter(attempt => attempt.score !== null);
      const avgScore = completedAttempts.length > 0 
        ? Math.round(completedAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / completedAttempts.length * 100) / 100
        : 0;

      return {
        id: quiz.id,
        title: quiz.title,
        attempts: quiz._count.attempts,
        averageScore: avgScore
      };
    }).sort((a, b) => b.attempts - a.attempts).slice(0, 5);

    const stats = {
      totalQuizzes,
      totalUsers,
      totalAttempts,
      totalQuestions,
      averageScore,
      recentQuizzes: recentQuizzes.map(quiz => ({
        id: quiz.id,
        title: quiz.title,
        attempts: quiz._count.attempts,
        createdAt: quiz.createdAt
      })),
      recentUsers,
      topQuizzes: quizStats
    };

    console.log('✅ Dashboard statistics retrieved successfully');
    console.log(`📈 Stats: ${totalQuizzes} quizzes, ${totalUsers} users, ${totalAttempts} attempts, ${averageScore}% avg score`);

    res.json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: stats
    });

  } catch (error) {
    console.error('❌ Error fetching dashboard statistics:', error);
    throw error;
  }
});

// Get quiz statistics
const getQuizStats = asyncHandler(async (req, res) => {
  console.log('📊 Fetching quiz statistics...');

  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        _count: {
          select: { attempts: true }
        },
        attempts: {
          where: { completedAt: { not: null } },
          select: { score: true }
        }
      }
    });

    const quizStats = quizzes.map(quiz => {
      const completedAttempts = quiz.attempts.filter(attempt => attempt.score !== null);
      const avgScore = completedAttempts.length > 0 
        ? Math.round(completedAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / completedAttempts.length * 100) / 100
        : 0;

      return {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        questions: quiz._count.questions || 0,
        attempts: quiz._count.attempts,
        averageScore: avgScore,
        status: 'active', // You can add status field to quiz model later
        createdAt: quiz.createdAt
      };
    });

    console.log(`✅ Quiz statistics retrieved: ${quizStats.length} quizzes`);

    res.json({
      success: true,
      message: 'Quiz statistics retrieved successfully',
      data: quizStats
    });

  } catch (error) {
    console.error('❌ Error fetching quiz statistics:', error);
    throw error;
  }
});

// Get user statistics
const getUserStats = asyncHandler(async (req, res) => {
  console.log('📊 Fetching user statistics...');

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { attempts: true }
        }
      }
    });

    // Get user performance data
    const userStats = await Promise.all(users.map(async (user) => {
      const attempts = await prisma.quizAttempt.findMany({
        where: { userId: user.id, completedAt: { not: null } },
        select: { score: true }
      });

      const avgScore = attempts.length > 0 
        ? Math.round(attempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / attempts.length * 100) / 100
        : 0;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        quizzesTaken: user._count.attempts,
        averageScore: avgScore,
        lastLogin: user.createdAt, // You can add lastLogin field to user model later
        status: 'active' // You can add status field to user model later
      };
    }));

    console.log(`✅ User statistics retrieved: ${userStats.length} users`);

    res.json({
      success: true,
      message: 'User statistics retrieved successfully',
      data: userStats
    });

  } catch (error) {
    console.error('❌ Error fetching user statistics:', error);
    throw error;
  }
});

// Get analytics data
const getAnalytics = asyncHandler(async (req, res) => {
  console.log('📊 Fetching analytics data...');

  try {
    // Get overall statistics
    const [
      totalQuizzes,
      totalUsers,
      totalAttempts,
      completedAttempts
    ] = await Promise.all([
      prisma.quiz.count(),
      prisma.user.count(),
      prisma.quizAttempt.count(),
      prisma.quizAttempt.count({
        where: { completedAt: { not: null } }
      })
    ]);

    // Calculate completion rate
    const completionRate = totalAttempts > 0 
      ? Math.round((completedAttempts / totalAttempts) * 100 * 100) / 100
      : 0;

    // Get average score
    const attemptsWithScores = await prisma.quizAttempt.findMany({
      where: {
        completedAt: { not: null },
        score: { not: null }
      },
      select: { score: true }
    });

    const averageScore = attemptsWithScores.length > 0 
      ? Math.round(attemptsWithScores.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / attemptsWithScores.length * 100) / 100
      : 0;

    // Get top performing quizzes
    const quizPerformance = await prisma.quiz.findMany({
      include: {
        _count: {
          select: { attempts: true }
        },
        attempts: {
          where: { completedAt: { not: null } },
          select: { score: true }
        }
      }
    });

    const topQuizzes = quizPerformance.map(quiz => {
      const completedAttempts = quiz.attempts.filter(attempt => attempt.score !== null);
      const avgScore = completedAttempts.length > 0 
        ? Math.round(completedAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / completedAttempts.length * 100) / 100
        : 0;

      return {
        name: quiz.title,
        attempts: quiz._count.attempts,
        averageScore: avgScore
      };
    }).sort((a, b) => b.attempts - a.attempts).slice(0, 5);

    // Get score distribution
    const scoreRanges = [
      { min: 90, max: 100, label: '90-100%' },
      { min: 80, max: 89, label: '80-89%' },
      { min: 70, max: 79, label: '70-79%' },
      { min: 60, max: 69, label: '60-69%' },
      { min: 0, max: 59, label: 'Below 60%' }
    ];

    const scoreDistribution = await Promise.all(
      scoreRanges.map(async (range) => {
        const count = await prisma.quizAttempt.count({
          where: {
            completedAt: { not: null },
            score: {
              gte: range.min,
              lte: range.max
            }
          }
        });
        return {
          range: range.label,
          count
        };
      })
    );

    const analytics = {
      totalQuizzes,
      totalUsers,
      totalAttempts,
      averageScore,
      completionRate,
      topQuizzes,
      scoreDistribution
    };

    console.log('✅ Analytics data retrieved successfully');
    console.log(`📈 Analytics: ${totalQuizzes} quizzes, ${totalUsers} users, ${totalAttempts} attempts, ${averageScore}% avg score, ${completionRate}% completion rate`);

    res.json({
      success: true,
      message: 'Analytics data retrieved successfully',
      data: analytics
    });

  } catch (error) {
    console.error('❌ Error fetching analytics data:', error);
    throw error;
  }
});

module.exports = {
  getDashboardStats,
  getQuizStats,
  getUserStats,
  getAnalytics
};
