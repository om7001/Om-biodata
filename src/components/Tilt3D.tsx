import React, { useState, useRef } from "react";

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export function Tilt3D({ children, className = "", maxTilt = 8 }: Tilt3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coordinates from card center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Normalised position: -1 to 1
    const xNormalized = mouseX / (width / 2);
    const yNormalized = mouseY / (height / 2);

    // Rotation angles
    const rotateY = Number((xNormalized * maxTilt).toFixed(2));
    const rotateX = Number((-yNormalized * maxTilt).toFixed(2));

    setCoords({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`transition-all duration-300 ease-out ${className}`}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${coords.x}deg) rotateY(${coords.y}deg) scale3d(1.02, 1.02, 1.02)`
          : `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      <div
        className="w-full h-full"
        style={{
          transform: isHovered ? "translateZ(25px)" : "translateZ(0px)",
          transformStyle: "preserve-3d",
          transition: "transform 0.3s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
}
