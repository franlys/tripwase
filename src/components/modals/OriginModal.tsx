// src/components/modals/OriginModal.tsx - CON BOTÓN DE CERRAR
import React, { useState, useEffect } from 'react';
import { Map, AlertCircle, X } from 'lucide-react';
import { CountryCode } from '../../types';

interface OriginData {
  country: string;
  countryCode: CountryCode;
  city: string;
  flag: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface OriginModalProps {
  isOpen: boolean;
  onConfirm: (origin: OriginData) => void;
  isRequired?: boolean;
  onClose?: () => void;
}

interface CountryOption {
  code: CountryCode;
  name: string;
  cities: string[];
  flag: string;
}

const countryOptions: CountryOption[] = [
  { 
    code: 'DO', 
    name: 'República Dominicana', 
    cities: ['Santo Domingo', 'Santiago', 'Puerto Plata', 'Punta Cana', 'La Romana'],
    flag: '🇩🇴'
  },
  { 
    code: 'US', 
    name: 'Estados Unidos', 
    cities: ['New York', 'Miami', 'Los Angeles', 'Chicago', 'Orlando'],
    flag: '🇺🇸'
  },
  { 
    code: 'CO', 
    name: 'Colombia', 
    cities: ['Bogotá', 'Cartagena', 'Medellín', 'Barranquilla', 'Cali'],
    flag: '🇨🇴'
  },
  { 
    code: 'MX', 
    name: 'México', 
    cities: ['Ciudad de México', 'Cancún', 'Guadalajara', 'Monterrey', 'Playa del Carmen'],
    flag: '🇲🇽'
  },
  { 
    code: 'ES', 
    name: 'España', 
    cities: ['Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Bilbao'],
    flag: '🇪🇸'
  },
  { 
    code: 'FR', 
    name: 'Francia', 
    cities: ['París', 'Marsella', 'Lyon', 'Toulouse', 'Niza'],
    flag: '🇫🇷'
  },
  { 
    code: 'IT', 
    name: 'Italia', 
    cities: ['Roma', 'Milán', 'Nápoles', 'Turín', 'Florencia'],
    flag: '🇮🇹'
  },
  { 
    code: 'GB', 
    name: 'Reino Unido', 
    cities: ['Londres', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds'],
    flag: '🇬🇧'
  },
  { 
    code: 'NL', 
    name: 'Países Bajos', 
    cities: ['Ámsterdam', 'Rotterdam', 'La Haya', 'Utrecht', 'Eindhoven'],
    flag: '🇳🇱'
  },
  { 
    code: 'PT', 
    name: 'Portugal', 
    cities: ['Lisboa', 'Oporto', 'Braga', 'Coimbra', 'Aveiro'],
    flag: '🇵🇹'
  }
];

const OriginModal: React.FC<OriginModalProps> = ({ 
  isOpen, 
  onConfirm, 
  isRequired = true, 
  onClose 
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('DO');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isRequired && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isRequired, onClose]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value as CountryCode;
    setSelectedCountry(newCountry);
    setSelectedCity('');
    setShowValidation(false);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
    setShowValidation(false);
  };

  const handleConfirm = () => {
    const selectedCountryData = countryOptions.find(c => c.code === selectedCountry);
    
    if (!selectedCountryData) {
      setShowValidation(true);
      return;
    }

    const originData: OriginData = {
      country: selectedCountryData.name,
      countryCode: selectedCountry,
      city: selectedCity || selectedCountryData.cities[0] || '',
      flag: selectedCountryData.flag
    };
    
    onConfirm(originData);
  };

  const handleClose = () => {
    if (!isRequired && onClose) {
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isRequired && onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const selectedCountryData = countryOptions.find(c => c.code === selectedCountry);

  return (
    <div 
      className="origin-modal-overlay" 
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto'
      }}
    >
      <div 
        className="origin-modal-container"
        style={{
          backgroundColor: 'white',
          borderRadius: '1.5rem',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: 'auto',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ✅ BOTÓN DE CERRAR AGREGADO */}
        {!isRequired && onClose && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-50"
            style={{
              background: 'white',
              border: '2px solid #e5e7eb',
              cursor: 'pointer'
            }}
            title="Cerrar"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}

        <div className="origin-modal-header" style={{ padding: '2rem 2rem 1rem', textAlign: 'center', borderBottom: '1px solid #e5e7eb', position: 'relative' }}>
          {isRequired && (
            <div 
              className="origin-required-badge"
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                zIndex: 10
              }}
            >
              <AlertCircle className="w-3 h-3" style={{ display: 'inline', marginRight: '0.25rem' }} />
              Obligatorio
            </div>
          )}
          
          <div className="origin-header-icon" style={{ marginBottom: '1rem' }}>
            <Map className="w-6 h-6" style={{ margin: '0 auto' }} />
          </div>
          <h2 className="origin-modal-title" style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
            ¿Desde dónde viajas?
          </h2>
          <p className="origin-modal-subtitle" style={{ color: '#6b7280' }}>
            {isRequired 
              ? 'Esta información es obligatoria para calcular vuelos y planificar tu viaje'
              : 'Selecciona tu ubicación actual para obtener las mejores recomendaciones de viaje'
            }
          </p>
        </div>

        <div className="origin-modal-body" style={{ padding: '2rem', overflowY: 'auto' }}>
          {showValidation && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #EF4444',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              marginBottom: '1rem',
              color: '#EF4444',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle className="w-4 h-4" />
              <span>Por favor selecciona un país válido</span>
            </div>
          )}

