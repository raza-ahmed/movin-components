"use client";

import * as React from "react";
import { useEffect, useRef, useState } from 'react';

const W = 240;
const MID = 20;
// Each layer down sits a little lower and follows on a softer spring.
const LAYERS = [
  { k: 110, c: 15, dy: 8, cls: 'slider-strata__layer--deep' },
  { k: 240, c: 22, dy: 4, cls: 'slider-strata__layer--mid' },
];

const css = `
  .slider-strata { position: relative; width: ${W}px; height: 62px; }
  .slider-strata__track { position: absolute; left: 0; top: ${MID - 6}px; width: ${W}px; height: 12px; border-radius: 6px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529); }
  .slider-strata__layer {
    position: absolute;
    left: 0;
    height: 12px;
    border-radius: 6px;
    box-shadow: 0 1px 2px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.45));
  }
  .slider-strata__layer--deep { background: light-dark(#cbced3, #393c41); }
  .slider-strata__layer--mid { background: light-dark(#5f626a, #a7abb2); }
  .slider-strata__layer--top { background: light-dark(#42454c, #e5e6e9); }
  .slider-strata__thumb {
    position: absolute;
    top: ${MID - 13}px;
    left: calc(var(--slider-strata-x) - 3px);
    width: 6px;
    height: 26px;
    border-radius: 3px;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 1px 3px light-dark(rgba(0, 0, 0, 0.22), rgba(0, 0, 0, 0.55));
    transition: transform 0.3s cubic-bezier(0.3, 1.6, 0.5, 1);
  }
  .slider-strata:has(.slider-strata__input:active) .slider-strata__thumb { transform: scaleY(1.15); }
  .slider-strata:has(.slider-strata__input:focus-visible) .slider-strata__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-strata__value { position: absolute; left: 0; right: 0; top: 44px; display: flex; justify-content: space-between; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-strata__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-strata__input { position: absolute; left: 0; top: 0; width: 100%; height: 44px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-strata__input::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 44px; }
  .slider-strata__input::-moz-range-thumb { width: 12px; height: 44px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-strata__thumb { transition: none; }
  }
`;

/** The lower layers chase the top one, each on its own spring, so a drag fans their ends apart. */
function useLayers(target: number) {
  const [xs, setXs] = useState(() => LAYERS.map(() => target));
  const st = useRef({ x: LAYERS.map(() => target), v: LAYERS.map(() => 0), raf: 0 });
  useEffect(() => {
    const q = st.current;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      q.x = LAYERS.map(() => target);
      q.v = LAYERS.map(() => 0);
      setXs(q.x);
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      LAYERS.forEach((l, i) => {
        q.v[i] += (-l.k * (q.x[i] - target) - l.c * q.v[i]) * dt;
        q.x[i] += q.v[i] * dt;
      });
      if (q.x.every((x, i) => Math.abs(x - target) < 0.05 && Math.abs(q.v[i]) < 0.5)) {
        q.x = LAYERS.map(() => target);
        q.v = LAYERS.map(() => 0);
        setXs(q.x);
        return;
      }
      setXs([...q.x]);
      q.raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(q.raf);
    q.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(q.raf);
  }, [target]);
  return xs;
}

export function StrataSlider() {
  const [v, setV] = useState(58);
  const x = 6 + (v / 100) * (W - 12);
  const xs = useLayers(x);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-strata" style={{ '--slider-strata-x': `${x}px` } as React.CSSProperties}>
        <span className="slider-strata__track" aria-hidden="true" />
        {LAYERS.map((l, i) => (
          <span key={l.cls} className={`slider-strata__layer ${l.cls}`} style={{ top: MID - 6 + l.dy, width: Math.max(12, xs[i] + 3) }} aria-hidden="true" />
        ))}
        <span className="slider-strata__layer slider-strata__layer--top" style={{ top: MID - 6, width: Math.max(12, x + 3) }} aria-hidden="true" />
        <span className="slider-strata__thumb" aria-hidden="true" />
        <p className="slider-strata__value" aria-hidden="true">
          <span>Depth</span>
          <b>{v}%</b>
        </p>
        <input className="slider-strata__input" type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} aria-label="Depth" aria-valuetext={`${v}%`} />
      </div>
    </>
  );
}
