import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface ItemCarouselProps {
  children: React.ReactNode[];
  itemsToShow?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showControls?: boolean;
}

const ItemCarousel: React.FC<ItemCarouselProps> = ({ 
  children, 
  itemsToShow = 2,
  autoPlay = true,
  autoPlayInterval = 4000,
  showControls = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovered, setIsHovered] = useState(false);
  const totalItems = children.length;
  const maxIndex = Math.max(0, totalItems - itemsToShow);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && !isHovered && autoPlay) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
      }, autoPlayInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isHovered, autoPlay, autoPlayInterval, maxIndex]);

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(maxIndex, Math.max(0, index)));
  };

  const translateX = -(currentIndex * (100 / itemsToShow));

  return (
    <div 
      className="container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="carousel-wrapper">
        {showControls && (
          <button
            onClick={handlePrevious}
            className={`carousel-arrow carousel-arrow-left ${isHovered ? 'visible' : ''}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <div className="carousel-track">
          <div
            className="grid grid-cols-4"
            style={{
              transform: `translateX(${translateX}%)`,
              width: `${(totalItems / itemsToShow) * 100}%`
            }}
          >
            {children.map((child, index) => (
              <div
                key={index}
                className="carousel-item"
                style={{ width: `${100 / totalItems}%` }}
              >
                {child}
              </div>
            ))}
          </div>
        </div>

        {showControls && (
          <button
            onClick={handleNext}
            className={`carousel-arrow carousel-arrow-right ${isHovered ? 'visible' : ''}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {autoPlay && showControls && (
          <button
            onClick={togglePlayPause}
            className={`carousel-play-pause ${isHovered ? 'visible' : ''}`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Dots indicator */}
      {totalItems > itemsToShow && (
        <div className="carousel-dots">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`carousel-dot ${currentIndex === index ? 'active' : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemCarousel;
