import React, { useState } from 'react';
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Search, 
  Star, 
  Globe, 
  Mountain, 
  Umbrella, 
  Camera, 
  Coffee,
  ArrowLeft 
} from 'lucide-react';
import { generateThreePlans, SimplePlan, PlanInput } from '../../utils/multiplePlanGenerator';

// Tipos para las categorías
interface TravelCategory {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  count: string;
}

interface Stat {
  icon: React.ReactNode;
  number: string;
  label: string;
}

interface Origin {
  country: string;
  city: string;
  flag?: string;
}

interface TripGeneratorProps {
  onBackToExplore: () => void;
  onShowPlans: (plans: SimplePlan[]) => void;
}

const TripGenerator: React.FC<TripGeneratorProps> = ({ onBackToExplore, onShowPlans }) => {
  // Estados para el formulario
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(1500);
  const [currency, setCurrency] = useState<'EUR' | 'USD' | 'DOP' | 'GBP'>('DOP');
  const [interests, setInterests] = useState<string[]>([]);
  
  // Estados para el nuevo diseño
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<Origin | null>(null);
  const [showOriginModal, setShowOriginModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Datos para las estadísticas del hero
  const stats: Stat[] = [
    {
      icon: <Globe />,
      number: "180+",
      label: "Destinos"
    },
    {
      icon: <Star />,
      number: "50K+",
      label: "Viajeros"
    },
    {
      icon: <Calendar />,
      number: "15K+",
      label: "Viajes"
    },
    {
      icon: <Coffee />,
      number: "4.9",
      label: "Rating"
    }
  ];

  // Categorías de viaje con gradientes específicos para TripWase
  const travelCategories: TravelCategory[] = [
    {
      title: "Aventura",
      description: "Montañismo, trekking, deportes extremos y exploración",
      icon: <Mountain />,
      color: "from-emerald-500 to-green-600",
      count: "45 destinos"
    },
    {
      title: "Playa & Relax",
      description: "Costas paradisíacas, resorts y escapadas tropicales",
      icon: <Umbrella />,
      color: "from-cyan-500 to-blue-600",
      count: "68 destinos"
    },
    {
      title: "Cultural",
      description: "Historia, museos, arquitectura y patrimonio mundial",
      icon: <Camera />,
      color: "from-purple-500 to-pink-600",
      count: "92 destinos"
    },
    {
      title: "Gastronómico",
      description: "Tours culinarios, mercados locales y experiencias gourmet",
      icon: <Coffee />,
      color: "from-amber-500 to-orange-600",
      count: "34 destinos"
    },
    {
      title: "Urbano",
      description: "Ciudades modernas, vida nocturna y experiencias metropolitanas",
      icon: <Globe />,
      color: "from-indigo-500 to-blue-600",
      count: "56 destinos"
    },
    {
      title: "Naturaleza",
      description: "Parques nacionales, safari y observación de vida silvestre",
      icon: <Plane />,
      color: "from-green-500 to-emerald-600",
      count: "29 destinos"
    }
  ];

  // Opciones de origen
  const originOptions: Origin[] = [
    { country: 'República Dominicana', city: 'Santo Domingo', flag: '🇩🇴' },
    { country: 'España', city: 'Madrid', flag: '🇪🇸' },
    { country: 'Estados Unidos', city: 'Nueva York', flag: '🇺🇸' },
    { country: 'México', city: 'Ciudad de México', flag: '🇲🇽' },
    { country: 'Argentina', city: 'Buenos Aires', flag: '🇦🇷' },
    { country: 'Francia', city: 'París', flag: '🇫🇷' }
  ];

  const handleCategorySelect = (categoryTitle: string) => {
    setSelectedCategory(selectedCategory === categoryTitle ? null : categoryTitle);
    // Agregar automáticamente a intereses si se selecciona
    const categoryId = categoryTitle.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
    if (selectedCategory === categoryTitle) {
      setInterests(prev => prev.filter(interest => interest !== categoryId));
    } else {
      setInterests(prev => [...prev.filter(interest => interest !== categoryId), categoryId]);
    }
  };

  const handleOriginSelect = (origin: Origin) => {
    setSelectedOrigin(origin);
    setShowOriginModal(false);
  };

  const handleGenerateTrip = async () => {
    if (!destination || !departureDate || !returnDate || !selectedOrigin) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setIsGenerating(true);
    
    const planInput: PlanInput = {
      destination,
      startDate: departureDate,
      endDate: returnDate,
      travelers,
      budget,
      currency,
      interests,
      origin: selectedOrigin
    };

    try {
      // Simular loading
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const plans = generateThreePlans(planInput);
      onShowPlans(plans);
    } catch (error) {
      console.error('Error generating plans:', error);
      alert('Error al generar los planes. Por favor intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = destination && departureDate && returnDate && selectedOrigin;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <nav className="breadcrumb-nav">
        <div className="container-premium">
          <div className="breadcrumb-items">
            <button onClick={onBackToExplore} className="breadcrumb-link">
              Inicio
            </button>
            <span>/</span>
            <span className="breadcrumb-current">Planificar Viaje</span>
          </div>
        </div>
      </nav>

      {/* Hero Section Mejorado */}
      <section className="hero-premium">
        <div className="container-premium">
          <div className="hero-content">
            <h1 className="hero-title-premium">
              Crea Tu Viaje Perfecto
            </h1>
            <p className="hero-subtitle-premium">
              Descubre destinos increíbles y planifica experiencias únicas. 
              Más de 50,000 viajeros confían en nosotros.
            </p>
            
            {/* Estadísticas */}
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Mostrar origen seleccionado */}
            {selectedOrigin && (
              <div className="origin-display">
                <div className="origin-badge">
                  <Globe className="w-4 h-4" />
                  <span>Viajando desde: {selectedOrigin.flag} {selectedOrigin.city}, {selectedOrigin.country}</span>
                </div>
              </div>
            )}
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
              <div 
                key={index} 
                className={`category-card ${selectedCategory === category.title ? 'ring-4 ring-orange-500 ring-opacity-50' : ''}`}
                onClick={() => handleCategorySelect(category.title)}
                style={{ cursor: 'pointer' }}
              >
                <div className={`category-icon bg-gradient-to-br ${category.color}`}>
                  {category.icon}
                </div>
                <h3 className="category-title">{category.title}</h3>
                <p className="category-description">{category.description}</p>
                <span className="category-count">{category.count}</span>
                <button className="category-btn">
                  {selectedCategory === category.title ? '✓ Seleccionado' : 'Explorar'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario de Planificación Mejorado */}
      <section className="bg-white py-16">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto">
            <div className="card-premium p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Detalles de tu Viaje
                </h2>
                <p className="text-gray-600">
                  Completa la información para generar tu plan personalizado
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Destino y Origen */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    ¿A dónde quieres viajar?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Ej: Punta Cana, República Dominicana"
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all"
                    />
                    <button 
                      onClick={() => setShowOriginModal(true)}
                      className="btn-primary"
                    >
                      <Globe className="w-4 h-4" />
                      {selectedOrigin ? `${selectedOrigin.city}` : 'Seleccionar origen'}
                    </button>
                  </div>
                </div>

                {/* Fechas */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Fecha de salida
                  </label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Fecha de regreso
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={departureDate}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all"
                  />
                </div>

                {/* Viajeros */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-2" />
                    Número de viajeros
                  </label>
                  <select
                    value={travelers}
                    onChange={(e) => setTravelers(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all"
                  >
                    {[1,2,3,4,5,6,7,8].map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'viajero' : 'viajeros'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Presupuesto */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Presupuesto total
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        min="500"
                        step="100"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all"
                      />
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as 'EUR' | 'USD' | 'DOP' | 'GBP')}
                        className="px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all"
                      >
                        <option value="DOP">DOP</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="10000"
                      step="100"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>500 {currency}</span>
                      <span>10,000+ {currency}</span>
                    </div>
                  </div>
                </div>

                {/* Categoría seleccionada */}
                {selectedCategory && (
                  <div className="md:col-span-2">
                    <div className="bg-gradient-light p-4 rounded-lg border-2 border-orange-200">
                      <p className="text-sm text-gray-700">
                        <strong>Estilo seleccionado:</strong> {selectedCategory}
                      </p>
                    </div>
                  </div>
                )}

                {/* Botón de generar */}
                <div className="md:col-span-2">
                  <button
                    onClick={handleGenerateTrip}
                    disabled={!isFormValid || isGenerating}
                    className="w-full btn-primary py-4 px-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                  >
                    {isGenerating ? (
                      <>
                        <div className="loading-spinner"></div>
                        Generando tu viaje perfecto...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        Generar 3 Opciones de Viaje
                      </>
                    )}
                  </button>
                  
                  {!isFormValid && (
                    <p className="text-red-500 text-sm mt-2 text-center">
                      Completa destino, fechas y origen para generar tus planes
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Origen */}
      {showOriginModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Selecciona tu ciudad de origen</h3>
              <p>Esto nos ayuda a calcular vuelos y planificar mejor tu viaje</p>
            </div>
            
            <div className="modal-body">
              {originOptions.map((origin, index) => (
                <button
                  key={index}
                  onClick={() => handleOriginSelect(origin)}
                  className="origin-option"
                >
                  <div className="origin-flag">{origin.flag}</div>
                  <div className="origin-info">
                    <div className="origin-city">{origin.city}</div>
                    <div className="origin-country">{origin.country}</div>
                  </div>
                  <ArrowLeft className="w-5 h-5 rotate-180 text-gray-400" />
                </button>
              ))}
            </div>
            
            <div className="modal-footer">
              <button
                onClick={() => setShowOriginModal(false)}
                className="modal-cancel-btn"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripGenerator;