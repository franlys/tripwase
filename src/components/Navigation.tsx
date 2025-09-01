import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTrip } from '../contexts/TripContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { currentTrip, trips } = useTrip();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '📊',
      description: 'Vista general'
    },
    {
      path: '/search',
      label: 'Búsqueda',
      icon: '🔍',
      description: 'Explorar destinos'
    },
    {
      path: '/planner',
      label: 'Planificador',
      icon: '📋',
      description: currentTrip ? \Planificando: \\ : 'Sin viaje activo'
    }
  ];

  return (
    <nav style={{
      backgroundColor: '#1e293b',
      padding: '20px 0',
      marginBottom: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <Link
            to="/dashboard"
            style={{
              textDecoration: 'none',
              color: '#f1f5f9',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            ✈️ TripWase
          </Link>

          {user && (
            <div style={{
              color: '#94a3b8',
              fontSize: '14px',
              textAlign: 'right'
            }}>
              <div>Bienvenido, {user.name}</div>
              <div>{trips.length} viajes guardados</div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center'
        }}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                backgroundColor: isActive(item.path) ? '#3b82f6' : 'transparent',
                color: isActive(item.path) ? 'white' : '#d1d5db',
                border: \1px solid \\,
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
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
                  opacity: 0.8,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '120px'
                }}>
                  {item.description}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Breadcrumbs */}
        <div style={{
          marginTop: '15px',
          padding: '10px 15px',
          backgroundColor: '#374151',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#9ca3af'
        }}>
          <span>Estás en: </span>
          {location.pathname === '/dashboard' && 'Panel Principal'}
          {location.pathname === '/search' && 'Búsqueda Avanzada de Destinos'}
          {location.pathname === '/planner' && (currentTrip ? \Planificador - \\ : 'Planificador de Viajes')}
          {location.pathname === '/' && 'Inicio'}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;