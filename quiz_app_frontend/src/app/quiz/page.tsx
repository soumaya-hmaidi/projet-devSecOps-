'use client';

import { QuizList } from '@/components/quiz/QuizList';
import { useQuiz } from '@/hooks/useQuiz';
import { useAuth } from '@/hooks/useAuth';
import { useAttempt } from '@/hooks/useAttempt';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function QuizPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { getQuizzes, quizzes, isLoading } = useQuiz();
  const { attempts } = useAttempt();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    
    if (user && user.role === 'ADMIN') {
      router.push('/admin/quizzes');
      return;
    }

    if (user) {
      getQuizzes();
    }
  }, [user, authLoading, router, getQuizzes]);

  const handleStartQuiz = (quizId: number) => {
    router.push(`/quiz/${quizId}`);
  };

  const handleViewQuiz = (quizId: number) => {
    router.push(`/quiz/${quizId}/preview`);
  };

  // Get completion status for quizzes
  const getQuizCompletionStatus = (quizId: number) => {
    if (!attempts || !Array.isArray(attempts)) {
      return null;
    }
    
    const attempt = attempts.find(a => a.quizId === quizId);
    if (!attempt) return null;
    
    return {
      completed: attempt.completed,
      score: attempt.score,
      attemptId: attempt.id
    };
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <QuizList
          quizzes={quizzes || []}
          isLoading={isLoading}
          onStartQuiz={handleStartQuiz}
          onViewQuiz={handleViewQuiz}
          title="Available Quizzes"
          description="Choose a quiz to test your knowledge and track your progress"
          getCompletionStatus={getQuizCompletionStatus}
        />
      </div>
    </div>
  );
}
