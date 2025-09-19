// src/routes/routes.config.ts - Configuración centralizada de rutas
export interface RouteConfig {
  path: string;
  label: string;
  icon?: string;
  description?: string;
  requiresAuth?: boolean;
  roles?: Array<'user' | 'admin'>;
}

export const ROUTES: Record<string, RouteConfig> = {
  HOME: {
    path: '/',
    label: 'Inicio',
    icon: '🏠',
    description: 'Página principal',
    requiresAuth: false
  },
  DASHBOARD: {
    path: '/dashboard',
    label: 'Dashboard',
    icon: '📊',
    description: 'Panel principal',
    requiresAuth: true
  },
  SEARCH: {
    path: '/search',
    label: 'Búsqueda',
    icon: '🔍',
    description: 'Encontrar destinos',
    requiresAuth: true
  },
  PLANNER: {
    path: '/planner',
    label: 'Planificador',
    icon: '📋',
    description: 'Planifica tu viaje',
    requiresAuth: true
  },
  COMPARISON: {
    path: '/comparison',
    label: 'Comparar',
    icon: '📊',
    description: 'Compara planes',
    requiresAuth: true
  },
  LOGIN: {
    path: '/login',
    label: 'Iniciar Sesión',
    icon: '🔑',
    description: 'Acceder a tu cuenta',
    requiresAuth: false
  },
  REGISTER: {
    path: '/register',
    label: 'Registrarse',
    icon: '📝',
    description: 'Crear nueva cuenta',
    requiresAuth: false
  }
};

// Rutas públicas (no requieren autenticación)
export const PUBLIC_ROUTES = Object.values(ROUTES).filter(route => !route.requiresAuth);

// Rutas privadas (requieren autenticación)
export const PRIVATE_ROUTES = Object.values(ROUTES).filter(route => route.requiresAuth);