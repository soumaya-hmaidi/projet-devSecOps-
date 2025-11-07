export interface Quiz {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: number;
  createdBy: {
    name: string;
  };
  questions?: Question[];
  _count?: {
    questions: number;
    attempts: number;
  };
}

export interface Question {
  id: number;
  quizId: number;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  points: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  options: QuestionOption[];
}

export interface QuestionOption {
  id: number;
  questionId: number;
  text: string;
  isCorrect: boolean;
  order: number;
  createdAt: string;
}
