'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { QuizForm } from '@/components/admin/QuizForm';
import { AdminQuizDetailsSkeleton } from '@/components/admin/AdminQuizDetailsSkeleton';
import { useQuizById } from '@/hooks/useQuiz';
import { toast } from 'sonner';

export default function EditQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = parseInt(params.id as string);

  const { data: quiz, isLoading, error } = useQuizById(quizId);

  // Remove unnecessary isClient logic (avoid setState in useEffect for this kind of check)

  const handleSave = () => {
    toast.success('Quiz updated successfully!');
    // Don't navigate away - stay on edit page
  };

  const handleClose = () => {
    router.push('/admin/quizzes');
  };

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
              <h2 className="text-xl font-semibold">Quiz Not Found</h2>
              <p className="text-gray-600 mt-2">The quiz you're looking for doesn't exist or has been deleted.</p>
            </div>
            <button
              onClick={() => router.push('/admin/quizzes')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Back to Quizzes
            </button>
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
              <h2 className="text-xl font-semibold">No Quiz Data</h2>
              <p className="text-gray-500 mt-2">Unable to load quiz information.</p>
            </div>
            <button
              onClick={() => router.push('/admin/quizzes')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <QuizForm
        quiz={quiz}
        onClose={handleClose}
        onSave={handleSave}
      />
    </AdminLayout>
  );
}
