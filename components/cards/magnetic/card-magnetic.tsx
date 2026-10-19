"use client";

import * as React from "react";
import { useRef, useState } from "react";

export function MagneticCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || prefersReduced) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x: x * 30, y: y * 20 });
  };

  const spring = "transform 500ms cubic-bezier(0.23,1,0.32,1)";
  const lift = hovered && !prefersReduced;

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setOffset({ x: 0, y: 0 }); setHovered(false); }}
      className="cursor-pointer overflow-hidden rounded-xl border bg-[#f6f6f6]/5 transition-colors duration-300"
      style={{ borderColor: hovered ? "rgba(246,246,246,0.2)" : "rgba(246,246,246,0.1)" }}
    >
      <div className="relative h-16 overflow-hidden">
        {/* Backdrop drifts at 30% (scaled up so its edges never show) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#282828] to-[#3a3a3a]"
          style={{
            transform: `translate(${offset.x * 0.3}px, ${offset.y * 0.3}px) scale(${lift ? 1.12 : 1})`,
            transition: hovered ? "transform 80ms linear" : spring,
          }}
        />
        {/* The orb follows the cursor the most */}
        <div
          className="absolute left-1/2 top-1/2 -ml-4 -mt-4 h-8 w-8 rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 35%, #ededed, #7c7c7c)",
            boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${lift ? 1.15 : 1})`,
            transition: hovered ? "transform 60ms linear" : spring,
          }}
        />
      </div>
      {/* Text moves at 15% */}
      <div
        className="p-3"
        style={{
          transform: `translate(${offset.x * 0.15}px, ${offset.y * 0.15}px)`,
          transition: hovered ? "transform 100ms linear" : spring,
        }}
      >
        {children}
      </div>
    </div>
  );
}
