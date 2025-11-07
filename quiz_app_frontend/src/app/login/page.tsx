'use client';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { DevFormFiller } from '@/components/dev/DevFormFiller';
import { DevFormFillerProvider } from '@/contexts/DevFormFillerContext';

export default function LoginPage() {
  const handleLogin = () => {
    console.log('Login clicked');
  };

  const handleRegister = () => {
    console.log('Register clicked');
  };

  return (
    <DevFormFillerProvider>
      <AuthLayout onLogin={handleLogin} onRegister={handleRegister}>
        <LoginForm />
        <DevFormFiller />
      </AuthLayout>
    </DevFormFillerProvider>
  );
}
