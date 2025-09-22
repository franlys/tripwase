import { Request } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: any;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}
export interface AuthResponse {
    user: UserResponse;
    token: string;
    expiresIn: string;
}
export interface UserResponse {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
    lastLogin?: string;
    preferences?: UserPreferencesResponse;
}
export interface UserPreferencesResponse {
    currency: string;
    language: string;
    notifications: boolean;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: ValidationError[];
}
export interface ValidationError {
    field: string;
    message: string;
    code?: string;
}
export interface ErrorResponse {
    success: false;
    message: string;
    errors?: ValidationError[];
    code?: string;
    statusCode?: number;
}
export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
}
export interface TripStats {
    total: number;
    byStatus: Record<string, number>;
    totalBudget: number;
    averageBudget: number;
    destinations: string[];
    upcomingTrips: number;
    completedTrips: number;
}
