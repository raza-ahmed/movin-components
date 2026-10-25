"use client";

import * as React from "react";
export function SlideFillButton({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-lg border border-[color:light-dark(#373a40,#f1f2f3)]/25 px-8 py-3 font-medium tracking-wide text-[color:light-dark(#373a40,#f1f2f3)] cursor-pointer bg-transparent motion-reduce:[&_span:first-child]:transition-none"
    >
      <span
        className="absolute inset-0 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          background: 'light-dark(#6d7179, #7d8087)',
          transform: hovered ? 'translateX(0)' : 'translateX(-100%)',
        }}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
