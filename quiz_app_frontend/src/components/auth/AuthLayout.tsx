'use client';

import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  onLogin?: () => void;
  onRegister?: () => void;
}

export function AuthLayout({ children, onLogin, onRegister }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header 
        onLogin={onLogin}
        onRegister={onRegister}
      />
      
      <main className="overflow-x-hidden">
        {/* Hero Section with Auth Form */}
        <section className="relative overflow-hidden bg-gradient-children py-16 sm:py-20 lg:py-24">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-md mx-auto">
              {/* Back to Home */}
              <div className="mb-8">
                <Link 
                  href="/" 
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </div>

              {/* Auth Form */}
              {children}

              {/* Additional Info */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  {onLogin ? 
                    'By signing in, you agree to our Terms of Service and Privacy Policy.' :
                    'Join thousands of children who are already learning and having fun with QuizKids!'
                  }
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
