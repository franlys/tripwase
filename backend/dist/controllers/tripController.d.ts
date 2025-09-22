import { Response } from 'express';
import { AuthenticatedRequest, ApiResponse, TripStats } from '../types';
export declare const getTripStats: (req: AuthenticatedRequest, res: Response<ApiResponse<TripStats>>) => Promise<void>;
