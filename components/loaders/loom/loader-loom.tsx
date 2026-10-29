"use client";

import * as React from "react";
const ROWS = 6;
const WARPS = 9;
const GAP = 10; // warp spacing
const ROW = 9; // row height
const W = WARPS * GAP;
const H = ROWS * ROW;
const SLOT = 12; // percent of the cycle each pass takes; rows are woven in 72%, held, then cleared together

// One pass per row, alternating direction like a shuttle: left to right, then back.
const rowKeyframes = Array.from({ length: ROWS }, (_, r) => {
  const a = r * SLOT;
  const b = a + SLOT;
  const from = r % 2 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)';
  return `@keyframes loader-loom-r${r} { 0%, ${a}% { clip-path: ${from}; } ${b}%, 88% { clip-path: inset(0 0 0 0); opacity: 1; } 96%, 100% { clip-path: inset(0 0 0 0); opacity: 0; } }`;
}).join('\n  ');
const shuttle = Array.from({ length: ROWS }, (_, r) => {
  const y = H - (r + 0.5) * ROW;
  const [x0, x1] = r % 2 ? [W + 8, -8] : [-8, W + 8];
  return `${r * SLOT}% { transform: translate(${x0}px, ${y}px); } ${(r + 1) * SLOT - 0.01}% { transform: translate(${x1}px, ${y}px); }`;
}).join(' ');

const css = `
  ${rowKeyframes}
  @keyframes loader-loom-shuttle { ${shuttle} 72.01%, 100% { transform: translate(${W + 8}px, ${H - ROW / 2}px); opacity: 0; } }
  .loader-loom { position: relative; width: ${W}px; height: ${H + 16}px; padding-top: 8px; }
  .loader-loom__warp { position: absolute; top: 0; bottom: 0; width: 1.5px; background: light-dark(#6d7179, #7d8087); }
  .loader-loom__row { position: absolute; left: -4px; right: -4px; height: ${ROW}px; }
  /* Under the warp: the thread's faint continuous line. Over it: the bright stretches between every other warp. */
  .loader-loom__row::before { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 3px; margin-top: -1.5px; background: light-dark(#dbdde1, #2e3035); }
  .loader-loom__over { position: absolute; left: 4px; right: 4px; top: 50%; height: 5px; margin-top: -2.5px; background: repeating-linear-gradient(90deg, transparent 0 calc(var(--o) * ${GAP}px + 1.5px), light-dark(#42454c, #e5e6e9) calc(var(--o) * ${GAP}px + 1.5px) calc(var(--o) * ${GAP}px + ${GAP}px), transparent calc(var(--o) * ${GAP}px + ${GAP}px) ${GAP * 2}px); border-radius: 2px; }
  .loader-loom__row { animation: var(--anim) 5s linear infinite; }
  .loader-loom__warps { position: absolute; left: 0; right: 0; top: 0; bottom: 8px; }
  .loader-loom__shuttle { position: absolute; left: 0; top: 8px; width: 14px; height: 5px; margin: -2.5px -7px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 6px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 50%, transparent); animation: loader-loom-shuttle 5s linear infinite; }
  .loader-loom__beam { position: absolute; left: -8px; right: -8px; height: 4px; border-radius: 2px; background: light-dark(#cbced3, #393c41); }
  @media (prefers-reduced-motion: reduce) {
    .loader-loom__row, .loader-loom__shuttle { animation: none; }
    .loader-loom__shuttle { display: none; }
  }
`;

export function LoomLoader() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-loom" role="status" aria-label="Loading">
        <span className="loader-loom__beam" aria-hidden="true" style={{ top: 2 }} />
        {Array.from({ length: ROWS }, (_, r) => (
          <span
            key={r}
            className="loader-loom__row"
            aria-hidden="true"
            style={{ top: 8 + H - (r + 1) * ROW, '--anim': `loader-loom-r${r}`, zIndex: 0 } as React.CSSProperties}
          >
            <span className="loader-loom__over" style={{ '--o': r % 2, zIndex: 2 } as React.CSSProperties} />
          </span>
        ))}
        <span className="loader-loom__warps" aria-hidden="true" style={{ top: 8, zIndex: 1 }}>
          {Array.from({ length: WARPS + 1 }, (_, k) => (
            <span key={k} className="loader-loom__warp" style={{ left: k * GAP }} />
          ))}
        </span>
        <span className="loader-loom__beam" aria-hidden="true" style={{ top: H + 10 }} />
        <span className="loader-loom__shuttle" aria-hidden="true" />
      </div>
    </>
  );
}
