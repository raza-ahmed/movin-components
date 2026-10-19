"use client";

import * as React from "react";
export function NeonGlowCard({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: hovered ? '1px solid rgba(167,167,167,0.55)' : '1px solid rgba(246,246,246,0.08)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered
          ? '0 0 18px rgba(167,167,167,0.5), 0 0 40px rgba(167,167,167,0.18), 0 8px 24px rgba(0,0,0,0.4)'
          : '0 2px 8px rgba(0,0,0,0.2)',
        transition: 'box-shadow 300ms ease, border-color 300ms ease, transform 300ms ease',
      }}
      className="cursor-pointer overflow-hidden rounded-xl bg-[#f6f6f6]/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {children}
    </div>
  );
}
