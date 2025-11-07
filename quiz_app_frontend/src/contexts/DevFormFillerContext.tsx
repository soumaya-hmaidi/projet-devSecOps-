'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Credentials {
  email: string;
  password: string;
}

interface DevFormFillerContextType {
  credentials: Credentials | null;
  fillAdminCredentials: () => void;
  fillStudentCredentials: () => void;
  clearCredentials: () => void;
}

const DevFormFillerContext = createContext<DevFormFillerContextType | undefined>(undefined);

interface DevFormFillerProviderProps {
  children: ReactNode;
}

export function DevFormFillerProvider({ children }: DevFormFillerProviderProps) {
  const [credentials, setCredentials] = useState<Credentials | null>(null);

  const fillAdminCredentials = () => {
    setCredentials({
      email: 'admin@quiz.com',
      password: 'admin123'
    });
  };

  const fillStudentCredentials = () => {
    setCredentials({
      email: 'student@quiz.com',
      password: 'student123'
    });
  };

  const clearCredentials = () => {
    setCredentials(null);
  };

  return (
    <DevFormFillerContext.Provider
      value={{
        credentials,
        fillAdminCredentials,
        fillStudentCredentials,
        clearCredentials
      }}
    >
      {children}
    </DevFormFillerContext.Provider>
  );
}

export function useDevFormFiller() {
  const context = useContext(DevFormFillerContext);
  if (context === undefined) {
    throw new Error('useDevFormFiller must be used within a DevFormFillerProvider');
  }
  return context;
}