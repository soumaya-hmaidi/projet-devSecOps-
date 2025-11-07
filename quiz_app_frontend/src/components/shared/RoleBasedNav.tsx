'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Trophy, 
  Users, 
  BarChart3, 
  Settings,
  Brain,
  Play,
  Award,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function RoleBasedNav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  if (!user) return null;

  const isAdmin = user.role === 'ADMIN';
  const isStudent = user.role === 'STUDENT';

  return (
    <nav className="flex items-center space-x-4">
      {/* Role Badge */}
      <Badge variant="secondary" className="hidden sm:flex">
        {isAdmin ? (
          <>
            <Settings className="h-3 w-3 mr-1" />
            Teacher
          </>
        ) : (
          <>
            <Brain className="h-3 w-3 mr-1" />
            Student
          </>
        )}
      </Badge>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center space-x-2">
        {isAdmin ? (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/dashboard">
                <Home className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/quizzes">
                <BookOpen className="h-4 w-4 mr-1" />
                Quizzes
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/students">
                <Users className="h-4 w-4 mr-1" />
                Students
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/analytics">
                <BarChart3 className="h-4 w-4 mr-1" />
                Analytics
              </Link>
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/student/dashboard">
                <Home className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/quiz">
                <Play className="h-4 w-4 mr-1" />
                Take Quiz
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/student/achievements">
                <Award className="h-4 w-4 mr-1" />
                Achievements
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/student/progress">
                <Trophy className="h-4 w-4 mr-1" />
                Progress
              </Link>
            </Button>
          </>
        )}
      </div>

      {/* User Menu */}
      <div className="flex items-center space-x-2">
        <div className="hidden sm:block text-sm">
          <p className="font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}
