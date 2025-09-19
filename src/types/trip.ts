// src/types/trip.ts - INTERFACES UNIFICADAS PARA RESOLVER TODOS LOS ERRORES

// ===================================================================
// TIPOS BÁSICOS
// ===================================================================

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Destination {
  id?: string;
  name: string;
  country: string;
  description?: string;
  averagePrice?: number;
  popularityScore?: number;
  coordinates?: Coordinates;
  imageUrl?: string;
  categories?: string[];
  weatherInfo?: {
    averageTemp: number;
    climate: string;
    bestMonths: string[];
  };
}

export interface Origin {
  city: string;
  country: string;
  flag: string;
  coordinates?: Coordinates;
}

export interface Travelers {
  adults: number;
  children: number;
}

export interface Budget {
  total: number;
  used: number;
  remaining?: number;
}

export interface Dates {
  startDate: string;
  endDate: string;
}

// ===================================================================
// ACTIVIDADES Y PLANES
// ===================================================================

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  cost: number;
  duration: number;
  location?: string;
  image?: string;
  rating?: number;
  startTime: string;
  endTime: string;
  scheduleType: 'fixed' | 'flexible' | 'all-day';
  isTimeFixed: boolean;
  isTimeEditable: boolean;
}

export interface EnhancedActivity extends Activity {
  isIncluded?: boolean;
  estimatedValue?: number;
  icon?: string;
  originalTime?: {
    startTime: string;
    endTime: string;
  };
}

export interface DayPlan {
  id: string;
  date: string;
  activities: EnhancedActivity[];
  totalCost: number;
  totalDuration: number;
}

export interface AccommodationDetails {
  name: string;
  stars: number;
  price: number;
  perNight: boolean;
  features: string[];
  type: 'Resort de Lujo' | 'Hotel Premium' | 'Hotel Estándar' | 'Hostal' | 'Casa de Huéspedes' | 'Apartamento';
  includedServices?: string[];
  resortFeatures?: {
    allInclusive: boolean;
    beachAccess: boolean;
    pools: number;
    restaurants: number;
    bars: number;
    spa: boolean;
    golf: boolean;
  };
  // ✅ PROPIEDADES FALTANTES AGREGADAS:
  location: string;
  pricePerNight: number;
}

export interface FlightDetails {
  departureAirport: string;
  arrivalAirport: string;
  price: number;
  duration: string;
  stops: number;
  airline: string;
}

export interface SimplePlan {
  id: string;
  tier: 'economico' | 'intermedio' | 'premium';
  name: string;
  description: string;
  totalCost: number;
  savings?: number;
  accommodation: AccommodationDetails;
  flights: FlightDetails;
  activities: string[];
  meals: string[];
  highlights: string[];
  included: string[];
  notIncluded: string[];
  recommended: boolean;
  // ✅ PROPIEDADES FALTANTES AGREGADAS:
  duration: number;
  currency: string;
  breakdown: {
    accommodation: number;
    transportation: number;
    food: number;
    activities: number;
    total: number;
  };
}

// ===================================================================
// TRANSPORTE
// ===================================================================

export interface VehicleOption {
  id: string;
  name: string;
  type: 'compact' | 'suv' | 'luxury' | 'van';
  pricePerDay: number;
  features: string[];
  passengers: number;
  luggage: number;
  fuelType: 'gasoline' | 'diesel' | 'hybrid';
  transmission: 'manual' | 'automatic';
  image?: string;
}

export interface TransportSelection {
  hasVehicle: boolean | null;
  rentVehicle: boolean;
  selectedVehicle: VehicleOption | null;
  fuelBudget: number;
}

// ===================================================================
// INTERFAZ TRIP UNIFICADA - RESUELVE TODOS LOS ERRORES
// ===================================================================

export interface Trip {
  id: string;
  userId: string;
  name: string;
  
  // Destino - SIEMPRE como objeto
  destination: Destination;
  
  // Origen - SIEMPRE como objeto
  origin: Origin;
  
  // Fechas
  startDate: string;
  endDate: string;
  duration: number;
  dates: Dates;
  
