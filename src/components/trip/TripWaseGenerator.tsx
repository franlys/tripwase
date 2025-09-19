// src/components/trip/TripWaseGenerator.tsx - VERSIÓN COMPLETA CORREGIDA

import React, { useState, useEffect, useMemo, useCallback } from 'react';

// ===================================================================
// IMPORTACIONES CORREGIDAS Y COMPLETAS
// ===================================================================
import {
  DndContext, DragEndEvent, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
  Plane, MapPin, Calendar, Users, DollarSign, Search, Star, Globe, ArrowLeft, ArrowRight,
  CheckCircle, AlertCircle, X, Plus, GripVertical, Clock, Edit3, Gift, Settings, Map,
  Navigation, Route, Phone, Mail, Car, Fuel, Key, Award, Shield, Crown, BookOpen,
  ChevronLeft, ChevronRight, MessageCircle, Umbrella, Mountain, Camera, Coffee, Save,
  CreditCard, Bookmark, TrendingUp, Calendar as CalendarIcon
} from 'lucide-react';

// --- Dependencias de tu proyecto ---
import { generateThreePlans, PlanInput } from '../../utils/multiplePlanGenerator';
import { SimplePlan } from '../../types/trip';
import OriginModal from '../modals/OriginModal';
import FreeMapModal from '../modals/FreeMapModal';
import { OriginData } from '../../types';
import {
  Activity, EnhancedActivity, DayPlan, VehicleOption, TransportSelection, ViewMode
} from '../../types/trip';

// --- IMPORTACIONES NUEVAS PASO 1 ---
import { useTrip } from '../../contexts/TripContext';
import { useNavigate } from 'react-router-dom';

// --- PROPS DEL COMPONENTE ---
interface TripWaseGeneratorProps {
  onBackToExplore?: () => void;
  onShowPlans?: (plans: SimplePlan[]) => void;
}

// ===================================================================
// INTERFACES Y TIPOS ADICIONALES + TRANSPORTE INTELIGENTE - CORREGIDO
// ===================================================================

interface TimeConflict {
  activityId: string;
  conflictsWith: string[];
  type: 'overlap' | 'duration' | 'schedule';
  message: string;
}

interface ActivityTimeRule {
  category: string;
  defaultTime?: string;
  isFixed: boolean;
  duration: number;
  restrictions?: {
    minHour?: number;
    maxHour?: number;
  };
}

// NUEVAS INTERFACES PARA TRANSPORTE INTELIGENTE
interface AirlineOption {
  id: string;
  name: string;
  logo: string;
  basePrice: number;
  rating: number;
  features: string[];
  priceMultipliers: {
    turista: number;
    negocios: number;
    primera: number;
  };
}

interface FlightSelection {
  airline: AirlineOption | null;
  class: 'turista' | 'negocios' | 'primera';
  estimatedCost: number;
}

// NUEVAS INTERFACES PARA TRANSPORTE LOCAL EN DESTINO
interface RentalCarOption {
  id: string;
  company: string;
  model: string;
  category: 'economico' | 'compacto' | 'intermedio' | 'suv' | 'lujo' | 'premium';
  pricePerDay: number;
  features: string[];
  passengers: number;
  luggage: number;
  transmission: 'manual' | 'automatico';
  fuelType: 'gasolina' | 'diesel' | 'hibrido' | 'electrico';
  image?: string;
  rating: number;
}

interface LocalTransportSelection {
  mode: 'auto' | 'manual' | null;
  localTransportType: 'rental' | 'public' | null;
  selectedRentalCar: RentalCarOption | null;
  publicTransportBudget: number;
}

// ===================================================================
// REGLAS DE TIEMPO POR CATEGORÍA
// ===================================================================
const TIME_RULES: Record<string, ActivityTimeRule> = {
  museum: { category: 'museum', defaultTime: '10:00', isFixed: true, duration: 120, restrictions: { minHour: 9, maxHour: 17 } },
  restaurant: { category: 'restaurant', defaultTime: '12:00', isFixed: true, duration: 90 },
  beach: { category: 'beach', defaultTime: '09:00', isFixed: false, duration: 180, restrictions: { minHour: 8, maxHour: 17 } },
  shopping: { category: 'shopping', defaultTime: '15:00', isFixed: false, duration: 120, restrictions: { minHour: 10, maxHour: 20 } },
  tour: { category: 'tour', defaultTime: '09:00', isFixed: true, duration: 240, restrictions: { minHour: 8, maxHour: 16 } },
  nightlife: { category: 'nightlife', defaultTime: '21:00', isFixed: false, duration: 180, restrictions: { minHour: 20, maxHour: 2 } }
};

// ===================================================================
// BASE DE DATOS DE AEROLÍNEAS
// ===================================================================
const AIRLINES_DATABASE: AirlineOption[] = [
  {
    id: 'copa',
    name: 'Copa Airlines',
    logo: '🛫',
    basePrice: 450,
    rating: 4.2,
    features: ['Equipaje incluido', 'Entretenimiento', 'Snacks'],
    priceMultipliers: { turista: 1.0, negocios: 2.1, primera: 3.8 }
  },
  {
    id: 'american',
    name: 'American Airlines',
    logo: '🇺🇸',
    basePrice: 520,
    rating: 4.0,
    features: ['Red global', 'WiFi disponible', 'Programa millas'],
    priceMultipliers: { turista: 1.0, negocios: 2.3, primera: 4.2 }
  },
  {
    id: 'jetblue',
    name: 'JetBlue Airways',
    logo: '💙',
    basePrice: 380,
    rating: 4.4,
    features: ['Asientos amplios', 'TV gratis', 'Snacks premium'],
    priceMultipliers: { turista: 1.0, negocios: 1.8, primera: 3.2 }
  },
  {
    id: 'avianca',
    name: 'Avianca',
    logo: '🔴',
    basePrice: 420,
    rating: 3.9,
    features: ['Conexiones Latinoamérica', 'Equipaje 23kg', 'Comida a bordo'],
    priceMultipliers: { turista: 1.0, negocios: 2.0, primera: 3.5 }
  },
  {
    id: 'spirit',
    name: 'Spirit Airlines',
    logo: '💛',
    basePrice: 280,
    rating: 3.2,
    features: ['Precios bajos', 'Vuelos frecuentes', 'Equipaje adicional'],
    priceMultipliers: { turista: 1.0, negocios: 1.6, primera: 2.8 }
  },
  {
    id: 'delta',
    name: 'Delta Air Lines',
    logo: '🔺',
    basePrice: 550,
    rating: 4.3,
    features: ['Servicio premium', 'SkyMiles', 'Asientos Delta Comfort'],
    priceMultipliers: { turista: 1.0, negocios: 2.4, primera: 4.5 }
  }
];

// ===================================================================
// BASE DE DATOS DE RENTAL CARS PARA DESTINOS INTERNACIONALES - CORREGIDO
// ===================================================================
const RENTAL_CARS_DATABASE: RentalCarOption[] = [
  // ECONÓMICOS
  {
    id: 'hertz_nissan_versa',
    company: 'Hertz',
    model: 'Nissan Versa',
    category: 'economico',
    pricePerDay: 35,
    features: ['Aire acondicionado', 'Radio', 'Bluetooth', 'Seguro básico'],
    passengers: 5,
    luggage: 2,
    transmission: 'automatico',
    fuelType: 'gasolina',
    rating: 4.1
  },
  {
    id: 'budget_chevy_spark',
    company: 'Budget',
    model: 'Chevrolet Spark',
    category: 'economico',
    pricePerDay: 28,
    features: ['Aire acondicionado', 'Radio FM', 'Seguro básico'],
    passengers: 4,
    luggage: 1,
    transmission: 'manual',
    fuelType: 'gasolina',
    rating: 3.8
  },
  
  // COMPACTOS
  {
    id: 'avis_honda_civic',
    company: 'Avis',
    model: 'Honda Civic',
    category: 'compacto',
    pricePerDay: 42,
    features: ['Aire acondicionado', 'Bluetooth', 'USB', 'Seguro completo'],
    passengers: 5,
    luggage: 3,
    transmission: 'automatico',
    fuelType: 'gasolina',
    rating: 4.4
  },
  {
    id: 'enterprise_toyota_corolla',
    company: 'Enterprise',
    model: 'Toyota Corolla',
    category: 'compacto',
    pricePerDay: 38,
    features: ['Aire acondicionado', 'Bluetooth', 'Cámara trasera', 'Seguro completo'],
    passengers: 5,
    luggage: 3,
    transmission: 'automatico',
    fuelType: 'hibrido',
    rating: 4.5
  },
  
  // INTERMEDIOS
  {
    id: 'hertz_toyota_camry',
    company: 'Hertz',
    model: 'Toyota Camry',
    category: 'intermedio',
    pricePerDay: 55,
    features: ['Aire dual', 'Bluetooth', 'GPS', 'Asientos piel', 'Seguro premium'],
    passengers: 5,
    luggage: 4,
    transmission: 'automatico',
    fuelType: 'hibrido',
    rating: 4.6
  },
  {
    id: 'national_nissan_altima',
    company: 'National',
    model: 'Nissan Altima',
    category: 'intermedio',
    pricePerDay: 48,
    features: ['Aire acondicionado', 'Bluetooth', 'Cámara trasera', 'Seguro completo'],
    passengers: 5,
    luggage: 4,
    transmission: 'automatico',
    fuelType: 'gasolina',
    rating: 4.3
  },
  
  // SUVs
  {
    id: 'avis_jeep_compass',
    company: 'Avis',
    model: 'Jeep Compass',
    category: 'suv',
    pricePerDay: 65,
    features: ['AWD', 'Aire dual', 'Bluetooth', 'GPS', 'Seguro premium'],
    passengers: 5,
    luggage: 5,
    transmission: 'automatico',
    fuelType: 'gasolina',
    rating: 4.2
  },
  {
    id: 'enterprise_ford_escape',
    company: 'Enterprise',
    model: 'Ford Escape',
    category: 'suv',
    pricePerDay: 58,
    features: ['Aire dual', 'Bluetooth', 'Cámara 360°', 'Seguro premium'],
    passengers: 5,
    luggage: 5,
    transmission: 'automatico',
    fuelType: 'hibrido',
    rating: 4.4
  },
  
  // LUJO
  {
    id: 'hertz_bmw_320i',
    company: 'Hertz',
    model: 'BMW 320i',
    category: 'lujo',
    pricePerDay: 85,
    features: ['Asientos piel', 'GPS premium', 'Bluetooth', 'Clima dual', 'Seguro premium'],
    passengers: 5,
    luggage: 3,
    transmission: 'automatico',
    fuelType: 'gasolina',
    rating: 4.7
  },
  {
    id: 'avis_mercedes_c_class',
    company: 'Avis',
    model: 'Mercedes C-Class',
    category: 'lujo',
    pricePerDay: 95,
    features: ['Asientos piel', 'GPS premium', 'Sistema audio premium', 'Clima dual'],
    passengers: 5,
    luggage: 3,
    transmission: 'automatico',
    fuelType: 'gasolina',
    rating: 4.8
  },
  
  // PREMIUM
  {
    id: 'hertz_cadillac_escalade',
    company: 'Hertz',
    model: 'Cadillac Escalade',
    category: 'premium',
    pricePerDay: 120,
    features: ['SUV Premium', 'Asientos piel', 'GPS', 'WiFi', 'Entretenimiento trasero'],
    passengers: 7,
    luggage: 6,
    transmission: 'automatico',
    fuelType: 'gasolina',
    rating: 4.6
  },
  {
    id: 'enterprise_tesla_model_s',
    company: 'Enterprise',
    model: 'Tesla Model S',
    category: 'premium',
    pricePerDay: 140,
    features: ['Eléctrico', 'Autopilot', 'Pantalla 17"', 'Supercargadores incluidos'],
    passengers: 5,
    luggage: 2,
    transmission: 'automatico',
    fuelType: 'electrico',
    rating: 4.9
  }
];

