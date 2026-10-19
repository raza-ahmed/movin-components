"use client";

import * as React from "react";
export function ColorRevealCard({ front, back }: { front: React.ReactNode; back: React.ReactNode }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-xl border border-[#f6f6f6]/10"
      style={{ height: 140 }}
    >
      <div className="h-full">{front}</div>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-[#7c7c7c] motion-reduce:transition-none"
        style={{
          transform: hovered ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 380ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {back}
      </div>
    </div>
  );
}
