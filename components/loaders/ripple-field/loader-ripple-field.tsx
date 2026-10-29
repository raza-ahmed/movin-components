"use client";

import * as React from "react";
const css = `
  @keyframes loader-ripple-field-wave {
    0%, 100% { transform: scale(0.35); opacity: 0.25; }
    18% { transform: scale(1.15); opacity: 1; }
    40% { transform: scale(0.35); opacity: 0.25; }
  }
  .loader-ripple-field {
    display: grid;
    grid-template-columns: repeat(9, 10px);
    grid-auto-rows: 10px;
    gap: 2px;
  }
  .loader-ripple-field__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
    animation: loader-ripple-field-wave 2s cubic-bezier(0.45, 0, 0.55, 1) var(--d) infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .loader-ripple-field__dot { animation: none; transform: scale(0.5); opacity: 0.5; }
  }
`;

const N = 9;
const C = (N - 1) / 2;

export function RippleFieldLoader() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-ripple-field" role="status" aria-label="Loading">
        {Array.from({ length: N * N }, (_, i) => {
          // Delay by true distance from the centre, so each wavefront is a circle, not a diamond.
          const d = Math.hypot((i % N) - C, Math.floor(i / N) - C);
          return (
            <span
              key={i}
              className="loader-ripple-field__dot"
              style={{ '--d': `${(d * 0.13).toFixed(3)}s` } as React.CSSProperties}
              aria-hidden="true"
            />
          );
        })}
      </div>
    </>
  );
}
