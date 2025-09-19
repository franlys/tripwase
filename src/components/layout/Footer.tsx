// src/components/layout/Footer.tsx - Footer reutilizable
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../routes/routes.config';

const Footer: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>TripWase</h4>
            <p className="text-base">
              Tu compañero de viajes para explorar el mundo de manera inteligente.
            </p>
            {!isAuthenticated && (
              <div className="mt-4 space-x-3">
                <Link 
                  to={ROUTES.LOGIN.path}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Iniciar Sesión
                </Link>
                <span className="text-gray-400">|</span>
                <Link 
                  to={ROUTES.REGISTER.path}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
          <div className="footer-section">
            <h4>Enlaces</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Sobre nosotros</a></li>
              <li><a href="#" className="footer-link">Contacto</a></li>
              <li><a href="#" className="footer-link">Términos</a></li>
              <li><a href="#" className="footer-link">Privacidad</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 TripWase. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;