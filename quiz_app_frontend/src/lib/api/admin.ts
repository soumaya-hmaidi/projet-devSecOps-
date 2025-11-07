import { api } from './base';

// Admin API endpoints
export const adminAPI = {
  // User Management
  getUsers: () => api.get('/admin/users'),
  getUser: (id: number) => api.get(`/admin/users/${id}`),
  updateUser: (id: number, data: UpdateUserRequest) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id: number) => api.delete(`/admin/users/${id}`),

  // Quiz Management
  getAllQuizzes: () => api.get('/admin/quizzes'),
  getQuizDetails: (id: number) => api.get(`/admin/quizzes/${id}`),
  createQuiz: (data: CreateQuizRequest) => api.post('/admin/quizzes', data),
  updateQuiz: (id: number, data: UpdateQuizRequest) => api.put(`/admin/quizzes/${id}`, data),
  deleteQuiz: (id: number) => api.delete(`/admin/quizzes/${id}`),
  publishQuiz: (id: number) => api.post(`/admin/quizzes/${id}/publish`),
  unpublishQuiz: (id: number) => api.post(`/admin/quizzes/${id}/unpublish`),

  // Question Management
  getQuizQuestions: (quizId: number) => api.get(`/admin/quizzes/${quizId}/questions`),
  getQuestionById: (questionId: number) => api.get(`/admin/questions/${questionId}`),
  addQuestion: (quizId: number, data: CreateQuestionRequest) => 
    api.post(`/admin/quizzes/${quizId}/questions`, data),
  updateQuestion: (questionId: number, data: UpdateQuestionRequest) => 
    api.put(`/admin/questions/${questionId}`, data),
  deleteQuestion: (questionId: number) => api.delete(`/admin/questions/${questionId}`),
  reorderQuestions: (quizId: number, data: ReorderQuestionsRequest) => 
    api.put(`/admin/quizzes/${quizId}/questions/reorder`, data),

  // Option Management
  updateOption: (optionId: number, data: UpdateOptionRequest) => 
    api.put(`/admin/options/${optionId}`, data),
  deleteOption: (optionId: number) => api.delete(`/admin/options/${optionId}`),

  // Analytics & Reports
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getQuizAnalytics: (quizId: number) => api.get(`/admin/analytics/quiz/${quizId}`),
  getUserAnalytics: (userId: number) => api.get(`/admin/analytics/user/${userId}`),
  getSystemAnalytics: () => api.get('/admin/analytics/system'),
  exportQuizResults: (quizId: number) => api.get(`/admin/export/quiz/${quizId}`),
  exportUserResults: (userId: number) => api.get(`/admin/export/user/${userId}`),

  // Attempt Management
  getAllAttempts: () => api.get('/admin/attempts'),
  getQuizAttempts: (quizId: number) => api.get(`/admin/attempts/quiz/${quizId}`),
  getUserAttempts: (userId: number) => api.get(`/admin/attempts/user/${userId}`),
  getAttemptDetails: (attemptId: number) => api.get(`/admin/attempts/${attemptId}`),
  deleteAttempt: (attemptId: number) => api.delete(`/admin/attempts/${attemptId}`),
};

// Admin types
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'STUDENT' | 'ADMIN';
}

export interface CreateQuizRequest {
  title: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateQuizRequest {
  title?: string;
  description?: string;
  isActive?: boolean;
}

export interface CreateQuestionRequest {
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'TEXT';
  points?: number;
  order: number;
  options?: CreateOptionRequest[];
}

export interface UpdateQuestionRequest {
  question?: string;
  type?: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_BLANK';
  points?: number;
  order?: number;
  options?: Array<{
    text: string;
    isCorrect: boolean;
    order: number;
  }>;
}

export interface CreateOptionRequest {
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface UpdateOptionRequest {
  text?: string;
  isCorrect?: boolean;
  order?: number;
}

export interface ReorderQuestionsRequest {
  questionIds: number[];
}

export interface DashboardStats {
  totalUsers: number;
  totalQuizzes: number;
  totalAttempts: number;
  activeUsers: number;
  recentActivity: ActivityItem[];
  topQuizzes: QuizStats[];
  userGrowth: GrowthData[];
}

export interface ActivityItem {
  id: number;
  type: 'LOGIN' | 'QUIZ_ATTEMPT' | 'QUIZ_CREATED' | 'USER_REGISTERED';
  description: string;
  timestamp: string;
  userId?: number;
  userName?: string;
}

export interface QuizStats {
  quizId: number;
  title: string;
  totalAttempts: number;
  averageScore: number;
  completionRate: number;
}

export interface GrowthData {
  date: string;
  users: number;
  attempts: number;
}

export interface QuizAnalytics {
  quiz: Quiz;
  totalAttempts: number;
  averageScore: number;
  completionRate: number;
  timeSpent: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  questionStats: QuestionStats[];
  userPerformance: UserPerformance[];
}

export interface QuestionStats {
  questionId: number;
  question: string;
  totalAnswers: number;
  correctAnswers: number;
  accuracy: number;
  averageTime: number;
}

export interface UserPerformance {
  userId: number;
  userName: string;
  attempts: number;
  bestScore: number;
  averageScore: number;
  lastAttempt: string;
}

export interface Quiz {
  id: number;
  title: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: number;
}
