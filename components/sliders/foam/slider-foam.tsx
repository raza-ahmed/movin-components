"use client";

import { useEffect, useId, useRef, useState } from 'react';

const W = 240;
const N = 121;
const TOP = 30;
const BOT = 50;
const T = 18;
const SIGMA = 9;
const at = (v: number) => 10 + (v / 100) * (W - 20);
const dentAt = (i: number, x: number, depth: number) => depth * Math.exp(-((i * 2 - x) ** 2) / (2 * SIGMA * SIGMA));

const css = `
  .slider-foam { position: relative; width: ${W}px; height: 76px; }
  .slider-foam__svg { position: absolute; left: 0; top: 0; width: ${W}px; height: 54px; overflow: visible; }
  .slider-foam__base { fill: light-dark(#dbdde1, #2e3035); }
  .slider-foam__pore { fill: light-dark(#cbced3, #393c41); }
  .slider-foam__base--on { fill: light-dark(#5f626a, #a7abb2); }
  .slider-foam__pore--on { fill: light-dark(#50535b, #c6c8cd); }
  .slider-foam__puck { fill: light-dark(#373a40, #f1f2f3); }
  .slider-foam__ring { fill: none; stroke: transparent; stroke-width: 2; }
  .slider-foam:has(.slider-foam__input:focus-visible) .slider-foam__ring { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-foam__value { position: absolute; left: 0; right: 0; top: 58px; display: flex; justify-content: space-between; margin: 0; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-foam__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-foam__input { position: absolute; left: 0; top: 0; width: 100%; height: 54px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-foam__input::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 54px; }
  .slider-foam__input::-moz-range-thumb { width: 20px; height: 54px; border: 0; }
`;

export function FoamSlider() {
  const [v, setV] = useState(44);
  const [, setFrame] = useState(0);
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const st = useRef({ x: at(44), vx: 0, goal: at(44), held: false, raf: 0, on: false, mem: Array.from({ length: N }, (_, i) => dentAt(i, at(44), 5)) });

  // Memory foam: the dent under the puck is pressed in at once, but where the puck has been it creeps back up.
  const kick = () => {
    const q = st.current;
    if (q.on) return;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    q.on = true;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      if (still) {
        q.x = q.goal;
        q.vx = 0;
      } else {
        q.vx += (-160 * (q.x - q.goal) - 24 * q.vx) * dt;
        q.x += q.vx * dt;
      }
      const depth = q.held ? 8 : 5;
      const fade = still ? 0 : Math.exp(-dt / 0.8);
      let busy = Math.abs(q.x - q.goal) > 0.05 || Math.abs(q.vx) > 0.5;
      for (let i = 0; i < N; i++) {
        const dent = dentAt(i, q.x, depth);
        q.mem[i] = Math.max(dent, q.mem[i] * fade);
        if (q.mem[i] - dent > 0.03) busy = true;
      }
      setFrame((f) => f + 1);
      if (busy) q.raf = requestAnimationFrame(step);
      else q.on = false;
    };
    q.raf = requestAnimationFrame(step);
  };
  useEffect(() => {
    st.current.goal = at(v);
    kick();
  }, [v]);
  useEffect(() => () => cancelAnimationFrame(st.current.raf), []);

  const q = st.current;
  let surface = `M 0 ${TOP + q.mem[0]}`;
  for (let i = 1; i < N; i++) surface += ` L ${i * 2} ${(TOP + q.mem[i]).toFixed(2)}`;
  surface += ` L ${W} ${BOT} L 0 ${BOT} Z`;
  const sink = q.mem[Math.round(Math.min(W, Math.max(0, q.x)) / 2)];
  const hold = (held: boolean) => {
    q.held = held;
    kick();
  };

  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-foam">
        <svg className="slider-foam__svg" aria-hidden="true">
          <defs>
            <pattern id={`${id}a`} patternUnits="userSpaceOnUse" width={6} height={6}>
              <rect className="slider-foam__base" width={6} height={6} />
              <circle className="slider-foam__pore" cx={1.5} cy={1.5} r={0.9} />
              <circle className="slider-foam__pore" cx={4.5} cy={4.5} r={0.7} />
            </pattern>
            <pattern id={`${id}b`} patternUnits="userSpaceOnUse" width={6} height={6}>
              <rect className="slider-foam__base--on" width={6} height={6} />
              <circle className="slider-foam__pore--on" cx={1.5} cy={1.5} r={0.9} />
              <circle className="slider-foam__pore--on" cx={4.5} cy={4.5} r={0.7} />
            </pattern>
            <clipPath id={`${id}c`}>
              <rect x={1} y={TOP - 2} width={W - 2} height={BOT - TOP + 2} rx={10} />
            </clipPath>
            <clipPath id={`${id}d`}>
              <rect x={0} y={0} width={q.x} height={54} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${id}c)`}>
            <path className="slider-foam__surface" d={surface} fill={`url(#${id}a)`} />
            <path className="slider-foam__surface slider-foam__surface--on" d={surface} fill={`url(#${id}b)`} clipPath={`url(#${id}d)`} />
          </g>
          <circle className="slider-foam__puck" cx={q.x} cy={TOP + sink - T / 2 + 1} r={T / 2} />
          <circle className="slider-foam__ring" cx={q.x} cy={TOP + sink - T / 2 + 1} r={T / 2 + 4} />
        </svg>
        <p className="slider-foam__value" aria-hidden="true">
          <span>Softness</span>
          <b>{v}%</b>
        </p>
        <input
          className="slider-foam__input"
          type="range"
          min={0}
          max={100}
          value={v}
          onPointerDown={() => hold(true)}
          onPointerUp={() => hold(false)}
          onPointerCancel={() => hold(false)}
          onChange={(e) => setV(+e.target.value)}
          aria-label="Softness"
          aria-valuetext={`${v}%`}
        />
      </div>
    </>
  );
}
