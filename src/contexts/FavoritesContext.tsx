// src/contexts/FavoritesContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FavoritesContextType, FavoritesData, FavoriteItem } from '../types';

export const FavoritesContext = createContext<FavoritesContextType | null>(null);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoritesData>({
    hotels: [],
    restaurants: [],
    plans: []
  });

  const addToFavorites = (type: keyof FavoritesData, item: FavoriteItem) => {
    setFavorites(prev => ({
      ...prev,
      [type]: [...prev[type].filter(fav => fav.id !== item.id), item]
    }));
  };

  const removeFromFavorites = (type: keyof FavoritesData, itemId: string) => {
    setFavorites(prev => ({
      ...prev,
      [type]: prev[type].filter(fav => fav.id !== itemId)
    }));
  };

  const isFavorite = (type: keyof FavoritesData, itemId: string): boolean => {
    return favorites[type].some(fav => fav.id === itemId);
  };

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
  }
  return context;
};
