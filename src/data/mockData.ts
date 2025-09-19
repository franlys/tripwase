import { Hotel, Cruise, TouristAttraction, Event, FlightOffer, Restaurant, CategoryData } from '../types/homepage';

export const mockHotels: Hotel[] = [
  // TUS HOTELES EXISTENTES (mantenidos exactamente igual)
  {
    id: 'hotel-1',
    name: 'Marriott Santo Domingo',
    location: { city: 'Santo Domingo', country: 'República Dominicana' },
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'],
    stars: 5,
    price: { currency: 'USD', amount: 180, period: 'night' },
    amenities: ['WiFi', 'Pool', 'Gym'],
    description: 'Hotel de lujo',
    rating: 4.8,
    reviews: 342,
    highlights: ['Centro histórico'],
    availability: true,
    isFavorite: false
  },
  {
    id: 'hotel-2',
    name: 'Casa Colonial Beach',
    location: { city: 'Punta Cana', country: 'República Dominicana' },
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400'],
    stars: 4,
    price: { currency: 'USD', amount: 220, period: 'night' },
    amenities: ['All Inclusive', 'Beach'],
    description: 'Resort frente al mar',
    rating: 4.6,
    reviews: 567,
    highlights: ['Playa privada'],
    availability: true,
    isFavorite: false
  },
  
  // NUEVOS HOTELES AGREGADOS
  {
    id: 'hotel-3',
    name: 'Iberostar Selection Bávaro',
    location: { city: 'Punta Cana', country: 'República Dominicana' },
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400'],
    stars: 5,
    price: { currency: 'USD', amount: 280, period: 'night' },
    amenities: ['Todo Incluido', 'Golf', 'Spa', 'Kids Club', '6 Restaurantes'],
    description: 'Resort de lujo todo incluido con campo de golf',
    rating: 4.7,
    reviews: 1234,
    highlights: ['Campo de golf', 'Múltiples restaurantes', 'Spa completo'],
    availability: true,
    isFavorite: false
  },
  {
    id: 'hotel-4',
    name: 'Fontainebleau Miami Beach',
    location: { city: 'Miami', country: 'Estados Unidos' },
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400'],
    stars: 5,
    price: { currency: 'USD', amount: 450, period: 'night' },
    amenities: ['Playa Privada', 'Múltiples Piscinas', 'Spa LIV', 'Clubs Nocturnos'],
    description: 'Icónico resort de lujo en South Beach',
    rating: 4.6,
    reviews: 2891,
    highlights: ['Ubicación South Beach', 'Vida nocturna', 'Spa de clase mundial'],
    availability: true,
    isFavorite: false
  },
  {
    id: 'hotel-5',
    name: 'Hotel Casa San Agustín',
    location: { city: 'Cartagena', country: 'Colombia' },
    images: ['https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=400'],
    stars: 5,
    price: { currency: 'USD', amount: 320, period: 'night' },
    amenities: ['Centro Histórico', 'Spa', 'Piscina', 'Restaurante Gourmet'],
    description: 'Hotel boutique en mansión colonial restaurada',
    rating: 4.8,
    reviews: 567,
    highlights: ['Arquitectura colonial', 'Centro histórico', 'Servicio personalizado'],
    availability: true,
    isFavorite: false
  },
  {
    id: 'hotel-6',
    name: 'Grand Palladium Palace Resort',
    location: { city: 'Punta Cana', country: 'República Dominicana' },
    images: ['https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=400'],
    stars: 4,
    price: { currency: 'USD', amount: 195, period: 'night' },
    amenities: ['Todo Incluido', 'Waterpark', 'Múltiples Playas', 'Entretenimiento'],
    description: 'Complejo familiar con actividades para todas las edades',
    rating: 4.4,
    reviews: 3456,
    highlights: ['Parque acuático', 'Entretenimiento familiar', 'Múltiples playas'],
    availability: true,
    isFavorite: false
  }
];

