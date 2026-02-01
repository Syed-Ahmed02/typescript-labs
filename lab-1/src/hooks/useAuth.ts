import { useState, useEffect, useCallback, useRef } from 'react';
import type { User, AsyncStatus } from '../types';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const MOCK_USER: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin',
  permissions: ['read', 'write', 'delete'],
  lastLogin: new Date(),
  profile: {
    avatar: 'https://i.pravatar.cc/150?img=12',
    bio: 'Full-stack developer and tech enthusiast',
    preferences: {
      theme: 'dark',
      notifications: true,
      language: 'en',
    },
  },
};

export const useAuth = (): any => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loginAttempts = useRef(0);

  const checkAuth = useCallback(async (): Promise<void> => {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      setUser(MOCK_USER);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      loginAttempts.current += 1;
      
      if (email === 'john@example.com' && password === 'password123') {
        localStorage.setItem('auth_token', 'mock_token_' + Date.now());
        setUser(MOCK_USER);
        loginAttempts.current = 0;
      } else {
        throw new Error(
          loginAttempts.current >= 3
            ? 'Too many failed attempts. Please try again later.'
            : 'Invalid email or password'
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback((): void => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setError(null);
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>): Promise<void> => {
    setIsLoading(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setUser((prev) => {
        if (!prev) return null;
        
        return {
          ...prev,
          ...data,
          profile: data.profile
            ? { ...prev.profile, ...data.profile }
            : prev.profile,
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    updateProfile,
  };
};
