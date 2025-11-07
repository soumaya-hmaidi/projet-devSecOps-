'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  BookOpen,
  Users
} from 'lucide-react';
import { useAdminQuizzes } from '@/hooks/useAdmin';
import { QuizManagementSkeleton } from './QuizManagementSkeleton';
import { Quiz } from '@/types/quiz';

export function QuizManagement() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'DRAFT' | 'ACTIVE'>('ALL');

  const { data: quizzes, isLoading, error } = useAdminQuizzes();

  const handleCreateQuiz = () => {
    router.push('/admin/quizzes/create');
  };

  const handleEditQuiz = (quiz: Quiz) => {
    router.push(`/admin/quizzes/edit/${quiz.id}`);
  };

  const handleViewQuiz = (quiz: Quiz) => {
    router.push(`/admin/quizzes/${quiz.id}`);
  };

  const handleDeleteQuiz = (quizId: number) => {
    if (confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      // TODO: Implement delete functionality
      console.log('Delete quiz:', quizId);
    }
  };

  const filteredQuizzes = quizzes?.filter((quiz: Quiz) => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || 
                         (filterStatus === 'ACTIVE' && quiz.isActive) ||
                         (filterStatus === 'DRAFT' && !quiz.isActive);
    return matchesSearch && matchesFilter;
  }) || [];

  if (isLoading) {
    return <QuizManagementSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <BookOpen className="h-8 w-8 mx-auto mb-2" />
            <p>Failed to load quizzes</p>
          </div>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quiz Management</h1>
          <p className="text-gray-600">Create, edit, and manage your quizzes</p>
        </div>
        <Button onClick={handleCreateQuiz} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Create New Quiz
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'ALL' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('ALL')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'DRAFT' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('DRAFT')}
              >
                Draft
              </Button>
              <Button
                variant={filterStatus === 'ACTIVE' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('ACTIVE')}
              >
                Active
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quizzes List */}
      <div className="space-y-4">
        {filteredQuizzes.map((quiz: Quiz) => (
          <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {/* Left side - Quiz Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{quiz.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Created by {quiz.createdBy?.name || 'Unknown User'}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-6">
                      <Badge 
                        variant={quiz.isActive ? 'default' : 'secondary'}
                        className="text-sm"
                      >
                        {quiz.isActive ? 'Active' : 'Draft'}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">{quiz._count?.questions || quiz.questions?.length || 0} Questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">{quiz._count?.attempts || 0} Attempts</span>
                    </div>
                  </div>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-2 ml-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewQuiz(quiz)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditQuiz(quiz)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredQuizzes.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'ALL' ? 'No quizzes found' : 'No quizzes yet'}
            </h3>
            <p className="text-gray-600 text-center mb-6">
              {searchTerm || filterStatus !== 'ALL' 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first quiz'
              }
            </p>
            {!searchTerm && filterStatus === 'ALL' && (
              <Button onClick={handleCreateQuiz} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Quiz
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
