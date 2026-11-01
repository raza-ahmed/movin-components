"use client";

import { useEffect, useId, useRef, useState } from 'react';

const W = 240;
const TOP = 18;
const BOT = 40;
const MIDY = (TOP + BOT) / 2;
const at = (v: number) => 12 + (v / 100) * (W - 24);

const css = `
  .slider-slosh { position: relative; width: ${W}px; height: 76px; }
  .slider-slosh__svg { position: absolute; left: 0; top: 0; width: ${W}px; height: 56px; overflow: visible; }
  .slider-slosh__tube { fill: light-dark(#ebedf0, #232529); stroke: light-dark(#cbced3, #393c41); stroke-width: 1.5; }
  .slider-slosh__liquid { fill: light-dark(#50535b, #c6c8cd); }
  .slider-slosh__shine { stroke: light-dark(#373a40, #f1f2f3); stroke-width: 1.5; stroke-linecap: round; opacity: 0.35; }
  .slider-slosh__mark { fill: light-dark(#373a40, #f1f2f3); }
  .slider-slosh__ring { fill: none; stroke: transparent; stroke-width: 2; }
  .slider-slosh:has(.slider-slosh__input:focus-visible) .slider-slosh__ring { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-slosh__value { position: absolute; left: 0; right: 0; top: 58px; display: flex; justify-content: space-between; margin: 0; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-slosh__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-slosh__input { position: absolute; left: 0; top: 0; width: 100%; height: 56px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-slosh__input::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 56px; }
  .slider-slosh__input::-moz-range-thumb { width: 24px; height: 56px; border: 0; }
`;

export function SloshSlider() {
  const [v, setV] = useState(58);
  const [s, setS] = useState({ x: at(58), lean: 0 });
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const st = useRef({ x: at(58), vx: 0, lean: 0, vl: 0, raf: 0 });

  // The front follows on a spring. The liquid's face lags behind its speed and swings past
  // upright once it stops, on a looser spring of its own: that swing is the slosh.
  useEffect(() => {
    const q = st.current;
    const goal = at(v);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Object.assign(q, { x: goal, vx: 0, lean: 0, vl: 0 });
      setS({ x: goal, lean: 0 });
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      q.vx += (-170 * (q.x - goal) - 22 * q.vx) * dt;
      q.x += q.vx * dt;
      const want = Math.max(-9, Math.min(9, -q.vx * 0.035));
      q.vl += (-260 * (q.lean - want) - 6 * q.vl) * dt;
      q.lean += q.vl * dt;
      setS({ x: q.x, lean: q.lean });
      if (Math.abs(q.x - goal) < 0.05 && Math.abs(q.vx) < 0.5 && Math.abs(q.lean) < 0.05 && Math.abs(q.vl) < 0.5) {
        Object.assign(q, { x: goal, vx: 0, lean: 0, vl: 0 });
        setS({ x: goal, lean: 0 });
        return;
      }
      q.raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(q.raf);
    q.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(q.raf);
  }, [v]);

  const { x, lean } = s;
  const liquid = `M 0 ${TOP} L ${x + lean} ${TOP} Q ${x + 3 + Math.abs(lean) * 0.4} ${MIDY} ${x - lean} ${BOT} L 0 ${BOT} Z`;

  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-slosh">
        <svg className="slider-slosh__svg" aria-hidden="true">
          <defs>
            <clipPath id={`${id}c`}>
              <rect x={4} y={TOP} width={W - 8} height={BOT - TOP} rx={(BOT - TOP) / 2} />
            </clipPath>
          </defs>
          <rect className="slider-slosh__tube" x={3.25} y={TOP - 0.75} width={W - 6.5} height={BOT - TOP + 1.5} rx={(BOT - TOP) / 2 + 0.75} />
          <g clipPath={`url(#${id}c)`}>
            <path className="slider-slosh__liquid" d={liquid} />
            <line className="slider-slosh__shine" x1={12} y1={TOP + 4} x2={Math.max(12, x + lean - 5)} y2={TOP + 4} />
          </g>
          <polygon className="slider-slosh__mark" points={`${x - 5},${TOP - 10} ${x + 5},${TOP - 10} ${x},${TOP - 4}`} />
          <polygon className="slider-slosh__mark" points={`${x - 5},${BOT + 10} ${x + 5},${BOT + 10} ${x},${BOT + 4}`} />
          <rect className="slider-slosh__ring" x={x - 10} y={TOP - 14} width={20} height={BOT - TOP + 28} rx={7} />
        </svg>
        <p className="slider-slosh__value" aria-hidden="true">
          <span>Fill</span>
          <b>{v}%</b>
        </p>
        <input className="slider-slosh__input" type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} aria-label="Fill" aria-valuetext={`${v}%`} />
      </div>
    </>
  );
}
