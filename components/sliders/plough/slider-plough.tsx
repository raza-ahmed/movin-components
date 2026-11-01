"use client";

import { useEffect, useId, useRef, useState } from 'react';

const W = 240;
const BED = 40;
const CUT = 45;
const BOT = 51;
const at = (v: number) => 10 + (v / 100) * (W - 20);

type Grain = { x: number; y: number; vx: number; vy: number };

const css = `
  .slider-plough { position: relative; width: ${W}px; height: 76px; }
  .slider-plough__svg { position: absolute; left: 0; top: 0; width: ${W}px; height: 56px; overflow: visible; }
  .slider-plough__sand { fill: light-dark(#cbced3, #393c41); }
  .slider-plough__grit { fill: light-dark(#6d7179, #7d8087); }
  .slider-plough__floor { fill: light-dark(#50535b, #c6c8cd); }
  .slider-plough__grain { fill: light-dark(#6d7179, #7d8087); }
  .slider-plough__blade { fill: light-dark(#373a40, #f1f2f3); }
  .slider-plough__handle { stroke: light-dark(#50535b, #c6c8cd); stroke-width: 2.5; stroke-linecap: round; }
  .slider-plough__grip { fill: light-dark(#50535b, #c6c8cd); }
  .slider-plough__ring { fill: none; stroke: transparent; stroke-width: 2; }
  .slider-plough:has(.slider-plough__input:focus-visible) .slider-plough__ring { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-plough__value { position: absolute; left: 0; right: 0; top: 58px; display: flex; justify-content: space-between; margin: 0; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-plough__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-plough__input { position: absolute; left: 0; top: 0; width: 100%; height: 56px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-plough__input::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 56px; }
  .slider-plough__input::-moz-range-thumb { width: 20px; height: 56px; border: 0; }
`;

export function PloughSlider() {
  const [v, setV] = useState(46);
  const [, setFrame] = useState(0);
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const st = useRef({ x: at(46), vx: 0, heap: 0, acc: 0, raf: 0, grains: [] as Grain[] });

  // Pushing forward piles sand against the blade, more the faster you push; stop and the heap slumps.
  useEffect(() => {
    const q = st.current;
    const goal = at(v);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Object.assign(q, { x: goal, vx: 0, heap: 0, grains: [] });
      setFrame((f) => f + 1);
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      q.vx += (-300 * (q.x - goal) - 30 * q.vx) * dt;
      q.x += q.vx * dt;
      const push = Math.max(0, q.vx);
      q.heap = Math.min(14, q.heap + push * 0.14 * dt) * Math.exp(-dt * (push > 20 ? 0.3 : q.vx < -20 ? 6 : 2.2));
      // Grains spill over the crest and run down the face of the heap.
      q.acc += push * 0.08 * dt;
      while (q.acc >= 1) {
        q.acc -= 1;
        if (q.grains.length < 14) q.grains.push({ x: q.x + 3, y: BED - q.heap, vx: push + 25 + Math.random() * 45, vy: -10 - Math.random() * 25 });
      }
      q.grains = q.grains.filter((g) => {
        g.vy += 300 * dt;
        g.x += g.vx * dt;
        g.y += g.vy * dt;
        return g.y < BED;
      });
      setFrame((f) => f + 1);
      if (Math.abs(q.x - goal) < 0.05 && Math.abs(q.vx) < 0.5 && q.heap < 0.05 && !q.grains.length) {
        Object.assign(q, { x: goal, vx: 0, heap: 0 });
        setFrame((f) => f + 1);
        return;
      }
      q.raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(q.raf);
    q.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(q.raf);
  }, [v]);

  const { x, heap, grains } = st.current;
  // The heap leans against the blade and falls away at roughly the angle sand rests at.
  const len = 6 + heap * 2.4;
  let mound = `M ${x + 2} ${BED}`;
  for (let s = 0; s <= 8; s++) mound += ` L ${(x + 2 + (len * s) / 8).toFixed(2)} ${(BED - heap * (1 - s / 8) ** 1.6).toFixed(2)}`;
  const sand = `${mound} L ${W - 2} ${BED} L ${W - 2} ${BOT} L ${x + 2} ${BOT} Z`;

  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-plough">
        <svg className="slider-plough__svg" aria-hidden="true">
          <defs>
            <pattern id={`${id}p`} patternUnits="userSpaceOnUse" width={5} height={4}>
              <rect className="slider-plough__sand" width={5} height={4} />
              <circle className="slider-plough__grit" cx={1} cy={1} r={0.6} />
              <circle className="slider-plough__grit" cx={3.5} cy={3} r={0.5} />
            </pattern>
          </defs>
          <rect className="slider-plough__floor" x={2} y={CUT} width={Math.max(0, x - 2)} height={BOT - CUT} rx={2} />
          <path className="slider-plough__bed" d={sand} fill={`url(#${id}p)`} />
          {grains.map((g, i) => (
            <circle key={i} className="slider-plough__grain" cx={g.x} cy={g.y} r={1} />
          ))}
          <line className="slider-plough__handle" x1={x} y1={BED - 18} x2={x - 13} y2={BED - 33} />
          <circle className="slider-plough__grip" cx={x - 13} cy={BED - 33} r={3} />
          <rect className="slider-plough__blade" x={x - 2} y={BED - 20} width={4} height={CUT - BED + 20} rx={1.5} />
          <rect className="slider-plough__ring" x={x - 18} y={BED - 40} width={26} height={CUT - BED + 44} rx={6} />
        </svg>
        <p className="slider-plough__value" aria-hidden="true">
          <span>Cleared</span>
          <b>{v}%</b>
        </p>
        <input className="slider-plough__input" type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} aria-label="Cleared" aria-valuetext={`${v}%`} />
      </div>
    </>
  );
}
