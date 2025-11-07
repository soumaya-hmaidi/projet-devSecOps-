'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { QuizDetails } from '@/components/admin/QuizDetails';
import { useQuizById } from '@/hooks/useQuiz';
import { useParams } from 'next/navigation';
import { AdminQuizDetailsSkeleton } from '@/components/admin/AdminQuizDetailsSkeleton';

export default function AdminQuizDetailsPage() {
  const params = useParams();
  const quizId = parseInt(params.id as string);
  
  const { data: quiz, isLoading, error } = useQuizById(quizId);
  
  if (isLoading) {
    return (
      <AdminLayout>
        <AdminQuizDetailsSkeleton />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <div className="h-8 w-8 mx-auto mb-2 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">!</span>
              </div>
              <p>Failed to load quiz</p>
            </div>
            <p className="text-gray-600">Please try refreshing the page</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!quiz) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-gray-600 mb-4">
              <div className="h-8 w-8 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-bold">?</span>
              </div>
              <p>Quiz not found</p>
            </div>
            <p className="text-gray-600">The quiz you&apos;re looking for doesn&apos;t exist</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <QuizDetails 
        quiz={quiz.data}
        onClose={() => window.history.back()}
        onEdit={() => {
          // Navigate to edit page or open edit modal
          console.log('Edit quiz:', quiz.id);
        }}
      />
    </AdminLayout>
  );
}
