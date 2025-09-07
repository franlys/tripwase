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

// Trip-related types
export type Currency = 'USD' | 'EUR' | 'DOP' | 'GBP';
export type TravelMode = 'auto' | 'avion' | 'tren' | 'bus';

// ✅ Ahora sí incluye todos los campos que usas en TripGenerator
export interface TripFormData {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency: Currency;
  travelMode: TravelMode;
}

export interface OriginData {
  country: string;
  countryCode: string;
  city: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export type AppView = 'login' | 'home' | 'explore' | 'planner';
export type DashboardView = 'explore' | 'planner';
