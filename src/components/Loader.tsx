import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'medium', 
  color = '#FC6A03',
  text = 'Cargando...' 
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} relative`}>
        <div 
          className={`${sizeClasses[size]} rounded-full border-4 border-gray-200`}
        />
        <div 
          className={`${sizeClasses[size]} rounded-full border-4 border-t-transparent absolute top-0 left-0 animate-spin`}
          style={{ borderColor: `${color} transparent transparent transparent` }}
        />
      </div>
      {text && (
        <p className="mt-4 text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default Loader;
