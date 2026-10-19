"use client";

import * as React from "react";
export function ShimmerSweepButton({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-lg px-8 py-3 font-semibold text-[#f6f6f6] border-none cursor-pointer"
      style={{ background: '#4d4d4d' }}
    >
      <span
        className="pointer-events-none absolute top-0 left-0 h-full w-[55%]"
        style={{
          background: 'linear-gradient(105deg,transparent 0%,rgba(246,246,246,0.38) 50%,transparent 100%)',
          transform: hovered ? 'translateX(260%) skewX(-15deg)' : 'translateX(-120%) skewX(-15deg)',
          transition: hovered ? 'transform 520ms ease' : 'none',
        }}
      />
      {children}
    </button>
  );
}
