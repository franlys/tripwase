// src/types/index.ts
// Centralized exports for all types
export * from './country';
export * from './location';
export * from './trip';
export * from './auth';
export * from './favorites';

// Common utility types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export type Currency = 'USD' | 'EUR' | 'DOP' | 'GBP';

export type AppView = 'login' | 'home' | 'explore' | 'planner';

export type DashboardView = 'explore' | 'planner';
