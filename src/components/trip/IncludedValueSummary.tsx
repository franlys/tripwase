// src/components/trip/IncludedValueSummary.tsx
import React from 'react';
import { Check, Gift, Star } from 'lucide-react';
import { DayPlan } from '../../types/trip';

interface IncludedValueSummaryProps {
  dayPlans: DayPlan[];
}

export const IncludedValueSummary: React.FC<IncludedValueSummaryProps> = ({ dayPlans }) => {
  // Calcular actividades incluidas (costo = 0)
  const includedActivities = dayPlans.reduce((count, day) => 
    count + day.activities.filter(act => act.cost === 0).length, 0
  );
  
  // Calcular valor estimado de las actividades incluidas
  const estimatedValue = dayPlans.reduce((total, day) => 
    total + day.activities
      .filter(activity => activity.cost === 0)
      .reduce((daySum, activity) => {
        // Usar estimatedValue si está disponible, sino un valor por defecto según categoría
        const activityValue = (activity as any).estimatedValue || getDefaultActivityValue(activity.category);
        return daySum + activityValue;
      }, 0), 
    0
  );
  
  // Si no hay actividades incluidas, no mostrar el componente
  if (includedActivities === 0) return null;
  
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Gift className="w-7 h-7 text-green-600" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-bold text-green-800 text-lg">
              Itinerario Base Incluido
            </h4>
            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
              <Star className="w-3 h-3" />
              <span>Premium</span>
            </div>
          </div>
          
          <p className="text-green-700 mb-3">
            Tu plan incluye un itinerario base completo con actividades y servicios sin costo adicional
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-1">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Actividades Incluidas</span>
              </div>
              <span className="text-2xl font-bold text-green-800">{includedActivities}</span>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-600 text-lg">💰</span>
                <span className="text-sm font-medium text-gray-600">Valor Estimado</span>
              </div>
              <span className="text-2xl font-bold text-green-800">${estimatedValue}</span>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-600 text-lg">🎯</span>
                <span className="text-sm font-medium text-gray-600">Días Planificados</span>
              </div>
              <span className="text-2xl font-bold text-green-800">{dayPlans.length}</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>💡 Tip:</strong> Puedes personalizar los horarios de las actividades flexibles 
              y agregar excursiones opcionales desde el panel lateral.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Función auxiliar para obtener valor por defecto según categoría
const getDefaultActivityValue = (category: string): number => {
  const defaultValues: Record<string, number> = {
    'dining': 45,
    'beach': 30,
    'arrival': 25,
    'departure': 20,
    'exploration': 0,
    'free': 0,
    'cultural': 35,
    'adventure': 50,
    'spa': 80,
    'entertainment': 40
  };
  
  return defaultValues[category] || 25;
};