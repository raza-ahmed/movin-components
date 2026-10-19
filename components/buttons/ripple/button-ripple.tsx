"use client";

import * as React from "react";
interface RipplePoint { id: number; x: number; y: number; }

export function RippleButton({ children }: { children: React.ReactNode }) {
  const [ripples, setRipples] = React.useState<RipplePoint[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 620);
  };

  return (
    <>
      <style>{`
        @keyframes ripple-expand { to { transform: scale(30); opacity: 0; } }
        .ripple-dot { animation: ripple-expand 600ms ease-out forwards; }
        @media (prefers-reduced-motion: reduce) { .ripple-dot { animation: none; opacity: 0; } }
      `}</style>
      <button
        type="button"
        onClick={handleClick}
        className="relative overflow-hidden rounded-lg border border-[#f6f6f6]/10 bg-[#202020] px-8 py-3 font-medium tracking-wide text-[#f6f6f6] cursor-pointer"
      >
        {ripples.map(({ id, x, y }) => (
          <span
            key={id}
            className="ripple-dot pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-[#7c7c7c]/55"
            style={{ left: x - 5, top: y - 5, transform: 'scale(0)' }}
          />
        ))}
        <span className="relative z-10">{children}</span>
      </button>
    </>
  );
}
