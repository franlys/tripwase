// src/utils/locationDetector.ts
import { CountryCode, Coordinates } from '../types';
import { COUNTRIES_DATA } from '../data';

export const detectCountryFromLocation = (
  locationName: string, 
  coordinates?: Coordinates
): CountryCode => {
  const location = locationName.toLowerCase();
  
  for (const [countryCode, data] of Object.entries(COUNTRIES_DATA)) {
    if (data.keywords.some(keyword => location.includes(keyword))) {
      return countryCode as CountryCode;
    }
  }
  
  if (coordinates) {
    const { lat, lng } = coordinates;
    
    if (lat >= 17.5 && lat <= 19.9 && lng >= -71.9 && lng <= -68.3) {
      return 'DO';
    }
    if (lat >= -4.2 && lat <= 12.5 && lng >= -81.8 && lng <= -66.9) {
      return 'CO';
    }
    if (lat >= 36.0 && lat <= 43.8 && lng >= -9.3 && lng <= 3.3) {
      return 'ES';
    }
    if (lat >= 41.3 && lat <= 51.1 && lng >= -5.1 && lng <= 9.6) {
      return 'FR';
    }
    if (lat >= 35.5 && lat <= 47.1 && lng >= 6.6 && lng <= 18.5) {
      return 'IT';
    }
    if (lat >= 49.9 && lat <= 60.8 && lng >= -8.2 && lng <= 1.8) {
      return 'GB';
    }
    if (lat >= 50.8 && lat <= 53.6 && lng >= 3.4 && lng <= 7.2) {
      return 'NL';
    }
    if (lat >= 36.9 && lat <= 42.2 && lng >= -9.5 && lng <= -6.2) {
      return 'PT';
    }
  }
  
  return 'DO';
};

export const getCountryInfo = (countryCode: CountryCode) => {
  return COUNTRIES_DATA[countryCode];
};
