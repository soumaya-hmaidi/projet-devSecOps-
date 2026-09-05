const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const {
  getTeacherDashboard,
  getTeacherQuizzes,
  getTeacherQuizById,
  createTeacherQuiz,
  updateTeacherQuiz,
  deleteTeacherQuiz,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getTeacherResults,
  generateQuestions
} = require('../controllers/teacherController');

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole('TEACHER'));

// Dashboard stats
router.get('/dashboard', getTeacherDashboard);

// Quiz management
router.get('/quizzes', getTeacherQuizzes);
router.post('/quizzes', createTeacherQuiz);
router.get('/quizzes/:id', getTeacherQuizById);
router.put('/quizzes/:id', updateTeacherQuiz);
router.delete('/quizzes/:id', deleteTeacherQuiz);

// Question management
router.post('/quizzes/:id/questions', addQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

// Student results
router.get('/results', getTeacherResults);

// AI question generation
router.post('/generate-questions', generateQuestions);

module.exports = router;
