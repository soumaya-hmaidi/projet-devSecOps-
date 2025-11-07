import { api } from './base';

// Attempt API endpoints
export const attemptAPI = {
  // Start a quiz attempt
  startAttempt: (quizId: number) => api.post('/attempts/start', { quizId }),

  // Submit an answer for a specific attempt
  submitAnswer: (attemptId: number, answer: { questionId: number; optionId?: number; textAnswer?: string }) => 
    api.post(`/attempts/${attemptId}/answers`, answer),

  // Submit all answers and complete attempt
  submitAttempt: (attemptId: number, answers: Record<number, any>) => 
    api.post(`/attempts/${attemptId}/submit`, { answers }),

  // Complete an attempt
  completeAttempt: (attemptId: number) => api.post(`/attempts/${attemptId}/complete`),

  // Get user's attempts
  getMyAttempts: () => api.get('/attempts/my-attempts'),

  // Get specific attempt details
  getAttempt: (attemptId: number) => api.get(`/attempts/${attemptId}`),
};

// Attempt types
export interface Attempt {
  id: number;
  quizId: number;
  userId: number;
  score?: number;
  completed: boolean;
  startedAt: string;
  completedAt?: string;
  quiz?: {
    id: number;
    title: string;
    description?: string;
  };
  user?: {
    id: number;
    name: string;
    email: string;
  };
  answers?: Answer[];
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

export interface StartAttemptRequest {
  quizId: number;
}

export interface SubmitAnswerRequest {
  questionId: number;
  optionId?: number;
  textAnswer?: string;
}

export interface SubmitAttemptRequest {
  answers: Record<number, any>;
}

export interface AttemptResponse {
  success: boolean;
  message: string;
  data: Attempt;
}