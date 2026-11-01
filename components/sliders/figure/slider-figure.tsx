"use client";

import { useEffect, useRef, useState } from 'react';

const W = 240;

const css = `
  .slider-figure { position: relative; width: ${W}px; height: 56px; }
  .slider-figure__row { display: flex; align-items: center; gap: 8px; height: 56px; }
  .slider-figure__done, .slider-figure__left { flex-basis: 0; flex-shrink: 1; border-radius: 1px; }
  .slider-figure__done { height: 2px; background: light-dark(#42454c, #e5e6e9); }
  .slider-figure__left { height: 1px; background: light-dark(#cbced3, #393c41); }
  .slider-figure__num {
    display: flex;
    align-items: flex-start;
    color: light-dark(#373a40, #f1f2f3);
    font-size: 28px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
    transition: scale 0.3s cubic-bezier(0.3, 1.6, 0.5, 1);
  }
  .slider-figure__unit { margin: 2px 0 0 1px; color: light-dark(#5f626a, #a7abb2); font-size: 13px; font-weight: 500; letter-spacing: 0; }
  .slider-figure:has(.slider-figure__input:active) .slider-figure__num { scale: 1.08; }
  .slider-figure:has(.slider-figure__input:focus-visible) .slider-figure__num { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 5px; border-radius: 4px; }
  .slider-figure__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-figure__input::-webkit-slider-thumb { -webkit-appearance: none; width: 64px; height: 56px; }
  .slider-figure__input::-moz-range-thumb { width: 64px; height: 56px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-figure__num { transition: none; }
  }
`;

/**
 * Tracks how fast the value is moving. An underdamped spring chases it, and its speed
 * is the lean: it builds while you drag, and swings past upright once before settling.
 */
function useLean(target: number) {
  const [lean, setLean] = useState(0);
  const s = useRef({ x: target, v: 0, raf: 0 });
  useEffect(() => {
    const st = s.current;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      st.x = target;
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      st.v += (-260 * (st.x - target) - 14 * st.v) * dt;
      st.x += st.v * dt;
      if (Math.abs(st.x - target) < 0.01 && Math.abs(st.v) < 0.5) {
        st.x = target;
        st.v = 0;
        setLean(0);
        return;
      }
      setLean(Math.max(-16, Math.min(16, st.v * 0.09)));
      st.raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(st.raf);
    st.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(st.raf);
  }, [target]);
  return lean;
}

export function FigureSlider() {
  const [v, setV] = useState(64);
  const lean = useLean(v);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-figure">
        <div className="slider-figure__row" aria-hidden="true">
          <span className="slider-figure__done" style={{ flexGrow: v }} />
          {/* Leans forward like italic type into the direction of the drag. */}
          <span className="slider-figure__num" style={{ transform: `skewX(${-lean}deg)` }}>
            {v}
            <span className="slider-figure__unit">%</span>
          </span>
          <span className="slider-figure__left" style={{ flexGrow: 100 - v }} />
        </div>
        <input className="slider-figure__input" type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} aria-label="Opacity" aria-valuetext={`${v}%`} />
      </div>
    </>
  );
}
