import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import useAsync from '../hooks/useAsync';
import useErrorBoundary from '../hooks/useErrorBoundary';

export type UserRole = 'guest' | 'user' | 'premium' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  preferences: {
    currency: string;
    language: string;
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  subscription?: {
    type: 'basic' | 'premium' | 'enterprise';
    expiresAt: string;
    features: string[];
  };
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tokenType: 'Bearer';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  acceptTerms: boolean;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export interface AuthState {
  status: AuthStatus;
  user: User | null;
  token: AuthToken | null;
  error: string | null;
  isLoading: boolean;
  sessionExpired: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
  checkPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  isTokenValid: () => boolean;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: AuthToken } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_REFRESH_TOKEN'; payload: AuthToken }
  | { type: 'AUTH_UPDATE_USER'; payload: Partial<User> }
  | { type: 'AUTH_SESSION_EXPIRED' }
  | { type: 'AUTH_CLEAR_ERROR' };

const initialState: AuthState = {
  status: 'idle',
  user: null,
  token: null,
  error: null,
  isLoading: false,
  sessionExpired: false
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null, status: 'loading' };
    case 'AUTH_SUCCESS':
      return { ...state, isLoading: false, status: 'authenticated', user: action.payload.user, token: action.payload.token, error: null, sessionExpired: false };
    case 'AUTH_FAILURE':
      return { ...state, isLoading: false, status: 'unauthenticated', error: action.payload, user: null, token: null };
    case 'AUTH_LOGOUT':
      return { ...initialState, status: 'unauthenticated' };
    case 'AUTH_REFRESH_TOKEN':
      return { ...state, token: action.payload, sessionExpired: false };
    case 'AUTH_UPDATE_USER':
      return { ...state, user: state.user ? { ...state.user, ...action.payload } : null };
    case 'AUTH_SESSION_EXPIRED':
      return { ...state, sessionExpired: true, status: 'unauthenticated', token: null };
    case 'AUTH_CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [storedToken, setStoredToken] = useLocalStorage<AuthToken | null>('tripwase_auth_token', null);
  const [storedUser, setStoredUser] = useLocalStorage<User | null>('tripwase_user_data', null);

  const { captureError } = useErrorBoundary({
    onError: (error) => {
      if (error.context?.operation === 'auth') {
        dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      }
    }
  });

  const loginApi = async (credentials: LoginCredentials): Promise<{ user: User; token: AuthToken }> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (credentials.email === 'test@tripwase.com' && credentials.password === 'password123') {
      const user: User = {
        id: 'user_123',
        email: credentials.email,
        name: 'Usuario de Prueba',
        role: 'user',
        preferences: { currency: 'EUR', language: 'es', theme: 'light', notifications: true },
        subscription: { type: 'basic', expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), features: ['basic_search', 'trip_planning', 'favorites'] },
        createdAt: '2024-01-15T10:00:00Z',
        lastLoginAt: new Date().toISOString()
      };
      const token: AuthToken = { accessToken: 'token123', refreshToken: 'refresh123', expiresAt: Date.now() + (8 * 60 * 60 * 1000), tokenType: 'Bearer' };
      return { user, token };
    }
    throw new Error('Credenciales inválidas');
  };

  const registerApi = async (data: RegisterData): Promise<{ user: User; token: AuthToken }> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (data.email === 'existing@tripwase.com') throw new Error('El email ya está registrado');
    if (!data.acceptTerms) throw new Error('Debes aceptar los términos y condiciones');

    const user: User = {
      id: 'user_' + Date.now(),
      email: data.email,
      name: data.name,
      role: 'user',
      preferences: { currency: 'EUR', language: 'es', theme: 'light', notifications: true },
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
    const token: AuthToken = { accessToken: 'new_token', refreshToken: 'new_refresh', expiresAt: Date.now() + (8 * 60 * 60 * 1000), tokenType: 'Bearer' };
    return { user, token };
  };

  const loginAsync = useAsync(loginApi);
  const registerAsync = useAsync(registerApi);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const result = await loginAsync.execute(credentials);
      if (result) {
        dispatch({ type: 'AUTH_SUCCESS', payload: result });
        setStoredToken(result.token);
        setStoredUser(result.user);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error de login';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
    }
  }, [loginAsync, setStoredToken, setStoredUser]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const result = await registerAsync.execute(data);
      if (result) {
        dispatch({ type: 'AUTH_SUCCESS', payload: result });
        setStoredToken(result.token);
        setStoredUser(result.user);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error de registro';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
    }
  }, [registerAsync, setStoredToken, setStoredUser]);

  const logout = useCallback(() => {
    dispatch({ type: 'AUTH_LOGOUT' });
    setStoredToken(null);
    setStoredUser(null);
  }, [setStoredToken, setStoredUser]);

  const refreshToken = useCallback(async () => {
    // Simplified refresh logic
    if (state.token) {
      const newToken: AuthToken = { ...state.token, expiresAt: Date.now() + (8 * 60 * 60 * 1000) };
      dispatch({ type: 'AUTH_REFRESH_TOKEN', payload: newToken });
      setStoredToken(newToken);
    }
  }, [state.token, setStoredToken]);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!state.user) return;
    dispatch({ type: 'AUTH_UPDATE_USER', payload: updates });
    setStoredUser({ ...state.user, ...updates });
  }, [state.user, setStoredUser]);

  const clearError = useCallback(() => dispatch({ type: 'AUTH_CLEAR_ERROR' }), []);

  const isTokenValid = useCallback((): boolean => {
    return state.token ? state.token.expiresAt > Date.now() : false;
  }, [state.token]);

  const checkPermission = useCallback((permission: string): boolean => {
    if (!state.user) return false;
    if (state.user.role === 'admin') return true;
    return state.user.subscription?.features.includes(permission) || false;
  }, [state.user]);

  const hasRole = useCallback((role: UserRole): boolean => {
    return state.user?.role === role;
  }, [state.user]);

  useEffect(() => {
    if (storedToken && storedUser && storedToken.expiresAt > Date.now()) {
      dispatch({ type: 'AUTH_SUCCESS', payload: { user: storedUser, token: storedToken } });
    } else if (storedToken) {
      dispatch({ type: 'AUTH_SESSION_EXPIRED' });
      setStoredToken(null);
      setStoredUser(null);
    } else {
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  }, [storedToken, storedUser, setStoredToken, setStoredUser]);

  const value: AuthContextType = {
    ...state, login, register, logout, refreshToken, updateUser, clearError, checkPermission, hasRole, isTokenValid
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;
