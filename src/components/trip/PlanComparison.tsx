// src/components/trip/PlanComparison.tsx
import React, { useState } from 'react';
import { SimplePlan } from '../../utils/multiplePlanGenerator';

interface PlanComparisonProps {
  plans: SimplePlan[];
  onSelectPlan: (plan: SimplePlan) => void;
  onBack: () => void;
}

const PlanComparison: React.FC<PlanComparisonProps> = ({
  plans,
  onSelectPlan,
  onBack
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const getPlanColor = (tier: string) => {
    const colors = {
      economic: { bg: '#f0f9ff', border: '#0ea5e9', text: '#0369a1', accent: '#38bdf8' },
      medium: { bg: '#f0fdf4', border: '#22c55e', text: '#15803d', accent: '#4ade80' },
      luxury: { bg: '#fefce8', border: '#eab308', text: '#a16207', accent: '#facc15' }
    };
    return colors[tier as keyof typeof colors] || colors.medium;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(amount);
  };

  const getTierIcon = (tier: string) => {
    const icons = { economic: '??', medium: '??', luxury: '??' };
    return icons[tier as keyof typeof icons];
  };

  const handleSelectPlan = (plan: SimplePlan) => {
    setSelectedPlanId(plan.id);
    onSelectPlan(plan);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <button onClick={onBack} style={{
          padding: '8px 16px', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb',
          borderRadius: '8px', cursor: 'pointer', marginBottom: '20px'
        }}>? Volver</button>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
          Elige tu Plan Perfecto
        </h1>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Hemos generado 3 opciones adaptadas a diferentes presupuestos y estilos de viaje
        </p>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px', marginBottom: '40px'
      }}>
        {plans.map(plan => {
          const colors = getPlanColor(plan.tier);
          const isSelected = selectedPlanId === plan.id;

          return (
            <div key={plan.id} onClick={() => handleSelectPlan(plan)} style={{
              backgroundColor: colors.bg, border: `2px solid ${isSelected ? colors.accent : colors.border}`,
              borderRadius: '16px', padding: '24px', cursor: 'pointer', transition: 'all 0.3s ease',
              transform: isSelected ? 'scale(1.02)' : 'scale(1)',
              boxShadow: isSelected ? '0 20px 25px -5px rgba(0,0,0,0.1)' : '0 4px 6px -1px rgba(0,0,0,0.1)'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: colors.text }}>
                    {getTierIcon(plan.tier)} {plan.name}
                  </h3>
                  {plan.tier === 'medium' && (
                    <span style={{
                      backgroundColor: colors.accent, color: 'white', padding: '4px 12px',
                      borderRadius: '12px', fontSize: '12px', fontWeight: '600'
                    }}>MÁS POPULAR</span>
                  )}
                </div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
                  {plan.description}
                </p>
              </div>

              <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: colors.text, marginBottom: '4px' }}>
                  {formatCurrency(plan.totalCost, plan.currency)}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>para {plan.duration} días</div>
                {plan.savings !== 0 && (
                  <div style={{ 
                    fontSize: '12px', 
                    color: plan.savings > 0 ? '#059669' : '#dc2626',
                    marginTop: '4px'
                  }}>
                    {plan.savings > 0 ? '?? ' : ''}
                    {plan.savings > 0 ? 'Ahorras' : 'Gastas'} {formatCurrency(Math.abs(plan.savings), plan.currency)}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Desglose de costos
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { label: '?? Alojamiento', value: plan.breakdown.accommodation },
                    { label: '?? Transporte', value: plan.breakdown.transportation },
                    { label: '??? Comida', value: plan.breakdown.food },
                    { label: '?? Actividades', value: plan.breakdown.activities }
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: '#6b7280' }}>{item.label}</span>
                      <span style={{ fontWeight: '500' }}>{formatCurrency(item.value, plan.currency)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Lo que incluye
                </h4>
                <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {plan.highlights.slice(0, 3).map((highlight, index) => (
                    <li key={index} style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.4' }}>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  padding: '12px', backgroundColor: 'white', borderRadius: '8px',
                  border: `1px solid ${colors.border}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '13px', color: '#374151' }}>
                        {plan.accommodation.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {'?'.repeat(plan.accommodation.stars)} • {plan.accommodation.location}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text }}>
                        {formatCurrency(plan.accommodation.pricePerNight, plan.currency)}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>por noche</div>
                    </div>
                  </div>
                </div>
              </div>

              <button style={{
                width: '100%', padding: '12px 24px', border: 'none', borderRadius: '8px',
                backgroundColor: isSelected ? colors.accent : colors.border,
                color: isSelected ? 'white' : colors.text,
                fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s ease'
              }}>
                {isSelected ? 'Plan Seleccionado ?' : 'Seleccionar Plan'}
              </button>
            </div>
          );
        })}
      </div>

      {selectedPlanId && (
        <div style={{ textAlign: 'center', padding: '24px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
          <p style={{ margin: '0 0 16px 0', color: '#374151', fontSize: '16px', fontWeight: '500' }}>
            Plan seleccionado. ¿Qué quieres hacer?
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => {
              const selectedPlan = plans.find(p => p.id === selectedPlanId);
              if (selectedPlan) onSelectPlan(selectedPlan);
            }} style={{
              padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white',
              border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer'
            }}>Ver Detalles Completos</button>
            <button style={{
              padding: '12px 24px', backgroundColor: '#10b981', color: 'white',
              border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer'
            }}>Reservar Ahora</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanComparison;
