"use client";

import { useId, useState } from 'react';

const W = 240;
const MID = 24;

/** One stroke from the left edge to `e`: it swells in from a point, wavers a little and ends in a round, wet tip. */
function stroke(e: number) {
  const top: string[] = [];
  const bot: string[] = [];
  let w = 0;
  // The brush lands at half pressure and presses down to full width over the first 30px.
  const width = (x: number) => 9.5 * (0.5 + 0.5 * Math.min(1, x / 30)) * (1 + 0.06 * Math.sin(x / 15));
  const y0 = MID + 0.9 * Math.sin(5 / 26);
  for (let x = 5; x <= e; x += 4) {
    w = width(x);
    const y = MID + 0.9 * Math.sin(x / 26);
    top.push(`${x.toFixed(1)},${(y - w).toFixed(2)}`);
    bot.unshift(`${x.toFixed(1)},${(y + w).toFixed(2)}`);
  }
  const w0 = width(5);
  const yEnd = MID + 0.9 * Math.sin(e / 26);
  return {
    d: `M${top.join('L')}L${e},${(yEnd - w).toFixed(2)}A${w} ${w} 0 0 1 ${e},${(yEnd + w).toFixed(2)}L${bot.join('L')}L5,${(y0 + w0).toFixed(2)}A${w0} ${w0} 0 0 1 5,${(y0 - w0).toFixed(2)}Z`,
    w,
    y: yEnd,
  };
}

const css = `
  .slider-brush { position: relative; width: ${W}px; height: 62px; }
  .slider-brush__svg { display: block; width: ${W}px; height: 48px; overflow: visible; }
  .slider-brush__guide { stroke: light-dark(#dbdde1, #2e3035); stroke-width: 1.5; stroke-dasharray: 1 5; stroke-linecap: round; }
  .slider-brush__paint { fill: light-dark(#42454c, #e5e6e9); }
  .slider-brush__fade { stop-color: light-dark(#42454c, #e5e6e9); }
  .slider-brush__wet { fill: light-dark(#373a40, #f1f2f3); opacity: 0.45; transition: opacity 0.2s; }
  .slider-brush:has(.slider-brush__input:active) .slider-brush__wet { opacity: 0.8; }
  .slider-brush__ring { fill: none; stroke: transparent; stroke-width: 2; }
  .slider-brush:has(.slider-brush__input:focus-visible) .slider-brush__ring { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-brush__value { position: absolute; left: 0; right: 0; top: 46px; display: flex; justify-content: space-between; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-brush__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-brush__input { position: absolute; left: 0; top: 0; width: 100%; height: 48px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-brush__input::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 48px; }
  .slider-brush__input::-moz-range-thumb { width: 16px; height: 48px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-brush__wet { transition: none; }
  }
`;

export function BrushSlider() {
  const id = useId().replace(/[^\w-]/g, '');
  const [v, setV] = useState(64);
  const e = 12 + (v / 100) * (W - 26);
  const s = stroke(e);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-brush">
        <svg className="slider-brush__svg" aria-hidden="true">
          <defs>
            {/* Bristle streaks: noise stretched along the stroke, cut to a hard edge, roughening the outline too. */}
            <filter id={`${id}-dry`} x="-5%" y="-60%" width="110%" height="220%">
              <feTurbulence type="fractalNoise" baseFrequency="0.006 0.55" numOctaves="2" seed="8" result="n" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  4.2 0 0 0 -1.55" result="m" />
              <feComposite in="SourceGraphic" in2="m" operator="in" result="p" />
              <feDisplacementMap in="p" in2="n" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id={`${id}-edge`} x="-5%" y="-60%" width="110%" height="220%">
              <feTurbulence type="fractalNoise" baseFrequency="0.05 0.3" numOctaves="2" seed="3" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            {/* Loaded where it starts, running dry by the time it reaches the thumb. */}
            <linearGradient id={`${id}-load`} gradientUnits="userSpaceOnUse" x1={0} x2={e} y1={0} y2={0}>
              <stop className="slider-brush__fade" offset="0" stopOpacity="1" />
              <stop className="slider-brush__fade" offset="0.45" stopOpacity="0.95" />
              <stop className="slider-brush__fade" offset="1" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line className="slider-brush__guide" x1={e + s.w + 6} x2={W - 1} y1={MID} y2={MID} />
          <path d={s.d} fill={`url(#${id}-load)`} filter={`url(#${id}-edge)`} />
          <path className="slider-brush__paint" d={s.d} filter={`url(#${id}-dry)`} />
          <ellipse className="slider-brush__wet" cx={e + s.w * 0.25} cy={s.y} rx={2.6} ry={s.w * 0.8} />
          <rect className="slider-brush__ring" x={e - 6} y={MID - 15} width={s.w + 14} height={30} rx={10} />
        </svg>
        <p className="slider-brush__value" aria-hidden="true">
          <span>Flow</span>
          <b>{v}%</b>
        </p>
        <input className="slider-brush__input" type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} aria-label="Flow" aria-valuetext={`${v}%`} />
      </div>
    </>
  );
}
