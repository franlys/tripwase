// src/types/auth.ts
export interface User {
  name: string;
  email: string;
  id?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  loading: boolean;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}
