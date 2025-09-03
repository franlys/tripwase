// src/App.tsx
import React, { useState } from 'react';
import { Globe, LogOut } from './components/SimpleIcons';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { TripGenerator, ExplorePage } from './components';
import { DashboardView } from './types';

const Dashboard: React.FC<{
  onNavigateToPlanner: () => void;
  onNavigateToExplore: () => void;
  currentView: DashboardView;
}> = ({ onNavigateToPlanner, onNavigateToExplore, currentView }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-xl">
                <Globe className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TripWase
                </h1>
                <p className="text-gray-600 text-sm">Hola, {user?.name}!</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>

      {currentView === 'explore' ? (
        <ExplorePage onNavigateToPlanner={onNavigateToPlanner} />
      ) : (
        <TripGenerator onBackToExplore={onNavigateToExplore} />
      )}
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [dashboardView, setDashboardView] = useState<DashboardView>('explore');

  const handleNavigateToPlanner = () => {
    setDashboardView('planner');
  };

  const handleNavigateToExplore = () => {
    setDashboardView('explore');
  };

  if (isAuthenticated) {
    return (
      <Dashboard 
        onNavigateToPlanner={handleNavigateToPlanner}
        onNavigateToExplore={handleNavigateToExplore}
        currentView={dashboardView}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-lg mx-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            TripWase
          </h1>
          <p className="text-gray-600 mb-8">Generador inteligente refactorizado en TypeScript</p>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>Sistema refactorizado funcionando</p>
            <p>Usa el AuthContext existente para iniciar sesión</p>
            <p>Navega a /dashboard o /search para ver la funcionalidad</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </AuthProvider>
  );
};

export default App;

