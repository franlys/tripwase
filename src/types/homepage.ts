// src/types/homepage.ts

export interface Location {
  city: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Price {
  amount: number;
  currency: 'USD' | 'EUR' | 'DOP';
  period?: 'night' | 'person' | 'total';
}

export interface Hotel {
  id: string;
  name: string;
  location: Location;
  price: Price;
  images: string[];
  amenities: string[];
  description: string;
  rating: number;
  reviews: number;
  highlights: string[];
  availability: boolean;
  stars?: number;
  isFavorite?: boolean;
}

export interface Cruise {
  id: string;
  name: string;
  cruiseLine: string;
  departurePort: string; // Puerto de salida
  destinations: string[]; // Destinos del crucero
  duration: number; // Duración en días
  price: Price;
  images: string[];
  amenities: string[];
  description: string;
  highlights: string[];
  rating: number;
  reviews: number;
  shipName: string;
  capacity: number;
  quickPlanAvailable: boolean;
  isFavorite?: boolean;
  // Añadimos location para compatibilidad con recommendation engine
  location?: Location; // Opcional, basado en departurePort
}

export interface TouristAttraction {
  id: string;
  name: string;
  location: Location;
  category: string;
  entryFee: Price;
  images: string[];
  description: string;
  highlights: string[];
  rating: number;
  reviews: number;
  openingHours: string;
  timeNeeded: string;
  accessibility: boolean;
  isFavorite?: boolean;
}

export interface Event {
  id: string;
  name: string;
  type: 'concert' | 'festival' | 'cultural' | 'sports' | 'gastronomy' | 'exhibition';
  artist?: string;
  location: Location;
  venue: string;
  dates: {
    start: Date;
    end: Date;
  };
  price: {
    min: Price;
    max: Price;
  };
  images: string[];
  description: string;
  highlights: string[];
  ticketsAvailable: boolean;
  capacity: number;
  rating: number;
  reviews: number;
  quickPlanAvailable: boolean;
  isFavorite?: boolean;
}

export interface FlightOffer {
  id: string;
  destination: Location;
  origin: Location;
  price: Price;
  airline: string;
  duration: string;
  stops: number;
  departure: string;
  arrival: string;
  image: string;
  dealType?: 'flash' | 'popular' | 'best-value';
  validUntil: string;
  isFavorite?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  location: Location;
  cuisine: string[];
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  images: string[];
  description: string;
  specialties: string[];
  rating: number;
  reviews: number;
  openHours: string;
  reservationRequired: boolean;
  michelin?: boolean;
  isFavorite?: boolean;
}

export interface CategoryData {
  hotels: Hotel[];
  cruises: Cruise[];
  attractions: TouristAttraction[];
  events: Event[];
  flights: FlightOffer[];
  restaurants: Restaurant[];
}

// Tipos para el sistema de favoritos
export interface FavoritesState {
  hotels: Hotel[];
  cruises: Cruise[];
  attractions: TouristAttraction[];
  events: Event[];
  flights: FlightOffer[];
  restaurants: Restaurant[];
  totalCount: number;
  lastUpdated: Date;
}

// Tipos para búsqueda y filtros
export interface SearchFilters {
  location?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  amenities?: string[];
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Tipos para resultados de búsqueda
export interface SearchResult<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  filters: SearchFilters;
}

// No necesitamos export default para tipos/interfaces
// Las interfaces se exportan individualmente con 'export interface'