// src/pages/SearchPage.tsx - Página de búsqueda
import React from 'react';
import AdvancedSearch from '../components/AdvancedSearch';

const SearchPage: React.FC = () => {
  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="heading-2">Búsqueda Avanzada</h2>
          <p className="text-large">
            Encuentra el destino perfecto para tu próximo viaje
          </p>
        </div>
        <AdvancedSearch />
      </div>
    </div>
  );
};

export default SearchPage;