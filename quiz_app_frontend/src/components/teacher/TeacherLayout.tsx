'use client';

import { TeacherSidebar } from './TeacherSidebar';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export function TeacherLayout({ children }: TeacherLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'TEACHER')) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading teacher panel...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'TEACHER') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherSidebar />
      <div className="lg:ml-64">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
