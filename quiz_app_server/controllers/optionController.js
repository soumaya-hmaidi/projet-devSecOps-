const { PrismaClient } = require('@prisma/client');
const { asyncHandler } = require('../middleware/errorHandler');
const { NotFoundError, AuthorizationError } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

// Get option by ID
const getOptionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const optionId = parseInt(id, 10);

  const option = await prisma.option.findUnique({
    where: { id: optionId },
    include: {
      question: {
        include: {
          quiz: {
            select: {
              id: true,
              title: true,
              createdById: true
            }
          }
        }
      }
    }
  });

  if (!option) {
    throw new NotFoundError('Option not found');
  }

  // Verify the option belongs to a quiz created by an admin
  if (option.question.quiz.createdById !== req.user.id) {
    throw new AuthorizationError('Unauthorized to access this option');
  }

  res.json({
    success: true,
    message: 'Option retrieved successfully',
    data: option
  });
});

// Create option for a question
const createOption = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  const questionIdInt = parseInt(questionId, 10);
  const { text, isCorrect, order } = req.body;

  // Verify question exists and belongs to user's quiz
  const question = await prisma.question.findUnique({
    where: { id: questionIdInt },
    include: {
      quiz: {
        select: {
          createdById: true
        }
      }
    }
  });

  if (!question) {
    throw new NotFoundError('Question not found');
  }

  if (question.quiz.createdById !== req.user.id) {
    throw new AuthorizationError('Unauthorized to add options to this question');
  }

  // Create the option
  const newOption = await prisma.option.create({
    data: {
      questionId: questionIdInt,
      text,
      isCorrect: isCorrect || false,
      order: order || 1
    }
  });

  res.status(201).json({
    success: true,
    message: 'Option created successfully',
    data: newOption
  });
});

// Update option
const updateOption = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const optionId = parseInt(id, 10);
  const { text, isCorrect, order } = req.body;

  // Verify option exists and belongs to user's quiz
  const existingOption = await prisma.option.findUnique({
    where: { id: optionId },
    include: {
      question: {
        include: {
          quiz: {
            select: {
              createdById: true
            }
          }
        }
      }
    }
  });

  if (!existingOption) {
    throw new NotFoundError('Option not found');
  }

  if (existingOption.question.quiz.createdById !== req.user.id) {
    throw new AuthorizationError('Unauthorized to update this option');
  }

  // Prepare update data
  const updateData = {};
  if (text !== undefined) updateData.text = text;
  if (isCorrect !== undefined) updateData.isCorrect = isCorrect;
  if (order !== undefined) updateData.order = order;

  const updatedOption = await prisma.option.update({
    where: { id: optionId },
    data: updateData
  });

  res.json({
    success: true,
    message: 'Option updated successfully',
    data: updatedOption
  });
});

// Delete option
const deleteOption = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const optionId = parseInt(id, 10);

  // Verify option exists and belongs to user's quiz
  const existingOption = await prisma.option.findUnique({
    where: { id: optionId },
    include: {
      question: {
        include: {
          quiz: {
            select: {
              createdById: true
            }
          }
        }
      }
    }
  });

  if (!existingOption) {
    throw new NotFoundError('Option not found');
  }

  if (existingOption.question.quiz.createdById !== req.user.id) {
    throw new AuthorizationError('Unauthorized to delete this option');
  }

  await prisma.option.delete({
    where: { id: optionId }
  });

  res.json({
    success: true,
    message: 'Option deleted successfully'
  });
});

// Get all options for a question
const getOptionsByQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  const questionIdInt = parseInt(questionId, 10);

  // Verify question exists and belongs to user's quiz
  const question = await prisma.question.findUnique({
    where: { id: questionIdInt },
    include: {
      quiz: {
        select: {
          createdById: true
        }
      }
    }
  });

  if (!question) {
    throw new NotFoundError('Question not found');
  }

  if (question.quiz.createdById !== req.user.id) {
    throw new AuthorizationError('Unauthorized to access this question\'s options');
  }

  const options = await prisma.option.findMany({
    where: { questionId: questionIdInt },
    orderBy: { order: 'asc' }
  });

  res.json({
    success: true,
    message: 'Options retrieved successfully',
    data: options
  });
});

module.exports = {
  getOptionById,
  createOption,
  updateOption,
  deleteOption,
  getOptionsByQuestion
};

