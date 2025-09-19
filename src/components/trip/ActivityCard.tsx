// src/components/trip/ActivityCard.tsx - Import Corregido

import React, { useState } from 'react';
import { Clock, MapPin, Edit3, Check, X } from 'lucide-react';
import { EnhancedActivity } from '../../types/trip';
import { UniqueIdentifier } from '@dnd-kit/core'; // <-- CORREGIDO AQUÍ

interface ActivityCardProps {
  activity: EnhancedActivity;
  dayId: UniqueIdentifier;
  index: number;
  onRemove: (dayId: UniqueIdentifier, activityId: UniqueIdentifier) => void;
  onUpdateTime: (dayId: UniqueIdentifier, activityId: UniqueIdentifier, newStartTime: string) => void;
}

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
};

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, dayId, onRemove, onUpdateTime }) => {
  // ... (el resto del componente se queda igual)
  return (
    <div className={`p-4 rounded-lg border-2 ${activity.cost === 0 ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-2">
          <h4 className="font-semibold text-sm">{activity.title}</h4>
          <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
        </div>
      </div>
    </div>
  );
};