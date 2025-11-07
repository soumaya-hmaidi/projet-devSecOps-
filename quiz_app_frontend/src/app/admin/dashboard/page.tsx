'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboardSkeleton } from '@/components/admin/AdminDashboardSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStats } from '@/hooks/useStats';
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  Plus,
  TrendingUp,
  Clock
} from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  attempts: number;
  averageScore: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const { dashboardStats, isLoadingDashboard, dashboardError } = useStats();

  if (isLoadingDashboard) {
    return (
      <AdminLayout>
        <AdminDashboardSkeleton />
      </AdminLayout>
    );
  }

  if (dashboardError) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <BarChart3 className="h-8 w-8 mx-auto mb-2" />
              <p>Failed to load statistics</p>
            </div>
            <p className="text-gray-600">Please try refreshing the page</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const stats = dashboardStats || {
    totalQuizzes: 0,
    totalUsers: 0,
    totalAttempts: 0,
    averageScore: 0,
    recentQuizzes: [],
    recentUsers: [],
    topQuizzes: []
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your quizzes.</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Quiz
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
              <BookOpen className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
              <p className="text-xs text-purple-200">+2 from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-blue-200">+12 from last week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
              <BarChart3 className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAttempts}</div>
              <p className="text-xs text-green-200">+28 from yesterday</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}%</div>
              <p className="text-xs text-yellow-200">+3.2% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Quizzes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                Recent Quizzes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentQuizzes.map((quiz: Quiz) => (
                  <div key={quiz.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                      <p className="text-sm text-gray-600">{quiz.attempts} attempts</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">{quiz.averageScore}% avg</p>
                      <p className="text-xs text-gray-500">Score</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Quizzes
              </Button>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Recent Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentUsers.map((user: User) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-600">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Users
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-yellow-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                <Plus className="h-6 w-6" />
                <span>Create New Quiz</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Users className="h-6 w-6" />
                <span>Manage Users</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span>View Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}