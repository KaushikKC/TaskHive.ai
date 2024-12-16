import React, { useState } from "react";
import ReactCardFlip from "react-card-flip";

const QuickActionCard = ({ title, emoji, bgColor, bgImage, onGoClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Handle flip on hover
  const handleMouseEnter = () => {
    setIsFlipped(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsFlipped(false);
    }, 1000); // Delay to automatically flip back
  };

  // Handle flip on click
  const handleClick = () => {
    setIsFlipped(true);
    setTimeout(() => {
      setIsFlipped(false); // Automatically flip back after 2 seconds
    }, 2000);
  };

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      {/* Front Side */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={`h-[120px] w-[200px] relative flex items-center justify-center rounded-lg text-white cursor-pointer ${bgColor}`}
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <span className="text-4xl">
            {emoji}
          </span>
          <h3 className="text-lg font-semibold">
            {title}
          </h3>
        </div>
      </div>

      {/* Back Side */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={`h-[120px] w-[200px] relative p-4 rounded-lg text-white cursor-pointer ${bgColor}`}
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover"
        }}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          {/* <h3 className="text-lg font-semibold">Details</h3>
          <p className="text-sm">Flips back automatically</p> */}
          <div className="mt-2">
            <button
              onClick={e => {
                e.stopPropagation();
                onGoClick();
              }}
              className="bg-white text-gray-800 px-6 py-3 rounded-lg shadow-md font-medium hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              Go
            </button>
          </div>
        </div>
      </div>
    </ReactCardFlip>
  );
};

export default QuickActionCard;
