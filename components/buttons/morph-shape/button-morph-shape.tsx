"use client";

import * as React from "react";
export function MorphShapeButton({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center justify-center overflow-hidden border-none cursor-pointer bg-gradient-to-br from-[#4d4d4d] to-[#7c7c7c]"
      style={{
        width: hovered ? 56 : 160,
        height: 56,
        borderRadius: hovered ? '50%' : 28,
        transition: 'width 400ms cubic-bezier(0.4,0,0.2,1), border-radius 400ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <span
        className="absolute font-semibold text-[#f6f6f6] tracking-wider text-sm"
        style={{
          opacity: hovered ? 0 : 1,
          transform: hovered ? 'scale(0.7)' : 'scale(1)',
          transition: 'opacity 200ms ease, transform 200ms ease',
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </span>
      <span
        className="absolute text-[#f6f6f6] text-2xl leading-none"
        aria-hidden="true"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'scale(1) rotate(0deg)' : 'scale(0.4) rotate(-90deg)',
          transition: 'opacity 250ms ease 150ms, transform 350ms cubic-bezier(0.34,1.56,0.64,1) 150ms',
        }}
      >
        ✦
      </span>
    </button>
  );
}
