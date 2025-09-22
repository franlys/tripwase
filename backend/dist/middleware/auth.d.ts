import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types';
export declare const authenticate: (req: AuthenticatedRequest, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const rateLimitByUser: (maxRequests?: number, windowMs?: number) => (req: AuthenticatedRequest, res: Response<ApiResponse>, next: NextFunction) => void;
