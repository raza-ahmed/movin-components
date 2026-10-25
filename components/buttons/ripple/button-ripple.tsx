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
        className="relative overflow-hidden rounded-lg border border-[color:light-dark(#373a40,#f1f2f3)]/10 bg-[color:light-dark(#f3f4f7,#1a1c1f)] px-8 py-3 font-medium tracking-wide text-[color:light-dark(#373a40,#f1f2f3)] cursor-pointer"
      >
        {ripples.map(({ id, x, y }) => (
          <span
            key={id}
            className="ripple-dot pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-[color:light-dark(#6d7179,#7d8087)]/55"
            style={{ left: x - 5, top: y - 5, transform: 'scale(0)' }}
          />
        ))}
        <span className="relative z-10">{children}</span>
      </button>
    </>
  );
}
