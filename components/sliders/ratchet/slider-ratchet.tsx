"use client";

import { useEffect, useId, useRef, useState } from 'react';

const W = 240;
const N = 20;
const P = 10.8;
const X0 = 12;
const BASE = 46;
const H = 6;
const at = (k: number) => X0 + k * P + 1.5;
// The tooth profile: a ramp rising to the right, then a sheer drop.
const surf = (x: number) => (x < X0 || x >= X0 + N * P ? BASE : BASE - (H * ((x - X0) % P)) / P);
const TEETH = (() => {
  let d = `M 4 ${BASE} L ${X0} ${BASE}`;
  for (let k = 0; k < N; k++) d += ` L ${X0 + (k + 1) * P} ${BASE - H} L ${X0 + (k + 1) * P} ${BASE}`;
  return `${d} L ${W - 4} ${BASE} L ${W - 4} ${BASE + 7} L 4 ${BASE + 7} Z`;
})();

type Click = { id: number; x: number };

const css = `
  .slider-ratchet { position: relative; width: ${W}px; height: 80px; }
  .slider-ratchet__svg { position: absolute; left: 0; top: 0; width: ${W}px; height: 56px; overflow: visible; }
  .slider-ratchet__teeth--done { fill: light-dark(#50535b, #c6c8cd); }
  .slider-ratchet__teeth--left { fill: light-dark(#dbdde1, #2e3035); }
  .slider-ratchet__block { fill: light-dark(#373a40, #f1f2f3); }
  .slider-ratchet__pawl { stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2.6; stroke-linecap: round; }
  .slider-ratchet__pin { fill: light-dark(#fbfcfd, #121417); }
  .slider-ratchet__click { stroke: light-dark(#373a40, #f1f2f3); stroke-width: 1.5; stroke-linecap: round; animation: slider-ratchet-click 0.3s ease-out forwards; }
  @keyframes slider-ratchet-click {
    from { opacity: 0.9; transform: scale(0.6); }
    to { opacity: 0; transform: scale(1.4); }
  }
  .slider-ratchet__ring { fill: none; stroke: transparent; stroke-width: 2; }
  .slider-ratchet:has(.slider-ratchet__input:focus-visible) .slider-ratchet__ring { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-ratchet__value { position: absolute; left: 0; right: 0; top: 62px; display: flex; justify-content: space-between; margin: 0; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-ratchet__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-ratchet__input { position: absolute; left: ${at(0) - 10}px; top: 0; width: ${at(N) - at(0) + 20}px; height: 56px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-ratchet__input::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 56px; }
  .slider-ratchet__input::-moz-range-thumb { width: 20px; height: 56px; border: 0; }
`;

export function RatchetSlider() {
  const [k, setK] = useState(12);
  const [pos, setPos] = useState({ x: at(12), tip: surf(at(12)) });
  const [clicks, setClicks] = useState<Click[]>([]);
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const st = useRef({ x: at(12), v: 0, tip: surf(at(12)), vy: 0, raf: 0, n: 0 });

  // The block slides on a spring; the pawl tip falls under gravity but can never sink into a tooth,
  // so it rides up each ramp and drops off the far edge with a bounce.
  useEffect(() => {
    const q = st.current;
    const goal = at(k);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      q.x = goal;
      q.tip = surf(goal);
      setPos({ x: q.x, tip: q.tip });
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.02, (now - last) / 1000);
      last = now;
      q.v += (-260 * (q.x - goal) - 30 * q.v) * dt;
      q.x += q.v * dt;
      const floor = surf(q.x);
      q.vy += 2600 * dt;
      q.tip += q.vy * dt;
      if (q.tip >= floor) {
        if (q.vy > 140) {
          const c = { id: ++q.n, x: q.x };
          setClicks((cs) => [...cs.slice(-4), c]);
        }
        q.tip = floor;
        q.vy = q.vy > 140 ? -q.vy * 0.22 : 0;
      }
      setPos({ x: q.x, tip: q.tip });
      const done = Math.abs(q.x - goal) < 0.05 && Math.abs(q.v) < 0.5 && q.tip === floor && q.vy === 0;
      if (done) return;
      q.raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(q.raf);
    q.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(q.raf);
  }, [k]);

  const { x, tip } = pos;

  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-ratchet">
        <svg className="slider-ratchet__svg" aria-hidden="true">
          <defs>
            <clipPath id={`${id}l`}>
              <rect x={0} y={0} width={x} height={60} />
            </clipPath>
            <clipPath id={`${id}r`}>
              <rect x={x} y={0} width={W} height={60} />
            </clipPath>
          </defs>
          <path className="slider-ratchet__teeth--done" d={TEETH} clipPath={`url(#${id}l)`} />
          <path className="slider-ratchet__teeth--left" d={TEETH} clipPath={`url(#${id}r)`} />
          {clicks.map((c) => (
            <line
              key={c.id}
              className="slider-ratchet__click"
              x1={c.x}
              y1={BASE - 9}
              x2={c.x}
              y2={BASE - 14}
              style={{ transformOrigin: `${c.x}px ${BASE}px` }}
              onAnimationEnd={() => setClicks((cs) => cs.filter((o) => o.id !== c.id))}
            />
          ))}
          <rect className="slider-ratchet__block" x={x - 16} y={16} width={22} height={13} rx={3} />
          <line className="slider-ratchet__pawl" x1={x - 9} y1={27} x2={x} y2={tip - 1.3} />
          <circle className="slider-ratchet__pin" cx={x - 9} cy={25} r={1.6} />
          <rect className="slider-ratchet__ring" x={x - 20} y={12} width={30} height={BASE - 6} rx={6} />
        </svg>
        <p className="slider-ratchet__value" aria-hidden="true">
          <span>Clicks</span>
          <b>
            {k} / {N}
          </b>
        </p>
        <input
          className="slider-ratchet__input"
          type="range"
          min={0}
          max={N}
          value={k}
          onChange={(e) => setK(+e.target.value)}
          aria-label="Clicks"
          aria-valuetext={`${k} of ${N}`}
        />
      </div>
    </>
  );
}
