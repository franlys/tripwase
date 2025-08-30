import React, { useState } from 'react';
import { useTrip } from '../contexts/TripContext';

const TestTripContext: React.FC = () => {
  const [customBudget, setCustomBudget] = useState<number>(1000);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [adults, setAdults] = useState<number>(2);
  const [activeTab, setActiveTab] = useState<'search' | 'planning' | 'trips'>('search');

  const { 
    searchQuery,
    searchResults,
    isSearching,
    currentTrip,
    trips,
    favorites,
    searchHistory,
    searchFilters,
    error,
    searchDestinations,
    updateSearchFilters,
    startTripPlanning,
    updateTripDetails,
    editTrip,
    saveTrip,
    deleteTrip,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getTripDuration,
    clearError
  } = useTrip();

  const handleSearch = (query: string) => {
    searchDestinations(query);
  };

  const handleFilterUpdate = () => {
    updateSearchFilters({
      budget: { min: 0, max: customBudget, currency: 'EUR' },
      dates: { startDate: startDate || null, endDate: endDate || null },
      travelers: { adults, children: 0 }
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No definida';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div style={{ 
      padding: '20px', 
      color: 'white', 
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#111827'
    }}>
      <h2>🚀 Test TripContext - TripWase</h2>
      
      {error && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#7f1d1d', 
          borderRadius: '8px',
          border: '1px solid #dc2626'
        }}>
          <p style={{ color: '#fecaca', margin: '0 0 10px 0' }}>
            ❌ Error: {error}
          </p>
          <button 
            onClick={clearError} 
            style={{ 
              padding: '5px 10px', 
              backgroundColor: '#dc2626', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Limpiar Error
          </button>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('search')} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: activeTab === 'search' ? '#3b82f6' : '#6b7280', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            marginRight: '5px',
            cursor: 'pointer'
          }}
        >
          🔍 Búsqueda
        </button>
        <button 
          onClick={() => setActiveTab('planning')} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: activeTab === 'planning' ? '#3b82f6' : '#6b7280', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            marginRight: '5px',
            cursor: 'pointer'
          }}
        >
          📋 Planificación
        </button>
        <button 
          onClick={() => setActiveTab('trips')} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: activeTab === 'trips' ? '#3b82f6' : '#6b7280', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ✈️ Mis Viajes ({trips.length})
        </button>
      </div>

      {activeTab === 'search' && (
        <div>
          <div style={{ 
            marginBottom: '20px', 
            padding: '20px', 
            backgroundColor: '#1f2937', 
            borderRadius: '8px' 
          }}>
            <h3>🔍 Buscar Destinos</h3>
            
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => handleSearch(e.target.value)} 
              placeholder="Buscar destinos (Madrid, París, Roma...)" 
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '16px', 
                borderRadius: '4px', 
                border: 'none', 
                backgroundColor: '#374151', 
                color: 'white', 
                marginBottom: '15px' 
              }} 
            />
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '15px' 
            }}>
              <div>
                <label>Presupuesto: {formatCurrency(customBudget)}</label>
                <input 
                  type="range" 
                  min="100" 
                  max="5000" 
                  step="100" 
                  value={customBudget} 
                  onChange={(e) => setCustomBudget(Number(e.target.value))} 
                  style={{ width: '100%' }} 
                />
              </div>
              
              <div>
                <label>Fecha inicio:</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: 'none', 
                    backgroundColor: '#374151', 
                    color: 'white' 
                  }} 
                />
              </div>
              
              <div>
                <label>Fecha fin:</label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: 'none', 
                    backgroundColor: '#374151', 
                    color: 'white' 
                  }} 
                />
              </div>
              
              <div>
                <label>Adultos: {adults}</label>
                <input 
                  type="range" 
                  min="1" 
                  max="8" 
                  value={adults} 
                  onChange={(e) => setAdults(Number(e.target.value))} 
                  style={{ width: '100%' }} 
                />
              </div>
            </div>
            
            <button 
              onClick={handleFilterUpdate} 
              style={{ 
                marginTop: '15px', 
                padding: '8px 16px', 
                backgroundColor: '#059669', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🔄 Aplicar Filtros
            </button>
          </div>

          {isSearching && <div style={{ textAlign: 'center', padding: '20px' }}>🔄 Buscando destinos...</div>}
          
          {searchResults.length > 0 && (
            <div style={{ 
              marginBottom: '20px', 
              padding: '20px', 
              backgroundColor: '#065f46', 
              borderRadius: '8px' 
            }}>
              <h3>✅ Resultados ({searchResults.length})</h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '20px' 
              }}>
                {searchResults.map((destination) => (
                  <div 
                    key={destination.id} 
                    style={{ 
                      backgroundColor: '#047857', 
                      padding: '15px', 
                      borderRadius: '8px' 
                    }}
                  >
                    <h4>{destination.name}, {destination.country}</h4>
                    <p>{destination.description}</p>
                    <p>💰 {formatCurrency(destination.averagePrice)}</p>
                    <p>⭐ {destination.popularityScore}/10</p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
                      <button 
                        onClick={() => { 
                          startTripPlanning(destination); 
                          setActiveTab('planning'); 
                        }} 
                        style={{ 
                          padding: '8px 12px', 
                          backgroundColor: '#3b82f6', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px', 
                          flex: 1,
                          cursor: 'pointer'
                        }}
                      >
                        📋 Planificar
                      </button>
                      <button 
                        onClick={() => isFavorite(destination.id) 
                          ? removeFromFavorites(destination.id) 
                          : addToFavorites(destination)
                        } 
                        style={{ 
                          padding: '8px 12px', 
                          backgroundColor: isFavorite(destination.id) ? '#dc2626' : '#7c3aed', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {isFavorite(destination.id) ? '💔 Quitar' : '❤️ Favorito'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {favorites.length > 0 && (
            <div style={{ 
              marginBottom: '20px', 
              padding: '20px', 
              backgroundColor: '#7c2d12', 
              borderRadius: '8px' 
            }}>
              <h3>❤️ Favoritos ({favorites.length})</h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '15px' 
              }}>
                {favorites.map((destination) => (
                  <div 
                    key={destination.id} 
                    style={{ 
                      backgroundColor: '#92400e', 
                      padding: '10px', 
                      borderRadius: '6px' 
                    }}
                  >
                    <h5>{destination.name}</h5>
                    <p>{formatCurrency(destination.averagePrice)}</p>
                    <button 
                      onClick={() => removeFromFavorites(destination.id)} 
                      style={{ 
                        padding: '4px 8px', 
                        backgroundColor: '#dc2626', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      💔 Quitar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'planning' && (
        <div>
          {currentTrip ? (
            <div>
              <div style={{ 
                marginBottom: '20px', 
                padding: '20px', 
                backgroundColor: '#1e3a8a', 
                borderRadius: '8px' 
              }}>
                <h3>📋 Planificando: {currentTrip.name}</h3>
                <p>🌍 Destino: {currentTrip.destination.name}</p>
                <p>📅 Fechas: {formatDate(currentTrip.dates.startDate)} - {formatDate(currentTrip.dates.endDate)}</p>
                <p>⏰ Duración: {getTripDuration()} días</p>
                <p>👥 Viajeros: {currentTrip.travelers.adults} adultos</p>
                <p>💰 Presupuesto: {formatCurrency(currentTrip.budget.total)}</p>
              </div>
              
              <div style={{ 
                marginBottom: '20px', 
                padding: '20px', 
                backgroundColor: '#374151', 
                borderRadius: '8px' 
              }}>
                <h4>✏️ Detalles</h4>
                <input 
                  type="text" 
                  value={currentTrip.name} 
                  onChange={(e) => updateTripDetails({ name: e.target.value })} 
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    margin: '10px 0', 
                    borderRadius: '4px', 
                    border: 'none', 
                    backgroundColor: '#1f2937', 
                    color: 'white' 
                  }} 
                />
                <select 
                  value={currentTrip.status} 
                  onChange={(e) => updateTripDetails({ status: e.target.value as any })} 
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: 'none', 
                    backgroundColor: '#1f2937', 
                    color: 'white' 
                  }}
                >
                  <option value="planning">📋 Planificando</option>
                  <option value="confirmed">✅ Confirmado</option>
                  <option value="completed">🎉 Completado</option>
                  <option value="cancelled">❌ Cancelado</option>
                </select>
              </div>
              
              <button 
                onClick={saveTrip} 
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: '#059669', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                💾 Guardar Viaje
              </button>
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              backgroundColor: '#374151', 
              borderRadius: '8px' 
            }}>
              <h3>📋 No hay viaje en planificación</h3>
              <p>Ve a Búsqueda y selecciona "Planificar" en algún destino</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'trips' && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '20px', 
          backgroundColor: '#065f46', 
          borderRadius: '8px' 
        }}>
          <h3>✈️ Mis Viajes ({trips.length})</h3>
          {trips.length === 0 ? (
            <p>No tienes viajes guardados</p>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '20px' 
            }}>
              {trips.map((trip) => (
                <div 
                  key={trip.id} 
                  style={{ 
                    backgroundColor: '#047857', 
                    padding: '15px', 
                    borderRadius: '8px' 
                  }}
                >
                  <h4>{trip.name}</h4>
                  <p>🌍 Destino: {trip.destination.name}</p>
                  <p>📊 Estado: {trip.status}</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button 
                      onClick={() => { 
                        editTrip(trip); 
                        setActiveTab('planning'); 
                      }} 
                      style={{ 
                        padding: '6px 12px', 
                        backgroundColor: '#3b82f6', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        flex: 1,
                        cursor: 'pointer'
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => deleteTrip(trip.id)} 
                      style={{ 
                        padding: '6px 12px', 
                        backgroundColor: '#dc2626', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestTripContext;