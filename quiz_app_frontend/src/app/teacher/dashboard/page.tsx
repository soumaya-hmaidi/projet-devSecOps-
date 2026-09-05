'use client';

import { useEffect, useState } from 'react';
import { TeacherLayout } from '@/components/teacher/TeacherLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, BarChart3, TrendingUp, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { teacherAPI } from '@/lib/api/teacher';
import { toast } from 'sonner';

export default function TeacherDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ totalQuizzes: 0, totalAttempts: 0, averageScore: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    teacherAPI.getDashboard()
      .then((res: any) => setStats(res.data.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
            <p className="text-gray-600">Manage your quizzes and track student performance.</p>
          </div>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => router.push('/teacher/quizzes/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Quiz
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Quizzes</CardTitle>
              <BookOpen className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalQuizzes}</div>
              <p className="text-xs text-teal-200">Total quizzes created</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
              <BarChart3 className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalAttempts}</div>
              <p className="text-xs text-blue-200">Students who took your quizzes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : `${stats.averageScore}%`}</div>
              <p className="text-xs text-green-200">Across all completed attempts</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                onClick={() => router.push('/teacher/quizzes/create')}
              >
                <Plus className="h-6 w-6" />
                <span>Create New Quiz</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => router.push('/teacher/quizzes')}
              >
                <BookOpen className="h-6 w-6" />
                <span>Manage Quizzes</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => router.push('/teacher/results')}
              >
                <BarChart3 className="h-6 w-6" />
                <span>View Results</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TeacherLayout>
  );
}
