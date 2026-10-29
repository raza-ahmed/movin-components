"use client";

import { useState } from 'react';

const css = `
  .slider-bow { display: grid; justify-items: center; gap: 10px; width: 230px; }
  .slider-bow__view { position: relative; width: 230px; height: 120px; }
  .slider-bow__view svg { display: block; width: 100%; height: 100%; overflow: visible; }
  .slider-bow__limb { fill: none; stroke: light-dark(#50535b, #c6c8cd); stroke-width: 5; stroke-linecap: round; }
  .slider-bow__grip { fill: light-dark(#6d7179, #7d8087); }
  .slider-bow__string { fill: none; stroke: light-dark(#42454c, #e5e6e9); stroke-width: 1.2; }
  .slider-bow__shaft { stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2.5; stroke-linecap: round; }
  .slider-bow__head { fill: light-dark(#373a40, #f1f2f3); }
  .slider-bow__fletch { fill: light-dark(#5f626a, #a7abb2); }
  .slider-bow__read { color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .slider-bow__read b { color: light-dark(#373a40, #f1f2f3); font-weight: 600; font-variant-numeric: tabular-nums; }
  .slider-bow:has(.slider-bow__input:focus-visible) .slider-bow__view { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 4px; border-radius: 8px; }
  .slider-bow__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: ew-resize; direction: rtl; -webkit-appearance: none; appearance: none; background: none; }
  .slider-bow__input::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 120px; }
  .slider-bow__input::-moz-range-thumb { width: 20px; height: 120px; border: 0; }
`;

export function BowSlider() {
  const [v, setV] = useState(40);
  const t = v / 100;
  const tipX = 132 - t * 14;
  const nockX = tipX - t * 84;
  const belly = 168 + t * 10;
  const lb = Math.round(20 + t * 40);
  const f = (n: number) => n.toFixed(1);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-bow">
        <div className="slider-bow__view">
          <svg viewBox="0 0 260 140" aria-hidden="true">
            <path className="slider-bow__string" d={`M${f(tipX)} 12L${f(nockX)} 70L${f(tipX)} 128`} />
            <g>
              <line className="slider-bow__shaft" x1={f(nockX)} y1="70" x2={f(nockX + 112)} y2="70" />
              <path className="slider-bow__head" d={`M${f(nockX + 122)} 70l-12-5v10Z`} />
              <path className="slider-bow__fletch" d={`M${f(nockX + 2)} 70l10-8h8l-8 8Z M${f(nockX + 2)} 70l10 8h8l-8-8Z`} />
            </g>
            <path className="slider-bow__limb" d={`M${f(tipX)} 12Q${f(belly)} 70 ${f(tipX)} 128`} />
            <rect className="slider-bow__grip" x={f((tipX + belly) / 2 - 5)} y="60" width="10" height="20" rx="3" />
          </svg>
          <input
            className="slider-bow__input"
            type="range"
            min={0}
            max={100}
            value={v}
            onChange={(e) => setV(+e.target.value)}
            aria-label="Draw weight"
            aria-valuetext={`${lb} pounds`}
          />
        </div>
        <span className="slider-bow__read" aria-hidden="true">
          Draw weight <b>{lb} lb</b>
        </span>
      </div>
    </>
  );
}
