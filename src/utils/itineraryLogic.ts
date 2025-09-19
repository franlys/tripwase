// src/utils/itineraryLogic.ts
// Funciones de lógica para generación inteligente de itinerarios

import { Activity } from '../types/trip';

// Interfaces para el sistema de precarga
export interface DefaultActivity {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  cost: number;
  category: string;
  isIncluded: boolean;
  isEditable: boolean;
  icon: string;
  location?: string;
  scheduleType: 'fixed' | 'flexible' | 'all-day';
  isTimeFixed: boolean;
  isTimeEditable: boolean;
  estimatedValue?: number;
}

export interface DefaultDayPlan {
  dayNumber: number;
  date: string;
  activities: DefaultActivity[];
  totalIncludedValue: number;
}

export interface AccommodationType {
  type: 'Resort de Lujo' | 'Hotel Premium' | 'Hotel Estándar' | 'Hostal' | 'Casa de Huéspedes' | 'Apartamento';
}

// Función principal para generar itinerario por defecto
export const generateDefaultItineraryActivities = (
  selectedPlan: { id: number; accommodation: { type: string } }, // Interfaz simplificada
  destination: string,
  duration: number,
  startDate: Date
): DefaultDayPlan[] => {
  const accommodationType = selectedPlan?.accommodation?.type || 'Hotel Estándar';
  const planTier = selectedPlan?.id || 2;
  
  console.log(`🎯 Generando itinerario por defecto:`, {
    destination,
    accommodationType,
    planTier,
    duration
  });

  const defaultItinerary: DefaultDayPlan[] = [];
  
  for (let day = 0; day < duration; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);
    
    const dayPlan: DefaultDayPlan = {
      dayNumber: day + 1,
      date: currentDate.toLocaleDateString('es-DO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      }),
      activities: generateDayActivities(
        accommodationType,
        planTier,
        destination,
        day + 1,
        duration
      ),
      totalIncludedValue: 0
    };
    
    // Calcular valor total incluido
    dayPlan.totalIncludedValue = dayPlan.activities
      .filter(act => act.isIncluded)
      .reduce((sum, act) => sum + (act.estimatedValue || 25), 0);
    
    defaultItinerary.push(dayPlan);
  }
  
  return defaultItinerary;
};

