// src/utils/recommendationEngine.ts
import { Hotel, Cruise, TouristAttraction, Location } from '../types/homepage';

export interface UserProfile {
  preferredLocations: string[];
  budgetRange: {
    min: number;
    max: number;
  };
  favoriteAmenities: string[];
  travelStyle: string[];
  preferredCategories: string[];
}

export interface RecommendationScore {
  itemId: string;
  score: number;
  reasons: string[];
}

export class RecommendationEngine {
  
  // Helper functions para manejar diferencias entre tipos
  static getItemPrice(item: Hotel | Cruise | TouristAttraction) {
    if ('price' in item && item.price) {
      return item.price;
    }
    if ('entryFee' in item && item.entryFee) {
      return item.entryFee;
    }
    return null;
  }

  static getItemAmenities(item: Hotel | Cruise | TouristAttraction): string[] {
    if ('amenities' in item && Array.isArray(item.amenities)) {
      return item.amenities;
    }
    return [];
  }

  static getItemLocation(item: Hotel | Cruise | TouristAttraction): string {
    if ('location' in item && item.location && typeof item.location === 'object' && 'city' in item.location) {
      return item.location.city;
    }
    if ('departurePort' in item && item.departurePort) {
      return item.departurePort;
    }
    return '';
  }

  static getItemHighlights(item: Hotel | Cruise | TouristAttraction): string[] {
    if ('highlights' in item && Array.isArray(item.highlights)) {
      return item.highlights;
    }
    return [];
  }

  // Método para analizar favoritos del usuario
  static analyzeUserFavorites(
    hotels: Hotel[], 
    cruises: Cruise[], 
    attractions: TouristAttraction[]
  ): UserProfile {
    const allItems = [...hotels, ...cruises, ...attractions];
    
    // Extraer ubicaciones preferidas usando helper
    const preferredLocations = allItems.map(item => this.getItemLocation(item))
      .filter(location => location !== '');

    // Extraer rango de presupuesto usando helper
    const prices = allItems.map(item => {
      const price = this.getItemPrice(item);
      return price ? price.amount : 0;
    }).filter(price => price > 0);

    const budgetRange = {
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 1000
    };

    // Extraer amenidades favoritas usando helper
    const favoriteAmenities: string[] = [];
    allItems.forEach(item => {
      const amenities = this.getItemAmenities(item);
      favoriteAmenities.push(...amenities);
    });

    // Extraer categorías preferidas (solo para atracciones)
    const preferredCategories = attractions
      .map(attraction => attraction.category || 'general')
      .filter(category => category !== '');

    return {
      preferredLocations: [...new Set(preferredLocations)],
      budgetRange,
      favoriteAmenities: [...new Set(favoriteAmenities)],
      travelStyle: ['comfort', 'adventure'], // Por defecto
      preferredCategories: [...new Set(preferredCategories)]
    };
  }

