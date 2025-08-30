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

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users database (en producción esto vendría de un backend)
const MOCK_USERS = [
  {
    id: '1',
    email: 'demo@tripwase.com',
    password: 'demo123',
    name: 'Usuario Demo',
    role: 'user' as const,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    email: 'admin@tripwase.com',
    password: 'admin123',
    name: 'Admin TripWase',
    role: 'admin' as const,
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('tripwase_user', null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-login check on mount
  useEffect(() => {
    if (user) {
      console.log('Usuario autenticado automáticamente:', user.name);
    }
  }, [user]);

  // Simulación de API de login
  const login = useCallback(async (loginData: LoginData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Buscar usuario en mock database
      const mockUser = MOCK_USERS.find(u => 
        u.email === loginData.email && u.password === loginData.password
      );

      if (!mockUser) {
        throw new Error('Credenciales incorrectas');
      }

      // Crear objeto de usuario autenticado
      const authenticatedUser: User = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
        lastLogin: new Date().toISOString()
      };

      setUser(authenticatedUser);
      console.log('Login exitoso:', authenticatedUser.name);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  // Simulación de API de registro
  const register = useCallback(async (registerData: RegisterData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Verificar si el email ya existe
      const existingUser = MOCK_USERS.find(u => u.email === registerData.email);
      if (existingUser) {
        throw new Error('Este email ya está registrado');
      }

      // Validaciones básicas
      if (!registerData.name || registerData.name.trim().length < 2) {
        throw new Error('El nombre debe tener al menos 2 caracteres');
      }

      if (!registerData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
        throw new Error('Email no válido');
      }

      if (!registerData.password || registerData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Crear nuevo usuario
      const newUser: User = {
        id: Date.now().toString(),
        email: registerData.email,
        name: registerData.name.trim(),
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // En producción, aquí se guardaría en el backend
      MOCK_USERS.push({
        ...newUser,
        password: registerData.password
      });

      setUser(newUser);
      console.log('Registro exitoso:', newUser.name);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear cuenta';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    console.log('Sesión cerrada');
  }, [setUser]);

  // Limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Actualizar perfil
  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      
      const updatedUser = {
        ...prev,
        ...updates,
        id: prev.id, // No permitir cambio de ID
        createdAt: prev.createdAt, // No permitir cambio de fecha de creación
      };

      console.log('Perfil actualizado:', updatedUser.name);
      return updatedUser;
    });
  }, [setUser]);

  // Estado de autenticación
  const isAuthenticated = !!user;

  // Contexto value
  const value: AuthContextType = {
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
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Exportar también el contexto para uso directo si es necesario
export { AuthContext };