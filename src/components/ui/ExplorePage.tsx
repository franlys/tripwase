// src/components/ui/ExplorePage.tsx
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../../hooks';
import HomePage from '../homepage/HomePage';
interface ExplorePageProps {
  onNavigateToPlanner: () => void;
}

const ExplorePage: React.FC<ExplorePageProps> = ({ onNavigateToPlanner }) => {
  const [heroRef, heroVisible] = useScrollAnimation();

  return (
    <div className="min-h-screen">
      <section 
        ref={heroRef}
        className={`hero-section relative min-h-screen flex items-center justify-center text-center transition-all duration-1000 ${
          heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60"></div>
        <div className="relative z-10 text-white max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Explora el Mundo
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Descubre destinos increíbles, experiencias únicas y aventuras inolvidables
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onNavigateToPlanner}
              className="btn-primary text-white px-8 py-4 rounded-full font-bold text-lg  transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Crear Mi Viaje Perfecto
            </button>
            <button className="btn-secondary px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
              Explorar Primero
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowRight className="w-6 h-6 text-white/70 rotate-90" />
       </div>
      </section>
      
      <HomePage onNavigateToPlanner={onNavigateToPlanner} />
    </div>
  );
};

export default ExplorePage;

