import React from 'react';
import { Cruise } from '../../types/homepage';

interface CruiseCardProps {
  cruise: Cruise;
  onViewDetails?: (cruise: Cruise) => void;
  onQuickPlan?: () => void;
}

const CruiseCard: React.FC<CruiseCardProps> = ({ cruise, onViewDetails, onQuickPlan }) => {
  return (
    <div className="card-professional" onClick={() => onViewDetails?.(cruise)}>
      <img src={cruise.images[0]} alt={cruise.name} className="card-image" />
      <div className="card-content">
        <h3 className="card-title">{cruise.name}</h3>
        <p className="card-description">{cruise.cruiseLine}</p>
        <div className="price-badge">${cruise.price.amount} - {cruise.duration} días</div>
      </div>
    </div>
  );
};

export default CruiseCard;
