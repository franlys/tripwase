import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTrip } from '../hooks/useTrip';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { currentTrip } = useTrip();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '??',
      description: 'Panel principal'
    },
    {
      path: '/search',
      label: 'Búsqueda',
      icon: '??',
      description: 'Encontrar destinos'
    },
    {
      path: '/planner',
      label: 'Planificador',
      icon: '??',
      description: currentTrip ? `Planificando: ${currentTrip.destination.name}` : 'Sin viaje activo'
    }
  ];

  return (
    <nav style={{
      backgroundColor: '#1f2937',
      padding: '20px',
      marginBottom: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px',
          borderRadius: '16px',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '3rem',
            margin: '0 0 15px 0',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            TripWase
          </h1>
          <p style={{
            fontSize: '1.2rem',
            margin: '0',
            opacity: 0.9
          }}>
            Planifica tus viajes perfectos
          </p>
          {user && (
            <div style={{
              marginTop: '15px',
              fontSize: '16px',
              opacity: 0.8
            }}>
              Bienvenido, {user.name}
            </div>
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center'
        }}>
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: 'none',
                color: 'white',
                backgroundColor: isActive(item.path) ? '#3b82f6' : 'transparent',
                border: `2px solid ${isActive(item.path) ? '#3b82f6' : '#4b5563'}`,
                borderRadius: '12px',
                padding: '15px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                minWidth: '140px',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.backgroundColor = '#374151';
                  e.currentTarget.style.borderColor = '#6b7280';
                }
              }}
              onMouseOut={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#4b5563';
                }
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  {item.label}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#9ca3af', 
                  textAlign: 'center',
                  marginTop: '4px',
                  lineHeight: '1.3',
                  maxWidth: '120px'
                }}>
                  {item.description}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{
          marginTop: '25px',
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {location.pathname === '/dashboard' && 'Panel Principal'}
          {location.pathname === '/search' && 'Búsqueda Avanzada de Destinos'}
          {location.pathname === '/planner' && (currentTrip ? `Planificador - ${currentTrip.destination.name}` : 'Planificador de Viajes')}
          {location.pathname === '/' && 'Inicio'}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
