// src/components/modals/FreeMapModal.tsx - CON ANIMACIONES
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Globe, MapPin, Navigation } from 'lucide-react';
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

// Sugerencias de lugares populares
const POPULAR_DESTINATIONS = [
  { name: 'Punta Cana, República Dominicana', lat: 18.5601, lng: -68.3725 },
  { name: 'París, Francia', lat: 48.8566, lng: 2.3522 },
  { name: 'Tokyo, Japón', lat: 35.6762, lng: 139.6503 },
  { name: 'Nueva York, USA', lat: 40.7128, lng: -74.0060 },
  { name: 'Londres, Reino Unido', lat: 51.5074, lng: -0.1278 },
  { name: 'Roma, Italia', lat: 41.9028, lng: 12.4964 },
  { name: 'Barcelona, España', lat: 41.3851, lng: 2.1734 },
  { name: 'Dubái, UAE', lat: 25.2048, lng: 55.2708 }
];

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  // ✅ Estado para controlar animación de cierre
  const [isClosing, setIsClosing] = useState(false);

  // ✅ Función mejorada para cerrar con animación
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // Duración de la animación de cierre
  };

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
        scrollWheelZoom: true,
        worldCopyJump: true
      });

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 2
      }).addTo(newMap);

      // Botón para vista mundial
      const worldViewButton = window.L.control({ position: 'topright' });
      worldViewButton.onAdd = function() {
        const div = window.L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        div.innerHTML = '<button style="background: white; border: none; padding: 8px; cursor: pointer; font-size: 16px;" title="Vista mundial">🌍</button>';
        div.onclick = function() {
          newMap.setView([20, 0], 2);
        };
        return div;
      };
      worldViewButton.addTo(newMap);

      newMap.on('click', async (e: any) => {
        const { lat, lng } = e.latlng;
        
        if (marker) {
          newMap.removeLayer(marker);
        }

        const newMarker = window.L.marker([lat, lng], {
          icon: window.L.divIcon({
            className: 'custom-marker',
            html: '<div style="background: #3b82f6; color: white; border: 2px solid white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">📍</div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          })
        }).addTo(newMap);
        setMarker(newMarker);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=10`
          );
          const data = await response.json();
          
          const locationName = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          setSelectedLocation({
            name: locationName,
            coordinates: { lat, lng }
          });

          newMarker.bindPopup(`
            <div style="text-align: center; min-width: 200px;">
              <div style="background: #3b82f6; color: white; padding: 8px; margin: -9px -20px 8px -20px; border-radius: 8px 8px 0 0;">
                <b>📍 Ubicación Seleccionada</b>
              </div>
              <div style="padding: 8px 0;">
                <b>${data.name || data.address?.city || data.address?.town || 'Ubicación'}</b><br/>
                <small style="color: #666;">${locationName}</small><br/>
                <small style="color: #999;">${lat.toFixed(6)}, ${lng.toFixed(6)}</small>
              </div>
              <div style="border-top: 1px solid #eee; padding-top: 8px; margin-top: 8px;">
                <small style="color: #3b82f6;">Haz clic en "Confirmar Ubicación" para seleccionar</small>
              </div>
            </div>
          `).openPopup();

        } catch (error) {
          console.error('Error obteniendo información de ubicación:', error);
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

          const newMarker = window.L.marker([lat, lng], {
            icon: window.L.divIcon({
              className: 'custom-marker',
              html: '<div style="background: #f59e0b; color: white; border: 2px solid white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">🔍</div>',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            })
          }).addTo(map);
          setMarker(newMarker);

          const locationName = place.display_name;
          setSelectedLocation({
            name: locationName,
            coordinates: { lat, lng }
          });

          newMarker.bindPopup(`
            <div style="text-align: center; min-width: 200px;">
              <div style="background: #f59e0b; color: white; padding: 8px; margin: -9px -20px 8px -20px; border-radius: 8px 8px 0 0;">
                <b>🔍 Resultado de Búsqueda</b>
              </div>
              <div style="padding: 8px 0;">
                <b>${place.name || 'Ubicación'}</b><br/>
                <small style="color: #666;">${locationName}</small><br/>
                <small style="color: #999;">${lat.toFixed(6)}, ${lng.toFixed(6)}</small>
              </div>
            </div>
          `).openPopup();
        }
        setShowSuggestions(false);
      } else {
        alert('No se encontró la ubicación. Intenta con otro nombre.');
      }
    } catch (error) {
      console.error('Error en búsqueda:', error);
      alert('Error al buscar la ubicación. Verifica tu conexión a internet.');
    } finally {
      setIsSearching(false);
    }
  };

  const goToSuggestion = (destination: typeof POPULAR_DESTINATIONS[0]) => {
    if (map) {
      map.setView([destination.lat, destination.lng], 10);
      setSearchQuery(destination.name);
      setShowSuggestions(false);
      
      if (marker) {
        map.removeLayer(marker);
      }

      const newMarker = window.L.marker([destination.lat, destination.lng], {
        icon: window.L.divIcon({
          className: 'custom-marker',
          html: '<div style="background: #10b981; color: white; border: 2px solid white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">⭐</div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        })
      }).addTo(map);
      setMarker(newMarker);

      setSelectedLocation({
        name: destination.name,
        coordinates: { lat: destination.lat, lng: destination.lng }
      });

      newMarker.bindPopup(`
        <div style="text-align: center; min-width: 200px;">
          <div style="background: #10b981; color: white; padding: 8px; margin: -9px -20px 8px -20px; border-radius: 8px 8px 0 0;">
            <b>⭐ Destino Popular</b>
          </div>
          <div style="padding: 8px 0;">
            <b>${destination.name.split(',')[0]}</b><br/>
            <small style="color: #666;">${destination.name}</small><br/>
            <small style="color: #999;">${destination.lat.toFixed(4)}, ${destination.lng.toFixed(4)}</small>
          </div>
        </div>
      `).openPopup();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchPlace();
    }
  };

  // ✅ Función para manejar clics en el overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    // ✅ OVERLAY CON CLASE DE ANIMACIÓN
    <div 
      className={`modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto'
      }}
      onClick={handleOverlayClick}
    >
      {/* ✅ CONTAINER CON ANIMACIONES */}
      <div 
        className={`modal-content ${isClosing ? 'modal-content-closing' : ''} bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-y-auto`}
        style={{
          backgroundColor: 'white',
          borderRadius: '1.5rem',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          width: '100%',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: 'auto',
          position: 'relative',
          zIndex: 100000
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Mapa Mundial Interactivo</h2>
              <p className="text-sm text-gray-600">Selecciona cualquier ubicación del planeta</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
            style={{ zIndex: 100001 }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Barra de búsqueda con sugerencias */}
          <div className="mb-4 relative">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar cualquier lugar: ciudad, país, dirección..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setShowSuggestions(true)}
                  className="form-input pl-10 pr-4 py-3"
                />
                <button
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title="Ver destinos populares"
                >
                  <Navigation className="w-4 h-4" />
                </button>
              </div>
              {/* ✅ BOTÓN CON CLASES MEJORADAS */}
              <button
                onClick={searchPlace}
                disabled={isSearching || !searchQuery.trim()}
                className="btn-premium"
              >
                <Search className="w-4 h-4" />
                {isSearching ? 'Buscando...' : 'Buscar'}
              </button>
            </div>

            {/* Panel de sugerencias */}
            {showSuggestions && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg"
                style={{ zIndex: 100002 }}
              >
                <div className="p-3 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Destinos Populares
                  </h4>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {POPULAR_DESTINATIONS.map((dest, index) => (
                    <button
                      key={index}
                      onClick={() => goToSuggestion(dest)}
                      className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{dest.name.split(',')[0]}</div>
                      <div className="text-sm text-gray-600">{dest.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Instrucciones mejoradas */}
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">Cómo seleccionar una ubicación:</p>
                <ul className="text-blue-700 space-y-1">
                  <li>• <strong>Buscar:</strong> Escribe cualquier lugar y presiona "Buscar"</li>
                  <li>• <strong>Hacer clic:</strong> Haz clic directamente en el mapa</li>
                  <li>• <strong>Destinos populares:</strong> Usa el botón 🧭 para ver sugerencias</li>
                  <li>• <strong>Vista mundial:</strong> Usa el botón 🌍 en el mapa para ver todo el planeta</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-4 relative">
            <div 
              ref={mapRef} 
              className="w-full h-96 rounded-lg border-2 border-gray-200"
              style={{ 
                minHeight: '400px',
                zIndex: 1
              }}
            />
            
            {!map && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <div className="loading-spinner mx-auto mb-4"></div>
                  <p className="text-gray-600 mb-2">Cargando mapa mundial...</p>
                  <p className="text-sm text-gray-500">Powered by OpenStreetMap</p>
                </div>
              </div>
            )}
          </div>

          {/* Panel de información más detallado */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-gray-600 flex-1">
              {selectedLocation ? (
                <div className="space-y-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <strong className="text-green-900">Ubicación seleccionada:</strong>
                  </div>
                  <div className="text-green-800 font-medium">{selectedLocation.name}</div>
                  <div className="text-xs text-green-600">
                    Coordenadas: {selectedLocation.coordinates.lat.toFixed(6)}, {selectedLocation.coordinates.lng.toFixed(6)}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 p-4 bg-gray-50 rounded-lg text-center">
                  <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p>Busca un lugar o haz clic en el mapa para seleccionar una ubicación</p>
                  <p className="text-xs mt-1">Puedes seleccionar cualquier lugar del mundo</p>
                </div>
              )}
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              {/* ✅ BOTONES CON CLASES MEJORADAS */}
              <button
                onClick={handleClose}
                className="btn-secondary-premium flex-1 sm:flex-none"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (selectedLocation) {
                    onLocationSelect(selectedLocation.name, selectedLocation.coordinates);
                    handleClose();
                  }
                }}
                disabled={!selectedLocation}
                className="btn-premium flex-1 sm:flex-none"
              >
                <MapPin className="w-4 h-4" />
                Confirmar Ubicación
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeMapModal;