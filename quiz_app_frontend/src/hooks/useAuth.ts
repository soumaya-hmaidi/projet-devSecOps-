'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Get current user
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: () => authAPI.getCurrentUser().then(res => {
      console.log('Current user response:', res.data);
      return res.data.data?.user || null;
    }),
    retry: false,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'), // Only run on client side and if token exists
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      console.log('Login response:', response.data);
      const { data } = response.data;
      if (data && data.token && data.user) {
        localStorage.setItem('token', data.token);
        queryClient.setQueryData(['auth', 'user'], data.user);
        toast.success('Login successful!');
        // Use replace instead of push to prevent back button issues
        router.replace('/dashboard');
      } else {
        console.error('Invalid response structure:', response.data);
        toast.error('Invalid response from server');
      }
    },
    onError: (error: unknown) => {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any).response?.data?.message || 'Login failed'
        : 'Login failed';
      toast.error(errorMessage);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (response) => {
      console.log('Register response:', response.data);
      const { data } = response.data;
      if (data && data.token && data.user) {
        localStorage.setItem('token', data.token);
        queryClient.setQueryData(['auth', 'user'], data.user);
        toast.success('Registration successful!');
        router.replace('/dashboard');
      } else {
        console.error('Invalid response structure:', response.data);
        toast.error('Invalid response from server');
      }
    },
    onError: (error: unknown) => {
      console.error('Register error:', error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any).response?.data?.message || 'Registration failed'
        : 'Registration failed';
      toast.error(errorMessage);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      localStorage.removeItem('token');
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push('/');
    },
    onError: () => {
      // Even if logout fails on server, clear local data
      localStorage.removeItem('token');
      queryClient.clear();
      router.push('/');
    },
  });

  const login = (data: { email: string; password: string }) => {
    loginMutation.mutate(data);
  };

  const register = (data: { name: string; email: string; password: string; role: 'STUDENT' | 'ADMIN' }) => {
    registerMutation.mutate(data);
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
