import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import useAsync from '../hooks/useAsync';
import useDebounce from '../hooks/useDebounce';

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  averagePrice: number;
  currency: string;
  popularityScore: number;
  weatherInfo: {
    averageTemp: number;
    bestMonths: string[];
    climate: string;
  };
}

export interface Trip {
  id: string;
  name: string;
  destination: Destination;
  dates: { startDate: string; endDate: string; };
  travelers: { adults: number; children: number; };
  budget: { total: number; spent: number; currency: string; };
  status: 'planning' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  budget: { min: number; max: number; currency: string; };
  dates: { startDate: string | null; endDate: string | null; };
  travelers: { adults: number; children: number; };
}

export interface TripContextType {
  searchQuery: string;
  searchResults: Destination[];
  isSearching: boolean;
  currentTrip: Trip | null;
  trips: Trip[];
  favorites: Destination[];
  searchHistory: string[];
  searchFilters: SearchFilters;
  error: string | null;
  searchDestinations: (query: string) => void;
  updateSearchFilters: (filters: Partial<SearchFilters>) => void;
  startTripPlanning: (destination: Destination) => void;
  updateTripDetails: (updates: Partial<Trip>) => void;
  editTrip: (trip: Trip) => void;
  saveTrip: () => void;
  deleteTrip: (tripId: string) => void;
  addToFavorites: (destination: Destination) => void;
  removeFromFavorites: (destinationId: string) => void;
  isFavorite: (destinationId: string) => boolean;
  getTripDuration: () => number;
  clearError: () => void;
}

const initialSearchFilters: SearchFilters = {
  budget: { min: 0, max: 5000, currency: 'EUR' },
  dates: { startDate: null, endDate: null },
  travelers: { adults: 2, children: 0 }
};

// DATOS ESTÁTICOS FUERA DEL COMPONENTE
const MOCK_DESTINATIONS: Destination[] = [
  {
    id: 'madrid', name: 'Madrid', country: 'España',
    description: 'Capital vibrante con rica historia.',
    averagePrice: 85, currency: 'EUR', popularityScore: 9.2,
    weatherInfo: { averageTemp: 18, bestMonths: ['Mayo', 'Junio'], climate: 'Continental' }
  },
  {
    id: 'barcelona', name: 'Barcelona', country: 'España',
    description: 'Ciudad cosmopolita con arquitectura única.',
    averagePrice: 92, currency: 'EUR', popularityScore: 9.5,
    weatherInfo: { averageTemp: 20, bestMonths: ['Abril', 'Mayo'], climate: 'Mediterráneo' }
  },
  {
    id: 'paris', name: 'París', country: 'Francia',
    description: 'Ciudad del amor con monumentos icónicos.',
    averagePrice: 125, currency: 'EUR', popularityScore: 9.8,
    weatherInfo: { averageTemp: 16, bestMonths: ['Mayo', 'Junio'], climate: 'Oceánico' }
  },
  {
    id: 'rome', name: 'Roma', country: 'Italia',
    description: 'Ciudad eterna con historia milenaria.',
    averagePrice: 95, currency: 'EUR', popularityScore: 9.4,
    weatherInfo: { averageTemp: 19, bestMonths: ['Abril', 'Mayo'], climate: 'Mediterráneo' }
  },
  {
    id: 'london', name: 'Londres', country: 'Reino Unido',
    description: 'Metrópoli multicultural con tradición.',
    averagePrice: 140, currency: 'EUR', popularityScore: 9.1,
    weatherInfo: { averageTemp: 12, bestMonths: ['Junio', 'Julio'], climate: 'Oceánico' }
  }
];

