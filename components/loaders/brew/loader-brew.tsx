"use client";

import * as React from "react";
const WISPS = [
  { x: 22, d: 0, dur: 2.6 },
  { x: 32, d: -0.9, dur: 3.1 },
  { x: 42, d: -1.7, dur: 2.8 },
];

const css = `
  /* A wisp draws up out of the cup, sways and thins away while it rises. */
  @keyframes loader-brew-rise {
    0% { stroke-dashoffset: 1; opacity: 0; transform: translateY(6px); }
    25% { opacity: 0.9; }
    60% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: -1; opacity: 0; transform: translateY(-10px); }
  }
  .loader-brew { position: relative; width: 76px; height: 84px; }
  .loader-brew svg { width: 100%; height: 100%; overflow: visible; }
  .loader-brew__wisp { fill: none; stroke: light-dark(#5f626a, #a7abb2); stroke-width: 2.2; stroke-linecap: round; stroke-dasharray: 1; animation: loader-brew-rise var(--dur) ease-in-out infinite var(--d); }
  .loader-brew__cup { fill: light-dark(#dbdde1, #2e3035); stroke: light-dark(#6d7179, #7d8087); stroke-width: 1.2; }
  .loader-brew__handle { fill: none; stroke: light-dark(#6d7179, #7d8087); stroke-width: 3.5; }
  .loader-brew__coffee { fill: light-dark(#f3f4f7, #1a1c1f); }
  .loader-brew__saucer { fill: light-dark(#ebedf0, #232529); stroke: light-dark(#cbced3, #393c41); stroke-width: 1; }
  @media (prefers-reduced-motion: reduce) {
    .loader-brew__wisp { animation: none; stroke-dashoffset: 0; opacity: 0.6; }
  }
`;

export function BrewLoader() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-brew" role="status" aria-label="Loading">
        <svg viewBox="0 0 76 84" aria-hidden="true">
          {WISPS.map((w) => (
            <path
              key={w.x}
              className="loader-brew__wisp"
              pathLength={1}
              d={`M${w.x} 40C${w.x - 6} 32 ${w.x + 6} 26 ${w.x} 18S${w.x + 5} 8 ${w.x - 1} 2`}
              style={{ '--d': `${w.d}s`, '--dur': `${w.dur}s` } as React.CSSProperties}
            />
          ))}
          <path className="loader-brew__handle" d="M58 52C68 52 68 66 56 66" />
          <ellipse className="loader-brew__saucer" cx="34" cy="76" rx="30" ry="5" />
          <path className="loader-brew__cup" d="M10 46H58L54 68C53 73 49 75 44 75H24C19 75 15 73 14 68Z" />
          <ellipse className="loader-brew__coffee" cx="34" cy="46.5" rx="22.5" ry="3" />
        </svg>
      </div>
    </>
  );
}
