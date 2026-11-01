"use client";

import { useEffect, useRef, useState } from 'react';

const W = 240;
const MID = 28;
const H = 16;
const SEGS = 22;

const css = `
  .slider-twist { position: relative; width: ${W}px; height: 56px; }
  .slider-twist__svg { display: block; width: ${W}px; height: 56px; overflow: visible; }
  .slider-twist__ink { fill: light-dark(#42454c, #e5e6e9); }
  .slider-twist__paper { fill: light-dark(#dbdde1, #2e3035); }
  .slider-twist__collar {
    fill: light-dark(#373a40, #f1f2f3);
    filter: drop-shadow(0 1px 2px light-dark(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)));
    transform-box: fill-box;
    transform-origin: center;
    transition: transform 0.3s cubic-bezier(0.3, 1.6, 0.5, 1);
  }
  .slider-twist:has(.slider-twist__input:active) .slider-twist__collar { transform: scale(1.15, 1.1); }
  .slider-twist__ring { fill: none; stroke: transparent; stroke-width: 2; }
  .slider-twist:has(.slider-twist__input:focus-visible) .slider-twist__ring { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-twist__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-twist__input::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 56px; }
  .slider-twist__input::-moz-range-thumb { width: 16px; height: 56px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-twist__collar { transition: none; }
  }
`;

/** Follows the value on a spring and reports its speed, which stretches the twist. */
function useSpring(target: number) {
  const [s, setS] = useState({ x: target, v: 0 });
  const st = useRef({ x: target, v: 0, raf: 0 });
  useEffect(() => {
    const q = st.current;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      q.x = target;
      q.v = 0;
      setS({ x: target, v: 0 });
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      q.v += (-300 * (q.x - target) - 30 * q.v) * dt;
      q.x += q.v * dt;
      if (Math.abs(q.x - target) < 0.05 && Math.abs(q.v) < 1) {
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

export function TwistSlider() {
  const [v, setV] = useState(55);
  const { x: p, v: speed } = useSpring(8 + (v / 100) * (W - 16));
  // The twist stretches out behind the direction of travel.
  const stretch = Math.min(46, Math.abs(speed) * 0.09);
  const a = p - 14 - (speed > 0 ? stretch : 0);
  const b = p + 14 + (speed < 0 ? stretch : 0);
  const pinch = (a + b) / 2;
  const segs = Array.from({ length: SEGS }, (_, k) => {
    const clip = (x: number) => Math.min(W, Math.max(0, x));
    const [x0, x1] = [clip(a + ((b - a) * k) / SEGS), clip(a + ((b - a) * (k + 1)) / SEGS)];
    const [t0, t1] = [(Math.PI * k) / SEGS, (Math.PI * (k + 1)) / SEGS];
    const [h0, h1] = [(H / 2) * Math.abs(Math.cos(t0)), (H / 2) * Math.abs(Math.cos(t1))];
    const front = k < SEGS / 2;
    // A face turned away from you catches the light differently, so shade by how far it has turned.
    const turn = Math.round(Math.sin((t0 + t1) / 2) * 55);
    const fill = front ? `color-mix(in oklab, light-dark(#6d7179, #7d8087) ${turn}%, light-dark(#42454c, #e5e6e9))` : `color-mix(in oklab, light-dark(#6d7179, #7d8087) ${Math.round(turn * 0.6)}%, light-dark(#dbdde1, #2e3035))`;
    return (
      <polygon key={k} points={`${x0},${MID - h0} ${x1},${MID - h1} ${x1},${MID + h1} ${x0},${MID + h0}`} style={{ fill, stroke: fill }} strokeWidth={0.5} strokeLinejoin="round" />
    );
  });
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-twist">
        <svg className="slider-twist__svg" aria-hidden="true">
          <rect className="slider-twist__ink" x={0} y={MID - H / 2} width={Math.max(0, a + 0.5)} height={H} rx={4} />
          <rect className="slider-twist__paper" x={b - 0.5} y={MID - H / 2} width={Math.max(0, W - b + 0.5)} height={H} rx={4} />
          {segs}
          <rect className="slider-twist__collar" x={pinch - 3} y={MID - H / 2 - 5} width={6} height={H + 10} rx={3} />
          <rect className="slider-twist__ring" x={pinch - 7} y={MID - H / 2 - 9} width={14} height={H + 18} rx={7} />
        </svg>
        <input className="slider-twist__input" type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} aria-label="Mix" />
      </div>
    </>
  );
}
