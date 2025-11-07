const { PrismaClient } = require('@prisma/client');
const { 
  AppError, 
  NotFoundError, 
  AuthorizationError,
  ConflictError,
  asyncHandler 
} = require('../middleware/errorHandler');

const prisma = new PrismaClient();

// Start quiz attempt
const startAttempt = asyncHandler(async (req, res) => {
  const { quizId } = req.body;
  const quizIdInt = parseInt(quizId, 10);

  // Check if quiz exists and is active
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizIdInt },
    include: { questions: true }
  });

  if (!quiz) {
    throw new NotFoundError('Quiz not found');
  }

  if (!quiz.isActive) {
    throw new AuthorizationError('Quiz is not active');
  }

  // Check if user already attempted this quiz
  const existingAttempt = await prisma.quizAttempt.findUnique({
    where: {
      quizId_userId: {
        quizId: quizIdInt,
        userId: req.user.id
      }
    }
  });

  if (existingAttempt) {
    throw new ConflictError('You have already attempted this quiz');
  }

  // Create new attempt
  const attempt = await prisma.quizAttempt.create({
    data: {
      quizId: quizIdInt,
      userId: req.user.id
    }
  });

  res.status(201).json({
    success: true,
    message: 'Quiz attempt started',
    data: attempt
  });
});

// Submit answer
const submitAnswer = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  const attemptIdInt = parseInt(attemptId, 10);
  const { questionId, optionId, textAnswer } = req.body;
  const questionIdInt = parseInt(questionId, 10);
  const optionIdInt = optionId ? parseInt(optionId, 10) : null;

  // Debug logging
  console.log('SubmitAnswer Debug:', {
    attemptId: attemptIdInt,
    questionId: questionIdInt,
    optionId: optionIdInt,
    textAnswer,
    body: req.body
  });

  // Verify attempt belongs to user
  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptIdInt },
    include: { quiz: true }
  });

  if (!attempt) {
    throw new NotFoundError('Attempt not found');
  }

  if (attempt.userId !== req.user.id) {
    throw new AuthorizationError('Unauthorized');
  }

  if (attempt.completed) {
    throw new ConflictError('Quiz already completed');
  }

  // Get question and correct answer
  const question = await prisma.question.findUnique({
    where: { id: questionIdInt },
    include: { options: true }
  });

  if (!question) {
    throw new NotFoundError('Question not found');
  }

  let isCorrect = false;
  let correctOptionId = null;

  if (question.type === 'MULTIPLE_CHOICE') {
    const correctOption = question.options.find(option => option.isCorrect);
    correctOptionId = correctOption?.id;
    isCorrect = optionIdInt === correctOptionId;
  } else if (question.type === 'TRUE_FALSE') {
    const correctOption = question.options.find(option => option.isCorrect);
    correctOptionId = correctOption?.id;
    isCorrect = optionIdInt === correctOptionId;
  }

  // Debug the data being sent to Prisma
  console.log('Prisma Upsert Data:', {
    where: {
      attemptId_questionId: {
        attemptId: attemptIdInt,
        questionId: questionIdInt
      }
    },
    update: {
      optionId: optionIdInt,
      textAnswer,
      isCorrect
    },
    create: {
      attemptId: attemptIdInt,
      questionId: questionIdInt,
      optionId: optionIdInt,
      textAnswer,
      isCorrect
    }
  });

  // Create or update answer
  const answer = await prisma.answer.upsert({
    where: {
      attemptId_questionId: {
        attemptId: attemptIdInt,
        questionId: questionIdInt
      }
    },
    update: {
      optionId: optionIdInt,
      textAnswer,
      isCorrect
    },
    create: {
      attemptId: attemptIdInt,
      questionId: questionIdInt,
      optionId: optionIdInt,
      textAnswer,
      isCorrect
    }
  });

  res.json({
    success: true,
    message: 'Answer submitted',
    data: {
      answer,
      isCorrect
    }
  });
});

