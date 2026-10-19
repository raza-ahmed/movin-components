"use client";

import * as React from "react";
export function SlideFillButton({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-lg border border-[#f6f6f6]/25 px-8 py-3 font-medium tracking-wide text-[#f6f6f6] cursor-pointer bg-transparent motion-reduce:[&_span:first-child]:transition-none"
    >
      <span
        className="absolute inset-0 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          background: '#7c7c7c',
          transform: hovered ? 'translateX(0)' : 'translateX(-100%)',
        }}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
