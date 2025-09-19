// =================================================================

// src/pages/PlannerPage.tsx - Página del planificador
import React, { useState } from 'react';
import TripGeneratorEnhanced from '../components/trip/TripWaseGenerator';
import { useNavigate } from 'react-router-dom';
import { SimplePlan } from '../utils/multiplePlanGenerator';

const PlannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [generatedPlans, setGeneratedPlans] = useState<SimplePlan[]>([]);

  const handleShowPlans = (plans: SimplePlan[]) => {
    console.log('Planes recibidos en PlannerPage:', plans);
    setGeneratedPlans(plans);
    // No redirigir automáticamente - dejar que TripWaseGenerator maneje su flujo
  };

  const handleBackToExplore = () => {
    navigate('/');
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
        <TripGeneratorEnhanced
          onBackToExplore={handleBackToExplore}
          onShowPlans={handleShowPlans}
        />
      </div>
    </div>
  );
};

export default PlannerPage;

