import React from 'react';
import { Hotel } from '../../types/homepage';

interface HotelCardProps {
  hotel: Hotel;
  onViewDetails?: (hotel: Hotel) => void;
  onAddToTrip?: () => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onViewDetails, onAddToTrip }) => {
  return (
    <div className="card-professional" onClick={() => onViewDetails?.(hotel)}>
      <img src={hotel.images[0]} alt={hotel.name} className="card-image" />
      <div className="card-content">
        <h3 className="card-title">{hotel.name}</h3>
        <p className="card-description">{hotel.location.city}</p>
        <div className="price-badge">${hotel.price.amount}/{hotel.price.period}</div>
      </div>
    </div>
  );
};

export default HotelCard;
