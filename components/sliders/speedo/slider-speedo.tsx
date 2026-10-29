"use client";

import * as React from "react";
import { useState } from 'react';

// The dial runs from -120deg (0) to +120deg (240), centre at (100, 100).
const TICKS = Array.from({ length: 25 }, (_, i) => {
  const a = ((-120 + i * 10) * Math.PI) / 180;
  const r1 = i % 2 ? 78 : 72;
  return { i, x1: (100 + Math.sin(a) * r1).toFixed(1), y1: (100 - Math.cos(a) * r1).toFixed(1), x2: (100 + Math.sin(a) * 84).toFixed(1), y2: (100 - Math.cos(a) * 84).toFixed(1) };
});
const NUMS = Array.from({ length: 7 }, (_, i) => {
  const a = ((-120 + i * 40) * Math.PI) / 180;
  return { n: i * 40, x: (100 + Math.sin(a) * 60).toFixed(1), y: (100 - Math.cos(a) * 60 + 3).toFixed(1) };
});

const css = `
  .slider-speedo { position: relative; width: 210px; height: 170px; }
  .slider-speedo svg { display: block; width: 210px; height: 170px; }
  .slider-speedo__face { fill: light-dark(#f3f4f7, #1a1c1f); stroke: light-dark(#dbdde1, #2e3035); stroke-width: 1; }
  .slider-speedo__groove { fill: none; stroke: light-dark(#ebedf0, #232529); stroke-width: 6; stroke-linecap: round; }
  .slider-speedo__arc { fill: none; stroke: light-dark(#50535b, #c6c8cd); stroke-width: 6; stroke-linecap: round; stroke-dasharray: 100 200; transition: stroke-dashoffset 0.6s cubic-bezier(0.3, 1.4, 0.5, 1); }
  .slider-speedo__tick { stroke: light-dark(#6d7179, #7d8087); stroke-width: 1.5; }
  .slider-speedo__tick--major { stroke: light-dark(#42454c, #e5e6e9); stroke-width: 2; }
  .slider-speedo__num { fill: light-dark(#5f626a, #a7abb2); font-size: 10px; font-family: system-ui, sans-serif; text-anchor: middle; }
  .slider-speedo__needle { transform-origin: 100px 100px; transform: rotate(calc(-120deg + var(--slider-speedo-v) * 240deg)); transition: transform 0.6s cubic-bezier(0.3, 1.6, 0.5, 1); }
  .slider-speedo__needle path { fill: light-dark(#373a40, #f1f2f3); }
  .slider-speedo__hub { fill: light-dark(#42454c, #e5e6e9); stroke: light-dark(#dbdde1, #2e3035); stroke-width: 3; }
  .slider-speedo__speed { fill: light-dark(#373a40, #f1f2f3); font-size: 22px; font-weight: 600; font-family: system-ui, sans-serif; text-anchor: middle; font-variant-numeric: tabular-nums; }
  .slider-speedo__unit { fill: light-dark(#5f626a, #a7abb2); font-size: 9px; font-family: system-ui, sans-serif; text-anchor: middle; letter-spacing: 0.08em; }
  .slider-speedo:has(.slider-speedo__input:focus-visible) .slider-speedo__face { stroke: light-dark(#50535b, #c6c8cd); stroke-width: 2; }
  .slider-speedo__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: ew-resize; -webkit-appearance: none; appearance: none; background: none; }
  .slider-speedo__input::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 170px; }
  .slider-speedo__input::-moz-range-thumb { width: 20px; height: 170px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-speedo__needle, .slider-speedo__arc { transition: none; }
  }
`;

export function SpeedoSlider() {
  const [v, setV] = useState(45);
  const kmh = Math.round((v / 100) * 240);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-speedo" style={{ '--slider-speedo-v': v / 100 } as React.CSSProperties}>
        <svg viewBox="0 0 200 162" aria-hidden="true">
          <path className="slider-speedo__face" d="M20.4 150A94 94 0 1 1 179.6 150Z" />
          <path className="slider-speedo__groove" d="M27.3 142A84 84 0 1 1 172.7 142" pathLength={100} />
          <path className="slider-speedo__arc" d="M27.3 142A84 84 0 1 1 172.7 142" pathLength={100} style={{ strokeDashoffset: 100 - v }} />
          {TICKS.map((t) => (
            <line key={t.i} className={`slider-speedo__tick${t.i % 2 ? '' : ' slider-speedo__tick--major'}`} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
          ))}
          {NUMS.map((n) => (
            <text key={n.n} className="slider-speedo__num" x={n.x} y={n.y}>
              {n.n}
            </text>
          ))}
          <text className="slider-speedo__speed" x="100" y="128">
            {kmh}
          </text>
          <text className="slider-speedo__unit" x="100" y="141">
            KM/H
          </text>
          <g className="slider-speedo__needle">
            <path d="M98 100L99.2 30h1.6L102 100Z" />
          </g>
          <circle className="slider-speedo__hub" cx="100" cy="100" r="7" />
        </svg>
        <input
          className="slider-speedo__input"
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => setV(+e.target.value)}
          aria-label="Speed limit"
          aria-valuetext={`${kmh} kilometres per hour`}
        />
      </div>
    </>
  );
}
