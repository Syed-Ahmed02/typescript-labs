import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (email === 'test@example.com' && password === 'password') {
      const mockUser: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        permissions: ['read', 'write'],
        lastLogin: new Date(),
        profile: {
          avatar: 'https://example.com/avatar.jpg',
          bio: 'Test user bio',
          preferences: {
            theme: 'light',
            notifications: true,
            language: 'en',
          },
        },
      };
      
      setState((prev) => ({
        ...prev,
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      }));
    } else {
      throw new Error('Invalid credentials');
    }
  }, []);

  const logout = useCallback((): void => {
    setState(initialState);
  }, []);

  const updateUser = useCallback((updates: Partial<User>): void => {
    setState((prev) => {
      if (!prev.user) {
        return prev;
      }
      
      return {
        ...prev,
        user: { ...prev.user, ...updates },
      };
    });
  }, []);

  const clearError = useCallback((): void => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