          <div className="origin-form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="origin-form-label" style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
              {selectedCountryData?.flag} Selecciona tu país actual:
            </label>
            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              className="origin-select"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              {countryOptions.map(country => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="origin-form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="origin-form-label" style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
              Ciudad principal (opcional):
            </label>
            <select
              value={selectedCity}
              onChange={handleCityChange}
              className="origin-select"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">Seleccionar ciudad...</option>
              {selectedCountryData?.cities.map(city => (
                <option key={city} value={city}>{city}</option>
              )) || []}
            </select>
          </div>

          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg" style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '0.5rem' }}>
            <p className="text-amber-800 text-sm" style={{ color: '#92400e', fontSize: '0.875rem' }}>
              <strong>💡 ¿Por qué necesitamos esto?</strong><br />
              Esta información nos ayuda a:
            </p>
            <ul style={{ 
              marginTop: '0.5rem', 
              marginLeft: '1rem',
              fontSize: '0.875rem',
              color: '#92400e'
            }}>
              <li>• Determinar si necesitas vuelos o puedes viajar por carretera</li>
              <li>• Calcular presupuestos más precisos</li>
              <li>• Sugerir itinerarios optimizados</li>
              <li>• Mostrar ofertas específicas de tu región</li>
            </ul>
          </div>

          {selectedCountryData && (
            <div style={{
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ 
                margin: '0 0 0.5rem 0',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                Tu selección:
              </h4>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '1rem',
                color: '#6b7280'
              }}>
                <span style={{ fontSize: '1.5rem' }}>{selectedCountryData.flag}</span>
                <div>
                  <div style={{ fontWeight: '500', color: '#1f2937' }}>
                    {selectedCity || 'Sin ciudad específica'}
                  </div>
                  <div style={{ fontSize: '0.875rem' }}>
                    {selectedCountryData.name}
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleConfirm}
            className="origin-confirm-button"
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #FC6A03, #284eee)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '1rem'
            }}
          >
            {isRequired ? 'Confirmar y Continuar' : 'Guardar Selección'}
          </button>

          {!isRequired && onClose && (
            <button
              onClick={handleClose}
              style={{
                width: '100%',
                background: 'transparent',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginTop: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Cancelar
            </button>
          )}

          {isRequired && (
            <p style={{
              textAlign: 'center',
              fontSize: '0.75rem',
              color: '#9ca3af',
              marginTop: '1rem',
              fontStyle: 'italic'
            }}>
              * No puedes continuar sin seleccionar tu origen
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OriginModal;