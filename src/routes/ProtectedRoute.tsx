// src/routes/ProtectedRoute.tsx - ProtectedRoute mejorado
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from './routes.config';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  roles?: Array<'user' | 'admin'>;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  roles = [],
  redirectTo = ROUTES.LOGIN.path
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Si requiere autenticación y no está autenticado
  if (requireAuth && !isAuthenticated) {
    // Guardar la ubicación actual para redirigir después del login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Si requiere roles específicos y el usuario no los tiene
  if (requireAuth && isAuthenticated && roles.length > 0) {
    const hasRequiredRole = user?.role && roles.includes(user.role);
    if (!hasRequiredRole) {
      return <Navigate to={ROUTES.DASHBOARD.path} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;