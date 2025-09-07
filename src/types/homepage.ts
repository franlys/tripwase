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
  currency: 'USD' | 'DOP' | 'EUR';
  amount: number;
  period?: 'night' | 'person' | 'total' | 'week';
}

export interface Hotel {
  id: string;
  name: string;
  location: Location;
  images: string[];
  stars: 1 | 2 | 3 | 4 | 5;
  price: Price;
  amenities: string[];
  description: string;
  rating: number;
  reviews: number;
  highlights: string[];
  availability: boolean;
  isFavorite?: boolean;
}

export interface Cruise {
  id: string;
  name: string;
  shipName: string;
  cruiseLine: string;
  route: Location[];
  duration: number;
  price: Price;
  images: string[];
  description: string;
  highlights: string[];
  inclusions: string[];
  departure: Date;
  capacity: number;
  rating: number;
  reviews: number;
  isFavorite?: boolean;
}

export interface TouristAttraction {
  id: string;
  name: string;
  type: 'monument' | 'museum' | 'nature' | 'adventure' | 'cultural' | 'religious' | 'historical';
  location: Location;
  images: string[];
  description: string;
  highlights: string[];
  bestTimeToVisit: string[];
  entryFee: Price;
  openingHours: string;
  rating: number;
  reviews: number;
  visitDuration: string;
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