"use client";

import * as React from "react";
export function SwapTextButton({ label, swapLabel }: { label: string; swapLabel: string }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative min-w-36 overflow-hidden rounded-lg px-8 py-3 font-medium tracking-wide text-[#f6f6f6] cursor-pointer border-none"
      style={{ background: '#4d4d4d' }}
    >
      <span
        className="block transition-transform duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
        style={{ transform: hovered ? 'translateY(-130%)' : 'translateY(0)' }}
      >
        {label}
      </span>
      <span
        className="absolute inset-0 flex items-center justify-center transition-transform duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
        style={{ transform: hovered ? 'translateY(0)' : 'translateY(130%)' }}
      >
        {swapLabel}
      </span>
    </button>
  );
}
