'use client';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { DevFormFiller } from '@/components/dev/DevFormFiller';

export default function RegisterPage() {
  const handleLogin = () => {
    console.log('Login clicked');
  };

  const handleRegister = () => {
    console.log('Register clicked');
  };

  return (
    <AuthLayout onLogin={handleLogin} onRegister={handleRegister}>
      <RegisterForm />
      <DevFormFiller />
    </AuthLayout>
  );
}
