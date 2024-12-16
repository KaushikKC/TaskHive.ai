import React, { useState } from "react";

function QuickActionCard({ title }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`relative w-full h-32 bg-gray-700 rounded-lg cursor-pointer transform transition-transform duration-500 ${flipped
        ? "rotate-y-180"
        : ""}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`absolute w-full h-full backface-hidden p-4 flex items-center justify-center font-semibold ${flipped
          ? "hidden"
          : "block"}`}
      >
        {title}
      </div>
      <div
        className={`absolute w-full h-full backface-hidden p-4 flex items-center justify-center font-semibold bg-blue-600 text-white rounded-lg transform rotate-y-180 ${flipped
          ? "block"
          : "hidden"}`}
      >
        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg">
          Go
        </button>
      </div>
    </div>
  );
}

export default QuickActionCard;
