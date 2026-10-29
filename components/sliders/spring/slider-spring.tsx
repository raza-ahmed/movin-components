"use client";

import { useState } from 'react';

const COILS = 9;

const css = `
  .slider-spring { display: grid; justify-items: center; gap: 10px; width: 230px; }
  .slider-spring__view { position: relative; width: 230px; height: 76px; }
  .slider-spring__view svg { display: block; width: 100%; height: 100%; overflow: visible; }
  .slider-spring__wall { fill: light-dark(#dbdde1, #2e3035); }
  .slider-spring__hatch { stroke: light-dark(#6d7179, #7d8087); stroke-width: 1; }
  .slider-spring__coil { fill: none; stroke: light-dark(#50535b, #c6c8cd); stroke-width: 2.5; stroke-linejoin: round; stroke-linecap: round; }
  .slider-spring__floor { stroke: light-dark(#dbdde1, #2e3035); stroke-width: 1; stroke-dasharray: 3 4; }
  .slider-spring__weight { fill: light-dark(#42454c, #e5e6e9); }
  .slider-spring__weight-top { fill: light-dark(#373a40, #f1f2f3); }
  .slider-spring__label { fill: light-dark(#ebedf0, #232529); font-size: 9px; font-weight: 600; font-family: system-ui, sans-serif; }
  .slider-spring__read { color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .slider-spring__read b { color: light-dark(#373a40, #f1f2f3); font-weight: 600; font-variant-numeric: tabular-nums; }
  .slider-spring:has(.slider-spring__input:focus-visible) .slider-spring__weight { stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2; }
  .slider-spring__input { position: absolute; inset: 0 0 0 18px; width: calc(100% - 18px); height: 100%; margin: 0; opacity: 0; cursor: ew-resize; -webkit-appearance: none; appearance: none; background: none; }
  .slider-spring__input::-webkit-slider-thumb { -webkit-appearance: none; width: 36px; height: 76px; }
  .slider-spring__input::-moz-range-thumb { width: 36px; height: 76px; border: 0; }
`;

export function SpringSlider() {
  const [v, setV] = useState(35);
  const t = v / 100;
  const end = 66 + t * 128; // where the spring meets the weight
  const amp = 15 - t * 6;
  const pts = [`20 38`];
  for (let i = 1; i < COILS * 2; i++) pts.push(`${(20 + 6 + ((end - 32) * i) / (COILS * 2)).toFixed(1)} ${i % 2 ? 38 - amp : 38 + amp}`);
  pts.push(`${(end - 6).toFixed(1)} 38`, `${end.toFixed(1)} 38`);
  const newtons = Math.round(t * 120);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-spring">
        <div className="slider-spring__view">
          <svg viewBox="0 0 230 76" aria-hidden="true">
            <line className="slider-spring__floor" x1="20" y1="58" x2="230" y2="58" />
            <rect className="slider-spring__wall" x="8" y="8" width="12" height="60" rx="2" />
            {[14, 26, 38, 50, 62].map((y) => (
              <line key={y} className="slider-spring__hatch" x1="8" y1={y} x2="2" y2={y + 6} />
            ))}
            <polyline className="slider-spring__coil" points={pts.join(' ')} />
            <g transform={`translate(${end.toFixed(1)} 20)`}>
              <rect className="slider-spring__weight" width="36" height="38" rx="5" />
              <rect className="slider-spring__weight-top" width="36" height="6" rx="3" />
              <text className="slider-spring__label" x="18" y="27" textAnchor="middle">
                5 kg
              </text>
            </g>
          </svg>
          <input
            className="slider-spring__input"
            type="range"
            min={0}
            max={100}
            value={v}
            onChange={(e) => setV(+e.target.value)}
            aria-label="Tension"
            aria-valuetext={`${newtons} newtons`}
          />
        </div>
        <span className="slider-spring__read" aria-hidden="true">
          Tension <b>{newtons} N</b>
        </span>
      </div>
    </>
  );
}
