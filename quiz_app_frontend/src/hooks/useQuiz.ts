'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { quizAPI, CreateQuestionRequest } from '@/lib/api/quiz';
import { toast } from 'sonner';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Get all quizzes
export function useQuizzes() {
  return useQuery({
    queryKey: ['quizzes'],
    queryFn: () => quizAPI.getQuizzes().then(res => res.data.data),
  });
}

// Get single quiz by ID
export function useQuizById(id: number) {
  return useQuery({
    queryKey: ['quiz', id],
    queryFn: () => quizAPI.getQuiz(id).then(res => res.data.data),
    enabled: !!id,
  });
}

// Combined quiz hook for easier usage
export function useQuiz() {
  const queryClient = useQueryClient();

  const getQuizzes = () => {
    return queryClient.fetchQuery({
      queryKey: ['quizzes'],
      queryFn: () => quizAPI.getQuizzes().then(res => res.data.data),
    });
  };

  const getQuizById = (id: number) => {
    return queryClient.fetchQuery({
      queryKey: ['quiz', id],
      queryFn: () => quizAPI.getQuiz(id).then(res => res.data),
    });
  };

  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: () => quizAPI.getQuizzes().then(res => res.data.data),
  });

  return {
    quizzes,
    isLoading,
    getQuizzes,
    getQuizById,
  };
}

// Get quiz questions
export function useQuizQuestions(quizId: number) {
  return useQuery({
    queryKey: ['quiz-questions', quizId],
    queryFn: () => quizAPI.getQuizQuestions(quizId).then(res => res.data.data),
    enabled: !!quizId,
  });
}

// Create quiz mutation
export function useCreateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: quizAPI.createQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast.success('Quiz created successfully!');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as ApiError)?.response?.data?.message || 'Failed to create quiz';
      toast.error(errorMessage);
    },
  });
}

// Update quiz mutation
export function useUpdateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => 
      quizAPI.updateQuiz(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['quiz', id] });
      toast.success('Quiz updated successfully!');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as ApiError)?.response?.data?.message || 'Failed to update quiz';
      toast.error(errorMessage);
    },
  });
}

// Delete quiz mutation
export function useDeleteQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: quizAPI.deleteQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast.success('Quiz deleted successfully!');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as ApiError)?.response?.data?.message || 'Failed to delete quiz';
      toast.error(errorMessage);
    },
  });
}

// Add question mutation
export function useAddQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, data }: { quizId: number; data: CreateQuestionRequest }) => 
      quizAPI.addQuestion(quizId, data),
    onSuccess: (_, { quizId }) => {
      queryClient.invalidateQueries({ queryKey: ['quiz-questions', quizId] });
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] });
      toast.success('Question added successfully!');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as ApiError)?.response?.data?.message || 'Failed to add question';
      toast.error(errorMessage);
    },
  });
}
