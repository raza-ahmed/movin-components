"use client";

import * as React from "react";
import { useEffect, useRef, useState } from 'react';

const W = 240;
const T = 18;
const MID = 20;
const FLASH = 38;

const css = `
  .slider-strobe { position: relative; width: ${W}px; height: 62px; }
  .slider-strobe__track, .slider-strobe__fill { position: absolute; left: 0; top: ${MID - 2}px; height: 4px; border-radius: 2px; }
  .slider-strobe__track { width: ${W}px; background: light-dark(#dbdde1, #2e3035); }
  .slider-strobe__fill { width: var(--slider-strobe-x); background: light-dark(#42454c, #e5e6e9); }
  .slider-strobe__thumb, .slider-strobe__ghost {
    position: absolute;
    top: ${MID - T / 2}px;
    width: ${T}px;
    height: ${T}px;
    margin-left: ${-T / 2}px;
    border-radius: 50%;
  }
  .slider-strobe__thumb {
    left: var(--slider-strobe-x);
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 1px 3px light-dark(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5));
  }
  .slider-strobe:has(.slider-strobe__input:focus-visible) .slider-strobe__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-strobe__ghost {
    border: 1.5px solid light-dark(#50535b, #c6c8cd);
    animation: slider-strobe-fade 0.55s cubic-bezier(0.3, 0, 0.6, 1) forwards;
  }
  @keyframes slider-strobe-fade {
    from { opacity: 0.75; transform: scale(1); }
    to { opacity: 0; transform: scale(0.55); }
  }
  .slider-strobe__value { position: absolute; left: 0; right: 0; top: 44px; display: flex; justify-content: space-between; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-strobe__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-strobe__input { position: absolute; left: 0; top: 0; width: 100%; height: 40px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-strobe__input::-webkit-slider-thumb { -webkit-appearance: none; width: ${T}px; height: 40px; }
  .slider-strobe__input::-moz-range-thumb { width: ${T}px; height: 40px; border: 0; }
`;

type Ghost = { id: number; x: number };

export function StrobeSlider() {
  const [v, setV] = useState(36);
  const target = T / 2 + (v / 100) * (W - T);
  const [x, setX] = useState(target);
  const [ghosts, setGhosts] = useState<Ghost[]>([]);
  const st = useRef({ x: target, v: 0, raf: 0, flash: 0, at: target, id: 0 });

  // The thumb runs on a spring; every few frames, like a strobe firing, it leaves a copy where it was.
  useEffect(() => {
    const q = st.current;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      q.x = target;
      setX(target);
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      q.v += (-170 * (q.x - target) - 24 * q.v) * dt;
      q.x += q.v * dt;
      if (now - q.flash > FLASH && Math.abs(q.x - q.at) > 3) {
        q.flash = now;
        q.at = q.x;
        const g = { id: ++q.id, x: q.x };
        setGhosts((gs) => [...gs, g]);
      }
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
  }, [target]);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-strobe" style={{ '--slider-strobe-x': `${x}px` } as React.CSSProperties}>
        <span className="slider-strobe__track" aria-hidden="true" />
        <span className="slider-strobe__fill" aria-hidden="true" />
        {ghosts.map((g) => (
          <span key={g.id} className="slider-strobe__ghost" style={{ left: g.x }} onAnimationEnd={() => setGhosts((gs) => gs.filter((o) => o.id !== g.id))} aria-hidden="true" />
        ))}
        <span className="slider-strobe__thumb" aria-hidden="true" />
        <p className="slider-strobe__value" aria-hidden="true">
          <span>Speed</span>
          <b>{v}%</b>
        </p>
        <input className="slider-strobe__input" type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} aria-label="Speed" aria-valuetext={`${v}%`} />
      </div>
    </>
  );
}
