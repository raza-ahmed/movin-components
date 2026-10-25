"use client";

import * as React from "react";
export function NeonGlowCard({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: hovered ? '1px solid light-dark(rgba(95,98,106,0.55), rgba(167,171,178,0.55))' : '1px solid light-dark(rgba(55,58,64,0.08), rgba(241,242,243,0.08))',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered
          ? '0 0 18px light-dark(rgba(95,98,106,0.5), rgba(167,171,178,0.5)), 0 0 40px light-dark(rgba(95,98,106,0.18), rgba(167,171,178,0.18)), 0 8px 24px rgba(0,0,0,0.4)'
          : '0 2px 8px rgba(0,0,0,0.2)',
        transition: 'box-shadow 300ms ease, border-color 300ms ease, transform 300ms ease',
      }}
      className="cursor-pointer overflow-hidden rounded-xl bg-[color:light-dark(#373a40,#f1f2f3)]/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {children}
    </div>
  );
}
