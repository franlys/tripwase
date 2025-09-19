// src/data/sampleData.ts
import { Hotel, Cruise, TouristAttraction } from '../types/homepage';

export const SAMPLE_HOTELS: Hotel[] = [
  {
    id: 'hotel_1',
    name: 'Hotel Paradise Beach Resort',
    location: { city: 'Punta Cana', country: 'República Dominicana' },
    price: { amount: 180, currency: 'USD', period: 'night' },
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'],
    amenities: ['Todo incluido', 'WiFi gratis', 'Piscina', 'Spa', 'Playa privada', 'Restaurantes'],
    description: 'Resort de lujo frente al mar en Punta Cana con todo incluido',
    rating: 4.7,
    reviews: 1240,
    highlights: ['Vista al mar', 'Actividades acuáticas', 'Gastronomía internacional'],
    availability: true,
    stars: 5,
    isFavorite: false
  },
  {
    id: 'hotel_2',
    name: 'Boutique Hotel Colonial',
    location: { city: 'Santo Domingo', country: 'República Dominicana' },
    price: { amount: 120, currency: 'USD', period: 'night' },
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400'],
    amenities: ['WiFi gratis', 'Aire acondicionado', 'Restaurante', 'Bar', 'Terraza'],
    description: 'Hotel boutique en el corazón de la Zona Colonial',
    rating: 4.5,
    reviews: 890,
    highlights: ['Arquitectura colonial', 'Ubicación céntrica', 'Historia'],
    availability: true,
    stars: 4,
    isFavorite: false
  },
  {
    id: 'hotel_3',
    name: 'Eco Resort Mountain View',
    location: { city: 'Jarabacoa', country: 'República Dominicana' },
    price: { amount: 95, currency: 'USD', period: 'night' },
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
    amenities: ['Eco-friendly', 'Hiking', 'WiFi gratis', 'Piscina natural', 'Yoga'],
    description: 'Resort ecológico en las montañas con vistas espectaculares',
    rating: 4.6,
    reviews: 567,
    highlights: ['Ecoturismo', 'Aventura', 'Naturaleza'],
    availability: true,
    stars: 4,
    isFavorite: false
  },
  {
    id: 'hotel_4',
    name: 'Luxury Ocean Villa',
    location: { city: 'Cap Cana', country: 'República Dominicana' },
    price: { amount: 350, currency: 'USD', period: 'night' },
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400'],
    amenities: ['Villa privada', 'Chef personal', 'Playa privada', 'Piscina infinita', 'Spa'],
    description: 'Villa de lujo exclusiva con servicios premium',
    rating: 4.9,
    reviews: 234,
    highlights: ['Lujo exclusivo', 'Privacidad total', 'Servicios premium'],
    availability: true,
    stars: 5,
    isFavorite: false
  },
  {
    id: 'hotel_5',
    name: 'Budget Beach Hotel',
    location: { city: 'Boca Chica', country: 'República Dominicana' },
    price: { amount: 65, currency: 'USD', period: 'night' },
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400'],
    amenities: ['WiFi gratis', 'Aire acondicionado', 'Cerca de la playa'],
    description: 'Hotel económico cerca de la playa ideal para backpackers',
    rating: 4.1,
    reviews: 445,
    highlights: ['Económico', 'Buena ubicación', 'Ambiente joven'],
    availability: true,
    stars: 3,
    isFavorite: false
  }
];

export const SAMPLE_CRUISES: Cruise[] = [
  {
    id: 'cruise_1',
    name: 'Caribbean Paradise Explorer',
    cruiseLine: 'Royal Caribbean',
    departurePort: 'Miami',
    destinations: ['Cozumel', 'Jamaica', 'Bahamas'],
    duration: 7,
    price: { amount: 899, currency: 'USD', period: 'person' },
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400'],
    amenities: ['Todo incluido', 'Piscinas', 'Shows en vivo', 'Casino', 'Spa', 'Múltiples restaurantes'],
    description: 'Crucero de 7 días por el Caribe con paradas en destinos paradisíacos',
    highlights: ['Islas tropicales', 'Entretenimiento', 'Relajación'],
    rating: 4.6,
    reviews: 2340,
    shipName: 'Symphony of the Seas',
    capacity: 5400,
    quickPlanAvailable: true,
    isFavorite: false
  },
  {
    id: 'cruise_2',
    name: 'Eastern Caribbean Luxury',
    cruiseLine: 'Celebrity Cruises',
    departurePort: 'Fort Lauderdale',
    destinations: ['St. Maarten', 'St. Thomas', 'Puerto Rico'],
    duration: 10,
    price: { amount: 1299, currency: 'USD', period: 'person' },
    images: ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400'],
    amenities: ['Suites de lujo', 'Gastronomía gourmet', 'Spa premium', 'Arte a bordo'],
    description: 'Crucero de lujo por el Caribe Oriental con experiencias exclusivas',
    highlights: ['Lujo', 'Gastronomía', 'Cultura'],
    rating: 4.8,
    reviews: 1567,
    shipName: 'Celebrity Edge',
    capacity: 2918,
    quickPlanAvailable: true,
    isFavorite: false
  },
  {
    id: 'cruise_3',
    name: 'Adventure Caribbean Expedition',
    cruiseLine: 'Norwegian Cruise Line',
    departurePort: 'New York',
    destinations: ['Bermuda', 'Dominican Republic', 'Aruba'],
    duration: 12,
    price: { amount: 1599, currency: 'USD', period: 'person' },
    images: ['https://images.unsplash.com/photo-1571609803939-54e068b2fdb2?w=400'],
    amenities: ['Actividades extremas', 'Go-karts', 'Parque acuático', 'Rock climbing'],
    description: 'Crucero de aventura con actividades emocionantes para toda la familia',
    highlights: ['Aventura', 'Familia', 'Deportes extremos'],
    rating: 4.4,
    reviews: 987,
    shipName: 'Norwegian Breakaway',
    capacity: 3963,
    quickPlanAvailable: true,
    isFavorite: false
  }
];

