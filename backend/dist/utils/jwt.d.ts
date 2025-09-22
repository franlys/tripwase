export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
}
export declare const generateToken: (payload: JWTPayload) => string;
export declare const verifyToken: (token: string) => JWTPayload;
export declare const extractTokenFromHeader: (authHeader?: string) => string | null;
export declare const createUserPayload: (user: {
    id: string;
    email: string;
    role: string;
}) => JWTPayload;
