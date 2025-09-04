// src/utils/multiplePlanGenerator.ts

export interface SimplePlan {
  id: string;
  name: string;
  tier: 'economic' | 'medium' | 'luxury';
  description: string;
  totalCost: number;
  currency: string;
  duration: number;
  savings: number;
  highlights: string[];
  accommodation: {
    name: string;
    type: string;
    pricePerNight: number;
    stars: number;
    location: string;
  };
  breakdown: {
    accommodation: number;
    transportation: number;
    food: number;
    activities: number;
    total: number;
  };
}

export type TripPlanOption = SimplePlan;

export interface PlanInput {
  destination: string;
  origin: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency: string;
  interests: string[];
}

export const generateThreePlans = (input: PlanInput): SimplePlan[] => {
  const duration = calculateDays(input.startDate, input.endDate);
  
  const plans: SimplePlan[] = [
    createEconomicPlan(input, duration),
    createMediumPlan(input, duration),
    createLuxuryPlan(input, duration)
  ];

  // Calcular savings basado en el plan medium como referencia
  const mediumPlan = plans.find(p => p.tier === 'medium');
  const mediumCost = mediumPlan ? mediumPlan.totalCost : input.budget;
  
  plans.forEach(plan => {
    plan.savings = mediumCost - plan.totalCost;
  });

  return plans;
};

const calculateDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

const createEconomicPlan = (input: PlanInput, duration: number): SimplePlan => {
  const accommodationPerNight = 35;
  const foodPerDay = 25;
  const activitiesTotal = 150;
  const transportation = 300;

  const accommodation = accommodationPerNight * duration;
  const food = foodPerDay * duration * input.travelers;
  const activities = activitiesTotal * input.travelers;
  const total = accommodation + transportation + food + activities;

  return {
    id: `economic_${Date.now()}`,
    name: 'Plan Aventurero',
    tier: 'economic',
    description: 'Perfecto para viajeros que buscan aventura sin gastar de m�s. Alojamiento c�modo y experiencias aut�nticas.',
    totalCost: total,
    currency: input.currency,
    duration,
    savings: 0,
    highlights: [
      'Hostales y guesthouses bien ubicados',
      'Transporte p�blico y econ�mico',
      'Comida local aut�ntica',
      'Actividades gratuitas y low-cost',
      'M�xima flexibilidad'
    ],
    accommodation: {
      name: `Hostal Central ${input.destination}`,
      type: 'Hostal',
      pricePerNight: accommodationPerNight,
      stars: 2,
      location: 'Centro hist�rico'
    },
    breakdown: {
      accommodation,
      transportation,
      food,
      activities,
      total
    }
  };
};

const createMediumPlan = (input: PlanInput, duration: number): SimplePlan => {
  const accommodationPerNight = 85;
  const foodPerDay = 45;
  const activitiesTotal = 300;
  const transportation = 500;

  const accommodation = accommodationPerNight * duration;
  const food = foodPerDay * duration * input.travelers;
  const activities = activitiesTotal * input.travelers;
  const total = accommodation + transportation + food + activities;

  return {
    id: `medium_${Date.now()}`,
    name: 'Plan Equilibrado',
    tier: 'medium',
    description: 'El equilibrio ideal entre comodidad y precio. Hoteles de calidad y actividades destacadas.',
    totalCost: total,
    currency: input.currency,
    duration,
    savings: 0,
    highlights: [
      'Hoteles 3-4 estrellas c�ntricos',
      'Vuelos directos clase econ�mica',
      'Restaurantes locales y tur�sticos',
      'Tours principales incluidos',
      'Seguro de viaje completo'
    ],
    accommodation: {
      name: `Hotel Comfort ${input.destination}`,
      type: 'Hotel',
      pricePerNight: accommodationPerNight,
      stars: 3,
      location: 'Zona tur�stica'
    },
    breakdown: {
      accommodation,
      transportation,
      food,
      activities,
      total
    }
  };
};

const createLuxuryPlan = (input: PlanInput, duration: number): SimplePlan => {
  const accommodationPerNight = 220;
  const foodPerDay = 120;
  const activitiesTotal = 800;
  const transportation = 1200;

  const accommodation = accommodationPerNight * duration;
  const food = foodPerDay * duration * input.travelers;
  const activities = activitiesTotal * input.travelers;
  const total = accommodation + transportation + food + activities;

  return {
    id: `luxury_${Date.now()}`,
    name: 'Plan Premium',
    tier: 'luxury',
    description: 'La experiencia m�s refinada. Hoteles de lujo, gastronom�a excepcional y servicios premium.',
    totalCost: total,
    currency: input.currency,
    duration,
    savings: 0,
    highlights: [
      'Hoteles 5 estrellas exclusivos',
      'Vuelos clase business',
      'Restaurantes gourmet',
      'Tours privados con gu�a',
      'Concierge 24/7'
    ],
    accommodation: {
      name: `Resort Premium ${input.destination}`,
      type: 'Resort de Lujo',
      pricePerNight: accommodationPerNight,
      stars: 5,
      location: 'Ubicaci�n exclusiva'
    },
    breakdown: {
      accommodation,
      transportation,
      food,
      activities,
      total
    }
  };
};
