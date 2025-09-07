import React from 'react';
import { TouristAttraction } from '../../types/homepage';

interface AttractionCardProps {
  attraction: TouristAttraction;
  onViewDetails?: (attraction: TouristAttraction) => void;
  onAddToTrip?: () => void;
}

const AttractionCard: React.FC<AttractionCardProps> = ({ attraction, onViewDetails, onAddToTrip }) => {
  return (
    <div className="card-professional" onClick={() => onViewDetails?.(attraction)}>
      <img src={attraction.images[0]} alt={attraction.name} className="card-image" />
      <div className="card-content">
        <h3 className="card-title">{attraction.name}</h3>
        <p className="card-description">{attraction.location.city}</p>
        <div className="price-badge">${attraction.entryFee.amount}</div>
      </div>
    </div>
  );
};

export default AttractionCard;
