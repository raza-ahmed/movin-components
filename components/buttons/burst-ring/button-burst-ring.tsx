"use client";

import * as React from "react";
interface Ring { id: number; x: number; y: number; }

export function BurstRingButton({ children }: { children: React.ReactNode }) {
  const [rings, setRings] = React.useState<Ring[]>([]);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRings((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRings((prev) => prev.filter((r) => r.id !== id)), 540);
  }

  return (
    <>
      <style>{`
        @keyframes burst-ring {
          from { transform: translate(-50%,-50%) scale(0.2); opacity: 1; }
          to   { transform: translate(-50%,-50%) scale(2.8); opacity: 0; }
        }
        [data-burst-ring] { animation: burst-ring 520ms ease-out forwards; }
        @media (prefers-reduced-motion: reduce) { [data-burst-ring] { animation: none; opacity: 0; } }
      `}</style>
      <button
        type="button"
        onClick={handleClick}
        className="relative overflow-hidden rounded-lg border-2 border-[#4d4d4d] px-8 py-3 font-semibold text-[#c9c9c9] cursor-pointer bg-transparent"
      >
        {rings.map(({ id, x, y }) => (
          <span
            key={id}
            data-burst-ring
            className="pointer-events-none absolute h-10 w-10 rounded-full border-2 border-[#a7a7a7]/70 bg-transparent"
            style={{ left: x, top: y }}
          />
        ))}
        <span className="relative z-10">{children}</span>
      </button>
    </>
  );
}