const TripContext = createContext<TripContextType | null>(null);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Destination[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(initialSearchFilters);
  
  const [trips, setTrips] = useLocalStorage<Trip[]>('tripwase_trips', []);
  const [favorites, setFavorites] = useLocalStorage<Destination[]>('tripwase_favorites', []);
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>('tripwase_search_history', []);
  
  const debouncedQuery = useDebounce(searchQuery, 500);

  // API FUNCTION FUERA DEL COMPONENTE - NO SE RE-CREA
  const searchDestinationsApi = useMemo(() => {
    return async (query: string): Promise<Destination[]> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!query || query.trim().length === 0) return [];
      
      return MOCK_DESTINATIONS.filter(d => 
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.country.toLowerCase().includes(query.toLowerCase()) ||
        d.description.toLowerCase().includes(query.toLowerCase())
      );
    };
  }, []); // Sin dependencias - función estable

  const searchAsync = useAsync(searchDestinationsApi);

  // USEEFFECT SIMPLIFICADO - SIN DEPENDENCIAS PROBLEMÁTICAS
  useEffect(() => {
    let isCancelled = false;

    if (debouncedQuery && debouncedQuery.trim().length > 0) {
      setIsSearching(true);
      setError(null);
      
      // EJECUTAR BÚSQUEDA
      searchDestinationsApi(debouncedQuery)
        .then(results => {
          if (!isCancelled) {
            setSearchResults(results);
            
            // ACTUALIZAR HISTORIAL DE FORMA SEGURA
            setSearchHistory(prev => {
              const filtered = prev.filter(h => h !== debouncedQuery);
              return [debouncedQuery, ...filtered].slice(0, 10);
            });
          }
        })
        .catch(err => {
          if (!isCancelled) {
            console.error('Error en búsqueda:', err);
            setError(err.message || 'Error en búsqueda');
            setSearchResults([]);
          }
        })
        .finally(() => {
          if (!isCancelled) {
            setIsSearching(false);
          }
        });
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, setSearchHistory]); // SOLO ESTAS DEPENDENCIAS

  // FUNCIONES MEMOIZADAS CORRECTAMENTE
  const updateSearchFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setSearchFilters(prev => {
      const updated = { ...prev };
      
      if (newFilters.budget) {
        updated.budget = { ...prev.budget, ...newFilters.budget };
      }
      if (newFilters.dates) {
        updated.dates = { ...prev.dates, ...newFilters.dates };
      }
      if (newFilters.travelers) {
        updated.travelers = { ...prev.travelers, ...newFilters.travelers };
      }
      
      return updated;
    });
  }, []);

  const startTripPlanning = useCallback((destination: Destination) => {
    const newTrip: Trip = {
      id: 'trip_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: `Viaje a ${destination.name}`,
      destination,
      dates: { 
        startDate: searchFilters.dates.startDate || '', 
        endDate: searchFilters.dates.endDate || '' 
      },
      travelers: { ...searchFilters.travelers },
      budget: { 
        total: searchFilters.budget.max, 
        spent: 0, 
        currency: searchFilters.budget.currency 
      },
      status: 'planning',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCurrentTrip(newTrip);
  }, [searchFilters]);

  const updateTripDetails = useCallback((updates: Partial<Trip>) => {
    setCurrentTrip(prev => {
      if (!prev) return null;
      return { 
        ...prev, 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
    });
  }, []);

  const editTrip = useCallback((trip: Trip) => {
    setCurrentTrip(trip);
  }, []);

  const saveTrip = useCallback(() => {
    if (!currentTrip) return;
    
    setTrips(prev => {
      const filtered = prev.filter(t => t.id !== currentTrip.id);
      return [...filtered, currentTrip];
    });
    setCurrentTrip(null);
  }, [currentTrip, setTrips]);

  const deleteTrip = useCallback((tripId: string) => {
    setTrips(prev => prev.filter(t => t.id !== tripId));
    if (currentTrip?.id === tripId) {
      setCurrentTrip(null);
    }
  }, [setTrips, currentTrip]);

  const addToFavorites = useCallback((destination: Destination) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === destination.id)) {
        return prev;
      }
      return [...prev, destination];
    });
  }, [setFavorites]);

  const removeFromFavorites = useCallback((destinationId: string) => {
    setFavorites(prev => prev.filter(f => f.id !== destinationId));
  }, [setFavorites]);

  const isFavorite = useCallback((destinationId: string) => {
    return favorites.some(f => f.id === destinationId);
  }, [favorites]);

  const getTripDuration = useCallback(() => {
    if (!currentTrip?.dates.startDate || !currentTrip?.dates.endDate) {
      return 0;
    }
    
    const start = new Date(currentTrip.dates.startDate);
    const end = new Date(currentTrip.dates.endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  }, [currentTrip]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const searchDestinations = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // MEMOIZAR EL VALUE PARA EVITAR RE-RENDERS
  const value = useMemo((): TripContextType => ({
    searchQuery,
    searchResults,
    isSearching,
    currentTrip,
    trips,
    favorites,
    searchHistory,
    searchFilters,
    error,
    searchDestinations,
    updateSearchFilters,
    startTripPlanning,
    updateTripDetails,
    editTrip,
    saveTrip,
    deleteTrip,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getTripDuration,
    clearError
  }), [
    searchQuery,
    searchResults,
    isSearching,
    currentTrip,
    trips,
    favorites,
    searchHistory,
    searchFilters,
    error,
    searchDestinations,
    updateSearchFilters,
    startTripPlanning,
    updateTripDetails,
    editTrip,
    saveTrip,
    deleteTrip,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getTripDuration,
    clearError
  ]);

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within TripProvider');
  }
  return context;
};
