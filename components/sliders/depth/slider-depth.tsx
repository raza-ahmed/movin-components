"use client";

import { useEffect, useRef, useState } from 'react';

const W = 240;
const T = 18;
const Y = 20;
const LABELS = Array.from({ length: 11 }, (_, i) => i * 10);
const at = (v: number) => T / 2 + (v / 100) * (W - T);

const css = `
  .slider-depth { position: relative; width: ${W}px; height: 86px; }
  .slider-depth__rail, .slider-depth__fill { position: absolute; left: 0; top: ${Y - 1.5}px; height: 3px; border-radius: 2px; }
  .slider-depth__rail { width: ${W}px; background: light-dark(#ebedf0, #232529); }
  .slider-depth__fill { background: light-dark(#50535b, #c6c8cd); }
  .slider-depth__num { position: absolute; top: ${Y + 16}px; font-size: 12px; font-weight: 500; color: light-dark(#373a40, #f1f2f3); font-variant-numeric: tabular-nums; white-space: nowrap; }
  .slider-depth__af { position: absolute; top: ${Y - T / 2}px; width: ${T}px; height: ${T}px; margin-left: ${-T / 2}px; overflow: visible; }
  .slider-depth__corner { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2; stroke-linecap: round; }
  .slider-depth__dot { fill: light-dark(#373a40, #f1f2f3); }
  .slider-depth:has(.slider-depth__input:focus-visible) .slider-depth__af { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 4px; border-radius: 3px; }
  .slider-depth__value { position: absolute; left: 0; right: 0; top: ${Y + 46}px; display: flex; justify-content: space-between; margin: 0; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-depth__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-depth__input { position: absolute; left: 0; top: ${Y - 18}px; width: 100%; height: 36px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-depth__input::-webkit-slider-thumb { -webkit-appearance: none; width: ${T}px; height: 36px; }
  .slider-depth__input::-moz-range-thumb { width: ${T}px; height: 36px; border: 0; }
`;

export function DepthSlider() {
  const [v, setV] = useState(40);
  const [fx, setFx] = useState(at(40));
  const st = useRef({ x: at(40), v: 0, raf: 0 });

  // The plane of focus trails the thumb on a soft spring and hunts past it a little, like a lens.
  useEffect(() => {
    const q = st.current;
    const goal = at(v);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      q.x = goal;
      setFx(goal);
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      q.v += (-90 * (q.x - goal) - 12 * q.v) * dt;
      q.x += q.v * dt;
      if (Math.abs(q.x - goal) < 0.05 && Math.abs(q.v) < 0.5) {
        q.x = goal;
        q.v = 0;
        setFx(goal);
        return;
      }
      setFx(q.x);
      q.raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(q.raf);
    q.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(q.raf);
  }, [v]);

  const x = at(v);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-depth">
        <span className="slider-depth__rail" aria-hidden="true" />
        <span className="slider-depth__fill" style={{ width: x }} aria-hidden="true" />
        {LABELS.map((n) => {
          const dist = Math.abs(at(n) - fx);
          return (
            <span
              key={n}
              className="slider-depth__num"
              style={{
                left: at(n),
                transform: `translateX(-50%) scale(${1.25 - Math.min(0.4, dist / 110)})`,
                filter: `blur(${Math.min(3.2, (dist / 22) ** 1.3 * 0.9).toFixed(2)}px)`,
                opacity: 1 - Math.min(0.55, dist / 140),
              }}
              aria-hidden="true"
            >
              {n}
            </span>
          );
        })}
        <svg className="slider-depth__af" style={{ left: x }} viewBox="0 0 18 18" aria-hidden="true">
          <path className="slider-depth__corner" d="M1 6V1h5M12 1h5v5M17 12v5h-5M6 17H1v-5" />
          <circle className="slider-depth__dot" cx={9} cy={9} r={2} />
        </svg>
        <p className="slider-depth__value" aria-hidden="true">
          <span>Focus</span>
          <b>{v}%</b>
        </p>
        <input className="slider-depth__input" type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} aria-label="Focus" aria-valuetext={`${v}%`} />
      </div>
    </>
  );
}