// ===================================================================
// FUNCIONES UTILITARIAS PARA TRANSPORTE INTELIGENTE
// ===================================================================

// 1. FUNCIÓN PRINCIPAL: Detectar si el viaje es internacional
const isInternationalTrip = (origin: OriginData | null, destination: string): boolean => {
  if (!origin) return false;
  
  // Lista básica de países y sus ciudades principales para detección
  const COUNTRY_CITIES: Record<string, string[]> = {
    'República Dominicana': ['santo domingo', 'santiago', 'punta cana', 'puerto plata', 'la romana', 'samana'],
    'Estados Unidos': ['new york', 'miami', 'orlando', 'los angeles', 'las vegas', 'chicago'],
    'España': ['madrid', 'barcelona', 'valencia', 'sevilla', 'bilbao'],
    'Francia': ['paris', 'lyon', 'marseille', 'toulouse', 'nice'],
    'México': ['ciudad de mexico', 'cancun', 'guadalajara', 'monterrey', 'playa del carmen'],
    'Brasil': ['sao paulo', 'rio de janeiro', 'brasilia', 'salvador'],
    'Colombia': ['bogota', 'medellin', 'cartagena', 'cali'],
    'Argentina': ['buenos aires', 'cordoba', 'mendoza', 'rosario']
  };

  const originCountry = origin.country;
  const destinationLower = destination.toLowerCase().trim();
  
  // Verificar si el destino está en el mismo país que el origen
  const originCities = COUNTRY_CITIES[originCountry] || [];
  
  // Si el destino coincide con una ciudad del país de origen, es doméstico
  const isDomestic = originCities.some(city => destinationLower.includes(city));
  
  return !isDomestic; // Es internacional si NO es doméstico
};

// 2. Obtener aerolínea favorita del localStorage
const getFavoriteAirline = (): string | null => {
  try {
    return localStorage.getItem('tripwase_favorite_airline');
  } catch {
    return null;
  }
};

// 3. Guardar aerolínea favorita
const setFavoriteAirline = (airlineId: string): void => {
  try {
    localStorage.setItem('tripwase_favorite_airline', airlineId);
  } catch {
    console.warn('No se pudo guardar la aerolínea favorita');
  }
};

// 4. Ordenar aerolíneas poniendo la favorita primero
const sortAirlinesByPreference = (airlines: AirlineOption[]): AirlineOption[] => {
  const favoriteId = getFavoriteAirline();
  if (!favoriteId) return airlines;
  
  const favorite = airlines.find(a => a.id === favoriteId);
  const others = airlines.filter(a => a.id !== favoriteId);
  
  return favorite ? [favorite, ...others] : airlines;
};

// 5. Calcular costo de vuelo según clase
const calculateFlightCost = (airline: AirlineOption, flightClass: 'turista' | 'negocios' | 'primera', travelers: number): number => {
  const multiplier = airline.priceMultipliers[flightClass];
  return Math.round(airline.basePrice * multiplier * travelers);
};

