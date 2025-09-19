// src/pages/ComparisonPage.tsx - Página de comparación
import React, { useState } from 'react';
import PlanComparison from '../components/trip/PlanComparison';
import PlanDetailsModal from '../components/modals/PlanDetailsModal';
import { useNavigate, useLocation } from 'react-router-dom';
import { SimplePlan } from '../utils/multiplePlanGenerator';

const ComparisonPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<SimplePlan | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Obtener planes del estado de la navegación o desde localStorage
  const plans: SimplePlan[] = location.state?.plans || [];

  const handleSelectPlan = (plan: SimplePlan) => {
    setSelectedPlan(plan);
    setShowDetailsModal(true);
  };

  const handleBack = () => {
    navigate('/planner');
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

  // Si no hay planes, redirigir al planificador
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
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
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
          onBack={handleBack}
        />

        {/* Modal de detalles */}
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

export default ComparisonPage;