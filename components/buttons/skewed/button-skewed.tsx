"use client";

import * as React from "react";
export function SkewedButton({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden border-none cursor-pointer font-semibold tracking-wider"
      style={{
        padding: '12px 44px',
        background: 'transparent',
        color: hovered ? '#f6f6f6' : '#a7a7a7',
        clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
        transition: 'color 280ms ease',
      }}
    >
      <span
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg,#4d4d4d,#7c7c7c)',
          transform: hovered ? 'skewX(-12deg) scaleX(1)' : 'skewX(-12deg) scaleX(0)',
          transformOrigin: 'left center',
          transition: 'transform 300ms cubic-bezier(0.4,0,0.2,1)',
        }}
      />
      <span
        className="absolute inset-0 border-2 border-[#7c7c7c]"
        style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
