import { api } from './base';

export const statsAPI = {
  // Get dashboard statistics
  getDashboardStats: () => api.get('/stats/dashboard'),
  
  // Get quiz statistics
  getQuizStats: () => api.get('/stats/quizzes'),
  
  // Get user statistics
  getUserStats: () => api.get('/stats/users'),
  
  // Get analytics data
  getAnalytics: () => api.get('/stats/analytics'),
};
