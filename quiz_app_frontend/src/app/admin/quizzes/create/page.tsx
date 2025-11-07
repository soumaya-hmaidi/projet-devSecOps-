'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { QuizForm } from '@/components/admin/QuizForm';
import { AdminQuizDetailsSkeleton } from '@/components/admin/AdminQuizDetailsSkeleton';
import { toast } from 'sonner';

export default function CreateQuizPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSave = () => {
    toast.success('Quiz created successfully!');
    router.push('/admin/quizzes');
  };

  const handleClose = () => {
    router.push('/admin/quizzes');
  };

  if (!isClient) {
    return (
      <AdminLayout>
        <AdminQuizDetailsSkeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <QuizForm
        quiz={null}
        onClose={handleClose}
        onSave={handleSave}
      />
    </AdminLayout>
  );
}
