'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { attemptAPI } from '@/lib/api/attempt';
import { toast } from 'sonner';

// Get user attempts
// Get all attempts for current user
export function useAttempts() {
  return useQuery({
    queryKey: ['attempts'],
    queryFn: async () => {
      const response = await attemptAPI.getMyAttempts();
      return response.data.data; // This should be the array of attempts
    },
  });
}

// Get attempt by ID (renamed to avoid duplicate export)
export function useAttemptById(id: number) {
  return useQuery({
    queryKey: ['attempt', id],
    queryFn: () => attemptAPI.getAttempt(id).then(res => res.data.data),
    enabled: !!id,
  });
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Start attempt mutation
export function useStartAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: attemptAPI.startAttempt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attempts'] });
      toast.success('Quiz started successfully!');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as ApiError)?.response?.data?.message || 'Failed to start quiz';
      toast.error(errorMessage);
    },
  });
}

// Submit answer mutation
export function useSubmitAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ attemptId, answer }: { attemptId: number; answer: { questionId: number; optionId?: number; textAnswer?: string } }) =>
      attemptAPI.submitAnswer(attemptId, answer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attempts'] });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as ApiError)?.response?.data?.message || 'Failed to submit answer';
      toast.error(errorMessage);
    },
  });
}

// Complete attempt mutation
export function useCompleteAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attemptId: number) => attemptAPI.completeAttempt(attemptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attempts'] });
      toast.success('Quiz completed successfully!');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as ApiError)?.response?.data?.message || 'Failed to complete quiz';
      toast.error(errorMessage);
    },
  });
}

// Combined attempt hook for easier usage
export function useAttempt() {
  const startAttempt = async (quizId: number) => {
    const response = await attemptAPI.startAttempt(quizId);
    return response.data.data;
  };

  const submitAnswer = async (attemptId: number, answer: { questionId: number; optionId?: number; textAnswer?: string }) => {
    const response = await attemptAPI.submitAnswer(attemptId, answer);
    return response.data.data;
  };

  const submitAttempt = async (attemptId: number, answers: Record<number, any>) => {
    const response = await attemptAPI.submitAttempt(attemptId, answers);
    return response.data.data;
  };

  const completeAttempt = async (attemptId: number) => {
    const response = await attemptAPI.completeAttempt(attemptId);
    return response.data.data;
  };

  const getAttempt = async (attemptId: number) => {
    const response = await attemptAPI.getAttempt(attemptId);
    return response.data.data;
  };

  const { data: attempts, isLoading } = useQuery({
    queryKey: ['attempts'],
    queryFn: async () => {
      const response = await attemptAPI.getMyAttempts();
      return response.data.data; // This should be the array of attempts
    },
  });

  const startAttemptMutation = useStartAttempt();
  const submitAnswerMutation = useSubmitAnswer();
  const completeAttemptMutation = useCompleteAttempt();

  return {
    attempts,
    isLoading,
    startAttempt,
    submitAnswer,
    submitAttempt,
    completeAttempt,
    getAttempt,
    isStarting: startAttemptMutation.isPending,
    isSubmittingAnswer: submitAnswerMutation.isPending,
    isCompleting: completeAttemptMutation.isPending,
  };
}