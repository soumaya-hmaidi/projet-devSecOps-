'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAttempt } from '@/hooks/useAttempt';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  CheckCircle, 
  XCircle, 
  Clock, 
  BookOpen,
  ArrowLeft,
  RotateCcw,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function QuizResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { getAttempt } = useAttempt();
  const [attempt, setAttempt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const attemptId = parseInt(params.id as string);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && user.role === 'ADMIN') {
      router.push('/admin/quizzes');
      return;
    }

    if (user && attemptId) {
      loadAttempt();
    }
  }, [user, authLoading, router, attemptId]);

  const loadAttempt = async () => {
    try {
      setIsLoading(true);
      const attemptData = await getAttempt(attemptId);
      setAttempt(attemptData);
    } catch (error) {
      toast.error('Failed to load quiz results');
      console.error('Error loading attempt:', error);
      router.push('/student/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!attempt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50 flex items-center justify-center">
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-gradient mb-2">Results Not Found</h3>
            <p className="text-muted-foreground text-center mb-6">
              The quiz results you're looking for don't exist or are no longer available.
            </p>
            <Button onClick={() => router.push('/student/dashboard')}>
              <Home className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const score = attempt.score || 0;
  const totalQuestions = attempt.quiz?.questions?.length || 0;
  const correctAnswers = attempt.answers?.filter((answer: any) => answer.isCorrect).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground bounce-gentle">
                <Trophy className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Quiz Complete!</h1>
            <p className="text-muted-foreground text-lg">
              Here are your results for "{attempt.quiz?.title}"
            </p>
          </div>

          {/* Score Overview */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Your Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}>
                  {score}%
                </div>
                <Badge 
                  variant={getScoreBadgeVariant(score)}
                  className="text-lg px-4 py-2"
                >
                  {score >= 80 ? 'Excellent!' : score >= 60 ? 'Good Job!' : 'Keep Practicing!'}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Correct Answers</span>
                  <span className="font-medium">{correctAnswers} / {totalQuestions}</span>
                </div>
                <Progress value={(correctAnswers / totalQuestions) * 100} className="h-3" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-900">{correctAnswers}</p>
                  <p className="text-sm text-green-700">Correct</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="font-semibold text-red-900">{totalQuestions - correctAnswers}</p>
                  <p className="text-sm text-red-700">Incorrect</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quiz Details */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>Quiz Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Questions</p>
                    <p className="text-sm text-blue-700">{totalQuestions}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Completed</p>
                    <p className="text-sm text-green-700">
                      {attempt.completedAt ? new Date(attempt.completedAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
                  <Trophy className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-purple-900">Score</p>
                    <p className="text-sm text-purple-700">{score}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Review */}
          {attempt.quiz?.questions && (
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle>Question Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attempt.quiz.questions.map((question: any, index: number) => {
                    const userAnswer = attempt.answers?.find((a: any) => a.questionId === question.id);
                    const isCorrect = userAnswer?.isCorrect || false;
                    
                    return (
                      <div
                        key={question.id}
                        className={`p-4 rounded-lg border ${
                          isCorrect 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600 mt-1" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium mb-2">
                              Question {index + 1}: {question.question}
                            </h4>
                            <div className="space-y-2">
                              {question.type === 'MULTIPLE_CHOICE' && question.options && (
                                <div className="space-y-1">
                                  {question.options.map((option: any) => (
                                    <div
                                      key={option.id}
                                      className={`p-2 rounded text-sm ${
                                        option.isCorrect
                                          ? 'bg-green-100 text-green-800'
                                          : userAnswer?.optionId === option.id
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-gray-100 text-gray-600'
                                      }`}
                                    >
                                      {option.text}
                                      {option.isCorrect && ' ✓'}
                                      {userAnswer?.optionId === option.id && !option.isCorrect && ' ✗'}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {question.type === 'TRUE_FALSE' && (
                                <div className="space-y-1">
                                  <div className={`p-2 rounded text-sm ${
                                    question.options?.find((o: any) => o.isCorrect)?.text === 'True'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    True {question.options?.find((o: any) => o.isCorrect)?.text === 'True' && '✓'}
                                  </div>
                                  <div className={`p-2 rounded text-sm ${
                                    question.options?.find((o: any) => o.isCorrect)?.text === 'False'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    False {question.options?.find((o: any) => o.isCorrect)?.text === 'False' && '✓'}
                                  </div>
                                </div>
                              )}
                              {question.type === 'TEXT' && (
                                <div className="space-y-1">
                                  <div className="p-2 bg-gray-100 rounded text-sm">
                                    Your answer: {userAnswer?.textAnswer || 'No answer provided'}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link href="/quiz">
                <BookOpen className="h-4 w-4 mr-2" />
                Take Another Quiz
              </Link>
            </Button>
            <Button asChild>
              <Link href="/student/dashboard">
                <Home className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/student/progress">
                <RotateCcw className="h-4 w-4 mr-2" />
                View Progress
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
