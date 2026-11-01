"use client";

import { useEffect, useRef, useState } from 'react';

const W = 240;
const MID = 22;
const H = 18;
const REST = 16;
// Torn ends: a short zigzag rather than a clean cut.
const tear = (x: number, y0: number, y1: number, dir: 1 | -1) => Array.from({ length: 7 }, (_, i) => `${x + dir * (i % 2 ? 2.2 : 0)},${y0 + (i * (y1 - y0)) / 6}`).join('L');

const css = `
  .slider-peel { position: relative; width: ${W}px; height: 62px; }
  .slider-peel__svg { display: block; width: ${W}px; height: 44px; overflow: visible; }
  .slider-peel__track { fill: light-dark(#f3f4f7, #1a1c1f); stroke: light-dark(#ebedf0, #232529); stroke-width: 1; }
  .slider-peel__tape { fill: color-mix(in oklab, light-dark(#5f626a, #a7abb2) 55%, transparent); }
  .slider-peel__crepe { stroke: light-dark(#50535b, #c6c8cd); stroke-width: 0.5; }
  /* Folded back, the sticky side faces up: lighter, smoother, and lifted off the tape on a shadow. */
  /* Lighter than the laid tape in both themes: the sticky side catches the light. */
  .slider-peel__flap { fill: light-dark(light-dark(#cbced3, #393c41), color-mix(in oklab, light-dark(#50535b, #c6c8cd) 70%, light-dark(#6d7179, #7d8087))); }
  .slider-peel__fold { stop-color: light-dark(#373a40, #f1f2f3); }
  .slider-peel__shade { stop-color: light-dark(#cbced3, #393c41); }
  .slider-peel__crease { stroke: light-dark(#373a40, #f1f2f3); stroke-width: 1; opacity: 0.7; }
  .slider-peel__ring { fill: none; stroke: transparent; stroke-width: 2; }
  .slider-peel:has(.slider-peel__input:focus-visible) .slider-peel__ring { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-peel__value { position: absolute; left: 0; right: 0; top: 44px; display: flex; justify-content: space-between; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-peel__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-peel__input { position: absolute; left: 0; top: 0; width: 100%; height: 44px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-peel__input::-webkit-slider-thumb { -webkit-appearance: none; width: 28px; height: 44px; }
  .slider-peel__input::-moz-range-thumb { width: 28px; height: 44px; border: 0; }
`;

/** The fold trails the value, and its speed decides how far the flap lifts: pulling back peels a longer flap. */
function useFold(target: number) {
  const [s, setS] = useState({ x: target, lift: 0 });
  const st = useRef({ x: target, v: 0, lift: 0, lv: 0, raf: 0 });
  useEffect(() => {
    const q = st.current;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Object.assign(q, { x: target, v: 0, lift: 0, lv: 0 });
      setS({ x: target, lift: 0 });
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      q.v += (-260 * (q.x - target) - 30 * q.v) * dt;
      q.x += q.v * dt;
      // Pulling back (negative speed) lifts the flap; pressing forward lays it flatter.
      const want = Math.max(-6, Math.min(26, -q.v * 0.07));
      q.lv += (-240 * (q.lift - want) - 16 * q.lv) * dt;
      q.lift += q.lv * dt;
      if (Math.abs(q.x - target) < 0.05 && Math.abs(q.v) < 1 && Math.abs(q.lift) < 0.05 && Math.abs(q.lv) < 0.5) {
        Object.assign(q, { x: target, v: 0, lift: 0, lv: 0 });
        setS({ x: target, lift: 0 });
        return;
      }
      setS({ x: q.x, lift: q.lift });
      q.raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(q.raf);
    q.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(q.raf);
  }, [target]);
  return s;
}

export function PeelSlider() {
  const [v, setV] = useState(70);
  const { x, lift } = useFold(28 + (v / 100) * (W - 30));
  // The flap is the tape folded back over itself from the fold at x; its free end is what you hold.
  const flap = Math.max(4, Math.min(x - 3, REST + lift));
  const end = x - flap;
  const top = MID - H / 2 - 1.5;
  const bot = MID + H / 2 + 1.5;
  const flapPath = `M${x - 4},${top}Q${x},${top} ${x},${top + 4}L${x},${bot - 4}Q${x},${bot} ${x - 4},${bot}L${tear(end, bot, top, 1)}Z`;
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-peel">
        <svg className="slider-peel__svg" aria-hidden="true">
          <defs>
            {/* Bright where it rounds over the fold, falling into shade along the flap towards its free end. */}
            <linearGradient id="slider-peel-fold" x1="1" y1="0" x2="0" y2="0">
              <stop className="slider-peel__fold" offset="0" stopOpacity="0.6" />
              <stop className="slider-peel__fold" offset="0.18" stopOpacity="0" />
              <stop className="slider-peel__shade" offset="1" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          <rect className="slider-peel__track" x={0.5} y={MID - H / 2 - 3} width={W - 1} height={H + 6} rx={6} />
          <path className="slider-peel__tape" d={`M${tear(3, MID - H / 2, MID + H / 2, -1)}L${x},${MID + H / 2}L${x},${MID - H / 2}Z`} />
          {/* Crepe paper: faint, uneven creases across the strip. */}
          {Array.from({ length: Math.max(0, Math.floor((x - 6) / 3.5)) }, (_, i) => (
            <line
              key={i}
              className="slider-peel__crepe"
              x1={6 + i * 3.5}
              x2={6.6 + i * 3.5}
              y1={MID - H / 2 + 1}
              y2={MID + H / 2 - 1}
              style={{ opacity: [0.22, 0.1, 0.16, 0.07, 0.13][i % 5] }}
            />
          ))}
          {/* Folded back, the flap is a little wider than the tape and its torn end lifts off the surface. */}
          <path
            className="slider-peel__flap"
            d={flapPath}
            style={{
              filter: `drop-shadow(${-2 - lift * 0.15}px ${2.5 + Math.max(0, lift) * 0.12}px ${2.5 + Math.max(0, lift) * 0.1}px light-dark(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.7)))`,
            }}
          />
          <path d={flapPath} fill="url(#slider-peel-fold)" />
          <line className="slider-peel__crease" x1={x - 0.5} x2={x - 0.5} y1={top + 1} y2={bot - 1} />
          <rect className="slider-peel__ring" x={end - 4} y={top - 4} width={flap + 8} height={bot - top + 8} rx={6} />
        </svg>
        <p className="slider-peel__value" aria-hidden="true">
          <span>Coverage</span>
          <b>{v}%</b>
        </p>
        <input className="slider-peel__input" type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} aria-label="Coverage" aria-valuetext={`${v}%`} />
      </div>
    </>
  );
}
