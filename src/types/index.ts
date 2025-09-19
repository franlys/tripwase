// CORRECCIÓN COMPLETA para src/types/index.ts - Agregar interfaces faltantes

export * from './country';
export * from './location';
export * from './auth';
export * from './favorites';

// Exportar tipos específicos de trip.ts, excluyendo Coordinates que ya existe en otros módulos
export type {
  Trip,
  Destination,
  Origin,
  Travelers,
  Budget,
  Dates,
  Activity,
  EnhancedActivity,
  DayPlan,
  AccommodationDetails,
  FlightDetails,
  SimplePlan,
  VehicleOption,
  TransportSelection,
  Notification,
  SearchFilters,
  TripFilters,
  TripStats,
  TripPlan,
  DefaultActivity,
  DefaultDayPlan,
  ActivityManagement,
  TripFormData,
  ViewMode,
  TripPlanOption,
  PlanInput
} from './trip';

// ✅ INTERFACES FALTANTES AGREGADAS:

// Interface para datos de origen (usada en TripWaseGenerator)
export interface OriginData {
  city: string;
  country: string;
  flag: string;
}

// ✅ CORRECCIÓN: Currency como string union type (no interface) para consistencia
export type Currency = 'USD' | 'DOP' | 'EUR' | 'GBP';

// Si necesitas usar Coordinates de trip.ts específicamente, puedes importarlo con alias:
// export { Coordinates as TripCoordinates } from './trip';