// Calculate quiz score
const calculateScore = (answers, questions) => {
  const totalQuestions = questions.length;
  const correctAnswers = answers.filter(answer => answer.isCorrect).length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  return {
    totalQuestions,
    correctAnswers,
    percentage,
    score: percentage
  };
};

// Validate quiz attempt
const validateQuizAttempt = (quiz, userId) => {
  if (!quiz) {
    return { valid: false, message: 'Quiz not found' };
  }
  
  if (!quiz.isActive) {
    return { valid: false, message: 'Quiz is not active' };
  }
  
  return { valid: true };
};

// Format quiz for student view (without correct answers)
const formatQuizForStudent = (quiz) => {
  const formattedQuiz = {
    ...quiz,
    questions: quiz.questions.map(question => ({
      ...question,
      options: question.options.map(option => ({
        id: option.id,
        text: option.text,
        order: option.order
        // Remove isCorrect field for students
      }))
    }))
  };
  
  return formattedQuiz;
};

// Format quiz for admin view (with all details)
const formatQuizForAdmin = (quiz) => {
  return quiz;
};

// Check if user can attempt quiz
const canUserAttemptQuiz = async (prisma, quizId, userId) => {
  const existingAttempt = await prisma.quizAttempt.findUnique({
    where: {
      quizId_userId: {
        quizId,
        userId
      }
    }
  });
  
  return !existingAttempt;
};

module.exports = {
  calculateScore,
  validateQuizAttempt,
  formatQuizForStudent,
  formatQuizForAdmin,
  canUserAttemptQuiz
};
