"use client";

import { useEffect, useRef, useState } from 'react';

const W = 240;
const MID = 16;
const RX = 17;
const RY = 8.5;
const pos = (v: number) => RX + 4 + ((v + 50) / 100) * (W - 2 * RX - 8);

const css = `
  .slider-vial { position: relative; width: ${W}px; height: 58px; }
  .slider-vial__svg { display: block; width: ${W}px; height: 32px; overflow: visible; }
  .slider-vial__tube { stroke: light-dark(#cbced3, #393c41); stroke-width: 1; }
  .slider-vial__top { stop-color: light-dark(#ebedf0, #232529); }
  .slider-vial__bottom { stop-color: light-dark(#dbdde1, #2e3035); }
  .slider-vial__glint { stroke: light-dark(#fbfcfd, #7d8087); stroke-width: 1.5; stroke-linecap: round; opacity: 0.5; }
  .slider-vial__mark { stroke: light-dark(#5f626a, #a7abb2); stroke-width: 1; }
  .slider-vial__tick { stroke: light-dark(#cbced3, #393c41); stroke-width: 1; }
  .slider-vial__bubble { fill: light-dark(light-dark(#fbfcfd, #121417), color-mix(in oklab, light-dark(#5f626a, #a7abb2) 55%, light-dark(#dbdde1, #2e3035))); stroke: light-dark(#5f626a, #a7abb2); stroke-width: 0.8; }
  .slider-vial__shine { fill: light-dark(#fbfcfd, #c6c8cd); opacity: 0.75; }
  .slider-vial__ring { fill: none; stroke: transparent; stroke-width: 2; }
  .slider-vial:has(.slider-vial__input:focus-visible) .slider-vial__ring { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-vial__scale { position: absolute; top: 40px; left: 0; right: 0; display: flex; justify-content: space-between; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-vial__value { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-vial__input { position: absolute; left: 0; top: 0; width: 100%; height: 32px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-vial__input::-webkit-slider-thumb { -webkit-appearance: none; width: ${2 * RX + 8}px; height: 32px; }
  .slider-vial__input::-moz-range-thumb { width: ${2 * RX + 8}px; height: 32px; border: 0; }
`;

/**
 * The bubble trails the value on one spring, and its stretch rides a second, looser one,
 * so it lengthens while it travels and wobbles round and long again as it stops.
 */
function useBubble(target: number) {
  const [s, setS] = useState({ x: target, stretch: 0 });
  const st = useRef({ x: target, v: 0, s: 0, sv: 0, raf: 0 });
  useEffect(() => {
    const q = st.current;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Object.assign(q, { x: target, v: 0, s: 0, sv: 0 });
      setS({ x: target, stretch: 0 });
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      q.v += (-180 * (q.x - target) - 22 * q.v) * dt;
      q.x += q.v * dt;
      q.sv += (-520 * (q.s - Math.min(12, Math.abs(q.v) * 0.035)) - 9 * q.sv) * dt;
      q.s += q.sv * dt;
      if (Math.abs(q.x - target) < 0.05 && Math.abs(q.v) < 1 && Math.abs(q.s) < 0.05 && Math.abs(q.sv) < 0.5) {
        Object.assign(q, { x: target, v: 0, s: 0, sv: 0 });
        setS({ x: target, stretch: 0 });
        return;
      }
      setS({ x: q.x, stretch: q.s });
      q.raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(q.raf);
    q.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(q.raf);
  }, [target]);
  return s;
}

export function VialSlider() {
  const [v, setV] = useState(-18);
  const dragging = useRef(false);
  const { x, stretch } = useBubble(pos(v));
  const rx = RX + stretch;
  const ry = Math.max(5.5, RY - stretch * 0.36);
  const C = pos(0);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-vial">
        <svg className="slider-vial__svg" aria-hidden="true">
          <defs>
            <linearGradient id="slider-vial-liquid" x1="0" y1="0" x2="0" y2="1">
              <stop className="slider-vial__top" offset="0" />
              <stop className="slider-vial__bottom" offset="1" />
            </linearGradient>
          </defs>
          <rect className="slider-vial__tube" x={0.5} y={MID - 12} width={W - 1} height={24} rx={12} fill="url(#slider-vial-liquid)" />
          {[-0.5, -0.25, 0.25, 0.5].map((f) => (
            <line key={f} className="slider-vial__tick" x1={C + f * (W - 2 * RX - 8)} x2={C + f * (W - 2 * RX - 8)} y1={MID - 4} y2={MID + 4} />
          ))}
          <ellipse className="slider-vial__bubble" cx={x} cy={MID} rx={rx} ry={ry} />
          <ellipse className="slider-vial__shine" cx={x - rx * 0.12} cy={MID - ry * 0.5} rx={rx * 0.55} ry={1.4} />
          {/* The two centre lines sit over the bubble, etched into the glass. */}
          <line className="slider-vial__mark" x1={C - RX - 3} x2={C - RX - 3} y1={MID - 12} y2={MID + 12} />
          <line className="slider-vial__mark" x1={C + RX + 3} x2={C + RX + 3} y1={MID - 12} y2={MID + 12} />
          <line className="slider-vial__glint" x1={14} x2={W - 14} y1={MID - 8} y2={MID - 8} />
          <rect className="slider-vial__ring" x={x - rx - 5} y={MID - 15} width={2 * rx + 10} height={30} rx={15} />
        </svg>
        <div className="slider-vial__scale" aria-hidden="true">
          <span>L</span>
          <span className="slider-vial__value">{v === 0 ? 'Centre' : `${v < 0 ? 'L' : 'R'} ${Math.abs(v)}`}</span>
          <span>R</span>
        </div>
        <input
          className="slider-vial__input"
          type="range"
          min={-50}
          max={50}
          value={v}
          onPointerDown={() => (dragging.current = true)}
          onPointerUp={() => (dragging.current = false)}
          onChange={(e) => {
            const n = +e.target.value;
            // A drag settles into the centre when it comes close; arrow keys still step through it.
            setV(dragging.current && Math.abs(n) <= 2 ? 0 : n);
          }}
          aria-label="Balance"
          aria-valuetext={v === 0 ? 'Centre' : `${Math.abs(v)} ${v < 0 ? 'left' : 'right'}`}
        />
      </div>
    </>
  );
}
