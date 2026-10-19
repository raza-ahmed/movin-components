"use client";

import * as React from "react";
export function WipeSwapButton({ label, swapLabel }: { label: string; swapLabel: string }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-lg border border-[#f6f6f6]/10 bg-[#202020] px-8 py-3 font-semibold text-[#f6f6f6] cursor-pointer"
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
        className="absolute inset-0 flex items-center justify-center text-[#a7a7a7]"
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
