import { Request, Response } from 'express';
import { LoginRequest, RegisterRequest, AuthResponse, UserResponse, ApiResponse, AuthenticatedRequest } from '../types';
export declare const register: (req: Request<{}, ApiResponse<AuthResponse>, RegisterRequest>, res: Response<ApiResponse<AuthResponse>>) => Promise<void>;
export declare const login: (req: Request<{}, ApiResponse<AuthResponse>, LoginRequest>, res: Response<ApiResponse<AuthResponse>>) => Promise<void>;
export declare const getProfile: (req: AuthenticatedRequest, res: Response<ApiResponse<UserResponse>>) => Promise<void>;
export declare const logout: (req: AuthenticatedRequest, res: Response<ApiResponse>) => Promise<void>;
