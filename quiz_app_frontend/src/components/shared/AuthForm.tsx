'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Eye, EyeOff, Mail, Lock, User, Sparkles, GraduationCap } from 'lucide-react';
import Link from 'next/link';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: any) => void;
}

export function AuthForm({ type, onSubmit }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT' as 'STUDENT' | 'ADMIN'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isLogin = type === 'login';

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0">
      <CardHeader className="text-center space-y-4 p-8">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground bounce-gentle">
            {isLogin ? <BookOpen className="h-8 w-8" /> : <GraduationCap className="h-8 w-8" />}
          </div>
        </div>
        
        <div className="space-y-2">
          <Badge variant="secondary" className="w-fit mx-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            {isLogin ? 'Welcome Back!' : 'Join the Adventure!'}
          </Badge>
          <CardTitle className="text-2xl font-bold text-gradient">
            {isLogin ? 'Sign In to QuizKids' : 'Create Your Account'}
          </CardTitle>
          <CardDescription className="text-base">
            {isLogin ? 'Continue your learning adventure' : 'Start your learning journey today'}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-8 pt-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field - Only for Register */}
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>

          {/* Role Selection - Only for Register */}
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">
                I am a...
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={formData.role === 'STUDENT' ? 'default' : 'outline'}
                  className="h-12"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'STUDENT' }))}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Student
                </Button>
                <Button
                  type="button"
                  variant={formData.role === 'ADMIN' ? 'default' : 'outline'}
                  className="h-12"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'ADMIN' }))}
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Teacher
                </Button>
              </div>
            </div>
          )}

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-10 h-12"
                required
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
          </div>

          {/* Confirm Password Field - Only for Register */}
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 h-12"
                  required
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
            </div>
          )}

          {/* Remember Me & Forgot Password - Only for Login */}
          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
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
          )}

          {/* Terms and Conditions - Only for Register */}
          {!isLogin && (
            <div className="flex items-start space-x-2">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
                required
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
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-medium"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>


          {/* Sign In/Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Link 
                href={isLogin ? "/register" : "/login"} 
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? "Sign up here" : "Sign in here"}
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
