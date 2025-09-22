import React, { useState, useRef, useEffect } from 'react';

const Slider = ({ 
  value = [0], 
  onValueChange, 
  min = 0, 
  max = 100, 
  step = 1, 
  className = "",
  disabled = false 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const currentValue = Array.isArray(value) ? value[0] : value;

  const getPercentage = () => {
    return ((currentValue - min) / (max - min)) * 100;
  };

  const handleMouseDown = (e) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || disabled) return;
    updateValue(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (e) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newValue = min + (percentage / 100) * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));
    
    onValueChange([clampedValue]);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className={`relative w-full ${className}`}>
      <div
        ref={sliderRef}
        className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        <div
          className="absolute h-full bg-gradient-to-r from-[#153582] to-[#F48FB1] rounded-full transition-all duration-200"
          style={{ width: `${getPercentage()}%` }}
        />
        <div
          className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white border-2 border-[#153582] rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200"
          style={{ left: `calc(${getPercentage()}% - 10px)` }}
        />
      </div>
    </div>
  );
};

export { Slider };
