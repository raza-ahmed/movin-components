"use client";

import * as React from "react";
import { useState } from 'react';

const STOPS = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];
const BOKEH = [{ x: 22, y: 26, r: 7 }, { x: 64, y: 14, r: 5 }, { x: 96, y: 40, r: 9 }, { x: 30, y: 70, r: 6 }, { x: 84, y: 78, r: 5 }, { x: 54, y: 52, r: 4 }];
// The opening: a hexagon that shrinks and turns as the blades close, cut out of the lens barrel.
function iris(t: number) {
  const r = 40 - t * 30;
  const turn = t * 50;
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = ((i * 60 + turn) * Math.PI) / 180;
    return [56 + Math.cos(a) * r, 56 + Math.sin(a) * r];
  });
  const hole = `M${hex.map((p) => p.map((n) => n.toFixed(1)).join(' ')).join('L')}Z`;
  // Each blade edge runs from a corner of the opening out to the rim, tangent-ish.
  const seams = hex.map(([x, y], i) => {
    const a = ((i * 60 + turn + 70) * Math.PI) / 180;
    return `M${x.toFixed(1)} ${y.toFixed(1)}L${(56 + Math.cos(a) * 52).toFixed(1)} ${(56 + Math.sin(a) * 52).toFixed(1)}`;
  });
  return { hole, seams };
}

const css = `
  .slider-iris { display: grid; justify-items: center; gap: 12px; width: 220px; }
  .slider-iris__lens { position: relative; width: 112px; height: 112px; border-radius: 50%; overflow: hidden; box-shadow: 0 0 0 4px light-dark(#dbdde1, #2e3035), 0 0 0 5px light-dark(#6d7179, #7d8087), 0 12px 22px -12px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7)); }
  /* What the lens sees: soft out-of-focus lights that sharpen as the aperture closes. */
  .slider-iris__view { position: absolute; inset: 0; background: light-dark(#f3f4f7, #1a1c1f); filter: blur(calc((1 - var(--slider-iris-v)) * 4px)); }
  .slider-iris__bokeh { position: absolute; border-radius: 50%; background: light-dark(#50535b, #c6c8cd); opacity: 0.7; }
  .slider-iris__lens svg { position: absolute; inset: 0; width: 100%; height: 100%; }
  .slider-iris__blades { fill: light-dark(#dbdde1, #2e3035); fill-rule: evenodd; }
  .slider-iris__seam { stroke: light-dark(#6d7179, #7d8087); stroke-width: 1; }
  @media (prefers-reduced-motion: reduce) {
    .slider-iris__view { transition: none; }
  }
  .slider-iris__read { color: light-dark(#50535b, #c6c8cd); font-size: 12px; font-variant-numeric: tabular-nums; }
  .slider-iris__read b { color: light-dark(#373a40, #f1f2f3); font-weight: 600; }
  .slider-iris__track { position: relative; width: 100%; height: 24px; }
  .slider-iris__rail { position: absolute; left: 0; right: 0; top: 10px; height: 4px; border-radius: 2px; background: light-dark(#ebedf0, #232529); }
  .slider-iris__fill { position: absolute; left: 0; top: 10px; height: 4px; border-radius: 2px; width: calc(10px + var(--slider-iris-v) * (100% - 20px)); background: light-dark(#50535b, #c6c8cd); }
  .slider-iris__thumb { position: absolute; top: 2px; left: calc(var(--slider-iris-v) * (100% - 20px)); width: 20px; height: 20px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 2px 6px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4)); }
  .slider-iris:has(.slider-iris__input:focus-visible) .slider-iris__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-iris__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-iris__input::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; }
  .slider-iris__input::-moz-range-thumb { width: 20px; height: 20px; border: 0; }
`;

export function IrisSlider() {
  const [v, setV] = useState(2);
  const t = (v - 0) / (7 - 0);
  const { hole, seams } = iris(t);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-iris" style={{ '--slider-iris-v': t } as React.CSSProperties}>
        <div className="slider-iris__lens" aria-hidden="true">
          <span className="slider-iris__view">
            {BOKEH.map((b) => (
              <span key={`${b.x}-${b.y}`} className="slider-iris__bokeh" style={{ left: b.x, top: b.y, width: b.r * 2, height: b.r * 2 }} />
            ))}
          </span>
          <svg viewBox="0 0 112 112">
            <path className="slider-iris__blades" d={`M0 0H112V112H0Z${hole}`} />
            {seams.map((d, i) => (
              <path key={i} className="slider-iris__seam" d={d} />
            ))}
          </svg>
        </div>
        <span className="slider-iris__read" aria-hidden="true">
          <b>f/{STOPS[v]}</b> · {v < 3 ? 'soft background' : v < 6 ? 'balanced' : 'everything sharp'}
        </span>
        <div className="slider-iris__track">
          <span className="slider-iris__rail" />
          <span className="slider-iris__fill" />
          <span className="slider-iris__thumb" />
          <input
            className="slider-iris__input"
            type="range"
            min={0}
            max={7}
            value={v}
            onChange={(e) => setV(+e.target.value)}
            aria-label="Aperture"
            aria-valuetext={`f ${STOPS[v]}`}
          />
        </div>
      </div>
    </>
  );
}
