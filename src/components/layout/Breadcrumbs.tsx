// src/components/layout/Breadcrumbs.tsx - Breadcrumbs con rutas
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../routes/routes.config';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  
  // No mostrar breadcrumbs en homepage
  if (location.pathname === ROUTES.HOME.path) {
    return null;
  }

  const getBreadcrumbs = () => {
    const path = location.pathname;
    
    const breadcrumbs = [
      { label: 'Inicio', path: ROUTES.HOME.path }
    ];

    switch (path) {
      case ROUTES.PLANNER.path:
        breadcrumbs.push({ label: 'Planificar Viaje', path: ROUTES.PLANNER.path });
        break;
      case ROUTES.COMPARISON.path:
        breadcrumbs.push({ label: 'Planificar Viaje', path: ROUTES.PLANNER.path });
        breadcrumbs.push({ label: 'Comparar Planes', path: ROUTES.COMPARISON.path });
        break;
      case ROUTES.DASHBOARD.path:
        breadcrumbs.push({ label: 'Dashboard', path: ROUTES.DASHBOARD.path });
        break;
      case ROUTES.SEARCH.path:
        breadcrumbs.push({ label: 'Búsqueda', path: ROUTES.SEARCH.path });
        break;
      case ROUTES.LOGIN.path:
        breadcrumbs.push({ label: 'Iniciar Sesión', path: ROUTES.LOGIN.path });
        break;
      case ROUTES.REGISTER.path:
        breadcrumbs.push({ label: 'Registrarse', path: ROUTES.REGISTER.path });
        break;
      default:
        break;
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="breadcrumbs">
      <div className="container">
        <ol className="breadcrumb-list">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              <li>
                {index === breadcrumbs.length - 1 ? (
                  <span className="breadcrumb-current">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className="breadcrumb-link">
                    {crumb.label}
                  </Link>
                )}
              </li>
              {index < breadcrumbs.length - 1 && (
                <li className="breadcrumb-separator">›</li>
              )}
            </React.Fragment>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;