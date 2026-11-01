"use client";

import { useEffect, useRef, useState } from 'react';

const W = 240;
const NY = 16;
const TY = 50;
const T = 16;
const XS = Array.from({ length: 13 }, (_, i) => 12 + i * 18);
const at = (v: number) => T / 2 + (v / 100) * (W - T);
const aim = (x: number, tx: number) => (Math.atan2(TY - NY, tx - x) * 180) / Math.PI;

const css = `
  .slider-needles { position: relative; width: ${W}px; height: 84px; }
  .slider-needles__svg { position: absolute; left: 0; top: 0; width: ${W}px; height: 62px; overflow: visible; }
  .slider-needles__north { fill: light-dark(#6d7179, #7d8087); transition: fill 0.2s; }
  .slider-needles__north--on { fill: light-dark(#373a40, #f1f2f3); }
  .slider-needles__south { fill: light-dark(#dbdde1, #2e3035); }
  .slider-needles__pivot { fill: light-dark(#5f626a, #a7abb2); }
  .slider-needles__rail { stroke: light-dark(#ebedf0, #232529); stroke-width: 4; stroke-linecap: round; }
  .slider-needles__fill { stroke: light-dark(#50535b, #c6c8cd); stroke-width: 4; stroke-linecap: round; }
  .slider-needles__thumb { fill: light-dark(#373a40, #f1f2f3); }
  .slider-needles__core { fill: light-dark(#fbfcfd, #121417); }
  .slider-needles__ring { fill: none; stroke: transparent; stroke-width: 2; }
  .slider-needles:has(.slider-needles__input:focus-visible) .slider-needles__ring { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-needles__value { position: absolute; left: 0; right: 0; top: 66px; display: flex; justify-content: space-between; margin: 0; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-needles__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-needles__input { position: absolute; left: 0; top: 0; width: 100%; height: 62px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-needles__input::-webkit-slider-thumb { -webkit-appearance: none; width: ${T}px; height: 62px; }
  .slider-needles__input::-moz-range-thumb { width: ${T}px; height: 62px; border: 0; }
`;

export function NeedlesSlider() {
  const [v, setV] = useState(58);
  const tx = at(v);
  const [angles, setAngles] = useState(() => XS.map((x) => aim(x, at(58))));
  const st = useRef({ a: XS.map((x) => aim(x, at(58))), w: XS.map(() => 0), raf: 0 });

  // Each needle swings round on its own loose spring, so they overshoot and wobble a little as they settle.
  useEffect(() => {
    const q = st.current;
    const goal = XS.map((x) => aim(x, tx));
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      q.a = goal;
      setAngles(goal);
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      let busy = false;
      q.a.forEach((a, i) => {
        q.w[i] += (-(110 + (i % 3) * 18) * (a - goal[i]) - 7 * q.w[i]) * dt;
        q.a[i] += q.w[i] * dt;
        if (Math.abs(q.a[i] - goal[i]) > 0.05 || Math.abs(q.w[i]) > 0.3) busy = true;
      });
      setAngles(q.a.slice());
      if (busy) q.raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(q.raf);
    q.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(q.raf);
  }, [tx]);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-needles">
        <svg className="slider-needles__svg" aria-hidden="true">
          {XS.map((x, i) => (
            <g key={x} className="slider-needles__needle" transform={`translate(${x} ${NY}) rotate(${angles[i]})`}>
              <polygon className="slider-needles__south" points="0,-3 -7,0 0,3" />
              <polygon className={`slider-needles__north${x <= tx ? ' slider-needles__north--on' : ''}`} points="0,-3 9.5,0 0,3" />
              <circle className="slider-needles__pivot" r={1.5} />
            </g>
          ))}
          <line className="slider-needles__rail" x1={T / 2} y1={TY} x2={W - T / 2} y2={TY} />
          <line className="slider-needles__fill" x1={T / 2} y1={TY} x2={tx} y2={TY} />
          <circle className="slider-needles__thumb" cx={tx} cy={TY} r={T / 2} />
          <circle className="slider-needles__core" cx={tx} cy={TY} r={2.5} />
          <circle className="slider-needles__ring" cx={tx} cy={TY} r={T / 2 + 4} />
        </svg>
        <p className="slider-needles__value" aria-hidden="true">
          <span>Field</span>
          <b>{v}%</b>
        </p>
        <input
          className="slider-needles__input"
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => setV(+e.target.value)}
          aria-label="Field strength"
          aria-valuetext={`${v}%`}
        />
      </div>
    </>
  );
}
