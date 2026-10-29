"use client";

import * as React from "react";
// Each firefly: a home position, how far it wanders, its own pace and blink.
const FLIES = [
  { x: 18, y: 40, dx: 14, dy: -10, dur: 5.2, blink: 2.1, d: 0 },
  { x: 52, y: 22, dx: -10, dy: 12, dur: 6.1, blink: 2.7, d: -0.8 },
  { x: 86, y: 46, dx: 12, dy: -14, dur: 4.7, blink: 1.9, d: -1.6 },
  { x: 110, y: 18, dx: -14, dy: 10, dur: 5.8, blink: 2.4, d: -0.4 },
  { x: 38, y: 62, dx: 16, dy: 8, dur: 6.6, blink: 3.1, d: -2.2 },
  { x: 74, y: 70, dx: -12, dy: -12, dur: 5.5, blink: 2.2, d: -1.1 },
  { x: 124, y: 60, dx: -10, dy: -8, dur: 4.9, blink: 2.9, d: -2.7 },
];

const css = `
  @keyframes loader-fireflies-drift {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(var(--dx), calc(var(--dy) * 0.4)); }
    50% { transform: translate(calc(var(--dx) * 0.4), var(--dy)); }
    75% { transform: translate(calc(var(--dx) * -0.5), calc(var(--dy) * 0.6)); }
  }
  @keyframes loader-fireflies-blink { 0%, 55%, 100% { opacity: 0.15; transform: scale(0.6); } 70% { opacity: 1; transform: scale(1); } }
  .loader-fireflies { position: relative; width: 144px; height: 84px; }
  .loader-fireflies__fly { position: absolute; width: 0; height: 0; animation: loader-fireflies-drift var(--dur) ease-in-out infinite var(--d); }
  .loader-fireflies__fly::after {
    content: '';
    position: absolute;
    left: -3px;
    top: -3px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 8px 3px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 45%, transparent), 0 0 18px 6px color-mix(in oklab, light-dark(#42454c, #e5e6e9) 18%, transparent);
    animation: loader-fireflies-blink var(--blink) ease-in-out infinite var(--d);
  }
  @media (prefers-reduced-motion: reduce) {
    .loader-fireflies__fly, .loader-fireflies__fly::after { animation-duration: 0s; animation-iteration-count: 1; }
    .loader-fireflies__fly::after { opacity: 0.7; }
  }
`;

export function FirefliesLoader() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-fireflies" role="status" aria-label="Loading">
        {FLIES.map((f, i) => (
          <span
            key={i}
            className="loader-fireflies__fly"
            aria-hidden="true"
            style={{ left: f.x, top: f.y, '--dx': `${f.dx}px`, '--dy': `${f.dy}px`, '--dur': `${f.dur}s`, '--blink': `${f.blink}s`, '--d': `${f.d}s` } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  );
}