  // Viajeros - SIEMPRE como objeto
  travelers: Travelers;
  
  // Presupuesto - SIEMPRE como objeto
  budget: Budget;
  
  // Moneda e intereses
  currency: 'USD' | 'DOP';
  interests: string[];
  
  // Plan y actividades
  selectedPlan?: SimplePlan;
  plan?: SimplePlan;
  itinerary: DayPlan[];
  
  // Transporte
  transport: TransportSelection;
  
  // Estado y metadatos
  status: 'planning' | 'completed' | 'paid' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  
  // Campos calculados/opcionales
  totalCost?: number;
  notes?: string;
  isArchived?: boolean;
}

// ===================================================================
// OTROS TIPOS NECESARIOS
// ===================================================================

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ACTUALIZACIÓN PARA SearchFilters - src/types/trip.ts (líneas 115-125)

export interface SearchFilters {
  budget?: { 
    min: number; 
    max: number; 
    currency?: string; // ← Hacer currency opcional
  };
  duration?: { min: number; max: number };
  travelers?: Travelers;
  categories?: string[];
  region?: string;
  dates?: {
    startDate: string | null;
    endDate: string | null;
  };
}
export interface TripFilters {
  status?: string;
  destination?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  budget?: {
    min: number;
    max: number;
  };
  duration?: {
    min: number;
    max: number;
  };
}

export interface TripStats {
  total: number;
  byStatus: Record<string, number>;
  totalBudget: number;
  averageBudget: number;
  destinations: string[];
  upcomingTrips: number;
  completedTrips: number;
  completed: number; // Alias para compatibilidad
  destinationsCount: number;
  totalSavings: number;
}

// ===================================================================
// TIPOS ADICIONALES
// ===================================================================

export interface TripPlan {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: number;
  budget: number;
  travelers: number;
  days: DayPlan[];
}

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

export interface ActivityManagement {
  showTimeConflicts: boolean;
  allowOverlaps: boolean;
  autoSchedule: boolean;
  maxActivitiesPerDay?: number;
}

export interface TripFormData {
  destination: string;
  startDate: string;
  endDate: string;
  duration: number;
  travelers: number;
  budget: number;
  currency: 'USD' | 'DOP';
}

export type ViewMode = 'planning' | 'transport' | 'selection' | 'building' | 'summary';

// ===================================================================
// FUNCIONES AUXILIARES
// ===================================================================

export const createDefaultTrip = (): Partial<Trip> => ({
  travelers: { adults: 2, children: 0 },
  budget: { total: 1000, used: 0, remaining: 1000 },
  transport: { hasVehicle: null, rentVehicle: false, selectedVehicle: null, fuelBudget: 0 },
  itinerary: [],
  interests: [],
  status: 'planning',
  currency: 'USD'
});

export const createDefaultDestination = (name: string, country: string): Destination => ({
  name,
  country,
  description: '',
  averagePrice: 0,
  popularityScore: 0,
  categories: []
});

export const createDefaultOrigin = (city: string, country: string): Origin => ({
  city,
  country,
  flag: '🏠'
});

// ===================================================================
// TIPOS PARA COMPATIBILIDAD CON MULTIPLEPLANGENERATOR
// ===================================================================

export interface TripPlanOption {
  id: string;
  tier: 'economico' | 'intermedio' | 'premium';
  name: string;
  description: string;
  totalCost: number;
  savings?: number;
  accommodation: AccommodationDetails;
  flights: FlightDetails;
  activities: string[];
  meals: string[];
  highlights: string[];
  included: string[];
  notIncluded: string[];
  recommended: boolean;
  duration: number;
  currency: string;
  breakdown: {
    accommodation: number;
    transportation: number;
    food: number;
    activities: number;
    total: number;
  };
}

export interface PlanInput {
  destination: string;
  duration: number;
  travelers: number;
  budget: number;
  interests: string[];
  startDate: string;
  endDate: string;
}

// Re-exportar SimplePlan como TripPlanOption para compatibilidad
export type { SimplePlan as TripPlanOptionAlias };