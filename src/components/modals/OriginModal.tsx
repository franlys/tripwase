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
  { code: 'DO', name: 'Rep�blica Dominicana', cities: ['Santo Domingo', 'Santiago', 'Puerto Plata', 'Punta Cana'] },
  { code: 'US', name: 'Estados Unidos', cities: ['New York', 'Miami', 'Los Angeles', 'Chicago'] },
  { code: 'CO', name: 'Colombia', cities: ['Bogot�', 'Cartagena', 'Medell�n', 'Barranquilla'] },
  { code: 'MX', name: 'M�xico', cities: ['Ciudad de M�xico', 'Canc�n', 'Guadalajara', 'Monterrey'] },
  { code: 'ES', name: 'Espa�a', cities: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla'] }
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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Map className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Bienvenido a TripWase</h2>
            <p className="text-gray-600">Para comenzar, necesitamos saber desde d�nde viajar�s</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecciona tu pa�s actual:
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => {
                  const newCountry = e.target.value as CountryCode;
                  setSelectedCountry(newCountry);
                  const countryData = countryOptions.find(c => c.code === newCountry);
                  if (countryData) {
                    setSelectedCity(countryData.cities[0]);
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {countryOptions.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ciudad principal (opcional):
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {countryOptions.find(c => c.code === selectedCountry)?.cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">
              <strong>Importante:</strong> Esta informaci�n nos ayuda a determinar autom�ticamente 
              si necesitas vuelos o puedes viajar por carretera a tu destino.
            </p>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Confirmar y Continuar
          </button>
        </div>
      </div>
    </div>
  );
}

export default OriginModal;