export const SAMPLE_ATTRACTIONS: TouristAttraction[] = [
  {
    id: 'attraction_1',
    name: 'Hoyo Azul',
    location: { city: 'Punta Cana', country: 'República Dominicana' },
    category: 'Naturaleza',
    entryFee: { amount: 45, currency: 'USD', period: 'person' },
    images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400'],
    description: 'Cenote natural con aguas turquesas cristalinas rodeado de vegetación tropical',
    highlights: ['Natación', 'Fotografía', 'Senderismo'],
    rating: 4.7,
    reviews: 1890,
    openingHours: '8:00 AM - 5:00 PM',
    timeNeeded: '3-4 horas',
    accessibility: false,
    isFavorite: false
  },
  {
    id: 'attraction_2',
    name: 'Zona Colonial Santo Domingo',
    location: { city: 'Santo Domingo', country: 'República Dominicana' },
    category: 'Historia',
    entryFee: { amount: 0, currency: 'USD', period: 'person' },
    images: ['https://images.unsplash.com/photo-1555109307-f7d9da25c244?w=400'],
    description: 'Primera ciudad europea en América, Patrimonio de la Humanidad UNESCO',
    highlights: ['Arquitectura colonial', 'Historia', 'Museos'],
    rating: 4.6,
    reviews: 3245,
    openingHours: '24 horas',
    timeNeeded: '4-6 horas',
    accessibility: true,
    isFavorite: false
  },
  {
    id: 'attraction_3',
    name: 'Parque Nacional Los Haitises',
    location: { city: 'Samaná', country: 'República Dominicana' },
    category: 'Naturaleza',
    entryFee: { amount: 25, currency: 'USD', period: 'person' },
    images: ['https://images.unsplash.com/photo-1544139976-6e2c8c2ad7b3?w=400'],
    description: 'Parque nacional con manglares, cuevas con arte rupestre y biodiversidad única',
    highlights: ['Ecoturismo', 'Cuevas', 'Manglares'],
    rating: 4.5,
    reviews: 1456,
    openingHours: '8:00 AM - 4:00 PM',
    timeNeeded: 'Día completo',
    accessibility: false,
    isFavorite: false
  },
  {
    id: 'attraction_4',
    name: 'Teleférico Puerto Plata',
    location: { city: 'Puerto Plata', country: 'República Dominicana' },
    category: 'Aventura',
    entryFee: { amount: 18, currency: 'USD', period: 'person' },
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'],
    description: 'Teleférico que sube al Monte Isabel de Torres con vistas panorámicas',
    highlights: ['Vistas panorámicas', 'Aventura', 'Jardín botánico'],
    rating: 4.3,
    reviews: 876,
    openingHours: '8:30 AM - 5:00 PM',
    timeNeeded: '2-3 horas',
    accessibility: true,
    isFavorite: false
  },
  {
    id: 'attraction_5',
    name: 'Isla Saona',
    location: { city: 'La Altagracia', country: 'República Dominicana' },
    category: 'Playa',
    entryFee: { amount: 89, currency: 'USD', period: 'person' },
    images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400'],
    description: 'Isla paradisíaca con playas vírgenes y aguas cristalinas',
    highlights: ['Playa virgen', 'Snorkel', 'Relajación'],
    rating: 4.8,
    reviews: 4567,
    openingHours: 'Tours 8:00 AM - 4:00 PM',
    timeNeeded: 'Día completo',
    accessibility: false,
    isFavorite: false
  },
  {
    id: 'attraction_6',
    name: 'Cascadas de Damajagua',
    location: { city: 'Puerto Plata', country: 'República Dominicana' },
    category: 'Aventura',
    entryFee: { amount: 35, currency: 'USD', period: 'person' },
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'],
    description: '27 cascadas naturales donde puedes saltar y deslizarte',
    highlights: ['Aventura', 'Naturaleza', 'Adrenalina'],
    rating: 4.6,
    reviews: 2134,
    openingHours: '8:00 AM - 4:00 PM',
    timeNeeded: '4-5 horas',
    accessibility: false,
    isFavorite: false
  }
];

// Datos combinados para fácil importación
export const SAMPLE_DATA = {
  hotels: SAMPLE_HOTELS,
  cruises: SAMPLE_CRUISES,
  attractions: SAMPLE_ATTRACTIONS
};

export default SAMPLE_DATA;