// ===================================================================
// COMPONENTE PRINCIPAL Y DEFINITIVO - PASO 1 COMPLETADO
// ===================================================================
const TripWaseGenerator: React.FC<TripWaseGeneratorProps> = ({ onBackToExplore, onShowPlans }) => {

  // --- HOOKS NUEVOS PASO 1 ---
  const { saveTrip, trips, addNotification } = useTrip();
  const navigate = useNavigate();

  // --- ESTADOS COMPLETOS ---
  const [currentView, setCurrentView] = useState<ViewMode>('planning');
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [availableActivities, setAvailableActivities] = useState<EnhancedActivity[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SimplePlan | null>(null);
  const [generatedPlans, setGeneratedPlans] = useState<SimplePlan[]>([]);
  const [selectedOrigin, setSelectedOrigin] = useState<OriginData | null>(null);
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(2000);
  const [currency, setCurrency] = useState<'USD' | 'DOP'>('USD');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['beach', 'restaurant', 'museum']);
  const [showOriginModal, setShowOriginModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'success' | 'error' | 'warning' }>>([]);

  // --- ESTADOS NUEVOS PASO 1 ---
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [tripSaved, setTripSaved] = useState(false);

  // NUEVOS ESTADOS PARA TRANSPORTE INTELIGENTE
  const [flightSelection, setFlightSelection] = useState<FlightSelection>({
    airline: null,
    class: 'turista',
    estimatedCost: 0
  });

  const [favoriteAirlineId, setFavoriteAirlineId] = useState<string | null>(null);

  // NUEVOS ESTADOS PARA TRANSPORTE LOCAL EN DESTINO
  const [localTransportSelection, setLocalTransportSelection] = useState<LocalTransportSelection>({
    mode: null, // 'auto' o 'manual'
    localTransportType: null, // 'rental' o 'public'
    selectedRentalCar: null,
    publicTransportBudget: 150 // Presupuesto estimado para transporte público
  });

  // Estados para transporte mejorados - CORREGIDO con nuevas opciones
  const [transportSelection, setTransportSelection] = useState<TransportSelection & {
    transportType?: 'public' | 'taxi';
  }>({
    hasVehicle: null, // IMPORTANTE: Inicializar como null para forzar selección
    rentVehicle: false,
    selectedVehicle: null,
    fuelBudget: 0,
    transportType: undefined
  });

  // Estados para itinerario
  const [editingTime, setEditingTime] = useState<{ dayId: string; activityId: string } | null>(null);
  const [conflicts, setConflicts] = useState<TimeConflict[]>([]);

  // --- FUNCIONES UTILITARIAS ---
  const generateUniqueId = (prefix: string = 'item'): string => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const validateTimeFormat = (time: string): boolean => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const parseTime = (timeStr: string): { hours: number; minutes: number } => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return { hours, minutes };
  };

  const addMinutesToTime = (timeStr: string, minutes: number): string => {
    const { hours, minutes: mins } = parseTime(timeStr);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
  };

  // --- TOAST SYSTEM ---
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev.slice(-2), { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  // --- INICIALIZACIÓN DE FAVORITOS ---
  useEffect(() => {
    const savedFavorite = getFavoriteAirline();
    if (savedFavorite) {
      setFavoriteAirlineId(savedFavorite);
    }
  }, []);

  // --- VALIDACIÓN Y NAVEGACIÓN MEJORADA ---
  const validateForm = (): boolean => {
    console.log('Validando formulario...', {
      selectedOrigin,
      destination,
      startDate,
      endDate,
      travelers,
      budget
    });

    if (!selectedOrigin) {
      console.log('Origen no seleccionado - abriendo modal');
      setShowOriginModal(true);
      showToast('Por favor selecciona tu origen', 'error');
      return false;
    }
    if (!destination.trim()) {
      showToast('Por favor ingresa tu destino', 'error');
      return false;
    }
    if (!startDate || !endDate) {
      showToast('Por favor selecciona las fechas de viaje', 'error');
      return false;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      showToast('La fecha de inicio debe ser anterior a la fecha de fin', 'error');
      return false;
    }
    if (travelers < 1) {
      showToast('Debe haber al menos 1 viajero', 'error');
      return false;
    }
    if (budget < 100) {
      showToast('El presupuesto mínimo es $100', 'error');
      return false;
    }
    return true;
  };

  // VALIDACIÓN MEJORADA PARA TRANSPORTE INTELIGENTE
  const validateTransport = (): boolean => {
    console.log('Validando transporte...', transportSelection);
    
    const isInternational = isInternationalTrip(selectedOrigin, destination);
    
    if (isInternational) {
      // Validación para vuelos internacionales
      if (!flightSelection.airline) {
        showToast('Por favor selecciona una aerolínea', 'error');
        return false;
      }
      if (!flightSelection.class) {
        showToast('Por favor selecciona la clase de vuelo', 'error');
        return false;
      }
      
      // Validación para transporte local en destino
      if (!localTransportSelection.mode) {
        showToast('Por favor selecciona el modo de transporte local (Automático o Manual)', 'error');
        return false;
      }
      
      if (localTransportSelection.mode === 'manual') {
        if (!localTransportSelection.localTransportType) {
          showToast('Por favor selecciona el tipo de transporte en el destino', 'error');
          return false;
        }
        
        if (localTransportSelection.localTransportType === 'rental' && !localTransportSelection.selectedRentalCar) {
          showToast('Por favor selecciona un vehículo de alquiler', 'error');
          return false;
        }
      }
      
      return true;
    } else {
      // Validación para transporte terrestre
      if (transportSelection.hasVehicle === null) {
        showToast('Por favor selecciona una opción de transporte', 'error');
        return false;
      }
      
      // Si eligió no tener vehículo, debe seleccionar una alternativa
      if (transportSelection.hasVehicle === false) {
        const hasRentVehicle = transportSelection.rentVehicle;
        const hasPublicTransport = transportSelection.transportType === 'public';
        const hasTaxi = transportSelection.transportType === 'taxi';
        
        if (!hasRentVehicle && !hasPublicTransport && !hasTaxi) {
          showToast('Por favor selecciona tu método de transporte preferido', 'error');
          return false;
        }
        
        // Si eligió alquiler, debe seleccionar un vehículo
        if (hasRentVehicle && !transportSelection.selectedVehicle) {
          showToast('Por favor selecciona un vehículo de alquiler', 'error');
          return false;
        }
      }
      
      return true;
    }
  };

  // --- FUNCIÓN PRINCIPAL PARA FORZAR ORIGEN OBLIGATORIO ---
  const handleStartPlanning = () => {
    console.log('Iniciando planificación...');
    console.log('Origen actual:', selectedOrigin);
    
    if (!selectedOrigin) {
      console.log('Forzando modal de origen');
      setShowOriginModal(true);
      return;
    }
    
    // Si ya tiene origen, validar el resto del formulario
    if (validateForm()) {
      handleGeneratePlans();
    }
  };

  const handleNext = () => {
    console.log('Navegando desde vista:', currentView);
    
    switch (currentView) {
      case 'planning':
        // Para la vista de planificación, usar handleStartPlanning
        handleStartPlanning();
        break;
      case 'transport':
        console.log('Validando transporte antes de continuar');
        if (validateTransport()) {
          console.log('Transporte validado - yendo a selección');
          setCurrentView('selection');
        }
        break;
      case 'selection':
        if (selectedPlan) {
          console.log('Plan seleccionado - generando itinerario:', selectedPlan);
          generateItineraryFromPlan(selectedPlan);
          setCurrentView('building');
        } else {
          showToast('Por favor selecciona un plan', 'error');
        }
        break;
      case 'building':
        setCurrentView('summary');
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    switch (currentView) {
      case 'transport':
        setCurrentView('planning');
        break;
      case 'selection':
        setCurrentView('transport');
        break;
      case 'building':
        setCurrentView('selection');
        break;
      case 'summary':
        setCurrentView('building');
        break;
      default:
        if (onBackToExplore) onBackToExplore();
        break;
    }
  };

  // --- GENERACIÓN DE PLANES CORREGIDA ---
  const handleGeneratePlans = async () => {
    console.log('Generando planes...');
    
    if (!validateForm()) return;

    setIsGenerating(true);
    try {
      const planInput: PlanInput = {
        origin: {
          city: selectedOrigin?.city || '',
          country: selectedOrigin?.country || '',
          flag: selectedOrigin?.flag || ''
        },
        destination,
        startDate,
        endDate,
        travelers,
        budget,
        currency,
        interests: selectedCategories
      };

      console.log('Input para generar planes:', planInput);
      const plans = await generateThreePlans(planInput);
      console.log('Planes generados:', plans);
      
      setGeneratedPlans(plans);
      
      if (onShowPlans) {
        onShowPlans(plans);
      }
      
      showToast('¡Planes generados exitosamente!', 'success');
      
      // IMPORTANTE: Ir a transporte después de generar planes
      console.log('Cambiando a vista de transporte');
      setCurrentView('transport');
      
    } catch (error) {
      console.error('Error generating plans:', error);
      showToast('Error al generar planes. Intenta nuevamente.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // --- SELECCIÓN DE PLAN CORREGIDA ---
  const handleSelectPlan = (plan: SimplePlan) => {
    console.log('Seleccionando plan:', plan);
    setSelectedPlan(plan);
    showToast(`Plan "${plan.name}" seleccionado`, 'success');
  };

  // --- GENERACIÓN DE ITINERARIO CORREGIDA ---
  const generateItineraryFromPlan = (plan: SimplePlan) => {
    console.log('Generando itinerario desde plan:', plan);
    
    // CORRECCIÓN: Calcular duration desde las fechas ya que no existe en SimplePlan
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const dayCount = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24));
    
    const newDayPlans: DayPlan[] = [];

    // Generar actividades específicas para el tier del plan
    const activitiesByTier = generateActivitiesByTier(plan.tier, destination);
    console.log('Actividades generadas para tier', plan.tier, ':', activitiesByTier);
    setAvailableActivities(activitiesByTier);

    // Crear días vacíos
    for (let i = 0; i < dayCount; i++) {
      const currentDate = new Date(startDateObj);
      currentDate.setDate(startDateObj.getDate() + i);
      
      newDayPlans.push({
        id: generateUniqueId('day'),
        date: currentDate.toISOString().split('T')[0],
        activities: [],
        totalCost: 0,
        totalDuration: 0
      });
    }

    console.log('Días creados:', newDayPlans);
    setDayPlans(newDayPlans);
    showToast('Itinerario inicial creado. ¡Empieza a planificar!', 'success');
  };

  const generateActivitiesByTier = (tier: string, destination: string): EnhancedActivity[] => {
    console.log('Generando actividades para tier:', tier);
    
    const baseActivities: EnhancedActivity[] = [
      {
        id: generateUniqueId('activity'),
        title: 'Museo Nacional',
        description: 'Visita al principal museo de la ciudad',
        duration: 120,
        cost: 15,
        category: 'museum',
        startTime: '10:00',
        endTime: '12:00',
        scheduleType: 'fixed',
        isTimeFixed: true,
        isTimeEditable: false,
        location: destination,
        rating: 4.5
      },
      {
        id: generateUniqueId('activity'),
        title: 'Playa Principal',
        description: 'Relajación en la playa más popular',
        duration: 180,
        cost: 0,
        category: 'beach',
        startTime: '09:00',
        endTime: '12:00',
        scheduleType: 'flexible',
        isTimeFixed: false,
        isTimeEditable: true,
        location: destination,
        rating: 4.7
      },
      {
        id: generateUniqueId('activity'),
        title: 'Almuerzo Local',
        description: 'Comida típica en restaurante tradicional',
        duration: 90,
        cost: 25,
        category: 'restaurant',
        startTime: '12:00',
        endTime: '13:30',
        scheduleType: 'fixed',
        isTimeFixed: true,
        isTimeEditable: false,
        location: destination,
        rating: 4.3
      },
      {
        id: generateUniqueId('activity'),
        title: 'Centro Comercial',
        description: 'Compras y entretenimiento',
        duration: 120,
        cost: 50,
        category: 'shopping',
        startTime: '15:00',
        endTime: '17:00',
        scheduleType: 'flexible',
        isTimeFixed: false,
        isTimeEditable: true,
        location: destination,
        rating: 4.0
      },
      {
        id: generateUniqueId('activity'),
        title: 'Tour de la Ciudad',
        description: 'Recorrido guiado por los puntos principales',
        duration: 240,
        cost: 35,
        category: 'tour',
        startTime: '09:00',
        endTime: '13:00',
        scheduleType: 'fixed',
        isTimeFixed: true,
        isTimeEditable: false,
        location: destination,
        rating: 4.6
      }
    ];

    // CORRECCIÓN: Usar valores correctos de tier
    if (tier === 'intermedio' || tier === 'premium') {
      baseActivities.push({
        id: generateUniqueId('activity'),
        title: 'Spa y Relajación',
        description: 'Sesión de spa de lujo',
        duration: 180,
        cost: 80,
        category: 'wellness',
        startTime: '14:00',
        endTime: '17:00',
        scheduleType: 'flexible',
        isTimeFixed: false,
        isTimeEditable: true,
        location: destination,
        rating: 4.8
      });
    }

    if (tier === 'premium') {
      baseActivities.push({
        id: generateUniqueId('activity'),
        title: 'Cena Gourmet',
        description: 'Experiencia gastronómica de alto nivel',
        duration: 120,
        cost: 120,
        category: 'restaurant',
        startTime: '19:00',
        endTime: '21:00',
        scheduleType: 'fixed',
        isTimeFixed: true,
        isTimeEditable: false,
        location: destination,
        rating: 4.9
      });
    }

    console.log('Actividades generadas:', baseActivities);
    return baseActivities;
  };

  // --- FUNCIONES NUEVAS PASO 1: GUARDAR Y PROCEDER AL PAGO - CORREGIDAS ---
  const handleSaveTrip = async () => {
    if (!selectedPlan || !selectedOrigin) {
      showToast('Debes seleccionar un plan y origen para guardar', 'error');
      return;
    }

    setIsSaving(true);
    try {
      // Calcular duración del viaje
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      const duration = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24));

      // CORRECCIÓN PRINCIPAL: Crear objeto de viaje con TODAS las propiedades requeridas
      const tripData = {
        name: `Viaje a ${destination}`,
        destination: {
          name: destination,
          country: destination // Usar el destino como país (puede mejorarse con lógica adicional)
        },
        origin: {
          city: selectedOrigin.city,
          country: selectedOrigin.country,
          flag: selectedOrigin.flag
        },
        startDate,
        endDate,
        duration,
        // PROPIEDAD FALTANTE AGREGADA:
        dates: {
          startDate,
          endDate
        },
        travelers: {
          adults: travelers,
          children: 0
        },
        currency,
        budget: {
          total: budget,
          used: totalBudgetUsed,
          remaining: budget - totalBudgetUsed
        },
        interests: selectedCategories,
        selectedPlan: selectedPlan,
        plan: selectedPlan, // Alias para compatibilidad
        itinerary: dayPlans,
        transport: transportSelection,
        status: 'planning' as const,
        // Campos opcionales calculados
        totalCost: totalBudgetUsed,
        notes: `Viaje generado automáticamente con TripWase`,
        isArchived: false
      };

      console.log('Guardando viaje con datos completos:', tripData);
      
      // Guardar en TripContext
      await saveTrip(tripData);
      
      setTripSaved(true);
      showToast('¡Viaje guardado exitosamente!', 'success');
      
      // Agregar notificación al contexto - SIN id ni timestamp
      addNotification({
        type: 'success',
        title: 'Viaje Guardado',
        message: `Tu viaje a ${destination} ha sido guardado correctamente`,
        read: false
      });

      // Navegar al dashboard después de un breve delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Error al guardar viaje:', error);
      showToast('Error al guardar el viaje. Intenta nuevamente.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleProceedToPayment = async () => {
    if (!selectedPlan) {
      showToast('Debes seleccionar un plan para proceder al pago', 'error');
      return;
    }

    setIsProcessingPayment(true);
    try {
      // Simular procesamiento de pago
      console.log('Procesando pago para plan:', selectedPlan);
      
      // Aquí iría la lógica de integración con pasarela de pagos
      // Por ahora simulamos con un delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast('Redirigiendo a página de pago...', 'success');
      
      // TODO: Implementar navegación a checkout
      // navigate('/checkout', { state: { plan: selectedPlan, tripData: /* datos del viaje */ } });
      
      addNotification({
        type: 'info',
        title: 'Pago Pendiente',
        message: `Completa el pago para tu viaje a ${destination}`,
        read: false
      });

    } catch (error) {
      console.error('Error al procesar pago:', error);
      showToast('Error al procesar el pago. Intenta nuevamente.', 'error');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // NUEVA FUNCIÓN: Selección automática de transporte
  const handleAutoModeSelection = () => {
    // Seleccionar automáticamente la mejor opción según el presupuesto
    const duration = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
    const budgetPerDay = budget / duration;
    
    // Automático: aerolínea con mejor relación precio-calidad
    const sortedAirlines = sortAirlinesByPreference(AIRLINES_DATABASE);
    const bestAirline = sortedAirlines.find(airline => airline.rating >= 4.0) || sortedAirlines[0];
    const autoClass = budgetPerDay > 200 ? 'negocios' : 'turista';
    const autoCost = calculateFlightCost(bestAirline, autoClass, travelers);
    
    setFlightSelection({
      airline: bestAirline,
      class: autoClass,
      estimatedCost: autoCost
    });
    
    // Automático: transporte local según presupuesto
    if (budgetPerDay > 100) {
      // Presupuesto alto: rental car intermedio
      const autoCar = RENTAL_CARS_DATABASE.find(car => car.category === 'intermedio') || RENTAL_CARS_DATABASE[4];
      setLocalTransportSelection({
        mode: 'auto',
        localTransportType: 'rental',
        selectedRentalCar: autoCar,
        publicTransportBudget: 150
      });
    } else {
      // Presupuesto bajo: transporte público
      setLocalTransportSelection({
        mode: 'auto',
        localTransportType: 'public',
        selectedRentalCar: null,
        publicTransportBudget: 100
      });
    }
    
    showToast('Selección automática completada', 'success');
  };

  // --- DETECCIÓN DE CONFLICTOS ---
  const detectTimeConflicts = (activities: EnhancedActivity[]): TimeConflict[] => {
    const conflicts: TimeConflict[] = [];
    
    for (let i = 0; i < activities.length; i++) {
      const activity1 = activities[i];
      if (!activity1.startTime) continue;
      
      for (let j = i + 1; j < activities.length; j++) {
        const activity2 = activities[j];
        if (!activity2.startTime) continue;
        
        const start1 = parseTime(activity1.startTime);
        const end1Time = addMinutesToTime(activity1.startTime, activity1.duration);
        const end1 = parseTime(end1Time);
        
        const start2 = parseTime(activity2.startTime);
        const end2Time = addMinutesToTime(activity2.startTime, activity2.duration);
        const end2 = parseTime(end2Time);
        
        const start1Minutes = start1.hours * 60 + start1.minutes;
        const end1Minutes = end1.hours * 60 + end1.minutes;
        const start2Minutes = start2.hours * 60 + start2.minutes;
        const end2Minutes = end2.hours * 60 + end2.minutes;
        
        if (start1Minutes < end2Minutes && start2Minutes < end1Minutes) {
          conflicts.push({
            activityId: activity1.id,
            conflictsWith: [activity2.id],
            type: 'overlap',
            message: `Conflicto de horario entre ${activity1.title} y ${activity2.title}`
          });
        }
      }
    }
    
    return conflicts;
  };

  // --- MANEJO DE ACTIVIDADES ---
  const addActivityToDay = (dayId: string, activity: EnhancedActivity) => {
    const newActivity: EnhancedActivity = {
      ...activity,
      id: generateUniqueId('scheduled'),
      startTime: TIME_RULES[activity.category]?.defaultTime || activity.startTime,
      isTimeFixed: TIME_RULES[activity.category]?.isFixed ?? activity.isTimeFixed
    };

    setDayPlans(prev => prev.map(day => {
      if (day.id === dayId) {
        const updatedActivities = [...day.activities, newActivity];
        const newConflicts = detectTimeConflicts(updatedActivities);
        setConflicts(prev => [...prev.filter(c => !updatedActivities.find(a => a.id === c.activityId)), ...newConflicts]);
        
        return {
          ...day,
          activities: updatedActivities,
          totalCost: updatedActivities.reduce((sum, act) => sum + act.cost, 0),
          totalDuration: updatedActivities.reduce((sum, act) => sum + act.duration, 0)
        };
      }
      return day;
    }));

    showToast(`${activity.title} agregada al día`, 'success');
  };

  const removeActivityFromDay = (dayId: string, activityId: string) => {
    setDayPlans(prev => prev.map(day => {
      if (day.id === dayId) {
        const updatedActivities = day.activities.filter(act => act.id !== activityId);
        return {
          ...day,
          activities: updatedActivities,
          totalCost: updatedActivities.reduce((sum, act) => sum + act.cost, 0),
          totalDuration: updatedActivities.reduce((sum, act) => sum + act.duration, 0)
        };
      }
      return day;
    }));

    setConflicts(prev => prev.filter(c => c.activityId !== activityId));
    showToast('Actividad removida', 'success');
  };

  const updateActivityTime = (dayId: string, activityId: string, newTime: string) => {
    if (!validateTimeFormat(newTime)) {
      showToast('Formato de hora inválido', 'error');
      return;
    }

    setDayPlans(prev => prev.map(day => {
      if (day.id === dayId) {
        const updatedActivities = day.activities.map(act => 
          act.id === activityId ? { ...act, startTime: newTime } : act
        );
        
        const newConflicts = detectTimeConflicts(updatedActivities);
        setConflicts(prev => [...prev.filter(c => c.activityId !== activityId), ...newConflicts]);
        
        return { ...day, activities: updatedActivities };
      }
      return day;
    }));

    setEditingTime(null);
    showToast('Hora actualizada', 'success');
  };

  // --- DRAG & DROP ---
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (active.data.current?.type === 'available' && over.data.current?.type === 'day') {
      const activity = availableActivities.find(a => a.id === activeId);
      if (activity) {
        addActivityToDay(overId, activity);
      }
      return;
    }

    const activeDayId = active.data.current?.dayId;
    const overDayId = over.data.current?.dayId;

    if (activeDayId && overDayId && activeDayId === overDayId) {
      setDayPlans(prev => prev.map(day => {
        if (day.id === activeDayId) {
          const oldIndex = day.activities.findIndex(a => a.id === activeId);
          const newIndex = day.activities.findIndex(a => a.id === overId);
          
          if (oldIndex !== -1 && newIndex !== -1) {
            const reorderedActivities = arrayMove(day.activities, oldIndex, newIndex);
            return { ...day, activities: reorderedActivities };
          }
        }
        return day;
      }));
    }

    if (activeDayId && overDayId && activeDayId !== overDayId) {
      let activityToMove: EnhancedActivity | null = null;
      
      setDayPlans(prev => prev.map(day => {
        if (day.id === activeDayId) {
          activityToMove = day.activities.find(a => a.id === activeId) || null;
          const updatedActivities = day.activities.filter(a => a.id !== activeId);
          return {
            ...day,
            activities: updatedActivities,
            totalCost: updatedActivities.reduce((sum, act) => sum + act.cost, 0),
            totalDuration: updatedActivities.reduce((sum, act) => sum + act.duration, 0)
          };
        }
        return day;
      }));

      if (activityToMove) {
        setDayPlans(prev => prev.map(day => {
          if (day.id === overDayId) {
            const updatedActivities = [...day.activities, activityToMove as EnhancedActivity];
            return {
              ...day,
              activities: updatedActivities,
              totalCost: updatedActivities.reduce((sum, act) => sum + act.cost, 0),
              totalDuration: updatedActivities.reduce((sum, act) => sum + act.duration, 0)
            };
          }
          return day;
        }));
      }
    }
  };

  // Vehículos disponibles
  const vehicleOptions: VehicleOption[] = [
    {
      id: 'economy',
      name: 'Económico',
      type: 'compact',
      pricePerDay: 25,
      passengers: 4,
      luggage: 2,
      fuelType: 'gasoline',
      transmission: 'manual',
      features: ['Aire acondicionado', 'Radio', 'Seguro básico'],
      image: '/api/placeholder/300/200'
    },
    {
      id: 'comfort',
      name: 'Confort',
      type: 'suv',
      pricePerDay: 40,
      passengers: 5,
      luggage: 4,
      fuelType: 'gasoline',
      transmission: 'automatic',
      features: ['Aire acondicionado', 'GPS', 'Seguro completo', 'Bluetooth'],
      image: '/api/placeholder/300/200'
    },
    {
      id: 'premium',
      name: 'Premium',
      type: 'luxury',
      pricePerDay: 70,
      passengers: 7,
      luggage: 6,
      fuelType: 'hybrid',
      transmission: 'automatic',
      features: ['Clima dual', 'GPS Premium', 'Seguro premium', 'WiFi', 'Asientos de cuero'],
      image: '/api/placeholder/300/200'
    }
  ];

  // --- CÁLCULO DE PRESUPUESTO MEJORADO ---
  const totalBudgetUsed = useMemo(() => {
    const planCost = selectedPlan?.totalCost || 0;
    const isInternational = isInternationalTrip(selectedOrigin, destination);
    
    let transportCost = 0;
    if (isInternational) {
      // Costo de vuelo internacional
      transportCost += flightSelection.estimatedCost || 0;
      
      // Costo de transporte local en destino
      if (localTransportSelection.localTransportType === 'rental' && localTransportSelection.selectedRentalCar) {
        const duration = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
        transportCost += localTransportSelection.selectedRentalCar.pricePerDay * duration;
      } else if (localTransportSelection.localTransportType === 'public') {
        transportCost += localTransportSelection.publicTransportBudget;
      }
    } else {
      // Costo de transporte terrestre (existente)
      transportCost = transportSelection.selectedVehicle?.pricePerDay || 0;
    }
    
    const activitiesCost = dayPlans.reduce((sum, day) => sum + day.totalCost, 0);
    return planCost + transportCost + activitiesCost;
  }, [selectedPlan, flightSelection, localTransportSelection, transportSelection, dayPlans, selectedOrigin, destination, endDate, startDate]);

  const progressSteps = ['Planificación', 'Transporte', 'Selección', 'Itinerario', 'Resumen'];
  const currentStepIndex = progressSteps.indexOf(
    currentView === 'planning' ? 'Planificación' :
    currentView === 'transport' ? 'Transporte' :
    currentView === 'selection' ? 'Selección' :
    currentView === 'building' ? 'Itinerario' : 'Resumen'
  );

  // ===================================================================
  // SUB-COMPONENTES INTERNOS
  // ===================================================================
  
  const EnhancedSortableActivity: React.FC<{ 
    activity: EnhancedActivity; 
    isDragOverlay?: boolean;
    dayId?: string;
    onRemove?: () => void;
  }> = ({ activity, isDragOverlay, dayId, onRemove }) => {
    const isInItinerary = !!dayId;
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
      id: activity.id,
      data: { type: isInItinerary ? 'scheduled' : 'available', dayId, activity }
    });
    
    const style = { 
      transform: CSS.Transform.toString(transform), 
      transition, 
      opacity: isDragging ? 0.5 : 1 
    };

    const isEditing = editingTime?.activityId === activity.id && editingTime?.dayId === dayId;
    const hasConflict = conflicts.some(c => c.activityId === activity.id);

    const getCategoryIcon = (category: string) => {
      const icons = {
        museum: 'MUS',
        beach: 'BCH',
        restaurant: 'REST',
        shopping: 'SHOP',
        tour: 'TOUR',
        nightlife: 'NIGHT',
        wellness: 'SPA',
        default: 'ACT'
      };
      return icons[category as keyof typeof icons] || icons.default;
    };

    return (
      <div 
        ref={setNodeRef} 
        style={style as React.CSSProperties} 
        {...attributes} 
        {...listeners}
        className={`
          relative p-4 rounded-xl border-2 bg-white shadow-lg cursor-grab transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1
          ${isDragOverlay ? 'shadow-2xl scale-105' : ''}
          ${hasConflict ? 'border-red-400 bg-red-50' : 'border-blue-200 hover:border-blue-300'}
          ${isInItinerary ? 'border-green-400 bg-gradient-to-br from-green-50 to-blue-50' : 'bg-gradient-to-br from-white to-blue-50'}
        `}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {getCategoryIcon(activity.category)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 text-base leading-tight">{activity.title}</h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{activity.description}</p>
              
              <div className="flex items-center flex-wrap gap-3 mt-3 text-xs">
                <span className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  <span>{activity.duration}min</span>
                </span>
                <span className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  <DollarSign className="w-3 h-3" />
                  <span>${activity.cost}</span>
                </span>
                <span className="flex items-center space-x-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3" />
                  <span>{activity.rating}</span>
                </span>
              </div>

              {isInItinerary && (
                <div className="mt-3 flex items-center space-x-2">
                  {isEditing ? (
                    <input
                      type="time"
                      value={activity.startTime || ''}
                      onChange={(e) => updateActivityTime(dayId!, activity.id, e.target.value)}
                      onBlur={() => setEditingTime(null)}
                      className="text-sm border border-blue-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                  ) : (
                    <button 
                      className={`
                        text-sm px-3 py-1 rounded-lg cursor-pointer flex items-center space-x-2 transition-all
                        ${activity.isTimeFixed 
                          ? 'bg-gray-100 text-gray-700 cursor-not-allowed' 
                          : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                        }
                      `}
                      onClick={() => !activity.isTimeFixed && setEditingTime({ dayId: dayId!, activityId: activity.id })}
                      disabled={activity.isTimeFixed}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{activity.startTime || 'Sin hora'}</span>
                      {activity.isTimeFixed ? <span>[FIJO]</span> : <Edit3 className="w-3 h-3" />}
                    </button>
                  )}
                  
                  {hasConflict && (
                    <span className="text-xs text-red-600 flex items-center space-x-1 bg-red-100 px-2 py-1 rounded-full">
                      <AlertCircle className="w-3 h-3" />
                      <span>Conflicto</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {isInItinerary && onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  };
  
  const DroppableDay: React.FC<{ day: DayPlan }> = React.memo(({ day }) => {
    const { setNodeRef, isOver } = useDroppable({ 
      id: day.id,
      data: { type: 'day', dayId: day.id }
    });

    const dayConflicts = conflicts.filter(c => 
      day.activities.some(a => a.id === c.activityId)
    );

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
    };

    const formatDuration = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hours === 0) return `${mins}m`;
      if (mins === 0) return `${hours}h`;
      return `${hours}h ${mins}m`;
    };
    
    return (
      <div 
        ref={setNodeRef} 
        className={`
          relative p-6 rounded-2xl transition-all duration-300 min-h-[400px] border-2
          ${isOver 
            ? 'bg-gradient-to-br from-blue-100 to-purple-100 border-blue-400 shadow-xl scale-102' 
            : 'bg-gradient-to-br from-gray-50 to-white border-gray-200 shadow-lg hover:shadow-xl'
          }
          ${dayConflicts.length > 0 ? 'border-red-300 shadow-red-100' : ''}
        `}
      >
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full opacity-10"></div>

        <div className="day-header mb-6">
          <h3 className="text-xl font-bold text-gray-900 capitalize mb-2">
            {formatDate(day.date)}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <span className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                <Calendar className="w-4 h-4" />
                <span>{day.activities.length}</span>
              </span>
              <span className="flex items-center space-x-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(day.totalDuration)}</span>
              </span>
              <span className="flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                <DollarSign className="w-4 h-4" />
                <span>${day.totalCost}</span>
              </span>
            </div>
            
            {dayConflicts.length > 0 && (
              <div className="flex items-center space-x-1 text-red-600 text-sm bg-red-100 px-3 py-1 rounded-full">
                <AlertCircle className="w-4 h-4" />
                <span>{dayConflicts.length} conflicto(s)</span>
              </div>
            )}
          </div>
        </div>

        <SortableContext 
          items={day.activities.map(a => a.id)} 
          strategy={verticalListSortingStrategy}
        >
          <div className="day-activities space-y-4">
            {day.activities.length === 0 ? (
              <div className="empty-day flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">¡Arrastra actividades aquí!</p>
                <p className="text-sm text-gray-500">Personaliza tu día perfecto</p>
              </div>
            ) : (
              day.activities
                .sort((a, b) => {
                  if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
                  if (a.startTime && !b.startTime) return -1;
                  if (!a.startTime && b.startTime) return 1;
                  return 0;
                })
                .map(activity => (
                  <EnhancedSortableActivity 
                    key={activity.id} 
                    activity={activity}
                    dayId={day.id}
                    onRemove={() => removeActivityFromDay(day.id, activity.id)}
                  />
                ))
            )}
          </div>
        </SortableContext>
      </div>
    );
  });

  // ===================================================================
  // VISTAS MEJORADAS
  // ===================================================================
  
  const renderPlanningView = () => (
    <div className="planning-view space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
          <Plane className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Planifica tu viaje perfecto
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Completa la información para generar planes personalizados que se adapten a tus gustos y presupuesto
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Origen */}
        <div className="form-group">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <MapPin className="w-5 h-5 inline mr-2 text-blue-600" />
            Origen
          </label>
          <button
            onClick={() => setShowOriginModal(true)}
            className={`
              w-full p-4 border-2 rounded-xl text-left transition-all duration-200 hover:shadow-lg
              ${selectedOrigin 
                ? 'border-green-400 bg-green-50 hover:border-green-500' 
                : 'border-red-300 bg-red-50 hover:border-red-400'
              }
            `}
          >
            {selectedOrigin ? (
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{selectedOrigin.flag}</span>
                <span className="text-gray-900 font-medium">
                  {selectedOrigin.city}, {selectedOrigin.country}
                </span>
              </div>
            ) : (
              <span className="text-red-600 font-medium">OBLIGATORIO: Selecciona tu ciudad de origen</span>
            )}
          </button>
        </div>

        {/* Destino */}
        <div className="form-group">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Navigation className="w-5 h-5 inline mr-2 text-purple-600" />
            Destino
          </label>
          <div className="flex space-x-3">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="¿A dónde quieres viajar?"
              className="flex-1 p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <button
              onClick={() => setShowMapModal(true)}
              className="p-4 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <Map className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Fechas */}
        <div className="form-group">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Calendar className="w-5 h-5 inline mr-2 text-green-600" />
            Fecha de salida
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="form-group">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Calendar className="w-5 h-5 inline mr-2 text-green-600" />
            Fecha de regreso
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || new Date().toISOString().split('T')[0]}
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Viajeros */}
        <div className="form-group">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Users className="w-5 h-5 inline mr-2 text-orange-600" />
            Número de viajeros
          </label>
          <input
            type="number"
            value={travelers}
            onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
            min="1"
            max="20"
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Presupuesto */}
        <div className="form-group">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <DollarSign className="w-5 h-5 inline mr-2 text-green-600" />
            Presupuesto
          </label>
          <div className="flex space-x-3">
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value) || 100)}
              min="100"
              step="50"
              className="flex-1 p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as 'USD' | 'DOP')}
              className="p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="USD">USD</option>
              <option value="DOP">DOP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Intereses */}
      <div className="max-w-4xl mx-auto">
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          <Star className="w-5 h-5 inline mr-2 text-yellow-600" />
          Categorías de interés
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { key: 'museum', label: 'Museos', icon: 'MUS' },
            { key: 'beach', label: 'Playas', icon: 'BCH' },
            { key: 'restaurant', label: 'Restaurantes', icon: 'REST' },
            { key: 'shopping', label: 'Compras', icon: 'SHOP' },
            { key: 'tour', label: 'Tours', icon: 'TOUR' },
            { key: 'nightlife', label: 'Vida nocturna', icon: 'NIGHT' }
          ].map(category => (
            <label 
              key={category.key} 
              className={`
                flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md
                ${selectedCategories.includes(category.key) 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.key)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCategories(prev => [...prev, category.key]);
                  } else {
                    setSelectedCategories(prev => prev.filter(c => c !== category.key));
                  }
                }}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-bold bg-gray-200 px-2 py-1 rounded">{category.icon}</span>
              <span className="font-medium text-gray-700">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="text-center mt-12">
        <button
          onClick={handleStartPlanning}
          disabled={isGenerating}
          className="px-12 py-4 bg-gradient-to-r from-orange-500 to-blue-600 text-white font-bold text-lg rounded-2xl hover:from-orange-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isGenerating ? (
            <span className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span>Generando planes mágicos...</span>
            </span>
          ) : (
            <span className="flex items-center space-x-3">
              <Search className="w-6 h-6" />
              <span>¡Crear mi viaje perfecto!</span>
            </span>
          )}
        </button>
      </div>
    </div>
  );

  // FUNCIÓN PRINCIPAL: renderTransportView MEJORADA CON TRANSPORTE INTELIGENTE
  const renderTransportView = () => {
    // Detectar si es viaje internacional
    const isInternational = isInternationalTrip(selectedOrigin, destination);
    const sortedAirlines = sortAirlinesByPreference(AIRLINES_DATABASE);
    
    return (
      <div className="transport-view space-y-8">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
            isInternational 
              ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
              : 'bg-gradient-to-br from-green-500 to-blue-600'
          }`}>
            {isInternational ? (
              <Plane className="w-10 h-10 text-white" />
            ) : (
              <Car className="w-10 h-10 text-white" />
            )}
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {isInternational ? '✈️ Opciones de Vuelo' : '🚗 ¿Cómo te moverás?'}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {isInternational 
              ? `Viaje internacional detectado: ${selectedOrigin?.country} → ${destination}. Selecciona tu aerolínea y clase preferida.`
              : 'Selecciona tu opción de transporte para completar tu experiencia de viaje'
            }
          </p>
        </div>

        {isInternational ? (
          // ===== NUEVA SECCIÓN: OPCIONES DE VUELO =====
          <div className="flight-options space-y-8">
            {/* Selector de Clase */}
            <div className="class-selector max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Selecciona tu clase de viaje</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { key: 'turista', name: 'Turista', icon: '💺', description: 'Cómodo y económico' },
                  { key: 'negocios', name: 'Negocios', icon: '💼', description: 'Comodidad premium' },
                  { key: 'primera', name: 'Primera Clase', icon: '👑', description: 'Lujo absoluto' }
                ].map(({ key, name, icon, description }) => (
                  <button
                    key={key}
                    onClick={() => setFlightSelection(prev => ({ ...prev, class: key as any }))}
                    className={`
                      p-6 border-2 rounded-xl text-center transition-all transform hover:scale-105
                      ${flightSelection.class === key 
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg' 
                        : 'border-gray-300 hover:border-gray-400 bg-white'
                      }
                    `}
                  >
                    <div className="text-4xl mb-3">{icon}</div>
                    <h4 className="font-bold text-lg mb-2">{name}</h4>
                    <p className="text-sm text-gray-600">{description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de Aerolíneas */}
            <div className="airlines-list max-w-6xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Aerolíneas disponibles
                {favoriteAirlineId && (
                  <span className="text-sm font-normal text-blue-600 block mt-2">
                    ⭐ Tu favorita aparece primero
                  </span>
                )}
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedAirlines.map((airline) => {
                  const estimatedCost = calculateFlightCost(airline, flightSelection.class, travelers);
                  const isFavorite = favoriteAirlineId === airline.id;
                  const isSelected = flightSelection.airline?.id === airline.id;
                  
                  return (
                    <div
                      key={airline.id}
                      className={`
                        airline-card relative p-6 border-2 rounded-2xl cursor-pointer transition-all hover:shadow-xl transform hover:-translate-y-2
                        ${isSelected 
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl' 
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                        }
                      `}
                      onClick={() => {
                        setFlightSelection(prev => ({
                          ...prev,
                          airline: airline,
                          estimatedCost: estimatedCost
                        }));
                      }}
                    >
                      {/* Badge de Favorita */}
                      {isFavorite && (
                        <div className="absolute -top-3 -right-3 bg-yellow-500 text-white rounded-full p-2">
                          <Star className="w-4 h-4 fill-current" />
                        </div>
                      )}

                      {/* Cabecera de Aerolínea */}
                      <div className="airline-header mb-4 text-center">
                        <div className="text-4xl mb-2">{airline.logo}</div>
                        <h4 className="font-bold text-lg text-gray-900">{airline.name}</h4>
                        <div className="flex items-center justify-center space-x-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(airline.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-2">{airline.rating}</span>
                        </div>
                      </div>

                      {/* Precio Dinámico */}
                      <div className="price-display mb-4 text-center">
                        <div className="text-3xl font-bold text-green-600">
                          ${estimatedCost.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {travelers} viajero(s) • Clase {flightSelection.class}
                        </div>
                      </div>

                      {/* Características */}
                      <div className="features mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Incluye:</p>
                        <div className="space-y-2">
                          {airline.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Botón de Favorita */}
                      <div className="actions flex items-center justify-between">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isFavorite) {
                              setFavoriteAirline('');
                              setFavoriteAirlineId(null);
                            } else {
                              setFavoriteAirline(airline.id);
                              setFavoriteAirlineId(airline.id);
                            }
                          }}
                          className={`
                            p-2 rounded-full transition-all
                            ${isFavorite 
                              ? 'bg-yellow-500 text-white' 
                              : 'bg-gray-200 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600'
                            }
                          `}
                        >
                          <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>
                        
                        {isSelected && (
                          <div className="flex items-center space-x-2 text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-bold text-sm">¡Seleccionada!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resumen de Selección de Vuelo */}
            {flightSelection.airline && (
              <div className="flight-summary max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border-2 border-blue-200">
                <h3 className="text-2xl font-bold text-blue-800 mb-4 text-center">
                  ✈️ Resumen de tu vuelo
                </h3>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-4xl mb-2">{flightSelection.airline.logo}</div>
                    <h4 className="font-bold text-lg">{flightSelection.airline.name}</h4>
                    <p className="text-sm text-gray-600">Aerolínea seleccionada</p>
                  </div>
                  <div>
                    <div className="text-4xl mb-2">
                      {flightSelection.class === 'turista' ? '💺' : flightSelection.class === 'negocios' ? '💼' : '👑'}
                    </div>
                    <h4 className="font-bold text-lg capitalize">{flightSelection.class}</h4>
                    <p className="text-sm text-gray-600">Clase de servicio</p>
                  </div>
                  <div>
                    <div className="text-4xl mb-2 text-green-600 font-bold">
                      ${flightSelection.estimatedCost.toLocaleString()}
                    </div>
                    <h4 className="font-bold text-lg">Costo estimado</h4>
                    <p className="text-sm text-gray-600">Para {travelers} viajero(s)</p>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-blue-700 bg-blue-100 inline-block px-4 py-2 rounded-full">
                    💡 El precio final puede variar según fechas y disponibilidad
                  </p>
                </div>
              </div>
            )}

            {/* NUEVA SECCIÓN: TRANSPORTE LOCAL EN DESTINO */}
            {flightSelection.airline && (
              <div className="local-transport-section space-y-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    🚗 Transporte en {destination}
                  </h3>
                  <p className="text-gray-600">
                    ¿Cómo te moverás una vez que llegues a tu destino?
                  </p>
                </div>

                {/* Modo Automático vs Manual */}
                <div className="mode-selector max-w-2xl mx-auto mb-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                    Elige tu modo de selección
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        handleAutoModeSelection();
                        setLocalTransportSelection(prev => ({ ...prev, mode: 'auto' }));
                      }}
                      className={`
                        p-6 border-2 rounded-xl text-center transition-all hover:shadow-lg
                        ${localTransportSelection.mode === 'auto'
                          ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-lg'
                          : 'border-gray-300 hover:border-purple-400'
                        }
                      `}
                    >
                      <div className="text-4xl mb-3">🤖</div>
                      <h5 className="font-bold text-lg mb-2">Manual</h5>
                      <p className="text-sm text-gray-600">
                        Tú eliges cada detalle del transporte
                      </p>
                    </button>
                  </div>
                </div>

                {/* Selección Manual de Tipo de Transporte */}
                {localTransportSelection.mode === 'manual' && (
                  <div className="manual-transport-selection space-y-6">
                    <div className="transport-type-selector max-w-2xl mx-auto">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                        Tipo de transporte en destino
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setLocalTransportSelection(prev => ({ 
                            ...prev, 
                            localTransportType: 'rental',
                            selectedRentalCar: null
                          }))}
                          className={`
                            p-6 border-2 rounded-xl text-center transition-all hover:shadow-lg
                            ${localTransportSelection.localTransportType === 'rental'
                              ? 'border-green-500 bg-green-50 text-green-700 shadow-lg'
                              : 'border-gray-300 hover:border-green-400'
                            }
                          `}
                        >
                          <div className="text-4xl mb-3">🚗</div>
                          <h5 className="font-bold text-lg mb-2">Rental Car</h5>
                          <p className="text-sm text-gray-600">
                            Alquila un vehículo en el destino
                          </p>
                        </button>

                        <button
                          onClick={() => setLocalTransportSelection(prev => ({ 
                            ...prev, 
                            localTransportType: 'public',
                            selectedRentalCar: null
                          }))}
                          className={`
                            p-6 border-2 rounded-xl text-center transition-all hover:shadow-lg
                            ${localTransportSelection.localTransportType === 'public'
                              ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-lg'
                              : 'border-gray-300 hover:border-orange-400'
                            }
                          `}
                        >
                          <div className="text-4xl mb-3">🚌</div>
                          <h5 className="font-bold text-lg mb-2">Transporte Público</h5>
                          <p className="text-sm text-gray-600">
                            Metro, buses y taxis locales
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* Selección Manual de Rental Cars */}
                    {localTransportSelection.localTransportType === 'rental' && (
                      <div className="rental-cars-selection max-w-6xl mx-auto">
                        <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">
                          Vehículos disponibles en {destination}
                        </h4>
                        
                        {/* Filtros por categoría */}
                        <div className="categories-filter mb-6 flex flex-wrap justify-center gap-2">
                          {['economico', 'compacto', 'intermedio', 'suv', 'lujo', 'premium'].map(category => (
                            <button
                              key={category}
                              className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-colors capitalize"
                              onClick={() => {
                                const firstCar = RENTAL_CARS_DATABASE.find(car => car.category === category);
                                if (firstCar) {
                                  setLocalTransportSelection(prev => ({ ...prev, selectedRentalCar: firstCar }));
                                }
                              }}
                            >
                              {category}
                            </button>
                          ))}
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {RENTAL_CARS_DATABASE.map((car) => {
                            const isSelected = localTransportSelection.selectedRentalCar?.id === car.id;
                            
                            return (
                              <div
                                key={car.id}
                                className={`
                                  rental-car-card p-6 border-2 rounded-2xl cursor-pointer transition-all hover:shadow-xl transform hover:-translate-y-1
                                  ${isSelected 
                                    ? 'border-green-500 bg-gradient-to-br from-green-50 to-blue-50 shadow-xl scale-105' 
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                  }
                                `}
                                onClick={() => setLocalTransportSelection(prev => ({ 
                                  ...prev, 
                                  selectedRentalCar: car 
                                }))}
                              >
                                {/* Badge de categoría */}
                                <div className={`
                                  inline-block px-3 py-1 rounded-full text-xs font-bold mb-4
                                  ${car.category === 'economico' ? 'bg-blue-100 text-blue-700' :
                                    car.category === 'compacto' ? 'bg-green-100 text-green-700' :
                                    car.category === 'intermedio' ? 'bg-yellow-100 text-yellow-700' :
                                    car.category === 'suv' ? 'bg-purple-100 text-purple-700' :
                                    car.category === 'lujo' ? 'bg-red-100 text-red-700' :
                                    'bg-gray-100 text-gray-700'
                                  }
                                `}>
                                  {car.category.toUpperCase()}
                                </div>

                                {/* Imagen del vehículo */}
                                <div className="car-image mb-4 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                                  <div className="text-4xl">🚗</div>
                                </div>

                                {/* Información del vehículo */}
                                <div className="car-info mb-4">
                                  <h5 className="font-bold text-lg text-gray-900 mb-1">{car.model}</h5>
                                  <p className="text-sm text-gray-600 mb-2">{car.company}</p>
                                  
                                  <div className="flex items-center space-x-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`w-4 h-4 ${i < Math.floor(car.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                                      />
                                    ))}
                                    <span className="text-sm text-gray-600 ml-2">{car.rating}</span>
                                  </div>

                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Precio/día:</span>
                                      <span className="font-bold text-green-600">${car.pricePerDay}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Pasajeros:</span>
                                      <span>{car.passengers}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Equipaje:</span>
                                      <span>{car.luggage} maletas</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Transmisión:</span>
                                      <span className="capitalize">{car.transmission}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Características */}
                                <div className="features mb-4">
                                  <p className="text-xs font-semibold text-gray-700 mb-2">Incluye:</p>
                                  <div className="space-y-1">
                                    {car.features.slice(0, 3).map((feature, index) => (
                                      <div key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                        <span>{feature}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {isSelected && (
                                  <div className="selected-indicator flex items-center justify-center space-x-2 text-green-600 bg-green-100 py-2 rounded-lg">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-bold text-sm">¡Seleccionado!</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Selección Manual de Transporte Público */}
                    {localTransportSelection.localTransportType === 'public' && (
                      <div className="public-transport-selection max-w-2xl mx-auto text-center">
                        <div className="p-8 bg-orange-50 border-2 border-orange-200 rounded-2xl">
                          <div className="text-6xl mb-4">🚌</div>
                          <h4 className="text-2xl font-bold text-orange-800 mb-4">
                            Transporte Público en {destination}
                          </h4>
                          <p className="text-orange-700 mb-6">
                            Usarás el sistema de transporte público local. Económico, ecológico y auténtico.
                          </p>
                          
                          <div className="bg-white p-6 rounded-lg border border-orange-200 space-y-4">
                            <h5 className="font-bold text-gray-800">Incluye:</h5>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-orange-500" />
                                <span>Pases de transporte</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-orange-500" />
                                <span>Mapas de rutas</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-orange-500" />
                                <span>Apps recomendadas</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-orange-500" />
                                <span>Guía de uso</span>
                              </div>
                            </div>
                            
                            <div className="text-center mt-4">
                              <div className="text-2xl font-bold text-green-600 mb-1">
                                ${localTransportSelection.publicTransportBudget}
                              </div>
                              <p className="text-sm text-gray-600">Presupuesto estimado total</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Resumen de Selección Automática */}
                {localTransportSelection.mode === 'auto' && (
                  <div className="auto-selection-summary max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border-2 border-purple-200">
                    <h4 className="text-2xl font-bold text-purple-800 mb-6 text-center">
                      🤖 Selección Automática Completada
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Resumen de vuelo */}
                      <div className="bg-white p-6 rounded-xl border border-purple-200">
                        <h5 className="font-bold text-lg text-purple-800 mb-4 flex items-center">
                          ✈️ Tu Vuelo
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Aerolínea:</span>
                            <span className="font-medium">{flightSelection.airline?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Clase:</span>
                            <span className="font-medium capitalize">{flightSelection.class}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Costo:</span>
                            <span className="font-bold text-green-600">${flightSelection.estimatedCost}</span>
                          </div>
                        </div>
                      </div>

                      {/* Resumen de transporte local */}
                      <div className="bg-white p-6 rounded-xl border border-purple-200">
                        <h5 className="font-bold text-lg text-purple-800 mb-4 flex items-center">
                          🚗 Transporte Local
                        </h5>
                        {localTransportSelection.localTransportType === 'rental' && localTransportSelection.selectedRentalCar ? (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Vehículo:</span>
                              <span className="font-medium">{localTransportSelection.selectedRentalCar.model}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Compañía:</span>
                              <span className="font-medium">{localTransportSelection.selectedRentalCar.company}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Precio/día:</span>
                              <span className="font-bold text-green-600">${localTransportSelection.selectedRentalCar.pricePerDay}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tipo:</span>
                              <span className="font-medium">Transporte Público</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Presupuesto:</span>
                              <span className="font-bold text-green-600">${localTransportSelection.publicTransportBudget}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-center mt-6">
                      <p className="text-sm text-purple-700 bg-purple-100 inline-block px-4 py-2 rounded-full">
                        🤖 Selección optimizada según tu presupuesto de ${budget} {currency}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // ===== SECCIÓN EXISTENTE: TRANSPORTE TERRESTRE MEJORADO =====
          <div className="ground-transport">
            {/* Pregunta principal expandida */}
            <div className="max-w-4xl mx-auto mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">¿Cómo prefieres moverte?</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => {
                    setTransportSelection(prev => ({ 
                      ...prev, 
                      hasVehicle: true, 
                      rentVehicle: false, 
                      selectedVehicle: null 
                    }));
                  }}
                  className={`
                    p-6 border-2 rounded-xl text-center transition-all hover:shadow-lg
                    ${transportSelection.hasVehicle === true 
                      ? 'border-green-500 bg-green-50 text-green-700 shadow-lg' 
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  <div className="text-4xl mb-3">
                    <Car className="w-12 h-12 mx-auto" />
                  </div>
                  <div className="font-semibold">Mi Vehículo</div>
                  <div className="text-sm text-gray-600 mt-1">Propio</div>
                </button>
                
                <button
                  onClick={() => {
                    setTransportSelection(prev => ({ 
                      ...prev, 
                      hasVehicle: false, 
                      rentVehicle: true,
                      selectedVehicle: null
                    }));
                  }}
                  className={`
                    p-6 border-2 rounded-xl text-center transition-all hover:shadow-lg
                    ${transportSelection.hasVehicle === false && transportSelection.rentVehicle === true
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg' 
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  <div className="text-4xl mb-3">
                    <Key className="w-12 h-12 mx-auto" />
                  </div>
                  <div className="font-semibold">Alquiler</div>
                  <div className="text-sm text-gray-600 mt-1">Rent a Car</div>
                </button>

                <button
                  onClick={() => {
                    setTransportSelection(prev => ({ 
                      ...prev, 
                      hasVehicle: false, 
                      rentVehicle: false,
                      selectedVehicle: null,
                      transportType: 'public'
                    }));
                  }}
                  className={`
                    p-6 border-2 rounded-xl text-center transition-all hover:shadow-lg
                    ${transportSelection.hasVehicle === false && transportSelection.rentVehicle === false && transportSelection.transportType === 'public'
                      ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-lg' 
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  <div className="text-4xl mb-3">
                    <div className="w-12 h-12 mx-auto bg-purple-600 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                      🚌
                    </div>
                  </div>
                  <div className="font-semibold">Público</div>
                  <div className="text-sm text-gray-600 mt-1">Bus, Metro, Tren</div>
                </button>

                <button
                  onClick={() => {
                    setTransportSelection(prev => ({ 
                      ...prev, 
                      hasVehicle: false, 
                      rentVehicle: false,
                      selectedVehicle: null,
                      transportType: 'taxi'
                    }));
                  }}
                  className={`
                    p-6 border-2 rounded-xl text-center transition-all hover:shadow-lg
                    ${transportSelection.hasVehicle === false && transportSelection.rentVehicle === false && transportSelection.transportType === 'taxi'
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700 shadow-lg' 
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  <div className="text-4xl mb-3">
                    <div className="w-12 h-12 mx-auto bg-yellow-500 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                      🚕
                    </div>
                  </div>
                  <div className="font-semibold">Taxi/Uber</div>
                  <div className="text-sm text-gray-600 mt-1">Ride-sharing</div>
                </button>
              </div>
            </div>

            {/* Confirmación de vehículo propio */}
            {transportSelection.hasVehicle === true && (
              <div className="max-w-2xl mx-auto text-center">
                <div className="p-8 bg-green-50 border-2 border-green-200 rounded-2xl">
                  <div className="text-6xl mb-4">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">¡Perfecto!</h3>
                  <p className="text-green-700">
                    Usarás tu vehículo propio para el viaje. Esto te dará total flexibilidad y reducirá los costos.
                  </p>
                </div>
              </div>
            )}

            {/* Opciones de alquiler */}
            {transportSelection.hasVehicle === false && transportSelection.rentVehicle && (
              <div className="max-w-6xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Vehículos disponibles</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  {vehicleOptions.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className={`
                        vehicle-card p-6 border-2 rounded-2xl cursor-pointer transition-all hover:shadow-xl transform hover:-translate-y-2
                        ${transportSelection.selectedVehicle?.id === vehicle.id 
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl' 
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                        }
                      `}
                      onClick={() => setTransportSelection(prev => ({ ...prev, selectedVehicle: vehicle }))}
                    >
                      <div className="vehicle-image mb-6 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                        <Car className="w-16 h-16 text-gray-400" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{vehicle.name}</h3>
                      <p className="text-gray-600 mb-4 capitalize">Vehículo tipo {vehicle.type}</p>
                      
                      <div className="space-y-3 text-sm mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Precio por día:</span>
                          <span className="font-bold text-lg text-green-600">${vehicle.pricePerDay}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pasajeros:</span>
                          <span className="font-medium">{vehicle.passengers} personas</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Equipaje:</span>
                          <span className="font-medium">{vehicle.luggage} maletas</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Combustible:</span>
                          <span className="font-medium capitalize">{vehicle.fuelType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transmisión:</span>
                          <span className="font-medium capitalize">{vehicle.transmission}</span>
                        </div>
                      </div>
                      
                      <div className="features">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Incluye:</p>
                        <div className="grid grid-cols-1 gap-2">
                          {vehicle.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {transportSelection.selectedVehicle?.id === vehicle.id && (
                        <div className="selected-indicator mt-6 flex items-center justify-center space-x-2 text-blue-600 bg-blue-100 py-3 rounded-xl">
                          <CheckCircle className="w-6 h-6" />
                          <span className="font-bold">¡Seleccionado!</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resumen de transporte público */}
            {transportSelection.hasVehicle === false && transportSelection.rentVehicle === false && transportSelection.transportType === 'public' && (
              <div className="max-w-2xl mx-auto text-center">
                <div className="p-8 bg-purple-50 border-2 border-purple-200 rounded-2xl">
                  <div className="text-6xl mb-4">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto">
                      🚌
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-purple-800 mb-2">¡Transporte Público!</h3>
                  <p className="text-purple-700 mb-4">
                    Usarás el sistema de transporte público. Económico y sostenible.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-purple-200 text-sm text-purple-700">
                    <strong>Incluye:</strong> Pases de metro/bus, mapas de rutas, aplicaciones recomendadas
                  </div>
                </div>
              </div>
            )}

            {/* Resumen de taxi/uber */}
            {transportSelection.hasVehicle === false && transportSelection.rentVehicle === false && transportSelection.transportType === 'taxi' && (
              <div className="max-w-2xl mx-auto text-center">
                <div className="p-8 bg-yellow-50 border-2 border-yellow-200 rounded-2xl">
                  <div className="text-6xl mb-4">
                    <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto">
                      🚕
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-yellow-800 mb-2">¡Taxi y Ride-sharing!</h3>
                  <p className="text-yellow-700 mb-4">
                    Máxima comodidad con Uber, Lyft y taxis locales. Flexibilidad total.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-yellow-200 text-sm text-yellow-700">
                    <strong>Incluye:</strong> Códigos de descuento, apps recomendadas, estimaciones de costo
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Debug Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            🔍 Detección: {isInternational ? 'Viaje Internacional' : 'Viaje Doméstico'} | 
            Origen: {selectedOrigin?.country} | 
            Destino: {destination}
          </p>
        </div>
      </div>
    );
  };

  const renderSelectionView = () => (
    <div className="selection-view space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4">
          <Award className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Tus planes personalizados
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Hemos creado 3 opciones únicas basadas en tus preferencias y presupuesto
        </p>
      </div>

      {generatedPlans.length === 0 ? (
        <div className="text-center py-16">
          <Search className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            No hay planes generados
          </h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Regresa a la planificación para generar tus planes de viaje personalizados
          </p>
          <button
            onClick={() => setCurrentView('planning')}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Ir a planificación
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {generatedPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={`
                plan-card relative p-8 border-2 rounded-2xl cursor-pointer transition-all hover:shadow-2xl transform hover:-translate-y-2
                ${selectedPlan?.id === plan.id 
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-2xl scale-105' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                }
              `}
              onClick={() => handleSelectPlan(plan)}
            >
              {/* Tier Badge */}
              <div className={`
                absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full text-sm font-bold text-white shadow-lg
                ${plan.tier === 'economico' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 
                  plan.tier === 'intermedio' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                  'bg-gradient-to-r from-purple-500 to-pink-600'
                }
              `}>
                {plan.tier === 'economico' ? 'Económico' : plan.tier === 'intermedio' ? 'Confort' : 'Premium'}
              </div>

              {/* Popular badge for middle plan */}
              {index === 1 && (
                <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Más popular
                </div>
              )}

              <div className="plan-header mt-4 mb-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {plan.description}
                </p>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {currency} {plan.totalCost.toLocaleString()}
                </div>
                <p className="text-sm text-gray-500">
                  {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} días increíbles
                </p>
              </div>

              {plan.savings && plan.savings > 0 && (
                <div className="savings-badge mb-6 text-center">
                  <span className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-semibold">
                    <Gift className="w-4 h-4" />
                    <span>Ahorro: {currency} {plan.savings.toLocaleString()}</span>
                  </span>
                </div>
              )}

              <div className="plan-features space-y-4">
                <div className="feature-item flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Alojamiento: {plan.accommodation.name}</span>
                </div>
                <div className="feature-item flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Actividades principales incluidas</span>
                </div>
                <div className="feature-item flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Soporte 24/7 durante el viaje</span>
                </div>
                {plan.tier !== 'economico' && (
                  <div className="feature-item flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Experiencias premium exclusivas</span>
                  </div>
                )}
                {plan.tier === 'premium' && (
                  <div className="feature-item flex items-center space-x-3">
                    <Crown className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    <span className="text-gray-700">Servicio de concierge personal</span>
                  </div>
                )}
              </div>

              {selectedPlan?.id === plan.id && (
                <div className="selected-indicator mt-6 flex items-center justify-center space-x-3 text-blue-600 bg-blue-100 py-4 rounded-xl">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-bold text-lg">¡Plan seleccionado!</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBuildingView = () => (
    <div className="building-view">
      <div className="header mb-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Construye tu itinerario
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Arrastra y organiza actividades para crear tu experiencia perfecta. ¡Sin límites de actividades por día!
          </p>
        </div>

        {/* Budget & Plan Info */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Budget Tracker */}
          <div className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
            <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center space-x-2">
              <DollarSign className="w-6 h-6" />
              <span>Control de Presupuesto</span>
            </h3>
            <div className="flex items-center space-x-4 mb-4">
              <span className={`text-3xl font-bold ${totalBudgetUsed > budget ? 'text-red-600' : 'text-green-600'}`}>
                ${totalBudgetUsed.toLocaleString()}
              </span>
              <span className="text-gray-500 text-lg">/ ${budget.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div 
                className={`h-4 rounded-full transition-all ${
                  totalBudgetUsed > budget ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                  totalBudgetUsed > budget * 0.8 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 
                  'bg-gradient-to-r from-green-500 to-emerald-500'
                }`}
                style={{ width: `${Math.min((totalBudgetUsed / budget) * 100, 100)}%` }}
              />
            </div>
            <p className="text-sm text-green-700">
              Incluye plan base + transporte + actividades adicionales
            </p>
          </div>

          {/* Selected Plan Info */}
          {selectedPlan && (
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-blue-200">
              <h3 className="text-lg font-bold text-blue-800 mb-2">{selectedPlan.name}</h3>
              <p className="text-blue-700 mb-4">{selectedPlan.description}</p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {currency} {selectedPlan.totalCost.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-600">
                    Plan base • {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} días
                  </div>
                </div>
                <div className={`
                  px-4 py-2 rounded-full text-sm font-bold
                  ${selectedPlan.tier === 'economico' ? 'bg-green-100 text-green-700' : 
                    selectedPlan.tier === 'intermedio' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }
                `}>
                  {selectedPlan.tier === 'economico' ? 'Económico' : 
                   selectedPlan.tier === 'intermedio' ? 'Confort' : 'Premium'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners} 
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
      >
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Available Activities Sidebar */}
          <div className="available-activities bg-white p-6 rounded-2xl shadow-xl border lg:col-span-1">
            <h3 className="font-bold mb-4 text-2xl flex items-center space-x-3">
              <Gift className="w-7 h-7 text-blue-600" />
              <span>Actividades</span>
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Arrastra las actividades a los días de tu preferencia. ¡Puedes agregar tantas como quieras!
            </p>
            
            <div className="max-h-[70vh] overflow-y-auto space-y-4 custom-scrollbar">
              {availableActivities.map(activity => (
                <EnhancedSortableActivity 
                  key={activity.id} 
                  activity={activity}
                />
              ))}
              
              {availableActivities.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Plus className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-sm">No hay actividades disponibles</p>
                  <p className="text-xs mt-2">Selecciona un plan primero</p>
                </div>
              )}
            </div>
          </div>

          {/* Days Grid */}
          <div className="itinerary-builder lg:col-span-3">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {dayPlans.map(day => (
                <DroppableDay key={day.id} day={day} />
              ))}
              
              {dayPlans.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <Calendar className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-700 mb-4">No hay días planificados</h3>
                  <p className="text-gray-500 mb-6">Regresa a la selección para elegir un plan</p>
                  <button
                    onClick={() => setCurrentView('selection')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Seleccionar Plan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeId ? (() => {
            const activity = availableActivities.find(a => a.id === activeId) || 
                           dayPlans.flatMap(d => d.activities).find(a => a.id === activeId);
            return activity ? (
              <EnhancedSortableActivity activity={activity as EnhancedActivity} isDragOverlay />
            ) : null;
          })() : null}
        </DragOverlay>
      </DndContext>
    </div>
  );

  const renderSummaryView = () => {
    const totalDuration = dayPlans.reduce((sum, day) => sum + day.totalDuration, 0);
    const totalActivities = dayPlans.reduce((sum, day) => sum + day.activities.length, 0);
    
    return (
      <div className="summary-view space-y-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ¡Tu viaje está listo!
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tu itinerario personalizado ha sido creado con amor y está listo para vivir
          </p>
        </div>

        {/* Trip Overview */}
        <div className="trip-overview bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border-2 border-blue-200">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="stat-card">
              <div className="text-4xl font-bold text-blue-600 mb-2">{dayPlans.length}</div>
              <div className="text-sm text-blue-700 font-medium">Días Increíbles</div>
            </div>
            <div className="stat-card">
              <div className="text-4xl font-bold text-green-600 mb-2">{totalActivities}</div>
              <div className="text-sm text-green-700 font-medium">Experiencias Únicas</div>
            </div>
            <div className="stat-card">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
              </div>
              <div className="text-sm text-purple-700 font-medium">De Diversión Total</div>
            </div>
            <div className="stat-card">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                ${totalBudgetUsed.toLocaleString()}
              </div>
              <div className="text-sm text-orange-700 font-medium">Inversión en Felicidad</div>
            </div>
          </div>
        </div>

        {/* Detailed Itinerary */}
        <div className="detailed-itinerary space-y-6">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Tu Itinerario Detallado</h3>
          
          {dayPlans.map((day, index) => (
            <div key={day.id} className="day-summary bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-lg">
              <div className="day-header flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-1">
                    Día {index + 1}
                  </h4>
                  <p className="text-lg text-gray-600 capitalize">
                    {new Date(day.date + 'T00:00:00').toLocaleDateString('es-ES', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">{day.activities.length} actividades</div>
                  <div className="text-2xl font-bold text-green-600">${day.totalCost}</div>
                </div>
              </div>
              
              <div className="activities-timeline space-y-4">
                {day.activities
                  .sort((a, b) => {
                    if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
                    if (a.startTime && !b.startTime) return -1;
                    if (!a.startTime && b.startTime) return 1;
                    return 0;
                  })
                  .map((activity, actIndex) => (
                    <div key={activity.id} className="activity-timeline-item flex items-start space-x-6 p-4 bg-gray-50 rounded-xl">
                      <div className="timeline-marker flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {activity.startTime || `${actIndex + 1}`}
                        </span>
                      </div>
                      <div className="activity-content flex-1">
                        <h5 className="font-bold text-lg text-gray-900 mb-2">{activity.title}</h5>
                        <p className="text-gray-600 mb-3">{activity.description}</p>
                        <div className="flex items-center space-x-6 text-sm">
                          <span className="flex items-center space-x-1 text-blue-600">
                            <Clock className="w-4 h-4" />
                            <span>{activity.duration} min</span>
                          </span>
                          <span className="flex items-center space-x-1 text-green-600">
                            <DollarSign className="w-4 h-4" />
                            <span>${activity.cost}</span>
                          </span>
                          <span className="flex items-center space-x-1 text-yellow-600">
                            <Star className="w-4 h-4" />
                            <span>{activity.rating}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                
                {day.activities.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-lg">Día libre para relajarte</p>
                    <p className="text-sm">No hay actividades planificadas</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons - PASO 1 NUEVOS */}
        <div className="action-buttons flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8">
          <button
            onClick={() => setCurrentView('building')}
            className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 inline mr-2" />
            Editar itinerario
          </button>
          
          {/* BOTÓN GUARDAR VIAJE - NUEVO */}
          <button
            onClick={handleSaveTrip}
            disabled={isSaving || !selectedPlan}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSaving ? (
              <span className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Guardando...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <Save className="w-5 h-5" />
                <span>{tripSaved ? '¡Guardado!' : 'Guardar viaje'}</span>
              </span>
            )}
          </button>

          {/* BOTÓN PROCEDER AL PAGO - NUEVO */}
          <button
            onClick={handleProceedToPayment}
            disabled={isProcessingPayment || !selectedPlan}
            className="px-12 py-4 bg-gradient-to-r from-orange-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:from-orange-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isProcessingPayment ? (
              <span className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Procesando...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-3">
                <CreditCard className="w-6 h-6" />
                <span>Proceder al pago</span>
              </span>
            )}
          </button>
        </div>
      </div>
    );
  };

  // --- RENDERIZADO PRINCIPAL ---
  return (
    <div className="trip-generator-enhanced min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Progress Bar Mejorada */}
      <div className="progress-bar bg-white shadow-lg border-b-2 border-blue-100">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between">
            {progressSteps.map((step, index) => (
              <div 
                key={step}
                className={`flex items-center ${index < progressSteps.length - 1 ? 'flex-1' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <div className={`
                    flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm transition-all
                    ${index <= currentStepIndex 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                    }
                  `}>
                    {index < currentStepIndex ? (
                      <CheckCircle className="w-7 h-7" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className={`mt-2 font-semibold text-sm text-center ${
                    index <= currentStepIndex ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step}
                  </span>
                </div>
                {index < progressSteps.length - 1 && (
                  <div className={`flex-1 h-2 mx-6 rounded-full transition-all ${
                    index < currentStepIndex 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content max-w-7xl mx-auto p-6">
        <div className="vista-contenido">
          {currentView === 'planning' && renderPlanningView()}
          {currentView === 'transport' && renderTransportView()}
          {currentView === 'selection' && renderSelectionView()}
          {currentView === 'building' && renderBuildingView()}
          {currentView === 'summary' && renderSummaryView()}
        </div>

        {/* Navigation Mejorada */}
        <div className="navigation flex justify-between items-center mt-12 pt-8 border-t-2 border-gray-200">
          <button
            onClick={handleBack}
            className="flex items-center space-x-3 px-8 py-4 text-gray-600 hover:text-gray-800 bg-white border-2 border-gray-300 rounded-xl hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Atrás</span>
          </button>
          
          <button
            onClick={handleNext}
            disabled={
              (currentView === 'selection' && !selectedPlan) || 
              (currentView === 'transport' && transportSelection.hasVehicle === null && !isInternationalTrip(selectedOrigin, destination)) ||
              (currentView === 'transport' && isInternationalTrip(selectedOrigin, destination) && 
                (!flightSelection.airline || !localTransportSelection.mode || 
                 (localTransportSelection.mode === 'manual' && !localTransportSelection.localTransportType) ||
                 (localTransportSelection.mode === 'manual' && localTransportSelection.localTransportType === 'rental' && !localTransportSelection.selectedRentalCar)
                )
              ) ||
              (currentView === 'planning' && !selectedOrigin)
            }
            className="flex items-center space-x-3 px-12 py-4 bg-gradient-to-r from-orange-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:from-orange-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span>
              {currentView === 'summary' ? '¡Finalizar!' : 'Siguiente'}
            </span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Toast Notifications Mejoradas */}
      <div className="toast-container fixed top-6 right-6 z-50 space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              toast p-4 rounded-xl shadow-2xl text-white min-w-[320px] max-w-md transform transition-all duration-300 animate-slide-in border-l-4
              ${toast.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-300' : 
                toast.type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600 border-red-300' : 
                'bg-gradient-to-r from-yellow-500 to-orange-500 border-yellow-300'}
            `}
          >
            <div className="flex items-center space-x-3">
              {toast.type === 'success' && <CheckCircle className="w-6 h-6 flex-shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-6 h-6 flex-shrink-0" />}
              {toast.type === 'warning' && <AlertCircle className="w-6 h-6 flex-shrink-0" />}
              <span className="font-medium">{toast.message}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showOriginModal && (
        <OriginModal
          isOpen={showOriginModal}
          onClose={() => setShowOriginModal(false)}
          onConfirm={(origin) => {
            console.log('Origen confirmado desde modal:', origin);
            setSelectedOrigin(origin);
            setShowOriginModal(false);
            showToast(`Origen seleccionado: ${origin.city}`, 'success');
            
            // Si todos los campos están completos, generar automáticamente
            if (destination && startDate && endDate && travelers && budget) {
              console.log('Todos los campos completos - generando planes automáticamente');
              setTimeout(() => handleGeneratePlans(), 500);
            }
          }}
          isRequired={true}
        />
      )}
      
      {showMapModal && (
        <FreeMapModal
          isOpen={showMapModal}
          onClose={() => setShowMapModal(false)}
          onLocationSelect={(name, coords) => {
            setDestination(name);
            setShowMapModal(false);
            showToast(`Destino seleccionado: ${name}`, 'success');
          }}
        />
      )}

      {/* Custom Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .scale-102 {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default TripWaseGenerator;