// Generar actividades por día según tipo de alojamiento
const generateDayActivities = (
  accommodationType: string,
  planTier: number,
  destination: string,
  dayNumber: number,
  totalDays: number
): DefaultActivity[] => {
  const activities: DefaultActivity[] = [];
  const isFirstDay = dayNumber === 1;
  const isLastDay = dayNumber === totalDays;
  
  // RESORT DE LUJO (Plan Premium - Punta Cana ejemplo)
  if (accommodationType === 'Resort de Lujo' && destination.toLowerCase().includes('punta cana')) {
    
    if (isFirstDay) {
      activities.push({
        id: `arrival-${dayNumber}`,
        title: 'Llegada y Check-in VIP',
        description: 'Recepción con bebida de bienvenida y orientación del resort',
        startTime: '15:00',
        endTime: '16:30',
        duration: 90,
        cost: 0,
        category: 'arrival',
        isIncluded: true,
        isEditable: false,
        isTimeFixed: true,
        isTimeEditable: false,
        scheduleType: 'fixed',
        icon: '🏨',
        location: 'Lobby del Resort',
        estimatedValue: 50
      });
      
      activities.push({
        id: `welcome-dinner-${dayNumber}`,
        title: 'Cena de Bienvenida - Restaurante Principal',
        description: 'Buffet internacional con especialidades dominicanas',
        startTime: '19:30',
        endTime: '21:00',
        duration: 90,
        cost: 0,
        category: 'dining',
        isIncluded: true,
        isEditable: true,
        isTimeFixed: false,
        isTimeEditable: true,
        scheduleType: 'flexible',
        icon: '🍽️',
        location: 'Restaurante Principal',
        estimatedValue: 75
      });
      
    } else if (isLastDay) {
      activities.push({
        id: `beach-morning-${dayNumber}`,
        title: 'Última Mañana en la Playa',
        description: 'Relax final en la playa privada del resort',
        startTime: '09:00',
        endTime: '11:30',
        duration: 150,
        cost: 0,
        category: 'beach',
        isIncluded: true,
        isEditable: true,
        isTimeFixed: false,
        isTimeEditable: true,
        scheduleType: 'flexible',
        icon: '🏖️',
        location: 'Playa Privada',
        estimatedValue: 40
      });
      
      activities.push({
        id: `checkout-${dayNumber}`,
        title: 'Check-out y Traslado',
        description: 'Check-out tardío incluido hasta las 14:00',
        startTime: '12:00',
        endTime: '14:00',
        duration: 120,
        cost: 0,
        category: 'departure',
        isIncluded: true,
        isEditable: false,
        isTimeFixed: true,
        isTimeEditable: false,
        scheduleType: 'fixed',
        icon: '✈️',
        location: 'Lobby del Resort',
        estimatedValue: 30
      });
      
    } else {
      // Días intermedios
      activities.push({
        id: `beach-pool-${dayNumber}`,
        title: 'Día de Playa y Piscina',
        description: 'Relax en playa privada con servicio de toallas y bebidas incluidas',
        startTime: '10:00',
        endTime: '16:00',
        duration: 360,
        cost: 0,
        category: 'beach',
        isIncluded: true,
        isEditable: true,
        isTimeFixed: false,
        isTimeEditable: true,
        scheduleType: 'all-day',
        icon: '🏖️',
        location: 'Playa Privada / Piscinas',
        estimatedValue: 100
      });
      
      activities.push({
        id: `lunch-snack-${dayNumber}`,
        title: 'Almuerzo en Bar de Playa',
        description: 'Especialidades caribeñas y bebidas tropicales',
        startTime: '13:00',
        endTime: '14:30',
        duration: 90,
        cost: 0,
        category: 'dining',
        isIncluded: true,
        isEditable: true,
        isTimeFixed: false,
        isTimeEditable: true,
        scheduleType: 'flexible',
        icon: '🍹',
        location: 'Bar de Playa',
        estimatedValue: 45
      });
      
      // Variar cenas entre restaurantes
      const dinnerOptions = [
        { name: 'Restaurante Italiano', desc: 'Auténtica cocina italiana con vista al mar' },
        { name: 'Restaurante Asiático', desc: 'Fusión asiática con ingredientes frescos locales' },
        { name: 'Steakhouse Premium', desc: 'Cortes premium y mariscos a la parrilla' },
        { name: 'Restaurante Caribeño', desc: 'Especialidades dominicanas y del Caribe' }
      ];
      
      const dinnerChoice = dinnerOptions[(dayNumber - 2) % dinnerOptions.length];
      
      activities.push({
        id: `dinner-${dayNumber}`,
        title: `Cena en ${dinnerChoice.name}`,
        description: dinnerChoice.desc,
        startTime: '19:30',
        endTime: '21:00',
        duration: 90,
        cost: 0,
        category: 'dining',
        isIncluded: true,
        isEditable: true,
        isTimeFixed: false,
        isTimeEditable: true,
        scheduleType: 'flexible',
        icon: '🍽️',
        location: dinnerChoice.name,
        estimatedValue: 85
      });
    }
  }
  
  // HOTEL PREMIUM (Plan Estándar)
  else if (accommodationType === 'Hotel Premium' || planTier === 2) {
    
    if (isFirstDay) {
      activities.push({
        id: `arrival-${dayNumber}`,
        title: 'Check-in y Orientación',
        description: 'Llegada al hotel y orientación del área',
        startTime: '15:00',
        endTime: '16:00',
        duration: 60,
        cost: 0,
        category: 'arrival',
        isIncluded: true,
        isEditable: false,
        isTimeFixed: true,
        isTimeEditable: false,
        scheduleType: 'fixed',
        icon: '🏨',
        estimatedValue: 20
      });
    }
    
    activities.push({
      id: `breakfast-${dayNumber}`,
      title: 'Desayuno Continental',
      description: 'Desayuno incluido en el hotel',
      startTime: '08:00',
      endTime: '09:30',
      duration: 90,
      cost: 0,
      category: 'dining',
      isIncluded: true,
      isEditable: true,
      isTimeFixed: false,
      isTimeEditable: true,
      scheduleType: 'flexible',
      icon: '☕',
      location: 'Restaurante del Hotel',
      estimatedValue: 25
    });
    
    if (!isLastDay) {
      activities.push({
        id: `local-exploration-${dayNumber}`,
        title: 'Exploración Local Libre',
        description: 'Tiempo libre para explorar el destino',
        startTime: '10:00',
        endTime: '18:00',
        duration: 480,
        cost: 0,
        category: 'exploration',
        isIncluded: true,
        isEditable: true,
        isTimeFixed: false,
        isTimeEditable: true,
        scheduleType: 'all-day',
        icon: '🚶',
        location: 'Ciudad/Zona Turística',
        estimatedValue: 0
      });
    }
  }
  
  // HOTEL ESTÁNDAR/HOSTAL (Plan Económico)
  else if (planTier === 1) {
    
    if (isFirstDay) {
      activities.push({
        id: `arrival-${dayNumber}`,
        title: 'Check-in',
        description: 'Llegada y registro en el alojamiento',
        startTime: '15:00',
        endTime: '15:30',
        duration: 30,
        cost: 0,
        category: 'arrival',
        isIncluded: true,
        isEditable: false,
        isTimeFixed: true,
        isTimeEditable: false,
        scheduleType: 'fixed',
        icon: '🏨',
        estimatedValue: 10
      });
    }
    
    activities.push({
      id: `free-day-${dayNumber}`,
      title: 'Día Libre para Explorar',
      description: 'Planifica tus propias actividades y descubre el destino',
      startTime: '09:00',
      endTime: '20:00',
      duration: 660,
      cost: 0,
      category: 'free',
      isIncluded: true,
      isEditable: true,
      isTimeFixed: false,
      isTimeEditable: true,
      scheduleType: 'all-day',
      icon: '🗺️',
      location: 'A definir por el viajero',
      estimatedValue: 0
    });
  }
  
  return activities;
};

