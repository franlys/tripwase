// src/utils/multiplePlanGenerator.ts

// ✅ IMPORTAR SimplePlan desde types/trip.ts en lugar de redefinirla
import { SimplePlan, AccommodationDetails, FlightDetails } from '../types/trip';

// ✅ RE-EXPORTAR COMO TIPO para compatibilidad con isolatedModules
export type { SimplePlan } from '../types/trip';

// Interfaz corregida para coincidir con TripGenerator
export interface PlanInput {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency: string;
  interests: string[];
  origin: {
    country: string;
    city: string;
    flag?: string;
  };
}

// ✅ ALIAS para compatibilidad
export type TripPlanOption = SimplePlan;

export const generateThreePlans = (input: PlanInput): SimplePlan[] => {
  const duration = calculateDays(input.startDate, input.endDate);
  
  const plans: SimplePlan[] = [
    createEconomicPlan(input, duration),
    createMediumPlan(input, duration),
    createLuxuryPlan(input, duration)
  ];

  // Calcular savings basado en el plan intermedio como referencia
  const mediumPlan = plans.find(p => p.tier === 'intermedio');
  const mediumCost = mediumPlan ? mediumPlan.totalCost : input.budget;
  
  plans.forEach(plan => {
    if (plan.tier !== 'intermedio') {
      plan.savings = Math.max(0, mediumCost - plan.totalCost);
    }
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

  // ✅ CREAR OBJETOS COMPLETOS según interface de types/trip.ts
  const accommodationDetails: AccommodationDetails = {
    name: `Hostal Central ${input.destination}`,
    stars: 2,
    price: accommodationPerNight,
    perNight: true,
    features: ['WiFi gratuito', 'Desayuno incluido', 'Ubicación céntrica'],
    type: 'Hostal',
    // ✅ PROPIEDADES AGREGADAS:
    location: `Centro de ${input.destination}`,
    pricePerNight: accommodationPerNight
  };

  const flightDetails: FlightDetails = {
    departureAirport: `Aeropuerto ${input.origin.city}`,
    arrivalAirport: `Aeropuerto ${input.destination}`,
    price: transportation,
    duration: '2h 30min',
    stops: 0,
    airline: 'Aerolínea Económica'
  };

  return {
    id: `economic_${Date.now()}`,
    tier: 'economico',
    name: 'Plan Aventurero',
    description: 'Perfecto para viajeros que buscan aventura sin gastar de más. Alojamiento cómodo y experiencias auténticas.',
    totalCost: total,
    savings: 0, // Se calculará después
    accommodation: accommodationDetails,
    flights: flightDetails,
    
    // ✅ PROPIEDADES FALTANTES AGREGADAS:
    activities: [
      'Tour a pie gratuito por el centro',
      'Visita a mercados locales',
      'Caminata por parques naturales',
      'Museos con entrada libre'
    ],
    meals: [
      'Desayuno incluido en hostal',
      'Comida callejera local',
      'Cenas en restaurantes económicos'
    ],
    highlights: [
      'Hostales y guesthouses bien ubicados',
      'Transporte público y económico',
      'Comida local auténtica',
      'Actividades gratuitas y low-cost',
      'Máxima flexibilidad'
    ],
    included: [
      'Alojamiento 2 noches',
      'Vuelo ida y vuelta',
      'Desayuno diario',
      'Seguro básico de viaje',
      'Mapa y guía de la ciudad'
    ],
    notIncluded: [
      'Traslados aeropuerto',
      'Comidas principales',
      'Actividades premium',
      'Propinas',
      'Gastos personales'
    ],
    recommended: false,
    // ✅ NUEVAS PROPIEDADES REQUERIDAS:
    duration,
    currency: input.currency,
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
  const accommodationPerNight = 80;
  const foodPerDay = 60;
  const activitiesTotal = 400;
  const transportation = 600;

  const accommodation = accommodationPerNight * duration;
  const food = foodPerDay * duration * input.travelers;
  const activities = activitiesTotal * input.travelers;
  const total = accommodation + transportation + food + activities;

  // ✅ CREAR OBJETOS COMPLETOS según interface de types/trip.ts
  const accommodationDetails: AccommodationDetails = {
    name: `Hotel Comfort ${input.destination}`,
    stars: 3,
    price: accommodationPerNight,
    perNight: true,
    features: ['WiFi gratuito', 'Desayuno incluido', 'Gimnasio', 'Piscina', 'Spa'],
    type: 'Hotel Estándar',
    // ✅ PROPIEDADES AGREGADAS:
    location: `Zona turística de ${input.destination}`,
    pricePerNight: accommodationPerNight
  };

  const flightDetails: FlightDetails = {
    departureAirport: `Aeropuerto ${input.origin.city}`,
    arrivalAirport: `Aeropuerto ${input.destination}`,
    price: transportation,
    duration: '2h 15min',
    stops: 0,
    airline: 'Aerolínea Nacional'
  };

  return {
    id: `medium_${Date.now()}`,
    tier: 'intermedio',
    name: 'Plan Balanceado',
    description: 'La opción más popular. Equilibrio perfecto entre comodidad y precio. Hoteles de calidad y actividades destacadas.',
    totalCost: total,
    savings: 0, // Se calculará después
    accommodation: accommodationDetails,
    flights: flightDetails,
    
    // ✅ PROPIEDADES FALTANTES AGREGADAS:
    activities: [
      'City tour en autobús panorámico',
      'Entrada a 3 atracciones principales',
      'Tour gastronómico local',
      'Espectáculo cultural nocturno'
    ],
    meals: [
      'Desayuno buffet incluido',
      'Almuerzo en restaurantes recomendados',
      'Cena con vista panorámica'
    ],
    highlights: [
      'Hoteles 3-4 estrellas céntricos',
      'Vuelos directos clase económica',
      'Restaurantes locales y turísticos',
      'Tours principales incluidos',
      'Seguro de viaje completo'
    ],
    included: [
      'Alojamiento hotel 3 estrellas',
      'Vuelo ida y vuelta',
      'Desayuno diario',
      'Traslados aeropuerto',
      'City tour',
      'Seguro de viaje completo'
    ],
    notIncluded: [
      'Comidas no especificadas',
      'Actividades opcionales',
      'Bebidas alcohólicas',
      'Propinas',
      'Compras personales'
    ],
    recommended: true, // ✅ Plan más popular
    // ✅ NUEVAS PROPIEDADES REQUERIDAS:
    duration,
    currency: input.currency,
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

  // ✅ CREAR OBJETOS COMPLETOS según interface de types/trip.ts
  const accommodationDetails: AccommodationDetails = {
    name: `Resort Premium ${input.destination}`,
    stars: 5,
    price: accommodationPerNight,
    perNight: true,
    features: ['WiFi premium', 'Todas las comidas incluidas', 'Spa completo', 'Playa privada', 'Concierge 24/7'],
    type: 'Resort de Lujo',
    resortFeatures: {
      allInclusive: true,
      beachAccess: true,
      pools: 3,
      restaurants: 5,
      bars: 4,
      spa: true,
      golf: true
    },
    // ✅ PROPIEDADES AGREGADAS:
    location: `Zona exclusiva de ${input.destination}`,
    pricePerNight: accommodationPerNight
  };

  const flightDetails: FlightDetails = {
    departureAirport: `Aeropuerto ${input.origin.city}`,
    arrivalAirport: `Aeropuerto ${input.destination}`,
    price: transportation,
    duration: '2h 00min',
    stops: 0,
    airline: 'Aerolínea Premium'
  };

  return {
    id: `luxury_${Date.now()}`,
    tier: 'premium',
    name: 'Plan Premium',
    description: 'La experiencia más refinada. Hoteles de lujo, gastronomía excepcional y servicios premium.',
    totalCost: total,
    savings: 0, // Se calculará después
    accommodation: accommodationDetails,
    flights: flightDetails,
    
    // ✅ PROPIEDADES FALTANTES AGREGADAS:
    activities: [
      'Tour privado con guía exclusivo',
      'Acceso VIP a todas las atracciones',
      'Experiencia gastronómica gourmet',
      'Spa y tratamientos de lujo',
      'Actividades acuáticas premium'
    ],
    meals: [
      'Desayuno gourmet en suite',
      'Almuerzo en restaurantes Michelin',
      'Cena degustación con sommelier'
    ],
    highlights: [
      'Hoteles 5 estrellas exclusivos',
      'Vuelos clase business',
      'Restaurantes gourmet',
      'Tours privados con guía',
      'Concierge 24/7'
    ],
    included: [
      'Suite de lujo resort 5 estrellas',
      'Vuelo clase business',
      'Todas las comidas gourmet',
      'Traslados privados',
      'Tours privados',
      'Spa y tratamientos',
      'Seguro premium',
      'Concierge personal'
    ],
    notIncluded: [
      'Compras de lujo',
      'Excursiones especiales no programadas',
      'Servicios médicos especializados'
    ],
    recommended: false,
    // ✅ NUEVAS PROPIEDADES REQUERIDAS:
    duration,
    currency: input.currency,
    breakdown: {
      accommodation,
      transportation,
      food,
      activities,
      total
    }
  };
};