'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Trophy, Star, User } from 'lucide-react';
import { RoleBasedNav } from './RoleBasedNav';
import Link from 'next/link';

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    role: 'ADMIN' | 'STUDENT';
  };
  onLogin?: () => void;
  onRegister?: () => void;
  onLogout?: () => void;
}

export function Header({ user, onLogin, onRegister, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gradient">QuizKids</h1>
              <p className="text-xs text-muted-foreground">Learn & Play</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {user ? (
          <RoleBasedNav />
        ) : (
          <>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                How it Works
              </a>
              <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
                About
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
