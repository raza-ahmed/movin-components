"use client";

import { useEffect, useRef, useState } from 'react';

const W = 240;
const F = 46;
const D = 9;
const X0 = 6;
const X1 = W - 6 - D;
const at = (v: number) => X0 + 6 + (v / 100) * (X1 - X0 - 6);

const css = `
  .slider-extrude { position: relative; width: ${W}px; height: 82px; }
  .slider-extrude__svg { position: absolute; left: 0; top: 0; width: ${W}px; height: 58px; overflow: visible; }
  .slider-extrude__slab-top { fill: light-dark(#ebedf0, #232529); }
  .slider-extrude__slab-front { fill: light-dark(#dbdde1, #2e3035); }
  .slider-extrude__top { fill: light-dark(#373a40, #f1f2f3); }
  .slider-extrude__front { fill: light-dark(#50535b, #c6c8cd); }
  .slider-extrude__end { fill: light-dark(#6d7179, #7d8087); }
  .slider-extrude__ring { fill: none; stroke: transparent; stroke-width: 2; stroke-linejoin: round; }
  .slider-extrude:has(.slider-extrude__input:focus-visible) .slider-extrude__ring { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-extrude__value { position: absolute; left: 0; right: 0; top: 62px; display: flex; justify-content: space-between; margin: 0; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-extrude__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-extrude__input { position: absolute; left: ${X0}px; top: 0; width: ${X1 - X0 + 6}px; height: 58px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-extrude__input::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 58px; }
  .slider-extrude__input::-moz-range-thumb { width: 12px; height: 58px; border: 0; }
`;

export function ExtrudeSlider() {
  const [v, setV] = useState(64);
  const [held, setHeld] = useState(false);
  const [shape, setShape] = useState({ x: at(64), h: 12 });
  const st = useRef({ x: at(64), vx: 0, h: 12, vh: 0, raf: 0 });

  // Length and height each ride a spring; holding the bar pushes the block up taller.
  useEffect(() => {
    const q = st.current;
    const gx = at(v);
    const gh = held ? 22 : 12;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Object.assign(q, { x: gx, h: gh, vx: 0, vh: 0 });
      setShape({ x: gx, h: gh });
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      q.vx += (-240 * (q.x - gx) - 28 * q.vx) * dt;
      q.x += q.vx * dt;
      q.vh += (-300 * (q.h - gh) - 14 * q.vh) * dt;
      q.h += q.vh * dt;
      setShape({ x: q.x, h: q.h });
      if (Math.abs(q.x - gx) + Math.abs(q.h - gh) < 0.05 && Math.abs(q.vx) + Math.abs(q.vh) < 0.5) {
        Object.assign(q, { x: gx, h: gh, vx: 0, vh: 0 });
        setShape({ x: gx, h: gh });
        return;
      }
      q.raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(q.raf);
    q.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(q.raf);
  }, [v, held]);

  const { x, h } = shape;
  const pts = (...p: number[][]) => p.map((q) => q.join(',')).join(' ');

  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-extrude">
        <svg className="slider-extrude__svg" aria-hidden="true">
          {/* The flat track, seen from a little above: a top face and a thin front edge. */}
          <polygon className="slider-extrude__slab-top" points={pts([X0, F], [X1, F], [X1 + D, F - D], [X0 + D, F - D])} />
          <polygon className="slider-extrude__slab-front" points={pts([X0, F], [X1, F], [X1, F + 4], [X0, F + 4])} />
          <polygon className="slider-extrude__slab-front" points={pts([X1, F], [X1 + D, F - D], [X1 + D, F - D + 4], [X1, F + 4])} />
          {/* The filled length rises out of it as a solid block. */}
          <polygon className="slider-extrude__front" points={pts([X0, F - h], [x, F - h], [x, F], [X0, F])} />
          <polygon className="slider-extrude__top" points={pts([X0, F - h], [x, F - h], [x + D, F - D - h], [X0 + D, F - D - h])} />
          <polygon className="slider-extrude__end" points={pts([x, F - h], [x + D, F - D - h], [x + D, F - D], [x, F])} />
          <polygon className="slider-extrude__ring" points={pts([x - 4, F - h - 4], [x + D + 4, F - D - h - 4], [x + D + 4, F - D + 4], [x - 4, F + 4])} />
        </svg>
        <p className="slider-extrude__value" aria-hidden="true">
          <span>Storage</span>
          <b>{v} GB</b>
        </p>
        <input
          className="slider-extrude__input"
          type="range"
          min={0}
          max={100}
          value={v}
          onPointerDown={() => setHeld(true)}
          onPointerUp={() => setHeld(false)}
          onPointerCancel={() => setHeld(false)}
          onChange={(e) => setV(+e.target.value)}
          aria-label="Storage"
          aria-valuetext={`${v} gigabytes`}
        />
      </div>
    </>
  );
}
