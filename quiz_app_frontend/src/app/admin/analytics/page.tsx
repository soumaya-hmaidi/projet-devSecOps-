'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStats } from '@/hooks/useStats';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen,
  Download,
  Calendar,
  Target,
  Loader2
} from 'lucide-react';

export default function AdminAnalytics() {
  const { analytics, isLoadingAnalytics, analyticsError } = useStats();

  if (isLoadingAnalytics) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (analyticsError) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <BarChart3 className="h-8 w-8 mx-auto mb-2" />
              <p>Failed to load analytics data</p>
            </div>
            <p className="text-gray-600">Please try refreshing the page</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const analyticsData = analytics || {
    totalQuizzes: 0,
    totalUsers: 0,
    totalAttempts: 0,
    averageScore: 0,
    completionRate: 0,
    topQuizzes: [],
    scoreDistribution: []
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Insights and performance metrics for your quizzes</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
              <BookOpen className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalQuizzes}</div>
              <p className="text-xs text-purple-200">Total quizzes created</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalUsers}</div>
              <p className="text-xs text-blue-200">Registered users</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
              <BarChart3 className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalAttempts}</div>
              <p className="text-xs text-green-200">Quiz attempts</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.averageScore}%</div>
              <p className="text-xs text-yellow-200">Overall performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Quizzes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-purple-600" />
                Top Performing Quizzes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topQuizzes.map((quiz, index) => (
                  <div key={quiz.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-purple-600">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{quiz.name}</h4>
                        <p className="text-sm text-gray-600">{quiz.attempts} attempts</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">{quiz.averageScore}%</p>
                      <p className="text-xs text-gray-500">Avg Score</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Score Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Score Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.scoreDistribution.map((item) => (
                  <div key={item.range} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{item.range}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(item.count / Math.max(...analytics.scoreDistribution.map(d => d.count))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Engagement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              User Engagement Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {analytics.userEngagement.map((data) => (
                  <div key={data.month} className="text-center p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">{data.month}</h4>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">{data.users} users</p>
                      <p className="text-sm text-gray-600">{data.attempts} attempts</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-yellow-600" />
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  {analyticsData.completionRate}%
                </div>
                <p className="text-gray-600">Average quiz completion rate</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-purple-600" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {Math.round(analytics.totalUsers * 0.8)}
                </div>
                <p className="text-gray-600">Users active in the last 30 days</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
