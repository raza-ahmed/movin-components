"use client";

import { useEffect, useRef, useState } from 'react';

const W = 240;
const MID = 28;
const H = 9;
const FOLDS = 10;
const FACE = 26;

const css = `
  .slider-pleat { position: relative; width: ${W}px; height: 56px; }
  .slider-pleat__svg { display: block; width: ${W}px; height: 56px; overflow: visible; }
  .slider-pleat__flat { fill: light-dark(#42454c, #e5e6e9); }
  .slider-pleat__tab {
    fill: light-dark(#373a40, #f1f2f3);
    filter: drop-shadow(0 2px 3px light-dark(rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0.5)));
    transform-box: fill-box;
    transform-origin: center;
    transition: transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1);
  }
  .slider-pleat:has(.slider-pleat__input:active) .slider-pleat__tab { transform: scale(1.12, 1.08); }
  .slider-pleat__ring { fill: none; stroke: transparent; stroke-width: 2; }
  .slider-pleat:has(.slider-pleat__input:focus-visible) .slider-pleat__ring { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-pleat__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-pleat__input::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 56px; }
  .slider-pleat__input::-moz-range-thumb { width: 16px; height: 56px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-pleat__tab { transition: none; }
  }
`;

/** Follows the value on a soft spring, so a click far along the track folds the ribbon up rather than jumping. */
function useSpring(target: number) {
  const [x, setX] = useState(target);
  const s = useRef({ x: target, v: 0, raf: 0 });
  useEffect(() => {
    const st = s.current;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      st.x = target;
      setX(target);
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      st.v += (-260 * (st.x - target) - 24 * st.v) * dt;
      st.x += st.v * dt;
      if (Math.abs(st.x - target) < 0.02 && Math.abs(st.v) < 0.05) {
        st.x = target;
        st.v = 0;
        setX(target);
        return;
      }
      setX(st.x);
      st.raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(st.raf);
    st.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(st.raf);
  }, [target]);
  return x;
}

export function PleatSlider() {
  const [v, setV] = useState(30);
  const shown = useSpring(v);
  const t = 8 + (shown / 100) * (W - 16);
  const w = (W - t) / FOLDS;
  // How tightly packed the folds are: 0 lies flat, 1 is a closed stack.
  const c = Math.sqrt(Math.max(0, 1 - (w / FACE) ** 2));
  // Ridges stand proud of the ribbon, valleys sink into it; both deepen as the folds pack.
  const half = (k: number) => (k % 2 ? H + 4 * c : H - c);
  const faces = Array.from({ length: FOLDS }, (_, k) => {
    const [x0, x1, h0, h1] = [t + k * w, t + (k + 1) * w, half(k), half(k + 1)];
    // Faces turned to the light and away from it, never so dark they drop into the page.
    const fill =
      k % 2
        ? `color-mix(in oklab, light-dark(#ebedf0, #232529) ${Math.round(40 + c * 60)}%, light-dark(#dbdde1, #2e3035))`
        : `color-mix(in oklab, light-dark(#6d7179, #7d8087) ${Math.round(14 + c * 40)}%, light-dark(#dbdde1, #2e3035))`;
    return (
      <polygon
        key={k}
        points={`${x0},${MID - h0} ${x1},${MID - h1} ${x1},${MID + h1} ${x0},${MID + h0}`}
        style={{ fill, stroke: fill }}
        strokeWidth={0.6}
        strokeLinejoin="round"
      />
    );
  });
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-pleat">
        <svg className="slider-pleat__svg" aria-hidden="true">
          <path className="slider-pleat__flat" d={`M5 ${MID - H}H${t}V${MID + H}H5a5 5 0 0 1-5-5V${MID - H + 5} a5 5 0 0 1 5-5Z`} />
          {faces}
          <rect className="slider-pleat__tab" x={t - 4} y={MID - 16} width={8} height={32} rx={4} />
          <rect className="slider-pleat__ring" x={t - 8} y={MID - 20} width={16} height={40} rx={8} />
        </svg>
        <input
          className="slider-pleat__input"
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => setV(+e.target.value)}
          aria-label="Length"
        />
      </div>
    </>
  );
}
