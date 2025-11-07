'use client';
import { useParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { QuestionForm } from '@/components/admin/QuestionForm';
import { AdminQuizDetailsSkeleton } from '@/components/admin/AdminQuizDetailsSkeleton';
import { useQuestionById } from '@/hooks/useAdmin';

export default function EditQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const questionId = parseInt(params.id as string);

  const { data: question, isLoading, error } = useQuestionById(questionId);


  const handleSave = () => {
    router.back();
  };

  const handleClose = () => {
    router.back();
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
              <h2 className="text-xl font-semibold">Question Not Found</h2>
              <p className="text-gray-600 mt-2">The question you&apos;re looking for doesn&apos;t exist or has been deleted.</p>
            </div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Go Back
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!question) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-gray-600 mb-4">
              <h2 className="text-xl font-semibold">No Question Data</h2>
              <p className="text-gray-500 mt-2">Unable to load question information.</p>
            </div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Go Back
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <QuestionForm
        question={question.data}
        onClose={handleClose}
        onSave={handleSave}
      />
    </AdminLayout>
  );
}
