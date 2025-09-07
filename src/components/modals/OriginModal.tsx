// src/components/modals/OriginModal.tsx
// REEMPLAZA COMPLETAMENTE tu archivo con este código:

import React, { useState } from 'react';
import { Map } from 'lucide-react';
import { CountryCode, OriginData } from '../../types';

interface OriginModalProps {
  isOpen: boolean;
  onConfirm: (origin: OriginData) => void;
}

interface CountryOption {
  code: CountryCode;
  name: string;
  cities: string[];
}

// ✅ SOLO PAÍSES QUE EXISTEN EN TU CountryCode (sin BR)
const countryOptions: CountryOption[] = [
  { 
    code: 'DO', 
    name: 'República Dominicana', 
    cities: ['Santo Domingo', 'Santiago', 'Puerto Plata', 'Punta Cana', 'La Romana'] 
  },
  { 
    code: 'US', 
    name: 'Estados Unidos', 
    cities: ['New York', 'Miami', 'Los Angeles', 'Chicago', 'Orlando'] 
  },
  { 
    code: 'CO', 
    name: 'Colombia', 
    cities: ['Bogotá', 'Cartagena', 'Medellín', 'Barranquilla', 'Cali'] 
  },
  { 
    code: 'MX', 
    name: 'México', 
    cities: ['Ciudad de México', 'Cancún', 'Guadalajara', 'Monterrey', 'Playa del Carmen'] 
  },
  { 
    code: 'ES', 
    name: 'España', 
    cities: ['Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Bilbao'] 
  },
  { 
    code: 'FR', 
    name: 'Francia', 
    cities: ['París', 'Marsella', 'Lyon', 'Toulouse', 'Niza'] 
  },
  { 
    code: 'IT', 
    name: 'Italia', 
    cities: ['Roma', 'Milán', 'Nápoles', 'Turín', 'Florencia'] 
  },
  { 
    code: 'GB', 
    name: 'Reino Unido', 
    cities: ['Londres', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds'] 
  },
  { 
    code: 'NL', 
    name: 'Países Bajos', 
    cities: ['Ámsterdam', 'Rotterdam', 'La Haya', 'Utrecht', 'Eindhoven'] 
  },
  { 
    code: 'PT', 
    name: 'Portugal', 
    cities: ['Lisboa', 'Oporto', 'Braga', 'Coimbra', 'Aveiro'] 
  }
];

const OriginModal: React.FC<OriginModalProps> = ({ isOpen, onConfirm }) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('DO');
  const [selectedCity, setSelectedCity] = useState<string>('');

  // ✅ HANDLERS CON TIPOS CORRECTOS
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value as CountryCode;
    setSelectedCountry(newCountry);
    setSelectedCity(''); // Reset city when country changes
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
  };

  // ✅ OBJETO CON TODAS LAS PROPIEDADES REQUERIDAS POR OriginData
  const handleConfirm = () => {
    const selectedCountryData = countryOptions.find(c => c.code === selectedCountry);
    
    const originData: OriginData = {
      country: selectedCountryData?.name || '',
      countryCode: selectedCountry,
      city: selectedCity || selectedCountryData?.cities[0] || ''
    };
    
    onConfirm(originData);
  };

  if (!isOpen) return null;

  const selectedCountryData = countryOptions.find(c => c.code === selectedCountry);

  return (
    <div className="origin-modal-overlay">
      <div className="origin-modal-container">
        <div className="origin-modal-header">
          <div className="origin-header-icon">
            <Map className="w-6 h-6" />
          </div>
          <h2 className="origin-modal-title">¿Desde dónde viajas?</h2>
          <p className="origin-modal-subtitle">
            Selecciona tu ubicación actual para obtener las mejores recomendaciones de viaje
          </p>
        </div>

        <div className="origin-modal-body">
          <div className="origin-form-group">
            <label className="origin-form-label">
              Selecciona tu país actual:
            </label>
            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              className="origin-select"
            >
              {countryOptions.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="origin-form-group">
            <label className="origin-form-label">
              Ciudad principal (opcional):
            </label>
            <select
              value={selectedCity}
              onChange={handleCityChange}
              className="origin-select"
            >
              <option value="">Seleccionar ciudad...</option>
              {selectedCountryData?.cities.map(city => (
                <option key={city} value={city}>{city}</option>
              )) || []}
            </select>
          </div>

          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">
              <strong>Importante:</strong> Esta información nos ayuda a determinar automáticamente 
              si necesitas vuelos o puedes viajar por carretera a tu destino.
            </p>
          </div>

          <button
            onClick={handleConfirm}
            className="origin-confirm-button"
          >
            Confirmar y Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OriginModal;