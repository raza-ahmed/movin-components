"use client";

import * as React from "react";
import { useMemo } from 'react';

const css = `
  /* Scattered → flies into its slot (0–30%) → the block turns (30–60%) → bursts back out. */
  @keyframes loader-assemble-p {
    0% { transform: translate(var(--sx), var(--sy)) rotate(var(--r)) scale(0.5); opacity: 0; }
    8% { opacity: 1; }
    30%, 64% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
    86% { transform: translate(var(--ex), var(--ey)) rotate(var(--r)) scale(0.4); opacity: 0; }
    100% { transform: translate(var(--ex), var(--ey)) rotate(var(--r)) scale(0.4); opacity: 0; }
  }
  @keyframes loader-assemble-turn {
    0%, 32% { transform: rotate(0deg); }
    60%, 100% { transform: rotate(90deg); }
  }
  .loader-assemble { display: grid; place-items: center; width: 110px; height: 110px; }
  .loader-assemble__block {
    display: grid;
    grid-template-columns: repeat(4, 9px);
    grid-auto-rows: 9px;
    gap: 2px;
    animation: loader-assemble-turn 2.8s cubic-bezier(0.65, 0, 0.35, 1) infinite;
  }
  .loader-assemble__p {
    border-radius: 2px;
    background: light-dark(#42454c, #e5e6e9);
    opacity: 0;
    animation: loader-assemble-p 2.8s cubic-bezier(0.22, 1, 0.36, 1) var(--d) infinite;
  }
  .loader-assemble__p:nth-child(3n) { background: light-dark(#5f626a, #a7abb2); }
  .loader-assemble__p:nth-child(5n) { background: light-dark(#373a40, #f1f2f3); }
  @media (prefers-reduced-motion: reduce) {
    .loader-assemble__block { animation: none; }
    .loader-assemble__p { animation: none; opacity: 1; }
  }
`;

export function AssembleLoader() {
  // Seeded scatter in (where it comes from) and out (where it bursts to), per particle.
  const parts = useMemo(() => {
    let seed = 21;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    return Array.from({ length: 16 }, (_, i) => {
      const a = rand() * Math.PI * 2;
      const b = rand() * Math.PI * 2;
      const r1 = 36 + rand() * 18;
      const r2 = 34 + rand() * 20;
      return {
        '--sx': `${(Math.cos(a) * r1).toFixed(1)}px`,
        '--sy': `${(Math.sin(a) * r1).toFixed(1)}px`,
        '--ex': `${(Math.cos(b) * r2).toFixed(1)}px`,
        '--ey': `${(Math.sin(b) * r2).toFixed(1)}px`,
        '--r': `${Math.round(rand() * 360 - 180)}deg`,
        '--d': `${((i % 4) * 0.025 + Math.floor(i / 4) * 0.025).toFixed(3)}s`,
      } as React.CSSProperties;
    });
  }, []);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-assemble" role="status" aria-label="Loading">
        <div className="loader-assemble__block" aria-hidden="true">
          {parts.map((s, i) => (
            <span key={i} className="loader-assemble__p" style={s} />
          ))}
        </div>
      </div>
    </>
  );
}
