'use client';

import { useEffect, useState } from 'react';
import { TeacherLayout } from '@/components/teacher/TeacherLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { teacherAPI } from '@/lib/api/teacher';
import { toast } from 'sonner';

export default function TeacherQuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadQuizzes = () => {
    setIsLoading(true);
    teacherAPI.getQuizzes()
      .then((res: any) => setQuizzes(res.data.data))
      .catch(() => toast.error('Failed to load quizzes'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { loadQuizzes(); }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete quiz "${title}"? This will also delete all student attempts.`)) return;
    try {
      await teacherAPI.deleteQuiz(id);
      toast.success('Quiz deleted');
      loadQuizzes();
    } catch {
      toast.error('Failed to delete quiz');
    }
  };

  const handleToggleActive = async (quiz: any) => {
    try {
      await teacherAPI.updateQuiz(quiz.id, { isActive: !quiz.isActive });
      toast.success(quiz.isActive ? 'Quiz unpublished' : 'Quiz published');
      loadQuizzes();
    } catch {
      toast.error('Failed to update quiz');
    }
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Quizzes</h1>
            <p className="text-gray-600">Create, edit, and manage your quizzes.</p>
          </div>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => router.push('/teacher/quizzes/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Quiz
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        ) : quizzes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Quizzes Yet</h3>
              <p className="text-gray-500 mb-6">Create your first quiz to get started.</p>
              <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => router.push('/teacher/quizzes/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Quiz
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                        <Badge variant={quiz.isActive ? 'default' : 'secondary'}>
                          {quiz.isActive ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                      {quiz.description && (
                        <p className="text-gray-500 text-sm mb-2">{quiz.description}</p>
                      )}
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>{quiz._count?.questions || 0} questions</span>
                        <span>{quiz._count?.attempts || 0} attempts</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(quiz)}
                        className={quiz.isActive ? 'text-orange-600 border-orange-300' : 'text-teal-600 border-teal-300'}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {quiz.isActive ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/teacher/quizzes/edit/${quiz.id}`)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                        onClick={() => handleDelete(quiz.id, quiz.title)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
