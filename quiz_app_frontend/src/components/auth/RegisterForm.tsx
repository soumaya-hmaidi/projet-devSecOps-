'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Eye, EyeOff, Mail, Lock, User, Sparkles, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { registerSchema, type RegisterFormData } from '@/lib/validations';
import { useAuth } from '@/hooks/useAuth';

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isRegistering } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'STUDENT',
      terms: false,
    },
  });

  const watchedRole = watch('role');

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0">
      <CardHeader className="text-center space-y-4 p-8">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground bounce-gentle">
            <GraduationCap className="h-8 w-8" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Badge variant="secondary" className="w-fit mx-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            Join the Adventure!
          </Badge>
          <CardTitle className="text-2xl font-bold text-gradient">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-base">
            Start your learning journey today
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-8 pt-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className={`pl-10 h-12 ${errors.name ? 'border-red-500' : ''}`}
                {...register('name')}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

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

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              I am a...
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={watchedRole === 'STUDENT' ? 'default' : 'outline'}
                className="h-12"
                onClick={() => setValue('role', 'STUDENT')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Student
              </Button>
              <Button
                type="button"
                variant={watchedRole === 'ADMIN' ? 'default' : 'outline'}
                className="h-12"
                onClick={() => setValue('role', 'ADMIN')}
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Teacher
              </Button>
            </div>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
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
                placeholder="Create a password"
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

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                className={`pl-10 pr-10 h-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                {...register('confirmPassword')}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
              {...register('terms')}
            />
            <Label htmlFor="terms" className="text-sm text-muted-foreground">
              I agree to the{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>
          {errors.terms && (
            <p className="text-sm text-red-500">{errors.terms.message}</p>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-medium"
            disabled={isRegistering}
          >
            {isRegistering ? 'Creating Account...' : 'Create Account'}
          </Button>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="text-primary hover:underline font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
