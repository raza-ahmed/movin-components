"use client";

import * as React from "react";
interface FloatItem { id: number; x: number; }

export function XpGainButton({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<FloatItem[]>([]);
  const [total, setTotal] = React.useState(0);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setItems((prev) => [...prev, { id, x: e.clientX - rect.left }]);
    setTotal((t) => t + 100);
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 900);
  }

  return (
    <>
      <style>{`
        @keyframes xp-float {
          0%   { transform: translateY(0) scale(1); opacity: 1; }
          70%  { transform: translateY(-32px) scale(1.1); opacity: 0.9; }
          100% { transform: translateY(-52px) scale(0.8); opacity: 0; }
        }
        [data-xp-float] { animation: xp-float 860ms ease-out forwards; }
        @media (prefers-reduced-motion: reduce) { [data-xp-float] { animation: none; opacity: 0; } }
      `}</style>
      <button
        type="button"
        onClick={handleClick}
        className="relative cursor-pointer rounded border border-[#a7a7a7] bg-[#3a3a3a] px-7 py-3 font-mono font-semibold tracking-wider text-[#c9c9c9]"
      >
        {items.map(({ id, x }) => (
          <span
            key={id}
            data-xp-float
            className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap text-sm font-semibold text-[#c9c9c9]"
            style={{ left: x, top: '50%', textShadow: '0 0 8px rgba(201,201,201,0.8)' }}
          >
            +100 XP
          </span>
        ))}
        <span className="relative z-10">{children} · {total.toLocaleString()}</span>
      </button>
    </>
  );
}
