// src/components/trip/TripGenerator.tsx
import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, DollarSign, Globe } from 'lucide-react';
import { TripFormData, OriginData, SelectedLocation } from '../../types';
import { OriginModal, FreeMapModal } from '../modals';

interface TripGeneratorProps {
  onBackToExplore: () => void;
}

export const TripGenerator: React.FC<TripGeneratorProps> = ({ onBackToExplore }) => {
  const [formData, setFormData] = useState<TripFormData>({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 2,
    budget: 100000,
    currency: 'DOP',
    travelMode: 'auto'
  });

  const [origin, setOrigin] = useState<OriginData | null>(null);
  const [showOriginModal, setShowOriginModal] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);

  const handleLocationSelect = (locationName: string, coordinates: { lat: number; lng: number }) => {
    setSelectedLocation({ name: locationName, coordinates });
    setFormData({ ...formData, destination: locationName });
  };

  const handleOriginConfirm = (originData: OriginData) => {
    setOrigin(originData);
    setShowOriginModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={onBackToExplore}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Explorar
          </button>
        </div>

        <OriginModal isOpen={showOriginModal} onConfirm={handleOriginConfirm} />
        
        <FreeMapModal
          isOpen={showMap}
          onClose={() => setShowMap(false)}
          onLocationSelect={handleLocationSelect}
        />

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
            Planificador de Viajes Inteligente
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                Destino
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Selecciona cualquier lugar del mundo"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  disabled={!origin}
                />
                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  disabled={!origin}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                  title="Abrir mapa mundial interactivo"
                >
                  <Globe className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 mr-2 text-green-600" />
                Fecha de salida
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                disabled={!origin}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 mr-2 text-red-600" />
                Fecha de regreso
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                disabled={!origin}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Users className="w-4 h-4 mr-2 text-purple-600" />
                Viajeros
              </label>
              <select
                value={formData.travelers}
                onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                disabled={!origin}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'persona' : 'personas'}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <DollarSign className="w-4 h-4 mr-2 text-yellow-600" />
              Presupuesto total ({formData.currency})
            </label>
            <div className="relative">
              <input
                type="range"
                min={formData.currency === 'DOP' ? 50000 : 1000}
                max={formData.currency === 'DOP' ? 500000 : 10000}
                step={formData.currency === 'DOP' ? 5000 : 100}
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                className="w-full h-2 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer"
                disabled={!origin}
              />
              <div className="mt-2 text-center">
                <span className="font-bold text-lg">
                  {formData.currency === 'DOP' ? 'RD$' : '$'}{formData.budget.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <button
            disabled={!origin || !formData.destination || !formData.startDate || !formData.endDate}
            className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Generar planes de viaje inteligentes
          </button>
        </div>
      </div>
    </div>
  );
};