export const mockCruises: Cruise[] = [
  // TU CRUCERO EXISTENTE CORREGIDO
  {
    id: 'cruise-1',
    name: 'Caribe Mágico',
    shipName: 'Royal Caribbean Navigator',
    cruiseLine: 'Royal Caribbean',
    departurePort: 'Miami', // CORREGIDO: era route[0]
    destinations: ['Nassau'], // CORREGIDO: era route (solo nombres de ciudades)
    duration: 7,
    price: { currency: 'USD', amount: 899, period: 'person' },
    images: ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400'],
    amenities: ['Todo incluido', 'Espectáculos', 'Comidas', 'Entretenimiento'], // CORREGIDO: combiné highlights e inclusions
    description: 'Crucero de 7 días por el Caribe',
    highlights: ['Todo incluido', 'Espectáculos'],
    rating: 4.7,
    reviews: 892,
    capacity: 3000,
    quickPlanAvailable: true,
    isFavorite: false
  },
  
  // NUEVOS CRUCEROS AGREGADOS CORREGIDOS
  {
    id: 'cruise-2',
    name: 'Caribe Oriental desde La Romana',
    shipName: 'Celebrity Edge',
    cruiseLine: 'Celebrity Cruises',
    departurePort: 'La Romana', // CORREGIDO: era route[0]
    destinations: ['Charlotte Amalie', 'Philipsburg'], // CORREGIDO: era route (sin repetir puerto de salida)
    duration: 7,
    price: { currency: 'USD', amount: 1299, period: 'person' },
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400'],
    amenities: ['Todas las comidas', 'Entretenimiento', 'Actividades deportivas'], // CORREGIDO: de inclusions
    description: 'Crucero de lujo por el Caribe Oriental con puertos únicos',
    highlights: ['Duty-free shopping', 'Playas vírgenes', 'Gastronomía internacional'],
    rating: 4.8,
    reviews: 1456,
    capacity: 2800,
    quickPlanAvailable: true,
    isFavorite: false
  },
  {
    id: 'cruise-3',
    name: 'Mediterráneo Clásico',
    shipName: 'MSC Seaside',
    cruiseLine: 'MSC Cruises',
    departurePort: 'Barcelona', // CORREGIDO: era route[0]
    destinations: ['Roma', 'Nápoles'], // CORREGIDO: era route (sin repetir puerto de salida)
    duration: 10,
    price: { currency: 'EUR', amount: 1599, period: 'person' },
    images: ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'],
    amenities: ['Comidas gourmet', 'Excursiones guiadas', 'Entretenimiento'], // CORREGIDO: de inclusions
    description: 'Descubre las joyas del Mediterráneo en un crucero de lujo',
    highlights: ['Puertos históricos', 'Gastronomía mediterránea', 'Arte y cultura'],
    rating: 4.6,
    reviews: 2134,
    capacity: 3200,
    quickPlanAvailable: true,
    isFavorite: false
  }
];

export const mockAttractions: TouristAttraction[] = [
  // TU ATRACCIÓN EXISTENTE CORREGIDA
  {
    id: 'attraction-1',
    name: 'Machu Picchu',
    category: 'historical', // CORREGIDO: era type
    location: { city: 'Cusco', country: 'Perú' },
    images: ['https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400'],
    description: 'Ciudadela inca patrimonio de la humanidad',
    highlights: ['Patrimonio UNESCO'],
    entryFee: { currency: 'USD', amount: 45, period: 'person' },
    openingHours: '6:00 AM - 5:30 PM',
    timeNeeded: '4-6 horas', // CORREGIDO: era visitDuration
    rating: 4.9,
    reviews: 15678,
    accessibility: false,
    isFavorite: false
  },
  
  // NUEVAS ATRACCIONES AGREGADAS CORREGIDAS
  {
    id: 'attraction-2',
    name: 'Playa Bávaro',
    category: 'nature', // CORREGIDO: era type
    location: { city: 'Punta Cana', country: 'República Dominicana' },
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400'],
    description: 'Una de las mejores playas del mundo con arena blanca y aguas cristalinas',
    highlights: ['Deportes acuáticos', 'Restaurantes frente al mar', 'Atardeceres espectaculares'],
    entryFee: { currency: 'USD', amount: 0, period: 'person' },
    openingHours: 'Abierto 24 horas',
    timeNeeded: '4+ horas', // CORREGIDO: era visitDuration
    rating: 4.8,
    reviews: 5432,
    accessibility: true,
    isFavorite: false
  },
  {
    id: 'attraction-3',
    name: 'Zona Colonial de Santo Domingo',
    category: 'historical', // CORREGIDO: era type
    location: { city: 'Santo Domingo', country: 'República Dominicana' },
    images: ['https://images.unsplash.com/photo-1555391818-6d7c56c5e24b?w=400'],
    description: 'Primera ciudad europea del Nuevo Mundo con arquitectura colonial',
    highlights: ['Catedral Primada', 'Alcázar de Colón', 'Calle Las Damas'],
    entryFee: { currency: 'USD', amount: 10, period: 'person' },
    openingHours: '9:00 AM - 6:00 PM',
    timeNeeded: '6 horas', // CORREGIDO: era visitDuration
    rating: 4.7,
    reviews: 3821,
    accessibility: true,
    isFavorite: false
  }
];

