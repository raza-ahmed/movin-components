"use client";

import * as React from "react";
export function PopForwardButton({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div className="inline-block" style={{ perspective: 600 }}>
      <button
        type="button"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="rounded-xl border border-[#7c7c7c] bg-[#282828] px-9 py-3 font-semibold tracking-wide text-[#c9c9c9] cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
          transform: hovered ? 'translateZ(28px) scale(1.06)' : 'translateZ(0px) scale(1)',
          transition: 'transform 300ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 300ms ease',
          boxShadow: hovered
            ? '0 24px 48px rgba(124,124,124,0.45), 0 8px 16px rgba(0,0,0,0.4)'
            : '0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        {children}
      </button>
    </div>
  );
}
