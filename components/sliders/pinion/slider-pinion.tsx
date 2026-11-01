"use client";

import { useEffect, useId, useRef, useState } from 'react';

const W = 240;
const R = 12;
const N = 12;
const PITCH = (2 * Math.PI * R) / N;
const C = 22;
const PL = C + R;
const X0 = 16;
const X1 = W - 16;
const at = (v: number) => X0 + (v / 100) * (X1 - X0);

const polar = (r: number, a: number) => `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
// Twelve teeth on a 12px pitch circle; at rest one points straight down into a gap in the rack.
const GEAR = (() => {
  const a = (2 * Math.PI) / N;
  let d = '';
  for (let i = 0; i < N; i++) {
    const c = i * a;
    d += `${i ? 'L' : 'M'} ${polar(R - 2.6, c - 0.3 * a)} L ${polar(R + 2.6, c - 0.14 * a)} L ${polar(R + 2.6, c + 0.14 * a)} L ${polar(R - 2.6, c + 0.3 * a)} `;
  }
  return `${d}Z`;
})();
// Rack teeth on the same pitch, so the gear meshes as it rolls.
const RACK = (() => {
  let d = `M 4 ${PL + 2.6}`;
  for (let k = -3; ; k++) {
    const cx = X0 + (k + 0.5) * PITCH;
    if (cx - 0.3 * PITCH < 4) continue;
    if (cx + 0.3 * PITCH > W - 4) break;
    d += ` L ${cx - 0.3 * PITCH} ${PL + 2.6} L ${cx - 0.14 * PITCH} ${PL - 2.6} L ${cx + 0.14 * PITCH} ${PL - 2.6} L ${cx + 0.3 * PITCH} ${PL + 2.6}`;
  }
  return `${d} L ${W - 4} ${PL + 2.6} L ${W - 4} ${PL + 9} L 4 ${PL + 9} Z`;
})();

const css = `
  .slider-pinion { position: relative; width: ${W}px; height: 72px; }
  .slider-pinion__svg { position: absolute; left: 0; top: 0; width: ${W}px; height: 50px; overflow: visible; }
  .slider-pinion__rack--done { fill: light-dark(#50535b, #c6c8cd); }
  .slider-pinion__rack--left { fill: light-dark(#cbced3, #393c41); }
  .slider-pinion__gear { fill: light-dark(#373a40, #f1f2f3); }
  .slider-pinion__hole { fill: light-dark(#fbfcfd, #121417); }
  .slider-pinion__ring { fill: none; stroke: transparent; stroke-width: 2; }
  .slider-pinion:has(.slider-pinion__input:focus-visible) .slider-pinion__ring { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-pinion__value { position: absolute; left: 0; right: 0; top: 54px; display: flex; justify-content: space-between; margin: 0; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-pinion__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-pinion__input { position: absolute; left: ${X0 - 14}px; top: 0; width: ${X1 - X0 + 28}px; height: 50px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-pinion__input::-webkit-slider-thumb { -webkit-appearance: none; width: 28px; height: 50px; }
  .slider-pinion__input::-moz-range-thumb { width: 28px; height: 50px; border: 0; }
`;

export function PinionSlider() {
  const [v, setV] = useState(40);
  const [x, setX] = useState(at(40));
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const st = useRef({ x: at(40), v: 0, raf: 0 });

  useEffect(() => {
    const q = st.current;
    const target = at(v);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      q.x = target;
      setX(target);
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      q.v += (-220 * (q.x - target) - 26 * q.v) * dt;
      q.x += q.v * dt;
      if (Math.abs(q.x - target) < 0.05 && Math.abs(q.v) < 0.5) {
        q.x = target;
        q.v = 0;
        setX(target);
        return;
      }
      setX(q.x);
      q.raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(q.raf);
    q.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(q.raf);
  }, [v]);

  // Rolling without slip: the gear turns by the distance travelled over its pitch radius.
  const turn = (((x - X0) / R) * 180) / Math.PI;

  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-pinion">
        <svg className="slider-pinion__svg" aria-hidden="true">
          <defs>
            <clipPath id={`${id}l`}>
              <rect x={0} y={0} width={x} height={50} />
            </clipPath>
            <clipPath id={`${id}r`}>
              <rect x={x} y={0} width={W} height={50} />
            </clipPath>
          </defs>
          <path className="slider-pinion__rack--done" d={RACK} clipPath={`url(#${id}l)`} />
          <path className="slider-pinion__rack--left" d={RACK} clipPath={`url(#${id}r)`} />
          <g className="slider-pinion__wheel" transform={`translate(${x} ${C}) rotate(${turn})`}>
            <path className="slider-pinion__gear" d={GEAR} />
            <circle className="slider-pinion__hole" r={3.2} />
            {[45, 135, 225, 315].map((a) => (
              <circle key={a} className="slider-pinion__hole" cx={6.4 * Math.cos((a * Math.PI) / 180)} cy={6.4 * Math.sin((a * Math.PI) / 180)} r={1.8} />
            ))}
          </g>
          <circle className="slider-pinion__ring" cx={x} cy={C} r={R + 6} />
        </svg>
        <p className="slider-pinion__value" aria-hidden="true">
          <span>Travel</span>
          <b>{v} mm</b>
        </p>
        <input
          className="slider-pinion__input"
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => setV(+e.target.value)}
          aria-label="Travel"
          aria-valuetext={`${v} millimetres`}
        />
      </div>
    </>
  );
}
