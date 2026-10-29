"use client";

import * as React from "react";
import { useMemo } from 'react';

const css = `
  @keyframes loader-galaxy-turn { to { transform: rotate(360deg); } }
  @keyframes loader-galaxy-twinkle {
    0%, 100% { opacity: var(--o); }
    50% { opacity: calc(var(--o) * 0.35); }
  }
  .loader-galaxy {
    position: relative;
    width: 110px;
    height: 110px;
    animation: loader-galaxy-turn 9s linear infinite;
  }
  .loader-galaxy__core {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 16px;
    height: 16px;
    margin: -8px 0 0 -8px;
    border-radius: 50%;
    background: radial-gradient(circle, light-dark(#373a40, #f1f2f3), color-mix(in oklab, light-dark(#373a40, #f1f2f3) 30%, transparent) 60%, transparent);
    box-shadow: 0 0 20px 6px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 20%, transparent);
  }
  .loader-galaxy__star {
    position: absolute;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
    animation: loader-galaxy-twinkle var(--tw) ease-in-out var(--d) infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .loader-galaxy { animation-duration: 40s; }
    .loader-galaxy__star { animation: none; opacity: var(--o); }
  }
`;

export function GalaxyLoader() {
  // Two logarithmic arms with seeded scatter, so server and client agree.
  const stars = useMemo(() => {
    let seed = 5;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const out: React.CSSProperties[] = [];
    for (let arm = 0; arm < 2; arm++)
      for (let i = 0; i < 30; i++) {
        const t = i / 29;
        const r = 8 + t * 44;
        const a = arm * Math.PI + t * 4.4 + (rand() - 0.5) * 0.5;
        const jitter = (rand() - 0.5) * (3 + t * 7);
        const size = 1 + rand() * (2.2 - t * 1.2);
        out.push({
          left: `${(55 + Math.cos(a) * r + jitter).toFixed(1)}px`,
          top: `${(55 + Math.sin(a) * r + jitter).toFixed(1)}px`,
          width: size,
          height: size,
          '--o': (1 - t * 0.6).toFixed(2),
          '--tw': `${(1.2 + rand() * 2).toFixed(2)}s`,
          '--d': `${(-rand() * 3).toFixed(2)}s`,
        } as React.CSSProperties);
      }
    return out;
  }, []);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-galaxy" role="status" aria-label="Loading">
        <span className="loader-galaxy__core" aria-hidden="true" />
        {stars.map((s, i) => (
          <span key={i} className="loader-galaxy__star" style={s} aria-hidden="true" />
        ))}
      </div>
    </>
  );
}
