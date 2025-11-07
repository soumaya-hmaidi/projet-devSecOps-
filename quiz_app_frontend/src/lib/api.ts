// Legacy API file - now redirects to modular structure
// This file is kept for backward compatibility

export {
  authAPI,
  quizAPI,
  attemptAPI,
  adminAPI,
  api,
} from './api';

// Re-export all types
export type {
  LoginRequest,
  RegisterRequest,
  User,
  AuthResponse,
  Quiz,
  CreateQuizRequest,
  UpdateQuizRequest,
  Question,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  Option,
  CreateOptionRequest,
  Answer,
  QuizAttempt,
  SubmitAnswerRequest,
  AttemptResults,
  UserStats,
  UpdateUserRequest,
  DashboardStats,
  ActivityItem,
  QuizStats,
  GrowthData,
  QuizAnalytics,
  QuestionStats,
  UserPerformance,
  ApiResponse,
  PaginatedResponse,
  ApiError,
} from './api';
