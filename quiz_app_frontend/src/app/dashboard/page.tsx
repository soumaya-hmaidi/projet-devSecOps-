'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect based on user role
      if (user.role === 'ADMIN') {
        router.replace('/admin/dashboard');
      } else if (user.role === 'STUDENT') {
        router.replace('/student/dashboard');
      }
    } else if (!isLoading && !user) {
      // Redirect to login if not authenticated
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // This component will redirect, so we don't need to render anything
  return null;
}
