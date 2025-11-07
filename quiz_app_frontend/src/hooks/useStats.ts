import { useQuery } from '@tanstack/react-query';
import { statsAPI } from '@/lib/api/stats';

export function useStats() {
  // Dashboard statistics
  const { data: dashboardStats, isLoading: isLoadingDashboard, error: dashboardError } = useQuery({
    queryKey: ['stats', 'dashboard'],
    queryFn: () => statsAPI.getDashboardStats().then(res => res.data.data),
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Quiz statistics
  const { data: quizStats, isLoading: isLoadingQuizzes, error: quizError } = useQuery({
    queryKey: ['stats', 'quizzes'],
    queryFn: () => statsAPI.getQuizStats().then(res => res.data.data),
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // User statistics
  const { data: userStats, isLoading: isLoadingUsers, error: userError } = useQuery({
    queryKey: ['stats', 'users'],
    queryFn: () => statsAPI.getUserStats().then(res => res.data.data),
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Analytics data
  const { data: analytics, isLoading: isLoadingAnalytics, error: analyticsError } = useQuery({
    queryKey: ['stats', 'analytics'],
    queryFn: () => statsAPI.getAnalytics().then(res => res.data.data),
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    // Dashboard
    dashboardStats,
    isLoadingDashboard,
    dashboardError,
    
    // Quizzes
    quizStats,
    isLoadingQuizzes,
    quizError,
    
    // Users
    userStats,
    isLoadingUsers,
    userError,
    
    // Analytics
    analytics,
    isLoadingAnalytics,
    analyticsError,
    
    // Combined loading state
    isLoading: isLoadingDashboard || isLoadingQuizzes || isLoadingUsers || isLoadingAnalytics,
  };
}
