// src/types/location.ts
import { Coordinates } from './country';

export interface TouristAttraction {
  name: string;
  type: string;
  description: string;
  timeNeeded: string;
  distance: string;
  highlights: string[];
  coordinates: Coordinates;
}

export interface TouristRegion {
  region: string;
  attractions: TouristAttraction[];
}

export interface TouristAttractions {
  [countryCode: string]: {
    [regionKey: string]: TouristRegion;
  };
}

export interface SelectedLocation {
  name: string;
  coordinates: Coordinates;
}

export interface TouristRoute {
  region: string;
  totalAttractions: number;
  estimatedDays: number;
  travelMode: string;
  isDomestic: boolean;
  itinerary: DayRoute[];
  highlights: string[];
  bestRoutes: OptimalRoute;
}

export interface DayRoute {
  day: number;
  title: string;
  attractions: TouristAttraction[];
  estimatedTime: number;
  travelTips: string[];
}

export interface OptimalRoute {
  type: 'flight_based' | 'road_trip';
  description: string;
  totalDistance?: string;
  routes: RouteStop[];
}

export interface RouteStop {
  stop: number;
  name: string;
  estimatedDriveTime: string;
  coordinates?: Coordinates;
}
