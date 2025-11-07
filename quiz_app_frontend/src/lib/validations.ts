import { z } from 'zod';

// Login form validation
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

// Register form validation
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  role: z.enum(['STUDENT', 'ADMIN'], {
    required_error: 'Please select a role',
  }),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Quiz form validation
export const quizSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  timeLimit: z
    .number()
    .min(1, 'Time limit must be at least 1 minute')
    .max(120, 'Time limit must be less than 120 minutes'),
  isActive: z.boolean(),
});

// Question form validation
export const questionSchema = z.object({
  text: z
    .string()
    .min(1, 'Question text is required')
    .min(10, 'Question must be at least 10 characters')
    .max(500, 'Question must be less than 500 characters'),
  type: z.enum(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_IN_BLANK'], {
    required_error: 'Please select a question type',
  }),
  points: z
    .number()
    .min(1, 'Points must be at least 1')
    .max(100, 'Points must be less than 100'),
  options: z.array(z.object({
    text: z.string().min(1, 'Option text is required'),
    isCorrect: z.boolean(),
  })).min(2, 'At least 2 options are required'),
});

// Answer submission validation
export const answerSchema = z.object({
  questionId: z.string().min(1, 'Question ID is required'),
  selectedOptionId: z.string().optional(),
  textAnswer: z.string().optional(),
}).refine((data) => data.selectedOptionId || data.textAnswer, {
  message: 'Please provide an answer',
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type QuizFormData = z.infer<typeof quizSchema>;
export type QuestionFormData = z.infer<typeof questionSchema>;
export type AnswerFormData = z.infer<typeof answerSchema>;
