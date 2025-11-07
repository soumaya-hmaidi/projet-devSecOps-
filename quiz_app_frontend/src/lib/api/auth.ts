import { api } from './base';

// Authentication API endpoints
export const authAPI = {
  // Login user
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  // Register user
  register: (data: { 
    name: string; 
    email: string; 
    password: string; 
    role: 'STUDENT' | 'ADMIN' 
  }) => api.post('/auth/register', data),

  // Get current user
  getCurrentUser: () => api.get('/auth/me'),

  // Logout (client-side only, no server endpoint needed)
  logout: () => api.post('/auth/logout'),
};

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'STUDENT' | 'ADMIN';
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'STUDENT' | 'ADMIN';
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}