  // Método para generar recomendaciones de hoteles
  static generateHotelRecommendations(
    hotels: Hotel[], 
    userProfile: UserProfile, 
    limit: number = 5
  ): RecommendationScore[] {
    return hotels.map(hotel => {
      let score = 0;
      const reasons: string[] = [];

      const hotelLocation = this.getItemLocation(hotel);
      const hotelPrice = this.getItemPrice(hotel);
      const hotelAmenities = this.getItemAmenities(hotel);

      // Verificar ubicación preferida
      if (hotelLocation && userProfile.preferredLocations.includes(hotelLocation)) {
        score += 30;
        reasons.push(`Ubicado en ${hotelLocation}, una de tus ciudades favoritas`);
      }

      // Verificar presupuesto
      if (hotelPrice && hotelPrice.amount >= userProfile.budgetRange.min && 
          hotelPrice.amount <= userProfile.budgetRange.max) {
        score += 25;
        reasons.push('Dentro de tu rango de presupuesto');
      }

      // Verificar amenidades
      if (hotelAmenities.length > 0) {
        const matchingAmenities = hotelAmenities.filter(amenity => 
          userProfile.favoriteAmenities.includes(amenity)
        );
        if (matchingAmenities.length > 0) {
          score += matchingAmenities.length * 5;
          reasons.push(`Incluye amenidades que te gustan: ${matchingAmenities.join(', ')}`);
        }
      }

      // Bonus por rating alto
      if (hotel.rating && hotel.rating >= 4.5) {
        score += 10;
        reasons.push('Excelente calificación de huéspedes');
      }

      return {
        itemId: hotel.id,
        score,
        reasons
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  }

  // Método para generar recomendaciones de cruceros
  static generateCruiseRecommendations(
    cruises: Cruise[], 
    userProfile: UserProfile, 
    limit: number = 5
  ): RecommendationScore[] {
    return cruises.map(cruise => {
      let score = 0;
      const reasons: string[] = [];

      const cruisePrice = this.getItemPrice(cruise);
      const cruiseAmenities = this.getItemAmenities(cruise);

      // Verificar presupuesto
      if (cruisePrice && cruisePrice.amount >= userProfile.budgetRange.min && 
          cruisePrice.amount <= userProfile.budgetRange.max) {
        score += 25;
        reasons.push('Dentro de tu rango de presupuesto');
      }

      // Verificar duración (preferir cruceros de duración media)
      if (cruise.duration >= 5 && cruise.duration <= 10) {
        score += 15;
        reasons.push('Duración ideal para vacaciones');
      }

      // Verificar amenidades del crucero
      if (cruiseAmenities.length > 0) {
        const matchingAmenities = cruiseAmenities.filter(amenity => 
          userProfile.favoriteAmenities.includes(amenity)
        );
        if (matchingAmenities.length > 0) {
          score += matchingAmenities.length * 5;
          reasons.push(`Incluye facilidades que disfrutas: ${matchingAmenities.join(', ')}`);
        }
      }

      // Bonus por rating alto
      if (cruise.rating && cruise.rating >= 4.5) {
        score += 10;
        reasons.push('Excelente calificación de pasajeros');
      }

      // Verificar si el puerto de salida está en ubicaciones preferidas
      if (cruise.departurePort && userProfile.preferredLocations.includes(cruise.departurePort)) {
        score += 20;
        reasons.push(`Sale desde ${cruise.departurePort}, cerca de tus ubicaciones favoritas`);
      }

      return {
        itemId: cruise.id,
        score,
        reasons
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  }

  // Método para generar recomendaciones de atracciones
  static generateAttractionRecommendations(
    attractions: TouristAttraction[], 
    userProfile: UserProfile, 
    limit: number = 5
  ): RecommendationScore[] {
    return attractions.map(attraction => {
      let score = 0;
      const reasons: string[] = [];

      const attractionLocation = this.getItemLocation(attraction);
      const attractionPrice = this.getItemPrice(attraction);
      const attractionHighlights = this.getItemHighlights(attraction);

      // Verificar ubicación preferida
      if (attractionLocation && userProfile.preferredLocations.includes(attractionLocation)) {
        score += 30;
        reasons.push(`Ubicado en ${attractionLocation}, una de tus ciudades favoritas`);
      }

      // Verificar presupuesto
      if (attractionPrice && attractionPrice.amount >= userProfile.budgetRange.min && 
          attractionPrice.amount <= userProfile.budgetRange.max) {
        score += 25;
        reasons.push('Dentro de tu rango de presupuesto');
      }

      // Verificar categoría preferida
      if (attraction.category && userProfile.preferredCategories.includes(attraction.category)) {
        score += 20;
        reasons.push(`Es del tipo ${attraction.category} que sueles disfrutar`);
      }

      // Bonus por rating alto
      if (attraction.rating && attraction.rating >= 4.5) {
        score += 10;
        reasons.push('Altamente recomendado por visitantes');
      }

      // Verificar highlights/actividades
      if (attractionHighlights.length > 0) {
        // Buscar palabras clave relacionadas con el estilo de viaje del usuario
        const relevantHighlights = attractionHighlights.filter(highlight => 
          userProfile.travelStyle.some(style => 
            highlight.toLowerCase().includes(style.toLowerCase())
          )
        );
        
        if (relevantHighlights.length > 0) {
          score += relevantHighlights.length * 3;
          reasons.push(`Incluye actividades de tu interés: ${relevantHighlights.join(', ')}`);
        }
      }

      return {
        itemId: attraction.id,
        score,
        reasons
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  }

  // Método principal para generar todas las recomendaciones
  static generateRecommendations(
    hotels: Hotel[], 
    cruises: Cruise[], 
    attractions: TouristAttraction[]
  ) {
    // Analizar perfil del usuario basado en favoritos
    const userProfile = this.analyzeUserFavorites(hotels, cruises, attractions);

    // Generar recomendaciones para cada categoría
    const hotelRecommendations = this.generateHotelRecommendations(hotels, userProfile);
    const cruiseRecommendations = this.generateCruiseRecommendations(cruises, userProfile);
    const attractionRecommendations = this.generateAttractionRecommendations(attractions, userProfile);

    return {
      userProfile,
      recommendations: {
        hotels: hotelRecommendations,
        cruises: cruiseRecommendations,
        attractions: attractionRecommendations
      }
    };
  }
}

export default RecommendationEngine;