// src/pages/HomePage.tsx - Página principal
import React from 'react';
import HomePage from '../components/homepage/HomePage';
import { useNavigate } from 'react-router-dom';

const HomePageRoute: React.FC = () => {
  const navigate = useNavigate();

  return (
    <HomePage onNavigateToPlanner={() => navigate('/planner')} />
  );
};

export default HomePageRoute;

