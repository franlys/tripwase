import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTrip } from '../hooks/useTrip';
import type { Trip } from '../contexts/TripContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { trips, favorites, currentTrip } = useTrip();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getTotalBudget = () => {
    return trips.reduce((sum: number, trip: Trip) => sum + trip.budget.total, 0);
  };

  const getCountriesVisited = () => {
    return new Set(trips.map((trip: Trip) => trip.destination.country)).size;
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#111827',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '4rem',
            margin: '0 0 20px 0',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            TripWase
          </h1>
          <p style={{
            fontSize: '1.5rem',
            margin: '0 0 40px 0',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            Planifica, organiza y vive tus aventuras perfectas
          </p>
          
          {user ? (
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '30px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <h2 style={{
                margin: '0 0 20px 0',
                fontSize: '1.8rem'
              }}>
                ¡Bienvenido de vuelta, {user.name}!
              </h2>
              
              {currentTrip ? (
                <div style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  padding: '20px',
                  borderRadius: '12px',
                  marginBottom: '20px'
                }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#34d399' }}>
                    Viaje Actual: {currentTrip.name}
                  </h3>
                  <p style={{ margin: '0', opacity: 0.9 }}>
                    Destino: {currentTrip.destination.name}, {currentTrip.destination.country}
                  </p>
                </div>
              ) : (
                <p style={{ margin: '0 0 20px 0', fontSize: '1.1rem' }}>
                  ¿Listo para tu próxima aventura?
                </p>
              )}
              
              <Link
                to="/dashboard"
                style={{
                  display: 'inline-block',
                  padding: '15px 30px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Ir al Dashboard
              </Link>
            </div>
          ) : (
            <div>
              <p style={{
                fontSize: '1.2rem',
                margin: '0 0 30px 0',
                opacity: 0.9
              }}>
                Comienza a planificar tus viajes de manera inteligente
              </p>
              <Link
                to="/dashboard"
                style={{
                  display: 'inline-block',
                  padding: '15px 30px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  marginRight: '20px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#059669';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#10b981';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Comenzar Ahora
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Section */}
      {user && trips.length > 0 && (
        <div style={{
          padding: '60px 20px',
          backgroundColor: '#1f2937'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              textAlign: 'center',
              fontSize: '2.5rem',
              margin: '0 0 50px 0',
              color: '#f9fafb'
            }}>
              Tus Estadísticas de Viaje
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '30px'
            }}>
              {/* Total Trips */}
              <div style={{
                backgroundColor: '#374151',
                padding: '30px',
                borderRadius: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>✈️</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#60a5fa' }}>
                  {trips.length}
                </div>
                <div style={{ color: '#9ca3af' }}>Viajes Totales</div>
              </div>

              {/* Countries Visited */}
              <div style={{
                backgroundColor: '#374151',
                padding: '30px',
                borderRadius: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🌍</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#34d399' }}>
                  {getCountriesVisited()}
                </div>
                <div style={{ color: '#9ca3af' }}>Países Visitados</div>
              </div>

              {/* Favorites */}
              <div style={{
                backgroundColor: '#374151',
                padding: '30px',
                borderRadius: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>❤️</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f87171' }}>
                  {favorites.length}
                </div>
                <div style={{ color: '#9ca3af' }}>Destinos Favoritos</div>
              </div>

              {/* Total Budget */}
              <div style={{
                backgroundColor: '#374151',
                padding: '30px',
                borderRadius: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>💰</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24' }}>
                  {formatCurrency(getTotalBudget())}
                </div>
                <div style={{ color: '#9ca3af' }}>Presupuesto Total</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div style={{
        padding: '80px 20px',
        backgroundColor: '#111827'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '2.5rem',
            margin: '0 0 50px 0',
            color: '#f9fafb'
          }}>
            ¿Por qué elegir TripWase?
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '40px'
          }}>
            {/* Feature 1 */}
            <div style={{
              backgroundColor: '#1f2937',
              padding: '40px',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '20px',
                background: 'linear-gradient(45deg, #3b82f6, #10b981)',
                borderRadius: '50%',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                🗺️
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                margin: '0 0 15px 0',
                color: '#f9fafb'
              }}>
                Planificación Inteligente
              </h3>
              <p style={{
                color: '#9ca3af',
                lineHeight: '1.6',
                margin: '0'
              }}>
                Organiza cada detalle de tu viaje con nuestras herramientas intuitivas. 
                Desde itinerarios hasta presupuestos, todo en un solo lugar.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{
              backgroundColor: '#1f2937',
              padding: '40px',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '20px',
                background: 'linear-gradient(45deg, #f59e0b, #ef4444)',
                borderRadius: '50%',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                💡
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                margin: '0 0 15px 0',
                color: '#f9fafb'
              }}>
                Descubre Destinos
              </h3>
              <p style={{
                color: '#9ca3af',
                lineHeight: '1.6',
                margin: '0'
              }}>
                Explora nuevos destinos con información detallada sobre clima, 
                precios y actividades. Encuentra tu próxima aventura perfecta.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{
              backgroundColor: '#1f2937',
              padding: '40px',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '20px',
                background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
                borderRadius: '50%',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                📊
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                margin: '0 0 15px 0',
                color: '#f9fafb'
              }}>
                Control Total
              </h3>
              <p style={{
                color: '#9ca3af',
                lineHeight: '1.6',
                margin: '0'
              }}>
                Mantén el control de tus gastos, actividades y fechas. 
                Visualiza tu progreso y ajusta tus planes sobre la marcha.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        padding: '80px 20px',
        backgroundColor: '#1e40af',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            margin: '0 0 20px 0',
            color: 'white'
          }}>
            ¿Listo para empezar?
          </h2>
          <p style={{
            fontSize: '1.2rem',
            margin: '0 0 40px 0',
            color: '#bfdbfe',
            lineHeight: '1.6'
          }}>
            Únete a miles de viajeros que ya planifican sus aventuras con TripWase. 
            Es gratuito y fácil de usar.
          </p>
          <Link
            to={user ? "/dashboard" : "/dashboard"}
            style={{
              display: 'inline-block',
              padding: '18px 40px',
              backgroundColor: '#10b981',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#059669';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#10b981';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {user ? "Ir al Dashboard" : "Comenzar Gratis"}
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: '40px 20px',
        backgroundColor: '#000',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{
            margin: '0',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            © 2024 TripWase. Planifica tus viajes perfectos.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;