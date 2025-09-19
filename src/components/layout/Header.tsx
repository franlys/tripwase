// src/components/layout/Header.tsx - Header con autenticación
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../routes/routes.config';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME.path);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content flex-between">
          
          {/* Logo */}
          <Link to={ROUTES.HOME.path} className="logo-container">
            <h1 className="logo">TripWase</h1>
          </Link>

          {/* Navegación principal */}
          <nav className="nav-main">
            <ul className="nav-list">
              <li>
                <Link to={ROUTES.HOME.path} className="nav-link">
                  <Globe className="w-4 h-4" />
                  Inicio
                </Link>
              </li>
              {isAuthenticated && (
                <>
                  <li>
                    <Link to={ROUTES.PLANNER.path} className="nav-link">
                      ✈️ Planificar
                    </Link>
                  </li>
                  <li>
                    <Link to={ROUTES.COMPARISON.path} className="nav-link">
                      📊 Comparar
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Sección de usuario */}
          <div className="user-section">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="user-greeting font-medium text-gray-700">
                    ¡Hola, {user.name}!
                  </span>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary">
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to={ROUTES.LOGIN.path} className="nav-link">
                  Iniciar Sesión
                </Link>
                <Link to={ROUTES.REGISTER.path} className="btn btn-primary">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;