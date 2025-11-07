'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { QuizManagement } from '@/components/admin/QuizManagement';

export default function AdminQuizzesPage() {
  return (
    <AdminLayout>
      <QuizManagement />
    </AdminLayout>
  );
}