// src/types/country.ts
export interface CountryData {
  name: string;
  hasInternalFlights: boolean;
  currency: 'USD' | 'EUR' | 'DOP' | 'GBP';
  keywords: string[];
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface TravelModeInfo {
  travelType: 'international' | 'domestic';
  required?: 'flight' | 'road';
  options?: boolean;
  message: string;
  modes: TravelMode[];
}

export interface TravelMode {
  id: 'flight' | 'road';
  name: string;
  icon: string;
  required?: boolean;
}

export type CountryCode = 'DO' | 'US' | 'CO' | 'MX' | 'ES' | 'FR' | 'IT' | 'GB' | 'NL' | 'PT';

export interface CountriesData {
  [key: string]: CountryData;
}
