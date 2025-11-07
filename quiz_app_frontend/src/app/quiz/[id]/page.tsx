'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { QuizTaking } from '@/components/quiz/QuizTaking';
import { useQuizById } from '@/hooks/useQuiz';
import { useAuth } from '@/hooks/useAuth';
import { useAttempt } from '@/hooks/useAttempt';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Play, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function QuizTakingPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const quizId = parseInt(params.id as string);
  const { data: quiz, isLoading: quizLoading, error: quizError } = useQuizById(quizId);
  
  const { startAttempt, submitAttempt, submitAnswer, isSubmitting, attempts } = useAttempt();
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && user.role === 'ADMIN') {
      router.push('/admin/quizzes');
      return;
    }
  }, [user, authLoading, router]);

  // Check for existing attempts when attempts data is loaded
  useEffect(() => {
    if (attempts && quizId) {
      const existingAttempt = attempts.find(a => a.quizId === quizId);
      if (existingAttempt) {
        if (existingAttempt.completed) {
          // User has completed this quiz, redirect to results
          router.push(`/quiz/${quizId}/results`);
        } else {
          // User has an incomplete attempt, set it as current
          setAttemptId(existingAttempt.id);
        }
      }
    }
  }, [attempts, quizId, router]);

  const handleStartQuiz = async () => {
    if (!user || !quiz) return;

    setIsStarting(true);
    try {
      const attempt = await startAttempt(quizId);
      setAttemptId(attempt.id);
    } catch (error: any) {
      console.error('Error starting quiz:', error);
      
      // Handle 409 Conflict - user already attempted this quiz
      if (error.response?.status === 409) {
        // Check if user has a completed attempt and redirect to results
        const existingAttempt = attempts?.find(a => a.quizId === quizId);
        
        if (existingAttempt?.completed) {
          toast.info('You have already completed this quiz. Redirecting to results...');
          router.push(`/quiz/${quizId}/results`);
          return;
        } else if (existingAttempt && !existingAttempt.completed) {
          // User has an incomplete attempt, allow them to continue
          toast.info('Resuming your previous attempt...');
          setAttemptId(existingAttempt.id);
          return;
        }
      }
      
      toast.error('Failed to start quiz. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleSubmitAnswer = async (questionId: number, answer: any) => {
    if (!attemptId) return;

    try {
      // Convert answer to proper format based on question type
      const question = quiz?.questions.find(q => q.id === questionId);
      if (!question) return;

      let submitData: { questionId: number; optionId?: number; textAnswer?: string } = {
        questionId
      };

      if (question.type === 'MULTIPLE_CHOICE') {
        const optionId = parseInt(answer, 10);
        if (!isNaN(optionId) && optionId >= 1) {
          submitData.optionId = optionId;
        } else {
          console.error('Invalid optionId for MULTIPLE_CHOICE:', answer);
          return;
        }
      } else if (question.type === 'TRUE_FALSE') {
        // Find the option ID for TRUE_FALSE questions
        const option = question.options?.find(opt => opt.text.toLowerCase() === answer.toLowerCase());
        if (option && option.id >= 1) {
          submitData.optionId = option.id;
        } else {
          console.error('Invalid option for TRUE_FALSE:', answer, question.options);
          return;
        }
      } else if (question.type === 'TEXT') {
        submitData.textAnswer = answer;
      }

      await submitAnswer(attemptId, submitData);
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  };

  const handleCompleteQuiz = async (answers: Record<number, any>) => {
    if (!attemptId) return;

    try {
      const result = await submitAttempt(attemptId, answers);
      toast.success(`Quiz submitted successfully! Your score: ${result.score}%`);
      router.push(`/quiz/${quizId}/results`);
    } catch (error) {
      toast.error('Failed to submit quiz. Please try again.');
      console.error('Error submitting quiz:', error);
    }
  };

  const handleExitQuiz = () => {
    router.push('/quiz');
  };

  if (authLoading || quizLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (quizError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50 flex items-center justify-center">
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-gradient mb-2">Error Loading Quiz</h3>
            <p className="text-muted-foreground text-center mb-6">
              There was an error loading the quiz. Please try again.
            </p>
            <Button onClick={() => router.push('/quiz')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quizzes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50 flex items-center justify-center">
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-gradient mb-2">Quiz Not Found</h3>
            <p className="text-muted-foreground text-center mb-6">
              The quiz you're looking for doesn't exist or is no longer available.
            </p>
            <Button onClick={() => router.push('/quiz')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quizzes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If quiz is started, show the taking interface
  if (attemptId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50">
        <div className="container mx-auto px-4 py-8">
          <QuizTaking
            quiz={quiz}
            attemptId={attemptId}
            onComplete={handleCompleteQuiz}
            onExit={handleExitQuiz}
            onSubmitAnswer={handleSubmitAnswer}
          />
        </div>
      </div>
    );
  }

  // Quiz preview/start screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground bounce-gentle">
                  <BookOpen className="h-8 w-8" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-gradient mb-2">
                {quiz.title}
              </CardTitle>
              {quiz.description && (
                <p className="text-muted-foreground text-lg">{quiz.description}</p>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Quiz Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Questions</p>
                    <p className="text-sm text-blue-700">{quiz.questions?.length || 0}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-4 bg-green-50 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Time Limit</p>
                    <p className="text-sm text-green-700">30 minutes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-4 bg-purple-50 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-purple-900">Difficulty</p>
                    <p className="text-sm text-purple-700">Mixed</p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">Instructions</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Read each question carefully before answering</li>
                  <li>• You can navigate between questions using the navigation buttons</li>
                  <li>• You can change your answers before submitting</li>
                  <li>• The quiz will auto-submit when time runs out</li>
                  <li>• Make sure you have a stable internet connection</li>
                </ul>
              </div>

              {/* Start Button */}
              <div className="text-center">
                <Button
                  size="lg"
                  onClick={handleStartQuiz}
                  disabled={isStarting}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
                >
                  {isStarting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Starting Quiz...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Start Quiz
                    </>
                  )}
                </Button>
              </div>

              {/* Back Button */}
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => router.push('/quiz')}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Quizzes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
