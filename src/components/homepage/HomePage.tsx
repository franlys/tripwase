// src/components/homepage/HomePage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Star,
  Users,
  Plane,
  Calendar,
  Shield,
  Award,
  TrendingUp,
  Heart,
  ArrowRight,
  Mail,
  Phone,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useRecommendations } from '../../hooks/useRecommendations';
import { SAMPLE_DATA } from '../../data/sampleData';

interface HomePageProps {
  onNavigateToPlanner: () => void;
}

// Helper functions para manejar diferentes tipos de datos (FUERA del componente)
const getItemPrice = (item: any) => {
  if (item?.price) return item.price;
  if (item?.entryFee) return item.entryFee;
  return { amount: 0, currency: 'EUR', period: 'night' };
};

const getItemLocation = (item: any) => {
  if (item?.location) return item.location;
  if (item?.departurePort) return { city: item.departurePort, country: 'Unknown' };
  return { city: 'Ubicación exclusiva', country: 'Unknown' };
};

const getItemAmenities = (item: any) => {
  if (item?.amenities) return item.amenities;
  if (item?.highlights) return item.highlights;
  return [];
};

const HomePage: React.FC<HomePageProps> = ({ onNavigateToPlanner }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const {
    favorites,
    toggleFavorite,
    getTotalFavorites,
    isFavorite
  } = useFavorites();

  // MEMOIZAR el objeto favorites para evitar el bucle infinito
  const memoizedFavorites = useMemo(() => ({
    hotels: favorites.hotels,
    cruises: favorites.cruises,
    attractions: favorites.attractions
  }), [favorites.hotels, favorites.cruises, favorites.attractions]);

  // MEMOIZAR availableItems también por seguridad
  const memoizedAvailableItems = useMemo(() => SAMPLE_DATA, []);

  const {
    recommendations,
    userProfile,
    isLoading: recommendationsLoading,
    hasSufficientData,
    getTopRecommendations,
    stats: recommendationStats
  } = useRecommendations({
    favorites: memoizedFavorites,
    availableItems: memoizedAvailableItems,
    enabled: true
  });

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const featuredDestinations = [
    {
      id: 'hotel_sample_1',
      name: 'Santorini, Grecia',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop',
      price: { amount: 899, currency: 'EUR', period: 'night' },
      rating: 4.9,
      duration: '7 días',
      type: 'Romance',
      badge: 'Más Popular',
      location: { city: 'Santorini', country: 'Grecia' },
      amenities: ['Vista al mar', 'Spa', 'Piscina infinita'],
      description: 'Experiencia romántica en las islas griegas'
    },
    {
      id: 'hotel_sample_2',
      name: 'Bali, Indonesia',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop',
      price: { amount: 1299, currency: 'EUR', period: 'night' },
      rating: 4.8,
      duration: '10 días',
      type: 'Aventura',
      badge: 'Trending',
      location: { city: 'Bali', country: 'Indonesia' },
      amenities: ['Todo incluido', 'Actividades acuáticas', 'Spa'],
      description: 'Aventura tropical en el paraíso'
    },
    {
      id: 'hotel_sample_3',
      name: 'Tokio, Japón',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
      price: { amount: 1899, currency: 'EUR', period: 'night' },
      rating: 4.9,
      duration: '8 días',
      type: 'Cultura',
      badge: 'Premium',
      location: { city: 'Tokio', country: 'Japón' },
      amenities: ['WiFi gratis', 'Restaurante', 'Ubicación céntrica'],
      description: 'Inmersión cultural en la metrópoli japonesa'
    },
    {
      id: 'hotel_sample_4',
      name: 'Machu Picchu, Perú',
      image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&h=300&fit=crop',
      price: { amount: 1499, currency: 'EUR', period: 'night' },
      rating: 4.7,
      duration: '6 días',
      type: 'Historia',
      badge: 'Épico',
      location: { city: 'Cusco', country: 'Perú' },
      amenities: ['Guía experto', 'Transporte incluido', 'Comidas'],
      description: 'Descubre las maravillas del imperio inca'
    },
    {
      id: 'hotel_sample_5',
      name: 'Dubái, EAU',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop',
      price: { amount: 2299, currency: 'EUR', period: 'night' },
      rating: 4.8,
      duration: '5 días',
      type: 'Lujo',
      badge: 'Exclusivo',
      location: { city: 'Dubái', country: 'EAU' },
      amenities: ['Lujo 5 estrellas', 'Spa premium', 'Butler personal'],
      description: 'Experiencia de lujo en el desierto moderno'
    },
    {
      id: 'hotel_sample_6',
      name: 'Islandia',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      price: { amount: 1799, currency: 'EUR', period: 'night' },
      rating: 4.9,
      duration: '9 días',
      type: 'Naturaleza',
      badge: 'Único',
      location: { city: 'Reikiavik', country: 'Islandia' },
      amenities: ['Eco-friendly', 'Auroras boreales', 'Aguas termales'],
      description: 'Aventura natural en la tierra del hielo y fuego'
    }
  ];

  const travelCategories = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Viajes Románticos',
      description: 'Destinos perfectos para parejas',
      count: '150+ destinos',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Viajes Familiares',
      description: 'Diversión para toda la familia',
      count: '200+ opciones',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Aventuras Extremas',
      description: 'Para los más aventureros',
      count: '80+ experiencias',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Viajes de Lujo',
      description: 'Experiencias premium exclusivas',
      count: '50+ hoteles 5★',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Cultura & Historia',
      description: 'Sumérgete en nuevas culturas',
      count: '300+ sitios',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Escapadas de Fin de Semana',
      description: 'Perfectas para recargar energías',
      count: '100+ ciudades',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const testimonials = [
    {
      name: 'María González',
      location: 'Madrid, España',
      text: 'TripWase nos ayudó a planificar el viaje perfecto a Japón. Todo estuvo increíblemente organizado y vivimos experiencias únicas.',
      rating: 5,
      trip: 'Tokio & Kyoto',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Carlos Mendoza',
      location: 'Santo Domingo, RD',
      text: 'La mejor plataforma para planificar viajes. Las recomendaciones fueron exactamente lo que buscábamos para nuestra luna de miel.',
      rating: 5,
      trip: 'Santorini, Grecia',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Ana Rodríguez',
      location: 'Barcelona, España',
      text: 'Increíble experiencia familiar en Bali. TripWase consideró todas nuestras necesidades y presupuesto.',
      rating: 5,
      trip: 'Bali, Indonesia',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Viajeros Felices', icon: <Users className="w-6 h-6" /> },
    { number: '120+', label: 'Países Visitados', icon: <Globe className="w-6 h-6" /> },
    { number: '15K+', label: 'Viajes Creados', icon: <Plane className="w-6 h-6" /> },
    { number: '4.9★', label: 'Calificación Promedio', icon: <Star className="w-6 h-6" /> }
  ];

  const specialOffers = [
    {
      title: 'Oferta Early Bird',
      description: 'Reserva con 3 meses de anticipación',
      discount: '25% OFF',
      color: 'from-green-500 to-emerald-600',
      icon: <Calendar className="w-6 h-6" />
    },
    {
      title: 'Grupos de 6+',
      description: 'Descuentos especiales para grupos',
      discount: '30% OFF',
      color: 'from-blue-500 to-indigo-600',
      icon: <Users className="w-6 h-6" />
    },
    {
      title: 'Primera Vez',
      description: 'Descuento para nuevos usuarios',
      discount: '15% OFF',
      color: 'from-purple-500 to-pink-600',
      icon: <Award className="w-6 h-6" />
    }
  ];

  const handleItemClick = (item: any, type: string) => {
    console.log(`Clicked on ${type}:`, item);
    // Aquí implementarías la navegación al detalle del item
  };

  const handleFavoriteToggle = (destination: any) => {
    // Convertir el destino a formato compatible con el sistema de favoritos
    const destinationPrice = getItemPrice(destination);
    const destinationLocation = getItemLocation(destination);
    const destinationAmenities = getItemAmenities(destination);

    const hotelData = {
      id: destination.id,
      name: destination.name,
      location: destinationLocation,
      price: {
        amount: destinationPrice.amount,
        currency: destinationPrice.currency || 'EUR',
        period: destinationPrice.period || 'night'
      },
      images: [destination.image],
      amenities: destinationAmenities,
      description: destination.description,
      rating: destination.rating,
      reviews: Math.floor(Math.random() * 1000) + 100,
      highlights: destinationAmenities,
      availability: true,
      stars: Math.ceil(destination.rating),
      isFavorite: false
    };

    toggleFavorite(hotelData, 'hotels');
  };

  const renderRecommendationsSection = () => {
    if (!hasSufficientData) return null;

    const topRecommendations = getTopRecommendations(6);

    return (
      <section className="recommendations-section bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="container-premium">
          <div className="section-header-premium text-center mb-12">
            <div className="inline-flex items-center bg-white rounded-full px-4 py-2 mb-4 shadow-sm">
              <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Recomendado especialmente para ti</span>
            </div>
            <h2 className="section-title-premium">Tus Próximos Destinos Ideales</h2>
            <p className="section-subtitle-premium">
              Basado en tus {getTotalFavorites()} destinos favoritos, hemos encontrado estos lugares perfectos para ti
            </p>
            {userProfile && (
              <div className="mt-4 text-sm text-gray-600">
                <span>Presupuesto: €{userProfile.budgetRange.min} - €{userProfile.budgetRange.max}</span>
                <span className="mx-2">•</span>
                <span>Ciudades favoritas: {userProfile.preferredLocations.slice(0, 2).join(', ')}</span>
              </div>
            )}
          </div>

          {recommendationsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {topRecommendations.map((rec) => {
                  const item = rec.item;
                  if (!item) return null;

                  const currentItemPrice = getItemPrice(item);
                  const currentItemLocation = getItemLocation(item);

                  return (
                    <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                      <div className="relative">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                          {Math.round(rec.score)}% match
                        </div>
                        <button
                          onClick={() => handleFavoriteToggle({
                            id: item.id,
                            name: item.name,
                            price: currentItemPrice,
                            rating: item.rating,
                            image: item.images?.[0],
                            description: item.description,
                            location: currentItemLocation,
                            amenities: getItemAmenities(item)
                          })}
                          className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${isFavorite(item.id, 'hotels') ? 'text-red-500 fill-current' : 'text-gray-600 hover:text-red-500'}`} />
                        </button>
                      </div>

                      <div className="p-6">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{item.name}</h3>

                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{currentItemLocation.city}</span>
                        </div>

                        {item.rating && (
                          <div className="flex items-center mb-3">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-gray-900 ml-1">{item.rating}</span>
                            <span className="text-sm text-gray-500 ml-1">({item.reviews || 'N/A'} reseñas)</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-blue-600">
                            €{currentItemPrice.amount}
                          </span>
                          <span className="text-sm text-gray-500">
                            {currentItemPrice.period === 'person' ? 'por persona' : 'por noche'}
                          </span>
                        </div>

                        <div className="border-t pt-4">
                          <p className="text-xs font-medium text-gray-700 mb-2">¿Por qué te lo recomendamos?</p>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {rec.reasons.slice(0, 2).join('. ')}
                          </p>
                        </div>

                        <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium">
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowRecommendations(!showRecommendations)}
                  className="inline-flex items-center bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-full font-medium hover:bg-blue-600 hover:text-white transition-all"
                >
                  Ver todas las recomendaciones
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>

              {recommendationStats.totalRecommendations > 0 && (
                <div className="mt-8 bg-white/50 rounded-lg p-6 text-center">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{recommendationStats.totalRecommendations}</div>
                      <div className="text-sm text-gray-600">Recomendaciones totales</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{recommendationStats.highScoreRecommendations}</div>
                      <div className="text-sm text-gray-600">Matches de alta calidad</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{Math.round(recommendationStats.averageScore)}%</div>
                      <div className="text-sm text-gray-600">Puntuación promedio</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    );
  };

  const renderCategoryCards = (items: any[], type: string, title: string) => {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.slice(0, 8).map(item => {
            const currentItemPrice = getItemPrice(item);
            const currentItemLocation = getItemLocation(item);

            return (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleItemClick(item, type)}
              >
                <div className="relative">
                  <img
                    src={item.images?.[0] || '/placeholder-image.jpg'}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavoriteToggle(item);
                    }}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                      isFavorite(item.id, type as any)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 hover:bg-white text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite(item.id, type as any) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{item.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {currentItemLocation.city}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">
                      €{currentItemPrice.amount}
                    </span>
                    {item.rating && (
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600 ml-1">{item.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="homepage-professional">
      {/* Hero Section Mejorado */}
      <section className="hero-premium">
        <div className="hero-content-premium">
          <div className="hero-badge">
            <Shield className="w-4 h-4" />
            <span>Plataforma de Viajes #1 en España</span>
          </div>
          <h1 className="hero-title-premium">
            Crea el <span className="text-gradient">Viaje Perfecto</span> para ti
          </h1>
          <p className="hero-subtitle-premium">
            Nuestra IA planifica itinerarios personalizados considerando tus gustos,
            presupuesto y preferencias. Más de 50,000 viajeros confían en nosotros.
          </p>
          <div className="hero-actions">
            <button onClick={onNavigateToPlanner} className="btn-premium-primary">
              <Plane className="w-5 h-5" />
              Planificar Mi Viaje
            </button>
            <button className="btn-premium-secondary">
              <MapPin className="w-5 h-5" />
              Ver Destinos
            </button>
          </div>

          {/* Badge de favoritos si existen */}
          {getTotalFavorites() > 0 && (
            <div className="mt-4 inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <Heart className="w-4 h-4 text-red-400 mr-2 fill-current" />
              <span className="text-white text-sm">
                {getTotalFavorites()} destinos en tu lista de favoritos
              </span>
            </div>
          )}

          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Recomendaciones Personalizadas */}
      {hasSufficientData && renderRecommendationsSection()}

      {/* Categorías de Viaje */}
      <section className="travel-categories">
        <div className="container-premium">
          <div className="section-header-premium">
            <h2 className="section-title-premium">Encuentra tu Estilo de Viaje</h2>
            <p className="section-subtitle-premium">
              Tenemos la experiencia perfecta para cada tipo de viajero
            </p>
          </div>
          <div className="categories-grid">
            {travelCategories.map((category, index) => (
              <div key={index} className="category-card">
                <div className={`category-icon bg-gradient-to-br ${category.color}`}>
                  {category.icon}
                </div>
                <h3 className="category-title">{category.title}</h3>
                <p className="category-description">{category.description}</p>
                <span className="category-count">{category.count}</span>
                <button className="category-btn">
                  Explorar <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinos Destacados */}
      <section className="featured-destinations">
        <div className="container-premium">
          <div className="section-header-premium">
            <h2 className="section-title-premium">Destinos Destacados</h2>
            <p className="section-subtitle-premium">
              Los destinos más populares seleccionados por nuestros expertos
            </p>
          </div>
          <div className="destinations-grid">
            {featuredDestinations.map((destination) => (
              <div key={destination.id} className="destination-card">
                <div className="destination-image-container">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="destination-image"
                  />
                  <div className="destination-badge">{destination.badge}</div>
                  <button
                    onClick={() => handleFavoriteToggle(destination)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                      isFavorite(destination.id, 'hotels')
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 hover:bg-white text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite(destination.id, 'hotels') ? 'fill-current' : ''}`} />
                  </button>
                  <div className="destination-overlay">
                    <button className="destination-cta">Ver Detalles</button>
                  </div>
                </div>
                <div className="destination-content">
                  <div className="destination-header">
                    <h3 className="destination-name">{destination.name}</h3>
                    <div className="destination-rating">
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      <span>{destination.rating}</span>
                    </div>
                  </div>
                  <div className="destination-meta">
                    <span className="destination-type">{destination.type}</span>
                    <span className="destination-duration">{destination.duration}</span>
                  </div>
                  <div className="destination-footer">
                    <span className="destination-price">Desde €{destination.price.amount}</span>
                    <button className="destination-book">Reservar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ofertas Especiales */}
      <section className="special-offers">
        <div className="container-premium">
          <div className="section-header-premium">
            <h2 className="section-title-premium">Ofertas Especiales</h2>
            <p className="section-subtitle-premium">
              Descuentos exclusivos por tiempo limitado
            </p>
          </div>
          <div className="offers-grid">
            {specialOffers.map((offer, index) => (
              <div key={index} className="offer-card">
                <div className={`offer-header bg-gradient-to-br ${offer.color}`}>
                  <div className="offer-icon">{offer.icon}</div>
                  <div className="offer-discount">{offer.discount}</div>
                </div>
                <div className="offer-content">
                  <h3 className="offer-title">{offer.title}</h3>
                  <p className="offer-description">{offer.description}</p>
                  <button className="offer-btn">Aprovechar Oferta</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="testimonials">
        <div className="container-premium">
          <div className="section-header-premium text-center">
            <h2 className="section-title-premium">Lo Que Dicen Nuestros Viajeros</h2>
            <p className="section-subtitle-premium">
              Historias de éxito de viajeros que crearon el itinerario de sus sueños
            </p>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-quote">
              <span className="text-gray-400 text-6xl font-serif">“</span>
              <p>{testimonials[currentTestimonial].text}</p>
            </div>
            <div className="testimonial-author">
              <img
                src={testimonials[currentTestimonial].avatar}
                alt={testimonials[currentTestimonial].name}
                className="testimonial-avatar"
              />
              <div className="author-details">
                <p className="author-name">{testimonials[currentTestimonial].name}</p>
                <p className="author-location">{testimonials[currentTestimonial].location}</p>
                <p className="author-trip">Viaje a {testimonials[currentTestimonial].trip}</p>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < testimonials[currentTestimonial].rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="testimonial-nav">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="contact-section">
        <div className="container-premium">
          <div className="contact-card">
            <div className="contact-info">
              <h2 className="contact-title">¿Listo para tu próxima aventura?</h2>
              <p className="contact-subtitle">
                Contáctanos y uno de nuestros expertos te ayudará a planificar el viaje de tus sueños.
              </p>
              <div className="contact-details">
                <p className="detail-item">
                  <Mail className="w-5 h-5" /> info@tripwase.com
                </p>
                <p className="detail-item">
                  <Phone className="w-5 h-5" /> +34 91 123 45 67
                </p>
                <div className="social-links">
                  <a href="#" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
                  <a href="#" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
                  <a href="#" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <h3 className="form-title">Envíanos un mensaje</h3>
              <form>
                <input type="text" placeholder="Tu Nombre" className="form-input" />
                <input type="email" placeholder="Tu Email" className="form-input" />
                <textarea placeholder="Tu Mensaje" rows={4} className="form-textarea"></textarea>
                <button type="submit" className="form-submit-btn">Enviar Mensaje</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-premium">
        <div className="container-premium">
          <div className="footer-content">
            <div className="footer-col">
              <h4 className="footer-heading">TripWase</h4>
              <p className="footer-text">
                Planifica viajes únicos con IA. Creamos itinerarios personalizados, experiencias a medida y memorias inolvidables.
              </p>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Navegación</h4>
              <ul>
                <li><a href="#">Inicio</a></li>
                <li><a href="#">Destinos</a></li>
                <li><a href="#">Servicios</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Contacto</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Legales</h4>
              <ul>
                <li><a href="#">Términos y Condiciones</a></li>
                <li><a href="#">Política de Privacidad</a></li>
                <li><a href="#">Política de Cookies</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Síguenos</h4>
              <div className="footer-social">
                <a href="#" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
                <a href="#" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
                <a href="#" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 TripWase. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;