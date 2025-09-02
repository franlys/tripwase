import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  login: (loginData: LoginData) => Promise<void>;
  register: (registerData: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const MOCK_USERS = [
  {
    id: 'demo-user',
    email: 'demo@tripwase.com',
    password: 'demo123',
    name: 'Usuario Demo',
    role: 'user' as const,
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('tripwase_user', null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-login con usuario demo si no hay usuario
  useEffect(() => {
    if (!user) {
      const demoUser: User = {
        id: 'demo-user',
        email: 'demo@tripwase.com',
        name: 'Usuario Demo',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
        lastLogin: new Date().toISOString()
      };
      setUser(demoUser);
      console.log('Auto-login con usuario demo');
    }
  }, [user, setUser]);

  const login = useCallback(async (loginData: LoginData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockUser = MOCK_USERS.find(u => 
        u.email === loginData.email && u.password === loginData.password
      );

      if (!mockUser) {
        throw new Error('Email o contraseña incorrectos');
      }

      const authenticatedUser: User = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
        lastLogin: new Date().toISOString()
      };

      setUser(authenticatedUser);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const register = useCallback(async (registerData: RegisterData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      if (!registerData.name || registerData.name.trim().length < 2) {
        throw new Error('El nombre debe tener al menos 2 caracteres');
      }

      if (!registerData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
        throw new Error('Email no válido');
      }

      if (!registerData.password || registerData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      const newUser: User = {
        id: `user_${Date.now()}`,
        email: registerData.email,
        name: registerData.name.trim(),
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      setUser(newUser);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear cuenta';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, [setUser]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser: User = {
      ...user,
      ...updates,
      id: user.id,
      createdAt: user.createdAt,
    };

    setUser(updatedUser);
  }, [user, setUser]);

  const isAuthenticated = !!user;

  const contextValue: AuthContextType = {
    user,
    error,
    isLoading,
    login,
    register,
    logout,
    clearError,
    updateProfile,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
