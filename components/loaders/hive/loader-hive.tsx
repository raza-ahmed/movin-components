"use client";

import * as React from "react";
const css = `
  @keyframes loader-hive-cell {
    0%, 100% { background: light-dark(#ebedf0, #232529); transform: scale(0.9); }
    12% { background: light-dark(#373a40, #f1f2f3); transform: scale(1); }
    40% { background: light-dark(#cbced3, #393c41); transform: scale(0.92); }
  }
  @keyframes loader-hive-core {
    0%, 100% { background: light-dark(#6d7179, #7d8087); transform: scale(0.82); }
    50% { background: light-dark(#42454c, #e5e6e9); transform: scale(0.95); }
  }
  .loader-hive { position: relative; width: 104px; height: 100px; }
  .loader-hive__cell {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 30px;
    height: 34px;
    margin: -17px 0 0 -15px;
    /* Pointy-top hexagon. */
    clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
    background: light-dark(#ebedf0, #232529);
    animation: loader-hive-cell 2.1s ease-out var(--d) infinite;
  }
  .loader-hive__cell--core { animation: loader-hive-core 1.05s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) {
    .loader-hive__cell { animation: none; transform: scale(0.9); }
  }
`;

// Centres of the six neighbours of a pointy-top hex (width 30, row step 25.5), clockwise from the right.
const RING: [number, number][] = [
  [32, 0],
  [16, 27.5],
  [-16, 27.5],
  [-32, 0],
  [-16, -27.5],
  [16, -27.5],
];

export function HiveLoader() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-hive" role="status" aria-label="Loading">
        <span className="loader-hive__cell loader-hive__cell--core" aria-hidden="true" />
        {RING.map(([x, y], i) => (
          <span
            key={i}
            className="loader-hive__cell"
            aria-hidden="true"
            style={{ translate: `${x}px ${y}px`, '--d': `${(i * 0.35).toFixed(2)}s` } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  );
}
