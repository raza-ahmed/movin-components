"use client";

import { useEffect, useId, useRef, useState } from 'react';

const W = 240;
const G = 42;
const TICKS = Array.from({ length: 21 }, (_, i) => 10 + i * 11);
const at = (v: number) => 8 + (v / 100) * (W - 16);

const css = `
  .slider-cast { position: relative; width: ${W}px; height: 76px; --slider-cast-shadow: light-dark(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)); }
  .slider-cast__svg { position: absolute; left: 0; top: 0; width: ${W}px; height: 56px; overflow: visible; }
  .slider-cast__ground { fill: light-dark(#ebedf0, #232529); }
  .slider-cast__lit { fill: light-dark(#cbced3, #393c41); }
  .slider-cast__shadow { stroke: var(--slider-cast-shadow); stroke-width: 2.4; stroke-linecap: round; }
  .slider-cast__tick { stroke: light-dark(#50535b, #c6c8cd); stroke-width: 1.6; stroke-linecap: round; }
  .slider-cast__post { stroke: light-dark(#5f626a, #a7abb2); stroke-width: 2; stroke-linecap: round; }
  .slider-cast__bulb { fill: light-dark(#373a40, #f1f2f3); }
  .slider-cast__glow { stop-color: light-dark(#373a40, #f1f2f3); }
  .slider-cast__ring { fill: none; stroke: transparent; stroke-width: 2; }
  .slider-cast:has(.slider-cast__input:focus-visible) .slider-cast__ring { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-cast__value { position: absolute; left: 0; right: 0; top: 58px; display: flex; justify-content: space-between; margin: 0; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-cast__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-cast__input { position: absolute; left: 0; top: 0; width: 100%; height: 56px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-cast__input::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 56px; }
  .slider-cast__input::-moz-range-thumb { width: 16px; height: 56px; border: 0; }
`;

export function CastSlider() {
  const [v, setV] = useState(62);
  const [lx, setLx] = useState(at(62));
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const st = useRef({ x: at(62), v: 0, raf: 0 });

  // The lamp follows the value on a spring, so the shadows swing round rather than jump.
  useEffect(() => {
    const q = st.current;
    const target = at(v);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      q.x = target;
      setLx(target);
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      q.v += (-200 * (q.x - target) - 26 * q.v) * dt;
      q.x += q.v * dt;
      if (Math.abs(q.x - target) < 0.05 && Math.abs(q.v) < 0.5) {
        q.x = target;
        q.v = 0;
        setLx(target);
        return;
      }
      setLx(q.x);
      q.raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(q.raf);
    q.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(q.raf);
  }, [v]);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-cast">
        <svg className="slider-cast__svg" aria-hidden="true">
          <defs>
            <radialGradient id={`${id}g`}>
              <stop className="slider-cast__glow" offset="0" stopOpacity={0.3} />
              <stop className="slider-cast__glow" offset="1" stopOpacity={0} />
            </radialGradient>
            <clipPath id={`${id}k`}>
              <rect x={0} y={G - 3} width={W} height={11} rx={5.5} />
            </clipPath>
          </defs>
          <rect className="slider-cast__ground" x={0} y={G - 3} width={W} height={11} rx={5.5} />
          <rect className="slider-cast__lit" x={0} y={G - 3} width={lx} height={11} rx={5.5} />
          <ellipse className="slider-cast__pool" cx={lx} cy={G + 2} rx={40} ry={7} fill={`url(#${id}g)`} />
          {/* Each tick throws its shadow away from the lamp: longer the further off it stands. */}
          <g clipPath={`url(#${id}k)`}>
            {TICKS.map((tx, i) => {
              const d = tx - lx;
              const L = Math.min(48, Math.abs(d) * (i % 5 === 0 ? 0.42 : 0.3));
              return (
                <line
                  key={tx}
                  className="slider-cast__shadow"
                  x1={tx}
                  y1={G}
                  x2={tx + Math.sign(d) * L}
                  y2={G + Math.min(5, L * 0.25)}
                  opacity={Math.max(0.15, 1 - Math.abs(d) / 220)}
                />
              );
            })}
          </g>
          {TICKS.map((tx, i) => (
            <line key={tx} className="slider-cast__tick" x1={tx} y1={G} x2={tx} y2={G - (i % 5 === 0 ? 12 : 8)} opacity={0.45 + 0.55 * Math.max(0, 1 - Math.abs(tx - lx) / 110)} />
          ))}
          <circle className="slider-cast__aura" cx={lx} cy={G - 21} r={26} fill={`url(#${id}g)`} />
          <line className="slider-cast__post" x1={lx} y1={G + 1} x2={lx} y2={G - 16} />
          <circle className="slider-cast__bulb" cx={lx} cy={G - 21} r={5} />
          <circle className="slider-cast__ring" cx={lx} cy={G - 21} r={9} />
        </svg>
        <p className="slider-cast__value" aria-hidden="true">
          <span>Light</span>
          <b>{v}%</b>
        </p>
        <input className="slider-cast__input" type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} aria-label="Light" aria-valuetext={`${v}%`} />
      </div>
    </>
  );
}
