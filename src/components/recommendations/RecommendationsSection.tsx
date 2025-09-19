// src/components/recommendations/RecommendationsSection.tsx
import React, { useState } from 'react';
import { Star, MapPin, Clock, Users, Heart, ChevronRight } from 'lucide-react';
import { useRecommendations } from '../../hooks/useRecommendations';
import { Hotel, Cruise, TouristAttraction } from '../../types/homepage';

interface RecommendationsSectionProps {
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
  onItemClick?: (item: any, type: string) => void;
  onAddToFavorites?: (item: any, type: string) => void;
}

export const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  favorites,
  availableItems,
  onItemClick,
  onAddToFavorites
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'hotels' | 'cruises' | 'attractions'>('all');
  
  const {
    recommendations,
    userProfile,
    isLoading,
    error,
    hasSufficientData,
    getRecommendationsWithItems,
    getTopRecommendations,
    stats
  } = useRecommendations({
    favorites,
    availableItems,
    enabled: true
  });

  // Si no hay datos suficientes, mostrar mensaje
  if (!hasSufficientData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          ¡Comienza a guardar favoritos!
        </h3>
        <p className="text-gray-600 mb-4">
          Guarda al menos 2 hoteles, cruceros o atracciones como favoritos para recibir recomendaciones personalizadas.
        </p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Explorar destinos
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const tabs = [
    { id: 'all', label: 'Todo', count: stats.totalRecommendations },
    { id: 'hotels', label: 'Hoteles', count: recommendations.hotels.length },
    { id: 'cruises', label: 'Cruceros', count: recommendations.cruises.length },
    { id: 'attractions', label: 'Atracciones', count: recommendations.attractions.length }
  ];

  const getDisplayItems = () => {
    switch (activeTab) {
      case 'hotels':
        return getRecommendationsWithItems('hotels');
      case 'cruises':
        return getRecommendationsWithItems('cruises');
      case 'attractions':
        return getRecommendationsWithItems('attractions');
      default:
        return getTopRecommendations(12);
    }
  };

  const renderRecommendationCard = (recommendation: any) => {
    const { item, score, reasons, type } = recommendation;
    if (!item) return null;

    return (
      <div key={item.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
        <div onClick={() => onItemClick?.(item, type || getItemType(item))}>
          {/* Imagen */}
          <div className="relative">
            <img 
              src={item.images?.[0] || '/placeholder-image.jpg'} 
              alt={item.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="absolute top-2 right-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToFavorites?.(item, type || getItemType(item));
                }}
                className="bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
              >
                <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
              </button>
            </div>
            {/* Badge de score */}
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              {Math.round(score)}% match
            </div>
          </div>

          {/* Contenido */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{item.name}</h3>
            
            {/* Ubicación */}
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="line-clamp-1">
                {item.location?.city || item.departurePort || 'Ubicación no disponible'}
              </span>
            </div>

            {/* Rating */}
            {item.rating && (
              <div className="flex items-center mb-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-900 ml-1">{item.rating}</span>
                <span className="text-sm text-gray-500 ml-1">({item.reviews} reseñas)</span>
              </div>
            )}

            {/* Precio */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-lg font-bold text-blue-600">
                  ${item.price?.amount || item.entryFee?.amount || 'N/A'}
                </span>
                {item.price?.period && (
                  <span className="text-sm text-gray-500">/{item.price.period}</span>
                )}
              </div>
              {type === 'cruise' && item.duration && (
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{item.duration} días</span>
                </div>
              )}
            </div>

            {/* Razones de recomendación */}
            <div className="border-t pt-3">
              <p className="text-xs font-medium text-gray-700 mb-1">Por qué te lo recomendamos:</p>
              <p className="text-xs text-gray-600 line-clamp-2">
                {reasons.slice(0, 2).join('. ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getItemType = (item: any) => {
    if ('amenities' in item && 'stars' in item) return 'hotel';
    if ('cruiseLine' in item) return 'cruise';
    if ('category' in item && 'entryFee' in item) return 'attraction';
    return 'unknown';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recomendado para ti</h2>
          <p className="text-gray-600 mt-1">
            Basado en tus {favorites.hotels.length + favorites.cruises.length + favorites.attractions.length} favoritos
          </p>
        </div>
        
        {/* Estadísticas del perfil */}
        {userProfile && (
          <div className="text-right">
            <div className="text-sm text-gray-600">
              <div>Presupuesto: ${userProfile.budgetRange.min} - ${userProfile.budgetRange.max}</div>
              <div>Ubicaciones favoritas: {userProfile.preferredLocations.slice(0, 2).join(', ')}</div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Grid de recomendaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {getDisplayItems().map(renderRecommendationCard)}
      </div>

      {/* Call to action */}
      {stats.totalRecommendations > 12 && activeTab === 'all' && (
        <div className="text-center pt-4">
          <button className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Ver todas las recomendaciones
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendationsSection;