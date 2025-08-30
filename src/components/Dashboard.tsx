import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTrip } from '../contexts/TripContext';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'search' | 'trips'>('overview');
  
  // Contexts
  const { user } = useAuth();
  const { 
    trips, 
    favorites, 
    searchResults, 
    isSearching, 
    searchQuery,
    searchDestinations,
    startTripPlanning,
    addToFavorites,
    removeFromFavorites,
    isFavorite 
  } = useTrip();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  const handleQuickSearch = (query: string) => {
    searchDestinations(query);
    setActiveSection('search');
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#1e293b',
        padding: '30px',
        borderRadius: '16px',
        marginBottom: '30px',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ 
              margin: '0 0 10px 0', 
              fontSize: '2.5rem',
              background: 'linear-gradient(45deg, #3b82f6, #10b981)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              TripWase Dashboard
            </h1>
            <p style={{ margin: '0', color: '#94a3b8', fontSize: '1.1rem' }}>
              {user ? `Bienvenido, ${user.name}` : 'Planifica tu próximo viaje'}
            </p>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            {user && (
              <div style={{
                backgroundColor: '#065f46',
                padding: '15px 20px',
                borderRadius: '12px',
                border: '1px solid #047857'
              }}>
                <div style={{ color: '#a7f3d0', fontSize: '14px' }}>{user.role?.toUpperCase()}</div>
                <div style={{ color: '#d1fae5', fontSize: '16px', fontWeight: 'bold' }}>
                  {user.email}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        backgroundColor: '#374151',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '30px',
        display: 'flex',
        gap: '10px',
        justifyContent: 'center'
      }}>
        {[
          { id: 'overview', label: 'Resumen' },
          { id: 'search', label: 'Búsqueda' },
          { id: 'trips', label: 'Mis Viajes' }
        ].map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as any)}
            style={{
              padding: '12px 24px',
              backgroundColor: activeSection === section.id ? '#3b82f6' : 'transparent',
              color: activeSection === section.id ? 'white' : '#d1d5db',
              border: '1px solid #4b5563',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: activeSection === section.id ? 'bold' : 'normal',
              transition: 'all 0.3s'
            }}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div>
          {/* Quick Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              backgroundColor: '#1e40af',
              padding: '25px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✈️</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dbeafe' }}>
                {trips.length}
              </div>
              <div style={{ color: '#93c5fd' }}>Viajes Planificados</div>
            </div>

            <div style={{
              backgroundColor: '#dc2626',
              padding: '25px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>❤️</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fecaca' }}>
                {favorites.length}
              </div>
              <div style={{ color: '#fca5a5' }}>Destinos Favoritos</div>
            </div>

            <div style={{
              backgroundColor: '#059669',
              padding: '25px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💰</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d1fae5' }}>
                {formatCurrency(trips.reduce((sum, trip) => sum + trip.budget.total, 0))}
              </div>
              <div style={{ color: '#a7f3d0' }}>Presupuesto Total</div>
            </div>
          </div>

          {/* Quick Search */}
          <div style={{
            backgroundColor: '#1f2937',
            padding: '30px',
            borderRadius: '12px',
            marginBottom: '30px'
          }}>
            <h2 style={{ color: '#f9fafb', marginBottom: '20px' }}>Búsqueda Rápida</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '15px'
            }}>
              {['Madrid', 'París', 'Roma', 'Barcelona', 'Londres'].map(city => (
                <button
                  key={city}
                  onClick={() => handleQuickSearch(city)}
                  style={{
                    padding: '15px 20px',
                    backgroundColor: '#374151',
                    color: '#d1d5db',
                    border: '1px solid #4b5563',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'all 0.3s'
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Trips */}
          <div style={{
            backgroundColor: '#1f2937',
            padding: '30px',
            borderRadius: '12px'
          }}>
            <h2 style={{ color: '#f9fafb', marginBottom: '20px' }}>Actividad Reciente</h2>
            
            {trips.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {trips.slice(-3).reverse().map((trip) => (
                  <div 
                    key={trip.id}
                    style={{
                      backgroundColor: '#374151',
                      padding: '20px',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f9fafb' }}>
                        {trip.name}
                      </div>
                      <div style={{ color: '#9ca3af', fontSize: '14px' }}>
                        {new Date(trip.createdAt).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                    <div style={{
                      backgroundColor: '#059669',
                      color: 'white',
                      padding: '5px 15px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {trip.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🗺️</div>
                <p>No tienes viajes planificados aún</p>
                <p>Comienza buscando tu próximo destino</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Section */}
      {activeSection === 'search' && (
        <div style={{
          backgroundColor: '#1f2937',
          padding: '30px',
          borderRadius: '12px'
        }}>
          <h2 style={{ color: '#f9fafb', marginBottom: '20px' }}>Explorar Destinos</h2>
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => searchDestinations(e.target.value)}
            placeholder="¿A dónde quieres viajar?"
            style={{
              width: '100%',
              padding: '15px 20px',
              fontSize: '18px',
              borderRadius: '12px',
              border: '1px solid #374151',
              backgroundColor: '#374151',
              color: 'white',
              marginBottom: '30px',
              boxSizing: 'border-box'
            }}
          />

          {isSearching && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔄</div>
              <p>Buscando destinos increíbles...</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {searchResults.map(destination => (
                <div
                  key={destination.id}
                  style={{
                    backgroundColor: '#374151',
                    padding: '25px',
                    borderRadius: '12px',
                    border: '1px solid #4b5563'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '15px'
                  }}>
                    <div>
                      <h3 style={{ margin: '0 0 5px 0', color: '#f9fafb' }}>
                        {destination.name}, {destination.country}
                      </h3>
                      <div style={{ color: '#9ca3af', fontSize: '14px' }}>
                        {destination.popularityScore}/10
                      </div>
                    </div>
                    <button
                      onClick={() => isFavorite(destination.id) 
                        ? removeFromFavorites(destination.id) 
                        : addToFavorites(destination)
                      }
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer'
                      }}
                    >
                      {isFavorite(destination.id) ? '❤️' : '🤍'}
                    </button>
                  </div>

                  <p style={{ color: '#d1d5db', marginBottom: '15px', lineHeight: '1.5' }}>
                    {destination.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                  }}>
                    <div style={{ color: '#10b981', fontSize: '18px', fontWeight: 'bold' }}>
                      {formatCurrency(destination.averagePrice)}/día
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '14px' }}>
                      {destination.weatherInfo.averageTemp}°C
                    </div>
                  </div>

                  <button
                    onClick={() => startTripPlanning(destination)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Planificar Viaje
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Trips Section */}
      {activeSection === 'trips' && (
        <div style={{
          backgroundColor: '#1f2937',
          padding: '30px',
          borderRadius: '12px'
        }}>
          <h2 style={{ color: '#f9fafb', marginBottom: '20px' }}>Mis Viajes ({trips.length})</h2>
          
          {trips.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#9ca3af', padding: '60px 20px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🧳</div>
              <h3 style={{ color: '#d1d5db' }}>No tienes viajes planificados</h3>
              <p>Explora destinos y comienza a planificar tu próxima aventura</p>
              <button
                onClick={() => setActiveSection('search')}
                style={{
                  marginTop: '20px',
                  padding: '12px 24px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Buscar Destinos
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {trips.map(trip => (
                <div
                  key={trip.id}
                  style={{
                    backgroundColor: '#374151',
                    padding: '25px',
                    borderRadius: '12px',
                    border: '1px solid #4b5563'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '15px'
                  }}>
                    <h3 style={{ margin: '0', color: '#f9fafb' }}>
                      {trip.name}
                    </h3>
                    <div style={{
                      backgroundColor: '#059669',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {trip.status}
                    </div>
                  </div>

                  <div style={{ color: '#d1d5db', marginBottom: '15px' }}>
                    <p style={{ margin: '5px 0' }}>
                      <strong>{trip.destination.name}</strong>, {trip.destination.country}
                    </p>
                    <p style={{ margin: '5px 0' }}>
                      {trip.travelers.adults} adultos
                    </p>
                    <p style={{ margin: '5px 0' }}>
                      Presupuesto: {formatCurrency(trip.budget.total)}
                    </p>
                  </div>

                  <div style={{ color: '#9ca3af', fontSize: '12px' }}>
                    Creado: {new Date(trip.createdAt).toLocaleDateString('es-ES')}
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

export default Dashboard;