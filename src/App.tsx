// src/App.tsx
import React, { useState } from 'react';
import './App.css';
import { Globe, LogOut } from './components/SimpleIcons';      
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { TripProvider } from './contexts/TripContext';
import TripGenerator from './components/trip/TripGenerator';   
import PlanComparison from './components/trip/PlanComparison'; 
import ExplorePage from './components/ui/ExplorePage';
import PlanDetailsModal from './components/modals/PlanDetailsModal';
import { SimplePlan } from './utils/multiplePlanGenerator';    

type ViewType = 'explore' | 'trip' | 'comparison';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('explore');
  const [generatedPlans, setGeneratedPlans] = useState<SimplePlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SimplePlan | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { user, logout } = useAuth();

  const handleShowPlans = (plans: SimplePlan[]) => {
    setGeneratedPlans(plans);
    setCurrentView('comparison');
  };

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

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="navbar-brand" onClick={() => setCurrentView('explore')}>        
          <Globe className="w-8 h-8" />
          <h1 className="navbar-title">TripWase</h1>
        </div>

        {user && (
          <div className="navbar-user">
            <span className="user-greeting">Hola, {user.name}!</span>
            <button onClick={logout} className="logout-button">
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        )}
      </header>

      {currentView !== 'explore' && (
        <nav className="breadcrumb-nav">
          <div className="breadcrumb-container">
            <button 
              onClick={() => setCurrentView('explore')} 
              className="breadcrumb-link"
            >
              Explorar
            </button>
            {(currentView === 'trip' || currentView === 'comparison') && (
              <>
                <span className="breadcrumb-separator">›</span>    
                <button 
                  onClick={() => setCurrentView('trip')} 
                  className={`breadcrumb-link ${currentView === 'trip' ? 'breadcrumb-current' : ''}`}
                >
                  Planificar Viaje
                </button>
              </>
            )}
            {currentView === 'comparison' && (
              <>
                <span className="breadcrumb-separator">›</span>    
                <span className="breadcrumb-current">Comparar Planes</span>
              </>
            )}
          </div>
        </nav>
      )}

      <main className="main-content">
        {currentView === 'explore' && (
          <ExplorePage onNavigateToPlanner={() => setCurrentView('trip')} />
        )}

        {currentView === 'trip' && (
          <TripGenerator
            onBackToExplore={() => setCurrentView('explore')}  
            onShowPlans={handleShowPlans}
          />
        )}

        {currentView === 'comparison' && (
          <PlanComparison
            plans={generatedPlans}
            onSelectPlan={handleSelectPlan}
            onBack={() => setCurrentView('trip')}
          />
        )}
      </main>

      {selectedPlan && (
        <PlanDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          trip={convertPlanToTrip(selectedPlan)}
          onSaveTrip={() => { setShowDetailsModal(false); alert('¡Viaje guardado!'); }}
          onBookTrip={() => { setShowDetailsModal(false); alert('¡Viaje reservado!'); }}
        />
      )}
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