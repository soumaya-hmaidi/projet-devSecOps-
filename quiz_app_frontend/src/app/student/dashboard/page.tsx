'use client';

import { useAuth } from '@/hooks/useAuth';
import { useAttempt } from '@/hooks/useAttempt';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  TrendingUp, 
  Play,
  BarChart3,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { attempts, isLoading: attemptsLoading } = useAttempt();
  const router = useRouter();

  if (authLoading || attemptsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const completedAttempts = attempts?.filter(attempt => attempt.completed) || [];
  const averageScore = completedAttempts.length > 0 
    ? Math.round(completedAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / completedAttempts.length)
    : 0;

  const recentAttempts = attempts?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to test your knowledge? Choose a quiz and start learning!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quizzes Taken</p>
                  <p className="text-2xl font-bold">{completedAttempts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold">{averageScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Best Score</p>
                  <p className="text-2xl font-bold">
                    {completedAttempts.length > 0 
                      ? Math.max(...completedAttempts.map(a => a.score || 0))
                      : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time Spent</p>
                  <p className="text-2xl font-bold">
                    {Math.round(completedAttempts.length * 15)} min
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Play className="h-5 w-5 text-primary" />
                <span>Take a Quiz</span>
              </CardTitle>
              <CardDescription>
                Browse available quizzes and test your knowledge
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link href="/quiz">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Quizzes
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Your Progress</span>
              </CardTitle>
              <CardDescription>
                View your quiz history and performance analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/student/progress">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Progress
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Attempts */}
        {recentAttempts.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Recent Quiz Attempts</span>
              </CardTitle>
              <CardDescription>
                Your latest quiz activities and results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAttempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{attempt.quiz?.title || 'Quiz'}</h4>
                      <p className="text-sm text-muted-foreground">
                        Started: {new Date(attempt.startedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {attempt.completed ? (
                        <>
                          <Badge 
                            variant={attempt.score && attempt.score >= 80 ? "default" : "secondary"}
                            className={
                              attempt.score && attempt.score >= 80 
                                ? "bg-green-100 text-green-800" 
                                : attempt.score && attempt.score >= 60
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {attempt.score}%
                          </Badge>
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/quiz/${attempt.quizId}/results`}>
                              View Results
                            </Link>
                          </Button>
                        </>
                      ) : (
                        <Badge variant="secondary">
                          In Progress
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}