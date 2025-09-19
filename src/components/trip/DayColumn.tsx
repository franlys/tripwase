// src/components/trip/DayColumn.tsx - Import Corregido

import React from 'react';
import { useDroppable, UniqueIdentifier } from '@dnd-kit/core'; // <-- CORREGIDO AQUÍ
import { Calendar, X, AlertCircle } from 'lucide-react';
import { DayPlan, EnhancedActivity } from '../../types/trip';
import { ActivityCard } from './ActivityCard';

interface DayColumnProps {
  day: DayPlan;
  onRemoveActivity: (dayId: UniqueIdentifier, activityId: UniqueIdentifier) => void;
  onUpdateTime: (dayId: UniqueIdentifier, activityId: UniqueIdentifier, newStartTime: string) => void;
  checkTimeConflicts: (activities: EnhancedActivity[]) => any[];
}

export const DayColumn: React.FC<DayColumnProps> = ({ 
  day, 
  onRemoveActivity,
  onUpdateTime,
  checkTimeConflicts 
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: day.id });

  // ... (el resto del componente se queda igual)
  return (
    <div ref={setNodeRef} className={`p-4 bg-white rounded-xl border-2 ${isOver ? 'border-green-500' : 'border-gray-200'}`}>
      <h3 className="font-bold text-lg">{day.date}</h3>
      <div className="space-y-2 mt-4 min-h-[100px]">
        {day.activities.map((activity, index) => (
          <div key={activity.id as string} className="relative group">
            <ActivityCard 
              activity={activity} 
              dayId={day.id}
              index={index}
              onRemove={onRemoveActivity}
              onUpdateTime={onUpdateTime}
            />
            <button
              onClick={() => onRemoveActivity(day.id, activity.id)}
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-white rounded-full p-1 shadow"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};