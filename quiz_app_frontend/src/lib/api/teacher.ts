import { api } from './base';

export const teacherAPI = {
  getDashboard: () => api.get('/teacher/dashboard'),
  getQuizzes: () => api.get('/teacher/quizzes'),
  getQuiz: (id: number) => api.get(`/teacher/quizzes/${id}`),
  createQuiz: (data: any) => api.post('/teacher/quizzes', data),
  updateQuiz: (id: number, data: any) => api.put(`/teacher/quizzes/${id}`, data),
  deleteQuiz: (id: number) => api.delete(`/teacher/quizzes/${id}`),
  addQuestion: (quizId: number, data: any) => api.post(`/teacher/quizzes/${quizId}/questions`, data),
  updateQuestion: (questionId: number, data: any) => api.put(`/teacher/questions/${questionId}`, data),
  deleteQuestion: (questionId: number) => api.delete(`/teacher/questions/${questionId}`),
  getResults: () => api.get('/teacher/results'),
  generateQuestions: (data: { topic: string; count: number; types: string[]; difficulty: string }) =>
    api.post('/teacher/generate-questions', data),
};
