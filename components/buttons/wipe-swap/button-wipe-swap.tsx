"use client";

import * as React from "react";
export function WipeSwapButton({ label, swapLabel }: { label: string; swapLabel: string }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-lg border border-[color:light-dark(#373a40,#f1f2f3)]/10 bg-[color:light-dark(#f3f4f7,#1a1c1f)] px-8 py-3 font-semibold text-[color:light-dark(#373a40,#f1f2f3)] cursor-pointer"
      style={{ minWidth: '9.5rem' }}
    >
      <span
        className="block"
        style={{
          transform: hovered ? 'translateX(-115%)' : 'translateX(0)',
          transition: 'transform 300ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {label}
      </span>
      <span
        className="absolute inset-0 flex items-center justify-center text-[color:light-dark(#5f626a,#a7abb2)]"
        style={{
          transform: hovered ? 'translateX(0)' : 'translateX(115%)',
          transition: 'transform 300ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {swapLabel}
      </span>
    </button>
  );
}
