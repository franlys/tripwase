// src/utils/travelModeDetector.ts
import { CountryCode, TravelModeInfo } from '../types';
import { COUNTRIES_DATA } from '../data';

export const getAllowedModes = (
  originCountry: CountryCode, 
  destinationCountry: CountryCode
): TravelModeInfo => {
  const originData = COUNTRIES_DATA[originCountry];
  
  if (originCountry !== destinationCountry) {
    return {
      travelType: 'international',
      required: 'flight',
      message: 'Viaje internacional detectado: vuelo obligatorio.',
      modes: [{ 
        id: 'flight', 
        name: 'Vuelo internacional', 
        icon: '??', 
        required: true 
      }]
    };
  }
  
  if (!originData?.hasInternalFlights) {
    return {
      travelType: 'domestic',
      required: 'road',
      message: 'Viaje doméstico sin opción de vuelo: solo por carretera.',
      modes: [{ 
        id: 'road', 
        name: 'Solo carretera', 
        icon: '??', 
        required: true 
      }]
    };
  }
  
  return {
    travelType: 'domestic',
    options: true,
    message: 'Viaje doméstico: puedes elegir entre vuelo o carretera.',
    modes: [
      { id: 'flight', name: 'Vuelo doméstico', icon: '??' },
      { id: 'road', name: 'Por carretera', icon: '??' }
    ]
  };
};
