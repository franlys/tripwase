// src/components/modals/OriginModal.tsx
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

const countryOptions: CountryOption[] = [
  { code: 'DO', name: 'República Dominicana', cities: ['Santo Domingo', 'Santiago', 'Puerto Plata', 'Punta Cana'] },
  { code: 'US', name: 'Estados Unidos', cities: ['New York', 'Miami', 'Los Angeles', 'Chicago'] },
  { code: 'CO', name: 'Colombia', cities: ['Bogotá', 'Cartagena', 'Medellín', 'Barranquilla'] },
  { code: 'MX', name: 'México', cities: ['Ciudad de México', 'Cancún', 'Guadalajara', 'Monterrey'] },
  { code: 'ES', name: 'España', cities: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla'] }
];

const OriginModal: React.FC<OriginModalProps> = ({ isOpen, onConfirm }) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('DO');
  const [selectedCity, setSelectedCity] = useState('Santo Domingo');

  const handleConfirm = () => {
    const countryData = countryOptions.find(c => c.code === selectedCountry);
    if (countryData) {
      onConfirm({
        country: countryData.name,
        countryCode: selectedCountry,
        city: selectedCity
      });
    }
  };

  if (!isOpen) return null;

  return (
  <div className="origin-modal-overlay">
    <div className="origin-modal-content">
      <div className="origin-modal-header">
        <div className="origin-modal-icon">
          <Map className="w-8 h-8 text-white" />
        </div>
        <h2 className="origin-modal-title">Bienvenido a TripWase</h2>
        <p className="origin-modal-subtitle">
          Para comenzar, necesitamos saber desde dónde viajarás
        </p>
      </div>

      <div className="origin-modal-body">
        <div className="origin-form-group">
          <label className="origin-form-label">
            Selecciona tu país actual:
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => {
  const selectedOption = countryOptions.find(c => c.code === e.target.value);
  if (selectedOption) {
    setSelectedCountry(selectedOption.code);
    setSelectedCity(selectedOption.cities[0]);
  }
}}
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
            onChange={(e) => setSelectedCity(e.target.value)}
            className="origin-select"
          >
            {countryOptions.find(c => c.code === selectedCountry)?.cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
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
}

export default OriginModal;
