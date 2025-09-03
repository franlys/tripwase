// src/types/favorites.ts
export interface FavoritesData {
  hotels: FavoriteItem[];
  restaurants: FavoriteItem[];
  plans: FavoriteItem[];
}

export interface FavoriteItem {
  id: string;
  name: string;
  type: string;
  data?: any;
}

export interface FavoritesContextType {
  favorites: FavoritesData;
  addToFavorites: (type: keyof FavoritesData, item: FavoriteItem) => void;
  removeFromFavorites: (type: keyof FavoritesData, itemId: string) => void;
  isFavorite: (type: keyof FavoritesData, itemId: string) => boolean;
}
