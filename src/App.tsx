// src/App.tsx
import React, { useState } from 'react';
import { Globe, LogOut } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { TripProvider } from './contexts/TripContext';
import TripGenerator from './components/trip/TripGenerator';
import PlanComparison from './components/trip/PlanComparison';
import HomePage from './components/homepage/HomePage';
import PlanDetailsModal from './components/modals/PlanDetailsModal';
import { SimplePlan } from './utils/multiplePlanGenerator';
import './styles/design-system.css';

type ViewType = 'home' | 'trip' | 'comparison';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
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
      {/* HEADER PROFESIONAL */}
      <header className="header">
        <div className="container">
          <div className="header-content flex-between">
            {/* LOGO CON GRADIENTE CORPORATIVO */}
            <div 
              className="logo-container"
              onClick={() => setCurrentView('home')}
              style={{ cursor: 'pointer' }}
            >
              <h1 className="logo">TripWase</h1>
            </div>

            {/* NAVEGACIÓN PRINCIPAL */}
            <nav className="nav-main">
              <ul className="nav-list">
                <li>
                  <button
                    onClick={() => setCurrentView('home')}
                    className={`nav-link ${currentView === 'home' ? 'nav-link-active' : ''}`}
                  >
                    <Globe className="w-4 h-4" />
                    Inicio
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView('trip')}
                    className={`nav-link ${currentView === 'trip' ? 'nav-link-active' : ''}`}
                  >
                    ✈️ Planificar
                  </button>
                </li>
                {generatedPlans.length > 0 && (
                  <li>
                    <button
                      onClick={() => setCurrentView('comparison')}
                      className={`nav-link ${currentView === 'comparison' ? 'nav-link-active' : ''}`}
                    >
                      📊 Comparar
                    </button>
                  </li>
                )}
              </ul>
            </nav>

            {/* USUARIO Y SESIÓN */}
            {user && (
              <div className="user-section">
                <span className="user-greeting">¡Hola, {user.name}!</span>
                <button onClick={logout} className="btn btn-secondary">
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* BREADCRUMBS CUANDO NO ESTAMOS EN HOME */}
      {currentView !== 'home' && (
        <nav className="breadcrumbs">
          <div className="container">
            <ol className="breadcrumb-list">
              <li>
                <button
                  onClick={() => setCurrentView('home')}
                  className="breadcrumb-link"
                >
                  Inicio
                </button>
              </li>
              {currentView === 'trip' && (
                <>
                  <li className="breadcrumb-separator">›</li>
                  <li className="breadcrumb-current">Planificar Viaje</li>
                </>
              )}
              {currentView === 'comparison' && (
                <>
                  <li className="breadcrumb-separator">›</li>
                  <li>
                    <button
                      onClick={() => setCurrentView('trip')}
                      className="breadcrumb-link"
                    >
                      Planificar Viaje
                    </button>
                  </li>
                  <li className="breadcrumb-separator">›</li>
                  <li className="breadcrumb-current">Comparar Planes</li>
                </>
              )}
            </ol>
          </div>
        </nav>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        {currentView === 'home' && (
          <HomePage onNavigateToPlanner={() => setCurrentView('trip')} />
        )}

        {currentView === 'trip' && (
          <div className="section">
            <div className="container">
              <div className="section-header">
                <h2 className="heading-2">Planifica tu viaje perfecto</h2>
                <p className="text-large">
                  Completa la información y recibe recomendaciones personalizadas
                </p>
              </div>
              <TripGenerator
                onBackToExplore={() => setCurrentView('home')}
                onShowPlans={handleShowPlans}
              />
            </div>
          </div>
        )}

        {currentView === 'comparison' && (
          <div className="section">
            <div className="container">
              <div className="section-header">
                <h2 className="heading-2">Compara tus opciones</h2>
                <p className="text-large">
                  Elige el plan que mejor se adapte a tus necesidades
                </p>
              </div>
              <PlanComparison
                plans={generatedPlans}
                onSelectPlan={handleSelectPlan}
                onBack={() => setCurrentView('trip')}
              />
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>TripWase</h4>
              <p className="text-base">
                Tu compañero de viajes para explorar el mundo de manera inteligente.
              </p>
            </div>
            <div className="footer-section">
              <h4>Enlaces</h4>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">Sobre nosotros</a></li>
                <li><a href="#" className="footer-link">Contacto</a></li>
                <li><a href="#" className="footer-link">Términos</a></li>
                <li><a href="#" className="footer-link">Privacidad</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 TripWase. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* MODAL DE DETALLES */}
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