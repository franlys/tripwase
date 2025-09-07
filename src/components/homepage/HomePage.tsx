// src/components/homepage/HomePage.tsx
import React, { useState, useEffect } from 'react';
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
  Twitter
} from 'lucide-react';

interface HomePageProps {
  onNavigateToPlanner: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToPlanner }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const featuredDestinations = [
    {
      id: 1,
      name: 'Santorini, Grecia',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop',
      price: '€899',
      rating: 4.9,
      duration: '7 días',
      type: 'Romance',
      badge: 'Más Popular'
    },
    {
      id: 2,
      name: 'Bali, Indonesia',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop',
      price: '€1,299',
      rating: 4.8,
      duration: '10 días',
      type: 'Aventura',
      badge: 'Trending'
    },
    {
      id: 3,
      name: 'Tokio, Japón',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
      price: '€1,899',
      rating: 4.9,
      duration: '8 días',
      type: 'Cultura',
      badge: 'Premium'
    },
    {
      id: 4,
      name: 'Machu Picchu, Perú',
      image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&h=300&fit=crop',
      price: '€1,499',
      rating: 4.7,
      duration: '6 días',
      type: 'Historia',
      badge: 'Épico'
    },
    {
      id: 5,
      name: 'Dubái, EAU',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop',
      price: '€2,299',
      rating: 4.8,
      duration: '5 días',
      type: 'Lujo',
      badge: 'Exclusivo'
    },
    {
      id: 6,
      name: 'Islandia',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      price: '€1,799',
      rating: 4.9,
      duration: '9 días',
      type: 'Naturaleza',
      badge: 'Único'
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
                    <span className="destination-price">Desde {destination.price}</span>
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
          <div className="section-header-premium">
            <h2 className="section-title-premium">Lo que Dicen Nuestros Viajeros</h2>
            <p className="section-subtitle-premium">
              Historias reales de experiencias extraordinarias
            </p>
          </div>
          <div className="testimonial-container">
            <div className="testimonial-active">
              <div className="testimonial-content">
                <div className="testimonial-stars">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                  ))}
                </div>
                <blockquote className="testimonial-text">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                <div className="testimonial-author">
                  <img 
                    src={testimonials[currentTestimonial].avatar} 
                    alt={testimonials[currentTestimonial].name}
                    className="testimonial-avatar"
                  />
                  <div className="testimonial-info">
                    <div className="testimonial-name">{testimonials[currentTestimonial].name}</div>
                    <div className="testimonial-location">{testimonials[currentTestimonial].location}</div>
                    <div className="testimonial-trip">Viaje a {testimonials[currentTestimonial].trip}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`testimonial-dot ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container-premium">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h2 className="newsletter-title">¿Listo para tu Próxima Aventura?</h2>
              <p className="newsletter-subtitle">
                Recibe ofertas exclusivas, destinos trending y consejos de viaje directamente en tu inbox
              </p>
            </div>
            <div className="newsletter-form">
              <div className="newsletter-input-group">
                <Mail className="w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  placeholder="tu@email.com"
                  className="newsletter-input"
                />
                <button className="newsletter-btn">Suscribirse</button>
              </div>
              <p className="newsletter-privacy">
                No spam. Solo las mejores ofertas de viaje.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Premium */}
      <footer className="footer-premium">
        <div className="container-premium">
          <div className="footer-content">
            <div className="footer-brand">
              <h3 className="footer-logo">TripWase</h3>
              <p className="footer-description">
                La plataforma de planificación de viajes más inteligente del mundo. 
                Creamos experiencias únicas adaptadas a ti.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="social-link"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="social-link"><Twitter className="w-5 h-5" /></a>
              </div>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h4 className="footer-title">Destinos</h4>
                <a href="#" className="footer-link">Europa</a>
                <a href="#" className="footer-link">Asia</a>
                <a href="#" className="footer-link">América</a>
                <a href="#" className="footer-link">África</a>
                <a href="#" className="footer-link">Oceanía</a>
              </div>
              
              <div className="footer-column">
                <h4 className="footer-title">Viajes</h4>
                <a href="#" className="footer-link">Románticos</a>
                <a href="#" className="footer-link">Familiares</a>
                <a href="#" className="footer-link">Aventura</a>
                <a href="#" className="footer-link">Lujo</a>
                <a href="#" className="footer-link">Negocios</a>
              </div>
              
              <div className="footer-column">
                <h4 className="footer-title">Soporte</h4>
                <a href="#" className="footer-link">Centro de Ayuda</a>
                <a href="#" className="footer-link">Contacto</a>
                <a href="#" className="footer-link">Términos</a>
                <a href="#" className="footer-link">Privacidad</a>
              </div>
              
              <div className="footer-column">
                <h4 className="footer-title">Contacto</h4>
                <div className="footer-contact">
                  <Phone className="w-4 h-4" />
                  <span>+34 900 123 456</span>
                </div>
                <div className="footer-contact">
                  <Mail className="w-4 h-4" />
                  <span>hola@tripwase.com</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 TripWase. Todos los derechos reservados.</p>
            <p>Hecho con ❤️ para viajeros como tú</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;