"use client";

import * as React from "react";
import { useState } from 'react';

const css = `
  @keyframes cb-stencil-plate {
    0% { opacity: 0; transform: translateY(-16px) rotate(-6deg); }
    18% { opacity: 1; transform: none; }
    64% { opacity: 1; transform: none; }
    100% { opacity: 0; transform: translate(12px, -18px) rotate(14deg); }
  }
  @keyframes cb-stencil-mist {
    0%, 22% { opacity: 0; transform: scale(0.4); }
    35% { opacity: 0.55; }
    62% { opacity: 0; transform: scale(1.5); }
    100% { opacity: 0; transform: scale(1.5); }
  }
  @keyframes cb-stencil-paint { 0%, 30% { opacity: 0; } 55%, 100% { opacity: 1; } }
  .cb-stencil { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-stencil__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-stencil__box {
    position: relative;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1.5px light-dark(#cbced3, #393c41);
  }
  .cb-stencil__input:focus-visible + .cb-stencil__box { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-stencil__box svg { position: absolute; overflow: visible; }
  .cb-stencil__paint { inset: 0; width: 28px; height: 28px; opacity: 0; transition: opacity 0.25s ease; }
  .cb-stencil__input:checked + .cb-stencil__box .cb-stencil__paint { opacity: 1; transition: none; }
  .cb-stencil__spray { fill: light-dark(#373a40, #f1f2f3); opacity: 0.22; filter: blur(1.4px); }
  .cb-stencil__fill { fill: light-dark(#373a40, #f1f2f3); }
  .cb-stencil__speck { fill: light-dark(#373a40, #f1f2f3); opacity: 0.5; }
  .cb-stencil__plate { left: -3px; top: -3px; width: 34px; height: 34px; opacity: 0; pointer-events: none; z-index: 1; }
  .cb-stencil__plate path { fill: light-dark(#6d7179, #7d8087); }
  .cb-stencil__plate circle { fill: light-dark(#dbdde1, #2e3035); }
  .cb-stencil__mist {
    position: absolute;
    width: 16px;
    height: 16px;
    margin: -8px 0 0 -8px;
    border-radius: 50%;
    background: radial-gradient(circle, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 70%, transparent), transparent 70%);
    opacity: 0;
    pointer-events: none;
    z-index: 2;
  }
  .cb-stencil[data-armed] .cb-stencil__input:checked + .cb-stencil__box .cb-stencil__plate { animation: cb-stencil-plate 0.95s ease-in-out; }
  .cb-stencil[data-armed] .cb-stencil__input:checked + .cb-stencil__box .cb-stencil__paint { animation: cb-stencil-paint 0.95s linear; }
  .cb-stencil[data-armed] .cb-stencil__input:checked + .cb-stencil__box .cb-stencil__mist { animation: cb-stencil-mist 0.95s ease-out var(--d); }
  @media (prefers-reduced-motion: reduce) {
    .cb-stencil__box * { animation: none !important; transition-duration: 0.01s !important; }
  }
`;

// A thick tick as one outline, so the plate can carry it as a real hole and the paint fills it exactly.
const TICK = 'M6.7 16.3L12.5 22L21.5 10L18.5 8L12.5 17L9.3 13.7Z';
const SPECKS = [
  [5, 12, 0.5],
  [8.5, 19.5, 0.6],
  [15, 22.5, 0.4],
  [23, 12.5, 0.6],
  [20.5, 6, 0.4],
  [16, 9.5, 0.5],
];
const MIST = [
  { x: 10, y: 14, d: '0s' },
  { x: 18, y: 12, d: '0.06s' },
  { x: 14, y: 19, d: '0.12s' },
];

export function StencilCheckbox() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-stencil" data-armed={armed || undefined}>
        <input className="cb-stencil__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-stencil__box" aria-hidden="true">
          <svg className="cb-stencil__paint" viewBox="0 0 28 28">
            <path className="cb-stencil__spray" d={TICK} />
            <path className="cb-stencil__fill" d={TICK} />
            {SPECKS.map(([x, y, r]) => (
              <circle key={`${x}-${y}`} className="cb-stencil__speck" cx={x} cy={y} r={r} />
            ))}
          </svg>
          <svg className="cb-stencil__plate" viewBox="-3 -3 34 34">
            <path fillRule="evenodd" d={`M-3 -1A2 2 0 0 1 -1 -3H29A2 2 0 0 1 31 -1V29A2 2 0 0 1 29 31H-1A2 2 0 0 1 -3 29Z${TICK}`} />
            <circle cx="0.5" cy="0.5" r="1" />
            <circle cx="27.5" cy="0.5" r="1" />
            <circle cx="0.5" cy="27.5" r="1" />
            <circle cx="27.5" cy="27.5" r="1" />
          </svg>
          {MIST.map((m) => (
            <span key={m.d} className="cb-stencil__mist" style={{ left: m.x, top: m.y, '--d': m.d } as React.CSSProperties} />
          ))}
        </span>
        Mark as final
      </label>
    </>
  );
}
