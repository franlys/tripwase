// src/data/countries.ts
import { CountriesData } from '../types';

export const COUNTRIES_DATA: CountriesData = {
  'DO': {
    name: 'República Dominicana',
    hasInternalFlights: false,
    currency: 'DOP',
    keywords: ['dominican', 'dominicana', 'santo domingo', 'punta cana', 'samana', 'la romana', 'puerto plata', 'santiago']
  },
  'US': {
    name: 'Estados Unidos',
    hasInternalFlights: true,
    currency: 'USD',
    keywords: ['united states', 'usa', 'america', 'new york', 'miami', 'california', 'florida', 'texas']
  },
  'CO': {
    name: 'Colombia',
    hasInternalFlights: true,
    currency: 'USD',
    keywords: ['colombia', 'bogota', 'cartagena', 'medellin', 'cali', 'barranquilla']
  },
  'MX': {
    name: 'México',
    hasInternalFlights: true,
    currency: 'USD',
    keywords: ['mexico', 'cancun', 'ciudad de mexico', 'guadalajara', 'monterrey']
  },
  'ES': {
    name: 'España',
    hasInternalFlights: true,
    currency: 'EUR',
    keywords: ['spain', 'españa', 'madrid', 'barcelona', 'valencia', 'sevilla']
  },
  'FR': {
    name: 'Francia',
    hasInternalFlights: true,
    currency: 'EUR',
    keywords: ['france', 'francia', 'paris', 'lyon', 'marseille', 'nice']
  },
  'IT': {
    name: 'Italia',
    hasInternalFlights: true,
    currency: 'EUR',
    keywords: ['italy', 'italia', 'rome', 'roma', 'milan', 'venice', 'florence']
  },
  'GB': {
    name: 'Reino Unido',
    hasInternalFlights: true,
    currency: 'GBP',
    keywords: ['united kingdom', 'uk', 'london', 'manchester', 'birmingham', 'liverpool']
  },
  'NL': {
    name: 'Países Bajos',
    hasInternalFlights: true,
    currency: 'EUR',
    keywords: ['netherlands', 'holland', 'amsterdam', 'rotterdam', 'den haag']
  },
  'PT': {
    name: 'Portugal',
    hasInternalFlights: true,
    currency: 'EUR',
    keywords: ['portugal', 'lisbon', 'lisboa', 'porto', 'coimbra']
  }
};
