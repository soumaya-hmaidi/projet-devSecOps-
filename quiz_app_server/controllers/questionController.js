const { PrismaClient } = require('@prisma/client');
const { asyncHandler } = require('../middleware/errorHandler');
const { NotFoundError, AuthorizationError, ValidationError } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

// Get question by ID
const getQuestionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const questionId = parseInt(id, 10);

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      options: {
        orderBy: { order: 'asc' }
      },
      quiz: {
        select: {
          id: true,
          title: true,
          createdById: true
        }
      }
    }
  });

  if (!question) {
    throw new NotFoundError('Question not found');
  }

  // Verify the question belongs to a quiz created by an admin
  if (question.quiz.createdById !== req.user.id) {
    throw new AuthorizationError('Unauthorized to access this question');
  }

  res.json({
    success: true,
    message: 'Question retrieved successfully',
    data: question
  });
});

// Create question
const createQuestion = asyncHandler(async (req, res) => {
  const { question, type, points, order, quizId, options } = req.body;

  // Verify quiz exists and belongs to user
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: { id: true, createdById: true }
  });

  if (!quiz) {
    throw new NotFoundError('Quiz not found');
  }

  if (quiz.createdById !== req.user.id) {
    throw new AuthorizationError('Unauthorized to add questions to this quiz');
  }

  // Create question with options
  const newQuestion = await prisma.question.create({
    data: {
      question,
      type,
      points: points || 1,
      order,
      quizId,
      options: {
        create: options?.map((option, index) => ({
          text: option.text,
          isCorrect: option.isCorrect || false,
          order: option.order || index + 1
        })) || []
      }
    },
    include: {
      options: {
        orderBy: { order: 'asc' }
      }
    }
  });

  res.status(201).json({
    success: true,
    message: 'Question created successfully',
    data: newQuestion
  });
});

// Update question
const updateQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const questionId = parseInt(id, 10);
  const { question, type, points, order, options } = req.body;

  // Verify question exists and belongs to user's quiz
  const existingQuestion = await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      quiz: {
        select: { createdById: true }
      }
    }
  });

  if (!existingQuestion) {
    throw new NotFoundError('Question not found');
  }

  if (existingQuestion.quiz.createdById !== req.user.id) {
    throw new AuthorizationError('Unauthorized to update this question');
  }

  // Prepare update data
  const updateData = {};
  
  // Only include fields that are provided
  if (question !== undefined) updateData.question = question;
  if (type !== undefined) updateData.type = type;
  if (points !== undefined) updateData.points = points;
  if (order !== undefined) updateData.order = order;

  // Handle options update if provided
  if (options !== undefined) {
    updateData.options = {
      deleteMany: {}, // Delete all existing options
      create: options.map((option, index) => ({
        text: option.text,
        isCorrect: option.isCorrect || false,
        order: option.order || index + 1
      }))
    };
  }

  const updatedQuestion = await prisma.question.update({
    where: { id: questionId },
    data: updateData,
    include: {
      options: {
        orderBy: { order: 'asc' }
      }
    }
  });

  res.json({
    success: true,
    message: 'Question updated successfully',
    data: updatedQuestion
  });
});

// Delete question
const deleteQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const questionId = parseInt(id, 10);

  // Verify question exists and belongs to user's quiz
  const existingQuestion = await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      quiz: {
        select: { createdById: true }
      }
    }
  });

  if (!existingQuestion) {
    throw new NotFoundError('Question not found');
  }

  if (existingQuestion.quiz.createdById !== req.user.id) {
    throw new AuthorizationError('Unauthorized to delete this question');
  }

  // Delete question (options will be deleted automatically due to cascade)
  await prisma.question.delete({
    where: { id: questionId }
  });

  res.json({
    success: true,
    message: 'Question deleted successfully'
  });
});

module.exports = {
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
};