// Submit all answers and complete attempt
const submitAttempt = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  const attemptIdInt = parseInt(attemptId, 10);
  const { answers } = req.body;

  // Verify attempt belongs to user
  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptIdInt },
    include: {
      quiz: {
        include: { 
          questions: {
            include: { options: true }
          }
        }
      }
    }
  });

  if (!attempt) {
    throw new NotFoundError('Attempt not found');
  }

  if (attempt.userId !== req.user.id) {
    throw new AuthorizationError('Unauthorized');
  }

  if (attempt.completed) {
    throw new ConflictError('Quiz already completed');
  }

  // Process all answers
  const answerPromises = Object.entries(answers).map(async ([questionIdStr, answerValue]) => {
    const questionId = parseInt(questionIdStr, 10);
    const question = attempt.quiz.questions.find(q => q.id === questionId);
    
    if (!question) {
      return null;
    }

    let isCorrect = false;
    let optionId = null;
    let textAnswer = null;

    if (question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE') {
      optionId = parseInt(answerValue, 10);
      const correctOption = question.options.find(option => option.isCorrect);
      isCorrect = optionId === correctOption?.id;
    } else if (question.type === 'TEXT') {
      textAnswer = answerValue;
      // For text questions, we'll mark as correct for now (could implement more sophisticated checking)
      isCorrect = textAnswer && textAnswer.trim().length > 0;
    }

    // Create or update answer
    return prisma.answer.upsert({
      where: {
        attemptId_questionId: {
          attemptId: attemptIdInt,
          questionId: questionId
        }
      },
      update: {
        optionId,
        textAnswer,
        isCorrect
      },
      create: {
        attemptId: attemptIdInt,
        questionId: questionId,
        optionId,
        textAnswer,
        isCorrect
      }
    });
  });

  const submittedAnswers = await Promise.all(answerPromises);
  const validAnswers = submittedAnswers.filter(answer => answer !== null);

  // Calculate score
  const totalQuestions = attempt.quiz.questions.length;
  const correctAnswers = validAnswers.filter(answer => answer.isCorrect).length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  // Update attempt as completed
  const updatedAttempt = await prisma.quizAttempt.update({
    where: { id: attemptIdInt },
    data: {
      completed: true,
      score,
      completedAt: new Date()
    }
  });

  res.json({
    success: true,
    message: 'Quiz submitted successfully',
    data: {
      attempt: updatedAttempt,
      score,
      totalQuestions,
      correctAnswers,
      answers: validAnswers
    }
  });
});

// Complete quiz attempt
const completeAttempt = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  const attemptIdInt = parseInt(attemptId, 10);

  // Verify attempt belongs to user
  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptIdInt },
    include: {
      quiz: {
        include: { questions: true }
      },
      answers: {
        include: { question: true }
      }
    }
  });

  if (!attempt) {
    throw new NotFoundError('Attempt not found');
  }

  if (attempt.userId !== req.user.id) {
    throw new AuthorizationError('Unauthorized');
  }

  if (attempt.completed) {
    throw new ConflictError('Quiz already completed');
  }

  // Calculate score
  const totalQuestions = attempt.quiz.questions.length;
  const correctAnswers = attempt.answers.filter(answer => answer.isCorrect).length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  // Update attempt
  const updatedAttempt = await prisma.quizAttempt.update({
    where: { id: attemptIdInt },
    data: {
      completed: true,
      score,
      completedAt: new Date()
    }
  });

  res.json({
    success: true,
    message: 'Quiz completed',
    data: {
      attempt: updatedAttempt,
      score,
      totalQuestions,
      correctAnswers
    }
  });
});

// Get user's attempts
const getUserAttempts = asyncHandler(async (req, res) => {
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: req.user.id },
    include: {
      quiz: {
        select: {
          id: true,
          title: true,
          description: true
        }
      }
    },
    orderBy: { startedAt: 'desc' }
  });

  res.json({
    success: true,
    message: 'User attempts retrieved successfully',
    data: attempts
  });
});

// Get attempt details
const getAttemptById = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  const attemptIdInt = parseInt(attemptId, 10);

  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptIdInt },
    include: {
      quiz: {
        include: {
          questions: {
            include: {
              options: true
            },
            orderBy: { order: 'asc' }
          }
        }
      },
      answers: {
        include: {
          question: true,
          option: true
        }
      }
    }
  });

  if (!attempt) {
    throw new NotFoundError('Attempt not found');
  }

  if (attempt.userId !== req.user.id) {
    throw new AuthorizationError('Unauthorized');
  }

  res.json({
    success: true,
    message: 'Attempt details retrieved successfully',
    data: attempt
  });
});

module.exports = {
  startAttempt,
  submitAnswer,
  submitAttempt,
  completeAttempt,
  getUserAttempts,
  getAttemptById
};
