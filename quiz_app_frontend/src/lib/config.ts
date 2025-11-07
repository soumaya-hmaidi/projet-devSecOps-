// Environment configuration
export const config = {
  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  appEnv: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  
  // Development Configuration
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Development Configuration
  devEmail: process.env.NEXT_PUBLIC_DEV_EMAIL || 'admin@quiz.com',
  devPassword: process.env.NEXT_PUBLIC_DEV_PASSWORD || 'admin123',
  devRole: process.env.NEXT_PUBLIC_DEV_ROLE || 'ADMIN',
  
  // Test Credentials
  testCredentials: {
    admin: {
      email: 'admin@quiz.com',
      password: 'admin123',
      role: 'ADMIN' as const,
    },
    student: {
      email: 'student@quiz.com',
      password: 'student123',
      role: 'STUDENT' as const,
    },
  },
  
  // Feature Flags
  features: {
    enableDevTools: process.env.NODE_ENV === 'development',
    enableLogging: process.env.NODE_ENV === 'development',
  },
};

// Development helpers
export const devHelpers = {
  // Quick login functions
  loginAsAdmin: () => config.testCredentials.admin,
  loginAsStudent: () => config.testCredentials.student,
  
  // Check if running in development
  isDev: () => config.isDevelopment,
  
  // Get current environment
  getEnv: () => config.appEnv,
};
