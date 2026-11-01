"use client";

import { useId, useState } from 'react';

const W = 240;
const BASE = 46;
const LOW = 3;
const HIGH = 26;

const css = `
  .slider-wedge { position: relative; width: ${W}px; height: 56px; }
  .slider-wedge__svg { display: block; width: ${W}px; height: 56px; overflow: visible; }
  .slider-wedge__ramp {
    transform-box: view-box;
    transform-origin: 0 ${BASE}px;
    transition: transform 0.5s cubic-bezier(0.3, 1.5, 0.5, 1);
  }
  .slider-wedge:has(.slider-wedge__input:active) .slider-wedge__ramp { transform: scale(1, 1.3); }
  .slider-wedge__track { fill: light-dark(#ebedf0, #232529); stroke: light-dark(#ebedf0, #232529); stroke-width: 4; stroke-linejoin: round; }
  .slider-wedge__fill { stroke-width: 4; stroke-linejoin: round; }
  .slider-wedge__bar { fill: light-dark(#373a40, #f1f2f3); }
  .slider-wedge__ring { fill: none; stroke: transparent; stroke-width: 2; }
  .slider-wedge:has(.slider-wedge__input:focus-visible) .slider-wedge__ring { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-wedge__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-wedge__input::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 56px; }
  .slider-wedge__input::-moz-range-thumb { width: 12px; height: 56px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-wedge__ramp { transition: none; }
  }
`;

export function WedgeSlider() {
  const [v, setV] = useState(62);
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const t = 6 + (v / 100) * (W - 12); // the native thumb is 12px wide, so its centre runs 6 → W - 6
  // Height of the ramp's top edge at any x.
  const top = (x: number) => BASE - LOW - ((HIGH - LOW) * (x - 2)) / (W - 4);
  const ramp = `2,${BASE} 2,${top(2)} ${W - 2},${top(W - 2)} ${W - 2},${BASE}`;
  const yt = top(t) - 7;
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-wedge">
        <svg className="slider-wedge__svg" aria-hidden="true">
          <defs>
            <clipPath id={`${id}c`}>
              <rect x={-4} y={-20} width={t + 4} height={90} />
            </clipPath>
            <linearGradient id={`${id}g`} gradientUnits="userSpaceOnUse" x1={2} x2={t} y1={0} y2={0}>
              <stop offset="0" style={{ stopColor: 'light-dark(#6d7179, #7d8087)' }} />
              <stop offset="1" style={{ stopColor: 'light-dark(#373a40, #f1f2f3)' }} />
            </linearGradient>
          </defs>
          <g className="slider-wedge__ramp">
            <polygon className="slider-wedge__track" points={ramp} />
            <polygon className="slider-wedge__fill" points={ramp} clipPath={`url(#${id}c)`} fill={`url(#${id}g)`} stroke={`url(#${id}g)`} />
            <rect className="slider-wedge__bar" x={t - 2} y={yt} width={4} height={BASE + 4 - yt} rx={2} />
            <rect className="slider-wedge__ring" x={t - 6} y={yt - 4} width={12} height={BASE + 12 - yt} rx={6} />
          </g>
        </svg>
        <input
          className="slider-wedge__input"
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => setV(+e.target.value)}
          aria-label="Volume"
        />
      </div>
    </>
  );
}
