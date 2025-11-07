'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AdminSidebarProps {
  className?: string;
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Quizzes',
    href: '/admin/quizzes',
    icon: BookOpen,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar({ className }: AdminSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-md"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-purple-600 to-purple-800 text-white z-50 transform transition-transform duration-300 ease-in-out",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0",
        className
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-purple-500">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-purple-800" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Quiz Admin</h2>
                <p className="text-sm text-purple-200">Management Panel</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-purple-500">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div>
                <p className="font-medium">{user?.name || 'Admin'}</p>
                <p className="text-xs text-purple-200">{user?.email || 'admin@quiz.com'}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left h-12 px-4 group",
                    isActive 
                      ? "bg-yellow-400 text-black hover:bg-yellow-300 hover:text-black" 
                      : "text-white hover:bg-purple-500 hover:text-white"
                  )}
                  onClick={() => handleNavigation(item.href)}
                >
                  <item.icon className={cn(
                    "h-5 w-5 mr-3",
                    isActive ? "text-black group-hover:text-black" : "text-white group-hover:text-white"
                  )} />
                  {item.name}
                </Button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-purple-500">
            <Button
              variant="ghost"
              className="w-full justify-start text-left h-12 px-4 text-white hover:bg-red-500 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
