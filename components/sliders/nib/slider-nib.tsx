"use client";

import { useRef, useState } from 'react';

const W = 240;
const Y = 30;
const N = 115;
const sx = (i: number) => 6 + i * 2;
const at = (v: number) => 6 + (v / 100) * (W - 12);

const css = `
  .slider-nib { position: relative; width: ${W}px; height: 72px; }
  .slider-nib__svg { position: absolute; left: 0; top: 0; width: ${W}px; height: 48px; overflow: visible; }
  .slider-nib__guide { stroke: light-dark(#dbdde1, #2e3035); stroke-width: 1.5; stroke-linecap: round; stroke-dasharray: 1 5; }
  .slider-nib__ink { fill: light-dark(#373a40, #f1f2f3); }
  .slider-nib__pen { fill: light-dark(#373a40, #f1f2f3); }
  .slider-nib__cut { stroke: light-dark(#fbfcfd, #121417); stroke-width: 0.9; stroke-linecap: round; }
  .slider-nib__hole { fill: light-dark(#fbfcfd, #121417); }
  .slider-nib__ring { fill: none; stroke: transparent; stroke-width: 2; }
  .slider-nib:has(.slider-nib__input:focus-visible) .slider-nib__ring { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-nib__value { position: absolute; left: 0; right: 0; top: 52px; display: flex; justify-content: space-between; margin: 0; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-nib__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-nib__input { position: absolute; left: 0; top: 0; width: 100%; height: 48px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-nib__input::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 48px; }
  .slider-nib__input::-moz-range-thumb { width: 12px; height: 48px; border: 0; }
`;

export function NibSlider() {
  const [v, setV] = useState(62);
  // The width of the line at every 2px, written as the nib passes over it.
  const ink = useRef({ w: Array.from({ length: N }, (_, i) => 2.6 + 2.4 * Math.abs(Math.sin(i / 13))), x: at(62), t: 0 });

  const write = (nv: number) => {
    const q = ink.current;
    const now = performance.now();
    const x1 = at(nv);
    const speed = (Math.abs(x1 - q.x) / Math.max(8, now - q.t)) * 1000;
    // Only forward strokes lay ink: slow is heavy, fast is a hairline. Going back leaves the line as drawn.
    if (x1 > q.x) {
      const target = Math.max(1.4, Math.min(7, 7.4 - speed / 60));
      const i0 = Math.max(0, Math.ceil((q.x - 6) / 2));
      const i1 = Math.min(N - 1, Math.floor((x1 - 6) / 2));
      for (let i = i0; i <= i1; i++) {
        const prev = i > 0 ? q.w[i - 1] : target;
        q.w[i] = prev + (target - prev) * 0.35;
      }
    }
    q.x = x1;
    q.t = now;
    setV(nv);
  };

  const tip = at(v);
  const k = Math.min(N - 1, Math.floor((tip - 6) / 2));
  const w = ink.current.w;
  let d = '';
  for (let i = 0; i <= k; i++) d += `${i ? 'L' : 'M'} ${sx(i)} ${(Y - w[i] / 2).toFixed(2)} `;
  d += `L ${tip} ${Y} `;
  for (let i = k; i >= 0; i--) d += `L ${sx(i)} ${(Y + w[i] / 2).toFixed(2)} `;

  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-nib">
        <svg className="slider-nib__svg" aria-hidden="true">
          <line className="slider-nib__guide" x1={tip + 6} y1={Y} x2={W - 2} y2={Y} />
          <path className="slider-nib__ink" d={`${d}Z`} />
          <g className="slider-nib__head" transform={`translate(${tip} ${Y}) rotate(38)`}>
            <path className="slider-nib__pen" d="M0 0 L-4.2 -11 Q-4.6 -17 0 -19 Q4.6 -17 4.2 -11 Z" />
            <line className="slider-nib__cut" x1={0} y1={-2} x2={0} y2={-10} />
            <circle className="slider-nib__hole" cx={0} cy={-11.5} r={1.3} />
          </g>
          <circle className="slider-nib__ring" cx={tip + 5} cy={Y - 8} r={13} />
        </svg>
        <p className="slider-nib__value" aria-hidden="true">
          <span>Stroke</span>
          <b>{v}%</b>
        </p>
        <input className="slider-nib__input" type="range" min={0} max={100} value={v} onChange={(e) => write(+e.target.value)} aria-label="Stroke" aria-valuetext={`${v}%`} />
      </div>
    </>
  );
}
