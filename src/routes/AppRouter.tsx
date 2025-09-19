// src/routes/AppRouter.tsx - Router principal de la aplicación
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import { ROUTES } from './routes.config';

// Importar páginas
import HomePage from '../pages/HomePage';
import DashboardPage from '../pages/DashboardPage';
import SearchPage from '../pages/SearchPage';
import PlannerPage from '../pages/PlannerPage';
import ComparisonPage from '../pages/ComparisonPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

// Layout components
import Layout from '../components/layout/Layout';

const AppRouter: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      
      {/* Rutas públicas */}
      <Route path="/" element={<Layout />}>
        
        {/* Homepage - accesible para todos */}
        <Route index element={<HomePage />} />
        
        {/* Rutas de autenticación */}
        <Route 
          path={ROUTES.LOGIN.path} 
          element={
            isAuthenticated ? 
              <Navigate to={ROUTES.DASHBOARD.path} replace /> : 
              <LoginPage />
          } 
        />
        
        <Route 
          path={ROUTES.REGISTER.path} 
          element={
            isAuthenticated ? 
              <Navigate to={ROUTES.DASHBOARD.path} replace /> : 
              <RegisterPage />
          } 
        />
        
        {/* Rutas protegidas */}
        <Route 
          path={ROUTES.DASHBOARD.path} 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path={ROUTES.SEARCH.path} 
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path={ROUTES.PLANNER.path} 
          element={
            <ProtectedRoute>
              <PlannerPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path={ROUTES.COMPARISON.path} 
          element={
            <ProtectedRoute>
              <ComparisonPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Ruta catch-all - redirigir según estado de autenticación */}
        <Route 
          path="*" 
          element={
            <Navigate 
              to={isAuthenticated ? ROUTES.DASHBOARD.path : ROUTES.HOME.path} 
              replace 
            />
          } 
        />
        
      </Route>
    </Routes>
  );
};

export default AppRouter;