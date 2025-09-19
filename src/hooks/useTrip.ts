// src/hooks/useTrip.ts - CORREGIDO

import { useContext } from 'react';
import { useTrip as useTripContext } from '../contexts/TripContext';

// Re-exportar el hook del contexto
export const useTrip = useTripContext;