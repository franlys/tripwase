import React, { useState, useEffect } from 'react';
import { useTrip } from '../contexts/TripContext';

interface Activity {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  cost: number;
  category: 'transport' | 'accommodation' | 'food' | 'activity' | 'shopping' | 'other';
  location: string;
  notes: string;
}

interface DayPlan {
  date: string;
  activities: Activity[];
  totalCost: number;
}

interface BudgetBreakdown {
  accommodation: number;
  transport: number;
  food: number;
  activities: number;
  shopping: number;
  other: number;
  total: number;
}

const TripPlanner: React.FC = () => {
  const { currentTrip, updateTripDetails, getTripDuration } = useTrip();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'budget' | 'notes'>('overview');
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [showActivityModal, setShowActivityModal] = useState(false);

  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    name: '',
    description: '',
    startTime: '09:00',
    endTime: '10:00',
    cost: 0,
    category: 'activity',
    location: '',
    notes: ''
  });

  const duration = getTripDuration();
  
  useEffect(() => {
    if (currentTrip && dayPlans.length === 0) {
      initializeDayPlans();
    }
  }, [currentTrip]);

  const initializeDayPlans = () => {
    if (!currentTrip?.dates.startDate) return;
    
    const plans: DayPlan[] = [];
    const startDate = new Date(currentTrip.dates.startDate);
    
    for (let i = 0; i < duration; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      plans.push({
        date: date.toISOString().split('T')[0],
        activities: [],
        totalCost: 0
      });
    }
    
    setDayPlans(plans);
    if (plans.length > 0) {
      setSelectedDay(plans[0].date);
    }
  };

  const addActivity = () => {
    if (!newActivity.name || !selectedDay) return;
    
    const activity: Activity = {
      id: Date.now().toString(),
      name: newActivity.name,
      description: newActivity.description || '',
      startTime: newActivity.startTime || '09:00',
      endTime: newActivity.endTime || '10:00',
      cost: Number(newActivity.cost) || 0,
      category: newActivity.category || 'activity',
      location: newActivity.location || '',
      notes: newActivity.notes || ''
    };

    setDayPlans(prev => prev.map(day => {
      if (day.date === selectedDay) {
        const updatedActivities = [...day.activities, activity];
        return {
          ...day,
          activities: updatedActivities,
          totalCost: updatedActivities.reduce((sum, act) => sum + act.cost, 0)
        };
      }
      return day;
    }));

    setNewActivity({
      name: '',
      description: '',
      startTime: '09:00',
      endTime: '10:00',
      cost: 0,
      category: 'activity',
      location: '',
      notes: ''
    });
    setShowActivityModal(false);
  };

  const removeActivity = (dayDate: string, activityId: string) => {
    setDayPlans(prev => prev.map(day => {
      if (day.date === dayDate) {
        const updatedActivities = day.activities.filter(act => act.id !== activityId);
        return {
          ...day,
          activities: updatedActivities,
          totalCost: updatedActivities.reduce((sum, act) => sum + act.cost, 0)
        };
      }
      return day;
    }));
  };

  const calculateBudgetBreakdown = (): BudgetBreakdown => {
    const breakdown: BudgetBreakdown = {
      accommodation: 0,
      transport: 0,
      food: 0,
      activities: 0,
      shopping: 0,
      other: 0,
      total: 0
    };

 dayPlans.forEach(day => {
  day.activities.forEach(activity => {
    // Mapear 'activity' a 'activities' para coincidir con BudgetBreakdown
    const categoryKey = activity.category === 'activity' ? 'activities' : activity.category;
    (breakdown as any)[categoryKey] += activity.cost;
    breakdown.total += activity.cost;
  });
});

    return breakdown;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currentTrip?.budget.currency || 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      transport: 'Transporte',
      accommodation: 'Alojamiento',
      food: 'Comida',
      activity: 'Actividad',
      shopping: 'Compras',
      other: 'Otro'
    };
    return icons[category] || 'Otro';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      transport: '#3b82f6',
      accommodation: '#8b5cf6',
      food: '#f59e0b',
      activity: '#10b981',
      shopping: '#ec4899',
      other: '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  if (!currentTrip) {
    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{
          backgroundColor: '#374151',
          padding: '60px',
          borderRadius: '12px'
        }}>
          <h2>No hay viaje para planificar</h2>
          <p>Selecciona un destino desde la búsqueda para comenzar la planificación</p>
        </div>
      </div>
    );
  }

  const budgetBreakdown = calculateBudgetBreakdown();

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      color: 'white'
    }}>
      <div style={{
        backgroundColor: '#1e3a8a',
        padding: '30px',
        borderRadius: '16px',
        marginBottom: '30px'
      }}>
        <h1 style={{ 
          margin: '0 0 15px 0',
          fontSize: '2.2rem',
          color: '#dbeafe'
        }}>
          Planificando: {currentTrip.name}
        </h1>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          color: '#bfdbfe'
        }}>
          <div>Destino: {currentTrip.destination.name}, {currentTrip.destination.country}</div>
          <div>Duración: {duration} días</div>
          <div>Viajeros: {currentTrip.travelers.adults} adultos</div>
          <div>Presupuesto: {formatCurrency(currentTrip.budget.total)}</div>
        </div>
      </div>

      <div style={{
        backgroundColor: '#374151',
        padding: '15px',
        borderRadius: '12px',
        marginBottom: '30px',
        display: 'flex',
        gap: '10px',
        justifyContent: 'center'
      }}>
        {[
          { id: 'overview', label: 'Resumen' },
          { id: 'itinerary', label: 'Itinerario' },
          { id: 'budget', label: 'Presupuesto' },
          { id: 'notes', label: 'Notas' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === tab.id ? '#3b82f6' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#d1d5db',
              border: '1px solid #4b5563',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            backgroundColor: '#1f2937',
            padding: '25px',
            borderRadius: '12px'
          }}>
            <h3>Progreso de Planificación</h3>
            <p>Días planificados: {dayPlans.filter(day => day.activities.length > 0).length}/{dayPlans.length}</p>
            <p>Presupuesto utilizado: {formatCurrency(budgetBreakdown.total)} / {formatCurrency(currentTrip.budget.total)}</p>
            <p>Total de actividades: {dayPlans.reduce((sum, day) => sum + day.activities.length, 0)}</p>
          </div>

          <div style={{
            backgroundColor: '#1f2937',
            padding: '25px',
            borderRadius: '12px'
          }}>
            <h3>Información del Destino</h3>
            <p>{currentTrip.destination.description}</p>
            <p>Temperatura: {currentTrip.destination.weatherInfo.averageTemp}°C</p>
            <p>Clima: {currentTrip.destination.weatherInfo.climate}</p>
            <p>Mejor época: {currentTrip.destination.weatherInfo.bestMonths.join(', ')}</p>
          </div>
        </div>
      )}

      {activeTab === 'itinerary' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '20px'
        }}>
          <div style={{
            backgroundColor: '#1f2937',
            padding: '20px',
            borderRadius: '12px',
            height: 'fit-content'
          }}>
            <h3>Días del Viaje</h3>
            {dayPlans.map((day, index) => (
              <button
                key={day.date}
                onClick={() => setSelectedDay(day.date)}
                style={{
                  width: '100%',
                  padding: '15px',
                  marginBottom: '10px',
                  backgroundColor: selectedDay === day.date ? '#3b82f6' : '#374151',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div>Día {index + 1}</div>
                <div style={{ fontSize: '12px' }}>{formatDate(day.date)}</div>
                <div style={{ fontSize: '12px' }}>
                  {day.activities.length} actividades - {formatCurrency(day.totalCost)}
                </div>
              </button>
            ))}
          </div>

          <div style={{
            backgroundColor: '#1f2937',
            padding: '20px',
            borderRadius: '12px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3>{selectedDay ? formatDate(selectedDay) : 'Selecciona un día'}</h3>
              <button
                onClick={() => setShowActivityModal(true)}
                disabled={!selectedDay}
                style={{
                  padding: '10px 20px',
                  backgroundColor: selectedDay ? '#10b981' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: selectedDay ? 'pointer' : 'not-allowed'
                }}
              >
                Añadir Actividad
              </button>
            </div>

            {selectedDay && dayPlans.find(day => day.date === selectedDay)?.activities.map(activity => (
              <div
                key={activity.id}
                style={{
                  backgroundColor: '#374151',
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  borderLeft: '4px solid ' + getCategoryColor(activity.category)
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0' }}>{activity.name}</h4>
                    <p style={{ margin: '0', fontSize: '14px', color: '#9ca3af' }}>
                      {activity.startTime} - {activity.endTime} | {activity.location}
                    </p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>{activity.description}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#10b981' }}>{formatCurrency(activity.cost)}</span>
                    <button
                      onClick={() => removeActivity(selectedDay, activity.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '18px'
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {selectedDay && dayPlans.find(day => day.date === selectedDay)?.activities.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                <p>No hay actividades planificadas para este día</p>
                <p>Haz click en Añadir Actividad para comenzar</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'budget' && (
        <div style={{ backgroundColor: '#1f2937', padding: '30px', borderRadius: '12px' }}>
          <h3>Desglose de Presupuesto</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {Object.entries(budgetBreakdown).filter(([key]) => key !== 'total').map(([category, amount]) => (
              <div
                key={category}
                style={{
                  backgroundColor: '#374151',
                  padding: '20px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}
              >
                <div style={{ color: getCategoryColor(category), fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {formatCurrency(amount)}
                </div>
                <div style={{ color: '#9ca3af' }}>{getCategoryIcon(category)}</div>
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: '#374151', padding: '25px', borderRadius: '12px', textAlign: 'center' }}>
            <h4>Total Gastado vs Presupuesto</h4>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              <span style={{ color: budgetBreakdown.total > currentTrip.budget.total ? '#ef4444' : '#10b981' }}>
                {formatCurrency(budgetBreakdown.total)}
              </span>
              <span style={{ color: '#9ca3af' }}> / {formatCurrency(currentTrip.budget.total)}</span>
            </div>
            <p style={{ color: '#9ca3af' }}>
              {budgetBreakdown.total > currentTrip.budget.total ? 
                'Sobrepasado por ' + formatCurrency(budgetBreakdown.total - currentTrip.budget.total) :
                'Restante: ' + formatCurrency(currentTrip.budget.total - budgetBreakdown.total)
              }
            </p>
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div style={{ backgroundColor: '#1f2937', padding: '30px', borderRadius: '12px' }}>
          <h3>Notas del Viaje</h3>
          <textarea
            placeholder="Añade notas, recordatorios, o información importante sobre tu viaje..."
            style={{
              width: '100%',
              height: '300px',
              padding: '15px',
              backgroundColor: '#374151',
              color: 'white',
              border: '1px solid #4b5563',
              borderRadius: '8px',
              fontSize: '16px',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
          <button
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Guardar Notas
          </button>
        </div>
      )}

      {showActivityModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1f2937',
            padding: '30px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3>Añadir Actividad</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Nombre</label>
              <input
                type="text"
                value={newActivity.name}
                onChange={(e) => setNewActivity(prev => ({ ...prev, name: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#374151',
                  color: 'white',
                  border: '1px solid #4b5563',
                  borderRadius: '6px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Categoría</label>
              <select
                value={newActivity.category}
                onChange={(e) => setNewActivity(prev => ({ ...prev, category: e.target.value as any }))}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#374151',
                  color: 'white',
                  border: '1px solid #4b5563',
                  borderRadius: '6px'
                }}
              >
                <option value="activity">Actividad</option>
                <option value="transport">Transporte</option>
                <option value="accommodation">Alojamiento</option>
                <option value="food">Comida</option>
                <option value="shopping">Compras</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Hora inicio</label>
                <input
                  type="time"
                  value={newActivity.startTime}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, startTime: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#374151',
                    color: 'white',
                    border: '1px solid #4b5563',
                    borderRadius: '6px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Costo</label>
                <input
                  type="number"
                  value={newActivity.cost}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, cost: Number(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#374151',
                    color: 'white',
                    border: '1px solid #4b5563',
                    borderRadius: '6px'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Ubicación</label>
              <input
                type="text"
                value={newActivity.location}
                onChange={(e) => setNewActivity(prev => ({ ...prev, location: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#374151',
                  color: 'white',
                  border: '1px solid #4b5563',
                  borderRadius: '6px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowActivityModal(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={addActivity}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripPlanner;