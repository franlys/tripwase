// src/types/trip.ts
import { Coordinates, CountryCode } from './country';
import { SelectedLocation, TouristRoute, TouristAttraction } from './location';

export interface TripFormData {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency: 'USD' | 'EUR' | 'DOP' | 'GBP';
  travelMode: 'auto' | 'flight' | 'road';
}

export interface OriginData {
  country: string;
  countryCode: CountryCode;
  city: string;
}

export interface TripPlan {
  id: number;
  name: string;
  description: string;
  color: string;
  percentage: number;
  budget: {
    USD: number;
    DOP: number;
    [key: string]: number;
  };
  location?: SelectedLocation;
  isDomesticTrip: boolean;
  needsFlights: boolean;
  originCountry: CountryCode;
  destinationCountry: CountryCode;
  details: TripPlanDetails;
}

export interface TripPlanDetails {
  flight: FlightDetails;
  hotel: HotelDetails;
  food: FoodDetails;
  activities: ActivitiesDetails;
  transport: TransportDetails;
}

export interface FlightDetails {
  price: number;
  airline: string;
  class: string;
}

export interface HotelDetails {
  price: number;
  name: string;
  stars: number;
}

export interface FoodDetails {
  price: number;
  type: string;
}

export interface ActivitiesDetails {
  price: number;
  list: string[];
}

export interface TransportDetails {
  price: number;
  type: string;
}

export interface DetailedItinerary {
  day: number;
  title: string;
  type: 'arrival' | 'departure' | 'exploration';
  activities: string[];
  attractions?: TouristAttraction[];
  tips: string[];
}
