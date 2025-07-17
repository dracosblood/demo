import React, { useState } from 'react';

const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
  <svg
    className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.929 8.729c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
  </svg>
);

const DeliveryRating = ({ initialRating = 0, onRatingChange, readOnly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(initialRating);

  const descriptions = {
    1: 'Pésimo servicio',
    2: 'Mal servicio',
    3: 'Servicio regular',
    4: 'Buen servicio',
    5: 'Excelente servicio',
  };

  const handleStarClick = (index) => {
    if (!readOnly) {
      setCurrentRating(index);
      if (onRatingChange) {
        onRatingChange(index, descriptions[index]);
      }
    }
  };

  const handleMouseEnter = (index) => {
    if (!readOnly) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || currentRating;

  return (
    <div className="flex flex-col items-center">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((index) => (
          <StarIcon
            key={index}
            filled={index <= displayRating}
            onClick={() => handleStarClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </div>
      {displayRating > 0 && (
        <p className="text-sm text-gray-600 mt-2">{descriptions[displayRating]}</p>
      )}
    </div>
  );
};

export default DeliveryRating;