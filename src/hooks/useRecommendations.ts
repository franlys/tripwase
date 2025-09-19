// src/hooks/useRecommendations.ts
import { useState, useEffect, useMemo } from 'react';
import { RecommendationEngine, UserProfile, RecommendationScore } from '../utils/recommendationEngine';
import { Hotel, Cruise, TouristAttraction } from '../types/homepage';

interface RecommendationsData {
  hotels: RecommendationScore[];
  cruises: RecommendationScore[];
  attractions: RecommendationScore[];
}

interface UseRecommendationsProps {
  favorites: {
    hotels: Hotel[];
    cruises: Cruise[];
    attractions: TouristAttraction[];
  };
  availableItems: {
    hotels: Hotel[];
    cruises: Cruise[];
    attractions: TouristAttraction[];
  };
  enabled?: boolean;
}

export const useRecommendations = ({
  favorites,
  availableItems,
  enabled = true
}: UseRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<RecommendationsData>({
    hotels: [],
    cruises: [],
    attractions: []
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memorizar si hay favoritos suficientes para generar un perfil
  const hasSufficientData = useMemo(() => {
    const totalFavorites = favorites.hotels.length + favorites.cruises.length + favorites.attractions.length;
    return totalFavorites >= 2; // Mínimo 2 favoritos para generar recomendaciones
  }, [favorites]);

  // Generar recomendaciones cuando cambien los favoritos o los datos disponibles
  useEffect(() => {
    if (!enabled || !hasSufficientData) {
      setRecommendations({ hotels: [], cruises: [], attractions: [] });
      setUserProfile(null);
      return;
    }

    const generateRecommendations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Generar recomendaciones usando el motor
        const result = RecommendationEngine.generateRecommendations(
          favorites.hotels,
          favorites.cruises,
          favorites.attractions
        );

        // Filtrar elementos que no están en favoritos para las recomendaciones
        const availableHotels = availableItems.hotels.filter(hotel => 
          !favorites.hotels.some(fav => fav.id === hotel.id)
        );
        const availableCruises = availableItems.cruises.filter(cruise => 
          !favorites.cruises.some(fav => fav.id === cruise.id)
        );
        const availableAttractions = availableItems.attractions.filter(attraction => 
          !favorites.attractions.some(fav => fav.id === attraction.id)
        );

        // Generar recomendaciones para elementos disponibles
        const hotelRecs = RecommendationEngine.generateHotelRecommendations(
          availableHotels, 
          result.userProfile, 
          8
        );
        const cruiseRecs = RecommendationEngine.generateCruiseRecommendations(
          availableCruises, 
          result.userProfile, 
          6
        );
        const attractionRecs = RecommendationEngine.generateAttractionRecommendations(
          availableAttractions, 
          result.userProfile, 
          10
        );

        setRecommendations({
          hotels: hotelRecs,
          cruises: cruiseRecs,
          attractions: attractionRecs
        });
        setUserProfile(result.userProfile);

      } catch (err) {
        console.error('Error generando recomendaciones:', err);
        setError('Error al generar recomendaciones. Inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    generateRecommendations();
  }, [favorites, availableItems, enabled, hasSufficientData]);

  // Helper functions para manejar las diferencias entre tipos
  const getItemPrice = (item: Hotel | Cruise | TouristAttraction) => {
    if ('price' in item) {
      return item.price;
    }
    if ('entryFee' in item) {
      return item.entryFee;
    }
    return null;
  };

  const getItemAmenities = (item: Hotel | Cruise | TouristAttraction) => {
    if ('amenities' in item) {
      return item.amenities;
    }
    return [];
  };

  const getItemLocation = (item: Hotel | Cruise | TouristAttraction) => {
    if ('location' in item) {
      return item.location;
    }
    if ('departurePort' in item) {
      return { city: item.departurePort, country: 'Unknown' };
    }
    return { city: 'Unknown', country: 'Unknown' };
  };

  // Obtener item específico por ID y tipo
  const getItemById = (itemId: string, type: 'hotel' | 'cruise' | 'attraction') => {
    switch (type) {
      case 'hotel':
        return availableItems.hotels.find(item => item.id === itemId);
      case 'cruise':
        return availableItems.cruises.find(item => item.id === itemId);
      case 'attraction':
        return availableItems.attractions.find(item => item.id === itemId);
      default:
        return null;
    }
  };

  // Obtener recomendaciones con datos completos del item
  const getRecommendationsWithItems = (type: 'hotels' | 'cruises' | 'attractions') => {
    return recommendations[type].map(rec => ({
      ...rec,
      item: getItemById(rec.itemId, type.slice(0, -1) as any) // Remover 's' del final
    })).filter(rec => rec.item !== null);
  };

  // Obtener top recomendaciones de todas las categorías
  const getTopRecommendations = (limit: number = 5) => {
    const allRecs = [
      ...recommendations.hotels.map(rec => ({ ...rec, type: 'hotel' as const })),
      ...recommendations.cruises.map(rec => ({ ...rec, type: 'cruise' as const })),
      ...recommendations.attractions.map(rec => ({ ...rec, type: 'attraction' as const }))
    ];

    return allRecs
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(rec => ({
        ...rec,
        item: getItemById(rec.itemId, rec.type)
      }))
      .filter(rec => rec.item !== null);
  };

  return {
    recommendations,
    userProfile,
    isLoading,
    error,
    hasSufficientData,
    getItemById,
    getRecommendationsWithItems,
    getTopRecommendations,
    
    // Estadísticas útiles
    stats: {
      totalRecommendations: recommendations.hotels.length + recommendations.cruises.length + recommendations.attractions.length,
      highScoreRecommendations: [
        ...recommendations.hotels,
        ...recommendations.cruises,
        ...recommendations.attractions
      ].filter(rec => rec.score >= 50).length,
      averageScore: (() => {
        const allScores = [
          ...recommendations.hotels,
          ...recommendations.cruises,
          ...recommendations.attractions
        ].map(rec => rec.score);
        return allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;
      })()
    }
  };
};

export default useRecommendations;