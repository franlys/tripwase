// ============================================
// 1. src/components/map/InteractiveMap.tsx
// ============================================
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Arreglar el problema del icono por defecto de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    popup?: string;
  }>;
  onMapClick?: (lat: number, lng: number) => void;
  height?: string;
  width?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  center = [18.7357, -70.1627], // República Dominicana por defecto
  zoom = 6,
  markers = [],
  onMapClick,
  height = '400px',
  width = '100%'
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Inicializar mapa
    mapRef.current = L.map(mapContainerRef.current).setView(center, zoom);

    // Añadir capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current);

    // Manejar clics en el mapa
    if (onMapClick) {
      mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
        onMapClick(e.latlng.lat, e.latlng.lng);
      });
    }

    // Añadir marcadores
    markers.forEach(marker => {
      const leafletMarker = L.marker(marker.position).addTo(mapRef.current!);
      if (marker.popup) {
        leafletMarker.bindPopup(marker.popup);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ height, width }}
      className="rounded-lg shadow-lg"
    />
  );
};

export default InteractiveMap;
