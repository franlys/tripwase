import React from 'react';
import { Event } from '../../types/homepage';

interface EventCardProps {
  event: Event;
  onViewDetails?: (event: Event) => void;
  onQuickPlan?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails, onQuickPlan }) => {
  return (
    <div className="card-professional" onClick={() => onViewDetails?.(event)}>
      <img src={event.images[0]} alt={event.name} className="card-image" />
      <div className="card-content">
        <h3 className="card-title">{event.name}</h3>
        <p className="card-description">{event.location.city}</p>
        <div className="price-badge">${event.price.min.amount} - ${event.price.max.amount}</div>
      </div>
    </div>
  );
};

export default EventCard;
