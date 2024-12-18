import React from "react";
import sparkle from "../images/sparkle.png"; // Make sure to import your sparkle image

const FloatingElements = () => {
  const numStars = 25; // Number of stars
  const stars = Array(numStars).fill(null);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((_, index) => {
        const size = Math.random() * 15 + 5; // Random sizes (1px to 4px)
        const duration = Math.random() * 3 + 3; // Duration (3s-6s)
        const delay = Math.random() * 5; // Random delay

        return (
          <img
            key={index}
            src={sparkle} // Use the sparkle image here
            alt="sparkle"
            className="absolute opacity-0 animate-twinkle"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top: `${Math.random() * 100}vh`, // Random vertical position
              left: `${Math.random() * 100}vw`, // Random horizontal position
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`
              //   boxShadow: `0 0 ${Math.random() * 5 +
              //     5}px rgba(255, 255, 255, 0.8)`
            }}
          />
        );
      })}
    </div>
  );
};

export default FloatingElements;
