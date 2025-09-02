import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTrip } from '../hooks/useTrip';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { trips, favorites } = useTrip();

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 20px',
        textAlign: 'center',
        color: 'white'
      }}>
        {/* Hero Section */}
        <div style={{
          backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '60px 40px',
          borderRadius: '20px',
          marginBottom: '40px',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            margin: '0 0 20px 0',
            background: 'linear-gradient(45deg, #60a5fa, #34d399)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ✈️ TripWase
          </h1>
          <p style={{
            fontSize: '1.3rem',
            margin: '0 0 30px 0',
            color: '#e2e8f0',
            lineHeight: '1.6'
          }}>
            Tu compañero inteligente para planificar viajes increíbles
          </p>
          <p style={{
            fontSize: '1rem',
            color: '#cbd5e1',
            margin: '0 0 40px 0'
          }}>
            Descubre destinos, planifica itinerarios detallados y gestiona tu presupuesto
          </p>

          {user ? (
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link
                to="/dashboard"
                style={{
                  textDecoration: 'none',
                  padding: '15px 30px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '10px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
              >
                Ver Dashboard
              </Link>
              <Link
                to="/search"
                style={{
                  textDecoration: 'none',
                  padding: '15px 30px',
                  backgroundColor: 'transparent',
                  color: '#e2e8f0',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
              >
                Explorar Destinos
              </Link>
            </div>
          ) : (
            <Link
              to="/dashboard"
              style={{
                textDecoration: 'none',
                padding: '15px 30px',
                backgroundColor: '#10b981',
                color: 'white',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: 'bold',
                display: 'inline-block',
                transition: 'all 0.3s'
              }}
            >
              Comenzar a Planificar
            </Link>
          )}
        </div>

        {/* Stats Section - Solo si está logueado */}
        {user && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div style={{
              backgroundColor: '#1f2937',
              padding: '30px',
              borderRadius: '15px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>✈️</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#60a5fa' }}>
                {trips.length}
              </div>
              <div style={{ color: '#9ca3af' }}>Viajes Planificados</div>
            </div>

            <div style={{
              backgroundColor: '#1f2937',
              padding: '30px',
              borderRadius: '15px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>❤️</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f87171' }}>
                {favorites.length}
              </div>
              <div style={{ color: '#9ca3af' }}>Destinos Favoritos</div>
            </div>

            <div style={{
              backgroundColor: '#1f2937',
              padding: '30px',
              borderRadius: '15px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🌍</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#34d399' }}>
                {new Set(trips.map(trip => trip.destination.country)).size}
              </div>
              <div style={{ color: '#9ca3af' }}>Países Visitados</div>
            </div>
          </div>
        )}

        {/* Features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {[
            {
              icon: '🔍',
              title: 'Búsqueda Inteligente',
              description: 'Encuentra destinos perfectos con filtros avanzados de presupuesto, fechas y preferencias'
            },
            {
              icon: '📋',
              title: 'Planificación Detallada',
              description: 'Crea itinerarios día por día con actividades, horarios y seguimiento de presupuesto'
            },
            {
              icon: '💰',
              title: 'Control de Gastos',
              description: 'Gestiona tu presupuesto por categorías y mantén el control total de tus gastos'
            }
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#1f2937',
                padding: '30px',
                borderRadius: '15px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>
                {feature.icon}
              </div>
              <h3 style={{ color: '#f1f5f9', marginBottom: '10px' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#9ca3af', lineHeight: '1.5' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
