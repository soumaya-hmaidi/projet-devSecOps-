import { api } from './base';

// Quiz API endpoints
export const quizAPI = {
  // Get all quizzes
  getQuizzes: () => api.get('/quizzes'),

  // Get quiz by ID
  getQuiz: (id: number) => api.get(`/quizzes/${id}`),

  // Create new quiz (Admin only)
  createQuiz: (data: CreateQuizRequest) => api.post('/quizzes', data),

  // Update quiz (Admin only)
  updateQuiz: (id: number, data: UpdateQuizRequest) => api.put(`/quizzes/${id}`, data),

  // Delete quiz (Admin only)
  deleteQuiz: (id: number) => api.delete(`/quizzes/${id}`),

  // Get quiz questions
  getQuizQuestions: (id: number) => api.get(`/quizzes/${id}/questions`),

  // Add question to quiz (Admin only)
  addQuestion: (quizId: number, data: CreateQuestionRequest) => 
    api.post(`/quizzes/${quizId}/questions`, data),

  // Update question (Admin only)
  updateQuestion: (questionId: number, data: UpdateQuestionRequest) => 
    api.put(`/questions/${questionId}`, data),

  // Delete question (Admin only)
  deleteQuestion: (questionId: number) => api.delete(`/questions/${questionId}`),
};

// Quiz types
export interface Quiz {
  id: number;
  title: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: number;
  createdBy?: User;
  questions?: Question[];
  attempts?: QuizAttempt[];
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

export interface Question {
  id: number;
  quizId: number;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'TEXT';
  points: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  options?: Option[];
  answers?: Answer[];
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
  type?: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'TEXT';
  points?: number;
  order?: number;
}

export interface Option {
  id: number;
  questionId: number;
  text: string;
  isCorrect: boolean;
  order: number;
  createdAt: string;
}

export interface CreateOptionRequest {
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface Answer {
  id: number;
  attemptId: number;
  questionId: number;
  optionId?: number;
  textAnswer?: string;
  isCorrect?: boolean;
  createdAt: string;
}

export interface QuizAttempt {
  id: number;
  quizId: number;
  userId: number;
  score?: number;
  completed: boolean;
  startedAt: string;
  completedAt?: string;
  quiz?: Quiz;
  user?: User;
  answers?: Answer[];
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'STUDENT' | 'ADMIN';
}
