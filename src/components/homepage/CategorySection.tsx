// src/components/homepage/CategorySection.tsx
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface CategorySectionProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onViewAll?: () => void;
  categoryType: 'hotels' | 'flights' | 'culture' | 'nature' | 'gastronomy' | 'shopping';
}

const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  subtitle,
  icon,
  children,
  onViewAll,
  categoryType
}) => {
 const getCategoryColor = (type: string) => {
  const colors: Record<string, string> = {
    hotels: 'from-red-500 to-red-600',
    flights: 'from-blue-500 to-blue-600', 
    culture: 'from-purple-500 to-purple-600',
    nature: 'from-green-500 to-green-600',
    gastronomy: 'from-orange-500 to-orange-600',
    shopping: 'from-pink-500 to-pink-600'
  };
  return colors[type] || 'from-gray-500 to-gray-600';
};
  return (
    <section className="section">
      <div className="section-header">
        <div className="category-title-container">
          <div className={`category-icon style={{background: "var(--primary-gradient)"}}`}>
            {icon}
          </div>
          <div className="category-text">
            <h2 className="section-title">{title}</h2>
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </div>
        </div>
        
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="btn btn-secondary"
          >
            Ver todos
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="category-content">
        {children}
      </div>
    </section>
  );
};

export default CategorySection;
