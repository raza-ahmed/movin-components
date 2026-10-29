"use client";

import * as React from "react";
import { useId, useState } from 'react';

const DUST = [
  { x: 10, d: 0.3 },
  { x: 16, d: 0.42 },
  { x: 22, d: 0.36 },
  { x: 27, d: 0.5 },
];

const css = `
  @keyframes cb-chalk-dust { from { transform: translateY(0); opacity: 0.9; } to { transform: translateY(16px); opacity: 0; } }
  .cb-chalk { position: relative; display: inline-flex; align-items: center; gap: 14px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-chalk__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-chalk__box { position: relative; width: 34px; height: 34px; }
  .cb-chalk__input:focus-visible + .cb-chalk__box { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; border-radius: 6px; }
  .cb-chalk__box svg { width: 100%; height: 100%; overflow: visible; }
  .cb-chalk__frame { fill: none; stroke: light-dark(#5f626a, #a7abb2); stroke-width: 2; stroke-linecap: round; }
  .cb-chalk__tick { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 3.2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 0.2s; }
  .cb-chalk__input:checked + .cb-chalk__box .cb-chalk__tick { stroke-dashoffset: 0; transition: stroke-dashoffset 0.45s cubic-bezier(0.6, 0, 0.3, 1); }
  .cb-chalk__dust { position: absolute; top: 24px; width: 2px; height: 2px; border-radius: 50%; background: light-dark(#50535b, #c6c8cd); opacity: 0; }
  .cb-chalk[data-armed] .cb-chalk__input:checked + .cb-chalk__box .cb-chalk__dust { animation: cb-chalk-dust 0.8s ease-in var(--d) both; }
  .cb-chalk__text { font-style: italic; letter-spacing: 0.01em; }
  @media (prefers-reduced-motion: reduce) {
    .cb-chalk__tick { transition-duration: 0.01s !important; }
    .cb-chalk__dust { animation: none !important; }
  }
`;

export function ChalkCheckbox() {
  const [armed, setArmed] = useState(false);
  const grain = `cb-chalk-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-chalk" data-armed={armed || undefined}>
        <input className="cb-chalk__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-chalk__box" aria-hidden="true">
          <svg viewBox="0 0 34 34">
            <defs>
              {/* Chalk: speckled holes eaten out of the stroke and a rough, pushed-about edge. */}
              <filter id={grain} x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="3" result="n" />
                <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" result="rough" />
                <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.9" result="holes" />
                <feComposite in="rough" in2="holes" operator="in" />
              </filter>
            </defs>
            <g filter={`url(#${grain})`}>
              <path className="cb-chalk__frame" d="M5 6C12 4.5 22 5 29 5.5C29.5 13 29 21 28.6 29C20 29.4 12 29 5.4 28.6C4.8 21 5 13 5 6Z" />
              <path className="cb-chalk__tick" d="M9 17.5C11 19.5 13 22 14.5 24C18 17 22.5 11 29 6" pathLength={1} />
            </g>
          </svg>
          {DUST.map((p) => (
            <span key={p.x} className="cb-chalk__dust" style={{ left: p.x, '--d': `${p.d}s` } as React.CSSProperties} />
          ))}
        </span>
        <span className="cb-chalk__text">Lesson done</span>
      </label>
    </>
  );
}
