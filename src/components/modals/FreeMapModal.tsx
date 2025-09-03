// src/components/modals/FreeMapModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { SelectedLocation } from '../../types';

interface FreeMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (locationName: string, coordinates: { lat: number; lng: number }) => void;
}

declare global {
  interface Window {
    L: any;
  }
}

const FreeMapModal: React.FC<FreeMapModalProps> = ({ 
  isOpen, 
  onClose, 
  onLocationSelect 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);

  useEffect(() => {
    if (!isOpen || !mapRef.current || map) return;

    const loadLeaflet = async () => {
      if (!window.L) {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(linkElement);

        const scriptElement = document.createElement('script');
        scriptElement.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        document.head.appendChild(scriptElement);

        await new Promise((resolve) => {
          scriptElement.onload = resolve;
        });
      }

      const newMap = window.L.map(mapRef.current, {
        center: [18.7357, -70.1627],
        zoom: 6,
        zoomControl: true,
        scrollWheelZoom: true
      });

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '� OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(newMap);

      newMap.on('click', async (e: any) => {
        const { lat, lng } = e.latlng;
        
        if (marker) {
          newMap.removeLayer(marker);
        }

        const newMarker = window.L.marker([lat, lng]).addTo(newMap);
        setMarker(newMarker);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
          );
          const data = await response.json();
          
          const locationName = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          setSelectedLocation({
            name: locationName,
            coordinates: { lat, lng }
          });

          newMarker.bindPopup(`
            <div style="text-align: center;">
              <b>${locationName}</b><br/>
              <small>${lat.toFixed(6)}, ${lng.toFixed(6)}</small>
            </div>
          `).openPopup();

        } catch (error) {
          console.error('Error obteniendo informaci�n de ubicaci�n:', error);
          const locationName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          setSelectedLocation({
            name: locationName,
            coordinates: { lat, lng }
          });
        }
      });

      setMap(newMap);
    };

    loadLeaflet();

    return () => {
      if (map) {
        map.remove();
        setMap(null);
        setMarker(null);
      }
    };
  }, [isOpen, map]);

  const searchPlace = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const place = data[0];
        const lat = parseFloat(place.lat);
        const lng = parseFloat(place.lon);
        
        if (map) {
          map.setView([lat, lng], 12);
          
          if (marker) {
            map.removeLayer(marker);
          }

          const newMarker = window.L.marker([lat, lng]).addTo(map);
          setMarker(newMarker);

          const locationName = place.display_name;
          setSelectedLocation({
            name: locationName,
            coordinates: { lat, lng }
          });

          newMarker.bindPopup(`
            <div style="text-align: center;">
              <b>${place.name || 'Ubicaci�n'}</b><br/>
              <small>${locationName}</small><br/>
              <small>${lat.toFixed(6)}, ${lng.toFixed(6)}</small>
            </div>
          `).openPopup();
        }
      } else {
        alert('No se encontr� la ubicaci�n. Intenta con otro nombre.');
      }
    } catch (error) {
      console.error('Error en b�squeda:', error);
      alert('Error al buscar la ubicaci�n. Verifica tu conexi�n a internet.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchPlace();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Mapa Mundial Interactivo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar cualquier lugar: ciudad, pa�s, direcci�n..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={searchPlace}
                disabled={isSearching || !searchQuery.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {isSearching ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>

          <div className="mb-4 relative">
            <div 
              ref={mapRef} 
              className="w-full h-96 rounded-lg"
              style={{ minHeight: '400px' }}
            />
            
            {!map && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 mb-2">Cargando mapa mundial...</p>
                  <p className="text-sm text-gray-500">Powered by OpenStreetMap</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-gray-600 flex-1">
              {selectedLocation ? (
                <div className="space-y-1">
                  <div><strong>Ubicaci�n seleccionada:</strong></div>
                  <div className="text-gray-800 font-medium">{selectedLocation.name}</div>
                  <div className="text-xs text-gray-500">
                    Coordenadas: {selectedLocation.coordinates.lat.toFixed(6)}, {selectedLocation.coordinates.lng.toFixed(6)}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">
                  Busca un lugar o haz clic en el mapa para seleccionar una ubicaci�n
                </div>
              )}
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (selectedLocation) {
                    onLocationSelect(selectedLocation.name, selectedLocation.coordinates);
                    onClose();
                  }
                }}
                disabled={!selectedLocation}
                className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Ubicaci�n
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeMapModal;