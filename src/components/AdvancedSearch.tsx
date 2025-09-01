import React, { useState, useEffect } from 'react';
import { useTrip } from '../contexts/TripContext';

interface FilterState {
  query: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  dates: {
    startDate: string;
    endDate: string;
    flexible: boolean;
  };
  travelers: {
    adults: number;
    children: number;
  };
  preferences: {
    climate: string[];
    activities: string[];
    accommodation: string;
  };
}

const AdvancedSearch: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    budget: { min: 100, max: 3000, currency: 'EUR' },
    dates: { startDate: '', endDate: '', flexible: false },
    travelers: { adults: 2, children: 0 },
    preferences: {
      climate: [],
      activities: [],
      accommodation: 'any'
    }
  });

  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'popularity' | 'name'>('popularity');

  const {
    searchQuery,
    searchResults,
    isSearching,
    error,
    searchDestinations,
    updateSearchFilters,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    startTripPlanning
  } = useTrip();

  useEffect(() => {
    setFilters(prev => ({ ...prev, query: searchQuery }));
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
    searchDestinations(query);
  };

  const applyFilters = () => {
    updateSearchFilters({
      budget: filters.budget,
      dates: {
        startDate: filters.dates.startDate || null,
        endDate: filters.dates.endDate || null
      },
      travelers: filters.travelers
    });
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      budget: { min: 100, max: 3000, currency: 'EUR' },
      dates: { startDate: '', endDate: '', flexible: false },
      travelers: { adults: 2, children: 0 },
      preferences: {
        climate: [],
        activities: [],
        accommodation: 'any'
      }
    });
    searchDestinations('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: filters.budget.currency
    }).format(amount);
  };

  const sortedResults = React.useMemo(() => {
    const results = [...searchResults];
    switch (sortBy) {
      case 'price':
        return results.sort((a, b) => a.averagePrice - b.averagePrice);
      case 'popularity':
        return results.sort((a, b) => b.popularityScore - a.popularityScore);
      case 'name':
        return results.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return results;
    }
  }, [searchResults, sortBy]);

  const climateOptions = ['Tropical', 'Templado', 'Mediterráneo', 'Continental', 'Oceánico'];
  const activityOptions = ['Cultura', 'Aventura', 'Playa', 'Montaña', 'Gastronomía', 'Vida Nocturna'];
  const accommodationOptions = [
    { value: 'any', label: 'Cualquiera' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'hostel', label: 'Hostel' },
    { value: 'apartment', label: 'Apartamento' },
    { value: 'resort', label: 'Resort' }
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      color: 'white'
    }}>
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '16px',
        padding: '30px',
        marginBottom: '30px'
      }}>
        <h1 style={{
          margin: '0 0 30px 0',
          fontSize: '2.5rem',
          textAlign: 'center',
          background: 'linear-gradient(45deg, #3b82f6, #10b981)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Búsqueda Avanzada
        </h1>

        {/* Main Search Bar */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <input
            type="text"
            value={filters.query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="¿A dónde quieres viajar? Busca ciudades, países, actividades..."
            style={{
              width: '100%',
              padding: '18px 60px 18px 50px',
              fontSize: '18px',
              borderRadius: '12px',
              border: '2px solid #374151',
              backgroundColor: '#374151',
              color: 'white',
              boxSizing: 'border-box',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#374151'}
          />
          <div style={{
            position: 'absolute',
            left: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '20px'
          }}>
            🔍
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: showFilters ? '#3b82f6' : '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Filtros
          </button>
        </div>

        {/* Quick Search Suggestions */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {['Madrid', 'París', 'Roma', 'Barcelona', 'Londres', 'Berlín', 'Amsterdam'].map(city => (
            <button
              key={city}
              onClick={() => handleSearch(city)}
              style={{
                padding: '8px 16px',
                backgroundColor: filters.query === city ? '#3b82f6' : '#4b5563',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div style={{
            backgroundColor: '#374151',
            borderRadius: '12px',
            padding: '25px',
            marginTop: '20px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '25px'
            }}>
              {/* Budget Filter */}
              <div>
                <h3 style={{ color: '#f9fafb', marginBottom: '15px' }}>Presupuesto por día</h3>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', color: '#d1d5db', marginBottom: '8px' }}>
                    Mínimo: {formatCurrency(filters.budget.min)}
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="25"
                    value={filters.budget.min}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      budget: { ...prev.budget, min: Number(e.target.value) }
                    }))}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#d1d5db', marginBottom: '8px' }}>
                    Máximo: {formatCurrency(filters.budget.max)}
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={filters.budget.max}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      budget: { ...prev.budget, max: Number(e.target.value) }
                    }))}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Date Filter */}
              <div>
                <h3 style={{ color: '#f9fafb', marginBottom: '15px' }}>Fechas de viaje</h3>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', color: '#d1d5db', marginBottom: '8px' }}>
                    Fecha de salida
                  </label>
                  <input
                    type="date"
                    value={filters.dates.startDate}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      dates: { ...prev.dates, startDate: e.target.value }
                    }))}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid #4b5563',
                      backgroundColor: '#1f2937',
                      color: 'white'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', color: '#d1d5db', marginBottom: '8px' }}>
                    Fecha de regreso
                  </label>
                  <input
                    type="date"
                    value={filters.dates.endDate}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      dates: { ...prev.dates, endDate: e.target.value }
                    }))}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid #4b5563',
                      backgroundColor: '#1f2937',
                      color: 'white'
                    }}
                  />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', color: '#d1d5db' }}>
                  <input
                    type="checkbox"
                    checked={filters.dates.flexible}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      dates: { ...prev.dates, flexible: e.target.checked }
                    }))}
                    style={{ marginRight: '8px' }}
                  />
                  Fechas flexibles
                </label>
              </div>

              {/* Travelers Filter */}
              <div>
                <h3 style={{ color: '#f9fafb', marginBottom: '15px' }}>Viajeros</h3>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', color: '#d1d5db', marginBottom: '8px' }}>
                    Adultos: {filters.travelers.adults}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={filters.travelers.adults}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      travelers: { ...prev.travelers, adults: Number(e.target.value) }
                    }))}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#d1d5db', marginBottom: '8px' }}>
                    Niños: {filters.travelers.children}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    value={filters.travelers.children}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      travelers: { ...prev.travelers, children: Number(e.target.value) }
                    }))}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '15px',
              marginTop: '25px',
              justifyContent: 'center'
            }}>
              <button
                onClick={applyFilters}
                style={{
                  padding: '12px 30px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Aplicar Filtros
              </button>
              <button
                onClick={resetFilters}
                style={{
                  padding: '12px 30px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Limpiar Todo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '16px',
        padding: '30px'
      }}>
        {/* Results Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px'
        }}>
          <h2 style={{ color: '#f9fafb', margin: '0' }}>
            {isSearching ? 'Buscando...' : ${searchResults.length} destinos encontrados}
          </h2>
          
          {searchResults.length > 0 && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #4b5563',
                backgroundColor: '#374151',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="popularity">Más populares</option>
              <option value="price">Precio (menor a mayor)</option>
              <option value="name">Nombre (A-Z)</option>
            </select>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div style={{
            backgroundColor: '#7f1d1d',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#fecaca', margin: '0' }}>Error: {error}</p>
          </div>
        )}

        {/* Loading State */}
        {isSearching && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔄</div>
            <p style={{ color: '#9ca3af', fontSize: '18px' }}>
              Explorando destinos increíbles para ti...
            </p>
          </div>
        )}

        {/* Results Grid */}
        {!isSearching && sortedResults.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '25px'
          }}>
            {sortedResults.map(destination => (
              <div
                key={destination.id}
                style={{
                  backgroundColor: '#374151',
                  borderRadius: '12px',
                  padding: '25px',
                  border: '1px solid #4b5563',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Destination Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '15px'
                }}>
                  <div>
                    <h3 style={{
                      margin: '0 0 5px 0',
                      color: '#f9fafb',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}>
                      {destination.name}
                    </h3>
                    <p style={{ margin: '0', color: '#9ca3af', fontSize: '14px' }}>
                      {destination.country}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      backgroundColor: '#1f2937',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#fbbf24'
                    }}>
                      ⭐ {destination.popularityScore}/10
                    </div>
                    <button
                      onClick={() => isFavorite(destination.id)
                        ? removeFromFavorites(destination.id)
                        : addToFavorites(destination)
                      }
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer'
                      }}
                    >
                      {isFavorite(destination.id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p style={{
                  color: '#d1d5db',
                  lineHeight: '1.6',
                  marginBottom: '20px',
                  fontSize: '15px'
                }}>
                  {destination.description}
                </p>

                {/* Details Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  <div>
                    <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>
                      Precio promedio
                    </div>
                    <div style={{ color: '#10b981', fontSize: '18px', fontWeight: 'bold' }}>
                      {formatCurrency(destination.averagePrice)}/día
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>
                      Temperatura promedio
                    </div>
                    <div style={{ color: '#f59e0b', fontSize: '18px', fontWeight: 'bold' }}>
                      {destination.weatherInfo.averageTemp}°C
                    </div>
                  </div>
                </div>

                {/* Weather Info */}
                <div style={{
                  backgroundColor: '#1f2937',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <div style={{ color: '#d1d5db', fontSize: '14px' }}>
                    <strong>Clima:</strong> {destination.weatherInfo.climate}
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '13px', marginTop: '4px' }}>
                    Mejor época: {destination.weatherInfo.bestMonths.join(', ')}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => startTripPlanning(destination)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                >
                  Planificar Viaje a {destination.name}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isSearching && searchResults.length === 0 && filters.query && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🗺️</div>
            <h3 style={{ color: '#f9fafb', marginBottom: '10px' }}>
              No encontramos destinos que coincidan
            </h3>
            <p style={{ color: '#9ca3af', marginBottom: '20px' }}>
              Intenta con otros términos o ajusta tus filtros
            </p>
            <button
              onClick={resetFilters}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch;