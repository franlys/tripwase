// src/App.tsx - VERSIÓN COMPLETA CON LOGIN Y REGISTRO

import React, { useState, Suspense } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  Globe, LogOut, User, ShieldCheck, Menu, X, Bell, 
  Settings, Search, ChevronRight, Home, Calendar,
  TrendingUp, CreditCard, Bookmark, MessageCircle,
  ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle
} from 'lucide-react';

// === IMPORTACIONES DE CONTEXTOS ===
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { TripProvider, useTrip } from './contexts/TripContext';

// === IMPORTACIONES DE COMPONENTES ===
import TripWaseGenerator from './components/trip/TripWaseGenerator';
import PlanComparison from './components/trip/PlanComparison';
import HomePage from './components/homepage/HomePage';
import Dashboard from './components/Dashboard';
import AdvancedSearch from './components/AdvancedSearch';
import PlanDetailsModal from './components/modals/PlanDetailsModal';

// === IMPORTACIONES DE TIPOS ===
import { SimplePlan } from './utils/multiplePlanGenerator';

// === IMPORTACIONES DE ESTILOS ===
import './styles/design-system.css';

// ===================================================================
// COMPONENTE DE REGISTRO - NUEVO
// ===================================================================
const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre es obligatorio';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email no válido';
    }

    if (!formData.password) {
      errors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });
      navigate(from, { replace: true });
    } catch (err) {
      // Error manejado por AuthContext
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error específico cuando el usuario comience a escribir
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 25, label: 'Débil', color: 'bg-red-500' };
    if (password.length < 8) return { strength: 50, label: 'Regular', color: 'bg-yellow-500' };
    if (password.length < 10) return { strength: 75, label: 'Buena', color: 'bg-blue-500' };
    return { strength: 100, label: 'Excelente', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header con animación */}
        <div className="text-center mb-8 animate-fade-in">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al login</span>
          </button>
          
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full mb-6 shadow-xl">
            <span className="text-white text-3xl font-bold">T</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">¡Únete a TripWase!</h1>
          <p className="text-gray-600 text-lg">Crea tu cuenta y comienza a planificar viajes increíbles</p>
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all ${
                  formErrors.name 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-orange-500'
                }`}
                placeholder="Tu nombre completo"
                required
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {formErrors.name}
                </p>
              )}
            </div>

            {/* Campo Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all ${
                  formErrors.email 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-orange-500'
                }`}
                placeholder="tu@email.com"
                required
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {formErrors.email}
                </p>
              )}
            </div>
            
            {/* Campo Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all ${
                    formErrors.password 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-orange-500'
                  }`}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Indicador de fortaleza de contraseña */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
              
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Campo Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all ${
                    formErrors.confirmPassword 
                      ? 'border-red-300 focus:border-red-500' 
                      : formData.confirmPassword && formData.password === formData.confirmPassword
                        ? 'border-green-300 focus:border-green-500'
                        : 'border-gray-200 focus:border-orange-500'
                  }`}
                  placeholder="Repite tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <CheckCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Términos y condiciones */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Acepto los{' '}
                <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
                  términos y condiciones
                </a>{' '}
                y la{' '}
                <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
                  política de privacidad
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:from-orange-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creando cuenta...</span>
                </span>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link 
                to="/login" 
                className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Al registrarte, tendrás acceso completo a todas las funciones</p>
          <p className="mt-2">Versión 2.0 • Hecho con ❤️ para viajeros</p>
        </div>
      </div>
    </div>
  );
};

// ===================================================================
// COMPONENTE DE LOGIN MEJORADO
// ===================================================================
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showDemo, setShowDemo] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (err) {
      // Error manejado por AuthContext
    }
  };

  const handleDemoLogin = () => {
    setFormData({ email: 'demo@tripwase.com', password: 'demo123' });
    // Auto-submit después de un pequeño delay para UX
    setTimeout(() => {
      const form = document.getElementById('login-form') as HTMLFormElement;
      form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header con animación */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full mb-6 shadow-xl">
            <span className="text-white text-3xl font-bold">T</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">¡Bienvenido de vuelta!</h1>
          <p className="text-gray-600 text-lg">Inicia sesión para continuar tu aventura</p>
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Demo credentials mejorado */}
          {showDemo && (
            <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-blue-800 font-bold text-sm">ACCESO DEMO</h3>
                <button
                  onClick={() => setShowDemo(false)}
                  className="text-blue-400 hover:text-blue-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 text-sm text-blue-700 mb-4">
                <p><strong>Email:</strong> demo@tripwase.com</p>
                <p><strong>Contraseña:</strong> demo123</p>
              </div>
              <button
                onClick={handleDemoLogin}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 font-medium text-sm"
              >
                Usar credenciales demo
              </button>
            </div>
          )}

          <form id="login-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                placeholder="tu@email.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  placeholder="Tu contraseña segura"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Recordar contraseña */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-600">Recordarme</span>
              </label>
              <a href="#" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:from-orange-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Iniciando sesión...</span>
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              ¿No tienes cuenta?{' '}
              <Link 
                to="/register" 
                className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
              >
                Crear cuenta gratis
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Versión 2.0 • Hecho con ❤️ para viajeros</p>
        </div>
      </div>
    </div>
  );
};

// ===================================================================
// COMPONENTE DE PROTECCIÓN DE RUTAS
// ===================================================================
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// ===================================================================
// GUARD PARA MOSTRAR MENSAJE DE LOGIN
// ===================================================================
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-required min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Inicia sesión para continuar
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
            Necesitas una cuenta para acceder a las funciones avanzadas de planificación de viajes
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:from-orange-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-xl"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => navigate('/register')}
              className="w-full px-8 py-4 bg-white border-2 border-orange-500 text-orange-600 font-bold text-lg rounded-xl hover:bg-orange-50 transition-all transform hover:scale-105"
            >
              Crear Cuenta Gratis
            </button>
            <p className="text-sm text-gray-500">
              La registración es gratuita y toma menos de 2 minutos
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// ===================================================================
// COMPONENTE DE NOTIFICACIONES
// ===================================================================
const NotificationCenter: React.FC = () => {
  const { notifications, markAsRead, clearAllNotifications } = useTrip();
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Notificaciones</h3>
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Limpiar todo
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No tienes notificaciones</p>
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === 'success' ? 'bg-green-500' :
                      notification.type === 'error' ? 'bg-red-500' :
                      notification.type === 'warning' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{notification.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                      <p className="text-gray-400 text-xs mt-2">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ===================================================================
// PÁGINAS COMO WRAPPERS
// ===================================================================
const HomePageRoute: React.FC = () => {
  const navigate = useNavigate();
  return <HomePage onNavigateToPlanner={() => navigate('/planner')} />;
};

const PlannerPageRoute: React.FC = () => {
  const navigate = useNavigate();
  const [generatedPlans, setGeneratedPlans] = useState<SimplePlan[]>([]);

  const handleShowPlans = (plans: SimplePlan[]) => {
    console.log('Planes generados en App:', plans);
    setGeneratedPlans(plans);
  };

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="heading-2">Planifica tu viaje perfecto</h2>
          <p className="text-large">
            Completa la información y recibe recomendaciones personalizadas
          </p>
        </div>
        <TripWaseGenerator
          onBackToExplore={() => navigate('/')}
          onShowPlans={handleShowPlans}
        />
      </div>
    </div>
  );
};

const ComparisonPageRoute: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<SimplePlan | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const plans: SimplePlan[] = (location.state as any)?.plans || [];

  const handleSelectPlan = (plan: SimplePlan) => {
    setSelectedPlan(plan);
    setShowDetailsModal(true);
  };

  const convertPlanToTrip = (plan: SimplePlan) => ({
    id: plan.id,
    name: plan.name,
    destination: { name: plan.accommodation.name, country: 'Destino' },
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    travelers: { adults: 2, children: 0 },
    currency: plan.currency,
    budget: { total: plan.totalCost },
    interests: []
  });

  if (plans.length === 0) {
    return (
      <div className="section">
        <div className="container">
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              No hay planes para comparar
            </h2>
            <p className="text-gray-500 mb-8">
              Primero debes generar algunos planes de viaje
            </p>
            <button
              onClick={() => navigate('/planner')}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-blue-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-blue-700 transition-all transform hover:scale-105"
            >
              Ir al Planificador
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="heading-2">Compara tus opciones</h2>
          <p className="text-large">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>
        
        <PlanComparison
          plans={plans}
          onSelectPlan={handleSelectPlan}
          onBack={() => navigate('/planner')}
        />

        {selectedPlan && (
          <PlanDetailsModal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            trip={convertPlanToTrip(selectedPlan)}
            onSaveTrip={() => { 
              setShowDetailsModal(false); 
              alert('¡Viaje guardado en favoritos!'); 
            }}
            onBookTrip={() => { 
              setShowDetailsModal(false); 
              alert('¡Redirigiendo a reserva!'); 
            }}
          />
        )}
      </div>
    </div>
  );
};

const DashboardPageRoute: React.FC = () => {
  return (
    <div className="section">
      <div className="container">
        <Dashboard />
      </div>
    </div>
  );
};

const SearchPageRoute: React.FC = () => (
  <div className="section">
    <div className="container">
      <div className="section-header">
        <h2 className="heading-2">Búsqueda Avanzada</h2>
        <p className="text-large">
          Encuentra el destino perfecto para tu próximo viaje
        </p>
      </div>
      <AdvancedSearch />
    </div>
  </div>
);

// ===================================================================
// COMPONENTE DE NAVEGACIÓN MÓVIL
// ===================================================================
const MobileMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">TripWase</h2>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <nav className="p-6">
          <ul className="space-y-4">
            <li>
              <Link 
                to="/" 
                className={`flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors ${
                  location.pathname === '/' ? 'text-orange-600 font-semibold' : ''
                }`}
                onClick={onClose}
              >
                <Home className="w-5 h-5" />
                <span>Inicio</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/planner" 
                className={`flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors ${
                  location.pathname === '/planner' ? 'text-orange-600 font-semibold' : ''
                }`}
                onClick={onClose}
              >
                <Calendar className="w-5 h-5" />
                <span>Planificar</span>
                {!isAuthenticated && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                    Login
                  </span>
                )}
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link 
                    to="/dashboard" 
                    className={`flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors ${
                      location.pathname === '/dashboard' ? 'text-orange-600 font-semibold' : ''
                    }`}
                    onClick={onClose}
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/search" 
                    className={`flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors ${
                      location.pathname === '/search' ? 'text-orange-600 font-semibold' : ''
                    }`}
                    onClick={onClose}
                  >
                    <Search className="w-5 h-5" />
                    <span>Búsqueda</span>
                  </Link>
                </li>
                <li className="pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="flex items-center space-x-3 text-red-600 hover:text-red-700 transition-colors w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="pt-4 border-t border-gray-200">
                  <Link 
                    to="/login" 
                    className="flex items-center space-x-3 text-orange-600 hover:text-orange-700 transition-colors"
                    onClick={onClose}
                  >
                    <User className="w-5 h-5" />
                    <span>Iniciar Sesión</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    className="flex items-center space-x-3 text-blue-600 hover:text-blue-700 transition-colors"
                    onClick={onClose}
                  >
                    <User className="w-5 h-5" />
                    <span>Crear Cuenta</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

// ===================================================================
// LAYOUT PRINCIPAL
// ===================================================================
const Layout: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { trips } = useTrip();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const breadcrumbs = [{ label: 'Inicio', path: '/' }];

    switch (path) {
      case '/planner':
        breadcrumbs.push({ label: 'Planificar Viaje', path: '/planner' });
        break;
      case '/comparison':
        breadcrumbs.push({ label: 'Planificar Viaje', path: '/planner' });
        breadcrumbs.push({ label: 'Comparar Planes', path: '/comparison' });
        break;
      case '/dashboard':
        breadcrumbs.push({ label: 'Dashboard', path: '/dashboard' });
        break;
      case '/search':
        breadcrumbs.push({ label: 'Búsqueda Avanzada', path: '/search' });
        break;
      case '/login':
        breadcrumbs.push({ label: 'Iniciar Sesión', path: '/login' });
        break;
      case '/register':
        breadcrumbs.push({ label: 'Crear Cuenta', path: '/register' });
        break;
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="app-container min-h-screen bg-gray-50">
      {/* Header mejorado */}
      <header className="header bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto">
          <div className="header-content flex items-center justify-between py-4 px-6">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
                TripWase
              </h1>
            </Link>

            {/* Navigation desktop */}
            <nav className="hidden lg:flex nav-main">
              <ul className="flex items-center space-x-8">
                <li>
                  <Link 
                    to="/" 
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      location.pathname === '/' 
                        ? 'bg-orange-100 text-orange-700 font-semibold' 
                        : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    <Globe className="w-5 h-5" />
                    <span>Inicio</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/planner" 
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      location.pathname === '/planner' 
                        ? 'bg-orange-100 text-orange-700 font-semibold' 
                        : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Planificar</span>
                    {!isAuthenticated && (
                      <span className="ml-1 text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                        Login
                      </span>
                    )}
                  </Link>
                </li>
                {isAuthenticated && (
                  <>
                    <li>
                      <Link 
                        to="/comparison" 
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                          location.pathname === '/comparison' 
                            ? 'bg-orange-100 text-orange-700 font-semibold' 
                            : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                        }`}
                      >
                        <TrendingUp className="w-5 h-5" />
                        <span>Comparar</span>
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/dashboard" 
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                          location.pathname === '/dashboard' 
                            ? 'bg-orange-100 text-orange-700 font-semibold' 
                            : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                        }`}
                      >
                        <TrendingUp className="w-5 h-5" />
                        <span>Dashboard</span>
                        {trips.length > 0 && (
                          <span className="ml-1 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                            {trips.length}
                          </span>
                        )}
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/search" 
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                          location.pathname === '/search' 
                            ? 'bg-orange-100 text-orange-700 font-semibold' 
                            : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                        }`}
                      >
                        <Search className="w-5 h-5" />
                        <span>Búsqueda</span>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>

            {/* User section */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <>
                  {/* Notificaciones */}
                  <NotificationCenter />
                  
                  <div className="hidden lg:flex items-center space-x-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">¡Hola, {user.name}!</p>
                        <p className="text-gray-500">{trips.length} viajes guardados</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Salir</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="hidden lg:flex items-center space-x-3">
                  <Link 
                    to="/login" 
                    className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium rounded-lg hover:bg-orange-50 transition-all"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-blue-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-blue-700 transition-all transform hover:scale-105"
                  >
                    Crear Cuenta
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Breadcrumbs mejorados */}
      {location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/register' && (
        <nav className="breadcrumbs bg-white border-b border-gray-200 py-3">
          <div className="container mx-auto px-6">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path}>
                  <li className="flex items-center">
                    {index === breadcrumbs.length - 1 ? (
                      <span className="text-gray-900 font-semibold">{crumb.label}</span>
                    ) : (
                      <Link 
                        to={crumb.path} 
                        className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                  {index < breadcrumbs.length - 1 && (
                    <li>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ol>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="main-content flex-1">
        <Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Cargando...</p>
            </div>
          </div>
        }>
          <Routes>
            {/* Ruta pública */}
            <Route path="/" element={<HomePageRoute />} />
            
            {/* Auth routes - redirigir si ya está autenticado */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                  <Navigate to="/dashboard" replace /> : 
                  <LoginPage />
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? 
                  <Navigate to="/dashboard" replace /> : 
                  <RegisterPage />
              } 
            />
            
            {/* Rutas que muestran mensaje de auth */}
            <Route path="/planner" element={<AuthGuard><PlannerPageRoute /></AuthGuard>} />
            <Route path="/comparison" element={<AuthGuard><ComparisonPageRoute /></AuthGuard>} />
            
            {/* Rutas completamente protegidas */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPageRoute /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><SearchPageRoute /></ProtectedRoute>} />
            
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {/* Footer mejorado */}
      <footer className="footer bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="footer-section">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900">TripWase</h4>
              </div>
              <p className="text-gray-600 mb-4">
                Tu compañero inteligente para explorar el mundo de manera personalizada y segura.
              </p>
              {!isAuthenticated && (
                <div className="space-y-2">
                  <Link 
                    to="/register" 
                    className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Crear cuenta gratis</span>
                  </Link>
                  <br />
                  <Link 
                    to="/login" 
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    <span>¿Ya tienes cuenta? Inicia sesión</span>
                  </Link>
                </div>
              )}
            </div>
            
            <div className="footer-section">
              <h4 className="font-bold text-gray-900 mb-4">Producto</h4>
              <ul className="space-y-2">
                <li><Link to="/planner" className="text-gray-600 hover:text-orange-600 transition-colors">Planificador</Link></li>
                <li><Link to="/search" className="text-gray-600 hover:text-orange-600 transition-colors">Búsqueda</Link></li>
                {isAuthenticated && (
                  <li><Link to="/dashboard" className="text-gray-600 hover:text-orange-600 transition-colors">Dashboard</Link></li>
                )}
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="font-bold text-gray-900 mb-4">Soporte</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Centro de ayuda</a></li>
                <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Contacto</a></li>
                <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Estado del sistema</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Términos de servicio</a></li>
                <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Política de privacidad</a></li>
                <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm">
              &copy; 2024 TripWase. Todos los derechos reservados.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Versión 2.0</span>
              {isAuthenticated && trips.length > 0 && (
                <span className="text-green-600 text-sm font-medium">
                  {trips.length} viajes guardados
                </span>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Debug info - solo en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black text-white text-xs p-3 rounded-lg z-50 max-w-xs">
          <div><strong>Ruta:</strong> {location.pathname}</div>
          <div><strong>Auth:</strong> {isAuthenticated ? 'Sí' : 'No'}</div>
          {user && <div><strong>Usuario:</strong> {user.name}</div>}
          {isAuthenticated && <div><strong>Viajes:</strong> {trips.length}</div>}
        </div>
      )}
    </div>
  );
};

// ===================================================================
// COMPONENTE PRINCIPAL CON PROVIDERS
// ===================================================================
const AppContent: React.FC = () => {
  return <Layout />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TripProvider>
        <FavoritesProvider>
          <AppContent />
        </FavoritesProvider>
      </TripProvider>
    </AuthProvider>
  );
};

export default App;