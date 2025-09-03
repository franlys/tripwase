// src/components/modals/PlanDetailsModal.tsx
import React, { useState, useMemo } from 'react';

// Tipos simplificados para el modal
interface Trip {
  id: string;
  name: string;
  destination: {
    name: string;
    country: string;
  };
  startDate: string;
  endDate: string;
  travelers: {
    adults: number;
    children: number;
  };
  currency: string;
  budget: {
    total: number;
  };
  interests?: string[];
  accommodationType?: string;
  transportMode?: string;
}

interface PlanDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip | null;
  onSaveTrip?: (trip: Trip) => void;
  onBookTrip?: (trip: Trip) => void;
}

const PlanDetailsModal: React.FC<PlanDetailsModalProps> = ({
  isOpen,
  onClose,
  trip,
  onSaveTrip,
  onBookTrip
}) => {
  if (!isOpen || !trip) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '16px',
        width: '90%', maxWidth: '800px', height: '80%',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px', borderBottom: '1px solid #e5e7eb',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
              {trip.name}
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>
              {trip.destination.name}, {trip.destination.country}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: '24px',
            cursor: 'pointer', color: '#6b7280', padding: '8px'
          }}>×</button>
        </div>

        {/* Content básico */}
        <div style={{ flex: 1, padding: '24px' }}>
          <h3>Detalles del Plan de Viaje</h3>
          <div style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
            <div>
              <strong>Fechas:</strong> {trip.startDate} - {trip.endDate}
            </div>
            <div>
              <strong>Viajeros:</strong> {trip.travelers.adults} adultos
              {trip.travelers.children > 0 && `, ${trip.travelers.children} niños`}
            </div>
            <div>
              <strong>Presupuesto:</strong> {trip.budget.total} {trip.currency}
            </div>
            {trip.interests && trip.interests.length > 0 && (
              <div>
                <strong>Intereses:</strong> {trip.interests.join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '24px', borderTop: '1px solid #e5e7eb',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <button onClick={onClose} style={{
            padding: '12px 24px', borderRadius: '8px',
            border: '1px solid #e5e7eb', backgroundColor: 'white',
            color: '#374151', cursor: 'pointer'
          }}>
            Cerrar
          </button>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            {onSaveTrip && (
              <button onClick={() => onSaveTrip(trip)} style={{
                padding: '12px 24px', borderRadius: '8px',
                border: '1px solid #3b82f6', backgroundColor: '#eff6ff',
                color: '#3b82f6', cursor: 'pointer'
              }}>
                Guardar Plan
              </button>
            )}
            {onBookTrip && (
              <button onClick={() => onBookTrip(trip)} style={{
                padding: '12px 32px', borderRadius: '8px',
                border: 'none', backgroundColor: '#3b82f6',
                color: 'white', cursor: 'pointer', fontWeight: '600'
              }}>
                Reservar Viaje
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailsModal;
