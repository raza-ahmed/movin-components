"use client";

import { useEffect, useRef, useState } from 'react';

const css = `
  .loader-percent { position: relative; display: grid; place-items: center; width: 96px; height: 96px; }
  .loader-percent__ring { position: absolute; inset: 0; transform: rotate(-90deg); }
  .loader-percent__track { fill: none; stroke: light-dark(#ebedf0, #232529); stroke-width: 4; }
  .loader-percent__bar {
    fill: none;
    stroke: light-dark(#373a40, #f1f2f3);
    stroke-width: 4;
    stroke-linecap: round;
    stroke-dasharray: 1;
  }
  .loader-percent__value {
    position: relative;
    color: light-dark(#373a40, #f1f2f3);
    font-size: 20px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }
  .loader-percent__value small { font-size: 11px; color: light-dark(#5f626a, #a7abb2); margin-left: 1px; }
  .loader-percent__done {
    position: absolute;
    width: 26px;
    height: 26px;
    fill: none;
    stroke: light-dark(#373a40, #f1f2f3);
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 1;
    transition: stroke-dashoffset 0.35s ease, opacity 0.2s ease;
  }
`;

// Progress (0–1) against time (s): the way real loads feel. Quick start, a long slow
// middle, a stall near the end, then the last stretch at once.
const KEYS: [number, number][] = [
  [0, 0],
  [0.5, 0.34],
  [1.6, 0.62],
  [2.2, 0.71],
  [3.1, 0.74],
  [3.5, 1],
];
const DONE = 3.5;
const HOLD = 1.1;

function at(t: number) {
  for (let i = 1; i < KEYS.length; i++) {
    const [t1, v1] = KEYS[i];
    const [t0, v0] = KEYS[i - 1];
    if (t <= t1) {
      const u = (t - t0) / (t1 - t0);
      return v0 + (v1 - v0) * (1 - (1 - u) ** 2);
    }
  }
  return 1;
}

export function PercentLoader() {
  const bar = useRef<SVGCircleElement>(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      let t = (now - start) / 1000;
      if (t > DONE + HOLD) {
        start = now;
        t = 0;
      }
      const p = at(t);
      bar.current!.style.strokeDashoffset = String(1 - p);
      setPct(Math.round(p * 100));
      raf = requestAnimationFrame(tick);
    };
    if (still) {
      bar.current!.style.strokeDashoffset = '0.4';
      setPct(60);
    } else raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const done = pct >= 100;
  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-percent" role="progressbar" aria-label="Loading" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <svg className="loader-percent__ring" viewBox="0 0 96 96" aria-hidden="true">
          <circle className="loader-percent__track" cx={48} cy={48} r={40} />
          <circle ref={bar} className="loader-percent__bar" cx={48} cy={48} r={40} pathLength={1} strokeDashoffset={1} />
        </svg>
        <span className="loader-percent__value" aria-hidden="true" style={{ opacity: done ? 0 : 1 }}>
          {pct}
          <small>%</small>
        </span>
        <svg
          className="loader-percent__done"
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ strokeDashoffset: done ? 0 : 1, opacity: done ? 1 : 0 }}
        >
          <path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} />
        </svg>
      </div>
    </>
  );
}
