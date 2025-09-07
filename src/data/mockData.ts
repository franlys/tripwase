import { Hotel, Cruise, TouristAttraction, Event, FlightOffer, Restaurant, CategoryData } from '../types/homepage';

export const mockHotels: Hotel[] = [
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
  }
];

export const mockCruises: Cruise[] = [
  {
    id: 'cruise-1',
    name: 'Caribe Mágico',
    shipName: 'Royal Caribbean Navigator',
    cruiseLine: 'Royal Caribbean',
    route: [
      { city: 'Miami', country: 'Estados Unidos' },
      { city: 'Nassau', country: 'Bahamas' }
    ],
    duration: 7,
    price: { currency: 'USD', amount: 899, period: 'person' },
    images: ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400'],
    description: 'Crucero de 7 días por el Caribe',
    highlights: ['Todo incluido', 'Espectáculos'],
    inclusions: ['Comidas', 'Entretenimiento'],
    departure: new Date('2024-03-15'),
    capacity: 3000,
    rating: 4.7,
    reviews: 892,
    isFavorite: false
  }
];

export const mockAttractions: TouristAttraction[] = [
  {
    id: 'attraction-1',
    name: 'Machu Picchu',
    type: 'historical',
    location: { city: 'Cusco', country: 'Perú' },
    images: ['https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400'],
    description: 'Ciudadela inca patrimonio de la humanidad',
    highlights: ['Patrimonio UNESCO'],
    bestTimeToVisit: ['Mayo', 'Junio'],
    entryFee: { currency: 'USD', amount: 45, period: 'person' },
    openingHours: '6:00 AM - 5:30 PM',
    rating: 4.9,
    reviews: 15678,
    visitDuration: '4-6 horas',
    accessibility: false,
    isFavorite: false
  }
];

export const mockEvents: Event[] = [
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
  }
];

export const mockFlights: FlightOffer[] = [
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
  }
];

export const mockRestaurants: Restaurant[] = [
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