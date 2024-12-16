import React, { useState } from "react";
import ReactCardFlip from "react-card-flip";

function QuickActionCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const title = "Upload Files";
  const emoji = "📁";
  const bgColor = "bg-blue-500";
  const bgImage = "https://via.placeholder.com/300x200.png?text=Upload+BG";
  const redirectLink = "/upload";

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      {/* Front Side */}
      <div
        className={`h-[200px] rounded-xl shadow-lg flex flex-col items-center justify-center text-white text-center font-bold text-xl relative cursor-pointer overflow-hidden`}
        onMouseEnter={() => setIsFlipped(true)} // Flip on hover
        onMouseLeave={() => setIsFlipped(false)}
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* Semi-Transparent Background Overlay */}
        <div className={`absolute inset-0 ${bgColor} opacity-80 rounded-xl`} />

        {/* Transparent SVG Pattern */}
        {/* <div
          className="absolute inset-0 bg-white opacity-10 rounded-xl"
          style={{
            maskImage: `url("https://www.svgrepo.com/show/373768/pattern.svg")`,
            WebkitMaskImage: `url("https://www.svgrepo.com/show/373768/pattern.svg")`,
            maskSize: "cover",
            WebkitMaskSize: "cover"
          }}
        /> */}

        {/* Emoji and Title */}
        <div className="text-5xl mb-2 relative z-10">
          {emoji}
        </div>
        <div className="relative z-10">
          {title}
        </div>
      </div>

      {/* Back Side */}
      <div
        className="h-[200px] bg-gray-900 rounded-xl flex items-center justify-center shadow-lg relative cursor-pointer"
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        <a
          href={redirectLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-gray-800 px-6 py-3 rounded-lg shadow-md font-medium hover:bg-blue-600 hover:text-white transition-all duration-300"
        >
          Go
        </a>
      </div>
    </ReactCardFlip>
  );
}

export default QuickActionCard;
