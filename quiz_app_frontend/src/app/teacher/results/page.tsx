'use client';

import { useEffect, useState } from 'react';
import { TeacherLayout } from '@/components/teacher/TeacherLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BarChart3, Search, Trophy, User } from 'lucide-react';
import { teacherAPI } from '@/lib/api/teacher';
import { toast } from 'sonner';

interface Attempt {
  id: number;
  score: number;
  completedAt: string;
  quiz: { id: number; title: string };
  user: { id: number; name: string; email: string };
}

export default function TeacherResultsPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    teacherAPI.getResults()
      .then((res: any) => setAttempts(res.data.data))
      .catch(() => toast.error('Failed to load results'))
      .finally(() => setIsLoading(false));
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number): 'default' | 'secondary' | 'destructive' => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const filtered = attempts.filter(a =>
    a.user.name.toLowerCase().includes(search.toLowerCase()) ||
    a.user.email.toLowerCase().includes(search.toLowerCase()) ||
    a.quiz.title.toLowerCase().includes(search.toLowerCase())
  );

  const avgScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
    : 0;

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Results</h1>
          <p className="text-gray-600">View all completed quiz attempts for your quizzes.</p>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8" />
                <div>
                  <p className="text-sm text-teal-200">Total Attempts</p>
                  <p className="text-2xl font-bold">{attempts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8" />
                <div>
                  <p className="text-sm text-green-200">Average Score</p>
                  <p className="text-2xl font-bold">{avgScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8" />
                <div>
                  <p className="text-sm text-blue-200">Unique Students</p>
                  <p className="text-2xl font-bold">{new Set(attempts.map(a => a.user.id)).size}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search by student name, email or quiz..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Results table */}
        <Card>
          <CardHeader>
            <CardTitle>Completed Attempts ({filtered.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {attempts.length === 0 ? 'No students have completed your quizzes yet.' : 'No results match your search.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-gray-500">
                      <th className="text-left py-3 px-2">Student</th>
                      <th className="text-left py-3 px-2">Quiz</th>
                      <th className="text-left py-3 px-2">Score</th>
                      <th className="text-left py-3 px-2">Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(attempt => (
                      <tr key={attempt.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-medium text-gray-900">{attempt.user.name}</p>
                            <p className="text-xs text-gray-500">{attempt.user.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-gray-700">{attempt.quiz.title}</td>
                        <td className="py-3 px-2">
                          <span className={`text-lg font-bold ${getScoreColor(attempt.score)}`}>
                            {attempt.score}%
                          </span>
                        </td>
                        <td className="py-3 px-2 text-gray-500">
                          {new Date(attempt.completedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TeacherLayout>
  );
}
