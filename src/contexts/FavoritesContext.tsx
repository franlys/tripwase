// src/contexts/FavoritesContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Hotel, Cruise, TouristAttraction, Event, Restaurant, FlightOffer } from '../types/homepage';

interface FavoritesState {
  hotels: Hotel[];
  cruises: Cruise[];
  attractions: TouristAttraction[];
  events: Event[];
  restaurants: Restaurant[];
  flights: FlightOffer[];
}

interface FavoritesContextType {
  favorites: FavoritesState;
  addToFavorites: (item: any, type: keyof FavoritesState) => void;
  removeFromFavorites: (itemId: string, type: keyof FavoritesState) => void;
  isFavorite: (itemId: string, type: keyof FavoritesState) => boolean;
  toggleFavorite: (item: any, type: keyof FavoritesState) => void;
  getTotalFavorites: () => number;
  clearAllFavorites: () => void;
  getFavoritesByType: (type: keyof FavoritesState) => any[];
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = 'tripwise_favorites';

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoritesState>({
    hotels: [],
    cruises: [],
    attractions: [],
    events: [],
    restaurants: [],
    flights: []
  });

  // Cargar favoritos del localStorage al iniciar
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(STORAGE_KEY);
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.error('Error cargando favoritos desde localStorage:', error);
    }
  }, []);

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error guardando favoritos en localStorage:', error);
    }
  }, [favorites]);

  const addToFavorites = (item: any, type: keyof FavoritesState) => {
    setFavorites(prev => {
      // Verificar que el item no esté ya en favoritos
      const currentFavorites = prev[type] as any[];
      const isAlreadyFavorite = currentFavorites.some(fav => fav.id === item.id);
      
      if (isAlreadyFavorite) {
        return prev; // No agregar duplicados
      }

      return {
        ...prev,
        [type]: [...currentFavorites, { ...item, isFavorite: true }]
      };
    });
  };

  const removeFromFavorites = (itemId: string, type: keyof FavoritesState) => {
    setFavorites(prev => ({
      ...prev,
      [type]: (prev[type] as any[]).filter(item => item.id !== itemId)
    }));
  };

  const isFavorite = (itemId: string, type: keyof FavoritesState): boolean => {
    return (favorites[type] as any[]).some(item => item.id === itemId);
  };

  const toggleFavorite = (item: any, type: keyof FavoritesState) => {
    if (isFavorite(item.id, type)) {
      removeFromFavorites(item.id, type);
    } else {
      addToFavorites(item, type);
    }
  };

  const getTotalFavorites = (): number => {
    return Object.values(favorites).reduce((total, categoryItems) => total + categoryItems.length, 0);
  };

  const clearAllFavorites = () => {
    setFavorites({
      hotels: [],
      cruises: [],
      attractions: [],
      events: [],
      restaurants: [],
      flights: []
    });
  };

  const getFavoritesByType = (type: keyof FavoritesState) => {
    return favorites[type];
  };

  const contextValue: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    getTotalFavorites,
    clearAllFavorites,
    getFavoritesByType
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe usarse dentro de un FavoritesProvider');
  }
  return context;
};

export default FavoritesContext;