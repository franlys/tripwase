// src/App.tsx
import React, { useState } from 'react';
import { Globe, LogOut } from './components/SimpleIcons';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { TripProvider } from './contexts/TripContext';
import TripGenerator from './components/trip/TripGenerator';
import ExplorePage from './components/ui/ExplorePage';

type ViewType = 'explore' | 'trip' | 'dashboard';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('explore');
  const { user, logout } = useAuth();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#1e293b', padding: '16px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Globe className="w-8 h-8" />
          <h1 style={{ color: 'white', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            TripWase
          </h1>
        </div>
        
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: 'white' }}>Hola, {user.name}!</span>
            <button
              onClick={logout}
              style={{
                padding: '8px 16px', backgroundColor: '#374151',
                color: 'white', border: 'none', borderRadius: '6px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        )}
      </header>

      {/* Navigation */}
      <nav style={{
        backgroundColor: 'white', padding: '16px 24px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          <button
            onClick={() => setCurrentView('explore')}
            style={{
              padding: '8px 16px', background: 'none',
              border: currentView === 'explore' ? '2px solid #3b82f6' : 'none',
              color: currentView === 'explore' ? '#3b82f6' : '#6b7280',
              borderRadius: '6px', cursor: 'pointer'
            }}
          >
            Explorar
          </button>
          <button
            onClick={() => setCurrentView('trip')}
            style={{
              padding: '8px 16px', background: 'none',
              border: currentView === 'trip' ? '2px solid #3b82f6' : 'none',
              color: currentView === 'trip' ? '#3b82f6' : '#6b7280',
              borderRadius: '6px', cursor: 'pointer'
            }}
          >
            Planificar Viaje
          </button>
        </div>
      </nav>

      {/* Content */}
      <main>
        {currentView === 'explore' && (
          <ExplorePage onNavigateToPlanner={() => setCurrentView('trip')} />
        )}
        {currentView === 'trip' && (
          <TripGenerator onBackToExplore={() => setCurrentView('explore')} />
        )}
      </main>
    </div>
  );
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
