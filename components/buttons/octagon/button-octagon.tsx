"use client";

import * as React from "react";
const CLIP = 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';

export function OctagonButton({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center justify-center border-none cursor-pointer overflow-hidden"
      style={{
        width: 120,
        height: 120,
        clipPath: CLIP,
        background: hovered
          ? 'linear-gradient(135deg,#a7a7a7,#7c7c7c)'
          : '#202020',
        transform: hovered ? 'scale(1.06) rotate(22.5deg)' : 'scale(1) rotate(0deg)',
        transition: 'background 350ms ease, transform 280ms cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <span
        className="font-semibold text-[#f6f6f6] tracking-wider text-sm"
        style={{
          transform: hovered ? 'rotate(-22.5deg)' : 'rotate(0deg)',
          transition: 'transform 280ms cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {children}
      </span>
    </button>
  );
}