export const mockEvents: Event[] = [
  // TU EVENTO EXISTENTE (mantenido exactamente igual)
  {
    id: 'event-1',
    name: 'Festival de Cannes',
    type: 'festival',
    location: { city: 'Cannes', country: 'Francia' },
    venue: 'Palais des Festivals',
    dates: {
      start: new Date('2024-05-14'),
      end: new Date('2024-05-25')
    },
    price: {
      min: { currency: 'EUR', amount: 150, period: 'person' },
      max: { currency: 'EUR', amount: 2500, period: 'person' }
    },
    images: ['https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400'],
    description: 'El festival de cine más prestigioso del mundo',
    highlights: ['Alfombra roja'],
    ticketsAvailable: true,
    capacity: 15000,
    rating: 4.9,
    reviews: 3456,
    quickPlanAvailable: true,
    isFavorite: false
  },
  
  // NUEVOS EVENTOS AGREGADOS
  {
    id: 'event-2',
    name: 'Festival Merengue Santo Domingo',
    type: 'festival',
    location: { city: 'Santo Domingo', country: 'República Dominicana' },
    venue: 'Malecón de Santo Domingo',
    dates: {
      start: new Date('2024-07-26'),
      end: new Date('2024-07-28')
    },
    price: {
      min: { currency: 'USD', amount: 25, period: 'person' },
      max: { currency: 'USD', amount: 150, period: 'person' }
    },
    images: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'],
    description: 'Festival nacional de merengue con los mejores artistas del género',
    highlights: ['Artistas nacionales', 'Cultura dominicana', 'Gastronomía típica'],
    ticketsAvailable: true,
    capacity: 50000,
    rating: 4.6,
    reviews: 1876,
    quickPlanAvailable: true,
    isFavorite: false
  }
];

export const mockFlights: FlightOffer[] = [
  // TU VUELO EXISTENTE (mantenido exactamente igual)
  {
    id: 'flight-1',
    destination: { city: 'París', country: 'Francia' },
    origin: { city: 'Santo Domingo', country: 'República Dominicana' },
    price: { currency: 'USD', amount: 680, period: 'person' },
    airline: 'Air France',
    duration: '9h 15m',
    stops: 1,
    departure: '10:30',
    arrival: '08:45+1',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400',
    dealType: 'popular',
    validUntil: '2024-01-30',
    isFavorite: false
  },
  
  // NUEVOS VUELOS AGREGADOS
  {
    id: 'flight-2',
    destination: { city: 'Miami', country: 'Estados Unidos' },
    origin: { city: 'Santo Domingo', country: 'República Dominicana' },
    price: { currency: 'USD', amount: 380, period: 'person' },
    airline: 'American Airlines',
    duration: '2h 30m',
    stops: 0,
    departure: '14:20',
    arrival: '16:50',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400',
    dealType: 'flash',
    validUntil: '2024-02-15',
    isFavorite: false
  },
  {
    id: 'flight-3',
    destination: { city: 'Barcelona', country: 'España' },
    origin: { city: 'Santo Domingo', country: 'República Dominicana' },
    price: { currency: 'USD', amount: 720, period: 'person' },
    airline: 'Iberia',
    duration: '8h 45m',
    stops: 1,
    departure: '23:55',
    arrival: '16:40+1',
    image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=400',
    dealType: 'best-value',
    validUntil: '2024-03-10',
    isFavorite: false
  }
];

export const mockRestaurants: Restaurant[] = [
  // TU RESTAURANTE EXISTENTE (mantenido exactamente igual)
  {
    id: 'rest-1',
    name: 'Osteria Francescana',
    location: { city: 'Módena', country: 'Italia' },
    cuisine: ['Italiana'],
    priceRange: '$$$$',
    images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'],
    description: 'Restaurante de 3 estrellas Michelin',
    specialties: ['Tortellini'],
    rating: 4.9,
    reviews: 1234,
    openHours: '19:30 - 22:30',
    reservationRequired: true,
    michelin: true,
    isFavorite: false
  },
  
  // NUEVOS RESTAURANTES AGREGADOS
  {
    id: 'rest-2',
    name: 'La Yola Restaurant',
    location: { city: 'Punta Cana', country: 'República Dominicana' },
    cuisine: ['Caribeña', 'Internacional'],
    priceRange: '$$$',
    images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400'],
    description: 'Restaurante frente al mar con especialidades caribeñas',
    specialties: ['Pescado fresco', 'Langosta', 'Mofongo'],
    rating: 4.6,
    reviews: 892,
    openHours: '18:00 - 23:00',
    reservationRequired: true,
    michelin: false,
    isFavorite: false
  },
  {
    id: 'rest-3',
    name: 'Pepperoni Restaurant',
    location: { city: 'Santo Domingo', country: 'República Dominicana' },
    cuisine: ['Dominicana', 'Latina'],
    priceRange: '$$',
    images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'],
    description: 'Auténtica cocina dominicana en el corazón de la capital',
    specialties: ['Mangu', 'Pollo guisado', 'Tostones'],
    rating: 4.4,
    reviews: 1567,
    openHours: '11:00 - 22:00',
    reservationRequired: false,
    michelin: false,
    isFavorite: false
  }
];

export const mockCategoryData: CategoryData = {
  hotels: mockHotels,
  cruises: mockCruises,
  attractions: mockAttractions,
  events: mockEvents,
  flights: mockFlights,
  restaurants: mockRestaurants
};