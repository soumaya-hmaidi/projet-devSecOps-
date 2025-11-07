// Export all API modules
export { authAPI } from './auth';
export { quizAPI } from './quiz';
export { attemptAPI } from './attempt';
export { adminAPI } from './admin';
export { statsAPI } from './stats';
export { api } from './base';

// Re-export types
export type {
  LoginRequest,
  RegisterRequest,
  User,
  AuthResponse,
} from './auth';

export type {
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
} from './quiz';

export type {
  Attempt,
  Answer,
  StartAttemptRequest,
  SubmitAttemptRequest,
} from './attempt';

export type {
  UpdateUserRequest,
  DashboardStats,
  ActivityItem,
  QuizStats,
  GrowthData,
  QuizAnalytics,
  QuestionStats,
  UserPerformance,
} from './admin';

export type {
  ApiResponse,
  PaginatedResponse,
  ApiError,
} from './base';
