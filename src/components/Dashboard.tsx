import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTrip } from '../hooks/useTrip';
import type { Trip, Destination } from '../contexts/TripContext';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'search' | 'trips'>('overview');
  const { user } = useAuth();
  const { 
    trips, 
    favorites, 
    currentTrip, 
    searchResults, 
    searchDestinations, 
    addToFavorites, 
    removeFromFavorites, 
    isFavorite,
    startTripPlanning,
    editTrip,
    deleteTrip 
  } = useTrip();

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

  const getStatusColor = (status: string) => {
    const colors = {
      planning: '#f59e0b',
      confirmed: '#10b981',
      completed: '#3b82f6',
      cancelled: '#ef4444'
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  };

  const getStatusText = (status: string) => {
    const texts = {
      planning: 'Planificando',
      confirmed: 'Confirmado',
      completed: 'Completado',
      cancelled: 'Cancelado'
    };
    return texts[status as keyof typeof texts] || status;
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      color: 'white'
    }}>
      {/* Welcome Header */}
      <div style={{
        backgroundColor: '#1f2937',
        padding: '30px',
        borderRadius: '16px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          margin: '0 0 10px 0', 
          fontSize: '2.5rem',
          background: 'linear-gradient(45deg, #3b82f6, #10b981)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ¡Hola, {user?.name || 'Viajero'}!
        </h1>
        <p style={{ 
          margin: '0', 
          fontSize: '1.1rem', 
          color: '#9ca3af' 
        }}>
          Bienvenido a tu centro de planificación de viajes
        </p>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        backgroundColor: '#374151',
        padding: '15px',
        borderRadius: '12px',
        marginBottom: '30px',
        display: 'flex',
        gap: '10px',
        justifyContent: 'center'
      }}>
        {[
          { id: 'overview', label: 'Resumen', icon: '📊' },
          { id: 'search', label: 'Búsqueda Rápida', icon: '🔍' },
          { id: 'trips', label: 'Mis Viajes', icon: '✈️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            style={{
              padding: '12px 20px',
              backgroundColor: activeSection === tab.id ? '#3b82f6' : 'transparent',
              color: activeSection === tab.id ? 'white' : '#d1d5db',
              border: '1px solid #4b5563',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div>
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {/* Total Trips */}
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
              <div style={{ color: '#bfdbfe' }}>Viajes Totales</div>
            </div>

            {/* Favorites */}
            <div style={{
              backgroundColor: '#be185d',
              padding: '25px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>❤️</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fce7f3' }}>
                {favorites.length}
              </div>
              <div style={{ color: '#fbcfe8' }}>Destinos Favoritos</div>
            </div>

            {/* Total Budget */}
            <div style={{
              backgroundColor: '#047857',
              padding: '25px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💰</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d1fae5' }}>
                {formatCurrency(trips.reduce((sum: number, trip: Trip) => sum + trip.budget.total, 0))}
              </div>
              <div style={{ color: '#a7f3d0' }}>Presupuesto Total</div>
            </div>

            {/* Countries Visited */}
            <div style={{
              backgroundColor: '#7c2d12',
              padding: '25px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🌍</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fed7aa' }}>
                {new Set(trips.map((trip: Trip) => trip.destination.country)).size}
              </div>
              <div style={{ color: '#fdba74' }}>Países Visitados</div>
            </div>
          </div>

          {/* Current Trip */}
          {currentTrip && (
            <div style={{
              backgroundColor: '#1f2937',
              padding: '25px',
              borderRadius: '12px',
              marginBottom: '30px'
            }}>
              <h3 style={{ color: '#f9fafb', marginBottom: '15px' }}>Viaje Actual</h3>
              <div style={{
                backgroundColor: '#374151',
                padding: '20px',
                borderRadius: '8px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#10b981' }}>
                  {currentTrip.name}
                </h4>
                <p style={{ margin: '5px 0', color: '#d1d5db' }}>
                  Destino: {currentTrip.destination.name}, {currentTrip.destination.country}
                </p>
                <p style={{ margin: '5px 0', color: '#d1d5db' }}>
                  Fechas: {formatDate(currentTrip.dates.startDate)} - {formatDate(currentTrip.dates.endDate)}
                </p>
                <p style={{ margin: '5px 0', color: '#d1d5db' }}>
                  Presupuesto: {formatCurrency(currentTrip.budget.total)}
                </p>
              </div>
            </div>
          )}

          {/* Recent Trips */}
          <div style={{
            backgroundColor: '#1f2937',
            padding: '25px',
            borderRadius: '12px'
          }}>
            <h3 style={{ color: '#f9fafb', marginBottom: '20px' }}>Viajes Recientes</h3>
            {trips.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {trips.slice(-3).reverse().map((trip: Trip) => (
                  <div 
                    key={trip.id}
                    style={{
                      backgroundColor: '#374151',
                      padding: '15px',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: '#f9fafb' }}>
                        {trip.name}
                      </h4>
                      <p style={{ margin: '0', fontSize: '14px', color: '#9ca3af' }}>
                        {trip.destination.name} • {getStatusText(trip.status)}
                      </p>
                    </div>
                    <div style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      backgroundColor: getStatusColor(trip.status),
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {formatCurrency(trip.budget.total)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                <p>No tienes viajes registrados aún</p>
                <p>¡Comienza planificando tu próxima aventura!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Search Section */}
      {activeSection === 'search' && (
        <div style={{
          backgroundColor: '#1f2937',
          padding: '30px',
          borderRadius: '12px'
        }}>
          <h3 style={{ color: '#f9fafb', marginBottom: '20px' }}>Búsqueda Rápida de Destinos</h3>
          
          <input
            type="text"
            placeholder="Buscar destinos..."
            onChange={(e) => searchDestinations(e.target.value)}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '16px',
              borderRadius: '8px',
              border: '1px solid #4b5563',
              backgroundColor: '#374151',
              color: 'white',
              marginBottom: '20px',
              boxSizing: 'border-box'
            }}
          />

          {searchResults.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {searchResults.map((destination: Destination) => (
                <div
                  key={destination.id}
                  style={{
                    backgroundColor: '#374151',
                    padding: '20px',
                    borderRadius: '8px'
                  }}
                >
                  <h4 style={{ margin: '0 0 10px 0', color: '#f9fafb' }}>
                    {destination.name}, {destination.country}
                  </h4>
                  <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#d1d5db' }}>
                    {destination.description}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                      {formatCurrency(destination.averagePrice)}/día
                    </span>
                    <span style={{ color: '#fbbf24' }}>
                      ⭐ {destination.popularityScore}/10
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => startTripPlanning(destination)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Planificar
                    </button>
                    <button
                      onClick={() => isFavorite(destination.id) 
                        ? removeFromFavorites(destination.id) 
                        : addToFavorites(destination)
                      }
                      style={{
                        padding: '8px 12px',
                        backgroundColor: isFavorite(destination.id) ? '#ef4444' : '#7c3aed',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      {isFavorite(destination.id) ? '💔' : '❤️'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Trips Management Section */}
      {activeSection === 'trips' && (
        <div style={{
          backgroundColor: '#1f2937',
          padding: '30px',
          borderRadius: '12px'
        }}>
          <h3 style={{ color: '#f9fafb', marginBottom: '20px' }}>
            Gestión de Viajes ({trips.length})
          </h3>
          
          {trips.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {trips.map((trip: Trip) => (
                <div
                  key={trip.id}
                  style={{
                    backgroundColor: '#374151',
                    padding: '20px',
                    borderRadius: '8px',
                    border: `2px solid ${getStatusColor(trip.status)}`
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '15px'
                  }}>
                    <h4 style={{ margin: '0', color: '#f9fafb' }}>
                      {trip.name}
                    </h4>
                    <div style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      backgroundColor: getStatusColor(trip.status),
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: 'white'
                    }}>
                      {getStatusText(trip.status)}
                    </div>
                  </div>
                  
                  <p style={{ margin: '5px 0', color: '#d1d5db', fontSize: '14px' }}>
                    📍 {trip.destination.name}, {trip.destination.country}
                  </p>
                  <p style={{ margin: '5px 0', color: '#d1d5db', fontSize: '14px' }}>
                    📅 {formatDate(trip.dates.startDate)} - {formatDate(trip.dates.endDate)}
                  </p>
                  <p style={{ margin: '5px 0', color: '#d1d5db', fontSize: '14px' }}>
                    💰 {formatCurrency(trip.budget.total)}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '15px'
                  }}>
                    <button
                      onClick={() => editTrip(trip)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => deleteTrip(trip.id)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#9ca3af'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✈️</div>
              <h4 style={{ marginBottom: '10px' }}>No tienes viajes registrados</h4>
              <p>¡Comienza a planificar tu primera aventura!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;