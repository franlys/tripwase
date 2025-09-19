// src/contexts/TripContext.tsx - VERSIÓN UNIFICADA QUE RESUELVE TODOS LOS ERRORES

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { 
  Trip, 
  Destination, 
  Origin, 
  Travelers, 
  Budget, 
  Notification, 
  SearchFilters, 
  TripFilters, 
  TripStats,
  SimplePlan,
  DayPlan,
  TransportSelection,
  createDefaultTrip,
  createDefaultDestination,
  createDefaultOrigin
} from '../types/trip';

// ===================================================================
// CONTEXT TYPE UNIFICADO
// ===================================================================

interface TripContextType {
  // Estados principales - USANDO TRIP UNIFICADO
  trips: Trip[];
  currentTrip: Trip | null;
  isLoading: boolean;
  error: string | null;
  
  // Búsqueda de destinos
  searchQuery: string;
  searchResults: Destination[];
  isSearching: boolean;
  searchHistory: string[];
  searchFilters: SearchFilters;
  
  // Favoritos
  favorites: Destination[];
  
  // Funciones de viajes
  saveTrip: (tripData: Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<Trip>;
  updateTrip: (tripId: string, updates: Partial<Trip>) => Promise<Trip>;
  deleteTrip: (tripId: string) => Promise<void>;
  getTripById: (tripId: string) => Trip | null;
  duplicateTrip: (tripId: string) => Promise<Trip>;
  archiveTrip: (tripId: string) => Promise<void>;
  
  // Funciones de búsqueda
  searchDestinations: (query: string) => Promise<void>;
  updateSearchFilters: (filters: SearchFilters) => void;
  
  // Funciones de favoritos
  addToFavorites: (destination: Destination) => void;
  removeFromFavorites: (destinationId: string) => void;
  isFavorite: (destinationId: string) => boolean;
  
  // Funciones de planificación
  startTripPlanning: (destination: Destination) => void;
  editTrip: (trip: Trip) => void; // Cambiado para recibir Trip completo
  updateTripDetails: (updates: Partial<Trip>) => void;
  
  // Funciones de filtros y búsqueda
  filteredTrips: Trip[];
  filters: TripFilters;
  setFilters: (filters: TripFilters) => void;
  searchTrips: (query: string) => Trip[];
  
  // Estadísticas
  stats: TripStats;
  getStatsByDateRange: (startDate: string, endDate: string) => TripStats;
  getTripsStats: () => TripStats;
  
  // Sistema de notificaciones
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  
  // Funciones auxiliares
  getTripDuration: (tripId?: string) => number; // Parámetro opcional
  clearError: () => void;
  exportTrips: () => string;
  importTrips: (data: string) => Promise<void>;
  clearAllData: () => void;
}

// ===================================================================
// CONTEXT CREATION
// ===================================================================

const TripContext = createContext<TripContextType | undefined>(undefined);

// ===================================================================
// DATOS MOCK
// ===================================================================

const mockDestinations: Destination[] = [
  {
    id: 'dest_1',
    name: 'París',
    country: 'Francia',
    description: 'La ciudad del amor y la luz, famosa por la Torre Eiffel y sus museos.',
    averagePrice: 150,
    popularityScore: 9,
    categories: ['cultura', 'gastronomía', 'romance'],
    imageUrl: '/images/paris.jpg',
    weatherInfo: {
      averageTemp: 15,
      climate: 'Templado oceánico',
      bestMonths: ['Mayo', 'Junio', 'Septiembre', 'Octubre']
    }
  },
  {
    id: 'dest_2',
    name: 'Tokyo',
    country: 'Japón',
    description: 'Moderna metrópoli que combina tradición y tecnología.',
    averagePrice: 120,
    popularityScore: 8,
    categories: ['cultura', 'tecnología', 'gastronomía'],
    imageUrl: '/images/tokyo.jpg',
    weatherInfo: {
      averageTemp: 16,
      climate: 'Subtropical húmedo',
      bestMonths: ['Marzo', 'Abril', 'Octubre', 'Noviembre']
    }
  },
  {
    id: 'dest_3',
    name: 'Cancún',
    country: 'México',
    description: 'Paraíso tropical con playas de arena blanca y aguas cristalinas.',
    averagePrice: 80,
    popularityScore: 8,
    categories: ['playa', 'relajación', 'aventura'],
    imageUrl: '/images/cancun.jpg',
    weatherInfo: {
      averageTemp: 27,
      climate: 'Tropical',
      bestMonths: ['Diciembre', 'Enero', 'Febrero', 'Marzo']
    }
  },
  {
    id: 'dest_4',
    name: 'Roma',
    country: 'Italia',
    description: 'Ciudad eterna llena de historia, arte y gastronomía excepcional.',
    averagePrice: 110,
    popularityScore: 9,
    categories: ['historia', 'cultura', 'gastronomía'],
    imageUrl: '/images/roma.jpg',
    weatherInfo: {
      averageTemp: 18,
      climate: 'Mediterráneo',
      bestMonths: ['Abril', 'Mayo', 'Septiembre', 'Octubre']
    }
  },
  {
    id: 'dest_5',
    name: 'Punta Cana',
    country: 'República Dominicana',
    description: 'Destino caribeño con resorts todo incluido y actividades acuáticas.',
    averagePrice: 90,
    popularityScore: 7,
    categories: ['playa', 'relajación', 'deportes'],
    imageUrl: '/images/punta-cana.jpg',
    weatherInfo: {
      averageTemp: 26,
      climate: 'Tropical',
      bestMonths: ['Diciembre', 'Enero', 'Febrero', 'Marzo', 'Abril']
    }
  }
];

// ===================================================================
// PROVIDER COMPONENT
// ===================================================================

interface TripProviderProps {
  children: ReactNode;
}

export const TripProvider: React.FC<TripProviderProps> = ({ children }) => {
  // Estados principales - SOLO TRIP UNIFICADO
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TripFilters>({});
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Estados para funcionalidades adicionales
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Destination[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [favorites, setFavorites] = useState<Destination[]>([]);

  // Cargar datos del localStorage
  useEffect(() => {
    try {
      const savedTrips = localStorage.getItem('tripwase_trips');
      const savedNotifications = localStorage.getItem('tripwase_notifications');
      const savedFavorites = localStorage.getItem('tripwase_favorites');
      const savedSearchHistory = localStorage.getItem('tripwase_search_history');
      
      if (savedTrips) {
        const parsedTrips = JSON.parse(savedTrips);
        setTrips(Array.isArray(parsedTrips) ? parsedTrips : []);
      }
      
      if (savedNotifications) {
        const parsedNotifications = JSON.parse(savedNotifications);
        setNotifications(Array.isArray(parsedNotifications) ? parsedNotifications : []);
      }
      
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : []);
      }
      
      if (savedSearchHistory) {
        const parsedHistory = JSON.parse(savedSearchHistory);
        setSearchHistory(Array.isArray(parsedHistory) ? parsedHistory : []);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      setTrips([]);
      setNotifications([]);
      setFavorites([]);
      setSearchHistory([]);
    }
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    if (trips.length >= 0) {
      localStorage.setItem('tripwase_trips', JSON.stringify(trips));
    }
  }, [trips]);

  useEffect(() => {
    if (notifications.length >= 0) {
      localStorage.setItem('tripwase_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  useEffect(() => {
    if (favorites.length >= 0) {
      localStorage.setItem('tripwase_favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  useEffect(() => {
    if (searchHistory.length >= 0) {
      localStorage.setItem('tripwase_search_history', JSON.stringify(searchHistory));
    }
  }, [searchHistory]);

  // ===================================================================
  // FUNCIONES AUXILIARES
  // ===================================================================

  const generateUniqueId = useCallback((): string => {
    return `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // ===================================================================
  // FUNCIONES DE VIAJES
  // ===================================================================

  const saveTrip = useCallback(async (tripData: Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Trip> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const now = new Date().toISOString();
      const newTrip: Trip = {
        ...tripData,
        id: generateUniqueId(),
        userId: 'demo_user',
        createdAt: now,
        updatedAt: now,
        totalCost: tripData.budget.total,
        budget: {
          ...tripData.budget,
          remaining: tripData.budget.total - tripData.budget.used
        }
      };

      setTrips(prev => [newTrip, ...prev]);
      setCurrentTrip(newTrip);
      
      addNotification({
        type: 'success',
        title: 'Viaje Guardado',
        message: `El viaje "${newTrip.name}" ha sido guardado exitosamente`,
        read: false
      });

      return newTrip;
    } catch (error) {
      const errorMessage = 'Error al guardar el viaje';
      setError(errorMessage);
      addNotification({
        type: 'error',
        title: 'Error',
        message: errorMessage,
        read: false
      });
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [generateUniqueId]);

  const updateTrip = useCallback(async (tripId: string, updates: Partial<Trip>): Promise<Trip> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const tripIndex = trips.findIndex(trip => trip.id === tripId);
      if (tripIndex === -1) {
        throw new Error('Viaje no encontrado');
      }

      const updatedTrip: Trip = {
        ...trips[tripIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      const newTrips = [...trips];
      newTrips[tripIndex] = updatedTrip;
      setTrips(newTrips);

      if (currentTrip?.id === tripId) {
        setCurrentTrip(updatedTrip);
      }

      addNotification({
        type: 'info',
        title: 'Viaje Actualizado',
        message: `El viaje "${updatedTrip.name}" ha sido actualizado`,
        read: false
      });

      return updatedTrip;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el viaje';
      setError(errorMessage);
      addNotification({
        type: 'error',
        title: 'Error',
        message: errorMessage,
        read: false
      });
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [trips, currentTrip]);

  const deleteTrip = useCallback(async (tripId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const tripToDelete = trips.find(trip => trip.id === tripId);
      if (!tripToDelete) {
        throw new Error('Viaje no encontrado');
      }

      setTrips(prev => prev.filter(trip => trip.id !== tripId));
      
      if (currentTrip?.id === tripId) {
        setCurrentTrip(null);
      }

      addNotification({
        type: 'warning',
        title: 'Viaje Eliminado',
        message: `El viaje "${tripToDelete.name}" ha sido eliminado`,
        read: false
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el viaje';
      setError(errorMessage);
      addNotification({
        type: 'error',
        title: 'Error',
        message: errorMessage,
        read: false
      });
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [trips, currentTrip]);

  const getTripById = useCallback((tripId: string): Trip | null => {
    return trips.find(trip => trip.id === tripId) || null;
  }, [trips]);

  const duplicateTrip = useCallback(async (tripId: string): Promise<Trip> => {
    const originalTrip = trips.find(trip => trip.id === tripId);
    if (!originalTrip) {
      throw new Error('Viaje no encontrado');
    }

    const duplicatedTrip = {
      ...originalTrip,
      name: `${originalTrip.name} (Copia)`,
      status: 'planning' as const
    };

    const { id, userId, createdAt, updatedAt, ...tripData } = duplicatedTrip;
    
    return await saveTrip(tripData);
  }, [trips, saveTrip]);

  const archiveTrip = useCallback(async (tripId: string): Promise<void> => {
    await updateTrip(tripId, { isArchived: true });
  }, [updateTrip]);

  // ===================================================================
  // FUNCIONES DE BÚSQUEDA
  // ===================================================================

  const searchDestinations = useCallback(async (query: string): Promise<void> => {
    setIsSearching(true);
    setSearchQuery(query);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const results = mockDestinations.filter(dest =>
        dest.name.toLowerCase().includes(query.toLowerCase()) ||
        dest.country.toLowerCase().includes(query.toLowerCase()) ||
        (dest.description && dest.description.toLowerCase().includes(query.toLowerCase()))
      );
      
      setSearchResults(results);
      
      if (query.trim() && !searchHistory.includes(query)) {
        setSearchHistory(prev => [query, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      setError('Error en la búsqueda');
    } finally {
      setIsSearching(false);
    }
  }, [searchHistory]);

  const updateSearchFilters = useCallback((newFilters: SearchFilters) => {
    setSearchFilters(newFilters);
  }, []);

  // ===================================================================
  // FUNCIONES DE FAVORITOS
  // ===================================================================

  const addToFavorites = useCallback((destination: Destination) => {
    if (!favorites.find(fav => fav.id === destination.id)) {
      setFavorites(prev => [...prev, destination]);
      addNotification({
        type: 'success',
        title: 'Agregado a Favoritos',
        message: `${destination.name} agregado a favoritos`,
        read: false
      });
    }
  }, [favorites]);

  const removeFromFavorites = useCallback((destinationId: string) => {
    const destination = favorites.find(fav => fav.id === destinationId);
    setFavorites(prev => prev.filter(fav => fav.id !== destinationId));
    
    if (destination) {
      addNotification({
        type: 'info',
        title: 'Removido de Favoritos',
        message: `${destination.name} removido de favoritos`,
        read: false
      });
    }
  }, [favorites]);

  const isFavorite = useCallback((destinationId: string): boolean => {
    return favorites.some(fav => fav.id === destinationId);
  }, [favorites]);

  // ===================================================================
  // FUNCIONES DE PLANIFICACIÓN
  // ===================================================================

  const startTripPlanning = useCallback((destination: Destination) => {
    const defaultTrip = createDefaultTrip();
    const newTrip: Trip = {
      id: generateUniqueId(),
      userId: 'demo_user',
      name: `Viaje a ${destination.name}`,
      destination: destination,
      origin: createDefaultOrigin('Tu ciudad', 'Tu país'),
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      duration: 7,
      dates: {
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...defaultTrip
    } as Trip;
    
    setCurrentTrip(newTrip);
    addNotification({
      type: 'info',
      title: 'Planificación Iniciada',
      message: `Comenzando planificación para ${destination.name}`,
      read: false
    });
  }, [generateUniqueId]);

  const editTrip = useCallback((trip: Trip) => {
    setCurrentTrip(trip);
  }, []);

  const updateTripDetails = useCallback((updates: Partial<Trip>) => {
    if (currentTrip) {
      const updatedTrip = { ...currentTrip, ...updates };
      setCurrentTrip(updatedTrip);
    }
  }, [currentTrip]);

  // ===================================================================
  // FUNCIONES DE FILTROS Y BÚSQUEDA
  // ===================================================================

  const filteredTrips = React.useMemo(() => {
    let result = trips.filter(trip => !trip.isArchived);

    if (filters.status) {
      result = result.filter(trip => trip.status === filters.status);
    }

    if (filters.destination) {
      result = result.filter(trip => 
        trip.destination.name.toLowerCase().includes(filters.destination!.toLowerCase())
      );
    }

    if (filters.dateRange) {
      result = result.filter(trip => {
        const tripStart = new Date(trip.startDate);
        const filterStart = new Date(filters.dateRange!.start);
        const filterEnd = new Date(filters.dateRange!.end);
        return tripStart >= filterStart && tripStart <= filterEnd;
      });
    }

    if (filters.budget) {
      result = result.filter(trip => 
        trip.budget.total >= filters.budget!.min && 
        trip.budget.total <= filters.budget!.max
      );
    }

    if (filters.duration) {
      result = result.filter(trip => 
        trip.duration >= filters.duration!.min && 
        trip.duration <= filters.duration!.max
      );
    }

    return result;
  }, [trips, filters]);

  const searchTrips = useCallback((query: string): Trip[] => {
    if (!query.trim()) return filteredTrips;

    const lowercaseQuery = query.toLowerCase();
    return filteredTrips.filter(trip =>
      trip.name.toLowerCase().includes(lowercaseQuery) ||
      trip.destination.name.toLowerCase().includes(lowercaseQuery) ||
      trip.origin.city.toLowerCase().includes(lowercaseQuery) ||
      trip.interests.some(interest => interest.toLowerCase().includes(lowercaseQuery))
    );
  }, [filteredTrips]);

  // ===================================================================
  // ESTADÍSTICAS
  // ===================================================================

  const stats = React.useMemo((): TripStats => {
    const activeTrips = trips.filter(trip => !trip.isArchived);
    
    const byStatus = activeTrips.reduce((acc, trip) => {
      acc[trip.status] = (acc[trip.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalBudget = activeTrips.reduce((sum, trip) => sum + trip.budget.total, 0);
    const destinations = [...new Set(activeTrips.map(trip => trip.destination.name))];
    
    const now = new Date();
    const upcomingTrips = activeTrips.filter(trip => 
      new Date(trip.startDate) > now && trip.status !== 'cancelled'
    ).length;
    
    const completedTrips = byStatus['completed'] || 0;

    return {
      total: activeTrips.length,
      byStatus,
      totalBudget,
      averageBudget: activeTrips.length > 0 ? totalBudget / activeTrips.length : 0,
      destinations,
      upcomingTrips,
      completedTrips,
      completed: completedTrips,
      destinationsCount: destinations.length,
      totalSavings: Math.floor(totalBudget * 0.1)
    };
  }, [trips]);

  const getStatsByDateRange = useCallback((startDate: string, endDate: string): TripStats => {
    const rangeTrips = trips.filter(trip => {
      const tripDate = new Date(trip.startDate);
      return tripDate >= new Date(startDate) && tripDate <= new Date(endDate);
    });

    const byStatus = rangeTrips.reduce((acc, trip) => {
      acc[trip.status] = (acc[trip.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalBudget = rangeTrips.reduce((sum, trip) => sum + trip.budget.total, 0);

    return {
      total: rangeTrips.length,
      byStatus,
      totalBudget,
      averageBudget: rangeTrips.length > 0 ? totalBudget / rangeTrips.length : 0,
      destinations: [...new Set(rangeTrips.map(trip => trip.destination.name))],
      upcomingTrips: 0,
      completedTrips: byStatus['completed'] || 0,
      completed: byStatus['completed'] || 0,
      destinationsCount: [...new Set(rangeTrips.map(trip => trip.destination.name))].length,
      totalSavings: Math.floor(totalBudget * 0.1)
    };
  }, [trips]);

  const getTripsStats = useCallback(() => stats, [stats]);

  // ===================================================================
  // SISTEMA DE NOTIFICACIONES
  // ===================================================================

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]);
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  }, []);

  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // ===================================================================
  // FUNCIONES AUXILIARES
  // ===================================================================

  const getTripDuration = useCallback((tripId?: string): number => {
    if (tripId) {
      const trip = getTripById(tripId);
      if (!trip) return 0;
      
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    } else if (currentTrip) {
      const start = new Date(currentTrip.startDate);
      const end = new Date(currentTrip.endDate);
      return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }
    return 0;
  }, [getTripById, currentTrip]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const exportTrips = useCallback((): string => {
    const exportData = {
      trips,
      notifications,
      favorites,
      searchHistory,
      exportDate: new Date().toISOString(),
      version: '2.0'
    };
    return JSON.stringify(exportData, null, 2);
  }, [trips, notifications, favorites, searchHistory]);

  const importTrips = useCallback(async (data: string): Promise<void> => {
    try {
      const importData = JSON.parse(data);
      
      if (importData.trips && Array.isArray(importData.trips)) {
        setTrips(importData.trips);
      }
      
      if (importData.notifications && Array.isArray(importData.notifications)) {
        setNotifications(prev => [...importData.notifications, ...prev]);
      }
      
      if (importData.favorites && Array.isArray(importData.favorites)) {
        setFavorites(importData.favorites);
      }
      
      addNotification({
        type: 'success',
        title: 'Importación Exitosa',
        message: 'Datos importados correctamente',
        read: false
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error de Importación',
        message: 'El archivo no tiene un formato válido',
        read: false
      });
      throw new Error('Formato de archivo inválido');
    }
  }, []);

  const clearAllData = useCallback(() => {
    setTrips([]);
    setNotifications([]);
    setFavorites([]);
    setSearchHistory([]);
    setCurrentTrip(null);
    setFilters({});
    setSearchFilters({});
    
    localStorage.removeItem('tripwase_trips');
    localStorage.removeItem('tripwase_notifications');
    localStorage.removeItem('tripwase_favorites');
    localStorage.removeItem('tripwase_search_history');
    
    addNotification({
      type: 'warning',
      title: 'Datos Eliminados',
      message: 'Todos los datos han sido eliminados',
      read: false
    });
  }, []);

  // ===================================================================
  // CONTEXT VALUE
  // ===================================================================

  const contextValue: TripContextType = {
    // Estado
    trips,
    currentTrip,
    isLoading,
    error,
    
    // Búsqueda
    searchQuery,
    searchResults,
    isSearching,
    searchHistory,
    searchFilters,
    
    // Favoritos
    favorites,
    
    // Funciones de viajes
    saveTrip,
    updateTrip,
    deleteTrip,
    getTripById,
    duplicateTrip,
    archiveTrip,
    
    // Funciones de búsqueda
    searchDestinations,
    updateSearchFilters,
    
    // Funciones de favoritos
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    
    // Funciones de planificación
    startTripPlanning,
    editTrip,
    updateTripDetails,
    
    // Filtros y búsqueda
    filteredTrips,
    filters,
    setFilters,
    searchTrips,
    
    // Estadísticas
    stats,
    getStatsByDateRange,
    getTripsStats,
    
    // Notificaciones
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    
    // Auxiliares
    getTripDuration,
    clearError,
    exportTrips,
    importTrips,
    clearAllData
  };

  return (
    <TripContext.Provider value={contextValue}>
      {children}
    </TripContext.Provider>
  );
};

// ===================================================================
// HOOK PERSONALIZADO
// ===================================================================

export const useTrip = (): TripContextType => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip debe ser usado dentro de un TripProvider');
  }
  return context;
};

// Exportar tipos para uso en otros componentes
export type { Trip, Notification, TripFilters, TripStats, Destination, Origin, Travelers, Budget };