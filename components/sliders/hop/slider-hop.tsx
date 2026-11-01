"use client";

import { useEffect, useRef, useState } from 'react';

const W = 240;
const N = 10;
const T = 16;
const Y = 52;
const at = (k: number) => T / 2 + (k / N) * (W - T);

type Trace = { id: number; d: string };

const css = `
  .slider-hop { position: relative; width: ${W}px; height: 86px; }
  .slider-hop__svg { position: absolute; left: 0; top: 0; width: ${W}px; height: 64px; overflow: visible; }
  .slider-hop__line { stroke: light-dark(#ebedf0, #232529); stroke-width: 2; stroke-linecap: round; }
  .slider-hop__dot { fill: light-dark(#dbdde1, #2e3035); transition: fill 0.2s; }
  .slider-hop__dot--on { fill: light-dark(#50535b, #c6c8cd); }
  .slider-hop__trace { fill: none; stroke: light-dark(#5f626a, #a7abb2); stroke-width: 1.5; stroke-linecap: round; stroke-dasharray: 0.5 4; animation: slider-hop-fade 0.9s ease-out forwards; }
  @keyframes slider-hop-fade { from { opacity: 0.8; } to { opacity: 0; } }
  .slider-hop__thumb { position: absolute; left: 0; top: 0; width: ${T}px; height: ${T}px; }
  .slider-hop__body { display: block; width: 100%; height: 100%; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); transform-origin: 50% 100%; box-shadow: 0 2px 5px light-dark(rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0.5)); }
  .slider-hop__body--land { animation: slider-hop-land 0.32s cubic-bezier(0.3, 1.4, 0.5, 1); }
  @keyframes slider-hop-land {
    0% { transform: scale(1.3, 0.65); }
    100% { transform: none; }
  }
  .slider-hop:has(.slider-hop__input:focus-visible) .slider-hop__body { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-hop__value { position: absolute; left: 0; right: 0; top: 68px; display: flex; justify-content: space-between; margin: 0; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-hop__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-hop__input { position: absolute; left: 0; top: ${Y - 22}px; width: 100%; height: 44px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-hop__input::-webkit-slider-thumb { -webkit-appearance: none; width: ${T}px; height: 44px; }
  .slider-hop__input::-moz-range-thumb { width: ${T}px; height: 44px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-hop__body--land { animation: none; }
  }
`;

export function HopSlider() {
  const [k, setK] = useState(6);
  const [pos, setPos] = useState({ x: at(6), y: 0 });
  const [land, setLand] = useState(0);
  const [traces, setTraces] = useState<Trace[]>([]);
  const hop = useRef({ x: at(6), y: 0, x0: 0, y0: 0, x1: 0, h: 0, t0: 0, dur: 1, raf: 0, id: 0 });

  // Each new step starts a hop from wherever the thumb is, even mid-air, so a fast drag chains hops together.
  const jump = (to: number) => {
    const q = hop.current;
    cancelAnimationFrame(q.raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      q.x = at(to);
      q.y = 0;
      setPos({ x: q.x, y: 0 });
      return;
    }
    const dist = Math.abs(at(to) - q.x);
    Object.assign(q, { x0: q.x, y0: q.y, x1: at(to), h: Math.min(30, 8 + dist * 0.3), t0: performance.now(), dur: 200 + Math.min(240, dist * 2) });
    // The same parabola as a quadratic Bezier, left behind as a dotted trace.
    const d = `M ${q.x0} ${Y + q.y0} Q ${(q.x0 + q.x1) / 2} ${Y + (q.y0 - 4 * q.h) / 2} ${q.x1} ${Y}`;
    const id = ++q.id;
    setTraces((ts) => [...ts.slice(-3), { id, d }]);
    const step = (now: number) => {
      const e = Math.min(1, (now - q.t0) / q.dur);
      q.x = q.x0 + (q.x1 - q.x0) * e;
      q.y = q.y0 * (1 - e) - 4 * q.h * e * (1 - e);
      setPos({ x: q.x, y: q.y });
      if (e < 1) q.raf = requestAnimationFrame(step);
      else setLand((n) => n + 1);
    };
    q.raf = requestAnimationFrame(step);
  };
  useEffect(() => () => cancelAnimationFrame(hop.current.raf), []);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-hop">
        <svg className="slider-hop__svg" aria-hidden="true">
          <line className="slider-hop__line" x1={T / 2} y1={Y} x2={W - T / 2} y2={Y} />
          {Array.from({ length: N + 1 }, (_, i) => (
            <circle key={i} className={`slider-hop__dot${i <= k ? ' slider-hop__dot--on' : ''}`} cx={at(i)} cy={Y} r={3} />
          ))}
          {traces.map((t) => (
            <path key={t.id} className="slider-hop__trace" d={t.d} onAnimationEnd={() => setTraces((ts) => ts.filter((o) => o.id !== t.id))} />
          ))}
        </svg>
        <span className="slider-hop__thumb" style={{ transform: `translate(${pos.x - T / 2}px, ${Y - T / 2 + pos.y}px)` }} aria-hidden="true">
          <span key={land} className={`slider-hop__body${land ? ' slider-hop__body--land' : ''}`} />
        </span>
        <p className="slider-hop__value" aria-hidden="true">
          <span>Level</span>
          <b>
            {k} / {N}
          </b>
        </p>
        <input
          className="slider-hop__input"
          type="range"
          min={0}
          max={N}
          value={k}
          onChange={(e) => {
            setK(+e.target.value);
            jump(+e.target.value);
          }}
          aria-label="Level"
          aria-valuetext={`${k} of ${N}`}
        />
      </div>
    </>
  );
}
