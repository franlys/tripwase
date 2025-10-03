// src/pages/PlannerPage.tsx - VERSIÓN CORREGIDA
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
  };

  const handleBackToExplore = () => {
    navigate('/');
  };

  return (
    <TripGeneratorEnhanced
      onBackToExplore={handleBackToExplore}
      onShowPlans={handleShowPlans}
    />
  );
};

export default PlannerPage;