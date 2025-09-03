// src/utils/routeGenerator.ts
import { TouristRoute, DayRoute, TouristAttraction, OptimalRoute } from '../types';
import { TOURIST_ATTRACTIONS } from '../data';

export const generateTouristRoute = (
  destination: string, 
  isDomestic: boolean, 
  countryCode: string, 
  travelMode: string = 'road'
): TouristRoute | null => {
  const destinationLower = destination.toLowerCase();
  
  let regionKey: string | null = null;
  const countryData = TOURIST_ATTRACTIONS[countryCode];
  
  if (!countryData) return null;
  
  Object.keys(countryData).forEach(key => {
    const region = countryData[key];
    if (destinationLower.includes(key.replace('_', ' ')) || 
        destinationLower.includes(key.replace('_', '')) ||
        region.region.toLowerCase().includes(destinationLower.split(',')[0].trim())) {
      regionKey = key;
    }
  });
  
  if (!regionKey) {
    regionKey = Object.keys(countryData)[0];
  }
  
  const regionData = countryData[regionKey];
  if (!regionData) return null;
  
  const attractions = regionData.attractions;
  const itinerary: DayRoute[] = [];
  
  const daysNeeded = isDomestic && travelMode === 'road' ? 
    Math.min(5, Math.ceil(attractions.length / 1.5)) : 
    Math.min(4, Math.ceil(attractions.length / 2));
  
  for (let day = 1; day <= daysNeeded; day++) {
    const attractionsPerDay = isDomestic && travelMode === 'road' ? 1.5 : 2;
    const startIndex = Math.floor((day - 1) * attractionsPerDay);
    const endIndex = Math.min(Math.floor(day * attractionsPerDay), attractions.length);
    const dayAttractions = attractions.slice(startIndex, endIndex);
    
    itinerary.push({
      day: day,
      title: `Día ${day} - ${regionData.region}`,
      attractions: dayAttractions,
      estimatedTime: dayAttractions.reduce((total, att) => {
        const hours = parseInt(att.timeNeeded) || 3;
        return total + hours;
      }, 0),
      travelTips: isDomestic && travelMode === 'road' ? 
        generateRoadTravelTips(dayAttractions) : 
        generateGeneralTips(dayAttractions)
    });
  }
  
  // Arreglar el problema del Set spread
  const allHighlights = attractions.reduce((acc: string[], att) => {
    return acc.concat(att.highlights);
  }, []);
  const uniqueHighlights = allHighlights.filter((highlight, index) => 
    allHighlights.indexOf(highlight) === index
  ).slice(0, 8);
  
  return {
    region: regionData.region,
    totalAttractions: attractions.length,
    estimatedDays: daysNeeded,
    travelMode: travelMode,
    isDomestic: isDomestic,
    itinerary: itinerary,
    highlights: uniqueHighlights,
    bestRoutes: generateOptimalRoute(attractions, isDomestic, travelMode)
  };
};

const generateRoadTravelTips = (attractions: TouristAttraction[]): string[] => {
  const tips = [
    "Sal temprano para evitar el tráfico",
    "Lleva agua y snacks para el camino",
    "Revisa el estado del vehículo antes de partir"
  ];
  
  if (attractions.some(att => att.type === 'Playa')) {
    tips.push("No olvides protector solar y toalla");
  }
  
  return tips.slice(0, 3);
};

const generateGeneralTips = (attractions: TouristAttraction[]): string[] => {
  return [
    "Reserva entradas con anticipación",
    "Llega temprano para evitar multitudes",
    "Contrata guías locales para mejor experiencia"
  ];
};

const generateOptimalRoute = (
  attractions: TouristAttraction[], 
  isDomestic: boolean, 
  travelMode: string
): OptimalRoute => {
  if (!isDomestic || travelMode !== 'road') {
    return {
      type: 'flight_based',
      description: 'Rutas optimizadas desde el aeropuerto principal',
      routes: []
    };
  }
  
  const sortedAttractions = attractions.sort((a, b) => {
    if (a.coordinates && b.coordinates) {
      return b.coordinates.lat - a.coordinates.lat;
    }
    return 0;
  });
  
  return {
    type: 'road_trip',
    description: 'Ruta optimizada por carretera visitando lugares en orden geográfico',
    totalDistance: '~ 500 km total',
    routes: sortedAttractions.map((attraction, index) => ({
      stop: index + 1,
      name: attraction.name,
      estimatedDriveTime: index === 0 ? '0 min' : `${30 + (index * 20)} min desde anterior`,
      coordinates: attraction.coordinates
    }))
  };
};
