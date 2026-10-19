"use client";

import * as React from "react";
const HEX = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';

export function HexagonButton({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden border-none cursor-pointer select-none px-12 py-3.5 text-xs font-semibold uppercase tracking-widest"
      style={{
        clipPath: HEX,
        color: hovered ? '#3a3a3a' : '#a7a7a7',
        background: 'transparent',
        transition: 'color 280ms ease',
      }}
    >
      <span className="absolute inset-0" style={{ background: '#282828' }} />
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: '#a7a7a7',
          transform: hovered ? 'scale(1)' : 'scale(0)',
          transformOrigin: 'center',
          transition: 'transform 320ms cubic-bezier(0.34,1.56,0.64,1)',
        }}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
