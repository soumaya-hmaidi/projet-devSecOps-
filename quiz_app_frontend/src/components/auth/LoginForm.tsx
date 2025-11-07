'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import { useAuth } from '@/hooks/useAuth';
import { useDevFormFiller } from '@/contexts/DevFormFillerContext';
import { useEffect } from 'react';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuth();
  const { credentials, clearCredentials } = useDevFormFiller();

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  // Handle dev form filler credentials
  useEffect(() => {
    if (credentials) {
      setValue('email', credentials.email);
      setValue('password', credentials.password);
      // Trigger validation to clear errors
      trigger(['email', 'password']);
      // Clear credentials after setting
      clearCredentials();
    }
  }, [credentials, setValue, trigger, clearCredentials]);

  const onSubmit = (data: LoginFormData) => {
    console.log('Login form submitted:', data);
    login(data);
  };


  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0">
      <CardHeader className="text-center space-y-4 p-8">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground bounce-gentle">
            <BookOpen className="h-8 w-8" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Badge variant="secondary" className="w-fit mx-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            Welcome Back!
          </Badge>
          <CardTitle className="text-2xl font-bold text-gradient">
            Sign In to QuizKids
          </CardTitle>
          <CardDescription className="text-base">
            Continue your learning adventure
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-8 pt-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={`pl-10 h-12 ${errors.email ? 'border-red-500' : ''}`}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={`pl-10 pr-10 h-12 ${errors.password ? 'border-red-500' : ''}`}
                {...register('password')}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                {...register('remember')}
              />
              <Label htmlFor="remember" className="text-sm text-muted-foreground">
                Remember me
              </Label>
            </div>
            <Link 
              href="/forgot-password" 
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-medium"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? 'Signing In...' : 'Sign In'}
          </Button>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link 
                href="/register" 
                className="text-primary hover:underline font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
