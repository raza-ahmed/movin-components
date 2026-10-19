"use client";

import * as React from "react";
import { useRef, useState } from "react";

export function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || prefersReduced) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -16, y: x * 16 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  return (
    <div style={{ perspective: 600 }}>
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="cursor-pointer overflow-hidden rounded-xl border border-[#f6f6f6]/10 bg-[#f6f6f6]/5 [transform-style:preserve-3d] [will-change:transform]"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.04 : 1})`,
          boxShadow: hovered ? '0 16px 32px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.2)',
          transition: hovered
            ? 'box-shadow 200ms ease'
            : 'transform 400ms ease, box-shadow 400ms ease',
        }}
      >
        {children}
      </div>
    </div>
  );
}
