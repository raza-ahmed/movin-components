"use client";

import * as React from "react";
const N = 5;
const DOTS = Array.from({ length: N * N }, (_, k) => ({ x: k % N, y: Math.floor(k / N) }));

const css = `
  @keyframes loader-grid-wave-ripple {
    0%, 60%, 100% { transform: scale(0.55); background: light-dark(#cbced3, #393c41); }
    20% { transform: scale(1.15); background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 8px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 45%, transparent); }
    35% { transform: scale(0.9); background: light-dark(#50535b, #c6c8cd); }
  }
  .loader-grid-wave { display: grid; grid-template-columns: repeat(${N}, 10px); gap: 9px; }
  .loader-grid-wave span { width: 10px; height: 10px; border-radius: 50%; background: light-dark(#cbced3, #393c41); transform: scale(0.55); animation: loader-grid-wave-ripple 1.8s cubic-bezier(0.4, 0, 0.3, 1) infinite; animation-delay: calc((var(--x) + var(--y)) * 0.09s); }
  @media (prefers-reduced-motion: reduce) {
    .loader-grid-wave span { animation-duration: 3.6s; }
  }
`;

export function GridWaveLoader() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-grid-wave" role="status" aria-label="Loading">
        {DOTS.map((d) => (
          <span key={`${d.x}-${d.y}`} aria-hidden="true" style={{ '--x': d.x, '--y': d.y } as React.CSSProperties} />
        ))}
      </div>
    </>
  );
}
