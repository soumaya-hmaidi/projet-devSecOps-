import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api/admin';
import { toast } from 'sonner';

// Dashboard stats
export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: () => adminAPI.getDashboardStats().then(res => res.data),
  });
}

// Get all users
export function useUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminAPI.getUsers().then(res => res.data),
  });
}

// Get single user
export function useUser(id: number) {
  return useQuery({
    queryKey: ['admin-user', id],
    queryFn: () => adminAPI.getUser(id).then(res => res.data),
    enabled: !!id,
  });
}

// Get all quizzes (admin view)
export function useAdminQuizzes() {
  return useQuery({
    queryKey: ['admin-quizzes'],
    queryFn: () => adminAPI.getAllQuizzes().then(res => res.data.data),
  });
}

// Get quiz analytics
export function useQuizAnalytics(quizId: number) {
  return useQuery({
    queryKey: ['quiz-analytics', quizId],
    queryFn: () => adminAPI.getQuizAnalytics(quizId).then(res => res.data),
    enabled: !!quizId,
  });
}

// Get system analytics
export function useSystemAnalytics() {
  return useQuery({
    queryKey: ['system-analytics'],
    queryFn: () => adminAPI.getSystemAnalytics().then(res => res.data),
  });
}

// Get all attempts (admin view)
export function useAdminAttempts() {
  return useQuery({
    queryKey: ['admin-attempts'],
    queryFn: () => adminAPI.getAllAttempts().then(res => res.data),
  });
}

// Update user mutation
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      adminAPI.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user', id] });
      toast.success('User updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user');
    },
  });
}

// Delete user mutation
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminAPI.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    },
  });
}

// Publish quiz mutation
export function usePublishQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminAPI.publishQuiz,
    onSuccess: (_, quizId) => {
      queryClient.invalidateQueries({ queryKey: ['admin-quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] });
      toast.success('Quiz published successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to publish quiz');
    },
  });
}

// Unpublish quiz mutation
export function useUnpublishQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminAPI.unpublishQuiz,
    onSuccess: (_, quizId) => {
      queryClient.invalidateQueries({ queryKey: ['admin-quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] });
      toast.success('Quiz unpublished successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to unpublish quiz');
    },
  });
}

// Delete question mutation
export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminAPI.deleteQuestion,
    onSuccess: (_, questionId) => {
      // Invalidate quiz-related queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['admin-quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['quiz'] });
      queryClient.invalidateQueries({ queryKey: ['quiz-questions'] });
      toast.success('Question deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete question');
    },
  });
}

// Get single question by ID
export function useQuestionById(id: number) {
  return useQuery({
    queryKey: ['question', id],
    queryFn: () => adminAPI.getQuestionById(id).then(res => res.data),
    enabled: !!id,
  });
}

// Update question mutation
export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ questionId, data }: { questionId: number; data: any }) => 
      adminAPI.updateQuestion(questionId, data),
    onSuccess: (_, { questionId }) => {
      // Invalidate question-related queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['question', questionId] });
      queryClient.invalidateQueries({ queryKey: ['admin-quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['quiz'] });
      queryClient.invalidateQueries({ queryKey: ['quiz-questions'] });
      toast.success('Question updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update question');
    },
  });
}

// Update option mutation
export function useUpdateOption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ optionId, data }: { optionId: number; data: any }) => 
      adminAPI.updateOption(optionId, data),
    onSuccess: (_, { optionId }) => {
      // Invalidate question-related queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['question'] });
      queryClient.invalidateQueries({ queryKey: ['admin-quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['quiz'] });
      queryClient.invalidateQueries({ queryKey: ['quiz-questions'] });
      toast.success('Option updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update option');
    },
  });
}

// Delete option mutation
export function useDeleteOption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminAPI.deleteOption,
    onSuccess: (_, optionId) => {
      // Invalidate question-related queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['question'] });
      queryClient.invalidateQueries({ queryKey: ['admin-quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['quiz'] });
      queryClient.invalidateQueries({ queryKey: ['quiz-questions'] });
      toast.success('Option deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete option');
    },
  });
}