// Generar actividades opcionales por destino
export const generateOptionalActivitiesByDestination = (
  destination: string,
  accommodationType: string,
  planTier: number
): Activity[] => {
  const optionalActivities: Activity[] = [];
  
  if (destination.toLowerCase().includes('punta cana')) {
    optionalActivities.push(
      {
        id: 'buggy-adventure',
        title: 'Excursión en Buggies por la Selva',
        description: 'Aventura de 4 horas explorando senderos selváticos, cenotes y plantaciones de cacao',
        category: 'adventure',
        cost: 95,
        duration: 240,
        location: 'Selva Tropical',
        image: '/images/buggy-adventure.jpg',
        rating: 4.8,
        startTime: '09:00',
        endTime: '13:00',
        scheduleType: 'fixed',
        isTimeFixed: true,
        isTimeEditable: false
      },
      {
        id: 'saona-catamaran',
        title: 'Paseo en Catamarán a Isla Saona',
        description: 'Día completo navegando hacia la paradisíaca Isla Saona con almuerzo incluido',
        category: 'boat-tour',
        cost: 85,
        duration: 480,
        location: 'Isla Saona',
        image: '/images/saona-island.jpg',
        rating: 4.9,
        startTime: '08:00',
        endTime: '16:00',
        scheduleType: 'fixed',
        isTimeFixed: true,
        isTimeEditable: false
      },
      {
        id: 'dolphin-swim',
        title: 'Nado con Delfines',
        description: 'Experiencia única nadando e interactuando con delfines en ambiente natural',
        category: 'marine',
        cost: 120,
        duration: 180,
        location: 'Parque Marino',
        image: '/images/dolphin-swim.jpg',
        rating: 4.7,
        startTime: '10:00',
        endTime: '13:00',
        scheduleType: 'fixed',
        isTimeFixed: true,
        isTimeEditable: false
      },
      {
        id: 'zip-line-adventure',
        title: 'Tirolinas y Canopy Extremo',
        description: 'Adrenalina pura en las tirolinas más largas del Caribe con vistas espectaculares',
        category: 'adventure',
        cost: 75,
        duration: 180,
        location: 'Parque Aventura',
        image: '/images/zip-line.jpg',
        rating: 4.6,
        startTime: '09:30',
        endTime: '12:30',
        scheduleType: 'fixed',
        isTimeFixed: true,
        isTimeEditable: false
      },
      {
        id: 'helicopter-tour',
        title: 'Tour en Helicóptero',
        description: 'Vista aérea espectacular de las costas de Punta Cana y sus resorts',
        category: 'aerial',
        cost: 180,
        duration: 45,
        location: 'Costa de Punta Cana',
        image: '/images/helicopter.jpg',
        rating: 4.9,
        startTime: '15:00',
        endTime: '15:45',
        scheduleType: 'fixed',
        isTimeFixed: true,
        isTimeEditable: false
      }
    );
  } else if (destination.toLowerCase().includes('santo domingo')) {
    optionalActivities.push(
      {
        id: 'colonial-walking-tour',
        title: 'Tour a Pie por la Ciudad Colonial',
        description: 'Descubre la primera ciudad europea de América con guía especializado',
        category: 'cultural',
        cost: 35,
        duration: 180,
        location: 'Zona Colonial',
        rating: 4.7,
        startTime: '09:00',
        endTime: '12:00',
        scheduleType: 'fixed',
        isTimeFixed: true,
        isTimeEditable: false
      },
      {
        id: 'merengue-bachata-class',
        title: 'Clase de Merengue y Bachata',
        description: 'Aprende los ritmos dominicanos con profesores locales',
        category: 'cultural',
        cost: 45,
        duration: 120,
        location: 'Escuela de Baile',
        rating: 4.8,
        startTime: '19:00',
        endTime: '21:00',
        scheduleType: 'flexible',
        isTimeFixed: false,
        isTimeEditable: true
      }
    );
  }
  
  // Filtrar por tier del plan
  if (planTier === 1) {
    return optionalActivities.filter(act => act.cost <= 75);
  } else if (planTier === 2) {
    return optionalActivities.filter(act => act.cost <= 120);
  } else {
    return optionalActivities;
  }
};