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
        color: hovered ? 'light-dark(#373a40, #f1f2f3)' : 'light-dark(#5f626a, #a7abb2)',
        clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
        transition: 'color 280ms ease',
      }}
    >
      <span
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg,light-dark(#cbced3, #393c41),light-dark(#6d7179, #7d8087))',
          transform: hovered ? 'skewX(-12deg) scaleX(1)' : 'skewX(-12deg) scaleX(0)',
          transformOrigin: 'left center',
          transition: 'transform 300ms cubic-bezier(0.4,0,0.2,1)',
        }}
      />
      <span
        className="absolute inset-0 border-2 border-[color:light-dark(#6d7179,#7d8087)]"
        style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
