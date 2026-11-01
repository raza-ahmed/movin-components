"use client";

import * as React from "react";
import { useEffect, useRef, useState } from 'react';

const W = 240;
const T = 22;
const MID = 22;

const css = `
  .slider-foil {
    position: relative;
    width: ${W}px;
    height: 62px;
    --slider-foil-hl: light-dark(#fbfcfd, #f1f2f3);
  }
  .slider-foil__track, .slider-foil__fill { position: absolute; left: 0; top: ${MID - 6}px; height: 12px; border-radius: 6px; }
  .slider-foil__track { width: ${W}px; background: light-dark(#ebedf0, #232529); box-shadow: inset 0 1px 2px light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.45)); }
  .slider-foil__fill {
    width: calc(var(--slider-foil-x) + ${T / 2}px);
    overflow: hidden;
    /* Brushed: fine lines along the strip over a soft fall-off from top to bottom. */
    background:
      repeating-linear-gradient(180deg, color-mix(in oklab, var(--slider-foil-hl) 14%, transparent) 0 1px, transparent 1px 2px),
      linear-gradient(180deg, light-dark(#5f626a, #a7abb2), light-dark(#50535b, #c6c8cd) 45%, light-dark(#6d7179, #7d8087));
    box-shadow: inset 0 0 0 0.5px color-mix(in oklab, var(--slider-foil-hl) 25%, transparent);
  }
  .slider-foil__sheen {
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(var(--slider-foil-sheen) - 36px);
    width: 72px;
    background: linear-gradient(90deg, transparent, color-mix(in oklab, var(--slider-foil-hl) 70%, transparent) 46%, color-mix(in oklab, var(--slider-foil-hl) 85%, transparent) 50%, color-mix(in oklab, var(--slider-foil-hl) 70%, transparent) 54%, transparent);
    opacity: 0.75;
    transition: opacity 0.25s;
  }
  .slider-foil:has(.slider-foil__input:active) .slider-foil__sheen { opacity: 1; }
  .slider-foil__thumb {
    position: absolute;
    top: ${MID - T / 2}px;
    left: calc(var(--slider-foil-x) - ${T / 2}px);
    width: ${T}px;
    height: ${T}px;
    border-radius: 50%;
    background:
      radial-gradient(circle at calc(38% + var(--slider-foil-tilt) * 1%) 30%, var(--slider-foil-hl) 0 12%, transparent 34%),
      radial-gradient(circle at 50% 120%, color-mix(in oklab, var(--slider-foil-hl) 35%, transparent), transparent 55%),
      linear-gradient(180deg, light-dark(#50535b, #c6c8cd), light-dark(#6d7179, #7d8087));
    box-shadow: 0 1px 1px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.5)), 0 4px 10px light-dark(rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.45)), inset 0 0 0 0.5px color-mix(in oklab, var(--slider-foil-hl) 40%, transparent);
  }
  .slider-foil:has(.slider-foil__input:focus-visible) .slider-foil__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-foil__value { position: absolute; left: 0; right: 0; top: 44px; display: flex; justify-content: space-between; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-foil__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-foil__input { position: absolute; left: 0; top: 0; width: 100%; height: 44px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-foil__input::-webkit-slider-thumb { -webkit-appearance: none; width: ${T}px; height: 44px; }
  .slider-foil__input::-moz-range-thumb { width: ${T}px; height: 44px; border: 0; }
`;

/**
 * The sheen lags the thumb on a loose spring, and the lag is how far the foil has "tilted":
 * drag and the light slides back across the metal, then catches up as you stop.
 */
function useSheen(target: number) {
  const [s, setS] = useState({ x: target, v: 0 });
  const st = useRef({ x: target, v: 0, raf: 0 });
  useEffect(() => {
    const q = st.current;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      q.x = target;
      setS({ x: target, v: 0 });
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      q.v += (-70 * (q.x - target) - 13 * q.v) * dt;
      q.x += q.v * dt;
      if (Math.abs(q.x - target) < 0.05 && Math.abs(q.v) < 0.5) {
        q.x = target;
        q.v = 0;
        setS({ x: target, v: 0 });
        return;
      }
      setS({ x: q.x, v: q.v });
      q.raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(q.raf);
    q.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(q.raf);
  }, [target]);
  return s;
}

export function FoilSlider() {
  const [v, setV] = useState(62);
  const x = T / 2 + (v / 100) * (W - T);
  const sheen = useSheen(x);
  // At rest the light sits two thirds of the way along the fill.
  const at = sheen.x * 0.66 + 6 - sheen.v * 0.05;
  const tilt = Math.max(-18, Math.min(18, -sheen.v * 0.06));
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-foil" style={{ '--slider-foil-x': `${x}px`, '--slider-foil-sheen': `${at}px`, '--slider-foil-tilt': tilt.toFixed(2) } as React.CSSProperties}>
        <span className="slider-foil__track" aria-hidden="true" />
        <span className="slider-foil__fill" aria-hidden="true">
          <span className="slider-foil__sheen" />
        </span>
        <span className="slider-foil__thumb" aria-hidden="true" />
        <p className="slider-foil__value" aria-hidden="true">
          <span>Brightness</span>
          <b>{v}%</b>
        </p>
        <input className="slider-foil__input" type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} aria-label="Brightness" aria-valuetext={`${v}%`} />
      </div>
    </>
  );
}
