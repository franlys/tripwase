// src/contexts/AuthContext.tsx - Conectado al Backend Real

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// Configuración de la API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';
const API_URL = `${API_BASE_URL}/api/${API_VERSION}`;

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin: string;
  preferences?: {
    currency: 'USD' | 'DOP';
    language: 'es' | 'en';
    notifications: boolean;
  };
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

// Utilidades para localStorage
const TOKEN_KEY = 'tripwase_auth_token';

const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

const setStoredToken = (token: string) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

const clearStoredToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error clearing token:', error);
  }
};

// Verificar si el token está expirado
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    return payload.exp < now;
  } catch {
    return true;
  }
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('tripwase_user', null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Función para hacer requests autenticados
  const apiRequest = useCallback(async (
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<any> => {
    const token = getStoredToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      
      // Si el token expiró, hacer logout automático
      if (response.status === 401 && token) {
        console.warn('Token expired, logging out...');
        logout();
        throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }, []);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = getStoredToken();
        const storedUser = user;

        if (!storedToken || !storedUser) {
          setIsInitializing(false);
          return;
        }

        // Verificar si el token expiró
        if (isTokenExpired(storedToken)) {
          console.warn('Token expired on startup');
          clearStoredToken();
          setUser(null);
          setIsInitializing(false);
          return;
        }

        // Verificar token con el servidor
        try {
          const response = await fetch(`${API_URL}/auth/verify`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data && data.data.user) {
              // Actualizar usuario con datos frescos del servidor
              const updatedUser: User = {
                id: data.data.user.id,
                email: data.data.user.email,
                name: data.data.user.name || data.data.user.email,
                role: data.data.user.role?.toLowerCase() === 'admin' ? 'admin' : 'user',
                createdAt: data.data.user.createdAt || storedUser.createdAt,
                lastLogin: new Date().toISOString(),
                preferences: {
                  currency: data.data.user.preferences?.currency || 'USD',
                  language: data.data.user.preferences?.language?.toLowerCase() === 'en' ? 'en' : 'es',
                  notifications: data.data.user.preferences?.notifications ?? true
                }
              };
              
              setUser(updatedUser);
              console.log('Usuario autenticado:', updatedUser.name);
              setIsInitializing(false);
              return;
            }
          }
        } catch (error) {
          console.warn('Token verification failed:', error);
        }

        // Si llegamos aquí, el token no es válido
        clearStoredToken();
        setUser(null);
        setIsInitializing(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsInitializing(false);
      }
    };

    checkAuth();
  }, []); // Solo se ejecuta una vez al montar

  const login = useCallback(async (loginData: LoginData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validación básica del cliente
      if (!loginData.email || !loginData.password) {
        throw new Error('Email y contraseña son obligatorios');
      }

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      if (data.success && data.data && data.data.token && data.data.user) {
        // Guardar token
        setStoredToken(data.data.token);
        
        // Convertir datos del backend a nuestro formato
        const authenticatedUser: User = {
          id: data.data.user.id,
          email: data.data.user.email,
          name: data.data.user.name || data.data.user.email,
          role: data.data.user.role?.toLowerCase() === 'admin' ? 'admin' : 'user',
          createdAt: data.data.user.createdAt || new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          preferences: {
            currency: data.data.user.preferences?.currency || 'USD',
            language: data.data.user.preferences?.language?.toLowerCase() === 'en' ? 'en' : 'es',
            notifications: data.data.user.preferences?.notifications ?? true
          }
        };

        setUser(authenticatedUser);
        console.log('Login exitoso:', authenticatedUser.name);
        
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      console.error('Error de login:', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const register = useCallback(async (registerData: RegisterData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validaciones del cliente
      if (!registerData.name || !registerData.email || !registerData.password) {
        throw new Error('Todos los campos son obligatorios');
      }

      if (registerData.name.trim().length < 2) {
        throw new Error('El nombre debe tener al menos 2 caracteres');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
        throw new Error('Email no válido');
      }

      if (registerData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Preparar datos para el backend
      const requestData = {
        email: registerData.email.toLowerCase().trim(),
        password: registerData.password,
        name: registerData.name.trim()
      };

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear cuenta');
      }

      if (data.success && data.data && data.data.token && data.data.user) {
        // Guardar token
        setStoredToken(data.data.token);
        
        // Convertir datos del backend a nuestro formato
        const newUser: User = {
          id: data.data.user.id,
          email: data.data.user.email,
          name: data.data.user.name || data.data.user.email,
          role: data.data.user.role?.toLowerCase() === 'admin' ? 'admin' : 'user',
          createdAt: data.data.user.createdAt || new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          preferences: {
            currency: data.data.user.preferences?.currency || 'USD',
            language: data.data.user.preferences?.language?.toLowerCase() === 'en' ? 'en' : 'es',
            notifications: data.data.user.preferences?.notifications ?? true
          }
        };

        setUser(newUser);
        console.log('Registro exitoso:', newUser.name);
        
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear cuenta';
      setError(errorMessage);
      console.error('Error de registro:', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const logout = useCallback(() => {
    clearStoredToken();
    setUser(null);
    setError(null);
    console.log('Usuario desconectado');
  }, [setUser]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      // Optimistic update
      const updatedUser: User = {
        ...user,
        ...updates,
        // Proteger campos críticos
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      };

      setUser(updatedUser);

      // TODO: Enviar actualización al backend
      // await apiRequest('/user/profile', {
      //   method: 'PUT',
      //   body: JSON.stringify(updates)
      // });

      console.log('Perfil actualizado:', updatedUser.name);
    } catch (error) {
      // Revertir en caso de error
      console.error('Error updating profile:', error);
      // Podrías revertir el cambio aquí si falló la actualización en el backend
    }
  }, [user, setUser]);

  // Mostrar loading mientras se inicializa la autenticación
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const contextValue: AuthContextType = {
    user,
    error,
    isLoading,
    login,
    register,
    logout,
    clearError,
    updateProfile,
    isAuthenticated: !!user
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

// Hook para hacer requests autenticados desde otros componentes
export const useApiRequest = () => {
  const { logout } = useAuth();

  return useCallback(async (
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<any> => {
    const token = getStoredToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      
      // Si el token expiró, hacer logout automático
      if (response.status === 401 && token) {
        logout();
        throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }, [logout]);
};