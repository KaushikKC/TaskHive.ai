import React, { useState, useEffect } from "react";

const CursorGlow = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = e => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 w-32 h-32 bg-[#0997FF] opacity-90 blur-3xl rounded-full z-50"
      style={{
        transform: `translate(${position.x - 64}px, ${position.y - 64}px)`,
        transition: "transform 0.1s ease-out"
      }}
    />
  );
};

export default CursorGlow;
