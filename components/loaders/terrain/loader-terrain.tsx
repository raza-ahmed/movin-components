"use client";

import * as React from "react";
const css = `
  @keyframes loader-terrain-rise {
    0%, 100% { transform: translateZ(0); background: light-dark(#6d7179, #7d8087); }
    50% { transform: translateZ(14px); background: light-dark(#373a40, #f1f2f3); }
  }
  .loader-terrain {
    display: grid;
    place-items: center;
    width: 140px;
    height: 100px;
    perspective: 320px;
  }
  .loader-terrain__plane {
    display: grid;
    grid-template-columns: repeat(10, 4px);
    grid-auto-rows: 4px;
    gap: 7px;
    transform-style: preserve-3d;
    transform: rotateX(62deg) rotateZ(-35deg);
  }
  .loader-terrain__dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: light-dark(#6d7179, #7d8087);
    animation: loader-terrain-rise 2.4s cubic-bezier(0.45, 0, 0.55, 1) var(--d) infinite;
  }
  @media (prefers-reduced-motion: reduce) { .loader-terrain__dot { animation: none; } }
`;

const N = 10;

export function TerrainLoader() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-terrain" role="status" aria-label="Loading">
        <div className="loader-terrain__plane" aria-hidden="true">
          {Array.from({ length: N * N }, (_, i) => {
            const x = i % N;
            const y = Math.floor(i / N);
            // Two crossing swells: one rolling along x, a slower one along y.
            const d = -(x * 0.16 + Math.sin(y * 0.7) * 0.35);
            return <span key={i} className="loader-terrain__dot" style={{ '--d': `${d.toFixed(3)}s` } as React.CSSProperties} />;
          })}
        </div>
      </div>
    </>
  );
}
