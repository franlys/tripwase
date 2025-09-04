// src/components/trip/TripGenerator.tsx
import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, DollarSign, Globe } from 'lucide-react';
import { OriginModal, FreeMapModal } from '../modals';
import { generateThreePlans, SimplePlan, PlanInput } from '../../utils/multiplePlanGenerator';

interface TripGeneratorProps {
  onBackToExplore: () => void;
  onShowPlans: (plans: SimplePlan[]) => void;
}

const TripGenerator: React.FC<TripGeneratorProps> = ({ onBackToExplore, onShowPlans }) => {
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 2,
    budget: 2000,
    currency: 'EUR',
    interests: [] as string[]
  });

  const [origin, setOrigin] = useState<{ country: string; city: string } | null>(null);
  const [showOriginModal, setShowOriginModal] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const destinationOptions = [
    'España', 'Francia', 'Italia', 'Alemania', 'Reino Unido',
    'Estados Unidos', 'Japón', 'Tailandia', 'México', 'Brasil'
  ];

  const interestOptions = [
    'Historia', 'Arte', 'Gastronomía', 'Naturaleza', 'Aventura',
    'Playas', 'Museos', 'Arquitectura', 'Vida nocturna', 'Compras'
  ];

  const handleOriginConfirm = (originData: any) => {
    setOrigin({
      country: originData.country || 'España',
      city: originData.city || 'Madrid'
    });
    setShowOriginModal(false);
  };

  const handleLocationSelect = (locationName: string, coordinates: any) => {
    setFormData(prev => ({ ...prev, destination: locationName }));
    setShowMap(false);
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleGeneratePlans = async () => {
    if (!origin || !formData.destination || !formData.startDate || !formData.endDate) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setIsGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const planInput: PlanInput = {
        destination: formData.destination,
        origin: `${origin.city}, ${origin.country}`,
        startDate: formData.startDate,
        endDate: formData.endDate,
        travelers: formData.travelers,
        budget: formData.budget,
        currency: formData.currency,
        interests: formData.interests
      };

      const plans = generateThreePlans(planInput);
      onShowPlans(plans);

    } catch (error) {
      console.error('Error generando planes:', error);
      alert('Error al generar los planes. Por favor intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = origin && formData.destination && formData.startDate && formData.endDate;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <button onClick={onBackToExplore} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 20px', backgroundColor: 'rgba(255,255,255,0.1)',
            color: 'white', border: 'none', borderRadius: '12px',
            cursor: 'pointer', marginBottom: '20px'
          }}>
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Volver a Explorar
          </button>
          <h1 style={{ 
            color: 'white', margin: 0, fontSize: '32px', 
            fontWeight: 'bold', textAlign: 'center'
          }}>
            Planificador de Viajes Inteligente
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.8)', margin: '8px 0 0 0', 
            textAlign: 'center', fontSize: '16px'
          }}>
            Generaremos 3 opciones personalizadas para tu viaje perfecto
          </p>
        </div>

        <div style={{
          backgroundColor: 'white', borderRadius: '20px',
          padding: '32px', boxShadow: '0 25px 50px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={{ 
                display: 'flex', alignItems: 'center', gap: '8px',
                marginBottom: '8px', fontWeight: '600', color: '#374151'
              }}>
                <MapPin style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
                Origen
              </label>
              <div style={{
                padding: '12px 16px', border: '2px solid #e5e7eb',
                borderRadius: '12px', backgroundColor: '#f9fafb',
                color: '#374151', fontWeight: '500'
              }}>
                {origin ? `${origin.city}, ${origin.country}` : 'Seleccionando...'}
              </div>
            </div>

            <div>
              <label style={{ 
                display: 'flex', alignItems: 'center', gap: '8px',
                marginBottom: '8px', fontWeight: '600', color: '#374151'
              }}>
                <Globe style={{ width: '16px', height: '16px', color: '#10b981' }} />
                Destino
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={formData.destination}
                  onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                  disabled={!origin}
                  style={{
                    width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb',
                    borderRadius: '12px', fontSize: '14px', cursor: 'pointer',
                    opacity: !origin ? 0.5 : 1
                  }}
                >
                  <option value="">Seleccionar destino</option>
                  {destinationOptions.map(dest => (
                    <option key={dest} value={dest}>{dest}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  disabled={!origin}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', color: '#3b82f6', cursor: 'pointer',
                    opacity: !origin ? 0.5 : 1
                  }}
                  title="Buscar en mapa"
                >
                  <Globe style={{ width: '20px', height: '20px' }} />
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={{ 
                display: 'flex', alignItems: 'center', gap: '8px',
                marginBottom: '8px', fontWeight: '600', color: '#374151'
              }}>
                <Calendar style={{ width: '16px', height: '16px', color: '#10b981' }} />
                Fecha de inicio
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                disabled={!origin}
                style={{
                  width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb',
                  borderRadius: '12px', fontSize: '14px',
                  opacity: !origin ? 0.5 : 1
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'flex', alignItems: 'center', gap: '8px',
                marginBottom: '8px', fontWeight: '600', color: '#374151'
              }}>
                <Calendar style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                Fecha de fin
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                disabled={!origin}
                style={{
                  width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb',
                  borderRadius: '12px', fontSize: '14px',
                  opacity: !origin ? 0.5 : 1
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={{ 
                display: 'flex', alignItems: 'center', gap: '8px',
                marginBottom: '8px', fontWeight: '600', color: '#374151'
              }}>
                <Users style={{ width: '16px', height: '16px', color: '#8b5cf6' }} />
                Viajeros
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.travelers}
                onChange={(e) => setFormData(prev => ({ ...prev, travelers: parseInt(e.target.value) || 1 }))}
                disabled={!origin}
                style={{
                  width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb',
                  borderRadius: '12px', fontSize: '14px',
                  opacity: !origin ? 0.5 : 1
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'flex', alignItems: 'center', gap: '8px',
                marginBottom: '8px', fontWeight: '600', color: '#374151'
              }}>
                <DollarSign style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
                Presupuesto base
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  min="500"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) || 500 }))}
                  disabled={!origin}
                  style={{
                    flex: 1, padding: '12px 16px', border: '2px solid #e5e7eb',
                    borderRadius: '12px', fontSize: '14px',
                    opacity: !origin ? 0.5 : 1
                  }}
                />
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  disabled={!origin}
                  style={{
                    padding: '12px 16px', border: '2px solid #e5e7eb',
                    borderRadius: '12px', fontSize: '14px',
                    opacity: !origin ? 0.5 : 1
                  }}
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="DOP">DOP</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ 
              display: 'block', marginBottom: '12px', 
              fontWeight: '600', color: '#374151'
            }}>
              Intereses (opcional)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {interestOptions.map(interest => {
                const isSelected = formData.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    disabled={!origin}
                    style={{
                      padding: '8px 16px', borderRadius: '20px',
                      border: '2px solid #e5e7eb',
                      backgroundColor: isSelected ? '#3b82f6' : 'white',
                      color: isSelected ? 'white' : '#374151',
                      cursor: 'pointer', fontSize: '14px', fontWeight: '500',
                      transition: 'all 0.2s ease',
                      opacity: !origin ? 0.5 : 1
                    }}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleGeneratePlans}
            disabled={!isFormValid || isGenerating}
            style={{
              width: '100%', padding: '16px 32px', borderRadius: '16px',
              border: 'none', 
              background: isFormValid && !isGenerating
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : '#e5e7eb',
              color: isFormValid && !isGenerating ? 'white' : '#9ca3af',
              fontSize: '18px', fontWeight: 'bold',
              cursor: isFormValid && !isGenerating ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease'
            }}
          >
            {isGenerating ? 'Generando planes increíbles...' : 'Generar 3 Opciones de Viaje'}
          </button>

          {!isFormValid && (
            <p style={{ 
              textAlign: 'center', color: '#6b7280', 
              fontSize: '14px', margin: '12px 0 0 0'
            }}>
              Completa todos los campos para generar tus planes personalizados
            </p>
          )}
        </div>
      </div>

      <OriginModal
        isOpen={showOriginModal}
        onConfirm={handleOriginConfirm}
      />

      <FreeMapModal
        isOpen={showMap}
        onClose={() => setShowMap(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
};

export default TripGenerator;